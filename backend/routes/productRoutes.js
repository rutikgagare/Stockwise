const express = require('express')
const {createProduct, deleteProduct, updateProduct} = require('../controllers/productController.js');
const requireAuth = require('../middleware/requireAuth.js');
// const requireAdmin = require('../middleware/requireAdmin.js');

const router = express.Router()
router.use(requireAuth)

router.post('/create', createProduct);
router.put('/update', updateProduct);
router.delete('/delete', deleteProduct);

module.exports = router