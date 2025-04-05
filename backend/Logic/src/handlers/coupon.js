// import { getDBConnection } from '../utils/db.js';
// import { getSecrets } from '../utils/secrets.js';
// import randomstring from 'randomstring';
// import ExcelJS from 'exceljs';
// import AWS from 'aws-sdk';
// import fs from 'fs';
// import axios from 'axios'; // added axios

// const s3 = new AWS.S3();
// const bucketName = process.env.COUPON_BUCKET || 'your-coupon-bucket';

// const corsHeaders = {
//   "Content-Type": "application/json",
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
//   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
// };

// async function shortenUrl(longUrl) {
//   try {
//     const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
//     return response.data; // TinyURL returns the shortened URL in plain text
//   } catch (err) {
//     console.error("Error shortening URL:", err.message);
//     // Fallback: return the long URL if shortening fails.
//     return longUrl;
//   }
// }

// export const lambdaHandler = async (event) => {
//   if (event.httpMethod === 'OPTIONS') {
//     console.log("🔹 OPTIONS preflight in Coupon Handler");
//     return {
//       statusCode: 200,
//       headers: corsHeaders,
//       body: JSON.stringify({ success: true, message: "Preflight successful" })
//     };
//   }
  
//   console.log("🔹 Coupon Handler - Raw event:", JSON.stringify(event));
  
//   let conn;
//   try {
//     const secret = await getSecrets("inspireedge", "ap-south-1");
//     console.log("✅ Secrets retrieved.");
//     conn = await getDBConnection(secret);
//     console.log("✅ DB connection established.");

//     // Parse the incoming body.
//     let bodyObj = {};
//     if (event.body) {
//       try {
//         bodyObj = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
//       } catch (err) {
//         console.error("❌ Error parsing event.body:", err);
//       }
//     }
//     Object.assign(event, bodyObj);
//     console.log("🔹 Merged event:", JSON.stringify(event));
    
//     // Expect a "route" field in the request body.
//     const route = event.route;
//     if (!route) {
//       return {
//         statusCode: 400,
//         headers: corsHeaders,
//         body: JSON.stringify({ success: false, message: "Route not specified" })
//       };
//     }
//     console.log("🔹 Coupon Handler - Resolved route:", route);

//     // Dispatch based on the route.
//     switch (route) {
//       case "GenerateCouponBulk":
//         return await generateCouponBulk(conn, event);
//       case "RedeemCoupon":
//         return await redeemCoupon(conn, event);
//       default:
//         return {
//           statusCode: 400,
//           headers: corsHeaders,
//           body: JSON.stringify({ success: false, message: "Invalid Route" })
//         };
//     }
//   } catch (err) {
//     console.error("❌ Coupon Handler - Unhandled error:", err);
//     return {
//       statusCode: 500,
//       headers: corsHeaders,
//       body: JSON.stringify({ success: false, message: err.message })
//     };
//   } finally {
//     if (conn) {
//       conn.release();
//       console.log("🔹 DB connection released in Coupon Handler.");
//     }
//   }
// };

// async function generateCouponBulk(conn, event) {
//   try {
//     const { user_type, couponCount, discount_percentage } = event;
    
//     if (!user_type || !couponCount || discount_percentage == null) {
//       throw new Error("Required fields: user_type, couponCount, and discount_percentage");
//     }
//     if (!["Candidate", "Employer"].includes(user_type)) {
//       throw new Error("Invalid user_type. Allowed values: Candidate, Employer");
//     }
    
//     // Fetch base coin value from coupon_config.
//     const [configRows] = await conn.execute(
//       "SELECT coins FROM coupon_config WHERE user_type = ?",
//       [user_type]
//     );
//     if (configRows.length === 0) {
//       throw new Error(`Coupon configuration not found for user_type: ${user_type}`);
//     }
//     const baseCoinValue = configRows[0].coins;
//     console.log(`🔹 Base coin value for ${user_type}: ${baseCoinValue}`);
    
//     // Compute effective coin value using discount percentage.
//     const effectiveCoinValue = Math.floor((baseCoinValue * discount_percentage) / 100);
//     console.log(`🔹 Effective coin value after applying ${discount_percentage}% discount: ${effectiveCoinValue}`);
    
//     // Array to store generated coupon details.
//     const coupons = [];
//     for (let i = 0; i < couponCount; i++) {
//       const coupon_code = randomstring.generate(10);
//       await conn.execute(
//         "INSERT INTO coupon_codes (coupon_code, user_type, coin_value, discount_percentage, created_at) VALUES (?, ?, ?, ?, NOW())",
//         [coupon_code, user_type, effectiveCoinValue, discount_percentage]
//       );
//       coupons.push({ coupon_code, user_type, coin_value: effectiveCoinValue, discount_percentage });
//     }
//     await conn.commit();
//     console.log(`✅ Generated ${couponCount} coupons for ${user_type}`);
    
