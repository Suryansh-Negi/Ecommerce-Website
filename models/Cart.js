const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  total: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate total before saving
cartSchema.pre('save', async function(next) {
  if (this.items.length === 0) {
    this.total = 0;
    return next();
  }

  try {
    const Item = mongoose.model('Item');
    let total = 0;
    
    for (let cartItem of this.items) {
      const item = await Item.findById(cartItem.item);
      if (item) {
        total += item.price * cartItem.quantity;
      }
    }
    
    this.total = total;
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Cart', cartSchema);

