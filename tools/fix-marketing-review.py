#!/usr/bin/env python3
"""
fix-marketing-review.py -- issues raised in "Synthetix Staging Review" (marketing, 26 Aug).

Every change here corresponds to a numbered slide in that deck.
Idempotent: re-running finds nothing to do.
"""
import pathlib, re, sys

HOME = pathlib.Path('public/index.html')
AGENTS = pathlib.Path('public/agents/index.html')
SOLUTIONS = pathlib.Path('public/solutions/index.html')

# Slides 3-6: each homepage carousel card links to a dead "index.html#".
# Both the card title and its arrow are anchors; marketing highlighted the
# arrow, but leaving the title dead would be an obvious miss.
CAROUSEL = {
    'Governed by Design':           '/governance/',
    'Estate-Wide Intelligence':     '/solutions/',
    'Built for Regulated Industries': '/governance/',
    'Measurable Business Outcomes': '/why-synthetix/',
}

# Slide 2: the hero lost its second CTA when the stale Ai4 button was removed.
# Marketing wants "Explore Synthetix" in that slot, reusing the same styling.
ARROW = '/wp-content/themes/agenio/assets/images/icon/button-arrow.svg'
EXPLORE_HREF = '/platform/'
EXPLORE = (
    f'<a href="{EXPLORE_HREF}" class="wpr-btn btn-primary with-icon">\n'
    '                                <div class="inner">\n'
    '                                    <div class="icon">\n'
    + ''.join(
        '                                        <span>\n'
        f'                                            <img decoding="async" src="{ARROW}" alt="">\n'
        '                                        </span>\n' for _ in range(6))
    + '                                    </div>\n'
    '                                </div>\n'
    '                                Explore Synthetix                            </a>'
)


def fix_carousel(t):
    n = 0
    for title, href in CAROUSEL.items():
        i = t.find(f'>{title}</a>')
        if i == -1:
            print(f"    WARN carousel card not found: {title}", file=sys.stderr)
            continue
        # the card block runs from its slide wrapper to the next one
        start = t.rfind('<div class="swiper-slide">', 0, i)
        end = t.find('<div class="swiper-slide">', i)
        if end == -1:
            end = len(t)
        block = t[start:end]
        fixed, c = re.subn(r'href="index\.html#"', f'href="{href}"', block)
        if c:
            t = t[:start] + fixed + t[end:]
            n += c
    return t, n


def main():
    total = 0

    # --- home ---
    t = orig = HOME.read_text(errors='ignore')
    t, n = fix_carousel(t)
    print(f"    carousel links repointed        : {n}")
    total += n

    # Guard on the BUTTON, not the words: the page already contains a heading
    # "Before You Explore Synthetix", and a substring check silently skipped
    # adding the CTA.
    if 'Explore Synthetix                            </a>' not in t:
        m = re.search(r'(<a href="/contact/" class="wpr-btn btn-white">\s*Request a Demo\s*</a>)', t)
        if m:
            t = t[:m.end()] + '\n                            ' + EXPLORE + t[m.end():]
            print(f"    'Explore Synthetix' CTA added   : 1 -> {EXPLORE_HREF}")
            total += 1
        else:
            print("    WARN hero 'Request a Demo' not found", file=sys.stderr)
    else:
        print("    'Explore Synthetix' CTA         : already present")
    if t != orig:
        HOME.write_text(t)

    # --- agents: slide 7 ---
    t = orig = AGENTS.read_text(errors='ignore')
    t, n = re.subn(r"url: '#[a-z]+'", "url: '/resources/product-documentation/'", t)
    print(f"    agent doc CTA links fixed       : {n}")
    total += n
    if t != orig:
        AGENTS.write_text(t)

    # --- solutions: slide 8 ---
    t = orig = SOLUTIONS.read_text(errors='ignore')
    t, n = re.subn(r'<a href="/solutions/" class="wpr-btn btn-primary with-icon">',
                   '<a href="/why-synthetix/" class="wpr-btn btn-primary with-icon">', t)
    print(f"    solutions 'Learn more' repointed: {n}")
    total += n
    if t != orig:
        SOLUTIONS.write_text(t)

    print(f"\n    total changes: {total}")
    return 0


if __name__ == '__main__':
    sys.exit(main())
