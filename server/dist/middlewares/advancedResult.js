"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var errorResponse_1 = __importDefault(require("../utils/errorResponse"));
var advancedResult = function (model, populateStr) {
    return function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
        var id, query, reqQuery, removeFields, queryStr, _a, select, sort, pageNum, limitNum, fields, sortBy, page, limit, startIndex, endIndex, total, results, pagination;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!((_b = req.userJWT) === null || _b === void 0 ? void 0 : _b.id)) {
                        return [2 /*return*/, next(new errorResponse_1.default('Invalid credentials.', 401))];
                    }
                    id = req.userJWT.id;
                    req.query.user = id;
                    reqQuery = __assign({}, req.query);
                    removeFields = ['select', 'sort', 'page', 'limit', 'populate'];
                    removeFields.forEach(function (param) { return delete reqQuery[param]; });
                    queryStr = JSON.stringify(reqQuery);
                    console.log(JSON.parse(queryStr));
                    query = model.find(JSON.parse(queryStr));
                    _a = req.query, select = _a.select, sort = _a.sort, pageNum = _a.pageNum, limitNum = _a.limitNum;
                    // Select fields
                    if (req.query.select) {
                        fields = select === null || select === void 0 ? void 0 : select.split(',').join(' ');
                        query = query.select(fields);
                    }
                    // Sorting
                    if (req.query.sort) {
                        sortBy = sort === null || sort === void 0 ? void 0 : sort.split(',').join(' ');
                        query = query.sort(sortBy);
                    }
                    else {
                        query = query.sort('-createdAt');
                    }
                    page = pageNum ? parseInt(pageNum, 10) : 1;
                    limit = limitNum ? parseInt(limitNum, 10) : 30;
                    startIndex = (page - 1) * limit;
                    endIndex = page * limit;
                    return [4 /*yield*/, model.find(query).count()];
                case 1:
                    total = _c.sent();
                    query = query.skip(startIndex).limit(limit);
                    if (req.query.populate) {
                        query = query.populate(populateStr);
                    }
                    return [4 /*yield*/, query
                        // Pagination
                    ];
                case 2:
                    results = _c.sent();
                    pagination = {};
                    //@todo Maybe it can render url for forntend to render in button
                    if (endIndex < total) {
                        pagination.next = {
                            page: page + 1,
                            limit: limit,
                        };
                    }
                    if (startIndex > 0) {
                        pagination.prev = {
                            page: page - 1,
                            limit: limit,
                        };
                    }
                    res.advancedResults = {
                        count: results.length,
                        pagination: pagination,
                        data: results,
                    };
                    next();
                    return [2 /*return*/];
            }
        });
    }); };
};
exports.default = advancedResult;
