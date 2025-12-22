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
 *  isHelpOpen: () => boolean,
 *  closeHelp: () => void,
 *  recalcMetrics: () => void,
 * }} options
 */
export function useReaderShortcuts(options) {
    const onKeydown = (event) => {
        console.log('LOG ::: useReaderShortcuts.js : event:', event);

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
        if (event.key === 'Escape') {
            event.preventDefault();

            if (options.isHelpOpen()) {
                options.closeHelp();
            }

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
            options.settings.fontSize = Math.min(100, Number(options.settings.fontSize) + 2);
            options.recalcMetrics();

            return;
        }
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            options.settings.fontSize = Math.max(10, Number(options.settings.fontSize) - 2);
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
