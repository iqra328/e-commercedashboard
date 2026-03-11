import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import ProductList from './pages/ProductList';
import AddEditProduct from './pages/AddEditProduct';
import ProductDetail from './pages/ProductDetail';
import './App.css';

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <div className="content-container">
          <Routes>
            <Route path="/login" element={
              user ? <Navigate to="/products" /> : <Login />
            } />
            
            <Route path="/products" element={
              <PrivateRoute>
                <ProductList />
              </PrivateRoute>
            } />
             <Route path="/products/:id" element={
              <PrivateRoute>
                <ProductDetail />
              </PrivateRoute>
            } />
            
            <Route path="/add-product" element={
              <PrivateRoute>
                <AddEditProduct />
              </PrivateRoute>
            } />
            
            <Route path="/edit-product/:id" element={
              <PrivateRoute>
                <AddEditProduct />
              </PrivateRoute>
            } />

            
            
            <Route path="/" element={
              <Navigate to="/products" />
            } />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;