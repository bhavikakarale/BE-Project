"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _EditorService_currentEditorName, _EditorService_stateChangeCallback;
Object.defineProperty(exports, "__esModule", { value: true });
const default_1 = __importDefault(require("./default"));
const vscode_1 = __importDefault(require("./vscode/"));
class EditorService {
    constructor() {
        _EditorService_currentEditorName.set(this, void 0);
        _EditorService_stateChangeCallback.set(this, null);
        this.editors = [vscode_1.default, default_1.default];
        __classPrivateFieldSet(this, _EditorService_currentEditorName, vscode_1.default.getName(), "f");
        this.state = this.getState();
        for (const editor of this.editors) {
            editor.onStatusChange(() => {
                var _a;
                this.state = this.getState();
                try {
                    (_a = __classPrivateFieldGet(this, _EditorService_stateChangeCallback, "f")) === null || _a === void 0 ? void 0 : _a.call(this, this.state);
                }
                catch (e) {
                    // dont know
                }
            });
        }
    }
    getState() {
        return this.editors.map(item => ({
            name: item.getName(),
            status: item.status,
            current: item.getName() === __classPrivateFieldGet(this, _EditorService_currentEditorName, "f")
        }));
    }
    onStateChange(fn) {
        __classPrivateFieldSet(this, _EditorService_stateChangeCallback, fn, "f");
        return this;
    }
    init() {
        this.currentEditor.turnOn();
    }
    stop() {
        for (const e of this.editors)
            e.turnOff();
    }
    get currentEditor() {
        var _a;
        return (_a = this.editors.find(a => a.getName() === __classPrivateFieldGet(this, _EditorService_currentEditorName, "f"))) !== null && _a !== void 0 ? _a : this.editors[0];
    }
    setCurrentEditor(e) {
        var _a;
        this.currentEditor.turnOff();
        __classPrivateFieldSet(this, _EditorService_currentEditorName, e, "f");
        this.currentEditor.turnOn();
        this.state = this.getState();
        (_a = __classPrivateFieldGet(this, _EditorService_stateChangeCallback, "f")) === null || _a === void 0 ? void 0 : _a.call(this, this.state);
    }
    register(editor) {
        this.editors.push(editor);
    }
}
_EditorService_currentEditorName = new WeakMap(), _EditorService_stateChangeCallback = new WeakMap();
exports.default = new EditorService();
