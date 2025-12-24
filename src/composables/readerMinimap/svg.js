export function buildSvgDataUrl(node, width, height) {
    const wrapper = document.createElement('div');

    wrapper.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
    wrapper.appendChild(node);

    const serialized = new XMLSerializer().serializeToString(wrapper);
    const svg = [
        '<svg xmlns="http://www.w3.org/2000/svg" width="',
        width,
        '" height="',
        height,
        '"><foreignObject width="100%" height="100%">',
        serialized,
        '</foreignObject></svg>',
    ].join('');

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
