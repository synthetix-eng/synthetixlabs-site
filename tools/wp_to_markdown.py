#!/usr/bin/env python3
"""
wp_to_markdown.py -- convert WordPress Gutenberg block markup to Markdown.

Scoped deliberately to the block types this content actually uses:
heading, paragraph, list, list-item, quote. Anything else raises rather than
being silently dropped -- a migration that quietly loses a block is worse than
one that stops and tells you.
"""
import html as _html
import re

INLINE = [
    (re.compile(r'<strong[^>]*>(.*?)</strong>', re.S | re.I), r'**\1**'),
    (re.compile(r'<b[^>]*>(.*?)</b>', re.S | re.I),           r'**\1**'),
    (re.compile(r'<em[^>]*>(.*?)</em>', re.S | re.I),         r'*\1*'),
    (re.compile(r'<i[^>]*>(.*?)</i>', re.S | re.I),           r'*\1*'),
    (re.compile(r'<code[^>]*>(.*?)</code>', re.S | re.I),     r'`\1`'),
    (re.compile(r'<br\s*/?>', re.I),                          '\n'),
]
LINK = re.compile(r'<a[^>]*href="([^"]*)"[^>]*>(.*?)</a>', re.S | re.I)
TAG = re.compile(r'<[^>]+>')

KNOWN = {'heading', 'paragraph', 'list', 'list-item', 'quote'}


def inline(s: str) -> str:
    s = LINK.sub(lambda m: f'[{TAG.sub("", m.group(2)).strip()}]({m.group(1)})', s)
    for rx, rep in INLINE:
        s = rx.sub(rep, s)
    s = TAG.sub('', s)
    s = _html.unescape(s)
    s = s.replace(' ', ' ')          # &nbsp; -> real space
    s = re.sub(r'[ \t]+', ' ', s)
    return s.strip()


def convert(content: str) -> str:
    """Gutenberg block HTML -> Markdown."""
    seen = set(re.findall(r'<!--\s+wp:([a-z0-9/-]+)', content))
    unknown = seen - KNOWN
    if unknown:
        raise ValueError(f'unsupported block type(s): {sorted(unknown)}')

    out = []
    # Walk top-level blocks in order.
    for m in re.finditer(
            r'<!--\s+wp:([a-z-]+)(\s+\{.*?\})?\s+-->(.*?)<!--\s+/wp:\1\s+-->',
            content, re.S):
        kind, attrs, inner = m.group(1), m.group(2) or '', m.group(3)

        if kind == 'heading':
            lvl = 2
            lm = re.search(r'"level"\s*:\s*(\d)', attrs)
            if lm:
                lvl = int(lm.group(1))
            text = inline(inner)
            if text:
                out.append('#' * lvl + ' ' + text)

        elif kind == 'paragraph':
            text = inline(inner)
            if text:
                out.append(text)

        elif kind == 'list':
            ordered = '"ordered":true' in attrs.replace(' ', '')
            items = re.findall(
                r'<!--\s+wp:list-item\s+-->(.*?)<!--\s+/wp:list-item\s+-->',
                inner, re.S)
            lines = []
            for n, it in enumerate(items, 1):
                text = inline(it)
                if text:
                    lines.append(f'{n}. {text}' if ordered else f'- {text}')
            if lines:
                out.append('\n'.join(lines))

        elif kind == 'quote':
            text = inline(inner)
            if text:
                out.append('\n'.join('> ' + l for l in text.split('\n')))

    # Each bullet was authored as its own wp:list block, so adjacent lists are
    # coalesced into one. Otherwise every bullet becomes a separate loose list.
    merged = []
    for blk in out:
        is_list = blk.startswith(('- ', '1. '))
        if is_list and merged and merged[-1].startswith(('- ', '1. ')):
            merged[-1] = merged[-1] + '\n' + blk
        else:
            merged.append(blk)

    md = '\n\n'.join(merged)
    md = re.sub(r'\n{3,}', '\n\n', md)
    return md.strip() + '\n'
