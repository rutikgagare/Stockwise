const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Category = require("./categoryModel.js");
const Organization = require("./organizationModel.js");
const User = require("./userModel.js");

const lifecycleEventSchema = new Schema({
  userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
  },
  userName: {
      type: String,
      required: true
  },
  checkoutDate: {
      type: Date,
      default: Date.now
  },
  checkinDate: {
      type: Date
  }
});


const inventorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    identificationType:{
      type: String,
      required: true,
      enum:['Single', 'Mass']
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
    },
    itemImage:{
      type: String
    },
    lifecycle:[lifecycleEventSchema]
  },
  { timestamps: true}
);

inventorySchema.pre("save", async function(next) {
  if (this.identificationType === "Single" && this.isModified("serialNumber")) {
    const existingInventory = await this.constructor.findOne({
      categoryId: this.categoryId,
      serialNumber: this.serialNumber
    });

    if (existingInventory) {
      const error = new Error("Serial number must be Single within the category.");
      next(error); 
    }
  }
  next(); 
});

module.exports = mongoose.model("Inventory", inventorySchema);
