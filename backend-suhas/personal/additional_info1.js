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
    // Handle preflight OPTIONS request immediately.
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
      // For both POST and PUT, we use the same upsert logic.
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
// This function inserts a new record or updates an existing record in additional_information1
// based on the firebase_uid (or firebase_id) field.
const upsertAdditionalInformation = async (requestBody) => {
  console.log('Upsert Additional Information Body:', requestBody);
  try {
    const connection = await pool.getConnection();
    let records = JSON.parse(requestBody);

    // Ensure records is always an array.
    if (!Array.isArray(records)) {
      records = [records];
    }

    // Map each record to an array of values corresponding to the table columns.
    // We remap firebase_uid: try record.firebase_uid; if missing, check record.firebase_id.
    const values = records.map(record => {
      const finalFirebaseUID = record.firebase_uid || record.firebase_id || null;
      const {
        computer_skills,
        accounting_knowledge,
        projects,
        accomplishments,
        certifications,
        research_publications,
        patents,
        marital_status,
        spouse_need_job,
        spouse_name,
        spouse_qualification,
        spouse_work_experience,
        spouse_expertise,
        accommodation_required
      } = record;
      return [
        finalFirebaseUID,
        computer_skills ? JSON.stringify(computer_skills) : null,
        accounting_knowledge || null,
        projects || null,
        accomplishments || null,
        certifications || null,
        research_publications || null,
        patents || null,
        marital_status, // Expect a value from ('Single', 'Married', 'Divorced', 'Widowed', 'Other')
        spouse_need_job || 'No',
        spouse_name || null,
        spouse_qualification || null,
        spouse_work_experience || null,
        spouse_expertise || null,
        accommodation_required || 'No'
      ];
    });

    const query = `
      INSERT INTO additional_information1 (
        firebase_uid,
        computer_skills,
        accounting_knowledge,
        projects,
        accomplishments,
        certifications,
        research_publications,
        patents,
        marital_status,
        spouse_need_job,
        spouse_name,
        spouse_qualification,
        spouse_work_experience,
        spouse_expertise,
        accommodation_required
      ) VALUES ?
      ON DUPLICATE KEY UPDATE
        computer_skills = VALUES(computer_skills),
        accounting_knowledge = VALUES(accounting_knowledge),
        projects = VALUES(projects),
        accomplishments = VALUES(accomplishments),
        certifications = VALUES(certifications),
        research_publications = VALUES(research_publications),
        patents = VALUES(patents),
        marital_status = VALUES(marital_status),
        spouse_need_job = VALUES(spouse_need_job),
        spouse_name = VALUES(spouse_name),
        spouse_qualification = VALUES(spouse_qualification),
        spouse_work_experience = VALUES(spouse_work_experience),
        spouse_expertise = VALUES(spouse_expertise),
        accommodation_required = VALUES(accommodation_required)
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
      ? 'SELECT * FROM additional_information1 WHERE id = ?'
      : 'SELECT * FROM additional_information1';
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
    const query = 'DELETE FROM additional_information1 WHERE id IN (?)';
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
