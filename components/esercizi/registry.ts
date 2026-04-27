import type { ComponentType } from "react";
import type { GameEngineProps } from "@/lib/exercise-types";
import { FlankerTaskEngine } from "./families/flanker-task/FlankerTaskEngine";

/**
 * Mappa esercizio_id → ComponentType<GameEngineProps>.
 *
 * Chiave: id JSON dell'esercizio (corrisponde a esercizi.id nel DB e al
 * parametro [id] nella URL di page.tsx).
 *
 * Famiglie multi-esercizio (es. Sequence Tap, Recall Grid) mappano più
 * chiavi allo stesso ComponentType. Il game engine riceverà in futuro
 * esercizioId: string in GameEngineProps per discriminare la variante.
 *
 * Per aggiungere una nuova famiglia: importare il suo Engine e aggiungere
 * le entry corrispondenti agli id JSON di docs/gdd/shared/07-catalog.md.
 */
export const ENGINE_REGISTRY: Record<string, ComponentType<GameEngineProps>> = {

  // ── Famiglia 17: Flanker Task ─────────────────────────────────────────────
  flanker_frecce: FlankerTaskEngine,

  // ── Da aggiungere progressivamente (una entry per id JSON del catalogo) ──
  // sequence_tap_numeri_forward:           SequenceTapEngine,
  // sequence_tap_numeri_backward:          SequenceTapEngine,
  // sequence_tap_parole_forward:           SequenceTapEngine,
  // sequence_tap_parole_backward:          SequenceTapEngine,
  // recall_grid_parole_mbt:                RecallGridEngine,
  // recall_grid_immagini_mbt:              RecallGridEngine,
  // recall_grid_immagini_mlt:              RecallGridEngine,
  // odd_one_out_numeri_lettere:            OddOneOutEngine,
  // odd_one_out_parole_miste:              OddOneOutEngine,
  // sort_it_percettivo:                    SortItEngine,
  // sort_it_semantico:                     SortItEngine,
  // hayling_ab:                            HaylingGameEngine,
  // hayling_b_only:                        HaylingGameEngine,
  // pasat_light_visivo:                    PasatLightEngine,
  // updating_wm_parole:                    UpdatingWmEngine,
  // updating_wm_immagini:                  UpdatingWmEngine,
  // updating_wm_numeri:                    UpdatingWmEngine,
  // memoria_comprensione_fattuale_mbt:     MemoriaComprensioneTestoEngine,
  // memoria_comprensione_inferenziale_mbt: MemoriaComprensioneTestoEngine,
  // memoria_comprensione_ordine_narrativo: MemoriaComprensioneTestoEngine,
  // memoria_comprensione_fattuale_mlt:     MemoriaComprensioneTestoEngine,
  // memoria_lista_parole_rievocazione:     MemoriaListaEngine,
  // memoria_lista_immagini_rievocazione:   MemoriaListaEngine,
  // memoria_lista_parole_riconoscimento:   MemoriaListaEngine,
  // memoria_lista_immagini_riconoscimento: MemoriaListaEngine,
  // sart_numerico:                         SartEngine,
  // go_nogo_cromatico:                     GoNoGoEngine,
  // go_nogo_semantico:                     GoNoGoEngine,
  // stroop_classico:                       StroopEngine,
  // picture_naming:                        LinguaggioDenominazioneEngine,
  // synonym_antonym_decision:              LinguaggioDenominazioneEngine,
  // path_tracing:                          PathTracingEngine,      // MazeSession
  // cultura_generale:                      ConoscenzaGeneraleEngine,
  // word_chain_alfabetico:                 WordChainEngine,        // WordChainSession
  // word_chain_switching_categoriale:      WordChainSwitchingEngine, // WordChainSession
  // associative_memory:                    AssociativeMemoryEngine,
  // verbal_fluency_semantica:              VerbalFluencyEngine,    // FluencySession
  // verbal_fluency_fonemica:               VerbalFluencyEngine,    // FluencySession
  // memoria_prospettica_event_based:       MemoriaProspetticaEngine, // ProspectiveMemorySession
  // memoria_prospettica_time_based:        MemoriaProspetticaEngine, // ProspectiveMemorySession
};

/**
 * Ritorna il ComponentType corrispondente all'esercizio, oppure null se
 * l'id non è registrato (esercizio non ancora implementato o URL non valida).
 * Page.tsx gestisce il null mostrando un messaggio user-friendly senza
 * esporre dettagli tecnici all'utente.
 */
export function getEngine(esercizioId: string): ComponentType<GameEngineProps> | null {
  return ENGINE_REGISTRY[esercizioId] ?? null;
}
