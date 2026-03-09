const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes
router.post('/', 
  authMiddleware, 
  upload.array('images', 5), 
  createProduct
);

router.put('/:id', 
  authMiddleware, 
  upload.array('images', 5), 
  updateProduct
);

router.delete('/:id', authMiddleware, deleteProduct);
router.delete('/:productId/images/:imageIndex', authMiddleware, deleteProductImage);

module.exports = router;