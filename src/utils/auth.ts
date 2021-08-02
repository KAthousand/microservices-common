//imports
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

//import env config
import { env } from '../config/env'

//import types
import { Request, Response, NextFunction } from 'express';

//initialize the environment function to be used in exported functions.
const initializeEnvironment = () => {
  try {
    env.init()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('An error occured during env initialization:', error)
  }
}

//hash user's passwords (when creating user)
export const hashPassword = (pass: string) => {
  const hashedPassword = bcrypt.hash(pass, 10);
  return hashedPassword;
}

//generate a json web token (when creating user)
export const generateToken = (user: object) => {
  // setup the environment get whichever token keys are needed
  try {
    initializeEnvironment()
  } catch (error) {
    console.log(`Initialize Environment Error, ${error}`)
  }

  // get the an access token get from the intialized env variables
  const accessTokenKey = env.get('ACCESS_TOKEN_KEY')

  const accessToken = jwt.sign(user, accessTokenKey as jwt.Secret,
  { expiresIn: '24h' })
  return accessToken
}


//compare bcrypted pass with entered pass
export const comparePass = (pass: string, userPass: string) => {
  return bcrypt.compare(pass, userPass)
}

//authenticate token in header
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  // setup the environment get whichever token keys are needed
  try {
    initializeEnvironment()
  } catch (error) {
    console.log(`Initialize Environment Error, ${error}`)
  }

  // get the an access token get from the intialized env variables
  const accessTokenKey = env.get('ACCESS_TOKEN_KEY')
  
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.status(401).send('Invalid Token')

  jwt.verify(token, accessTokenKey as string, (err, user) => {
    if (err) return res.status(403).send(err.message)
    req.body.user = user
    next()
  })
}
