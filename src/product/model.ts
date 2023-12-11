import mongoose from 'mongoose'


const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        index: true,
    },

    description: {
        type: String,
    },

    brand: {
        type: String,
        required: true,
    },

    model: {
        type: String,
        required: true,
    },

    years: {
        type: [Number],
        required: true,
    },

    variants: {
        type: [
            {
                image: String,
                name: String,
                price: Number,
                discount: Number,
                discountStartDate: Number,
                discountLastDate: Number,
            }
        ]
    },

    // how many days it may be delivered in
    deliveryDays: {
        type: Number,
    },

}, {
    collation: { locale: 'en_US', strength: 2 }
})

const ProductModel = mongoose.model('Product', productSchema)
export default ProductModel
