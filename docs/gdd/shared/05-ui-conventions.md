# Shared 05 — Convenzioni UI

## Target sempre presente tra le opzioni di risposta

Regola assoluta valida per tutti gli esercizi con scelta multipla: **il target corretto deve essere sempre incluso tra le opzioni di risposta**. È vietato presentare solo distrattori. Questa regola non ammette eccezioni.

## Esercizi con griglia

Per tutti gli esercizi che prevedono una griglia con stimoli, l'utente deve ricordare e riprodurre **sia lo stimolo che la sua posizione**. Non è sufficiente ricordare solo la posizione.

### Modalità di interazione (per dimensione griglia)

| Dimensione | Interazione |
| :---- | :---- |
| Fino a 4×4 | drag and drop |
| 5×5 e superiori | tap-to-select + tap-to-place (più accessibile per utenti 60+) |

### Componente

La griglia è un **componente condiviso** con due modalità di interazione attivate in base alla dimensione. Implementare una volta, riusare per ogni famiglia che ne abbia bisogno.

## Modalità di input ricorrenti nel catalogo

Riferimento alle modalità di input usate dagli esercizi, da implementare come componenti condivisi:

- **Tap singolo** — risposta immediata su uno stimolo (es. SART, Go/No-Go).
- **Multiple choice (MC)** — selezione tra 2-4 opzioni mostrate (es. PASAT Light lv 1–13, Sort It).
- **Number pad** — tastierino numerico (es. PASAT Light lv 14–20, Updating WM Numeri).
- **QWERTY input** — tastiera completa per parole (es. Memoria Lista Parole Rievocazione, Hayling).
- **Pool grid select** — selezione da una griglia di opzioni (es. Memoria Lista Immagini Rievocazione).
- **Drag and drop** — trascinamento su griglia ≤ 4×4.
- **Tap-to-select + tap-to-place** — selezione + posizionamento in due tap, per griglie 5×5+.
- **Trace path** — traccia continua senza sollevare il dito (Path Tracing).
- **Free recall** — produzione libera di parole (Verbal Fluency).

## Randomizzazione e non ripetizione degli stimoli

- Gli stimoli **non devono ripetersi tra esercizi diversi dello stesso dominio cognitivo** presentati in sessioni consecutive.
- La rotazione degli esercizi (regola N, vedi `01-session-rules.md`) garantisce un intervallo sufficientemente ampio per il riutilizzo degli stimoli dentro lo stesso esercizio.
- Il dataset di stimoli deve essere sufficientemente ampio da rendere la ripetizione **non percepibile** dall'utente nel normale utilizzo quotidiano.
- Le dimensioni minime del dataset sono definite nella scheda di ogni famiglia.

## Dataset di stimoli — criteri generali

- Le varianti **living/non-living sono eliminate** da tutte le famiglie. Si lavora sempre con stimoli misti.
- Le **emoji vettoriali** costituiscono il dataset visivo principale per gli esercizi con immagini. Usare sempre emoji/icone vettoriali flat — mai fotografie.
- Ai livelli bassi affiancare il **nome scritto sotto l'icona**; il nome scompare ai livelli avanzati.
- Le dimensioni minime specifiche per famiglia sono indicate nella scheda famiglia.
