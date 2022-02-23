"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(ajvValidate) {
    return function (req, res, next) {
        var valid = ajvValidate(req.body);
        if (!valid) {
            var errors = ajvValidate.errors;
            next(new Error('bad request with validation'));
        }
        else {
            next();
        }
    };
}
exports.default = default_1;
