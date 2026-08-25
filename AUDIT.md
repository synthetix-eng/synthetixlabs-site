# AUDIT.md — synthetixlabs.ai static mirror

**Audited:** 2026-08-25
**Source:** `AdithyaSrinivasan3112/synthetix-preview-8f3c2a` @ `238dc42`
**Mirrored to:** `synthetix-eng/synthetixlabs-site` (public, branch protection on `main`)
**Verdict:** clean — no indicators of compromise. Safe to proceed to Phase 2.

The scan was run **before** the push into the company org, not after, so that an
unverified mirror never became company infrastructure.

---

## 1. Security scan — PASS

| Check | Result |
|---|---|
| IOC pattern scan (9 patterns from the incident) | **0 matches** |
| PHP files | **0** |
| Content before `<!DOCTYPE>` (injection marker) | **0 files** |
| Obfuscation patterns | 2 hits — **both verified false positives** |

The two obfuscation hits were manually inspected and cleared:

- `wp-content/themes/agenio/assets/js/vendor/split-text.js` — `String.fromCharCode(160)`,
  a non-breaking space in GSAP SplitText.
- `wp-content/themes/agenio/assets/js/vendor/jqueryui.js` — `String.fromCharCode(t.keyCode)`,
  jQuery UI menu typeahead filtering.

Both matched only because the regex `fromCharCode\(.{80,}` trips on any minified file
where 80+ characters follow on the same line. Neither file contains
`document.write(unescape` — that pattern has **zero** matches repo-wide.

## 2. Inventory

- **45** real pages (`index.html`, excluding query-string duplicates)
- **77** HTML files total
- **403** files, **86.2 MB** working tree
- **30** `index.html?p=NNNN.html` wget query-string duplicates
- Git history: 2 commits, single `main` branch, no tags

### Page count correction
The plan's definition of done says "all 47 pages render". The actual count is **45**,
and Phase 2 deletes 5 of them (`author/admin_jcmef8dd`, `x`, `x-2`, `x-3`, `x-4`),
leaving **40 pages** to verify. Update the checklist to 40.

## 3. External domains

| Domain | Refs | Note |
|---|---|---|
| `fonts.googleapis.com` | 304 | Google Fonts |
| `www.w3.org`, `schema.org`, `gmpg.org`, `ogp.me`, `purl.org`, `rdfs.org`, `xmlns.com` | — | XML/RDF namespace URIs, not network calls |
| `s.w.org`, `api.w.org` | 152 / 75 | WordPress. **Strip in Phase 2.** |
| `js.hs-scripts.com/40221584` | 150 | HubSpot tracking, portal `40221584` |
| `www.googletagmanager.com` | 75 | GTM |
| `www.microsoft.com` | 75 | Office XML namespace declarations |
| `wpriverthemes.com` | 8 | Agenio theme author links |
| `js.hsforms.net` | 2 | HubSpot form embed — **see §5** |
| `maxcdn.bootstrapcdn.com` | 2 | Font Awesome |
| `page.pyramidci.com` | 1 | **Needs a decision — see §6** |

## 4. Absolute links back to the old host — NONE

Zero references to `synthetixlabs.ai`, `dev.synthetixlabs.ai`, or `app.synthetixlabs.ai`.
The wget mirror fully relativized its links. Two consequences:

- No domain rewrite is needed before the Phase 5 cutover.
- No `dev.` host references leak from the compromised install.

## 5. Forms — the plan understates this

### 5a. The contact form is ALREADY on HubSpot
`contact/index.html:575` already carries a live HubSpot embed:

```
<script src="https://js.hsforms.net/forms/embed/developer/40221584.js" defer></script>
<div class="hs-form-html" data-region="na1"
     data-form-id="83662078-8161-4c76-bcc8-bbfe5da718dc"
     data-portal-id="40221584"></div>
```

Phase 3 does **not** need to source a portal/form ID — both already exist. Note this
uses the `hs-form-html` / `forms/embed/developer/` variant, not the `hs-form-frame` /
`forms/embed/<portal>.js` markup written in the plan. Keep what is already working
rather than swapping it for the plan's snippet.

### 5b. But dead Contact Form 7 markup is on 75 of 77 pages
`wpcf7-form` appears in **75 files**, not just the contact page — it is in a
site-wide footer/off-canvas panel. `contact/index.html` alone still has 5 CF7
occurrences *alongside* the working HubSpot embed. Every one posts to a
non-existent `index.html%3Fp=NNNN.html` endpoint and **fails silently**.

This is a much larger surface than the plan's Phase 3 implies.

### 5c. File upload fields are present
`wpcf7-file` / `multipart/form-data` appear across the mirror, including the
homepage. Per the plan this was the likely original attack vector. These must be
deleted with the CF7 markup, not carried over.

### 5d. Ten comment forms post to PHP
10 forms target `action="/wp-comments-post.php"` — not mentioned in the plan.
Dead on static hosting. Remove with the CF7 cleanup.

## 6. Open questions for the site owner

1. **`page.pyramidci.com`** — `index.html:628` links to
   `https://page.pyramidci.com/en-us/synthetix-ai4-lucky-draw`. Not an IOC, and it
   reads as a real marketing campaign page, but it is the only non-obvious third-party
   destination in the site. Confirm it is intentional and still live, or drop the link.
2. **`resources/blogs/.../embed/index.html`** — a WordPress oEmbed iframe endpoint
   captured by wget. Serves no purpose on a static site; recommend deleting.
3. **`resources/blogs/resources/...`** — 10 pages duplicated under a nested path that
   also exists at `resources/...`. Duplicate content against the canonical URLs;
   recommend deleting or adding canonical tags.

## 7. Size vs. target

86.2 MB working tree against the plan's **under 60 MB** Phase 2 acceptance. The three
images the plan flags are confirmed (3.4 MB, 3.2 MB, 2.8 MB), but they total under
10 MB — deleting the 30 query-string duplicates and compressing images will need to
do real work to clear 60 MB. Measure again after Phase 2 rather than assuming.
