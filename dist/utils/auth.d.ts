import { Request, Response, NextFunction } from 'express';
export declare const hashPassword: (pass: string) => Promise<string>;
export declare const generateToken: (user: object) => string;
export declare const comparePass: (pass: string, userPass: string) => Promise<boolean>;
export declare const authenticateToken: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
