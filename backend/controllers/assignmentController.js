const { default: mongoose } = require("mongoose");
const { ObjectId } = require("mongodb");
const User = require('../models/userModel.js');
const Inventory = require('../models/inventoryModel.js');
const Assignment = require('../models/assignmentModel.js');

const assignUser = async (req, res) =>{

    console.log("assign user req.body:", req.body);
    const {userId, itemId, quantity} = req.body;
    
    try{
        const user = await User.findById(new ObjectId(userId));
    
        if(!user){
            throw Error(`User with userId: ${userId} does not exist`);
        }

        const item = await Inventory.findById(new ObjectId(itemId));

        if(!item){
            throw Error(`Item with itemId: ${itemId} does not exist`);
        }

        if(item.quantity < quantity){
            throw Error(`Enough qunatity not available in inventory`);
        }

        const assignment = new Assignment(req.body);
        await assignment.save()

        res.status(200).send(assignment);

    }catch (error) {
        res.status(400).json({ message: error.message });
    }

}

module.exports = {assignUser}