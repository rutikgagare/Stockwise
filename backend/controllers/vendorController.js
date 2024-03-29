const { ObjectId } = require("mongodb");

const Vendor = require("../models/vendorModel")

const createVendor = async (req, res) => {
    const vendorDetails = req.body;

    try {
        const newVendor = new Vendor(vendorDetails);
        await newVendor.save();

        res.json(newVendor);
    }
    catch (err) {
        res.status(400).json(err);
    }
}

const getVendors = async (req, res) => {
    const orgId = new ObjectId(req.body.orgId);
    
    try {
        const vendors = await Vendor.find({ orgId });
        res.json(vendors);
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

        res.json(updatedVendor);
    }
    catch (err) {
        res.status(400).json({ error: err })
    }
}

const deleteVendor = async (req, res) => {
    const vendorId = new Object(req.body.vendorId);
    try {
        const result = await Vendor.findOneAndDelete({ _id: vendorId })
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: err })
    }
}

module.exports = { createVendor, getVendors, updateVendor, deleteVendor }