import { GraphQLFloat, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql"

import ProductType, { ProductInputType } from "./type"
import ProductModel from "./model"
import { IsDeletedType, IsUpdatedType } from "../types/sub_types"


// create
export const createProduct = {
    type: ProductType,
    args: {
        ...ProductInputType.getFields()
    },
    async resolve(_context, data, { user, }) {

        // if( !user || ( user && user.type != 'ADMIN' ) ) return new Error("401")

        try {
            // check if the product exists and just update it
            const existing = await ProductModel.findOne({ name: data.name, model: data.model, year: data.year, }).lean()

            let newProduct
            if( existing ) {
                console.log('====================================');
                console.log("the product exists ", existing);
                console.log("just going to update product now ");
                console.log('====================================');
                
                newProduct = await ProductModel.findByIdAndUpdate(existing._id, { ...data }).lean()
            } else {
                newProduct = await new ProductModel(data).save()
            }

            return newProduct
            
        } catch (error) {
            console.log("Error in createProduct ", error)
            return new Error("Error") 
        }

    }
}




// update
export const updateProduct = {
    type: ProductType,
    args: {
        ...ProductInputType.getFields()
    },
    async resolve(_context, data, { user, }) {

        if( !user || ( user && user.type != 'ADMIN' ) ) return new Error("401")

        try {
            const product = await ProductModel.findByIdAndUpdate(data._id, { ...data }).lean()

            return product            
        } catch (error) {
            console.log("Error in createProduct ", error)
            return new Error("Error") 
        }

    }
}


// update discount info for a category
export const updateProductBrandDiscount = {
    type: IsUpdatedType,
    args: {
        brand: {
            type: new GraphQLNonNull(GraphQLString),
        },
        discount: {
            type: new GraphQLNonNull(GraphQLFloat),
        },
        discountStartDate: {
            type: GraphQLFloat,
        },
        discountEndDate: {
            type: GraphQLFloat,
        },
    },
    async resolve(_context, { brand, discount, discountStartDate, discountEndDate, }, { user, }) {

        if( !user || ( user && user.type != 'ADMIN' ) ) return new Error("401")

        try {
            const result = await ProductModel.updateMany({ brand, }, { discount, discountStartDate, discountEndDate, }).lean()

            console.log('====================================');
            console.log("result ", result);
            console.log('====================================');

            return { updated: true }            
        } catch (error) {
            console.log("Error in createProduct ", error)
            return new Error("Error") 
        }

    }
}

// update discount info for a category
export const updateProductCategoryDiscount = {
    type: IsUpdatedType,
    args: {
        category: {
            type: new GraphQLNonNull(GraphQLString),
        },
        discount: {
            type: new GraphQLNonNull(GraphQLFloat),
        },
        discountStartDate: {
            type: GraphQLFloat,
        },
        discountEndDate: {
            type: GraphQLFloat,
        },
    },
    async resolve(_context, { category, discount, discountStartDate, discountEndDate, }, { user, }) {

        if( !user || ( user && user.type != 'ADMIN' ) ) return new Error("401")

        try {
            const result = await ProductModel.updateMany({ category }, { discount, discountStartDate, discountEndDate, }).lean()

            console.log('====================================');
            console.log("result ", result);
            console.log('====================================');

            return { updated: true }            
        } catch (error) {
            console.log("Error in createProduct ", error)
            return new Error("Error") 
        }

    }
}


// update discount info
export const updateProductDiscount = {
    type: ProductType,
    args: {
        id: {
            type: new GraphQLNonNull(GraphQLFloat),
        },
        discount: {
            type: new GraphQLNonNull(GraphQLFloat),
        },
        discountStartDate: {
            type: GraphQLFloat,
        },
        discountEndDate: {
            type: GraphQLFloat,
        },
    },
    async resolve(_context, { id, discount, discountStartDate, discountEndDate, }, { user, }) {

        if( !user || ( user && user.type != 'ADMIN' ) ) return new Error("401")

        try {
            const product = await ProductModel.findByIdAndUpdate(id, { discount, discountStartDate, discountEndDate, }).lean()

            return product            
        } catch (error) {
            console.log("Error in createProduct ", error)
            return new Error("Error") 
        }

    }
}


// get
export const getProduct = {
    type: ProductType,
    args: {
        id: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
    async resolve(_context, { id }) {

        return await ProductModel.findById(id).lean()
    }
}



// get
export const getProducts = {
    type: new GraphQLList(ProductType),
    args: {
        year: {
            type: GraphQLInt,
        },
        name: {
            type: GraphQLString,
        },
        brand: {
            type: GraphQLString,
        },
        model: {
            type: GraphQLString,
        },
        skip: {
            type: GraphQLInt,
        },
        limit: {
            type: GraphQLInt,
        },
    },
    async resolve(_context, { year, brand, model, name, skip = 0, limit = 40, }) {

        let filters = {}

        if( year ) {

            filters = { years: { $in: year } }
        }

        if( name ) {

            filters = { ...filters, name, }
        }
        if( brand ) {

            filters = { ...filters, brand, }
        }
        if( model ) {

            filters = { ...filters, model, }
        }


        // if( name && model ) {
        //     return await ProductModel.find({ model, name, }).lean().skip(0).limit(100)
        // }

        // if( year && brand ) {
        //     return await ProductModel.find({ years: { $in: year }, brand, }).lean().skip(0).limit(100)
        // }

        // if( year ) {
        //     return await ProductModel.find({ years: { $in: year }, }).lean().skip(0).limit(100)
        // }

        // if( brand ) {
        //     return await ProductModel.find({ brand, }).lean().skip(0).limit(100)
        // }

        return await ProductModel.find(filters).lean().skip(skip).limit(limit)
    }
}


// delete account
export const deleteProduct = {
    type: IsDeletedType,
    args: {
        id: {
            type: GraphQLString,
        },
    },
    async resolve(_context, { id }, { user }) {
        
        if( !user || ( user && user.type != 'ADMIN' ) ) return new Error("401")

        // delete
        await ProductModel.findByIdAndDelete(id)

        return { deleted: true }
    }
}
