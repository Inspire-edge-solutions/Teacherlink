import mysql from 'mysql2/promise';
import AWS from 'aws-sdk';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Firebase Admin helper: fetch service account from S3 and return auth instance.
// Ensure your Lambda role has permission for s3:GetObject on the specified S3 object.
async function getFirebaseAuth() {
  const s3 = new AWS.S3();
  const bucketName = process.env.FIREBASE_BUCKET || 'teacherlink-deployments-ap-south-1';
  const key = process.env.FIREBASE_KEY || 'developement/firebase.json';

  const params = { Bucket: bucketName, Key: key };
  const response = await s3.getObject(params).promise();
  const serviceAccount = JSON.parse(response.Body.toString('utf-8'));

  let app;
  if (!getApps().length) {
    app = initializeApp({
      credential: cert(serviceAccount)
    });
  } else {
    app = getApps()[0];
  }
  return getAuth(app);
}

const connectionConfig = {
  host: process.env.DB_HOST || 'inspire-edge-db.cnawwwkeyq7q.ap-south-1.rds.amazonaws.com',
  user: process.env.DB_USER || 'teacherlink_user',
  password: process.env.DB_PASSWORD || 'Inspireedge2024',
  database: process.env.DB_DATABASE || 'teacherlink',
};

export const handler = async (event) => {
  console.log("Incoming event:", event);
  const { httpMethod, path, body, queryStringParameters } = event;

  try {
    if (httpMethod === "GET" && path.endsWith("/login")) {
      return await getUsers(queryStringParameters);
    } else if (httpMethod === "POST" && path.endsWith("/login")) {
      return await createUsers(body);
    } else if (httpMethod === "PUT" && path.endsWith("/login")) {
      return await updateUsers(body);
    } else if (httpMethod === "DELETE" && path.endsWith("/login")) {
      return await deleteUsers(body);
    } else {
      return {
        statusCode: 405,
        headers: corsHeaders(),
        body: JSON.stringify({ message: "Method Not Allowed" }),
      };
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        message: "Internal Server Error",
        error: error.message
      }),
    };
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
  };
}

/* ---------------------------------------
   CREATE Users (POST /login)
---------------------------------------*/
const createUsers = async (body) => {
  console.log("createUsers body:", body);
  const connection = await mysql.createConnection(connectionConfig);
  try {
    let users = JSON.parse(body);
    if (!Array.isArray(users)) {
      users = [users];
    }

    // For each user, check that firebase_uid exists and email uniqueness.
    for (const u of users) {
      const { firebase_uid, email } = u;
      if (!firebase_uid) {
        await connection.end();
        return {
          statusCode: 400,
          headers: corsHeaders(),
          body: JSON.stringify({ message: "Missing firebase_uid" }),
        };
      }
      // Check if a user with this firebase_uid already exists.
      const [existingUid] = await connection.execute(
        "SELECT firebase_uid FROM users WHERE firebase_uid = ?",
        [firebase_uid]
      );
      if (existingUid.length > 0) {
        await connection.end();
        return {
          statusCode: 400,
          headers: corsHeaders(),
          body: JSON.stringify({
            message: `User with firebase_uid '${firebase_uid}' already exists.`
          }),
        };
      }
      // Check if the email is already used by any user.
      if (email) {
        const [existingEmail] = await connection.execute(
          "SELECT firebase_uid FROM users WHERE email = ?",
          [email]
        );
        if (existingEmail.length > 0) {
          await connection.end();
          return {
            statusCode: 400,
            headers: corsHeaders(),
            body: JSON.stringify({ message: "Email already in use" }),
          };
        }
      }
    }

    // Build insertion values.
    const now = new Date();
    const values = users.map((u) => {
      const { firebase_uid, fullName, email, callingNumber, name, phone_number, is_google_account } = u;
      return [
        firebase_uid || null,
        fullName || name || "",
        email || "",
        callingNumber || phone_number || "",
        now,
        now,
        1,
        "system",
        "system",
        "user",
        is_google_account || false
      ];
    });

    const query = `
      INSERT INTO users 
      (firebase_uid, name, email, phone_number, created_at, updated_at, is_active, created_by, updated_by, user_type, is_google_account)
      VALUES ?
    `;
    await connection.query(query, [values]);
    await connection.end();

    return {
      statusCode: 201,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Users created successfully" }),
    };
  } catch (error) {
    console.error("Error in createUsers:", error);
    await connection.end();
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        message: "Internal Server Error",
        error: error.message
      }),
    };
  }
};

