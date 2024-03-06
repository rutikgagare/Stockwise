const express = require('express')
const {
    createVendor, 
    getVendors, 
    updateVendor,
    deleteVendor
} = require("../controllers/vendorController.js")
const requireAdmin = require('../middleware/requireAdmin.js');

const router = express.Router()

router.post('/vendors', getVendors);
router.post('/create', createVendor);
router.put('/update', updateVendor);
router.delete('/delete', deleteVendor);

module.exports = router