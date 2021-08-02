"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkErrors = void 0;
// imports
const express_validator_1 = require("express-validator");
const simpleValidation = express_validator_1.validationResult.withDefaults({
    formatter: err => err.msg
});
const checkErrors = (req, res, next) => {
    const errors = simpleValidation(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.mapped());
    }
    next();
};
exports.checkErrors = checkErrors;
