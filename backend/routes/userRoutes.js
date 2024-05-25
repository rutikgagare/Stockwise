const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const { ObjectId } = require("mongodb");
const { generateRandomPassword } = require("../utils/generators");
const { sendMail } = require("../utils/mail");
const router = express.Router();

const saltRounds = 10;

router.get("/getAllUsers", async (req, res) => {
  try {
    const allUsers = await User.find();
    res.json(allUsers);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error. Could not retrieve users." });
  }
});

router.get("/getUser/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findOne({ _id: new ObjectId(id) });
  if (user) res.json(user);
  res.status(404).json({ message: "User not found" });
});

router.post("/createUser", async (req, res) => {
  const userData = req.body;
  const randomPassword = generateRandomPassword();
  userData["password"] = randomPassword;
  try {
    const hashedPassword = await bcrypt.hash(userData["password"], saltRounds);
    userData["password"] = hashedPassword;

    const newUser = await User.create(userData);

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
                <strong>Here are your credentials<strong>
                email: ${userData["email"]}
                password: ${randomPassword}

            <h4>
                We hope you have a long and lovely relationship with Stockwise
            </h4>
            `
    );
    res.json(newUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error. Could not create user." });
  }
});

router.put("/updateUser", async (req, res) => {
  const { _id, name, email, role, password } = req.body;

  const updateData = { name, email, role };
  for (const a in updateData) if (!updateData[a]) delete updateData[a];

  try {
    const existingUser = await User.findOne({ _id: new ObjectId(_id) });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

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
    res
      .status(500)
      .json({ message: "Internal Server Error. Could not update user." });
  }
});

router.delete("/deleteUser", async (req, res) => {
  const _id = req.body._id;

  try {
    const existingUser = await User.findOne({ _id: new Object(_id) });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findOneAndDelete({ _id: new Object(_id) });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error. Could not delete user." });
  }
});

module.exports = router;
