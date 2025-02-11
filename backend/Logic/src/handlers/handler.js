import mysql from 'mysql2';

const dbConfig = {
  host: 'inspire-edge-db.cnawwwkeyq7q.ap-south-1.rds.amazonaws.com',
  user: 'teacherlink_user',
  password: 'Inspireedge2024',
  database: 'teacherlink'
};

const pool = mysql.createPool(dbConfig).promise();

const getCorsHeaders = () => {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };
};

export const handler = async (event) => {
  const { httpMethod } = event;
  console.log('Event:', event);

  try {
    if (httpMethod === 'GET') {
      return await getConstants(event);
    } else {
      return {
        statusCode: 405,
        headers: getCorsHeaders(),
        body: JSON.stringify({ message: 'Method Not Allowed' })
      };
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return {
      statusCode: 500,
      headers: getCorsHeaders(),
      body: JSON.stringify({ message: 'Internal Server Error', error })
    };
  }
};

const getConstants = async (event) => {
  console.log('Get Constants Event:', event);
  let connection;
  try {
    connection = await pool.getConnection();
    const keyword = event.queryStringParameters ? event.queryStringParameters.keyword : null;
    const query = keyword ? 'SELECT * FROM constants WHERE keyword = ?' : 'SELECT * FROM constants';
    const [results] = await connection.query(query, [keyword]);
    return {
      statusCode: 200,
      headers: getCorsHeaders(),
      body: JSON.stringify(results)
    };
  } catch (error) {
    console.error('Error fetching constants:', error);
    return {
      statusCode: 500,
      headers: getCorsHeaders(),
      body: JSON.stringify({ message: 'Internal Server Error', error })
    };
  } finally {
    if (connection) connection.release();
  }
};