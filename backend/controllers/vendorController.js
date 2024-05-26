const { ObjectId } = require("mongodb");
const Organization = require("../models/organizationModel.js")
const Vendor = require("../models/vendorModel")
const Inventory = require("../models/inventoryModel.js");
const Category = require("../models/categoryModel.js");

const createVendor = async (req, res) => {
    const vendorDetails = req.body;

    const userId = new ObjectId(req.user._id);

    // Query the organization
    const organization = await Organization.findOne({
      $or: [
        { employees: userId },
        { admins: userId }
      ]
    });

    // Extract the organization ID
    const orgId = organization ? organization._id.toString() : null;

    vendorDetails.orgId = orgId;

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
    const userId = new ObjectId(req.user._id);

    // Query the organization
    const organization = await Organization.findOne({
      $or: [
        { employees: userId },
        { admins: userId }
      ]
    });

    // Extract the organization ID
    const orgId = organization ? organization._id.toString() : null;
    
    try {
        const vendors = await Vendor.find({ orgId });
        res.status(200).json(vendors);
    }
    
    catch (err) {
        res.status(400).json(err);
    }
}

const getProductVendors = async (req, res) => {
    const userId = new ObjectId(req.user._id);

    // Query the organization
    const organization = await Organization.findOne({
      $or: [
        { employees: userId },
        { admins: userId }
      ]
    });

    // Extract the organization ID
    const orgId = organization ? organization._id : null;

    console.log("orgId:", orgId);
    try {
        let vendors = await Vendor.find({ orgId });
        let items = await Inventory.find({ orgId })
        const categories = await Category.find({ orgId });

        console.log("vendors: ", vendors, "\nitems: ", items, "\ncategories: ", categories)
        vendors = vendors.map(vendor => {
            return {
                _id: vendor._id,
                name: vendor.name,
            }
        })

        items = items.map(item => {
            return {
                _id: item._id,
                name: item.name,
                categoryId: item.categoryId
            }
        })

        console.log("vendors: ", vendors, "\n\nitems: ", items, "\n\nCategories: ", categories)
        
        const productVendors = items.map(item => {
            const category = categories.find(cat => cat._id.equals(item.categoryId));
            const associatedVendors = category ? category.vendors.map(vendorId => vendors.find(vendor => vendor._id.equals(vendorId))) : [];
            const filtered = [];
            for (const av of associatedVendors) if(av) filtered.push(av);
            return {
                item: item,
                vendors: filtered
            };
        });

        const productVendorsFiltered = productVendors.filter((p) => p.vendors.length)
        
        res.status(200).json(productVendorsFiltered);
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
    try {
        const result = await Vendor.findOneAndDelete({ _id: vendorId })
        res.status(200).json(result);
    }
    catch (err) {
        res.status(500).json({ error: err })
    }
}

module.exports = { createVendor, getProductVendors, getVendors, updateVendor, deleteVendor }