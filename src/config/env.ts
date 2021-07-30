// Imports
import dotenv from 'dotenv'

// Define the env variables we need to spin up the server
export const envVariables = [
  // Security
  'ACCESS_TOKEN_KEY',
  'REFRESH_TOKEN_KEY',
  // Port
  'PORT', 
  // Database
  'DATABASE_URL',
  // Base Path
  'BASE_PATH',
  // CORS Origin
  'CORS_ORIGIN',
  // Session Information
  'SESSION_CLEANUP_INTERVAL',
  'SESSION_STORE_SECRET',
  'SESSION_COOKIE_MAX_AGE'
]

// Create a type for these envVariables to use in a loop function to load all of these in
export type DefaultEnvKey = typeof envVariables[number]

// Create a class for the environment 
export class Environment{

  // Set up a constructor function to be able to be able to reference these env variables
  constructor() {
    this.variables = [...envVariables]
  }
  
  // Set up variables as a key??????
  variables: (DefaultEnvKey)[] = []

  // Define a Map to store the env variables
  envMap = new Map()

  // Declare an initialized variable as false to set as true once the environment is initialized
  initialize = false

  // Create an initialize function to set up the enviroment variables from whatever service environment you are in.
  init () {

    // Load .env
    dotenv.config({path: '../.env'})

    // Loop through each envVariable and set them in the envMap
    this.variables.forEach((key: DefaultEnvKey)=>{
      const envValue = process.env[key]

      // Use an if statement to make sure you have all of the required variables
      if (typeof envValue  === 'undefined'){
        throw Error(`Required environment variable: '${key}', is not set.`)
      } else {
        // set each key and value in the map.
        this.envMap.set(key, envValue)
      }
    })

    // Freeze the map object so it cannot be changed once initialized
    Object.freeze(this.envMap)

    // Set initialized to true to show that the initialized function has been called.
    this.initialize = true
  }

  // Set up a check to make sure the value of a specified key has been initialized
  get(key: DefaultEnvKey){
    if (!this.initialize){
      throw Error(
        "Environment variables haven't been initialized -- Did you forget to call env.init()?"
      )
    }

    // If every specified key has been initialized, return them
    return this.envMap.get(key)
  }
}

// Export the class you have created and defined
export const env = new Environment
