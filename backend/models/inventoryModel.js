const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Category = require("./categoryModel.js");
const Organization = require("./organizationModel.js");
const User = require("./userModel.js");


const inventorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    identificationType:{
      type: String,
      required: true,
      enum:['unique', 'non-unique']
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    orgId:{
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Organization",
    },
    assignedTo:{
      type: Schema.Types.ObjectId,
      ef: "User"
    },
    quantity:{
        type: Number,
        default: 1
    },
    serialNumber:{
        type: String,
        default: ""
    }
  },
  { timestamps: true ,strict: false }
);

module.exports = mongoose.model("Inventory", inventorySchema);
