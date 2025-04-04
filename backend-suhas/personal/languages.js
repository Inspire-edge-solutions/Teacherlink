import { pool } from './db.js'; // Assuming pool is exported from db.js

export const handler = async (event) => {
  const { httpMethod, body, queryStringParameters } = event;
  console.log('Event:', event);

  try {
    switch (httpMethod) {
      case 'GET':
        return await getLanguages(event);
      case 'POST':
        return await upsertLanguages(body);  // <--- Use upsert logic
      case 'PUT':
        return await upsertLanguages(body);  // <--- Also upsert
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
      body: JSON.stringify({
        message: 'Internal Server Error',
        error: error.message
      }),
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

// ================== UPSERT LOGIC for POST/PUT ==================
//
// This function will insert a new row if firebase_uid is new,
// or update the existing row if firebase_uid already exists 
// (thanks to the UNIQUE constraint on firebase_uid).
//
const upsertLanguages = async (requestBody) => {
  console.log('Upsert Languages Body:', requestBody);
  try {
    const connection = await pool.getConnection();

    let record = JSON.parse(requestBody);
    // The front-end is sending something like:
    // {
    //   "languages": "[{\"language\":\"bodo\",\"speak\":true,...}]",
    //   "firebase_uid": "xyz"
    // }
    
    // We'll store the 'languages' JSON in the languages column,
    // and upsert based on the firebase_uid unique key.
    const { firebase_uid, languages } = record;
    if (!firebase_uid) {
      throw new Error('Missing firebase_uid');
    }

    // Insert... On Duplicate Key => update
    // We'll update the languages column if a row with firebase_uid already exists
    const sql = `
      INSERT INTO languages (firebase_uid, languages)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE
        languages = VALUES(languages)
    `;

    // The front-end's languages is already a JSON string,
    // so we can store it as is. Or parse it if needed, 
    // but storing as a string is fine if 'languages' is a TEXT/JSON column.
    await connection.query(sql, [firebase_uid, languages]);
    connection.release();

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Languages upserted successfully' }),
    };
  } catch (error) {
    console.error('Error upserting languages:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({
        message: 'Internal Server Error',
        error: error.message
      }),
    };
  }
};

// ================== GET (GET /languages) ==================
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
      body: JSON.stringify({
        message: 'Internal Server Error',
        error: error.message
      }),
    };
  }
};

// ================== DELETE (DELETE /languages) ==================
const deleteLanguages = async (requestBody) => {
  console.log('Delete Languages Body:', requestBody);
  try {
    const connection = await pool.getConnection();
    const ids = JSON.parse(requestBody); // Expecting an array of ids

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
      body: JSON.stringify({
        message: 'Internal Server Error',
        error: error.message
      }),
    };
  }
};
