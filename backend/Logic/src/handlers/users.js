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

export const lambdaHandler = async (event, context) => {
    console.log("🔹 Lambda function invoked. Event received:", JSON.stringify(event));

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

        let route = event.route || (event.body && JSON.parse(event.body).route);
        if (!route && event.pathParameters) {
            route = event.pathParameters.route;
        }
        console.log("🔹 Resolved route:", route);

        if (!route) {
            console.error("❌ Route not specified in the request.");
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ message: 'Route not specified in request' })
            };
        }

        if (event.body && typeof event.body === 'string') {
            Object.assign(event, JSON.parse(event.body));
        }

        console.log("🔹 Processing route:", route);

        switch (route) {
            case "GetUser":
                return await getUser(conn, event, auth);
            case "CreateUser":
                return await createUser(conn, event);
            case "CreateUserAdmin":
                return await createUserAdmin(conn, event, auth);
            case "UpdateUser":
                return await updateUser(conn, event, auth);
            case "DeleteUser":
                return await deleteUser(conn, event, auth);
            default:
                console.error("❌ Invalid route specified:", route);
                return {
                    statusCode: 400,
                    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                    body: JSON.stringify({ message: 'Invalid Route' })
                };
        }
    } catch (err) {
        console.error("❌ Unhandled error in Lambda handler:", err);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: err.message })
        };
    }
};

async function getUser(conn, event, auth) {
    console.log("🔹 Getting user details...");
    try {
        const f_id = event.f_id;
        console.log("🔹 Fetching user with ID:", f_id);

        if (!f_id) {
            console.error("❌ f_id is missing in the request.");
            throw new Error("f_id is required.");
        }

        const [rows] = await conn.execute("SELECT * FROM users WHERE f_id = ?", [f_id]);
        console.log("✅ User data fetched:", rows);

        if (rows.length === 0) {
            console.error("❌ No user found with the provided f_id:", f_id);
            throw new Error("User not found.");
        }

        const result = rows[0];
        await conn.end();
        console.log("🔹 Database connection closed.");

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "success", data: result }),
        };
    } catch (err) {
        console.error("❌ Error fetching user:", err);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: err.message }),
        };
    }
}

// async function createUser(conn, event) {
//     console.log("🔹 Creating user...");
//     try {
//         // const { email, first_name, last_name, role } = event;
//         const { email, password, first_name, last_name, role } = event;
//         console.log("🔹 User details received:", { email, password, first_name, last_name, role });

//         if (!email || !password || !first_name || !last_name || !role) {
//             console.error("❌ Missing required fields.");
//             throw new Error("Required fields: email, password,  first_name, last_name, role.");
//         }

//         const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
//         await conn.execute(
//             "INSERT INTO users (email, password,  first_name, last_name, role, created_at, updated_at, is_active, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
//             [email, password,  first_name, last_name, role, now, now, 1, 1, 1]
//         );

//         console.log("✅ User created successfully in the database.");
//         await conn.commit();
//         await conn.end();

//         return {
//             statusCode: 200,
//             headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
//             body: JSON.stringify({ message: 'User created successfully' })
//         };
//     } catch (err) {
//         console.error("❌ Error creating user:", err);
//         return {
//             statusCode: 500,
//             headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
//             body: JSON.stringify({ message: err.message }),
//         };
//     }
// }

async function createUser(conn, event) {
    console.log("🔹 Creating user...");
    try {
        const { email, password, first_name, last_name, role, firebase_uid } = event;
        console.log("🔹 User details received:", { email, password, first_name, last_name, role, firebase_uid });

        if (!email || !password || !first_name || !last_name || !role || !firebase_uid) {
            console.error("❌ Missing required fields.");
            throw new Error("Required fields: email, password, first_name, last_name, role, firebase_uid.");
        }

        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await conn.execute(
            "INSERT INTO users (email, password, first_name, last_name, role, firebase_uid, created_at, updated_at, is_active, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [email, password, first_name, last_name, role, firebase_uid, now, now, 1, 1, 1]
        );

        console.log("✅ User created successfully in the database.");
        await conn.commit();
        await conn.end();

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: 'User created successfully' }),
        };
    } catch (err) {
        console.error("❌ Error creating user:", err);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: err.message }),
        };
    }
}

