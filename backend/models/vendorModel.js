const mongoose = require('mongoose')
const Schema = mongoose.Schema

const vendorSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    orgId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Organization",
    },
}, { timestamps: true })

module.exports = mongoose.model('Vendor', vendorSchema)