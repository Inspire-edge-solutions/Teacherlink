import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'inspire-edge-db.cnawwwkeyq7q.ap-south-1.rds.amazonaws.com',
  user: 'teacherlink_user',
  password: 'Inspireedge2024',
  database: 'tea',
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0
});

export { pool };