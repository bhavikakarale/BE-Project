"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commands = exports.window = void 0;
exports.window = {
    createOutputChannel() {
        return {
            appendLine: (text) => {
                console.log(text);
            }
        };
    },
    showInformationMessage() { }
};
exports.commands = {
    registerCommand() { }
};
//# sourceMappingURL=my-vscode.js.map