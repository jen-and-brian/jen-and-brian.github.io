# Jennifer & Brian's Wedding Website

Static multi-page wedding website designed for GitHub Pages root hosting.

## Pages

- `index.html` - Home
- `our-story.html` - Our Story
- `schedule.html` - Schedule
- `places-to-visit.html` - Places to Visit
- `faq.html` - FAQ

## Shared Assets

- `assets/css/styles.css` - Site-wide styles and responsive layout
- `assets/js/site.js` - Mobile nav, reveal animation, and footer year

## Local Preview

Because this is a static site, you can open `index.html` directly in a browser.

For better local routing behavior, run a simple static server from the repo root. Example with Python:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages Deployment

This repository is configured for root-level GitHub Pages hosting (`jen-and-brian.github.io`).

- Push to the `main` branch.
- Site publishes at `https://jen-and-brian.github.io/`.

## RSVP

RSVP is handled externally via WithJoy:

- `https://withjoy.com/jen-and-brian`
