"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var userRoutes_1 = __importDefault(require("./regularUser/userRoutes"));
var twItemRoutes_1 = __importDefault(require("./twItem/twItemRoutes"));
var api = express_1.default.Router();
api.use('/regularUser', userRoutes_1.default);
api.use('/twItem', twItemRoutes_1.default);
exports.default = api;
