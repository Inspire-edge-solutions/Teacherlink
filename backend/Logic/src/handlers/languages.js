import mysql from 'mysql2';

const dbConfig = {
  host: 'inspire-edge-db.cnawwwkeyq7q.ap-south-1.rds.amazonaws.com',
  user: 'teacherlink_user',
  password: 'Inspireedge2024',
  database: 'teacherlink'
};

const pool = mysql.createPool(dbConfig).promise();

// CORS headers function (make this reusable)
const getCorsHeaders = () => {
  return {
    'Access-Control-Allow-Origin': '*', // Replace with your frontend domain in production!
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
};

export const handler = async (event) => {
  const { httpMethod } = event;
  console.log('Event:', event);

  try {
    if (httpMethod === 'GET') {
      return await getLanguages(event);
    } else {
      return {
        statusCode: 405,
        headers: getCorsHeaders(), // Use the function here
        body: JSON.stringify({ message: 'Method Not Allowed' })
      };
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return {
      statusCode: 500,
      headers: getCorsHeaders(), // Use the function here
      body: JSON.stringify({ message: 'Internal Server Error', error })
    };
  }
};

const getLanguages = async (event) => {
  console.log('Get Languages Event:', event);
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('Connection established:', connection ? true : false); // Debugging log
    const category = event.queryStringParameters ? event.queryStringParameters.category : null;
    const query = category ? 'SELECT * FROM languages WHERE category = ?' : 'SELECT * FROM languages';
    const [results] = await connection.query(query, [category]);
    return {
      statusCode: 200,
      headers: getCorsHeaders(), // Use the function here
      body: JSON.stringify(results)
    };
  } catch (error) {
    console.error('Error fetching languages:', error);
    return {
      statusCode: 500,
      headers: getCorsHeaders(), // Use the function here
      body: JSON.stringify({ message: 'Internal Server Error', error })
    };
  } finally {
    if (connection) connection.release(); // Ensure the connection is released
  }
};