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
exports.createInstance = void 0;
const vscode = require("./vscode");
const logger_1 = require("./logger");
class RobotVscode {
    constructor() {
        /**
         * Writes something in the current text input
         * @param text The text to be written
         */
        this.write = (text) => new Promise((res, rej) => {
            logger_1.default('[vscode-driver.robot-vscode.write]: Executing write(' + text + ')');
            const [editor, e] = this.getEditor();
            if (editor == null)
                return rej(e);
            editor.edit((editBuilder) => {
                editBuilder.replace(editor.selection, '');
                editBuilder.insert(editor.selection.active, text);
            }).then(ok => {
                if (!ok)
                    return rej(new Error('Something went wrong!'));
                res();
            });
        });
        /**
         * Removes the provided selection/line
         *
         * @param The line to be removed
         */
        this.remove = (selection) => new Promise((res, rej) => {
            logger_1.default('[vscode-driver.robot-vscode.write]: Executing remove(' + selection + ')');
            const [editor, e] = this.getEditor();
            if (editor == null)
                return rej(e);
            vscode.commands.executeCommand('editor.action.deleteLines').then(() => res());
        });
        /**
         * Creates a new line above or below the current line.
         *
         * @returns undefined if evrything went well, error otherwise
         */
        this.newLine = (pos) => new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
            logger_1.default('[vscode-driver.robot-vscode.newLine]: Executing newLine');
            const [editor, e] = this.getEditor();
            if (editor == null)
                return rej(e);
            if (pos === 0) {
                yield this.goToLine(String(editor.selection.active.line), 'END');
            }
            editor.edit((editBuilder) => {
                editBuilder.insert(editor.selection.active, '\n');
            }).then(ok => {
                if (!ok)
                    return rej(new Error('Something went wrong!'));
                res();
            });
        }));
        /**
         * Moves the cursor to a different line
         *
         * @param number Line number
         * @param string Line position (END, BEGIN)
         */
        this.goToLine = (number, cursorPosition = 'BEGIN') => new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
            try {
                const [editor, e] = this.getEditor();
                if (editor == null)
                    return rej(e);
                const destLine = parseInt(number);
                // remove any active selection
                editor.selection = new vscode.Selection(editor.selection.active, editor.selection.active);
                const line = editor.selection.active.line + 1;
                const to = destLine > line ? 'down' : 'up';
                const value = to === 'down' ? destLine - line : line - destLine;
                if (value === 0)
                    return res(editor.document.lineAt(line - 1).text);
                vscode.commands.executeCommand('cursorMove', { to, value, by: 'line' }).then(() => {
                    vscode.commands.executeCommand('revealLine', { lineNumber: destLine, at: 'center' }).then(() => {
                        const text = editor.document.lineAt(destLine - 1).text;
                        if (cursorPosition === 'END') {
                            return vscode.commands.executeCommand('cursorMove', { to: 'wrappedLineEnd' }).then(() => res(text));
                        }
                        const index = text.length - text.trimLeft().length;
                        vscode.commands.executeCommand('cursorMove', { to: 'wrappedLineStart' }).then(() => {
                            if (index <= 0)
                                return res(text);
                            vscode.commands.executeCommand('cursorMove', { to: 'right', value: index, by: 'character' }).then(() => res(text));
                        });
                    });
                });
            }
            catch (err) {
                rej(err);
            }
        }));
        /**
         * Finds the position of a given token in the current line
         *
         * @param to {string} Where the cursor should move to
         * @param symbol {string} If `to` is SYMBOL, which symbol are we looking for
         * @param leapSize {number} How many matches should be skiped
         */
        this.moveCursorTo = (to, symbol, leapSize) => new Promise((res, rej) => __awaiter(this, void 0, void 0, function* () {
            const [editor, e] = this.getEditor();
            if (editor == null)
                return rej(e);
            function moveCursor(options) {
                if (options.value === 0)
                    return res();
                return vscode.commands.executeCommand('cursorMove', options).then(() => res());
            }
            const currentLine = editor.document.lineAt(editor.selection.active.line);
            if (to === 'BEGIN_LINE' || to === 'END_LINE') {
                const { relative } = this.lineBoundaries(currentLine);
                return moveCursor({ to: relative[to === 'BEGIN_LINE' ? 0 : 1] });
            }
            // Move the cursor {leapSize} units to the right
            if (to === null) {
                return moveCursor({ to: 'right', value: leapSize, by: 'character' });
            }
            if (to === 'SYMBOL' && symbol != undefined) {
                const { line, character } = editor.selection.active;
                const indices = this.findAllOccurrences(line, new RegExp(symbol, 'gi'), character);
                if (leapSize === -1)
                    leapSize = indices.length;
                else if (leapSize == null)
                    leapSize = 1;
                const range = indices[leapSize - 1];
                if (range == null)
                    return rej('Match not found for symbol: ' + symbol);
                return moveCursor({ to: 'right', value: range[0], by: 'character' });
            }
            return rej(new Error('Unknown operation!'));
        }));
        /**
         * Select a pice of text in the editor.
         *
         * @param from Where to start the selection
         * @param to Where to stop the selection
         * @param line If its a line selection or a word selection
         * @returns The text selection
         */
        this.select = (from, to, line) => new Promise((res, rej) => {
            const editor = vscode.window.activeTextEditor;
            if (editor == null)
                return rej(new Error('No active text editor'));
            try {
                if (line) {
                    const lastCharacter = editor.document.lineAt(to - 1).text.length;
                    editor.selection = new vscode.Selection(from - 1, 0, to - 1, lastCharacter);
                    return res(editor.document.getText(editor.selection));
                }
                const currentLine = editor.selection.start.line;
                editor.selection = new vscode.Selection(currentLine, from, currentLine, to + 1);
                return res(editor.document.getText(editor.selection));
            }
            catch (err) {
                logger_1.default(err.toString());
                rej(err);
            }
        });
        /**
         * Indents the provided selection or the active one.
         *
         * @param p1 Start string[] (line, cursor)
         * @param p2 Finish string[] (line, cursor)
         */
        this.indentSelection = (p1, p2) => new Promise((res, rej) => {
            var _a, _b;
            try {
                const editor = vscode.window.activeTextEditor;
                if (editor == null)
                    return rej(new Error('No active text editor'));
                if (p1 == null || p2 == null) {
                    return vscode.commands.executeCommand('editor.action.formatDocument', {}).then(a => {
                        res();
                    });
                }
                p1[0] = (_a = p1[0]) !== null && _a !== void 0 ? _a : editor.selection.active.line;
                p2[0] = (_b = p2[0]) !== null && _b !== void 0 ? _b : editor.selection.active.line;
                const sp1 = p1.map(a => parseInt(a, 10));
                const sp2 = p2.map(a => parseInt(a, 10));
                sp1[0] = Math.max(0, sp1[0]);
                sp2[0] = Math.min(editor.document.lineCount, sp2[0]);
                editor.selection = new vscode.Selection(sp1[0], sp1[1], sp2[0], sp2[1]);
                vscode.commands.executeCommand('editor.action.reindentselectedlines', {}).then(a => {
                    editor.selection = new vscode.Selection(editor.selection.end, editor.selection.end);
                    res();
                });
            }
            catch (err) {
                rej(err);
            }
        });
    }
    getEditor() {
        const editor = vscode.window.activeTextEditor;
        if (editor == null)
            return [null, new Error('No active text editor')];
        return [editor, null];
    }
    lineBoundaries(line, withWhiteSpace = false) {
        const rStart = withWhiteSpace ? 'wrappedLineStart' : 'wrappedLineFirstNonWhitespaceCharacter';
        const rEnd = withWhiteSpace ? 'wrappedLineEnd' : 'wrappedLineLastNonWhitespaceCharacter';
        const aStart = withWhiteSpace ? 0 : line.firstNonWhitespaceCharacterIndex;
        const aEnd = line.text.length;
        return {
            relative: [rStart, rEnd],
            absolute: [aStart, aEnd]
        };
    }
    stringMatchAll(text, regex) {
        const indices = [];
        let match = null;
        while ((match = regex.exec(text)) != null) {
            indices.push([match.index, match.index + match[0].length]);
        }
        return indices;
    }
    findAllOccurrences(lineNumber, regex, pad = 0) {
        const [editor, e] = this.getEditor();
        if (editor == null)
            return [];
        const line = editor.document.lineAt(lineNumber);
        const text = line.text.substr(pad);
        return this.stringMatchAll(text, regex);
    }
    /**
     * Finds the range of a term in a given line
     *
     * @param term {RegExp | string} What we are looking for
     * @param line {number} Which line to look for
     */
    findPositionOf(term, line, pad) {
        return __awaiter(this, void 0, void 0, function* () {
            const [editor, e] = this.getEditor();
            if (editor === null)
                throw e;
            line = line !== null && line !== void 0 ? line : editor.selection.active.line;
            if (typeof term === 'string') {
                if (term === 'LINE_BOUNDARIES' || term === '') {
                    return [this.lineBoundaries(editor.document.lineAt(line), true).absolute];
                }
                term = new RegExp(term, 'gi');
            }
            return this.findAllOccurrences(line, term, pad);
        });
    }
    /**
     * Retrieves the content of the provided line
     *
     * @param number | undefined line number
     */
    getLine(number) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [editor, e] = this.getEditor();
                if (editor == null)
                    throw e;
                number = number != null ? number : editor.selection.active.line;
                const d = editor.document.lineAt(number);
                return {
                    _line: d.lineNumber,
                    lineNumber: d.lineNumber,
                    _text: d.text,
                    text: d.text,
                    character: editor.selection.active.character
                };
            }
            catch (err) {
                logger_1.default(err.toString());
                throw err;
            }
        });
    }
    /**
     * Writes something in the terminal and press enter.
     *
     * @param text Text to be written in the terminal
     * @returns void
     */
    writeOnTerminal(text) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield ((_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.save());
                vscode.window.activeTerminal.show();
                (_b = vscode.window.activeTerminal) === null || _b === void 0 ? void 0 : _b.sendText(text);
                return;
            }
            catch (err) {
                throw err;
            }
        });
    }
    /**
     * Retrieves information about a file
     *
     * @param text Which file we are looking for information about, if undefined current file.
     * @returns
     */
    fileInfo(text) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [editor, err] = this.getEditor();
                if (err)
                    throw err;
                return {
                    fileName: editor === null || editor === void 0 ? void 0 : editor.document.fileName
                };
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.default = new RobotVscode();
function createInstance() {
    return new RobotVscode();
}
exports.createInstance = createInstance;
//# sourceMappingURL=robot-vscode.js.map