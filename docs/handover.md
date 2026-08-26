# Handover to IT

Moving the site and its Keystatic editor onto IT's GCP project, then standing
the preview environment down. **In that order** - reversing it takes the review
URL away from marketing mid-flight.

Presentation version: https://claude.ai/code/artifact/51028ba5-8a8a-4f6f-83be-e5b1147ab153

## Read this before deleting anything

Measured burn on the current project is **~$0.01/month**: Cloud Run is
`min-instances 0` so it idles at zero, the site is 55 MB against Firebase's
free tier, and the only real charge is 0.14 GB of container image storage.

So there is no financial pressure and no reason to rush. The real argument for
moving is governance: this project sits under a personal Google account with no
GCP organization, billed to the CoE development team account. Moving it to IT's
estate fixes ownership, access review and continuity. Cost does not.

## What does NOT need rebuilding

| Asset | Why it survives |
|---|---|
| GitHub repository | Already in `synthetix-eng`. IT needs access, not a copy - re-creating orphans the history that documents why each decision was made. |
| Keystatic Cloud project | Authenticates against GitHub, not GCP. Only its allowed origin changes. |
| All site content | Markdown in `src/content/`. No database exists anywhere in this stack. |

**There are no secrets to hand over.** Deployment uses Workload Identity
Federation, so no service-account key exists in GitHub.

## Steps

1. **Repo access** (us) - add IT as admin. Also closes the open Phase 0 item:
   the org currently has one member and therefore no second administrator.

2. **GCP project** (IT) - enable `firebase`, `firebasehosting`, `run`,
   `artifactregistry`, `cloudbuild`, `iamcredentials`, `sts`; then add Firebase
   via `projects/<ID>:addFirebase` with an `X-Goog-User-Project` header.
   Billing must be enabled - Cloud Run cannot run on Spark.

3. **Workload Identity Federation** (IT) - recreate the pool against their
   project, scoped with
   `attribute.repository/synthetix-eng/synthetixlabs-site`. The service account
   needs `roles/firebase.admin`, `roles/firebasehosting.admin`, `roles/run.admin`.

4. **Repoint the repo** (IT) - exactly six files are environment-specific:
   `.firebaserc`, the three workflows under `.github/workflows/`,
   `scripts/verify-live.sh`, `docs/cms.md`. `keystatic.config.ts` changes only
   if the repo moves org.

5. **Deploy the editor** (IT) - build from `Dockerfile.cms`; nothing needs
   exporting from our Artifact Registry. Use `--platform linux/amd64` on Apple
   Silicon. Then add the new Cloud Run URL as an allowed origin in Keystatic
   Cloud, or sign-in fails with `redirect_uri_mismatch`. Prefer mapping
   `cms.synthetixlabs.ai` - generated Cloud Run hostnames are not stable, and
   ours changed once during this engagement.

6. **Verify** (IT) - all three must pass against IT's build before teardown:

   ```
   ./scripts/security-scan.sh dist
   ./scripts/verify-urls.sh dist
   ./scripts/verify-live.sh <URL>
   ```

   Do not skip the last one. HTTP 200 is not proof a page works: this site once
   returned 200 everywhere while serving jQuery as text/html, so nothing
   executed and every page hung on its splash screen.

7. **Stand down** (only after 6 passes)

   ```
   gcloud run services delete synthetixlabs-cms --region asia-south1 --project synthetixlabs-site
   gcloud artifacts repositories delete cms --location asia-south1 --project synthetixlabs-site
   gcloud iam workload-identity-pools delete github --location=global --project synthetixlabs-site
   gcloud iam service-accounts delete firebase-deployer@synthetixlabs-site.iam.gserviceaccount.com --project synthetixlabs-site
   gcloud billing projects unlink synthetixlabs-site
   ```

   Keep the Firebase Hosting site until DNS points at IT's deployment.

## Open items that travel with the work

- **DNS cutover** (IT) - Namecheap; TTL to 60s an hour ahead, swap `@` and
  `www`, leave `app` alone.
- **Delete the `dev` A record** (IT) - named as the source of the
  credential-harvesting plugin, and where the nine missing agent images lived.
- **DNSSEC, CAA, DMARC** (IT) - move DMARC to `p=quarantine`.
- **HubSpot cookie banner** (marketing) - GTM and HubSpot set cookies on 28
  pages; the control is wired but the banner is still off, so the consent gap
  is open.
- **Compliance article copy** (marketing) - one article carries Cartographer
  documentation under a compliance headline. Flagged `needsReview`, still live.
- **No CSP header** (IT) - last substantive item from the security review.
- **Google Fonts** (IT) - loaded from Google while 18 font files are local.
