export type WikimediaImage = {
  title: string;
  thumbUrl: string;
  sourceUrl: string;
  descriptionUrl: string;
};

const COMMONS_API_URL = 'https://commons.wikimedia.org/w/api.php';

export async function fetchWikimediaImages(categories: string[], limit = 20, width = 1200): Promise<WikimediaImage[]> {
  const collected = new Map<string, WikimediaImage>();

  for (const category of categories) {
    if (collected.size >= limit) {
      break;
    }

    const params = new URLSearchParams({
      action: 'query',
      format: 'json',
      formatversion: '2',
      generator: 'categorymembers',
      gcmtitle: `Category:${category}`,
      gcmtype: 'file',
      gcmlimit: '30',
      prop: 'imageinfo',
      iiprop: 'url',
      iiurlwidth: String(width),
      origin: '*',
    });

    const response = await fetch(`${COMMONS_API_URL}?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Could not reach Wikimedia Commons for image data.');
    }

    const data = (await response.json()) as {
      query?: {
        pages?: Array<{
          title?: string;
          imageinfo?: Array<{
            thumburl?: string;
            url?: string;
            descriptionurl?: string;
          }>;
        }>;
      };
    };

    const pages = data.query?.pages ?? [];
    for (const page of pages) {
      const info = page.imageinfo?.[0];
      if (!page.title || !info?.thumburl || !info.url || !info.descriptionurl) {
        continue;
      }
      if (collected.has(page.title)) {
        continue;
      }
      collected.set(page.title, {
        title: page.title,
        thumbUrl: info.thumburl,
        sourceUrl: info.url,
        descriptionUrl: info.descriptionurl,
      });
      if (collected.size >= limit) {
        break;
      }
    }
  }

  return Array.from(collected.values()).slice(0, limit);
}
