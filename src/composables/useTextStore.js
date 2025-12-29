import { ref, watch } from 'vue';

import { loadSavedTexts, saveSavedTexts } from '../utils/storage';

let textStore = null;

export function useTextStore() {
    if (textStore) {
        return textStore;
    }

    const text = ref('');
    const savedTexts = ref(loadSavedTexts());

    watch(
        savedTexts,
        () => {
            saveSavedTexts(savedTexts.value);
        },
        { deep: true },
    );

    textStore = { text, savedTexts };

    return textStore;
}
