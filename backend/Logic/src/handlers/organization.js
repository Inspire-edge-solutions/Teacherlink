// import AWS from "aws-sdk";
// import admin from "firebase-admin";
// import { getDBConnection } from "../utils/db.js";
// import { getSecrets } from "../utils/secrets.js";
// import { v4 as uuidv4 } from "uuid";

// // Initialize AWS services
// const s3 = new AWS.S3({ region: "ap-south-1" });
// const dynamoDB = new AWS.DynamoDB.DocumentClient();

// // Initialize Firebase Admin if not already initialized
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.applicationDefault(),
//   });
// }

// // Environment variables
// const S3_BUCKET_NAME = process.env.S3_BUCKET || "your-s3-bucket-name";
// const TABLE_NAME = process.env.DYNAMODB_TABLE || "organizations";

// // Standard headers helper
// function standardHeaders() {
//   return {
//     "Content-Type": "application/json",
//     "Access-Control-Allow-Origin": "*", // Adjust as needed
//     "Access-Control-Allow-Headers":
//       "Content-Type, Accept, Accept-Language, Accept-Encoding, Authorization",
//     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//     "Cross-Origin-Opener-Policy": "same-origin-allow-popups"
//   };
// }

// // Helper: Upload an image (base64 string) to S3
// async function uploadToS3(base64Data, fileName) {
//   const buffer = Buffer.from(base64Data, "base64");
//   const params = {
//     Bucket: S3_BUCKET_NAME,
//     Key: `organization_photos/${uuidv4()}-${fileName}`,
//     Body: buffer,
//     ContentEncoding: "base64",
//     ContentType: "image/png", // adjust if needed
//   };
//   const uploadResult = await s3.upload(params).promise();
//   return uploadResult.Location;
// }

// // Lambda handler – entry point for CRUD operations
// export const handler = async (event) => {
//   console.log("🔹 Organization Lambda invoked. Event:", JSON.stringify(event));
//   try {
//     console.log("🔹 Fetching secrets...");
//     const secret = await getSecrets("inspireedge", "ap-south-1");
//     console.log("✅ Secrets retrieved.");

//     console.log("🔹 Establishing database connection...");
//     const conn = await getDBConnection(secret);
//     console.log("✅ DB connection established.");

//     // Determine route
//     let route =
//       event.route ||
//       (event.body && JSON.parse(event.body).route) ||
//       (event.queryStringParameters && event.queryStringParameters.route) ||
//       (event.pathParameters && event.pathParameters.route);

//     // Default route for GET if not specified
//     if (!route && event.httpMethod === "GET") {
//       route = "GetOrganization";
//     }
//     console.log("🔹 Resolved route:", route);
//     if (!route) {
//       console.error("❌ Route not specified in the request.");
//       return {
//         statusCode: 400,
//         headers: standardHeaders(),
//         body: JSON.stringify({ message: "Route not specified in request" }),
//       };
//     }

//     // Merge parsed body into event if necessary
//     if (event.body && typeof event.body === "string") {
//       Object.assign(event, JSON.parse(event.body));
//     }
//     console.log("🔹 Processing route:", route);

//     // For GET, read firebase_uid from pathParameters or fallback
//     let firebase_uid = event.firebase_uid;
//     if (!firebase_uid && event.pathParameters && event.pathParameters.firebase_uid) {
//       firebase_uid = event.pathParameters.firebase_uid;
//     }
//     if (!firebase_uid && event.path) {
//       const segments = event.path.split("/");
//       firebase_uid = segments[segments.length - 1];
//       console.log("🔹 Extracted firebase_uid from event.path:", firebase_uid);
//     }
//     if (!firebase_uid) {
//       throw new Error("firebase_uid is required in the payload or pathParameters");
//     }
//     event.firebase_uid = firebase_uid;

//     // Dispatch based on route
//     switch (route) {
//       case "CreateOrganization":
//         return await createOrganization(conn, event);
//       case "GetOrganization":
//         return await getOrganization(conn, event);
//       case "UpdateOrganization":
//         return await updateOrganization(conn, event);
//       case "DeleteOrganization":
//         return await deleteOrganization(conn, event);
//       case "UpdateVerification":
//         return await updateVerification(conn, event);
//       default:
//         console.error("❌ Invalid route specified:", route);
//         return {
//           statusCode: 400,
//           headers: standardHeaders(),
//           body: JSON.stringify({ message: "Invalid Route" }),
//         };
//     }
//   } catch (err) {
//     console.error("❌ Unhandled error in Organization Lambda:", err);
//     return {
//       statusCode: 500,
//       headers: standardHeaders(),
//       body: JSON.stringify({ message: err.message }),
//     };
//   }
// };

