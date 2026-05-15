/**
 * Corpus di proverbi e modi di dire per "Il Postino".
 *
 * Fonti:
 *   - Wikiquote, "Proverbi italiani"
 *   - Tradizione popolare e modi di dire idiomatici
 * Classificazione difficoltà e distrattori curati a mano.
 *
 * Ogni item ha:
 *   - id:            stringa univoca (per tracciamento metriche e per evitare
 *                    ripetizioni cross-sessione via localStorage)
 *   - categoria:     "proverbio" (saggezza popolare/morale) o
 *                    "modo_di_dire" (espressione idiomatica figurata)
 *   - pre:           testo prima della parola mancante
 *   - parola:        parola corretta (singola, lowercase)
 *   - post:          testo dopo la parola mancante
 *   - distrattori:   3 alternative plausibili (dalla più distante alla più
 *                    vicina semanticamente)
 *   - illustrazione: emoji ambientale
 *   - difficolta:    0–9 — fascia di difficoltà usata dai livelli per pescare
 *   - centro:        true se la parola mancante è in mezzo alla frase
 *                    (non in fondo). Solo lv 8+ può pescare questi.
 */

export type CategoriaPostino = "proverbio" | "modo_di_dire";

export interface ItemPostino {
  id:            string;
  categoria:     CategoriaPostino;
  pre:           string;
  parola:        string;
  post:          string;
  distrattori:   readonly [string, string, string];
  illustrazione: string;
  difficolta:    number; // 0–9
  centro:        boolean;
  /**
   * Se true, l'item ha DUE buchi da riempire. La sessione mostra entrambe le
   * parole mancanti e un pool unico di opzioni. L'utente deve scegliere prima
   * la parola del primo buco, poi quella del secondo (ordine vincolante).
   * Solo i livelli 9–10 pescano item duplo.
   */
  duplo?:        boolean;
  /** Testo tra il primo e il secondo buco (solo per duplo). */
  mid?:          string;
  /** Parola corretta del secondo buco (solo per duplo). */
  parola2?:      string;
  /** Distrattori per il secondo buco (solo per duplo). */
  distrattori2?: readonly [string, string, string];
}

