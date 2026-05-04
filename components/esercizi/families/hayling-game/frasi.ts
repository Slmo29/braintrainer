/**
 * components/esercizi/families/hayling-game/frasi.ts
 *
 * Pool di 40 frasi incomplete per Hayling Game.
 * Ogni frase ha una blacklist di completamenti semanticamente legati
 * (usata per validare la variante B — "rispondi con parola NON correlata").
 * Tutte le parole in blacklist sono in minuscolo e già normalizzate.
 */

export interface HaylingFrase {
  id:        string;
  frase:     string;      // frase con "___" al posto della parola mancante
  blacklist: string[];    // completamenti attesi o semanticamente vicini
}

export const HAYLING_FRASI: readonly HaylingFrase[] = [
  {
    id: "h01",
    frase: "Il cielo è di colore ___",
    blacklist: ["azzurro", "celeste", "blu", "grigio", "bianco", "rosa", "arancione", "nuvoloso", "sereno", "scuro"],
  },
  {
    id: "h02",
    frase: "La neve è di colore ___",
    blacklist: ["bianco", "bianca", "candida", "candido", "ghiaccio", "fredda", "freddo"],
  },
  {
    id: "h03",
    frase: "Il sole tramonta a ___",
    blacklist: ["ovest", "occidente", "sera", "ponente", "ovest", "tramonto", "orizzonte"],
  },
  {
    id: "h04",
    frase: "I bambini giocano nel ___",
    blacklist: ["parco", "giardino", "cortile", "prato", "campo", "bosco", "recreo"],
  },
  {
    id: "h05",
    frase: "La mamma legge un ___",
    blacklist: ["libro", "giornale", "romanzo", "magazine", "fumetto", "racconto", "testo", "articolo"],
  },
  {
    id: "h06",
    frase: "Il cane abbaia alla ___",
    blacklist: ["luna", "gatto", "porta", "notte", "persona", "ombra", "campana"],
  },
  {
    id: "h07",
    frase: "In estate si va al ___",
    blacklist: ["mare", "lago", "montagna", "bagno", "camping", "sole", "spiaggia", "lido"],
  },
  {
    id: "h08",
    frase: "Il medico visita i ___",
    blacklist: ["pazienti", "malati", "ammalati", "bambini", "anziani"],
  },
  {
    id: "h09",
    frase: "Il treno arriva in ___",
    blacklist: ["stazione", "ritardo", "anticipo", "orario", "banchina", "città", "binario"],
  },
  {
    id: "h10",
    frase: "I pesci vivono nell'___",
    blacklist: ["acqua", "mare", "oceano", "fiume", "lago", "vasca", "stagno"],
  },
  {
    id: "h11",
    frase: "Il pane si compra dal ___",
    blacklist: ["fornaio", "panettiere", "supermercato", "negozio", "forno", "alimentari"],
  },
  {
    id: "h12",
    frase: "Il gatto beve il ___",
    blacklist: ["latte", "acqua", "succo"],
  },
  {
    id: "h13",
    frase: "In inverno fa molto ___",
    blacklist: ["freddo", "buio", "gelo", "vento", "brutto", "grigio"],
  },
  {
    id: "h14",
    frase: "I fiori sbocciano in ___",
    blacklist: ["primavera", "estate", "marzo", "aprile", "maggio", "giugno"],
  },
  {
    id: "h15",
    frase: "La pizza si mangia con le ___",
    blacklist: ["mani", "forchetta", "coltello", "dita"],
  },
  {
    id: "h16",
    frase: "Il bambino gioca con i ___",
    blacklist: ["giocattoli", "amici", "pallone", "lego", "mattoncini", "puzzle"],
  },
  {
    id: "h17",
    frase: "La scuola inizia a ___",
    blacklist: ["settembre", "ottobre", "mattina", "otto", "nove", "ottobre"],
  },
  {
    id: "h18",
    frase: "Il sole sorge a ___",
    blacklist: ["est", "oriente", "mattina", "alba", "levante", "aurora"],
  },
  {
    id: "h19",
    frase: "Gli uccelli fanno il ___",
    blacklist: ["nido", "verso", "becco", "canto", "volo", "nido"],
  },
  {
    id: "h20",
    frase: "Il fuoco brucia la ___",
    blacklist: ["legna", "carta", "casa", "foresta", "candela", "fiamma", "legno"],
  },
  {
    id: "h21",
    frase: "La bottiglia è piena di ___",
    blacklist: ["acqua", "vino", "olio", "succo", "latte", "birra", "liquido", "aranciata"],
  },
  {
    id: "h22",
    frase: "Il falegname lavora il ___",
    blacklist: ["legno", "legname", "rovere", "pino", "tronco"],
  },
  {
    id: "h23",
    frase: "L'ape produce il ___",
    blacklist: ["miele", "veleno", "ronzio", "polline", "cera"],
  },
  {
    id: "h24",
    frase: "Il nonno racconta una ___",
    blacklist: ["storia", "favola", "fiaba", "storiella", "leggenda", "bugia", "barzelletta"],
  },
  {
    id: "h25",
    frase: "Il pittore dipinge con il ___",
    blacklist: ["pennello", "colore", "pennellino", "acquerello", "spatola"],
  },
  {
    id: "h26",
    frase: "La luna brilla di ___",
    blacklist: ["notte", "luce", "sera", "chiarore", "notti", "riflesso"],
  },
  {
    id: "h27",
    frase: "Il pesce nuota nel ___",
    blacklist: ["mare", "acqua", "fiume", "lago", "oceano", "stagno", "vasca"],
  },
  {
    id: "h28",
    frase: "Il cuoco prepara il ___",
    blacklist: ["pranzo", "cena", "cibo", "piatto", "pasto", "dolce", "sugo", "minestra"],
  },
  {
    id: "h29",
    frase: "La farfalla vola tra i ___",
    blacklist: ["fiori", "prati", "giardini", "petali", "alberi"],
  },
  {
    id: "h30",
    frase: "Il bambino sorride alla ___",
    blacklist: ["mamma", "madre", "nonna", "maestra", "fotocamera", "foto"],
  },
  {
    id: "h31",
    frase: "Lo sportivo corre ogni ___",
    blacklist: ["giorno", "mattina", "sera", "mattino", "giornata", "domenica"],
  },
  {
    id: "h32",
    frase: "Il cuore batte nel ___",
    blacklist: ["petto", "torace", "corpo", "sangue"],
  },
  {
    id: "h33",
    frase: "Il ladro è finito in ___",
    blacklist: ["prigione", "carcere", "galera", "manette", "guardia", "tribunale"],
  },
  {
    id: "h34",
    frase: "Senza occhiali non vedo ___",
    blacklist: ["bene", "niente", "nulla", "chiaro", "niente", "nulla"],
  },
  {
    id: "h35",
    frase: "Il dente mi fa ___",
    blacklist: ["male", "dolore", "molto", "malissimo"],
  },
  {
    id: "h36",
    frase: "La notte porta ___",
    blacklist: ["buio", "sonno", "stelle", "consiglio", "silenzio", "freddo"],
  },
  {
    id: "h37",
    frase: "Il bambino ha paura del ___",
    blacklist: ["buio", "mostro", "lupo", "temporale", "tuono", "fulmine", "cane"],
  },
  {
    id: "h38",
    frase: "Il meccanico ripara l'___",
    blacklist: ["auto", "automobile", "macchina", "motore", "moto", "bicicletta", "guasto"],
  },
  {
    id: "h39",
    frase: "Il musicista suona il ___",
    blacklist: ["pianoforte", "violino", "flauto", "tamburo", "piano", "sassofono", "clarinetto", "strumento"],
  },
  {
    id: "h40",
    frase: "La gallina fa le ___",
    blacklist: ["uova", "uovo", "pulcini", "coccodè"],
  },
];
