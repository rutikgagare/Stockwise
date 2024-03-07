const express = require('express')
const {
    getOrders,
    createOrder,

} = require("../controllers/orderController.js")

const requireAdmin = require('../middleware/requireAdmin.js');

const router = express.Router()

router.post('/orders', getOrders);
router.post('/create', createOrder);

module.exports = router