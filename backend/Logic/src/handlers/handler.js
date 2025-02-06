import mysql from 'mysql2/promise';

let connection;

const getConnection = async () => {
  if (!connection) {
    connection = await mysql.createConnection({
      host: 'inspire-edge-db.cnawwwkeyq7q.ap-south-1.rds.amazonaws.com',
      user: 'teacherlink_user',
      password: 'Inspireedge2024',
      database: 'teacherlink'  // Update database name to 'tea'
    });
  }
  return connection;
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
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
        },
        body: JSON.stringify({ message: 'Method Not Allowed' })
      };
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
      },
      body: JSON.stringify({ message: 'Internal Server Error', error })
    };
  }
};

const getConstants = async (event) => {
  console.log('Get Constants Event:', event);
  try {
    const connection = await getConnection();
    const keyword = event.queryStringParameters ? event.queryStringParameters.keyword : null;
    const query = keyword ? 'SELECT * FROM constants WHERE keyword = ?' : 'SELECT * FROM constants';
    const [results] = await connection.query(query, [keyword]);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
      },
      body: JSON.stringify(results)
    };
  } catch (error) {
    console.error('Error fetching constants:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
      },
      body: JSON.stringify({ message: 'Internal Server Error', error })
    };
  }
};