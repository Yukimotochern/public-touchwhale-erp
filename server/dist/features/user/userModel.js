"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const CustomError_1 = __importDefault(require("../../utils/CustomError"));
const permissionTypes_1 = require("api/dist/permissionTypes");
const UserSchema = new mongoose_1.default.Schema({
    // Classifier
    isOwner: {
        type: Boolean,
        required: true,
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'user',
    },
    isActive: {
        type: Boolean,
        required: true,
    },
    provider: {
        type: String,
        enum: ['TouchWhale', 'Google'],
        required: true,
    },
    // Identity
    email: {
        type: String,
        unique: true,
        sparse: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email.',
        ],
    },
    login_name: {
        type: String,
        unique: true,
        sparse: true,
        match: [/^[^@]+$/, "Login name should not contains the '@' sign."],
    },
    // Permission
    role: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'role',
    },
    permission_groups: {
        type: [
            {
                type: String,
                enum: permissionTypes_1.permissionGroupNameSet,
            },
        ],
    },
    role_type: {
        type: String,
        enum: ['default', 'custom'],
    },
    // Secret
    password: {
        type: String,
        minlength: 8,
        select: false,
    },
    // Editable
    username: {
        type: String,
    },
    company: {
        type: String,
    },
    avatar: {
        type: String,
    },
    // Token
    forgetPasswordToken: { type: String, select: false },
    forgetPasswordExpire: { type: Date, select: false },
}, { timestamps: true });
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    this.password = await bcryptjs_1.default.hash(this.password, salt);
});
UserSchema.methods.getSignedJWTToken = function () {
    if (!this.isOwner && !this.owner) {
        throw new CustomError_1.default('Unattached User.');
    }
    const token = {
        id: this._id,
        isOwner: this.isOwner,
        owner: this.isOwner ? this._id : this.owner,
    };
    return jsonwebtoken_1.default.sign(token, process.env.JWTSECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcryptjs_1.default.compare(enteredPassword, this.password);
};
UserSchema.methods.getForgetPasswordToken = function () {
    const token = crypto_1.default.randomBytes(20).toString('hex') + String(this.email);
    // Set hash token
    this.forgetPasswordToken = crypto_1.default
        .createHash('sha256')
        .update(token)
        .digest('hex');
    // Expire in 1 hour
    this.forgetPasswordExpire = Date.now() + 60 * 60 * 1000;
    return token;
};
const UserModel = mongoose_1.default.model('user', UserSchema);
exports.default = UserModel;
