
const express = require('express')
const { 
    createOrganization,
    addEmployeeToOrganization,
    removeEmployeeFromOrganization,
    deleteOrganization,
    updateOrganization,
    getOrganization,
    getEmployees
} = require("../controllers/organizationController")
const router = express.Router()

router.post('/create', createOrganization); // create a new organization
router.post('/add', addEmployeeToOrganization);
router.put('/update', updateOrganization);
router.post('/remove', removeEmployeeFromOrganization);
router.delete('/deleteOrg', deleteOrganization);
router.get('/getOrg/:userId', getOrganization);
router.get('/employees/:orgId', getEmployees);

module.exports = router
