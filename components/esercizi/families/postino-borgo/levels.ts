/**
 * Livelli per "Il Postino del Borgo" — Visuospaziale · Path planning con vincoli.
 *
 * Dominio: Visuospaziali. Modello B (trial-based) — 2 trial per sessione.
 *
 * Ogni trial = una mappa di un borgo italiano (griglia rows × cols) su cui il
 * giocatore deve tracciare un percorso che parte dal postino e tocca tutti i
 * destinatari, rispettando i vincoli di rete stradale (sensi unici, strade
 * chiuse, scalinate). Dal livello 6 alcuni archi possono cambiare stato
 * durante la consegna.
 *
 * Le mappe vengono generate in modo deterministico (seed per livello+variante)
 * in `mapgen.ts`, in modo da garantire risolubilità e progressione coerente.
 */

export type DecorationKind =
  | "casa"      | "casa_alta"  | "bottega"
  | "fontana"   | "piazza"     | "chiesa"
  | "campanile" | "albero"     | "pozzo"
  | "torre"     | "loggia";

export type EdgeKind = "open" | "oneway" | "closed" | "stairs";

export interface PostinoLevelConfig {
  livello:           number;
  rows:              number;
  cols:              number;
  nDestinatari:      number;
  /** Numero di archi "chiusi" (strade interrotte). 0 = nessun vincolo. */
  nChiusi:           number;
  /** Numero di archi "scalinata" (visivamente diversi, bloccati al postino). */
  nScalinate:        number;
  /** Numero di archi a senso unico. */
  nSensiUnici:       number;
  /** Cap di passi assoluto (oltre l'ottimo + tolleranza). 0 = nessun limite. */
  passiBonus:        number;
  /** True se durante la consegna alcuni archi cambiano stato (L6+). */
  conCambiDinamici:  boolean;
  /** Etichetta breve mostrata in UI/diagnostica. */
  etichetta:         string;
}

export const POSTINO_BORGO_LEVELS: readonly PostinoLevelConfig[] = [
  { livello:  1, rows: 3, cols: 3, nDestinatari: 2, nChiusi: 0, nScalinate: 0, nSensiUnici: 0, passiBonus: 6, conCambiDinamici: false, etichetta: "Borgo piccolo"        },
  { livello:  2, rows: 3, cols: 4, nDestinatari: 2, nChiusi: 1, nScalinate: 0, nSensiUnici: 0, passiBonus: 5, conCambiDinamici: false, etichetta: "Prima strada chiusa" },
  { livello:  3, rows: 4, cols: 4, nDestinatari: 3, nChiusi: 1, nScalinate: 1, nSensiUnici: 0, passiBonus: 5, conCambiDinamici: false, etichetta: "Scalinata"           },
  { livello:  4, rows: 4, cols: 4, nDestinatari: 3, nChiusi: 2, nScalinate: 1, nSensiUnici: 1, passiBonus: 4, conCambiDinamici: false, etichetta: "Primo senso unico"   },
  { livello:  5, rows: 4, cols: 5, nDestinatari: 4, nChiusi: 2, nScalinate: 1, nSensiUnici: 2, passiBonus: 4, conCambiDinamici: false, etichetta: "Vicoli stretti"      },
  { livello:  6, rows: 5, cols: 5, nDestinatari: 4, nChiusi: 2, nScalinate: 2, nSensiUnici: 2, passiBonus: 4, conCambiDinamici: true,  etichetta: "Cambi durante"       },
  { livello:  7, rows: 5, cols: 5, nDestinatari: 5, nChiusi: 3, nScalinate: 2, nSensiUnici: 3, passiBonus: 3, conCambiDinamici: true,  etichetta: "Più consegne"        },
  { livello:  8, rows: 5, cols: 6, nDestinatari: 5, nChiusi: 3, nScalinate: 2, nSensiUnici: 4, passiBonus: 3, conCambiDinamici: true,  etichetta: "Borgo grande"        },
  { livello:  9, rows: 6, cols: 6, nDestinatari: 6, nChiusi: 4, nScalinate: 3, nSensiUnici: 4, passiBonus: 3, conCambiDinamici: true,  etichetta: "Quasi maestro"       },
  { livello: 10, rows: 6, cols: 6, nDestinatari: 6, nChiusi: 4, nScalinate: 3, nSensiUnici: 5, passiBonus: 2, conCambiDinamici: true,  etichetta: "Postino del Borgo"   },
] as const;

export const POSTINO_BORGO_TRIAL_VALUTATIVI = 2;

export function getPostinoBorgoLevel(livello: number): PostinoLevelConfig {
  return POSTINO_BORGO_LEVELS[Math.min(10, Math.max(1, livello)) - 1];
}

export function getPostinoBorgoMechanicWarning(
  livelloPrec: number | null,
  livello: number,
): { titolo: string; testo: string } | null {
  if (livelloPrec === null) return null;
  if (livelloPrec <= 1 && livello === 2) {
    return {
      titolo: "Strade chiuse",
      testo: "Da questo livello alcune strade hanno una sbarra: non si possono attraversare. Cerca un altro vicolo.",
    };
  }
  if (livelloPrec <= 2 && livello === 3) {
    return {
      titolo: "Le scalinate",
      testo: "Le scalinate del borgo sono ripide: il postino non può salirle. Trovale e aggirate.",
    };
  }
  if (livelloPrec <= 3 && livello === 4) {
    return {
      titolo: "Sensi unici",
      testo: "Alcuni vicoli si percorrono in una sola direzione: la freccia indica dove si può andare.",
    };
  }
  if (livelloPrec <= 5 && livello === 6) {
    return {
      titolo: "Cambi durante",
      testo: "Da ora qualche strada può chiudersi o aprirsi mentre il postino consegna. Resta pronto: se il percorso si blocca, premi annulla e rivedi.",
    };
  }
  return null;
}
