import { getDBConnection } from "../utils/db.js";
export async function getOTP(event) {
    console.log("🔹 Validating OTP...");
    
    // ✅ Handle CORS Preflight Requests
    if (event.httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
            },
            body: JSON.stringify({ success: true, message: "CORS preflight success." })
        };
    }

    let conn;

    try {
        // Parse the JSON body safely
        if (!event.body) throw new Error("Request body is missing.");
        const { email, otp } = JSON.parse(event.body);

        if (!email || !otp) throw new Error("Email and OTP are required.");

        // Get a connection from the pool
        conn = await getDBConnection();

        // Fetch the latest valid OTP from the DB
        const [rows] = await conn.execute(
            "SELECT otp, expires_at FROM otps WHERE email = ? ORDER BY created_at DESC LIMIT 1",
            [email]
        );

        if (rows.length === 0) {
            console.warn("❌ No OTP found for email:", email);
            return generateResponse(400, { success: false, message: "Invalid OTP." });
        }

        const { otp: storedOtp, expires_at } = rows[0];

        if (!storedOtp || !expires_at) {
            console.error("❌ OTP data is incomplete for email:", email);
            return generateResponse(400, { success: false, message: "OTP data is incomplete." });
        }

        const currentTime = new Date();
        const expiryTime = new Date(expires_at);

        console.log(`🔹 Stored OTP: ${storedOtp}, Entered OTP: ${otp}`);
        console.log(`🔹 OTP Expiry Time: ${expiryTime}, Current Time: ${currentTime}`);

        if (otp !== storedOtp) {
            return generateResponse(400, { success: false, message: "Invalid OTP." });
        }

        if (currentTime > expiryTime) {
            return generateResponse(400, { success: false, message: "OTP has expired." });
        }

        return generateResponse(200, { success: true, message: "OTP validated successfully." });

    } catch (err) {
        console.error("❌ Error in getOTP:", err.message);
        return generateResponse(500, { success: false, message: err.message });
    } finally {
        if (conn) conn.release(); // Release connection back to pool
    }
}

/**
 * Utility function to generate HTTP responses
 */
function generateResponse(statusCode, body) {
    return {
        statusCode,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
        },
        body: JSON.stringify(body)
    };
}
