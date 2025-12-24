import { handlePointerMove, handlePointerUp, handleViewportPointerDown } from './drag';
import { getOffsetY, seekToMinimapY, syncViewport } from './metrics';
import { renderMinimap } from './render';

export class ReaderMinimapController {
    constructor({ stageEl, textEl, minimapEl, viewportEl, canvasEl, getProgress, onSeek, canInteract }) {
        this.stageEl = stageEl;
        this.textEl = textEl;
        this.minimapEl = minimapEl;
        this.viewportEl = viewportEl;
        this.canvasEl = canvasEl;
        this.getProgress = getProgress;
        this.onSeek = onSeek;
        this.canInteract = canInteract;
        this.isDragging = false;
        this.dragOffsetY = 0;
        this.activePointerId = null;
        this.renderToken = 0;
        this.resizeObserver = null;
        this.resizeTimer = null;
        this.dragStartPointerY = 0;
        this.dragStartViewportTop = 0;

        this.handleMinimapPointerDown = this.handleMinimapPointerDown.bind(this);
        this.handleViewportPointerDown = this.handleViewportPointerDown.bind(this);
        this.handlePointerMove = this.handlePointerMove.bind(this);
        this.handlePointerUp = this.handlePointerUp.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    init() {
        this.minimapEl.addEventListener('pointerdown', this.handleMinimapPointerDown);
        this.viewportEl.addEventListener('pointerdown', this.handleViewportPointerDown);
        window.addEventListener('pointermove', this.handlePointerMove);
        window.addEventListener('pointerup', this.handlePointerUp);
        window.addEventListener('pointercancel', this.handlePointerUp);

        this.resizeObserver = new ResizeObserver(this.handleResize);
        this.resizeObserver.observe(this.stageEl);
        this.resizeObserver.observe(this.minimapEl);

        this.render();
        this.sync();
    }

    destroy() {
        if (this.isDragging && this.activePointerId !== null) {
            try {
                this.viewportEl.releasePointerCapture(this.activePointerId);
            } catch {
                // Ignore capture errors on teardown.
            }
        }

        this.isDragging = false;
        this.activePointerId = null;
        this.dragStartPointerY = 0;
        this.dragStartViewportTop = 0;
        this.viewportEl.classList.remove('dragging');

        this.minimapEl.removeEventListener('pointerdown', this.handleMinimapPointerDown);
        this.viewportEl.removeEventListener('pointerdown', this.handleViewportPointerDown);
        window.removeEventListener('pointermove', this.handlePointerMove);
        window.removeEventListener('pointerup', this.handlePointerUp);
        window.removeEventListener('pointercancel', this.handlePointerUp);

        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }

        if (this.resizeTimer) {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = null;
        }
    }

    handleMinimapPointerDown(event) {
        if (!this.canInteract()) {
            return;
        }
        if (event.target === this.viewportEl) {
            return;
        }
        seekToMinimapY(this, getOffsetY(this, event));
    }

    handleViewportPointerDown(event) {
        if (!this.canInteract()) {
            return;
        }
        handleViewportPointerDown(this, event);
    }

    handlePointerMove(event) {
        if (!this.canInteract()) {
            return;
        }
        handlePointerMove(this, event);
    }

    handlePointerUp(event) {
        handlePointerUp(this, event);
    }

    render() {
        renderMinimap(this);
    }

    sync() {
        syncViewport(this);
    }

    handleResize() {
        if (this.resizeTimer) {
            clearTimeout(this.resizeTimer);
        }
        this.resizeTimer = setTimeout(() => {
            this.resizeTimer = null;
            this.render();
            this.sync();
        }, 200);
    }
}
