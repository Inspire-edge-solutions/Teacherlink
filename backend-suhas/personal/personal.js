import { pool } from './db.js'; // Your MySQL pool/connection

export const handler = async (event) => {
  console.log("Incoming event:", event);
  const { httpMethod, path, body, queryStringParameters } = event;

  try {
    // ----- OTP Routes (Email) -----
    if (httpMethod === "POST" && path.endsWith("/otp/create")) {
      return await createEmailOtp(body);
    }
    if (httpMethod === "POST" && path.endsWith("/otp/verify")) {
      return await verifyEmailOtp(body);
    }

    // ----- Personal CRUD Routes -----
    if (httpMethod === "GET" && path.endsWith("/personal")) {
      return await getUsers(queryStringParameters);
    } else if (httpMethod === "POST" && path.endsWith("/personal")) {
      return await createUsers(body);
    } else if (httpMethod === "PUT" && path.endsWith("/personal")) {
      return await updateUsers(body);
    } else if (httpMethod === "DELETE" && path.endsWith("/personal")) {
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
   CREATE Users (POST /personal)
---------------------------------------*/
const createUsers = async (body) => {
  console.log("createUsers body:", body);
  const connection = await pool.getConnection();

  try {
    let users = JSON.parse(body);
    if (!Array.isArray(users)) {
      users = [users];
    }

    // 1) For each user, ensure firebase_uid does NOT already exist.
    for (const u of users) {
      const { firebase_uid } = u;
      if (!firebase_uid) {
        connection.release();
        return {
          statusCode: 400,
          headers: corsHeaders(),
          body: JSON.stringify({ message: "Missing firebase_uid" }),
        };
      }

      const [existing] = await connection.query(
        "SELECT id FROM UserDetails WHERE firebase_uid = ?",
        [firebase_uid]
      );
      if (existing.length > 0) {
        connection.release();
        return {
          statusCode: 400,
          headers: corsHeaders(),
          body: JSON.stringify({
            message: `User with firebase_uid='${firebase_uid}' already exists. Not accepting.`
          }),
        };
      }
    }

    // 2) Build insertion values, respecting emailVerified flag
    const values = users.map((u) => {
      const {
        firebase_uid,
        fullName,
        email,
        gender,
        dateOfBirth,
        callingNumber,
        whatsappNumber,
        emailVerified // If true => set email_verify=1, verified_at=Now
      } = u;

      const isEmailVerified = (emailVerified === true) ? 1 : 0;
      const verifiedAt = (emailVerified === true) ? new Date() : null;

      return [
        firebase_uid || null,
        fullName || "",
        email || "",
        gender || "",
        dateOfBirth || null,
        callingNumber || "",
        whatsappNumber || "",
        isEmailVerified, // 1 if verified, else 0
        verifiedAt       // current time if verified, else null
      ];
    });

    const query = `
      INSERT INTO UserDetails 
      (firebase_uid, fullName, email, gender, dateOfBirth, callingNumber, whatsappNumber, email_verify, verified_at)
      VALUES ?
    `;

    await connection.query(query, [values]);
    connection.release();

    return {
      statusCode: 201,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Users created successfully" }),
    };

  } catch (error) {
    console.error("Error in createUsers:", error);
    connection.release();
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
   GET Users (GET /personal)
---------------------------------------*/
const getUsers = async (queryStringParameters) => {
  console.log("getUsers queryStringParameters:", queryStringParameters);
  try {
    const connection = await pool.getConnection();
    let query, params;
    // If firebase_uid is provided, filter by it; otherwise, retrieve all users.
    if (queryStringParameters && queryStringParameters.firebase_uid) {
      query = "SELECT * FROM UserDetails WHERE firebase_uid = ?";
      params = [queryStringParameters.firebase_uid];
    } else {
      query = "SELECT * FROM UserDetails";
      params = [];
    }
    console.log("Executing SQL:", query, "with params:", params);
    const [results] = await connection.query(query, params);
    connection.release();
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error("Error in getUsers:", error);
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
   UPDATE Users (PUT /personal)
---------------------------------------*/
// If emailVerified is true and email hasn't changed, set email_verify=1.
const updateUsers = async (body) => {
  console.log("updateUsers body:", body);
  try {
    const connection = await pool.getConnection();
    let userObj = JSON.parse(body);

    const {
      id,
      firebase_uid,
      fullName,
      email,
      gender,
      dateOfBirth,
      callingNumber,
      whatsappNumber,
      emailVerified // crucial flag
    } = userObj;

    let selectQuery = "SELECT * FROM UserDetails WHERE firebase_uid = ?";
    let selectParams = [firebase_uid];
    if (id) {
      selectQuery = "SELECT * FROM UserDetails WHERE id = ?";
      selectParams = [id];
    }
    const [rows] = await connection.query(selectQuery, selectParams);
    if (rows.length === 0) {
      connection.release();
      return await createUsers(body);
    }

    const oldEmail = rows[0].email;
    let query;
    let queryParams;

    if (oldEmail !== email) {
      // Email changed -> reset verification
      query = `
        UPDATE UserDetails
        SET fullName = ?,
            email = ?,
            gender = ?,
            dateOfBirth = ?,
            callingNumber = ?,
            whatsappNumber = ?,
            email_verify = 0,
            verified_at = NULL
        WHERE firebase_uid = ?
      `;
      queryParams = [
        fullName || "",
        email || "",
        gender || "",
        dateOfBirth || null,
        callingNumber || "",
        whatsappNumber || "",
        firebase_uid
      ];
      if (id) {
        query += " AND id = ?";
        queryParams.push(id);
      }
    } else {
      if (emailVerified === true) {
        query = `
          UPDATE UserDetails
          SET fullName = ?,
              email = ?,
              gender = ?,
              dateOfBirth = ?,
              callingNumber = ?,
              whatsappNumber = ?,
              email_verify = 1,
              verified_at = ?
          WHERE firebase_uid = ?
        `;
        queryParams = [
          fullName || "",
          email || "",
          gender || "",
          dateOfBirth || null,
          callingNumber || "",
          whatsappNumber || "",
          new Date(),
          firebase_uid
        ];
        if (id) {
          query += " AND id = ?";
          queryParams.push(id);
        }
      } else {
        query = `
          UPDATE UserDetails
          SET fullName = ?,
              email = ?,
              gender = ?,
              dateOfBirth = ?,
              callingNumber = ?,
              whatsappNumber = ?
          WHERE firebase_uid = ?
        `;
        queryParams = [
          fullName || "",
          email || "",
          gender || "",
          dateOfBirth || null,
          callingNumber || "",
          whatsappNumber || "",
          firebase_uid
        ];
        if (id) {
          query += " AND id = ?";
          queryParams.push(id);
        }
      }
    }

    const updateResult = await connection.query(query, queryParams);
    console.log("Update result:", updateResult);
    connection.release();
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Users updated successfully" }),
    };
  } catch (error) {
    console.error("Error in updateUsers:", error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
    };
  }
};

/* ---------------------------------------
   DELETE Users (DELETE /personal)
---------------------------------------*/
const deleteUsers = async (body) => {
  console.log("deleteUsers body:", body);
  try {
    const connection = await pool.getConnection();
    const ids = JSON.parse(body);
    const query = "DELETE FROM UserDetails WHERE id IN (?)";
    await connection.query(query, [ids]);
    connection.release();
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Users deleted successfully" }),
    };
  } catch (error) {
    console.error("Error in deleteUsers:", error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
    };
  }
};

/* ---------------------------------------
   CREATE Email OTP (POST /otp/create)
---------------------------------------*/
const createEmailOtp = async (body) => {
  console.log("createEmailOtp body:", body);
  try {
    const { email } = JSON.parse(body);
    if (!email) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ message: "Missing email" }),
      };
    }
    console.log(`Sending OTP via external service for ${email} (placeholder)`);
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "OTP sent (placeholder)" }),
    };
  } catch (error) {
    console.error("Error in createEmailOtp:", error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
    };
  }
};

/* ---------------------------------------
   VERIFY Email OTP (POST /otp/verify)
---------------------------------------*/
const verifyEmailOtp = async (body) => {
  console.log("verifyEmailOtp body:", body);
  try {
    let { email, otp, firebase_uid } = JSON.parse(body);
    if (!email || !otp || !firebase_uid) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ message: "Missing email, OTP, or firebase_uid" }),
      };
    }
    // Assume external OTP verification was successful
    const connection = await pool.getConnection();
    const query = `
      UPDATE UserDetails
      SET email_verify = 1, verified_at = ?
      WHERE firebase_uid = ? AND email = ?
    `;
    const [result] = await connection.query(query, [new Date(), firebase_uid, email]);
    connection.release();
    if (result.affectedRows === 0) {
      return {
        statusCode: 404,
        headers: corsHeaders(),
        body: JSON.stringify({ message: "No matching user found to verify" }),
      };
    }
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Email verified successfully" }),
    };
  } catch (error) {
    console.error("Error in verifyEmailOtp:", error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
    };
  }
};
