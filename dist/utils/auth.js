"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = exports.comparePass = exports.generateToken = exports.hashPassword = void 0;
//imports
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
//import env config
const env_1 = require("../config/env");
//load env to get access keys and refresh keys
const accessTokenKey = env_1.env.get('ACCESS_TOKEN_KEY');
//hash user's passwords (when creating user)
const hashPassword = (pass) => {
    const hashedPassword = bcrypt_1.default.hash(pass, 10);
    return hashedPassword;
};
exports.hashPassword = hashPassword;
//generate a json web token (when creating user)
const generateToken = (user) => {
    const accessToken = jsonwebtoken_1.default.sign(user, accessTokenKey, { expiresIn: '24h' });
    return accessToken;
};
exports.generateToken = generateToken;
//compare bcrypted pass with entered pass
const comparePass = (pass, userPass) => {
    return bcrypt_1.default.compare(pass, userPass);
};
exports.comparePass = comparePass;
//authenticate token in header
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null)
        return res.status(401).send('Invalid Token');
    jsonwebtoken_1.default.verify(token, accessTokenKey, (err, user) => {
        if (err)
            return res.status(403).send(err.message);
        req.body.user = user;
        next();
    });
};
exports.authenticateToken = authenticateToken;
