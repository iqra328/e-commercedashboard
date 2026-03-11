import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProduct(id);
      setProduct(response.data);
    } catch (error) {
      setError('Product not found');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="error-container">
        <h2>😕 Product Not Found</h2>
        <p>{error || 'The product you are looking for does not exist.'}</p>
        <button onClick={() => navigate('/products')} className="back-btn">
          ← Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <button onClick={() => navigate('/products')} className="back-btn">
        ← Back to Products
      </button>

      <div className="product-detail-card">
        <div className="product-image-section">
          {product.images && product.images.length > 0 ? (
            <img 
              src={`http://localhost:5000${product.images[0]}`} 
              alt={product.name}
              className="product-detail-image"
            />
          ) : (
            <div className="no-image">No Image</div>
          )}
        </div>

        <div className="product-info-section">
          <h1 className="product-detail-title">{product.name}</h1>
          
          <div className="product-detail-meta">
            <span className="product-detail-category">{product.category}</span>
            <span className={`product-detail-stock ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
            </span>
          </div>

          <div className="product-detail-price">
            <span className="price-label">Price:</span>
            <span className="price-value">${product.price}</span>
          </div>

          <div className="product-detail-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-detail-actions">
            <button 
              onClick={() => navigate(`/edit-product/${product._id}`, { state: { product } })}
              className="edit-btn"
            >
              ✏️ Edit Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;