import { GraphQLNonNull, GraphQLString } from "graphql"

import admin from "firebase-admin"

import AccountType from "./type"
import AccountModel from "./model"
import { IsDeletedType, IsUpdatedType } from "../types/sub_types"
import { generateAccessToken, generateRefreshtoken } from "../utils/auth"
import OrderModel from "../order/model"



// create account
export const authenticate = {
    type: AccountType,
    args: {
        token: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
    async resolve(_context, { token, }, extra) {

        try {

            // get user data by verifying token
            const result = await admin.auth().verifyIdToken(token)

            console.log("result ", result)


            // check if name or email is used
            let account = await AccountModel.findOne({ email: result.email }).lean()
            
            console.log("account ", account)


            if( !account ) {

                // collect user data
                const accountData = {
                    name: result['name'],
                    email: result.email,
                    phone: result.phone_number,
                    picture: result.picture,
                    type: "USER",
                    joinedOn: Date.now() 
                }
                console.log("accountData ", accountData)
                const newAccount = await new AccountModel(accountData).save()
                account = newAccount.toObject()
            }

            const accessToken = generateAccessToken(account)
            const refreshToken = generateRefreshtoken(account)
    
            extra['res'].cookie('ACCESS_TOKEN', accessToken, { maxAge: 3600 * 24 * 30 * 3, httpOnly: false })
            extra['res'].cookie('REFRESH_TOKEN', refreshToken, { maxAge: 3600 * 24 * 30 * 6, httpOnly: false })
            

            console.log('account ', account)

            return {
                ...account,
                accessToken,
                refreshToken,
            }
            
        } catch (error) {
            console.log("Error in signup ", error)
            return null
        }

    }
}




// update phone number
export const updatePhoneNumber = {
    type: IsUpdatedType,
    args: {
        phone: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
    async resolve(_context, { phone, }, { user, }) {

        if( !user ) return new Error("401")

        try {

            const result = await AccountModel.findByIdAndUpdate(user._id, { phone, }).lean()

            console.log('====================================');
            console.log("result ", result);
            console.log('====================================');

            return { updated: true }
            
        } catch (error) {
            console.log("Error in signup ", error)
            return null
        }

    }
}


// get profile
export const getProfileDetails = {
    type: AccountType,
    args: {
        id: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
    async resolve(_context, { id }) {

        return await AccountModel.findById(id)
    }
}


// delete account
export const deleteProfile = {
    type: IsDeletedType,
    async resolve(_context, _args, { user }) {
        // our user must be authenticated to proceed
        if( !user ) return null

        const account = await AccountModel.findById(user._id)

        if( !account ) return new Error("401")

        // check if user has any orders now
        // 'DELIVERED', 'SHIPPPING', 'READY', 'PROCESSING', 'CANCELLED', 'DENIED'
        const pendingOrders = await OrderModel.find({ status: { $in: [ 'SHIPPPING', 'PROCESSING', 'READY' ] } }, { _id: 1, }).lean()

        if( pendingOrders.length > 0 ) {
            
            return {
                deleted: false,
                message: "You have pending orders."
            }
        }

        // delete user
        await AccountModel.findByIdAndDelete(user._id)

        return { deleted: true }
    }
}
