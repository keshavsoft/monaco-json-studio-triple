import { generateStudio } from 'monaco-json-studio-base';

function parsePaneSpec(spec, defaultSpec) {
    if (typeof spec === 'string') {
        const [header = defaultSpec.header, footer = defaultSpec.footer] = spec.split(':');
        return { header, footer };
    }
    return {
        header: spec?.header ?? defaultSpec.header,
        footer: spec?.footer ?? defaultSpec.footer
    };
}

export function createTripleStudio({
    pane1 = 'file-picker:cursor',
    pane2 = 'file-picker:cursor',
    pane3 = 'title:note',
    outputDir
} = {}) {
    const specs = [
        parsePaneSpec(pane1, { header: 'file-picker', footer: 'cursor' }),
        parsePaneSpec(pane2, { header: 'file-picker', footer: 'cursor' }),
        parsePaneSpec(pane3, { header: 'title', footer: 'note' })
    ];

    const slug = specs
        .map((s) => `${typeof s.header === 'string' ? s.header : s.header.type}-${typeof s.footer === 'string' ? s.footer : s.footer.type}`)
        .join('_');

    return generateStudio({
        title: 'Monaco Studio · Triple',
        badge: 'triple',
        outputDir: outputDir ?? `./monaco-triple-${slug}`,
        panes: specs.map((spec, index) => ({
            key: `pane${index + 1}`,
            label: `Pane ${index + 1}`,
            header: spec.header,
            body: { type: 'monaco', language: 'json' },
            footer: spec.footer
        }))
    });
}

export default createTripleStudio;
