const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateLemonDrizzleImage() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sweetcake_db',
  });
  const [result] = await conn.query(
    "UPDATE products SET image = '/images/lemon-drizzle-delight.jpg' WHERE slug = 'lemon-drizzle-delight'"
  );
  console.log('Lemon Drizzle Delight image updated:', result.affectedRows, 'row(s)');
  await conn.end();
}

updateLemonDrizzleImage().catch(err => {
  console.error('❌ Update failed:', err.message);
  process.exit(1);
});
