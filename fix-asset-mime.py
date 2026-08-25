#!/usr/bin/env python3
"""
fix-asset-mime.py -- rename assets whose filename contains a query string.

wget saved WordPress's versioned assets with the query baked into the
filename, e.g. "jquery.min.js?ver=3.7.1". That file's real extension is ".1",
not ".js", so Firebase Hosting serves it as Content-Type: text/html. Combined
with the X-Content-Type-Options: nosniff header from the plan's own security
config, the browser REFUSES to execute it:

    Refused to execute script from '.../jquery.min.js%3Fver=3.7.1'
    because its MIME type ('text/html') is not executable

jQuery therefore never loads, every dependent script dies, main.js never
reaches rdJs.preloader(), and the site hangs forever on the splash screen.

Only files whose *real* extension is wrong are renamed. Files like
"styles.css?ver=6.1.6.css" already end in .css and are served correctly, so
they are deliberately left alone - renaming them would also collide
(post-10.css exists at two ?ver= timestamps).

References are rewritten by exact basename so untouched files stay untouched.

Idempotent.
"""
import pathlib, re, sys, subprocess

def main():
    roots = [p for p in pathlib.Path('.').rglob('*?*')
             if p.is_file() and '?' in p.name and '.git' not in p.parts
             and not p.name.endswith('.css')]
    if not roots:
        print("    nothing to rename (already fixed)")
        return 0

    renames = {}
    for p in sorted(roots):
        new_name = p.name.split('?', 1)[0]
        if not new_name:
            continue
        target = p.with_name(new_name)
        if target.exists():
            print(f"    SKIP collision: {p} -> {target}", file=sys.stderr)
            continue
        subprocess.run(['git', 'mv', str(p), str(target)], check=False,
                       capture_output=True) or None
        if p.exists():                       # git mv failed (untracked) -> plain rename
            p.rename(target)
        renames[p.name] = new_name

    print(f"    renamed {len(renames)} file(s)")

    # rewrite references: basename with %3F / ? encoded query -> plain basename
    refs = files = 0
    for f in sorted(pathlib.Path('.').rglob('*')):
        if f.suffix.lower() not in ('.html', '.css', '.js') or '.git' in f.parts:
            continue
        orig = f.read_text(errors='ignore')
        t = orig
        for old, new in renames.items():
            for enc in (old.replace('?', '%3F'), old):
                if enc in t:
                    refs += t.count(enc)
                    t = t.replace(enc, new)
        if t != orig:
            f.write_text(t)
            files += 1

    print(f"    rewrote {refs} reference(s) across {files} file(s)")
    return 0

if __name__ == '__main__':
    sys.exit(main())
