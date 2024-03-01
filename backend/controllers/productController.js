const { default: mongoose } = require("mongoose");
const { ObjectId } = require("mongodb");

const Product = require("../models/productModel.js");
const Organization = require("../models/organizationModel.js");

const createProduct = async (req, res) => {
  try {

    const { name, unit, sellingPrice, costPrice, orgId} = req.body;

    if(!name || !unit || !sellingPrice || !costPrice || !orgId){
        throw Error("All field must be field");
    }

    const organization = Organization.findById(new ObjectId(orgId));

    if (!organization) {
      throw Error(`Organization with orgId: ${orgId} does not exist`);
    }

    const product = new Product({ name, unit, sellingPrice, costPrice, orgId });
    await product.save();

    res.status(201).json(product);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteProduct = async(req, res)=>{

    try {
        const { productId } = req.body;

        if(!productId){
            throw Error("Product Id not provided");
        }
    
        const product = await Product.findByIdAndDelete(new ObjectId(productId));

        if(!product){
            throw Error(`Product with productId ${productId} doesn't exist`);
        }
    
        res.status(201).json(`Product ${product.name} (${productId}) deleted successfully`);
    
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
}


const updateProduct = async(req, res)=>{

    try {
        const { productId } = req.body;

        if(!productId){
            throw Error("Product Id not provided");
        }
    
        const updatedProduct = await  Product.findByIdAndUpdate(
            new ObjectId(productId),
            req.body,
            { new: true } // nsures that the updated document is returned
          );

        if(!updatedProduct){
            throw Error(`Product with productId ${productId} doesn't exist`);
        }

        // res.status(201).json(`Product ${updateProduct.name} (${productId}) updated successfully`);
        res.status(201).json(updatedProduct);
    
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
}

module.exports = { createProduct, deleteProduct, updateProduct };
