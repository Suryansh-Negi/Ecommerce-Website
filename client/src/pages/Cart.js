import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/currency';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, loading } = useCart();
  const { user } = useAuth();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const getTotalPrice = () => {
    return cart.items.reduce((total, cartItem) => {
      const price = cartItem.item.price || 0;
      return total + (price * cartItem.quantity);
    }, 0);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <i className="fas fa-spinner fa-spin"></i> Loading cart...
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="text-center mb-4">
        <i className="fas fa-shopping-cart"></i> Your Cart
      </h1>
      
      {!user && (
        <div className="error">
          <i className="fas fa-exclamation-triangle"></i> You need to be logged in to view your cart.
        </div>
      )}

      {cart.items.length === 0 ? (
        <div className="text-center">
          <div className="card p-4">
            <i className="fas fa-shopping-cart" style={{ fontSize: '4rem', color: '#ccc', marginBottom: '20px' }}></i>
            <h3>Your cart is empty</h3>
            <p>Add some items to get started!</p>
            <a href="/" className="btn btn-primary">
              <i className="fas fa-shopping-bag"></i> Continue Shopping
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-2" style={{ gap: '30px' }}>
          {/* Cart Items */}
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3>Cart Items ({cart.items.length})</h3>
              <button 
                onClick={clearCart}
                className="btn btn-danger"
                disabled={loading}
              >
                <i className="fas fa-trash"></i> Clear Cart
              </button>
            </div>
            
            <div className="grid">
              {cart.items.map((cartItem) => {
                const item = cartItem.item;
                const itemId = item._id || item;
                const itemName = item.name || 'Unknown Item';
                const itemPrice = item.price || 0;
                const itemImage = item.image || 'https://via.placeholder.com/150x150?text=No+Image';
                
                return (
                  <div key={itemId} className="card p-3">
                    <div className="d-flex gap-2">
                      <img 
                        src={itemImage} 
                        alt={itemName}
                        style={{
                          width: '100px',
                          height: '100px',
                          objectFit: 'cover',
                          borderRadius: '5px'
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ marginBottom: '10px' }}>{itemName}</h4>
                        <p style={{ color: '#666', marginBottom: '10px' }}>
                          {formatINR(itemPrice)} each
                        </p>
                        
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(itemId, cartItem.quantity - 1)}
                              className="btn btn-secondary"
                              style={{ padding: '5px 10px' }}
                              disabled={loading}
                            >
                              <i className="fas fa-minus"></i>
                            </button>
                            
                            <span style={{ 
                              minWidth: '30px', 
                              textAlign: 'center',
                              fontWeight: 'bold'
                            }}>
                              {cartItem.quantity}
                            </span>
                            
                            <button
                              onClick={() => handleQuantityChange(itemId, cartItem.quantity + 1)}
                              className="btn btn-secondary"
                              style={{ padding: '5px 10px' }}
                              disabled={loading}
                            >
                              <i className="fas fa-plus"></i>
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <div style={{ 
                              fontSize: '1.2rem', 
                              fontWeight: 'bold',
                              color: '#007bff'
                            }}>
                              {formatINR(itemPrice * cartItem.quantity)}
                            </div>
                            <button
                              onClick={() => removeFromCart(itemId)}
                              className="btn btn-danger"
                              style={{ fontSize: '0.8rem', padding: '5px 10px' }}
                              disabled={loading}
                            >
                              <i className="fas fa-trash"></i> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="card p-3" style={{ position: 'sticky', top: '20px' }}>
              <h3 className="mb-3">Order Summary</h3>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>{formatINR(getTotalPrice())}</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              
              <div className="d-flex justify-content-between mb-2">
                <span>Tax:</span>
                <span>{formatINR(0)}</span>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between mb-3" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                <span>Total:</span>
                <span>{formatINR(getTotalPrice())}</span>
              </div>
              
              <button 
                className="btn btn-success"
                style={{ width: '100%', marginBottom: '10px' }}
                disabled={loading}
              >
                <i className="fas fa-credit-card"></i> Proceed to Checkout
              </button>
              
              <a href="/" className="btn btn-secondary" style={{ width: '100%' }}>
                <i className="fas fa-arrow-left"></i> Continue Shopping
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

