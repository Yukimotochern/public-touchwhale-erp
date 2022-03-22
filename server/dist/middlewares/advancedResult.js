"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomError_1 = __importDefault(require("../utils/CustomError"));
const advancedResult = (model, populateStr) => async (req, res, next) => {
    if (!req.userJWT?.id) {
        return next(new CustomError_1.default('Invalid credentials.', 401));
    }
    const { id } = req.userJWT;
    let query;
    req.query.user = id;
    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort', 'page', 'limit', 'populate'];
    removeFields.forEach((param) => delete reqQuery[param]);
    let queryStr = JSON.stringify(reqQuery);
    console.log(JSON.parse(queryStr));
    query = model.find(JSON.parse(queryStr));
    let { select, sort, pageNum, limitNum } = req.query;
    // Select fields
    if (req.query.select) {
        const fields = select?.split(',').join(' ');
        query = query.select(fields);
    }
    // Sorting
    if (req.query.sort) {
        const sortBy = sort?.split(',').join(' ');
        query = query.sort(sortBy);
    }
    else {
        query = query.sort('-createdAt');
    }
    // Pagination
    const page = pageNum ? parseInt(pageNum, 10) : 1;
    const limit = limitNum ? parseInt(limitNum, 10) : 30;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.find(query).count();
    query = query.skip(startIndex).limit(limit);
    if (req.query.populate) {
        query = query.populate(populateStr);
    }
    const results = await query;
    // Pagination
    const pagination = {};
    //@todo Maybe it can render url for forntend to render in button
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }
    res.advancedResults = {
        count: results.length,
        pagination,
        data: results,
    };
    next();
};
exports.default = advancedResult;