// // CREATE Organization
// async function createOrganization(conn, event) {
//   try {
//     let {
//       type,
//       organization_details,
//       parent_details,
//       account_operated_by,
//       reporting_authority,
//       social,
//       images,
//       additional_owner,
//     } = event;
//     const firebase_uid = event.firebase_uid;

//     console.log("🔹 Creating organization for firebase_uid:", firebase_uid);
//     if (!firebase_uid || !type) {
//       console.error("❌ firebase_uid and type are required.");
//       return {
//         statusCode: 400,
//         headers: standardHeaders(),
//         body: JSON.stringify({ message: "firebase_uid and type are required" }),
//       };
//     }

//     // Normalize type strings from front-end
//     if (type.trim().toLowerCase() === "parent/ guardian looking for tuitions") {
//       type = "Parent/Guardian Looking for Tuitions";
//     }
//     console.log("🔹 Final type after normalization:", type);

//     // Upload images if any
//     let uploadedImages = [];
//     if (images && Array.isArray(images) && images.length > 0) {
//       uploadedImages = await Promise.all(
//         images.map((img) => uploadToS3(img.base64, img.fileName))
//       );
//     }

//     // Build data for DynamoDB
//     let dynamicData = {
//       id: firebase_uid,
//       firebase_uid,
//       type,
//       account_operated_by,
//     };

//     if (type === "Parent/Guardian Looking for Tuitions") {
//       dynamicData.parent_details = parent_details || {};
//     } else {
//       dynamicData.organization_details = {
//         ...organization_details,
//         institution_photos: uploadedImages,
//       };
//     }
//     if (reporting_authority) {
//       dynamicData.reporting_authority = reporting_authority;
//     }
//     if (additional_owner) {
//       dynamicData.additional_owner = additional_owner;
//     }

//     console.log("🔹 Saving dynamic organization data to DynamoDB...");
//     await dynamoDB.put({ TableName: TABLE_NAME, Item: dynamicData }).promise();
//     console.log("✅ Organization data saved in DynamoDB.");

//     // Insert or update "profiles" table with social links and verification flags
//     const {
//       is_email_verified,
//       is_phone1_verified,
//       is_phone2_verified,
//     } = account_operated_by || {};
//     const sql = `
//       INSERT INTO profiles 
//       (firebase_uid, facebook, twitter, linkedin, instagram,
//        is_email_verified, is_phone1_verified, is_phone2_verified)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//       ON DUPLICATE KEY UPDATE
//         facebook = VALUES(facebook),
//         twitter = VALUES(twitter),
//         linkedin = VALUES(linkedin),
//         instagram = VALUES(instagram),
//         is_email_verified = VALUES(is_email_verified),
//         is_phone1_verified = VALUES(is_phone1_verified),
//         is_phone2_verified = VALUES(is_phone2_verified)
//     `;
//     const sqlValues = [
//       firebase_uid,
//       social?.facebook || null,
//       social?.twitter || null,
//       social?.linkedin || null,
//       social?.instagram || null,
//       is_email_verified ? 1 : 0,
//       is_phone1_verified ? 1 : 0,
//       is_phone2_verified ? 1 : 0,
//     ];
//     await conn.execute(sql, sqlValues);

//     await conn.release();
//     console.log("✅ Organization created/updated successfully.");

//     return {
//       statusCode: 201,
//       headers: standardHeaders(),
//       body: JSON.stringify({ message: "Organization created successfully", firebase_uid }),
//     };
//   } catch (error) {
//     console.error("❌ Error in createOrganization:", error);
//     return {
//       statusCode: 500,
//       headers: standardHeaders(),
//       body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
//     };
//   }
// }

// // GET Organization
// async function getOrganization(conn, event) {
//   try {
//     const firebase_uid =
//       (event.pathParameters && event.pathParameters.firebase_uid) || event.firebase_uid;
//     console.log("🔹 Fetching organization for firebase_uid:", firebase_uid);
//     if (!firebase_uid) {
//       console.error("❌ firebase_uid is required.");
//       return {
//         statusCode: 400,
//         headers: standardHeaders(),
//         body: JSON.stringify({ message: "firebase_uid is required" }),
//       };
//     }

