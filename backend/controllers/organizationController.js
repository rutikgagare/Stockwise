const { default: mongoose } = require("mongoose");
const Organization = require("../models/organizationModel");
const User = require("../models/userModel")
const { ObjectId } = require("mongodb");

// Create a new organization
const createOrganization = async (req, res) => {
    const orgData = req.body;

    // check if orgData.adminId exists
    const adminId = new ObjectId(orgData.adminId)
    
    if (!adminId) {
        res.status(400).json({ error: `adminId not provided!` });
    }

    const admin = await User.findById(adminId);

    if (!admin) {
        res.status(404).json({ error: `Admin with adminId: ${adminId} does not exist` });
        return;
    }

    const orgDataToInsert = {
        name: orgData.name,
        admins: [admin._id],
        employees: []
    }

    try {
        const org = await Organization.create(orgDataToInsert);
        res.status(200).json({ org });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getOrganization = async (req, res)=>{

    const userId = req.params.userId;

    try {
        const user = await User.findById(new ObjectId(userId));

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userRole = user.role;

        const organizations = await Organization.find()
       
        organizations.forEach(org => {
            if (userRole === 'admin' && org.admins.includes(userId)) {
                return res.json(org)
            } else if (userRole === 'user' && org.users.includes(userId)) {
                return res.satus(200).json(org);
            }
        });

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
}

const updateOrganization = async(req, res)=>{
    const orgData = req.body

    const orgId = new ObjectId(orgData.orgId)

    if (!orgId) {
        res.status(400).json({ error: `orgId not provided!` });
    }

    const organization = await Organization.findById(orgId);

    if(!organization){
        res.status(404).json({ error: `Organization with otgId: ${orgId} does not exist` });
        return;
    }

    const result = await Organization.updateOne(
        { _id: orgId}, 
        { $set: req.body}
    );

    if(result){
        res.status(200).json({ message: "Organization updated successfully" });
    }
    else{
        res.status(400).json({ message: "Update Unsuccessful" });
    }
}

const addEmployeeToOrganization = async (req, res) => {
    const { employeeId, orgId } = req.body;

    const employeeObjectId = new ObjectId(employeeId)
    const orgObjectId = new ObjectId(orgId)
    
    const employee = await User.findById(employeeObjectId);
    const org = await Organization.findById(orgObjectId);
    
    if (!employee) {
        res.status(404).json({ error: `Employee with employeeId: ${employeeId} does not exist` });
        return;
    }

    if (!org) {
        res.status(404).json({ error: `Organization with orgId: ${orgId} does not exist` });
        return;
    }

    if (!org.employees.some(id => id.equals(new ObjectId(employeeId)))) {
        org.employees.push(new ObjectId(employeeId));
        await org.save();
        res.status(200).json({ message: `Employee: ${employeeId} added to the Organization (${orgId})` });
    } else {
        res.status(200).json({ message: `Employee: ${employeeId} already exists in the Organization (${orgId})` });
    }
}

const removeEmployeeFromOrganization = async (req, res) => {
    const { employeeId, orgId } = req.body;

    const employee = await User.findById(new ObjectId(employeeId));
    const org = await Organization.findById(new ObjectId(orgId));

    if (!employee) {
        res.status(404).json({ error: `Employee with employeeId: ${employeeId} does not exist` });
    }

    if (!org) {
        res.status(404).json({ error: `Organization with orgId: ${orgId} does not exist` });
    }

    org.employees = org.employees.filter(id => id.toString() !== employeeId);
    await org.save();

    res.status(200).json({ message: `Employee: ${employeeId} was removed to the Organization (${orgId})` })
}

const deleteOrganization = async (req, res) => {
    const { orgId } = req.body;

    try {
        const result = await Organization.findByIdAndDelete(new ObjectId(orgId));

        if (!result) {
            res.status(404).json({ error: `Organization with orgId: ${orgId} not found` });
            return;
        }

        console.log("result", result)

        res.status(200).json({ message: `Organization '${result.name} (${orgId})' deleted successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { 
    createOrganization,
    addEmployeeToOrganization,
    removeEmployeeFromOrganization,
    deleteOrganization,
    updateOrganization,
    getOrganization
};