import { cloneWithInlineStyles } from './inlineStyles';
import { getMetrics } from './metrics';
import { buildSvgDataUrl } from './svg';

export function renderMinimap(controller) {
    const ctx = controller.canvasEl.getContext('2d');

    if (!ctx) {
        return;
    }

    const w = controller.minimapEl.clientWidth;
    const h = controller.minimapEl.clientHeight;

    if (w === 0 || h === 0) {
        return;
    }

    const dpr = window.devicePixelRatio || 1;

    controller.canvasEl.width = Math.max(1, Math.floor(w * dpr));
    controller.canvasEl.height = Math.max(1, Math.floor(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const sourceWidth = Math.max(1, controller.stageEl.clientWidth);
    const { scrollHeight } = getMetrics(controller);
    const sourceHeight = Math.max(1, scrollHeight);
    const token = (controller.renderToken += 1);

    const clone = cloneWithInlineStyles(controller.stageEl);
    const textClone = clone.querySelector('.reader-text');

    if (textClone) {
        textClone.style.transform = 'translateY(0px)';
        textClone.style.willChange = 'auto';
    }

    clone.style.width = `${sourceWidth}px`;
    clone.style.height = `${sourceHeight}px`;
    clone.style.overflow = 'hidden';
    clone.style.boxSizing = 'border-box';

    const dataUrl = buildSvgDataUrl(clone, sourceWidth, sourceHeight);
    const img = new Image();

    img.onload = () => {
        if (token !== controller.renderToken) {
            return;
        }
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, sourceWidth, sourceHeight, 0, 0, w, h);
    };
    img.src = dataUrl;
}
