// import mysql from 'mysql2/promise'; // Use mysql2/promise for async/await

// const dbConfig = {
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME
// };

// // Create a connection pool (using promise-based API)
// const pool = mysql.createPool(dbConfig);

// // CORS headers function
// const getCorsHeaders = () => {
//   return {
//     'Access-Control-Allow-Origin': '*', // Replace with your frontend domain in production!
//     'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, PUT, DELETE',
//     'Access-Control-Allow-Headers': 'Content-Type',
//   };
// };

// export const handler = async (event) => {
//   const { httpMethod } = event;
//   console.log('Event:', event);

//   try {
//     if (httpMethod === 'GET') {
//       return await getEducationData(event);
//     } else {
//       return {
//         statusCode: 405,
//         headers: getCorsHeaders(),
//         body: JSON.stringify({ message: 'Method Not Allowed' })
//       };
//     }
//   } catch (error) {
//     console.error('Error handling request:', error);
//     return {
//       statusCode: 500,
//       headers: getCorsHeaders(),
//       body: JSON.stringify({ message: 'Internal Server Error', error })
//     };
//   }
// };

// const getEducationData = async (event) => {
//   console.log('Get Education Data Event:', event);
//   try {
//     // Get a connection from the pool
//     const connection = await pool.getConnection();

//     const category = event.queryStringParameters ? event.queryStringParameters.category : null;
//     const subcategory = event.queryStringParameters ? event.queryStringParameters.subcategory : null;
//     const query = category ? (subcategory ? 'SELECT * FROM education_data WHERE category = ? AND subcategory = ?' : 'SELECT * FROM education_data WHERE category = ?') : 'SELECT * FROM education_data';
//     const [results] = await connection.query(query, [category, subcategory]);

//     // Release the connection back to the pool (important!)
//     connection.release();

//     return {
//       statusCode: 200,
//       headers: getCorsHeaders(),
//       body: JSON.stringify(results)
//     };
//   } catch (error) {
//     console.error('Error fetching education data:', error);
//     return {
//       statusCode: 500,
//       headers: getCorsHeaders(),
//       body: JSON.stringify({ message: 'Internal Server Error', error })
//     };
//   }
// };


// // Important: Close the pool when your Lambda function is done (optional, but recommended)
// // This is especially important if you are using serverless offline or running your function locally.
// export const closePool = async () => {
//   if (pool) {
//     try {
//       await pool.end(); // Properly close the pool
//       console.log('Database pool closed.');
//     } catch (error) {
//       console.error('Error closing database pool:', error);
//     }
//   }
// };

// // If you are using serverless offline, you can call closePool in a hook
// // For example, in your serverless.yml:
// // functions:
// //   yourFunction:
// //     ...
// //     hooks:
// //       - before:offline:start: closePool
// //       - after:offline:start: closePool
// //       - before:deploy: closePool
// //       - after:deploy: closePool

import mysql from 'mysql2/promise'; // Use mysql2/promise for async/await

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

// Create a connection pool (using promise-based API)
const pool = mysql.createPool(dbConfig);

// CORS headers function
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
      return await getEducationData(event);
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

const getEducationData = async (event) => {
  console.log('Get Education Data Event:', event);
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();

    const value = event.queryStringParameters ? event.queryStringParameters.value : null;
    const label = event.queryStringParameters ? event.queryStringParameters.label : null;
    let query = 'SELECT * FROM education_data';
    const queryParams = [];

    if (value && label) {
      query += ' WHERE value = ? AND label = ?';
      queryParams.push(value, label);
    } else if (value) {
      query += ' WHERE value = ?';
      queryParams.push(value);
    } else if (label) {
      query += ' WHERE label = ?';
      queryParams.push(label);
    }

    const [results] = await connection.query(query, queryParams);

    // Release the connection back to the pool (important!)
    connection.release();

    return {
      statusCode: 200,
      headers: getCorsHeaders(),
      body: JSON.stringify(results)
    };
  } catch (error) {
    console.error('Error fetching education data:', error);
    return {
      statusCode: 500,
      headers: getCorsHeaders(),
      body: JSON.stringify({ message: 'Internal Server Error', error })
    };
  }
};

// Properly close the database pool
export const closePool = async () => {
  if (pool) {
    try {
      await pool.end(); // Properly close the pool
      console.log('Database pool closed.');
    } catch (error) {
      console.error('Error closing database pool:', error);
    }
  }
};
