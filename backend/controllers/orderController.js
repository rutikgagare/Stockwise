const Order = require("../models/orderModel")

const getOrders = async (req, res) => {

}

const createOrder = async (req, res) => {
    const { orgId, adminId, cart } = req.body;
    console.log("req.body = ", req.body)

    try {
        const newOrder = new Order({ orgId, adminId, cart });
        await newOrder.save();

        console.log("saved new order: ");
        console.log(newOrder);
        res.json(newOrder);
    }

    catch (error) {
        console.log("could not save new order: ");
        console.log("error: ", error);
        res.status(500).json({error})
    }
}



module.exports = { getOrders, createOrder }