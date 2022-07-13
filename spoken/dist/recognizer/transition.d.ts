export declare type SerializedTransition = {
    text: string;
    type: 'STRING' | 'REGEX' | 'AUTOMATA';
    options: {
        graph: {
            id: string;
            lang: string;
        };
        choiceIndex: number;
        store?: string;
        normalizer?: string;
        extraArgs?: string;
        disableSpellcheck?: string;
    };
};
declare type TransitionAcceptsResult<T> = {
    index: number;
    consumed: (({
        [key: string]: T;
    }) | T)[];
} | null;
/**
 * This class represents a transition between two nodes in a automata.
 * A transition could be a simple string transition, a regex transition
 * or a automata transition.
 */
export declare abstract class Transition<T> {
    protected transition: SerializedTransition;
    constructor(transition: SerializedTransition);
    abstract accepts(inputString: string[], index?: number): TransitionAcceptsResult<T>;
    protected normalize(text: string, normalizer?: string): any;
}
export declare type TransitionsTypes = StringTransitionType | RegexTransitionType | AutomataTransitionType;
export default class Transitions {
    private transitions;
    constructor(rawTransition: any);
    accepts(inputString: string[], index?: number): {
        index: number;
        consumed: (TransitionsTypes | {
            [key: string]: TransitionsTypes;
        })[];
    } | null;
    buildTransition(transition: SerializedTransition): StringTransition | RegexTransition | AutomataTransition;
}
/**
 * A simple string transition in the format of: (Option, Option, ...)
 * Where each 'Option' is a valid accepted input transition;
 * If the strings are equal* the transition is made.
 */
declare type StringTransitionType = string | number | null;
declare class StringTransition extends Transition<StringTransitionType> {
    accepts(inputString: string[], index?: number): {
        index: number;
        consumed: null[];
    } | {
        index: number;
        consumed: (string | {
            [x: string]: any;
        })[];
    } | null;
}
/**
 * A regex transition in the format of: ({Option}, {Option}, ...)
 * Where each '{Option}' is a regex, if the regex matches the transition
 * string the transition is made.
 */
declare type RegexTransitionType = string;
declare class RegexTransition extends Transition<RegexTransitionType> {
    accepts(inputString: string[], index?: number): {
        index: number;
        consumed: any[];
    } | null;
}
/**
 * A automata transition in the format of: ([Option], [Option], ...)
 * Where each '[Option]' is a different automata that should be used
 * to test the transition string, if that automata accepts the string
 * the transition is made.
 */
declare type AutomataTransitionType = {
    id: string;
    impl: string;
    path: any[];
};
declare class AutomataTransition extends Transition<AutomataTransitionType> {
    private automataId;
    constructor(transition: SerializedTransition);
    accepts(inputString: string[], index?: number): {
        index: number;
        consumed: ({
            id: string;
            lang: string;
            impl: string;
            path: (TransitionsTypes | {
                [key: string]: TransitionsTypes;
            })[];
            extraArgs: string | undefined;
        } | {
            [x: string]: {
                id: string;
                lang: string;
                impl: string;
                path: (TransitionsTypes | {
                    [key: string]: TransitionsTypes;
                })[];
                extraArgs: string | undefined;
            };
        })[];
    } | null;
}
export {};
