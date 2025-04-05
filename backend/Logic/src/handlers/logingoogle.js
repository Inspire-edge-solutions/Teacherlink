// import pool from "../utils/db.js";

// // Function to set CORS headers (with additional Cross-Origin-Opener-Policy)
// const getCorsHeaders = () => ({
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
//   "Cross-Origin-Opener-Policy": "same-origin",
// });

// export const handler = async (event) => {
//   console.log("🔹 Google Login initiated...");

//   if (!event.body) {
//     return {
//       statusCode: 400,
//       headers: getCorsHeaders(),
//       body: JSON.stringify({
//         success: false,
//         message: "Missing request body.",
//       }),
//     };
//   }

//   // Parse the incoming payload
//   const { firebase_uid, name, email, phone_number, user_type } = JSON.parse(event.body);

//   if (!firebase_uid || !name || !email || !phone_number || !user_type) {
//     return {
//       statusCode: 400,
//       headers: getCorsHeaders(),
//       body: JSON.stringify({
//         success: false,
//         message: "firebase_uid, name, email, phone_number, and user_type are required.",
//       }),
//     };
//   }

//   let conn;
//   try {
//     conn = await pool.getConnection();

//     // Check if a user with the given firebase_uid already exists
//     let [rows] = await conn.execute(
//       `
//         SELECT 
//           firebase_uid, 
//           user_type, 
//           name, 
//           email, 
//           phone_number,
//           is_google_account
//         FROM users 
//         WHERE firebase_uid = ?
//       `,
//       [firebase_uid]
//     );

//     if (rows.length === 0) {
//       // New user: Insert a record. Use a fallback value for user_type if not provided,
//       // and set is_google_account=1 for Google-based login.
//       await conn.execute(
//         `
//           INSERT INTO users 
//             (firebase_uid, name, email, phone_number, user_type, created_at, is_google_account)
//           VALUES (?, ?, ?, ?, ?, NOW(), 1)
//         `,
//         [firebase_uid, name, email, phone_number || "", user_type || "pending"]
//       );
//       console.log("✅ New user registered with firebase_uid:", firebase_uid);
//     } else {
//       // Existing user: Update user_type if provided and differs from current value
//       const existingUser = rows[0];

//       if (user_type && existingUser.user_type !== user_type) {
//         await conn.execute(
//           "UPDATE users SET user_type = ? WHERE firebase_uid = ?",
//           [user_type, firebase_uid]
//         );
//         console.log("✅ User role updated for firebase_uid:", firebase_uid);
//       }

//       // If not marked as a Google account yet, update the flag
//       if (existingUser.is_google_account === 0) {
//         await conn.execute(
//           "UPDATE users SET is_google_account = 1 WHERE firebase_uid = ?",
//           [firebase_uid]
//         );
//         console.log("✅ Marked existing user as Google-based:", firebase_uid);
//       }

//       console.log("✅ Existing user found with firebase_uid:", firebase_uid);
//     }

//     // Retrieve the user record after insert/update
//     let [updatedRows] = await conn.execute(
//       `
//         SELECT 
//           firebase_uid, 
//           name, 
//           email, 
//           phone_number, 
//           user_type,
//           is_google_account
//         FROM users 
//         WHERE firebase_uid = ?
//       `,
//       [firebase_uid]
//     );

//     const user = updatedRows[0];

//     return {
//       statusCode: 200,
//       headers: getCorsHeaders(),
//       body: JSON.stringify({
//         success: true,
//         user,
//         message: "Google Login successful.",
//       }),
//     };
//   } catch (err) {
//     console.error("❌ Google Login Error:", err);
//     return {
//       statusCode: 500,
//       headers: getCorsHeaders(),
//       body: JSON.stringify({
//         success: false,
//         message: "Login failed.",
//       }),
//     };
//   } finally {
//     if (conn) conn.release();
//   }
// };

import pool from "../utils/db.js";

