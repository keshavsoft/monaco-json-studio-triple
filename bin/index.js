#!/usr/bin/env node
import { HEADER_TYPES, FOOTER_TYPES, createTripleStudio } from '../src/index.js';

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Monaco JSON Studio · Triple (v3)

Usage:
  npx monaco-json-studio-triple [header] [footer] [--url <endpoint>]

Options:
  header : ${HEADER_TYPES.join(' | ')} (default: file-picker)
  footer : ${FOOTER_TYPES.join(' | ')} (default: status)
  --url  : Optional JSON endpoint or path to load initially in Pane 1

Examples:
  npx monaco-json-studio-triple
  npx monaco-json-studio-triple file-picker status
  npx monaco-json-studio-triple select stats --url https://jsonplaceholder.typicode.com/todos/1
`);
    process.exit(0);
}

const urlIndex = args.indexOf('--url');
const url = urlIndex !== -1 ? (args[urlIndex + 1] ?? '') : '';
const positional = args.filter((arg, i) => arg !== '--url' && (urlIndex === -1 || i !== urlIndex + 1));
const [header = 'file-picker', footer = 'status'] = positional;

try {
    const targetDir = createTripleStudio({ header, footer, url });
    console.log(`Generated Triple Studio v3 (${header} / ${footer}${url ? ` / url=${url}` : ''}).`);
    console.log(`Open: ${targetDir}/index.html`);
} catch (error) {
    console.error(`Could not generate Triple Studio: ${error.message}`);
    process.exit(1);
}
