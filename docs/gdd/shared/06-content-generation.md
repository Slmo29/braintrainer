# Shared 06 — Generazione contenuti

Questo file copre come si generano e selezionano gli stimoli (parole, testi, immagini, numeri) per gli esercizi.

## Generazione autonoma degli stimoli

Il sistema **non si appoggia a liste di stimoli predefinite e validate manualmente**. Ogni famiglia di esercizi dichiara nella propria scheda:

- le **fonti di base** da cui derivare gli stimoli (es. dizionario lessicale italiano con metadati di frequenza per le parole, set di emoji vettoriali categorizzate per le immagini, range numerico per le cifre);
- i **criteri parametrici di selezione** per ogni livello (es. fascia di frequenza lessicale, lunghezza parola, categoria grammaticale, dominio semantico);
- le **regole di filtro e non-ripetizione** (es. esclusione di stimoli ambigui o offensivi; non riutilizzare uno stimolo finché non sono trascorsi N trial successivi).

## Pre-popolamento vs runtime per LLM

Per esercizi con stimoli generati (testi narrativi, domande, scenari):

- **Default consigliato**: pre-popolamento del database (pool persistente revisionato editorialmente prima del rilascio). Il runtime pesca dal pool, non genera al volo.
- **Runtime con LLM**: ammesso solo se la scheda famiglia lo dichiara esplicitamente, sempre rispettando i criteri parametrici.

In ogni caso: **nessun contenuto generato viene presentato all'utente senza filtro automatico** (lunghezza, leggibilità, conformità ai criteri).

## Fonti di base raccomandate

| Categoria stimolo | Fonte primaria | Note |
| :---- | :---- | :---- |
| Lessico italiano (parole comuni) | NVdB — Nuovo Vocabolario di Base (De Mauro) | ~7000 lemmi più frequenti, validati per uso clinico. Stratificati in fasce: FO (fondamentale, ~2000), AU (alto uso, ~3000), AD (alta disponibilità, ~2000). |
| Lessico italiano (livelli alti) | Wikizionario it (dump filtrato) o CoLFIS | Integrazione per livelli 15+. Wikizionario è pratica e gratuita; CoLFIS richiede accordo accademico. |
| Metadati per parola | Lemma, lunghezza in caratteri, frequenza assoluta e per milione, categoria grammaticale, fascia NVdB | Indispensabili per i criteri parametrici di selezione. |
| Emoji/icone vettoriali | Twemoji o Noto Emoji | Open source, copertura ampia, stile coerente. Almeno 300 item categorizzati per dominio semantico. |
| Numeri e lettere | Generati programmaticamente | Cifre 0–9; alfabeto italiano standard (21 lettere) + JKWXY (26 totali quando serve l'alfabeto completo). |
| Testi narrativi e domande | LLM in pre-generazione, validati con filtro automatico | Pool persistente in database. Validazione: leggibilità (indice GULPEASE per italiano), presenza delle 6 unità informative discrete, distrattori plausibili e confutabili dal testo. |

## Filtri obbligatori applicati alla selezione lessicale

Validi per tutte le famiglie:

- esclusione di parolacce, termini offensivi, regionalismi non riconosciuti a livello nazionale;
- esclusione di omografi ambigui;
- esclusione di nomi propri (salvo esercizi specifici).

## Criteri generali per la generazione delle parole

La progressione del livello determina la **progressiva diminuzione della frequenza d'uso** delle parole.

- Livelli bassi → parole ad alta frequenza d'uso (comuni e familiari). Es. lv 1: parole d'uso comune e quotidiano.
- Livelli alti → parole a bassa frequenza d'uso (rare o specialistiche). Es. lv 20: parole rare o specialistiche.

In termini di fasce NVdB: livelli bassi attingono prioritariamente da FO, salendo si include AU e AD, ai livelli alti si attinge da Wikizionario/CoLFIS.

## Generazione domande sui testi

Regole obbligatorie per tutti gli esercizi che prevedono testi con domande:

- Ogni domanda deve essere **ancorata esplicitamente a una o più frasi presenti nel testo** — nessuna informazione esterna al testo è ammessa.
- **Domande fattuali**: risposta ricavabile da una singola frase del testo, senza inferenze.
- **Domande inferenziali**: risposta ricavabile dalla combinazione di almeno due frasi esplicitamente presenti nel testo.
- I **distrattori devono essere plausibili ma confutabili con il testo** — mai inventati.
- Ogni testo deve contenere **almeno 6 unità informative discrete** etichettate prima della generazione delle domande (chi, cosa, quando, dove, come, perché).
- **Ordine obbligatorio di generazione**: prima il testo → poi le unità informative etichettate → poi le domande. Mai il contrario.

## Metriche da tracciare per tutti gli esercizi

| Metrica | Cosa misura |
| :---- | :---- |
| Accuratezza per trial | Corretto / Errato |
| Accuratezza per sessione | % trial corretti sul totale della sessione |

L'accuratezza per sessione passata a `onComplete(score, accuratezza)` è quella **valutativa** (vedi `03-progression.md`).

Famiglie con metriche specifiche aggiuntive (es. Verbal Fluency con score, Memoria Prospettica con hit/miss/false alarm, Path Tracing con tempo di completamento) le dichiarano nella propria scheda.
