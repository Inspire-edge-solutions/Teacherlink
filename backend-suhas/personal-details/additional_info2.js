import { pool } from './db.js'; // Ensure pool is correctly exported from db.js

// CORS helper
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
    switch (httpMethod) {
      case 'GET':
        return await getAdditionalInformation(event);
      case 'POST':
        return await createAdditionalInformation(body);
      case 'PUT':
        return await updateAdditionalInformation(body);
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

// ================= CREATE (POST) =================
const createAdditionalInformation = async (requestBody) => {
  console.log('Create Additional Information Body:', requestBody);
  try {
    const connection = await pool.getConnection();
    let records = JSON.parse(requestBody);

    // Ensure records is an array
    if (!Array.isArray(records)) {
      records = [records];
    }

    // Map each record to an array of values corresponding to the table fields.
    // The order of fields must match the INSERT query below.
    const values = records.map(record => {
      const {
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
      } = record;

      return [
        firebase_uid !== undefined ? firebase_uid : null,
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
    `;

    await connection.query(query, [values]);
    connection.release();

    return {
      statusCode: 201,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Additional information created successfully' }),
    };
  } catch (error) {
    console.error('Error creating additional information:', error);
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
    // If an "id" query parameter is provided, get that record; otherwise, return all.
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

// ================= UPDATE (PUT) =================
const updateAdditionalInformation = async (requestBody) => {
  console.log('Update Additional Information Body:', requestBody);
  try {
    const connection = await pool.getConnection();
    let records = JSON.parse(requestBody);

    // Ensure records is an array
    const recordsArray = Array.isArray(records) ? records : [records];

    // For each record, update by id.
    const queries = recordsArray.map(record => {
      const {
        id,
        computer_skills, // This field is not present here, so skip.
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
      const query = `
        UPDATE additional_information2
        SET religion = ?,
            differently_abled = ?,
            health_issues = ?,
            aadhaar_number = ?,
            citizenship = ?,
            preferable_timings = ?,
            passport_available = ?,
            passport_expiry_date = ?,
            work_permit_details = ?,
            criminal_charges = ?,
            additional_info = ?
        WHERE id = ?
      `;
      return connection.query(query, [
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
        additional_info || null,
        id
      ]);
    });

    await Promise.all(queries);
    connection.release();

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Additional information updated successfully' }),
    };
  } catch (error) {
    console.error('Error updating additional information:', error);
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
    const ids = JSON.parse(requestBody); // Expecting an array of ids

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
