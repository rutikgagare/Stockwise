const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Organization = require("../models/organizationModel");

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
      enum: ["pcs", "kg", "g", "box", "cm", "dz"],
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Electronics",
        "Clothing/Apparel",
        "Home Goods",
        "Automotive Parts",
        "Beauty/Personal Care",
        "Health/Wellness",
        "Food/Beverage",
        "Toys/Games",
        "Sporting Goods",
        "Office Supplies",
        "Books/Media",
        "Tools/Hardware",
        "Furniture",
        "Pet Supplies",
        "Jewelry/Accessories",
        "Baby/Childcare",
        "Electronics Accessories",
        "Kitchenware",
        "Garden/Outdoor",
        "Stationery/Art Supplies",
      ],
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    costPrice: {
      type: Number,
      required: true,
    },
    orgId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Organization",
    },
  },
  { timestamps: true }
);

productSchema.index({ name: 1, orgId: 1 }, { unique: true });

module.exports = mongoose.model("Product", productSchema);
