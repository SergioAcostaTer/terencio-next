import { getNewsPosts } from "@/lib/news";

export async function GET() {
  const news = await getNewsPosts();

  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const recentNews = news.filter((post) => post.pubDate >= twoDaysAgo);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${recentNews
  .map(
    (post) => `  <url>
    <loc>https://terencio.es/noticias/${post.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>Terencio Cash Market</news:name>
        <news:language>es</news:language>
      </news:publication>
      <news:publication_date>${post.pubDate.toISOString()}</news:publication_date>
      <news:title>${escapeXml(post.title)}</news:title>
    </news:news>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
