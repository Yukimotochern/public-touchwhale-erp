"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWorker = exports.updateWorker = exports.createWorker = exports.getWorker = exports.getWorkers = exports.resetPassword = exports.forgetPassword = exports.changePassword = exports.deleteAvatar = exports.userGetAvatarUploadUrl = exports.updateUser = exports.getUser = exports.userSignOut = exports.userOAuthCallback = exports.userSignIn = exports.userVerify = exports.userSignUp = void 0;
const crypto_1 = __importDefault(require("crypto"));
const sendEmail_1 = require("../../utils/sendEmail");
const ajv_1 = require("api/dist/utils/ajv");
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const userModel_1 = __importDefault(require("./userModel"));
const emailMessage_1 = require("../../utils/emailMessage");
const b2_1 = require("../../utils/AWS/b2");
const userApi_1 = require("api/dist/user/userApi");
const api_1 = require("api/dist/api");
const API = new api_1.api();
const UserAvatarKeyPrifix = 'UserAvatar';
// @route    POST api/v1/user/signUp
// @desc     Sign user up
// @access   Public
const userSignUp = async (req, res, next) => {
    if (userApi_1.SignUp.API.bodyValidator(req.body)) {
        const { email } = req.body;
        let user = await userModel_1.default.findOne({ email });
        const sixDigits = Math.floor(100000 + Math.random() * 900000).toString();
        if (user) {
            if (user.isActive) {
                // User already register and has been activated
                return next(new CustomError_1.default('User already exists.', 409));
            }
            else {
                // User already register but is not activated
                user.password = sixDigits;
            }
        }
        else {
            user = new userModel_1.default({
                email,
                password: sixDigits,
                provider: 'TouchWhale',
                isOwner: true,
                isActive: false,
            });
        }
        await user.save({ validateBeforeSave: false });
        const message = (0, emailMessage_1.sixDigitsMessage)({ sixDigits });
        await (0, sendEmail_1.sendEmail)({
            to: email,
            subject: 'Your verificatiom code',
            message: message,
        });
        return userApi_1.SignUp.API.send(res, 200, {
            message: `Verification code has been send to ${email}`,
        });
    }
    next((0, ajv_1.avjErrorWrapper)(userApi_1.SignUp.API.bodyValidator.errors));
};
exports.userSignUp = userSignUp;
// @route    POST api/v1/user/signUp/verify
// @desc     Verify user email
// @access   Public
const userVerify = async (req, res, next) => {
    if (userApi_1.Verify.API.bodyValidator(req.body)) {
        const { email, password } = req.body;
        const user = await userModel_1.default.findOne({ email }).select('+password');
        if (!user) {
            return next(new CustomError_1.default('Invalid credentials.', 401));
        }
        if (user.isActive) {
            return next(new CustomError_1.default('User email is invalid.', 409));
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return next(new CustomError_1.default('Invalid credentials.', 401));
        }
        return userApi_1.Verify.API.sendData(res, user.getSignedJWTToken());
    }
    next((0, ajv_1.avjErrorWrapper)(userApi_1.Verify.API.bodyValidator.errors));
};
exports.userVerify = userVerify;
// @route    POST api/v1/user/signIn
// @desc     Sign user in
// @access   Public
const userSignIn = async (req, res, next) => {
    if (userApi_1.SignIn.API.bodyValidator(req.body)) {
        const { email, login_name, password } = req.body;
        if (!email && !login_name) {
            return next(new CustomError_1.default('Without Identity.', 400));
        }
        let user = await userModel_1.default.findOne({ email }).select('+password');
        if (!user) {
            return next(new CustomError_1.default('Invalid credentials.', 401));
        }
        if (!user.isActive) {
            return next(new CustomError_1.default('Your have not completed the sign up process. Please sign up again.', 400));
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            if (user.provider === 'Google') {
                return next(new CustomError_1.default('You were registered with Google. Please try that login method.', 401));
            }
            return next(new CustomError_1.default('Invalid credentials.', 401));
        }
        return sendTokenResponse(user, 200, res);
    }
    next((0, ajv_1.avjErrorWrapper)(userApi_1.SignIn.API.bodyValidator.errors));
};
exports.userSignIn = userSignIn;
// @route    GET api/v1/user/googleOAuth/callback
// @desc     Call back function for Google OAuth
// @access   Public
const userOAuthCallback = async (req, res, next) => {
    let redirectHome = process.env.BACKEND_PROD_URL;
    if (process.env.NODE_ENV === 'development') {
        redirectHome = `${process.env.FRONTEND_DEV_URL}`;
    }
    try {
        if (req.user) {
            const profile = req.user._json;
            const email = profile.email;
            if (!email) {
                throw new CustomError_1.default('Unable to obtain the required information(email) from Google.');
            }
            let user = await userModel_1.default.findOne({ email });
            if (!user) {
                user = new userModel_1.default({
                    isActive: true,
                    isOwner: true,
                    email: profile?.email,
                    password: crypto_1.default.randomBytes(10).toString('hex'),
                    avatar: profile?.picture,
                    provider: 'Google',
                    username: profile?.name,
                    active: true,
                });
                await user.save();
            }
            else {
                if (user.provider !== 'Google') {
                    user.provider = 'Google';
                    await user.save();
                }
            }
            setToken(user, res);
            return res.redirect(redirectHome);
        }
        else {
            throw new CustomError_1.default('Did not obtain information from Google.');
        }
    }
    catch (err) {
        // Error redirect to /signIn with message
        let message = 'Something went wrong.';
        if (err instanceof CustomError_1.default) {
            message = err.message;
        }
        message = encodeURI(`${message} Please try again latter or use the password login method.`);
        let signInPath = `${redirectHome}/signIn#${message}`;
        return res.redirect(signInPath);
    }
};
exports.userOAuthCallback = userOAuthCallback;
// @route    GET api/v1/user/signOut
// @desc     Sign user out
// @access   Public
const userSignOut = async (req, res, next) => {
    const options = {
        expires: new Date(1),
        httpOnly: true,
    };
    res.cookie('token', '', options);
    API.send(res);
};
exports.userSignOut = userSignOut;
// @route    GET api/v1/user/
// @desc     Get user infomation
// @access   Private
const getUser = async (req, res, next) => {
    if (req.userJWT) {
        const user = await userModel_1.default.findById(req.userJWT.id);
        if (user) {
            return userApi_1.GetUser.API.sendData(res, user);
        }
        else {
            return next(new CustomError_1.default('Server Error'));
        }
    }
    else {
        return next(new CustomError_1.default('Server Error'));
    }
};
exports.getUser = getUser;
// @route    PUT api/v1/user/
// @desc     Update user infomation
// @access   Private
const updateUser = async (req, res, next) => {
    if (userApi_1.Update.API.bodyValidator(req.body)) {
        if (req.userJWT) {
            const user = await userModel_1.default.findByIdAndUpdate(req.userJWT.id, req.body, {
                new: true,
                runValidators: true,
            });
            if (user) {
                return userApi_1.Update.API.sendData(res, user);
            }
            return next(new CustomError_1.default('Server Error'));
        }
        else {
            return next(new CustomError_1.default('Server Error'));
        }
    }
    else {
        return next((0, ajv_1.avjErrorWrapper)(userApi_1.Update.API.bodyValidator.errors));
    }
};
exports.updateUser = updateUser;
// @route    GET api/v1/user/avatar
// @desc     Get B2 url for frontend to make a put request
// @access   Private
const userGetAvatarUploadUrl = async (req, res, next) => {
    if (req.userJWT?.id) {
        const { id } = req.userJWT;
        const user = await userModel_1.default.findById(id);
        if (!user) {
            return next(new CustomError_1.default('Server Error.'));
        }
        const { Key, url } = await (0, b2_1.uploadImage)(UserAvatarKeyPrifix, id);
        let avatar = `https://tw-user-data.s3.us-west-000.backblazeb2.com/${Key}`;
        user.avatar = avatar;
        await user.save();
        return userApi_1.GetAvatarUploadUrl.API.sendData(res, { uploadUrl: url, avatar });
    }
    return next(new CustomError_1.default('Server Error', 500));
};
exports.userGetAvatarUploadUrl = userGetAvatarUploadUrl;
// @route    DELETE api/v1/user/avatar
// @desc     DELET User Avatar
// @access   Private
const deleteAvatar = async (req, res, next) => {
    if (req.userJWT?.id) {
        const { id } = req.userJWT;
        const user = await userModel_1.default.findById(id);
        if (!user) {
            return next(new CustomError_1.default('Server Error.'));
        }
        await (0, b2_1.deleteImage)(UserAvatarKeyPrifix, id);
        user.avatar = undefined;
        await user.save();
        return API.send(res, 200, { message: 'Avatar deleted.' });
    }
    return next(new CustomError_1.default('Server Error', 500));
};
exports.deleteAvatar = deleteAvatar;
// @route    PUT api/v1/user/changePassword
// @desc     Update password
// @access   Private
const changePassword = async (req, res, next) => {
    if (userApi_1.ChangePassword.API.bodyValidator(req.body) && req.userJWT) {
        const user = await userModel_1.default.findById(req.userJWT.id).select('+password');
        if (user && user.isActive && req.body.currentPassword) {
            if (!(await user.matchPassword(req.body.currentPassword))) {
                return next(new CustomError_1.default('Invalid credential.', 400));
            }
            user.password = req.body.newPassword;
            await user.save();
            return sendTokenResponse(user, 200, res);
        }
        else if (user && !user.isActive) {
            user.password = req.body.newPassword;
            user.isActive = true;
            await user.save();
            return sendTokenResponse(user, 200, res);
        }
        return next(new CustomError_1.default('Server Error'));
    }
    else {
        return next((0, ajv_1.avjErrorWrapper)(userApi_1.ChangePassword.API.bodyValidator.errors));
    }
};
exports.changePassword = changePassword;
// @route    POST api/v1/user/forgetPassword
// @desc     Forget password
// @access   Public
const forgetPassword = async (req, res, next) => {
    if (userApi_1.ForgetPassword.API.bodyValidator(req.body)) {
        const user = await userModel_1.default.findOne({ email: req.body.email });
        if (!user) {
            return next(new CustomError_1.default('There is no user with that email.', 404));
        }
        if (user.provider === 'Google') {
            return next(new CustomError_1.default('You have been using the Google login. Please use google to login.', 409));
        }
        const token = user.getForgetPasswordToken();
        await user.save({ validateBeforeSave: false });
        // Create url
        const option = {
            protocol: req.protocol,
            host: req.get('host'),
            token,
        };
        const message = (0, emailMessage_1.forgetPasswordMessage)(option);
        try {
            await (0, sendEmail_1.sendEmail)({
                to: req.body.email,
                subject: 'Password reset token',
                message,
            });
            userApi_1.ForgetPassword.API.send(res, 200, { message: 'Email sent' });
        }
        catch (err) {
            console.error(err);
            user.forgetPasswordToken = undefined;
            user.forgetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            return next(new CustomError_1.default('Email could not be sent.', 500, err));
        }
    }
    else {
        return next((0, ajv_1.avjErrorWrapper)(userApi_1.ForgetPassword.API.bodyValidator.errors));
    }
};
exports.forgetPassword = forgetPassword;
// @desc        Reset password
// @route       PUT /api/v1/user/forgetPassword
// @access      Public
const resetPassword = async (req, res, next) => {
    if (userApi_1.ResetPassword.API.bodyValidator(req.body)) {
        // case 1: body only provide token
        // 1. validate the token
        // 2. reset a new token and return
        // case 2: body provide both token and new password
        // 1. validate the token
        // 2. reset the password
        const forgetPasswordToken = crypto_1.default
            .createHash('sha256')
            .update(req.body.token)
            .digest('hex');
        const user = await userModel_1.default.findOne({
            forgetPasswordToken,
            forgetPasswordExpire: { $gt: Date.now() },
        });
        if (!user) {
            return next(new CustomError_1.default('Invalid token.', 401));
        }
        if (req.body.password) {
            user.password = req.body.password;
            user.forgetPasswordToken = undefined;
            user.forgetPasswordExpire = undefined;
            await user.save();
            return userApi_1.ResetPassword.API.sendData(res, {}, { message: 'Your password has been set.' });
        }
        else {
            const token = user.getForgetPasswordToken();
            await user.save({ validateBeforeSave: false });
            return userApi_1.ResetPassword.API.sendData(res, { token }, { message: 'Please use this new token to reset the password.' });
        }
    }
    else {
        return next((0, ajv_1.avjErrorWrapper)(userApi_1.ResetPassword.API.bodyValidator.errors));
    }
};
exports.resetPassword = resetPassword;
// @route    GET api/v1/user/workers
// @desc     Get all workers
// @access   Private
const getWorkers = async (req, res, next) => {
    if (req.userJWT) {
        const workers = await userModel_1.default.find({
            owner: req.userJWT.owner,
            isOwner: false,
        });
        userApi_1.GetWorkers.API.sendData(res, workers);
    }
    return next(new CustomError_1.default('Internal Server Error'));
};
exports.getWorkers = getWorkers;
// @route    GET api/v1/user/workers/:id
// @desc     Get worker
// @access   Private
const getWorker = async (req, res, next) => {
    if (req.userJWT) {
        const worker = await userModel_1.default.findOne({
            owner: req.userJWT.owner,
            isOwner: false,
            _id: req.params.id,
        });
        if (worker) {
            userApi_1.GetWorker.API.sendData(res, worker);
        }
        next(new CustomError_1.default('Worker not found.'));
    }
    return next(new CustomError_1.default('Internal Server Error'));
};
exports.getWorker = getWorker;
// @route    POST api/v1/user/workers/
// @desc     Get worker
// @access   Private
const createWorker = async (req, res, next) => {
    if (userApi_1.CreateWorker.API.bodyValidator(req.body)) {
        if (req.userJWT) {
            const worker = await userModel_1.default.create({
                ...req.body,
                provider: 'TouchWhale',
                isActive: true,
                isOwner: false,
                owner: req.userJWT.owner,
            });
            userApi_1.CreateWorker.API.sendData(res, worker);
        }
        return next(new CustomError_1.default('Internal Server Error'));
    }
    return next((0, ajv_1.avjErrorWrapper)(userApi_1.CreateWorker.API.bodyValidator.errors));
};
exports.createWorker = createWorker;
// @route    PUT api/v1/user/workers/:id
// @desc     Update a worker
// @access   Private
const updateWorker = async (req, res, next) => {
    if (userApi_1.UpdateWorker.API.bodyValidator(req.body)) {
        if (req.userJWT) {
            // TODO make sure the permission group obeys the tree like structure
            const worker = await userModel_1.default.findOneAndUpdate({
                owner: req.userJWT.owner,
                _id: req.params.id,
            }, req.body, { runValidators: true, new: true });
            if (worker) {
                return userApi_1.UpdateWorker.API.sendData(res, worker);
            }
            return next(new CustomError_1.default('The worker does not exist or you do not have the correct access permission.', 400));
        }
        return next(new CustomError_1.default('Internal Server Error'));
    }
    return next((0, ajv_1.avjErrorWrapper)(userApi_1.UpdateWorker.API.bodyValidator.errors));
};
exports.updateWorker = updateWorker;
// @route    DELETE api/v1/user/workers/:id
// @desc     Delete a worker
// @access   Private
const deleteWorker = async (req, res, next) => {
    if (req.userJWT) {
        let idToDelete = req.params.id;
        if (req.userJWT.id === idToDelete) {
            return next(new CustomError_1.default('Your cannot delete yourself.'));
        }
        const worker = await userModel_1.default.findOne({
            owner: req.userJWT.owner,
            _id: idToDelete,
        });
        if (worker) {
            await worker.delete();
            userApi_1.DeleteWorker.API.sendData(res, worker, {
                message: 'The user in the data is successfully deleted.',
            });
        }
        return next(new CustomError_1.default('Worker not found or you may not have the correct access right.'));
    }
    return next(new CustomError_1.default('Internal Server Error'));
};
exports.deleteWorker = deleteWorker;
/*
// @route    POST api/v1/user/
// @desc
// @access   Public
export const userXXX: RequestHandler = async (req, res, next) => {
  if (XXX.API.bodyValidator(req.body)) {
    // return send(res, {})
    // or
    // return XXX.API.sendData(res, {})
  }
  next(avjErrorWrapper(XXX.API.bodyValidator.errors))
}
*/
// Helper functions
const setToken = (user, res) => {
    const token = user.getSignedJWTToken();
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 60 * 60 * 1000 * 24),
        httpOnly: true,
    };
    res.cookie('token', token, options);
    return token;
};
const sendTokenResponse = (user, statusCode, res) => {
    const token = setToken(user, res);
    if (process.env.NODE_ENV === 'test') {
        return API.send(res, statusCode, token);
    }
    return API.send(res, statusCode);
};
