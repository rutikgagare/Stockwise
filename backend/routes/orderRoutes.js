const express = require('express')
const {
    getOrders,
    createOrder,
    markOrderAsComplete,
    markOrderAsPlaced

} = require("../controllers/orderController.js")

const requireAdmin = require('../middleware/requireAdmin.js');

const router = express.Router()

router.post('/orders', getOrders);
router.post('/create', createOrder);
router.post('/complete', markOrderAsComplete);
router.post('/placed', markOrderAsPlaced);

module.exports = router