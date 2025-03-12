// referral.js
// Handles referral operations: creating referral tokens and redeeming them.
// This version supports both standard referrals (RedeemReferral) and marketing tokens (RedeemMarketingToken).
// Marketing tokens are flagged with `is_marketing = TRUE` and, when redeemed, directly credit bonus coins
// (for example, 8000 for jobseekers and 15000 for jobproviders).

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
    console.log("🔹 OPTIONS preflight in Referral Handler");
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, message: "Preflight successful" })
    };
  }
  
  console.log("🔹 Referral Handler - Raw event:", JSON.stringify(event));
  
  try {
    const secret = await getSecrets("inspireedge", "ap-south-1");
    const conn = await getDBConnection(secret);
    
    // Parse and merge event body (if provided)
    let bodyObj = {};
    if (event.body) {
      try {
        bodyObj = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
      } catch (err) {
        console.error("❌ Error parsing event.body:", err);
      }
    }
    Object.assign(event, bodyObj);
    
    // Determine route either from event.route, query parameters, or path
    let route = event.route || (event.queryStringParameters && event.queryStringParameters.route);
    if (!route && event.path) {
      const parts = event.path.split('/');
      route = parts[parts.length - 1];
    }
    if (!route) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, message: "Route not specified" })
      };
    }
    console.log("🔹 Referral Handler - Resolved route:", route);
    
    // Dispatch to the appropriate function based on the route
    switch (route) {
      case "CreateReferral":
        return await createReferral(conn, event);
      case "RedeemReferral":
        return await redeemReferral(conn, event);
      case "RedeemMarketingToken":
        return await redeemMarketingToken(conn, event);
      default:
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ success: false, message: "Invalid Route" })
        };
    }
  } catch (err) {
    console.error("❌ Referral Handler - Unhandled error:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, message: err.message })
    };
  }
};

//
// createReferral: Generates a unique referral token.
// If "is_marketing": true is provided in the request, the token is flagged as a marketing token.
//
async function createReferral(conn, event) {
  try {
    const { firebase_uid, is_marketing } = event;
    if (!firebase_uid) {
      throw new Error("firebase_uid is required to create a referral.");
    }
    // Generate a unique 10-character referral token.
    const referral_token = randomstring.generate(10);
    console.log("🔹 Generated referral token:", referral_token);
    
    // Insert the referral record with the is_marketing flag.
    await conn.execute(
      "INSERT INTO referrals (referrer_firebase_uid, referral_token, is_marketing, created_at) VALUES (?, ?, ?, NOW())",
      [firebase_uid, referral_token, is_marketing ? true : false]
    );
    await conn.commit();
    
    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, message: "Referral token created", referral_token })
    };
  } catch (err) {
    console.error("❌ Error creating referral:", err.message);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, message: err.message })
    };
  } finally {
    if (conn) {
      conn.release();
      console.log("🔹 DB connection released in createReferral.");
    }
  }
}

//
// redeemReferral: Standard redemption process.
// It updates the referral record by marking it as redeemed and storing the new user's Firebase UID.
// After redemption, you can count referrals and reward the referrer based on your business logic.
//
async function redeemReferral(conn, event) {
  try {
    const { referral_token, new_firebase_uid } = event;
    if (!referral_token || !new_firebase_uid) {
      throw new Error("referral_token and new_firebase_uid are required for redemption.");
    }
    
    const [referrals] = await conn.execute(
      "SELECT * FROM referrals WHERE referral_token = ?",
      [referral_token]
    );
    if (referrals.length === 0) {
      throw new Error("Invalid referral token.");
    }
    const referral = referrals[0];
    if (referral.redeemed) {
      throw new Error("Referral token has already been redeemed.");
    }
    
    // Mark the referral as redeemed and record the new user's Firebase UID.
    await conn.execute(
      "UPDATE referrals SET referred_firebase_uid = ?, redeemed = TRUE WHERE referral_token = ?",
      [new_firebase_uid, referral_token]
    );
    await conn.commit();
    
    // (Optional) Count successful referrals for the referrer and award bonus if threshold reached.
    // For example:
    const [countResult] = await conn.execute(
      "SELECT COUNT(*) AS referralCount FROM referrals WHERE referrer_firebase_uid = ? AND redeemed = TRUE",
      [referral.referrer_firebase_uid]
    );
    const referralCount = countResult[0].referralCount;
    console.log("🔹 Total successful referrals for referrer:", referralCount);
    
    // If threshold is met (e.g., 10 referrals), you can award bonus coins.
    // This is optional and may be handled elsewhere.
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, message: "Referral redeemed successfully" })
    };
  } catch (err) {
    console.error("❌ Error redeeming referral:", err.message);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, message: err.message })
    };
  } finally {
    if (conn) {
      conn.release();
      console.log("🔹 DB connection released in redeemReferral.");
    }
  }
}

