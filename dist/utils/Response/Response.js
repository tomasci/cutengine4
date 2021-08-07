"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Response(res, status, data) {
    return res.status(status.code ? status.code : 200).json({
        status,
        data: data ? data : {},
    });
}
exports.default = Response;
//# sourceMappingURL=Response.js.map