import { seekToMinimapY } from './metrics';

export function handleViewportPointerDown(controller, event) {
    controller.isDragging = true;
    controller.activePointerId = event.pointerId;
    controller.viewportEl.setPointerCapture(event.pointerId);
    controller.viewportEl.classList.add('dragging');

    const rect = controller.viewportEl.getBoundingClientRect();

    controller.dragOffsetY = event.clientY - rect.top;
    controller.dragStartPointerY = event.clientY;
    controller.dragStartViewportTop = rect.top;

    event.preventDefault();
    event.stopPropagation();
}

export function handlePointerMove(controller, event) {
    if (!controller.isDragging) {
        return;
    }
    if (controller.activePointerId !== null && event.pointerId !== controller.activePointerId) {
        return;
    }
    const rect = controller.minimapEl.getBoundingClientRect();
    const deltaY = event.clientY - controller.dragStartPointerY;
    const viewportTop = controller.dragStartViewportTop - rect.top + deltaY;
    const minimapY = viewportTop + controller.dragOffsetY;

    seekToMinimapY(controller, minimapY);
}

export function handlePointerUp(controller, event) {
    if (!controller.isDragging) {
        return;
    }
    if (controller.activePointerId !== null && event.pointerId !== controller.activePointerId) {
        return;
    }

    controller.isDragging = false;
    controller.activePointerId = null;
    controller.dragStartPointerY = 0;
    controller.dragStartViewportTop = 0;
    controller.viewportEl.classList.remove('dragging');
}
