const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const User = require("./userModel")
const Schema = mongoose.Schema

const organizationSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    address: {
        type: String,
    },
    admins: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    employees: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
}, { timestamps: true })

module.exports = mongoose.model('Organization', organizationSchema)