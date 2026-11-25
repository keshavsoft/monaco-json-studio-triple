import { bindEvents } from 'https://keshavsoft.github.io/dom-primitive-bindings/dist/v7/min.js';
import bindings from './header/bindings.json' with { type: 'json' };
import baseHeaderActions from './header/actions.js';
import { paneConfigs, state } from './state.js';
import { initMonacoPanes, getActiveEditor, setValue, formatEditor, loadInitialValue } from './monaco/index.js';
import { updateCursor, updateStats } from './footer/cursor.js';

const studioActions = {
    ...baseHeaderActions,

    handleFileSelect: (event, matchElement) => {
        baseHeaderActions.handleFileSelect(event, matchElement);
        const file = matchElement.files?.[0];
        const editor = getActiveEditor(state);
        if (!file || !editor) return;

        const reader = new FileReader();
        reader.onload = () => setValue(editor, reader.result);
        reader.readAsText(file);
    },

    handleSelectChange: async (event, matchElement) => {
        baseHeaderActions.handleSelectChange(event, matchElement);
        const editor = getActiveEditor(state);
        if (!editor) return;
        setValue(editor, await loadInitialValue(`${matchElement.value}.json`));
    },

    handleHeaderAction: (event, matchElement) => {
        baseHeaderActions.handleHeaderAction(event, matchElement);
        const editor = getActiveEditor(state);
        if (!editor) return;

        const actionName = matchElement.dataset.headerAction;
        if (actionName === 'format') formatEditor(editor);
        if (actionName === 'copy' && navigator.clipboard) {
            navigator.clipboard.writeText(editor.getValue()).catch(() => {});
        }
    }
};

async function start() {
    await initMonacoPanes(paneConfigs, state, {
        onPaneUpdate: (editor, pane) => {
            updateCursor(editor, { ...pane, label: `Pane ${pane.paneNumber}` });
            updateStats(editor.getValue());
        }
    });

    bindEvents(document.querySelector('.studio-app'), bindings, studioActions);
}

start();
