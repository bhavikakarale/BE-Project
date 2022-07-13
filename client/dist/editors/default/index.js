"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MSNotepadEditor_pythonScriptPath;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Editor = void 0;
class Editor {
    constructor(editorName) {
        this.editorName = editorName;
        this.status = 'OFF';
        this.editorName = editorName;
    }
    getName() { return this.editorName; }
}
exports.Editor = Editor;
// Microsoft Notepad editor
class MSNotepadEditor extends Editor {
    constructor() {
        super('MSNotepad');
        this.spawn = null;
        _MSNotepadEditor_pythonScriptPath.set(this, require('path').resolve(__dirname, 'robot-impl.py'));
        this.spawn = require("child_process").spawn;
        this.status = 'ON';
    }
    /**
     * This should check if python is avaiable, since
     * this editor depends on python.
     *
     */
    async checkPrerequisites() {
        // No error! Lets just always asume python is present!
    }
    run(method, ...args) {
        return new Promise((res, rej) => {
            const pr = this.spawn('python', [__classPrivateFieldGet(this, _MSNotepadEditor_pythonScriptPath, "f"), method, ...args]);
            // console.log('[RobotPython.run] Running process: ' + pr.toString())
            let out, err;
            pr.stdout.on('data', (data) => out = data);
            pr.stderr.on('data', (data) => err = data);
            pr.on('close', (code) => {
                if (code == 0)
                    res(out || undefined);
                else
                    rej(new Error(err));
            });
        });
    }
    async write(text) {
        try {
            await this.run('write', text);
        }
        catch (err) {
            console.error('[RobotPython.write]:\n\t' + err);
            throw err;
        }
    }
    async press(keyNumber) {
        try {
            await this.run('press', keyNumber);
        }
        catch (err) {
            console.error('[RobotPython.press]:\n\t' + err);
            throw err;
        }
    }
    async removeSelection() {
        throw new Error('Method not implemented.');
    }
    async newLine(pos) {
        try {
            await this.press('end');
            await this.press('enter');
        }
        catch (err) {
            console.error('[MSNotepadEditor.newLine]:\n\t' + err);
            throw err;
        }
    }
    async removeLine() {
        throw new Error('Method not implemented.');
    }
    async selectLines(from, to) {
        throw new Error('Method not implemented.');
    }
    async goToLine(number) {
        try {
            await this.hotKey('ctrl', 'g');
            await this.sleep(200);
            await this.write(number);
            await this.press('enter');
            await this.press('esc');
            return "Not empty!";
        }
        catch (err) {
            console.error('[MSNotepadEditor.goToLine]:\n\t' + err);
            throw err;
        }
    }
    async hotKey(...keys) {
        try {
            await this.run('hotKey', ...keys);
        }
        catch (err) {
            console.error('[RobotPython.hotKey]:\n\t' + err);
            throw err;
        }
    }
    async sleep(msec) {
        return new Promise(resolve => setTimeout(resolve, msec));
    }
    turnOn() { }
    turnOff() { }
    onStatusChange() { }
}
_MSNotepadEditor_pythonScriptPath = new WeakMap();
exports.default = new MSNotepadEditor();
