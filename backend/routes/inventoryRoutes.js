const express = require('express')
const {createItem, getItems, deleteItem, updateItem, checkoutItem, getUserAssets, checkinItem, itemSearch, createMultipleItem, getItem, getInventoryCounts} = require("../controllers/inventoryController.js")
const requireAuth = require('../middleware/requireAuth.js');
const requireAdmin = require('../middleware/requireAdmin.js');

const router = express.Router()
router.use(requireAuth)

router.post('/create', requireAdmin, createItem);
router.post('/createMultiple', requireAdmin, createMultipleItem);
router.get('/items', requireAdmin, getItems);
router.get('/getItem/:itemId', requireAdmin, getItem);
router.post('/searchItems/:orgId', requireAdmin, itemSearch);
router.delete('/delete/:itemId',  requireAdmin, deleteItem);
router.put('/update',  requireAdmin, updateItem);
router.put('/checkout', requireAdmin, checkoutItem);
router.put('/checkin', requireAdmin, checkinItem);
router.get('/item/getUserAssets', getUserAssets);
router.get('/item/getInventoryCounts', getInventoryCounts);
// router.get('/itemCount/:orgId', getItemCounts);

module.exports = router