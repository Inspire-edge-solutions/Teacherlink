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
      return await getEducationData(event);
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

const getEducationData = async (event) => {
  console.log('Get Education Data Event:', event);
  try {
    const connection = await getConnection();
    const category = event.queryStringParameters ? event.queryStringParameters.category : null;
    const subcategory = event.queryStringParameters ? event.queryStringParameters.subcategory : null;
    const query = category ? (subcategory ? 'SELECT * FROM education_data WHERE category = ? AND subcategory = ?' : 'SELECT * FROM education_data WHERE category = ?') : 'SELECT * FROM education_data';
    const [results] = await connection.query(query, [category, subcategory]);
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
    console.error('Error fetching education data:', error);
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