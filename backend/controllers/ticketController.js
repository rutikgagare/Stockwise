const Ticket = require("../models/ticketModel.js");
const { ObjectId } = require("mongodb");
const Organization = require("../models/organizationModel.js");


const getMyTickets = async (req, res) => {
  try {
    const userId = new ObjectId(req.user?._id);
    const tickets = await Ticket.find({ createdBy: userId });

    if (!tickets) {
      throw Error(`No ticket found for the particular user`);
    }

    res.status(200).json(tickets);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getTickets = async (req, res) => {
  const userId = new ObjectId(req.user._id);

  try {

    const organization = await Organization.findOne({
      $or: [{ employees: userId }, { admins: userId }],
    });
    const orgId = organization ? organization._id : null;

    const tickets = await Ticket.find({ orgId });

    if (!tickets) {
      throw Error(`No ticket found for the particular organization`);
    }

    tickets.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json(tickets);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createTicket = async (req, res) => {
  try {
    const { issueType, description, priority, assetId } = req.body;

    const userId = new ObjectId(req.user?._id);
    const assetObjectId = assetId ? new ObjectId(assetId) : null;
    const userName = req.user?.name;

    const organization = await Organization.findOne({
      $or: [{ employees: userId }, { admins: userId }],
    });
    const orgId = organization ? organization._id : null;

    const ticket = new Ticket({
      issueType,
      description,
      priority,
      createdBy: userId,
      assetId: assetObjectId,
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

    if (!updatedTicket) {
      throw Error(`Ticket with ID ${ticketId} not found`);
    }

    res.status(200).json(updatedTicket);
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
