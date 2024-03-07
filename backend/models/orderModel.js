const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orderSchema = new Schema({
    orgId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Organization",
    },
    adminId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
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