const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateGoldenUnicornImage() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sweetcake_db',
  });
  const [result] = await conn.query(
    "UPDATE products SET image = '/images/golden-unicorn-cake.jpg' WHERE slug = 'golden-unicorn-cake'"
  );
  console.log('Golden Unicorn Cake image updated:', result.affectedRows, 'row(s)');
  await conn.end();
}

updateGoldenUnicornImage().catch(err => {
  console.error('❌ Update failed:', err.message);
  process.exit(1);
});
