#!/usr/bin/env python3
"""
fix-seo.py -- remove the inherited noindex and make canonicals absolute.

The mirror carried <meta name="robots" content="noindex,nofollow,noarchive,
nosnippet"> on ALL 40 pages. It came from the source WordPress install, which
had "discourage search engines" enabled. Shipping that to synthetixlabs.ai
would de-index the entire marketing site from Google.

Removing it alone is not safe though: the Firebase default domain
(synthetixlabs-site.web.app) would then be indexable and would compete with the
real domain as duplicate content. So every page also gets an ABSOLUTE canonical
pointing at https://synthetixlabs.ai<path>. Existing canonicals were relative
(and the homepage pointed at "index.html" rather than "/"), and 12 pages had
none at all.

Idempotent.
"""
import pathlib, re, sys

SITE = "https://synthetixlabs.ai"
ROBOTS = re.compile(r'\s*<meta\s+name=["\']robots["\'][^>]*noindex[^>]*>', re.I)
CANON = re.compile(r'\s*<link[^>]*rel=["\']canonical["\'][^>]*>', re.I)


def url_for(p: pathlib.Path) -> str:
    rel = str(p.parent).replace('\\', '/')
    if rel == '.':
        return SITE + '/'
    return f"{SITE}/{rel}/"


def main():
    removed = recanon = added = files = 0
    for p in sorted(pathlib.Path('.').rglob('index.html')):
        if '.git' in p.parts:
            continue
        orig = p.read_text(errors='ignore')
        t = orig

        t, n = ROBOTS.subn('', t)
        removed += n

        canonical = f'<link rel="canonical" href="{url_for(p)}" />'
        # Strip every existing canonical FIRST, then insert exactly one.
        # Doing it the other way round deletes the tag just inserted, because
        # the new tag also matches CANON.
        t, had = CANON.subn('', t)
        if had:
            recanon += 1
        else:
            added += 1
        m = re.search(r'<head[^>]*>', t, re.I)
        if m:
            t = t[:m.end()] + '\n    ' + canonical + t[m.end():]

        if t != orig:
            p.write_text(t)
            files += 1

    print(f"    noindex tags removed      : {removed}")
    print(f"    canonicals made absolute  : {recanon}")
    print(f"    canonicals added (had none): {added}")
    print(f"    files changed             : {files}")
    return 0


if __name__ == '__main__':
    sys.exit(main())
