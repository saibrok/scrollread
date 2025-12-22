/**
 * Count characters in a string.
 * @param {string} text
 * @param {boolean} withSpaces
 * @returns {number}
 */
export function countChars(text, withSpaces) {
    if (withSpaces) {
        return text.length;
    }

    return text.replace(/\s/g, '').length;
}

/**
 * Count words in a string.
 * @param {string} text
 * @returns {number}
 */
export function countWords(text) {
    if (!text.trim()) {
        return 0;
    }

    return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Format seconds to mm:ss.
 * @param {number} seconds
 * @returns {string}
 */
export function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Escape unsafe HTML characters.
 * @param {string} value
 * @returns {string}
 */
export function escapeHtml(value) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    };

    return value.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Convert text lines into paragraph HTML.
 * @param {string} text
 * @returns {string}
 */
export function toParagraphs(text) {
    return text
        .split(/\r?\n/)
        .map((line) => {
            const safe = escapeHtml(line);

            return `<p>${safe || '&nbsp;'}</p>`;
        })
        .join('');
}
