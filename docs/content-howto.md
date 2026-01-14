# Content How-To

This repo keeps marketing/blog content under `src/content`. The content repo can be
cloned into that directory to keep Vercel builds reproducible and avoid manual
sync steps.

## Vercel build command

Set the Vercel Build Command to:

```bash
./scripts/clone-content.sh && next build
```

This makes the build pull `https://github.com/photo-workspace/content.onwalk.net.git`
into `src/content` before Next.js builds.

## Optional sync scripts (standalone deployments)

These scripts are kept for future standalone deployments or local maintenance:

- `scripts/clone-content.sh` pulls the full content repo into `src/content`.
- `scripts/sync-content.sh` can push/pull changes against another repo.
  - `/blogs/` in the external repo is mirrored into `src/content/blogs/`.
