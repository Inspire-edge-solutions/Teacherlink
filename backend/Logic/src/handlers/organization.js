// import AWS from "aws-sdk";
// import { getDBConnection } from "../utils/db.js";
// import { getSecrets } from "../utils/secrets.js";
// import { v4 as uuidv4 } from "uuid";

// // Initialize AWS services
// const s3 = new AWS.S3({ region: 'ap-south-1' });
// const dynamoDB = new AWS.DynamoDB.DocumentClient();

// // Environment variables
// const S3_BUCKET_NAME = process.env.S3_BUCKET || "your-s3-bucket-name";
// const TABLE_NAME = process.env.DYNAMODB_TABLE || "organizations";

// // Standard headers helper
// function standardHeaders() {
//   return {
//     "Content-Type": "application/json",
//     "Access-Control-Allow-Origin": "*", // CORS handling for all origins
//     "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding",
//     "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//   };
// }

// // Helper to upload an image (base64 string) to S3
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

// // Lambda handler
// export const handler = async (event) => {
//   console.log("🔹 Organization Lambda invoked. Event:", JSON.stringify(event));

//   try {
//     console.log("🔹 Fetching secrets...");
//     const secret = await getSecrets("inspireedge", "ap-south-1");
//     console.log("✅ Secrets retrieved.");

//     console.log("🔹 Establishing database connection...");
//     const conn = await getDBConnection(secret);
//     console.log("✅ DB connection established.");

//     // Determine route from event
//     let route =
//       event.route ||
//       (event.body && JSON.parse(event.body).route) ||
//       (event.queryStringParameters && event.queryStringParameters.route) ||
//       (event.pathParameters && event.pathParameters.route);

//     console.log("🔹 Resolved route:", route);

//     if (!route) {
//       console.error("❌ Route not specified in the request.");
//       return {
//         statusCode: 400,
//         headers: standardHeaders(),
//         body: JSON.stringify({ message: "Route not specified in request" }),
//       };
//     }

//     // Merge parsed body into event if needed
//     if (event.body && typeof event.body === "string") {
//       Object.assign(event, JSON.parse(event.body));
//     }

//     console.log("🔹 Processing route:", route);

//     switch (route) {
//       case "CreateOrganization":
//         return await createOrganization(conn, event);
//       case "GetOrganization":
//         return await getOrganization(conn, event);
//       case "UpdateOrganization":
//         return await updateOrganization(conn, event);
//       case "DeleteOrganization":
//         return await deleteOrganization(conn, event);
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

// // Create Organization function
// async function createOrganization(conn, event) {
//   try {
//     const {
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

//     console.log("🔹 Creating organization for firebase_uid:", firebase_uid);

//     if (!firebase_uid || !type) {
//       console.error("❌ firebase_uid and type are required.");
//       return {
//         statusCode: 400,
//         headers: standardHeaders(),
//         body: JSON.stringify({ message: "firebase_uid and type are required" }),
//       };
//     }

//     const id = uuidv4();

//     // Upload images to S3 if provided
//     let uploadedImages = [];
//     if (images && Array.isArray(images) && images.length > 0) {
//       uploadedImages = await Promise.all(
//         images.map((img) => uploadToS3(img.base64, img.fileName))
//       );
//     }

//     // Build dynamic data for DynamoDB
//     let dynamicData = {
//       id,
//       firebase_uid,
//       type,
//       account_operated_by,
//     };

//     if (type === "Parent/Guardian Looking for Tuitions") {
//       dynamicData.parent_details = parent_details;
//     } else {
//       dynamicData.organization_details = {
//         ...organization_details,
//         institution_photos: uploadedImages,
//       };
//     }

//     if (additional_owner) {
//       dynamicData.additional_owner = additional_owner;
//     }
//     if (reporting_authority) {
//       dynamicData.reporting_authority = reporting_authority;
//     }

//     console.log("🔹 Saving dynamic organization data to DynamoDB...");
//     await dynamoDB.put({ TableName: TABLE_NAME, Item: dynamicData }).promise();
//     console.log("✅ Organization data saved in DynamoDB.");

//     // Insert constant fields into MySQL (social network & location info)
//     const sql = `
//       INSERT INTO profiles 
//       (id, facebook, twitter, linkedin, instagram, find_on_map, latitude, longitude, dynamo_id)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;
//     const values = [
//       id,
//       social?.facebook || null,
//       social?.twitter || null,
//       social?.linkedin || null,
//       social?.instagram || null,
//       social?.find_on_map || null,
//       social?.latitude || null,
//       social?.longitude || null,
//       id,
//     ];
//     console.log("🔹 Inserting constant fields into MySQL...");
//     await conn.execute(sql, values);
//     await conn.release();
//     console.log("✅ Organization created successfully.");

