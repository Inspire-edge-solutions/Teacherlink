import { getFirebaseAuth } from '../utils/firebase.js';
import { getDBConnection } from '../utils/db.js';
import { getSecrets } from '../utils/secrets.js';
import { sendEmail } from '../utils/emailer.js';
import randomstring from 'randomstring';

function generateRandomPassword() {
  console.log("🔹 Generating random password...");
  const length = Math.floor(Math.random() * (16 - 8 + 1)) + 8;
  const password = randomstring.generate({
    length: length,
    charset: 'alphanumeric',
    capitalization: 'mixed',
    readable: true,
    special: true,
  });
  console.log("✅ Password generated:", password);
  return password;
}

export const lambdaHandler = async (event) => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    console.log("🔹 Handling OPTIONS preflight request");
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
      },
      body: JSON.stringify({ message: "Preflight successful" })
    };
  }

  // Log the raw event for debugging
  console.log("🔹 Raw event:", JSON.stringify(event));

  try {
    console.log("🔹 Initializing Firebase Authentication...");
    const auth = await getFirebaseAuth();
    console.log("✅ Firebase authentication initialized.");

    console.log("🔹 Fetching secrets...");
    const secret = await getSecrets("inspireedge", "ap-south-1");
    console.log("✅ Secrets retrieved successfully.");

    console.log("🔹 Establishing database connection...");
    const conn = await getDBConnection(secret);
    console.log("✅ Database connection established.");

    // Safely parse event.body; if it's missing, default to {}
    let bodyObj = {};
    if (event.body) {
      try {
        bodyObj = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
      } catch (err) {
        console.error("Error parsing event.body:", err);
      }
    }
    // Merge parsed body into event so properties (like email) are available
    Object.assign(event, bodyObj);
    console.log("🔹 Merged event:", JSON.stringify(event));

    // Retrieve route from various sources
    let route =
      event.route ||
      bodyObj.route ||
      (event.queryStringParameters && event.queryStringParameters.route) ||
      (event.pathParameters && event.pathParameters.route);

    // Fallback: derive route from event.path if still undefined
    if (!route && event.path) {
      const parts = event.path.split('/');
      route = parts[parts.length - 1]; // e.g., "ForgotPassword"
    }

    console.log("🔹 Resolved route:", route);
    if (!route) {
      console.error("❌ Route not specified in the request.");
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
        },
        body: JSON.stringify({ message: 'Route not specified in request' })
      };
    }

    // Process the route based on the resolved value
    switch (route) {
      case "GetUser":
        return await getUser(conn, event);
      case "CreateUser":
        return await createUser(conn, event);
      case "CreateUserAdmin":
        return await createUserAdmin(conn, event);
      case "UpdateUser":
        return await updateUser(conn, event);
      case "DeleteUser":
        return await deleteUser(conn, event);
      case "ForgotPassword":
        return await forgotPassword(event);
      case "ChangePassword":
        return await changePassword(event);
      default:
        console.error("❌ Invalid route specified:", route);
        return {
          statusCode: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
          },
          body: JSON.stringify({ message: 'Invalid Route' })
        };
    }
  } catch (err) {
    console.error("❌ Unhandled error in Lambda handler:", err);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
      },
      body: JSON.stringify({ message: err.message })
    };
  }
};

// async function getUser(conn, event) {
//     console.log("🔹 Authenticating user...");
  
//     // Log incoming path and query parameters for debugging
//     console.log("🔹 Raw pathParameters:", JSON.stringify(event.pathParameters));
//     console.log("🔹 Raw queryStringParameters:", JSON.stringify(event.queryStringParameters));
//     console.log("🔹 Incoming event data:", JSON.stringify(event));
  
//     // Retrieve the Firebase UID from various sources
//     const firebase_uid =
//       event.firebase_uid ||
//       (event.pathParameters && (event.pathParameters.firebase_uid || event.pathParameters.id)) ||
//       (event.queryStringParameters && event.queryStringParameters.firebase_uid);
  
//     console.log("🔹 Using firebase_uid:", firebase_uid, " (type:", typeof firebase_uid, ")");
  
