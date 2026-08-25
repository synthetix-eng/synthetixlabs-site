#!/usr/bin/env bash
# security-scan.sh -- gate that runs before any deploy, locally and in CI.
#
# Every check here exists because the corresponding failure actually happened
# during the rebuild. Do not remove one without understanding what it caught.
set -uo pipefail
fail=0

# Scan a target directory. Defaults to the repo root; CI passes "dist" so the
# checks run against what will actually be served, not against the sources.
TARGET="${1:-.}"
cd "$TARGET" || { echo "no such directory: $TARGET"; exit 1; }
echo "==> scanning: $TARGET"

# The scanner must never scan its own pattern definitions. The plan's original
# version grepped the IOC regex out of finalise-preview.sh and the plan .md and
# reported "IOC MATCH" on completely clean content -- which would have failed
# every single deploy, permanently.
EXCL=(--exclude='security-scan.sh' --exclude='finalise-preview.sh'
      --exclude='SYNTHETIX_STATIC_PLAN.md' --exclude='AUDIT.md'
      --exclude-dir='.git' --exclude-dir='.github' --exclude-dir='node_modules')

IOC='JANCOK|AVRIL_START|lil_tmp|harvest=1|cache-optimizer-|site-health-[0-9a-f]{8}|wp-obj-|eval\(base64_decode|assert\(base64'

echo "==> 1. Indicators of compromise"
if grep -rEl --binary-files=without-match "${EXCL[@]}" "$IOC" . 2>/dev/null | grep -q .; then
  echo "    FAIL - IOC match:"; grep -rEl --binary-files=without-match "${EXCL[@]}" "$IOC" . | sed 's/^/      /'
  fail=1
else echo "    ok"; fi

echo "==> 2. No PHP anywhere"
if find . -name '*.php' -not -path './.git/*' | grep -q .; then
  echo "    FAIL - PHP present:"; find . -name '*.php' -not -path './.git/*' | sed 's/^/      /'
  fail=1
else echo "    ok"; fi

echo "==> 3. No WordPress endpoints re-advertised"
for pat in 'wp-json' 'xmlrpc' 'api.w.org' 'rel="pingback"' 'name="generator"'; do
  n=$(grep -rl "$pat" --include='*.html' "${EXCL[@]}" . 2>/dev/null | wc -l | tr -d ' ')
  if [ "$n" != "0" ]; then echo "    FAIL - '$pat' in $n file(s)"; fail=1; fi
done
[ $fail -eq 0 ] && echo "    ok"

echo "==> 4. No dead Contact Form 7 / file-upload fields"
# CF7 posted to endpoints that no longer exist, so submissions failed silently.
# Its upload field is the suspected original attack vector.
for pat in 'wpcf7' 'multipart/form-data' 'type="file"'; do
  n=$(grep -rl "$pat" --include='*.html' "${EXCL[@]}" . 2>/dev/null | wc -l | tr -d ' ')
  if [ "$n" != "0" ]; then echo "    FAIL - '$pat' in $n file(s)"; fail=1; fi
done
[ $fail -eq 0 ] && echo "    ok"

echo "==> 5. No query strings baked into filenames"
# wget saved 'jquery.min.js?ver=3.7.1'; its real extension is '.1', so Firebase
# served it as text/html and nosniff made the browser refuse to execute it.
# jQuery never loaded and the site hung forever on its splash screen.
bad=$(find . -path ./.git -prune -o -type f -name '*[?]*' -print 2>/dev/null | grep -v '\.css$' | wc -l | tr -d ' ')
if [ "$bad" != "0" ]; then
  echo "    FAIL - $bad file(s) would be served with the wrong Content-Type:"
  find . -path ./.git -prune -o -type f -name '*[?]*' -print | grep -v '\.css$' | head | sed 's/^/      /'
  fail=1
else echo "    ok"; fi

echo "==> 6. Admin username not exposed"
if grep -rql 'admin_jcmef8dd' --include='*.html' . 2>/dev/null; then
  echo "    FAIL - admin username present in page source"; fail=1
else echo "    ok"; fi

echo "==> 6b. No noindex directives"
# The mirror carried noindex,nofollow on ALL 40 pages, inherited from the
# source WordPress install's "discourage search engines" setting. Shipping it
# would de-index the entire marketing site from Google.
if grep -rlE '<meta[^>]*name="robots"[^>]*noindex' --include='*.html' . 2>/dev/null | grep -q .; then
  echo "    FAIL - noindex present, the site would be de-indexed:"
  grep -rlE '<meta[^>]*name="robots"[^>]*noindex' --include='*.html' . | head | sed 's|^|      |'
  fail=1
else echo "    ok"; fi

echo "==> 6c. Every page has exactly one absolute canonical"
badcanon=0
while IFS= read -r f; do
  n=$(grep -c 'rel="canonical"' "$f")
  if [ "$n" != "1" ]; then echo "    FAIL - $f has $n canonical(s)"; badcanon=1; fi
done < <(find . -name index.html -not -path './.git/*')
if grep -rhoE '<link[^>]*rel="canonical"[^>]*>' --include='*.html' . 2>/dev/null | grep -qv 'https://synthetixlabs.ai'; then
  echo "    FAIL - non-absolute canonical found"; badcanon=1
fi
if [ $badcanon -ne 0 ]; then fail=1; else echo "    ok"; fi

echo "==> 7. .git excluded from the deploy"
# The plan's ignore list used '**/.*', which excludes root dotfiles but NOT the
# contents of a dot-directory. The first deploy published .git to the public web.
FB=firebase.json; [ -f "$FB" ] || FB=../firebase.json
if ! grep -q '\.git/\*\*' "$FB" 2>/dev/null; then
  echo "    FAIL - firebase.json does not ignore .git/**"; fail=1
else echo "    ok"; fi

echo
if [ $fail -ne 0 ]; then echo "SCAN FAILED - do not deploy"; exit 1; fi
echo "SCAN PASSED"
