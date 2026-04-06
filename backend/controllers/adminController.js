const db = require('../config/db');

// Dashboard analytics
exports.getDashboard = async (req, res) => {
  try {
    const [totalOrders] = await db.query('SELECT COUNT(*) as count FROM orders');
    const [totalRevenue] = await db.query('SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE payment_status = "paid"');
    const [totalUsers] = await db.query('SELECT COUNT(*) as count FROM users WHERE role = "customer"');
    const [totalProducts] = await db.query('SELECT COUNT(*) as count FROM products');
    const [pendingOrders] = await db.query('SELECT COUNT(*) as count FROM orders WHERE status = "pending"');
    const [pendingCustomOrders] = await db.query('SELECT COUNT(*) as count FROM custom_orders WHERE status = "pending"');
    const [unreadMessages] = await db.query('SELECT COUNT(*) as count FROM contact_messages WHERE is_read = FALSE');
    const [recentOrders] = await db.query(
      'SELECT o.*, u.first_name, u.last_name FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC LIMIT 5'
    );

    res.json({
      stats: {
        total_orders: totalOrders[0].count,
        total_revenue: totalRevenue[0].total,
        total_users: totalUsers[0].count,
        total_products: totalProducts[0].count,
        pending_orders: pendingOrders[0].count,
        pending_custom_orders: pendingCustomOrders[0].count,
        unread_messages: unreadMessages[0].count
      },
      recent_orders: recentOrders
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get all users (admin)
exports.getUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, first_name, last_name, email, phone, city, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Delete user (admin)
exports.deleteUser = async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id = ? AND role != "admin"', [req.params.id]);
    res.json({ message: 'User deleted.' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
