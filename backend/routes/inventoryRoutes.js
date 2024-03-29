const express = require('express')
const {createItem, getItems, deleteItem, updateItem, checkoutItem, getUserAssets, checkinItem} = require("../controllers/inventoryController.js")
const requireAuth = require('../middleware/requireAuth.js');
const requireAdmin = require('../middleware/requireAdmin.js');

const router = express.Router()
router.use(requireAuth)

router.post('/create', requireAdmin, createItem);
router.get('/:orgId', requireAdmin, getItems);
router.delete('/delete',  requireAdmin, deleteItem);
router.put('/update',  requireAdmin, updateItem);
router.put('/checkout', requireAdmin, checkoutItem);
router.put('/checkin', requireAdmin, checkinItem);
router.get('/item/getUserAssets', getUserAssets);

module.exports = router