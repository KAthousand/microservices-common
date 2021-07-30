"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.Environment = exports.envVariables = void 0;
// Imports
const dotenv_1 = __importDefault(require("dotenv"));
// Define the env variables we need to spin up the server
exports.envVariables = [
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
];
// Create a class for the environment 
class Environment {
    // Set up a constructor function to be able to be able to reference these env variables
    constructor() {
        // Set up variables as a key??????
        this.variables = [];
        // Define a Map to store the env variables
        this.envMap = new Map();
        // Declare an initialized variable as false to set as true once the environment is initialized
        this.initialize = false;
        this.variables = [...exports.envVariables];
    }
    // Create an initialize function to set up the enviroment variables from whatever service environment you are in.
    init() {
        // Load .env
        dotenv_1.default.config({ path: '../.env' });
        // Loop through each envVariable and set them in the envMap
        this.variables.forEach((key) => {
            const envValue = process.env[key];
            // Use an if statement to make sure you have all of the required variables
            if (typeof envValue === 'undefined') {
                throw Error(`Required environment variable: '${key}', is not set.`);
            }
            else {
                // set each key and value in the map.
                this.envMap.set(key, envValue);
            }
        });
        // Freeze the map object so it cannot be changed once initialized
        Object.freeze(this.envMap);
        // Set initialized to true to show that the initialized function has been called.
        this.initialize = true;
    }
    // Set up a check to make sure the value of a specified key has been initialized
    get(key) {
        if (!this.initialize) {
            throw Error("Environment variables haven't been initialized -- Did you forget to call env.init()?");
        }
        // If every specified key has been initialized, return them
        return this.envMap.get(key);
    }
}
exports.Environment = Environment;
// Export the class you have created and defined
exports.env = new Environment;
