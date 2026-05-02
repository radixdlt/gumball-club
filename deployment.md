# Deployment Guide - Cloudflare Pages

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (`npm install -g wrangler`)
- Cloudflare account authenticated via `wrangler login`

## Build

```bash
cd dapp
npm install
NEXT_PUBLIC_NETWORK=Mainnet npm run build
```

This produces a static export in the `dapp/out/` directory.

## Deploy

### First-time setup

Create the Cloudflare Pages project:

```bash
npx wrangler pages project create gumball-club
```

### Deploy to production

```bash
cd dapp
npx wrangler pages deploy out --project-name=gumball-club
```

## Custom Domain

The app is initially available at `gumball-club.pages.dev`. To use a custom domain (`gumball.radixdlt.com`):

1. Go to Cloudflare Dashboard > Pages > gumball-club > Custom domains
2. Add `gumball.radixdlt.com`
3. Update DNS records as prompted

## Environment Configuration

The network is set at build time via the `NEXT_PUBLIC_NETWORK` environment variable:

| Network   | Value      |
|-----------|------------|
| Mainnet   | `Mainnet`  |
| Stokenet  | `Stokenet` |

To deploy a Stokenet version, create a separate Pages project and build with `NEXT_PUBLIC_NETWORK=Stokenet`.

## Architecture Notes

- The app is a Next.js static export (`output: 'export'` in `next.config.js`)
- No server-side rendering or API routes are used
- The `.well-known/radix.json` dApp definition is served as a static file from `public/.well-known/radix.json`
- Images are served unoptimized (no server-side image optimization)
