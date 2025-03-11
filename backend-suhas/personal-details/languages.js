import { pool } from './db.js'; // Assuming pool is exported from db.js

export const handler = async (event) => {
  const { httpMethod, body, queryStringParameters } = event;
  console.log('Event:', event);

  try {
    switch (httpMethod) {
      case 'GET':
        return await getLanguages(event);
      case 'POST':
        return await createLanguages(body);
      case 'PUT':
        return await updateLanguages(body);
      case 'DELETE':
        return await deleteLanguages(body);
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
const createLanguages = async (requestBody) => {
  console.log('Create Languages Body:', requestBody);
  try {
    const connection = await pool.getConnection();
    let languagesRecords = JSON.parse(requestBody);
    console.log('Parsed Languages:', languagesRecords);

    // Ensure languagesRecords is an array
    if (!Array.isArray(languagesRecords)) {
      languagesRecords = [languagesRecords];
    }

    // Map each record to an array: [firebase_uid, languages]
    // Here we stringify the languages object so it can be stored in the JSON column.
    const values = languagesRecords.map(record => {
      const { firebase_uid, languages } = record;
      return [
        firebase_uid !== undefined ? firebase_uid : null,
        JSON.stringify(languages)
      ];
    });

    const query = `
      INSERT INTO languages (firebase_uid, languages)
      VALUES ?
    `;
    await connection.query(query, [values]);
    connection.release();

    return {
      statusCode: 201,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Languages created successfully' }),
    };
  } catch (error) {
    console.error('Error creating languages:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};

// ================= GET (GET) =================
const getLanguages = async (event) => {
  console.log('Get Languages Event:', event);
  try {
    const connection = await pool.getConnection();
    const { id, firebase_uid } = event.queryStringParameters || {};
    let query;
    let params = [];

    if (id) {
      query = 'SELECT * FROM languages WHERE id = ?';
      params.push(id);
    } else if (firebase_uid) {
      query = 'SELECT * FROM languages WHERE firebase_uid = ?';
      params.push(firebase_uid);
    } else {
      query = 'SELECT * FROM languages';
    }
    const [results] = await connection.query(query, params);
    connection.release();

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error('Error fetching languages:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};

// ================= UPDATE (PUT) =================
const updateLanguages = async (requestBody) => {
  console.log('Update Languages Body:', requestBody);
  try {
    const connection = await pool.getConnection();
    let languagesRecords = JSON.parse(requestBody);

    // Ensure languagesRecords is an array
    const recordsArray = Array.isArray(languagesRecords) ? languagesRecords : [languagesRecords];

    const queries = recordsArray.map(record => {
      const { id, languages } = record;
      // Update the languages column by stringifying the provided languages object.
      const query = `
        UPDATE languages
        SET languages = ?
        WHERE id = ?
      `;
      return connection.query(query, [JSON.stringify(languages), id]);
    });

    await Promise.all(queries);
    connection.release();

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Languages updated successfully' }),
    };
  } catch (error) {
    console.error('Error updating languages:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};

// ================= DELETE (DELETE) =================
const deleteLanguages = async (requestBody) => {
  console.log('Delete Languages Body:', requestBody);
  try {
    const connection = await pool.getConnection();
    const ids = JSON.parse(requestBody); // Expecting an array of ids to delete

    const query = 'DELETE FROM languages WHERE id IN (?)';
    await connection.query(query, [ids]);
    connection.release();

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Languages deleted successfully' }),
    };
  } catch (error) {
    console.error('Error deleting languages:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};
