#!/usr/bin/env node
import { HEADER_TYPES, FOOTER_TYPES } from 'monaco-json-studio-base';
import { createTripleStudio } from '../src/index.js';

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Monaco JSON Studio · Triple

Usage:
  npx monaco-json-studio-triple [pane1] [pane2] [pane3]

Each pane uses <header>:<footer?>:
  header : ${HEADER_TYPES.join(' | ')}
  footer : ${FOOTER_TYPES.join(' | ')}

Examples:
  npx monaco-json-studio-triple
  npx monaco-json-studio-triple file-picker:cursor select:cursor title:note
  npx monaco-json-studio-triple file-picker:cursor
`);
    process.exit(0);
}

const pane1 = args[0] ?? 'file-picker:cursor';
const pane2 = args[1] ?? (args.length === 1 ? pane1 : 'file-picker:cursor');
const pane3 = args[2] ?? (args.length === 1 ? pane1 : 'title:note');

try {
    const targetDir = createTripleStudio({ pane1, pane2, pane3 });
    console.log(`Generated Triple Studio (${pane1} | ${pane2} | ${pane3}).`);
    console.log(`Open: ${targetDir}/index.html`);
} catch (error) {
    console.error(`Could not generate Triple Studio: ${error.message}`);
    process.exit(1);
}
