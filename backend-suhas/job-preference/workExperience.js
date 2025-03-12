import AWS from 'aws-sdk';
import { pool } from './db.js'; // Ensure db.js is in the same directory

// Initialize AWS clients.
const s3 = new AWS.S3();
const ddb = new AWS.DynamoDB.DocumentClient();

// Constants
const PAYSLIP_BUCKET = 'my-firstapp-pay-slips';
const MYSQL_TABLE = 'workExperience';
// For DynamoDB, use environment variable if set, otherwise default to "ExperienceTable".
const DYNAMODB_TABLE = process.env.DYNAMODB_TABLE || 'ExperienceTable';

// CORS headers for every response.
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
};

/**
 * Helper: Detect MIME type from a Base64 string.
 * Supports both data URL prefixed strings and raw Base64 signatures.
 */
const detectMimeType = (base64String) => {
  const trimmed = base64String.trim();
  if (trimmed.startsWith("data:")) {
    // e.g.: "data:application/pdf;base64,..."
    return trimmed.substring(5, trimmed.indexOf(';'));
  }
  if (trimmed.startsWith("JVBERi0")) return "application/pdf";
  if (trimmed.startsWith("iVBORw0KGgo")) return "image/png";
  if (trimmed.startsWith("/9j/")) return "image/jpeg";
  return null;
};

/**
 * Helper: Map a MIME type to a file extension.
 */
const getExtension = (mime) => {
  const mapping = {
    "application/pdf": "pdf",
    "image/png": "png",
    "image/jpeg": "jpg"
  };
  return mapping[mime] || "bin";
};

/**
 * Helper: Upload a pay slip (provided as a Base64 string) to S3.
 * Returns the public URL to the uploaded file.
 */
const uploadPaySlip = async (base64String) => {
  const mime = detectMimeType(base64String) || "application/pdf";
  // Remove any data URL prefix if exists.
  const base64Data = base64String.includes(',') ? base64String.split(',')[1] : base64String;
  const buffer = Buffer.from(base64Data, 'base64');
  const ext = getExtension(mime);
  const key = `payslip-${Date.now()}.${ext}`;
  const params = {
    Bucket: PAYSLIP_BUCKET,
    Key: key,
    Body: buffer,
    ContentEncoding: 'base64',
    ContentType: mime
  };
  await s3.putObject(params).promise();
  return `https://${PAYSLIP_BUCKET}.s3.amazonaws.com/${key}`;
};

/**
 * Main Lambda Handler – supports POST, PUT, GET, and DELETE methods.
 * For DynamoDB, the table's primary key "id" is set to firebase_uid.
 */
