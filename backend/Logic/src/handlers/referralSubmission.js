// referralSubmission.js
// Handles bulk referral submissions.
// The referrer submits exactly 20 contact numbers; these are stored in referral_contacts.
// A bulk referral token is generated and returned as a shareable referral link.

import { getDBConnection } from '../utils/db.js';
import { getSecrets } from '../utils/secrets.js';
import randomstring from 'randomstring';

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
};

export const lambdaHandler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, message: "Preflight successful" })
    };
  }
  console.log("🔹 Referral Submission Handler - Raw event:", JSON.stringify(event));
  
  try {
    const secret = await getSecrets("inspireedge", "ap-south-1");
    const conn = await getDBConnection(secret);
    
    let bodyObj = {};
    if (event.body) {
      try {
        bodyObj = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      } catch (err) {
        console.error("Error parsing event.body:", err);
      }
    }
    Object.assign(event, bodyObj);
    
    const { firebase_uid, contacts } = event;
    if (!firebase_uid || !contacts || !Array.isArray(contacts)) {
      throw new Error("firebase_uid and contacts (array) are required.");
    }
    if (contacts.length !== 20) {
      throw new Error("Exactly 20 contact numbers are required.");
    }
    
    // Insert each contact into referral_contacts with a temporary null referral_token.
    for (let contact of contacts) {
      await conn.execute(
        "INSERT INTO referral_contacts (referrer_firebase_uid, referral_token, contact_number, created_at) VALUES (?, ?, ?, NOW())",
        [firebase_uid, null, contact]
      );
    }
    
    // Generate a unique bulk referral token.
    const referral_token = randomstring.generate(10);
    
    // Update all rows for this referrer with the new referral token.
    await conn.execute(
      "UPDATE referral_contacts SET referral_token = ? WHERE referrer_firebase_uid = ? AND referral_token IS NULL",
      [referral_token, firebase_uid]
    );
    
    // Create a referral record marked as bulk.
    await conn.execute(
      "INSERT INTO referrals (referrer_firebase_uid, referral_token, is_bulk, created_at) VALUES (?, ?, TRUE, NOW())",
      [firebase_uid, referral_token]
    );
    await conn.commit();
    
    // Construct a referral link (update the domain accordingly).
    const referralLink = `https://yourwebsite.com/referral?token=${referral_token}`;
    
    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: "Bulk referral submission successful",
        referral_token,
        referralLink
      })
    };
  } catch (err) {
    console.error("Error in referral submission:", err.message);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, message: err.message })
    };
  }
};