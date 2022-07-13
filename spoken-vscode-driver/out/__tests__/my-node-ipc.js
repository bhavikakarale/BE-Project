"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listen = exports.send = exports.server = exports.serve = exports.config = void 0;
exports.config = {
    id: '',
    retry: false,
    silent: false
};
const map = new Map();
let init = null;
let idInterval = null;
const queue = [];
function serve(cb) {
    init = cb;
}
exports.serve = serve;
exports.server = {
    start() {
        if (init == null)
            return;
        init();
        idInterval = setInterval(() => {
            const item = queue.splice(0, 1);
            if (!item.length)
                return;
            const { channel, event } = item[0];
            map.get(channel)(event, null);
        }, 700);
    },
    stop() {
        clearInterval(idInterval);
        map.clear();
        init = null;
    },
    on(channel, callback) {
        map.set(channel, callback);
    },
    emit(socket, channel, evt) {
        queue.push({ channel, event: evt });
    }
};
function send(channel, evt) {
    queue.push({ channel, event: evt });
}
exports.send = send;
function listen(channel, cb) {
    map.set(channel, cb);
}
exports.listen = listen;
//# sourceMappingURL=my-node-ipc.js.map