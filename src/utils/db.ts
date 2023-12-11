import mongoose from 'mongoose'


// set mongoose promise
mongoose.Promise = Promise


mongoose.connection.on('connection', (_)=> {
    console.log('connected to db')
})


// log error
mongoose.connection.on('error', (_)=> {
    console.log('connected to db')
})


// debug
mongoose.set('debug', true)


export const connectToMongo = async() => {
    try {
        await mongoose.connect(process.env.DATABASE_URL, { autoIndex: false, })
        console.log('connected to mongodb')
    } catch (e) {
        console.log('error connecting ', e)
    }
}
