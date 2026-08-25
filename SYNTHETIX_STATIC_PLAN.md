# Synthetix Labs — Static Site Rebuild & GCP Hosting

**Plan for execution in Claude Code.** Drop this file at the repo root and work through it phase by phase.

---

## Context (read first)

`synthetixlabs.ai` ran WordPress on a shared cPanel host that was compromised. Attackers used the WordPress REST batch endpoint (`/index.php?rest_route=/batch/v1`) to create an admin account without authentication, then installed webshells disguised as plugins. Cleanup failed twice because the entry vector stayed open.

**The fix is architectural:** serve static HTML with no PHP, no database, no admin login, no REST API.

**Source of truth:** a wget mirror of the site, taken while it was rendering clean. It has been scanned — no indicators of compromise, no PHP files, no injected content. Do **not** pull replacement files from the compromised server.

**Non-negotiable rule:** if the IOC scan fails at any point, stop. Do not deploy.

---

## Phase 0 — Repository setup

The mirror currently lives on a personal GitHub account. Move it into a company org before it becomes production infrastructure.

```bash
git clone https://github.com/AdithyaSrinivasan3112/synthetix-preview-8f3c2a.git synthetixlabs-site
cd synthetixlabs-site
git remote remove origin
git remote add origin git@github.com:<COMPANY_ORG>/synthetixlabs-site.git
git push -u origin main
```

**Acceptance:** repo lives in the company org, branch protection on `main`, at least two people with admin.

---

## Phase 1 — Audit

Have Claude Code produce a written report before changing anything.

```bash
# Indicators of compromise from this incident
IOC='JANCOK|AVRIL_START|lil_tmp|harvest=1|cache-optimizer-|site-health-[0-9a-f]{8}|wp-obj-|eval\(base64_decode|assert\(base64'
grep -rEln --binary-files=without-match "$IOC" . | grep -v '^./.git'

# There must be zero
find . -name '*.php' -not -path './.git/*'

# Anything before <!DOCTYPE> is injected
for f in $(find . -name '*.html' -not -path './.git/*'); do
  head -c 20 "$f" | grep -qi '<!DOCTYPE\|<html' || echo "SUSPECT: $f"
done

# Obfuscation patterns
grep -rEln 'document\.write\(unescape|fromCharCode\(.{80,}' --include='*.html' --include='*.js' .

# Inventory
find . -name index.html -not -path './.git/*' | grep -v '?' | sort
```

**Ask Claude Code to report:** page count, total size, external domains referenced by scripts, every form and its action, and any absolute link back to `synthetixlabs.ai` or `dev.synthetixlabs.ai`.

**Acceptance:** clean scan, and a written inventory committed as `AUDIT.md`.

---

## Phase 2 — Cleanup

Known issues in the mirror:

| Issue | Action |
|---|---|
| 30 x `index.html?p=NNNN.html` | Delete — duplicates of real pages; `?` breaks static routing |
| `resources/blogs/author/admin_jcmef8dd/` | Delete — exposes admin username |
| `resources/blogs/x`, `x-2`, `x-3`, `x-4` | Delete — placeholder posts |
| `wp-json` / `xmlrpc` / `api.w.org` / `generator` tags | Strip — dead endpoints, advertise the old stack |
| 3 images over 2.8 MB | Compress to WebP, target < 300 KB |

Run `finalise-preview.sh` for the first four, then:

```bash
# Image optimisation
find . -name '*.jpg' -size +500k -not -path './.git/*' \
  -exec cwebp -q 82 {} -o {}.webp \;
```

**Acceptance:** IOC scan still clean, all 47 pages render locally via `python3 -m http.server 8080`, no console errors, total size under 60 MB.

---

## Phase 3 — Fix the contact form (blocking)

The mirror still contains Contact Form 7 markup posting to `action="../index.html%3Fp=268.html"`. That endpoint does not exist. **Submissions fail silently** — visitors see a form, submit it, and nothing arrives.

This form also had a file upload (`wpcf7-file`, `enctype="multipart/form-data"`), which is likely the original attack vector. Do not recreate upload functionality.

Replace with a HubSpot embedded form:

