// referralRegistration.js
// Handles the automatic processing of a bulk referral registration.
// When a new user registers using the referral link, they provide the referral_token, their Firebase UID,
// and the contact_number (which must match one of the 20 pre-submitted contacts).
// This function marks that contact as registered and checks if the threshold is met to award a bonus.

import { getDBConnection } from '../utils/db.js';
import { getSecrets } from '../utils/secrets.js';

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
  console.log("🔹 Referral Registration Handler - Raw event:", JSON.stringify(event));
  
  try {
    const secret = await getSecrets("inspireedge", "ap-south-1");
    const conn = await getDBConnection(secret);
    
    let bodyObj = {};
    if (event.body) {
      try {
        bodyObj = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
      } catch (err) {
        console.error("Error parsing event.body:", err);
      }
    }
    Object.assign(event, bodyObj);
    
    const { referral_token, new_firebase_uid, contact_number } = event;
    if (!referral_token || !new_firebase_uid || !contact_number) {
      throw new Error("referral_token, new_firebase_uid, and contact_number are required.");
    }
    
    // Update the referral_contacts record for this contact.
    const [updateResult] = await conn.execute(
      "UPDATE referral_contacts SET is_registered = TRUE, registration_date = NOW() WHERE referral_token = ? AND contact_number = ? AND is_registered = FALSE",
      [referral_token, contact_number]
    );
    if (updateResult.affectedRows === 0) {
      throw new Error("This contact number is either not valid for this referral or already registered.");
    }
    await conn.commit();
    
    // Count how many contacts (of the 20) are now registered.
    const [countResult] = await conn.execute(
      "SELECT COUNT(*) AS regCount FROM referral_contacts WHERE referral_token = ? AND is_registered = TRUE",
      [referral_token]
    );
    const registeredCount = countResult[0].regCount;
    console.log("🔹 Total registered contacts for referral_token:", registeredCount);
    
    // Retrieve the referral record.
    const [referralRows] = await conn.execute(
      "SELECT * FROM referrals WHERE referral_token = ? AND is_bulk = TRUE",
      [referral_token]
    );
    if (referralRows.length === 0) {
      throw new Error("Bulk referral token not found.");
    }
    const referral = referralRows[0];
    
    // Retrieve the referrer's Firebase UID and user type.
    const referrerFirebaseUID = referral.referrer_firebase_uid;
    const [userRows] = await conn.execute(
      "SELECT user_type FROM users WHERE firebase_uid = ?",
      [referrerFirebaseUID]
    );
    if (userRows.length === 0) {
      throw new Error("User record not found for referrer: " + referrerFirebaseUID);
    }
    const referrerUserType = userRows[0].user_type;
    console.log(`🔹 Referrer user_type: ${referrerUserType}`);
    
    // Fetch bonus configuration from referral_bonus_config.
    const [bonusConfigRows] = await conn.execute(
      "SELECT referral_threshold, bonus_coins FROM referral_bonus_config WHERE user_type = ?",
      [referrerUserType]
    );
    if (bonusConfigRows.length > 0) {
      const { referral_threshold, bonus_coins } = bonusConfigRows[0];
      console.log(`🔹 Bonus config for ${referrerUserType}: threshold = ${referral_threshold}, bonus_coins = ${bonus_coins}`);
      
      // Retrieve the subscription record (including the bonus flag) for the referrer.
      const [subs] = await conn.execute(
        "SELECT referral_bonus_awarded FROM subscriptions WHERE firebase_uid = ?",
        [referrerFirebaseUID]
      );
      if (subs.length > 0) {
        const subscription = subs[0];
        // Award bonus only if not already awarded and the registered contacts count meets/exceeds threshold.
        if (!subscription.referral_bonus_awarded && registeredCount >= referral_threshold) {
          console.log(`🔹 Awarding bonus of ${bonus_coins} coins to ${referrerFirebaseUID}`);
          await conn.execute(
            "UPDATE subscriptions SET coins_balance = coins_balance + ?, referral_bonus_awarded = TRUE, updated_at = NOW() WHERE firebase_uid = ?",
            [bonus_coins, referrerFirebaseUID]
          );
          await conn.commit();
        } else {
          console.log("🔹 Bonus already awarded or threshold not met; no bonus applied.");
        }
      }
    }
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, message: "Referral registration processed successfully" })
    };
    
  } catch (err) {
    console.error("❌ Error in referral registration:", err.message);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, message: err.message })
    };
  } finally {
    if (conn) {
      conn.release();
      console.log("🔹 DB connection released in referral registration.");
    }
  }
};