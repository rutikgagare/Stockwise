
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
router.get('/getOrg', getOrganization);

module.exports = router
