# Famiglia 24 — Conoscenza Generale (gioco unico)

**Dominio cognitivo**: Memoria
**Classificazione**: memoria semantica culturale.

## Meccanica core

L'utente risponde a domande di cultura generale (storia, arte, geografia, scienze) a scelta multipla. Misura la **memoria semantica culturale** — la componente più stabile della memoria a lungo termine, sensibile al declino cognitivo avanzato ma preservata nelle fasi precoci.

Le domande sono **calibrate generazionalmente** per un pubblico 60+ italiano.

## Struttura trial

Domanda testuale + 4 opzioni MC. L'utente tappa la risposta corretta. ISI 500ms standard (vedi `shared/02-trial-flow.md`).

## Progressione

La difficoltà cresce su **3 dimensioni simultanee**:

1. **Rarità dell'informazione** — da nozioni universalmente note a informazioni meno comuni.
2. **Era temporale** — da storia antica e classica (universale) a eventi moderni (familiare per 60+) a contemporanei (meno familiare).
3. **T.Lim** — decrescente (meno tempo per recuperare l'informazione).

### Calibrazione generazionale

Le domande su cultura popolare, musica, cinema e sport si riferiscono **prevalentemente al periodo 1940–1990** — l'era culturalmente più familiare per un utente 60+.

Domande su cultura contemporanea (post-2000) solo ai livelli più alti e su argomenti universali (es. scoperte scientifiche, eventi storici recenti).

## Micro-progressione

Ogni 3 trial corretti consecutivi il trial bonus pesca una domanda dalla **fascia di rarità superiore**. Max +2 fasce oltre base. Non conta per accuratezza inter-livello.

## Timer di sessione

- 90s (lv 1–10)
- 120s (lv 11–20)

## Istruzioni utente

> *"Leggi la domanda e scegli la risposta giusta tra le quattro opzioni."*

## Tabella livelli

| Lv | T.Lim (ms) | Rarità | Era | Dominio |
| :---- | :---- | :---- | :---- | :---- |
| 1 | 12000 | molto nota | classica | storia, geografia |
| 2 | 11000 | molto nota | classica | storia, arte |
| 3 | 10000 | molto nota | classica + moderna | tutte |
| 4 | 9000 | nota | classica + moderna | tutte |
| 5 | 9000 | nota | classica + moderna | tutte |
| 6 | 8000 | nota | moderna (1900–1970) | tutte |
| 7 | 8000 | nota | moderna | tutte |
| 8 | 7000 | media | moderna | tutte |
| 9 | 7000 | media | moderna | tutte |
| 10 | 6000 | media | moderna | tutte |
| 11 | 6000 | media | moderna + contemp. | tutte |
| 12 | 5500 | media | moderna + contemp. | tutte |
| 13 | 5000 | meno nota | moderna + contemp. | tutte |
| 14 | 5000 | meno nota | contemporanea | tutte |
| 15 | 4500 | meno nota | contemporanea | tutte |
| 16 | 4000 | meno nota | contemporanea | tutte |
| 17 | 4000 | rara | contemporanea | tutte |
| 18 | 3500 | rara | contemporanea | tutte |
| 19 | 3500 | rara | contemporanea | tutte |
| 20 | 3000 | rara | contemporanea | tutte |

## Fasce di rarità

- **Molto nota**: nozioni delle scuole elementari/medie (es. "Qual è la capitale della Francia?", "Chi ha dipinto la Gioconda?").
- **Nota**: cultura generale di base (es. "In quale secolo visse Napoleone?", "Qual è il pianeta più grande del sistema solare?").
- **Media**: cultura generale approfondita (es. "Come si chiama il parlamento italiano?", "In quale città si trova il Colosseo?").
- **Meno nota**: informazioni specifiche ma non specialistiche (es. "Chi scrisse la Divina Commedia e in quale secolo?", "Qual è il fiume più lungo d'Italia?").
- **Rara**: informazioni specialistiche o dettagli precisi (es. "In quale anno fu unificata l'Italia?", "Come si chiama il processo di fotosintesi che fissa il carbonio?").

## Generazione domande

- **Fonte**: LLM in pre-generazione, pool persistente revisionato editorialmente.
- **Etichette obbligatorie per ogni domanda**: dominio (storia/arte/geografia/scienze), era, fascia rarità, risposta corretta, 3 distrattori plausibili.
- **Distrattori**: plausibili ma chiaramente sbagliati per chi conosce la risposta — **non capziosi**.
- **Calibrazione italiana**: prevalenza di domande sulla storia e cultura italiana, con bilanciamento di domande europee e internazionali.
- **Non ripetizione**: una domanda non si riusa entro 30 sessioni.
- **Dataset minimo**: ~800 domande distribuite equamente per dominio, era e fascia di rarità.

## JSON di configurazione esempio

```json
{
  "family": "conoscenza_generale",
  "exercises": [
    {
      "id": "cultura_generale",
      "cognitiveDomain": "Memoria_semantica",
      "responseButtons": 4,
      "levelTable": {
        "1":  { "timeLimitMs": 12000, "rarityBand": "molto_nota", "era": "classica",              "sessionTimerS": 90 },
        "6":  { "timeLimitMs": 8000,  "rarityBand": "nota",       "era": "moderna",               "sessionTimerS": 90 },
        "13": { "timeLimitMs": 5000,  "rarityBand": "meno_nota",  "era": "moderna_contemporanea", "sessionTimerS": 120 },
        "20": { "timeLimitMs": 3000,  "rarityBand": "rara",       "era": "contemporanea",         "sessionTimerS": 120 }
      },
      "microProgression": {
        "parameter": "rarityBand",
        "increment": 1,
        "ceiling": 5,
        "trialsBeforeBonus": 3,
        "bonusCountsForAccuracy": false
      },
      "stimulusGeneration": {
        "source": "LLM_pregenerated_pool",
        "minDataset": 800,
        "domains": ["storia","arte","geografia","scienze"],
        "eras": ["classica","moderna_1900_1970","contemporanea_1971_oggi"],
        "generationalCalibration": "60plus_italiano",
        "distractorRule": "plausibili_non_capziosi",
        "noRepetitionWithinSessions": 30
      }
    }
  ]
}
```
