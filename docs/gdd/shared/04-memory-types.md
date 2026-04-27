# Shared 04 — Memoria a breve termine (MBT) vs lungo termine (MLT)

Distinzione esplicita e obbligatoria. Ogni esercizio del dominio Memoria deve essere classificato chiaramente come MBT o MLT nella propria scheda famiglia.

## Definizioni

- **MBT**: nessun delay o delay massimo 30 secondi tra encoding e retrieval.
- **MLT**: delay obbligatorio progressivo tra encoding e retrieval, con task distrattore attivo durante il delay.

## Tabella delay MLT

> Aggiornata rispetto a versioni precedenti: i delay massimi sono stati ridotti.

| Livello | Delay MLT |
| :---- | :---- |
| 1–4 | 30 secondi |
| 5–8 | 1 minuto |
| 9–12 | 1 minuto 30 secondi |
| 13–16 | 2 minuti |
| 17–20 | 3 minuti |

## Task distrattore (MLT)

Il distrattore deve essere puramente **motorio e visivo**, senza contenuto verbale o semantico, per non interferire con il materiale memorizzato.

**Implementazione richiesta**: tapping ritmico su pallina rimbalzante. L'utente tocca lo schermo ogni volta che la pallina rimbalza.

Vincoli:

- nessun contenuto cognitivo
- nessun testo
- nessuna categorizzazione
- nessun punteggio mostrato durante il distrattore (per non aggiungere carico)

### Componente

Il distrattore è un **componente condiviso** da implementare una volta sola e riusare in tutti gli esercizi MLT. Riceve come prop la durata del delay (calcolata dal livello via tabella sopra) e segnala il completamento al wrapper di esercizio.

## Esercizi MLT noti dal catalogo

Per facilitare l'implementazione, ecco gli esercizi che usano il delay MLT con palla rimbalzante:

- **Recall Grid — Immagini MLT** (delay 30s → 3 min, tabella livelli propria)
- **Memoria e Comprensione del Testo — Richiamo fattuale differito MLT** (tabella delay standard)
- **Memoria Lista — varianti con delay** (le 4 varianti hanno parametro `delayS` configurabile)
- **Associative Memory** (tutte e 3 le varianti, MLT con interferenza foil dai lv 14)
- **Memoria Prospettica — Time-based** (caso speciale: il delay è il task distrattore stesso, vedi scheda)

Tutti gli altri esercizi di memoria sono MBT.

## Memoria Prospettica — caso speciale

La Memoria Prospettica ha una struttura temporale particolare: l'utente deve ricordare di eseguire un'azione durante un task distrattore (event-based) o dopo un certo tempo (time-based). Non è classificabile linearmente come MBT o MLT — la scheda famiglia (`families/memoria-prospettica.md`) la classifica come **MP** (Memoria Prospettica) con regole proprie.
