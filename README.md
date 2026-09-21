# GOMEET for organizers

Static landing page for GOMEET organizers.

## Local preview

```sh
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Deploy to Cloudflare Pages

The repository does not require a build step. Connect the repository to
Cloudflare Pages, leave the build command empty, and use `.` as the output
directory. Every push to `main` publishes a new version.

After the first deployment, add `gomeet-organizers.ru` in **Custom domains**
and configure the DNS records shown by Cloudflare at the domain registrar.

## Security

- No secrets or environment variables are required by this site.
- HTTPS is provisioned by Cloudflare after the domain is connected.
- Security headers are defined in `_headers`.
- Never commit registrar, GitHub, or Cloudflare credentials to this repository.

## Fonts

Onest and Oswald are distributed under the SIL Open Font License. License
texts are stored in `assets/OFL-onest.txt` and `assets/OFL-oswald.txt`.
