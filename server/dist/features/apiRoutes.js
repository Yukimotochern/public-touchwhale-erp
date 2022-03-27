"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const twItemRoutes_1 = __importDefault(require("./twItem/twItemRoutes"));
const userRoutes_1 = __importDefault(require("./user/userRoutes"));
const roleRoutes_1 = __importDefault(require("./role/roleRoutes"));
const api = express_1.default.Router();
api.use('/twItem', twItemRoutes_1.default);
api.use('/user', userRoutes_1.default);
api.use('/role', roleRoutes_1.default);
exports.default = api;
