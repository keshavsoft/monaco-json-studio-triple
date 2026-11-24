# monaco-json-studio-triple

Dedicated 3-pane static Monaco JSON Studio generator built on `monaco-json-studio-base`.

- **npm**: [https://www.npmjs.com/package/monaco-json-studio-triple](https://www.npmjs.com/package/monaco-json-studio-triple)
- **Suite Story & Docs**: [https://keshavsoft.github.io/monaco-json-studio-docs/triple.html](https://keshavsoft.github.io/monaco-json-studio-docs/triple.html)
- **Repo Docs**: [./docs/index.html](./docs/index.html) | [https://keshavsoft.github.io/monaco-json-studio-triple/](https://keshavsoft.github.io/monaco-json-studio-triple/)

## Why It Exists

Three-pane pipelines (Input → Spec/Rules → Output) need three independent columns with distinct defaults and per-pane controls. Built on `monaco-json-studio-base`, Triple keeps CLI usage straightforward and generates non-overwriting output folders.

## CLI Usage

```bash
npx monaco-json-studio-triple
npx monaco-json-studio-triple file-picker:cursor select:cursor title:note
npx monaco-json-studio-triple file-picker:cursor
```

## Programmatic Usage

```js
import { createTripleStudio } from 'monaco-json-studio-triple';

createTripleStudio({
  pane1: 'file-picker:cursor',
  pane2: 'file-picker:cursor',
  pane3: 'title:note'
});
```
