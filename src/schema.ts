import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { getProfileDetails, deleteProfile, authenticate, updatePhoneNumber, } from "./account/resolvers";
import { getOrderDetails, createOrder, updateOrder, updateOrderStatus, deleteOrder, getMyOrders, getOrders } from "./order/resolvers";
import { createProduct, updateProduct, getProduct, deleteProduct, getProducts } from "./product/resolvers";


const query = new GraphQLObjectType({
    name: "Query",
    description: "API Query",
    fields: ({

        getProfileDetails,

        getProducts,
        getProduct,

        getOrderDetails,
        getOrders,
        getMyOrders,

    })
})



const mutation = new GraphQLObjectType({
    name: "Mutation",
    description: "API mutation",
    fields: ({

        authenticate,
        updatePhoneNumber,
        deleteProfile,

        createOrder,
        updateOrder,
        updateOrderStatus,
        deleteOrder,

        createProduct,
        updateProduct,
        deleteProduct,
        
    })
})


export default new GraphQLSchema({
    query, mutation,
})

