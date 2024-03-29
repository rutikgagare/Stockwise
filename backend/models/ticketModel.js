const mongoose = require('mongoose');
const Organization = require("./organizationModel.js");

const ticketSchema = new mongoose.Schema({
  issueType: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  status: {
    type: String,
    enum: ['open', 'processing', 'resolved', 'closed'],
    default: 'open'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  assetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory'
  },
  orgId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Organization",
  },
  remark:{
    type: String,
  }
}, { timestamps: true });


const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
