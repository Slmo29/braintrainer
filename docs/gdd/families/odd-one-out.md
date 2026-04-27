# Famiglia 3 — Odd One Out (2 varianti)

**Dominio cognitivo**: Attenzione
**Classificazione**: Attenzione selettiva / Ricerca visiva.

**Nota clinica**: ai livelli 16–20 (dimensione discriminante astratta) il costrutto coinvolge anche componenti di ragionamento astratto e funzioni esecutive — ma la classificazione primaria resta attentiva.

## Meccanica core

Il giocatore vede N stimoli sullo schermo, **uno solo dei quali è diverso** dagli altri secondo una regola specifica. Deve identificarlo e toccarlo.

La difficoltà cresce su 3 dimensioni:

1. aumento del **numero di stimoli**
2. riduzione del **tempo disponibile** (T.Lim)
3. dimensione discriminante progressivamente meno ovvia (dalla differenza categoriale netta alla proprietà astratta trasversale)

## Varianti

Le 2 varianti **condividono la stessa tabella livelli e la stessa logica di progressione**. Differiscono solo nel tipo di stimolo.

| ID JSON | Nome | stimulusType |
| :---- | :---- | :---- |
| `odd_one_out_numeri_lettere` | Numeri/Lettere | `numeri_lettere` |
| `odd_one_out_parole_miste` | Parole miste | `parole_miste` |

## Micro-progressione (doppio parametro)

- **Primario (lv 1–17)**: +1 stimolo per trial bonus, ceiling 12. Max +2 oltre base.
- **Secondario (lv 18–20, base già a 12)**: il trial bonus riduce il T.Lim di −1000ms per step, floor 3000ms.

I trial bonus non contano per l'accuratezza inter-livello (regola standard di `shared/03-progression.md`).

## Timer di sessione

- 90s (lv 1–10)
- 120s (lv 11–20)

## Istruzioni utente

**Numeri/Lettere**:
> *"Guarda gli elementi sullo schermo. Uno solo è diverso dagli altri. Trovalo e toccalo."*

**Parole miste**:
> *"Guarda le parole sullo schermo. Una sola non c'entra con le altre. Trovala e toccala."*

## Tabella livelli (condivisa)

| Lv | N stimoli | Dimensione discriminante | T.Lim (ms) | Trial |
| :---- | :---- | :---- | :---- | :---- |
| 1 | 4 | categoriale alto | — | 6 |
| 2 | 4 | categoriale alto | — | 6 |
| 3 | 5 | categoriale alto | — | 6 |
| 4 | 5 | categoriale alto | — | 7 |
| 5 | 6 | categoriale alto | — | 7 |
| 6 | 6 | categoriale medio | — | 7 |
| 7 | 7 | categoriale medio | — | 8 |
| 8 | 7 | categoriale medio | — | 8 |
| 9 | 8 | categoriale medio | — | 8 |
| 10 | 8 | categoriale medio | — | 9 |
| 11 | 9 | semantico contestuale | — | 9 |
| 12 | 9 | semantico contestuale | — | 9 |
| 13 | 10 | semantico contestuale | 10000 | 9 |
| 14 | 10 | semantico contestuale | 9000 | 10 |
| 15 | 11 | semantico contestuale | 8000 | 10 |
| 16 | 11 | astratto | 7000 | 10 |
| 17 | 11 | astratto | 7000 | 10 |
| 18 | 12 | astratto | 6000 | 10 |
| 19 | 12 | astratto | 6000 | 10 |
| 20 | 12 | astratto | 5000 | 10 |

### Cambi di meccanica → schermata di avviso

I cambi della **dimensione discriminante** (lv 6, lv 11, lv 16) sono cambi significativi che richiedono la schermata di avviso descritta in `shared/02-trial-flow.md`, perché cambia il modo in cui l'utente deve cercare il diverso.

## Definizione dimensione discriminante per livello

### Categoriale alto (lv 1–5)

La differenza è **categoriale netta e immediata**.

- *Numeri/Lettere*: 4 lettere + 1 numero (o viceversa).
- *Parole miste*: 4 animali + 1 veicolo; 4 cibi + 1 attrezzo.

### Categoriale medio (lv 6–10)

Stessa macro-categoria, **sottocategoria diversa**.

- *Numeri/Lettere*: 4 numeri pari + 1 dispari; 4 vocali + 1 consonante.
- *Parole miste*: 4 frutti + 1 verdura; 4 mezzi di trasporto terrestri + 1 aereo.

### Semantico contestuale (lv 11–15)

Differenza legata al **contesto d'uso o alla funzione**, non alla categoria.

