const Order = require("../models/orderModel")

const getOrders = async (req, res) => {
    const { orgId } = req.body;
    try {
        const orders = await Order.find({ "org._id": orgId });
        res.json(orders);

    } catch (error) {
        res.status(500).json({ error })
    }
}

const createOrder = async (req, res) => {
    const { org, admin, cart } = req.body;

    try {
        const newOrder = new Order({ org, admin, cart });
        await newOrder.save();
        res.json(newOrder);
    }

    catch (error) {
        res.status(500).json({error})
    }
}



module.exports = { getOrders, createOrder }