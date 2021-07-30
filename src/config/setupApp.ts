// Imports
import express, {Express, Router, Request, Response, NextFunction} from 'express'
// import session from 'express-session'
// import { PrismaSessionStore } from '@quixo3/prisma-session-store'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import {json} from 'body-parser'
import { PrismaClient } from '@prisma/client'
import { env } from './env'


// A. Config the new apps routes by connecting the string of the route path to the express router.

  // A1. Create a type called RouteConfig that uses the route path and the express router.
type RouteConfig = { route: string; router: Router}

  // A2. Create a type called AppConfig that stores an array of RouteConfigs
type AppConfig = {
  routeConfigs: RouteConfig[]
}

  // A3. Create a function that takes in the args of an Express app, and the AppConfig from above
const setupExpressRoutes = (app: Express, config: AppConfig) => {

    // For each route (routeConfig) in the config (AppConfig) array, have the Express app.use that route with the base path, and the routes from the express router.
    // ie. app.use('/api', userRoutes)
  config.routeConfigs.forEach((routeConfig)=>{

    // Find the base path inside the service's environment variable
    app.use(`${env.get('BASE_PATH')}${routeConfig.route}`, routeConfig.router)
  })
}


// B. Set up each new app with it's own prisma client.

  // B1. Create a function called setupPrisma that accepts an argument refered to as PrismaClientConstructor with a type of PrismaClient
const setupPrisma = (PrismaClientConstructor: typeof PrismaClient) => {
  try{

    // Create the new Prisma Client and return it
    const prismaClient = new PrismaClientConstructor()

    // Log that you have connected successfully to the database!
    console.log('Successfully connected to database')

    return prismaClient
  } catch (error){
    console.log(`Error ${error}, setupPrisma error`)
  }
}

// C. Set up the Express App!
const setupExpressApp = (config: AppConfig, prisma: typeof PrismaClient) => {

  // Create the app
  const app = express()

  // Use json with express body parser
  app.use(json())

  // Use cors with whatever origin the app has in its env variables
  app.use(cors({
    origin: env.get('CORS_ORIGIN')
  }))

  // app.use(
  //   session({
  //     store: new PrismaSessionStore(prisma, { checkPeriod: parseInt(env.get('SESSION_CLEANUP_INTERVAL'), 10), }),
  //     secret: env.get('SESSION_STORE_SECRET'),
  //     resave: false,
  //     cookie: { maxAge: parseInt(env.get('SESSION_COOKIE_MAX_AGE'), 10)},
  //     saveUninitialized: false,
  //   })
  // )

  // Use cookie parser with express app.
  app.use(cookieParser())

  // app.all('*', (res: Request, res: Response, next: NextFunction)=>{
  //   res.cookies('XSRF_TOKEN', req.csrfToken())
  // })  

  // Call the functino that sets up the express routes, using the app you just created and the config you accepted as an arg in the setupExpressApp function
  setupExpressRoutes(app, config)

  // Create a server by having the app you created and configured listen to a port defined by your service's environment variables. 
  const server = app.listen(env.get('PORT'), () => {

    // Put out a quick console log to let you know if your server started and what port it is listening to.
    console.log(`Server started on port ${env.get('PORT')}`)
  })

  //app.use(errorHandler)
  
  return { app, server }
}

// Initialize the environment by setting up the environment variables of the service
const initializeEnvironment = () => {
  try {
    env.init()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('An error occured during env initialization:', error)
  }
}

// Combine these functions in the setup app function, using the prisma client and app config as args!
export const setupApp = async (  PrismaClientConstructor: typeof PrismaClient,  config: AppConfig ) => {
  
  // Call to intialize the environment variables of the service you are calling this on
  try {
    initializeEnvironment()
  } catch (error) {
    console.log(`Initialize Environment Error, ${error}`)
  }


  // Setup a try catch for setting up the app using the environment intialized above
  try{

    // Setup the prisma client
    const prismaClient = setupPrisma(PrismaClientConstructor)

    // Setup the express app and server and return it
    const {app, server} = setupExpressApp(config, prismaClient)
    return { app, server, prismaClient}

  } catch (error) {
    console.log(`Error ${error}, Error in setupApp`)
  }
}

