#!/usr/bin/env python3
"""
parse_wp_dump.py -- extract post rows from a mysqldump of wp_posts.

Written rather than reached for off the shelf because the dump is the single
source of truth for content and a silent mis-parse would corrupt the migration.
Handles SQL string escaping properly: \\' \\" \\\\ \\n \\r \\0 \\Z and doubled ''.
"""
import re, sys, json, pathlib

COLS = ['ID','post_author','post_date','post_date_gmt','post_content','post_title',
        'post_excerpt','post_status','comment_status','ping_status','post_password',
        'post_name','to_ping','pinged','post_modified','post_modified_gmt',
        'post_content_filtered','post_parent','guid','menu_order','post_type',
        'post_mime_type','comment_count']

UNESC = {"\\'":"'", '\\"':'"', '\\\\':'\\', '\\n':'\n', '\\r':'\r',
         '\\t':'\t', '\\0':'\0', '\\Z':'\x1a', '\\b':'\b'}


def split_values(s, i):
    """Parse one (...) tuple starting at s[i]=='('. Returns (fields, next_index)."""
    assert s[i] == '('
    i += 1
    out, buf, in_str = [], [], False
    while i < len(s):
        c = s[i]
        if in_str:
            if c == '\\' and i + 1 < len(s):
                buf.append(UNESC.get(s[i:i+2], s[i+1])); i += 2; continue
            if c == "'":
                if i + 1 < len(s) and s[i+1] == "'":     # doubled '' escape
                    buf.append("'"); i += 2; continue
                in_str = False; i += 1; continue
            buf.append(c); i += 1; continue
        if c == "'":
            in_str = True; i += 1; continue
        if c == ',':
            out.append(''.join(buf).strip()); buf = []; i += 1; continue
        if c == ')':
            out.append(''.join(buf).strip()); return out, i + 1
        buf.append(c); i += 1
    raise ValueError('unterminated tuple')


def main():
    raw = pathlib.Path(sys.argv[1]).read_text(encoding='utf-8', errors='ignore')
    rows = []
    for m in re.finditer(r'INSERT INTO `wp_posts`[^(]*', raw):
        i = raw.find('(', m.end() - 1)
        while i != -1 and i < len(raw):
            try:
                vals, i = split_values(raw, i)
            except ValueError:
                break
            if len(vals) == len(COLS):
                rows.append(dict(zip(COLS, vals)))
            while i < len(raw) and raw[i] in ' \n\r\t,':
                i += 1
            if i >= len(raw) or raw[i] != '(':
                break
    print(f"parsed rows: {len(rows)}", file=sys.stderr)
    pathlib.Path(sys.argv[2]).write_text(json.dumps(rows, indent=1))
    return 0


if __name__ == '__main__':
    sys.exit(main())
