# Editing content

Content lives as MDX in `src/content/`, edited through Keystatic. Every save is
a git commit, which is what keeps the Phase 6 drift monitor meaningful: on a
git-backed static site, content that differs from `main` did not come from a
commit.

## Running the editor

```bash
npm run cms      # http://127.0.0.1:4321/keystatic/
```

Note the trailing slash. `/keystatic` without it returns 404.

## Why the editor has its own Astro config

`astro.cms.config.mjs` exists because the editor and the public site have
requirements that cannot coexist in one config. Both were verified, not assumed:

| | Public site | Keystatic editor |
|---|---|---|
| `trailingSlash` | must be `always` — it is the URL shape Google has indexed | must not be `always`; the client calls `/api/keystatic/tree` with no trailing slash and `always` 404s it, leaving the admin blank |
| Rendering | fully static — no server to patch was the point of the rebuild | injects routes with `prerender: false`, so it needs a Node.js runtime |

Sharing the project root means the editor reads the same `src/content/` files
and the same `keystatic.config.ts`, with no duplicated dependencies.

## Deploying the editor

Decided: **Cloud Run** for the runtime, **Keystatic Cloud** for editor auth.

```bash
gcloud run deploy synthetixlabs-cms \
  --source . --project synthetixlabs-site --region <REGION> \
  --dockerfile Dockerfile.cms \
  --build-arg PUBLIC_KEYSTATIC_STORAGE_KIND=cloud \
  --min-instances 0 --allow-unauthenticated
```

`--min-instances 0` matters: the editor is idle almost all the time, so scaling
to zero keeps the cost near nothing.

Verified locally before any deploy: the image builds, the container starts, and
`/keystatic/` returns 200 with `/api/keystatic/tree` responding (400, not 404).

Two prerequisites that are not code:

1. **Billing (Blaze) on `synthetixlabs-site`.** Cloud Run cannot run on Spark.
2. **A Keystatic Cloud project.** `keystatic.config.ts` points at
   `synthetix/synthetixlabs-site`; the team and project must exist and the slug
   must match.

## Previous blocker (resolved)

Keystatic's admin **cannot run on Firebase Hosting**. Its API routes need a
Node.js runtime; a static host cannot serve them. This is true in every storage
mode, including Keystatic Cloud — the API handler branches on `kind === 'cloud'`
server-side.

The migration plan assumed "a separate Firebase Hosting site" would do. It will
not. The options are:

1. **Cloud Run** — GCP-native, scales to zero, admin on its own hostname so the
   public domain keeps zero admin surface. **Requires billing (Blaze) on the
   `synthetixlabs-site` project, which is currently on Spark.**
2. **Local only** — engineers run `npm run cms`. Costs nothing and needs no
   decision, but marketing cannot publish, which defeats the purpose.
3. **A different host** for the admin only. Works, but splits infrastructure
   across vendors.

Until one is chosen, the editor is local-only.

## Storage modes

`keystatic.config.ts` reads `PUBLIC_KEYSTATIC_STORAGE_KIND`:

- unset → `local` (writes directly to the working tree)
- `github` → commits via a GitHub App; editors need GitHub accounts
- `cloud` → Keystatic Cloud; **editors do not need GitHub accounts**, which is
  the reason to pay for it. Free to 3 users, then $10/mo + $5/user.

The variable must be `PUBLIC_`-prefixed. `keystatic.config.ts` is bundled into
the browser, so `process.env` is undefined there — using it renders the admin
as a blank page with no server-side error.

## Scope

The editor covers the 15 items in `src/content/` — articles, case studies and
agent documentation.

It does **not** cover the marketing pages (home, platform, solutions,
governance, company, why-synthetix, contact). Those are still frozen mirror
HTML in `public/` and stay that way until they are ported. Editing homepage
copy still needs an engineer.
