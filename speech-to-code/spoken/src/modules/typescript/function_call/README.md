## Calls a function

> 🤖 This document was auto generated by spoken/src/build/build-docs.js

Calls a function with the specified arguments in the desired caller

### Languages

This command is available in the following languages

#### English

The following automata is responsible for recognizing the command `Calls a function` in english:

![English](phrase_en-US.png)

The following are some examples of phrases, in english, used to trigger the command `Calls a function`:

1. call function [multi_word_token]
2. call function [multi_word_token]
3. execute function number
4. execute function [multi_word_token] [expressions]
5. execute function [multi_word_token] of [expressions]
6. execute function text [expressions]
7. call function graph at [expressions]
8. execute function [multi_word_token] [expressions] arguments [expressions]
9. call function [multi_word_token] arguments [expressions]
10. execute function [multi_word_token] of [expressions] arguments [expressions]
11. execute function a [expressions] arguments [expressions]
12. call function text arguments [expressions]
13. execute function graph at [expressions] arguments [expressions]
14. execute function [multi_word_token] [expressions] 1 arguments
15. execute function [multi_word_token] 1 arguments
16. call function [multi_word_token] on [expressions] 1 arguments

#### Português

O automata seguinte é reponsável por reconhecer o comando `Chama uma função` em português:

![Português](phrase_pt-BR.png)

Os seguintes exemplos de frases, em português, podem ser usadas para ativar o comando `Chama uma função`:

1. chamar função [multi_word_token]
2. chame função [multi_word_token]
3. chamar função texto
4. execute função [multi_word_token] [expressions]
5. execute função [multi_word_token] da [expressions]
6. chamar função texto [expressions]
7. execute função texto do [expressions]
8. chamar função [multi_word_token] [expressions] argumentos [expressions]
9. execute função [multi_word_token] argumentos [expressions]
10. chame função [multi_word_token] do [expressions] argumentos [expressions]
11. chame função numero [expressions] argumentos [expressions]
12. execute função temp argumentos [expressions]
13. chame função a do [expressions] argumentos [expressions]
14. execute função [multi_word_token] [expressions] 42 argumentos
15. chamar função [multi_word_token] 42 argumentos
16. chame função [multi_word_token] do [expressions] 1 argumentos

### Implementation

The full implementation of this command can be found on this directory under the file [impl.ts](impl.ts)

```typescript
import { Context } from '../../../modules-loader'
import { ParsedPhrase, Editor, WildCard } from '../../d'

async function FunctionCall(command: FunctionCallParsedArgs, editor: Editor, context: Context) {
    console.log('[Spoken]: Executing: "FunctionCall"')

    const anything = context.temp

(...)
```