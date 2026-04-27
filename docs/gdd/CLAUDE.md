# GDD VivaMente — Guida per Claude Code

Questo file viene caricato automaticamente quando si lavora dentro `docs/gdd/`. Contiene le regole non-negoziabili, l'indice del GDD e i punti di integrazione col codice.

Per il funzionamento generale del repo (stack, Supabase, sync layer, store) vedere il `CLAUDE.md` root.

---

## Regole assolute (mai violare)

Queste regole valgono per ogni esercizio, sempre. Le **regole comuni prevalgono su qualsiasi indicazione presente nelle schede famiglia** — se una scheda contraddice una regola comune, la regola comune vince (salvo deroga esplicita dichiarata nella scheda).

- **Target sempre presente tra le opzioni di risposta.** In ogni esercizio a scelta multipla il target corretto deve essere tra le opzioni. Vietato presentare solo distrattori.
- **Timer fisso 90s** per ogni esercizio, salvo deroga esplicita nella scheda famiglia (alcune famiglie usano 120s, altre il modello "a completamento dei trial previsti" senza timer fisso).
- **ISI standard 500ms** tra fine risposta e inizio stimolo successivo. Schermo vuoto durante l'ISI. Eccezioni dichiarate per famiglia (PASAT Light, SART, Go/No-Go).
- **Schermata tutorial obbligatoria** alla prima sessione di ogni esercizio (lv 1, sessione 1) con trial dimostrativo animato. Avviso anche ai cambi di livello con cambio di meccanica.
- **Comportamento a timeout uniforme**: trial marcato errato, stimolo scompare, ISI standard, conta come errore per l'accuratezza inter-livello.
- **Feedback risposta esclusivamente visivo** (verde/rosso 300ms). No suoni di default. Eccezioni per famiglia.
- **MBT vs MLT obbligatorio** per ogni esercizio di memoria. La scheda famiglia deve dichiarare l'appartenenza. MLT richiede delay progressivo + task distrattore (palla rimbalzante).
- **Stimoli visivi: solo emoji/icone vettoriali flat.** Mai fotografie. Mai immagini raster.
- **Sessione giornaliera = 5 esercizi**, uno per ciascuno dei 5 domini cognitivi (memoria, attenzione, linguaggio, esecutive, visuospaziali).
- **Onboarding**: livello fisso 1, 1 trial, mai soggetto alla logica adattiva.
- **Limiti livello**: minimo 1, massimo 20.
- **Trial bonus non contano per l'accuratezza inter-livello.** L'accuratezza usata per promozione/retrocessione si calcola solo sui trial valutativi.
- **Domande sui testi**: ogni domanda deve essere ancorata al testo, mai informazioni esterne. Ordine generazione: testo → unità informative etichettate → domande. Mai il contrario.

---

## Indice del GDD

### Regole trasversali

- `00-overview.md` — Come è organizzato il GDD, glossario, gerarchia tassonomica
- `shared/01-session-rules.md` — Sessione giornaliera, regola N, timer, formula pool minimo stimoli
- `shared/02-trial-flow.md` — Ciclo del singolo trial: tutorial, ISI, T.Lim, feedback risposta
- `shared/03-progression.md` — Promozione/retrocessione inter-livello, micro-progressione, trial bonus
- `shared/04-memory-types.md` — MBT vs MLT, tabella delay (aggiornata), task distrattore
- `shared/05-ui-conventions.md` — Target sempre presente, griglie, drag/tap, dataset criteri
- `shared/06-content-generation.md` — Generazione stimoli, fonti (NVdB, Twemoji), filtri, parole/testi
- `shared/07-catalog.md` — Catalogo completo: famiglie attive, eliminate, mappa JSON id

### Schede famiglia (in `families/`)

Ogni famiglia ha un file dedicato. Le famiglie eliminate sono documentate in `shared/07-catalog.md` con la motivazione, ma non hanno scheda separata.

| # | Famiglia | Dominio | Esercizi |
| :---- | :---- | :---- | :---- |
| 1 | Sequence Tap | Memoria | 4 (Numeri/Parole × Forward/Backward) |
| 2 | Recall Grid | Memoria | 3 (Parole MBT, Immagini MBT, Immagini MLT) |
| 3 | Odd One Out | Attenzione | 2 |
| 4 | Sort It | Esecutive | 2 |
| 5 | Hayling Game | Esecutive | 2 |
| 6 | Pasat Light | Esecutive | 1 |
| 7 | Updating WM | Esecutive | 3 |
| 8 | Memoria e Comprensione del Testo | Memoria | 4 |
| 9 | Memoria Lista | Memoria | 4 |
| 10 | Memoria Prospettica | Memoria | 2 (Event-based, Time-based) |
| 11 | SART | Attenzione | 1 |
| 12 | Go/No-Go | Esecutive | 2 |
| 15 | Stroop | Esecutive | 1 |
| 17 | Flanker Task | Esecutive | 1 |
| 19 | Verbal Fluency | Linguaggio | 2 |
| 20 | Linguaggio e Denominazione | Linguaggio | 2 |
| 22 | Path Tracing | Visuospaziale | 1 |
| 24 | Conoscenza Generale | Memoria | 1 |
| — | Word Chain | Esecutive | 1 |
| — | Word Chain Switching | Esecutive | 1 |
| — | Associative Memory | Memoria | 3 varianti (tabella unica) |

