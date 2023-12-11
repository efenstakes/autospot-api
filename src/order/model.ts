import mongoose from 'mongoose'


const orderSchema = new mongoose.Schema({

    accountId: {
        type: String,
        required: true,
    },

    accountType: {
        type: String,
        enum: [ "ACCOUNT", "PHONE" ],
        required: true,
    },

    products: {
        // type: [String],
        type: [
            {
                id: String,
                price: Number,
                quantity: Number,
                year: Number,
                name: String,
                model: String,
                brand: String,
                description: String,
                variant: {
                    name: String,
                    price: Number,
                },
                exists: {
                    type: Boolean,
                    required: true,
                }
            }
        ],
        required: true,
    },

    totalPrice: {
        type: Number,
        required: true,
    },

    status: {
        type: String,
        enum: [ 'DELIVERED', 'SHIPPPING', 'READY', 'PROCESSING', 'CANCELLED', 'DENIED' ],
        default: 'PROCESSING',
        required: false
    },

    // how many days it may be delivered in
    deliveryDays: {
        type: Number,
    },

    payment: {
        type: {
            id: String,
            phone: {
                type: String,
                required: true,
            },
            type: {
                type: String,
                enum: [ 'MPESA', 'BANK', ],
                default: 'MPESA',
            },
            amount: Number,
            receiptNumber: String,
            madeOn: Date,
        },
    },

    shippingInitiatedOn: {
        type: {
            year: Number,
            month: Number,
            date: Number,
        }
    },

    // can be customer initiated or admin initiated
    orderType: {
        type: String,
        enum: [ 'CUSTOMER', 'ADMIN' ],
        required: true,
        default: 'CUSTOMER',
    },

    madeOn: {
        type: Date,
        default: Date.now(),
    }

}, {
    collation: { locale: 'en_US', strength: 2 }
})

const OrderModel = mongoose.model('Order', orderSchema)
export default OrderModel
