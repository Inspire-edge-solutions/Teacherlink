// import { getFirebaseAuth } from '../utils/firebase.js';
// import pool from '../utils/db.js';
// import { getSecrets } from '../utils/secrets.js';

// // CORS headers function
// const getCorsHeaders = () => {
//   return {
//     'Access-Control-Allow-Origin': '*', // Allow all origins
//     'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE', // Allowed HTTP methods
//     'Access-Control-Allow-Headers': 'Content-Type, Authorization' // Allowed headers
//   };
// };

// export const lambdaHandler = async (event, context) => {
//     console.log("🔹 Lambda function invoked. Event:", JSON.stringify(event));

//     // Handle CORS preflight requests
//     if (event.httpMethod === 'OPTIONS') {
//         return {
//             statusCode: 200,
//             headers: getCorsHeaders(),
//             body: ''
//         };
//     }

//     try {
//         console.log("🔹 Fetching secrets...");
//         const secret = await getSecrets("inspire-edge-db-secret", "ap-south-1");
//         console.log("✅ Secrets retrieved.");

//         console.log("🔹 Establishing database connection...");
//         const conn = await pool.getConnection();
//         console.log("✅ DB connection established.");

//         let route = event.route || (event.body && JSON.parse(event.body).route);
//         if (!route && event.pathParameters) {
//             route = event.pathParameters.route;
//         }
//         console.log("🔹 Resolved route:", route);

//         if (!route) {
//             return {
//                 statusCode: 400,
//                 body: JSON.stringify({ message: "Route not specified." }),
//                 headers: getCorsHeaders(), // CORS headers added here
//             };
//         }

//         if (event.body && typeof event.body === "string") {
//             Object.assign(event, JSON.parse(event.body));
//         }

//         switch (route) {
//             case "RegisterUser":
//                 return await registerUser(conn, event);
//             case "LoginUser":
//                 return await loginUser(event);
//             default:
//                 return {
//                     statusCode: 400,
//                     body: JSON.stringify({ message: "Invalid Route." }),
//                     headers: getCorsHeaders(), // CORS headers added here
//                 };
//         }
//     } catch (err) {
//         console.error("❌ Error:", err);
//         return {
//             statusCode: 500,
//             body: JSON.stringify({ message: err.message }),
//             headers: getCorsHeaders(), // CORS headers added here
//         };
//     }
// };

// // Register User
// async function registerUser(conn, event) {
//     console.log("🔹 Registering new user...");
//     const { name, email, password, number } = event;

//     if (!name || !email || !password || !number) {
//         console.error("❌ Missing required fields:", { name, email, password, number });
//         return {
//             statusCode: 400,
//             body: JSON.stringify({ message: "All fields are required: name, email, password, number." }),
//             headers: getCorsHeaders(), // CORS headers added here
//         };
//     }

//     try {
//         const auth = await getFirebaseAuth();

//         // Create the user in Firebase Authentication
//         const userCredential = await auth.createUser({
//             email,
//             password,
//             displayName: name,
//         });
//         const firebaseUid = userCredential.uid;

//         console.log("✅ User created in Firebase. UID:", firebaseUid);

//         // Generate a unique user ID
//         const userId = `user_${new Date().getTime()}`;

//         // Insert user data into MySQL database
//         const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
//         await conn.execute(
//             "INSERT INTO users (user_id, firebase_uid, name, email, phone_number, created_at) VALUES (?, ?, ?, ?, ?, ?)",
//             [userId, firebaseUid, name, email, number, now]
//         );

//         console.log("✅ User registered successfully in the database.");
//         conn.release();

//         return {
//             statusCode: 201,
//             body: JSON.stringify({ message: "User registered successfully." }),
//             headers: getCorsHeaders(), // CORS headers added here
//         };
//     } catch (err) {
//         if (err.code === 'auth/email-already-exists') {
//             console.error("❌ Email already in use:", err);
//             return {
//                 statusCode: 400,
//                 body: JSON.stringify({ message: "The email address is already in use by another account." }),
//                 headers: getCorsHeaders(), // CORS headers added here
//             };
//         } else {
//             console.error("❌ Error registering user:", err);
//             return {
//                 statusCode: 500,
//                 body: JSON.stringify({ message: err.message }),
//                 headers: getCorsHeaders(), // CORS headers added here
//             };
//         }
//     }
// }

// // Login User
// async function loginUser(event) {
//     console.log("🔹 Logging in user...");
//     const { email, password } = event;

//     if (!email || !password) {
//         console.error("❌ Missing email or password:", { email, password });
//         return {
//             statusCode: 400,
//             body: JSON.stringify({ message: "Email and password are required." }),
//             headers: getCorsHeaders(), // CORS headers added here
//         };
//     }

//     try {
//         const auth = await getFirebaseAuth();

//         // Verify the user's credentials in Firebase Authentication
//         const userCredential = await auth.signInWithEmailAndPassword(email, password);
//         const user = userCredential.user;

//         console.log("✅ User logged in. Firebase UID:", user.uid);

