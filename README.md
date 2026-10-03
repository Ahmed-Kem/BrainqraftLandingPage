# BrainQraft landing page

Static HTML/CSS landing page for `brainqraft.com`, plus the domain-side half of the
mobile app's journey invitation deep links (`/join/BQ-XXXXXX`).

Design: Figma "DS 2 Brainqraft" → `web/landing — app (écran unique)` (node `7387:248742`).

## Structure

```
index.html            landing page (also served for /join/*)
styles.css            tokens + layout
assets/               logo, store icons, island illustration (SVG exported from Figma)
.well-known/          apple-app-site-association + assetlinks.json
_redirects, _headers  host config (Netlify / Cloudflare Pages format)
serve.json            same /join rewrite, for local `npx serve`
```

## Run locally

```bash
npx serve -l 4173 .
```

Then open http://localhost:4173 and http://localhost:4173/join/BQ-123456. Asset paths
are absolute (`/assets/...`) so they resolve under `/join/...`. Opening `index.html`
directly from disk won't load them.

## `/join/<code>` behaviour

When the app is installed, the OS intercepts the link (Universal Links / App Links)
before the page loads. Otherwise the host rewrites `/join/*` to `index.html` and the
inline script in `<head>`:

- Android → redirects to Google Play
- iOS → redirects to the App Store
- desktop → shows the landing page plus a "open this link on your phone" hint

## Deploy (Cloudflare Pages)

No build step: the repo is served as-is, and Pages applies `_redirects` and `_headers`.

1. Cloudflare dashboard → Workers & Pages → Create → Pages → connect `Ahmed-Kem/BrainqraftLandingPage`.
   Production branch `main`, framework preset **None**, build command empty, output directory `/`.
2. The project → Custom domains → add `brainqraft.com`. Cloudflare swaps the apex record from Webflow
   to the Pages project (remove the old Webflow A record if it asks).
3. Security → make sure Bot Fight Mode / challenges don't apply to `/.well-known/*`, or Apple and Google
   can't fetch the deep-link files.

Every push to `main` redeploys.

Check: `curl -sI https://brainqraft.com/.well-known/apple-app-site-association` → `200`,
`content-type: application/json`, no redirect; `https://brainqraft.com/join/BQ-TEST` → the landing page.

## Before going live

- [x] App Store id `6760896800` (from `brainqraft-mobile/eas.json` → `ascAppId`) set in `index.html`.
- [x] `.well-known/assetlinks.json` lists the Play app signing key (`E7:0A:…`) and the EAS upload key (`C7:D1:…`).
- [ ] Make sure the host serves `.well-known/*` with `Content-Type: application/json`, over HTTPS,
      with no redirect (`_headers` handles this on Cloudflare Pages).

Verification URLs:
- iOS: https://app-site-association.cdn-apple.com/a/v1/brainqraft.com
- Android: https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://brainqraft.com&relation=delegate_permission/common.handle_all_urls
