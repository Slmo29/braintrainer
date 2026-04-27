# Shared 03 — Progressione

Questo file copre due livelli di progressione che convivono:

- **Inter-livello**: come si passa dal livello N al livello N+1 (o si retrocede). Cadenza: ogni 3 sessioni dello stesso dominio.
- **Intra-livello (micro-progressione)**: come la difficoltà cresce dentro una singola sessione. Cadenza: ogni trial.

Sono indipendenti: la micro-progressione **non influenza** la logica di promozione.

## Progressione inter-livello

La progressione è valutata sugli **ultimi 3 esercizi completati dello stesso dominio cognitivo**, uno per sessione giornaliera, con una valutazione effettiva ogni 3 giorni.

La condizione di promozione **NON è una media**: ogni singolo esercizio deve soddisfare individualmente la soglia richiesta. Questo garantisce un consolidamento reale del livello prima di avanzare, evitando che una performance instabile (es. 100%, 40%, 100%) venga mascherata da una media favorevole.

| Condizione | Azione |
| :---- | :---- |
| ≥ 80% in tutti e 3 gli esercizi | Promozione (+1 livello) |
| Almeno uno < 80% ma nessuno < 60% | Mantenimento |
| 2 sessioni consecutive con almeno uno < 60% | Retrocessione (−1 livello) |

**Limiti**: minimo livello 1, massimo livello 20.

**Onboarding**: livello fisso 1, 1 trial, non soggetto a logica adattiva.

### Implementazione

`user_levels` (tabella in attesa di ridisegno) deve esporre per ogni (utente, dominio):

- livello corrente
- accesso alle ultime 3 accuratezze valutative del dominio (campo dedicato o calcolo al volo da `sessioni`)
- contatore "sessioni consecutive con almeno uno < 60%" per gestire la retrocessione

L'accuratezza usata in questa logica è quella **valutativa**, non quella che include i trial bonus (vedi sezione successiva).

## Micro-progressione intra-livello

Dentro ogni livello, uno o più parametri di difficoltà crescono gradualmente trial dopo trial in base alla performance dell'utente. Il parametro specifico varia per ogni famiglia ed è definito nella scheda famiglia.

La micro-progressione serve esclusivamente a rendere la sessione dinamica e sfidante.

### Logica standard

Valida per tutte le famiglie salvo deroga esplicita nella scheda.

- Ogni sessione contiene un numero fisso di **trial valutativi** ai parametri base del livello corrente (vedi tabella livelli della famiglia, colonna "Trial").
- Dopo **3 trial valutativi corretti consecutivi**, il sistema inserisce **1 trial bonus** con +1 unità del parametro di micro-progressione.
- Se il trial bonus è corretto, il successivo trial bonus può essere +2 (e così via). Se sbagliato, si torna ai trial valutativi al base.
- Massimo **+2 unità** oltre il base (deroga famiglia-specifica possibile, dichiarata nella scheda).
- **I trial bonus non contano per l'accuratezza inter-livello.** L'accuratezza riportata e usata per la promozione/retrocessione è calcolata esclusivamente sui trial valutativi. Questo garantisce stime cliniche stabili a parità di parametri.
- La micro-progressione si **azzera ad ogni nuova sessione**.

### Implicazioni UX

Il trial bonus può avere un micro-feedback visivo dedicato (es. badge "Bonus") senza enfatizzarlo eccessivamente. Per l'utente la sequenza appare come una progressione di sfida crescente all'interno della sessione.

### Implementazione

La logica di micro-progressione è generica e va incapsulata nello stesso wrapper `TrialFlow` descritto in `02-trial-flow.md`. Il wrapper:

- riceve dalla famiglia: parametri base del livello, parametro di micro-progressione, max delta (default +2)
- gestisce la sequenza valutativi/bonus
- mantiene due contatori distinti (corretti valutativi / corretti bonus)
- espone l'accuratezza **valutativa** che viene passata a `onComplete(score, accuratezza)`

## Famiglie senza micro-progressione

Alcune famiglie non hanno micro-progressione (dichiarato nella scheda). Esempi noti:

- **Memoria Prospettica**: sessione a singolo trial continuo, no micro-progressione.
- **Verbal Fluency**: 1 trial per sessione, score come misura principale anziché accuratezza per trial.

In questi casi il wrapper `TrialFlow` riceve un flag che disattiva la logica di trial bonus.
