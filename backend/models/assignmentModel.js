const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('../models/userModel.js')
const Inventory = require('../models/inventoryModel.js')

const assignmentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    userName: {
      type: String,
      required: true
    },
    itemId: {
      type: Schema.Types.ObjectId,
      ref: "Inventory",
      required: true
    },
    quantity: {
      type: Number,
      default: 1
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
