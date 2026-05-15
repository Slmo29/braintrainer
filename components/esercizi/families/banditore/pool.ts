/**
 * Corpus oggetti per "Il Banditore" — categorizzazione semantica fine.
 *
 * Ogni item ha:
 *   - nome:      stringa mostrata sulla scheda del lotto (lowercase)
 *   - categorie: array ordinato per DOMINANZA. categorie[0] è la categoria
 *                "corretta" anche quando l'item è ambiguo.
 *
 * Le 12 sotto-categorie consentono ai livelli alti di chiedere
 * discriminazioni fini DENTRO la stessa macro (mammifero vs uccello vs
 * pesce vs insetto; frutta vs verdura vs fiore vs albero; utensile vs
 * arredo). Gli item ambigui appaiono solo dai lv 9-10 e portano una
 * seconda categoria che funziona da distrattore semantico naturale.
 */

import type { CategoriaId } from "./levels";

export interface ItemBanditore {
  id:        string;
  nome:      string;
  /** Categorie ordinate per dominanza. La prima è la "corretta". */
  categorie: readonly CategoriaId[];
}

export const CORPUS: readonly ItemBanditore[] = [
  // ── MAMMIFERI ────────────────────────────────────────────────────────────
  { id: "mam_gatto",      nome: "gatto",      categorie: ["mammifero"] },
  { id: "mam_cane",       nome: "cane",       categorie: ["mammifero"] },
  { id: "mam_mucca",      nome: "mucca",      categorie: ["mammifero"] },
  { id: "mam_cavallo",    nome: "cavallo",    categorie: ["mammifero"] },
  { id: "mam_coniglio",   nome: "coniglio",   categorie: ["mammifero"] },
  { id: "mam_capra",      nome: "capra",      categorie: ["mammifero"] },
  { id: "mam_asino",      nome: "asino",      categorie: ["mammifero"] },
  { id: "mam_volpe",      nome: "volpe",      categorie: ["mammifero"] },
  { id: "mam_cinghiale",  nome: "cinghiale",  categorie: ["mammifero"] },
  { id: "mam_lepre",      nome: "lepre",      categorie: ["mammifero"] },
  { id: "mam_scoiattolo", nome: "scoiattolo", categorie: ["mammifero"] },
  { id: "mam_riccio",     nome: "riccio",     categorie: ["mammifero"] },
  { id: "mam_lupo",       nome: "lupo",       categorie: ["mammifero"] },
  { id: "mam_orso",       nome: "orso",       categorie: ["mammifero"] },
  // Ambigui (lv 9-10): discriminazioni tassonomiche reali
  { id: "mam_delfino",     nome: "delfino",     categorie: ["mammifero", "pesce"] },
  { id: "mam_balena",      nome: "balena",      categorie: ["mammifero", "pesce"] },
  { id: "mam_pipistrello", nome: "pipistrello", categorie: ["mammifero", "uccello"] },

  // ── UCCELLI ──────────────────────────────────────────────────────────────
  { id: "ucc_civetta",  nome: "civetta",  categorie: ["uccello"] },
  { id: "ucc_fagiano",  nome: "fagiano",  categorie: ["uccello"] },
  { id: "ucc_rondine",  nome: "rondine",  categorie: ["uccello"] },
  { id: "ucc_gufo",     nome: "gufo",     categorie: ["uccello"] },
  { id: "ucc_gallina",  nome: "gallina",  categorie: ["uccello"] },
  { id: "ucc_anatra",   nome: "anatra",   categorie: ["uccello"] },
  { id: "ucc_gabbiano", nome: "gabbiano", categorie: ["uccello"] },
  { id: "ucc_falco",    nome: "falco",    categorie: ["uccello"] },
  { id: "ucc_aquila",   nome: "aquila",   categorie: ["uccello"] },
  { id: "ucc_passero",  nome: "passero",  categorie: ["uccello"] },
  { id: "ucc_picchio",  nome: "picchio",  categorie: ["uccello"] },
  { id: "ucc_corvo",    nome: "corvo",    categorie: ["uccello"] },

  // ── PESCI / ACQUATICI (categoria comune nel parlato italiano) ────────────
  { id: "pes_trota",    nome: "trota",    categorie: ["pesce"] },
  { id: "pes_salmone",  nome: "salmone",  categorie: ["pesce"] },
  { id: "pes_sardina",  nome: "sardina",  categorie: ["pesce"] },
  { id: "pes_tonno",    nome: "tonno",    categorie: ["pesce"] },
  { id: "pes_orata",    nome: "orata",    categorie: ["pesce"] },
  { id: "pes_branzino", nome: "branzino", categorie: ["pesce"] },
  { id: "pes_anguilla", nome: "anguilla", categorie: ["pesce"] },
  // Acquatici non-pesci ma di uso comune
  { id: "pes_polpo",    nome: "polpo",    categorie: ["pesce"] },
  { id: "pes_seppia",   nome: "seppia",   categorie: ["pesce"] },
  { id: "pes_granchio", nome: "granchio", categorie: ["pesce"] },
  { id: "pes_gambero",  nome: "gambero",  categorie: ["pesce"] },
  { id: "pes_calamaro", nome: "calamaro", categorie: ["pesce"] },

  // ── INSETTI ──────────────────────────────────────────────────────────────
  { id: "ins_ape",       nome: "ape",       categorie: ["insetto"] },
  { id: "ins_libellula", nome: "libellula", categorie: ["insetto"] },
  { id: "ins_formica",   nome: "formica",   categorie: ["insetto"] },
  { id: "ins_mosca",     nome: "mosca",     categorie: ["insetto"] },
  { id: "ins_farfalla",  nome: "farfalla",  categorie: ["insetto"] },
  { id: "ins_vespa",     nome: "vespa",     categorie: ["insetto"] },
  { id: "ins_zanzara",   nome: "zanzara",   categorie: ["insetto"] },
  { id: "ins_scarabeo",  nome: "scarabeo",  categorie: ["insetto"] },
  { id: "ins_grillo",    nome: "grillo",    categorie: ["insetto"] },
  { id: "ins_lucciola",  nome: "lucciola",  categorie: ["insetto"] },

  // ── FRUTTA ───────────────────────────────────────────────────────────────
  { id: "fru_mela",      nome: "mela",      categorie: ["frutta"] },
  { id: "fru_pera",      nome: "pera",      categorie: ["frutta"] },
  { id: "fru_uva",       nome: "uva",       categorie: ["frutta"] },
  { id: "fru_arancia",   nome: "arancia",   categorie: ["frutta"] },
  { id: "fru_limone",    nome: "limone",    categorie: ["frutta"] },
  { id: "fru_ciliegia",  nome: "ciliegia",  categorie: ["frutta"] },
  { id: "fru_albicocca", nome: "albicocca", categorie: ["frutta"] },
  { id: "fru_susina",    nome: "susina",    categorie: ["frutta"] },
  { id: "fru_cachi",     nome: "cachi",     categorie: ["frutta"] },
  { id: "fru_fico",      nome: "fico",      categorie: ["frutta"] },
  { id: "fru_nespola",   nome: "nespola",   categorie: ["frutta"] },
  { id: "fru_mora",      nome: "mora",      categorie: ["frutta"] },
  { id: "fru_mirtillo",  nome: "mirtillo",  categorie: ["frutta"] },
  { id: "fru_melone",    nome: "melone",    categorie: ["frutta"] },
  { id: "fru_kiwi",      nome: "kiwi",      categorie: ["frutta"] },
  // Ambigui (distrattori plausibili)
  { id: "fru_fragola",   nome: "fragola",   categorie: ["frutta", "fiore"] },
  { id: "fru_lampone",   nome: "lampone",   categorie: ["frutta", "fiore"] },

  // ── VERDURA (ortaggi e radici) ───────────────────────────────────────────
  { id: "ver_carota",     nome: "carota",     categorie: ["verdura"] },
  { id: "ver_patata",     nome: "patata",     categorie: ["verdura"] },
  { id: "ver_cipolla",    nome: "cipolla",    categorie: ["verdura"] },
  { id: "ver_radicchio",  nome: "radicchio",  categorie: ["verdura"] },
  { id: "ver_carciofo",   nome: "carciofo",   categorie: ["verdura"] },
  { id: "ver_finocchio",  nome: "finocchio",  categorie: ["verdura"] },
  { id: "ver_topinambur", nome: "topinambur", categorie: ["verdura"] },
  { id: "ver_rapa",       nome: "rapa",       categorie: ["verdura"] },
  { id: "ver_sedano",     nome: "sedano",     categorie: ["verdura"] },
  { id: "ver_asparago",   nome: "asparago",   categorie: ["verdura"] },
  { id: "ver_cardo",      nome: "cardo",      categorie: ["verdura"] },
  { id: "ver_bietola",    nome: "bietola",    categorie: ["verdura"] },
  { id: "ver_porro",      nome: "porro",      categorie: ["verdura"] },
  { id: "ver_lattuga",    nome: "lattuga",    categorie: ["verdura"] },
  { id: "ver_broccolo",   nome: "broccolo",   categorie: ["verdura"] },
  // Ambigui (botanicamente frutti, in cucina verdure)
  { id: "ver_pomodoro",   nome: "pomodoro",   categorie: ["verdura", "frutta"] },
  { id: "ver_zucchina",   nome: "zucchina",   categorie: ["verdura", "frutta"] },
  { id: "ver_cetriolo",   nome: "cetriolo",   categorie: ["verdura", "frutta"] },
  { id: "ver_melanzana",  nome: "melanzana",  categorie: ["verdura", "frutta"] },
  { id: "ver_peperone",   nome: "peperone",   categorie: ["verdura", "frutta"] },
  { id: "ver_zucca",      nome: "zucca",      categorie: ["verdura", "frutta"] },

  // ── FIORI (ornamentali) ──────────────────────────────────────────────────
  { id: "fio_rosa",        nome: "rosa",        categorie: ["fiore"] },
  { id: "fio_tulipano",    nome: "tulipano",    categorie: ["fiore"] },
  { id: "fio_girasole",    nome: "girasole",    categorie: ["fiore"] },
  { id: "fio_margherita",  nome: "margherita",  categorie: ["fiore"] },
  { id: "fio_camelia",     nome: "camelia",     categorie: ["fiore"] },
  { id: "fio_magnolia",    nome: "magnolia",    categorie: ["fiore"] },
  { id: "fio_giglio",      nome: "giglio",      categorie: ["fiore"] },
  { id: "fio_garofano",    nome: "garofano",    categorie: ["fiore"] },
  { id: "fio_orchidea",    nome: "orchidea",    categorie: ["fiore"] },
  { id: "fio_papavero",    nome: "papavero",    categorie: ["fiore"] },
  { id: "fio_iris",        nome: "iris",        categorie: ["fiore"] },
  { id: "fio_viola",       nome: "viola",       categorie: ["fiore"] },

  // ── ALBERI (e arbusti grandi) ────────────────────────────────────────────
  { id: "alb_quercia",     nome: "quercia",     categorie: ["albero"] },
  { id: "alb_pino",        nome: "pino",        categorie: ["albero"] },
  { id: "alb_palma",       nome: "palma",       categorie: ["albero"] },
  { id: "alb_cipresso",    nome: "cipresso",    categorie: ["albero"] },
  { id: "alb_olivo",       nome: "olivo",       categorie: ["albero", "frutta"] },
  { id: "alb_faggio",      nome: "faggio",      categorie: ["albero"] },
  { id: "alb_betulla",     nome: "betulla",     categorie: ["albero"] },
  { id: "alb_castagno",    nome: "castagno",    categorie: ["albero"] },
  { id: "alb_alloro",      nome: "alloro",      categorie: ["albero"] },
  { id: "alb_mirto",       nome: "mirto",       categorie: ["albero"] },
  { id: "alb_oleandro",    nome: "oleandro",    categorie: ["albero", "fiore"] },
  { id: "alb_biancospino", nome: "biancospino", categorie: ["albero"] },
  { id: "alb_ginestra",    nome: "ginestra",    categorie: ["albero", "fiore"] },

  // ── UTENSILI (strumenti d'uso) ───────────────────────────────────────────
  { id: "ute_martello",   nome: "martello",   categorie: ["utensile"] },
  { id: "ute_chiave",     nome: "chiave",     categorie: ["utensile"] },
  { id: "ute_forchetta",  nome: "forchetta",  categorie: ["utensile"] },
  { id: "ute_libro",      nome: "libro",      categorie: ["utensile"] },
  { id: "ute_calamaio",   nome: "calamaio",   categorie: ["utensile"] },
  { id: "ute_abaco",      nome: "abaco",      categorie: ["utensile"] },
  { id: "ute_sestante",   nome: "sestante",   categorie: ["utensile"] },
  { id: "ute_astrolabio", nome: "astrolabio", categorie: ["utensile"] },
  { id: "ute_monocolo",   nome: "monocolo",   categorie: ["utensile"] },
  { id: "ute_occhiali",   nome: "occhiali",   categorie: ["utensile"] },
  { id: "ute_orologio",   nome: "orologio",   categorie: ["utensile"] },
  { id: "ute_bilancia",   nome: "bilancia",   categorie: ["utensile"] },
  { id: "ute_falce",      nome: "falce",      categorie: ["utensile"] },
  { id: "ute_aratro",     nome: "aratro",     categorie: ["utensile"] },
  // Ambigui (utensile vs arredo, da disambiguare ai lv alti)
  { id: "ute_ventaglio",  nome: "ventaglio",  categorie: ["utensile", "arredo"] },

  // ── ARREDI (mobili e ornamenti da casa) ──────────────────────────────────
  { id: "arr_sedia",      nome: "sedia",      categorie: ["arredo"] },
  { id: "arr_candelabro", nome: "candelabro", categorie: ["arredo"] },
  { id: "arr_anfora",     nome: "anfora",     categorie: ["arredo"] },
  { id: "arr_specchio",   nome: "specchio",   categorie: ["arredo"] },
  { id: "arr_bauletto",   nome: "bauletto",   categorie: ["arredo"] },
  { id: "arr_lampada",    nome: "lampada",    categorie: ["arredo"] },
  { id: "arr_tappeto",    nome: "tappeto",    categorie: ["arredo"] },
  { id: "arr_cammeo",     nome: "cammeo",     categorie: ["arredo"] },
  { id: "arr_fonografo",  nome: "fonografo",  categorie: ["arredo"] },
  { id: "arr_lanterna",   nome: "lanterna",   categorie: ["arredo"] },
  { id: "arr_orcio",      nome: "orcio",      categorie: ["arredo"] },
  { id: "arr_armadio",    nome: "armadio",    categorie: ["arredo"] },
  { id: "arr_tavolo",     nome: "tavolo",     categorie: ["arredo"] },
  { id: "arr_divano",     nome: "divano",     categorie: ["arredo"] },

  // ── EDIFICI ──────────────────────────────────────────────────────────────
  { id: "edi_basilica",   nome: "basilica",   categorie: ["edificio"] },
  { id: "edi_loggia",     nome: "loggia",     categorie: ["edificio"] },
  { id: "edi_chiostro",   nome: "chiostro",   categorie: ["edificio"] },
  { id: "edi_anfiteatro", nome: "anfiteatro", categorie: ["edificio"] },
  { id: "edi_foro",       nome: "foro",       categorie: ["edificio"] },
  { id: "edi_acquedotto", nome: "acquedotto", categorie: ["edificio"] },
  { id: "edi_abbazia",    nome: "abbazia",    categorie: ["edificio"] },
  { id: "edi_monastero",  nome: "monastero",  categorie: ["edificio"] },
  { id: "edi_castello",   nome: "castello",   categorie: ["edificio"] },
  { id: "edi_palazzo",    nome: "palazzo",    categorie: ["edificio"] },
  { id: "edi_biblioteca", nome: "biblioteca", categorie: ["edificio"] },
  { id: "edi_dogana",     nome: "dogana",     categorie: ["edificio"] },
  { id: "edi_teatro",     nome: "teatro",     categorie: ["edificio"] },
  { id: "edi_torre",      nome: "torre",      categorie: ["edificio"] },
  { id: "edi_ponte",      nome: "ponte",      categorie: ["edificio"] },

  // ── PAESAGGI (luoghi naturali) ───────────────────────────────────────────
  { id: "pae_spiaggia",  nome: "spiaggia",  categorie: ["paesaggio"] },
  { id: "pae_montagna",  nome: "montagna",  categorie: ["paesaggio"] },
  { id: "pae_foresta",   nome: "foresta",   categorie: ["paesaggio"] },
  { id: "pae_deserto",   nome: "deserto",   categorie: ["paesaggio"] },
  { id: "pae_isola",     nome: "isola",     categorie: ["paesaggio"] },
  { id: "pae_fiume",     nome: "fiume",     categorie: ["paesaggio"] },
  { id: "pae_lago",      nome: "lago",      categorie: ["paesaggio"] },
  { id: "pae_vallata",   nome: "vallata",   categorie: ["paesaggio"] },
  { id: "pae_scogliera", nome: "scogliera", categorie: ["paesaggio"] },
  { id: "pae_collina",   nome: "collina",   categorie: ["paesaggio"] },
];

/**
 * Filtra il corpus per il livello corrente.
 *   - Tiene SOLO item la cui categoria dominante è attiva nel livello.
 *   - Se ammettiAmbigui è false, esclude item che hanno una seconda
 *     categoria anch'essa attiva (evita di forzare la dominante quando
 *     non è ancora stata introdotta dal warning).
 *   - Se ammettiAmbigui è true, include anche item ambigui: la categoria
 *     "corretta" resta sempre la dominante (categorie[0]).
 */
export function filtraCorpusPerLivello(
  categorieAttive: readonly CategoriaId[],
  ammettiAmbigui: boolean,
): ItemBanditore[] {
  const set = new Set(categorieAttive);
  return CORPUS.filter((it) => {
    if (!set.has(it.categorie[0])) return false;
    if (ammettiAmbigui) return true;
    const sec = it.categorie.slice(1).filter((c) => set.has(c));
    return sec.length === 0;
  });
}
