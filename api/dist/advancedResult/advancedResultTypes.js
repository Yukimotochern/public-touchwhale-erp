"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdvancedResultSchema = void 0;
function getAdvancedResultSchema(resultDataSchema) {
    return {
        type: 'object',
        properties: {
            count: {
                type: 'integer',
            },
            current_page: {
                type: 'integer',
            },
            next_page: {
                type: 'integer',
                nullable: true,
            },
            prev_page: {
                type: 'integer',
                nullable: true,
            },
            limit: {
                type: 'integer',
            },
            result: resultDataSchema,
        },
        required: ['count', 'current_page', 'limit'],
        additionalProperties: false,
    };
}
exports.getAdvancedResultSchema = getAdvancedResultSchema;
