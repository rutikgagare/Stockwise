const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const Organization = require("../models/organizationModel");
const { ObjectId } = require("mongodb");
const { generateRandomPassword } = require("../utils/generators");
const { sendMail } = require("../utils/mail");
const requireAuth = require("../middleware/requireAuth");
const requireAdmin = require("../middleware/requireAdmin");

const router = express.Router();

const saltRounds = 10;

const escapeHtml = (unsafe) => {
  return unsafe.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};


router.get("/getAllUsers", async (req, res) => {
  try {
    const allUsers = await User.find();
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/getUser/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findOne({ _id: new ObjectId(id) });
    if (user) res.json(user);
    else res.status(404).json({ error: "User not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/createUser", async (req, res) => {
  const userData = req.body;
  const randomPassword = generateRandomPassword();
  userData["password"] = randomPassword;

  const existingUser = await User.find({ email: userData.email });
  if (existingUser) {
    res.status(400).json({ error: `User with email '${userData.email}' already exists` });
  }
  
  try {
    const hashedPassword = await bcrypt.hash(userData["password"], saltRounds);
    userData["password"] = hashedPassword;

    const newUser = await User.create(userData);

    const escapedPassword = escapeHtml(randomPassword);

    try {
      sendMail(
        "Stockwise Admin",
        userData["email"],
        "Welcome to Stockwise",
        "",
        `
        <h3>We welcome you to the Stockwise</h3>
        <p>
        You have been added to the Organization: <br>
        as a ${userData["role"]} <br>
        As a next step <br>
        We recommend you to login to the account change your password
        </p>
        <strong>Here are your credentials<strong> <br>
        email: ${userData["email"]}
        password: ${escapedPassword}
        
        <h4>
        We hope you have a long and lovely relationship with Stockwise
        </h4>
        `
      );
    } catch (error) {
      console.log("createUser Error: ", error);
      res.status(500).json({ message: "Internal Server Error. Could not create user.", error });
    }

    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/updateUser", requireAuth, requireAdmin, async (req, res) => {
  const { _id, name, email, role, password } = req.body;

  if (req.user._id.toString() === _id.toString() && role !== req.user.role) {
    return res.status(400).json({ error: "You cannot update your role!" });

  }
  const updateData = { name, email, role };
  for (const a in updateData) if (!updateData[a]) delete updateData[a];

  let org = await Organization.findOne({ $or: [{ employees: new ObjectId(_id) }, { admins: new ObjectId(_id) }] });
  try {
    const existingUser = await User.findOne({ _id: new ObjectId(_id) });

    if (existingUser.role == "admin") {
      org.admins = org?.admins.filter((e) => e.toString() !== _id.toString())
      org.employees.push(_id);
      const adminCount = org.employees.length;
      console.log("adminCount: ", adminCount);
      if (adminCount == 1) {
        return res.status(400).json({ error: "Organization must have atleast ONE admin." })
      }
    }

    if (existingUser.role == "employee") {
      org.employees = org?.employees.filter((e) => e.toString() !== _id.toString())
      org.admins.push(_id);
    }

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    await org.save();

    const updatedUser = await User.findOneAndUpdate(
      { _id: new ObjectId(_id) },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/deleteUser", requireAuth, requireAdmin, async (req, res) => {
  const _id = req.body._id;
  const user = req.user;

  if (_id.toString() === req.user._id.toString()) {
    return res.status(400).json({ error: "You cannot delete yourself!" });
  }

  try {
    const existingUser = await User.findOne({ _id: new Object(_id) });
    const org = await Organization.findOne({ $or: [{ employees: new ObjectId(existingUser._id) }, { admins: new ObjectId(existingUser._id) }] });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!org) {
      return res.status(404).json({ error: `Organization with orgId: ${existingUser._id} does not exist` });
    }

    if (org.admins.length === 1 && org.admins[0]._id.toString() === _id) {
      return res.status(400).json({ error: "Organization must have atleast ONE admin" })
    }
    // remove employee from the org's employees array
    org.employees = org.employees.filter(id => id.toString() !== existingUser._id.toString());
    if (org.admins.length > 1)
      org.admins = org.admins.filter(id => id.toString() !== existingUser._id.toString());
    await org.save();


    await User.findOneAndDelete({ _id: new Object(_id) });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/search", requireAuth, requireAdmin, async (req, res) => {
  searchQuery = req.body.query.toLowerCase();
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
  console.log("orgId: ", orgId);

  try {
    const employeeIds = organization.employees;

    const users = await User.find({
      _id: { $in: employeeIds }
    }).exec();

    console.log("users: ", users);

    const matchedUsers = users.filter(user => {
      const { name, email, role } = user;

      const userValues = [name, email, role];
      return userValues.some(value => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchQuery);
        } else if (typeof value === 'number') {
          return value.toString().includes(searchQuery);
        } else if (Array.isArray(value)) {
          return value.some(arrayVal => arrayVal.toString().toLowerCase().includes(searchQuery));
        }
        return false;
      });
    });

    res.status(200).json(matchedUsers);
  } catch (err) {
    res.status(500).json({ error: `Error executing query:' ${err}` });
  }
})

module.exports = router;