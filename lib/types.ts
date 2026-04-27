export type CanalNotifica = "whatsapp" | "sms" | "email";
export type TipoMedaglia = "streak" | "completamento" | "categoria" | "speciale";
export type ModelloSessione = "timer" | "completamento";
export type MemoriaType = "mbt" | "mlt";
export type CategoriaId = "memoria" | "attenzione" | "linguaggio" | "esecutive" | "visuospaziali";

export interface User {
  id: string;
  nome: string;
  telefono: string | null;
  email: string | null;
  anno_nascita: number | null;
  orario_notifica: string;
  canale_notifica: CanalNotifica;
  consenso_notifiche: boolean;
  created_at: string;
}

export interface Categoria {
  id: string;
  nome: string;
  icona: string;
  descrizione: string | null;
  colore: string | null;
}

/** Parametri per-livello specifici della famiglia. Popolati quando il game engine
 *  della famiglia viene implementato (leggere docs/gdd/families/<famiglia>.md). */
export type EsercizioParams = Record<string, unknown>;

export interface Esercizio {
  id: string;                          // slug GDD (es. 'sequence_tap_numeri_forward')
  famiglia: string;                    // es. 'Sequence Tap'
  nome: string;                        // nome italiano visualizzato in app
  categoria_id: CategoriaId;
  memoria_type: MemoriaType | null;    // null per domini non di memoria
  modello_sessione: ModelloSessione;
  session_timer_sec: 90 | 120 | null; // null se modello_sessione = 'completamento'
  trials_per_session: number | null;   // null se modello_sessione = 'timer'
  params: EsercizioParams;
  attivo: boolean;
  ordine_in_famiglia: number;
  created_at: string;
  categoria?: Categoria;
}

export interface Sessione {
  id: string;
  user_id: string;
  esercizio_id: string;
  score: number;
  durata: number;
  completato: boolean;
  created_at: string;
  esercizio?: Esercizio;
}

export interface Medaglia {
  id: string;
  nome: string;
  descrizione: string | null;
  icona: string | null;
  tipo: TipoMedaglia;
  condizione: Record<string, unknown>;
  created_at: string;
}

export interface UserMedaglia {
  id: string;
  user_id: string;
  medaglia_id: string;
  guadagnata_at: string;
  medaglia?: Medaglia;
}

export interface EsercizioDelGiorno {
  id: string;
  user_id: string;
  esercizio_id: string;
  categoria_id: CategoriaId;
  data: string;
  completato: boolean;
  esercizio?: Esercizio;
}

/** Livello adattivo per-utente per-dominio cognitivo (GDD shared/03-progression.md). */
export interface UserLevel {
  id: string;
  user_id: string;
  categoria_id: CategoriaId;
  livello_corrente: number;            // 1–20
  /** Ultime 3 accuratezze valutative (0.0–1.0), FIFO. Promozione se tutte >= 0.80. */
  ultime_accuratezze: number[];
  /** Sessioni consecutive con almeno un trial < 60%. Retrocessione a quota 2. */
  sessioni_sotto_60_consecutive: number;
  updated_at: string;
}
