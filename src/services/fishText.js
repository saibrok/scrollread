/**
 * FishText API docs: https://fish-text.ru/api
 */
const FISH_TEXT_URL = 'https://fish-text.ru/get';

/**
 * Fetch fish text from API.
 * @param {{ type: string, number: number }} params
 * @returns {Promise<string>}
 */
async function fetchFishText(params) {
    const url = new URL(FISH_TEXT_URL);

    url.searchParams.set('format', 'json');

    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, String(value));
    });

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error(`FishText request failed: ${response.status}`);
    }

    const result = await response.json();

    if (result.status !== 'success') {
        throw new Error(`FishText error ${result.errorCode ?? ''}`.trim());
    }

    return result.text;
}

/**
 * Build demo text: 1 title, 6 paragraphs, and attribution line.
 * @returns {Promise<string>}
 */
export async function fetchDemoText() {
    const [titleText, paragraphText] = await Promise.all([fetchFishText({ type: 'title', number: 1 }), fetchFishText({ type: 'paragraph', number: 6 })]);

    const paragraphs = paragraphText.split('\\n\\n').join('\n');
    const attribution = 'Текст сгенерирован на РыбаТекст (fish-text.ru)';

    return [titleText, paragraphs, attribution].join('\n\n');
}
