import GraphlibType from 'graphlib';
export declare type Graph = {
    graph: () => Record<string, string>;
} & GraphlibType.Graph;
export declare const Graph: Graph;
export declare const alg: any;
export declare const json: any;
