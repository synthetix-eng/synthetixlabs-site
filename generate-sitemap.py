#!/usr/bin/env python3
"""generate-sitemap.py -- build sitemap.xml from the pages actually on disk."""
import pathlib, datetime, sys

SITE = "https://synthetixlabs.ai"
# Thin WordPress archive pages add no value and dilute crawl budget.
SKIP = ('/embed/', '/author/', '/category/', '/tag/')


def main():
    urls = []
    for p in sorted(pathlib.Path('.').rglob('index.html')):
        if '.git' in p.parts:
            continue
        rel = str(p.parent).replace('\\', '/')
        path = '/' if rel == '.' else f"/{rel}/"
        if any(s in path for s in SKIP):
            continue
        # homepage and top-level sections rank highest
        depth = path.count('/') - 1
        prio = '1.0' if path == '/' else ('0.8' if depth == 1 else '0.6')
        urls.append((path, prio))

    today = datetime.date.today().isoformat()
    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for path, prio in urls:
        out += ['  <url>',
                f'    <loc>{SITE}{path}</loc>',
                f'    <lastmod>{today}</lastmod>',
                f'    <priority>{prio}</priority>',
                '  </url>']
    out.append('</urlset>')
    pathlib.Path('sitemap.xml').write_text('\n'.join(out) + '\n')
    print(f"    sitemap.xml: {len(urls)} URLs")
    return 0


if __name__ == '__main__':
    sys.exit(main())
