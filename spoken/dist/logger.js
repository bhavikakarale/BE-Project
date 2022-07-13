"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    info(...data) {
        var _a, _b;
        if ((_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.JEST_WORKER_ID)
            return;
        const lines = (_b = Error().stack) === null || _b === void 0 ? void 0 : _b.split('\n').slice(2, 3)[0];
        console.info('[INFO]', '[' + (lines === null || lines === void 0 ? void 0 : lines.trim()) + ']:', ...data);
    }
};
