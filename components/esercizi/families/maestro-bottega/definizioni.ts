/**
 * Corpus di definizioni per "Il Maestro di Bottega".
 *
 * Ogni item ha:
 *   - id:             stringa univoca (per anti-ripetizione cross-sessione)
 *   - parola:         risposta corretta (singola, lowercase, senza articoli)
 *   - alias:          forme accettate equivalenti in risposta libera
 *                     (sinonimi stretti, varianti morfologiche)
 *   - definizione:    descrizione che il maestro pronuncia
 *   - distrattori:    3 alternative plausibili per modalità "scelta"
 *                     (più vicine semanticamente a difficoltà alta)
 *   - difficolta:     0-9 fascia per la curva di livello
 *   - dominio:        etichetta semantica (per metriche)
 */

export type DominioMaestro =
  | "casa"
  | "cucina"
  | "mestiere"
  | "natura"
  | "abbigliamento"
  | "musica"
  | "astratto";

export interface ItemMaestro {
  id:            string;
  parola:        string;
  alias:         readonly string[];
  definizione:   string;
  distrattori:   readonly [string, string, string];
  difficolta:    number;
  dominio:       DominioMaestro;
}

export const MAESTRO_CORPUS: readonly ItemMaestro[] = [
  // ── Difficoltà 0 — oggetti comunissimi della casa ──────────────────────────
  { id: "m001", parola: "martello", alias: [], dominio: "mestiere",
    definizione: "Attrezzo con manico e testa di ferro che si usa per piantare i chiodi.",
    distrattori: ["pinza", "chiave", "tenaglia"], difficolta: 0 },
  { id: "m002", parola: "sedia", alias: [], dominio: "casa",
    definizione: "Mobile con quattro gambe e uno schienale, fatto per sedersi.",
    distrattori: ["tavolo", "panca", "sgabello"], difficolta: 0 },
  { id: "m003", parola: "pane", alias: [], dominio: "cucina",
    definizione: "Cibo cotto al forno fatto con farina, acqua, sale e lievito.",
    distrattori: ["pasta", "torta", "biscotto"], difficolta: 0 },
  { id: "m004", parola: "scarpa", alias: ["scarpe"], dominio: "abbigliamento",
    definizione: "Calzatura che protegge e copre il piede.",
    distrattori: ["calza", "guanto", "cappello"], difficolta: 0 },
  { id: "m005", parola: "ombrello", alias: [], dominio: "casa",
    definizione: "Oggetto con manico e tela che si apre per ripararsi dalla pioggia.",
    distrattori: ["bastone", "cappello", "mantello"], difficolta: 0 },
  { id: "m006", parola: "forbice", alias: ["forbici"], dominio: "mestiere",
    definizione: "Attrezzo con due lame incrociate che serve per tagliare.",
    distrattori: ["coltello", "ago", "lama"], difficolta: 0 },
  { id: "m007", parola: "chiave", alias: [], dominio: "casa",
    definizione: "Piccolo oggetto di metallo che apre e chiude le serrature.",
    distrattori: ["lucchetto", "moneta", "anello"], difficolta: 0 },
  { id: "m008", parola: "candela", alias: [], dominio: "casa",
    definizione: "Cilindro di cera con uno stoppino che si accende per fare luce.",
    distrattori: ["lampada", "torcia", "lume"], difficolta: 0 },

  // ── Difficoltà 1 — oggetti comuni ──────────────────────────────────────────
  { id: "m009", parola: "pentola", alias: [], dominio: "cucina",
    definizione: "Recipiente di metallo con manici, usato per cuocere i cibi sul fuoco.",
    distrattori: ["padella", "casseruola", "tegame"], difficolta: 1 },
  { id: "m010", parola: "scopa", alias: [], dominio: "casa",
    definizione: "Arnese con manico lungo e setole, serve per spazzare il pavimento.",
    distrattori: ["paletta", "spazzola", "straccio"], difficolta: 1 },
  { id: "m011", parola: "specchio", alias: [], dominio: "casa",
    definizione: "Superficie di vetro che riflette l'immagine di chi vi si guarda.",
    distrattori: ["vetro", "quadro", "finestra"], difficolta: 1 },
  { id: "m012", parola: "ago", alias: [], dominio: "mestiere",
    definizione: "Piccolo bastoncino appuntito di metallo con una cruna, serve per cucire.",
    distrattori: ["spillo", "chiodo", "filo"], difficolta: 1 },
  { id: "m013", parola: "campana", alias: [], dominio: "casa",
    definizione: "Strumento di bronzo a forma di calice rovesciato che suona quando viene colpito.",
    distrattori: ["tamburo", "campanello", "trombetta"], difficolta: 1 },
  { id: "m014", parola: "barca", alias: [], dominio: "mestiere",
    definizione: "Piccola imbarcazione che galleggia sull'acqua.",
    distrattori: ["nave", "zattera", "canoa"], difficolta: 1 },
  { id: "m015", parola: "ombra", alias: [], dominio: "natura",
    definizione: "Zona scura che si forma quando un corpo blocca la luce.",
    distrattori: ["nebbia", "buio", "nuvola"], difficolta: 1 },

  // ── Difficoltà 2 — leggermente meno frequenti ─────────────────────────────
  { id: "m016", parola: "scala", alias: ["scaletta"], dominio: "casa",
    definizione: "Struttura a gradini che serve a salire e scendere fra piani diversi.",
    distrattori: ["rampa", "ponte", "tetto"], difficolta: 2 },
  { id: "m017", parola: "violino", alias: [], dominio: "musica",
    definizione: "Strumento musicale a quattro corde che si suona con un archetto.",
    distrattori: ["chitarra", "viola", "mandolino"], difficolta: 2 },
  { id: "m018", parola: "alveare", alias: ["arnia"], dominio: "natura",
    definizione: "Casa delle api dove producono il miele.",
    distrattori: ["nido", "tana", "favo"], difficolta: 2 },
  { id: "m019", parola: "incudine", alias: [], dominio: "mestiere",
    definizione: "Grosso blocco di ferro su cui il fabbro batte il metallo arroventato.",
    distrattori: ["mazza", "morsa", "fucina"], difficolta: 2 },
  { id: "m020", parola: "mortaio", alias: [], dominio: "cucina",
    definizione: "Recipiente di pietra in cui si pestano spezie e semi con un pestello.",
    distrattori: ["macina", "tegame", "ciotola"], difficolta: 2 },
  { id: "m021", parola: "ventaglio", alias: [], dominio: "casa",
    definizione: "Oggetto pieghevole che si apre a mezzaluna e serve a farsi aria.",
    distrattori: ["ventilatore", "fazzoletto", "parasole"], difficolta: 2 },
  { id: "m022", parola: "lanterna", alias: [], dominio: "casa",
    definizione: "Lume portatile chiuso da vetri, usato un tempo per illuminare di notte.",
    distrattori: ["candela", "torcia", "lampione"], difficolta: 2 },

  // ── Difficoltà 3 — mestieri tradizionali, oggetti meno usati ──────────────
  { id: "m023", parola: "telaio", alias: [], dominio: "mestiere",
    definizione: "Macchina di legno con cui si intrecciano i fili per tessere stoffe.",
    distrattori: ["arcolaio", "fuso", "filatoio"], difficolta: 3 },
  { id: "m024", parola: "tegola", alias: [], dominio: "casa",
    definizione: "Pezzo di terracotta ricurvo che si mette sul tetto per coprirlo.",
    distrattori: ["mattone", "lastra", "piastrella"], difficolta: 3 },
  { id: "m025", parola: "botte", alias: [], dominio: "mestiere",
    definizione: "Grosso recipiente di legno con cerchi di ferro, usato per il vino.",
    distrattori: ["barile", "damigiana", "fusto"], difficolta: 3 },
  { id: "m026", parola: "aratro", alias: [], dominio: "mestiere",
    definizione: "Attrezzo agricolo che apre e rivolta la terra prima della semina.",
    distrattori: ["zappa", "vanga", "erpice"], difficolta: 3 },
  { id: "m027", parola: "lima", alias: [], dominio: "mestiere",
    definizione: "Barretta di acciaio scanalata che serve a levigare il metallo.",
    distrattori: ["raspa", "scalpello", "punteruolo"], difficolta: 3 },
  { id: "m028", parola: "scrigno", alias: ["cofanetto"], dominio: "casa",
    definizione: "Piccolo cofano spesso prezioso in cui si custodiscono gioielli o ricordi.",
    distrattori: ["baule", "cassetta", "forziere"], difficolta: 3 },
  { id: "m029", parola: "remi", alias: ["remo"], dominio: "mestiere",
    definizione: "Lunghe pale di legno con cui si spinge la barca sull'acqua.",
    distrattori: ["vela", "timone", "pagaie"], difficolta: 3 },

  // ── Difficoltà 4 — vocabolario più ricco ──────────────────────────────────
  { id: "m030", parola: "clessidra", alias: [], dominio: "casa",
    definizione: "Strumento di vetro a due ampolle in cui la sabbia scorre per misurare il tempo.",
    distrattori: ["meridiana", "orologio", "cronometro"], difficolta: 4 },
  { id: "m031", parola: "fionda", alias: [], dominio: "casa",
    definizione: "Arma a forma di Y con un elastico, usata per lanciare sassi.",
    distrattori: ["balestra", "arco", "frusta"], difficolta: 4 },
  { id: "m032", parola: "stivale", alias: ["stivali"], dominio: "abbigliamento",
    definizione: "Calzatura alta che arriva fino al polpaccio o al ginocchio.",
    distrattori: ["scarpone", "sandalo", "ciabatta"], difficolta: 4 },
  { id: "m033", parola: "rastrello", alias: [], dominio: "mestiere",
    definizione: "Attrezzo con denti di ferro su un manico lungo, serve a radunare foglie e fieno.",
    distrattori: ["forcone", "zappa", "vanga"], difficolta: 4 },
  { id: "m034", parola: "fontana", alias: [], dominio: "natura",
    definizione: "Costruzione di pietra dalla quale sgorga acqua in una vasca.",
    distrattori: ["pozzo", "sorgente", "cisterna"], difficolta: 4 },
  { id: "m035", parola: "mantello", alias: [], dominio: "abbigliamento",
    definizione: "Lungo indumento senza maniche che si porta sulle spalle per ripararsi dal freddo.",
    distrattori: ["cappotto", "scialle", "tunica"], difficolta: 4 },
  { id: "m036", parola: "salice", alias: [], dominio: "natura",
    definizione: "Albero dai rami flessibili e penduli, cresce vicino ai corsi d'acqua.",
    distrattori: ["pioppo", "olmo", "frassino"], difficolta: 4 },

  // ── Difficoltà 5 ───────────────────────────────────────────────────────────
  { id: "m037", parola: "fienile", alias: [], dominio: "mestiere",
    definizione: "Locale rustico dove si conserva il fieno per gli animali.",
    distrattori: ["granaio", "stalla", "cascina"], difficolta: 5 },
  { id: "m038", parola: "mulino", alias: [], dominio: "mestiere",
    definizione: "Edificio con grandi pale o ruote che macina il grano in farina.",
    distrattori: ["frantoio", "forno", "torchio"], difficolta: 5 },
  { id: "m039", parola: "frantoio", alias: [], dominio: "mestiere",
    definizione: "Stabilimento dove si spremono le olive per ricavarne l'olio.",
    distrattori: ["mulino", "torchio", "cantina"], difficolta: 5 },
  { id: "m040", parola: "arnia", alias: ["alveare"], dominio: "natura",
    definizione: "Cassetta di legno che l'apicoltore usa per allevare le api.",
    distrattori: ["nido", "favo", "gabbia"], difficolta: 5 },
  { id: "m041", parola: "soffitta", alias: ["solaio"], dominio: "casa",
    definizione: "Stanza all'ultimo piano sotto il tetto, di solito usata come ripostiglio.",
    distrattori: ["cantina", "stanzino", "mansarda"], difficolta: 5 },
  { id: "m042", parola: "torchio", alias: [], dominio: "mestiere",
    definizione: "Macchina a vite che preme uva o olive per estrarne il succo.",
    distrattori: ["pressa", "tornio", "frantoio"], difficolta: 5 },
  { id: "m043", parola: "fucina", alias: [], dominio: "mestiere",
    definizione: "Bottega del fabbro dove si arroventa e si batte il ferro.",
    distrattori: ["officina", "forgia", "forno"], difficolta: 5 },

  // ── Difficoltà 6 ───────────────────────────────────────────────────────────
  { id: "m044", parola: "scalpello", alias: [], dominio: "mestiere",
    definizione: "Attrezzo con una lama tagliente, lo scultore lo colpisce col martello per lavorare la pietra.",
    distrattori: ["punteruolo", "raschietto", "bulino"], difficolta: 6 },
  { id: "m045", parola: "abbaino", alias: [], dominio: "casa",
    definizione: "Piccola finestra sporgente che si apre sulla falda del tetto.",
    distrattori: ["lucernario", "soffitta", "balcone"], difficolta: 6 },
  { id: "m046", parola: "cesello", alias: [], dominio: "mestiere",
    definizione: "Piccolo scalpello con cui l'orafo incide e decora i metalli preziosi.",
    distrattori: ["bulino", "stilo", "punzone"], difficolta: 6 },
  { id: "m047", parola: "alambicco", alias: [], dominio: "mestiere",
    definizione: "Apparecchio di vetro o rame usato un tempo per distillare i liquidi.",
    distrattori: ["crogiolo", "storta", "ampolla"], difficolta: 6 },
  { id: "m048", parola: "deschetto", alias: [], dominio: "mestiere",
    definizione: "Piccolo banco di lavoro basso, tipico del calzolaio che vi siede davanti.",
    distrattori: ["sgabello", "tavolino", "treppiede"], difficolta: 6 },
  { id: "m049", parola: "pergolato", alias: ["pergola"], dominio: "natura",
    definizione: "Struttura di legno coperta da una vite o da piante rampicanti, fa ombra in giardino.",
    distrattori: ["gazebo", "veranda", "porticato"], difficolta: 6 },
  { id: "m050", parola: "cantiere", alias: [], dominio: "mestiere",
    definizione: "Luogo all'aperto dove si costruisce o si ripara un edificio o una nave.",
    distrattori: ["officina", "deposito", "magazzino"], difficolta: 6 },

  // ── Difficoltà 7 ───────────────────────────────────────────────────────────
  { id: "m051", parola: "veliero", alias: [], dominio: "mestiere",
    definizione: "Grande nave a vele, in legno, che un tempo solcava gli oceani.",
    distrattori: ["galeone", "fregata", "brigantino"], difficolta: 7 },
  { id: "m052", parola: "ricamo", alias: [], dominio: "mestiere",
    definizione: "Arte di decorare una stoffa cucendovi disegni con ago e filo colorato.",
    distrattori: ["merletto", "trama", "tessitura"], difficolta: 7 },
  { id: "m053", parola: "argilla", alias: ["creta"], dominio: "mestiere",
    definizione: "Terra morbida e umida che il vasaio modella per fare ceramiche.",
    distrattori: ["sabbia", "gesso", "calce"], difficolta: 7 },
  { id: "m054", parola: "smalto", alias: [], dominio: "mestiere",
    definizione: "Vetro fuso colorato che si applica sulla ceramica per renderla lucida e impermeabile.",
    distrattori: ["vernice", "lacca", "patina"], difficolta: 7 },
  { id: "m055", parola: "tornio", alias: [], dominio: "mestiere",
    definizione: "Macchina rotante usata dal vasaio o dal falegname per modellare pezzi tondi.",
    distrattori: ["torchio", "fresa", "morsa"], difficolta: 7 },
  { id: "m056", parola: "merletto", alias: ["pizzo"], dominio: "mestiere",
    definizione: "Tessuto leggero e traforato con disegni a fiori, fatto a mano con ago o fuselli.",
    distrattori: ["ricamo", "trina", "tulle"], difficolta: 7 },

  // ── Difficoltà 8 — parole più rare, lessico letterario ────────────────────
  { id: "m057", parola: "rasoio", alias: [], dominio: "mestiere",
    definizione: "Lama affilatissima con manico, il barbiere la usa per radere la barba.",
    distrattori: ["coltello", "lametta", "stiletto"], difficolta: 8 },
  { id: "m058", parola: "abaco", alias: [], dominio: "astratto",
    definizione: "Antico strumento di calcolo formato da palline che scorrono su barrette.",
    distrattori: ["pallottoliere", "regolo", "compasso"], difficolta: 8 },
  { id: "m059", parola: "armadio", alias: [], dominio: "casa",
    definizione: "Mobile alto e chiuso, con ante, dove si ripongono vestiti e biancheria.",
    distrattori: ["cassettiera", "comò", "guardaroba"], difficolta: 8 },
  { id: "m060", parola: "edera", alias: [], dominio: "natura",
    definizione: "Pianta rampicante sempreverde che si arrampica sui muri con foglie a punta.",
    distrattori: ["vite", "vischio", "rampicante"], difficolta: 8 },
  { id: "m061", parola: "rondine", alias: [], dominio: "natura",
    definizione: "Uccello migratore dalla coda biforcuta che annuncia l'arrivo della primavera.",
    distrattori: ["passero", "merlo", "balestruccio"], difficolta: 8 },
  { id: "m062", parola: "frastuono", alias: [], dominio: "astratto",
    definizione: "Rumore forte, confuso e prolungato che dà fastidio all'orecchio.",
    distrattori: ["fragore", "baccano", "trambusto"], difficolta: 8 },

  // ── Difficoltà 9 — concetti astratti, parole colte ────────────────────────
  { id: "m063", parola: "nostalgia", alias: [], dominio: "astratto",
    definizione: "Sentimento di malinconia per qualcosa o qualcuno lontano nel tempo o nello spazio.",
    distrattori: ["rimpianto", "tristezza", "saudade"], difficolta: 9 },
  { id: "m064", parola: "alba", alias: [], dominio: "natura",
    definizione: "Momento del primo apparire del sole all'orizzonte, all'inizio del giorno.",
    distrattori: ["aurora", "tramonto", "crepuscolo"], difficolta: 9 },
  { id: "m065", parola: "eco", alias: [], dominio: "astratto",
    definizione: "Ripetizione di un suono che torna indietro dopo essere rimbalzato su una parete.",
    distrattori: ["risonanza", "riverbero", "rimbombo"], difficolta: 9 },
  { id: "m066", parola: "destino", alias: ["fato"], dominio: "astratto",
    definizione: "Forza misteriosa che si crede determini in anticipo gli avvenimenti della vita.",
    distrattori: ["sorte", "fortuna", "ventura"], difficolta: 9 },
  { id: "m067", parola: "silenzio", alias: [], dominio: "astratto",
    definizione: "Assenza completa di rumori e di voci.",
    distrattori: ["quiete", "calma", "pace"], difficolta: 9 },
  { id: "m068", parola: "saggezza", alias: [], dominio: "astratto",
    definizione: "Profonda conoscenza unita a buon senso, di solito frutto dell'esperienza.",
    distrattori: ["prudenza", "sapienza", "intelletto"], difficolta: 9 },
  { id: "m069", parola: "rugiada", alias: [], dominio: "natura",
    definizione: "Gocce d'acqua che si formano sull'erba e sulle foglie nelle prime ore del mattino.",
    distrattori: ["brina", "nebbia", "umidore"], difficolta: 9 },

  // ─────────────────────────────────────────────────────────────────────────
  // ─── Espansione corpus — riduzione ripetizioni ─────────────────────────
  // ─────────────────────────────────────────────────────────────────────────

  // ── Difficoltà 0 — oggetti comunissimi ────────────────────────────────────
  { id: "m070", parola: "libro", alias: [], dominio: "casa",
    definizione: "Oggetto fatto di tante pagine rilegate insieme, che si legge.",
    distrattori: ["giornale", "quaderno", "rivista"], difficolta: 0 },
  { id: "m071", parola: "letto", alias: [], dominio: "casa",
    definizione: "Mobile della camera su cui ci si distende per dormire.",
    distrattori: ["divano", "amaca", "branda"], difficolta: 0 },
  { id: "m072", parola: "finestra", alias: [], dominio: "casa",
    definizione: "Apertura nel muro con vetri, fa entrare luce e aria.",
    distrattori: ["porta", "balcone", "lucernario"], difficolta: 0 },
  { id: "m073", parola: "tazza", alias: [], dominio: "cucina",
    definizione: "Piccolo recipiente con un manico, si usa per bere il caffè o il latte.",
    distrattori: ["bicchiere", "scodella", "coppa"], difficolta: 0 },
  { id: "m074", parola: "fiore", alias: [], dominio: "natura",
    definizione: "Parte colorata e profumata di una pianta, sboccia in primavera.",
    distrattori: ["foglia", "frutto", "petalo"], difficolta: 0 },
  { id: "m075", parola: "sole", alias: [], dominio: "natura",
    definizione: "Stella che illumina e riscalda la Terra durante il giorno.",
    distrattori: ["luna", "stella", "fuoco"], difficolta: 0 },
  { id: "m076", parola: "luna", alias: [], dominio: "natura",
    definizione: "Astro che si vede di notte e illumina il cielo con luce argentea.",
    distrattori: ["sole", "stella", "pianeta"], difficolta: 0 },
  { id: "m077", parola: "mela", alias: [], dominio: "cucina",
    definizione: "Frutto tondo, rosso o verde, dolce e croccante, cresce sull'albero.",
    distrattori: ["pera", "pesca", "albicocca"], difficolta: 0 },
  { id: "m078", parola: "casa", alias: [], dominio: "casa",
    definizione: "Edificio in cui si abita e si vive con la propria famiglia.",
    distrattori: ["palazzo", "villa", "capanna"], difficolta: 0 },
  { id: "m079", parola: "porta", alias: [], dominio: "casa",
    definizione: "Apertura chiusa da un'anta, serve per entrare e uscire da una stanza.",
    distrattori: ["finestra", "cancello", "portone"], difficolta: 0 },
  { id: "m080", parola: "penna", alias: [], dominio: "casa",
    definizione: "Strumento sottile con cui si scrive su un foglio.",
    distrattori: ["matita", "pennarello", "pennino"], difficolta: 0 },
  { id: "m081", parola: "uovo", alias: [], dominio: "cucina",
    definizione: "Lo fanno le galline, ha il guscio bianco o marrone e dentro tuorlo e albume.",
    distrattori: ["pulcino", "guscio", "frittata"], difficolta: 0 },

  // ── Difficoltà 1 ──────────────────────────────────────────────────────────
  { id: "m082", parola: "tavolo", alias: [], dominio: "casa",
    definizione: "Mobile con un piano e quattro gambe, vi si appoggiano piatti o lavori.",
    distrattori: ["banco", "scrivania", "panca"], difficolta: 1 },
  { id: "m083", parola: "coltello", alias: [], dominio: "cucina",
    definizione: "Posata con lama affilata, serve per tagliare il cibo.",
    distrattori: ["forchetta", "cucchiaio", "lama"], difficolta: 1 },
  { id: "m084", parola: "cucchiaio", alias: [], dominio: "cucina",
    definizione: "Posata con piccola coppa concava, si usa per la minestra o lo zucchero.",
    distrattori: ["forchetta", "coltello", "mestolo"], difficolta: 1 },
  { id: "m085", parola: "valigia", alias: [], dominio: "casa",
    definizione: "Borsa rigida e capiente con manico, ci si mettono dentro i vestiti per il viaggio.",
    distrattori: ["zaino", "borsone", "baule"], difficolta: 1 },
  { id: "m086", parola: "cuscino", alias: [], dominio: "casa",
    definizione: "Sacchetto morbido pieno di piume o spugna, si mette sotto la testa per dormire.",
    distrattori: ["coperta", "materasso", "lenzuolo"], difficolta: 1 },
  { id: "m087", parola: "coperta", alias: [], dominio: "casa",
    definizione: "Telo spesso e caldo che si mette sul letto per ripararsi dal freddo.",
    distrattori: ["lenzuolo", "piumone", "scialle"], difficolta: 1 },
  { id: "m088", parola: "asciugamano", alias: [], dominio: "casa",
    definizione: "Telo di spugna con cui ci si asciuga dopo essersi lavati.",
    distrattori: ["accappatoio", "salvietta", "telo"], difficolta: 1 },
  { id: "m089", parola: "matita", alias: [], dominio: "casa",
    definizione: "Bastoncino di legno con dentro una mina di grafite, scrive e si cancella con la gomma.",
    distrattori: ["penna", "pennarello", "carboncino"], difficolta: 1 },
  { id: "m090", parola: "ombrellone", alias: [], dominio: "casa",
    definizione: "Grande ombrello che si pianta sulla spiaggia per ripararsi dal sole.",
    distrattori: ["tendone", "gazebo", "ombrello"], difficolta: 1 },
  { id: "m091", parola: "bicchiere", alias: [], dominio: "cucina",
    definizione: "Recipiente di vetro senza manico, si usa per bere acqua o vino.",
    distrattori: ["tazza", "coppa", "calice"], difficolta: 1 },

  // ── Difficoltà 2 ──────────────────────────────────────────────────────────
  { id: "m092", parola: "padella", alias: [], dominio: "cucina",
    definizione: "Recipiente basso e largo con un manico lungo, serve per friggere o saltare i cibi.",
    distrattori: ["pentola", "tegame", "casseruola"], difficolta: 2 },
  { id: "m093", parola: "brocca", alias: [], dominio: "cucina",
    definizione: "Vaso panciuto con un manico e un beccuccio, contiene acqua o vino da versare.",
    distrattori: ["caraffa", "anfora", "boccale"], difficolta: 2 },
  { id: "m094", parola: "secchio", alias: [], dominio: "casa",
    definizione: "Recipiente cilindrico con un manico ad arco, si usa per portare acqua.",
    distrattori: ["catino", "bacinella", "tinozza"], difficolta: 2 },
  { id: "m095", parola: "calice", alias: [], dominio: "cucina",
    definizione: "Bicchiere elegante a coppa con uno stelo lungo, si usa per il vino o lo spumante.",
    distrattori: ["bicchiere", "coppa", "boccale"], difficolta: 2 },
  { id: "m096", parola: "grembiule", alias: [], dominio: "abbigliamento",
    definizione: "Indumento che si lega in vita per non sporcarsi i vestiti mentre si cucina o si lavora.",
    distrattori: ["camice", "tunica", "vestaglia"], difficolta: 2 },
  { id: "m097", parola: "salvadanaio", alias: [], dominio: "casa",
    definizione: "Recipiente con una fessura in cima dove si infilano le monete per metterle da parte.",
    distrattori: ["forziere", "borsa", "cassetta"], difficolta: 2 },
  { id: "m098", parola: "scaffale", alias: [], dominio: "casa",
    definizione: "Mobile aperto a ripiani sovrapposti, si usa per riporre libri o oggetti.",
    distrattori: ["armadio", "credenza", "vetrinetta"], difficolta: 2 },
  { id: "m099", parola: "spilla", alias: [], dominio: "abbigliamento",
    definizione: "Piccolo gioiello con uno spillo dietro, si appunta sull'abito per ornamento.",
    distrattori: ["medaglia", "ciondolo", "anello"], difficolta: 2 },
  { id: "m100", parola: "cesto", alias: ["cestino"], dominio: "casa",
    definizione: "Recipiente intrecciato di vimini o paglia, si usa per portare frutta o panni.",
    distrattori: ["paniere", "borsa", "sporta"], difficolta: 2 },

  // ── Difficoltà 3 ──────────────────────────────────────────────────────────
  { id: "m101", parola: "zappa", alias: [], dominio: "mestiere",
    definizione: "Attrezzo con manico lungo e lama larga, serve per smuovere e lavorare la terra.",
    distrattori: ["vanga", "pala", "rastrello"], difficolta: 3 },
  { id: "m102", parola: "falce", alias: [], dominio: "mestiere",
    definizione: "Lama ricurva con manico, si usa per tagliare l'erba o il grano.",
    distrattori: ["forbice", "falcetto", "roncola"], difficolta: 3 },
  { id: "m103", parola: "bilancia", alias: [], dominio: "mestiere",
    definizione: "Strumento con due piatti o un quadrante, serve a misurare il peso delle cose.",
    distrattori: ["misura", "stadera", "metro"], difficolta: 3 },
  { id: "m104", parola: "francobollo", alias: [], dominio: "casa",
    definizione: "Piccolo quadratino colorato e dentellato che si incolla sulle lettere per spedirle.",
    distrattori: ["bollo", "etichetta", "sigillo"], difficolta: 3 },
  { id: "m105", parola: "righello", alias: [], dominio: "casa",
    definizione: "Strumento sottile e dritto con tacche numerate, serve a misurare e tracciare linee.",
    distrattori: ["squadra", "metro", "compasso"], difficolta: 3 },
  { id: "m106", parola: "compasso", alias: [], dominio: "mestiere",
    definizione: "Strumento a due gambe incernierate, si usa per disegnare cerchi.",
    distrattori: ["squadra", "goniometro", "righello"], difficolta: 3 },
  { id: "m107", parola: "tappeto", alias: [], dominio: "casa",
    definizione: "Stoffa spessa e decorata che si stende sul pavimento per ornarlo e riscaldarlo.",
    distrattori: ["arazzo", "stuoia", "moquette"], difficolta: 3 },
  { id: "m108", parola: "stuoia", alias: [], dominio: "casa",
    definizione: "Tappeto sottile fatto di paglia o vimini intrecciati.",
    distrattori: ["tappeto", "zerbino", "arazzo"], difficolta: 3 },
  { id: "m109", parola: "carbone", alias: [], dominio: "mestiere",
    definizione: "Pezzi neri di legna bruciata che si usano per accendere il fuoco o scaldare.",
    distrattori: ["cenere", "legna", "brace"], difficolta: 3 },

  // ── Difficoltà 4 ──────────────────────────────────────────────────────────
  { id: "m110", parola: "sciarpa", alias: [], dominio: "abbigliamento",
    definizione: "Lunga striscia di lana che si avvolge attorno al collo per ripararsi dal freddo.",
    distrattori: ["foulard", "scialle", "stola"], difficolta: 4 },
  { id: "m111", parola: "guanto", alias: [], dominio: "abbigliamento",
    definizione: "Indumento che copre la mano dita per dita, in lana o pelle.",
    distrattori: ["muffola", "manica", "mezzoguanto"], difficolta: 4 },
  { id: "m112", parola: "camino", alias: [], dominio: "casa",
    definizione: "Apertura nella parete con la canna fumaria, vi si accende il fuoco per riscaldarsi.",
    distrattori: ["focolare", "stufa", "braciere"], difficolta: 4 },
  { id: "m113", parola: "comodino", alias: [], dominio: "casa",
    definizione: "Mobiletto basso accanto al letto con cassetti, vi si appoggia la lampada o un libro.",
    distrattori: ["cassettone", "scrittoio", "armadietto"], difficolta: 4 },
  { id: "m114", parola: "ciabatta", alias: [], dominio: "abbigliamento",
    definizione: "Calzatura leggera e aperta sul tallone, si porta in casa.",
    distrattori: ["pantofola", "sandalo", "infradito"], difficolta: 4 },
  { id: "m115", parola: "paiolo", alias: [], dominio: "cucina",
    definizione: "Pentola di rame con manico ad arco, si appende sul fuoco per cuocere la polenta.",
    distrattori: ["calderone", "pentolone", "tegame"], difficolta: 4 },
  { id: "m116", parola: "pignatta", alias: [], dominio: "cucina",
    definizione: "Pentola di terracotta panciuta, si usa per cuocere lentamente i legumi.",
    distrattori: ["coccio", "tegame", "casseruola"], difficolta: 4 },
  { id: "m117", parola: "girasole", alias: [], dominio: "natura",
    definizione: "Grande fiore giallo con il centro scuro, segue il sole nel suo movimento.",
    distrattori: ["margherita", "tulipano", "papavero"], difficolta: 4 },
  { id: "m118", parola: "quercia", alias: [], dominio: "natura",
    definizione: "Grande albero dal tronco robusto, fa le ghiande e vive molti secoli.",
    distrattori: ["castagno", "faggio", "olmo"], difficolta: 4 },

  // ── Difficoltà 5 ──────────────────────────────────────────────────────────
  { id: "m119", parola: "bottega", alias: [], dominio: "mestiere",
    definizione: "Piccolo negozio dove un artigiano lavora e vende le proprie cose.",
    distrattori: ["negozio", "laboratorio", "emporio"], difficolta: 5 },
  { id: "m120", parola: "dispensa", alias: [], dominio: "casa",
    definizione: "Piccolo locale o armadio dove si conservano provviste e cibi.",
    distrattori: ["cantina", "credenza", "ripostiglio"], difficolta: 5 },
  { id: "m121", parola: "granaio", alias: [], dominio: "mestiere",
    definizione: "Locale o edificio dove i contadini conservano il grano dopo la mietitura.",
    distrattori: ["silos", "magazzino", "fienile"], difficolta: 5 },
  { id: "m122", parola: "stalla", alias: [], dominio: "mestiere",
    definizione: "Ricovero coperto dove vivono mucche, cavalli e altri animali da fattoria.",
    distrattori: ["fienile", "cascina", "ovile"], difficolta: 5 },
  { id: "m123", parola: "orto", alias: [], dominio: "natura",
    definizione: "Pezzo di terra coltivata vicino a casa dove si seminano verdure.",
    distrattori: ["frutteto", "giardino", "campo"], difficolta: 5 },
  { id: "m124", parola: "vigneto", alias: ["vigna"], dominio: "natura",
    definizione: "Terreno coltivato a viti, da cui si ricava l'uva per fare il vino.",
    distrattori: ["frutteto", "oliveto", "filare"], difficolta: 5 },
  { id: "m125", parola: "oliveto", alias: [], dominio: "natura",
    definizione: "Campo coltivato a ulivi, da cui si raccolgono le olive per l'olio.",
    distrattori: ["frutteto", "agrumeto", "vigneto"], difficolta: 5 },
  { id: "m126", parola: "frutteto", alias: [], dominio: "natura",
    definizione: "Terreno piantato ad alberi da frutta come meli, peri e ciliegi.",
    distrattori: ["orto", "giardino", "vivaio"], difficolta: 5 },
  { id: "m127", parola: "ovile", alias: [], dominio: "mestiere",
    definizione: "Recinto o ricovero in cui il pastore tiene le pecore.",
    distrattori: ["stalla", "gregge", "porcile"], difficolta: 5 },

  // ── Difficoltà 6 ──────────────────────────────────────────────────────────
  { id: "m128", parola: "pialla", alias: [], dominio: "mestiere",
    definizione: "Attrezzo del falegname con una lama, leviga le superfici di legno togliendo trucioli.",
    distrattori: ["sega", "lima", "raspa"], difficolta: 6 },
  { id: "m129", parola: "sega", alias: [], dominio: "mestiere",
    definizione: "Lama dentata con manico, serve a tagliare il legno o il metallo.",
    distrattori: ["accetta", "scure", "segaccio"], difficolta: 6 },
  { id: "m130", parola: "scure", alias: ["accetta"], dominio: "mestiere",
    definizione: "Lama pesante con manico lungo, si usa per abbattere alberi o spaccare legna.",
    distrattori: ["mazza", "piccone", "ascia"], difficolta: 6 },
  { id: "m131", parola: "punzone", alias: [], dominio: "mestiere",
    definizione: "Asta di acciaio appuntita che, colpita col martello, imprime un segno sul metallo.",
    distrattori: ["bulino", "stilo", "cesello"], difficolta: 6 },
  { id: "m132", parola: "raspa", alias: [], dominio: "mestiere",
    definizione: "Lima dai denti grossi e ruvidi, sgrossa il legno o la pietra.",
    distrattori: ["lima", "scalpello", "pialla"], difficolta: 6 },
  { id: "m133", parola: "ronchetta", alias: [], dominio: "mestiere",
    definizione: "Piccola lama ricurva con manico, il contadino la usa per potare e tagliare rami.",
    distrattori: ["falce", "falcetto", "roncola"], difficolta: 6 },
  { id: "m134", parola: "lucernario", alias: [], dominio: "casa",
    definizione: "Finestra orizzontale aperta sul tetto, fa entrare la luce dall'alto.",
    distrattori: ["abbaino", "veranda", "balcone"], difficolta: 6 },
  { id: "m135", parola: "veranda", alias: [], dominio: "casa",
    definizione: "Balcone o terrazza chiusa da vetrate, si affaccia su giardino o cortile.",
    distrattori: ["balcone", "loggia", "porticato"], difficolta: 6 },

  // ── Difficoltà 7 ──────────────────────────────────────────────────────────
  { id: "m136", parola: "vasaio", alias: [], dominio: "mestiere",
    definizione: "Artigiano che modella l'argilla al tornio per fare vasi, anfore e ciotole.",
    distrattori: ["ceramista", "scultore", "modellatore"], difficolta: 7 },
  { id: "m137", parola: "calzolaio", alias: [], dominio: "mestiere",
    definizione: "Artigiano che fa e ripara le scarpe.",
    distrattori: ["ciabattino", "sarto", "conciatore"], difficolta: 7 },
  { id: "m138", parola: "fabbro", alias: [], dominio: "mestiere",
    definizione: "Artigiano che lavora il ferro arroventato battendolo sull'incudine.",
    distrattori: ["maniscalco", "forgiatore", "calderaio"], difficolta: 7 },
  { id: "m139", parola: "mosaico", alias: [], dominio: "mestiere",
    definizione: "Decorazione fatta unendo piccoli pezzetti colorati di pietra o vetro per formare un disegno.",
    distrattori: ["affresco", "intarsio", "tassellato"], difficolta: 7 },
  { id: "m140", parola: "intarsio", alias: [], dominio: "mestiere",
    definizione: "Decorazione del legno o del marmo ottenuta incastonando pezzetti di colore diverso.",
    distrattori: ["mosaico", "tarsia", "rilievo"], difficolta: 7 },
  { id: "m141", parola: "stucco", alias: [], dominio: "mestiere",
    definizione: "Pasta morbida che, una volta indurita, decora soffitti e cornici con rilievi.",
    distrattori: ["malta", "gesso", "calce"], difficolta: 7 },
  { id: "m142", parola: "maiolica", alias: [], dominio: "mestiere",
    definizione: "Ceramica decorata e ricoperta da uno smalto bianco lucente, tipica di alcune città italiane.",
    distrattori: ["porcellana", "terracotta", "ceramica"], difficolta: 7 },
  { id: "m143", parola: "vimini", alias: [], dominio: "mestiere",
    definizione: "Rami sottili e flessibili che si intrecciano per fare cesti e sedie.",
    distrattori: ["paglia", "giunco", "rafia"], difficolta: 7 },

  // ── Difficoltà 8 ──────────────────────────────────────────────────────────
  { id: "m144", parola: "orafo", alias: [], dominio: "mestiere",
    definizione: "Artigiano che lavora l'oro e i metalli preziosi per farne gioielli.",
    distrattori: ["argentiere", "gioielliere", "cesellatore"], difficolta: 8 },
  { id: "m145", parola: "barbiere", alias: [], dominio: "mestiere",
    definizione: "Artigiano che taglia barba e capelli agli uomini nella sua bottega.",
    distrattori: ["parrucchiere", "tonsore", "rasore"], difficolta: 8 },
  { id: "m146", parola: "fornaio", alias: ["panettiere"], dominio: "mestiere",
    definizione: "Artigiano che impasta la farina e cuoce il pane nel forno.",
    distrattori: ["pasticcere", "mugnaio", "pizzaiolo"], difficolta: 8 },
  { id: "m147", parola: "mugnaio", alias: [], dominio: "mestiere",
    definizione: "Artigiano che lavora al mulino macinando il grano per ricavarne farina.",
    distrattori: ["fornaio", "contadino", "mietitore"], difficolta: 8 },
  { id: "m148", parola: "filigrana", alias: [], dominio: "mestiere",
    definizione: "Lavorazione finissima dell'oro o dell'argento a fili sottili intrecciati come merletto.",
    distrattori: ["smalto", "intaglio", "cesello"], difficolta: 8 },
  { id: "m149", parola: "alabastro", alias: [], dominio: "mestiere",
    definizione: "Pietra bianca e traslucida che gli scultori lavorano per farne lampade e statuette.",
    distrattori: ["marmo", "onice", "travertino"], difficolta: 8 },
  { id: "m150", parola: "tarsia", alias: [], dominio: "mestiere",
    definizione: "Intarsio fine di legni colorati che decora mobili antichi.",
    distrattori: ["intarsio", "mosaico", "intaglio"], difficolta: 8 },
  { id: "m151", parola: "balestruccio", alias: [], dominio: "natura",
    definizione: "Piccolo uccello migratore simile alla rondine, nidifica sotto i cornicioni.",
    distrattori: ["rondine", "passero", "merlo"], difficolta: 8 },

  // ── Difficoltà 9 ──────────────────────────────────────────────────────────
  { id: "m152", parola: "aurora", alias: [], dominio: "natura",
    definizione: "Luce rossastra che precede l'alba, prima che il sole appaia all'orizzonte.",
    distrattori: ["alba", "crepuscolo", "albore"], difficolta: 9 },
  { id: "m153", parola: "crepuscolo", alias: [], dominio: "natura",
    definizione: "Luce incerta che resta nel cielo subito dopo il tramonto del sole.",
    distrattori: ["tramonto", "imbrunire", "sera"], difficolta: 9 },
  { id: "m154", parola: "brina", alias: [], dominio: "natura",
    definizione: "Sottile strato di ghiaccio che la notte d'inverno si forma su erba e foglie.",
    distrattori: ["gelo", "rugiada", "ghiaccio"], difficolta: 9 },
  { id: "m155", parola: "brezza", alias: [], dominio: "natura",
    definizione: "Vento leggero e piacevole, specie quello che soffia dal mare.",
    distrattori: ["bora", "tramontana", "venticello"], difficolta: 9 },
  { id: "m156", parola: "speranza", alias: [], dominio: "astratto",
    definizione: "Sentimento di chi si aspetta fiducioso che qualcosa di buono accada.",
    distrattori: ["fiducia", "attesa", "illusione"], difficolta: 9 },
  { id: "m157", parola: "coraggio", alias: [], dominio: "astratto",
    definizione: "Forza d'animo che permette di affrontare il pericolo o la fatica senza tirarsi indietro.",
    distrattori: ["ardire", "audacia", "valore"], difficolta: 9 },
  { id: "m158", parola: "prudenza", alias: [], dominio: "astratto",
    definizione: "Virtù di chi sa valutare e agisce con cautela per evitare guai.",
    distrattori: ["cautela", "saggezza", "accortezza"], difficolta: 9 },
  { id: "m159", parola: "malinconia", alias: [], dominio: "astratto",
    definizione: "Tristezza dolce e vaga, spesso accompagnata da ricordi del passato.",
    distrattori: ["nostalgia", "tristezza", "afflizione"], difficolta: 9 },
  { id: "m160", parola: "quiete", alias: [], dominio: "astratto",
    definizione: "Stato di calma profonda, in cui tutto tace e nulla si muove.",
    distrattori: ["silenzio", "pace", "calma"], difficolta: 9 },
  { id: "m161", parola: "ventura", alias: [], dominio: "astratto",
    definizione: "Sorte fortunata o avventura che capita in modo imprevisto.",
    distrattori: ["sorte", "fortuna", "destino"], difficolta: 9 },
] as const;

