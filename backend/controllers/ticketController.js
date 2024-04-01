const Ticket = require("../models/ticketModel.js");
const { ObjectId } = require("mongodb");

const getMyTickets = async (req, res) => {
  try {
    const userId = new ObjectId(req.user?._id);
    const tickets = await Ticket.find({ createdBy: userId });

    if (!tickets) {
      throw Error(`No ticket found for particular user`);
    }

    res.status(201).json(tickets);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTickets = async (req, res) => {
  const orgId = req.params.orgId;

  try {
    const tickets = await Ticket.find({ orgId });

    if (!tickets) {
      throw Error(`No ticket found for particular user`);
    }

    tickets.sort((a, b) => b.createdAt - a.createdAt);

    res.status(201).json(tickets);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createTicket = async (req, res) => {
  try {
    const { issueType, description, priority, assetId, orgId } = req.body;

    const userId = new ObjectId(req.user?._id);
    const userName = req.user?.name;

    const ticket = new Ticket({
      issueType,
      description,
      priority,
      createdBy: userId,
      assetId: new ObjectId(assetId),
      orgId,
      userName,
    });

    const newTicket = await ticket.save();
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateTicket = async (req, res) => {
  try {
    const { ticketId } = req.body;

    const updatedTicket = await Ticket.findByIdAndUpdate(
      new ObjectId(ticketId),
      req.body,
      { new: true }
    );

    res.status(201).json(updatedTicket);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createTicket,
  updateTicket,
  getMyTickets,
  getTickets,
};
