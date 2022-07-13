"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const spoken_1 = __importDefault(require("spoken"));
const editor_service_1 = __importDefault(require("./editors/editor-service"));
class SpokenInterface {
    constructor() {
        this.onComand = async (event, command, ...args) => {
            if (command == null) {
                return event.reply('Spoken:executeCommandResult', command, { err: 404 });
            }
            const [result, err] = await this.execute(command);
            if (err) {
                console.error('[wrapper.SpokenInterface.onCommand]\n\t' + err);
                return event.reply('Spoken:executeCommandResult', { error: err.toString() || true });
            }
            console.log('[wrapper.SpokenInterface.onCommand]: Result: ' + JSON.stringify(result || null));
            return event.reply('Spoken:executeCommandResult', { result });
        };
    }
    async execute(command, parent) {
        try {
            const fn = eval(`var exports = {};\n` + command.impl);
            const [args, err] = await this.parseArgs(command.args, command.id);
            if (args == null || err != null)
                return [null, err];
            const result = await fn({ ...args, parent }, editor_service_1.default.currentEditor, spoken_1.default.context);
            return [result, null];
        }
        catch (err) {
            console.error('[wrapper.SpokenInterface.onCommand] Error executing command: ' + err.toString());
            return [null, err];
        }
    }
    async parseArgs(args, parent) {
        for (const key of Object.keys(args)) {
            const innerCommand = args[key];
            if (Array.isArray(innerCommand)) {
                const arr = [];
                for (const item of innerCommand) {
                    if (!item.id || !item.impl || !item.lang) {
                        arr.push(item);
                        continue;
                    }
                    const [ab, err] = await this.execute(item, parent);
                    if (ab == null || err != null)
                        return [null, err];
                    arr.push(ab);
                }
                args[key] = arr;
            }
            else {
                if (!innerCommand.id || !innerCommand.impl || !innerCommand.lang)
                    continue;
                const [result, err] = await this.execute(innerCommand, parent);
                if (err != null)
                    return [null, err];
                args[key] = result;
            }
        }
        return [args, null];
    }
}
exports.default = new SpokenInterface();
