import { GraphQLBoolean, GraphQLFloat, GraphQLID, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql"
import { PaymentInputType, PaymentType } from "./payment"
import { DateSlotsInputType, DateSlotsType } from "../types/sub_types"


export const OrderItemVariantType = new GraphQLObjectType({
    name: 'OrderItemVariantType',
    description: 'Order Item Variant Type',
    fields: ()=> ({

        price: {
            type: GraphQLFloat
        },

        name: {
            type: new GraphQLNonNull(GraphQLString)
        },

    })
})
const OrderItemType = new GraphQLObjectType({
    name: 'OrderItemType',
    description: 'Order Item Type',
    fields: ()=> ({

        _id: {
            type: GraphQLString
        },
        
        year: {
            type: GraphQLInt,
        },
        
        name: {
            type: GraphQLString
        },

        model: {
            type: GraphQLString
        },

        brand: {
            type: GraphQLString,
        },

        phone: {
            type: new GraphQLNonNull(GraphQLString),
        },

        description: {
            type: GraphQLString
        },

        exists: {
            type: GraphQLBoolean,
        },
        
        price: {
            type: GraphQLFloat
        },

        variation: {
            type: new GraphQLNonNull(OrderItemVariantType)
        },

        quantity: {
            type: GraphQLInt,
        },

    })
})


export const OrderItemVariantInputType = new GraphQLInputObjectType({
    name: 'OrderItemVariantInputType',
    description: 'Order Item Variant Input Type',
    fields: ()=> ({

        price: {
            type: GraphQLFloat
        },

        name: {
            type: new GraphQLNonNull(GraphQLString)
        },

    })
})
const OrderItemInputType = new GraphQLInputObjectType({
    name: 'OrderItemInputType',
    description: 'Order Item Input Type',
    fields: ()=> ({

        _id: {
            type: new GraphQLNonNull(GraphQLString)
        },

        year: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        
        model: {
            type: new GraphQLNonNull(GraphQLString)
        },

        brand: {
            type: new GraphQLNonNull(GraphQLString)
        },

        description: {
            type: GraphQLString
        },

        exists: {
            type: GraphQLBoolean,
        },
        
        price: {
            type: GraphQLFloat
        },

        variant: {
            type: new GraphQLNonNull(OrderItemVariantInputType)
        },

        quantity: {
            type: GraphQLInt,
        },

    })
})


const OrderType = new GraphQLObjectType({
    name: 'OrderType',
    description: 'OrderType Type',
    fields: ()=> ({

        _id: {
            type: GraphQLID
        },

        accountId: {
            type: GraphQLString
        },

        accountType: {
            type: GraphQLString
        },

        products: {
            type: new GraphQLList(OrderItemType),
        },

        totalPrice: {
            type: GraphQLFloat,
        },

        status: {
            type: GraphQLString,
        },

        shippingInitiatedOn: {
            type: DateSlotsType,
        },

        deliveryDays: {
            type: GraphQLInt,
        },

        payment: {
            type: PaymentType,
        },

        orderType: {
            type: GraphQLString,
        },

        madeOn: {
            type: GraphQLFloat,
        },

    })
})


export const OrderInputType = new GraphQLInputObjectType({
    name: 'OrderInputType',
    description: 'OrderInput Type',
    fields: ()=> ({

        phone: {
            type: GraphQLString
        },

        products: {
            type: new GraphQLNonNull(new GraphQLList(OrderItemInputType)),
        },

    })
})

export default OrderType
