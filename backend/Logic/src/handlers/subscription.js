// subscription.js
// Handles subscription operations for candidates and employers.
// Supported routes: PurchaseSubscription, GetSubscription, CancelSubscription.

import { getDBConnection } from '../utils/db.js';
import { getSecrets } from '../utils/secrets.js';

// Define CORS headers as specified.
const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
};

export const lambdaHandler = async (event) => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    console.log("🔹 OPTIONS preflight request");
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, message: "Preflight successful" })
    };
  }
  
  console.log("🔹 Subscription Handler - Raw event:", JSON.stringify(event));

  try {
    // Retrieve secrets (e.g., DB credentials)
    const secret = await getSecrets("inspireedge", "ap-south-1");
    console.log("✅ Secrets retrieved.");
    
    // Establish database connection
    const conn = await getDBConnection(secret);
    console.log("✅ DB connection established.");

    // Parse and merge event body if exists
    let bodyObj = {};
    if (event.body) {
      try {
        bodyObj = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
      } catch (err) {
        console.error("❌ Error parsing event.body:", err);
      }
    }
    Object.assign(event, bodyObj);
    console.log("🔹 Merged event:", JSON.stringify(event));

    // Determine the requested route
    let route = event.route ||
                (event.queryStringParameters && event.queryStringParameters.route) ||
                (event.pathParameters && event.pathParameters.route);
    if (!route && event.path) {
      const parts = event.path.split('/');
      route = parts[parts.length - 1];
    }
    if (!route) {
      console.error("❌ Route not specified.");
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, message: "Route not specified" })
      };
    }
    console.log("🔹 Resolved route:", route);

    // Dispatch to appropriate function based on route
    switch (route) {
      case "PurchaseSubscription":
        return await purchaseSubscription(conn, event);
      case "GetSubscription":
        return await getSubscription(conn, event);
      case "CancelSubscription":
        return await cancelSubscription(conn, event);
      default:
        console.error("❌ Invalid route:", route);
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ success: false, message: "Invalid Route" })
        };
    }
  } catch (err) {
    console.error("❌ Subscription Handler - Unhandled error:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, message: err.message })
    };
  }
};

//
// PurchaseSubscription: Creates or updates a subscription record.
// For job seekers, price is ₹8000 and coins allocated are 8000.
// For job providers, price is ₹15000 (coins can be handled differently).
//
async function purchaseSubscription(conn, event) {
  try {
    const { firebase_uid, subscription_type, start_date, payment_amount } = event;
    if (!firebase_uid || !subscription_type || !start_date || !payment_amount) {
      throw new Error("Required fields: firebase_uid, subscription_type, start_date, payment_amount");
    }
    
    console.log("🔹 PurchaseSubscription for firebase_uid:", firebase_uid, "as", subscription_type);

    let price, coinsAllocated;
    if (subscription_type === "jobseeker") {
      price = 8000;
      coinsAllocated = 8000;  // Candidate receives 8000 coins upon purchase.
    } else if (subscription_type === "jobprovider") {
      price = 15000;
      coinsAllocated = 15000;     // Adjust coin rewards for employers as needed.
    } else {
      throw new Error("Invalid subscription_type");
    }
    
    // Insert or update the subscription record (end_date is one year from start_date)
    const [result] = await conn.execute(
      `INSERT INTO subscriptions 
       (firebase_uid, subscription_type, price, status, start_date, end_date, coins_allocated, coins_balance, created_at, updated_at)
       VALUES (?, ?, ?, 'active', ?, DATE_ADD(?, INTERVAL 1 YEAR), ?, ? , NOW(), NOW())
       ON DUPLICATE KEY UPDATE 
         subscription_type = VALUES(subscription_type), 
         price = VALUES(price),
         status = VALUES(status),
         start_date = VALUES(start_date),
         end_date = VALUES(end_date),
         coins_allocated = VALUES(coins_allocated),
         coins_balance = VALUES(coins_balance),
         updated_at = NOW()`,
      [firebase_uid, subscription_type, price, start_date, start_date, coinsAllocated, coinsAllocated]
    );
    
    await conn.commit();
    console.log("✅ Subscription purchased for firebase_uid:", firebase_uid);
    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, message: "Subscription purchased", firebase_uid })
    };
  } catch (err) {
    console.error("❌ Error in purchaseSubscription:", err.message);
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, message: err.message })
    };
  } finally {
    if (conn) {
      conn.release();
      console.log("🔹 DB connection released in purchaseSubscription.");
    }
  }
}

//
// GetSubscription: Retrieves the subscription details for a given firebase_uid.
//
async function getSubscription(conn, event) {
  try {
    const firebase_uid = event.firebase_uid || (event.queryStringParameters && event.queryStringParameters.firebase_uid);
    if (!firebase_uid) {
      throw new Error("firebase_uid is required");
    }
    
    console.log("🔹 Fetching subscription for firebase_uid:", firebase_uid);
    const [rows] = await conn.execute("SELECT * FROM subscriptions WHERE firebase_uid = ?", [firebase_uid]);
    if (rows.length === 0) {
      console.error("❌ Subscription not found for firebase_uid:", firebase_uid);
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, message: "Subscription not found" })
      };
    }
    
    console.log("✅ Subscription fetched:", rows[0]);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, message: "Subscription fetched", subscription: rows[0] })
    };
  } catch (err) {
    console.error("❌ Error in getSubscription:", err.message);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, message: err.message })
    };
  } finally {
    if (conn) {
      conn.release();
      console.log("🔹 DB connection released in getSubscription.");
    }
  }
}

//
// CancelSubscription: Cancels the subscription by updating its status to 'cancelled' for the given firebase_uid.
//
async function cancelSubscription(conn, event) {
  try {
    const firebase_uid = event.firebase_uid || (event.queryStringParameters && event.queryStringParameters.firebase_uid);
    if (!firebase_uid) {
      throw new Error("firebase_uid is required");
    }
    
    console.log("🔹 Cancelling subscription for firebase_uid:", firebase_uid);
    await conn.execute("UPDATE subscriptions SET status = 'cancelled', updated_at = NOW() WHERE firebase_uid = ?", [firebase_uid]);
    await conn.commit();
    console.log("✅ Subscription cancelled for firebase_uid:", firebase_uid);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, message: "Subscription cancelled" })
    };
  } catch (err) {
    console.error("❌ Error in cancelSubscription:", err.message);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, message: err.message })
    };
  } finally {
    if (conn) {
      conn.release();
      console.log("🔹 DB connection released in cancelSubscription.");
    }
  }
}