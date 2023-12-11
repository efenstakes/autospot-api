import path from "path"
import express, { Express , Response, Request} from "express"
import cors from 'cors'
import * as dotenv from 'dotenv'
import morgan from 'morgan'
import { graphqlHTTP } from "express-graphql"
import serverless from 'serverless-http'
const expressPlayground = require('graphql-playground-middleware-express').default



import admin from "firebase-admin"


import { connectToMongo } from "./utils/db"
import schema from "./schema"


var serviceAccount = require("./firebaseConfig.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})


// authentication
import { authenticateAuthorizationHeaders, authenticateCookies } from "./utils/auth"


// create server
const app: Express = express()


// get env variables
dotenv.config({ path: path.join(__dirname, '.env')})


// connect to db
connectToMongo()

// allow cors
app.use(cors())


// logging
app.use(morgan('dev'))

// run auth middleware
app.use(authenticateAuthorizationHeaders)
app.use(authenticateCookies)


// soutes / endpoints
app.get("/", (_req: Request, res: Response)=> {
    res.json({ apiName: "Autos" })
})


// create graqph endpoint
app.all(
    '/graph',
    graphqlHTTP({
        schema,
        graphiql: true,
    })
)

// create graphql playground endpoint
app.get('/playground', expressPlayground({ endpoint: '/graph', }))


//
const PORT = process.env.PORT


// start api
app.listen(PORT, ()=> {
    console.log(`server listening on port ${PORT}`)
})

module.exports.handler = serverless(app)


