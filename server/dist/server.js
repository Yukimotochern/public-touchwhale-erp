"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load env vars
dotenv_1.default.config({ path: path_1.default.join(__dirname, '..', 'config', 'config.env') });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const cors_1 = __importDefault(require("cors"));
// routes
const apiRoutes_1 = __importDefault(require("./features/apiRoutes"));
const mongodb_1 = __importDefault(require("./utils/mongodb"));
require("colorts/lib/string");
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
const passportOAuth_1 = __importDefault(require("./utils/passportOAuth"));
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)());
// Connect to MongoDB
(0, mongodb_1.default)();
// Init Middleware
app.use(express_1.default.json({ limit: '999999MB' }));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
(0, passportOAuth_1.default)(passport_1.default);
// Enable CORS
app.use((0, cors_1.default)());
// Mount API
app.use('/api/v1', apiRoutes_1.default);
app.use(errorMiddleware_1.errorHandler);
const PORT = process.env.SERVER_PORT || 5000;
exports.server = app.listen(PORT, () => console.log(`[server] Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
    .yellow.bold));
exports.server.setTimeout(999999999);
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(path_1.default.join(__dirname, '..', '..', 'client', 'build')));
    app.get('*', (req, res) => {
        res.setHeader('Set-Cookie', 'HttpOnly;Secure;SameSite=Strict');
        res.sendFile(path_1.default.resolve(__dirname, '..', '..', 'client', 'build', 'index.html'));
    });
}
// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    if (err instanceof Error) {
        console.log(`Unhandled Rejection: ${err.message}`);
    }
    else {
        console.error(`Unknown thing thrown: ${err}`);
    }
    // Close server & exit process
    exports.server.close(() => process.exit(1));
});
exports.default = app;
