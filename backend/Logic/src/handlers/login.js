import { getFirebaseAuth } from '../utils/firebase.js';
import { getDBConnection } from '../utils/db.js';
import { getSecrets } from '../utils/secrets.js';

export const lambdaHandler = async (event, context) => {
    console.log("🔹 Lambda function invoked. Event:", JSON.stringify(event));

    try {
        console.log("🔹 Fetching secrets...");
        const secret = await getSecrets("inspire-edge-db-secret", "ap-south-1");
        console.log("✅ Secrets retrieved.");

        console.log("🔹 Establishing database connection...");
        const conn = await getDBConnection(secret);
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
            };
        }

        if (event.body && typeof event.body === "string") {
            Object.assign(event, JSON.parse(event.body));
        }

        switch (route) {
            case "RegisterUser":
                return await registerUser(conn, event);
            case "LoginUser":
                return await loginUser(event);
            default:
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: "Invalid Route." }),
                };
        }
    } catch (err) {
        console.error("❌ Error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: err.message }),
        };
    }
};

// Register User
async function registerUser(conn, event) {
    console.log("🔹 Registering new user...");
    const { name, email, password, number } = event;

    if (!name || !email || !password || !number) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "All fields are required: name, email, password, number." }),
        };
    }

    try {
        const auth = await getFirebaseAuth();

        // Create the user in Firebase Authentication
        const userCredential = await auth.createUser({
            email,
            password,
            displayName: name,
        });
        const firebaseUid = userCredential.uid;

        console.log("✅ User created in Firebase. UID:", firebaseUid);

        // Insert user data into MySQL database
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await conn.execute(
            "INSERT INTO users (firebase_uid, name, email, phone_number, created_at) VALUES (?, ?, ?, ?, ?)",
            [firebaseUid, name, email, number, now]
        );

        console.log("✅ User registered successfully in the database.");
        await conn.end();

        return {
            statusCode: 201,
            body: JSON.stringify({ message: "User registered successfully." }),
        };
    } catch (err) {
        console.error("❌ Error registering user:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: err.message }),
        };
    }
}

// Login User
async function loginUser(event) {
    console.log("🔹 Logging in user...");
    const { email, password } = event;

    if (!email || !password) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Email and password are required." }),
        };
    }

    try {
        const auth = await getFirebaseAuth();

        // Verify the user's credentials in Firebase Authentication
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        console.log("✅ User logged in. Firebase UID:", user.uid);

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
        };
    } catch (err) {
        console.error("❌ Error logging in user:", err);
        return {
            statusCode: 401,
            body: JSON.stringify({ message: "Invalid credentials." }),
        };
    }
}

export const handler = lambdaHandler;

// async function loginUser(event) {
//     console.log("🔹 Logging in user...");
//     const { email, password } = event;

//     if (!email || !password) {
//         return {
//             statusCode: 400,
//             body: JSON.stringify({ message: "Email and password are required." }),
//         };
//     }

//     try {
//         // Initialize Firebase Auth REST API call
//         const apiKey = process.env.FIREBASE_API_KEY; // Make sure this is set in your environment
//         const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({
//                 email,
//                 password,
//                 returnSecureToken: true
//             })
//         });

//         const data = await response.json();

//         if (!response.ok) {
//             throw new Error(data.error?.message || 'Authentication failed');
//         }

//         // Get additional user info using Admin SDK
//         const auth = await getFirebaseAuth();
//         const userRecord = await auth.getUser(data.localId);

//         console.log("✅ User logged in. Firebase UID:", userRecord.uid);

//         return {
//             statusCode: 200,
//             body: JSON.stringify({
//                 message: "Login successful.",
//                 data: {
//                     firebaseUid: userRecord.uid,
//                     email: userRecord.email,
//                     displayName: userRecord.displayName,
//                     idToken: data.idToken,            // Firebase ID token
//                     refreshToken: data.refreshToken,   // Refresh token
//                     expiresIn: data.expiresIn         // Token expiration time
//                 },
//             }),
//         };
//     } catch (err) {
//         console.error("❌ Error logging in user:", err);
//         return {
//             statusCode: 401,
//             body: JSON.stringify({ 
//                 message: "Invalid credentials.",
//                 error: err.message 
//             }),
//         };
//     }
// }