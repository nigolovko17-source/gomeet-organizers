# GOMEET for organizers

Static landing page for GOMEET organizers.

The product tour appears after the organizer terms as chapter 05. Its scroll
track is limited to 2.8 viewport heights on desktop and 2.3 on mobile.
It changes between events, sales and audience as the
visitor scrolls. `tour.css` and `tour.js` contain the presentation. The screens
use demonstration data and have no production backend access.

Below-the-fold images use native lazy loading. Inactive product tabs load
their screen only on selection. The sales and audience tour screens load
shortly before their scroll transition or when their navigation button is
clicked; they are not fetched on initial page load.

## Local preview

```sh
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Deploy with GitHub Pages

The site is published from the root of the `main` branch. GitHub Pages does
not require a build step for this repository. Every push to `main` publishes
the latest version.

The custom domain is stored in `CNAME`. At the DNS provider, the apex domain
uses GitHub Pages A records and `www` points to `nigolovko17-source.github.io`.

## Security

- No secrets or environment variables are required by this site.
- HTTPS is provisioned by GitHub Pages after the domain is connected.
- Never commit registrar or GitHub credentials to this repository.

## Fonts

Onest and Oswald are distributed under the SIL Open Font License. License
texts are stored in `assets/OFL-onest.txt` and `assets/OFL-oswald.txt`.
