import { pool } from './db.js'; // Ensure pool is correctly exported from db.js

// CORS helper – returns headers to include in every response.
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
  };
}

export const handler = async (event) => {
  const { httpMethod, body, queryStringParameters } = event;
  console.log('Event:', event);

  try {
    // Handle preflight OPTIONS request
    if (httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders(),
        body: JSON.stringify({ message: 'Preflight request successful' }),
      };
    }

    switch (httpMethod) {
      case 'GET':
        return await getAdditionalInformation(event);
      // Use upsert logic for both POST and PUT to update current user data.
      case 'POST':
      case 'PUT':
        return await upsertAdditionalInformation(body);
      case 'DELETE':
        return await deleteAdditionalInformation(body);
      default:
        return {
          statusCode: 405,
          headers: corsHeaders(),
          body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};

// ================= UPSERT (POST/PUT) =================
// This function inserts a new record into additional_information2 or updates an existing record
// based on the unique firebase_uid (or firebase_id).
const upsertAdditionalInformation = async (requestBody) => {
  console.log('Upsert Additional Information Body:', requestBody);
  try {
    const connection = await pool.getConnection();
    let records = JSON.parse(requestBody);

    // Ensure records is always an array; if not, wrap it.
    if (!Array.isArray(records)) {
      records = [records];
    }

    // Map each record to an array of values corresponding to the table fields.
    const values = records.map(record => {
      const finalFirebaseUID = record.firebase_uid || record.firebase_id || null;
      const {
        religion,
        differently_abled,
        health_issues,
        aadhaar_number,
        citizenship,
        preferable_timings,
        passport_available,
        passport_expiry_date,
        work_permit_details,
        criminal_charges,
        additional_info
      } = record;

      return [
        finalFirebaseUID,
        religion || null,
        differently_abled || 'No',
        health_issues || 'No',
        aadhaar_number || null,
        citizenship || null,
        preferable_timings || null,
        passport_available || 'No',
        passport_expiry_date || null,
        work_permit_details || null,
        criminal_charges || 'No',
        additional_info || null
      ];
    });

    const query = `
      INSERT INTO additional_information2 (
        firebase_uid,
        religion,
        differently_abled,
        health_issues,
        aadhaar_number,
        citizenship,
        preferable_timings,
        passport_available,
        passport_expiry_date,
        work_permit_details,
        criminal_charges,
        additional_info
      ) VALUES ?
      ON DUPLICATE KEY UPDATE
        religion = VALUES(religion),
        differently_abled = VALUES(differently_abled),
        health_issues = VALUES(health_issues),
        aadhaar_number = VALUES(aadhaar_number),
        citizenship = VALUES(citizenship),
        preferable_timings = VALUES(preferable_timings),
        passport_available = VALUES(passport_available),
        passport_expiry_date = VALUES(passport_expiry_date),
        work_permit_details = VALUES(work_permit_details),
        criminal_charges = VALUES(criminal_charges),
        additional_info = VALUES(additional_info)
    `;

    await connection.query(query, [values]);
    connection.release();

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Additional information upserted successfully' }),
    };
  } catch (error) {
    console.error('Error upserting additional information:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};

// ================= GET (GET) =================
const getAdditionalInformation = async (event) => {
  console.log('Get Additional Information Event:', event);
  try {
    const connection = await pool.getConnection();
    // If an "id" query parameter is provided, get that record; otherwise, return all records.
    const id = event.queryStringParameters ? event.queryStringParameters.id : null;
    const query = id
      ? 'SELECT * FROM additional_information2 WHERE id = ?'
      : 'SELECT * FROM additional_information2';
    const params = id ? [id] : [];
    const [results] = await connection.query(query, params);
    connection.release();

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error('Error fetching additional information:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};

// ================= DELETE (DELETE) =================
const deleteAdditionalInformation = async (requestBody) => {
  console.log('Delete Additional Information Body:', requestBody);
  try {
    const connection = await pool.getConnection();
    // Expecting a JSON array of id values.
    const ids = JSON.parse(requestBody);
    const query = 'DELETE FROM additional_information2 WHERE id IN (?)';
    await connection.query(query, [ids]);
    connection.release();

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Additional information deleted successfully' }),
    };
  } catch (error) {
    console.error('Error deleting additional information:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};
