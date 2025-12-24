import { nextTick, ref } from 'vue';

import { countChars } from '../utils/text';

/**
 * Create reader scroll player.
 * @param {{
 *  getText: () => string,
 *  getSpeed: () => number,
 *  stageRef: import('vue').Ref<HTMLElement | null>,
 *  textRef: import('vue').Ref<HTMLElement | null>,
 * }} options
 */
export function useReaderPlayer({ getText, getSpeed, stageRef, textRef }) {
    const isPlaying = ref(false);
    const animationId = ref(null);
    const startTimestamp = ref(0);
    const accumulatedElapsed = ref(0);
    const totalDuration = ref(0);
    const totalDistance = ref(0);
    const currentSeconds = ref(0);
    const wheelAnimId = ref(null);
    const wheelTargetElapsed = ref(0);
    const touchStartY = ref(0);
    const touchStartElapsed = ref(0);
    const touchActive = ref(false);

    /**
     * Measure scroll distance and duration.
     * @returns {{ distance: number, duration: number }}
     */
    function getReaderMetrics() {
        const totalChars = countChars(getText(), true);
        const speed = getSpeed();
        const duration = totalChars > 0 ? Math.ceil((totalChars / speed) * 60) : 0;
        const stageHeight = stageRef.value?.clientHeight || 0;
        const textHeight = textRef.value?.scrollHeight || 0;
        const baseDistance = Math.max(0, textHeight - stageHeight);
        const distance = Math.max(baseDistance, stageHeight);

        return { distance, duration };
    }

    /**
     * Render scroll position for elapsed time.
     * @param {number} elapsedSeconds
     */
    function renderScroll(elapsedSeconds) {
        const duration = totalDuration.value;
        const distance = totalDistance.value;

        if (duration === 0 || !textRef.value) {
            currentSeconds.value = 0;

            return;
        }
        const clamped = Math.min(Math.max(elapsedSeconds, 0), duration);
        const progress = duration > 0 ? clamped / duration : 0;
        const offset = -distance * progress;

        textRef.value.style.transform = `translateY(${offset}px)`;
        currentSeconds.value = Math.floor(clamped);
    }

    /**
     * Reset scroll to start.
     */
    function resetReaderScroll() {
        accumulatedElapsed.value = 0;
        startTimestamp.value = 0;
        renderScroll(0);
    }

    /**
     * Start scrolling.
     */
    function startScroll() {
        if (totalDuration.value === 0) {
            renderScroll(0);

            return;
        }
        if (!startTimestamp.value) {
            startTimestamp.value = performance.now();
        }
        const tick = (timestamp) => {
            if (!isPlaying.value) {
                return;
            }
            const elapsed = accumulatedElapsed.value + (timestamp - startTimestamp.value) / 1000;

            renderScroll(elapsed);

            if (elapsed < totalDuration.value) {
                animationId.value = requestAnimationFrame(tick);
            } else {
                isPlaying.value = false;
                startTimestamp.value = 0;
                animationId.value = null;
            }
        };

        animationId.value = requestAnimationFrame(tick);
    }

    /**
     * Pause scrolling.
     */
    function pauseScroll() {
        if (!animationId.value) {
            return;
        }
        cancelAnimationFrame(animationId.value);
        animationId.value = null;

        if (startTimestamp.value) {
            accumulatedElapsed.value += (performance.now() - startTimestamp.value) / 1000;
            accumulatedElapsed.value = Math.min(accumulatedElapsed.value, totalDuration.value);
            startTimestamp.value = 0;
        }
    }

    function stopWheelAnimation() {
        if (wheelAnimId.value) {
            cancelAnimationFrame(wheelAnimId.value);
            wheelAnimId.value = null;
        }
    }

    function startWheelAnimation() {
        if (wheelAnimId.value) {
            return;
        }
        const tick = () => {
            const duration = totalDuration.value;

            if (duration === 0) {
                stopWheelAnimation();

                return;
            }
            const delta = wheelTargetElapsed.value - accumulatedElapsed.value;

            if (Math.abs(delta) < 0.02) {
                accumulatedElapsed.value = wheelTargetElapsed.value;
                renderScroll(accumulatedElapsed.value);
                stopWheelAnimation();

                return;
            }
            accumulatedElapsed.value += delta * 0.18;
            renderScroll(accumulatedElapsed.value);
            wheelAnimId.value = requestAnimationFrame(tick);
        };

        wheelAnimId.value = requestAnimationFrame(tick);
    }

    function smoothSeek(progress) {
        const duration = totalDuration.value;

        if (duration === 0) {
            renderScroll(0);

            return;
        }

        const clamped = Math.min(1, Math.max(0, progress));

        wheelTargetElapsed.value = duration * clamped;
        startWheelAnimation();
    }

    /**
     * Toggle play state.
     */
    function togglePlay() {
        isPlaying.value = !isPlaying.value;

        if (isPlaying.value) {
            stopWheelAnimation();
            startScroll();
        } else {
            pauseScroll();
        }
    }

    /**
     * Jump to start or end.
     * @param {boolean} toEnd
     */
    function jumpToEdge(toEnd) {
        pauseScroll();
        stopWheelAnimation();
        accumulatedElapsed.value = toEnd ? totalDuration.value : 0;
        startTimestamp.value = 0;
        renderScroll(accumulatedElapsed.value);
    }

    /**
     * Seek to progress position.
     * @param {number} progress
     */
    function setProgress(progress) {
        const duration = totalDuration.value;

        if (duration === 0) {
            renderScroll(0);

            return;
        }

        stopWheelAnimation();

        const clamped = Math.min(1, Math.max(0, progress));

        accumulatedElapsed.value = duration * clamped;
        startTimestamp.value = 0;
        renderScroll(accumulatedElapsed.value);
    }

    /**
     * Recalculate metrics while preserving position.
     */
    async function recalcMetricsPreservePosition() {
        const wasPlaying = isPlaying.value;

        if (wasPlaying) {
            pauseScroll();
        }
        const progress = totalDuration.value > 0 ? accumulatedElapsed.value / totalDuration.value : 0;

        await nextTick();

        const metrics = getReaderMetrics();

        totalDistance.value = metrics.distance;
        totalDuration.value = metrics.duration;
        accumulatedElapsed.value = progress * totalDuration.value;
        renderScroll(accumulatedElapsed.value);

        if (wasPlaying) {
            isPlaying.value = true;
            startScroll();
        }
    }

    /**
     * Initialize metrics on open.
     */
    async function initReader() {
        await nextTick();

        const metrics = getReaderMetrics();

        totalDistance.value = metrics.distance;
        totalDuration.value = metrics.duration;
        resetReaderScroll();
    }

    /**
     * Handle manual scroll.
     * @param {WheelEvent} event
     */
    function handleWheel(event) {
        if (isPlaying.value || totalDuration.value === 0 || totalDistance.value === 0) {
            return;
        }
        event.preventDefault();

        const delta = event.deltaY / totalDistance.value;

        const next = Math.min(totalDuration.value, Math.max(0, accumulatedElapsed.value + delta * totalDuration.value));

        wheelTargetElapsed.value = next;
        startWheelAnimation();
    }

    function handleTouchStart(event) {
        if (isPlaying.value || totalDuration.value === 0 || totalDistance.value === 0) {
            return;
        }
        const touch = event.touches?.[0];

        if (!touch) {
            return;
        }

        touchActive.value = true;
        touchStartY.value = touch.clientY;
        touchStartElapsed.value = accumulatedElapsed.value;
        wheelTargetElapsed.value = accumulatedElapsed.value;
    }

    function handleTouchMove(event) {
        if (!touchActive.value || isPlaying.value || totalDuration.value === 0 || totalDistance.value === 0) {
            return;
        }
        const touch = event.touches?.[0];

        if (!touch) {
            return;
        }

        const deltaY = touchStartY.value - touch.clientY;
        const delta = (deltaY / totalDistance.value) * totalDuration.value;
        const next = Math.min(totalDuration.value, Math.max(0, touchStartElapsed.value + delta));

        wheelTargetElapsed.value = next;
        startWheelAnimation();
    }

    function handleTouchEnd() {
        touchActive.value = false;
    }

    return {
        isPlaying,
        currentSeconds,
        totalDuration,
        totalDistance,
        togglePlay,
        pauseScroll,
        jumpToEdge,
        setProgress,
        smoothSeek,
        recalcMetricsPreservePosition,
        initReader,
        resetReaderScroll,
        handleWheel,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
    };
}
