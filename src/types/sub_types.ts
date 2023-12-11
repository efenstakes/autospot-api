import { GraphQLBoolean, GraphQLID, GraphQLInputObjectType, GraphQLInt, GraphQLObjectType, GraphQLString } from "graphql"


export const UsedType = new GraphQLObjectType({
    name: 'UsedType',
    fields: ()=> ({
        used: {
            type: GraphQLBoolean,
        }
    })
})


export const IsUpdatedType = new GraphQLObjectType({
    name: 'IsUpdatedType',
    fields: ()=> ({
        updated: {
            type: GraphQLBoolean,
        }
    })
})


export const IsDeletedType = new GraphQLObjectType({
    name: 'IsDeletedType',
    fields: ()=> ({
        deleted: {
            type: GraphQLBoolean,
        },
        message: {
            type: GraphQLString,
        },
    })
})


export const IsSavedType = new GraphQLObjectType({
    name: 'IsSavedType',
    fields: ()=> ({
        saved: {
            type: GraphQLBoolean,
        },
        _id: {
            type: GraphQLID,
        },
    })
})


export const IsSuccessfulType = new GraphQLObjectType({
    name: 'IsSuccessfulType',
    fields: ()=> ({
        successful: {
            type: GraphQLBoolean,
        },
        _id: {
            type: GraphQLID,
        },
    })
})


export const DateSlotsType = new GraphQLObjectType({
    name: 'DateSlotsType',
    fields: ()=> ({

        year: {
            type: GraphQLInt,
        },

        month: {
            type: GraphQLInt,
        },

        date: {
            type: GraphQLInt,
        },
        
    })
})


export const DateSlotsInputType = new GraphQLInputObjectType({
    name: 'DateSlotsInputType',
    fields: ()=> ({

        year: {
            type: GraphQLInt,
        },

        month: {
            type: GraphQLInt,
        },

        date: {
            type: GraphQLInt,
        },
        
    })
})
