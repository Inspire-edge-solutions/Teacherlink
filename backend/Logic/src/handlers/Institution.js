import { getDBConnection } from '../utils/db.js';
import { getSecrets } from '../utils/secrets.js';

export const lambdaHandler = async (event) => {
    console.log("🔹 Lambda function invoked. Event received:", JSON.stringify(event));

    try {
        console.log("🔹 Fetching secrets...");
        const secret = await getSecrets("inspireedge", "ap-south-1");
        console.log("✅ Secrets retrieved successfully.");

        console.log("🔹 Establishing database connection...");
        const conn = await getDBConnection(secret);
        console.log("✅ Database connection established.");

        // Resolve the route parameter
        let route = event.route || (event.body && JSON.parse(event.body).route);
        if (!route && event.queryStringParameters) {
            route = event.queryStringParameters.route;
        }
        console.log("🔹 Resolved route:", route);

        if (!route) {
            console.error("❌ Route not specified in the request.");
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ message: 'Route not specified in request' }),
            };
        }

        // Merge queryStringParameters into event for GET requests
        if (event.httpMethod === 'GET' && event.queryStringParameters) {
            Object.assign(event, event.queryStringParameters);
        }

        console.log("🔹 Processing route:", route);

        switch (route) {
            case "GetInstitution":
                return await getInstitution(conn, event);
            case "CreateInstitution":
                return await createInstitution(conn, event);
            case "UpdateInstitution":
                return await updateInstitution(conn, event);
            case "DeleteInstitution":
                return await deleteInstitution(conn, event);
            default:
                console.error("❌ Invalid route specified:", route);
                return {
                    statusCode: 400,
                    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
                    body: JSON.stringify({ message: 'Invalid Route' }),
                };
        }
    } catch (err) {
        console.error("❌ Unhandled error in Lambda handler:", err);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: err.message }),
        };
    }
};

// Fetch institution details
async function getInstitution(conn, event) {
    console.log("🔹 Fetching institution details...");
    try {
        const id = event.id;
        console.log("🔹 Fetching institution with ID:", id);

        if (!id) {
            console.error("❌ Institution ID is missing in the request.");
            throw new Error("Institution ID is required.");
        }

        const [rows] = await conn.execute("SELECT * FROM institutions WHERE id = ?", [id]);
        console.log("✅ Institution data fetched:", rows);

        if (rows.length === 0) {
            console.error("❌ No institution found with the provided ID:", id);
            throw new Error("Institution not found.");
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
        console.error("❌ Error fetching institution:", err);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: err.message }),
        };
    }
}

// Create a new institution
async function createInstitution(conn, event) {
    console.log("\uD83D\uDD39 Creating institution...");
    try {
        const { name, address, contact_email, contact_phone } = event;
        console.log("\uD83D\uDD39 Institution details received:", { name, address, contact_email, contact_phone });

        if (!name || !address) {
            console.error("❌ Missing required fields.");
            throw new Error("Required fields: name, address.");
        }

        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
        await conn.execute(
            "INSERT INTO institutions (name, address, contact_email, contact_phone, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
            [name, address, contact_email || null, contact_phone || null, now, now]
        );

        console.log("✅ Institution created successfully in the database.");
        await conn.commit();
        await conn.end();

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: 'Institution created successfully' }),
        };
    } catch (err) {
        console.error("❌ Error creating institution:", err);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: err.message }),
        };
    }
}

// Update an institution
async function updateInstitution(conn, event) {
    console.log("\uD83D\uDD39 Updating institution...");
    try {
        const { id, name, address, contact_email, contact_phone } = event;
        console.log("\uD83D\uDD39 Data received for update:", { id, name, address, contact_email, contact_phone });

        if (!id) {
            console.error("❌ Institution ID is missing in the request.");
            throw new Error("Institution ID is required.");
        }

        const updateFields = [];
        const updateValues = [];

        if (name) {
            updateFields.push("name = ?");
            updateValues.push(name);
        }

        if (address) {
            updateFields.push("address = ?");
            updateValues.push(address);
        }

        if (contact_email) {
            updateFields.push("contact_email = ?");
            updateValues.push(contact_email);
        }

        if (contact_phone) {
            updateFields.push("contact_phone = ?");
            updateValues.push(contact_phone);
        }

        if (updateFields.length === 0) {
            console.error("❌ No fields provided to update.");
            throw new Error("No fields provided to update.");
        }

        updateValues.push(id);

        const query = `
            UPDATE institutions
            SET ${updateFields.join(", ")}, updated_at = NOW()
            WHERE id = ?
        `;

        console.log("\uD83D\uDD39 Final update query:", query);

        const [result] = await conn.execute(query, updateValues);
        console.log("✅ Institution updated successfully:", result);

        await conn.end();
        console.log("\uD83D\uDD39 Database connection closed.");

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "Institution updated successfully" }),
        };
    } catch (err) {
        console.error("❌ Error updating institution:", err);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: err.message }),
        };
    }
}

// Delete an institution
async function deleteInstitution(conn, event) {
    console.log("\uD83D\uDD39 Deleting institution...");
    try {
        const { id } = event;
        console.log("\uD83D\uDD39 Institution ID received for deletion:", id);

        if (!id) {
            console.error("❌ Institution ID is missing in the request.");
            throw new Error("Institution ID is required.");
        }

        console.log("\uD83D\uDD39 Deleting institution from database...");
        const [result] = await conn.execute("DELETE FROM institutions WHERE id = ?", [id]);
        console.log("✅ Institution deleted from database:", result);

        if (result.affectedRows === 0) {
            console.error("❌ No institution found with the provided ID:", id);
            throw new Error("Institution not found.");
        }

        await conn.end();
        console.log("\uD83D\uDD39 Database connection closed.");

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: "Institution deleted successfully" }),
        };
    } catch (err) {
        console.error("❌ Error deleting institution:", err);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ message: err.message }),
        };
    }
}

export const handler = lambdaHandler;