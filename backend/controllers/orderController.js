const db = require('../config/db');
const emailService = require('../utils/emailService');

// Generate unique order number
const generateOrderNumber = () => {
  const prefix = 'SC';
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${date}${random}`;
};

// Place a new order
exports.placeOrder = async (req, res) => {
  try {
    const { shipping_address, shipping_city, shipping_phone, payment_method, notes } = req.body;

    // Get cart items
    const [carts] = await db.query('SELECT id FROM cart WHERE user_id = ?', [req.user.id]);
    if (carts.length === 0) {
      return res.status(400).json({ message: 'Cart is empty.' });
    }

    const [cartItems] = await db.query(
      `SELECT ci.*, p.name, p.price, p.sale_price, p.image, p.stock
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = ?`,
      [carts[0].id]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty.' });
    }

    // Calculate total
    let totalAmount = 0;
    for (const item of cartItems) {
      const price = item.sale_price || item.price;
      totalAmount += price * item.quantity;
    }

    // Shipping fee (free for orders over 5000 LKR)
    const shippingFee = totalAmount >= 5000 ? 0 : 350;
    totalAmount += shippingFee;

    const orderNumber = generateOrderNumber();

    // Create order
    const [orderResult] = await db.query(
      'INSERT INTO orders (user_id, order_number, total_amount, shipping_fee, payment_method, shipping_address, shipping_city, shipping_phone, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, orderNumber, totalAmount, shippingFee, payment_method || 'cod', shipping_address, shipping_city, shipping_phone, notes || null]
    );

    // Create order items
    for (const item of cartItems) {
      const unitPrice = item.sale_price || item.price;
      await db.query(
        'INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [orderResult.insertId, item.product_id, item.name, item.image, item.quantity, unitPrice, unitPrice * item.quantity]
      );
    }

    // Clear cart
    await db.query('DELETE FROM cart_items WHERE cart_id = ?', [carts[0].id]);

    // Fetch user details for the email receipt
    const [users] = await db.query('SELECT first_name, email FROM users WHERE id = ?', [req.user.id]);
    
    // Dispatch standard order confirmation email in the background
    if (users.length > 0 && users[0].email) {
      emailService.sendStandardOrderEmail({
        orderNumber: orderNumber,
        customer_email: users[0].email,
        customer_name: users[0].first_name || 'Customer',
        shipping_city: shipping_city,
        payment_method: payment_method || 'cod',
        total_amount: totalAmount
      });
    }

    res.status(201).json({
      message: 'Order placed successfully!',
      order: {
        id: orderResult.insertId,
        order_number: orderNumber,
        total_amount: totalAmount,
        shipping_fee: shippingFee,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get user's orders
exports.getMyOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );

    // Get items for each order
    for (let order of orders) {
      const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      order.items = items;
    }

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [orders[0].id]);
    orders[0].items = items;

    res.json(orders[0]);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let query = 'SELECT o.*, u.first_name, u.last_name, u.email FROM orders o JOIN users u ON o.user_id = u.id';
    const params = [];

    if (status) {
      query += ' WHERE o.status = ?';
      params.push(status);
    }

    query += ' ORDER BY o.created_at DESC';

    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [orders] = await db.query(query, params);

    for (let order of orders) {
      const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
      order.items = items;
    }

    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Update order status (admin)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'processing', 'baking', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    const updates = { status };
    if (status === 'delivered') {
      await db.query('UPDATE orders SET status = ?, payment_status = "paid", delivered_at = NOW() WHERE id = ?', [status, req.params.id]);
    } else {
      await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    }

    res.json({ message: 'Order status updated.' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
