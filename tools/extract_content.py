#!/usr/bin/env python3
"""
extract_content.py -- build src/content/ from the wp_posts dump.

Three collections, because the three content types genuinely differ in shape.
Modelling them as one `posts` collection with mostly-empty fields would make
the Keystatic editing experience worse for every editor.

Tags come from the rendered pages, not the dump: WordPress keeps them in
wp_terms / wp_term_relationships, which this dump does not include.
"""
import html as _html
import json
import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from wp_to_markdown import convert

COLLECTIONS = {
    'articles': dict(type='post', slugs=[
        'why-governance-is-the-real-bottleneck-in-agentic-software-delivery',
        'the-autonomy-spectrum-where-ai-agents-should-and-shouldnt-have-authority',
        'why-agentic-delivery-platforms-fail-their-compliance-review-and-what-passes',
        'why-every-modernization-program-fails-without-a-knowledge-graph-first',
        'fast-isnt-safe-closing-the-governance-gap-in-greenfield-development']),
    'case-studies': dict(type='case-study', slugs=[
        'how-synthetix-modernized-banking-infrastructure',
        'how-synthetix-reduced-operational-toil-for-a-healthcare-client']),
    'agent-docs': dict(type='productdocumentation', slugs=[
        'cartographer-agent', 'scout-agent', 'gatekeeper-agent', 'examiner-agent',
        'estimator-agent', 'critic-agent', 'conductor-agent', 'architect-agent']),
}

# Live content defect: this post's body is Cartographer agent documentation,
# not an article about compliance review. Confirmed identical in the dump AND
# on the rendered page, so it is a pre-existing authoring error rather than a
# migration fault. Migrated as a draft so it cannot silently ship as correct.
MISMATCHED = {'why-agentic-delivery-platforms-fail-their-compliance-review-and-what-passes'}

RENDERED_ROOT = pathlib.Path('public/resources/blogs')


def yaml_str(s: str) -> str:
    return '"' + s.replace('\\', '\\\\').replace('"', '\\"') + '"'


def tags_for(slug: str) -> list:
    for cand in (RENDERED_ROOT / slug,
                 RENDERED_ROOT / 'resources' / 'case-study' / slug,
                 RENDERED_ROOT / 'resources' / 'product-documentation' / slug):
        f = cand / 'index.html'
        if f.exists():
            t = f.read_text(errors='ignore')
            found = re.findall(
                r'<a[^>]*class="tags-item[^"]*"[^>]*href="[^"]*/tag/([a-z0-9-]+)/', t)
            return sorted(set(found))
    return []


def main():
    if len(sys.argv) < 2:
        print("usage: extract_content.py <parsed-posts.json>\n"
              "  produce it with: ./tools/parse_wp_dump.py <dump.sql> posts.json\n"
              "  the dump is NOT in this repo - it is a database export and stays out of it",
              file=sys.stderr)
        return 2
    rows = json.load(open(sys.argv[1]))
    by_slug = {}
    for r in rows:
        if r['post_status'] == 'publish':
            by_slug.setdefault((r['post_type'], r['post_name']), r)

    total = 0
    for coll, spec in COLLECTIONS.items():
        out_dir = pathlib.Path('src/content') / coll
        out_dir.mkdir(parents=True, exist_ok=True)
        for slug in spec['slugs']:
            r = by_slug.get((spec['type'], slug))
            if not r:
                print(f"    MISSING {spec['type']}/{slug}", file=sys.stderr)
                continue

            body = convert(r['post_content'])
            title = _html.unescape(r['post_title']).strip()
            excerpt = _html.unescape(re.sub(r'<[^>]+>', '', r['post_excerpt'])).strip()
            if not excerpt:
                first = next((l for l in body.split('\n')
                              if l.strip() and not l.startswith(('#', '-', '>', '1.'))), '')
                excerpt = first.strip()[:200]

            fm = [
                '---',
                f'title: {yaml_str(title)}',
                f'date: {r["post_date"][:10]}',
                f'updated: {r["post_modified"][:10]}',
                f'excerpt: {yaml_str(excerpt)}',
            ]
            if coll == 'articles':
                tags = tags_for(slug)
                fm.append('tags: [' + ', '.join(yaml_str(t) for t in tags) + ']')
                fm.append('author: "nitin"')
            if coll == 'agent-docs':
                fm.append(f'agent: {yaml_str(title.replace(" Agent", "").strip())}')
            if slug in MISMATCHED:
                fm.append('draft: true')
                fm.append('# NOTE: body content does not match this title. Pre-existing')
                fm.append('# authoring error, identical in the DB and on the live site.')
                fm.append('# Needs correct copy before publishing.')
            fm.append('---')

            (out_dir / f'{slug}.md').write_text('\n'.join(fm) + '\n\n' + body)
            total += 1
            flag = '  [DRAFT - content mismatch]' if slug in MISMATCHED else ''
            print(f"    {coll:<13} {slug[:52]:<54} {len(body):>6}b{flag}")

    print(f"\n    wrote {total} file(s)")
    return 0


if __name__ == '__main__':
    sys.exit(main())
