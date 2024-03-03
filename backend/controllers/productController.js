const { default: mongoose } = require("mongoose");
const { ObjectId } = require("mongodb");

const Product = require("../models/productModel.js");
const Organization = require("../models/organizationModel.js");

const getProducts = async (req, res)=>{
  const orgId = req.params.orgId;
  try{
    const products = await Product.find({orgId});
    res.json(products)
  }catch(err){
    res.send({error : err.message})
  }
}

const createProduct = async (req, res) => {
  const { name, unit, sellingPrice, costPrice, category, orgId} = req.body;

  try {
    
    const organization = Organization.findById(new ObjectId(orgId));

    if (!organization) {
      throw Error(`Organization with orgId: ${orgId} does not exist`);
    }

    const product = new Product({ name, unit, sellingPrice, costPrice,category, orgId });

    await product.save();

    res.status(201).json(product);

  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.name && error.keyPattern.orgId) {
      return res.status(400).json({ message: `Product ${name} already exist` });
    }
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
    
        res.status(201).json(product);
    
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

module.exports = { createProduct, deleteProduct, updateProduct, getProducts };
