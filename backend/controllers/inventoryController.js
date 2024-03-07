const { default: mongoose } = require("mongoose");
const { ObjectId } = require("mongodb");

const Category = require("../models/categoryModel.js");
const Inventory = require("../models/inventoryModel.js");

const createItem = async (req, res) => {

  const {categoryId} = req.body;

  try {
    
    const category = Category.findById(new ObjectId(categoryId));

    if (!category) {
      throw Error(`Category with orgId: ${categoryId} does not exist`);
    }

    const item = new Inventory(req.body);
    await item.save();

    console.log("hello")

    res.status(201).json(item);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getItems = async (req, res)=>{
  const orgId = req.params.orgId;
  try{
    const items = await Inventory.find({orgId});
    res.json(items)
  }catch(err){
    res.send({error : err.message})
  }
}

const deleteItem = async(req, res)=>{

  try {
      const {itemId } = req.body;

      if(!itemId){
          throw Error("Item Id not provided");
      }
  
      const item = await Inventory.findByIdAndDelete(new ObjectId(itemId));

      if(!item){
          throw Error(`Item with itemId ${itemId} doesn't exist`);
      }
  
      res.status(201).json(item);
  
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
}

const updateItem = async(req, res)=>{

  try {
      const { _id } = req.body;

      if(!_id){
          throw Error("Item Id not provided");
      }
  
      const updatedItem = await Inventory.findByIdAndUpdate(
          new ObjectId(_id),
          req.body,
          { new: true } // ensures that the updated document is returned
        );

      if(!updatedItem){
          throw Error(`Item with itemId ${_id} doesn't exist`);
      }

      // res.status(201).json(`category ${updatecategory.name} (${categoryId}) updated successfully`);
      res.status(201).json(updatedItem);
  
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
}


module.exports = { createItem, getItems, deleteItem, updateItem};