//         return {
//             statusCode: 200,
//             body: JSON.stringify({
//                 message: "Login successful.",
//                 data: {
//                     firebaseUid: user.uid,
//                     email: user.email,
//                     displayName: user.displayName,
//                 },
//             }),
//             headers: getCorsHeaders(), // CORS headers added here
//         };
//     } catch (err) {
//         console.error("❌ Error logging in user:", err);
//         return {
//             statusCode: 401,
//             body: JSON.stringify({ message: "Invalid credentials." }),
//             headers: getCorsHeaders(), // CORS headers added here
//         };
//     }
// }

// export const handler = lambdaHandler;
import { getFirebaseAuth } from '../utils/firebase.js';
import pool from '../utils/db.js';
import { getSecrets } from '../utils/secrets.js';
import bcrypt from 'bcryptjs';

// CORS headers function
const getCorsHeaders = () => {
  return {
    'Access-Control-Allow-Origin': '*', // Allow all origins
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE', // Allowed HTTP methods
    'Access-Control-Allow-Headers': 'Content-Type, Authorization' // Allowed headers
  };
};

export const lambdaHandler = async (event, context) => {
    console.log("🔹 Lambda function invoked. Event:", JSON.stringify(event));

    // Handle CORS preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: getCorsHeaders(),
            body: ''
        };
    }

    try {
        console.log("🔹 Fetching secrets...");
        const secret = await getSecrets("inspire-edge-db-secret", "ap-south-1");
        console.log("✅ Secrets retrieved.");

        console.log("🔹 Establishing database connection...");
        const conn = await pool.getConnection();
        console.log("✅ DB connection established.");

        let route = event.route || (event.body && JSON.parse(event.body).route);
        if (!route && event.pathParameters) {
            route = event.pathParameters.route;
        }
        console.log("🔹 Resolved route:", route);

        if (!route) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Route not specified." }),
                headers: getCorsHeaders(), // CORS headers added here
            };
        }

        if (event.body && typeof event.body === "string") {
            Object.assign(event, JSON.parse(event.body));
        }

        switch (route) {
            case "RegisterUser":
                return await registerUser(conn, event);
            case "LoginUser":
                return await loginUser(conn, event);
            default:
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: "Invalid Route." }),
                    headers: getCorsHeaders(), // CORS headers added here
                };
        }
    } catch (err) {
        console.error("❌ Error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: err.message }),
            headers: getCorsHeaders(), // CORS headers added here
        };
    }
};

// Register User
async function registerUser(conn, event) {
    console.log("🔹 Registering new user...");
    const { name, email, password, phone_number } = event;

    if (!name || !email || !password || !phone_number) {
        console.error("❌ Missing required fields:", { name, email, password, phone_number });
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "All fields are required: name, email, password, phone_number." }),
            headers: getCorsHeaders(), // CORS headers added here
        };
    }

    try {
        const auth = await getFirebaseAuth();

        // Check if the user already exists in Firebase Authentication
        const userRecord = await auth.getUserByEmail(email).catch(err => {
            if (err.code !== 'auth/user-not-found') {
                throw err;
            }
        });

        if (userRecord) {
            console.error("❌ Email already in use in Firebase:", email);
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "The email address is already in use by another account." }),
                headers: getCorsHeaders(), // CORS headers added here
            };
        }

        // Create the user in Firebase Authentication
        const userCredential = await auth.createUser({
            email,
            password,
            displayName: name,
        });
        const firebaseUid = userCredential.uid;

        console.log("✅ User created in Firebase. UID:", firebaseUid);

        // Generate a unique user ID
        const userId = `user_${new Date().getTime()}`;

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user data into MySQL database
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await conn.execute(
            "INSERT INTO users (user_id, firebase_uid, name, email, password, phone_number, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [userId, firebaseUid, name, email, hashedPassword, phone_number, now]
        );

        console.log("✅ User registered successfully in the database.");
        conn.release();

        return {
            statusCode: 201,
            body: JSON.stringify({ message: "User registered successfully." }),
            headers: getCorsHeaders(), // CORS headers added here
        };
    } catch (err) {
        console.error("❌ Error registering user:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: err.message }),
            headers: getCorsHeaders(), // CORS headers added here
        };
    }
}

// Login User
async function loginUser(conn, event) {
    console.log("🔹 Logging in user...");
    const { email, password } = event;

    if (!email || !password) {
        console.error("❌ Missing email or password:", { email, password });
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Email and password are required." }),
            headers: getCorsHeaders(), // CORS headers added here
        };
    }

    try {
        const auth = await getFirebaseAuth();

        // Verify the user's credentials in Firebase Authentication
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        console.log("✅ User logged in. Firebase UID:", user.uid);

        // Verify the password with the hashed password in the database
        const [rows] = await conn.execute("SELECT password FROM users WHERE email = ?", [email]);

        if (rows.length === 0 || !(await bcrypt.compare(password, rows[0].password))) {
            console.error("❌ Invalid credentials");
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Invalid credentials." }),
                headers: getCorsHeaders(), // CORS headers added here
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Login successful.",
                data: {
                    firebaseUid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                },
            }),
            headers: getCorsHeaders(), // CORS headers added here
        };
    } catch (err) {
        console.error("❌ Error logging in user:", err);
        return {
            statusCode: 401,
            body: JSON.stringify({ message: "Invalid credentials." }),
            headers: getCorsHeaders(), // CORS headers added here
        };
    }
}

export const handler = lambdaHandler;