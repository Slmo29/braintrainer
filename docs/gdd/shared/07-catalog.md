# Shared 07 — Catalogo esercizi

Catalogo completo delle famiglie del GDD: attive, eliminate, e mappa degli `id` JSON usati a database.

## Note di riclassificazione rispetto al GDD originale

Le seguenti famiglie sono state **riclassificate rispetto al catalogo originale del GDD**. Quando si rilegge il GDD `.md` di riferimento si troveranno categorizzate diversamente — la tabella sotto è la fonte di verità per l'implementazione.

| Famiglia | Dominio nel GDD originale | Dominio attuale | Motivazione |
| :---- | :---- | :---- | :---- |
| Pasat Light | Memoria | **Funzioni Esecutive** | Misura primariamente working memory esecutiva (aggiornamento + calcolo concorrente), non memoria episodica o span. |
| Updating WM | Memoria | **Funzioni Esecutive** | "Updating" è uno dei tre componenti esecutivi classici di Miyake (insieme a inhibition e shifting); la manipolazione attiva degli item in WM è esecutiva. |
| Word Chain | Attenzione (riepilogo GDD) / Funzioni Esecutive (scheda dettagliata + JSON) | **Funzioni Esecutive** | Incongruenza interna al GDD: il riepilogo del catalogo classifica come Attenzione, ma la scheda dettagliata e il JSON dichiarano Funzioni Esecutive. Si è scelto Funzioni Esecutive perché la scheda dettagliata è la fonte di verità per l'implementazione. |

Conseguenza: il `categoria_id` denormalizzato in `sessioni` per questi esercizi è `esecutive`, non `memoria`. Le schede famiglia di Pasat Light e Updating WM riportano "Funzioni Esecutive" come dominio.

## Famiglie attive (21)

| # | Famiglia | Dominio | Esercizi | File scheda |
| :---- | :---- | :---- | :---- | :---- |
| 1 | Sequence Tap | Memoria | 4 distinti: Numeri Forward, Numeri Backward, Parole Forward, Parole Backward | `families/sequence-tap.md` |
| 2 | Recall Grid | Memoria | 3: Parole MBT, Immagini MBT (tabella condivisa), Immagini MLT (tabella separata) | `families/recall-grid.md` |
| 3 | Odd One Out | Attenzione | 2 varianti: Numeri/Lettere, Parole miste | `families/odd-one-out.md` |
| 4 | Sort It | Esecutive | 2 varianti: Percettivo, Semantico | `families/sort-it.md` |
| 5 | Hayling Game | Esecutive | 2 esercizi: A+B, B-only | `families/hayling-game.md` |
| 6 | Pasat Light | Esecutive | 1 (visivo) | `families/pasat-light.md` |
| 7 | Updating WM | Esecutive | 3 esercizi: Parole, Immagini (tabella condivisa), Numeri (tabella separata) | `families/updating-wm.md` |
| 8 | Memoria e Comprensione del Testo | Memoria | 4 esercizi distinti: Fattuale MBT, Inferenza MBT, Ordine narrativo, Fattuale differito MLT | `families/memoria-comprensione-testo.md` |
| 9 | Memoria Lista | Memoria | 4: Parole/Immagini × Rievocazione/Riconoscimento | `families/memoria-lista.md` |
| 10 | Memoria Prospettica | Memoria (MP) | 2: Event-based, Time-based | `families/memoria-prospettica.md` |
| 11 | SART | Attenzione | 1 numerico | `families/sart.md` |
| 12 | Go/No-Go | Esecutive | 2: Cromatico, Semantico | `families/go-nogo.md` |
| 15 | Stroop | Esecutive | 1 classico | `families/stroop.md` |
| 17 | Flanker Task | Esecutive | 1 frecce | `families/flanker-task.md` |
| 19 | Verbal Fluency | Linguaggio | 2: Semantica, Fonemica | `families/verbal-fluency.md` |
| 20 | Linguaggio e Denominazione | Linguaggio | 2 esercizi: Picture Naming, Synonym/Antonym Decision | `families/linguaggio-denominazione.md` |
| 22 | Path Tracing | Visuospaziale | 1 | `families/path-tracing.md` |
| 24 | Conoscenza Generale | Memoria | 1 (cultura generale) | `families/conoscenza-generale.md` |
| — | Word Chain | Esecutive | 1 alfabetico | `families/word-chain.md` |
| — | Word Chain Switching | Esecutive | 1 categoriale | `families/word-chain-switching.md` |
| — | Associative Memory | Memoria | 3 varianti: Parola+Immagine, Immagine+Immagine, Parola+Parola (tabella unica) | `families/associative-memory.md` |

**Totale: 21 famiglie attive, 41 unità rotazionali a database, 43 esperienze cognitive distinte.**

Differenza tra i due numeri: la famiglia Associative Memory ha 3 varianti
(Parola-Immagine, Immagine-Immagine, Parola-Parola) che condividono lo stesso
`id` JSON `associative_memory` e si discriminano a runtime via il parametro
`stimulusType`. A database è 1 riga, ma sono 3 esperienze distinte per l'utente.

