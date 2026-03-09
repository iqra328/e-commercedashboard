import React from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';

const ProductCard = ({ product, onDelete, onEdit }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.deleteProduct(product._id);
        onDelete(product._id);
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        {product.images && product.images[0] ? (
          <img 
            src={`http://localhost:5000${product.images[0]}`} 
            alt={product.name}
            style={styles.image}
          />
        ) : (
          <div style={styles.noImage}>No Image</div>
        )}
      </div>
      
      <div style={styles.content}>
        <h3 style={styles.name}>{product.name}</h3>
        <p style={styles.description}>{product.description.substring(0, 100)}...</p>
        <p style={styles.price}>${product.price}</p>
        <p style={styles.category}>Category: {product.category}</p>
        <p style={styles.stock}>Stock: {product.stock}</p>
        
        <div style={styles.actions}>
          <button onClick={() => onEdit(product)} style={styles.editBtn}>
            Edit
          </button>
          <button onClick={handleDelete} style={styles.deleteBtn}>
            Delete
          </button>
          <Link to={`/products/${product._id}`} style={styles.viewBtn}>
            View
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  imageContainer: {
    height: '200px',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  noImage: {
    color: '#999',
    fontSize: '14px',
  },
  content: {
    padding: '15px',
  },
  name: {
    margin: '0 0 10px 0',
    fontSize: '18px',
  },
  description: {
    color: '#666',
    fontSize: '14px',
    marginBottom: '10px',
  },
  price: {
    fontWeight: 'bold',
    color: '#27ae60',
    fontSize: '18px',
    marginBottom: '5px',
  },
  category: {
    color: '#3498db',
    fontSize: '14px',
    marginBottom: '5px',
  },
  stock: {
    color: '#f39c12',
    fontSize: '14px',
    marginBottom: '10px',
  },
  actions: {
    display: 'flex',
    gap: '10px',
  },
  editBtn: {
    padding: '5px 10px',
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '5px 10px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  viewBtn: {
    padding: '5px 10px',
    backgroundColor: '#3498db',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    textAlign: 'center',
  },
};

export default ProductCard;