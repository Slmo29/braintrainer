# Famiglia — Associative Memory (3 varianti)

**Dominio cognitivo**: Memoria
**Classificazione**: MLT — delay da tabella di `shared/04-memory-types.md`.
**Fondamento**: Naveh-Benjamin (2000). Il deficit associativo è uno dei marker più precoci del declino mnestico nell'aging.

## Meccanica core

L'utente vede N coppie di item presentate sequenzialmente. Dopo un delay MLT con task distrattore (palla rimbalzante), viene mostrato il **primo elemento di ogni coppia** e deve riconoscere il **secondo** tra 4 opzioni.

Misura la **memoria associativa** — la capacità di ricordare i legami tra elementi, non i singoli elementi.

## Varianti (`stimulusType`)

Le 3 varianti **condividono la stessa tabella livelli e meccanica**. Differiscono solo nel tipo di coppia presentata.

| ID JSON | Nome | stimulusType |
| :---- | :---- | :---- |
| `associative_memory` (variante A) | Parola-Immagine | `parola_immagine` |
| `associative_memory` (variante B) | Immagine-Immagine | `immagine_immagine` |
| `associative_memory` (variante C) | Parola-Parola | `parola_parola` |

A database l'`id` esercizio è unico (`associative_memory`); la variante è discriminata dal campo `stimulusType` nella configurazione.

## Struttura trial

```
Coppie presentate una alla volta (speedMs per coppia)
  → Delay con task distrattore (palla rimbalzante)
  → Recupero (primo elemento mostrato, 4 opzioni per il secondo)
```

## Foil ai livelli alti (lv 14–20)

Almeno **1–2 foil** sono item già visti in altre coppie della stessa sessione — **interferenza associativa**.

## Micro-progressione

+1 coppia per trial bonus (max +2 oltre base). Regola standard.

## Timer di sessione

**Modello B — sessione a completamento** (vedi `shared/01-session-rules.md`).

## Istruzioni utente

> *"Vedrai coppie di [parole/immagini]. Cerca di ricordare cosa era abbinato a cosa. Poi ti mostreremo il primo elemento e dovrai scegliere il secondo."*

## Tabella livelli (condivisa)

| Lv | N coppie | Speed (ms) | Delay | Foil interferenti | Trial |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | 2 | 3000 | 30 s | no | 5 |
| 2 | 2 | 2800 | 30 s | no | 5 |
| 3 | 3 | 2800 | 30 s | no | 5 |
| 4 | 3 | 2500 | 30 s | no | 5 |
| 5 | 3 | 2500 | 1 min | no | 4 |
| 6 | 4 | 2200 | 1 min | no | 4 |
| 7 | 4 | 2200 | 1 min | no | 4 |
| 8 | 4 | 2000 | 1 min | no | 4 |
| 9 | 5 | 2000 | 1 min 30 s | no | 3 |
| 10 | 5 | 1800 | 1 min 30 s | no | 3 |
| 11 | 5 | 1800 | 1 min 30 s | no | 3 |
| 12 | 6 | 1600 | 1 min 30 s | no | 3 |
| 13 | 6 | 1600 | 2 min | no | 3 |
| 14 | 6 | 1500 | 2 min | sì (1) | 2 |
| 15 | 7 | 1500 | 2 min | sì (1) | 2 |
| 16 | 7 | 1400 | 2 min | sì (2) | 2 |
| 17 | 7 | 1400 | 3 min | sì (2) | 2 |
| 18 | 8 | 1300 | 3 min | sì (2) | 2 |
| 19 | 8 | 1300 | 3 min | sì (2) | 2 |
| 20 | 8 | 1200 | 3 min | sì (2) | 2 |

### Cambio meccanica → schermata di avviso

Il livello **14** introduce i foil interferenti: cambio di meccanica significativo che richiede la schermata di avviso descritta in `shared/02-trial-flow.md`.

## Specifiche per variante

### Parola-Immagine

- **Encoding**: parola (testo) + immagine (emoji) presentate insieme.
- **Recupero**: appare la parola, l'utente tappa l'emoji corretta.
- **Coppie semanticamente non correlate.**
- **Fonte parole**: NVdB nomi concreti FO.
- **Fonte immagini**: Twemoji, categorie diverse.
- **Foil**: emoji di categoria diversa (lv 1–13), + emoji da altre coppie della sessione (lv 14–20).

### Immagine-Immagine

- **Encoding**: due emoji affiancate.
- **Recupero**: appare la prima emoji, l'utente tappa la seconda.
- Stessa logica foil. Coppie di categorie diverse.

### Parola-Parola

- **Encoding**: due parole affiancate.
- **Recupero**: appare la prima parola, l'utente tappa la seconda tra 4 opzioni testuali.
- **Fonte**: NVdB nomi concreti FO (lv 1–10), FO+AU (lv 11–20).
- **Foil**: parole della stessa categoria grammaticale (lv 1–13), + parole da altre coppie della sessione (lv 14–20).

## Dataset

- **Per variante**: ~300 coppie semanticamente non correlate.
- **Non ripetizione**: una coppia non si riusa entro 10 sessioni.

## JSON di configurazione esempio

```json
{
  "family": "associative_memory",
  "variants": [
    { "id": "parola_immagine",   "stimulusType": "parola_immagine" },
    { "id": "immagine_immagine", "stimulusType": "immagine_immagine" },
    { "id": "parola_parola",     "stimulusType": "parola_parola" }
  ],
  "sharedLevelTable": {
    "1":  { "nPairs": 2, "speedMs": 3000, "delayS": 30,  "interferingFoils": 0, "trialsPerSession": 5 },
    "14": { "nPairs": 6, "speedMs": 1500, "delayS": 120, "interferingFoils": 1, "trialsPerSession": 2 },
    "20": { "nPairs": 8, "speedMs": 1200, "delayS": 180, "interferingFoils": 2, "trialsPerSession": 2 }
  },
  "microProgression": {
    "parameter": "nPairs",
    "increment": 1,
    "maxOverBase": 2,
    "trialsBeforeBonus": 3,
    "bonusCountsForAccuracy": false
  },
  "retrieval": { "nOptions": 4 },
  "delayTask": "bouncing_ball_tap",
  "sessionTimer": "no_fixed_timer"
}
```
