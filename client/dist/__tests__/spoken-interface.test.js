"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Keep this file open in vscode and run `npm run test`
 * (all the lines above will automatically edited by the comands on this file)
 * (Spoken extension need to be installed in vscode)
 */
const spoken_1 = __importDefault(require("spoken"));
const spoken_interface_1 = __importDefault(require("../spoken-interface"));
const editor_service_1 = __importDefault(require("../editors/editor-service"));
function execute(text, lang = 'en-US') {
    return new Promise((res, rej) => {
        const result = findComand({ text }, lang);
        if (result == null)
            return rej('Not found 404');
        return spoken_interface_1.default.onComand(new FakeIPCEvent(res, rej), result);
    });
}
async function Main() {
    try {
        editor_service_1.default.onStateChange((s) => console.log(s));
        editor_service_1.default.init();
        await spoken_1.default.init();
        await selectTest();
        await newVariableTest();
        await mathExpressionTest();
        await executeFunctionTest();
        await conditionTest();
        await repetitionTest();
        await newFunctionTest();
    }
    catch (err) {
        console.log(err.toString());
    }
    finally {
        editor_service_1.default.stop();
    }
}
async function newFunctionTest() {
    await execute('go to line 4', 'en-US');
    await execute('nova função bola com 3 argumentos retornando número 5', 'pt-BR');
    await execute('go to line 5');
    await wait(3000);
    await execute('go to line 7');
    await execute('new function ball with one arguments returning gap');
    await wait(4000);
    await execute('select from line 4 to line 9');
    await execute('write it down');
    await execute('new line');
}
async function repetitionTest() {
    await execute('go to line 4', 'en-US');
    await execute('estrutura de repetição', 'pt-BR');
    await execute('go to line 5');
    await execute('repetition statement for every item of variable list');
    await execute('go to line 6');
    await execute('estrutura de repetição do número 4 até o número 24 etapa expressão variável i mais número 4', 'pt-BR');
    await execute('go to line 7');
    await execute('estrutura condicional expressão variável valor igual a número 42', 'pt-BR');
    await wait(4000);
    await execute('select from line 4 to line 12');
    await execute('write it down');
}
async function conditionTest() {
    await execute('go to line 4', 'en-US');
    await execute('estrutura condicional se se não expressão número 5 maior que número 6', 'pt-BR');
    await execute('go to line 9');
    await execute('estrutura condicional expressão variável valor igual a número 42', 'pt-BR');
    await execute('go to line 12');
    await execute('conditional statement if else call function * is empty * on variable list');
    await wait(4000);
    await execute('select from line 4 to line 16');
    await execute('write it down');
    await execute('new line');
    await execute('new line');
}
async function executeFunctionTest() {
    await wait(1000);
    await execute('go to line 4');
    await execute('execute a função bola da string hello string com 3 argumentos', 'pt-BR');
    await execute('go to line 5');
    await execute('execute a função bola com os argumentos número 4 e número 8', 'pt-BR');
    await execute('go to line 6');
    await execute('execute a função thing do número 10 com os argumentos número 4 e número 8 e string hello string', 'pt-BR');
    await wait(3000);
    await execute('select from line 4 to line 6');
    await execute('write it down');
    await execute('new line');
    await execute('new line');
    await execute('go to line 4');
    await execute('execute a função * to string * da variável console com 2 argumentos', 'pt-BR');
    await execute('go to line 5');
    await execute('execute a função * to integer * do número 83 com os argumentos número 2 e número 5', 'pt-BR');
    await execute('go to line 6');
    await execute('call function log of variable console with arguments string hello world string');
    await wait(3000);
    await execute('select from line 4 to line 6');
    await execute('write it down');
    await execute('new line');
    await execute('new line');
}
async function newVariableTest() {
    await wait(1000);
    await execute('go to line 4');
    await execute('new variable phrase equals string hello doctor who are you string');
    await wait(2000);
    await execute('select from line 4 to line 4');
    await execute('write it down');
    await execute('variável bola igual a texto olá eu sou o doutor texto', 'pt-BR');
    await wait(2000);
    await execute('select from line 4 to line 4');
    await execute('write it down');
    await execute('go to line 4');
    await execute('variável bola igual a gap', 'pt-BR');
    await wait(3000);
    await execute('string minha bola é quadradade string', 'pt-BR');
    await wait(3000);
    await execute('select from line 4 to line 4');
    await execute('write it down');
    await execute('go to line 4');
    await execute('nova constante chamada bola igual a número 98', 'pt-BR');
    await wait(3000);
    await execute('go to line 5');
    await execute('variável bola igual a string hello doctor string', 'pt-BR');
    await wait(3000);
    await execute('go to line 6');
    await execute('nova variável chamada * bola gorda * igual a gap', 'pt-BR');
    await wait(3000);
    await execute('string Mrs. Robinson string', 'pt-BR');
    await wait(3000);
    await execute('select from line 4 to line 6', 'en-US');
    await execute('write it down');
    await execute('new line');
    await execute('new line');
}
async function selectTest() {
    await execute('go to line 4', 'en-US');
    await execute('write it down I am a the green down doctor down doutorAmarelo', 'en-US');
    await execute('new line below', 'en-US');
    await execute('write it down no! you are not', 'en-US');
    await execute('selecione da linha número 4 até a linha 6', 'pt-BR');
    await wait(2000);
    await execute('go to line 4', 'en-US');
    await execute('select the word a');
    await wait(1000);
    await execute('please select the word green');
    await wait(1000);
    await execute('select from second symbol a to r');
    await wait(2000);
    await execute('selecione a palavra down', 'pt-BR');
    await wait(1000);
    await execute('selecione a segunda palavra down', 'pt-BR');
    await wait(1000);
    await execute('selecione a palavra * doutor amarelo *', 'pt-BR');
    await wait(1000);
    await execute('selecione da segunda letra a até a letra a', 'pt-BR');
    await wait(2000);
    await execute('selecione da letra a até a letra a', 'pt-BR');
    await wait(2000);
    await execute('select from line 4 to line 6', 'en-US');
    await execute('write it down', 'en-US');
    await execute('new line below', 'en-US');
    await execute('go to line 4', 'en-US');
}
async function mathExpressionTest() {
    await wait(3000);
    await execute('go to line 4');
    await execute('expression number 4 plus string bola string minus variable value');
    await execute('go to line 5');
    await execute('new variable value equals gap');
    await wait(3000);
    await execute('expression string your age is string plus number 22');
    await wait(3000);
    await execute('go to line 6');
    await execute('new constant age equals expression number 2021 minus number 1998');
    await wait(3000);
    await execute('new line');
    await execute('new variable called * big bob * equals expression gap plus gap times number 4');
    await wait(4000);
    await execute('new line');
    await execute('expression gap plus gap times number 4 plus string hello doctor string');
    await wait(4000);
    await execute('select from line 4 to line 8');
    await execute('write it down');
    await execute('new line');
    await execute('new line');
    await execute('go to line 4');
    await execute('expression call function* is full * or variable current greater or equal than gap');
    await execute('go to line 5');
    await execute('expressão variável valor maior ou igual a gap não igual a variável final menos número 5', 'pt-BR');
    await wait(4000);
    await execute('select from line 4 to line 5');
    await execute('write it down');
    await execute('new line');
}
const wait = (t) => new Promise((res, rej) => setTimeout(res, t));
class FakeIPCEvent {
    constructor(res, rej) {
        this.res = res;
        this.rej = rej;
        this.res = res;
        this.rej = rej;
    }
    reply(channel, result) {
        if (result.err)
            return this.rej(result.err);
        return this.res(result.result);
    }
}
function findComand(voiceToTextResponse, language) {
    const text = sanitizePonctuation(voiceToTextResponse.text);
    const result = spoken_1.default.recognizePhrase(text.toLocaleLowerCase(), language);
    if (result != null) {
        result.extra._rawVoiceToTextResponse = voiceToTextResponse;
        result.extra.phrase = text;
        console.log('\nArgs:');
        console.log(result.args);
        console.log('\n');
    }
    return result;
}
function sanitizePonctuation(text) {
    return text.replace(/(?<! )(:|\*|,|\.|\?|!)/gi, ' $1');
}
Main();
