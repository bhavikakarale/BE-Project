"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryAndGetGrammarFromNetwork = exports.appVersion = exports.isDev = void 0;
function isDev() {
    var _a, _b, _c;
    return ((_c = (_b = (_a = process === null || process === void 0 ? void 0 : process.mainModule) === null || _a === void 0 ? void 0 : _a.filename) === null || _b === void 0 ? void 0 : _b.indexOf) === null || _c === void 0 ? void 0 : _c.call(_b, 'app.asar')) === -1;
}
exports.isDev = isDev;
exports.appVersion = require('../package.json').version;
/**
 * Really this is a bad idea.
 * The grammar and the mechanism responsible
 * for recognizing said grammar will differ in version...
 */
function tryAndGetGrammarFromNetwork(url) {
    const { net } = require('electron');
    return new Promise((res, rej) => {
        const request = net.request(url + '/grammar.json');
        request.on('response', (response) => {
            const result = [];
            response.on('data', (chunk) => {
                result.push(new TextDecoder().decode(chunk));
            });
            response.on('end', () => {
                const g = result.join('');
                if (g == null && g == '')
                    return res(null);
                try {
                    const p = JSON.parse(g);
                    console.log('Using spoken grammar provided by webapp!');
                    res(p);
                }
                catch (e) {
                    res(null);
                }
            });
        });
        request.on('error', (e) => res(null));
        request.end();
    });
}
exports.tryAndGetGrammarFromNetwork = tryAndGetGrammarFromNetwork;
