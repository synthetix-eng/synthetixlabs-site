#!/usr/bin/env bash
# finalise-preview.sh -- clean up the wget mirror in synthetix-preview-8f3c2a
# so it is deployable as the real static site.
#
# Run from inside a clone of the repo:  ./finalise-preview.sh
#
set -uo pipefail
[ -f index.html ] || { echo "run this from the repo root"; exit 1; }

echo "==> 1. Removing wget query-string duplicates (?p=NNNN)"
# These duplicate pages that already exist at proper paths. The '?' also
# breaks routing on GitHub Pages / Firebase, and they create duplicate-content
# SEO penalties against the canonical URLs.
find . -maxdepth 1 -name 'index.html?p=*' -print -delete | sed 's/^/    removed /'

echo "==> 2. Removing the author archive that exposes the admin username"
rm -rf "resources/blogs/author/admin_jcmef8dd" && echo "    removed admin author archive"

echo "==> 3. Removing placeholder posts"
for p in x x-2 x-3 x-4; do
  [ -d "resources/blogs/$p" ] && rm -rf "resources/blogs/$p" && echo "    removed resources/blogs/$p"
done

echo "==> 4. Removing WordPress endpoint references (all dead on static)"
python3 - <<'PY'
import pathlib, re
kill = [
    re.compile(r'<link[^>]+rel=["\'](pingback|EditURI|wlwmanifest|shortlink)["\'][^>]*>', re.I),
    re.compile(r'<link[^>]+rel=["\']https://api\.w\.org/["\'][^>]*>', re.I),
    re.compile(r'<link[^>]+rel=["\']alternate["\'][^>]*application/json[^>]*>', re.I),
    re.compile(r'<meta[^>]+name=["\']generator["\'][^>]*>', re.I),
]
n = 0
for p in pathlib.Path('.').rglob('*.html'):
    if '.git' in p.parts: continue
    t = orig = p.read_text(errors='ignore')
    for rx in kill: t = rx.sub('', t)
    if t != orig:
        p.write_text(t); n += 1
print(f"    cleaned {n} file(s)")
PY

echo "==> 5. Flagging the broken contact forms"
echo "    These still point at Contact Form 7 endpoints that no longer exist."
echo "    Submissions will fail SILENTLY until replaced with a HubSpot embed:"
grep -rl 'wpcf7-form' --include='*.html' . 2>/dev/null | sed 's/^/      /'

echo "==> 6. Oversized images (compress before launch)"
find . -type f \( -name '*.jpg' -o -name '*.png' \) -size +1M -not -path './.git/*' \
  -exec ls -lah {} \; 2>/dev/null | awk '{print "      " $5, $9}' | sort -rh | head -12

echo "==> 7. Final IOC verification"
IOC='JANCOK|AVRIL_START|lil_tmp|harvest=1|cache-optimizer-|site-health-[0-9a-f]{8}|wp-obj-|eval\(base64_decode'
# NOTE: --exclude the scanner's own files. This script, the plan, the audit and
# the CI workflow all contain the IOC pattern as literal text, so an unfiltered
# scan matches itself and fails 100% of the time. Same filter must be used in CI.
SCAN_EXCLUDES=(--exclude='finalise-preview.sh' --exclude='SYNTHETIX_STATIC_PLAN.md'
               --exclude='AUDIT.md' --exclude-dir='.git' --exclude-dir='.github')
if grep -rEl --binary-files=without-match "${SCAN_EXCLUDES[@]}" "$IOC" . 2>/dev/null | grep -q .; then
  echo "    *** IOC MATCH -- DO NOT DEPLOY ***"; exit 2
fi
find . -name '*.php' -not -path './.git/*' | grep -q . && { echo "    *** PHP FOUND ***"; exit 2; }
echo "    clean: no IOCs, no PHP"

echo
echo "==> Done. Preview locally:  python3 -m http.server 8080"
echo "    Pages: $(find . -name index.html -not -path './.git/*' | wc -l)"
