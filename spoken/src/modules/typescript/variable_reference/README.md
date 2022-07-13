## References a variable

Writes a variable or constant in the editor

### Languages

This command is available in the following languages

#### English

The following automata is responsible for recognizing the command `References a variable` in english:

![English](phrase_en-US.png)

The following are some examples of phrases, in english, used to trigger the command `References a variable`:

1. reference constant graph
2. reference namespace text
3. variable value
4. namespace graph
5. reference variable called [multi_word_token]
6. reference namespace called [multi_word_token]
7. constant called [multi_word_token]
8. namespace called [multi_word_token]

#### Português

O automata seguinte é reponsável por reconhecer o comando `Referencia a uma variável` em português:

![Português](phrase_pt-BR.png)

Os seguintes exemplos de frases, em português, podem ser usadas para ativar o comando `Referencia a uma variável`:

1. refira constante numero
2. refira namespace a
3. variável texto
4. namespace texto
5. referência variável chamada [multi_word_token]
6. referência namespace chamada [multi_word_token]
7. constante chamada [multi_word_token]
8. namespace chamada [multi_word_token]

### Implementation

The full implementation of this command can be found on this directory under the file [impl.ts](impl.ts)

```typescript
import { Context } from '../../../modules-loader'
import { ParsedPhrase, Editor, WildCard } from '../../d'

async function VariableReference(command: VariableReferenceParsedArgs, editor: Editor, context: {}) {
    console.log('[Spoken]: Executing: "VariableReference"')

    let { varName, pare

(...)
```