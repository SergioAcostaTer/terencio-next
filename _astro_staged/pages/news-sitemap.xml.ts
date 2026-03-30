import { getCollection } from 'astro:content';

export async function GET({ site }) {
  const news = await getCollection('noticias');
  
  // Google News only accepts articles from the last 48 hours
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const recentNews = news.filter((post) => {
    return post.data.pubDate >= twoDaysAgo;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
      ${recentNews.map((post) => `
        <url>
          <loc>${site}noticias/${post.slug}</loc>
          <news:news>
            <news:publication>
              <news:name>Terencio Cash Market</news:name>
              <news:language>es</news:language>
            </news:publication>
            <news:publication_date>${post.data.pubDate.toISOString()}</news:publication_date>
            <news:title>${post.data.title}</news:title>
          </news:news>
        </url>
      `).join('')}
    </urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