## Famiglie eliminate

Documentate qui per tracciabilità: **non implementare**, ma sapere che esistevano evita confusione se Claude Code trova riferimenti residui in vecchi commenti, mockup o branch.

| # | Famiglia | Motivo eliminazione |
| :---- | :---- | :---- |
| 13 | Dual Task Tap | Eliminato (vedi nota originale nel GDD) |
| 14 | Vigilance Clock | Ridondante con SART |
| 16 | Task Switching | Costrutto coperto da Sort It lv 11–20, Word Chain e Word Chain Switching |
| 18 | Pianificazione | Tower of London e Brixton troppo complessi da implementare. Costrutto coperto da Sort It lv 11–20 |
| 21 | Calcolo Mentale | Costrutto coperto da PASAT Light (F.6) |
| 23 | Cognizione Sociale | Complessità implementativa elevata, stimoli clinicamente validati non riproducibili in app |
| — | Source Monitoring | Coperto da Memoria Lista |
| — | Attentional Blink | Timing RSVP non garantibile su mobile |
| — | Anti-Pattern Tap | Costrutto coperto da SART e Go/No-Go |
| — | Spelling a Rovescio standalone | Confluito in Sequence Tap — Parole Backward |
| — | Memoria di Prosa (giochi 34–36) | Sostituita da Memoria e Comprensione del Testo |
| — | Memoria Prospettica — Cue semantico | Troppo simile a Event-based, difficile da differenziare |
| — | Recall Grid — variante numerica | Eliminata: mantenute solo Parole e Immagini |
| — | PASAT Light — variante audio | Sospesa: implementare solo varianti visive |
| — | Stroop — Simon | Eliminato in favore di Flanker Task |
| — | Verbal Fluency — DCCS | Ridondante con Sort It |
| — | Linguaggio — Lexical Decision e giochi 63–66 | Eliminati |
| — | Go/No-Go — gioco 67 (lessicale) | Eliminato. Multimodale integrato come congiunzione lv 14–20 |
| — | Visuospaziale — tutti tranne Path Tracing | Complessità implementativa elevata |

## Mappa JSON id → famiglia (41 righe DB)

Riferimento per popolare la tabella `esercizi` a database. **41 righe** perché
Associative Memory ha 1 sola riga DB con 3 varianti runtime (vedi nota in cima
al catalogo). La specifica completa di ogni esercizio è nella scheda famiglia.

