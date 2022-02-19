"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var api_1 = __importDefault(require("./routes/api"));
var mongodb_1 = __importDefault(require("./utils/mongodb"));
require("colorts/lib/string");
var app = express_1.default();
// Load env vars
dotenv_1.default.config({ path: path_1.default.join('.', 'src', 'config', 'config.env') });
// Connect to MongoDB
mongodb_1.default();
// Init Middleware
app.use(express_1.default.json({ limit: '999999MB' }));
app.use('/api/v1', api_1.default);
app.listen(5000);
