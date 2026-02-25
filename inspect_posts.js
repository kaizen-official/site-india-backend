const mysql = require('mysql2/promise');
require('dotenv').config();
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_DATABASE,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});
(async () => {
  try {
    const [cols] = await pool.execute('DESCRIBE categories');
    console.table(cols.map(c => ({Field: c.Field, Type: c.Type})));
    const [rows] = await pool.execute('SELECT * FROM categories');
    console.log(JSON.stringify(rows, null, 2));
  } catch(e) { console.log('No categories:', e.message); }
  const [cats] = await pool.execute('SELECT DISTINCT category_id FROM posts ORDER BY category_id');
  console.log('cat_ids:', cats.map(c => c.category_id));
  const [st] = await pool.execute('SELECT status, COUNT(*) as cnt FROM posts GROUP BY status');
  console.log('status:', st);
  await pool.end();
})();
