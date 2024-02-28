const { default: mongoose } = require("mongoose");
const Organization = require("../models/organizationModel");
const User = require("../models/userModel")
const { ObjectId } = require("mongodb");

// Create a new organization
const createOrganization = async (req, res)=>{
    const orgData = req.body;
    
    // check if orgData.adminId exists
    const adminId = new ObjectId(orgData.adminId)
    if (!adminId) {
        res.status(400).json({ error: `adminId not provided!`});
    }

    const admin = await User.findById(adminId);
    if (!admin) {
        res.status(404).json({ error: `Admin with adminId: ${adminId} does not exist` });
    }

    const orgDataToInsert = {
        name: orgData.name,
        email: orgData.email,
        address: orgData.address || "",
        admins: [ admin._id ],
        employees: []
    }

    try{
        const org = await Organization.create(orgDataToInsert);

        res.status(200).json({ org });

    }catch(error){
        res.status(400).json({error: error.message});
    }
}

module.exports = {createOrganization};
