/**
 * Livelli per "Il Postino" — Linguaggio · Completamento proverbi e modi di dire.
 *
 * Dominio: Linguaggio (categoria_id = "linguaggio").
 *
 * Costrutto: cloze test su patrimonio idiomatico italiano. Per ogni trial,
 * arriva una lettera con un proverbio o un modo di dire a cui manca una
 * parola; il giocatore sceglie tra 3–4 opzioni. La curva di difficoltà
 * agisce su 4 leve:
 *   - numero opzioni (3 → 4)
 *   - frequenza/notorietà della frase (comunissimi → regionali/letterari)
 *   - distanza semantica dei distrattori (lontani → vicini)
 *   - posizione della parola mancante (fondo → centro/inizio)
 *
 * Timer sessione: 60s (Modello A).
 */

export const POSTINO_SESSION_TIMER_MS = 60_000;

export type CategoriaPostino = "proverbio" | "modo_di_dire";

export interface PostinoLevelConfig {
  livello:         number;
  /** Numero opzioni nel pool. Per lv duplo è 6 (2 corrette + 4 distrattori). */
  numOpzioni:      3 | 4 | 6;
  tLimMs:          number;
  isiMs:           number;
  /** Range di indice difficoltà degli item da pescare (0–9 = 10 fasce). */
  difficoltaMin:   number;
  difficoltaMax:   number;
  /** Se true, la parola mancante può cadere anche nel mezzo della frase. */
  ammettiCentro:   boolean;
  /** Se true, il livello pesca SOLO item con due buchi da riempire (lv 9-10). */
  duplo:           boolean;
}

export const POSTINO_LEVELS: readonly PostinoLevelConfig[] = [
  // lv 1–2: proverbi comunissimi, 3 opzioni molto diverse
  { livello:  1, numOpzioni: 3, tLimMs: 12000, isiMs: 600, difficoltaMin: 0, difficoltaMax: 1, ammettiCentro: false, duplo: false },
  { livello:  2, numOpzioni: 3, tLimMs: 11000, isiMs: 600, difficoltaMin: 0, difficoltaMax: 2, ammettiCentro: false, duplo: false },
  // lv 3–4: aumenta vicinanza distrattori
  { livello:  3, numOpzioni: 3, tLimMs: 10000, isiMs: 550, difficoltaMin: 1, difficoltaMax: 3, ammettiCentro: false, duplo: false },
  { livello:  4, numOpzioni: 4, tLimMs: 10000, isiMs: 550, difficoltaMin: 2, difficoltaMax: 4, ammettiCentro: false, duplo: false },
  // lv 5–6: entrano modi di dire più articolati
  { livello:  5, numOpzioni: 4, tLimMs:  9000, isiMs: 500, difficoltaMin: 3, difficoltaMax: 5, ammettiCentro: false, duplo: false },
  { livello:  6, numOpzioni: 4, tLimMs:  9000, isiMs: 500, difficoltaMin: 4, difficoltaMax: 6, ammettiCentro: false, duplo: false },
  // lv 7: distrattori semanticamente vicini
  { livello:  7, numOpzioni: 4, tLimMs:  8500, isiMs: 450, difficoltaMin: 5, difficoltaMax: 7, ammettiCentro: false, duplo: false },
  // lv 8: parola al centro, item letterari
  { livello:  8, numOpzioni: 4, tLimMs:  8000, isiMs: 450, difficoltaMin: 6, difficoltaMax: 8, ammettiCentro: true,  duplo: false },
  // lv 9–10: DUE buchi da riempire in ordine, pool unico di 6 opzioni
  { livello:  9, numOpzioni: 6, tLimMs: 14000, isiMs: 500, difficoltaMin: 9, difficoltaMax: 9, ammettiCentro: true,  duplo: true  },
  { livello: 10, numOpzioni: 6, tLimMs: 12000, isiMs: 450, difficoltaMin: 9, difficoltaMax: 9, ammettiCentro: true,  duplo: true  },
] as const;

export function getPostinoLevel(livello: number): PostinoLevelConfig {
  return POSTINO_LEVELS[Math.min(10, Math.max(1, livello)) - 1];
}

export function getPostinoMechanicWarning(
  livelloPrec: number | null,
  livello: number,
): { titolo: string; testo: string } | null {
  if (livelloPrec !== null && livelloPrec <= 3 && livello === 4) {
    return {
      titolo: "Una scelta in più",
      testo:
        "Da questo livello le lettere offrono quattro parole tra cui scegliere, " +
        "non più tre. Prenditi un momento in più se serve.",
    };
  }
  if (livelloPrec !== null && livelloPrec <= 6 && livello === 7) {
    return {
      titolo: "Parole simili tra loro",
      testo:
        "Le parole sbagliate cominciano a somigliare a quella giusta. " +
        "Leggi con calma tutto il proverbio prima di scegliere.",
    };
  }
  if (livelloPrec !== null && livelloPrec <= 7 && livello === 8) {
    return {
      titolo: "Parola al centro",
      testo:
        "Da ora la parola mancante può trovarsi anche in mezzo alla frase, " +
        "non solo alla fine. Leggi tutto il proverbio prima di decidere.",
    };
  }
  if (livelloPrec !== null && livelloPrec <= 8 && livello === 9) {
    return {
      titolo: "Due parole mancanti",
      testo:
        "Da questo livello mancano DUE parole in ogni cartolina. " +
        "Scegli prima la parola del primo spazio, poi quella del secondo: " +
        "l'ordine conta.",
    };
  }
  return null;
}
