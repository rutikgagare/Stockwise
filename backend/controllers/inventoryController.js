const { default: mongoose } = require("mongoose");
const { ObjectId } = require("mongodb");

const Category = require("../models/categoryModel.js");
const Inventory = require("../models/inventoryModel.js");

const createItem = async (req, res) => {
  const { categoryId } = req.body;

  try {
    const category = Category.findById(new ObjectId(categoryId));

    if (!category) {
      throw Error(`Category with orgId: ${categoryId} does not exist`);
    }

    const item = new Inventory(req.body);
    await item.save();

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getItems = async (req, res) => {
  const orgId = req.params.orgId;
  try {
    const items = await Inventory.find({ orgId });
    res.json(items);
  } catch (err) {
    res.send({ error: err.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      throw Error("Item Id not provided");
    }

    const item = await Inventory.findByIdAndDelete(new ObjectId(itemId));

    if (!item) {
      throw Error(`Item with itemId ${itemId} doesn't exist`);
    }

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      throw Error("Item Id not provided");
    }

    const updatedItem = await Inventory.findByIdAndUpdate(
      new ObjectId(itemId),
      req.body,
      { new: true } // ensures that the updated document is returned
    );

    if (!updatedItem) {
      throw Error(`Item with itemId ${_id} doesn't exist`);
    }

    // res.status(201).json(`category ${updatecategory.name} (${categoryId}) updated successfully`);
    res.status(201).json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const checkoutItem = async (req, res) => {
  const { itemId, assignedTo } = req.body;

  try {
    const item = await Inventory.findById(new ObjectId(itemId));

    if (!item) {
      throw Error(`Item with itemId: ${itemId} does not exist`);
    }

    let updatedItem;
    if (item?.identificationType === "unique") {
      if (item.assignedTo.length > 0) {
        throw Error(`Item already assigned, cannot reassign`);
      }

      if (item.assignedTo) {
        updatedItem = await Inventory.findByIdAndUpdate(
          new ObjectId(itemId),
          { $push: { assignedTo: assignedTo }, status: "deployed" },
          { new: true }
        );

      } else {
        updatedItem = await Inventory.findByIdAndUpdate(
          new ObjectId(itemId),
          { assignedTo: [assignedTo], status: "deployed" },
          { new: true }
        );
      }
    }

    if (item.identificationType === "non-unique") {
      if (item.quantity - item.checkedOutQuantity < assignedTo.quantity) {
        throw Error(`Not enough quantity available in inventory`);
      }

      if (item.assignedTo) {

        const userId = new ObjectId(assignedTo.userId);

        const existingAssignment = item.assignedTo.find((assignment) =>
          assignment.userId.equals(userId)
        );

        if (existingAssignment) {

          const updatedAssignedTo = item.assignedTo.map((assignment) => {

            if (assignment.userId.equals(userId)){
              return {
                userId: assignment.userId,
                userName: assignment.userName,
                quantity: assignment.quantity + parseInt(assignedTo.quantity),
              };
            }
            return assignment;
          });

          updatedItem = await Inventory.findByIdAndUpdate(
            new ObjectId(itemId),
            {$set : {
              assignedTo: updatedAssignedTo,
              status: "deployed",
              checkedOutQuantity:
                item.checkedOutQuantity + parseInt(assignedTo.quantity),
            }},
            { new: true }
          );
        } else {
          updatedItem = await Inventory.findByIdAndUpdate(
            new ObjectId(itemId),
            {
              $push: { assignedTo: assignedTo },
              status: "deployed",
              checkedOutQuantity:
                item.checkedOutQuantity + parseInt(assignedTo.quantity),
            },
            { new: true }
          );
        }
      } else {
        updatedItem = await Inventory.findByIdAndUpdate(
          new ObjectId(itemId),
          {
            assignedTo: [assignedTo],
            status: "deployed",
            checkedOutQuantity:
              item.checkedOutQuantity + parseInt(assignedTo.quantity),
          },
          { new: true }
        );
      }
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createItem, getItems, deleteItem, updateItem, checkoutItem };