/* ---------------------------------------
   GET Users (GET /login)
---------------------------------------*/
const getUsers = async (queryStringParameters) => {
  console.log("getUsers queryStringParameters:", queryStringParameters);
  const connection = await mysql.createConnection(connectionConfig);
  try {
    let query, params;
    if (queryStringParameters && queryStringParameters.firebase_uid) {
      query = "SELECT * FROM users WHERE firebase_uid = ?";
      params = [queryStringParameters.firebase_uid];
    } else {
      query = "SELECT * FROM users";
      params = [];
    }
    console.log("Executing SQL:", query, "with params:", params);
    const [results] = await connection.execute(query, params);
    await connection.end();
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error("Error in getUsers:", error);
    await connection.end();
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        message: "Internal Server Error",
        error: error.message
      }),
    };
  }
};

/* ---------------------------------------
   UPDATE Users (PUT /login)
---------------------------------------*/
const updateUsers = async (body) => {
  console.log("updateUsers body:", body);
  const connection = await mysql.createConnection(connectionConfig);
  try {
    let userObj = JSON.parse(body);
    const { firebase_uid, email } = userObj;
    const fullName = userObj.fullName || userObj.name;
    const callingNumber = userObj.callingNumber || userObj.phone_number;
    const isGoogleAccount = userObj.is_google_account || false;

    if (!firebase_uid) {
      await connection.end();
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ message: "Missing firebase_uid" }),
      };
    }

    // 1) Check if user with firebase_uid exists.
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE firebase_uid = ?",
      [firebase_uid]
    );
    if (rows.length === 0) {
      // If user doesn't exist, create the user first, then update Firebase.
      console.log("User not found; creating user first.");
      await connection.end();
      const createResponse = await createUsers(body);
      try {
        if (email) {
          const firebaseAuth = await getFirebaseAuth();
          await firebaseAuth.updateUser(firebase_uid, { email: email });
          console.log("Firebase email updated successfully");
        }
      } catch (firebaseError) {
        console.error("Error updating Firebase email:", firebaseError);
      }
      return createResponse;
    }

    // 2) If the email is changing, check if it's already used by another user.
    if (email && email !== rows[0].email) {
      const [existingEmail] = await connection.execute(
        "SELECT firebase_uid FROM users WHERE email = ? AND firebase_uid <> ?",
        [email, firebase_uid]
      );
      if (existingEmail.length > 0) {
        await connection.end();
        return {
          statusCode: 400,
          headers: corsHeaders(),
          body: JSON.stringify({ message: "Email already in use" }),
        };
      }
    }

    // 3) Update the user's details in the DB.
    const now = new Date();
    const query = `
      UPDATE users
      SET name = ?,
          email = ?,
          phone_number = ?,
          is_google_account = ?,
          updated_at = ?,
          updated_by = ?
      WHERE firebase_uid = ?
    `;
    const queryParams = [
      fullName || "",
      email || "",
      callingNumber || "",
      isGoogleAccount,
      now,
      "system",
      firebase_uid
    ];
    const [updateResult] = await connection.execute(query, queryParams);
    console.log("Update result:", updateResult);
    await connection.end();

    // 4) Update Firebase Authentication with the new email.
    try {
      if (email) {
        const firebaseAuth = await getFirebaseAuth();
        await firebaseAuth.updateUser(firebase_uid, { email: email });
        console.log("Firebase email updated successfully");
      }
    } catch (firebaseError) {
      console.error("Error updating Firebase email:", firebaseError);
    }

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "User updated successfully" }),
    };
  } catch (error) {
    console.error("Error in updateUsers:", error);
    await connection.end();
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
    };
  }
};

/* ---------------------------------------
   DELETE Users (DELETE /login)
---------------------------------------*/
const deleteUsers = async (body) => {
  console.log("deleteUsers body:", body);
  const connection = await mysql.createConnection(connectionConfig);
  try {
    const firebaseUids = JSON.parse(body);
    const query = "DELETE FROM users WHERE firebase_uid IN (?)";
    await connection.execute(query, [firebaseUids]);
    await connection.end();
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Users deleted successfully" }),
    };
  } catch (error) {
    console.error("Error in deleteUsers:", error);
    await connection.end();
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
    };
  }
};
