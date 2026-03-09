import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productAPI } from '../services/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  const categories = ['All', 'Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Other'];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const category = selectedCategory === 'All' ? '' : selectedCategory;
      const response = await productAPI.getProducts(category);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (productId) => {
    setProducts(products.filter(p => p._id !== productId));
  };

  const handleEdit = (product) => {
    navigate(`/edit-product/${product._id}`, { state: { product } });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  if (loading) {
    return <div style={styles.loading}>Loading products...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Products</h1>
        
        <div style={styles.filterContainer}>
          <label style={styles.filterLabel}>Filter by Category:</label>
          <select 
            value={selectedCategory} 
            onChange={(e) => handleCategoryChange(e.target.value)}
            style={styles.filterSelect}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {products.length === 0 ? (
        <div style={styles.noProducts}>No products found</div>
      ) : (
        <div style={styles.productGrid}>
          {products.map(product => (
            <ProductCard 
              key={product._id} 
              product={product} 
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  title: {
    color: '#333',
    margin: 0,
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  filterLabel: {
    color: '#666',
  },
  filterSelect: {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: '#666',
  },
  noProducts: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '16px',
    color: '#999',
  },
};

export default ProductList;