# Famiglia 20 — Linguaggio e Denominazione (2 esercizi)

**Dominio cognitivo**: Linguaggio
**Classificazione**: accesso lessicale, relazioni semantiche.

> **Nota di catalogo**: famiglia ridisegnata. Mantenuti **Picture Naming** (sostituisce Lexical Decision, gioco 62 — più robusto per 60+ su mobile, costrutto Boston Naming Test) e **Synonym/Antonym Decision** (nuovo esercizio).
>
> **Eliminati**: Lexical Decision (timing troppo stretto su mobile, variabili motorie confondenti), Semantic Relatedness (gioco 64, ridondante), Sentence Anagram (gioco 63, validazione sintattica complessa), giochi 65–66.

---

## Esercizio 1 — Picture Naming

**id JSON**: `picture_naming`
**Costrutto**: denominazione, accesso lessicale nella produzione.
**Fondamento**: clinicamente analogo al Boston Naming Test (Kaplan et al., 1983).

### Meccanica

L'utente vede un'**immagine** (emoji/icona vettoriale) e deve **digitare il nome** dell'oggetto/animale/concetto rappresentato.

### Risposta

QWERTY con autocomplete leggero. L'utente digita il nome e conferma con invio.

Vengono accettate **varianti morfologiche e sinonimi comuni** pre-definiti per ogni immagine (es. "automobile" e "macchina" entrambi corretti per 🚗).

### Layout trial

- **Immagine al centro** + **campo testo** + **tastiera QWERTY** aperta immediatamente alla comparsa dello stimolo (nessun tap aggiuntivo richiesto per aprire la tastiera).
- Il T.Lim **inizia dalla comparsa dell'immagine**.

### Comportamento a timeout

Se il T.Lim scade con testo parzialmente digitato, il trial è marcato **errato**, il testo viene cancellato e si procede al trial successivo con ISI standard.

### Istruzioni utente

> *"Guarda l'immagine e scrivi il nome di quello che vedi. Vai il più velocemente possibile."*

### Tutorial

Mostra 🐕 → l'utente digita "cane" → ✓.

### Micro-progressione

−200ms T.Lim per trial bonus (max −2 step, **floor 2000ms**).

**Floor più alto** che in altri esercizi perché la digitazione richiede tempo motorio minimo indipendente dalla fluenza lessicale.

### Timer di sessione

- 90s (lv 1–10)
- 120s (lv 11–20)

### Tabella livelli

| Lv | T.Lim (ms) | Frequenza item | Categoria |
| :---- | :---- | :---- | :---- |
| 1 | 8000 | FO (alta) | oggetti quotidiani, animali comuni |
| 2 | 7500 | FO | oggetti quotidiani, animali comuni |
| 3 | 7000 | FO | oggetti quotidiani, animali comuni |
| 4 | 6500 | FO | oggetti quotidiani, animali comuni |
| 5 | 6000 | FO | oggetti quotidiani, animali |
| 6 | 5500 | FO+AU | oggetti casa, cibo, natura |
| 7 | 5000 | FO+AU | oggetti casa, cibo, natura |
| 8 | 4500 | FO+AU | oggetti casa, cibo, natura |
| 9 | 4000 | FO+AU | categorie miste |
| 10 | 3500 | FO+AU | categorie miste |
| 11 | 3000 | AU | oggetti meno comuni |
| 12 | 2800 | AU | oggetti meno comuni |
| 13 | 2600 | AU | oggetti meno comuni |
| 14 | 2400 | AU+AD | oggetti specialistici |
| 15 | 2200 | AU+AD | oggetti specialistici |
| 16 | 2000 | AU+AD | oggetti specialistici |
| 17 | 2000 | AD | oggetti rari o tecnici |
| 18 | 2000 | AD | oggetti rari o tecnici |
| 19 | 2000 | AD | oggetti rari o tecnici |
| 20 | 2000 | AD | oggetti rari o tecnici |

T.Lim **non scende sotto 2000ms** (floor fisso) — la digitazione richiede tempo motorio minimo indipendente dalla fluenza lessicale.

### Generazione stimoli

- **Fonte**: Twemoji/Noto Emoji, categorizzate per dominio semantico e frequenza lessicale del nome corrispondente.
- **Per ogni immagine**: lista di **risposte accettate** (nome principale + sinonimi comuni + varianti morfologiche), pre-generata e revisionata editorialmente.
- **Dataset minimo**: ~400 immagini con nomi accettati, distribuite per fascia di frequenza.
- **Non ripetizione**: un'immagine non si riusa entro 10 sessioni.

---

## Esercizio 2 — Synonym/Antonym Decision

**id JSON**: `synonym_antonym_decision`
**Costrutto**: relazioni semantiche, accesso lessicale.
**Fondamento**: letteratura sull'accesso lessicale nell'aging (Burke & MacKay, 1997).

### Meccanica

L'utente vede una **parola target** e una **parola probe**. Deve decidere se la probe è:

- un **sinonimo** del target
- un **contrario** del target
- **non correlata** al target

### Risposta

3 pulsanti: **"Sinonimo"** / **"Contrario"** / **"Non correlato"**.

### Layout trial

Parola target e parola probe appaiono **simultaneamente** sullo schermo (target in alto, probe in basso). Il T.Lim inizia dalla comparsa di entrambe le parole.

**Presentazione simultanea** riduce il carico di WM e mantiene il compito focalizzato sulla relazione semantica.

### Istruzioni utente

> *"Vedrai due parole. La seconda è un sinonimo della prima (stesso significato), un contrario (significato opposto), o non correlata? Scegli la risposta giusta."*

