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

| Comando          | Descrizione                                |
| ---------------- | ------------------------------------------ |
| `pnpm dev`       | Avvia il server di sviluppo                |
| `pnpm build`     | Build di produzione (preset `node-server`) |
| `pnpm preview`   | Anteprima della build                      |
| `pnpm test`      | Test unitari e component (Vitest)          |
| `pnpm test:e2e`  | Test end-to-end (Playwright)               |
| `pnpm lint`      | Controlla il codice con ESLint             |
| `pnpm lint:fix`  | Corregge automaticamente i problemi ESLint |
| `pnpm format`    | Formatta il codice con Prettier            |
| `pnpm typecheck` | Verifica i tipi TypeScript                 |

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

## Configurazione

| File                                     | Ruolo                                                |
| ---------------------------------------- | ---------------------------------------------------- |
| [`config/site.ts`](config/site.ts)       | Fonte di verità tipizzata per dati non sensibili     |
| [`app/app.config.ts`](app/app.config.ts) | Brand, theme, nav — accessibile con `useAppConfig()` |
| [`nuxt.config.ts`](nuxt.config.ts)       | `runtimeConfig` mappato da variabili `NUXT_PUBLIC_*` |
| [`.env.example`](.env.example)           | Documentazione di tutte le variabili d'ambiente      |

Le variabili d'ambiente richieste vengono validate al boot con Zod. Se manca o è errata una variabile obbligatoria, l'avvio fallisce con un messaggio esplicito.

## Aggiornamenti dipendenze

[Renovate](renovate.json) è configurato con raggruppamento per Nuxt, moduli, Playwright, Vitest, ESLint e Tailwind.
