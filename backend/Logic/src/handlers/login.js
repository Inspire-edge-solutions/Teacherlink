import { getFirebaseAuth } from '../utils/firebase.js';
import pool from '../utils/db.js';
import { getSecrets } from '../utils/secrets.js';
import bcrypt from 'bcryptjs';

// CORS headers function
const getCorsHeaders = () => ({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
});

export const lambdaHandler = async (event) => {
    console.log("🔹 Lambda function invoked. Event:", JSON.stringify(event));

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: getCorsHeaders(), body: '' };
    }

    let conn;
    try {
        console.log("🔹 Fetching secrets...");
        await getSecrets("inspire-edge-db-secret", "ap-south-1");
        console.log("✅ Secrets retrieved.");

        console.log("🔹 Establishing database connection...");
        conn = await pool.getConnection();
        console.log("✅ DB connection established.");

        let route = event.route || (event.body && JSON.parse(event.body).route);
        if (!route && event.pathParameters) route = event.pathParameters.route;

        console.log("🔹 Resolved route:", route);
        if (!route) return { statusCode: 400, body: JSON.stringify({ message: "Route not specified." }), headers: getCorsHeaders() };

        if (event.body && typeof event.body === "string") Object.assign(event, JSON.parse(event.body));

        switch (route) {
            case "RegisterUser": return await registerUser(conn, event);
            case "LoginUser": return await loginUser(conn, event);
            default: return { statusCode: 400, body: JSON.stringify({ message: "Invalid Route." }), headers: getCorsHeaders() };
        }
    } catch (err) {
        console.error("❌ Error:", err);
        return { statusCode: 500, body: JSON.stringify({ message: err.message }), headers: getCorsHeaders() };
    } finally {
        if (conn) conn.release();
    }
};

async function registerUser(conn, event) {
    console.log("🔹 Registering new user...");
    const { name, email, password, phone_number } = event;

    if (!name || !email || !password || !phone_number) {
        console.error("❌ Missing required fields:", { name, email, password, phone_number });
        return { statusCode: 400, body: JSON.stringify({ message: "All fields are required." }), headers: getCorsHeaders() };
    }

    let firebaseUid;
    try {
        const auth = await getFirebaseAuth();

        const userRecord = await auth.getUserByEmail(email).catch(err => {
            if (err.code !== 'auth/user-not-found') throw err;
        });

        if (userRecord) return { statusCode: 400, body: JSON.stringify({ message: "Email already in use." }), headers: getCorsHeaders() };

        const userCredential = await auth.createUser({ email, password, displayName: name });
        firebaseUid = userCredential.uid;
        console.log("✅ User created in Firebase. UID:", firebaseUid);

        const userId = `user_${Date.now()}`;
        const hashedPassword = await bcrypt.hash(password, 10);
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

        await conn.execute(
            "INSERT INTO users (user_id, firebase_uid, name, email, password, phone_number, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [userId, firebaseUid, name, email, hashedPassword, phone_number, now]
        );

        console.log("✅ User registered in database.");
        return { statusCode: 201, body: JSON.stringify({ message: "User registered successfully." }), headers: getCorsHeaders() };
    } catch (err) {
        if (firebaseUid) await (await getFirebaseAuth()).deleteUser(firebaseUid).catch(console.error);
        console.error("❌ Error registering user:", err);
        return { statusCode: 500, body: JSON.stringify({ message: "Internal Server Error." }), headers: getCorsHeaders() };
    }
}

async function loginUser(conn, event) {
    console.log("🔹 Logging in user...");
    const { email, password } = event;

    if (!email || !password) {
        console.error("❌ Missing email or password:", { email, password });
        return { statusCode: 400, body: JSON.stringify({ message: "Email and password are required." }), headers: getCorsHeaders() };
    }

    try {
        const [rows] = await conn.execute("SELECT firebase_uid, password FROM users WHERE email = ?", [email]);
        if (rows.length === 0 || !(await bcrypt.compare(password, rows[0].password))) {
            console.error("❌ Invalid credentials");
            return { statusCode: 401, body: JSON.stringify({ message: "Invalid credentials." }), headers: getCorsHeaders() };
        }

        console.log("✅ User authenticated. Fetching Firebase user...");
        const auth = await getFirebaseAuth();
        const userRecord = await auth.getUser(rows[0].firebase_uid);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Login successful.",
                data: {
                    firebaseUid: userRecord.uid,
                    email: userRecord.email,
                    displayName: userRecord.displayName,
                },
            }),
            headers: getCorsHeaders(),
        };
    } catch (err) {
        console.error("❌ Error logging in user:", err);
        return { statusCode: 500, body: JSON.stringify({ message: "Internal Server Error." }), headers: getCorsHeaders() };
    }
}

export const handler = lambdaHandler;
