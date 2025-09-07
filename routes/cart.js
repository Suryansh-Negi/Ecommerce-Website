const express = require('express');
const { body, validationResult } = require('express-validator');
const Cart = require('../models/Cart');
const Item = require('../models/Item');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/cart
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.userId }).populate('items.item');
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ message: 'Server error while fetching cart' });
  }
});

// POST /api/cart/add
router.post('/add', auth, [
  body('itemId').isMongoId(),
  body('quantity').isInt({ min: 1 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { itemId, quantity } = req.body;
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.stock < quantity) return res.status(400).json({ message: 'Insufficient stock available' });

    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) cart = new Cart({ user: req.userId, items: [] });

    const idx = cart.items.findIndex(ci => ci.item.toString() === itemId);
    if (idx > -1) cart.items[idx].quantity += quantity; else cart.items.push({ item: itemId, quantity });

    await cart.save();
    await cart.populate('items.item');
    res.json(cart);
  } catch (err) {
    console.error('Add to cart error:', err);
    res.status(500).json({ message: 'Server error while adding to cart' });
  }
});

// PUT /api/cart/update
router.put('/update', auth, [
  body('itemId').isMongoId(),
  body('quantity').isInt({ min: 0 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { itemId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const idx = cart.items.findIndex(ci => ci.item.toString() === itemId);
    if (idx === -1) return res.status(404).json({ message: 'Item not found in cart' });

    if (quantity === 0) cart.items.splice(idx, 1); else cart.items[idx].quantity = quantity;
    await cart.save();
    await cart.populate('items.item');
    res.json(cart);
  } catch (err) {
    console.error('Update cart error:', err);
    res.status(500).json({ message: 'Server error while updating cart' });
  }
});

// DELETE /api/cart/remove
router.delete('/remove', auth, [ body('itemId').isMongoId() ], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { itemId } = req.body;
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter(ci => ci.item.toString() !== itemId);
    await cart.save();
    await cart.populate('items.item');
    res.json(cart);
  } catch (err) {
    console.error('Remove from cart error:', err);
    res.status(500).json({ message: 'Server error while removing from cart' });
  }
});

// DELETE /api/cart/clear
router.delete('/clear', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = [];
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error('Clear cart error:', err);
    res.status(500).json({ message: 'Server error while clearing cart' });
  }
});

module.exports = router;


