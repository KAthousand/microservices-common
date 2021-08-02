// imports
import { validationResult } from 'express-validator';
import {Request, Response, NextFunction} from 'express'


const simpleValidation = validationResult.withDefaults({
  formatter: err => err.msg
})

export const checkErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = simpleValidation(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.mapped())
  }
  next()
}