//     if (!firebase_uid) {
//       console.error("❌ firebase_uid is missing in the request.");
//       return {
//         statusCode: 400,
//         headers: {
//           "Content-Type": "application/json",
//           "Access-Control-Allow-Origin": "*",
//           "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
//           "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
//         },
//         body: JSON.stringify({ message: "firebase_uid is required." })
//       };
//     }
  
//     try {
//       // Query the database for the user record
//       console.log("🔹 Querying database for firebase_uid:", firebase_uid);
//       const [rows] = await conn.execute(
//         "SELECT user_type FROM users WHERE firebase_uid = ?",
//         [firebase_uid]
//       );
//       console.log("🔹 Database query result:", rows);
  
//       if (rows.length === 0) {
//         console.error("❌ No user found with the provided firebase_uid:", firebase_uid);
//         return {
//           statusCode: 404,
//           headers: {
//             "Content-Type": "application/json",
//             "Access-Control-Allow-Origin": "*",
//             "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
//             "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
//           },
//           body: JSON.stringify({ message: "User not found. Please sign up first." })
//         };
//       }
  
//       const user_type = rows[0].user_type;
//       console.log(`🔹 User authenticated as: ${user_type}`);
  
//       return {
//         statusCode: 200,
//         headers: {
//           "Content-Type": "application/json",
//           "Access-Control-Allow-Origin": "*",
//           "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
//           "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
//         },
//         body: JSON.stringify({ message: "Authenticated", user_type })
//       };
//     } catch (err) {
//       console.error("❌ Authentication error:", err);
//       return {
//         statusCode: 500,
//         headers: {
//           "Content-Type": "application/json",
//           "Access-Control-Allow-Origin": "*",
//           "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
//           "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
//         },
//         body: JSON.stringify({ message: err.message })
//       };
//     } finally {
//       if (conn) {
//         conn.release();
//         console.log("🔹 Database connection released.");
//       }
//     }
//   }

async function getUser(conn, event) {
  console.log("🔹 Authenticating user...");

  // Log incoming path and query parameters for debugging
  console.log("🔹 Raw pathParameters:", JSON.stringify(event.pathParameters));
  console.log("🔹 Raw queryStringParameters:", JSON.stringify(event.queryStringParameters));
  console.log("🔹 Incoming event data:", JSON.stringify(event));

  // Retrieve the Firebase UID from various sources
  const firebase_uid =
    event.firebase_uid ||
    (event.pathParameters && (event.pathParameters.firebase_uid || event.pathParameters.id)) ||
    (event.queryStringParameters && event.queryStringParameters.firebase_uid);

  console.log("🔹 Using firebase_uid:", firebase_uid, " (type:", typeof firebase_uid, ")");

  if (!firebase_uid) {
    console.error("❌ firebase_uid is missing in the request.");
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
      },
      body: JSON.stringify({ message: "firebase_uid is required." })
    };
  }

  try {
    // Query the database for the user record (selecting name and phone_number as well)
    console.log("🔹 Querying database for firebase_uid:", firebase_uid);
    const [rows] = await conn.execute(
      "SELECT user_type, name, phone_number FROM users WHERE firebase_uid = ?",
      [firebase_uid]
    );
    console.log("🔹 Database query result:", rows);

    if (rows.length === 0) {
      console.error("❌ No user found with the provided firebase_uid:", firebase_uid);
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
        },
        body: JSON.stringify({ message: "User not found. Please sign up first." })
      };
    }

    const { user_type, name, phone_number } = rows[0];
    console.log(`🔹 User authenticated as: ${user_type}`);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
      },
      body: JSON.stringify({ message: "Authenticated", user_type, name, phone_number })
    };
  } catch (err) {
    console.error("❌ Authentication error:", err);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
      },
      body: JSON.stringify({ message: err.message })
    };
  } finally {
    if (conn) {
      conn.release();
      console.log("🔹 Database connection released.");
    }
  }
}

  
async function createUser(conn, event) {
  console.log("🔹 Creating user...");
  try {
    const { name, email, phone_number, firebase_uid, user_type } = event;
    console.log("🔹 User details received:", { name, email, phone_number, firebase_uid, user_type });
    if (!name || !email || !phone_number || !firebase_uid || !user_type) {
      console.error("❌ Missing required fields.");
      throw new Error("Required fields: name, email, phone_number, firebase_uid, user_type.");
    }
    if (!["Candidate", "Employer"].includes(user_type)) {
      console.error("❌ Invalid user type.");
      throw new Error("Invalid user_type. Allowed values: 'Candidate', 'Employer'.");
    }
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    await conn.execute(
      "INSERT INTO users (name, email, phone_number, firebase_uid, user_type, created_at, updated_at, is_active, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [name, email, phone_number, firebase_uid, user_type, now, now, 1, 1, 1]
    );
    console.log("✅ User created successfully in the database.");
    await conn.commit();
    await conn.release();
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
      },
      body: JSON.stringify({ message: 'User created successfully' })
    };
  } catch (err) {
    console.error("❌ Error creating user:", err);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
      },
      body: JSON.stringify({ message: err.message })
    };
  }
}

