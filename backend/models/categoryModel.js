const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Organization = require("./organizationModel.js");

const categorySchema = new Schema(
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
    
    orgId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Organization",
    },
    vendors: {
      type: Array,
    },
    customFields:[],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