//     // Create an Excel workbook and worksheet.
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet("Coupons");
//     worksheet.columns = [
//       { header: "Coupon Code", key: "coupon_code", width: 20 },
//       { header: "User Type", key: "user_type", width: 15 },
//       { header: "Effective Coin Value", key: "coin_value", width: 20 },
//       { header: "Discount Percentage", key: "discount_percentage", width: 20 }
//     ];
//     coupons.forEach(coupon => {
//       worksheet.addRow(coupon);
//     });
    
//     // Write the workbook to a temporary file.
//     const fileName = `coupons_${user_type}_${Date.now()}.xlsx`;
//     const filePath = `/tmp/${fileName}`;
//     console.log("🔹 Writing Excel file to:", filePath);
//     await workbook.xlsx.writeFile(filePath);
//     console.log("✅ Excel file created at:", filePath);
    
//     // Upload the Excel file to S3.
//     const fileContent = fs.readFileSync(filePath);
//     const uploadParams = {
//       Bucket: bucketName,
//       Key: fileName,
//       Body: fileContent,
//       ContentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     };
//     await s3.upload(uploadParams).promise();
//     console.log(`✅ Excel file uploaded to S3 bucket: ${bucketName} as ${fileName}`);
    
//     // Generate a pre-signed URL (valid for 1 hour).
//     const urlParams = {
//       Bucket: bucketName,
//       Key: fileName,
//       Expires: 3600
//     };
//     const presignedUrl = s3.getSignedUrl('getObject', urlParams);
//     console.log("✅ Pre-signed URL generated:", presignedUrl);
    
//     // Shorten the URL using TinyURL.
//     const shortUrl = await shortenUrl(presignedUrl);
//     console.log("✅ Shortened URL:", shortUrl);
    
//     return {
//       statusCode: 200,
//       headers: corsHeaders,
//       body: JSON.stringify({
//         success: true,
//         message: `Generated ${couponCount} coupons for ${user_type} and uploaded Excel file.`,
//         downloadUrl: shortUrl,
//         coupons
//       })
//     };
    
//   } catch (err) {
//     console.error("❌ Error in bulk coupon generation:", err.message);
//     return {
//       statusCode: 500,
//       headers: corsHeaders,
//       body: JSON.stringify({ success: false, message: err.message })
//     };
//   } finally {
//     if (conn) {
//       conn.release();
//       console.log("🔹 DB connection released in generateCouponBulk.");
//     }
//   }
// }

// async function redeemCoupon(conn, event) {
//   try {
//     const { coupon_code, firebase_uid } = event;
//     if (!coupon_code || !firebase_uid) {
//       throw new Error("Required fields: coupon_code, firebase_uid");
//     }
    
//     const [couponRows] = await conn.execute(
//       "SELECT * FROM coupon_codes WHERE coupon_code = ?",
//       [coupon_code]
//     );
//     if (couponRows.length === 0) {
//       throw new Error("Invalid coupon code.");
//     }
//     const coupon = couponRows[0];
//     if (coupon.redeemed) {
//       throw new Error("This coupon code has already been redeemed.");
//     }
    
//     const [subs] = await conn.execute(
//       "SELECT subscription_type, coins_balance FROM subscriptions WHERE firebase_uid = ?",
//       [firebase_uid]
//     );
//     if (subs.length === 0) {
//       throw new Error("Subscription record not found for this user.");
//     }
//     const { subscription_type } = subs[0];
    
//     if (coupon.user_type !== subscription_type) {
//       throw new Error(`Coupon is valid for ${coupon.user_type} only. Your account is registered as ${subscription_type}.`);
//     }
    
//     await conn.execute(
//       "UPDATE coupon_codes SET redeemed = TRUE, firebase_uid = ?, redeemed_at = NOW() WHERE coupon_code = ?",
//       [firebase_uid, coupon_code]
//     );
//     await conn.commit();
    
//     await conn.execute(
//       "UPDATE subscriptions SET coins_balance = coins_balance + ?, updated_at = NOW() WHERE firebase_uid = ?",
//       [coupon.coin_value, firebase_uid]
//     );
//     await conn.commit();
    
//     await conn.execute(
//       "INSERT INTO coin_transactions (firebase_uid, transaction_type, amount, description, created_at) VALUES (?, 'CouponRedemption', ?, CONCAT('Coupon redeemed: ', ?), NOW())",
//       [firebase_uid, coupon.coin_value, coupon_code]
//     );
//     await conn.commit();
    
