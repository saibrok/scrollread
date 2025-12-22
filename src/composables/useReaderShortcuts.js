import { onBeforeUnmount, onMounted } from 'vue';

/**
 * Bind keyboard shortcuts for reader.
 * @param {{
 *  isOpen: () => boolean,
 *  settings: Record<string, any>,
 *  togglePlay: () => void,
 *  jumpToEdge: (toEnd: boolean) => void,
 *  handleFullscreen: () => void,
 *  handleClose: () => void,
 *  openHelp: () => void,
 *  recalcMetrics: () => void,
 * }} options
 */
export function useReaderShortcuts(options) {
    const onKeydown = (event) => {
        if (!options.isOpen()) {
            return;
        }
        const tagName = event.target.tagName?.toLowerCase();

        if (['input', 'textarea', 'select'].includes(tagName)) {
            return;
        }
        if (event.code === 'Space') {
            event.preventDefault();
            options.togglePlay();

            return;
        }
        if (event.key === '?') {
            event.preventDefault();
            options.openHelp();

            return;
        }
        if (event.key === 'Escape') {
            event.preventDefault();
            options.handleClose();

            return;
        }
        if (event.key.toLowerCase() === 'f') {
            event.preventDefault();
            options.handleFullscreen();

            return;
        }
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            options.settings.speed = Math.min(2000, Number(options.settings.speed) + 100);
            options.recalcMetrics();

            return;
        }
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            options.settings.speed = Math.max(100, Number(options.settings.speed) - 100);
            options.recalcMetrics();

            return;
        }
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            options.settings.readerFontSize = Math.min(100, Number(options.settings.readerFontSize) + 2);
            options.recalcMetrics();

            return;
        }
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            options.settings.readerFontSize = Math.max(10, Number(options.settings.readerFontSize) - 2);
            options.recalcMetrics();

            return;
        }
        if (event.key === 'Home') {
            event.preventDefault();
            options.jumpToEdge(false);

            return;
        }
        if (event.key === 'End') {
            event.preventDefault();
            options.jumpToEdge(true);
        }
    };

    onMounted(() => {
        window.addEventListener('keydown', onKeydown);
    });

    onBeforeUnmount(() => {
        window.removeEventListener('keydown', onKeydown);
    });
}