| Esercizio | id (JSON) | Parametri chiave |
| :---- | :---- | :---- |
| Sequence Tap — Numeri Forward | `sequence_tap_numeri_forward` | sequenceLength, presentationSpeedMs, timeLimitMs, sessionTimerSec, microProgression |
| Sequence Tap — Numeri Backward | `sequence_tap_numeri_backward` | sequenceLength, presentationSpeedMs, timeLimitMs, sessionTimerSec, microProgression |
| Sequence Tap — Parole Forward | `sequence_tap_parole_forward` | sequenceLength, presentationSpeedMs, timeLimitMs, frequencyBandByLevel, sessionTimerSec, microProgression |
| Sequence Tap — Parole Backward | `sequence_tap_parole_backward` | wordLength, exposureMs, timeLimitMs, keyboard, frequencyBandByLevel, distractorRules, sessionTimerSec, microProgression |
| Recall Grid — Parole MBT | `recall_grid_parole_mbt` | gridSize, nStimuli, exposureMs, delayMs, timeLimitReproMs, sessionTimerSec, microProgression |
| Recall Grid — Immagini MBT | `recall_grid_immagini_mbt` | gridSize, nStimuli, exposureMs, delayMs, timeLimitReproMs, sessionTimerSec, microProgression |
| Recall Grid — Immagini MLT | `recall_grid_immagini_mlt` | gridSize, nStimuli, exposureMs, delayS, timeLimitReproMs, trialsPerSession, delayTask, microProgression |
| Odd One Out — Numeri/Lettere | `odd_one_out_numeri_lettere` | nStimuli, discriminatingDimension, timeLimitMs, sessionTimerSec, microProgression |
| Odd One Out — Parole miste | `odd_one_out_parole_miste` | nStimuli, discriminatingDimension, timeLimitMs, frequencyBandByLevel, sessionTimerSec, microProgression |
| Sort It — Percettivo | `sort_it_percettivo` | nCategories, stimuliPerCategory, ruleSwitchEveryN, ruleChangeCue, feedbackType, timeLimitPerCardMs, activeDimensionsByLevel, sessionTimerSec |
| Sort It — Semantico | `sort_it_semantico` | nCategories, stimuliPerCategory, ruleSwitchEveryN, ruleChangeCue, feedbackType, timeLimitPerCardMs, frequencyBandByLevel, sessionTimerSec |
| Hayling Game — A+B | `hayling_ab` | sentenceDifficultyBand, modeLabeled, timeLimitMs, inputType, sessionTimerSec, microProgression |
| Hayling Game — B-only | `hayling_b_only` | sentenceDifficultyBand, timeLimitMs, inputType, sessionTimerSec, microProgression |
| Pasat Light | `pasat_light_visivo` | isiMs, operations, digitRange, sequenceLength, responseType, operationProportionsByLevel, sessionTimerSec, microProgression |
| Updating WM — Parole | `updating_wm_parole` | nStimuli, presentationSpeedMs, properties, cueTiming, responseType, sessionTimerSec, microProgression |
| Updating WM — Immagini | `updating_wm_immagini` | nStimuli, presentationSpeedMs, properties, cueTiming, responseType, sessionTimerSec, microProgression |
| Updating WM — Numeri | `updating_wm_numeri` | nDigits, presentationSpeedMs, transformation, responseType, sessionTimerSec, microProgression |
| Memoria e Comp. Testo — Fattuale MBT | `memoria_comprensione_fattuale_mbt` | nSentences, nQuestions, nOptions, lexicalBand, trialsPerSession, microProgression |
| Memoria e Comp. Testo — Inferenza MBT | `memoria_comprensione_inferenziale_mbt` | nSentences, nQuestions, nOptions, lexicalBand, trialsPerSession, microProgression |
| Memoria e Comp. Testo — Ordine narrativo | `memoria_comprensione_ordine_narrativo` | nEvents, nDistractors, lexicalBand, trialsPerSession, microProgression |
| Memoria e Comp. Testo — Fattuale MLT | `memoria_comprensione_fattuale_mlt` | nSentences, nQuestions, nOptions, lexicalBand, delayS, trialsPerSession, delayTask, microProgression |
| Memoria Lista — Parole Rievocazione | `memoria_lista_parole_rievocazione` | nItems, presentationSpeedMs, delayS, interference, responseType, trialsPerSession, microProgression |
| Memoria Lista — Immagini Rievocazione | `memoria_lista_immagini_rievocazione` | nItems, presentationSpeedMs, delayS, interference, poolGridSize, trialsPerSession, microProgression |
| Memoria Lista — Riconoscimento Parole | `memoria_lista_parole_riconoscimento` | nItems, presentationSpeedMs, delayS, foilsByLevel, trialsPerSession, microProgression |
| Memoria Lista — Riconoscimento Immagini | `memoria_lista_immagini_riconoscimento` | nItems, presentationSpeedMs, delayS, foilsByLevel, trialsPerSession, microProgression |
| Memoria Prospettica — Event-based | `memoria_prospettica_event_based` | durationMin, nWindows, cueSalience, distractorISIMs, prospectiveResponse |
| Memoria Prospettica — Time-based | `memoria_prospettica_time_based` | intervalS, nWindows, toleranceS, clockVisibility, distractorISIMs, prospectiveResponse |
| SART | `sart_numerico` | sequenceLength, isiMs, targetFrequency, maskingMs, trialsPerSession, microProgression |
| Go/No-Go — Cromatico | `go_nogo_cromatico` | sequenceLength, isiMs, saliency, rule, goNoGoRatio, sessionTimer |
| Go/No-Go — Semantico | `go_nogo_semantico` | sequenceLength, isiMs, saliency, rule, goNoGoRatio, frequencyBandByLevel, sessionTimer |
| Stroop — Classico | `stroop_classico` | timeLimitMs, incongruentRatio, nColors, nOptions, sessionTimerSec, microProgression |
| Flanker Task | `flanker_frecce` | nFlankers, timeLimitMs, incongruentRatio, sessionTimerS, microProgression |
| Verbal Fluency — Semantica | `verbal_fluency_semantica` | timeLimitS, scoreThreshold, categoryBand, microProgression |
| Verbal Fluency — Fonemica | `verbal_fluency_fonemica` | timeLimitS, scoreThreshold, letterPool, microProgression |
| Picture Naming | `picture_naming` | timeLimitMs, frequencyBand, sessionTimerS, microProgression |
| Synonym/Antonym Decision | `synonym_antonym_decision` | timeLimitMs, pairDifficulty, sessionTimerS, microProgression |
| Path Tracing | `path_tracing` | mazeSize, deadEnds, timeLimitS, targetTimeS, microProgression |
| Conoscenza Generale | `cultura_generale` | timeLimitMs, rarityBand, era, sessionTimerS, microProgression |
| Word Chain | `word_chain_alfabetico` | nWords, timeLimitS, targetTimeS, semanticDistance, sessionTimerS, microProgression |
| Word Chain Switching | `word_chain_switching_categoriale` | nWords, nCategories, timeLimitS, targetTimeS, semanticDistance, categoryCue, sessionTimerS |
| Associative Memory | `associative_memory` | stimulusType [parola_immagine\|immagine_immagine\|parola_parola], nPairs, speedMs, delayS, interferingFoils, trialsPerSession, microProgression |