//     // 1) Retrieve from DynamoDB
//     const dynamoResult = await dynamoDB
//       .get({ TableName: TABLE_NAME, Key: { id: firebase_uid } })
//       .promise();
//     console.log("🔹 DynamoDB result:", dynamoResult);
//     if (!dynamoResult.Item) {
//       console.error("❌ Organization not found in DynamoDB.");
//       return {
//         statusCode: 404,
//         headers: standardHeaders(),
//         body: JSON.stringify({ message: "Organization not found" }),
//       };
//     }

//     // 2) Retrieve from MySQL (profiles table) for social links and verification flags
//     const [profileRows] = await conn.execute("SELECT * FROM profiles WHERE firebase_uid = ?", [
//       firebase_uid,
//     ]);
//     console.log("🔹 MySQL profiles result:", profileRows);
//     const profileData = profileRows[0] || {};

//     await conn.release();

//     // Ensure institution_photos is always an array
//     if (dynamoResult.Item.organization_details) {
//       if (!Array.isArray(dynamoResult.Item.organization_details.institution_photos)) {
//         dynamoResult.Item.organization_details.institution_photos = [];
//       }
//     }

//     // Merge the contact person's verification flags from profiles
//     if (!dynamoResult.Item.account_operated_by) {
//       dynamoResult.Item.account_operated_by = {};
//     }
//     dynamoResult.Item.account_operated_by.is_email_verified =
//       profileData.is_email_verified === 1;
//     dynamoResult.Item.account_operated_by.is_phone1_verified =
//       profileData.is_phone1_verified === 1;
//     dynamoResult.Item.account_operated_by.is_phone2_verified =
//       profileData.is_phone2_verified === 1;

//     // Merge social
//     const mergedResult = {
//       ...dynamoResult.Item,
//       facebook: profileData.facebook || "",
//       twitter: profileData.twitter || "",
//       linkedin: profileData.linkedin || "",
//       instagram: profileData.instagram || "",
//     };

//     console.log("✅ Organization fetched successfully.");
//     return {
//       statusCode: 200,
//       headers: standardHeaders(),
//       body: JSON.stringify(mergedResult),
//     };
//   } catch (error) {
//     console.error("❌ Error in getOrganization:", error);
//     return {
//       statusCode: 500,
//       headers: standardHeaders(),
//       body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
//     };
//   }
// }

// // UPDATE Organization
// async function updateOrganization(conn, event) {
//   try {
//     let {
//       firebase_uid,
//       type,
//       organization_details,
//       parent_details,
//       account_operated_by,
//       reporting_authority,
//       social,
//       images,
//       additional_owner,
//     } = event;

//     console.log("🔹 Updating organization for firebase_uid:", firebase_uid);
//     if (!firebase_uid) {
//       console.error("❌ firebase_uid is required.");
//       return {
//         statusCode: 400,
//         headers: standardHeaders(),
//         body: JSON.stringify({ message: "firebase_uid is required" }),
//       };
//     }

//     // Normalize type
//     if (type && type.trim().toLowerCase() === "parent/ guardian looking for tuitions") {
//       type = "Parent/Guardian Looking for Tuitions";
//     }

//     // Upload images if any
//     let uploadedImages = [];
//     if (images && Array.isArray(images) && images.length > 0) {
//       uploadedImages = await Promise.all(
//         images.map((img) => uploadToS3(img.base64, img.fileName))
//       );
//     }

//     let dynamicData = {
//       id: firebase_uid,
//       firebase_uid,
//       type,
//       account_operated_by,
//     };

//     if (type === "Parent/Guardian Looking for Tuitions") {
//       dynamicData.parent_details = parent_details || {};
//     } else {
//       dynamicData.organization_details = {
//         ...organization_details,
//         institution_photos:
//           uploadedImages.length > 0
//             ? uploadedImages
//             : organization_details?.institution_photos || [],
//       };
//     }
//     if (reporting_authority) {
//       dynamicData.reporting_authority = reporting_authority;
//     }
//     if (additional_owner) {
//       dynamicData.additional_owner = additional_owner;
//     }

//     console.log("🔹 Updating dynamic data in DynamoDB...");
//     await dynamoDB.put({ TableName: TABLE_NAME, Item: dynamicData }).promise();

//     // Update social links and verification flags in profiles
//     const {
//       is_email_verified,
//       is_phone1_verified,
//       is_phone2_verified,
//     } = account_operated_by || {};

