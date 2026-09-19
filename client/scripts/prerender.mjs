import { readFile, writeFile } from 'node:fs/promises'
import { render, SEO_PAGES, SITE_URL } from '../dist-ssr/entry-server.js'

const manifest = JSON.parse(await readFile('dist/.vite/manifest.json', 'utf8'))
const entry = manifest['index.html']
const assets = {
  script: `/${entry.file}`,
  styles: (entry.css ?? []).map((file) => `/${file}`),
}

for (const path of [...Object.keys(SEO_PAGES), '/404']) {
  const file = path === '/' ? 'index' : path.slice(1)
  await writeFile(`dist/${file}.html`, render(path, assets))
}

await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Object.keys(SEO_PAGES).map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`).join('\n')}
</urlset>
`)
console.log('Prerendered Home, Pricing, About, and 404; generated robots.txt and sitemap.xml.')
