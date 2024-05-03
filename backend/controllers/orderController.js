const { ObjectId } = require("mongodb");
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

const markOrderAsComplete = (req, res) => {
    const { id } = req.body;
    id = new ObjectId(id);

    try {
        const updated = Order.findOneAndUpdate({_id: id}, { status: "fulfilled", isActive: false}, {new: true})
        res.status(200).json(updated)
        console.log("updated:", updated)
    } catch (err) {
        console.log("err:", err)
        res.status(400).json({ err })
    }
}

const markOrderAsPlaced = (req, res) => {
    const { id } = req.body;
    try {
        
        Order.findOneAndUpdate({_id: id}, { status: "placed" , isActive: true }, { new: true })
        res.status(200).json(updated)
        console.log("updated:", updated)
    } catch (err) {
        res.status(400).json({ err })
        console.log("err:", err)
    }
    
}

module.exports = { getOrders, createOrder, markOrderAsComplete, markOrderAsPlaced }