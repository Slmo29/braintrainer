# 00 — Overview del GDD

**VivaMente APP** — Game Design Document, riferimento sviluppatore. Popolazione target: senior 60+. Versione 44.0 (MVP Esteso).

## Come è organizzato il GDD

Il GDD è organizzato per **famiglie di giochi**. Ogni famiglia condivide la stessa meccanica core. La maggior parte delle famiglie ha varianti che differiscono solo nel tipo di stimolo (`stimulusType` nel JSON di configurazione) e condividono la stessa tabella di progressione livelli — il motore di gioco va implementato una volta per famiglia, e le varianti differiscono solo nel dataset caricato.

In casi specifici esplicitamente documentati nella scheda famiglia, una famiglia può contenere **esercizi distinti** — varianti che misurano costrutti cognitivi differenti — ciascuno con propria tabella livelli e propri parametri di carico (es. Sequence Tap con i suoi 4 esercizi Forward/Backward, Recall Grid con MBT vs MLT, Memoria e Comprensione del Testo con 4 esercizi).

## Gerarchia tassonomica

Tre livelli, dal più generale al più specifico:

1. **Dominio cognitivo** — 5 totali: Memoria, Linguaggio, Attenzione, Funzioni Esecutive, Visuospaziale.
2. **Famiglia** — gruppo di esercizi con stessa meccanica core (21 famiglie attive).
3. **Variante / Esercizio** — il singolo gioco che l'utente fa (42 esercizi totali).

La distinzione tra "variante" ed "esercizio distinto" all'interno di una famiglia:

- **Variante**: stessa meccanica + stessa tabella livelli, cambia solo `stimulusType`. Es. Odd One Out — Numeri/Lettere vs Parole miste.
- **Esercizio distinto**: stessa famiglia ma costrutto cognitivo o tabella livelli diversi. Es. Sequence Tap Forward (MBT puro) vs Backward (WM verbale-esecutiva).

## Cosa trovi in ogni scheda famiglia

- Descrizione della meccanica — cosa deve fare il giocatore
- Classificazione MBT/MLT (per famiglie di memoria)
- Parametri di difficoltà — le leve che cambiano tra livelli
- Tabella livelli — i valori esatti per i 20 livelli
- Micro-progressione intra-livello — il parametro che cresce dentro ogni livello
- Varianti / esercizi distinti con il relativo `stimulusType` o `id` JSON
- Eccezioni alle regole comuni (timer, ISI, feedback) se presenti
- Metriche specifiche (oltre a quelle generali)
- Schermate tutorial e cambi di meccanica nei livelli
- JSON di configurazione esempio

## Riepilogo domini cognitivi e famiglie attive

**Memoria** — Sequence Tap, Recall Grid, Memoria e Comprensione del Testo, Memoria Lista, Memoria Prospettica, Conoscenza Generale, Associative Memory.

**Attenzione** — Odd One Out, SART.

**Funzioni Esecutive** — Sort It, Hayling Game, Pasat Light, Updating WM, Go/No-Go, Stroop, Flanker Task, Word Chain, Word Chain Switching.

**Linguaggio** — Verbal Fluency, Linguaggio e Denominazione.

**Visuospaziale** — Path Tracing.

Catalogo completo (incluso famiglie eliminate) in `shared/07-catalog.md`.

## Glossario

- **Famiglia**: gruppo di esercizi che condividono la stessa meccanica core.
- **Variante**: un esercizio dentro una famiglia che condivide tabella livelli, identificato dal `stimulusType`.
- **Esercizio distinto**: variante con tabella livelli propria perché misura un costrutto cognitivo differente.
- **Trial valutativo**: prova ai parametri base del livello corrente. Conta per l'accuratezza inter-livello.
- **Trial bonus**: prova con parametro micro-progressione incrementato. NON conta per l'accuratezza inter-livello.
- **MBT**: Memoria a Breve Termine. Nessun delay o delay ≤ 30s tra encoding e retrieval.
- **MLT**: Memoria a Lungo Termine. Delay obbligatorio progressivo + task distrattore.
- **Cue**: stimolo target che richiede la risposta (in memoria prospettica e simili).
- **Dominio cognitivo**: una delle 5 macro-aree.
- **Regola N**: regola di non-ripetizione di un esercizio finché non sono stati selezionati tutti gli altri del suo dominio.
- **ISI** (Inter-Stimulus Interval): gap tra fine di una risposta e inizio dello stimolo successivo. Default 500ms.
- **T.Lim**: tempo limite di risposta dell'utente per un singolo trial. Definito nella tabella livelli della famiglia.
- **SOA** (Stimulus Onset Asynchrony): intervallo tra l'onset di due stimoli consecutivi.

## Stimoli visivi — nota generale

Per tutti gli esercizi che prevedono immagini, si usa **emoji vettoriali** o icone/illustrazioni vettoriali flat (stile outline o filled). Mai fotografie.

Un set di almeno 300 emoji/icone categorizzate (oggetti quotidiani, animali, cibo, azioni, luoghi, volti stilizzati, forme geometriche) copre la totalità degli esercizi. Le icone devono essere:

- leggibili su schermo piccolo
- ad alto contrasto
- disponibili in versione monocromatica (livelli bassi) e a colori (livelli avanzati)

## Precedenza delle regole

Le **regole comuni** (file `shared/`) prevalgono su qualsiasi indicazione presente nelle schede famiglia. Se una scheda famiglia contraddice una regola comune, la regola comune vince — salvo che la scheda dichiari **esplicitamente** una deroga, motivandola.