**Totale: 21 famiglie attive, 41 unità rotazionali a database, 43 esperienze cognitive distinte.**

Differenza tra i due numeri: la famiglia Associative Memory ha 3 varianti
(Parola-Immagine, Immagine-Immagine, Parola-Parola) che condividono lo stesso
`id` JSON `associative_memory` e si discriminano a runtime via il parametro
`stimulusType`. A database è 1 riga, ma sono 3 esperienze distinte per l'utente.
I numeri 13, 14, 16, 18, 21, 23 sono famiglie eliminate (vedi catalogo).

Quando implementi una famiglia X, leggi: `shared/02-trial-flow.md`, `shared/03-progression.md`, le altre condivise rilevanti per la famiglia (es. `04-memory-types.md` se è memoria), e `families/X.md`.

---

## Integration points col codice

Questi sono i punti dove il GDD impatta direttamente il codice esistente. Da rispettare quando si implementa.

### Tabelle Supabase da ridisegnare

Il `CLAUDE.md` root segnala `esercizi` e `user_levels` come "in attesa di ridisegno". Le specifiche del GDD sono il riferimento per quel ridisegno.

- **`user_levels`** deve supportare la logica di `shared/03-progression.md`: livello corrente per (utente, dominio cognitivo), e tracciamento delle ultime 3 accuratezze per dominio (o calcolo al volo da `sessioni`). Valutazione di promozione/retrocessione ogni 3 sessioni dello stesso dominio.
- **`esercizi_del_giorno`** ha rotazione `(dayOfYear + categoryIndex) % poolSize`. Va sostituita con la **regola N** descritta in `shared/01-session-rules.md`. Richiede tracciamento per-utente delle ultime apparizioni.
- **`esercizi`** va popolato seguendo gli `id` JSON definiti in `shared/07-catalog.md` (appendice JSON del GDD).

### Contratto game engine (vincolo fisso)

Ogni famiglia di esercizi è un componente che riceve dalla pagina `app/(app)/esercizi/[id]/page.tsx`:

- `livello: number` (1–20)
- `tempoScaduto: boolean`
- `onReady(): void`
- `onComplete(score: number, accuratezza: number): void`

L'`accuratezza` passata a `onComplete` è quella **valutativa** (esclusi i trial bonus, vedi `shared/03-progression.md`). Le famiglie non devono reimplementare il timer di sessione: vive a livello pagina/wrapper.

### Componenti condivisi da creare una volta sola

Questi componenti sono trasversali a più famiglie. Implementare una volta sola, riusare:

- **TrialFlow wrapper** — gestisce ISI, T.Lim, feedback, tutorial, sequenza valutativi/bonus (vedi `shared/02-trial-flow.md` e `shared/03-progression.md`).
- **Distrattore palla rimbalzante** — per delay MLT (vedi `shared/04-memory-types.md`).
- **Griglia stimoli** — drag-and-drop fino 4×4, tap-to-select+place per 5×5+ (vedi `shared/05-ui-conventions.md`).
- **Tutorial overlay** — schermata istruzioni + trial dimostrativo animato + pulsante "Ho capito — Inizia".
- **QWERTY input** — usata da Memoria Lista Parole Rievocazione, Hayling, ecc.
- **Number pad** — usata da PASAT Light lv 14–20, Updating WM Numeri ecc.
- **Pool grid select** — usata da Memoria Lista Immagini Rievocazione, Recall Grid ecc.

### Mappatura domini ↔ slug DB

I 5 domini cognitivi del GDD sono già allineati alla tabella `categorie`:

| Dominio GDD | Slug DB |
| :---- | :---- |
| Memoria | `memoria` |
| Attenzione | `attenzione` |
| Linguaggio | `linguaggio` |
| Funzioni Esecutive | `esecutive` |
| Visuospaziale | `visuospaziali` |

### Dataset stimoli

Vedere `shared/06-content-generation.md`. Le fonti raccomandate (NVdB per il lessico, Twemoji/Noto per le emoji) sono indicative ma vincolanti per coerenza clinica. La generazione di testi narrativi e domande tramite LLM va fatta in **pre-popolamento** del database con un pool persistente revisionato editorialmente; il runtime usa il pool, non genera al volo (eccetto override esplicito nella scheda famiglia).

### Pool minimo stimoli per sessione

Formula obbligatoria (vedi `shared/01-session-rules.md`):

```
pool_min = ceil(timer_ms / avg_trial_time_ms) + 3
avg_trial_time_ms = T.Lim + 800   (ISI 500ms + feedback 300ms)
```

Per livelli senza T.Lim esplicito: `avg_trial_time_ms = 2500ms` (stima conservativa).

Eccezione Sort It: pool_min = 3 trial completi (vedi scheda).
