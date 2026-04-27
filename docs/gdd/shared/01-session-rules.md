# Shared 01 — Regole di sessione

## Sessione giornaliera

Ogni giorno vengono proposti esattamente **5 esercizi**, uno per ciascuno dei 5 domini cognitivi:

1. Memoria
2. Linguaggio
3. Attenzione
4. Funzioni Esecutive
5. Visuospaziale

## Regola N — selezione e non ripetizione

La selezione dell'esercizio del giorno per ciascun dominio avviene **casualmente** con il vincolo:

> Un esercizio non può essere riproposto finché non sono stati selezionati tutti gli altri esercizi dello stesso dominio dopo la sua ultima apparizione.

Dove `N` = numero totale di esercizi del dominio (da aggiornare dopo revisione finale del catalogo).

### Implicazione implementativa

La rotazione attuale `(dayOfYear + categoryIndex) % poolSize` in `fetchOrCreateEserciziDelGiorno` (vedi `lib/sync.ts`) **non è compatibile** con la regola N e va sostituita.

Serve tracciare per-utente l'ordine delle ultime apparizioni di ogni esercizio per dominio. Possibili approcci:

- aggiungere un campo `ultima_apparizione_at` per (utente, esercizio) in una nuova tabella di history;
- oppure ricavare la storia da `esercizi_del_giorno` filtrando per `user_id` e `categoria_id` e ordinando per `data` discendente.

La regola N garantisce anche un intervallo sufficientemente ampio per il riutilizzo degli stimoli dentro lo stesso esercizio (vedi `05-ui-conventions.md` sezione randomizzazione).

## Modelli di terminazione sessione

Esistono **due modelli** di terminazione di una sessione di esercizio. Ogni famiglia dichiara nella sua scheda quale usa.

### Modello A — Timer fisso (default)

- Timer fisso a **90 secondi** per la grande maggioranza degli esercizi.
- Alcune famiglie usano **120 secondi** (dichiarato nella scheda).
- La sessione termina allo scadere del timer **indipendentemente dal numero di trial completati**.
- Il numero di trial effettivi varia con il tempo di risposta dell'utente e il T.Lim del livello.

### Modello B — Sessione a completamento

Per esercizi con struttura temporale vincolata (es. testi da leggere, esercizi MLT con delay lungo, Memoria Prospettica) il timer fisso è sostituito da una **sessione a completamento dei trial previsti**.

- La scheda famiglia dichiara il numero esatto di **trial** da completare per sessione.
- La scheda famiglia fornisce una **stima di durata** della sessione.
- La sessione termina al completamento dei trial.

### Implementazione del timer

Il timer di sessione vive a livello pagina (`app/(app)/esercizi/[id]/page.tsx`) o in un wrapper sopra il game engine, **non dentro la singola famiglia**. Il game engine riceve `tempoScaduto: boolean` come prop e reagisce di conseguenza (chiusura dell'esercizio, calcolo accuratezza sui trial completati).

Per il modello B, il wrapper non avvia il countdown ma traccia solo il numero di trial completati.

## Pool minimo di stimoli per sessione

Per famiglie con timer fisso (modello A), il sistema deve **pre-preparare un pool di istanze di stimolo** sufficiente a coprire la durata massima possibile della sessione, evitando di trovarsi senza stimoli disponibili.

### Formula obbligatoria

```
pool_min = ceil(timer_ms / avg_trial_time_ms) + 3
avg_trial_time_ms = T.Lim + 800
```

Dove:

- `timer_ms` è il timer di sessione in millisecondi (90000 o 120000)
- `avg_trial_time_ms` rappresenta il tempo medio per trial: `T.Lim + 500ms (ISI) + 300ms (feedback)`
- Il `+3` è un buffer di sicurezza

Per livelli senza T.Lim esplicito, usare `avg_trial_time_ms = 2500ms` come stima conservativa.

### Eccezione Sort It

Sort It è un caso speciale: un singolo trial completo (nCat × stimPerCat carte) ai livelli alti può superare il timer di sessione. In questo caso:

- `pool_min = 3` (il sistema prepara 3 trial completi)
- la sessione termina al timer anche a metà di un trial

### Esempio di calcolo

Esempio: famiglia con timer 90s e T.Lim 1500ms al livello 5.

```
avg_trial_time_ms = 1500 + 800 = 2300
pool_min = ceil(90000 / 2300) + 3 = 40 + 3 = 43 stimoli da preparare
```

### Implementazione

Il pool va preparato **prima dell'avvio del timer**, durante il caricamento della pagina esercizio. Le istanze nel pool devono già essere randomizzate, filtrate (no ripetizioni recenti) e pronte all'uso. Il game engine consuma dal pool senza dover invocare logica di generazione runtime.
