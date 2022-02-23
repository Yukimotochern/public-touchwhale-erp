"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var express_1 = __importDefault(require("express"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var dotenv_1 = __importDefault(require("dotenv"));
// routes
var api_1 = __importDefault(require("./routes/api"));
var userRoutes_1 = __importDefault(require("./routes/user/userRoutes"));
var mongodb_1 = __importDefault(require("./utils/mongodb"));
require("colorts/lib/string");
var app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
// Load env vars
dotenv_1.default.config({ path: path_1.default.join('.', 'src', 'config', 'config.env') });
// Connect to MongoDB
(0, mongodb_1.default)();
// Init Middleware
app.use(express_1.default.json({ limit: '999999MB' }));
// Mount API
app.use('/api/v1', api_1.default);
app.use('/api/v1/user', userRoutes_1.default);
var PORT = process.env.SERVER_PORT || 5000;
var server = app.listen(PORT, function () {
    return console.log("[server] Server running in ".concat(process.env.NODE_ENV, " mode on port ").concat(PORT)
        .yellow.bold);
});
server.setTimeout(999999999);
// Handle unhandled promise rejections
process.on('unhandledRejection', function (err, promise) {
    if (typeof err.message === 'string') {
        console.log("Unhandled Rejection: ".concat(err.message));
    }
    else {
        console.error("Unknown thing thrown: ".concat(err));
    }
    // Close server & exit process
    server.close(function () { return process.exit(1); });
});
