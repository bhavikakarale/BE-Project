"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const modules_loader_1 = __importDefault(require("../modules-loader"));
const automata_1 = __importDefault(require("./automata"));
const graphlib = __importStar(require("../graphlib"));
class Recognizer {
    recognize(phrase, lang) {
        const words = phrase.split(' ');
        for (const mod of modules_loader_1.default.list) {
            for (const graphJson of this.graphs(mod, lang)) {
                const graph = graphlib.json.read(graphJson);
                const result = new automata_1.default(graph, lang).recognize(words);
                if (result != null)
                    return result;
            }
        }
        return null;
    }
    graphs(mod, lang) {
        if (!mod.grammar[lang])
            return [];
        return mod.grammar[lang]
            .filter(item => item.value.alias !== 'true')
            .sort(this.sortGraphs);
    }
    sortGraphs(a, b) {
        const av = parseInt(a.value.priority || '1', 10);
        const bv = parseInt(b.value.priority || '1', 10);
        if (av === bv)
            return 0;
        return av < bv ? -1 : 1;
    }
}
exports.default = new Recognizer();
