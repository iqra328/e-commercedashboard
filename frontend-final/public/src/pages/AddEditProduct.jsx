import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import { productAPI } from '../services/api';
import './AddEditProduct.css';

const AddEditProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const product = location.state?.product;

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      setError('');
      
      if (product) {
        await productAPI.updateProduct(product._id, formData);
      } else {
        await productAPI.createProduct(formData);
      }
      
      navigate('/products');
    } catch (error) {
      setError(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-edit-product-container">
      <div className="page-header">
        <h1>{product ? 'Edit Product' : 'Add New Product'}</h1>
        <p>{product ? 'Update product information' : 'Fill in the details to add a new product'}</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading-spinner">Processing...</div>
      ) : (
        <ProductForm 
          initialData={product}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/products')}
        />
      )}
    </div>
  );
};

export default AddEditProduct;