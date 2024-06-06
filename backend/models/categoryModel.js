const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Organization = require("./organizationModel.js");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    identificationType: {
      type: String,
      required: true,
      enum: ["Single", "Mass"],
    },
    orgId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Organization",
    },
    active:{
      type: Boolean,
      required: true,
      default: true
    },
    customFields: [
      {
        label: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
        },
        required: {
          type: Boolean,
          default: false,
        },
      },
    ],
    vendors: {
      type: Array,
    },
  },
  { timestamps: true }
);

categorySchema.pre("save", async function (next) {
  try {
    const existingCategory = await this.constructor.findOne({
      name: this.name,
      orgId: this.orgId,
    });

    if (existingCategory) {
      const error = new Error(
        "Category name must be Single within the organization."
      );
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Category", categorySchema);
