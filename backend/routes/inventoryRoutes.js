const express = require('express')
const {createItem, getItems, deleteItem, updateItem} = require("../controllers/inventoryController.js")
const requireAuth = require('../middleware/requireAuth.js');
// const requireAdmin = require('../middleware/requireAdmin.js');

const router = express.Router()
router.use(requireAuth)

router.post('/create', createItem);
router.get('/:orgId', getItems);
router.delete('/delete', deleteItem);
router.put('/update', updateItem);

module.exports = router