//     const updateSql = `
//       INSERT INTO profiles 
//       (firebase_uid, facebook, twitter, linkedin, instagram,
//        is_email_verified, is_phone1_verified, is_phone2_verified)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//       ON DUPLICATE KEY UPDATE
//         facebook = VALUES(facebook),
//         twitter = VALUES(twitter),
//         linkedin = VALUES(linkedin),
//         instagram = VALUES(instagram),
//         is_email_verified = VALUES(is_email_verified),
//         is_phone1_verified = VALUES(is_phone1_verified),
//         is_phone2_verified = VALUES(is_phone2_verified)
//     `;
//     const values = [
//       firebase_uid,
//       social?.facebook || null,
//       social?.twitter || null,
//       social?.linkedin || null,
//       social?.instagram || null,
//       is_email_verified ? 1 : 0,
//       is_phone1_verified ? 1 : 0,
//       is_phone2_verified ? 1 : 0,
//     ];
//     await conn.execute(updateSql, values);

//     await conn.release();
//     console.log("✅ Organization updated successfully.");
//     return {
//       statusCode: 200,
//       headers: standardHeaders(),
//       body: JSON.stringify({ message: "Organization updated successfully", firebase_uid }),
//     };
//   } catch (error) {
//     console.error("❌ Error in updateOrganization:", error);
//     return {
//       statusCode: 500,
//       headers: standardHeaders(),
//       body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
//     };
//   }
// }

// // DELETE Organization
// async function deleteOrganization(conn, event) {
//   try {
//     const firebase_uid =
//       (event.pathParameters && event.pathParameters.firebase_uid) || event.firebase_uid;
//     console.log("🔹 Deleting organization for firebase_uid:", firebase_uid);
//     if (!firebase_uid) {
//       console.error("❌ firebase_uid is required for deletion.");
//       return {
//         statusCode: 400,
//         headers: standardHeaders(),
//         body: JSON.stringify({ message: "firebase_uid is required" }),
//       };
//     }

//     // Check existence in DynamoDB
//     const dynamoResult = await dynamoDB
//       .get({ TableName: TABLE_NAME, Key: { id: firebase_uid } })
//       .promise();
//     if (!dynamoResult.Item) {
//       console.error("❌ Organization not found for deletion.");
//       return {
//         statusCode: 404,
//         headers: standardHeaders(),
//         body: JSON.stringify({ message: "Organization not found" }),
//       };
//     }

//     // If photos exist, delete from S3
//     if (
//       dynamoResult.Item.organization_details &&
//       dynamoResult.Item.organization_details.institution_photos &&
//       dynamoResult.Item.organization_details.institution_photos.length > 0
//     ) {
//       const deleteObjects = dynamoResult.Item.organization_details.institution_photos.map((url) => {
//         const parts = url.split("/");
//         return { Key: parts.slice(3).join("/") };
//       });
//       console.log("🔹 Deleting images from S3...");
//       await s3
//         .deleteObjects({
//           Bucket: S3_BUCKET_NAME,
//           Delete: { Objects: deleteObjects },
//         })
//         .promise();
//     }

//     // Delete from DynamoDB
//     console.log("🔹 Deleting dynamic data from DynamoDB...");
//     await dynamoDB.delete({ TableName: TABLE_NAME, Key: { id: firebase_uid } }).promise();

//     // Delete from profiles table in MySQL
//     console.log("🔹 Deleting data from MySQL profiles table...");
//     await conn.execute("DELETE FROM profiles WHERE firebase_uid = ?", [firebase_uid]);
//     await conn.release();

//     console.log("✅ Organization deleted successfully.");
//     return {
//       statusCode: 200,
//       headers: standardHeaders(),
//       body: JSON.stringify({ message: "Organization deleted successfully", firebase_uid }),
//     };
//   } catch (error) {
//     console.error("❌ Error in deleteOrganization:", error);
//     return {
//       statusCode: 500,
//       headers: standardHeaders(),
//       body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
//     };
//   }
// }

// // OPTIONAL: Update Verification route (if needed)
// async function updateVerification(conn, event) {
//   try {
//     const { firebase_uid, is_email_verified, is_phone1_verified, is_phone2_verified } = event;
//     console.log("🔹 updateVerification called with:", event);

//     if (!firebase_uid) {
//       return {
//         statusCode: 400,
//         headers: standardHeaders(),
//         body: JSON.stringify({ message: "firebase_uid is required" }),
//       };
//     }

//     let updates = [];
//     let params = [];
//     if (typeof is_email_verified !== "undefined") {
//       updates.push("is_email_verified = ?");
//       params.push(is_email_verified ? 1 : 0);
//     }
//     if (typeof is_phone1_verified !== "undefined") {
//       updates.push("is_phone1_verified = ?");
//       params.push(is_phone1_verified ? 1 : 0);
//     }
//     if (typeof is_phone2_verified !== "undefined") {
//       updates.push("is_phone2_verified = ?");
//       params.push(is_phone2_verified ? 1 : 0);
//     }
//     if (!updates.length) {
//       return {
//         statusCode: 400,
//         headers: standardHeaders(),
//         body: JSON.stringify({ message: "No verification flags provided" }),
//       };
//     }

