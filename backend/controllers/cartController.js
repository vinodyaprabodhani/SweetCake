const db = require('../config/db');

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    // Get or create cart
    let [carts] = await db.query('SELECT id FROM cart WHERE user_id = ?', [req.user.id]);
    if (carts.length === 0) {
      const [result] = await db.query('INSERT INTO cart (user_id) VALUES (?)', [req.user.id]);
      carts = [{ id: result.insertId }];
    }

    const [items] = await db.query(
      `SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.slug, p.price, p.sale_price, p.image, p.stock, p.is_available
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.cart_id = ?`,
      [carts[0].id]
    );

    const total = items.reduce((sum, item) => {
      const price = item.sale_price || item.price;
      return sum + (price * item.quantity);
    }, 0);

    res.json({ items, total, item_count: items.length });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    // Get or create cart
    let [carts] = await db.query('SELECT id FROM cart WHERE user_id = ?', [req.user.id]);
    if (carts.length === 0) {
      const [result] = await db.query('INSERT INTO cart (user_id) VALUES (?)', [req.user.id]);
      carts = [{ id: result.insertId }];
    }

    // Check if product exists
    const [products] = await db.query('SELECT id, stock FROM products WHERE id = ? AND is_available = TRUE', [product_id]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found or unavailable.' });
    }

    // Check if item already in cart
    const [existing] = await db.query(
      'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [carts[0].id, product_id]
    );

    if (existing.length > 0) {
      const newQty = existing[0].quantity + quantity;
      await db.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [newQty, existing[0].id]);
    } else {
      await db.query(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
        [carts[0].id, product_id, quantity]
      );
    }

    res.json({ message: 'Item added to cart.' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1.' });
    }

    const [carts] = await db.query('SELECT id FROM cart WHERE user_id = ?', [req.user.id]);
    if (carts.length === 0) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    await db.query(
      'UPDATE cart_items SET quantity = ? WHERE id = ? AND cart_id = ?',
      [quantity, req.params.id, carts[0].id]
    );

    res.json({ message: 'Cart item updated.' });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const [carts] = await db.query('SELECT id FROM cart WHERE user_id = ?', [req.user.id]);
    if (carts.length === 0) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    await db.query('DELETE FROM cart_items WHERE id = ? AND cart_id = ?', [req.params.id, carts[0].id]);
    res.json({ message: 'Item removed from cart.' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const [carts] = await db.query('SELECT id FROM cart WHERE user_id = ?', [req.user.id]);
    if (carts.length === 0) {
      return res.status(404).json({ message: 'Cart not found.' });
    }

    await db.query('DELETE FROM cart_items WHERE cart_id = ?', [carts[0].id]);
    res.json({ message: 'Cart cleared.' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
