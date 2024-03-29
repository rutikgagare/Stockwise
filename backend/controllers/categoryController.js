const { default: mongoose } = require("mongoose");
const { ObjectId } = require("mongodb");

const Category = require("../models/categoryModel.js");
const Organization = require("../models/organizationModel.js");

const getCategorys = async (req, res) => {
  const orgId = req.params.orgId;

  try {
    // Perform $lookup stage to join "categories" and "inventories" collections
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
      }
    ]);

    const categoryInformation = categoriesWithInventories.map(category => {
      const numberOfAssets = category.inventoryItems.reduce((total, inventory) => {
        return total + (inventory.quantity || 0); 
      }, 0);

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

    res.json(categoryInformation);
  } catch (err) {
    res.send({ error: err.message });
  }

  // const orgId = req.params.orgId;
  // try {
  //   const category = await Category.find({ orgId });
  //   res.json(category);
  // } catch (err) {
  //   res.send({ error: err.message });
  // }
};

const createCategory = async (req, res) => {
  const { name, identificationType, vendors, customFields, orgId } = req.body;

  try {
    const organization = Organization.findById(new ObjectId(orgId));

    if (!organization) {
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
    res.status(400).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;

    if (!categoryId) {
      throw Error("category Id not provided");
    }

    const category = await Category.findByIdAndDelete(new ObjectId(categoryId));

    if (!category) {
      throw Error(`category with categoryId ${categoryId} doesn't exist`);
    }

    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.body;

    if (!categoryId) {
      throw Error("category Id not provided");
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      new ObjectId(categoryId),
      req.body,
      { new: true } // ensures that the updated document is returned
    );

    if (!updatedCategory) {
      throw Error(`category with categoryId ${categoryId} doesn't exist`);
    }

    // res.status(201).json(`category ${updatecategory.name} (${categoryId}) updated successfully`);
    res.status(201).json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createCategory,
  deleteCategory,
  updateCategory,
  getCategorys,
};
