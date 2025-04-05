// import { getDBConnection } from "../utils/db.js";
// import { getSecrets } from "../utils/secrets.js";
// import randomstring from "randomstring";

// const corsHeaders = {
//   "Content-Type": "application/json",
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
//   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
// };

// export const lambdaHandler = async (event) => {
//   // Handle preflight requests
//   if (event.httpMethod === "OPTIONS") {
//     return {
//       statusCode: 200,
//       headers: corsHeaders,
//       body: JSON.stringify({ success: true, message: "Preflight successful" })
//     };
//   }

//   console.log("🔹 Referral Submission Handler - Raw event:", JSON.stringify(event));

//   let conn;
//   try {
//     // Get DB connection using secrets
//     const secret = await getSecrets("inspireedge", "ap-south-1");
//     conn = await getDBConnection(secret);

//     // Parse incoming payload
//     let bodyObj = {};
//     if (event.body) {
//       try {
//         bodyObj = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
//       } catch (err) {
//         console.error("Error parsing event.body:", err);
//       }
//     }
//     Object.assign(event, bodyObj);

//     // Expected payload:
//     // For Candidates: { firebase_uid, user_type, contacts }
//     // For Employers: { firebase_uid, user_type, institutions }
//     const { firebase_uid, user_type, contacts, institutions } = event;
//     if (!firebase_uid || !user_type) {
//       throw new Error("firebase_uid and user_type are required.");
//     }

//     // Generate a unique bulk referral token
//     const referral_token = randomstring.generate(10);

//     if (user_type === "Candidate") {
//       if (!contacts || !Array.isArray(contacts)) {
//         throw new Error("Contacts must be provided as an array for Candidate referrals.");
//       }
//       // Filter out empty contacts and require at least 10
//       const nonEmptyContacts = contacts.filter((c) => c.trim() !== "");
//       if (nonEmptyContacts.length < 10) {
//         throw new Error("At least 10 contact numbers are required for Candidate referrals.");
//       }
//       // Insert each valid contact into referral_contacts
//       for (let contact of nonEmptyContacts) {
//         await conn.execute(
//           "INSERT INTO referral_contacts (referrer_firebase_uid, referral_token, contact_number, created_at) VALUES (?, ?, ?, NOW())",
//           [firebase_uid, referral_token, contact]
//         );
//       }
//     } else if (user_type === "Employer") {
//       if (!institutions || !Array.isArray(institutions)) {
//         throw new Error("Institutions must be provided as an array for Employer referrals.");
//       }
//       if (institutions.length !== 5) {
//         throw new Error("Exactly 5 institution referrals are required for Employer referrals.");
//       }
//       // Validate and insert each institution referral
//       for (let inst of institutions) {
//         let institutionName, referredUserType;
//         if (typeof inst === "object") {
//           if (!inst.institutionName || !inst.referredUserType) {
//             throw new Error("Each institution referral must include institutionName and referredUserType.");
//           }
//           institutionName = inst.institutionName;
//           referredUserType = inst.referredUserType;
//         } else if (typeof inst === "string") {
//           if (!inst.trim()) {
//             throw new Error("Institution referral cannot be empty.");
//           }
//           institutionName = inst;
//           // Default to Employer if not provided
//           referredUserType = "Employer";
//         } else {
//           throw new Error("Invalid institution referral format.");
//         }
//         // Insert the institution referral (using institutionName as contact_number)
//         await conn.execute(
//           "INSERT INTO referral_contacts (referrer_firebase_uid, referral_token, contact_number, created_at) VALUES (?, ?, ?, NOW())",
//           [firebase_uid, referral_token, institutionName]
//         );
//       }
//     } else {
//       throw new Error("Invalid user_type. Allowed values: Candidate, Employer.");
//     }

//     // Create a referral record (marked as bulk)
//     await conn.execute(
//       "INSERT INTO referrals (referrer_firebase_uid, referral_token, is_bulk, created_at) VALUES (?, ?, TRUE, NOW())",
//       [firebase_uid, referral_token]
//     );
//     await conn.commit();

