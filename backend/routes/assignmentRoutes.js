const express = require('express')
const {assignUser} = require('../controllers/assignmentController.js')
const requireAuth = require('../middleware/requireAuth.js');
const requireAdmin = require('../middleware/requireAdmin.js');

const router = express.Router()
router.use(requireAuth)
router.use(requireAdmin)

router.post('/create', assignUser);
// router.post('/signup',signupUser);

module.exports = router