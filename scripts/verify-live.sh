#!/usr/bin/env bash
# verify-live.sh -- uptime + content-drift check against the live site.
#
# On a git-backed static site, any content change that did not come from a
# commit is by definition unauthorised. Firebase serves deployed files byte for
# byte, so the sha256 of each live page must equal the sha256 of the file in
# this commit. A mismatch means either an out-of-band deploy or tampering.
#
# Usage: ./scripts/verify-live.sh [base-url]
set -uo pipefail
BASE="${1:-https://synthetixlabs-site.web.app}"
fail=0; checked=0; drift=0

echo "==> Target: $BASE"

echo "==> 1. Availability"
code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$BASE/")
echo "    homepage HTTP $code"
[ "$code" = "200" ] || { echo "    FAIL - homepage not reachable"; exit 1; }

echo "==> 2. Security headers"
hdrs=$(curl -sI --max-time 20 "$BASE/")
for h in x-content-type-options x-frame-options referrer-policy strict-transport-security permissions-policy; do
  if echo "$hdrs" | grep -qi "^$h:"; then echo "    ok   $h"
  else echo "    FAIL missing $h"; fail=1; fi
done

echo "==> 3. Scripts served executably"
# The site once returned 200 everywhere while serving jQuery as text/html,
# so nothing executed and every page hung on the splash screen.
ct=$(curl -s -o /dev/null -w '%{content_type}' --max-time 20 "$BASE/wp-includes/js/jquery/jquery.min.js")
case "$ct" in
  *javascript*|*ecmascript*) echo "    ok   jquery: $ct" ;;
  *) echo "    FAIL jquery served as '$ct'"; fail=1 ;;
esac

echo "==> 4. .git not published"
g=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$BASE/.git/config")
if [ "$g" = "404" ]; then echo "    ok   .git/config 404"; else echo "    FAIL .git exposed ($g)"; fail=1; fi

echo "==> 5. Content drift vs this commit"
while IFS= read -r f; do
  path="/${f#./}"; path="${path%index.html}"
  local_h=$(shasum -a 256 "$f" | awk '{print $1}')
  remote_h=$(curl -s --max-time 20 "$BASE$path" | shasum -a 256 | awk '{print $1}')
  checked=$((checked+1))
  if [ "$local_h" != "$remote_h" ]; then
    echo "    DRIFT $path"
    echo "      committed: $local_h"
    echo "      live     : $remote_h"
    drift=$((drift+1)); fail=1
  fi
done < <(find . -name index.html -not -path './.git/*' | sort)
echo "    checked $checked page(s), $drift drifted"

echo
if [ $fail -ne 0 ]; then echo "VERIFY FAILED"; exit 1; fi
echo "VERIFY PASSED"
