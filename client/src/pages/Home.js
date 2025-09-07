import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemCard from '../components/ItemCard';

const Home = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: '',
    maxPrice: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, [filters]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== 'all') {
          params.append(key, filters[key]);
        }
      });

      const response = await axios.get(`/api/items?${params.toString()}`);
      setItems(response.data.items);
    } catch (error) {
      setError('Failed to fetch items');
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/items/categories/list');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      minPrice: '',
      maxPrice: '',
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <i className="fas fa-spinner fa-spin"></i> Loading items...
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="text-center mb-4">Our Products</h1>
      
      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="card p-3 mb-4">
        <h3 style={{ marginBottom: '20px' }}>Filters</h3>
        <div className="grid grid-2">
          <div className="form-group">
            <label>Search</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Category</label>
            <select
              className="form-control"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Min Price</label>
            <input
              type="number"
              className="form-control"
              placeholder="Min price"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Max Price</label>
            <input
              type="number"
              className="form-control"
              placeholder="Max price"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Sort By</label>
            <select
              className="form-control"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="createdAt">Date Added</option>
              <option value="price">Price</option>
              <option value="name">Name</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Order</label>
            <select
              className="form-control"
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
        
        <div className="text-center mt-2">
          <button onClick={clearFilters} className="btn btn-secondary">
            <i className="fas fa-times"></i> Clear Filters
          </button>
        </div>
      </div>

      {/* Items Grid */}
      {items.length === 0 ? (
        <div className="text-center">
          <h3>No items found</h3>
          <p>Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Found {items.length} item{items.length !== 1 ? 's' : ''}</h3>
          </div>
          
          <div className="grid grid-3">
            {items.map(item => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;