//     return {
//       statusCode: 201,
//       headers: standardHeaders(),
//       body: JSON.stringify({ message: "Organization created successfully", id }),
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

// // Other functions (getOrganization, updateOrganization, deleteOrganization) remain similar
// async function getOrganization(conn, event) {
//   try {
//     const id =
//       (event.pathParameters && event.pathParameters.id) || event.id;
//     console.log("🔹 Fetching organization with id:", id);

//     if (!id) {
//       console.error("❌ Organization id is required.");
//       return {
//         statusCode: 400,
//         headers: standardHeaders(),
//         body: JSON.stringify({ message: "Organization id is required" }),
//       };
//     }

//     // Retrieve dynamic data from DynamoDB using the id field
//     const dynamoResult = await dynamoDB
//       .get({ TableName: TABLE_NAME, Key: { id } })
//       .promise();
//     if (!dynamoResult.Item) {
//       console.error("❌ Organization not found in DynamoDB.");
//       return {
//         statusCode: 404,
//         headers: standardHeaders(),
//         body: JSON.stringify({ message: "Organization not found" }),
//       };
//     }

//     // Retrieve constant data from MySQL
//     const [rows] = await conn.execute("SELECT * FROM profiles WHERE id = ?", [id]);
//     await conn.release();

//     console.log("✅ Organization fetched successfully.");
//     return {
//       statusCode: 200,
//       headers: standardHeaders(),
//       body: JSON.stringify({ ...dynamoResult.Item, ...rows[0] }),
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

// /**
//  * Update Organization.
//  * Expected: event must contain id and updated fields (same structure as createOrganization).
//  */
// async function updateOrganization(conn, event) {
//   try {
//     const {
//       id,
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

//     console.log("🔹 Updating organization with id:", id);

//     if (!id) {
//       console.error("❌ Organization id is required.");
//       return {
//         statusCode: 400,
//         headers: standardHeaders(),
//         body: JSON.stringify({ message: "Organization id is required" }),
//       };
//     }

//     // Upload new images if provided; if not, retain existing images from organization_details
//     let uploadedImages = [];
//     if (images && Array.isArray(images) && images.length > 0) {
//       uploadedImages = await Promise.all(
//         images.map((img) => uploadToS3(img.base64, img.fileName))
//       );
//     }

//     let dynamicData = {
//       id,
//       firebase_uid,
//       type,
//       account_operated_by,
//     };

//     if (type === "Parent/Guardian Looking for Tuitions") {
//       dynamicData.parent_details = parent_details;
//     } else {
//       dynamicData.organization_details = {
//         ...organization_details,
//         institution_photos: uploadedImages.length > 0 ? uploadedImages : organization_details.institution_photos,
//       };
//     }
//     if (additional_owner) {
//       dynamicData.additional_owner = additional_owner;
//     }
//     if (reporting_authority) {
//       dynamicData.reporting_authority = reporting_authority;
//     }

//     console.log("🔹 Updating dynamic data in DynamoDB...");
//     await dynamoDB
//       .put({ TableName: TABLE_NAME, Item: dynamicData })
//       .promise();

//     // Update constant fields in MySQL
//     const updateSql = `
//       UPDATE profiles 
//       SET facebook = ?, twitter = ?, linkedin = ?, instagram = ?, find_on_map = ?, latitude = ?, longitude = ?
//       WHERE id = ?
//     `;
//     const values = [
//       social?.facebook || null,
//       social?.twitter || null,
//       social?.linkedin || null,
//       social?.instagram || null,
//       social?.find_on_map || null,
//       social?.latitude || null,
//       social?.longitude || null,
//       id,
//     ];
//     await conn.execute(updateSql, values);
//     await conn.release();
//     console.log("✅ Organization updated successfully.");

//     return {
//       statusCode: 200,
//       headers: standardHeaders(),
//       body: JSON.stringify({ message: "Organization updated successfully" }),
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

// /**
//  * Delete Organization.
//  * Expected: event.pathParameters.id (or event.id) must provide the organization id.
//  */
// async function deleteOrganization(conn, event) {
//   try {
//     const id =
//       (event.pathParameters && event.pathParameters.id) || event.id;
//     console.log("🔹 Deleting organization with id:", id);

//     if (!id) {
//       console.error("❌ Organization id is required for deletion.");
//       return {
//         statusCode: 400,
//         headers: standardHeaders(),
//         body: JSON.stringify({ message: "Organization id is required" }),
//       };
//     }

//     // Retrieve dynamic data from DynamoDB to delete associated images from S3 if any
//     const dynamoResult = await dynamoDB
//       .get({ TableName: TABLE_NAME, Key: { id } })
//       .promise();
//     if (!dynamoResult.Item) {
//       console.error("❌ Organization not found for deletion.");
//       return {
//         statusCode: 404,
//         headers: standardHeaders(),
//         body: JSON.stringify({ message: "Organization not found" }),
//       };
//     }

