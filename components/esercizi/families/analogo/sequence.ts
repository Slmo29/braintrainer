/**
 * Generazione stimoli per "L'Analogo".
 *
 * Garanzia: nessuna analogia ripetuta all'interno della stessa sessione.
 * Il pool viene mescolato e si avanza con un cursore monotono; se la
 * sessione richiede più trial di quanti disponibili, il primo trial in
 * eccesso fallisce con errore (configurazione errata di levels/pool).
 *
 * Ad ogni trial le 4 opzioni vengono randomizzate (target sempre presente).
 */

import type { AnalogoLevelConfig, TipoAnalogia } from "./levels";
import type { AnalogiaItem } from "./pool";
import { getPoolByTipo } from "./pool";

export interface StimoloAnalogo {
  item:    AnalogiaItem;
  opzioni: string[]; // 4 opzioni randomizzate, una è item.risposta
  tLimMs:  number;
}

export interface RispostaAnalogo {
  scelta:  string | null;
  tempoMs: number;
}

export interface AnalogoPoolRef {
  /** Cursore di consumo per ciascun tipo (no-repeat in sessione). */
  cursori: Record<TipoAnalogia, number>;
  /** Pool mescolato all'avvio della sessione, consumato in ordine. */
  pools:   Record<TipoAnalogia, AnalogiaItem[]>;
}

function shuffle<T>(arr: readonly T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function creaPoolRef(rng: () => number): AnalogoPoolRef {
  return {
    cursori: { oppositiva: 0, funzionale: 0, categoriale: 0, astratta: 0 },
    pools: {
      oppositiva:  shuffle(getPoolByTipo("oppositiva"), rng),
      funzionale:  shuffle(getPoolByTipo("funzionale"), rng),
      categoriale: shuffle(getPoolByTipo("categoriale"), rng),
      astratta:    shuffle(getPoolByTipo("astratta"), rng),
    },
  };
}

export function generaAnalogo(
  level:   AnalogoLevelConfig,
  poolRef: AnalogoPoolRef,
  rng:     () => number,
): StimoloAnalogo {
  const pool = poolRef.pools[level.tipo];
  const i    = poolRef.cursori[level.tipo];

  if (i >= pool.length) {
    // Garanzia no-repeat violata: pool insufficiente per i trial richiesti.
    throw new Error(
      `Pool "${level.tipo}" esaurito (${pool.length} item) per livello ${level.livello} ` +
      `che richiede ${level.trialsPerSession} trial unici.`,
    );
  }

  poolRef.cursori[level.tipo] = i + 1;
  const item = pool[i];

  const distrattori = level.distrattoriDuri ? item.distrattoriDuri : item.distrattoriFacili;
  const trePerDistr = distrattori.slice(0, 3);
  const opzioni     = shuffle([item.risposta, ...trePerDistr], rng);

  return { item, opzioni, tLimMs: level.tLimMs };
}
