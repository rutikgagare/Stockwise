const express = require('express')
const { createTicket, updateTicket, deleteTicket } = require('../controllers/ticketController.js')
const requireAuth = require('./authRoutes.js');

const router = express.Router()
router.use(requireAuth)

router.post('/create', createTicket);
router.put('/update',updateTicket);
router.delete('/delete',deleteTicket);

module.exports = router