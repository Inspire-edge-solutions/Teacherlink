import { pool } from './db.js'; // Assuming pool is exported from db.js

export const handler = async (event) => {
  const { httpMethod, body, queryStringParameters } = event;
  console.log('Event:', event);

  try {
    switch (httpMethod) {
      case 'GET':
        return await getUsers(event);
      case 'POST':
        return await createUsers(body);
      case 'PUT':
        return await updateUsers(body);
      case 'DELETE':
        return await deleteUsers(body);
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

const createUsers = async (body) => {
  console.log('Create Users Body:', body);
  try {
    const connection = await pool.getConnection();
    let users = JSON.parse(body);
    console.log('Parsed Users:', users);

    // Ensure users is always an array
    if (!Array.isArray(users)) {
      users = [users];
    }

    const values = users.map(user => {
      // Destructure properties from the user object.
      // If firebase_uid is not provided, insert null.
      const { firebase_uid, fullName, email, gender, dateOfBirth, callingNumber, whatsappNumber } = user;
      return [
        firebase_uid !== undefined ? firebase_uid : null,
        fullName,
        email,
        gender,
        dateOfBirth,
        callingNumber,
        whatsappNumber
      ];
    });

    // Adjusted query to insert into UserDetails table
    const query = `
      INSERT INTO UserDetails (firebase_uid, fullName, email, gender, dateOfBirth, callingNumber, whatsappNumber) 
      VALUES ?
    `;

    await connection.query(query, [values]);
    connection.release();

    return {
      statusCode: 201,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Users created successfully' }),
    };
  } catch (error) {
    console.error('Error creating users:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};

const getUsers = async (event) => {
  console.log('Get Users Event:', event);
  try {
    const connection = await pool.getConnection();
    // Use id from query parameters if provided; otherwise, return all users.
    const id = event.queryStringParameters ? event.queryStringParameters.id : null;
    const query = id ? 'SELECT * FROM UserDetails WHERE id = ?' : 'SELECT * FROM UserDetails';
    const params = id ? [id] : [];
    const [results] = await connection.query(query, params);
    connection.release();

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};

const updateUsers = async (body) => {
  console.log('Update Users Body:', body);
  try {
    const connection = await pool.getConnection();
    let users = JSON.parse(body);

    // Ensure users is an array
    const usersArray = Array.isArray(users) ? users : [users];

    const queries = usersArray.map(user => {
      const { id, fullName, email, gender, dateOfBirth, callingNumber, whatsappNumber } = user;
      // Do not update firebase_uid here.
      const query = `
        UPDATE UserDetails 
        SET fullName = ?, email = ?, gender = ?, dateOfBirth = ?, callingNumber = ?, whatsappNumber = ? 
        WHERE id = ?
      `;
      return connection.query(query, [fullName, email, gender, dateOfBirth, callingNumber, whatsappNumber, id]);
    });

    await Promise.all(queries);
    connection.release();

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Users updated successfully' }),
    };
  } catch (error) {
    console.error('Error updating users:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};

const deleteUsers = async (body) => {
  console.log('Delete Users Body:', body);
  try {
    const connection = await pool.getConnection();
    const ids = JSON.parse(body);

    const query = 'DELETE FROM UserDetails WHERE id IN (?)';
    await connection.query(query, [ids]);
    connection.release();

    return {
      statusCode: 200,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Users deleted successfully' }),
    };
  } catch (error) {
    console.error('Error deleting users:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(),
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};
