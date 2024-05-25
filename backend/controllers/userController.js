const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Generating a token
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// Login user
const loginUser = async (req, res) => {

  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    // Create a token
    const token = createToken(user._id);
    res
      .status(200)
      .json({ name: user.name, email, token, _id: user._id, role: user.role });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Signup user
const signupUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const user = await User.signup(name, email, password, role);

    // Create a token
    const token = createToken(user._id);
    res.status(200).json({ name, email, token, id: user._id, role: user.role });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// change password
const changePassword = async (req, res)=>{
  console.log(req.user);
}

module.exports = { loginUser, signupUser, changePassword};
