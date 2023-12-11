import { GraphQLFloat, GraphQLInputObjectType, GraphQLObjectType, GraphQLString } from "graphql";



export const PaymentType = new GraphQLObjectType({
    name: 'PaymentType',
    description: 'PaymentType Type',
    fields: ()=> ({

        id: {
            type: GraphQLString
        },

        type: {
            type: GraphQLString
        },
        
        amount: {
            type: GraphQLFloat
        },

        receiptNumber: {
            type: GraphQLString
        },

        madeOn: {
            type: GraphQLFloat,
        },

    })
})


export const PaymentInputType = new GraphQLInputObjectType({
    name: 'PaymentInputType',
    description: 'PaymentInputType Type',
    fields: ()=> ({

        id: {
            type: GraphQLString
        },

        type: {
            type: GraphQLString
        },

        madeOn: {
            type: GraphQLFloat,
        },

    })
})
