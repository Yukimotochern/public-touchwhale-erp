"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(ajvValidate) {
    return function (req, res, next) {
        var valid = ajvValidate(req.body);
        if (!valid) {
            var errors = ajvValidate.errors;
            return res.status(400).json(errors);
        }
        next();
    };
}
exports.default = default_1;
