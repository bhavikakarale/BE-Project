import { SpokenModule } from './modules-loader';
import SpokenCommand from './spoken-command';
declare class Spoken {
    init(val?: any): Promise<void>;
    get modules(): SpokenModule[];
    get context(): import("./modules-loader").Context;
    recognizePhrase(phrase: string, lang: string): (SpokenCommand | null);
    findById(id: string, lang: string): (SpokenCommand | null);
}
declare const _default: Spoken;
export default _default;
export { SpokenCommand };
export { SpokenModule };
export { Editor } from './modules/d';
