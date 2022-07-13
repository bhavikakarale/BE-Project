"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const utils_1 = require("./utils");
electron_1.contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, ...data) => {
        electron_1.ipcRenderer.send(channel, ...data);
    },
    on: (channel, func) => {
        electron_1.ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
    removeAllListeners: (str) => {
        electron_1.ipcRenderer.removeAllListeners(str);
    }
});
electron_1.contextBridge.exposeInMainWorld('electronShellInfo', {
    appVersion: utils_1.appVersion
});
