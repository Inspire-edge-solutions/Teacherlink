// import mysql from 'mysql2';

// const dbConfig = {
//   host: 'inspire-edge-db.cnawwwkeyq7q.ap-south-1.rds.amazonaws.com',
//   user: 'teacherlink_user',
//   password: 'Inspireedge2024',
//   database: 'teacherlink'
// };

// const pool = mysql.createPool(dbConfig).promise();

// export default pool;
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

const pool = mysql.createPool(dbConfig);

export const getDBConnection = async () => {
  return pool.getConnection();
};

export default pool;