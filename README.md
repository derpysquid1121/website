# davidblackburn.dev

Personal music blog built with [Angular](https://angular.io). The home page features embedded Spotify players for albums and playlists; the About page links to GitHub and contact info.

## Local development

Requires **Node.js 18+** (20 recommended). If you use [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm use
npm install
npm start
```

Open http://localhost:4200

## Adding music posts

Edit `src/app/data/music-entries.ts`:

- **Carousel** — `carouselEntries` at the top of the blog
- **Entries** — each item needs a Spotify `spotifyId` and `kind` (`album`, `playlist`, or `track`)
- Optional `title`, `subtitle`, and `body` for write-ups

Spotify embed IDs come from the share URL, e.g. `open.spotify.com/playlist/33J2aN9kJ1RZSGTHyDiFUy` → id `33J2aN9kJ1RZSGTHyDiFUy`.

Site-wide links (GitHub, email, Spotify profile) live in `src/app/site.config.ts`.

## Deploy

Pushes to `main` or `master` build and deploy to GitHub Pages via `.github/workflows/deploy.yml`. Custom domain is set in `CNAME` (`davidblackburn.dev`).

In the repo **Settings → Pages**, set source to **GitHub Actions**.

## Legacy site

The previous static HTML site is in `_legacy/` for reference.
