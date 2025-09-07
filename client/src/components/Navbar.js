import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      background: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '1rem 0',
      marginBottom: '2rem'
    }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>
            <h2 style={{ margin: 0, color: '#007bff' }}>
              <i className="fas fa-store"></i> E-Commerce Store
            </h2>
          </Link>
          
          <div className="d-flex align-items-center gap-2">
            <Link to="/" className="btn btn-secondary">
              <i className="fas fa-home"></i> Home
            </Link>
            
            {user ? (
              <>
                <Link to="/cart" className="btn btn-primary" style={{ position: 'relative' }}>
                  <i className="fas fa-shopping-cart"></i> Cart
                  {getCartItemCount() > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      background: '#dc3545',
                      color: 'white',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {getCartItemCount()}
                    </span>
                  )}
                </Link>
                
                <div className="d-flex align-items-center gap-2">
                  <span>Welcome, {user.name}!</span>
                  <button onClick={handleLogout} className="btn btn-danger">
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-primary">
                  <i className="fas fa-sign-in-alt"></i> Login
                </Link>
                <Link to="/signup" className="btn btn-success">
                  <i className="fas fa-user-plus"></i> Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

