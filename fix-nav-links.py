#!/usr/bin/env python3
"""
fix-nav-links.py -- rewrite links that pointed at the deleted ?p=NNNN duplicates.

finalise-preview.sh deletes the 30 `index.html?p=NNNN.html` wget duplicates.
Those files were the targets of the site's MAIN NAVIGATION, the mobile menu and
the primary Contact CTA -- 1,317 links across all 40 pages. Deleting them
without rewriting the links breaks navigation site-wide, so this MUST run
immediately after the deletion step.

The map below was recovered from git history (each duplicate's <title> matched
against the canonical page on disk) before the duplicates were removed. It is
hardcoded because once they are deleted the mapping cannot be rebuilt.

Targets are root-absolute, matching how the mirror already references
/wp-content/... and how Firebase Hosting serves from the domain root.
"""
import pathlib, re, sys

MAP = {
    '70': '/agents/',
    '206': '/company/',
    '224': '/platform/',
    '245': '/governance/',
    '263': '/solutions/',
    '268': '/contact/',
    '275': '/why-synthetix/',
    '1950': '/resources/blogs/why-governance-is-the-real-bottleneck-in-agentic-software-delivery/',
    '1975': '/resources/blogs/',
    '2096': '/resources/',
    '2216': '/resources/blogs/the-autonomy-spectrum-where-ai-agents-should-and-shouldnt-have-authority/',
    '2218': '/resources/blogs/why-agentic-delivery-platforms-fail-their-compliance-review-and-what-passes/',
    '2231': '/resources/case-study/',
    '2236': '/resources/blogs/resources/case-study/how-synthetix-reduced-operational-toil-for-a-healthcare-client/',
    '2243': '/resources/blogs/resources/product-documentation/cartographer-agent/',
    '2247': '/resources/product-documentation/',
    '2256': '/resources/blogs/resources/case-study/how-synthetix-modernized-banking-infrastructure/',
    '2363': '/resources/blogs/resources/product-documentation/scout-agent/',
    '2417': '/resources/blogs/resources/product-documentation/gatekeeper-agent/',
    '2418': '/resources/blogs/resources/product-documentation/examiner-agent/',
    '2419': '/resources/blogs/resources/product-documentation/estimator-agent/',
    '2420': '/resources/blogs/resources/product-documentation/critic-agent/',
    '2421': '/resources/blogs/resources/product-documentation/conductor-agent/',
    '2422': '/resources/blogs/resources/product-documentation/architect-agent/',
    '2426': '/resources/blogs/why-every-modernization-program-fails-without-a-knowledge-graph-first/',
    '2429': '/resources/blogs/fast-isnt-safe-closing-the-governance-gap-in-greenfield-development/',
    '2540': '/resources/blogs/',  # deleted placeholder post
    '2546': '/resources/blogs/',  # deleted placeholder post
    '2566': '/resources/blogs/',  # deleted placeholder post
    '2569': '/resources/blogs/',  # deleted placeholder post
}

# (../)*index.html%3Fp=NNNN.html  ->  /canonical/   (any #anchor is preserved)
PAT = re.compile(r'(?:\.\./)*index\.html%3Fp=(\d+)\.html')

def main():
    changed = total = 0
    unknown = set()
    for p in sorted(pathlib.Path('.').rglob('*.html')):
        if '.git' in p.parts:
            continue
        orig = p.read_text(errors='ignore')

        def sub(m):
            nonlocal total
            tgt = MAP.get(m.group(1))
            if tgt is None:
                unknown.add(m.group(1))
                return m.group(0)
            total += 1
            return tgt

        new = PAT.sub(sub, orig)
        if new != orig:
            p.write_text(new)
            changed += 1

    print(f"    rewrote {total} link(s) across {changed} file(s)")
    if unknown:
        print(f"    WARNING: no mapping for post id(s): {sorted(unknown)}", file=sys.stderr)
        return 1
    return 0

if __name__ == '__main__':
    sys.exit(main())
