import { SpokenModule, GraphJsonView } from '../modules-loader';
import * as graphlib from '../graphlib';
declare class Recognizer {
    recognize(phrase: string, lang: string): [graphlib.Graph, import("./automata").State, number] | null;
    graphs(mod: SpokenModule, lang: string): GraphJsonView[];
    private sortGraphs;
}
declare const _default: Recognizer;
export default _default;
