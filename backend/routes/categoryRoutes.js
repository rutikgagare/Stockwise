const express = require('express')
const {createCategory, deleteCategory, updateCategory, getCategorys} = require('../controllers/categoryController.js');
const requireAuth = require('../middleware/requireAuth.js');
const requireAdmin = require('../middleware/requireAdmin.js');

const router = express.Router()
router.use(requireAuth)
router.use(requireAdmin)

router.post('/create', createCategory);
router.put('/update', updateCategory);
router.delete('/delete/:categoryId', deleteCategory);
router.get('/:orgId', getCategorys);


module.exports = router