---
title: Cookie Policy
description: Quali cookie e tecnologie di tracciamento utilizziamo e come gestirli.
legalDraft: true
---

::callout{type="warning" title="Avviso legale"}
**DA REVISIONARE LEGALMENTE** — Questo documento è un segnaposto generato automaticamente e non costituisce consulenza legale. Sostituire con testo validato da un professionista qualificato prima della pubblicazione.
::

## 1. Cosa sono i cookie e le tecnologie simili

I cookie sono piccoli file di testo che i siti visitati inviano al browser dell'utente, dove vengono memorizzati per essere ritrasmessi agli stessi siti alla visita successiva. Oltre ai cookie, il sito può utilizzare tecnologie simili come il **local storage** del browser per memorizzare preferenze non sensibili.

## 2. Categorie di consenso

Il sito utilizza un banner di consenso che permette di accettare, rifiutare o personalizzare le preferenze per categoria. Di seguito le categorie e i servizi effettivamente utilizzati.

| Categoria | Servizio / Tecnologia           | Tipo      | Finalità                            | Durata                                    |
| --------- | ------------------------------- | --------- | ----------------------------------- | ----------------------------------------- |
| Necessari | `i18n_redirected` (cookie)      | Tecnico   | Memorizza la preferenza linguistica | 1 anno                                    |
| Analitici | Umami (self-hosted, cookieless) | Analitico | Statistiche anonime di navigazione  | Nessun cookie — attivo solo dopo consenso |

### Cookie necessari

| Cookie            | Tipo    | Finalità                            | Durata |
| ----------------- | ------- | ----------------------------------- | ------ |
| `i18n_redirected` | Tecnico | Memorizza la preferenza linguistica | 1 anno |

Questi cookie sono indispensabili per il funzionamento del sito e non richiedono consenso.

### Cookie analitici (previo consenso)

| Servizio                      | Tipo                  | Finalità                                                                    | Cookie  |
| ----------------------------- | --------------------- | --------------------------------------------------------------------------- | ------- |
| Umami Analytics (self-hosted) | Analitico, cookieless | Statistiche anonime di navigazione (pagine visitate, referrer, dispositivo) | Nessuno |

Umami viene caricato **solo dopo consenso esplicito** tramite il banner. Non utilizza cookie di profilazione né identificatori personali.

## 3. Storage delle preferenze di consenso

Le scelte espresse tramite il banner vengono salvate nel **local storage** del browser con la chiave `acme_cookie_consent`. Il record include:

- versione della policy di consenso
- preferenze per categoria (necessari sempre attivi, analitici opzionali)
- data della scelta e scadenza (12 mesi)

Alla scadenza o aggiornamento della policy, il banner verrà mostrato nuovamente.

## 4. Gestione delle preferenze

L'utente può in qualsiasi momento:

- modificare le preferenze tramite il banner di consenso (al primo accesso o dopo scadenza)
- consultare la presente Cookie Policy
- gestire cookie e storage tramite le impostazioni del browser

La disabilitazione dei cookie tecnici potrebbe compromettere alcune funzionalità del sito (es. preferenza linguistica).

## 5. Contatti

Per informazioni sui cookie e sul trattamento dei dati: hello@example.com
