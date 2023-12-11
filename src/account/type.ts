const {
    GraphQLString,
    GraphQLID,
    GraphQLObjectType,
    GraphQLFloat,
}  = require('graphql')



const AccountType = new GraphQLObjectType({
    name: 'AccountType',
    description: 'Account Type',
    fields: ()=> ({
        _id: {
            type: GraphQLID
        },
        name: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        phone: {
            type: GraphQLString
        },
        picture: {
            type: GraphQLString,
        },
        type: {
            type: GraphQLString,
        },

        joinedOn: {
            type: GraphQLFloat,
        },
    
        refreshToken: {
            type: GraphQLString
        },
        accessToken: {
            type: GraphQLString
        },
   
    })
})

export default AccountType