export const handler = async (event) => {
  try {
    const method = event.httpMethod;
    let response;

    // Handle preflight OPTIONS request.
    if (method === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Preflight request successful" })
      };
    }

    switch (method) {
      case 'POST': {
        // POST: Create a new work experience record.
        const body = JSON.parse(event.body);
        const { mysqlDB, dynamoDB } = body;
        const firebase_uid = mysqlDB.firebase_uid;
        if (!firebase_uid) throw new Error("Missing firebase_uid in mysqlDB");

        // Process detailed entries (upload paySlip if provided).
        const processedEntries = await Promise.all(
          dynamoDB.map(async (entry) => {
            if (entry.paySlip) {
              const payslipUrl = await uploadPaySlip(entry.paySlip);
              return { ...entry, paySlip: payslipUrl };
            }
            return entry;
          })
        );

        // Build the MySQL values array for 23 columns (firebase_uid + 22 fields).
        const mysqlValues = [
          firebase_uid,
          mysqlDB.total_experience_years || null,
          mysqlDB.total_experience_months || null,
          mysqlDB.teaching_experience_years || null,
          mysqlDB.teaching_experience_months || null,
          mysqlDB.teaching_exp_fulltime_years || null,
          mysqlDB.teaching_exp_fulltime_months || null,
          mysqlDB.teaching_exp_partime_years || null,
          mysqlDB.teaching_exp_partime_months || null,
          mysqlDB.administration_fulltime_years || null,
          mysqlDB.administration_fulltime_months || null,
          mysqlDB.administration_partime_years || null,
          mysqlDB.administration_parttime_months || null,
          mysqlDB.anyrole_fulltime_years || null,
          mysqlDB.anyrole_fulltime_months || null,
          mysqlDB.anyrole_partime_years || null,
          mysqlDB.anyrole_parttime_months || null,
          mysqlDB.Ed_Tech_Company || null,
          mysqlDB.on_line || null,
          mysqlDB.coaching_tuitions_center || null,
          mysqlDB.group_tuitions || null,
          mysqlDB.private_tuitions || null,
          mysqlDB.home_tuitions || null,
        ];
        console.log("MySQL Values:", mysqlValues, "Length:", mysqlValues.length);
        if (mysqlValues.length !== 23) {
          throw new Error("Mismatch in number of columns and values for MySQL insert.");
        }
        const insertSql = `
          INSERT INTO ${MYSQL_TABLE} (
            firebase_uid,
            total_experience_years,
            total_experience_months,
            teaching_experience_years,
            teaching_experience_months,
            teaching_exp_fulltime_years,
            teaching_exp_fulltime_months,
            teaching_exp_partime_years,
            teaching_exp_partime_months,
            administration_fulltime_years,
            administration_fulltime_months,
            administration_partime_years,
            administration_parttime_months,
            anyrole_fulltime_years,
            anyrole_fulltime_months,
            anyrole_partime_years,
            anyrole_parttime_months,
            Ed_Tech_Company,
            on_line,
            coaching_tuitions_center,
            group_tuitions,
            private_tuitions,
            home_tuitions
          ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `;
        await pool.execute(insertSql, mysqlValues);

        // Use firebase_uid as the unique record identifier for DynamoDB.
        const recordId = firebase_uid;
        const dynamoItem = {
          id: recordId,
          firebase_uid: firebase_uid,
          experienceEntries: processedEntries
        };
        const ddbParams = {
          TableName: DYNAMODB_TABLE,
          Item: dynamoItem
        };
        await ddb.put(ddbParams).promise();

        response = {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({ message: "Record created successfully", firebase_uid })
        };
        break;
      }

      case 'PUT': {
        // PUT: Update an existing record.
        const body = JSON.parse(event.body);
        const { mysqlDB, dynamoDB } = body;
        const firebase_uid = mysqlDB.firebase_uid;
        if (!firebase_uid) throw new Error("Missing firebase_uid for update.");

        const processedEntries = await Promise.all(
          dynamoDB.map(async (entry) => {
            if (entry.paySlip && entry.paySlip.startsWith("data:")) {
              const payslipUrl = await uploadPaySlip(entry.paySlip);
              return { ...entry, paySlip: payslipUrl };
            }
            return entry;
          })
        );

        const updateValues = [
          mysqlDB.total_experience_years || null,
          mysqlDB.total_experience_months || null,
          mysqlDB.teaching_experience_years || null,
          mysqlDB.teaching_experience_months || null,
          mysqlDB.teaching_exp_fulltime_years || null,
          mysqlDB.teaching_exp_fulltime_months || null,
          mysqlDB.teaching_exp_partime_years || null,
          mysqlDB.teaching_exp_partime_months || null,
          mysqlDB.administration_fulltime_years || null,
          mysqlDB.administration_fulltime_months || null,
          mysqlDB.administration_partime_years || null,
          mysqlDB.administration_parttime_months || null,
          mysqlDB.anyrole_fulltime_years || null,
          mysqlDB.anyrole_fulltime_months || null,
          mysqlDB.anyrole_partime_years || null,
          mysqlDB.anyrole_parttime_months || null,
          mysqlDB.Ed_Tech_Company || null,
          mysqlDB.on_line || null,
          mysqlDB.coaching_tuitions_center || null,
          mysqlDB.group_tuitions || null,
          mysqlDB.private_tuitions || null,
          mysqlDB.home_tuitions || null,
          firebase_uid
        ];
        const updateSql = `
          UPDATE ${MYSQL_TABLE} SET
            total_experience_years = ?,
            total_experience_months = ?,
            teaching_experience_years = ?,
            teaching_experience_months = ?,
            teaching_exp_fulltime_years = ?,
            teaching_exp_fulltime_months = ?,
            teaching_exp_partime_years = ?,
            teaching_exp_partime_months = ?,
            administration_fulltime_years = ?,
            administration_fulltime_months = ?,
            administration_partime_years = ?,
            administration_parttime_months = ?,
            anyrole_fulltime_years = ?,
            anyrole_fulltime_months = ?,
            anyrole_partime_years = ?,
            anyrole_parttime_months = ?,
            Ed_Tech_Company = ?,
            on_line = ?,
            coaching_tuitions_center = ?,
            group_tuitions = ?,
            private_tuitions = ?,
            home_tuitions = ?
          WHERE firebase_uid = ?
        `;
        await pool.execute(updateSql, updateValues);

        const ddbParams = {
          TableName: DYNAMODB_TABLE,
          Item: {
            id: firebase_uid,
            firebase_uid: firebase_uid,
            experienceEntries: processedEntries
          }
        };
        await ddb.put(ddbParams).promise();

        response = {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({ message: "Record updated successfully" })
        };
        break;
      }

      case 'GET': {
        // GET: Retrieve record(s). If a "firebase_uid" query parameter is provided, return that record;
        // otherwise, return all records.
        let mysqlData, dynamoData;
        if (event.queryStringParameters && event.queryStringParameters.firebase_uid) {
          const firebase_uid = event.queryStringParameters.firebase_uid;
          const [rows] = await pool.execute(
            `SELECT * FROM ${MYSQL_TABLE} WHERE firebase_uid = ?`,
            [firebase_uid]
          );
          const ddbParams = {
            TableName: DYNAMODB_TABLE,
            Key: { id: firebase_uid }
          };
          const ddbData = await ddb.get(ddbParams).promise();
          mysqlData = rows;
          dynamoData = ddbData.Item || {};
        } else {
          const [rows] = await pool.execute(`SELECT * FROM ${MYSQL_TABLE}`);
          const ddbData = await ddb.scan({ TableName: DYNAMODB_TABLE }).promise();
          mysqlData = rows;
          dynamoData = ddbData.Items || [];
        }
        response = {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({
            mysqlData,
            dynamoData
          })
        };
        break;
      }

      case 'DELETE': {
        // DELETE: Remove record by firebase_uid.
        const firebase_uid = event.queryStringParameters && event.queryStringParameters.firebase_uid;
        if (!firebase_uid) throw new Error("Missing firebase_uid query parameter");

        await pool.execute(`DELETE FROM ${MYSQL_TABLE} WHERE firebase_uid = ?`, [firebase_uid]);
        const ddbParams = {
          TableName: DYNAMODB_TABLE,
          Key: { id: firebase_uid }
        };
        await ddb.delete(ddbParams).promise();

        response = {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({ message: "Record deleted successfully" })
        };
        break;
      }

      default:
        response = {
          statusCode: 405,
          headers: corsHeaders,
          body: JSON.stringify({ message: "Method Not Allowed" })
        };
    }
    return response;
  } catch (error) {
    console.error("Error in workExperience handler:", error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Internal Server Error",
        error: error.message
      })
    };
  }
};
