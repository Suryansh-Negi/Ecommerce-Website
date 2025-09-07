const mongoose = require('mongoose');
const Item = require('./models/Item');
require('dotenv').config();

const sampleItems = [
  {
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with A17 Pro chip and titanium design',
    price: 999,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
    stock: 50
  },
  {
    name: 'Samsung Galaxy S24',
    description: 'Premium Android smartphone with AI features',
    price: 799,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop',
    stock: 30
  },
  {
    name: 'MacBook Pro M3',
    description: 'Powerful laptop for professionals and creators',
    price: 1999,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop',
    stock: 25
  },
  {
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes with modern design',
    price: 150,
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
    stock: 100
  },
  {
    name: 'Levi\'s 501 Jeans',
    description: 'Classic straight-fit jeans in blue denim',
    price: 89,
    category: 'clothing',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop',
    stock: 75
  },
  {
    name: 'The Great Gatsby',
    description: 'Classic American novel by F. Scott Fitzgerald',
    price: 12,
    category: 'books',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=300&fit=crop',
    stock: 200
  },
  {
    name: 'Harry Potter Complete Set',
    description: 'All 7 books in the Harry Potter series',
    price: 89,
    category: 'books',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    stock: 50
  },
  {
    name: 'IKEA Desk Lamp',
    description: 'Modern LED desk lamp with adjustable brightness',
    price: 45,
    category: 'home',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    stock: 80
  },
  {
    name: 'Coffee Maker',
    description: 'Programmable drip coffee maker for home use',
    price: 79,
    category: 'home',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop',
    stock: 40
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat for exercise and meditation',
    price: 35,
    category: 'sports',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop',
    stock: 60
  },
  {
    name: 'Dumbbell Set',
    description: 'Adjustable dumbbell set for home workouts',
    price: 199,
    category: 'sports',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
    stock: 25
  },
  {
    name: 'Skincare Set',
    description: 'Complete skincare routine with cleanser and moisturizer',
    price: 65,
    category: 'beauty',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop',
    stock: 90
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    // Clear existing items
    await Item.deleteMany({});
    console.log('Cleared existing items');

    // Insert sample items
    await Item.insertMany(sampleItems);
    console.log('Seeded database with sample items');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

