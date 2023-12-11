import { GraphQLFloat, GraphQLID, GraphQLInputObjectType, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql"


const ProductTypeVariant = new GraphQLObjectType({
    name: 'ProductTypeVariant',
    description: 'ProductTypeVariant Type',
    fields: ()=> ({

        image: {
            type: GraphQLString,
        },

        name: {
            type: GraphQLString,
        },

        price: {
            type: GraphQLFloat,
        },
        
        discount: {
            type: GraphQLFloat,
        },
        
        discountStartDate: {
            type: GraphQLFloat,
            defaultValue: 0,
        },
        
        discountEndDate: {
            type: GraphQLFloat,
            defaultValue: 0,
        },

    }),
})


const ProductType = new GraphQLObjectType({
    name: 'ProductType',
    description: 'ProductType Type',
    fields: ()=> ({
        
        _id: {
            type: GraphQLID
        },
        
        name: {
            type: GraphQLString
        },

        description: {
            type: GraphQLString
        },

        brand: {
            type: new GraphQLNonNull(GraphQLString),
        },

        model: {
            type: new GraphQLNonNull(GraphQLString),
        },

        years: {
            type: new GraphQLList(GraphQLInt),
        },

        variants: {
            type: new GraphQLList(ProductTypeVariant)
        },

        deliveryDays: {
            type: GraphQLInt,
        },

    })
})



const ProductInputTypeVariant = new GraphQLInputObjectType({
    name: 'ProductInputTypeVariant',
    description: 'ProductInputTypeVariant Type',
    fields: ()=> ({

        image: {
            type: GraphQLString,
        },

        name: {
            type: GraphQLString,
        },

        price: {
            type: GraphQLFloat,
        },
        
        discount: {
            type: GraphQLFloat,
        },
        
        discountStartDate: {
            type: GraphQLFloat,
            defaultValue: 0,
        },
        
        discountEndDate: {
            type: GraphQLFloat,
            defaultValue: 0,
        },

    }),
})
export const ProductInputType = new GraphQLInputObjectType({
    name: 'ProductInputType',
    description: 'ProductInput Type',
    fields: ()=> ({
        
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },

        description: {
            type: GraphQLString
        },

        brand: {
            type: new GraphQLNonNull(GraphQLString),
        },

        model: {
            type: new GraphQLNonNull(GraphQLString),
        },

        years: {
            type: new GraphQLList(GraphQLInt),
        },

        variants: {
            type: new GraphQLList(ProductInputTypeVariant),
        },

        deliveryDays: {
            type: new GraphQLNonNull(GraphQLInt),
        },

    })
})

export default ProductType
