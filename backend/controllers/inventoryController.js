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

const itemSearch = async (req, res) => {
  const orgId = req.params.orgId;
  const { searchText } = req.body;

  try {
    const items = await Inventory.aggregate([
      {
        $search: {
          text: {
            query: searchText,
            path: 'name',
            fuzzy: {
              // maxEdits: 2 ,
              prefixLength: 3,
            }
          }
        }
      },
      {
        $match: {
          "orgId": new ObjectId(orgId)
        }
      }
    ]);

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

      if (item?.assignedTo && item?.assignedTo.length > 0) {
        throw Error(`Item already assigned, cannot reassign`);
      }

      const lifecycleEvent = {
        userId: assignedTo.userId,
        userName: assignedTo.userName,
        checkoutDate: new Date(),
      };


      updatedItem = await Inventory.findByIdAndUpdate(
        new ObjectId(itemId),
        { $push: { assignedTo: assignedTo, lifecycle: lifecycleEvent}, status: "deployed"},
        { new: true }
      );
    }

    if (item.identificationType === "non-unique") {
      if (item.quantity - item.checkedOutQuantity < assignedTo.quantity) {
        throw Error(`Not enough quantity available in inventory`);
      }

      const userId = new ObjectId(assignedTo.userId);

      const existingAssignment = item.assignedTo.find((assignment) =>
        assignment.userId.equals(userId)
      );

      if (existingAssignment) {
        const updatedAssignedTo = item.assignedTo.map((assignment) => {
          if (assignment.userId.equals(userId)) {
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
          {
            $set: {
              assignedTo: updatedAssignedTo,
              status: "deployed",
              checkedOutQuantity:
                item.checkedOutQuantity + parseInt(assignedTo.quantity),
            },
          },
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
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const checkinItem = async (req, res) => {
  const { itemId, quantity } = req.body;

  try {
    const item = await Inventory.findById(new ObjectId(itemId));

    if (!item) {
      throw Error(`Item with itemId: ${itemId} does not exist`);
    }

    let updatedItem;

    if (item?.identificationType === "unique") {
      if (
        !item?.assignedTo ||
        (item?.assignedTo && item?.assignedTo.length === 0)
      ) {
        throw Error(`Item is not assigned you can't checkin`);
      }

      const updatedLifecycle = item.lifecycle;
      updatedLifecycle[updatedLifecycle.length - 1].checkinDate = new Date();;
  
      updatedItem = await Inventory.findByIdAndUpdate(
        new ObjectId(itemId),
        { $pop:{ assignedTo : -1}, status: "ready to deploy", lifecycle: updatedLifecycle},
        { new: true }
      );
    }

    if (item.identificationType === "non-unique") {
      const userId = new ObjectId(req.body.userId);

      const existingAssignment = item.assignedTo.find((assignment) =>
        assignment.userId.equals(userId)
      );

      if (existingAssignment) {
        const existingQuantity = existingAssignment.quantity;

        if (existingQuantity < parseInt(quantity)) {
          throw Error(
            `User has not checked out ${assignedQuantity} quantity of this item`
          );
        }

        if (existingAssignment) {
          const updatedAssignedTo = item.assignedTo
            .map((assignment) => {
              if (assignment.userId.equals(userId)) {
                const newQuantity = assignment.quantity - parseInt(quantity);
                return {
                  userId: assignment.userId,
                  userName: assignment.userName,
                  quantity: newQuantity <= 0 ? null : newQuantity,
                };
              }
              return assignment;
            })
            .filter((assignment) => assignment && assignment.quantity !== null);

          const newCheckedOutQuantity =
            item.checkedOutQuantity - parseInt(quantity);

          updatedItem = await Inventory.findByIdAndUpdate(
            new ObjectId(itemId),
            {
              $set: {
                assignedTo: updatedAssignedTo,
                checkedOutQuantity: newCheckedOutQuantity,
              },
            },
            { new: true }
          );
        } else {
          throw Error(
            `User ${assignedTo.userName} has not checked out this item`
          );
        }
      }
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    console.log(error);
  }
};

const getUserAssets = async (req, res) => {
  const userId = new ObjectId(req.user._id);

  try {
    const userAssets = await Inventory.aggregate([
      { $match: { "assignedTo.userId": userId } },
      { $unwind: "$assignedTo" },
      { $match: { "assignedTo.userId": userId } },

      {
        $project: {
          _id: 1,
          name: 1,
          itemImage: 1,
          serialNumber: 1,
          customFieldsData:1,
          quantity: "$assignedTo.quantity",
        },
      },
    ]);

    res.json(userAssets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  updateItem,
  checkoutItem,
  checkinItem,
  getUserAssets,
  itemSearch
};
