# GOMEET for organizers

Static landing page for GOMEET organizers.

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
