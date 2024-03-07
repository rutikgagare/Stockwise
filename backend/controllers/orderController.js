const getOrders = async (req, res) => {

}

const createOrder = async (req, res) => {
    const { orgId, vendeeId, cart } = req.body;
    console.log("req.body = ", req.body)

    res.json({msg: "working on it!"})
}



module.exports = { getOrders, createOrder }