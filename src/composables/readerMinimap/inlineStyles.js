function inlineStyles(sourceNode, targetNode) {
    const computed = getComputedStyle(sourceNode);

    for (let i = 0; i < computed.length; i += 1) {
        const prop = computed[i];

        targetNode.style.setProperty(prop, computed.getPropertyValue(prop), computed.getPropertyPriority(prop));
    }
}

function walkAndInlineStyles(sourceEl, targetEl) {
    if (sourceEl.nodeType !== Node.ELEMENT_NODE || targetEl.nodeType !== Node.ELEMENT_NODE) {
        return;
    }
    inlineStyles(sourceEl, targetEl);

    const sourceChildren = sourceEl.children;
    const targetChildren = targetEl.children;

    for (let i = 0; i < sourceChildren.length; i += 1) {
        walkAndInlineStyles(sourceChildren[i], targetChildren[i]);
    }
}

export function cloneWithInlineStyles(sourceNode) {
    const clone = sourceNode.cloneNode(true);

    walkAndInlineStyles(sourceNode, clone);

    return clone;
}
