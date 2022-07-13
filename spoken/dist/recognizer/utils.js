"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortSucessors = exports.getTransitionType = exports.parseTransitionLabel = exports.normalizeTransition = void 0;
function normalizeTransition(rawTransition) {
    const options = parseTransitionLabel(rawTransition.label);
    return options.map((item, index) => ({
        options: { ...rawTransition, choiceIndex: index },
        type: getTransitionType(item),
        text: item
    }));
}
exports.normalizeTransition = normalizeTransition;
function parseTransitionLabel(str) {
    return str.trim().replace(/\(/, '').replace(/\)$/, '').split(/, |,/);
}
exports.parseTransitionLabel = parseTransitionLabel;
function getTransitionType(str) {
    if (/\{(.*)\}/.test(str))
        return 'REGEX';
    if (/\[(.*)\]/.test(str))
        return 'AUTOMATA';
    return 'STRING';
}
exports.getTransitionType = getTransitionType;
function sortSucessors(current, graph) {
    function priorityOf(transition) {
        if (transition.includes('λ'))
            return 6;
        if (transition.includes('['))
            return 4;
        if (transition.includes('{'))
            return 2;
        return 1;
    }
    return (a, b) => {
        const pa = priorityOf(graph.edge(current, a).label);
        const pb = priorityOf(graph.edge(current, b).label);
        if (pa < pb)
            return -1;
        else if (pa > pb)
            return 1;
        return 0;
    };
}
exports.sortSucessors = sortSucessors;
