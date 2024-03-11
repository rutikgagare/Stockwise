const { default: mongoose } = require("mongoose");
const { ObjectId } = require("mongodb");

const Category = require("../models/categoryModel.js");
const Organization = require("../models/organizationModel.js");

const getCategorys = async (req, res)=>{
  const orgId = req.params.orgId;
  try{
    const category = await Category.find({orgId});
    res.json(category)
  }catch(err){
    res.send({error : err.message})
  }
}

const createCategory = async (req, res) => {

  const { name, identificationType, vendors, customFields, orgId} = req.body;

  const v = [];
  for (const vendor of vendors) v.push(new ObjectId(vendor));
  
  try {
    
    const organization = Organization.findById(new ObjectId(orgId));

    if (!organization) {
      throw Error(`Organization with orgId: ${orgId} does not exist`);
    }

    const category = new Category({ name, identificationType, vendors: v, customFields, orgId });

    await category.save();

    res.status(201).json(category);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCategory = async(req, res)=>{

    try {
        const { categoryId } = req.body;

        if(!categoryId){
            throw Error("category Id not provided");
        }
    
        const category = await Category.findByIdAndDelete(new ObjectId(categoryId));

        if(!category){
            throw Error(`category with categoryId ${categoryId} doesn't exist`);
        }
    
        res.status(201).json(category);
    
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
}


const updateCategory = async(req, res)=>{

    try {
        const { categoryId } = req.body;

        if(!categoryId){
            throw Error("category Id not provided");
        }
    
        const updatedCategory = await Category.findByIdAndUpdate(
            new ObjectId(categoryId),
            req.body,
            { new: true } // ensures that the updated document is returned
          );

        if(!updatedCategory){
            throw Error(`category with categoryId ${categoryId} doesn't exist`);
        }

        // res.status(201).json(`category ${updatecategory.name} (${categoryId}) updated successfully`);
        res.status(201).json(updatedCategory);
    
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
}

module.exports = { createCategory, deleteCategory, updateCategory, getCategorys };
