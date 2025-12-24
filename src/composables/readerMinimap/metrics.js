export function getOffsetY(controller, event) {
    const rect = controller.minimapEl.getBoundingClientRect();

    return event.clientY - rect.top;
}

export function getMetrics(controller) {
    const stageHeight = controller.stageEl.clientHeight;
    const textHeight = controller.textEl.scrollHeight || controller.textEl.offsetHeight || 0;
    const mmHeight = controller.minimapEl.clientHeight;
    const baseDistance = Math.max(0, textHeight - stageHeight);
    const totalDistance = Math.max(baseDistance, stageHeight);
    const scrollHeight = totalDistance + stageHeight;
    const maxScrollTop = Math.max(0, scrollHeight - stageHeight);
    const scale = mmHeight / (scrollHeight || 1);
    const viewportHeight = Math.max(24, stageHeight * scale);
    const maxViewportTop = Math.max(0, mmHeight - viewportHeight);

    return { stageHeight, textHeight, mmHeight, totalDistance, scrollHeight, maxScrollTop, scale, viewportHeight, maxViewportTop };
}

export function syncViewport(controller) {
    const { maxScrollTop, scale, viewportHeight, maxViewportTop } = getMetrics(controller);

    controller.viewportEl.style.height = `${viewportHeight}px`;

    if (maxScrollTop === 0) {
        controller.viewportEl.style.top = '0px';

        return;
    }

    const progress = Math.min(1, Math.max(0, controller.getProgress()));
    const scrollTop = maxScrollTop * progress;
    const rawTop = scrollTop * scale;
    const top = Math.min(maxViewportTop, Math.max(0, rawTop));

    controller.viewportEl.style.top = `${top}px`;
}

export function seekToMinimapY(controller, minimapY) {
    const { mmHeight, viewportHeight, maxScrollTop } = getMetrics(controller);

    if (maxScrollTop === 0) {
        controller.onSeek(0);

        return;
    }
    const y = minimapY - viewportHeight / 2;
    const clampedY = Math.min(mmHeight - viewportHeight, Math.max(0, y));
    const ratio = mmHeight - viewportHeight === 0 ? 0 : clampedY / (mmHeight - viewportHeight);

    controller.onSeek(ratio);
}
