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
    quantity:{
      type: Number,
      default: 1
    },
    serialNumber:{
      type: String,
    },
    customFieldsData:{},
    assignedTo:[
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
        quantity: {
          type: Number,
          required: true
        }
      }
    ],
    status:{
      type: String,
      default: "ready to deploy"
    },
    checkedOutQuantity:{
      type: Number,
      default: 0 
    }
  },
  { timestamps: true}
);

module.exports = mongoose.model("Inventory", inventorySchema);
