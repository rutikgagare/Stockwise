const express = require('express')
const {loginUser, signupUser, changePassword} = require('../controllers/userController.js')

const router = express.Router()
const requireAuth = require('../middleware/requireAuth.js');

// login route
router.post('/login', loginUser);

// signup route
router.post('/signup',signupUser);

router.post('/changePassword', requireAuth, changePassword )

module.exports = router