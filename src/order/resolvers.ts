import { GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql"
// var fetch = require('node-fetch')
// import { Buffer } from 'buffer';

// const { initiatePayment, } = require("../utils/payments")
import { initiatePayment } from "../utils/payments"

import OrderType, { OrderInputType } from "./type"
import { IsDeletedType } from "../types/sub_types"
import OrderModel from "./model"
import moment from "moment"
import ProductModel from "../product/model"
import AccountModel from "../account/model"



interface ISearchFilters {
    status?: string
    brand?: string
    "products.model"?: string
    madeOn?: { $gte?: number, $lte?: number },
}


// id
// name
// description
// exists
// price
// quantity

// create
export const createOrder = {
    type: OrderType,
    args: {
        ...OrderInputType.getFields()
    },
    async resolve(_context, { products, phone, }, { user, }) {
        console.log("phone ", phone);
        
        if( !user && !phone ) return new Error("401")

        console.log('====================================');
        console.log("phone ", phone);
        console.log('====================================');

        console.log('====================================');
        console.log("user ", user);
        console.log('====================================');

        try {

            let userPhone = phone
            if( !phone ) {
                const userPhoneResult = await AccountModel.findById(user?._id, { phone: true }).lean()
                userPhone = userPhoneResult.phone
            }


            // const productIds = data.products.map((d)=> d.id)
            let orderProductsData = []
            
            for (let index = 0; index < products.length; index++) {
                const { _id, name, year, quantity, model, variant, } = products[index];

                console.log('====================================');
                console.log("this products provided info is ", name, year, quantity,);
                console.log('====================================');

                const product = await ProductModel.findById(_id, { _id: 1, variants: 1, model: 1, }).lean()
                
                console.log('====================================');
                console.log("product ", product);
                console.log('====================================');

                if( !product ) {

                    throw new Error("Not Found")
                }

                const price = product?.variants?.find((v)=> v.name.toLowerCase() == variant.name.toLowerCase())?.price
                if( !price ) {

                    throw new Error("Not Found")
                }

                
                orderProductsData.push({
                    name,
                    year,
                    quantity,
                    id: product?._id,
                    model: product.model,
                    variant,
                    price,
                    exists: true,
                })
            }
            
            console.log('====================================');
            console.log("orderProductsData ", orderProductsData);
            console.log('====================================');


            const totalPrice = orderProductsData.reduce((accumulated, b)=> {

                return accumulated + (b.price * b.quantity)
            }, 0)

            console.log('====================================');
            console.log("totalPrice ", totalPrice);
            console.log('====================================');

            // initiate payment
            await initiatePayment({
                amount: totalPrice / 2,
                phone: user != null ? userPhone : phone
            })

            const newOrder = await new OrderModel({
                products: orderProductsData,
                accountId: user?._id || phone,
                accountType: !user ? "PHONE" : "ACCOUNT",
                status: "PROCESSING",
                totalPrice,
                payment: {
                    phone: userPhone,
                },
            }).save()

            return newOrder.toObject()

        } catch (error) {

            console.log("Error in createProduct ", error)
            // return new Error("Error")

            return  null
        }

    }
}


// update
export const updateOrder = {
    type: OrderType,
    args: {
        id: {
            type: new GraphQLNonNull(GraphQLString),
        },
        status: {
            type: GraphQLString,
        },
        phone: {
            type: GraphQLString,
        },
        deliveryDays: {
            type: GraphQLInt,
        },
        shippingInitiatedOn: {
            type: GraphQLFloat,
        },
    },
    async resolve(_context, data, { user, }) {
        console.log("data ", data);
        

        if( !data?.phone && (!user && ( user && user?.type != 'ADMIN' )) ) return new Error("401")

        try {
            let order

            if( user?.type != 'ADMIN' ) {

                order = await OrderModel.findByIdAndUpdate(data.id, { ...data }).lean()
            }

            if( user ) {

                order = await OrderModel.updateOne({ _id: data.id, accountId: user?._id }, { ...data }).lean()
            }

            if( data.phone ) {
                
                order = await OrderModel.updateOne({ _id: data.id, accountId: data.phone, }, { ...data }).lean()
            }

            return order            
        } catch (error) {
            console.log("Error in updateOrder ", error)
            return new Error("Error") 
        }

    }
}


// update
export const updateOrderStatus = {
    type: OrderType,
    args: {
        id: {
            type: new GraphQLNonNull(GraphQLString),
        },
        phone: {
            type: GraphQLString,
        },
        status: {
            type: new GraphQLNonNull(GraphQLString),
        }
    },
    async resolve(_context, { id, status, phone }, { user, }) {

        if( !phone && !user && ( user && user.type != 'ADMIN' ) ) return new Error("401")

        try {

            let order

            if( user?.type != 'ADMIN' ) {

                order = await OrderModel.findByIdAndUpdate(id, { status, }).lean()
            }

            if( user ) {

                order = await OrderModel.updateOne({ _id: id, accountId: user?._id }, { status, }).lean()
            }

            if( phone ) {
                
                order = await OrderModel.updateOne({ _id: id, accountId: phone, }, { status, }).lean()
            }

            
            return order
        } catch (error) {
            console.log("Error in updateOrderStatus ", error)
            return new Error("Error") 
        }

    }
}


// get
export const getOrderDetails = {
    type: OrderType,
    args: {
        id: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
    async resolve(_context, { id }, { user, }) {

        if( !user ) return new Error("401")


        if( user.type != "ADMIN" ) {

            return await OrderModel.find({ _id: id, accountId: user._id }).lean()
        } else {

            return await OrderModel.find({ _id: id, }).lean()
        }
    }
}


// get
export const getOrders = {
    type: new GraphQLList(OrderType),
    args: {
        offset: {
            type: GraphQLInt,
        },
        limit: {
            type: GraphQLInt,
        },
        from: {
            type: GraphQLString,
        },
        to: {
            type: GraphQLString,
        },
        phone: {
            type: GraphQLString,
        },
        status: {
            type: GraphQLString,
        },
        brand: {
            type: GraphQLString,
        },
        model: {
            type: GraphQLString,
        },
    },
    async resolve(_context, { status, brand, model, from, to, limit = 300, offset = 0, }, { user, }) {

        // if( !user || ( user && user.type != 'ADMIN' ) ) return new Error("401")

        from = from != null ? new Date(from) : moment(new Date()).subtract(10, 'days').toDate()
        to = to != null ? new Date(to) : moment(new Date()).toDate()


        let filters: ISearchFilters = {
            status,
            "products.model": model,
            madeOn: { $gte: from, $lte: to },
        }

        // remore filters that have no values provided
        filters = Object.fromEntries(
            Object.entries(filters).filter((f)=> f[1] != null ||  f[1] != undefined )
        )
        // return await OrderModel.find({
        //         madeOn: { $gte: from, $lte: to },
        //         status,
        //         "products.model": model,
        //     })
        //     .lean()
        //     .sort({ madeOn: -1 })
        //     .skip(offset)
        //     .limit(limit)
        return await OrderModel.find(filters)
                        .lean()
                        .sort({ madeOn: -1 })
                        .skip(offset)
                        .limit(limit)
    }
}


// get
export const getMyOrders = {
    type: new GraphQLList(OrderType),
    args: {
        phone: {
            type: GraphQLString,
        },
    },
    async resolve(_context, { phone }, { user, }) {

        if( !user && !phone ) return new Error("401")

        if( phone ) {

            return await OrderModel.find({ accountId: phone, }).lean()
        } else {

            return await OrderModel.find({ accountId: user._id }).lean()
        }
    }
}


// delete
export const deleteOrder = {
    type: IsDeletedType,
    args: {
        id: {
            type: GraphQLString,
        },
    },
    async resolve(_context, { id }, { user }) {
        
        if( !user || ( user && user.type != 'ADMIN' ) ) return new Error("401")

        // delete
        await OrderModel.findByIdAndDelete(id)

        return { deleted: true }
    }
}