//     // Delete images from S3 if available
//     if (
//       dynamoResult.Item.organization_details &&
//       dynamoResult.Item.organization_details.institution_photos &&
//       dynamoResult.Item.organization_details.institution_photos.length > 0
//     ) {
//       const deleteObjects = dynamoResult.Item.organization_details.institution_photos.map((url) => {
//         // Assuming URL format contains the bucket name and the key after the domain segment.
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

//     console.log("🔹 Deleting dynamic data from DynamoDB...");
//     await dynamoDB.delete({ TableName: TABLE_NAME, Key: { id } }).promise();

//     console.log("🔹 Deleting constant data from MySQL...");
//     await conn.execute("DELETE FROM profiles WHERE id = ?", [id]);
//     await conn.release();
//     console.log("✅ Organization deleted successfully.");

//     return {
//       statusCode: 200,
//       headers: standardHeaders(),
//       body: JSON.stringify({ message: "Organization deleted successfully" }),
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

// Standard headers helper
function standardHeaders() {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*", // Adjust as needed
    "Access-Control-Allow-Headers": "Content-Type, Accept, Accept-Language, Accept-Encoding, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
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
    ContentType: "image/png", // Adjust if needed
  };
  const uploadResult = await s3.upload(params).promise();
  return uploadResult.Location;
}

