const db = require('../config/db');

// Get reviews for a product
exports.getProductReviews = async (req, res) => {
  try {
    const [reviews] = await db.query(
      'SELECT r.*, u.first_name, u.last_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = ? AND r.is_approved = TRUE ORDER BY r.created_at DESC',
      [req.params.productId]
    );
    res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Add a review
exports.addReview = async (req, res) => {
  try {
    const { product_id, rating, comment } = req.body;



    await db.query(
      'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)',
      [req.user.id, product_id, rating, comment]
    );

    // Update product rating
    const [stats] = await db.query(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE product_id = ? AND is_approved = TRUE',
      [product_id]
    );
    await db.query(
      'UPDATE products SET rating = ?, review_count = ? WHERE id = ?',
      [stats[0].avg_rating, stats[0].count, product_id]
    );

    res.status(201).json({ message: 'Review submitted.' });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Delete review (user or admin)
exports.deleteReview = async (req, res) => {
  try {
    // Only allow if user owns the review or is admin
    const [review] = await db.query('SELECT user_id, product_id FROM reviews WHERE id = ?', [req.params.id]);
    if (!review.length) return res.status(404).json({ message: 'Review not found.' });
    if (req.user.role !== 'admin' && req.user.id !== review[0].user_id) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    await db.query('DELETE FROM reviews WHERE id = ?', [req.params.id]);

    // Update product rating
    if (review.length > 0) {
      const [stats] = await db.query(
        'SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE product_id = ? AND is_approved = TRUE',
        [review[0].product_id]
      );
      await db.query(
        'UPDATE products SET rating = ?, review_count = ? WHERE id = ?',
        [stats[0].avg_rating || 0, stats[0].count, review[0].product_id]
      );
    }

    res.json({ message: 'Review deleted.' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
