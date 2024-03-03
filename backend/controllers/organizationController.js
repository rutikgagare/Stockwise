const { default: mongoose } = require("mongoose");
const Organization = require("../models/organizationModel");
const User = require("../models/userModel")
const { ObjectId } = require("mongodb");

// Create a new organization
const createOrganization = async (req, res) => {

    console.log("Inside create organiZation");
    try{
        const orgData = req.body;
        const adminId = new ObjectId(req.user._id)
        
        const org = new Organization({
            name: orgData.name,
            email: orgData.email,
            admins: [adminId],
            employees: []
        })

        await org.save()        
        res.status(200).json(org);

    }catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getOrganization = async (req, res)=>{

    const userId = req.user._id;
    
    try {
        const userRole = req.user.role;
        const organizations = await Organization.find()

        if(organizations){
            organizations.forEach(org => {
                if (userRole === 'admin' && org.admins.includes(userId)) {
                    return res.json(org)
                } else if (userRole === 'user' && org.users.includes(userId)) {
                    return res.satus(200).json(org);
                }
            });
        }
        else{
            throw Error("Internal server error");
        }
        
    }catch (error) {
        res.status(500).json({ error: error.message});
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

const getEmployees = async (req, res) => {
    const orgId = req.params.orgId;

    try {

        const org = await Organization.findById(new ObjectId(orgId));

        if (!org) {
            res.status(404).json({ error: `Organization with orgId: ${orgId} not found` });
            return;
        }

        const employeeIds = org.employees;

        const query = {
            _id: {
              $in: employeeIds
            }
        };

        const user = await User.find(query);

        const employeeDetails = user.map(user =>{
            return{
                name: user?.name,
                email: user?.email,
                role: user?.role,
                password: user?.password
            }
        })

        res.status(200).json(employeeDetails);

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
    getOrganization,
    getEmployees
};