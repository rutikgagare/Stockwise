const Ticket = require('../models/ticketModel.js');
const { ObjectId } = require("mongodb");


const createTicket = async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    const userId = new ObjectId(req.user?._id);

    const ticket = new Ticket({
      title,
      description,
      priority,
      createdBy: userId
    });

    const newTicket = await ticket.save();
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, status } = req.body;

    const updatedTicket = await Ticket.findByIdAndUpdate(id, {
      title,
      description,
      priority,
      status
    }, { new: true });

    if (!updatedTicket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTicket = await Ticket.findByIdAndDelete(id);

    if (!deletedTicket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createTicket, updateTicket, deleteTicket };