//
// redeemMarketingToken: Processes redemption of a marketing token.
// When a user redeems a marketing token, they directly receive bonus coins based on their subscription type:
//   - For jobseekers: 8000 coins
//   - For jobproviders: 15000 coins
//
async function redeemMarketingToken(conn, event) {
  try {
    const { referral_token, firebase_uid } = event;
    if (!referral_token || !firebase_uid) {
      throw new Error("referral_token and firebase_uid are required for marketing token redemption.");
    }
    
    // Look up the referral record that is marked as a marketing token.
    const [referrals] = await conn.execute(
      "SELECT * FROM referrals WHERE referral_token = ? AND is_marketing = TRUE",
      [referral_token]
    );
    if (referrals.length === 0) {
      throw new Error("Invalid marketing referral token.");
    }
    const referral = referrals[0];
    if (referral.redeemed) {
      throw new Error("This marketing token has already been redeemed.");
    }
    
    // Mark the token as redeemed and associate it with the user's Firebase UID.
    await conn.execute(
      "UPDATE referrals SET redeemed = TRUE, referred_firebase_uid = ? WHERE referral_token = ?",
      [firebase_uid, referral_token]
    );
    await conn.commit();
    
    // Retrieve the subscription record for the user to determine their type.
    const [subs] = await conn.execute(
      "SELECT subscription_type FROM subscriptions WHERE firebase_uid = ?",
      [firebase_uid]
    );
    if (subs.length === 0) {
      throw new Error("Subscription record not found for the user.");
    }
    const { subscription_type } = subs[0];
    
    // Determine bonus coins based on subscription type.
    let bonusCoins = 0;
    if (subscription_type === "jobseeker") {
      bonusCoins = 8000;
    } else if (subscription_type === "jobprovider") {
      bonusCoins = 15000;
    } else {
      throw new Error("Invalid subscription_type");
    }
    
    // Credit the user's subscription record with bonus coins.
    await conn.execute(
      "UPDATE subscriptions SET coins_balance = coins_balance + ?, updated_at = NOW() WHERE firebase_uid = ?",
      [bonusCoins, firebase_uid]
    );
    await conn.commit();
    
    // Log this coin transaction for auditing.
    await conn.execute(
      "INSERT INTO coin_transactions (firebase_uid, transaction_type, amount, description, created_at) VALUES (?, 'MarketingReferralReward', ?, 'Reward from marketing token redemption', NOW())",
      [firebase_uid, bonusCoins]
    );
    await conn.commit();
    
    console.log("✅ Marketing token redeemed successfully. Bonus coins credited:", bonusCoins);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, message: "Marketing token redeemed successfully", bonusCoins: bonusCoins })
    };
    
  } catch (err) {
    console.error("❌ Error redeeming marketing token:", err.message);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, message: err.message })
    };
  } finally {
    if (conn) {
      conn.release();
      console.log("🔹 DB connection released in redeemMarketingToken.");
    }
  }
}