//     const sql = `UPDATE profiles SET ${updates.join(", ")} WHERE firebase_uid = ?`;
//     params.push(firebase_uid);
//     await conn.execute(sql, params);

//     await conn.release();
//     return {
//       statusCode: 200,
//       headers: standardHeaders(),
//       body: JSON.stringify({ message: "Verification flags updated", firebase_uid }),
//     };
//   } catch (error) {
//     console.error("❌ Error in updateVerification:", error);
//     return {
//       statusCode: 500,
//       headers: standardHeaders(),
//       body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
//     };
//   }
// }

import AWS from "aws-sdk";
import admin from "firebase-admin";
import { getDBConnection } from "../utils/db.js";
import { getSecrets } from "../utils/secrets.js";
import { v4 as uuidv4 } from "uuid";

// Initialize AWS services
const s3 = new AWS.S3({ region: "ap-south-1" });
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

// Environment variables
const S3_BUCKET_NAME = process.env.S3_BUCKET || "your-s3-bucket-name";
const TABLE_NAME = process.env.DYNAMODB_TABLE || "organizations";

// Standard headers helper – updated to remove Cross-Origin-Opener-Policy header
function standardHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Adjust as needed
    "Access-Control-Allow-Headers":
      "Content-Type, Accept, Accept-Language, Accept-Encoding, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
  };
}

// Helper: Upload an image (base64 string) to S3
async function uploadToS3(base64Data, fileName) {
  const buffer = Buffer.from(base64Data, "base64");
  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: `organization_photos/${uuidv4()}-${fileName}`,
    Body: buffer,
    ContentEncoding: "base64",
    ContentType: "image/png", // adjust if needed
  };
  const uploadResult = await s3.upload(params).promise();
  return uploadResult.Location;
}

// Lambda handler – entry point for CRUD operations
export const handler = async (event) => {
  console.log("🔹 Organization Lambda invoked. Event:", JSON.stringify(event));
  try {
    console.log("🔹 Fetching secrets...");
    const secret = await getSecrets("inspireedge", "ap-south-1");
    console.log("✅ Secrets retrieved.");

    console.log("🔹 Establishing database connection...");
    const conn = await getDBConnection(secret);
    console.log("✅ DB connection established.");

    // Determine route
    let route =
      event.route ||
      (event.body && JSON.parse(event.body).route) ||
      (event.queryStringParameters && event.queryStringParameters.route) ||
      (event.pathParameters && event.pathParameters.route);

    // Default route for GET if not specified
    if (!route && event.httpMethod === "GET") {
      route = "GetOrganization";
    }
    console.log("🔹 Resolved route:", route);
    if (!route) {
      console.error("❌ Route not specified in the request.");
      return {
        statusCode: 400,
        headers: standardHeaders(),
        body: JSON.stringify({ message: "Route not specified in request" }),
      };
    }

    // Merge parsed body into event if necessary
    if (event.body && typeof event.body === "string") {
      Object.assign(event, JSON.parse(event.body));
    }
    console.log("🔹 Processing route:", route);

    // For GET, read firebase_uid from pathParameters or fallback
    let firebase_uid = event.firebase_uid;
    if (!firebase_uid && event.pathParameters && event.pathParameters.firebase_uid) {
      firebase_uid = event.pathParameters.firebase_uid;
    }
    if (!firebase_uid && event.path) {
      const segments = event.path.split("/");
      firebase_uid = segments[segments.length - 1];
      console.log("🔹 Extracted firebase_uid from event.path:", firebase_uid);
    }
    if (!firebase_uid) {
      throw new Error("firebase_uid is required in the payload or pathParameters");
    }
    event.firebase_uid = firebase_uid;

    // Dispatch based on route
    switch (route) {
      case "CreateOrganization":
        return await createOrganization(conn, event);
      case "GetOrganization":
        return await getOrganization(conn, event);
      case "UpdateOrganization":
        return await updateOrganization(conn, event);
      case "DeleteOrganization":
        return await deleteOrganization(conn, event);
      case "UpdateVerification":
        return await updateVerification(conn, event);
      default:
        console.error("❌ Invalid route specified:", route);
        return {
          statusCode: 400,
          headers: standardHeaders(),
          body: JSON.stringify({ message: "Invalid Route" }),
        };
    }
  } catch (err) {
    console.error("❌ Unhandled error in Organization Lambda:", err);
    return {
      statusCode: 500,
      headers: standardHeaders(),
      body: JSON.stringify({ message: err.message }),
    };
  }
};

