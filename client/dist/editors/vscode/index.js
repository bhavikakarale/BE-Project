"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ipc = __importStar(require("node-ipc"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const Prerequisites = __importStar(require("./prerequisites"));
const default_1 = require("../default");
const APP_NAME = 'speech2code';
const VSCODE_EXT_ID = 'august.speech2code';
ipc.config.id = 'speechtocodechannel-client';
ipc.config.retry = 1500;
ipc.config.silent = true;
ipc.config.maxRetries = 2;
class VSCodeEditor extends default_1.Editor {
    constructor() {
        super('VSCode');
        this.map = new Map();
        this.callback = null;
        this.onResponse = (data) => {
            console.log('[client.VSCodeRobot.runCommand/response]: Received response of ' + JSON.stringify(data));
            if (this.map.has(data.id)) {
                const [res, rej] = this.map.get(data.id);
                this.map.delete(data.id);
                if (data.err)
                    return rej(data.err);
                return res(data.response);
            }
            else {
                console.error(new Error('[client.VSCodeRobot.runCommand/response]: This response is not in the queue!'));
            }
        };
    }
    onStatusChange(cb) { this.callback = cb; }
    turnOff() { ipc.disconnect('speechtocodechannel'); }
    turnOn() { this.init(); }
    /**
     * This should check if VSCode is installed, check if
     * the extension Spoken is installed and if not
     * install it.
     */
    async checkPrerequisites() {
        Prerequisites.check();
    }
    init() {
        ipc.connectTo('speechtocodechannel', () => {
            let wasConnectedAtLeastOnce = false;
            ipc.of.speechtocodechannel.on('error', (err) => {
                console.log('[client.VSCodeRobot.error]: Error: ' + err);
            });
            ipc.of.speechtocodechannel.on('destroy', () => {
                var _a;
                console.log('[client.VSCodeRobot.destroy]: Socket destroyed!');
                this.status = 'OFF';
                if (!wasConnectedAtLeastOnce)
                    console.log('Unable to open connection!');
                (_a = this.callback) === null || _a === void 0 ? void 0 : _a.call(this, this);
            });
            ipc.of.speechtocodechannel.on('socket.disconnected', () => {
                var _a;
                console.log('[client.VSCodeRobot.socket.disconnected]: Socket disconnected!');
                this.status = 'OFF';
                (_a = this.callback) === null || _a === void 0 ? void 0 : _a.call(this, this);
            });
            ipc.of.speechtocodechannel.on('connect', () => {
                var _a;
                console.log('[client.VSCodeRobot.connect]: Connected!');
                this.status = 'ON';
                wasConnectedAtLeastOnce = true;
                (_a = this.callback) === null || _a === void 0 ? void 0 : _a.call(this, this);
            });
            ipc.of.speechtocodechannel.on('runCommand/response', this.onResponse);
        });
    }
    write(text) {
        console.log('[client.VSCodeRobot.write]: Sending request to execute write(' + text + ')');
        return this.runTask({
            type: 'write',
            context: {},
            extra: { args: [text] }
        });
    }
    removeSelection() {
        throw new Error('Method not implemented.');
    }
    newLine(pos) {
        console.log('[client.VSCodeRobot.newLine]: Sending request to execute newLine()');
        return this.runTask({
            type: 'newLine',
            context: {},
            extra: { args: [pos] }
        });
    }
    removeLine() {
        throw new Error('Method not implemented.');
    }
    selectLines(from, to) {
        throw new Error('Method not implemented.');
    }
    goToLine(number, cursorPosition = 'BEGIN') {
        console.log('[client.VSCodeRobot.goToLine]: Sending request to execute gotToLine(' + number + ')');
        return this.runTask({
            type: 'goToLine',
            context: {},
            extra: { args: [number, cursorPosition] }
        });
    }
    moveCursorTo(to, symbol, leapSize, goto = true) {
        console.log('[client.VSCodeRobot.moveCursorTo]: Sending request to execute moveCursorTo(...)');
        return this.runTask({
            type: 'moveCursorTo',
            context: {},
            extra: { args: [to, symbol, leapSize, goto] }
        });
    }
    select(from, to, line) {
        console.log('[client.VSCodeRobot.select]: Sending request to execute select(...)');
        return this.runTask({
            type: 'select',
            context: {},
            extra: { args: [from, to, line] }
        });
    }
    findPositionOf(term, line, pad) {
        console.log('[client.VSCodeRobot.findPositionOf]: Sending request to execute findPositionOf(...)');
        return this.runTask({
            type: 'findPositionOf',
            context: {},
            extra: { args: [term, line, pad] }
        });
    }
    writeOnTerminal(text) {
        console.log('[client.VSCodeRobot.writeOnTerminal]: Sending request to execute writeOnTerminal(...)');
        return this.runTask({
            type: 'writeOnTerminal',
            context: {},
            extra: { args: [text] }
        });
    }
    fileInfo(text) {
        console.log('[client.VSCodeRobot.fileInfo]: Sending request to execute fileInfo(...)');
        return this.runTask({
            type: 'fileInfo',
            context: {},
            extra: { args: [text] }
        });
    }
    getLine(number) {
        console.log('[client.VSCodeRobot.getLine]: Sending request to execute getLine(...)');
        return this.runTask({
            type: 'getLine',
            context: {},
            extra: { args: [number] }
        });
    }
    remove(selection) {
        console.log('[client.VSCodeRobot.getLine]: Sending request to execute remove(...)');
        return this.runTask({
            type: 'remove',
            context: {},
            extra: { args: [selection] }
        });
    }
    indentSelection(p1, p2) {
        console.log('[client.VSCodeRobot.indentSelection]: Sending request to execute indentSelection(...)');
        const task = {
            type: 'indentSelection',
            context: {},
            extra: { args: [p1, p2] }
        };
        return this.runTask(task);
    }
    hotKey(...keys) {
        throw new Error('Method not implemented.');
    }
    runTask(task) {
        return new Promise((res, rej) => {
            const id = +new Date();
            task.id = id;
            ipc.of.speechtocodechannel.emit('runCommand', task);
            this.map.set(id, [res, rej]);
        });
    }
}
function getExtensionPath() {
    const root = isDev() ? global.appRoot : process.resourcesPath;
    const files = fs_1.default.readdirSync(path_1.default.resolve(root));
    if (!Array.isArray(files) || (files === null || files === void 0 ? void 0 : files.length) === 0)
        return null;
    const extensionPath = files.find(item => item.includes(APP_NAME) && item.endsWith('.vsix'));
    if (extensionPath == null || extensionPath == '')
        return null;
    return path_1.default.resolve(root, extensionPath);
}
function isDev() {
    var _a, _b, _c;
    return ((_c = (_b = (_a = process === null || process === void 0 ? void 0 : process.mainModule) === null || _a === void 0 ? void 0 : _a.filename) === null || _b === void 0 ? void 0 : _b.indexOf) === null || _c === void 0 ? void 0 : _c.call(_b, 'app.asar')) === -1;
}
exports.default = new VSCodeEditor();
