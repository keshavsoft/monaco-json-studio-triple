# monaco-json-studio-triple

3-pane static Monaco JSON Studio generator composing base-header, base-body (triple), and base-footer.

- **npm**: [https://www.npmjs.com/package/monaco-json-studio-triple](https://www.npmjs.com/package/monaco-json-studio-triple)
- **GitHub**: [https://github.com/keshavsoft/monaco-json-studio-triple](https://github.com/keshavsoft/monaco-json-studio-triple)
- **Docs**: [https://keshavsoft.github.io/monaco-json-studio-triple/](https://keshavsoft.github.io/monaco-json-studio-triple/) ([Story](./docs/story.html) · [npx](./docs/npx-usage.html) · [npm](./docs/npm-usage.html) · [Dependencies](./docs/dependencies.html))
- **Suite**: [Studio Docs](https://keshavsoft.github.io/monaco-json-studio-docs/triple.html)

## CLI (`npx`)

```bash
npx monaco-json-studio-triple
npx monaco-json-studio-triple file-picker status
npx monaco-json-studio-triple select stats
```

## Programmatic (`npm`)

```bash
npm install monaco-json-studio-triple
```

```js
import { createTripleStudio } from 'monaco-json-studio-triple';

createTripleStudio({ header: 'actions', footer: 'status' });
```
