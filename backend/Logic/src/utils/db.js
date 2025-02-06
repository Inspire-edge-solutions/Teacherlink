// import mysql from 'mysql2/promise';

// async function getDBConnection(secret) {
//     return await mysql.createConnection({
//         host: process.env.DB_HOST,
//         user: secret.username,
//         password: secret.password,
//         database: process.env.DB_NAME,
//         connectTimeout: 5000,
//     });
// }

// export { getDBConnection };
import mysql from 'mysql2/promise';

export const getDBConnection = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER, // Ensure this matches your environment variable
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  return connection;
};