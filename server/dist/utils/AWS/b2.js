"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImage = exports.uploadImage = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const endpoint = new aws_sdk_1.default.Endpoint('s3.us-west-000.backblazeb2.com');
const s3 = new aws_sdk_1.default.S3({
    endpoint,
    region: 'us-west-000',
    credentials: {
        accessKeyId: process.env.B2_KEY_ID,
        secretAccessKey: process.env.B2_SECRET_KEY,
    },
    signatureVersion: 'v4',
});
// @todo This function will handle more upload image condition with other routes .
const uploadImage = async (resource, id) => {
    const Key = `${resource}/${id}`;
    let url = await s3.getSignedUrlPromise('putObject', {
        Bucket: 'tw-user-data',
        ContentType: 'image/*',
        Key,
    });
    return { Key, url };
};
exports.uploadImage = uploadImage;
const deleteImage = async (resource, id) => {
    const Key = `${resource}/${id}`;
    await s3
        .deleteObject({
        Bucket: 'tw-user-data',
        Key,
    })
        .promise();
};
exports.deleteImage = deleteImage;
