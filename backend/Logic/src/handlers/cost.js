// cost.js
// Handles coin-based actions by verifying the user's coin balance and deducting coins accordingly.
// Supported route: ProcessAction

import { getDBConnection } from '../utils/db.js';
import { getSecrets } from '../utils/secrets.js';

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
};

export const lambdaHandler = async (event) => {
  // Handle OPTIONS preflight.
  if (event.httpMethod === 'OPTIONS') {
    console.log("🔹 OPTIONS preflight in Cost Handler");
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, message: "Preflight successful" })
    };
  }
  
  console.log("🔹 Cost Handler - Raw event:", JSON.stringify(event));
  try {
    const secret = await getSecrets("inspireedge", "ap-south-1");
    const conn = await getDBConnection(secret);
    
    let bodyObj = {};
    if (event.body) {
      try {
        bodyObj = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
      } catch (err) {
        console.error("❌ Error parsing event.body:", err);
      }
    }
    Object.assign(event, bodyObj);
    
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
    console.log("🔹 Cost Handler - Resolved route:", route);
    
    switch (route) {
      case "ProcessAction":
        return await processAction(conn, event);
      default:
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ success: false, message: "Invalid Route" })
        };
    }
  } catch (err) {
    console.error("❌ Cost Handler - Unhandled error:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, message: err.message })
    };
  }
};

//
// processAction: Deducts coins for a specified action after verifying sufficient coin balance.
// The deduction cost is determined by the user's subscription type and the action_type.
//
async function processAction(conn, event) {
  try {
    const { firebase_uid, action_type, description } = event;
    if (!firebase_uid || !action_type) {
      throw new Error("Required fields: firebase_uid, action_type");
    }
    
    console.log("🔹 Processing action for:", firebase_uid, "Action:", action_type);
    const [subs] = await conn.execute("SELECT subscription_type, coins_balance FROM subscriptions WHERE firebase_uid = ?", [firebase_uid]);
    if (subs.length === 0) {
      throw new Error("Subscription record not found for this user.");
    }
    const { subscription_type, coins_balance } = subs[0];
    console.log("🔹 Subscription details:", { subscription_type, coins_balance });
    
    // Determine cost based on action_type and subscription type.
    let cost = 0;
    switch (action_type) {
      // Candidate (Job Seeker) Actions:
      case "JobApply":
        cost = (subscription_type === "jobseeker") ? 50 : 0;
        break;
      case "ExtraJobAlert":
        cost = (subscription_type === "jobseeker") ? 100 : 0;
        break;
      case "SendMessageToRecruiter":
        cost = (subscription_type === "jobseeker") ? 10 : 0;
        break;
      case "RecruiterView":
        cost = (subscription_type === "jobseeker") ? 1000 : 0;
        break;
      case "JobStatusNotification":
        cost = (subscription_type === "jobseeker") ? 10 : 0;
        break;
      // Employer (Job Provider) Actions:
      case "JobPosting":
        cost = (subscription_type === "jobprovider") ? 200 : 0;
        break;
      case "AccessCandidateDetails":
        cost = (subscription_type === "jobprovider") ? 200 : 0;
        break;
      case "SendMessageToCandidate":
        cost = (subscription_type === "jobprovider") ? 10 : 0;
        break;
      case "CandidateNotification":
        cost = (subscription_type === "jobprovider") ? 10 : 0;
        break;
      case "FilterMessage":
        cost = (subscription_type === "jobprovider") ? 10 : 0;
        break;
      case "AdvertisingMessage":
        cost = (subscription_type === "jobprovider") ? 100 : 0;
        break;
      default:
        throw new Error("Invalid action_type provided.");
    }
    
    if (cost === 0) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, message: "Action not applicable for your subscription type or invalid action." })
      };
    }
    if (coins_balance < cost) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, message: "Insufficient coin balance." })
      };
    }
    
    // Deduct coins from the user's subscription record.
    await conn.execute(
      "UPDATE subscriptions SET coins_balance = coins_balance - ?, updated_at = NOW() WHERE firebase_uid = ?",
      [cost, firebase_uid]
    );
    await conn.commit();
    
    // Log the coin transaction.
    await conn.execute(
      "INSERT INTO coin_transactions (firebase_uid, transaction_type, amount, description, created_at) VALUES (?, ?, ?, ?, NOW())",
      [firebase_uid, action_type, -cost, description || `Deduction for ${action_type}`]
    );
    await conn.commit();
    
    console.log("✅ Action processed. Deducted:", cost, "coins from", firebase_uid);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, message: "Action processed successfully", cost_deducted: cost })
    };
  } catch (err) {
    console.error("❌ Error processing action:", err.message);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, message: err.message })
    };
  } finally {
    if (conn) {
      conn.release();
      console.log("🔹 DB connection released in processAction.");
    }
  }
}
