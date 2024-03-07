const express = require('express')
const {loginUser, signupUser} = require('../controllers/userController.js')
// const sendMail = require('../controllers/nodeMailer.js')

const router = express.Router()

// login route
router.post('/login', loginUser);

// signup route
router.post('/signup',signupUser);

// router.get('/send',sendMail);

module.exports = router