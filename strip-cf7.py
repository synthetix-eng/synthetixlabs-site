#!/usr/bin/env python3
"""
strip-cf7.py -- Phase 3. Remove the dead Contact Form 7 markup site-wide.

The CF7 form posts to endpoints that no longer exist, so submissions fail
SILENTLY: a visitor fills it in, hits send, and nothing arrives anywhere.
It also carries a wpcf7-file upload field (enctype multipart/form-data),
which the incident review names as the likely original attack vector. It is
removed and deliberately NOT recreated.

The working HubSpot embed on /contact/ (portal 40221584) is the single
conversion path and is left untouched - this script only ever matches
wpcf7 markup.

Also drops the inline CF7 config, which advertised "root": "/wp-json/" and
so kept a WordPress REST API reference in the page after the Phase 2 strip.

Idempotent.
"""
import pathlib, re, sys

DIV = re.compile(r'<div\b|</div>', re.I)
START = re.compile(r'<div\s+class="wpcf7 no-js"', re.I)

def cut_balanced_div(text, start_idx):
    """Return end index just past the </div> that closes the div at start_idx."""
    depth = 0
    for m in DIV.finditer(text, start_idx):
        if m.group(0).lower().startswith('<div'):
            depth += 1
        else:
            depth -= 1
            if depth == 0:
                return m.end()
    return None

ASSETS = [
    re.compile(r"\s*<link[^>]*id='contact-form-7-css'[^>]*/?>", re.I),
    re.compile(r'\s*<script[^>]*id="swv-js"[^>]*>\s*</script>', re.I),
    re.compile(r'\s*<script[^>]*id="contact-form-7-js"[^>]*>\s*</script>', re.I),
    re.compile(r'\s*<script[^>]*id="contact-form-7-js-before"[^>]*>.*?</script>', re.I | re.S),
]

def main():
    forms = assets = files = 0
    for p in sorted(pathlib.Path('.').rglob('*.html')):
        if '.git' in p.parts:
            continue
        orig = p.read_text(errors='ignore')
        t = orig

        while True:
            m = START.search(t)
            if not m:
                break
            end = cut_balanced_div(t, m.start())
            if end is None:
                print(f"    WARN unbalanced wpcf7 div in {p}", file=sys.stderr)
                break
            t = t[:m.start()] + t[end:]
            forms += 1

        for rx in ASSETS:
            t, n = rx.subn('', t)
            assets += n

        if t != orig:
            p.write_text(t)
            files += 1

    print(f"    form blocks removed : {forms}")
    print(f"    asset includes removed: {assets}")
    print(f"    files changed       : {files}")
    return 0

if __name__ == '__main__':
    sys.exit(main())
