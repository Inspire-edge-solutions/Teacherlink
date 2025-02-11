import { getDBConnection } from '../utils/db.js';

// Lambda handler function
export const handler = async (event) => {
  let connection;
  try {
    // Connect to the database
    connection = await getDBConnection();

    const { httpMethod, path, body, queryStringParameters } = event;
    let response;

    switch (httpMethod) {
      case 'POST':
        response = await handleCreate(connection, JSON.parse(body));
        break;
      case 'GET':
        response = await handleRead(connection, queryStringParameters);
        break;
      case 'PUT':
        response = await handleUpdate(connection, JSON.parse(body));
        break;
      case 'DELETE':
        response = await handleDelete(connection, JSON.parse(body));
        break;
      case 'OPTIONS':
        response = {
          statusCode: 200,
          headers: getCorsHeaders(),
        };
        break;
      default:
        response = {
          statusCode: 400,
          body: JSON.stringify({ message: 'Invalid HTTP method' }),
          headers: getCorsHeaders(),
        };
        break;
    }

    return response;
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error', error }),
      headers: getCorsHeaders(),
    };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

// CORS headers function
const getCorsHeaders = () => {
  return {
    'Access-Control-Allow-Origin': '*', // Allow all origins
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE', // Allowed HTTP methods
    'Access-Control-Allow-Headers': 'Content-Type', // Allowed headers
  };
};

// Create a new social media profile
const handleCreate = async (connection, data) => {
  const query = `
    INSERT INTO social_media_profiles (facebook, twitter, linkedin, instagram)
    VALUES (?, ?, ?, ?)
  `;
  const [result] = await connection.execute(query, [data.facebook, data.twitter, data.linkedin, data.instagram]);
  return {
    statusCode: 201,
    body: JSON.stringify({ message: 'Profile created successfully', id: result.insertId }),
    headers: getCorsHeaders(), // Add CORS headers here
  };
};

// Read all social media profiles or a specific profile by ID
const handleRead = async (connection, queryParams) => {
  let query = 'SELECT * FROM social_media_profiles';
  const params = [];

  if (queryParams && queryParams.id) {
    query += ' WHERE id = ?';
    params.push(queryParams.id);
  }

  const [results] = await connection.execute(query, params);
  return {
    statusCode: 200,
    body: JSON.stringify(results),
    headers: getCorsHeaders(), // Add CORS headers here
  };
};

// Update a social media profile
const handleUpdate = async (connection, data) => {
  const query = `
    UPDATE social_media_profiles
    SET facebook = ?, twitter = ?, linkedin = ?, instagram = ?
    WHERE id = ?
  `;
  const [result] = await connection.execute(query, [data.facebook, data.twitter, data.linkedin, data.instagram, data.id]);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Profile updated successfully', affectedRows: result.affectedRows }),
    headers: getCorsHeaders(), // Add CORS headers here
  };
};

// Delete a social media profile
const handleDelete = async (connection, data) => {
  const query = 'DELETE FROM social_media_profiles WHERE id = ?';
  const [result] = await connection.execute(query, [data.id]);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Profile deleted successfully', affectedRows: result.affectedRows }),
    headers: getCorsHeaders(), // Add CORS headers here
  };
};
