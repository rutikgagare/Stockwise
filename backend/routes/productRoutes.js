const express = require('express')
const {createProduct, deleteProduct, updateProduct, getProducts} = require('../controllers/productController.js');
const requireAuth = require('../middleware/requireAuth.js');
// const requireAdmin = require('../middleware/requireAdmin.js');

const router = express.Router()
router.use(requireAuth)

router.post('/create', createProduct);
router.put('/update', updateProduct);
router.delete('/delete', deleteProduct);
router.get('/:orgId', getProducts);


module.exports = router