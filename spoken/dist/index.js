"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpokenCommand = void 0;
const modules_loader_1 = __importDefault(require("./modules-loader"));
const spoken_command_1 = __importDefault(require("./spoken-command"));
exports.SpokenCommand = spoken_command_1.default;
const recognizer_1 = __importDefault(require("./recognizer"));
const logger_1 = __importDefault(require("./logger"));
class Spoken {
    async init(val) {
        await modules_loader_1.default.load(val);
    }
    get modules() {
        return modules_loader_1.default.list;
    }
    get context() {
        return modules_loader_1.default.context;
    }
    recognizePhrase(phrase, lang) {
        var _a;
        if (!((_a = modules_loader_1.default === null || modules_loader_1.default === void 0 ? void 0 : modules_loader_1.default.list) === null || _a === void 0 ? void 0 : _a.length))
            throw new Error('Grammar is not loaded');
        logger_1.default.info('Looking for a match for: ', '"' + phrase + '"');
        const result = recognizer_1.default.recognize(phrase, lang);
        if (result == null)
            return null;
        logger_1.default.info('Match found for:', '"' + phrase + '"', "ID:", result[0].graph().id, "Path:", result[1].path);
        const [graph, state] = result;
        return new spoken_command_1.default(graph.graph(), state.path);
    }
    findById(id, lang) {
        var _a;
        if (!((_a = modules_loader_1.default === null || modules_loader_1.default === void 0 ? void 0 : modules_loader_1.default.list) === null || _a === void 0 ? void 0 : _a.length))
            throw new Error('Grammar is not loaded');
        const result = modules_loader_1.default.findAutomataById(id, lang);
        if (result == null)
            return null;
        return new spoken_command_1.default(result.graph());
    }
}
exports.default = new Spoken();
