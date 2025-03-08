import crypto from "crypto";
import { sendEmail } from "../utils/emailer.js";
import { getDBConnection } from "../utils/db.js";

export async function createOTP(event) {
    console.log("🔹 Received event body:", event.body); // Debug log
    let conn;

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

    try {
        if (!event.body) throw new Error("Request body is missing.");

        const { email } = JSON.parse(event.body);
        if (!email) throw new Error("Email is required.");

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const expiryTime = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes expiry
            .toISOString().slice(0, 19).replace("T", " ");

        // Get DB connection
        conn = await getDBConnection();

        // Insert OTP without overwriting previous ones
        await conn.execute(
            "INSERT INTO otps (email, otp, expires_at) VALUES (?, ?, ?)",
            [email, otp, expiryTime]
        );

        console.log(`✅ OTP generated for ${email}: ${otp}`); // Log OTP for debugging

        // Send OTP via email with better styling
        const subject = "🔐 Your One-Time Password (OTP)";
        const body = `
            <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9; text-align: center;">
                <h2 style="color: #333;">🔑 OTP for Password Reset</h2>
                <p style="font-size: 16px; color: #555;">
                    Use the OTP below to reset your password. This OTP is valid for <b>10 minutes</b>.
                </p>
                <div style="font-size: 24px; font-weight: bold; color:rgb(41, 255, 34); background: #fff; padding: 10px 20px; display: inline-block; border-radius: 6px; border: 1px dashed #ff5722; margin: 10px 0;">
                    ${otp}
                </div>
                <p style="font-size: 14px; color: #888;">
                    If you did not request this, please ignore this email. Your account security is our priority.
                </p>
                <hr style="border: 0; height: 1px; background: #ddd; margin: 20px 0;">
                <p style="font-size: 12px; color: #aaa;">&copy; ${new Date().getFullYear()} TeacherLink. All rights reserved.</p>
            </div>
        `;
        await sendEmail(email, subject, body);

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
            },
            body: JSON.stringify({ success: true, message: "OTP sent successfully." })
        };
    } catch (err) {
        console.error("❌ Error generating OTP:", err.message);
        return {
            statusCode: 400,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
            },
            body: JSON.stringify({ success: false, message: err.message })
        };
    } finally {
        if (conn) conn.release(); // Properly release the connection
    }
}