```html
<div class="hs-form-frame"
     data-region="na1"
     data-form-id="<FORM_ID>"
     data-portal-id="<PORTAL_ID>"></div>
<script defer src="https://js.hsforms.net/forms/embed/<PORTAL_ID>.js"></script>
```

Find every affected file with:

```bash
grep -rl 'wpcf7-form' --include='*.html' .
```

**Acceptance:** a test submission arrives in HubSpot from the deployed preview URL.

---

## Phase 4 — Firebase Hosting on GCP

Firebase Hosting is the GCP-native fit: global CDN, automatic TLS, atomic deploys with rollback, generous free tier, and no server to patch. (`app.synthetixlabs.ai` already runs on GCP, so the footprint exists.)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
#   public directory : .
#   single-page app  : No
#   overwrite index  : No
```

`firebase.json`:

```json
{
  "hosting": {
    "public": ".",
    "cleanUrls": true,
    "trailingSlash": true,
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**", "*.sh", "*.md"],
    "headers": [
      {
        "source": "**",
        "headers": [
          { "key": "X-Content-Type-Options", "value": "nosniff" },
          { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
          { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
          { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" },
          { "key": "Permissions-Policy", "value": "geolocation=(), microphone=(), camera=()" }
        ]
      },
      {
        "source": "**/*.@(jpg|jpeg|png|webp|svg|woff2|css|js)",
        "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
      }
    ]
  }
}
```

Deploy to a preview channel first — this gives a temporary URL and touches nothing live:

```bash
firebase hosting:channel:deploy preview --expires 7d
```

**Acceptance:** every page reviewed on the preview URL, navigation works, the HubSpot form submits successfully.

---

## Phase 5 — DNS cutover

1. In the Firebase console, add `synthetixlabs.ai` and `www.synthetixlabs.ai` as custom domains; it issues A records.
2. In Namecheap, **one hour ahead**, change the `@` and `www` A record TTL from Automatic to 60 seconds.
3. `firebase deploy --only hosting`
4. Swap the `@` and `www` A records to the Firebase IPs. Leave `app` (GCP) alone.
5. Once traffic is confirmed on Firebase, **delete the `dev` A record** — that install was the source of the credential-harvesting plugin and has no reason to be public.
6. Restore TTLs.

While in the DNS panel, close the outstanding items: **enable DNSSEC**, add a **CAA record** for Let's Encrypt, and move DMARC from `p=none` to `p=quarantine`.

**Acceptance:** `curl -I https://synthetixlabs.ai/` returns 200 from Firebase, security headers present, certificate valid.

---

## Phase 6 — Make it stay clean

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push: { branches: [main] }
jobs:
  scan-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: IOC scan
        run: |
          IOC='JANCOK|AVRIL_START|lil_tmp|harvest=1|cache-optimizer-|site-health-[0-9a-f]{8}|wp-obj-|eval\(base64_decode'
          if grep -rEl --binary-files=without-match "$IOC" . | grep -v '^./.git'; then
            echo "IOC detected"; exit 1
          fi
          if find . -name '*.php' -not -path './.git/*' | grep -q .; then
            echo "PHP found"; exit 1
          fi
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
```

The scan gates every deploy — nothing ships if an IOC reappears.

Then add an uptime and content-change monitor on the homepage. On a git-backed static site, **any content change that did not come from a commit is by definition unauthorised** — which is the monitoring that was missing when this started.

---

## Guardrails for Claude Code

- Never copy files from the compromised server into this repo.
- Never re-add PHP, a CMS, or a login page.
- Never commit secrets — Firebase service account goes in GitHub Actions secrets only.
- Stop and report if the IOC scan fails at any phase.
- Deploy to a preview channel before `live`, every time.

## Definition of done

- [ ] Repo in company org, branch protection on
- [ ] IOC scan clean, `AUDIT.md` committed
- [ ] All 47 pages render, no console errors
- [ ] Contact form delivers to HubSpot
- [ ] Live on Firebase with security headers
- [ ] DNS cut over; `dev` record deleted
- [ ] DNSSEC, CAA, DMARC quarantine in place
- [ ] CI scan gating deploys
- [ ] Uptime and change monitoring active