// Function to set CORS headers (with consistent headers)
const getCorsHeaders = () => ({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cross-Origin-Opener-Policy": "same-origin-allow-popups"
});

export const handler = async (event) => {
  console.log("🔹 Google Login initiated...");

  let firebase_uid, name, email, phone_number, user_type;

  if (event.httpMethod === 'GET') {
    // Retrieve firebase_uid from query parameters for GET requests
    firebase_uid = event.queryStringParameters && event.queryStringParameters.firebase_uid;
  } else if (event.httpMethod === 'POST') {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: getCorsHeaders(),
        body: JSON.stringify({
          success: false,
          message: "Missing request body.",
        }),
      };
    }
    const payload = JSON.parse(event.body);
    firebase_uid = payload.firebase_uid;
    name = payload.name;
    email = payload.email;
    phone_number = payload.phone_number;
    user_type = payload.user_type;
  }

  if (!firebase_uid) {
    return {
      statusCode: 400,
      headers: getCorsHeaders(),
      body: JSON.stringify({
        success: false,
        message: "firebase_uid is required.",
      }),
    };
  }

  let conn;
  try {
    conn = await pool.getConnection();

    // Check if a user with the given firebase_uid exists
    let [rows] = await conn.execute(
      `
        SELECT 
          firebase_uid, 
          user_type, 
          name, 
          email, 
          phone_number,
          is_google_account
        FROM users 
        WHERE firebase_uid = ?
      `,
      [firebase_uid]
    );

    if (event.httpMethod === 'GET') {
      if (rows.length === 0) {
        return {
          statusCode: 404,
          headers: getCorsHeaders(),
          body: JSON.stringify({
            success: false,
            message: "User not found.",
          }),
        };
      }
      const user = rows[0];
      return {
        statusCode: 200,
        headers: getCorsHeaders(),
        body: JSON.stringify({
          success: true,
          user,
          message: "User retrieved successfully.",
        }),
      };
    } else {
      if (rows.length === 0) {
        // New user: Insert record
        await conn.execute(
          `
            INSERT INTO users 
              (firebase_uid, name, email, phone_number, user_type, created_at, is_google_account)
            VALUES (?, ?, ?, ?, ?, NOW(), 1)
          `,
          [firebase_uid, name, email, phone_number || "", user_type || "pending"]
        );
        console.log("✅ New user registered with firebase_uid:", firebase_uid);
      } else {
        const existingUser = rows[0];
        if (user_type && existingUser.user_type !== user_type) {
          await conn.execute(
            "UPDATE users SET user_type = ? WHERE firebase_uid = ?",
            [user_type, firebase_uid]
          );
          console.log("✅ User role updated for firebase_uid:", firebase_uid);
        }
        if (existingUser.is_google_account === 0) {
          await conn.execute(
            "UPDATE users SET is_google_account = 1 WHERE firebase_uid = ?",
            [firebase_uid]
          );
          console.log("✅ Marked existing user as Google-based:", firebase_uid);
        }
        console.log("✅ Existing user found with firebase_uid:", firebase_uid);
      }

      // Retrieve the updated user record
      let [updatedRows] = await conn.execute(
        `
          SELECT 
            firebase_uid, 
            name, 
            email, 
            phone_number, 
            user_type,
            is_google_account
          FROM users 
          WHERE firebase_uid = ?
        `,
        [firebase_uid]
      );
      const user = updatedRows[0];
      return {
        statusCode: 200,
        headers: getCorsHeaders(),
        body: JSON.stringify({
          success: true,
          user,
          message: "Google Login successful.",
        }),
      };
    }
  } catch (err) {
    console.error("❌ Google Login Error:", err);
    return {
      statusCode: 500,
      headers: getCorsHeaders(),
      body: JSON.stringify({
        success: false,
        message: "Login failed.",
      }),
    };
  } finally {
    if (conn) conn.release();
  }
};
