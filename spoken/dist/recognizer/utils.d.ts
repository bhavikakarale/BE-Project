import * as graphlib from 'graphlib';
import { SerializedTransition } from './transition';
declare type Trt = {
    label: string;
    store?: string;
    normalizer?: string;
    graph: {
        id: string;
        lang: string;
    };
};
export declare function normalizeTransition(rawTransition: Trt): SerializedTransition[];
export declare function parseTransitionLabel(str: string): string[];
export declare function getTransitionType(str: string): "REGEX" | "AUTOMATA" | "STRING";
export declare function sortSucessors(current: string, graph: graphlib.Graph): (a: string, b: string) => 1 | 0 | -1;
export {};
