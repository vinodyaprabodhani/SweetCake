const db = require('../config/db');

// Submit contact message
exports.submitMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    await db.query(
      'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone || null, subject || 'General Inquiry', message]
    );
    res.status(201).json({ message: 'Message sent successfully! We will get back to you soon.' });
  } catch (error) {
    console.error('Submit message error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get all messages (admin)
exports.getMessages = async (req, res) => {
  try {
    const [messages] = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Mark message as read (admin)
exports.markAsRead = async (req, res) => {
  try {
    await db.query('UPDATE contact_messages SET is_read = TRUE WHERE id = ?', [req.params.id]);
    res.json({ message: 'Message marked as read.' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Reply to message (admin)
exports.replyToMessage = async (req, res) => {
  try {
    const { admin_reply } = req.body;
    await db.query(
      'UPDATE contact_messages SET admin_reply = ?, is_read = TRUE WHERE id = ?',
      [admin_reply, req.params.id]
    );
    res.json({ message: 'Reply sent.' });
  } catch (error) {
    console.error('Reply error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Delete message (admin)
exports.deleteMessage = async (req, res) => {
  try {
    await db.query('DELETE FROM contact_messages WHERE id = ?', [req.params.id]);
    res.json({ message: 'Message deleted.' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
