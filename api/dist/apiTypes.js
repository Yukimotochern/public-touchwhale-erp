"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseBodyWithAnyDataJSONSchema = exports.responeBodyWithOutDataJSONSchema = void 0;
/**
 * only for type check purpose,
 * since any type in 'data' field is not representable by JSONSchemaType
 */
exports.responeBodyWithOutDataJSONSchema = {
    type: 'object',
    properties: {
        message: { type: 'string', nullable: true },
        /**
         * ! if any thing should be added here for type safe,
         * ! do add it in responseBodyWithAnyDataSchema (below) !
         */
    },
    additionalProperties: false,
};
exports.responseBodyWithAnyDataJSONSchema = {
    type: 'object',
    properties: {
        message: { type: 'string', nullable: true },
        data: {},
    },
    additionalProperties: false,
};
