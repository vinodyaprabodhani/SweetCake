// Database setup script - generates proper bcrypt hashes for seed users
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sweetcake_db',
    multipleStatements: true
  });

  console.log('✅ Connected to MySQL');

  // Generate proper password hashes
  const adminHash = await bcrypt.hash('admin123', 10);
  const customerHash = await bcrypt.hash('customer123', 10);

  // Update admin password
  await conn.query('UPDATE users SET password = ? WHERE email = ?', [adminHash, 'admin@sweetcake.lk']);
  console.log('✅ Admin password updated (admin123)');

  // Update customer passwords
  await conn.query('UPDATE users SET password = ? WHERE email = ?', [customerHash, 'kavinda@gmail.com']);
  await conn.query('UPDATE users SET password = ? WHERE email = ?', [customerHash, 'sachini@gmail.com']);
  console.log('✅ Customer passwords updated (customer123)');

  // Create carts for existing users
  const [users] = await conn.query('SELECT id FROM users');
  for (const user of users) {
    const [existing] = await conn.query('SELECT id FROM cart WHERE user_id = ?', [user.id]);
    if (existing.length === 0) {
      await conn.query('INSERT INTO cart (user_id) VALUES (?)', [user.id]);
    }
  }
  console.log('✅ User carts created');

  // Add demo reviews for all products
  const [products] = await conn.query('SELECT id FROM products');
  const reviewComments = [
    'Absolutely delicious!',
    'Would buy again.',
    'Perfect for our event.',
    'So fresh and tasty!',
    'Beautifully decorated.',
    'Everyone loved it.',
    'Highly recommended.',
    'Great value for money.',
    'Exceeded expectations.',
    'Will order again soon!',
    'A real showstopper.',
    'Moist and flavorful.',
    'Customer service was excellent.',
    'Arrived on time.',
    'Looked amazing and tasted even better.',
    'My kids loved it!',
    'Best cake I have ever had.',
    'Thank you for making our day special.',
    'Five stars!',
    'Superb quality.'
  ];

  for (const product of products) {
    // Remove existing reviews for this product (optional, for idempotency)
    await conn.query('DELETE FROM reviews WHERE product_id = ?', [product.id]);
    const reviewCount = Math.floor(Math.random() * 11) + 10; // 10-20 reviews
    for (let i = 0; i < reviewCount; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const rating = Math.floor(Math.random() * 3) + 3; // 3-5 stars
      const comment = reviewComments[Math.floor(Math.random() * reviewComments.length)];
      await conn.query(
        'INSERT INTO reviews (user_id, product_id, rating, comment, is_approved) VALUES (?, ?, ?, ?, TRUE)',
        [user.id, product.id, rating, comment]
      );
    }
    // Update product's review_count and rating
    const [stats] = await conn.query(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE product_id = ? AND is_approved = TRUE',
      [product.id]
    );
    await conn.query(
      'UPDATE products SET rating = ?, review_count = ? WHERE id = ?',
      [stats[0].avg_rating || 0, stats[0].count, product.id]
    );
  }
  console.log('✅ Demo reviews added for all products and product review counts/rating updated');

  console.log('\n🍰 Sweet Cake database setup complete!\n');
  await conn.end();
}

setupDatabase().catch(err => {
  console.error('❌ Setup failed:', err.message);
  process.exit(1);
});
