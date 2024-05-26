const { default: mongoose } = require("mongoose");
const Organization = require("../models/organizationModel");
const User = require("../models/userModel");
const { ObjectId } = require("mongodb");

// Create a new organization
const createOrganization = async (req, res) => {
  const orgData = req.body;
  const adminId = new ObjectId(req.user._id);

  if (!orgData || !adminId) {
    res.status(400).json({ error: "Please provide org data and admin id" });
    return;
  }

  try {
    const org = new Organization({
      name: orgData.name,
      email: orgData.email,
      admins: [adminId],
      employees: [],
    });

    await org.save();
    res.status(201).json(org);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getOrganization = async (req, res) => {
  const userId = req?.user?._id;

  try {
    const org = await Organization.find({
      $or: [
        { admins: new ObjectId(userId) },
        { employees: new ObjectId(userId) },
      ],
    });

    if (org) {
      return res.status(200).json(org[0]);
    } else {
      throw Error("Internal server error");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOrganization = async (req, res) => {
  const orgData = req.body;

  const orgId = new ObjectId(orgData.orgId);

  if (!orgId) {
    res.status(400).json({ error: `orgId not provided!` });
    return;
  }

  try {
    const organization = await Organization.findById(orgId);

    if (!organization) {
      res
        .status(404)
        .json({ error: `Organization with orgId: ${orgId} does not exist` });
      return;
    }

    const result = await Organization.updateOne(
      { _id: orgId },
      { $set: req.body }
    );

    if (result) {
      res.status(200).json({ message: "Organization updated successfully" });
    } else {
      res.status(400).json({ message: "Update Unsuccessful" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addEmployeeToOrganization = async (req, res) => {

  console.log("addEmployeeToOrganization: ", "req.user: ", req.user);
  const { employeeId } = req.body;

  const userId = new ObjectId(req.user._id);

  // Query the organization
  const organization = await Organization.findOne({
    $or: [
      { employees: userId },
      { admins: userId }
    ]
  });

  // Extract the organization ID
  const orgId = organization ? organization._id.toString() : "NO_ORG_ID";

  console.log("transidental orgId: ", orgId);

  const employeeObjectId = new ObjectId(employeeId);
  const orgObjectId = new ObjectId(orgId);

  try {
    const employee = await User.findById(employeeObjectId);
    const org = await Organization.findById(orgObjectId);

    if (!employee) {
      res
        .status(404)
        .json({
          error: `Employee with employeeId: ${employeeId} does not exist`,
        });
      return;
    }

    if (!org) {
      res
        .status(404)
        .json({ error: `Organization with orgId: ${orgId} does not exist` });
      return;
    }

    if (!org.employees.some((id) => id.equals(new ObjectId(employeeId)))) {
      org.employees.push(new ObjectId(employeeId));
      await org.save();
      res
        .status(200)
        .json({
          message: `Employee: ${employeeId} added to the Organization (${orgId})`,
        });
    } else {
      res
        .status(200)
        .json({
          message: `Employee: ${employeeId} already exists in the Organization (${orgId})`,
        });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const removeEmployeeFromOrganization = async (req, res) => {
  const { employeeId, orgId } = req.body;

  try {
    const employee = await User.findById(new ObjectId(employeeId));
    const org = await Organization.findById(new ObjectId(orgId));

    if (!employee) {
      return res
        .status(404)
        .json({
          error: `Employee with employeeId: ${employeeId} does not exist`,
        });
    }

    if (!org) {
      return res
        .status(404)
        .json({ error: `Organization with orgId: ${orgId} does not exist` });
    }

    org.employees = org.employees.filter((id) => id.toString() !== employeeId);
    await org.save();

    res
      .status(200)
      .json({
        message: `Employee: ${employeeId} was removed to the Organization (${orgId})`,
      });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteOrganization = async (req, res) => {
  const { orgId } = req.body;

  try {
    const result = await Organization.findByIdAndDelete(new ObjectId(orgId));

    if (!result) {
      res
        .status(404)
        .json({ error: `Organization with orgId: ${orgId} not found` });
    } else {
      res
        .status(200)
        .json({
          message: `Organization '${result.name} (${orgId})' deleted successfully`,
        });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEmployees = async (req, res) => {
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

  try {
    const org = await Organization.findById(new ObjectId(orgId));

    if (!org) {
      res
        .status(404)
        .json({ error: `Organization with orgId: ${orgId} not found` });
      return;
    }

    const employeeIds = [...org?.employees, ...org?.admins];
    const query = {
      _id: {
        $in: employeeIds,
      },
    };

    const user = await User.find(query, { password: 0 });
    const employeeDetails = user.map((user) => {
      return {
        _id: user?._id,
        name: user?.name,
        email: user?.email,
        role: user?.role,
      };
    });

    res.status(200).json(employeeDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrgOfUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const organization = await Organization.findOne({
      $or: [{ admins: { $in: [userId] } }, { employees: { $in: [userId] } }],
    });

    return res.json(organization);
  } catch (error) {
    console.error("Error fetching organization:", error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createOrganization,
  addEmployeeToOrganization,
  removeEmployeeFromOrganization,
  deleteOrganization,
  updateOrganization,
  getOrganization,
  getEmployees,
  getOrgOfUser,
};
