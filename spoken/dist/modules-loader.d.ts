import * as graphlib from './graphlib';
export declare type GraphJsonView = {
    edges: unknown;
    nodes: unknown;
    options: unknown;
    value: {
        id: string;
        impl: string;
        lang: string;
        alias?: string;
        priority?: string;
        [key: string]: unknown;
    };
};
export declare type SpokenModule = {
    id: string;
    desc: string;
    label: string;
    grammar: Record<string, GraphJsonView[]>;
};
export declare type SpokenModules = {
    modules: SpokenModule[];
    normalizers: Record<string, (((lang: string) => Function))>;
    templates: Record<string, {
        value: string;
        examples: Record<string, string[]>;
        defaultNormalizer?: string;
    }>;
    stopWords: Record<string, {
        words: string[];
        expressions: string[];
    }>;
};
export declare type Context = {
    normalizers: Record<string, (((lang: string) => Function))>;
    templates: Record<string, {
        value: string;
        examples: Record<string, string[]>;
    }>;
    stopWords: Record<string, {
        words: string[];
        expressions: string[];
    }>;
};
declare class Modules {
    private spoken;
    load(val?: SpokenModules): Promise<void>;
    findAutomataById(id: string, lang: string): (null | graphlib.Graph);
    get modules(): SpokenModule[];
    get list(): SpokenModule[];
    get context(): Context;
    templates(text: string): {
        value: string;
        examples: Record<string, string[]>;
        defaultNormalizer?: string | undefined;
    };
    normalizers(normalizer?: string, lang?: string): (text: string, ...args: any[]) => any;
}
declare const _default: Modules;
export default _default;
