const express = require('express')
const multer = require("multer");
const requireAuth = require('./authRoutes.js');

const sendMail = require("../controllers/nodeMailer.js")
const {uploadImageToAWS, deleteImageFromAWS, listObjectsInBucket} = require('../controllers/awsS3.js');
const {sendNotification} = require('../controllers/pushNotification.js')

const router = express.Router()
router.use(requireAuth)

router.post('/sendMail', sendMail)

// upload image to aws
const storage = multer.memoryStorage({});

const upload = multer({
  storage: storage
})

router.post('/upload', upload.single('file'), uploadImageToAWS);
router.delete('/deleteImage/:key', deleteImageFromAWS);
// router.get('/list', listObjectsInBucket);

// push Notification
router.post('/send-push-notification', sendNotification);

module.exports = router