#!/usr/bin/env python3
"""
apply-trademark.py -- add TM to the first prominent use of "Synthetix" per page.

Decisions this encodes:

  TM, not (R). The mark is FILED, not registered. Using (R) before registration
  is false marking - an offence under s.107 of the Indian Trade Marks Act 1999,
  and grounds to challenge enforcement in the US.

  First prominent use per page, not every occurrence. Standard practice, and
  legally no weaker. There are 209 visible occurrences site-wide; marking all
  of them would wreck readability for no added protection.

  Standalone "Synthetix" only. "Synthetix Labs" is the corporate entity name
  and companies do not normally mark their own legal name.

Skips, deliberately:
  - the site header/nav ("Why Synthetix" is a menu label, not brand usage)
  - anything inside a tag, attribute, <script>, <style> or <head>
  - URLs, email addresses and file paths

Idempotent.
"""
import pathlib, re, sys

# Urbanist - the site's brand font - has NO real trademark glyph. Its U+2122
# measures exactly as wide as the literal letters "TM" (23.42px vs 23.42px at
# 16px), so the browser draws full-size letters and the mark reads as the typo
# "SynthetixTM". Scoping just this character to a font that does have the glyph
# fixes it without touching the rest of the type. See .tm in the stylesheet.
TM = '<span class="tm">™</span>'
# "Synthetix" not followed by " Labs", not part of a longer word, not already marked
CAND = re.compile(r'Synthetix(?!™)(?!\s+Labs)(?![A-Za-z])')


def mark_html(path):
    t = path.read_text(errors='ignore')
    if 'class="tm"' in t:
        return 0

    # never before the end of the site header
    start = t.rfind('</header>')
    start = 0 if start == -1 else start

    # regions to avoid: script/style/head blocks and anything inside a tag
    blocked = []
    for m in re.finditer(r'<(script|style|head)\b.*?</\1>', t, re.S | re.I):
        blocked.append((m.start(), m.end()))
    for m in re.finditer(r'<[^>]*>', t):
        blocked.append((m.start(), m.end()))

    def is_blocked(i):
        return any(a <= i < b for a, b in blocked)

    for m in CAND.finditer(t, start):
        if is_blocked(m.start()):
            continue
        path.write_text(t[:m.end()] + TM + t[m.end():])
        return 1
    return 0


def mark_mdx(path):
    t = path.read_text(errors='ignore')
    if 'class="tm"' in t:
        return 0
    # body only - never the frontmatter
    parts = t.split('---', 2)
    if len(parts) < 3:
        return 0
    body = parts[2]
    m = CAND.search(body)
    if not m:
        return 0
    body = body[:m.end()] + TM + body[m.end():]
    path.write_text(parts[0] + '---' + parts[1] + '---' + body)
    return 1


def main():
    n = 0
    for p in sorted(pathlib.Path('public').rglob('index.html')):
        n += mark_html(p)
    html_n = n
    for p in sorted(pathlib.Path('src/content').rglob('*.mdx')):
        n += mark_mdx(p)
    print(f"    marked in public/ pages : {html_n}")
    print(f"    marked in content bodies: {n - html_n}")
    print(f"    total                   : {n}")
    return 0


if __name__ == '__main__':
    sys.exit(main())
