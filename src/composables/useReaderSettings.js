import { reactive, watch } from 'vue';

import { loadReaderSettings, READER_DEFAULTS, saveReaderSettings } from '../utils/storage';

let readerStore = null;

export function useReaderSettings() {
    if (readerStore) {
        return readerStore;
    }

    const readerSettings = reactive(loadReaderSettings());

    function resetReaderSettings() {
        Object.assign(readerSettings, READER_DEFAULTS);
    }

    watch(
        readerSettings,
        () => {
            saveReaderSettings({ ...readerSettings });
        },
        { deep: true },
    );

    readerStore = { readerSettings, resetReaderSettings };

    return readerStore;
}
