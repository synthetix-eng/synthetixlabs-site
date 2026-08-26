#!/usr/bin/env python3
"""
fix-footer-and-cta.py -- footer social links, cookie preferences, hero CTA target.

Social links
  The Agenio theme shipped Instagram / LinkedIn / Dribbble / Behance, all
  pointing at a dead "index.html#". Only LinkedIn exists, so the other three
  are removed rather than left dead - Dribbble and Behance are design-portfolio
  sites and were never plausible for this company.

Cookie Preferences
  The link is inert: there is no handler for data-action="cookie-prefs"
  anywhere in the site. Meanwhile Google Tag Manager and HubSpot load on 28
  pages and do set cookies, so this is a consent gap rather than a dead link.
  Wired to HubSpot's banner API, since HubSpot already loads on every page -
  no new vendor and no new script origin. The banner itself still has to be
  switched on in HubSpot (Settings > Privacy & Consent); until it is, the
  handler is a no-op, which is no worse than today.

Idempotent.
"""
import pathlib, re, sys

LINKEDIN = 'https://www.linkedin.com/company/synthetixlabs/'
APP = 'https://app.synthetixlabs.ai'
DROP = ('Instagram', 'Dribbble', 'Behance')

HANDLER = """<script id="cookie-prefs-handler">
/* HubSpot already loads on every page, so its consent banner is the cheapest
   real option here - no new vendor, no new script origin. Enable it under
   Settings > Privacy & Consent in HubSpot; until then this is a no-op. */
document.addEventListener('click', function (e) {
  var el = e.target.closest('[data-action="cookie-prefs"]');
  if (!el) return;
  e.preventDefault();
  window._hsp = window._hsp || [];
  window._hsp.push(['showBanner']);
});
</script>"""


def main():
    pages = sorted(pathlib.Path('public').rglob('index.html'))
    social = dropped = cookie = handler = 0

    for p in pages:
        t = orig = p.read_text(errors='ignore')

        # drop the three social links we have no account for
        for name in DROP:
            t, n = re.subn(
                r'<li>\s*<a href="[^"]*"[^>]*>\s*' + name + r'\s*</a>\s*</li>\s*',
                '', t)
            dropped += n

        # point LinkedIn at the real profile
        t, n = re.subn(
            r'<a href="[^"]*"([^>]*)>(\s*)Linkedin(\s*)</a>',
            f'<a href="{LINKEDIN}" target="_blank" rel="noopener noreferrer"\\1>\\2LinkedIn\\3</a>',
            t)
        social += n

        # cookie link must not navigate away
        t, n = re.subn(r'<a href="[^"]*"( data-action="cookie-prefs")', r'<a href="#"\1', t)
        cookie += n

        if 'data-action="cookie-prefs"' in t and 'id="cookie-prefs-handler"' not in t:
            t = t.replace('</body>', HANDLER + '\n</body>', 1)
            handler += 1

        if t != orig:
            p.write_text(t)

    # hero CTA destination, confirmed by the site owner
    home = pathlib.Path('public/index.html')
    t = home.read_text(errors='ignore')
    t, n = re.subn(r'<a href="/platform/" class="wpr-btn btn-primary with-icon">',
                   f'<a href="{APP}" class="wpr-btn btn-primary with-icon">', t)
    if n:
        home.write_text(t)

    print(f"    LinkedIn links repointed   : {social}")
    print(f"    dead social links removed  : {dropped}")
    print(f"    cookie links de-navigated  : {cookie}")
    print(f"    cookie handlers injected   : {handler}")
    print(f"    hero CTA -> {APP} : {n}")
    return 0


if __name__ == '__main__':
    sys.exit(main())
