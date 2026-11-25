#!/usr/bin/env node
import { HEADER_TYPES, FOOTER_TYPES, createTripleStudio } from '../src/index.js';

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Monaco JSON Studio · Triple (v2)

Usage:
  npx monaco-json-studio-triple [header] [footer]

Options:
  header : ${HEADER_TYPES.join(' | ')} (default: file-picker)
  footer : ${FOOTER_TYPES.join(' | ')} (default: status)

Examples:
  npx monaco-json-studio-triple
  npx monaco-json-studio-triple file-picker status
  npx monaco-json-studio-triple select stats
  npx monaco-json-studio-triple actions cursor
`);
    process.exit(0);
}

const [header = 'file-picker', footer = 'status'] = args;

try {
    const targetDir = createTripleStudio({ header, footer });
    console.log(`Generated Triple Studio v2 (${header} / ${footer}).`);
    console.log(`Open: ${targetDir}/index.html`);
} catch (error) {
    console.error(`Could not generate Triple Studio: ${error.message}`);
    process.exit(1);
}
