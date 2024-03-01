const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Organization = require("../models/organizationModel");

const productSchema = new Schema({
  name:{
    type: String,
    required: true
  },
  unit: {
    type: String,
    required: true,
    enum: ['pcs', 'kg', 'g', 'box', 'cm', 'dz']
  },
  sellingPrice: {
    type: Number,
    required: true
  },
  costPrice:{
    type: Number, 
    required: true
  },
  orgId:{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Organization',  
}
}, { timestamps: true })


module.exports = mongoose.model('Product', productSchema)