### Tutorial

Mostra "GRANDE — ENORME" → Sinonimo ✓.
Poi "GRANDE — PICCOLO" → Contrario ✓.
Poi "GRANDE — VELOCE" → Non correlato ✓.

### Micro-progressione

−200ms T.Lim per trial bonus (max −2 step, floor 800ms). Regola standard.

### Timer di sessione

- 90s (lv 1–10)
- 120s (lv 11–20)

### Tabella livelli

| Lv | T.Lim (ms) | Difficoltà coppie | % sinonimi | % contrari | % non corr. |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | 5000 | bassa | 33% | 33% | 33% |
| 2 | 4500 | bassa | 33% | 33% | 33% |
| 3 | 4000 | bassa | 33% | 33% | 33% |
| 4 | 3500 | bassa | 33% | 33% | 33% |
| 5 | 3000 | media | 33% | 33% | 33% |
| 6 | 2800 | media | 33% | 33% | 33% |
| 7 | 2600 | media | 33% | 33% | 33% |
| 8 | 2400 | media | 33% | 33% | 33% |
| 9 | 2200 | media | 33% | 33% | 33% |
| 10 | 2000 | media | 33% | 33% | 33% |
| 11 | 1800 | alta | 33% | 33% | 33% |
| 12 | 1700 | alta | 33% | 33% | 33% |
| 13 | 1600 | alta | 33% | 33% | 33% |
| 14 | 1500 | alta | 33% | 33% | 33% |
| 15 | 1400 | alta | 33% | 33% | 33% |
| 16 | 1300 | molto alta | 33% | 33% | 33% |
| 17 | 1200 | molto alta | 33% | 33% | 33% |
| 18 | 1100 | molto alta | 33% | 33% | 33% |
| 19 | 1000 | molto alta | 33% | 33% | 33% |
| 20 | 900 | molto alta | 33% | 33% | 33% |

### Difficoltà coppie

- **Bassa**: sinonimi/contrari prototipici (GRANDE/ENORME, CALDO/FREDDO). Non correlate chiaramente distanti.
- **Media**: sinonimi/contrari meno frequenti (ARDITO/CORAGGIOSO, OPACO/TRASPARENTE). Non correlate dalla stessa area semantica.
- **Alta**: sinonimi parziali o contestuali (VELOCE/RAPIDO in contesti diversi). Contrari graduali (TIEPIDO/FREDDO). Non correlate foneticamente simili al target.
- **Molto alta**: quasi-sinonimi con sfumatura diversa (FELICE/CONTENTO vs FELICE/EUFORICO). Contrari indiretti. Non correlate semanticamente vicine ma relazione errata.

### Generazione stimoli

- **Fonte**: LLM in pre-generazione + revisione editoriale.
- **Etichette obbligatorie per ogni coppia**: relazione (sinonimo/contrario/non correlato), difficoltà, frequenza lessicale entrambe le parole, dominio semantico.
- **Dataset minimo**: ~400 coppie (≥130 per tipo di relazione) distribuite sulle 4 fasce di difficoltà.
- **Non ripetizione**: una coppia non si riusa entro 10 sessioni.

---

## JSON di configurazione esempio

```json
{
  "family": "linguaggio_denominazione",
  "exercises": [
    {
      "id": "picture_naming",
      "cognitiveDomain": "Linguaggio",
      "inputType": "qwerty_keyboard",
      "autocomplete": "light_filtered_by_category",
      "keyboardOpensImmediately": true,
      "levelTable": {
        "1":  { "timeLimitMs": 8000, "frequencyBand": "FO",    "sessionTimerS": 90 },
        "11": { "timeLimitMs": 3000, "frequencyBand": "AU",    "sessionTimerS": 120 },
        "20": { "timeLimitMs": 2000, "frequencyBand": "AD",    "sessionTimerS": 120 }
      },
      "microProgression": {
        "parameter": "timeLimitMs",
        "increment": -200,
        "floor": 2000,
        "maxSteps": 2,
        "trialsBeforeBonus": 3,
        "bonusCountsForAccuracy": false
      },
      "stimulusGeneration": {
        "source": "twemoji_noto",
        "acceptedAnswersPerImage": "name_plus_synonyms_plus_morphological_variants",
        "minDataset": 400,
        "noRepetitionWithinSessions": 10
      }
    },
    {
      "id": "synonym_antonym_decision",
      "cognitiveDomain": "Linguaggio",
      "responseButtons": ["Sinonimo", "Contrario", "Non_correlato"],
      "levelTable": {
        "1":  { "timeLimitMs": 5000, "pairDifficulty": "bassa",      "sessionTimerS": 90 },
        "11": { "timeLimitMs": 1800, "pairDifficulty": "alta",       "sessionTimerS": 120 },
        "20": { "timeLimitMs": 900,  "pairDifficulty": "molto_alta", "sessionTimerS": 120 }
      },
      "microProgression": {
        "parameter": "timeLimitMs",
        "increment": -200,
        "floor": 800,
        "maxSteps": 2,
        "trialsBeforeBonus": 3,
        "bonusCountsForAccuracy": false
      },
      "stimulusGeneration": {
        "source": "LLM_pregenerated_pool",
        "minDataset": 400,
        "distribution": { "sinonimo": 130, "contrario": 130, "non_correlato": 140 },
        "requiredLabels": ["relazione","difficolta","frequenza_target","frequenza_probe","dominio"],
        "noRepetitionWithinSessions": 10
      }
    }
  ]
}
```
