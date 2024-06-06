const express = require('express')
const {
    createVendor, 
    getProductVendors,
    getVendors, 
    updateVendor,
    deleteVendor,
    searchVendor,
} = require("../controllers/vendorController.js")
const requireAdmin = require('../middleware/requireAdmin.js');
const requireAuth = require('../middleware/requireAuth.js');

const router = express.Router()

router.post('/vendors', requireAuth, requireAdmin, getVendors);
router.post('/productVendors', requireAuth, requireAdmin, getProductVendors)
router.post('/create', requireAuth, requireAdmin, createVendor);
router.put('/update', requireAuth, requireAdmin, updateVendor);
router.delete('/delete', requireAuth, requireAdmin, deleteVendor);
router.post('/search', requireAuth, requireAdmin, searchVendor);

module.exports = router