// CREATE Organization
async function createOrganization(conn, event) {
  try {
    let {
      type,
      organization_details,
      parent_details,
      account_operated_by,
      reporting_authority,
      social,
      images,
      additional_owner,
    } = event;
    const firebase_uid = event.firebase_uid;

    console.log("🔹 Creating organization for firebase_uid:", firebase_uid);
    if (!firebase_uid || !type) {
      console.error("❌ firebase_uid and type are required.");
      return {
        statusCode: 400,
        headers: standardHeaders(),
        body: JSON.stringify({ message: "firebase_uid and type are required" }),
      };
    }

    // Normalize type strings from front-end
    if (type.trim().toLowerCase() === "parent/ guardian looking for tuitions") {
      type = "Parent/Guardian Looking for Tuitions";
    }
    console.log("🔹 Final type after normalization:", type);

    // Upload images if any
    let uploadedImages = [];
    if (images && Array.isArray(images) && images.length > 0) {
      uploadedImages = await Promise.all(
        images.map((img) => uploadToS3(img.base64, img.fileName))
      );
    }

    // Build data for DynamoDB
    let dynamicData = {
      id: firebase_uid,
      firebase_uid,
      type,
      account_operated_by,
    };

    if (type === "Parent/Guardian Looking for Tuitions") {
      dynamicData.parent_details = parent_details || {};
    } else {
      dynamicData.organization_details = {
        ...organization_details,
        institution_photos: uploadedImages,
      };
    }
    if (reporting_authority) {
      dynamicData.reporting_authority = reporting_authority;
    }
    if (additional_owner) {
      dynamicData.additional_owner = additional_owner;
    }

    console.log("🔹 Saving dynamic organization data to DynamoDB...");
    await dynamoDB.put({ TableName: TABLE_NAME, Item: dynamicData }).promise();
    console.log("✅ Organization data saved in DynamoDB.");

    // Insert or update "profiles" table with social links and verification flags
    const {
      is_email_verified,
      is_phone1_verified,
      is_phone2_verified,
    } = account_operated_by || {};
    const sql = `
      INSERT INTO profiles 
      (firebase_uid, facebook, twitter, linkedin, instagram,
       is_email_verified, is_phone1_verified, is_phone2_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        facebook = VALUES(facebook),
        twitter = VALUES(twitter),
        linkedin = VALUES(linkedin),
        instagram = VALUES(instagram),
        is_email_verified = VALUES(is_email_verified),
        is_phone1_verified = VALUES(is_phone1_verified),
        is_phone2_verified = VALUES(is_phone2_verified)
    `;
    const sqlValues = [
      firebase_uid,
      social?.facebook || null,
      social?.twitter || null,
      social?.linkedin || null,
      social?.instagram || null,
      is_email_verified ? 1 : 0,
      is_phone1_verified ? 1 : 0,
      is_phone2_verified ? 1 : 0,
    ];
    await conn.execute(sql, sqlValues);

    await conn.release();
    console.log("✅ Organization created/updated successfully.");

    return {
      statusCode: 201,
      headers: standardHeaders(),
      body: JSON.stringify({ message: "Organization created successfully", firebase_uid }),
    };
  } catch (error) {
    console.error("❌ Error in createOrganization:", error);
    return {
      statusCode: 500,
      headers: standardHeaders(),
      body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
    };
  }
}

