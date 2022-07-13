/**

Test it out and use the grammar above: https://omrelli.ug/nearley-playground/

MAIN -> ROOT _ DEF _ LEFT _ OP _ RIGHT
_ -> " "
ROOT -> [\w]:+
DEF -> "->" | "!>"
LEFT -> ("P" | "N") [0-9]:+
OP -> "!=" | "=="
RIGHT -> "(" ITEM ")"
ITEM -> ITEM "|" ITEM | [\w]:+

 */
declare type Clauses = {
    left: string | string[];
    right: string[];
    op: number;
};
declare type Expression = {
    root: string;
    negative: boolean;
    clauses: Clauses[];
};
export default class StopWordsEngine {
    cache: Map<string, Expression>;
    stopWordList: string[];
    stopExpressionList: string[];
    constructor(stopWordList: string[], stopExpressionList?: string[]);
    removeStopWords(phrase: string): string;
    sanitizeStopExpressions(phrase: string): string;
    skipStopWords(currentWordIndex: number, words: string[]): number;
    private test;
    private parse;
    private parseOperand;
}
export {};
