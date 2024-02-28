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
        required: true,
        unique: true
    },
    address: {
        type: String,
        reqruied: false
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

// Static Create Organization method
organizationSchema.statics.createOrganization = async (orgData) => {
    const user = await this.findOne({ email: orgData.email });

    if (user) {
        throw Error(`Organization with email: ${orgData.email} already exists`);
    }

    if (!validator.isEmail(orgData.email)) {
        throw Error("Email is not valid");
    }

    const org = this.create(orgData);
    return org;
}

module.exports = mongoose.model('Organization', organizationSchema)