// Helper: Extract and verify the Firebase ID token from the request headers.
// Expects header: Authorization: Bearer <idToken>
async function getFirebaseUid(event) {
  const authHeader = event.headers && (event.headers.Authorization || event.headers.authorization);
  if (!authHeader) {
    throw new Error("Authorization header with Firebase ID token is required.");
  }
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    throw new Error("Authorization header must be in the format: 'Bearer <idToken>'");
  }
  const idToken = parts[1];
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  return decodedToken.uid;
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

    // Determine route from event properties
    let route =
      event.route ||
      (event.body && JSON.parse(event.body).route) ||
      (event.queryStringParameters && event.queryStringParameters.route) ||
      (event.pathParameters && event.pathParameters.route);

    // For GET requests, default to "GetOrganization" if route is not provided.
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

    // Merge parsed body into event if necessary.
    if (event.body && typeof event.body === "string") {
      Object.assign(event, JSON.parse(event.body));
    }
    console.log("🔹 Processing route:", route);

    // IMPORTANT: Verify the Firebase ID token and extract firebase_uid.
    const firebase_uid = await getFirebaseUid(event);
    // Attach the verified uid to event.
    event.firebase_uid = firebase_uid;

    switch (route) {
      case "CreateOrganization":
        return await createOrganization(conn, event);
      case "GetOrganization":
        return await getOrganization(conn, event);
      case "UpdateOrganization":
        return await updateOrganization(conn, event);
      case "DeleteOrganization":
        return await deleteOrganization(conn, event);
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

// CREATE Organization – Uses the verified firebase_uid as the unique identifier.
// Only allows creation if the user exists in the users table with user_type "Employer".
async function createOrganization(conn, event) {
  try {
    const {
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

    // Check that the employer exists in the users table and is an Employer.
    let [userRows] = await conn.execute(
      "SELECT user_type FROM users WHERE firebase_uid = ?",
      [firebase_uid]
    );
    if (userRows.length === 0) {
      console.error("❌ Employer not found with firebase_uid:", firebase_uid);
      return {
        statusCode: 404,
        headers: standardHeaders(),
        body: JSON.stringify({ message: "Employer not found." }),
      };
    }
    if (userRows[0].user_type !== "Employer") {
      console.error("❌ User is not an Employer:", firebase_uid);
      return {
        statusCode: 403,
        headers: standardHeaders(),
        body: JSON.stringify({ message: "Only Employers can create organization details." }),
      };
    }

    // Use firebase_uid as the unique organization id.
    const id = firebase_uid;

    // Process images if provided.
    let uploadedImages = [];
    if (images && Array.isArray(images) && images.length > 0) {
      uploadedImages = await Promise.all(
        images.map((img) => uploadToS3(img.base64, img.fileName))
      );
    }

    // Build dynamic data for DynamoDB.
    let dynamicData = {
      id,
      firebase_uid,
      type,
      account_operated_by,
    };
    if (type === "Parent/Guardian Looking for Tuitions" || type === "Parent/ Guardian looking for Tuitions") {
      dynamicData.parent_details = parent_details;
    } else {
      dynamicData.organization_details = {
        ...organization_details,
        institution_photos: uploadedImages,
      };
    }
    if (additional_owner) dynamicData.additional_owner = additional_owner;
    if (reporting_authority) dynamicData.reporting_authority = reporting_authority;

    console.log("🔹 Saving dynamic organization data to DynamoDB...");
    await dynamoDB.put({ TableName: TABLE_NAME, Item: dynamicData }).promise();
    console.log("✅ Organization data saved in DynamoDB.");

    // Insert constant fields into MySQL (profiles table)
    const sql = `
      INSERT INTO profiles 
      (firebase_uid, facebook, twitter, linkedin, instagram)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        facebook = VALUES(facebook),
        twitter = VALUES(twitter),
        linkedin = VALUES(linkedin),
        instagram = VALUES(instagram)
    `;
    const sqlValues = [
      firebase_uid,
      social?.facebook || null,
      social?.twitter || null,
      social?.linkedin || null,
      social?.instagram || null,
    ];
    console.log("🔹 Inserting constant fields into MySQL...");
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

// GET Organization – Retrieves organization details using the verified firebase_uid.
async function getOrganization(conn, event) {
  try {
    const firebase_uid = (event.pathParameters && event.pathParameters.firebase_uid) || event.firebase_uid;
    console.log("🔹 Fetching organization for firebase_uid:", firebase_uid);
    if (!firebase_uid) {
      console.error("❌ firebase_uid is required.");
      return {
        statusCode: 400,
        headers: standardHeaders(),
        body: JSON.stringify({ message: "firebase_uid is required" }),
      };
    }
    // Retrieve dynamic data from DynamoDB.
    const dynamoResult = await dynamoDB.get({ TableName: TABLE_NAME, Key: { id: firebase_uid } }).promise();
    console.log("🔹 DynamoDB result:", dynamoResult);
    if (!dynamoResult.Item) {
      console.error("❌ Organization not found in DynamoDB.");
      return {
        statusCode: 404,
        headers: standardHeaders(),
        body: JSON.stringify({ message: "Organization not found" }),
      };
    }
    // Retrieve constant fields from MySQL (profiles table).
    const [rows] = await conn.execute("SELECT * FROM profiles WHERE firebase_uid = ?", [firebase_uid]);
    console.log("🔹 MySQL result:", rows);
    await conn.release();
    const profileData = rows[0] || {};
    const mergedResult = { ...dynamoResult.Item, ...profileData };
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

// UPDATE Organization – Updates organization details using the verified firebase_uid.
async function updateOrganization(conn, event) {
  try {
    const {
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
    if (type === "Parent/Guardian Looking for Tuitions" || type === "Parent/ Guardian looking for Tuitions") {
      dynamicData.parent_details = parent_details;
    } else {
      dynamicData.organization_details = {
        ...organization_details,
        institution_photos: uploadedImages.length > 0 ? uploadedImages : organization_details.institution_photos,
      };
    }
    if (additional_owner) dynamicData.additional_owner = additional_owner;
    if (reporting_authority) dynamicData.reporting_authority = reporting_authority;
    console.log("🔹 Updating dynamic data in DynamoDB...");
    await dynamoDB.put({ TableName: TABLE_NAME, Item: dynamicData }).promise();
    // Update constant fields in MySQL (profiles table)
    const updateSql = `
      UPDATE profiles 
      SET facebook = ?, twitter = ?, linkedin = ?, instagram = ?
      WHERE firebase_uid = ?
    `;
    const values = [
      social?.facebook || null,
      social?.twitter || null,
      social?.linkedin || null,
      social?.instagram || null,
      firebase_uid,
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

// DELETE Organization – Deletes organization details using the verified firebase_uid.
async function deleteOrganization(conn, event) {
  try {
    const firebase_uid = (event.pathParameters && event.pathParameters.firebase_uid) || event.firebase_uid;
    console.log("🔹 Deleting organization for firebase_uid:", firebase_uid);
    if (!firebase_uid) {
      console.error("❌ firebase_uid is required for deletion.");
      return {
        statusCode: 400,
        headers: standardHeaders(),
        body: JSON.stringify({ message: "firebase_uid is required" }),
      };
    }
    // Retrieve dynamic data from DynamoDB to delete associated images from S3 if any.
    const dynamoResult = await dynamoDB.get({ TableName: TABLE_NAME, Key: { id: firebase_uid } }).promise();
    if (!dynamoResult.Item) {
      console.error("❌ Organization not found for deletion.");
      return {
        statusCode: 404,
        headers: standardHeaders(),
        body: JSON.stringify({ message: "Organization not found" }),
      };
    }
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
      await s3.deleteObjects({
        Bucket: S3_BUCKET_NAME,
        Delete: { Objects: deleteObjects },
      }).promise();
    }
    console.log("🔹 Deleting dynamic data from DynamoDB...");
    await dynamoDB.delete({ TableName: TABLE_NAME, Key: { id: firebase_uid } }).promise();
    console.log("🔹 Deleting constant data from MySQL...");
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
