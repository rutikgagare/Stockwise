const express = require('express')
const {
    getOrders,
    createOrder,
    markOrderAsComplete,
    markOrderAsPlaced,
    markOrderAsPending,
    markOrderAsRejected

} = require("../controllers/orderController.js")

const router = express.Router()

router.post('/orders', getOrders);
router.post('/create', createOrder);
router.post('/fulfilled', markOrderAsComplete);
router.post('/pending', markOrderAsPending);
router.post('/rejected', markOrderAsRejected);
router.post('/placed', markOrderAsPlaced);

module.exports = router