import mongoose from 'mongoose'
import validator from 'validator'


const accountSchema = new mongoose.Schema({

    name: {
        type: String,
        unique: true,
        required: true,
        index: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        validate: (mail) => {
            return validator.isEmail(mail)
        },
        index: true,
    },

    phone: {
        type: String,
        required: false
    },
    
    picture: {
        type: String,
        required: false,
    },

    type: {
        type: String,
        enum: [ 'ADMIN', 'USER' ],
        default: 'USER',
    },

    joinedOn: {
        type: Date,
        default: Date.now()
    },

}, {
    collation: { locale: 'en_US', strength: 2 }
})


const AccountModel  = mongoose.model('Account', accountSchema)
export default AccountModel
