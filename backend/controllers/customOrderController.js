const db = require('../config/db');
const emailService = require('../utils/emailService');

// Submit custom cake order
exports.submitCustomOrder = async (req, res) => {
  try {
    const {
      customer_name, customer_email, customer_phone,
      cake_type, cake_size, cake_flavor, cake_layers,
      decoration_details, message_on_cake, delivery_date,
      delivery_address, budget_range, additional_notes
    } = req.body;

    const userId = req.user ? req.user.id : null;

    const [result] = await db.query(
      `INSERT INTO custom_orders (user_id, customer_name, customer_email, customer_phone,
        cake_type, cake_size, cake_flavor, cake_layers, decoration_details, message_on_cake,
        delivery_date, delivery_address, budget_range, additional_notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, customer_name, customer_email, customer_phone,
       cake_type, cake_size, cake_flavor, cake_layers || 1,
       decoration_details, message_on_cake, delivery_date,
       delivery_address, budget_range, additional_notes]
    );

    // Send the email receipt using Ethereal safely in the background
    if (customer_email) {
      emailService.sendConfirmationEmail({
        orderId: result.insertId,
        customer_email,
        customer_name,
        cake_type,
        delivery_date
      });
    }

    res.status(201).json({
      message: 'Custom order submitted! We will contact you soon with a quote.',
      id: result.insertId
    });
  } catch (error) {
    console.error('Submit custom order error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get user's custom orders
exports.getMyCustomOrders = async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT * FROM custom_orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(orders);
  } catch (error) {
    console.error('Get custom orders error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get all custom orders (admin)
exports.getAllCustomOrders = async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM custom_orders ORDER BY created_at DESC');
    res.json(orders);
  } catch (error) {
    console.error('Get all custom orders error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Update custom order status (admin)
exports.updateCustomOrder = async (req, res) => {
  try {
    const { status, quoted_price, admin_notes } = req.body;
    await db.query(
      'UPDATE custom_orders SET status = ?, quoted_price = ?, admin_notes = ? WHERE id = ?',
      [status, quoted_price || null, admin_notes || null, req.params.id]
    );
    res.json({ message: 'Custom order updated.' });
  } catch (error) {
    console.error('Update custom order error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
