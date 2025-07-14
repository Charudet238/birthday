"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nextApp = void 0;
const https_1 = require("firebase-functions/v2/https");
// import * as functions from 'firebase-functions';
const next_1 = __importDefault(require("next"));
const dev = process.env.NODE_ENV !== 'production';
const app = (0, next_1.default)({
    dev,
    conf: {
        distDir: '.next',
    },
});
const handle = app.getRequestHandler();
exports.nextApp = (0, https_1.onRequest)({ cors: true }, async (req, res) => {
    await app.prepare();
    return handle(req, res);
});
