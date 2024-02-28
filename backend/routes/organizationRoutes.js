
const express = require('express')
const { 
    createOrganization,
    addEmployeeToOrganization,
    removeEmployeeFromOrganization,
    deleteOrganization
} = require("../controllers/organizationController")
const router = express.Router()

router.post('/create', createOrganization); // create a new organization
router.post('/add', addEmployeeToOrganization);
router.post('/remove', removeEmployeeFromOrganization);
router.delete('/deleteOrg', deleteOrganization);

module.exports = router
