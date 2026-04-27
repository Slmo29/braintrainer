# Shared 02 — Ciclo del singolo trial

Questo file copre tutto ciò che accade durante e tra i singoli trial di una sessione: schermata tutorial all'inizio, ISI tra trial, gestione del timeout di risposta (T.Lim), feedback dopo la risposta.

Sono regole **comuni a tutti gli esercizi** salvo deroga esplicita nella scheda famiglia.

## Schermata tutorial

### Prima sessione di ogni esercizio (lv 1, sessione 1)

Prima del primo trial il sistema mostra **obbligatoriamente** una schermata tutorial composta da:

1. **Istruzioni testuali** dell'esercizio (max 3 righe, linguaggio semplice).
2. **Almeno un trial dimostrativo animato** che mostra cosa appare sullo schermo, quale risposta è corretta e come darla (tap, drag, digitazione). Il trial demo non richiede risposta dell'utente — è solo visivo.
3. **Pulsante "Ho capito — Inizia"** per procedere alla sessione vera.

### Sessioni successive (lv 1 sessione 2+, lv 2+)

Le istruzioni sono accessibili tramite un'**icona info opzionale**, non vengono mostrate automaticamente.

### Cambi di livello con cambio di meccanica

Quando il livello cambia (promozione o retrocessione) **e la meccanica cambia significativamente**, viene mostrata una schermata di avviso con la nuova regola prima della sessione successiva. La scheda famiglia indica esplicitamente questi punti di cambio.

Esempi noti dal catalogo:

- **Sort It**: passaggio da cambio regola esplicito a implicito (lv 11)
- **Hayling**: passaggio da etichettato a non etichettato (lv 13)
- **Sequence Tap Parole Backward**: cambio tastiera

### Componente

Il tutorial è un **componente condiviso** (overlay) che riceve dalla famiglia: testo istruzioni, configurazione del trial demo (in formato simile a un trial reale ma in modalità "auto-play"), e callback di conferma.

## ISI standard (Inter-Stimulus Interval)

Gap fisso di **500ms** tra la fine di ogni risposta (o lo scadere del T.Lim) e l'inizio dello stimolo successivo. Lo schermo è **vuoto** durante l'ISI.

Questa regola si applica salvo indicazione diversa esplicitamente dichiarata nella scheda famiglia.

### Eccezioni note dal catalogo

- **PASAT Light**: nessun ISI — la cifra successiva appare automaticamente allo scadere dell'ISI di presentazione (l'ISI di PASAT è il parametro stesso del compito).
- **SART e Go/No-Go**: flusso continuo senza gap — gli stimoli si susseguono senza pause.

## Comportamento a timeout (T.Lim)

Il T.Lim è il tempo massimo entro cui l'utente deve rispondere a un singolo trial, definito nella tabella livelli della famiglia.

Quando l'utente **non risponde entro il T.Lim**:

- Il trial viene marcato automaticamente come **errato**.
- Lo stimolo **scompare immediatamente**.
- Si procede al trial successivo con ISI standard (500ms).
- Il timeout **conta per l'accuratezza inter-livello esattamente come un errore**.

Salvo indicazione diversa nella scheda famiglia.

### Implicazione importante

Il timeout è equivalente a una risposta errata ai fini della logica adattiva. Questo significa che un utente che non risponde sistematicamente ai trial vedrà la propria accuratezza scendere e potrà essere retrocesso di livello.

## Feedback risposta

Dopo ogni risposta dell'utente (corretta o errata), **prima dell'ISI**, il sistema mostra un feedback visivo breve:

- **Risposta corretta**: animazione visiva (bordo o flash verde) per **300ms**.
- **Risposta errata o timeout**: animazione visiva (bordo o flash rosso) per **300ms**.
- **Nessun suono** di default — il feedback è esclusivamente visivo.

### Eccezioni note dal catalogo

- **Esercizi con `feedbackType: none`** (Sort It lv 14–20, Hayling lv 13–20 non etichettato): nessuna animazione feedback per singola risposta — solo accuratezza totale a fine trial.
- **SART e Go/No-Go**: nessun feedback per risposta corretta (il flusso non si interrompe); solo feedback visivo discreto per errore (flash rosso breve senza bloccare il flusso).
- **Memoria Lista — Rievocazione QWERTY**: nessun feedback per singola parola durante l'inserimento. Riepilogo a fine rievocazione (N parole corrette su M inserite).

## Sequenza temporale di un trial standard

Riepilogo del flusso temporale di un trial standard (modello applicabile alla maggior parte delle famiglie):

```
[stimolo presentato] → [utente risponde o T.Lim scade] → [feedback 300ms] → [ISI 500ms vuoto] → [stimolo successivo]
```

Questa sequenza è il presupposto della formula del pool minimo (vedi `01-session-rules.md`):
`avg_trial_time_ms = T.Lim + 800ms`.

## Implementazione: TrialFlow wrapper

Tutta la logica di questo file deve vivere in un **wrapper riusabile** (`TrialFlow` o nome equivalente) che ogni famiglia consuma. Il wrapper:

- mostra il tutorial alla prima sessione (e all'avviso di cambio meccanica)
- gestisce la sequenza stimolo → risposta → feedback → ISI
- applica il T.Lim e gestisce il timeout
- comunica alla famiglia gli eventi rilevanti (risposta data, timeout, fine sessione)
- riceve dalla famiglia: configurazione trial corrente, T.Lim, eventuale `feedbackType: none`, configurazione tutorial

Le famiglie **non devono reimplementare** ISI, feedback, timeout o tutorial. Devono solo dichiarare le proprie configurazioni e consumare il wrapper.
