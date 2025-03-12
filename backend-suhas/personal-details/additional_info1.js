import { pool } from './db.js'; // Assuming pool is exported from db.js

export const handler = async (event) => {
  const { httpMethod, body, queryStringParameters } = event;
  console.log('Event:', event);

  try {
    switch (httpMethod) {
      case 'GET':
        return await getAdditionalInfo(event);
      case 'POST':
        return await createAdditionalInfo(body);
      case 'PUT':
        return await updateAdditionalInfo(body);
      case 'DELETE':
        return await deleteAdditionalInfo(body);
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

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
  };
}

// ================= CREATE (POST) =================
const createAdditionalInfo = async (requestBody) => {
  console.log('Create Additional Info Body:', requestBody);
  try {
    const connection = await pool.getConnection();
    let records = JSON.parse(requestBody);

    // Ensure records is an array; if not, wrap it.
    if (!Array.isArray(records)) {
      records = [records];
    }

    // Map each record to an array of values.
    // We assume that the computer_skills field is an object that we'll stringify.
    const values = records.map(record => {
      const {
        firebase_uid,
        computer_skills, // Expected to be an object or array
        accounting_knowledge,
        projects,
        accomplishments,
        certifications,
        research_publications,
        patents,
        marital_status,
        spouse_need_job, // optional, default 'No'
        spouse_name,
        spouse_qualification,
        spouse_work_experience,
        spouse_expertise,
        accommodation_required // optional, default 'No'
      } = record;
      return [
        firebase_uid !== undefined ? firebase_uid : null,
        JSON.stringify(computer_skills || {}), // convert computer_skills to JSON string
        accounting_knowledge || null,
        projects || null,
        accomplishments || null,
        certifications || null,
        research_publications || null,
        patents || null,
        marital_status, // required field
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
      )
      VALUES ?
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
const getAdditionalInfo = async (event) => {
  console.log('Get Additional Info Event:', event);
  try {
    const connection = await pool.getConnection();
    // If an "id" query parameter is provided, get that record; otherwise, return all.
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

// ================= UPDATE (PUT) =================
const updateAdditionalInfo = async (requestBody) => {
  console.log('Update Additional Info Body:', requestBody);
  try {
    const connection = await pool.getConnection();
    let records = JSON.parse(requestBody);

    // Ensure records is an array
    const recordsArray = Array.isArray(records) ? records : [records];

    // For each record, update by id.
    const queries = recordsArray.map(record => {
      const {
        id,
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
      // Update query for additional_information1 table.
      const query = `
        UPDATE additional_information1
        SET computer_skills = ?,
            accounting_knowledge = ?,
            projects = ?,
            accomplishments = ?,
            certifications = ?,
            research_publications = ?,
            patents = ?,
            marital_status = ?,
            spouse_need_job = ?,
            spouse_name = ?,
            spouse_qualification = ?,
            spouse_work_experience = ?,
            spouse_expertise = ?,
            accommodation_required = ?
        WHERE id = ?
      `;
      return connection.query(query, [
        JSON.stringify(computer_skills || {}),
        accounting_knowledge || null,
        projects || null,
        accomplishments || null,
        certifications || null,
        research_publications || null,
        patents || null,
        marital_status,
        spouse_need_job || 'No',
        spouse_name || null,
        spouse_qualification || null,
        spouse_work_experience || null,
        spouse_expertise || null,
        accommodation_required || 'No',
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
const deleteAdditionalInfo = async (requestBody) => {
  console.log('Delete Additional Info Body:', requestBody);
  try {
    const connection = await pool.getConnection();
    const ids = JSON.parse(requestBody); // Expecting an array of ids to delete

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