// GET Organization
async function getOrganization(conn, event) {
  try {
    const firebase_uid =
      (event.pathParameters && event.pathParameters.firebase_uid) || event.firebase_uid;
    console.log("🔹 Fetching organization for firebase_uid:", firebase_uid);
    if (!firebase_uid) {
      console.error("❌ firebase_uid is required.");
      return {
        statusCode: 400,
        headers: standardHeaders(),
        body: JSON.stringify({ message: "firebase_uid is required" }),
      };
    }

    // 1) Retrieve from DynamoDB
    const dynamoResult = await dynamoDB
      .get({ TableName: TABLE_NAME, Key: { id: firebase_uid } })
      .promise();
    console.log("🔹 DynamoDB result:", dynamoResult);
    if (!dynamoResult.Item) {
      console.error("❌ Organization not found in DynamoDB.");
      return {
        statusCode: 404,
        headers: standardHeaders(),
        body: JSON.stringify({ message: "Organization not found" }),
      };
    }

    // 2) Retrieve from MySQL (profiles table) for social links and verification flags
    const [profileRows] = await conn.execute("SELECT * FROM profiles WHERE firebase_uid = ?", [
      firebase_uid,
    ]);
    console.log("🔹 MySQL profiles result:", profileRows);
    const profileData = profileRows[0] || {};

    await conn.release();

    // Ensure institution_photos is always an array
    if (dynamoResult.Item.organization_details) {
      if (!Array.isArray(dynamoResult.Item.organization_details.institution_photos)) {
        dynamoResult.Item.organization_details.institution_photos = [];
      }
    }

    // Merge the contact person's verification flags from profiles
    if (!dynamoResult.Item.account_operated_by) {
      dynamoResult.Item.account_operated_by = {};
    }
    dynamoResult.Item.account_operated_by.is_email_verified =
      profileData.is_email_verified === 1;
    dynamoResult.Item.account_operated_by.is_phone1_verified =
      profileData.is_phone1_verified === 1;
    dynamoResult.Item.account_operated_by.is_phone2_verified =
      profileData.is_phone2_verified === 1;

    // Merge social
    const mergedResult = {
      ...dynamoResult.Item,
      facebook: profileData.facebook || "",
      twitter: profileData.twitter || "",
      linkedin: profileData.linkedin || "",
      instagram: profileData.instagram || "",
    };

    console.log("✅ Organization fetched successfully.");
    return {
      statusCode: 200,
      headers: standardHeaders(),
      body: JSON.stringify(mergedResult),
    };
  } catch (error) {
    console.error("❌ Error in getOrganization:", error);
    return {
      statusCode: 500,
      headers: standardHeaders(),
      body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
    };
  }
}

// UPDATE Organization
async function updateOrganization(conn, event) {
  try {
    let {
      firebase_uid,
      type,
      organization_details,
      parent_details,
      account_operated_by,
      reporting_authority,
      social,
      images,
      additional_owner,
    } = event;

    console.log("🔹 Updating organization for firebase_uid:", firebase_uid);
    if (!firebase_uid) {
      console.error("❌ firebase_uid is required.");
      return {
        statusCode: 400,
        headers: standardHeaders(),
        body: JSON.stringify({ message: "firebase_uid is required" }),
      };
    }

    // Normalize type
    if (type && type.trim().toLowerCase() === "parent/ guardian looking for tuitions") {
      type = "Parent/Guardian Looking for Tuitions";
    }

    // Upload images if any
    let uploadedImages = [];
    if (images && Array.isArray(images) && images.length > 0) {
      uploadedImages = await Promise.all(
        images.map((img) => uploadToS3(img.base64, img.fileName))
      );
    }

    let dynamicData = {
      id: firebase_uid,
      firebase_uid,
      type,
      account_operated_by,
    };

    if (type === "Parent/Guardian Looking for Tuitions") {
      dynamicData.parent_details = parent_details || {};
    } else {
      dynamicData.organization_details = {
        ...organization_details,
        institution_photos:
          uploadedImages.length > 0
            ? uploadedImages
            : organization_details?.institution_photos || [],
      };
    }
    if (reporting_authority) {
      dynamicData.reporting_authority = reporting_authority;
    }
    if (additional_owner) {
      dynamicData.additional_owner = additional_owner;
    }

    console.log("🔹 Updating dynamic data in DynamoDB...");
    await dynamoDB.put({ TableName: TABLE_NAME, Item: dynamicData }).promise();

    // Update social links and verification flags in profiles
    const {
      is_email_verified,
      is_phone1_verified,
      is_phone2_verified,
    } = account_operated_by || {};

    const updateSql = `
      INSERT INTO profiles 
      (firebase_uid, facebook, twitter, linkedin, instagram,
       is_email_verified, is_phone1_verified, is_phone2_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        facebook = VALUES(facebook),
        twitter = VALUES(twitter),
        linkedin = VALUES(linkedin),
        instagram = VALUES(instagram),
        is_email_verified = VALUES(is_email_verified),
        is_phone1_verified = VALUES(is_phone1_verified),
        is_phone2_verified = VALUES(is_phone2_verified)
    `;
    const values = [
      firebase_uid,
      social?.facebook || null,
      social?.twitter || null,
      social?.linkedin || null,
      social?.instagram || null,
      is_email_verified ? 1 : 0,
      is_phone1_verified ? 1 : 0,
      is_phone2_verified ? 1 : 0,
    ];
    await conn.execute(updateSql, values);

    await conn.release();
    console.log("✅ Organization updated successfully.");
    return {
      statusCode: 200,
      headers: standardHeaders(),
      body: JSON.stringify({ message: "Organization updated successfully", firebase_uid }),
    };
  } catch (error) {
    console.error("❌ Error in updateOrganization:", error);
    return {
      statusCode: 500,
      headers: standardHeaders(),
      body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
    };
  }
}

