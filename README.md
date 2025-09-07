# E-Commerce Web Application

A full-stack e-commerce web application built with Node.js/Express backend and React frontend, featuring JWT authentication and persistent cart functionality.

## Features

### Backend
- **Authentication**: JWT-based signup and login APIs
- **Items Management**: CRUD APIs for products with filtering (price, categories, search)
- **Cart Management**: Add, remove, update, and clear cart items
- **Database**: MongoDB with Mongoose ODM

### Frontend
- **Authentication**: Signup and login pages with form validation
- **Product Listing**: Browse products with advanced filtering and search
- **Shopping Cart**: Add/remove items with quantity management
- **Cart Persistence**: Cart items persist in localStorage even after logout
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- express-validator

### Frontend
- React 18
- React Router DOM
- Axios
- Context API for state management
- CSS3 with responsive design

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Install backend dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key_here_change_in_production
PORT=5000
```

3. Start MongoDB (if running locally):
```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
```

4. Seed the database with sample data:
```bash
node seed.js
```

5. Start the backend server:
```bash
npm run dev
```

The backend will be running on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install frontend dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will be running on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### Items
- `GET /api/items` - Get all items with optional filtering
- `GET /api/items/:id` - Get single item by ID
- `POST /api/items` - Create new item (protected)
- `PUT /api/items/:id` - Update item (protected)
- `DELETE /api/items/:id` - Delete item (protected)
- `GET /api/items/categories/list` - Get list of categories

### Cart
- `GET /api/cart` - Get user's cart (protected)
- `POST /api/cart/add` - Add item to cart (protected)
- `PUT /api/cart/update` - Update item quantity (protected)
- `DELETE /api/cart/remove` - Remove item from cart (protected)
- `DELETE /api/cart/clear` - Clear entire cart (protected)

## Usage

1. **Sign Up/Login**: Create an account or login to access cart functionality
2. **Browse Products**: Use the home page to browse and filter products
3. **Add to Cart**: Click "Add to Cart" on any product
4. **Manage Cart**: View and manage items in your cart
5. **Cart Persistence**: Cart items are saved locally and sync with server when logged in

## Sample Data

The application comes with sample products across different categories:
- Electronics (iPhone, Samsung Galaxy, MacBook)
- Clothing (Nike shoes, Levi's jeans)
- Books (The Great Gatsby, Harry Potter)
- Home (Desk lamp, Coffee maker)
- Sports (Yoga mat, Dumbbells)
- Beauty (Skincare set)

## Features in Detail

### Cart Persistence
- Cart items are stored in localStorage
- When user logs in, local cart syncs with server cart
- Cart persists even after browser refresh or logout
- Server cart is updated when user is logged in

### Filtering & Search
- Filter by category, price range
- Search by product name or description
- Sort by price, name, or date added
- Real-time filtering without page reload

### Responsive Design
- Mobile-first approach
- Responsive grid layout
- Touch-friendly interface
- Works on all device sizes

## Development

### Running in Development Mode
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

### Building for Production
```bash
# Build frontend
cd client
npm run build

# Start production server
npm start
```

## License

MIT License - feel free to use this project for learning and development purposes.

