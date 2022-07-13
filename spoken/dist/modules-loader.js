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
Object.defineProperty(exports, "__esModule", { value: true });
const graphlib = __importStar(require("./graphlib"));
class Modules {
    constructor() {
        this.spoken = {
            modules: [],
            normalizers: {},
            templates: {},
            stopWords: {}
        };
    }
    async load(val) {
        this.spoken = await loadModules(val);
    }
    findAutomataById(id, lang) {
        for (const mod of this.modules) {
            for (const graphJson of mod.grammar[lang]) {
                if (graphJson.value.id === id)
                    return graphlib.json.read(graphJson);
            }
        }
        return null;
    }
    get modules() {
        return this.spoken.modules;
    }
    get list() {
        return this.spoken.modules;
    }
    get context() {
        return {
            templates: this.spoken.templates,
            normalizers: this.spoken.normalizers,
            stopWords: this.spoken.stopWords
        };
    }
    templates(text) {
        return this.spoken.templates[text];
    }
    normalizers(normalizer, lang) {
        if (!lang || !normalizer || !this.spoken.normalizers[normalizer])
            return (text) => text;
        return (text, ...args) => {
            try {
                const fn = this.spoken.normalizers[normalizer](lang);
                const value = fn(text, ...args);
                if (value == null)
                    return null;
                return value;
            }
            catch (err) {
                console.error(err);
                return null;
            }
        };
    }
}
async function loadModules(val) {
    var _a, _b, _c;
    let json = { modules: [], normalizers: {}, templates: {}, stopWords: {} };
    if (val != null) {
        json = val; // should not be allowing that!
    }
    else if (typeof require === 'function' && ((_a = require('fs')) === null || _a === void 0 ? void 0 : _a.readFileSync) !== undefined) {
        const fs = require('fs');
        const path = require('path');
        json = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'grammar.json'), 'utf-8'));
    }
    else if (typeof fetch === 'function') {
        // @ts-ignore yeah! couldnt care less!
        const homepage = (_b = window.__HOME_PAGE__) !== null && _b !== void 0 ? _b : '';
        const r = await fetch(homepage + '/grammar.json');
        json = await r.json();
    }
    if (!((_c = json === null || json === void 0 ? void 0 : json.modules) === null || _c === void 0 ? void 0 : _c.length)) {
        console.error('Unable to load grammar!');
        return { modules: [], normalizers: {}, templates: {}, stopWords: {} };
    }
    for (const key in json.normalizers) {
        json.normalizers[key] = eval(`(() => { return ${json.normalizers[key]} })()`);
    }
    return json;
}
exports.default = new Modules();
