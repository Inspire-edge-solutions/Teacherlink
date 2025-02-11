import mysql from 'mysql2';

const dbConfig = {
  host: 'inspire-edge-db.cnawwwkeyq7q.ap-south-1.rds.amazonaws.com',
  user: 'teacherlink_user',
  password: 'Inspireedge2024',
  database: 'teacherlink'
};

const pool = mysql.createPool(dbConfig).promise();

export default pool;
