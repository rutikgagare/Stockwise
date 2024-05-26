
const express = require('express')
const { 
    createOrganization,
    addEmployeeToOrganization,
    removeEmployeeFromOrganization,
    deleteOrganization,
    updateOrganization,
    getOrganization,
    getEmployees,
    getOrgOfUser
} = require("../controllers/organizationController")

const requireAuth = require('../middleware/requireAuth.js');
const requireAdmin = require('../middleware/requireAdmin.js');

const router = express.Router()
router.use(requireAuth);

router.post('/create', requireAdmin, createOrganization); // create a new organization
router.post('/add', requireAdmin, addEmployeeToOrganization);
router.put('/update', requireAdmin, updateOrganization);
router.post('/remove', requireAdmin, removeEmployeeFromOrganization);
router.delete('/deleteOrg', requireAdmin, deleteOrganization);

// don not require admin access
router.get('/employees/', requireAuth, requireAdmin, getEmployees);
router.get('/getOrg', getOrganization);
router.get("/getOrgOfUser/:userId", getOrgOfUser)

module.exports = router
