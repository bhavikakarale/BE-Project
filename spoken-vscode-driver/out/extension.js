"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("./vscode");
const logger_1 = require("./logger");
const ipc_proxy_1 = require("./ipc-proxy");
const robot_proxy_1 = require("./robot-proxy");
function activate(context) {
    logger_1.default('Spoken VSCode driver is ready!');
    let disposable = vscode.commands.registerCommand('spoken.helloWorld', () => __awaiter(this, void 0, void 0, function* () {
        vscode.window.showInformationMessage('Hello World from VSCode!');
    }));
    context.subscriptions.push(disposable);
    ipc_proxy_1.default.on('runCommand', robot_proxy_1.default);
    ipc_proxy_1.default.init();
}
exports.activate = activate;
function deactivate() {
    ipc_proxy_1.default.close();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map