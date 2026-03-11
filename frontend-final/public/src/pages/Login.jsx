import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    console.log('Form submitted:', { isRegister, ...formData });
    
    try {
      const action = isRegister ? register : login;
      const result = await action(formData);
      
      console.log('Auth result:', result);
      
      if (result.success) {
        console.log('✅ Success, navigating to products...');
        navigate('/products');
      } else {
        setError(result.error || 'Authentication failed');
        console.error('❌ Auth failed:', result.error);
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🛍️</div>
          <h2>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
          <p>{isRegister ? 'Register to manage your products' : 'Login to access your dashboard'}</p>
        </div>
        
        {error && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>
              <span className="label-icon">👤</span>
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter username"
              disabled={loading}
              autoComplete="username"
            />
          </div>
          
          <div className="form-group">
            <label>
              <span className="label-icon">🔒</span>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
              disabled={loading}
              autoComplete={isRegister ? "new-password" : "current-password"}
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? (
              <span className="btn-loader"></span>
            ) : (
              isRegister ? 'Register' : 'Login'
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <button 
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="toggle-btn"
            disabled={loading}
          >
            {isRegister 
              ? 'Already have an account? Login' 
              : 'Need an account? Register'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;