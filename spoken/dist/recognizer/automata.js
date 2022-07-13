"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transition_1 = __importDefault(require("./transition"));
const utils_1 = require("./utils");
const stop_words_engine_1 = __importDefault(require("../stop-words-engine"));
const modules_loader_1 = __importDefault(require("../modules-loader"));
/**
 * This class represents a automata, it is responsible for telling
 * if a given automata recognizes or not a given input string.
 */
class Automata {
    constructor(graph, lang) {
        this.currentState = {
            id: '0',
            isFinal: false,
            path: []
        };
        if (typeof graph === 'string') {
            if (typeof lang === 'undefined')
                throw new Error('Language is not defined!');
            const graph2 = modules_loader_1.default.findAutomataById(graph, lang);
            if (graph2 == null)
                throw new Error('Automata ' + graph + ' not found!');
            graph = graph2;
        }
        if (lang == null)
            lang = graph.graph().lang;
        this.stopWordsEngine = graph.graph().disableStopWords !== 'true'
            ? new stop_words_engine_1.default(modules_loader_1.default.context.stopWords[lang].words, modules_loader_1.default.context.stopWords[lang].expressions)
            : null;
        this.graph = graph;
    }
    recognize(inputString, index = 0) {
        while (index < inputString.length) {
            if (this.stopWordsEngine != null) {
                const skip = this.stopWordsEngine.skipStopWords(index, inputString);
                if (skip !== 0) {
                    index += skip;
                    continue;
                }
            }
            const state = this.nextState(inputString, index);
            if (state == null)
                break;
            index = state.index;
            this.setState(state);
        }
        if (this.currentState.isFinal)
            return [this.graph, this.currentState, index];
        // @ts-ignore
        // console.log(this.currentState.path[2]?.operation)
        // console.log(inputString[index])
        return null;
    }
    setState(state) {
        this.currentState = {
            id: state.id,
            isFinal: this.graph.node(state.id).shape === 'doublecircle',
            path: [...this.currentState.path, ...state.path]
        };
    }
    nextState(inputString, index = 0) {
        for (const sucessor of this.getSucessors()) {
            const transition = this.getTransitions(sucessor);
            const result = transition.accepts(inputString, index);
            if (result != null) {
                return { id: sucessor, index: result.index, path: result.consumed, isFinal: false };
            }
        }
        return null;
    }
    getSucessors() {
        const { id: current } = this.currentState;
        return (this.graph.successors(current) || []).sort((0, utils_1.sortSucessors)(current, this.graph));
    }
    getTransitions(to) {
        // @ts-ignore
        const graph = { id: this.graph.graph().id, lang: this.graph.graph().lang };
        const transition = { ...this.graph.edge(this.currentState.id, to), graph };
        return new transition_1.default(transition);
    }
}
exports.default = Automata;
