const { ObjectId } = require("mongodb");

const Vendor = require("../models/vendorModel")

const createVendor = async (req, res) => {
    const vendorDetails = req.body;

    try {
        const newVendor = new Vendor(vendorDetails);
        await newVendor.save();

        res.status(201).json(newVendor);
    }
    catch (err) {
        res.status(400).json(err);
    }
}

const getVendors = async (req, res) => {
    const orgId = new ObjectId(req.body.orgId);
    
    try {
        const vendors = await Vendor.find({ orgId });
        res.status(200).json(vendors);
    }

    catch (err) {
        res.status(400).json(err);
    }
}

const updateVendor = async (req, res) => {
    const { _id, name, address, email, phone } = req.body;

    try {
        const updatedVendor = await Vendor.findOneAndUpdate(
            { _id: new ObjectId(_id)}, 
            { name, address, email, phone },
            { new: true }
        )

        res.status(200).json(updatedVendor);
    }
    catch (err) {
        res.status(400).json({ error: err })
    }
}

const deleteVendor = async (req, res) => {
    const vendorId = new Object(req.body.vendorId);
    console.log("[deleteVendor]req.body: ", req.body)
    try {
        const result = await Vendor.findOneAndDelete({ _id: vendorId })
        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).json({ error: err })
    }
}

module.exports = { createVendor, getVendors, updateVendor, deleteVendor }