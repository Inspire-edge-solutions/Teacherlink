import { pool } from './db.js'; // Ensure pool is correctly exported from db.js

// CORS helper: returns headers to include in every response.
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
    // Immediately handle preflight OPTIONS requests.
    if (httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders(),
        body: JSON.stringify({ message: 'Preflight request successful' }),
      };
    }

    switch (httpMethod) {
      case 'GET':
        return await getSocialProfiles(event);
      // Use the same upsert logic for both POST and PUT.
      case 'POST':
      case 'PUT':
        return await upsertSocialProfiles(body);
      case 'DELETE':
        return await deleteSocialProfiles(body);
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

/**
 * UPSERT Social Profiles:
 * This function accepts a JSON string in the request body, ensuring the data is an array,
 * and then uses an INSERT ... ON DUPLICATE KEY UPDATE query to either create a new record
 * (if the firebase_uid is new) or update the existing record.
 *
 * Note:
 * - The input may include a field "firebase_id"; if so, it's remapped to "firebase_uid".
 * - Only the following fields are used: firebase_uid, facebook, linkedin.
 */
const upsertSocialProfiles = async (requestBody) => {
  console.log('Upsert Social Profiles Body:', requestBody);
  try {
    const connection = await pool.getConnection();
    let profiles = JSON.parse(requestBody);

    // Ensure profiles is always an array.
    if (!Array.isArray(profiles)) {
      profiles = [profiles];
    }

    // Map each profile into an array of values corresponding to the table columns.
    // We remap firebase_id to firebase_uid if needed, and ignore extra fields.
    const values = profiles.map(profile => {
      // Use firebase_id if firebase_uid is not provided.
      const firebase_uid = profile.firebase_uid || profile.firebase_id || null;
      const facebook = profile.facebook || null;
      const linkedin = profile.linkedin || null;
      return [firebase_uid, facebook, linkedin];
    });

    // Using INSERT ... ON DUPLICATE KEY UPDATE to upsert the record.
    const query = `
      INSERT INTO SocialProfiles (firebase_uid, facebook, linkedin)
      VALUES ?
      ON DUPLICATE KEY UPDATE
        facebook = VALUES(facebook),
        linkedin = VALUES(linkedin)
    `;
    await connection.query(query, [values]);
    connection.release();

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Social profiles upserted successfully' }),
    };
  } catch (error) {
    console.error('Error upserting social profiles:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};

/**
 * GET Social Profiles:
 * Retrieves either all social profiles or a specific record based on a provided id or firebase_uid.
 */
const getSocialProfiles = async (event) => {
  console.log('Get Social Profiles Event:', event);
  try {
    const connection = await pool.getConnection();
    let query;
    const params = [];

    // Check if query parameters for id or firebase_uid are provided.
    if (event.queryStringParameters) {
      if (event.queryStringParameters.id) {
        query = 'SELECT * FROM SocialProfiles WHERE id = ?';
        params.push(event.queryStringParameters.id);
      } else if (event.queryStringParameters.firebase_uid) {
        query = 'SELECT * FROM SocialProfiles WHERE firebase_uid = ?';
        params.push(event.queryStringParameters.firebase_uid);
      } else {
        query = 'SELECT * FROM SocialProfiles';
      }
    } else {
      query = 'SELECT * FROM SocialProfiles';
    }
    const [results] = await connection.query(query, params);
    connection.release();

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error('Error fetching social profiles:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};

/**
 * DELETE Social Profiles:
 * Deletes one or more social profile records based on an array of id values.
 */
const deleteSocialProfiles = async (requestBody) => {
  console.log('Delete Social Profiles Body:', requestBody);
  try {
    const connection = await pool.getConnection();
    const ids = JSON.parse(requestBody); // Expecting an array of ids.
    const query = 'DELETE FROM SocialProfiles WHERE id IN (?)';
    await connection.query(query, [ids]);
    connection.release();

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Social profiles deleted successfully' }),
    };
  } catch (error) {
    console.error('Error deleting social profiles:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};
