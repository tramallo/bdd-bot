"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvVarNotDefinedError = void 0;
class EnvVarNotDefinedError extends Error {
    constructor(message) {
        super();
        this.name = 'EnvVarNotDefinedError';
        this.message = message;
    }
}
exports.EnvVarNotDefinedError = EnvVarNotDefinedError;
