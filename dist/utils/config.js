"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envVarNotDefined_error_1 = require("./errors/envVarNotDefined.error");
const botToken = () => {
    const token = process.env.BOT_TOKEN;
    if (!token) {
        throw new envVarNotDefined_error_1.EnvVarNotDefinedError('Environment variable BOT_TOKEN is undefined.');
    }
    return token;
};
exports.default = { botToken };