async function createUserAdmin(conn, event, auth) {
    console.log("🔹 Creating admin user...");
    try {
        const { email, first_name, last_name, role } = event;
        console.log("🔹 Admin user details:", { email, first_name, last_name, role });

        if (!email || !first_name || !last_name || !role) {
            console.error("❌ Missing required fields for admin user creation.");
            throw new Error("Required fields: email, first_name, last_name, role.");
        }

        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const password = generateRandomPassword();
        console.log("🔹 Generated password for admin:", password);

        const userRecord = await auth.createUser({ email, password });
        console.log("✅ User created in Firebase Auth. UID:", userRecord.uid);

        await conn.execute(
            "INSERT INTO users (email, first_name, last_name, role, created_at, updated_at, is_active, created_by, updated_by, f_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [email, first_name, last_name, role, now, now, 1, 1, 1, userRecord.uid]
        );

        console.log("✅ Admin user created successfully in the database.");
        await conn.commit();
        await conn.end();

        console.log("🔹 Sending welcome email...");
        const subject = "Welcome to TeacherLink";
        const body = `Welcome to TeacherLink! Your password is: ${password}`;
        await sendEmail(email, subject, body);
        console.log("✅ Welcome email sent successfully.");

        return {
            statusCode: 201,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: 'User created successfully' })
        };
    } catch (err) {
        console.error("❌ Error creating admin user:", err);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: err.message }),
        };
    }
}

async function updateUser(conn, event, auth) {
    console.log("🔹 Updating user details...");
    try {
        const { f_id, first_name, last_name, role } = event;
        console.log("🔹 Data received for update:", { f_id, first_name, last_name, role });

        if (!f_id) {
            console.error("❌ f_id is missing in the request.");
            throw new Error("f_id is required.");
        }

        const updateFields = [];
        const updateValues = [];

        if (first_name) {
            updateFields.push("first_name = ?");
            updateValues.push(first_name);
        }

        if (last_name) {
            updateFields.push("last_name = ?");
            updateValues.push(last_name);
        }

        if (role) {
            updateFields.push("role = ?");
            updateValues.push(role);
        }

        if (updateFields.length === 0) {
            console.error("❌ No fields provided to update.");
            throw new Error("No fields provided to update.");
        }

        updateValues.push(f_id);

        const query = `
            UPDATE users
            SET ${updateFields.join(", ")}, updated_at = NOW()
            WHERE f_id = ?
        `;

        console.log("🔹 Final update query:", query);

        const [result] = await conn.execute(query, updateValues);
        console.log("✅ User updated successfully:", result);

        await conn.end();
        console.log("🔹 Database connection closed.");

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "User updated successfully" }),
        };
    } catch (err) {
        console.error("❌ Error updating user:", err);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: err.message }),
        };
    }
}

async function deleteUser(conn, event, auth) {
    console.log("🔹 Deleting user...");
    try {
        const { f_id } = event;
        console.log("🔹 User ID received for deletion:", f_id);

        if (!f_id) {
            console.error("❌ f_id is missing in the request.");
            throw new Error("f_id is required.");
        }

        // Delete from Firebase Authentication
        console.log("🔹 Deleting user from Firebase...");
        await auth.deleteUser(f_id);
        console.log("✅ User deleted from Firebase.");

        // Delete from MySQL database
        console.log("🔹 Deleting user from database...");
        const [result] = await conn.execute("DELETE FROM users WHERE f_id = ?", [f_id]);
        console.log("✅ User deleted from database:", result);

        if (result.affectedRows === 0) {
            console.error("❌ No user found with the provided f_id:", f_id);
            throw new Error("User not found in database.");
        }

        await conn.end();
        console.log("🔹 Database connection closed.");

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "User deleted successfully" }),
        };
    } catch (err) {
        console.error("❌ Error deleting user:", err);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: err.message }),
        };
    }
}

export const handler = lambdaHandler;
