// import { getFirebaseAuth } from '../utils/firebase.js';
// import pool from '../utils/db.js';
// import { getSecrets } from '../utils/secrets.js';
// import bcrypt from 'bcryptjs';

// // CORS headers function
// const getCorsHeaders = () => ({
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE',
//   'Access-Control-Allow-Headers': 'Content-Type, Authorization'
// });

// // Register user function
// async function registerUser(conn, event) {
//     console.log("🔹 Registering new user...");
//     const { name, email, password, phone_number } = event;

//     if (!name || !email || !password || !phone_number) {
//         return { statusCode: 400, headers: getCorsHeaders(), body: JSON.stringify({ message: "All fields are required." }) };
//     }

//     try {
//         const auth = await getFirebaseAuth();

//         // Check if email is already registered in Firebase
//         let existingUser;
//         try {
//             existingUser = await auth.getUserByEmail(email);
//         } catch (err) {
//             if (err.code !== 'auth/user-not-found') {
//                 throw err; // Rethrow unexpected Firebase errors
//             }
//         }

//         if (existingUser) {
//             return { statusCode: 400, headers: getCorsHeaders(), body: JSON.stringify({ message: "Email already in use." }) };
//         }

//         // Create user in Firebase
//         const userCredential = await auth.createUser({ email, password, displayName: name });

//         if (!userCredential || !userCredential.uid) {
//             console.error("❌ Firebase UID creation failed. Aborting MySQL insert.");
//             return { statusCode: 500, headers: getCorsHeaders(), body: JSON.stringify({ message: "Firebase user creation failed." }) };
//         }

//         const firebaseUid = userCredential.uid;
//         console.log("✅ Firebase User Created. UID:", firebaseUid);

//         // Encrypt password before storing in MySQL
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Insert into MySQL users table, using firebase_uid as user_id (PRIMARY KEY)
//         await conn.execute(
//             "INSERT INTO users (user_id, name, email, password, phone_number, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
//             [firebaseUid, name, email, hashedPassword, phone_number]
//         );

//         console.log("✅ User registered successfully in database.");
//         conn.release();

//         return { statusCode: 201, headers: getCorsHeaders(), body: JSON.stringify({ message: "User registered successfully.", userId: firebaseUid }) };
//     } catch (err) {
//         console.error("❌ Registration Error:", err);
//         return { statusCode: 500, headers: getCorsHeaders(), body: JSON.stringify({ message: err.message }) };
//     }
// }

// // Login user function
// async function loginUser(conn, event) {
//     console.log("🔹 Logging in user...");
//     const { email, password } = event;

//     if (!email || !password) {
//         return { statusCode: 400, headers: getCorsHeaders(), body: JSON.stringify({ message: "Email and password required." }) };
//     }

//     try {
//         const auth = await getFirebaseAuth();
//         const user = await auth.getUserByEmail(email);

//         const [rows] = await conn.execute("SELECT user_id, password FROM users WHERE email = ?", [email]);
//         if (rows.length === 0 || !(await bcrypt.compare(password, rows[0].password))) {
//             return { statusCode: 401, headers: getCorsHeaders(), body: JSON.stringify({ message: "Invalid credentials." }) };
//         }

//         return {
//             statusCode: 200,
//             headers: getCorsHeaders(),
//             body: JSON.stringify({
//                 message: "Login successful.",
//                 data: { userId: rows[0].user_id, firebaseUid: user.uid, email: user.email, displayName: user.displayName }
//             })
//         };
//     } catch (err) {
//         console.error("❌ Login Error:", err);
//         return { statusCode: 401, headers: getCorsHeaders(), body: JSON.stringify({ message: "Invalid credentials." }) };
//     }
// }

// // Lambda function handler
// export const lambdaHandler = async (event) => {
//     console.log("🔹 Lambda function invoked. Event:", JSON.stringify(event));

//     if (event.httpMethod === 'OPTIONS') {
//         return { statusCode: 200, headers: getCorsHeaders(), body: '' };
//     }

//     try {
//         console.log("🔹 Fetching secrets...");
//         await getSecrets("inspire-edge-db-secret", "ap-south-1");
//         console.log("✅ Secrets retrieved.");

//         console.log("🔹 Establishing database connection...");
//         const conn = await pool.getConnection();
//         console.log("✅ DB connection established.");

//         let requestBody = event.body;
//         if (typeof event.body === "string") {
//             requestBody = JSON.parse(event.body);
//         }

