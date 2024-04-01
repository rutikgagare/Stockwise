const express = require('express')
const { createTicket, updateTicket, deleteTicket,getMyTickets, getTickets} = require('../controllers/ticketController.js')
const requireAuth = require('../middleware/requireAuth.js');
const requireAdmin = require('../middleware/requireAdmin.js');

const router = express.Router()
router.use(requireAuth)

router.post('/create', createTicket);
router.put('/update',requireAdmin, updateTicket);
router.get('/userTickets',getMyTickets);
router.get('/:orgId', requireAdmin, getTickets);

module.exports = router