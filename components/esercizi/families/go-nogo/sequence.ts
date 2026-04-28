/**
 * Generazione stimoli Go/No-Go cromatico con bilanciamento go/nogo per blocchi.
 *
 * Ratio go/nogo: 80% go + 20% nogo. Fisso per tutti i livelli (standard clinico).
 * Fonte: docs/gdd/families/go-nogo.md §Go/No-Go ratio — "Rimane fisso per tutti i livelli".
 *
 * GDD silente sui vincoli sequenziali oltre al ratio. Decisioni implementative:
 *
 * BLOCK_SIZE = 10: tutti i sequenceLength GDD (40,50,...,140) sono multipli di 10,
 * quindi i blocchi sono sempre interi senza chunk parziali.
 * 2 nogo + 8 go per blocco = 20% esatto.
 *
 * Vincolo "max 1 nogo consecutivo": prevenzione nogo back-to-back.
 * Clinicamente: due nogo consecutivi permettono all'utente di "aspettare" invece di
 * inibire attivamente — riduce il valore dell'esercizio. Non specificato dal GDD ma
 * adottato per robustezza del paradigma.
 *
 * Caso degenere documentato: con BLOCK_SIZE=10 + ratio 80/20 (8 go + 2 nogo per
 * blocco) il caso nGo=0 && deveEssereGo=true è impossibile per costruzione —
 * ci sono sempre 8 go di buffer disponibili. Il throw nel ramo di conflitto è
 * safety net difensivo per eventuali modifiche future del rapporto, non per
 * un caso raggiungibile con i parametri attuali.
 *
 * Struttura stimolo: { tipo, colore }. Forma non inclusa — hard-coded a cerchio
 * nel renderer per lv 1–13. Lv 14–20 (congiunzione) estenderà con campo forma.
 */

import type { CoppiaColore, ColoreGoNogo } from "./levels";

// ── Tipo stimolo (esportato — usato da GoNogoTaskEngine e GoNogoStimulus) ──────

export interface GoNogoStimolo {
  tipo:   "go" | "nogo";
  colore: ColoreGoNogo;
}

// ── Costanti (esportate per testabilità) ──────────────────────────────────────

export const BLOCK_SIZE    = 10;
export const NOGO_PER_BLOCK = 2;   // 2/10 = 20%
export const GO_PER_BLOCK   = BLOCK_SIZE - NOGO_PER_BLOCK; // 8

// ── generaPool ────────────────────────────────────────────────────────────────

/**
 * Genera un pool di `poolSize` GoNogoStimolo rispettando:
 * - Ratio go/nogo 80/20, bilanciato per blocchi di BLOCK_SIZE (10) trial.
 * - Vincolo "max 1 nogo consecutivo" anche al confine tra chiamate successive,
 *   tramite `prevTailNogo`.
 *
 * @param poolSize      Numero totale di stimoli da generare. Deve essere
 *                      multiplo di BLOCK_SIZE (garantito dai sequenceLength GDD).
 * @param coppiaAttiva  Coppia go/nogo selezionata dall'engine per questa sessione.
 * @param prevTailNogo  Nogo consecutivi in fondo al pool precedente (0|1).
 *                      Passare 0 per il primo pool della sessione.
 * @param rng           Generatore di numeri casuali. Default: Math.random.
 *                      Iniettare una funzione deterministica nei test.
 */
export function generaPool(
  poolSize: number,
  coppiaAttiva: CoppiaColore,
  prevTailNogo: 0 | 1,
  rng: () => number = Math.random,
): GoNogoStimolo[] {
  const result: GoNogoStimolo[] = [];
  let consecutiviNogo = prevTailNogo as number;

  for (let blockStart = 0; blockStart < poolSize; blockStart += BLOCK_SIZE) {
    let nNogo = NOGO_PER_BLOCK;
    let nGo   = GO_PER_BLOCK;

    for (let i = 0; i < BLOCK_SIZE; i++) {
      // vincolo max 1 nogo consecutivo
      const deveEssereGo   = consecutiviNogo >= 1;
      // feasibility: se piazziamo go ora, i nogo rimasti devono stare nelle posizioni
      // restanti senza consecutive. Invariante: nNogo <= nGo garantisce che dopo ogni go
      // il rapporto sia ancora feasibile (nNogo <= (nGo-1)+1 = nGo).
      const deveEssereNogo = nNogo > nGo;

      let isNogo: boolean;

      if (deveEssereGo && deveEssereNogo) {
        // Stato impossibile per costruzione con BLOCK_SIZE=10 + ratio 80/20
        // (ci sono sempre 8 go di buffer). Fail loudly per regressioni future.
        throw new Error(
          `[go-nogo/sequence] infeasibility irrisolvibile — stato impossibile. ` +
          `blockStart=${blockStart}, i=${i}, nNogo=${nNogo}, nGo=${nGo}, ` +
          `consecutiviNogo=${consecutiviNogo}`,
        );
      } else if (deveEssereGo) {
        isNogo = false;
        nGo--;
        consecutiviNogo = 0;
      } else if (deveEssereNogo) {
        isNogo = true;
        nNogo--;
        consecutiviNogo = 1;
      } else {
        // Scelta probabilistica calibrata: P(nogo) = nNogo / (nGo + nNogo).
        // Converge esattamente al target nNogo entro la fine del blocco.
        const totale = nGo + nNogo;
        isNogo = totale > 0 && rng() < nNogo / totale;
        if (isNogo) {
          nNogo--;
          consecutiviNogo = 1;
        } else {
          nGo--;
          consecutiviNogo = 0;
        }
      }

      result.push({
        tipo:   isNogo ? "nogo" : "go",
        colore: isNogo ? coppiaAttiva.nogo : coppiaAttiva.go,
      });
    }
  }

  return result;
}