//         let route = requestBody?.route || event?.pathParameters?.route;
//         console.log("🔹 Resolved route:", route);

//         if (!route) {
//             return { statusCode: 400, headers: getCorsHeaders(), body: JSON.stringify({ message: "Route not specified." }) };
//         }

//         switch (route) {
//             case "RegisterUser":
//                 return await registerUser(conn, requestBody);
//             case "LoginUser":
//                 return await loginUser(conn, requestBody);
//             default:
//                 return { statusCode: 400, headers: getCorsHeaders(), body: JSON.stringify({ message: "Invalid Route." }) };
//         }
//     } catch (err) {
//         console.error("❌ Error:", err);
//         return { statusCode: 500, headers: getCorsHeaders(), body: JSON.stringify({ message: err.message }) };
//     }
// };

// // Export handler
// export const handler = lambdaHandler;

import bcrypt from "bcryptjs";
import pool from "../utils/db.js";
import { getFirebaseAuth } from '../utils/firebase.js';

// CORS headers function
const getCorsHeaders = () => ({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
});

// Register user function (Firebase authentication happens on the frontend)
async function registerUser(conn, event) {
    console.log("🔹 Registering new user...");
    const { name, email, password, phone_number, firebase_uid } = event; // Firebase UID must come from frontend

    if (!name || !email || !password || !phone_number || !firebase_uid) {
        return { statusCode: 400, headers: getCorsHeaders(), body: JSON.stringify({ message: "All fields are required, including Firebase UID." }) };
    }

    try {
        // Encrypt password before storing in MySQL
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into MySQL users table
        await conn.execute(
            "INSERT INTO users (user_id, name, email, password, phone_number, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
            [firebase_uid, name, email, hashedPassword, phone_number]
        );

        console.log("✅ User registered successfully in database.");
        conn.release();

        return { statusCode: 201, headers: getCorsHeaders(), body: JSON.stringify({ message: "User registered successfully.", userId: firebase_uid }) };
    } catch (err) {
        console.error("❌ Registration Error:", err);
        return { statusCode: 500, headers: getCorsHeaders(), body: JSON.stringify({ message: err.message }) };
    }
}

// Login user function (Validating only against MySQL)
async function loginUser(conn, event) {
    console.log("🔹 Logging in user...");
    const { email, password } = event;

    if (!email || !password) {
        return { statusCode: 400, headers: getCorsHeaders(), body: JSON.stringify({ message: "Email and password required." }) };
    }

    try {
        const [rows] = await conn.execute("SELECT user_id, password FROM users WHERE email = ?", [email]);

        if (rows.length === 0 || !(await bcrypt.compare(password, rows[0].password))) {
            return { statusCode: 401, headers: getCorsHeaders(), body: JSON.stringify({ message: "Invalid credentials." }) };
        }

        console.log("✅ User authenticated.");

        return {
            statusCode: 200,
            headers: getCorsHeaders(),
            body: JSON.stringify({
                message: "Login successful.",
                data: {
                    userId: rows[0].user_id,
                    email
                }
            })
        };
    } catch (err) {
        console.error("❌ Login Error:", err);
        return { statusCode: 500, headers: getCorsHeaders(), body: JSON.stringify({ message: "Internal Server Error." }) };
    }
}

// Lambda function handler
export const lambdaHandler = async (event) => {
    console.log("🔹 Lambda function invoked. Event:", JSON.stringify(event));

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers: getCorsHeaders(), body: "" };
    }

    try {
        console.log("🔹 Establishing database connection...");
        const conn = await pool.getConnection();
        console.log("✅ DB connection established.");

        let requestBody = event.body;
        if (typeof event.body === "string") {
            requestBody = JSON.parse(event.body);
        }

        let route = requestBody?.route || event?.pathParameters?.route;
        console.log("🔹 Resolved route:", route);

        if (!route) {
            return { statusCode: 400, headers: getCorsHeaders(), body: JSON.stringify({ message: "Route not specified." }) };
        }

        switch (route) {
            case "RegisterUser":
                return await registerUser(conn, requestBody);
            case "LoginUser":
                return await loginUser(conn, requestBody);
            default:
                return { statusCode: 400, headers: getCorsHeaders(), body: JSON.stringify({ message: "Invalid Route." }) };
        }
    } catch (err) {
        console.error("❌ Error:", err);
        return { statusCode: 500, headers: getCorsHeaders(), body: JSON.stringify({ message: err.message }) };
    }
};

// Export handler
export const handler = lambdaHandler;
