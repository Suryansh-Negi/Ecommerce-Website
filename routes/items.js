const express = require('express');
const { body, validationResult } = require('express-validator');
const Item = require('../models/Item');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/items - list with filters
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const filter = {};
    if (category && category !== 'all') filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const items = await Item.find(filter).sort(sort);
    res.json({ items, count: items.length });
  } catch (err) {
    console.error('Get items error:', err);
    res.status(500).json({ message: 'Server error while fetching items' });
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    console.error('Get item error:', err);
    res.status(500).json({ message: 'Server error while fetching item' });
  }
});

// POST /api/items (protected, demo admin)
router.post('/', auth, [
  body('name').trim().isLength({ min: 1 }),
  body('description').trim().isLength({ min: 1 }),
  body('price').isNumeric(),
  body('category').isIn(['electronics', 'clothing', 'books', 'home', 'sports', 'beauty']),
  body('stock').isInt({ min: 0 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { name, description, price, category, image, stock } = req.body;
    const item = new Item({
      name,
      description,
      price,
      category,
      image: image || 'https://via.placeholder.com/300x300?text=No+Image',
      stock
    });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    console.error('Create item error:', err);
    res.status(500).json({ message: 'Server error while creating item' });
  }
});

// PUT /api/items/:id (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, image, stock },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) {
    console.error('Update item error:', err);
    res.status(500).json({ message: 'Server error while updating item' });
  }
});

// DELETE /api/items/:id (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('Delete item error:', err);
    res.status(500).json({ message: 'Server error while deleting item' });
  }
});

// GET /api/items/categories/list
router.get('/categories/list', async (_req, res) => {
  try {
    const categories = await Item.distinct('category');
    res.json(categories);
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ message: 'Server error while fetching categories' });
  }
});

module.exports = router;


