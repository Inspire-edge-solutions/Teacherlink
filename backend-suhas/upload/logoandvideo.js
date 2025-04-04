import AWS from 'aws-sdk';
import mysql from 'mysql2/promise';

// S3 bucket names.
const BUCKET_IMAGE = "profile-image-teacherlink";
const BUCKET_VIDEO = "profile-video-teacherlink";
const BUCKET_RESUME = "resume-upload-profile";

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

// Allowed MIME types.
const IMAGE_TYPES = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const RESUME_TYPES = ["application/pdf"]; // For resume view, we'll assume PDF

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

// -----------------------
// POST /upload-image
// -----------------------
const uploadImagePostHandler = async (event) => {
  try {
    const payload = JSON.parse(event.body);
    const { file, fileType, firebase_uid } = payload;
    if (!file) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ message: "File data is required" })
      };
    }
    const mime = fileType || detectMimeType(file);
    if (!mime || !IMAGE_TYPES.includes(mime)) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ message: "Invalid file type for image" })
      };
    }
    const base64Content = file.includes(",") ? file.split(",")[1] : file;
    const fileBuffer = Buffer.from(base64Content, "base64");
    const ext = getExtension(mime);
    const key = `${BUCKET_IMAGE}-${Date.now()}.${ext}`;
    
    const s3 = new AWS.S3();
    await s3.putObject({
      Bucket: BUCKET_IMAGE,
      Key: key,
      Body: fileBuffer,
      ContentType: mime
    }).promise();

    const upsertQuery = `
      INSERT INTO profilePic (firebase_uid, profile_image_id)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE profile_image_id = VALUES(profile_image_id), id = LAST_INSERT_ID(id)
    `;
    const [result] = await pool.execute(upsertQuery, [firebase_uid, key]);
    const insertedId = result.insertId;

    return {
      statusCode: 201,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Image uploaded successfully", key, id: insertedId })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Internal Server Error", error: error.message })
    };
  }
};

// -----------------------
// GET /upload-video
// This endpoint is used for both uploading and viewing video.
// When query param action=view is provided, it returns a GET URL for viewing.
const generateVideoUploadUrlHandler = async (event) => {
  try {
    const queryParams = event.queryStringParameters || {};
    const fileType = queryParams.fileType || "video/mp4";
    const firebase_uid = queryParams.firebase_uid || null;

    // If action=view, return GET URL
    if (queryParams.action === "view") {
      return await getVideoUrlHandler(event);
    }

    if (!VIDEO_TYPES.includes(fileType)) {
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
    const url = s3.getSignedUrl("putObject", params);

    const upsertQuery = `
      INSERT INTO profilePic (firebase_uid, profile_video_id)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE profile_video_id = VALUES(profile_video_id)
    `;
    await pool.execute(upsertQuery, [firebase_uid, key]);

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ url, key })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Internal Server Error", error: error.message })
    };
  }
};

// GET video URL for viewing.
const getVideoUrlHandler = async (event) => {
  try {
    const { firebase_uid } = event.queryStringParameters || {};
    if (!firebase_uid) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ message: "firebase_uid is required" })
      };
    }
    const selectQuery = `SELECT profile_video_id FROM profilePic WHERE firebase_uid = ?`;
    const [rows] = await pool.execute(selectQuery, [firebase_uid]);
    if (!rows.length || !rows[0].profile_video_id) {
      return {
        statusCode: 404,
        headers: corsHeaders(),
        body: JSON.stringify({ message: "No video found for this user" })
      };
    }
    const storedVideoKey = rows[0].profile_video_id;
    const s3 = new AWS.S3();
    const getParams = {
      Bucket: BUCKET_VIDEO,
      Key: storedVideoKey,
      Expires: 300
    };
    const getUrl = s3.getSignedUrl("getObject", getParams);
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ url: getUrl, key: storedVideoKey })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Internal Server Error", error: error.message })
    };
  }
};

// -----------------------
// GET /upload-resume (with action=view) OR POST /upload-resume (for upload)
// -----------------------
const getResumeUrlHandler = async (event) => {
  try {
    const { firebase_uid } = event.queryStringParameters || {};
    if (!firebase_uid) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ message: "firebase_uid is required" })
      };
    }
    const selectQuery = `SELECT resume_id FROM profilePic WHERE firebase_uid = ?`;
    const [rows] = await pool.execute(selectQuery, [firebase_uid]);
    if (!rows.length || !rows[0].resume_id) {
      return {
        statusCode: 404,
        headers: corsHeaders(),
        body: JSON.stringify({ message: "No resume found for this user" })
      };
    }
    const storedResumeKey = rows[0].resume_id;
    const s3 = new AWS.S3();
    const getParams = {
      Bucket: BUCKET_RESUME,
      Key: storedResumeKey,
      Expires: 300
    };
    const getUrl = s3.getSignedUrl("getObject", getParams);
    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ url: getUrl, key: storedResumeKey })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Internal Server Error", error: error.message })
    };
  }
};

const uploadResumePostHandler = async (event) => {
  try {
    const payload = JSON.parse(event.body);
    const { file, fileType, firebase_uid } = payload;
    if (!file) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ message: "File data is required" })
      };
    }
    const mime = fileType || detectMimeType(file);
    if (!mime || !RESUME_TYPES.includes(mime)) {
      return {
        statusCode: 400,
        headers: corsHeaders(),
        body: JSON.stringify({ message: "Invalid file type for resume" })
      };
    }
    const base64Content = file.includes(",") ? file.split(",")[1] : file;
    const fileBuffer = Buffer.from(base64Content, "base64");
    const ext = getExtension(mime);
    const key = `${BUCKET_RESUME}-${Date.now()}.${ext}`;
    
    const s3 = new AWS.S3();
    await s3.putObject({
      Bucket: BUCKET_RESUME,
      Key: key,
      Body: fileBuffer,
      ContentType: mime
    }).promise();

    const upsertQuery = `
      INSERT INTO profilePic (firebase_uid, resume_id)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE resume_id = VALUES(resume_id), id = LAST_INSERT_ID(id)
    `;
    const [result] = await pool.execute(upsertQuery, [firebase_uid, key]);
    const insertedId = result.insertId;
    return {
      statusCode: 201,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Resume uploaded successfully", key, id: insertedId })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Internal Server Error", error: error.message })
    };
  }
};

// -----------------------
// Main router.
// -----------------------
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
    if (event.queryStringParameters && event.queryStringParameters.action === "view") {
      return await getVideoUrlHandler(event);
    } else {
      return await generateVideoUploadUrlHandler(event);
    }
  } else if (event.path === "/upload-resume") {
    if (event.httpMethod === "GET" && event.queryStringParameters && event.queryStringParameters.action === "view") {
      return await getResumeUrlHandler(event);
    } else if (event.httpMethod === "POST") {
      return await uploadResumePostHandler(event);
    }
  } else {
    return {
      statusCode: 404,
      headers: corsHeaders(),
      body: JSON.stringify({ message: "Not Found" })
    };
  }
};
