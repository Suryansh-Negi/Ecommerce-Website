import React from 'react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/currency';

const ItemCard = ({ item }) => {
  const { addToCart, loading } = useCart();

  const handleAddToCart = () => {
    addToCart(item, 1);
  };

  return (
    <div className="card">
      <img 
        src={item.image} 
        alt={item.name}
        style={{
          width: '100%',
          height: '200px',
          objectFit: 'cover'
        }}
      />
      <div className="p-2">
        <h3 style={{ marginBottom: '10px', fontSize: '1.2rem' }}>
          {item.name}
        </h3>
        <p style={{ 
          color: '#666', 
          marginBottom: '10px',
          fontSize: '0.9rem',
          lineHeight: '1.4'
        }}>
          {item.description}
        </p>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: '#007bff' 
          }}>
            {formatINR(item.price)}
          </span>
          <span style={{ 
            fontSize: '0.9rem', 
            color: item.stock > 0 ? '#28a745' : '#dc3545' 
          }}>
            {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
          </span>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <span style={{ 
            fontSize: '0.8rem', 
            color: '#666',
            textTransform: 'capitalize'
          }}>
            {item.category}
          </span>
          <button 
            onClick={handleAddToCart}
            disabled={item.stock === 0 || loading}
            className={`btn ${item.stock > 0 ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.9rem' }}
          >
            {loading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <>
                <i className="fas fa-cart-plus"></i> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;

