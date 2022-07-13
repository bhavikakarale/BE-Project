"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock('../vscode', () => {
    const Fake = require('./my-vscode');
    return Object.assign({}, Fake);
});
jest.mock('node-ipc', () => {
    const Fake = require('./my-node-ipc');
    return Object.assign({}, Fake);
});
jest.mock('../robot-vscode');
const extension_1 = require("../extension");
const my_node_ipc_1 = require("./my-node-ipc");
const robot_vscode_1 = require("../robot-vscode");
beforeAll(() => {
    extension_1.activate(new FakeExtensionContext());
});
afterAll(() => {
    extension_1.deactivate();
});
test('it does not break', (done) => {
    my_node_ipc_1.send('runCommand', {
        type: 'write',
        context: {},
        extra: {
            args: ['hello man']
        },
        id: 42
    });
    my_node_ipc_1.listen('runCommand/response', (evt) => {
        expect(evt.id).toBe(42);
        expect(robot_vscode_1.default.write).toHaveBeenCalledWith('hello man');
        done();
    });
});
class FakeExtensionContext {
    constructor() {
        this.subscriptions = [];
    }
}
//# sourceMappingURL=integration.test.js.map