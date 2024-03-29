const express = require('express')
const multer = require("multer");
const requireAuth = require('./authRoutes.js');

const router = express.Router()
router.use(requireAuth)

const sendMail = require("../controllers/nodeMailer.js")
const {uploadImageToAWS} = require('../controllers/awsS3.js');

router.post('/sendMail', sendMail)

// upload image to aws
const storage = multer.memoryStorage({});

const upload = multer({
  storage: storage
})

router.post('/upload', upload.single('file'), uploadImageToAWS);

module.exports = router