//     console.log("✅ Coupon redeemed successfully. Effective coins credited:", coupon.coin_value);
//     return {
//       statusCode: 200,
//       headers: corsHeaders,
//       body: JSON.stringify({ success: true, message: "Coupon redeemed successfully", bonusCoins: coupon.coin_value })
//     };
    
//   } catch (err) {
//     console.error("❌ Error redeeming coupon:", err.message);
//     return {
//       statusCode: 500,
//       headers: corsHeaders,
//       body: JSON.stringify({ success: false, message: err.message })
//     };
//   } finally {
//     if (conn) {
//       conn.release();
//       console.log("🔹 DB connection released in redeemCoupon.");
//     }
//   }
// }

import { getDBConnection } from '../utils/db.js';
import { getSecrets } from '../utils/secrets.js';
import randomstring from 'randomstring';
import ExcelJS from 'exceljs';
import AWS from 'aws-sdk';
import fs from 'fs';
import axios from 'axios';

const s3 = new AWS.S3();
const bucketName = process.env.COUPON_BUCKET || 'your-coupon-bucket';

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
};

// Helper function to shorten URLs using TinyURL
async function shortenUrl(longUrl) {
  try {
    const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
    return response.data; // Returns the shortened URL as plain text
  } catch (err) {
    console.error("Error shortening URL:", err.message);
    return longUrl; // Fallback to the original URL if shortening fails
  }
}

export const lambdaHandler = async (event) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    console.log("🔹 OPTIONS preflight in Coupon Handler");
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, message: "Preflight successful" })
    };
  }
  
  console.log("🔹 Coupon Handler - Raw event:", JSON.stringify(event));
  
  let conn;
  try {
    const secret = await getSecrets("inspireedge", "ap-south-1");
    console.log("✅ Secrets retrieved.");
    conn = await getDBConnection(secret);
    console.log("✅ DB connection established.");

    // Parse the incoming body.
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
    
    // Expect a "route" field in the request body.
    const route = event.route;
    if (!route) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, message: "Route not specified" })
      };
    }
    console.log("🔹 Coupon Handler - Resolved route:", route);

    // Dispatch based on the route.
    switch (route) {
      case "GenerateCouponBulk":
        return await generateCouponBulk(conn, event);
      case "RedeemCoupon":
        return await redeemCoupon(conn, event);
      default:
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: JSON.stringify({ success: false, message: "Invalid Route" })
        };
    }
  } catch (err) {
    console.error("❌ Coupon Handler - Unhandled error:", err.message);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, message: err.message })
    };
  } finally {
    if (conn) {
      conn.release();
      console.log("🔹 DB connection released in Coupon Handler.");
    }
  }
};

