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
        return await getSocialProfiles(event);
      case 'POST':
        return await createSocialProfiles(body);
      case 'PUT':
        return await updateSocialProfiles(body);
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

// ================= CREATE (POST) =================
const createSocialProfiles = async (requestBody) => {
  console.log('Create Social Profiles Body:', requestBody);
  try {
    const connection = await pool.getConnection();
    let profiles = JSON.parse(requestBody);

    // Ensure profiles is always an array
    if (!Array.isArray(profiles)) {
      profiles = [profiles];
    }

    // Map each profile object into an array of values corresponding to the table columns.
    const values = profiles.map(profile => {
      const {
        firebase_uid,
        facebook,
        linkedin,
        instagram,
        profile_summary,
      } = profile;

      return [
        firebase_uid !== undefined ? firebase_uid : null,
        facebook,
        linkedin,
        instagram,
        profile_summary || null,
      ];
    });

    const query = `
      INSERT INTO SocialProfiles (
        firebase_uid, facebook, linkedin, instagram, profile_summary
      ) VALUES ?
    `;

    await connection.query(query, [values]);
    connection.release();

    return {
      statusCode: 201,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Social profiles created successfully' }),
    };
  } catch (error) {
    console.error('Error creating social profiles:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};

// ================= GET (GET) =================
const getSocialProfiles = async (event) => {
  console.log('Get Social Profiles Event:', event);
  try {
    const connection = await pool.getConnection();
    // If an "id" query parameter is provided, get that record; otherwise, return all.
    const id = event.queryStringParameters ? event.queryStringParameters.id : null;
    const query = id
      ? 'SELECT * FROM SocialProfiles WHERE id = ?'
      : 'SELECT * FROM SocialProfiles';
    const params = id ? [id] : [];
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

// ================= UPDATE (PUT) =================
const updateSocialProfiles = async (requestBody) => {
  console.log('Update Social Profiles Body:', requestBody);
  try {
    const connection = await pool.getConnection();
    let profiles = JSON.parse(requestBody);

    // Ensure profiles is always an array
    const profilesArray = Array.isArray(profiles) ? profiles : [profiles];

    const queries = profilesArray.map(profile => {
      const { id, facebook, linkedin, instagram, profile_summary } = profile;
      const query = `
        UPDATE SocialProfiles 
        SET facebook = ?,
            linkedin = ?,
            instagram = ?,
            profile_summary = ?
        WHERE id = ?
      `;
      return connection.query(query, [facebook, linkedin, instagram, profile_summary || null, id]);
    });

    await Promise.all(queries);
    connection.release();

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Social profiles updated successfully' }),
    };
  } catch (error) {
    console.error('Error updating social profiles:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};

// ================= DELETE (DELETE) =================
const deleteSocialProfiles = async (requestBody) => {
  console.log('Delete Social Profiles Body:', requestBody);
  try {
    const connection = await pool.getConnection();
    const ids = JSON.parse(requestBody); // Expecting an array of ids
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
