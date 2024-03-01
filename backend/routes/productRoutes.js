const express = require('express')
const {createProduct, deleteProduct, updateProduct} = require('../controllers/productController.js');

const router = express.Router()

router.post('/create', createProduct);
router.put('/update', updateProduct);
router.delete('/delete', deleteProduct);

module.exports = router