## Creates a function

Creates a function with the desired number of args and return value

### Languages

This command is available in the following languages

#### English

The following automata is responsible for recognizing the command `Creates a function` in english:

![English](phrase_en-US.png)

The following are some examples of phrases, in english, used to trigger the command `Creates a function`:

1. declare function a
2. create function graph 1 arguments
3. declare function graph 42 arguments return [expressions]
4. create function value return [expressions]
5. return [expressions]

#### Português

O automata seguinte é reponsável por reconhecer o comando `Cria uma função` em português:

![Português](phrase_pt-BR.png)

Os seguintes exemplos de frases, em português, podem ser usadas para ativar o comando `Cria uma função`:

1. crie função a
2. crie função temp 1 argumentos
3. nova função temp 42 argumentos retornando [expressions]
4. declare função valor retorna [expressions]
5. retorne [expressions]

### Implementation

The full implementation of this command can be found on this directory under the file [impl.ts](impl.ts)

```typescript
import { Context } from '../../../modules-loader'
import { ParsedPhrase, Editor, WildCard } from '../../d'

async function FunctionDeclaration(command: FunctionDeclarationParsedArgs, editor: Editor, context: Context) {
    console.log('[Spoken]: Executing: "FunctionDeclaration"')

    const an

(...)
```