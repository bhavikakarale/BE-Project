import * as graphlib from '../graphlib';
import Transitions, { TransitionsTypes } from './transition';
import StopWordsEngine from '../stop-words-engine';
export declare type State = {
    id: string;
    isFinal: boolean;
    path: (TransitionsTypes | {
        [key: string]: TransitionsTypes;
    })[];
};
/**
 * This class represents a automata, it is responsible for telling
 * if a given automata recognizes or not a given input string.
 */
export default class Automata {
    currentState: State;
    graph: graphlib.Graph;
    stopWordsEngine: StopWordsEngine | null;
    constructor(graph: graphlib.Graph | string, lang?: string);
    recognize(inputString: string[], index?: number): (null | [graphlib.Graph, State, number]);
    setState(state: State): void;
    nextState(inputString: string[], index?: number): (State & {
        index: number;
    } | null);
    getSucessors(): string[];
    getTransitions(to: string): Transitions;
}
