const { default: mongoose } = require("mongoose");
const { ObjectId } = require("mongodb");

const Category = require("../models/categoryModel.js");
const Organization = require("../models/organizationModel.js");
const Inventory = require("../models/inventoryModel.js");

const createItem = async (req, res) => {
  const { categoryId } = req.body;
  const userId = new ObjectId(req.user._id);

  try {
    const category = await Category.findById(new ObjectId(categoryId));
    if (!category) {
      throw Error(`Category with orgId: ${categoryId} does not exist`);
    }
    const organization = await Organization.findOne({
      $or: [{ employees: userId }, { admins: userId }],
    });

    const orgId = organization ? organization._id : null;
    req.body.orgId = new ObjectId(orgId);

    const item = new Inventory(req.body);
    await item.save();

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createMultipleItem = async (req, res) => {
  const { itemDetails, serialNumbers } = req.body;
  const userId = new ObjectId(req.user._id);

  try {
    const category = await Category.findById(new ObjectId(itemDetails.categoryId));
    if (!category) {
      throw Error(`Category with orgId: ${itemDetails.categoryId} does not exist`);
    }

    const organization = await Organization.findOne({
      $or: [{ employees: userId }, { admins: userId }],
    });

    const orgId = organization ? organization._id : null;
    req.body.orgId = new ObjectId(orgId);
    itemDetails.orgId = orgId;

    const existingInventory = await Inventory.find({
      categoryId: itemDetails.categoryId,
      serialNumber: { $in: serialNumbers }
    });

    if (existingInventory.length > 0) {
      throw Error(`Duplicate serial numbers found in the inventory for the same category`);
    }

    const items = [];

    for (const serialNumber of serialNumbers) {
      const item = new Inventory({ ...itemDetails, serialNumber });
      await item.save();
      items.push(item);
    }

    res.status(201).json(items);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getItems = async (req, res) => {
  const userId = new ObjectId(req.user._id);
  try {
  
    const organization = await Organization.findOne({
      $or: [{ employees: userId }, { admins: userId }],
    });
    const orgId = organization ? organization._id : null;
    const items = await Inventory.find({orgId});

    res.status(201).json(items);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getItem = async (req, res) =>{
  const itemId = req.params.itemId;
  try {
    const item = await Inventory.findById(new ObjectId(itemId));
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const itemSearch = async (req, res) => {
  const userId = new ObjectId(req.user._id);
  try {
    const organization = await Organization.findOne({
      $or: [{ employees: userId }, { admins: userId }],
    });
    const orgId = organization ? organization._id : null;  const { searchText } = req.body;

    const items = await Inventory.aggregate([
      {
        $search: {
          text: {
            query: searchText,
            path: ['name', 'serialNumber'], 
          },
        },
      },
      {
        $match: {
          orgId: new mongoose.Types.ObjectId(orgId),
        },
      },
    ]);
    res.status(201).json(items);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;

    if (!itemId) {
      throw Error("Item Id not provided");
    }

    const item = await Inventory.findByIdAndDelete(new ObjectId(itemId));

    if (!item) {
      throw Error(`Item with itemId ${itemId} doesn't exist`);
    }

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      throw Error("Item Id not provided");
    }

    const userId = new ObjectId(req.user._id);
    const organization = await Organization.findOne({
      $or: [{ employees: userId }, { admins: userId }],
    });
    const orgId = organization ? organization._id : null;
    req.body.orgId = new ObjectId(orgId);

    const updatedItem = await Inventory.findByIdAndUpdate(
      new ObjectId(itemId),
      req.body,
      { new: true } // ensures that the updated document is returned
    );

    if (!updatedItem) {
      throw Error(`Item with itemId ${_id} doesn't exist`);
    }

    res.status(201).json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
        {
          $push: { assignedTo: assignedTo, lifecycle: lifecycleEvent },
          status: "deployed",
        },
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
    res.status(201).json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
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
      updatedLifecycle[updatedLifecycle.length - 1].checkinDate = new Date();

      updatedItem = await Inventory.findByIdAndUpdate(
        new ObjectId(itemId),
        {
          $pop: { assignedTo: -1 },
          status: "ready to deploy",
          lifecycle: updatedLifecycle,
        },
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
    res.status(201).json(updatedItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserAssets = async (req, res) => {

  const userId = new ObjectId(req.user?._id);

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
          customFieldsData: 1,
          quantity: "$assignedTo.quantity",
        },
      },
    ]);

    res.status(201).json(userAssets);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createItem,
  getItems,
  getItem,
  deleteItem,
  updateItem,
  checkoutItem,
  checkinItem,
  getUserAssets,
  itemSearch,
  createMultipleItem,
};
