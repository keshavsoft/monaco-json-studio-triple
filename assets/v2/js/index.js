import { bindEvents } from 'https://keshavsoft.github.io/dom-primitive-bindings/dist/v7/min.js';
import bindings from './header/bindings.json' with { type: 'json' };
import baseHeaderActions from './header/actions.js';
import { paneConfigs, state } from './state.js';
import { loadMonaco, loadInitialValue, mountMonacoEditor } from './body/monaco.js';
import { updateCursor, updateStats } from './footer/cursor.js';

function getActiveEditor() {
    return state.editors[state.activePane] ?? state.editors[0];
}

function prettyJson(text) {
    try {
        return JSON.stringify(JSON.parse(text), null, 2);
    } catch {
        return text;
    }
}

const studioActions = {
    ...baseHeaderActions,

    handleFileSelect: (event, matchElement) => {
        baseHeaderActions.handleFileSelect(event, matchElement);
        const file = matchElement.files?.[0];
        const editor = getActiveEditor();
        if (!file || !editor) return;

        const reader = new FileReader();
        reader.onload = () => {
            editor.setValue(prettyJson(String(reader.result ?? '')));
        };
        reader.readAsText(file);
    },

    handleSelectChange: async (event, matchElement) => {
        baseHeaderActions.handleSelectChange(event, matchElement);
        const editor = getActiveEditor();
        if (!editor) return;
        const value = await loadInitialValue(`${matchElement.value}.json`);
        editor.setValue(value);
    },

    handleHeaderAction: (event, matchElement) => {
        baseHeaderActions.handleHeaderAction(event, matchElement);
        const editor = getActiveEditor();
        if (!editor) return;

        const actionName = matchElement.dataset.headerAction;
        if (actionName === 'format') {
            editor.setValue(prettyJson(editor.getValue()));
        } else if (actionName === 'copy' && navigator.clipboard) {
            navigator.clipboard.writeText(editor.getValue()).catch(() => {});
        }
    }
};

async function start() {
    const monaco = await loadMonaco();
    await Promise.all(paneConfigs.map(async (pane, index) => {
        const container = document.getElementById(pane.editorId);
        if (!container) return;

        const value = await loadInitialValue(pane.fileName);
        const editor = mountMonacoEditor(monaco, container, {
            language: pane.language,
            value
        });
        state.editors[index] = editor;

        const refreshFooter = () => {
            updateCursor(editor, { ...pane, label: `Pane ${pane.paneNumber}` });
            updateStats(editor.getValue());
        };

        editor.onDidFocusEditorText(() => {
            state.activePane = index;
            refreshFooter();
        });
        editor.onDidChangeCursorPosition(refreshFooter);
        editor.onDidChangeModelContent(refreshFooter);
        refreshFooter();
    }));

    bindEvents(document.querySelector('.studio-app'), bindings, studioActions);
}

start();
