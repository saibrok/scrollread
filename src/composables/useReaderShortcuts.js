import { onBeforeUnmount, onMounted } from 'vue';

/**
 * Bind keyboard shortcuts for reader.
 * @param {{
 *  isOpen: () => boolean,
 *  settings: Record<string, any>,
 *  setSpeedMultiplier: (multiplier: number | null) => void,
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
    const clampSpeed = (value) => {
        const normalized = Math.round(Number(value) / 100) * 100;

        return Math.min(2000, Math.max(100, normalized));
    };

    const multiplierState = {
        isFastHeld: false,
        isSlowHeld: false,
        activeMultiplier: 1,
    };

    const updateMultiplierState = () => {
        let nextMultiplier = 1;

        if (multiplierState.isFastHeld && !multiplierState.isSlowHeld) {
            nextMultiplier = 2;
        } else if (multiplierState.isSlowHeld && !multiplierState.isFastHeld) {
            nextMultiplier = 0.5;
        }

        if (multiplierState.activeMultiplier === nextMultiplier) {
            return;
        }

        multiplierState.activeMultiplier = nextMultiplier;
        options.setSpeedMultiplier(nextMultiplier === 1 ? null : nextMultiplier);
    };

    const adjustSpeed = (delta) => {
        const nextBase = clampSpeed(Number(options.settings.speed) + delta);

        options.settings.speed = nextBase;
        options.recalcMetrics();
    };

    const onKeydown = (event) => {
        console.log('LOG ::: useReaderShortcuts.js : event:', event);

        if (!options.isOpen()) {
            return;
        }
        if (event.code === 'Space') {
            event.preventDefault();
            options.togglePlay();

            return;
        }
        if (event.code === 'Escape') {
            event.preventDefault();

            if (options.isHelpOpen()) {
                options.closeHelp();
            }

            return;
        }
        if (event.code === 'KeyF') {
            event.preventDefault();
            options.handleFullscreen();

            return;
        }
        if (event.code === 'ArrowUp') {
            event.preventDefault();
            adjustSpeed(100);

            return;
        }
        if (event.code === 'ArrowDown') {
            event.preventDefault();
            adjustSpeed(-100);

            return;
        }
        if (event.code === 'ArrowRight') {
            event.preventDefault();
            options.settings.fontSize = Math.min(100, Number(options.settings.fontSize) + 2);
            options.recalcMetrics();

            return;
        }
        if (event.code === 'ArrowLeft') {
            event.preventDefault();
            options.settings.fontSize = Math.max(10, Number(options.settings.fontSize) - 2);
            options.recalcMetrics();

            return;
        }
        if (event.code === 'KeyW') {
            event.preventDefault();
            multiplierState.isFastHeld = true;
            updateMultiplierState();

            return;
        }
        if (event.code === 'KeyS') {
            event.preventDefault();
            multiplierState.isSlowHeld = true;
            updateMultiplierState();

            return;
        }
        if (event.code === 'Home') {
            event.preventDefault();
            options.jumpToEdge(false);

            return;
        }
        if (event.code === 'End') {
            event.preventDefault();
            options.jumpToEdge(true);
        }
    };

    const onKeyup = (event) => {
        if (event.code === 'KeyW') {
            multiplierState.isFastHeld = false;
            updateMultiplierState();
        }
        if (event.code === 'KeyS') {
            multiplierState.isSlowHeld = false;
            updateMultiplierState();
        }
    };

    onMounted(() => {
        window.addEventListener('keydown', onKeydown);
        window.addEventListener('keyup', onKeyup);
    });

    onBeforeUnmount(() => {
        window.removeEventListener('keydown', onKeydown);
        window.removeEventListener('keyup', onKeyup);
    });
}
