#!/usr/bin/env python3
"""
fix-residual-links.py -- clear the broken references left after the Phase 2
deletions and the ?p= link rewrite.

Run after fix-nav-links.py. Idempotent.

NOT handled here (deliberate): the footer nav links /about/, /service/ and
/work/ are Agenio theme demo placeholders that were never pointed at real
pages. Retargeting them is a content decision for the site owner.
"""
import pathlib, re, sys

# daily archives wget never mirrored -> the month archive, which does exist
MISSING_DAYS = ('14', '18', '19', '20', '21')

# WordPress emoji polyfill: loads wp-emoji-release.min.js (never mirrored -> 404)
# and pulls emoji assets from s.w.org. Dead weight on a static site and an
# extra third-party origin, so all three pieces are removed.
EMOJI_JSON  = re.compile(r'\s*<script[^>]*id=["\']wp-emoji-settings["\'][^>]*>.*?</script>', re.I | re.S)
EMOJI_LOAD  = re.compile(r'\s*<script[^>]*type=["\']module["\'][^>]*>(?:(?!</script>).)*?wp-emoji-loader(?:(?!</script>).)*?</script>', re.I | re.S)
EMOJI_STYLE = re.compile(r'\s*<style[^>]*>(?:(?!</style>).)*?img\.wp-smiley(?:(?!</style>).)*?</style>', re.I | re.S)

RSS = re.compile(r'\s*<link[^>]+type=["\']application/rss\+xml["\'][^>]*/?>', re.I)
# the author byline still carries admin_jcmef8dd in the href, which re-exposes
# the admin username in page source even though Phase 2 deleted the archive
ADMIN = re.compile(r'<a\s+href="[^"]*admin_jcmef8dd[^"]*"([^>]*)>(.*?)</a>', re.I | re.S)
PRODDOC = re.compile(r'href="/product-documentation/"')
DAYS = re.compile(r'(/resources/blogs/2026/07/)(?:' + '|'.join(MISSING_DAYS) + r')/')

def main():
    counts = dict(rss=0, admin=0, proddoc=0, days=0, emoji=0)
    files = 0
    for p in sorted(pathlib.Path('.').rglob('*.html')):
        if '.git' in p.parts:
            continue
        orig = p.read_text(errors='ignore')
        t = orig

        t, n = RSS.subn('', t);                                   counts['rss'] += n
        t, n = EMOJI_JSON.subn('', t);                            counts['emoji'] += n
        t, n = EMOJI_LOAD.subn('', t);                            counts['emoji'] += n
        t, n = EMOJI_STYLE.subn('', t);                           counts['emoji'] += n
        t, n = ADMIN.subn(r'<span\1>\2</span>', t);               counts['admin'] += n
        t, n = PRODDOC.subn('href="/resources/product-documentation/"', t); counts['proddoc'] += n
        t, n = DAYS.subn(r'\1', t);                               counts['days'] += n

        if t != orig:
            p.write_text(t)
            files += 1

    print(f"    RSS feed <link> tags removed : {counts['rss']}")
    print(f"    admin_jcmef8dd links de-linked: {counts['admin']}")
    print(f"    /product-documentation/ fixed : {counts['proddoc']}")
    print(f"    missing day archives -> month : {counts['days']}")
    print(f"    wp-emoji blocks removed       : {counts['emoji']}")
    print(f"    files changed                 : {files}")

    # stray 404-error pages wget dumped into the theme fonts directory
    removed = 0
    for stray in pathlib.Path('wp-content/themes/agenio/assets/fonts').glob('*.html'):
        if 'htdocs_error' in stray.read_text(errors='ignore'):
            stray.unlink(); removed += 1
    print(f"    stray error pages deleted     : {removed}")
    return 0

if __name__ == '__main__':
    sys.exit(main())
