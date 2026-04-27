/**
 * Logica di progressione inter-livello adattiva.
 * Specifiche: docs/gdd/shared/03-progression.md
 *
 * Funzioni pure — nessuna dipendenza da DB o React.
 * L'integrazione con Supabase avviene in lib/sync.ts (aggiornaProgressione).
 */

export const LIVELLO_MIN = 1;
export const LIVELLO_MAX = 20;

// ─── Soglie di progressione (GDD shared/03) ───────────────────────────────────

const SOGLIA_PROMOZIONE = 0.80;   // >= 80% in tutti e 3 gli esercizi → +1 livello
const SOGLIA_RETROCESSIONE = 0.60; // < 60% → conta come sessione "sotto soglia"
const SESSIONI_RETROCESSIONE = 2;  // 2 sessioni consecutive sotto soglia → −1 livello
const FINESTRA_VALUTAZIONE = 3;    // ogni 3 sessioni dello stesso dominio → valutazione

// ─── Tipi ─────────────────────────────────────────────────────────────────────

export interface UserLevelStato {
  livello_corrente: number;
  /**
   * Finestra FIFO delle ultime accuratezze valutative (0.0–1.0).
   * Cresce fino a FINESTRA_VALUTAZIONE, poi viene resettata dopo ogni valutazione.
   * Non include i trial bonus (vedi GDD shared/03-progression.md).
   */
  ultime_accuratezze: number[];
  /**
   * Sessioni consecutive con almeno un trial < 60%.
   * Resettato a 0 quando una sessione >= 60%. Retrocessione a quota 2.
   */
  sessioni_sotto_60_consecutive: number;
}

export type EventoProgressione =
  | "promozione"    // +1 livello (tutti e 3 >= 80%)
  | "retrocessione" // −1 livello (2 sessioni consecutive < 60%)
  | "mantenimento"  // finestra di 3 completa, ma soglia promozione non raggiunta
  | "accumulo";     // finestra non ancora piena — nessuna valutazione

export interface RisultatoProgressione extends UserLevelStato {
  evento: EventoProgressione;
}

// ─── Funzione principale ──────────────────────────────────────────────────────

/**
 * Calcola il nuovo stato di progressione dopo una sessione completata.
 *
 * @param stato  Stato corrente letto da user_levels
 * @param nuovaAccuratezza  Accuratezza valutativa della sessione appena completata (0.0–1.0).
 *               Solo trial valutativi, esclusi trial bonus (GDD shared/03).
 * @returns Nuovo stato da persistere e tipo di evento avvenuto.
 *
 * Regole (in ordine di priorità):
 * 1. Retrocessione (può avvenire prima che la finestra sia piena):
 *    2 sessioni consecutive con accuratezza < 60% → livello −1, reset tutto.
 * 2. Promozione (solo a finestra piena, 3 sessioni):
 *    tutte e 3 le accuratezze >= 80% → livello +1, reset finestra.
 * 3. Mantenimento (finestra piena, no promozione):
 *    reset finestra, livello invariato.
 * 4. Accumulo: finestra non ancora piena, nessuna azione.
 */
export function calcolaProgressione(
  stato: UserLevelStato,
  nuovaAccuratezza: number
): RisultatoProgressione {
  // ── 1. Aggiorna contatore sessioni consecutive sotto soglia ──────────────────
  const sotto60Nuovo = nuovaAccuratezza < SOGLIA_RETROCESSIONE
    ? stato.sessioni_sotto_60_consecutive + 1
    : 0;

  // ── 2. Verifica retrocessione (priorità massima) ─────────────────────────────
  if (sotto60Nuovo >= SESSIONI_RETROCESSIONE) {
    return {
      livello_corrente: Math.max(LIVELLO_MIN, stato.livello_corrente - 1),
      ultime_accuratezze: [],
      sessioni_sotto_60_consecutive: 0,
      evento: "retrocessione",
    };
  }

  // ── 3. Accoda nella finestra di valutazione ───────────────────────────────────
  const finestra = [...stato.ultime_accuratezze, nuovaAccuratezza];

  // ── 4. Valutazione a finestra piena (ogni FINESTRA_VALUTAZIONE sessioni) ──────
  if (finestra.length >= FINESTRA_VALUTAZIONE) {
    const ultimi = finestra.slice(-FINESTRA_VALUTAZIONE);
    const promozione = ultimi.every(a => a >= SOGLIA_PROMOZIONE);
    return {
      livello_corrente: promozione
        ? Math.min(LIVELLO_MAX, stato.livello_corrente + 1)
        : stato.livello_corrente,
      ultime_accuratezze: [],
      sessioni_sotto_60_consecutive: sotto60Nuovo,
      evento: promozione ? "promozione" : "mantenimento",
    };
  }

  // ── 5. Accumulo — finestra non ancora piena ───────────────────────────────────
  return {
    livello_corrente: stato.livello_corrente,
    ultime_accuratezze: finestra,
    sessioni_sotto_60_consecutive: sotto60Nuovo,
    evento: "accumulo",
  };
}

// ─── Utility ──────────────────────────────────────────────────────────────────

/** True se il livello è al massimo e l'ultimo evento era promozione. */
export function isLivelloMassimo(stato: UserLevelStato): boolean {
  return stato.livello_corrente >= LIVELLO_MAX;
}

/** True se il livello è al minimo e l'ultimo evento era retrocessione. */
export function isLivelloMinimo(stato: UserLevelStato): boolean {
  return stato.livello_corrente <= LIVELLO_MIN;
}

/**
 * Stato iniziale per un nuovo utente o una nuova categoria.
 * Livello 1, finestra vuota — allineato all'onboarding del GDD.
 */
export function statoIniziale(): UserLevelStato {
  return {
    livello_corrente: LIVELLO_MIN,
    ultime_accuratezze: [],
    sessioni_sotto_60_consecutive: 0,
  };
}