async function generateCouponBulk(conn, event) {
  try {
    const { user_type, couponCount, discount_percentage } = event;
    
    if (!user_type || !couponCount || discount_percentage == null) {
      throw new Error("Required fields: user_type, couponCount, and discount_percentage");
    }
    if (!["Candidate", "Employer"].includes(user_type)) {
      throw new Error("Invalid user_type. Allowed values: Candidate, Employer");
    }
    
    // Fetch base coin value from coupon_config.
    const [configRows] = await conn.execute(
      "SELECT coins FROM coupon_config WHERE user_type = ?",
      [user_type]
    );
    if (configRows.length === 0) {
      throw new Error(`Coupon configuration not found for user_type: ${user_type}`);
    }
    const baseCoinValue = configRows[0].coins;
    console.log(`🔹 Base coin value for ${user_type}: ${baseCoinValue}`);
    
    // Compute effective coin value using discount percentage.
    const effectiveCoinValue = Math.floor((baseCoinValue * discount_percentage) / 100);
    console.log(`🔹 Effective coin value after applying ${discount_percentage}% discount: ${effectiveCoinValue}`);
    
    // Array to store generated coupon details.
    const coupons = [];
    for (let i = 0; i < couponCount; i++) {
      const coupon_code = randomstring.generate(10);
      await conn.execute(
        "INSERT INTO coupon_codes (coupon_code, user_type, coin_value, discount_percentage, created_at) VALUES (?, ?, ?, ?, NOW())",
        [coupon_code, user_type, effectiveCoinValue, discount_percentage]
      );
      coupons.push({ coupon_code, user_type, coin_value: effectiveCoinValue, discount_percentage });
    }
    await conn.commit();
    console.log(`✅ Generated ${couponCount} coupons for ${user_type}`);
    
    // Create an Excel workbook and worksheet.
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Coupons");
    worksheet.columns = [
      { header: "Coupon Code", key: "coupon_code", width: 20 },
      { header: "User Type", key: "user_type", width: 15 },
      { header: "Effective Coin Value", key: "coin_value", width: 20 },
      { header: "Discount Percentage", key: "discount_percentage", width: 20 }
    ];
    coupons.forEach(coupon => {
      worksheet.addRow(coupon);
    });
    
    // Write the workbook to a temporary file.
    const fileName = `coupons_${user_type}_${Date.now()}.xlsx`;
    const filePath = `/tmp/${fileName}`;
    console.log("🔹 Writing Excel file to:", filePath);
    await workbook.xlsx.writeFile(filePath);
    console.log("✅ Excel file created at:", filePath);
    
    // Upload the Excel file to S3.
    const fileContent = fs.readFileSync(filePath);
    const uploadParams = {
      Bucket: bucketName,
      Key: fileName,
      Body: fileContent,
      ContentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    };
    await s3.upload(uploadParams).promise();
    console.log(`✅ Excel file uploaded to S3 bucket: ${bucketName} as ${fileName}`);
    
    // Generate a pre-signed URL (valid for 1 hour).
    const urlParams = {
      Bucket: bucketName,
      Key: fileName,
      Expires: 3600
    };
    const presignedUrl = s3.getSignedUrl('getObject', urlParams);
    console.log("✅ Pre-signed URL generated:", presignedUrl);
    
    // Shorten the URL using TinyURL.
    const shortUrl = await shortenUrl(presignedUrl);
    console.log("✅ Shortened URL:", shortUrl);
    
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: `Generated ${couponCount} coupons for ${user_type} and uploaded Excel file.`,
        downloadUrl: shortUrl,
        coupons
      })
    };
    
  } catch (err) {
    console.error("❌ Error in bulk coupon generation:", err.message);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, message: err.message })
    };
  } finally {
    if (conn) {
      conn.release();
      console.log("🔹 DB connection released in generateCouponBulk.");
    }
  }
}

async function redeemCoupon(conn, event) {
  try {
    const { coupon_code, firebase_uid } = event;
    if (!coupon_code || !firebase_uid) {
      throw new Error("Required fields: coupon_code, firebase_uid");
    }
    
    // Look up the coupon.
    const [couponRows] = await conn.execute(
      "SELECT * FROM coupon_codes WHERE coupon_code = ?",
      [coupon_code]
    );
    if (couponRows.length === 0) {
      throw new Error("Invalid coupon code.");
    }
    const coupon = couponRows[0];
    if (coupon.redeemed) {
      throw new Error("This coupon code has already been redeemed.");
    }
    
    // Look up the user in the users table using firebase_uid.
    const [userRows] = await conn.execute(
      "SELECT user_type FROM users WHERE firebase_uid = ?",
      [firebase_uid]
    );
    if (userRows.length === 0) {
      throw new Error("User record not found for this user.");
    }
    const { user_type: actualUserType } = userRows[0];
    if (coupon.user_type !== actualUserType) {
      throw new Error(`Coupon is valid for ${coupon.user_type} only. This user is of type ${actualUserType}.`);
    }
    
    // Mark the coupon as redeemed.
    await conn.execute(
      "UPDATE coupon_codes SET redeemed = TRUE, firebase_uid = ?, redeemed_at = NOW() WHERE coupon_code = ?",
      [firebase_uid, coupon_code]
    );
    await conn.commit();
    
    // Update the subscription record's coins_balance.
    await conn.execute(
      "UPDATE subscriptions SET coins_balance = coins_balance + ?, updated_at = NOW() WHERE firebase_uid = ?",
      [coupon.coin_value, firebase_uid]
    );
    await conn.commit();
    
    // Log the coin transaction.
    await conn.execute(
      "INSERT INTO coin_transactions (firebase_uid, transaction_type, amount, description, created_at) VALUES (?, 'CouponRedemption', ?, CONCAT('Coupon redeemed: ', ?), NOW())",
      [firebase_uid, coupon.coin_value, coupon_code]
    );
    await conn.commit();
    
    console.log("✅ Coupon redeemed successfully. Effective coins credited:", coupon.coin_value);
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, message: "Coupon redeemed successfully", bonusCoins: coupon.coin_value })
    };
    
  } catch (err) {
    console.error("❌ Error redeeming coupon:", err.message);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, message: err.message })
    };
  } finally {
    if (conn) {
      conn.release();
      console.log("🔹 DB connection released in redeemCoupon.");
    }
  }
}
