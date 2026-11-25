import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Handlebars from 'handlebars';
import { HEADER_TYPES, renderHeader, assetsDir as headerAssetsDir } from 'monaco-json-studio-base-header';
import { normalizeBodyConfig, renderBody, assetsDir as bodyAssetsDir } from 'monaco-json-studio-base-body';
import { FOOTER_TYPES, renderFooter, assetsDir as footerAssetsDir } from 'monaco-json-studio-base-footer';

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.resolve(moduleDir, '..', '..', 'assets', 'v3');
const documentTemplate = Handlebars.compile(fs.readFileSync(path.join(assetsDir, 'templates', 'document.hbs'), 'utf8'));

function resolveUniqueDir(baseDir) {
    const resolved = path.resolve(process.cwd(), baseDir);
    if (!fs.existsSync(resolved)) return resolved;
    let i = 1;
    while (fs.existsSync(`${resolved}-${i}`)) i += 1;
    return `${resolved}-${i}`;
}

function copyTree(sourceDir, targetDir) {
    fs.mkdirSync(targetDir, { recursive: true });
    for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
        const srcPath = path.join(sourceDir, entry.name);
        const dstPath = path.join(targetDir, entry.name);
        if (entry.isDirectory()) {
            copyTree(srcPath, dstPath);
        } else {
            fs.copyFileSync(srcPath, dstPath);
        }
    }
}

export function createTripleStudio({
    header = 'file-picker',
    footer = 'status',
    url = '',
    panes,
    outputDir
} = {}) {
    const headerType = typeof header === 'string' ? header : (header?.type ?? 'file-picker');
    const footerType = typeof footer === 'string' ? footer : (footer?.type ?? 'status');
    const bodyConfig = normalizeBodyConfig({ layout: 'triple', url, panes });

    const headerHtml = renderHeader(typeof header === 'string' ? { type: headerType, label: 'Monaco Studio · Triple', badge: 'triple' } : header);
    const bodyHtml = renderBody(bodyConfig);
    const footerHtml = renderFooter(typeof footer === 'string' ? { type: footerType, brand: 'Monaco Studio · Triple', meta: '3 Panes Active' } : footer);

    const html = documentTemplate({
        title: 'Monaco Studio · Triple (v3)',
        headerHtml: new Handlebars.SafeString(headerHtml),
        bodyHtml: new Handlebars.SafeString(bodyHtml),
        footerHtml: new Handlebars.SafeString(footerHtml)
    });

    const targetDir = resolveUniqueDir(outputDir ?? `./monaco-triple-${headerType}-${footerType}`);
    const cssDir = path.join(targetDir, 'css');
    const dataDir = path.join(targetDir, 'data');
    const jsDir = path.join(targetDir, 'js');
    [cssDir, dataDir, jsDir].forEach((dir) => fs.mkdirSync(dir, { recursive: true }));

    fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');
    fs.copyFileSync(path.join(headerAssetsDir, 'css', 'header.css'), path.join(cssDir, 'header.css'));
    fs.copyFileSync(path.join(bodyAssetsDir, 'css', 'body.css'), path.join(cssDir, 'body.css'));
    fs.copyFileSync(path.join(footerAssetsDir, 'css', 'footer.css'), path.join(cssDir, 'footer.css'));
    fs.copyFileSync(path.join(assetsDir, 'css', 'studio.css'), path.join(cssDir, 'studio.css'));

    copyTree(path.join(headerAssetsDir, 'js'), path.join(jsDir, 'header'));
    copyTree(path.join(bodyAssetsDir, 'js', 'body'), path.join(jsDir, 'body'));
    copyTree(path.join(bodyAssetsDir, 'js', 'monaco'), path.join(jsDir, 'monaco'));
    copyTree(path.join(footerAssetsDir, 'js'), path.join(jsDir, 'footer'));
    fs.copyFileSync(path.join(assetsDir, 'js', 'index.js'), path.join(jsDir, 'index.js'));

    bodyConfig.panes.forEach((pane) => {
        fs.writeFileSync(path.join(dataDir, pane.fileName), `${pane.contentText}\n`, 'utf8');
    });

    const stateSource = [
        `export const paneConfigs = ${JSON.stringify(bodyConfig.panes, null, 2)};`,
        'export const state = { activePane: 0, editors: [] };',
        ''
    ].join('\n');
    fs.writeFileSync(path.join(jsDir, 'state.js'), stateSource, 'utf8');

    return targetDir;
}

export { HEADER_TYPES, FOOTER_TYPES };
export default createTripleStudio;