// DELETE Organization
async function deleteOrganization(conn, event) {
  try {
    const firebase_uid =
      (event.pathParameters && event.pathParameters.firebase_uid) || event.firebase_uid;
    console.log("🔹 Deleting organization for firebase_uid:", firebase_uid);
    if (!firebase_uid) {
      console.error("❌ firebase_uid is required for deletion.");
      return {
        statusCode: 400,
        headers: standardHeaders(),
        body: JSON.stringify({ message: "firebase_uid is required" }),
      };
    }

    // Check existence in DynamoDB
    const dynamoResult = await dynamoDB
      .get({ TableName: TABLE_NAME, Key: { id: firebase_uid } })
      .promise();
    if (!dynamoResult.Item) {
      console.error("❌ Organization not found for deletion.");
      return {
        statusCode: 404,
        headers: standardHeaders(),
        body: JSON.stringify({ message: "Organization not found" }),
      };
    }

    // If photos exist, delete from S3
    if (
      dynamoResult.Item.organization_details &&
      dynamoResult.Item.organization_details.institution_photos &&
      dynamoResult.Item.organization_details.institution_photos.length > 0
    ) {
      const deleteObjects = dynamoResult.Item.organization_details.institution_photos.map((url) => {
        const parts = url.split("/");
        return { Key: parts.slice(3).join("/") };
      });
      console.log("🔹 Deleting images from S3...");
      await s3
        .deleteObjects({
          Bucket: S3_BUCKET_NAME,
          Delete: { Objects: deleteObjects },
        })
        .promise();
    }

    // Delete from DynamoDB
    console.log("🔹 Deleting dynamic data from DynamoDB...");
    await dynamoDB.delete({ TableName: TABLE_NAME, Key: { id: firebase_uid } }).promise();

    // Delete from profiles table in MySQL
    console.log("🔹 Deleting data from MySQL profiles table...");
    await conn.execute("DELETE FROM profiles WHERE firebase_uid = ?", [firebase_uid]);
    await conn.release();

    console.log("✅ Organization deleted successfully.");
    return {
      statusCode: 200,
      headers: standardHeaders(),
      body: JSON.stringify({ message: "Organization deleted successfully", firebase_uid }),
    };
  } catch (error) {
    console.error("❌ Error in deleteOrganization:", error);
    return {
      statusCode: 500,
      headers: standardHeaders(),
      body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
    };
  }
}

// OPTIONAL: Update Verification route (if needed)
async function updateVerification(conn, event) {
  try {
    const { firebase_uid, is_email_verified, is_phone1_verified, is_phone2_verified } = event;
    console.log("🔹 updateVerification called with:", event);

    if (!firebase_uid) {
      return {
        statusCode: 400,
        headers: standardHeaders(),
        body: JSON.stringify({ message: "firebase_uid is required" }),
      };
    }

    let updates = [];
    let params = [];
    if (typeof is_email_verified !== "undefined") {
      updates.push("is_email_verified = ?");
      params.push(is_email_verified ? 1 : 0);
    }
    if (typeof is_phone1_verified !== "undefined") {
      updates.push("is_phone1_verified = ?");
      params.push(is_phone1_verified ? 1 : 0);
    }
    if (typeof is_phone2_verified !== "undefined") {
      updates.push("is_phone2_verified = ?");
      params.push(is_phone2_verified ? 1 : 0);
    }
    if (!updates.length) {
      return {
        statusCode: 400,
        headers: standardHeaders(),
        body: JSON.stringify({ message: "No verification flags provided" }),
      };
    }

    const sql = `UPDATE profiles SET ${updates.join(", ")} WHERE firebase_uid = ?`;
    params.push(firebase_uid);
    await conn.execute(sql, params);

    await conn.release();
    return {
      statusCode: 200,
      headers: standardHeaders(),
      body: JSON.stringify({ message: "Verification flags updated", firebase_uid }),
    };
  } catch (error) {
    console.error("❌ Error in updateVerification:", error);
    return {
      statusCode: 500,
      headers: standardHeaders(),
      body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
    };
  }
}