- *Numeri/Lettere*: 4 numeri nel range 10–20 + 1 fuori range; 4 lettere del gruppo B/P/D/T + 1 estranea.
- *Parole miste*: 4 parole legate alla cucina + 1 che non vi appartiene; 4 parole che indicano oggetti che si tengono in mano + 1 che no.

### Astratto/trasversale (lv 16–20)

Proprietà **non ovvia, trasversale alle categorie semantiche**.

- *Numeri/Lettere*: 4 multipli di 3 + 1 non multiplo; 4 lettere che sono anche cifre romane + 1 no.
- *Parole miste*: 4 bisillabe + 1 trisillaba; 4 parole che iniziano per vocale + 1 che inizia per consonante; 4 parole con solo lettere del primo tempo dell'alfabeto (A–L) + 1 con lettera del secondo tempo.

## Generazione stimoli

### Numeri/Lettere

- **Fonte**: generati programmaticamente.
- **Etichette per ogni stimolo**: tipo (numero/lettera), valore, pari/dispari, vocale/consonante, range numerico, divisibilità per 2/3/5, classe fonologica.
- **Logica trial**: la regola discriminante di ogni trial viene selezionata in base alla dimensione del livello e applicata ai dati etichettati.
- **Non ripetizione**: la stessa coppia target+regola non si ripresenta entro 5 trial.

### Parole miste

- **Fonte**: NVdB italiano.
- **Etichette per ogni parola**: categoria semantica, contesto d'uso principale, numero di sillabe, lettera/vocale iniziale, tipo grammaticale.
- **Frequenza lessicale**:
  - lv 1–8: FO
  - lv 9–15: FO + AU
  - lv 16–20: FO + AU + AD
- **Dataset minimo**: ~600 parole con metadati completi, distribuite su tutte le categorie e fasce di frequenza.
- **Non ripetizione**: una parola non si ripete entro 10 trial dello stesso esercizio.

## JSON di configurazione esempio

```json
{
  "family": "odd_one_out",
  "exercises": [
    {
      "id": "odd_one_out_numeri_lettere",
      "stimulusType": "numeri_lettere",
      "cognitiveDomain": "Attenzione",
      "levelTable": {
        "1":  { "nStimuli": 4,  "discriminatingDimension": "categoriale_alto",    "timeLimitMs": null,  "trialsPerSession": 6 },
        "20": { "nStimuli": 12, "discriminatingDimension": "astratto",             "timeLimitMs": 5000, "trialsPerSession": 10 }
      },
      "microProgression": {
        "primary":   { "parameter": "nStimuli",    "increment": 1,     "ceiling": 12,   "trialsBeforeBonus": 3, "bonusCountsForAccuracy": false },
        "secondary": { "parameter": "timeLimitMs", "increment": -1000, "floor": 3000,   "activatesWhen": "nStimuli_at_ceiling" }
      },
      "stimulusGeneration": {
        "source": "programmatic",
        "labeledProperties": ["tipo","pari_dispari","vocale_consonante","range","divisibilita","classe_fonologica"]
      },
      "sessionTimerSec": { "lv1to10": 90, "lv11to20": 120 }
    },
    {
      "id": "odd_one_out_parole_miste",
      "stimulusType": "parole_miste",
      "cognitiveDomain": "Attenzione",
      "levelTable": {
        "1":  { "nStimuli": 4,  "discriminatingDimension": "categoriale_alto", "timeLimitMs": null,  "trialsPerSession": 6 },
        "20": { "nStimuli": 12, "discriminatingDimension": "astratto",          "timeLimitMs": 5000, "trialsPerSession": 10 }
      },
      "microProgression": {
        "primary":   { "parameter": "nStimuli",    "increment": 1,     "ceiling": 12, "trialsBeforeBonus": 3, "bonusCountsForAccuracy": false },
        "secondary": { "parameter": "timeLimitMs", "increment": -1000, "floor": 3000, "activatesWhen": "nStimuli_at_ceiling" }
      },
      "stimulusGeneration": {
        "source": "NVdB_italiano",
        "requiredMetadata": ["categoria_semantica","contesto_uso","n_sillabe","lettera_iniziale","tipo_grammaticale"],
        "frequencyBandByLevel": { "lv1to8": ["FO"], "lv9to15": ["FO","AU"], "lv16to20": ["FO","AU","AD"] },
        "minDataset": 600,
        "noRepetitionWithinTrials": 10
      },
      "sessionTimerSec": { "lv1to10": 90, "lv11to20": 120 }
    }
  ]
}
```
