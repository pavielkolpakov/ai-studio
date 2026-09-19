import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'
import test from 'node:test'

const origin = 'https://www.neuronetis.com'
const pages = [
  { path: '/', file: 'index', content: 'AI creates value' },
  { path: '/pricing', file: 'pricing', content: 'AI Implementation' },
  { path: '/about', file: 'about', content: 'AI / Backend' },
]

for (const { path, file, content } of pages) {
  test(`${path} contains indexable content and metadata without JavaScript`, async () => {
    const html = await readFile(`dist/${file}.html`, 'utf8')
    const head = html.match(/<head>([\s\S]*?)<\/head>/)[1]
    const body = html.match(/<body>([\s\S]*?)<\/body>/)[1]
    assert.equal((head.match(/<title>/g) ?? []).length, 1)
    assert.match(head, /<meta name="description" content="[^"]+"/)
    assert.ok(head.includes(`<link rel="canonical" href="${origin}${path}"`))
    assert.ok(head.includes(`<meta property="og:url" content="${origin}${path}"`))
    assert.doesNotMatch(head, /noindex/)
    assert.match(body, /<h1\b/)
    assert.ok(body.includes(content))
    assert.match(body, /href="\/pricing"/)
    assert.match(body, /href="\/about"/)
    for (const [, asset] of html.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g)) {
      await access(`dist${asset}`)
    }
  })
}

test('crawler files advertise only canonical public pages', async () => {
  const robots = await readFile('dist/robots.txt', 'utf8')
  assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`))
  assert.match(robots, /User-agent: \*\nAllow: \//)
  const sitemap = await readFile('dist/sitemap.xml', 'utf8')
  assert.deepEqual(
    [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]),
    pages.map(({ path }) => `${origin}${path}`),
  )
})

test('missing pages are excluded and retired URLs redirect at the host', async () => {
  const html = await readFile('dist/404.html', 'utf8')
  assert.match(html, /<meta name="robots" content="noindex"/)
  assert.doesNotMatch(html, /rel="canonical"/)
  const config = JSON.parse(await readFile('vercel.json', 'utf8'))
  assert.equal(config.cleanUrls, true)
  assert.equal(config.trailingSlash, false)
  assert.equal(config.rewrites, undefined)
  for (const source of ['/services', '/audit', '/implementation', '/optimization']) {
    assert.ok(config.redirects.some((rule) =>
      rule.source === source && rule.destination === '/pricing' && rule.permanent,
    ))
  }
})
