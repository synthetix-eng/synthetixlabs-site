#!/usr/bin/env bash
# verify-urls.sh -- every URL that was live must still resolve.
#
# The migration's single largest risk is silently dropping an indexed URL.
# scripts/expected-urls.txt is the frozen inventory from before the Astro port;
# a URL may only leave it by being built, or by having a 301 in firebase.json.
# Adding new URLs is fine. Losing one fails the build.
set -uo pipefail
DIST="${1:-dist}"
EXPECTED="$(dirname "$0")/expected-urls.txt"
FB="$(dirname "$0")/../firebase.json"

built=$(cd "$DIST" && find . -name index.html | sed 's|^\.||; s|index\.html$||' | sort)
redirects=$(python3 -c "
import json,sys
try: rs=json.load(open('$FB'))['hosting'].get('redirects',[])
except Exception: rs=[]
for r in rs: print(r['source'].rstrip('/') + '/')
" 2>/dev/null)

missing=0
while IFS= read -r u; do
  [ -z "$u" ] && continue
  if echo "$built" | grep -qxF "$u"; then continue; fi
  if echo "$redirects" | grep -qxF "$u"; then continue; fi
  echo "    LOST  $u"
  missing=$((missing+1))
done < "$EXPECTED"

total=$(grep -vc '^$' "$EXPECTED")
echo "    expected: $total   built: $(echo "$built" | grep -vc '^$')   redirected: $(echo "$redirects" | grep -vc '^$')   lost: $missing"
[ "$missing" -eq 0 ] || { echo "URL CHECK FAILED - indexed URLs would 404"; exit 1; }
echo "URL CHECK PASSED"
