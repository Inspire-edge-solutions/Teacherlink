import AWS from 'aws-sdk';
import mysql from 'mysql2/promise';

// S3 bucket names.
const BUCKET_IMAGE = "profile-image-teacherlink";
const BUCKET_VIDEO = "profile-video-teacherlink";

// Create a MySQL connection pool.
const pool = mysql.createPool({
  host: 'inspire-edge-db.cnawwwkeyq7q.ap-south-1.rds.amazonaws.com',
  user: 'teacherlink_user',
  password: 'Inspireedge2024',
  database: 'tea',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Allowed MIME types for images and videos.
const IMAGE_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

// Helper: Detect MIME type from a Base64 string.
const detectMimeType = (base64String) => {
  const trimmed = base64String.trim();
  if (trimmed.startsWith("data:")) {
    const typePart = trimmed.split(";")[0];
    return typePart.split(":")[1];
  }
  if (trimmed.startsWith("JVBERi0")) return "application/pdf";
  if (trimmed.startsWith("iVBORw0KGgo")) return "image/png";
  if (trimmed.startsWith("/9j/")) return "image/jpeg";
  return null;
};

// Helper: Get file extension based on MIME type.
const getExtension = (mimeType) => {
  const map = {
    "application/pdf": "pdf",
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/quicktime": "mov"
  };
  return map[mimeType] || "bin";
};

// Helper: Return CORS headers.
const corsHeaders = () => ({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE"
});

// POST /upload-image: Upload image to S3 and INSERT a new row with firebase_uid and the image key, returning the new row ID.
const uploadImagePostHandler = async (event) => {
  try {
    console.log("uploadImagePostHandler invoked");
    // Parse the incoming payload.
    const payload = JSON.parse(event.body);
    const { file, fileType, firebase_uid } = payload;
    if (!file) {
      console.error("No file in payload");
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ message: "File data is required" })
      };
    }
    // Determine the MIME type.
    const mime = fileType || detectMimeType(file);
    if (!mime || !IMAGE_TYPES.includes(mime)) {
      console.error("Invalid file type:", mime);
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ message: "Invalid file type for image" })
      };
    }
    // Convert Base64 to Buffer (strip out any data URI prefix).
    const base64Content = file.includes(",") ? file.split(",")[1] : file;
    const fileBuffer = Buffer.from(base64Content, "base64");
    const ext = getExtension(mime);
    const key = `${BUCKET_IMAGE}-${Date.now()}.${ext}`;
    
    // Upload the image to S3.
    const s3 = new AWS.S3();
    const s3Params = {
      Bucket: BUCKET_IMAGE,
      Key: key,
      Body: fileBuffer,
      ContentType: mime
    };
    await s3.putObject(s3Params).promise();
    console.log("Image uploaded to S3 with key:", key);

    // Insert a new row into the profilePic table with firebase_uid and the image key.
    const insertQuery = "INSERT INTO profilePic (firebase_uid, profile_image_id) VALUES (?, ?)";
    const [result] = await pool.execute(insertQuery, [firebase_uid || null, key]);
    console.log("Inserted row into DB with image key:", key, "Result:", result);

    // This is the auto-incremented ID of the newly inserted row.
    const insertedId = result.insertId;

    // Extra debugging: select the most recent row.
    const [rows] = await pool.execute("SELECT * FROM profilePic ORDER BY id DESC LIMIT 1");
    console.log("Most recent row after image insert:", rows);

    // Return the row ID so the front-end can store it.
    return {
      statusCode: 201,
      headers: corsHeaders(),
      body: JSON.stringify({ 
        message: "Image uploaded successfully", 
        key, 
        id: insertedId 
      })
    };
  } catch (error) {
    console.error("Error in uploadImagePostHandler:", error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Internal Server Error", error: error.message })
    };
  }
};

// GET /upload-video: Generate a pre-signed URL for video upload. If an id is provided, UPDATE that row with firebase_uid; otherwise, INSERT a new row.
const generateVideoUploadUrlHandler = async (event) => {
  try {
    // Parse query params.
    const fileType = (event.queryStringParameters && event.queryStringParameters.fileType) || "video/mp4";
    const id = event.queryStringParameters && event.queryStringParameters.id; // The row ID (if any)
    const firebase_uid = (event.queryStringParameters && event.queryStringParameters.firebase_uid) || null;

    if (!VIDEO_TYPES.includes(fileType)) {
      console.error("Invalid video file type:", fileType);
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ message: "Invalid video file type" })
      };
    }

    const ext = fileType === "video/quicktime" ? "mov" : fileType.split("/")[1];
    const key = `${BUCKET_VIDEO}-${Date.now()}.${ext}`;
    
    const s3 = new AWS.S3();
    const params = {
      Bucket: BUCKET_VIDEO,
      Key: key,
      Expires: 300,
      ContentType: fileType
    };
    // Generate pre-signed URL.
    const url = s3.getSignedUrl('putObject', params);
    console.log("Generated pre-signed URL for video:", url);

    let result;
    if (id) {
      // Update the existing row with the video key.
      const updateQuery = "UPDATE profilePic SET profile_video_id = ?, firebase_uid = ? WHERE id = ?";
      [result] = await pool.execute(updateQuery, [key, firebase_uid, id]);
      console.log(`Updated row ${id} with video key: ${key}`, "Result:", result);
    } else {
      // No id provided: insert a new row with firebase_uid and video key.
      const insertQuery = "INSERT INTO profilePic (firebase_uid, profile_video_id) VALUES (?, ?)";
      [result] = await pool.execute(insertQuery, [firebase_uid, key]);
      console.log("Inserted row into DB with video key:", key, "Result:", result);
    }

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ url, key })
    };
  } catch (error) {
    console.error("Error in generateVideoUploadUrlHandler:", error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Internal Server Error", error: error.message })
    };
  }
};

// Main router.
export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "CORS preflight OK" })
    };
  }

  if (event.path === "/upload-image" && event.httpMethod === "POST") {
    return await uploadImagePostHandler(event);
  } else if (event.path === "/upload-video" && event.httpMethod === "GET") {
    return await generateVideoUploadUrlHandler(event);
  } else {
    return {
      statusCode: 404,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Not Found" })
    };
  }
};
