const db = require('../config/db');

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const [categories] = await db.query(
      'SELECT c.*, COUNT(p.id) as product_count FROM categories c LEFT JOIN products p ON c.id = p.category_id AND p.is_available = TRUE WHERE c.is_active = TRUE GROUP BY c.id ORDER BY c.display_order ASC'
    );
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get single category
exports.getCategoryBySlug = async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories WHERE slug = ?', [req.params.slug]);
    if (categories.length === 0) {
      return res.status(404).json({ message: 'Category not found.' });
    }
    res.json(categories[0]);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Create category (admin)
exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description, image, display_order } = req.body;
    const [result] = await db.query(
      'INSERT INTO categories (name, slug, description, image, display_order) VALUES (?, ?, ?, ?, ?)',
      [name, slug, description, image, display_order || 0]
    );
    res.status(201).json({ message: 'Category created.', id: result.insertId });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Update category (admin)
exports.updateCategory = async (req, res) => {
  try {
    const { name, slug, description, image, display_order, is_active } = req.body;
    await db.query(
      'UPDATE categories SET name=?, slug=?, description=?, image=?, display_order=?, is_active=? WHERE id=?',
      [name, slug, description, image, display_order, is_active !== false, req.params.id]
    );
    res.json({ message: 'Category updated.' });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Delete category (admin)
exports.deleteCategory = async (req, res) => {
  try {
    await db.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ message: 'Category deleted.' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
