"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const electron_1 = require("electron");
const spoken_1 = __importDefault(require("spoken"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils");
const spoken_interface_1 = __importDefault(require("./spoken-interface"));
const editor_service_1 = __importDefault(require("./editors/editor-service"));
global.appRoot = path_1.default.resolve(__dirname, 'resources');
let window = null;
async function createWindow() {
    try {
        await editor_service_1.default.editors[0].checkPrerequisites();
    }
    catch (error) {
        electron_1.dialog.showErrorBox('Error Locating Visual Studio Code', error.message);
    }
    window = new electron_1.BrowserWindow({
        width: 320,
        height: 685,
        x: electron_1.screen.getPrimaryDisplay().size.width - 370,
        y: 50,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path_1.default.resolve(__dirname, 'preload.js')
        },
        icon: path_1.default.resolve(__dirname, 'icons', 'icon36x36.ico')
    });
    window.setMenuBarVisibility((0, utils_1.isDev)());
    window.webContents.on('new-window', function (e, url) {
        e.preventDefault();
        require('electron').shell.openExternal(url);
    });
    try {
        // Enforcing some headers required to access the api...
        const filter = { urls: [process.env.URL_FILTER] };
        electron_1.session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
            const headerName = process.env.SPEECH2CODE_HEADER_NAME;
            const headerValue = process.env.SPEECH2CODE_HEADER_VALUE;
            details.requestHeaders[headerName] = headerValue;
            details.requestHeaders['Speech2Code-Electron-Client-Version'] = utils_1.appVersion;
            callback({ requestHeaders: details.requestHeaders });
        });
        await spoken_1.default.init(await (0, utils_1.tryAndGetGrammarFromNetwork)(process.env.SERVICE_URL));
        await window.loadURL(process.env.SERVICE_URL);
    }
    catch (err) {
        const errPath = path_1.default.resolve(__dirname, 'error.html');
        console.log(err);
        console.log('Loading instead: ' + errPath);
        await window.loadFile(errPath);
        return;
    }
    const ret = electron_1.globalShortcut.register('CommandOrControl+X', () => {
        console.log('[wrapper.createWindow] Toggle Recording!');
        if (window != null) {
            window.webContents.send('VoiceRecognition:toggleRecording', !window.recording);
            window.recording = !window.recording;
        }
    });
    if (!ret) {
        console.log('[wrapper.createWindow] Registration failed');
    }
    editor_service_1.default.onStateChange((s) => { var _a, _b; return (_b = (_a = window === null || window === void 0 ? void 0 : window.webContents) === null || _a === void 0 ? void 0 : _a.send) === null || _b === void 0 ? void 0 : _b.call(_a, 'Config:onChangeEditorState', s); });
    editor_service_1.default.init();
    electron_1.ipcMain.on('Spoken:executeCommand', spoken_interface_1.default.onComand);
    electron_1.ipcMain.on('Config:changeEditor', (event, editor) => {
        if (editor)
            editor_service_1.default.setCurrentEditor(editor);
        event.reply('Config:onChangeEditorState', editor_service_1.default.state);
    });
    electron_1.ipcMain.on('VoiceRecognition:setRecording', (event, value) => {
        window.webContents.send('VoiceRecognition:toggleRecording', value);
        window.recording = value;
    });
}
electron_1.app.whenReady().then(createWindow);
electron_1.app.on('window-all-closed', () => {
    setTimeout(() => {
        editor_service_1.default.stop();
        electron_1.globalShortcut.unregister('CommandOrControl+X');
        // Unregister all shortcuts.
        electron_1.globalShortcut.unregisterAll();
        electron_1.app.quit();
    }, 1000);
});
