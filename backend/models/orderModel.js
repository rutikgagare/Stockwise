const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    org: {
        type: Object,
        required: true,
    },
    admin: {
        type: Object,
        required: true,
    },
    cart: {
        type: Array,
    },
    status: {
        type: String,
        enum: ["pending", "fulfilled", "rejected", "placed"],
        default: "placed"
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)