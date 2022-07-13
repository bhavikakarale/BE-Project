import { State } from './recognizer/automata';
declare type PathType = State['path'];
declare type CommandDetails = {
    id: string;
    lang: string;
    impl: string;
} & {
    [key: string]: string;
};
export default class SpokenCommand {
    id: string;
    label: string;
    lang: string;
    langName: string;
    title: string;
    desc: string;
    path: PathType;
    args: Record<string, string | number | any>;
    impl: string;
    extra: Record<string, any>;
    constructor(command: CommandDetails | Record<string, string>, path?: PathType);
    static extractArgs(path: PathType): Record<string, any>;
    static maybeParseArgs(automata: any): any;
}
export {};