async function createUserAdmin(conn, event) {
  console.log("🔹 Creating admin user...");
  try {
    const { email, name, phone_number, user_type } = event;
    console.log("🔹 Admin user details:", { email, name, phone_number, user_type });
    if (!email || !name || !phone_number || !user_type) {
      console.error("❌ Missing required fields for admin user creation.");
      throw new Error("Required fields: email, name, phone_number, user_type.");
    }
    if (!["Candidate", "Employer"].includes(user_type)) {
      console.error("❌ Invalid user type.");
      throw new Error("Invalid user_type. Allowed values: 'Candidate', 'Employer'.");
    }
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const password = generateRandomPassword();
    console.log("🔹 Generated password for admin:", password);
    const auth = await getFirebaseAuth();
    const userRecord = await auth.createUser({ email, password });
    console.log("✅ User created in Firebase Auth. UID:", userRecord.uid);
    await conn.execute(
      "INSERT INTO users (firebase_uid, name, email, phone_number, user_type, created_at, updated_at, is_active, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [userRecord.uid, name, email, phone_number, user_type, now, now, 1, 1, 1]
    );
    console.log("✅ Admin user created successfully in the database.");
    await conn.commit();
    await conn.release();
    console.log("🔹 Sending welcome email...");
    const subject = "Welcome to TeacherLink";
    const body = `
      <div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 2;">
        <div style="margin: 50px auto; width: 70%; padding: 20px 0;">
          <div style="border-bottom: 1px solid #eee;">
            <a href="#" style="font-size: 1.4em; color: #00466A; text-decoration: none; font-weight: 600;">TeacherLink</a>
          </div>
          <p style="font-size: 1.1em;">Hi ${name},</p>
          <p>Your account has been created successfully. Here are your login credentials:</p>
          <ul>
            <li>Email: ${email}</li>
            <li>Password: ${password}</li>
          </ul>
          <p>Please change your password after logging in to ensure your account's security.</p>
          <p style="font-size: 0.9em;">Regards,<br />TeacherLink Team</p>
          <hr style="border: none; border-top: 1px solid #eee;" />
          <div style="float: right; padding: 8px 0; color: #aaa; font-size: 0.8em; line-height: 1; font-weight: 300;">
            <p>TeacherLink</p>
          </div>
        </div>
      </div>`;
    await sendEmail(email, subject, body);
    console.log("✅ Welcome email sent successfully.");
    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
      },
      body: JSON.stringify({ message: 'User created successfully' })
    };
  } catch (err) {
    console.error("❌ Error creating admin user:", err);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
      },
      body: JSON.stringify({ message: err.message })
    };
  }
}