export const POSTINO_CORPUS: readonly ItemPostino[] = [
  // ── Difficoltà 0 ─ proverbi comunissimi, distrattori molto diversi ──────────
  { id: "p001", categoria: "proverbio", pre: "Chi dorme non piglia ", parola: "pesci", post: ".",
    distrattori: ["fiori", "libri", "uccelli"], illustrazione: "🎣", difficolta: 0, centro: false },
  { id: "p002", categoria: "proverbio", pre: "Tutte le strade portano a ", parola: "Roma", post: ".",
    distrattori: ["Milano", "Napoli", "Venezia"], illustrazione: "🏛️", difficolta: 0, centro: false },
  { id: "p003", categoria: "proverbio", pre: "L'erba del vicino è sempre più ", parola: "verde", post: ".",
    distrattori: ["alta", "secca", "fitta"], illustrazione: "🌿", difficolta: 0, centro: false },
  { id: "p004", categoria: "proverbio", pre: "Non c'è due senza ", parola: "tre", post: ".",
    distrattori: ["quattro", "dieci", "cento"], illustrazione: "🔢", difficolta: 0, centro: false },
  { id: "p005", categoria: "proverbio", pre: "L'unione fa la ", parola: "forza", post: ".",
    distrattori: ["festa", "vita", "pace"], illustrazione: "🤝", difficolta: 0, centro: false },
  { id: "p064", categoria: "proverbio", pre: "Anno nuovo, vita ", parola: "nuova", post: ".",
    distrattori: ["lunga", "felice", "bella"], illustrazione: "🎊", difficolta: 0, centro: false },
  { id: "p065", categoria: "proverbio", pre: "Buon vino fa buon ", parola: "sangue", post: ".",
    distrattori: ["umore", "cuore", "spirito"], illustrazione: "🍷", difficolta: 0, centro: false },
  { id: "p066", categoria: "proverbio", pre: "Finché c'è vita c'è ", parola: "speranza", post: ".",
    distrattori: ["amore", "gioia", "fortuna"], illustrazione: "🌱", difficolta: 0, centro: false },

  // ── Difficoltà 1 ─ proverbi notissimi ───────────────────────────────────────
  { id: "p006", categoria: "proverbio", pre: "Chi va piano va sano e va ", parola: "lontano", post: ".",
    distrattori: ["veloce", "dritto", "spedito"], illustrazione: "🚶", difficolta: 1, centro: false },
  { id: "p007", categoria: "proverbio", pre: "Tra il dire e il fare c'è di mezzo il ", parola: "mare", post: ".",
    distrattori: ["sole", "vento", "fiume"], illustrazione: "🌊", difficolta: 1, centro: false },
  { id: "p008", categoria: "proverbio", pre: "Meglio un uovo oggi che una gallina ", parola: "domani", post: ".",
    distrattori: ["stasera", "presto", "dopo"], illustrazione: "🥚", difficolta: 1, centro: false },
  { id: "p009", categoria: "proverbio", pre: "Rosso di sera bel tempo si ", parola: "spera", post: ".",
    distrattori: ["vede", "sente", "annuncia"], illustrazione: "🌅", difficolta: 1, centro: false },
  { id: "p010", categoria: "proverbio", pre: "Una mela al giorno toglie il medico di ", parola: "torno", post: ".",
    distrattori: ["casa", "mente", "vista"], illustrazione: "🍎", difficolta: 1, centro: false },
  { id: "p067", categoria: "proverbio", pre: "Chi la dura la ", parola: "vince", post: ".",
    distrattori: ["spunta", "tenta", "guadagna"], illustrazione: "💪", difficolta: 1, centro: false },
  { id: "p068", categoria: "proverbio", pre: "Acqua passata non macina più il ", parola: "mulino", post: ".",
    distrattori: ["grano", "fiume", "vento"], illustrazione: "💧", difficolta: 1, centro: false },
  { id: "p069", categoria: "proverbio", pre: "Chi non risica non ", parola: "rosica", post: ".",
    distrattori: ["vince", "guadagna", "ottiene"], illustrazione: "🎲", difficolta: 1, centro: false },
  { id: "p070", categoria: "proverbio", pre: "Batti il ferro finché è ", parola: "caldo", post: ".",
    distrattori: ["pronto", "rovente", "fuso"], illustrazione: "🔨", difficolta: 1, centro: false },
  { id: "p071", categoria: "proverbio", pre: "Can che abbaia non ", parola: "morde", post: ".",
    distrattori: ["graffia", "azzanna", "ferisce"], illustrazione: "🐕", difficolta: 1, centro: false },

  // ── Difficoltà 2 ─ proverbi comuni, distrattori un po' più vicini ───────────
  { id: "p011", categoria: "proverbio", pre: "Chi trova un amico trova un ", parola: "tesoro", post: ".",
    distrattori: ["fratello", "regalo", "compagno"], illustrazione: "💎", difficolta: 2, centro: false },
  { id: "p012", categoria: "proverbio", pre: "A caval donato non si guarda in ", parola: "bocca", post: ".",
    distrattori: ["faccia", "mano", "occhio"], illustrazione: "🐴", difficolta: 2, centro: false },
  { id: "p013", categoria: "proverbio", pre: "Paese che vai, usanza che ", parola: "trovi", post: ".",
    distrattori: ["vedi", "incontri", "scopri"], illustrazione: "🗺️", difficolta: 2, centro: false },
  { id: "p014", categoria: "proverbio", pre: "Il lupo perde il pelo ma non il ", parola: "vizio", post: ".",
    distrattori: ["dente", "morso", "istinto"], illustrazione: "🐺", difficolta: 2, centro: false },
  { id: "p015", categoria: "proverbio", pre: "Tanto va la gatta al lardo che ci lascia lo ", parola: "zampino", post: ".",
    distrattori: ["sguardo", "muso", "pelo"], illustrazione: "🐈", difficolta: 2, centro: false },
  { id: "p016", categoria: "proverbio", pre: "Patti chiari, amicizia ", parola: "lunga", post: ".",
    distrattori: ["vera", "sicura", "salda"], illustrazione: "✍️", difficolta: 2, centro: false },
  { id: "p072", categoria: "proverbio", pre: "Chi semina raccoglie i frutti del proprio ", parola: "lavoro", post: ".",
    distrattori: ["campo", "orto", "giardino"], illustrazione: "🌾", difficolta: 2, centro: false },
  { id: "p073", categoria: "proverbio", pre: "Al bisogno si conosce l'", parola: "amico", post: ".",
    distrattori: ["uomo", "fratello", "vicino"], illustrazione: "🤲", difficolta: 2, centro: false },
  { id: "p074", categoria: "proverbio", pre: "Cane non mangia ", parola: "cane", post: ".",
    distrattori: ["gatto", "osso", "pesce"], illustrazione: "🐶", difficolta: 2, centro: false },
  { id: "p075", categoria: "proverbio", pre: "Buon sangue non ", parola: "mente", post: ".",
    distrattori: ["tace", "tradisce", "inganna"], illustrazione: "❤️", difficolta: 2, centro: false },
  { id: "p076", categoria: "proverbio", pre: "Ad ognuno la sua ", parola: "croce", post: ".",
    distrattori: ["sorte", "pena", "strada"], illustrazione: "⛪", difficolta: 2, centro: false },
  { id: "p077", categoria: "proverbio", pre: "Bandiera vecchia, onor di ", parola: "capitano", post: ".",
    distrattori: ["soldato", "ufficiale", "generale"], illustrazione: "🚩", difficolta: 2, centro: false },
  { id: "p078", categoria: "proverbio", pre: "Cuor contento il ciel l'", parola: "aiuta", post: ".",
    distrattori: ["benedice", "guida", "protegge"], illustrazione: "💗", difficolta: 2, centro: false },
  { id: "p079", categoria: "proverbio", pre: "Aprile dolce ", parola: "dormire", post: ".",
    distrattori: ["riposare", "sognare", "vivere"], illustrazione: "🌸", difficolta: 2, centro: false },

  // ── Difficoltà 3 ─ proverbi comuni con distrattori semanticamente vicini ────
  { id: "p017", categoria: "proverbio", pre: "Non tutte le ciambelle riescono col ", parola: "buco", post: ".",
    distrattori: ["forno", "miele", "zucchero"], illustrazione: "🍩", difficolta: 3, centro: false },
  { id: "p018", categoria: "proverbio", pre: "Chi semina vento raccoglie ", parola: "tempesta", post: ".",
    distrattori: ["grandine", "pioggia", "uragano"], illustrazione: "⛈️", difficolta: 3, centro: false },
  { id: "p019", categoria: "proverbio", pre: "Le bugie hanno le gambe ", parola: "corte", post: ".",
    distrattori: ["piccole", "deboli", "rotte"], illustrazione: "👃", difficolta: 3, centro: false },
  { id: "p020", categoria: "proverbio", pre: "A buon intenditor poche ", parola: "parole", post: ".",
    distrattori: ["frasi", "voci", "battute"], illustrazione: "💬", difficolta: 3, centro: false },
  { id: "p021", categoria: "proverbio", pre: "Tra moglie e marito non mettere il ", parola: "dito", post: ".",
    distrattori: ["naso", "becco", "muso"], illustrazione: "💍", difficolta: 3, centro: false },
  { id: "p022", categoria: "proverbio", pre: "Tale padre, tale ", parola: "figlio", post: ".",
    distrattori: ["nonno", "zio", "nipote"], illustrazione: "👨‍👦", difficolta: 3, centro: false },
  { id: "p080", categoria: "proverbio", pre: "Chi si contenta ", parola: "gode", post: ".",
    distrattori: ["vive", "ride", "prospera"], illustrazione: "😊", difficolta: 3, centro: false },
  { id: "p081", categoria: "proverbio", pre: "Chi si loda si ", parola: "sbroda", post: ".",
    distrattori: ["inganna", "perde", "umilia"], illustrazione: "🪞", difficolta: 3, centro: false },
  { id: "p082", categoria: "proverbio", pre: "Chi tace ", parola: "acconsente", post: ".",
    distrattori: ["mente", "approva", "perdona"], illustrazione: "🤐", difficolta: 3, centro: false },
  { id: "p083", categoria: "proverbio", pre: "Acqua cheta rompe i ", parola: "ponti", post: ".",
    distrattori: ["fiumi", "argini", "muri"], illustrazione: "🌉", difficolta: 3, centro: false },
  { id: "p084", categoria: "proverbio", pre: "Cielo a pecorelle, acqua a ", parola: "catinelle", post: ".",
    distrattori: ["fontane", "barili", "secchi"], illustrazione: "☁️", difficolta: 3, centro: false },
  { id: "p085", categoria: "proverbio", pre: "Anno bisesto, anno ", parola: "funesto", post: ".",
    distrattori: ["sfortunato", "oscuro", "triste"], illustrazione: "📅", difficolta: 3, centro: false },
  { id: "p086", categoria: "proverbio", pre: "Bocca chiusa ed occhio ", parola: "aperto", post: ".",
    distrattori: ["sveglio", "attento", "vigile"], illustrazione: "👁️", difficolta: 3, centro: false },

  // ── Difficoltà 4 ─ proverbi e modi di dire, distrattori vicini ──────────────
  { id: "p023", categoria: "proverbio", pre: "Chi ben comincia è alla metà dell'", parola: "opera", post: ".",
    distrattori: ["strada", "impresa", "viaggio"], illustrazione: "🎬", difficolta: 4, centro: false },
  { id: "p024", categoria: "proverbio", pre: "Il riso abbonda sulla bocca degli ", parola: "stolti", post: ".",
    distrattori: ["sciocchi", "ingenui", "allegri"], illustrazione: "😆", difficolta: 4, centro: false },
  { id: "p025", categoria: "proverbio", pre: "Chi tardi arriva male ", parola: "alloggia", post: ".",
    distrattori: ["riposa", "dorme", "mangia"], illustrazione: "🏨", difficolta: 4, centro: false },
  { id: "p027", categoria: "modo_di_dire", pre: "Prendere due piccioni con una ", parola: "fava", post: ".",
    distrattori: ["mossa", "pietra", "mano"], illustrazione: "🕊️", difficolta: 4, centro: false },
  { id: "p028", categoria: "modo_di_dire", pre: "Avere un diavolo per ", parola: "capello", post: ".",
    distrattori: ["dente", "occhio", "ciglio"], illustrazione: "😠", difficolta: 4, centro: false },
  { id: "p087", categoria: "proverbio", pre: "Chi va al mulino s'", parola: "infarina", post: ".",
    distrattori: ["impolvera", "imbianca", "macchia"], illustrazione: "🌾", difficolta: 4, centro: false },
  { id: "p088", categoria: "proverbio", pre: "Chi nasce tondo non può morir ", parola: "quadrato", post: ".",
    distrattori: ["dritto", "diverso", "ovale"], illustrazione: "⭕", difficolta: 4, centro: false },
  { id: "p089", categoria: "proverbio", pre: "Gallina vecchia fa buon ", parola: "brodo", post: ".",
    distrattori: ["sugo", "ripieno", "arrosto"], illustrazione: "🍲", difficolta: 4, centro: false },
  { id: "p090", categoria: "proverbio", pre: "Bisogna far buon viso a cattivo ", parola: "gioco", post: ".",
    distrattori: ["tempo", "passo", "destino"], illustrazione: "🎭", difficolta: 4, centro: false },
  { id: "p091", categoria: "proverbio", pre: "Chi s'aiuta Iddio l'", parola: "aiuta", post: ".",
    distrattori: ["benedice", "ascolta", "guida"], illustrazione: "🙏", difficolta: 4, centro: false },
  { id: "p092", categoria: "modo_di_dire", pre: "Dire pane al pane e vino al ", parola: "vino", post: ".",
    distrattori: ["bicchiere", "fiasco", "calice"], illustrazione: "🍞", difficolta: 4, centro: false },
  { id: "p093", categoria: "proverbio", pre: "Bisogna fare di necessità ", parola: "virtù", post: ".",
    distrattori: ["forza", "modo", "ragione"], illustrazione: "⚖️", difficolta: 4, centro: false },

  // ── Difficoltà 5 ─ modi di dire frequenti ───────────────────────────────────
  { id: "p029", categoria: "modo_di_dire", pre: "Non avere peli sulla ", parola: "lingua", post: ".",
    distrattori: ["bocca", "mente", "voce"], illustrazione: "👅", difficolta: 5, centro: false },
  { id: "p030", categoria: "modo_di_dire", pre: "Andare a letto con le ", parola: "galline", post: ".",
    distrattori: ["stelle", "oche", "anatre"], illustrazione: "🐔", difficolta: 5, centro: false },
  { id: "p031", categoria: "modo_di_dire", pre: "Avere le mani in ", parola: "pasta", post: ".",
    distrattori: ["tasca", "alto", "saccoccia"], illustrazione: "🍞", difficolta: 5, centro: false },
  { id: "p032", categoria: "modo_di_dire", pre: "Mettere il carro davanti ai ", parola: "buoi", post: ".",
    distrattori: ["cavalli", "muli", "asini"], illustrazione: "🐂", difficolta: 5, centro: false },
  { id: "p033", categoria: "modo_di_dire", pre: "Tagliare la testa al ", parola: "toro", post: ".",
    distrattori: ["bue", "gallo", "vitello"], illustrazione: "🐃", difficolta: 5, centro: false },
  { id: "p034", categoria: "proverbio", pre: "Aiutati che Dio ti ", parola: "aiuta", post: ".",
    distrattori: ["salva", "ascolta", "guida"], illustrazione: "🙏", difficolta: 5, centro: false },
  { id: "p094", categoria: "proverbio", pre: "Al buio tutti i gatti sono ", parola: "bigi", post: ".",
    distrattori: ["neri", "grigi", "scuri"], illustrazione: "🌑", difficolta: 5, centro: false },
  { id: "p095", categoria: "proverbio", pre: "Chi va con lo zoppo impara a ", parola: "zoppicare", post: ".",
    distrattori: ["claudicare", "barcollare", "inciampare"], illustrazione: "🦯", difficolta: 5, centro: false },
  { id: "p096", categoria: "proverbio", pre: "Le ore del mattino hanno l'oro in ", parola: "bocca", post: ".",
    distrattori: ["mano", "tasca", "saccoccia"], illustrazione: "🌅", difficolta: 5, centro: false },
  { id: "p097", categoria: "modo_di_dire", pre: "Avere la testa fra le ", parola: "nuvole", post: ".",
    distrattori: ["stelle", "nebbie", "ombre"], illustrazione: "☁️", difficolta: 5, centro: false },
  { id: "p098", categoria: "proverbio", pre: "Chi fa da sé fa per ", parola: "tre", post: ".",
    distrattori: ["due", "quattro", "cento"], illustrazione: "✌️", difficolta: 5, centro: false },
  { id: "p099", categoria: "proverbio", pre: "Carta canta e villan ", parola: "dorme", post: ".",
    distrattori: ["tace", "russa", "riposa"], illustrazione: "📜", difficolta: 5, centro: false },
  { id: "p100", categoria: "modo_di_dire", pre: "Essere al sette dei ", parola: "cieli", post: ".",
    distrattori: ["mari", "monti", "sogni"], illustrazione: "✨", difficolta: 5, centro: false },

  // ── Difficoltà 6 ─ modi di dire più ricercati ───────────────────────────────
  { id: "p035", categoria: "modo_di_dire", pre: "Fare di una mosca un ", parola: "elefante", post: ".",
    distrattori: ["leone", "drago", "gigante"], illustrazione: "🐘", difficolta: 6, centro: false },
  { id: "p036", categoria: "modo_di_dire", pre: "Cercare il pelo nell'", parola: "uovo", post: ".",
    distrattori: ["unghia", "ombra", "acqua"], illustrazione: "🥚", difficolta: 6, centro: false },
  { id: "p037", categoria: "modo_di_dire", pre: "Vendere fumo per ", parola: "arrosto", post: ".",
    distrattori: ["pesce", "polvere", "carne"], illustrazione: "🔥", difficolta: 6, centro: false },
  { id: "p038", categoria: "modo_di_dire", pre: "Promettere mari e ", parola: "monti", post: ".",
    distrattori: ["stelle", "soldi", "colline"], illustrazione: "⛰️", difficolta: 6, centro: false },
  { id: "p039", categoria: "modo_di_dire", pre: "Tra l'incudine e il ", parola: "martello", post: ".",
    distrattori: ["chiodo", "fuoco", "ferro"], illustrazione: "🔨", difficolta: 6, centro: false },
  { id: "p041", categoria: "proverbio", pre: "Chiodo scaccia ", parola: "chiodo", post: ".",
    distrattori: ["martello", "sasso", "ferro"], illustrazione: "🔧", difficolta: 6, centro: false },
  { id: "p101", categoria: "proverbio", pre: "Chi dice donna dice ", parola: "danno", post: ".",
    distrattori: ["guai", "vita", "amore"], illustrazione: "👩", difficolta: 6, centro: false },
  { id: "p102", categoria: "proverbio", pre: "Il diavolo fa le pentole ma non i ", parola: "coperchi", post: ".",
    distrattori: ["manici", "fondi", "mestoli"], illustrazione: "🍳", difficolta: 6, centro: false },
  { id: "p103", categoria: "proverbio", pre: "Chi dorme d'agosto dorme a suo ", parola: "costo", post: ".",
    distrattori: ["danno", "rischio", "scapito"], illustrazione: "🛌", difficolta: 6, centro: false },
  { id: "p104", categoria: "proverbio", pre: "Chi non muore si ", parola: "rivede", post: ".",
    distrattori: ["ritrova", "incontra", "rincontra"], illustrazione: "👋", difficolta: 6, centro: false },
  { id: "p105", categoria: "proverbio", pre: "A pensar male si ", parola: "indovina", post: ".",
    distrattori: ["sbaglia", "spera", "rimedia"], illustrazione: "🤔", difficolta: 6, centro: false },
  { id: "p106", categoria: "modo_di_dire", pre: "Fare la gatta ", parola: "morta", post: ".",
    distrattori: ["nera", "vecchia", "addormentata"], illustrazione: "🐱", difficolta: 6, centro: false },
  { id: "p107", categoria: "proverbio", pre: "Una rondine non fa ", parola: "primavera", post: ".",
    distrattori: ["estate", "stagione", "festa"], illustrazione: "🐦", difficolta: 6, centro: false },

  // ── Difficoltà 7 ─ distrattori semanticamente molto vicini ──────────────────
  { id: "p042", categoria: "modo_di_dire", pre: "Avere la coda di ", parola: "paglia", post: ".",
    distrattori: ["fieno", "lana", "cotone"], illustrazione: "🌾", difficolta: 7, centro: false },
  { id: "p043", categoria: "modo_di_dire", pre: "Avere uno scheletro nell'", parola: "armadio", post: ".",
    distrattori: ["angolo", "archivio", "cassetto"], illustrazione: "💀", difficolta: 7, centro: false },
  { id: "p044", categoria: "modo_di_dire", pre: "Avere la luna ", parola: "storta", post: ".",
    distrattori: ["piena", "persa", "calante"], illustrazione: "🌙", difficolta: 7, centro: false },
  { id: "p045", categoria: "modo_di_dire", pre: "Avere il dente ", parola: "avvelenato", post: ".",
    distrattori: ["marcio", "rotto", "amaro"], illustrazione: "🦷", difficolta: 7, centro: false },
  { id: "p046", categoria: "modo_di_dire", pre: "Tirare i remi in ", parola: "barca", post: ".",
    distrattori: ["acqua", "riva", "porto"], illustrazione: "🚣", difficolta: 7, centro: false },
  { id: "p047", categoria: "modo_di_dire", pre: "Trovare pane per i propri ", parola: "denti", post: ".",
    distrattori: ["palati", "gusti", "morsi"], illustrazione: "🍞", difficolta: 7, centro: false },
  { id: "p048", categoria: "modo_di_dire", pre: "Avere una memoria di ", parola: "ferro", post: ".",
    distrattori: ["acciaio", "marmo", "pietra"], illustrazione: "🧠", difficolta: 7, centro: false },
  { id: "p108", categoria: "modo_di_dire", pre: "Mettersi le mani nei ", parola: "capelli", post: ".",
    distrattori: ["volti", "occhi", "fianchi"], illustrazione: "😫", difficolta: 7, centro: false },
  { id: "p109", categoria: "modo_di_dire", pre: "Essere come il cacio sui ", parola: "maccheroni", post: ".",
    distrattori: ["ravioli", "tortelli", "rigatoni"], illustrazione: "🧀", difficolta: 7, centro: false },
  { id: "p110", categoria: "proverbio", pre: "A buon cavallo non manca ", parola: "sella", post: ".",
    distrattori: ["redine", "briglia", "staffa"], illustrazione: "🐎", difficolta: 7, centro: false },
  { id: "p111", categoria: "proverbio", pre: "Capelli lunghi, cervello ", parola: "corto", post: ".",
    distrattori: ["piccolo", "stretto", "vuoto"], illustrazione: "💁‍♀️", difficolta: 7, centro: false },
  { id: "p112", categoria: "modo_di_dire", pre: "Battere il ferro quando è ", parola: "caldo", post: ".",
    distrattori: ["pronto", "rovente", "incandescente"], illustrazione: "⚒️", difficolta: 7, centro: false },
  { id: "p113", categoria: "proverbio", pre: "Sbagliando si ", parola: "impara", post: ".",
    distrattori: ["cresce", "capisce", "matura"], illustrazione: "📚", difficolta: 7, centro: false },

  // ── Difficoltà 8 ─ proverbi letterari e parola al centro ────────────────────
  { id: "p049", categoria: "proverbio", pre: "Non dire ", parola: "gatto", post: " se non l'hai nel sacco.",
    distrattori: ["topo", "lepre", "cane"], illustrazione: "🐱", difficolta: 8, centro: true },
  { id: "p050", categoria: "proverbio", pre: "Chi di ", parola: "spada", post: " ferisce di spada perisce.",
    distrattori: ["pugnale", "coltello", "lama"], illustrazione: "⚔️", difficolta: 8, centro: true },
  { id: "p051", categoria: "proverbio", pre: "L'abito non fa il ", parola: "monaco", post: ".",
    distrattori: ["prete", "frate", "santo"], illustrazione: "👘", difficolta: 8, centro: false },
  { id: "p052", categoria: "proverbio", pre: "Dimmi con chi ", parola: "vai", post: " e ti dirò chi sei.",
    distrattori: ["stai", "parli", "vivi"], illustrazione: "👥", difficolta: 8, centro: true },
  { id: "p053", categoria: "proverbio", pre: "Mal comune, mezzo ", parola: "gaudio", post: ".",
    distrattori: ["conforto", "sollievo", "sorriso"], illustrazione: "🫂", difficolta: 8, centro: false },
  { id: "p054", categoria: "proverbio", pre: "Non c'è peggior ", parola: "sordo", post: " di chi non vuol sentire.",
    distrattori: ["cieco", "muto", "ignorante"], illustrazione: "👂", difficolta: 8, centro: true },
  { id: "p114", categoria: "proverbio", pre: "Chi rompe ", parola: "paga", post: " e i cocci sono suoi.",
    distrattori: ["piange", "perde", "resta"], illustrazione: "🍶", difficolta: 8, centro: true },
  { id: "p115", categoria: "proverbio", pre: "Chi troppo ", parola: "vuole", post: " nulla stringe.",
    distrattori: ["chiede", "spera", "pretende"], illustrazione: "🤲", difficolta: 8, centro: true },
  { id: "p116", categoria: "proverbio", pre: "Anche le ", parola: "pulci", post: " hanno la tosse.",
    distrattori: ["zanzare", "mosche", "formiche"], illustrazione: "🦟", difficolta: 8, centro: true },
  { id: "p117", categoria: "proverbio", pre: "A nemico che fugge, ponti d'", parola: "oro", post: ".",
    distrattori: ["argento", "ferro", "bronzo"], illustrazione: "🌉", difficolta: 8, centro: false },
  { id: "p118", categoria: "proverbio", pre: "Bue vecchio, solco ", parola: "diritto", post: ".",
    distrattori: ["lungo", "fondo", "stretto"], illustrazione: "🐂", difficolta: 8, centro: false },
  { id: "p119", categoria: "proverbio", pre: "Chi ha ", parola: "tempo", post: " non aspetti tempo.",
    distrattori: ["fretta", "fame", "voglia"], illustrazione: "⏳", difficolta: 8, centro: true },

  // ── Difficoltà 9 ─ letterari, regionali, parola al centro ───────────────────
  { id: "p055", categoria: "proverbio", pre: "Errare è ", parola: "umano", post: ", perseverare diabolico.",
    distrattori: ["normale", "comune", "lecito"], illustrazione: "📜", difficolta: 9, centro: true },
  { id: "p056", categoria: "proverbio", pre: "Ne uccide più la ", parola: "penna", post: " che la spada.",
    distrattori: ["lingua", "gola", "fame"], illustrazione: "✒️", difficolta: 9, centro: true },
  { id: "p057", categoria: "proverbio", pre: "Chi pecora si fa, il ", parola: "lupo", post: " se la mangia.",
    distrattori: ["cane", "leone", "orso"], illustrazione: "🐑", difficolta: 9, centro: true },
  { id: "p058", categoria: "proverbio", pre: "Tra il dire e il ", parola: "fare", post: " c'è di mezzo il mare.",
    distrattori: ["sognare", "pensare", "agire"], illustrazione: "🌊", difficolta: 9, centro: true },
  { id: "p059", categoria: "proverbio", pre: "L'ozio è il ", parola: "padre", post: " di tutti i vizi.",
    distrattori: ["seme", "fratello", "principio"], illustrazione: "😴", difficolta: 9, centro: true },
  { id: "p060", categoria: "proverbio", pre: "Non si può avere la botte piena e la moglie ", parola: "ubriaca", post: ".",
    distrattori: ["contenta", "sazia", "allegra"], illustrazione: "🍷", difficolta: 9, centro: false },
  { id: "p062", categoria: "proverbio", pre: "Campa cavallo che l'", parola: "erba", post: " cresce.",
    distrattori: ["orzo", "avena", "fieno"], illustrazione: "🐎", difficolta: 9, centro: true },
  { id: "p120", categoria: "proverbio", pre: "A goccia a goccia si scava la ", parola: "pietra", post: ".",
    distrattori: ["roccia", "terra", "fossa"], illustrazione: "💧", difficolta: 9, centro: false },
  { id: "p121", categoria: "proverbio", pre: "Anche fra le spine nascono le ", parola: "rose", post: ".",
    distrattori: ["viole", "margherite", "ortensie"], illustrazione: "🌹", difficolta: 9, centro: false },
  { id: "p122", categoria: "proverbio", pre: "Con la ", parola: "pazienza", post: " la foglia di gelso diventa seta.",
    distrattori: ["fatica", "costanza", "premura"], illustrazione: "🧵", difficolta: 9, centro: true },
  { id: "p123", categoria: "proverbio", pre: "Il ", parola: "tempo", post: " è galantuomo.",
    distrattori: ["destino", "fato", "caso"], illustrazione: "⏰", difficolta: 9, centro: true },
  { id: "p124", categoria: "proverbio", pre: "Acqua in ", parola: "bocca", post: "!",
    distrattori: ["mano", "gola", "tasca"], illustrazione: "🤫", difficolta: 9, centro: true },
  { id: "p125", categoria: "proverbio", pre: "Le ", parola: "calende", post: " greche non vengono mai.",
    distrattori: ["feste", "lune", "stelle"], illustrazione: "📆", difficolta: 9, centro: true },

  // ── Difficoltà 9 · DUPLO ─ due parole mancanti, lv 9-10 ─────────────────────
  // L'utente deve cliccare prima la parola del primo buco, poi quella del secondo
  // (ordine vincolante). Pool unico di 6 opzioni.
  { id: "d001", categoria: "proverbio",
    pre: "Tra il ", parola: "dire", mid: " e il ", parola2: "fare", post: " c'è di mezzo il mare.",
    distrattori:  ["sognare", "parlare", "pensare"],
    distrattori2: ["agire", "correre", "andare"],
    illustrazione: "🌊", difficolta: 9, centro: true, duplo: true },
  { id: "d002", categoria: "proverbio",
    pre: "Chi ", parola: "dorme", mid: " non piglia ", parola2: "pesci", post: ".",
    distrattori:  ["riposa", "russa", "sogna"],
    distrattori2: ["uccelli", "rane", "granchi"],
    illustrazione: "🎣", difficolta: 9, centro: true, duplo: true },
  { id: "d003", categoria: "proverbio",
    pre: "Errare è ", parola: "umano", mid: ", perseverare è ", parola2: "diabolico", post: ".",
    distrattori:  ["normale", "frequente", "comune"],
    distrattori2: ["sbagliato", "ostinato", "peccaminoso"],
    illustrazione: "📜", difficolta: 9, centro: true, duplo: true },
  { id: "d004", categoria: "proverbio",
    pre: "Chi semina ", parola: "vento", mid: " raccoglie ", parola2: "tempesta", post: ".",
    distrattori:  ["spine", "sabbia", "nuvole"],
    distrattori2: ["pioggia", "grandine", "uragano"],
    illustrazione: "⛈️", difficolta: 9, centro: true, duplo: true },
  { id: "d005", categoria: "proverbio",
    pre: "L'erba del ", parola: "vicino", mid: " è sempre più ", parola2: "verde", post: ".",
    distrattori:  ["compaesano", "contadino", "padrone"],
    distrattori2: ["folta", "alta", "rigogliosa"],
    illustrazione: "🌿", difficolta: 9, centro: true, duplo: true },
  { id: "d006", categoria: "proverbio",
    pre: "Meglio un ", parola: "uovo", mid: " oggi che una ", parola2: "gallina", post: " domani.",
    distrattori:  ["pane", "pesce", "frutto"],
    distrattori2: ["pecora", "anatra", "tacchina"],
    illustrazione: "🥚", difficolta: 9, centro: true, duplo: true },
  { id: "d007", categoria: "proverbio",
    pre: "Tale ", parola: "padre", mid: ", tale ", parola2: "figlio", post: ".",
    distrattori:  ["zio", "nonno", "fratello"],
    distrattori2: ["nipote", "erede", "discendente"],
    illustrazione: "👨‍👦", difficolta: 9, centro: true, duplo: true },
  { id: "d008", categoria: "proverbio",
    pre: "Chi va ", parola: "piano", mid: " va sano e va ", parola2: "lontano", post: ".",
    distrattori:  ["lento", "calmo", "tranquillo"],
    distrattori2: ["dritto", "spedito", "veloce"],
    illustrazione: "🚶", difficolta: 9, centro: true, duplo: true },
  { id: "d009", categoria: "proverbio",
    pre: "Mal ", parola: "comune", mid: ", mezzo ", parola2: "gaudio", post: ".",
    distrattori:  ["sicuro", "diffuso", "condiviso"],
    distrattori2: ["sollievo", "sorriso", "conforto"],
    illustrazione: "🫂", difficolta: 9, centro: true, duplo: true },
  { id: "d010", categoria: "modo_di_dire",
    pre: "Tra l'", parola: "incudine", mid: " e il ", parola2: "martello", post: ".",
    distrattori:  ["enclume", "ferro", "asse"],
    distrattori2: ["chiodo", "scalpello", "maglio"],
    illustrazione: "🔨", difficolta: 9, centro: true, duplo: true },
  { id: "d011", categoria: "modo_di_dire",
    pre: "Promettere ", parola: "mari", mid: " e ", parola2: "monti", post: ".",
    distrattori:  ["oceani", "fiumi", "laghi"],
    distrattori2: ["colline", "cieli", "stelle"],
    illustrazione: "⛰️", difficolta: 9, centro: true, duplo: true },
  { id: "d012", categoria: "proverbio",
    pre: "Chi dice ", parola: "donna", mid: " dice ", parola2: "danno", post: ".",
    distrattori:  ["moglie", "femmina", "ragazza"],
    distrattori2: ["guai", "rovina", "dolore"],
    illustrazione: "👩", difficolta: 9, centro: true, duplo: true },
  { id: "d013", categoria: "proverbio",
    pre: "Anno ", parola: "bisesto", mid: ", anno ", parola2: "funesto", post: ".",
    distrattori:  ["lungo", "strano", "speciale"],
    distrattori2: ["nefasto", "sciagurato", "oscuro"],
    illustrazione: "📅", difficolta: 9, centro: true, duplo: true },
  { id: "d014", categoria: "proverbio",
    pre: "Cielo a ", parola: "pecorelle", mid: ", acqua a ", parola2: "catinelle", post: ".",
    distrattori:  ["nuvolette", "agnellini", "batuffoli"],
    distrattori2: ["secchiate", "barili", "fontane"],
    illustrazione: "☁️", difficolta: 9, centro: true, duplo: true },
  { id: "d015", categoria: "proverbio",
    pre: "Ne uccide più la ", parola: "penna", mid: " che la ", parola2: "spada", post: ".",
    distrattori:  ["lingua", "voce", "parola"],
    distrattori2: ["lancia", "lama", "pistola"],
    illustrazione: "✒️", difficolta: 9, centro: true, duplo: true },
  { id: "d016", categoria: "proverbio",
    pre: "Non si può avere la ", parola: "botte", mid: " piena e la ", parola2: "moglie", post: " ubriaca.",
    distrattori:  ["damigiana", "bottiglia", "anfora"],
    distrattori2: ["serva", "donna", "vicina"],
    illustrazione: "🍷", difficolta: 9, centro: true, duplo: true },
];

/** Restituisce gli item filtrati per fascia, regola "centro" e modalità duplo. */
export function filtraCorpus(
  difficoltaMin: number,
  difficoltaMax: number,
  ammettiCentro: boolean,
  soloDuplo: boolean,
): readonly ItemPostino[] {
  return POSTINO_CORPUS.filter((it) => {
    if (it.difficolta < difficoltaMin || it.difficolta > difficoltaMax) return false;
    if (!ammettiCentro && it.centro) return false;
    // Modalità duplo: lv 9-10 pescano SOLO item duplo; gli altri livelli
    // escludono i duplo (che non sarebbero risolvibili con la UI a 1 buco).
    if (soloDuplo) {
      if (!it.duplo) return false;
    } else {
      if (it.duplo) return false;
    }
    return true;
  });
}
