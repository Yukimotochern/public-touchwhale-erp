"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const passportOAuth = (passport) => {
    passport.use(new passport_google_oauth20_1.default.Strategy({
        clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        callbackURL: `${process.env.NODE_ENV === 'development'
            ? process.env.BACKEND_DEV_URL
            : process.env.BACKEND_PROD_URL}/api/v1/user/googleOAuth/callback`,
    }, async function (accessToken, refreshToken, profile, cb) {
        cb(null, profile);
    }));
};
exports.default = passportOAuth;
