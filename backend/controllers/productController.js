const db = require('../config/db');

// Get all products with optional filters
exports.getProducts = async (req, res) => {
  try {
    const { category, search, min_price, max_price, sort, featured, bestseller, page = 1, limit = 12 } = req.query;
    let query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_available = TRUE';
    const params = [];

    if (category) {
      query += ' AND c.slug = ?';
      params.push(category);
    }
    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (min_price) {
      query += ' AND p.price >= ?';
      params.push(parseFloat(min_price));
    }
    if (max_price) {
      query += ' AND p.price <= ?';
      params.push(parseFloat(max_price));
    }
    if (featured === 'true') {
      query += ' AND p.is_featured = TRUE';
    }
    if (bestseller === 'true') {
      query += ' AND p.is_bestseller = TRUE';
    }

    // Count total
    const countQuery = query.replace('SELECT p.*, c.name as category_name', 'SELECT COUNT(*) as total');
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0].total;

    // Sort
    switch (sort) {
      case 'price_asc': query += ' ORDER BY p.price ASC'; break;
      case 'price_desc': query += ' ORDER BY p.price DESC'; break;
      case 'rating': query += ' ORDER BY p.rating DESC'; break;
      case 'newest': query += ' ORDER BY p.created_at DESC'; break;
      case 'name': query += ' ORDER BY p.name ASC'; break;
      default: query += ' ORDER BY p.is_featured DESC, p.created_at DESC';
    }

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), offset);

    const [products] = await db.query(query, params);

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get single product by slug
exports.getProductBySlug = async (req, res) => {
  try {
    const [products] = await db.query(
      'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = ?',
      [req.params.slug]
    );
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Get reviews for this product
    const [reviews] = await db.query(
      'SELECT r.*, u.first_name, u.last_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = ? AND r.is_approved = TRUE ORDER BY r.created_at DESC',
      [products[0].id]
    );

    // Get related products
    const [related] = await db.query(
      'SELECT * FROM products WHERE category_id = ? AND id != ? AND is_available = TRUE LIMIT 4',
      [products[0].category_id, products[0].id]
    );

    res.json({ product: products[0], reviews, related });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json(products[0]);
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Create product (admin)
exports.createProduct = async (req, res) => {
  try {
    const { name, slug, description, short_description, price, sale_price, category_id, image, ingredients, weight, serves, is_featured, is_bestseller, tags } = req.body;
    const [result] = await db.query(
      'INSERT INTO products (name, slug, description, short_description, price, sale_price, category_id, image, ingredients, weight, serves, is_featured, is_bestseller, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, slug, description, short_description, price, sale_price || null, category_id, image, ingredients, weight, serves, is_featured || false, is_bestseller || false, JSON.stringify(tags || [])]
    );
    res.status(201).json({ message: 'Product created.', id: result.insertId });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Update product (admin)
exports.updateProduct = async (req, res) => {
  try {
    const { name, slug, description, short_description, price, sale_price, category_id, image, ingredients, weight, serves, is_featured, is_bestseller, is_available, tags } = req.body;
    await db.query(
      'UPDATE products SET name=?, slug=?, description=?, short_description=?, price=?, sale_price=?, category_id=?, image=?, ingredients=?, weight=?, serves=?, is_featured=?, is_bestseller=?, is_available=?, tags=? WHERE id=?',
      [name, slug, description, short_description, price, sale_price || null, category_id, image, ingredients, weight, serves, is_featured || false, is_bestseller || false, is_available !== false, JSON.stringify(tags || []), req.params.id]
    );
    res.json({ message: 'Product updated.' });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Delete product (admin)
exports.deleteProduct = async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted.' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
