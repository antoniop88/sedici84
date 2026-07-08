# nuxt-starter

Template Nuxt 4 SSR multilingua production-ready per siti vetrina.

## Requisiti

- Node.js >= 24
- pnpm 11+

Opzionale: [mise](https://mise.jdx.dev/) per gestire la versione di Node (vedi [`mise.toml`](mise.toml)).

## Setup iniziale

```bash
cp .env.example .env
pnpm install
pnpm dev
```

## Comandi

| Comando                  | Descrizione                                                         |
| ------------------------ | ------------------------------------------------------------------- |
| `pnpm dev`               | Avvia il server di sviluppo                                         |
| `pnpm build`             | Build di produzione (preset `node-server`)                          |
| `pnpm preview`           | Anteprima della build                                               |
| `pnpm test`              | Test unitari e component (Vitest)                                   |
| `pnpm test:e2e`          | Test end-to-end (Playwright)                                        |
| `pnpm test:mock-blocked` | Verifica che il mock Fastily sia bloccato con API reale configurata |
| `pnpm lint`              | Controlla il codice con ESLint                                      |
| `pnpm lint:fix`          | Corregge automaticamente i problemi ESLint                          |
| `pnpm format`            | Formatta il codice con Prettier                                     |
| `pnpm typecheck`         | Verifica i tipi TypeScript                                          |

Dopo la build, l'output portabile è `.output/server/index.mjs` e rispetta `HOST` e `PORT`.

```bash
pnpm build
HOST=0.0.0.0 PORT=3000 node .output/server/index.mjs
```

Health check: `GET /api/health` (sempre 200; include stato opzionale del backend Fastily).

## Deploy

Il template supporta due target con la **stessa build** (`.output`).

### Target A — Docker

```bash
docker compose up -d --build
```

- [`Dockerfile`](Dockerfile) multi-stage (deps → build → runtime), utente non-root
- Healthcheck su `/api/health`
- Esempio: [`docker-compose.yml`](docker-compose.yml)

### Target B — Node / PM2 + Nginx (HestiaCP / VPS cliente)

```bash
pnpm build
pm2 start ecosystem.config.cjs
# oppure deploy automatizzato:
./scripts/deploy.sh
```

- [`ecosystem.config.cjs`](ecosystem.config.cjs) — avvia `.output/server/index.mjs` su `127.0.0.1:3001`
- [`deploy/nginx.conf.example`](deploy/nginx.conf.example) — reverse proxy con header corretti, WebSocket, cache asset statici
- **HestiaCP**: crea il web domain, applica un template Nginx proxy verso la porta dell'app; persistenza al boot con `pm2 startup systemd` e `pm2 save`

### CI/CD

- [`.github/workflows/ci.yml`](.github/workflows/ci.yml) — lint, typecheck, test, build con canary secret, e2e, verifica mock bloccato
- [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) — opzionale Docker + SSH Hetzner (configura i secrets `REGISTRY_*` e `DEPLOY_*` nel repository)

Per VPS cliente/HestiaCP il deploy può essere manuale via [`scripts/deploy.sh`](scripts/deploy.sh) o adattato.

Preset Nitro: `NITRO_PRESET=node-server` (default in [`nuxt.config.ts`](nuxt.config.ts)).

## Riutilizzo per nuovo progetto

1. **[`config/site.ts`](config/site.ts)** — brand, organization (LocalBusiness), social, locales, navigation
2. **[`.env`](.env)** — copia da `.env.example`, imposta `NUXT_PUBLIC_SITE_URL` e `NUXT_PUBLIC_ENV`
3. **Lingue** — `site.locales` + file in [`i18n/locales/`](i18n/locales/)
4. **Brand tokens** — `theme` in [`app/app.config.ts`](app/app.config.ts) e CSS `@theme` in [`app/assets/css/main.css`](app/assets/css/main.css)
5. **Contenuti** — sostituisci placeholder in [`content/it/`](content/it/) e [`content/en/`](content/en/)
6. **Analytics** — `NUXT_PUBLIC_UMAMI_HOST` e `NUXT_PUBLIC_UMAMI_WEBSITE_ID`
7. **Favicon / manifest** — `node scripts/generate-favicons.mjs`
8. **Revisione legale** — privacy, cookie policy, dati LocalBusiness
9. **Deploy** — scegli Docker o PM2/Nginx (vedi sopra)
10. **Nuova collezione** — registry in [`config/collections.ts`](config/collections.ts) (schema, paths, mock opzionale)

## Configurazione

| File                                     | Ruolo                                                |
| ---------------------------------------- | ---------------------------------------------------- |
| [`config/site.ts`](config/site.ts)       | Fonte di verità tipizzata per dati non sensibili     |
| [`app/app.config.ts`](app/app.config.ts) | Brand, theme, nav — accessibile con `useAppConfig()` |
| [`nuxt.config.ts`](nuxt.config.ts)       | `runtimeConfig` mappato da variabili `NUXT_PUBLIC_*` |
| [`.env.example`](.env.example)           | Documentazione di tutte le variabili d'ambiente      |

Le variabili d'ambiente richieste vengono validate al boot con Zod. Se manca o è errata una variabile obbligatoria, l'avvio fallisce con un messaggio esplicito.

## Collezioni esterne headless (Fase 9)

Il sito legge contenuti da un backend Fastily (repo separata) in sola lettura. Il motore è **generico**: pagine, sitemap, hreflang, cache, BFF e domini immagine si aggiornano automaticamente dal registry.

### Variabili server-only

| Variabile                | Ruolo                                                                             |
| ------------------------ | --------------------------------------------------------------------------------- |
| `NUXT_API_BASE_URL`      | Base URL del backend Fastily                                                      |
| `NUXT_API_KEY`           | API key Fastily (`X-Api-Key`) per le chiamate server-side (mai nel bundle client) |
| `NUXT_REVALIDATE_SECRET` | Secret condiviso per il webhook di invalidazione cache                            |
| `NUXT_USE_FASTILY_MOCK`  | `true` (default in dev) — mock HTTP locale se `NUXT_API_BASE_URL` è vuoto         |

### Aggiungere una collezione esterna (es. blog)

1. **Schema Zod** — aggiungi lo schema in [`config/collections/schemas.ts`](config/collections/schemas.ts)
2. **Registry** — aggiungi la voce in [`config/collections.ts`](config/collections.ts):
   - `key`, `paths` (segmenti URL per IT/EN)
   - `schema`, `schemaOrg`, `ogImage`, `filters`, `cacheTtl`, `mediaDomains`
   - chiavi i18n per titoli e meta
3. **Template OG** — crea `app/components/OgImage/OgBlog.satori.vue` (o riusa `OgDefault`)
4. **Mock (opzionale, dev)** — aggiungi fixture in `server/mocks/collections/`

**Automatico** senza toccare il motore: pagine [`app/pages/[collection]/`](app/pages/[collection]/), BFF `/api/collections/:key`, sitemap, hreflang, CSP `img-src`, `@nuxt/image` domains, cache Nitro.

### Webhook invalidazione

```bash
curl -X POST http://localhost:3000/api/collections/revalidate \
  -H "Authorization: Bearer $NUXT_REVALIDATE_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"collection":"immobili","slug":"attico-brera"}'
```

### Verifica locale con mock

Senza `NUXT_API_BASE_URL`, il mock Nitro risponde su `/collections/*` con dati bilingui. Visita `/immobili` (IT) e `/en/properties` (EN).

## Aggiornamenti dipendenze

[Renovate](renovate.json) è configurato con raggruppamento per Nuxt, moduli, Playwright, Vitest, ESLint e Tailwind.
