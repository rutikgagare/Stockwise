const { default: mongoose } = require("mongoose");
const { ObjectId } = require("mongodb");

const Category = require("../models/categoryModel.js");
const Organization = require("../models/organizationModel.js");

const getCategorys = async (req, res) => {
  try {

    const userId = new ObjectId(req.user._id);
    const organization = await Organization.findOne({
      $or: [{ employees: userId }, { admins: userId }],
    });
    const orgId = organization ? organization._id : null;

    const org = await Organization.findById(new ObjectId(orgId));

    if (!org) {
      throw Error("Organization with orgId does not exist");
    }

    const categoriesWithInventories = await Category.aggregate([
      {
        $match: {
          orgId: new ObjectId(orgId),
        },
      },
      {
        $lookup: {
          from: "inventories",
          localField: "_id",
          foreignField: "categoryId",
          as: "inventoryItems",
        },
      },
    ]);

    const categoryInformation = categoriesWithInventories.map((category) => {
      const numberOfAssets = category.inventoryItems.reduce(
        (total, inventory) => {
          return total + (inventory.quantity || 0);
        },
        0
      );

      return {
        _id: category._id,
        name: category.name,
        identificationType: category.identificationType,
        orgId: category.orgId,
        customFields: category.customFields,
        vendors: category.vendors,
        numberOfAssets: numberOfAssets,
      };
    });

    categoryInformation.sort((a, b) => b.numberOfAssets - a.numberOfAssets);

    res.status(201).json(categoryInformation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createCategory = async (req, res) => {
  const { name, identificationType, vendors, customFields } = req.body;

  const userId = new ObjectId(req.user._id);
  const organization = await Organization.findOne({
    $or: [{ employees: userId }, { admins: userId }],
  });
  const orgId = organization ? organization._id : null;

  try {
    const organization = await Organization.findById(new ObjectId(orgId));

    if (organization === null) {
      throw Error(`Organization with orgId: ${orgId} does not exist`);
    }

    const category = new Category({
      name,
      identificationType,
      vendors: vendors,
      customFields,
      orgId,
    });

    await category.save();

    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    if (!categoryId) {
      throw Error("category Id not provided");
    }

    const category = await Category.findByIdAndDelete(new ObjectId(categoryId));

    if (!category) {
      throw Error(`category with categoryId ${categoryId} doesn't exist`);
    }

    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;

    if (!categoryId) {
      throw Error("category Id not provided");
    }

    const userId = new ObjectId(req.user._id);
    const organization = await Organization.findOne({
      $or: [{ employees: userId }, { admins: userId }],
    });
    const orgId = organization ? organization._id : null;
    req.body.orgId = new ObjectId(orgId);

    const updatedCategory = await Category.findByIdAndUpdate(
      new ObjectId(categoryId),
      req.body,
      { new: true } // ensures that the updated document is returned
    );

    if (!updatedCategory) {
      throw Error(`category with categoryId ${categoryId} doesn't exist`);
    }

    res.status(201).json(updatedCategory);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createCategory,
  deleteCategory,
  updateCategory,
  getCategorys,
};