async function updateUser(conn, event) {
  console.log("🔹 Updating user details...");
  try {
    const { name, email, phone_number, firebase_uid } = event;
    console.log("🔹 Data received for update:", { name, email, phone_number, firebase_uid });
    if (!name || !email || !phone_number || !firebase_uid) {
      console.error("❌ Missing required fields.");
      throw new Error("Required fields: name, email, phone_number, firebase_uid.");
    }
    const updateFields = [];
    const updateValues = [];
    if (name) {
      updateFields.push("name = ?");
      updateValues.push(name);
    }
    if (email) {
      updateFields.push("email = ?");
      updateValues.push(email);
    }
    if (phone_number) {
      updateFields.push("phone_number = ?");
      updateValues.push(phone_number);
    }
    if (updateFields.length === 0) {
      console.error("❌ No fields provided to update.");
      throw new Error("No fields provided to update.");
    }
    updateValues.push(firebase_uid);
    const query = `
      UPDATE users
      SET ${updateFields.join(", ")}, updated_at = NOW()
      WHERE firebase_uid = ?
    `;
    console.log("🔹 Final update query:", query);
    const [result] = await conn.execute(query, updateValues);
    console.log("✅ User updated successfully:", result);
    await conn.release();
    console.log("🔹 Database connection released.");
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
      },
      body: JSON.stringify({ message: "User updated successfully" })
    };
  } catch (err) {
    console.error("❌ Error updating user:", err);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
      },
      body: JSON.stringify({ message: err.message })
    };
  }
}

async function deleteUser(conn, event) {
  console.log("🔹 Deleting user...");
  try {
    const { firebase_uid } = event;
    console.log("🔹 User ID received for deletion:", firebase_uid);
    if (!firebase_uid) {
      console.error("❌ firebase_uid is missing in the request.");
      throw new Error("firebase_uid is required.");
    }
    console.log("🔹 Deleting user from Firebase...");
    const auth = await getFirebaseAuth();
    await auth.deleteUser(firebase_uid);
    console.log("✅ User deleted from Firebase.");
    console.log("🔹 Deleting user from database...");
    const [result] = await conn.execute("DELETE FROM users WHERE firebase_uid = ?", [firebase_uid]);
    console.log("✅ User deleted from database:", result);
    if (result.affectedRows === 0) {
      console.error("❌ No user found with the provided firebase_uid:", firebase_uid);
      throw new Error("User not found in database.");
    }
    await conn.release();
    console.log("🔹 Database connection released.");
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
      },
      body: JSON.stringify({ message: "User deleted successfully" })
    };
  } catch (err) {
    console.error("❌ Error deleting user:", err);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
      },
      body: JSON.stringify({ message: err.message })
    };
  }
}

async function forgotPassword(event) {
  try {
    // Safely parse the body or default to an empty object if null
    const body = event.body ? (typeof event.body === 'string' ? JSON.parse(event.body) : event.body) : {};
    const { email, otp, newPassword, route } = body;
  
    console.log("🔹 Received data:", { email, otp, newPassword, route });
  
    if (!email) {
      console.error("❌ Email is missing in request");
      throw new Error("Email is required.");
    }
  
    // Initialize Firebase Auth
    const auth = await getFirebaseAuth();
  
    // If newPassword is provided, update user's password directly
    if (newPassword) {
      // Retrieve the user by email using Firebase Auth
      const userRecord = await auth.getUserByEmail(email);
      await auth.updateUser(userRecord.uid, { password: newPassword });
      
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
        },
        body: JSON.stringify({ message: "Password reset successful" })
      };
    }
    
    // If newPassword is not provided, throw an error
    throw new Error("New password not provided.");
  } catch (err) {
    console.error("❌ Error in forgotPassword:", err);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
      },
      body: JSON.stringify({ message: err.message })
    };
  }
}

export async function changePassword(event) {
  try {
    const { firebase_uid, newPassword } = event;
    console.log("🔹 Changing password for user:", firebase_uid);
    if (!firebase_uid || !newPassword) {
      console.error("❌ Missing required fields.");
      throw new Error("Required fields: firebase_uid, newPassword.");
    }
    const auth = await getFirebaseAuth();
    await auth.updateUser(firebase_uid, { password: newPassword });
    console.log("✅ Password updated successfully.");
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
      },
      body: JSON.stringify({ message: "Password updated successfully" })
    };
  } catch (err) {
    console.error("❌ Error changing password:", err);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
      },
      body: JSON.stringify({ message: err.message })
    };
  }
}
