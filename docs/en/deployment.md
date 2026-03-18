# Deployment

## Production Baseline

- Runtime: `Caddy + Docker Compose`
- Deploy host: `47.120.61.35`
- Domains:
  - `cn.svc.plus`
  - `cn.onwalk.net`
- Frontend release workflow: `.github/workflows/service_release_frontend-deploy.yml`

## Operating Model

The frontend is built in GitHub Actions and shipped as a prebuilt `linux/amd64` image. The host only pulls the image and starts containers; it does not build locally.

The stack is static-first:

- Caddy serves `/_next/static/*` and public assets from a shared volume.
- The Next.js standalone container serves dynamic HTML, auth endpoints, and API proxy routes.
- `knowledge/` is cloned in CI and packed into the image during the Docker build.

This baseline is intentional for the current weak-IO single-node host. If `docs.svc.plus` becomes an API-backed service later, update this page and the runbook to remove docs payload from the frontend image.

## Related Docs

- `usage/deployment.md`
- `governance/release-process.md`
- `development/dev-setup.md`
