# Configuration

FriWatch is configured through container ports, one persistent data volume, and environment variables. `PLEX_SERVER` is the only required variable.

## Ports and persistent data

| Container path or port | Required | Purpose |
| --- | --- | --- |
| `3000/tcp` | Yes | Web interface and API. Map a host port to this port unless `LISTEN_PORT` is changed. |
| `/app/data` | Recommended | Stores the FriWatch database and generated self-signed TLS certificate. Mount a volume to preserve them across container replacement. |

The standard mappings are:

```yaml
ports:
  - "3000:3000"
volumes:
  - friwatch-data:/app/data
```

## Environment variables

Boolean options are enabled only when their value is the string `"true"`.

| Variable | Default | Description |
| --- | --- | --- |
| `PLEX_SERVER` | Required | Plex Media Server URL, including `http://` or `https://` and without a trailing slash. For example, `http://plex:32400` or `http://192.168.1.10:32400`. |
| `LISTEN_PORT` | `3000` | Internal TCP port on which FriWatch listens. The container-side port mapping and healthcheck use this value. |
| `DATABASE_URL` | `file:./data/perplexed.db` | Local SQLite file. Relative paths resolve from the backend directory (`/app` in Docker); keep custom paths on persistent storage. |
| `DISABLE_TLS_VERIFY` | `false` | Accept an untrusted HTTPS certificate presented by `PLEX_SERVER`. This affects the FriWatch-to-Plex connection, not FriWatch's own certificate. |
| `DISABLE_WATCH_TOGETHER` | `false` | Disable FriWatch Sync and its Watch Together interface. |
| `DISABLE_REQUEST_LOGGING` | `false` | Stop logging HTTP requests to the container log. Dynamic image requests are always omitted and sensitive query tokens are redacted. Startup and error messages remain enabled. |
| `TLS_SELF_SIGNED` | `false` | Generate and persist a self-signed certificate, then serve FriWatch over HTTPS. |
| `TLS_COMMON_NAME` | `localhost` | Certificate common name used only with `TLS_SELF_SIGNED=true`. |
| `TLS_SUBJECT_ALT_NAME` | `DNS:<TLS_COMMON_NAME>` | Certificate subject alternative name used only with `TLS_SELF_SIGNED=true`, for example `IP:192.168.1.10`. |
| `TLS_CERT_PATH` | None | Path inside the container to a PEM certificate or certificate chain. Must be configured together with `TLS_KEY_PATH`. |
| `TLS_KEY_PATH` | None | Path inside the container to the certificate's PEM private key. Must be configured together with `TLS_CERT_PATH`. |
| `TLS_KEY_PASSPHRASE` | None | Passphrase for an encrypted private key mounted through `TLS_KEY_PATH`. |


The database stores only interface preferences per Plex profile. Existing
`UserOption` data remains readable; retired review tables are unused and are
not automatically deleted. There is no runtime schema migration.

When upgrading from Nevu, reuse the existing `/app/data` mount. With the supplied
Compose files, set `FRIWATCH_DATA_VOLUME` to its existing Docker volume name.
Compose variables now use `FRIWATCH_` instead of `NEVU_`;
`DISABLE_NEVU_SYNC` is now `DISABLE_WATCH_TOGETHER`. Browser storage keys stay
unchanged to preserve sign-ins, preferences and the saved music queue.

Local development also loads `backend/.env`; existing environment variables take precedence.

## Connecting to Plex

When Plex and FriWatch are services in the same Compose stack, use the Plex service name and its container port:

```yaml
environment:
  PLEX_SERVER: http://plex:32400
```

When Plex runs elsewhere on the LAN, use an address reachable from inside the FriWatch container:

```yaml
environment:
  PLEX_SERVER: http://192.168.1.10:32400
```

For a Plex server using an untrusted HTTPS certificate:

```yaml
environment:
  PLEX_SERVER: https://192.168.1.10:32400
  DISABLE_TLS_VERIFY: "true"
```

Do not add a trailing slash to `PLEX_SERVER`.

Plex API and original-file requests require the user's Plex token. Generated
transcode segments use their Plex session URL, which Plex validates. FriWatch preserves
authentication, session and media headers, but does not pass browser ingress headers
(`Forwarded`, `X-Forwarded-*`, `X-Real-IP`) to Plex. Plex determines LAN/WAN
classification from its connection to FriWatch, so the address in `PLEX_SERVER`
controls that connection independently of the address used in the browser.

## Published port

The left side of a Compose port mapping is the port opened on the host:

```yaml
ports:
  - "8080:3000"
environment:
  PLEX_SERVER: http://plex:32400
```

Changing `LISTEN_PORT` is normally unnecessary. If it is changed, update the container side of the TCP mapping as well:

```yaml
ports:
  - "8080:8080"
environment:
  PLEX_SERVER: http://plex:32400
  LISTEN_PORT: "8080"
```

## HTTPS

### Persistent self-signed certificate

Keep `/app/data` mounted so the generated certificate survives container replacement:

```yaml
services:
  friwatch:
    image: ghcr.io/dejniel/friwatch:latest
    ports:
      - "3000:3000"
    environment:
      PLEX_SERVER: http://plex:32400
      TLS_SELF_SIGNED: "true"
      TLS_COMMON_NAME: 192.168.1.10
      TLS_SUBJECT_ALT_NAME: IP:192.168.1.10
    volumes:
      - friwatch-data:/app/data

volumes:
  friwatch-data:
```

Open FriWatch at `https://192.168.1.10:3000` and accept the certificate in the client where appropriate.

### Existing PEM certificate

Mount the existing certificate chain and matching private key as read-only files, then point FriWatch to their paths inside the container:

```yaml
services:
  friwatch:
    image: ghcr.io/dejniel/friwatch:latest
    ports:
      - "3000:3000"
    environment:
      PLEX_SERVER: http://plex:32400
      TLS_CERT_PATH: /run/friwatch-tls/fullchain.pem
      TLS_KEY_PATH: /run/friwatch-tls/privkey.pem
    volumes:
      - friwatch-data:/app/data
      - /srv/certificates/fullchain.pem:/run/friwatch-tls/fullchain.pem:ro
      - /srv/certificates/privkey.pem:/run/friwatch-tls/privkey.pem:ro

volumes:
  friwatch-data:
```

Both files must be PEM encoded and readable by the container. For an encrypted private key, also set `TLS_KEY_PASSPHRASE`. The hostname or IP used in the browser must be covered by the mounted certificate.

## Complete FriWatch service

This example includes persistent data and optional LAN discovery while leaving HTTPS disabled:

```yaml
services:
  friwatch:
    image: ghcr.io/dejniel/friwatch:latest
    container_name: friwatch
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      PLEX_SERVER: http://192.168.1.10:32400
    volumes:
      - friwatch-data:/app/data

volumes:
  friwatch-data:
```