/**
 * Normalizza una stringa di risposta libera:
 *   - trim, lowercase
 *   - rimuove accenti
 *   - rimuove articoli iniziali ("il", "lo", "la", "i", "gli", "le", "un",
 *     "uno", "una", "l'", "un'")
 *   - rimuove punteggiatura finale
 *   - collassa spazi multipli
 */
export function normalizzaRisposta(s: string): string {
  const senzaAccenti = s
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['‘’]/g, "'")
    .replace(/[.,;:!?]+$/g, "")
    .replace(/\s+/g, " ");
  const articolo = /^(il |lo |la |i |gli |le |un |uno |una |l'|un')/;
  return senzaAccenti.replace(articolo, "").trim();
}

/**
 * Verifica se la risposta utente coincide con la parola corretta o uno
 * dei suoi alias, ignorando accenti, articoli e maiuscole.
 */
export function rispostaCorretta(risposta: string, item: ItemMaestro): boolean {
  const r = normalizzaRisposta(risposta);
  if (!r) return false;
  if (r === normalizzaRisposta(item.parola)) return true;
  for (const a of item.alias) {
    if (r === normalizzaRisposta(a)) return true;
  }
  return false;
}

/**
 * Filtra il corpus per fascia di difficoltà.
 */
export function filtraCorpus(
  difficoltaMin: number,
  difficoltaMax: number,
): readonly ItemMaestro[] {
  return MAESTRO_CORPUS.filter(
    (it) => it.difficolta >= difficoltaMin && it.difficolta <= difficoltaMax,
  );
}
