"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transition = void 0;
const string_distance_1 = __importDefault(require("../string-distance"));
const utils_1 = require("./utils");
const automata_1 = __importDefault(require("./automata"));
const modules_loader_1 = __importDefault(require("../modules-loader"));
/**
 * This class represents a transition between two nodes in a automata.
 * A transition could be a simple string transition, a regex transition
 * or a automata transition.
 */
class Transition {
    constructor(transition) {
        this.transition = transition;
        this.transition = transition;
    }
    normalize(text, normalizer) {
        const lang = this.transition.options.graph.lang;
        return modules_loader_1.default.normalizers(normalizer, lang)(text, string_distance_1.default);
    }
}
exports.Transition = Transition;
class Transitions {
    constructor(rawTransition) {
        this.transitions = (0, utils_1.normalizeTransition)(rawTransition).map(this.buildTransition);
    }
    accepts(inputString, index = 0) {
        for (const transition of this.transitions) {
            const result = transition.accepts(inputString, index);
            if (result != null) {
                return result;
            }
        }
        return null;
    }
    buildTransition(transition) {
        if (transition.type === 'STRING')
            return new StringTransition(transition);
        if (transition.type === 'REGEX')
            return new RegexTransition(transition);
        if (transition.type === 'AUTOMATA')
            return new AutomataTransition(transition);
        throw new Error('Unknown transition type');
    }
}
exports.default = Transitions;
class StringTransition extends Transition {
    accepts(inputString, index = 0) {
        const word = inputString[index];
        const { text } = this.transition;
        if (text === 'λ')
            return { index: index, consumed: [null] };
        if ((0, string_distance_1.default)(word, text, this.transition.options.disableSpellcheck)) {
            const { store, choiceIndex, normalizer } = this.transition.options;
            const value = normalizer ? this.normalize(word, normalizer) : choiceIndex;
            // Normalizer has total control over this ?
            if (value == null)
                return null;
            const path = store ? { [store]: value } : word;
            return { index: index + 1, consumed: [path] };
        }
        return null;
    }
}
class RegexTransition extends Transition {
    accepts(inputString, index = 0) {
        const word = inputString[index];
        const { text } = this.transition;
        const template = modules_loader_1.default.templates(text.trim());
        const match = new RegExp(template.value).exec(word);
        if (match != null) {
            const { store, normalizer = template.defaultNormalizer } = this.transition.options;
            const value = this.normalize(word, normalizer);
            // Normalizer has total control over this ?
            if (value == null)
                return null;
            const path = store ? { [store]: value } : value;
            return { index: index + 1, consumed: [path] };
        }
        return null;
    }
}
class AutomataTransition extends Transition {
    constructor(transition) {
        super(transition);
        this.automataId = transition.text.replace(/\[(.*)\]/gi, '$1');
    }
    accepts(inputString, index = 0) {
        const { store, graph } = this.transition.options;
        const result = new automata_1.default(this.automataId, graph.lang).recognize(inputString, index);
        if (result !== null) {
            const graphInfo = result[0].graph();
            const automata = {
                id: this.automataId,
                lang: graph.lang,
                impl: graphInfo.impl,
                path: result[1].path,
                extraArgs: this.transition.options.extraArgs
            };
            const path = store ? { [store]: automata } : automata;
            return { index: result[2], consumed: [path] };
        }
        return null;
    }
}
