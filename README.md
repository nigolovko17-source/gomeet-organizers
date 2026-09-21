# GOMEET for organizers

Static landing page for GOMEET organizers.

## Local preview

```sh
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Deploy to Netlify

The repository does not require a build step. Publish the repository root.
`netlify.toml` contains the publish directory, redirects, and production headers.

After connecting the repository in Netlify, add the custom domain in
**Domain management** and configure the DNS records shown by Netlify at the
domain registrar.

## Security

- No secrets or environment variables are required by this site.
- HTTPS is provisioned by Netlify after the domain is connected.
- Security headers are defined in `netlify.toml`.
- Never commit registrar or Netlify credentials to this repository.

## Fonts

Onest and Oswald are distributed under the SIL Open Font License. License
texts are stored in `assets/OFL-onest.txt` and `assets/OFL-oswald.txt`.
