
const express = require('express')
const {createOrganization} = require("../controllers/organizationController")
const router = express.Router()

// create a new organization
router.post('/create', createOrganization);

module.exports = router
