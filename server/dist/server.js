"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var dotenv_1 = __importDefault(require("dotenv"));
// Load env vars
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', 'config', 'config.env') });
var express_1 = __importDefault(require("express"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var passport_1 = __importDefault(require("passport"));
var cors_1 = __importDefault(require("cors"));
// routes
var apiRoutes_1 = __importDefault(require("./features/apiRoutes"));
var mongodb_1 = __importDefault(require("./utils/mongodb"));
require("colorts/lib/string");
var errorMiddleware_1 = require("./middlewares/errorMiddleware");
var passportOAuth_1 = __importDefault(require("./utils/passportOAuth"));
var app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
// Connect to MongoDB
(0, mongodb_1.default)();
// Init Middleware
app.use(express_1.default.json({ limit: '999999MB' }));
passport_1.default.serializeUser(function (user, done) {
    done(null, user.id);
});
passport_1.default.deserializeUser(function (user, done) {
    done(null, user);
});
(0, passportOAuth_1.default)(passport_1.default);
// Enable CORS
app.use((0, cors_1.default)());
// Mount API
app.use('/api/v1', apiRoutes_1.default);
app.use(errorMiddleware_1.errorHandler);
var PORT = process.env.SERVER_PORT || 5000;
var server = app.listen(PORT, function () {
    return console.log("[server] Server running in ".concat(process.env.NODE_ENV, " mode on port ").concat(PORT)
        .yellow.bold);
});
server.setTimeout(999999999);
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(path_1.default.join(__dirname, '..', '..', 'client', 'build')));
    app.get('*', function (req, res) {
        res.setHeader('Set-Cookie', 'HttpOnly;Secure;SameSite=Strict');
        res.sendFile(path_1.default.resolve(__dirname, '..', '..', 'client', 'build', 'index.html'));
    });
}
// Handle unhandled promise rejections
process.on('unhandledRejection', function (err, promise) {
    if (err instanceof Error) {
        console.log("Unhandled Rejection: ".concat(err.message));
    }
    else {
        console.error("Unknown thing thrown: ".concat(err));
    }
    // Close server & exit process
    server.close(function () { return process.exit(1); });
});
