#!/usr/bin/env python3
"""
apply-seo.py -- titles, meta descriptions, OpenGraph, Twitter cards and JSON-LD.

Reads seo.config.json, which marketing owns. Edit the strings there and re-run
this; no code changes are needed.

Why this exists: the mirrored site had 0 of 39 pages with a meta description,
0 with OpenGraph, 0 with Twitter cards and 0 with structured data. Every link
shared on LinkedIn - the company's actual distribution channel - rendered as a
bare URL with no title, description or image.

Only the frozen pages under public/ are handled here. The 15 content items
render through Astro layouts, which build their tags from collection
frontmatter, so they stay correct for anything marketing publishes later.

Idempotent: re-running replaces the managed block rather than duplicating it.
"""
import html
import json
import pathlib
import re
import sys

START = '<!-- seo:start -->'
END = '<!-- seo:end -->'


def esc(s):
    return html.escape(s, quote=True)


def block(cfg, url, page):
    site = cfg['site']
    base = site['url'].rstrip('/')
    canonical = base + url
    img = base + site['ogImage']
    title, desc = page['title'], page['description']

    out = [START,
           f'<meta name="description" content="{esc(desc)}" />',
           f'<meta property="og:type" content="website" />',
           f'<meta property="og:site_name" content="{esc(site["name"])}" />',
           f'<meta property="og:title" content="{esc(title)}" />',
           f'<meta property="og:description" content="{esc(desc)}" />',
           f'<meta property="og:url" content="{canonical}" />',
           f'<meta property="og:image" content="{img}" />',
           f'<meta property="og:locale" content="en_US" />',
           f'<meta name="twitter:card" content="{site["twitterCard"]}" />',
           f'<meta name="twitter:title" content="{esc(title)}" />',
           f'<meta name="twitter:description" content="{esc(desc)}" />',
           f'<meta name="twitter:image" content="{img}" />']

    # Organization schema belongs on the homepage only - repeating it on every
    # page is a common mistake that dilutes rather than reinforces the entity.
    if url == '/':
        org = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": site['name'],
            "url": base + '/',
            "logo": img,
            "description": desc,
            "sameAs": [site['linkedin']],
        }
        out.append('<script type="application/ld+json">'
                   + json.dumps(org, ensure_ascii=False) + '</script>')
    else:
        crumbs = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home", "item": base + '/'},
                {"@type": "ListItem", "position": 2, "name": title.split('|')[0].split('—')[0].strip(),
                 "item": canonical},
            ],
        }
        out.append('<script type="application/ld+json">'
                   + json.dumps(crumbs, ensure_ascii=False) + '</script>')

    out.append(END)
    return '\n'.join(out)


def main():
    cfg = json.loads(pathlib.Path('seo.config.json').read_text())
    changed = 0
    for url, page in cfg['pages'].items():
        rel = 'public' + url + 'index.html'
        p = pathlib.Path(rel)
        if not p.exists():
            print(f"    SKIP (not a frozen page): {url}", file=sys.stderr)
            continue
        t = p.read_text(errors='ignore')

        # title is a prop of the page, not part of the managed block
        t, n = re.subn(r'<title>.*?</title>', f'<title>{esc(page["title"])}</title>', t,
                       count=1, flags=re.S)
        if n == 0:
            t = t.replace('<head>', f'<head>\n<title>{esc(page["title"])}</title>', 1)

        new = block(cfg, url, page)
        if START in t:
            t = re.sub(re.escape(START) + r'.*?' + re.escape(END), new, t, count=1, flags=re.S)
        else:
            t = t.replace('</head>', new + '\n</head>', 1)

        p.write_text(t)
        changed += 1
        print(f"    {url:<18} title + description + og + twitter + json-ld")

    # Archive pages (tag / author / category / date) are not in the config and
    # never will be - marketing does not write copy for them. They are excluded
    # from the sitemap as thin pages, but they are still shareable and still
    # crawlable, so they get generated tags rather than none at all.
    site = cfg['site']
    base = site['url'].rstrip('/')
    img = base + site['ogImage']
    arch = 0
    for q in sorted(pathlib.Path('public').rglob('index.html')):
        url = '/' + str(q.relative_to('public')).replace('index.html', '')
        if url in cfg['pages'] or START in q.read_text(errors='ignore'):
            continue
        t2 = q.read_text(errors='ignore')
        m = re.search(r'<title>(.*?)</title>', t2, re.S)
        raw = html.unescape(re.sub(r'<[^>]+>', '', m.group(1))).strip() if m else 'Synthetix Labs'
        name = re.sub(r'\s*[–—-]\s*Synthetix Labs\s*$', '', raw).strip() or 'Archive'
        desc = f'{name} — articles, case studies and agent documentation from {site["name"]}.'
        blk = '\n'.join([
            START,
            f'<meta name="description" content="{esc(desc)}" />',
            '<meta property="og:type" content="website" />',
            f'<meta property="og:site_name" content="{esc(site["name"])}" />',
            f'<meta property="og:title" content="{esc(raw)}" />',
            f'<meta property="og:description" content="{esc(desc)}" />',
            f'<meta property="og:url" content="{base + url}" />',
            f'<meta property="og:image" content="{img}" />',
            f'<meta name="twitter:card" content="{site["twitterCard"]}" />',
            f'<meta name="twitter:title" content="{esc(raw)}" />',
            f'<meta name="twitter:description" content="{esc(desc)}" />',
            f'<meta name="twitter:image" content="{img}" />',
            END,
        ])
        q.write_text(t2.replace('</head>', blk + '\n</head>', 1))
        arch += 1

    print(f"\n    {changed} configured page(s) + {arch} archive page(s) updated")
    return 0


if __name__ == '__main__':
    sys.exit(main())