//     // Construct a referral link (update domain as needed)
//     const referralLink = `https://yourwebsite.com/referral?token=${referral_token}`;

//     return {
//       statusCode: 201,
//       headers: corsHeaders,
//       body: JSON.stringify({
//         success: true,
//         message: "Bulk referral submission successful",
//         referral_token,
//         referralLink
//       })
//     };

//   } catch (err) {
//     console.error("❌ Error in referral submission:", err.message);
//     return {
//       statusCode: 500,
//       headers: corsHeaders,
//       body: JSON.stringify({ success: false, message: err.message })
//     };
//   } finally {
//     if (conn) {
//       conn.release();
//       console.log("🔹 DB connection released in referral submission.");
//     }
//   }
// };


import { getDBConnection } from "../utils/db.js";
import { getSecrets } from "../utils/secrets.js";
import randomstring from "randomstring";

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
};

export const lambdaHandler = async (event) => {
  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, message: "Preflight successful" })
    };
  }

  // If this is a GET request, fetch referral data from the database.
  if (event.httpMethod === "GET") {
    let conn;
    try {
      const secret = await getSecrets("inspireedge", "ap-south-1");
      conn = await getDBConnection(secret);

      // For GET requests, we assume firebase_uid is passed as a query parameter.
      // You can extend this to support additional filters if needed.
      const { firebase_uid } = event.queryStringParameters || {};
      if (!firebase_uid) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ success: false, message: "firebase_uid is required as a query parameter." })
        };
      }

      // Fetch referral records (e.g., bulk referrals) for the given firebase_uid.
      const [rows] = await conn.execute(
        "SELECT * FROM referrals WHERE referrer_firebase_uid = ?",
        [firebase_uid]
      );

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ success: true, referrals: rows })
      };

    } catch (err) {
      console.error("❌ Error fetching referrals:", err.message);
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, message: err.message })
      };
    } finally {
      if (conn) {
        conn.release();
        console.log("🔹 DB connection released in GET referrals.");
      }
    }
  }

  // If not a GET request, process POST for submission/registration.
  // (Distinguish between submission and registration based on the payload if needed.)
  console.log("🔹 Referral Submission/Registration Handler - Raw event:", JSON.stringify(event));
  
  let conn;
  try {
    const secret = await getSecrets("inspireedge", "ap-south-1");
    conn = await getDBConnection(secret);
    
    let bodyObj = {};
    if (event.body) {
      try {
        bodyObj = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
      } catch (err) {
        console.error("Error parsing event.body:", err);
      }
    }
    Object.assign(event, bodyObj);

    // Determine whether this is a Registration or Submission request.
    // Here, for example, if referral_token exists in the payload, we treat it as a registration.
    if (event.referral_token) {
      // --- Referral Registration Logic ---
      const { referral_token, new_firebase_uid, contact_number } = event;
      if (!referral_token || !new_firebase_uid || !contact_number) {
        throw new Error("referral_token, new_firebase_uid, and contact_number are required for registration.");
      }
      
      // Mark the matching referral contact as registered.
      const [updateResult] = await conn.execute(
        "UPDATE referral_contacts SET is_registered = TRUE, registration_date = NOW() WHERE referral_token = ? AND contact_number = ? AND is_registered = FALSE",
        [referral_token, contact_number]
      );
      if (updateResult.affectedRows === 0) {
        throw new Error("This contact number is either not valid for this referral or already registered.");
      }
      await conn.commit();
      
      // Count registered contacts.
      const [countResult] = await conn.execute(
        "SELECT COUNT(*) AS regCount FROM referral_contacts WHERE referral_token = ? AND is_registered = TRUE",
        [referral_token]
      );
      const registeredCount = countResult[0].regCount;
      console.log("🔹 Total registered contacts for referral_token:", registeredCount);
      
      // Retrieve referral record.
      const [referralRows] = await conn.execute(
        "SELECT * FROM referrals WHERE referral_token = ? AND is_bulk = TRUE",
        [referral_token]
      );
      if (referralRows.length === 0) {
        throw new Error("Bulk referral token not found.");
      }
      const referral = referralRows[0];
      
      // Get the referrer's Firebase UID and user type.
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
      
      // Fetch bonus configuration.
      const [bonusConfigRows] = await conn.execute(
        "SELECT referral_threshold, bonus_coins FROM referral_bonus_config WHERE user_type = ?",
        [referrerUserType]
      );
      if (bonusConfigRows.length > 0) {
        const { referral_threshold, bonus_coins } = bonusConfigRows[0];
        console.log(`🔹 Bonus config for ${referrerUserType}: threshold = ${referral_threshold}, bonus_coins = ${bonus_coins}`);
        
        // Retrieve subscription record.
        const [subs] = await conn.execute(
          "SELECT referral_bonus_awarded FROM subscriptions WHERE firebase_uid = ?",
          [referrerFirebaseUID]
        );
        if (subs.length > 0) {
          const subscription = subs[0];
          // Award bonus if conditions met.
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

    } else {
      // --- Referral Submission Logic ---
      // Expected payload:
      // For Candidates: { firebase_uid, user_type, contacts }
      // For Employers: { firebase_uid, user_type, institutions }
      const { firebase_uid, user_type, contacts, institutions } = event;
      if (!firebase_uid || !user_type) {
        throw new Error("firebase_uid and user_type are required for submission.");
      }

      // Generate a unique bulk referral token.
      const referral_token = randomstring.generate(10);

      if (user_type === "Candidate") {
        if (!contacts || !Array.isArray(contacts)) {
          throw new Error("Contacts must be provided as an array for Candidate referrals.");
        }
        const nonEmptyContacts = contacts.filter((c) => c.trim() !== "");
        if (nonEmptyContacts.length < 10) {
          throw new Error("At least 10 contact numbers are required for Candidate referrals.");
        }
        for (let contact of nonEmptyContacts) {
          await conn.execute(
            "INSERT INTO referral_contacts (referrer_firebase_uid, referral_token, contact_number, created_at) VALUES (?, ?, ?, NOW())",
            [firebase_uid, referral_token, contact]
          );
        }
      } else if (user_type === "Employer") {
        if (!institutions || !Array.isArray(institutions)) {
          throw new Error("Institutions must be provided as an array for Employer referrals.");
        }
        if (institutions.length !== 5) {
          throw new Error("Exactly 5 institution referrals are required for Employer referrals.");
        }
        for (let inst of institutions) {
          let institutionName, referredUserType;
          if (typeof inst === "object") {
            if (!inst.institutionName || !inst.referredUserType) {
              throw new Error("Each institution referral must include institutionName and referredUserType.");
            }
            institutionName = inst.institutionName;
            referredUserType = inst.referredUserType;
          } else if (typeof inst === "string") {
            if (!inst.trim()) {
              throw new Error("Institution referral cannot be empty.");
            }
            institutionName = inst;
            referredUserType = "Employer";
          } else {
            throw new Error("Invalid institution referral format.");
          }
          await conn.execute(
            "INSERT INTO referral_contacts (referrer_firebase_uid, referral_token, contact_number, created_at) VALUES (?, ?, ?, NOW())",
            [firebase_uid, referral_token, institutionName]
          );
        }
      } else {
        throw new Error("Invalid user_type. Allowed values: Candidate, Employer.");
      }

      // Create a referral record.
      await conn.execute(
        "INSERT INTO referrals (referrer_firebase_uid, referral_token, is_bulk, created_at) VALUES (?, ?, TRUE, NOW())",
        [firebase_uid, referral_token]
      );
      await conn.commit();

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
    }
    
  } catch (err) {
    console.error("❌ Error in referral processing:", err.message);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, message: err.message })
    };
  } finally {
    if (conn) {
      conn.release();
      console.log("🔹 DB connection released.");
    }
  }
};
