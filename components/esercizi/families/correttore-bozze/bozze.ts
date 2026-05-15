/**
 * Corpus bozze per "Il Correttore di Bozze".
 *
 * Ogni bozza è una frase con UNA parola sbagliata che il giocatore
 * deve identificare cliccandoci sopra.
 *
 * Tipi di errore:
 *   - "semantico":  parola inappropriata nel contesto
 *   - "sintattico": errore di concordanza, tempo verbale, preposizione
 *
 * Tokenizzazione: ogni bozza è già spezzettata per evitare ambiguità a
 * runtime con la punteggiatura. La parola sbagliata è marcata con [parola].
 *
 * NOTA: la frase del tutorial ("Il gatto abbaiò forte sul tetto") è
 * intenzionalmente assente dal corpus per evitare di vederla anche durante
 * la sessione vera.
 */

export type TipoErrore = "semantico" | "sintattico";

export interface TokenBozza {
  readonly testo:      string;
  readonly cliccabile: boolean;
  readonly isErrore:   boolean;
}

export interface ItemBozza {
  readonly id:         string;
  /** Difficoltà 0–9 (cfr. levels.ts difficoltaMin/Max). */
  readonly difficolta: number;
  readonly tipo:       TipoErrore;
  readonly tokens:     readonly TokenBozza[];
  /** Parola corretta (cosa avrebbe dovuto esserci al posto dell'errore). */
  readonly correzione: string;
}

// ── Helper di costruzione ────────────────────────────────────────────────────

function tok(template: string): readonly TokenBozza[] {
  const out: TokenBozza[] = [];
  const rx = /\[([^\]]+)\]|([A-Za-zÀ-ÿ']+)|([.,;:!?"«»])/g;
  let m: RegExpExecArray | null;
  while ((m = rx.exec(template)) !== null) {
    if (m[1])      out.push({ testo: m[1], cliccabile: true,  isErrore: true });
    else if (m[2]) out.push({ testo: m[2], cliccabile: true,  isErrore: false });
    else if (m[3]) out.push({ testo: m[3], cliccabile: false, isErrore: false });
  }
  return out;
}

// ── Corpus ───────────────────────────────────────────────────────────────────

export const CORPUS_BOZZE: readonly ItemBozza[] = [
  // ═══════════════════ Difficoltà 0–1: errori semantici palesi ═════════════
  // (la frase tutorial "il gatto abbaiò" è esclusa)

  { id: "b0_001", difficolta: 0, tipo: "semantico", correzione: "mare",
    tokens: tok("Il pesce nuota nel [cielo] limpido.") },
  { id: "b0_002", difficolta: 0, tipo: "semantico", correzione: "sera",
    tokens: tok("Il sole tramonta ogni [mattina] dietro le colline.") },
  { id: "b0_003", difficolta: 0, tipo: "semantico", correzione: "fiori",
    tokens: tok("In primavera sbocciano i [chiodi] nei giardini.") },
  { id: "b0_004", difficolta: 0, tipo: "semantico", correzione: "neve",
    tokens: tok("D'inverno la [sabbia] copre i tetti delle case.") },
  { id: "b0_005", difficolta: 0, tipo: "semantico", correzione: "ali",
    tokens: tok("Gli uccelli volano grazie alle loro [zampe] robuste.") },
  { id: "b0_006", difficolta: 0, tipo: "semantico", correzione: "denti",
    tokens: tok("Il dentista controlla con cura i miei [capelli] uno per uno.") },
  { id: "b0_007", difficolta: 0, tipo: "semantico", correzione: "fuoco",
    tokens: tok("Per scaldarci accendemmo un bel [ghiaccio] nel camino.") },
  { id: "b0_008", difficolta: 0, tipo: "semantico", correzione: "scarpe",
    tokens: tok("Prima di uscire mi misi le [forchette] nuove di pelle.") },
  { id: "b0_009", difficolta: 0, tipo: "semantico", correzione: "ruote",
    tokens: tok("L'automobile correva veloce sulle sue quattro [finestre].") },
  { id: "b0_010", difficolta: 0, tipo: "semantico", correzione: "acqua",
    tokens: tok("Avevo molta sete e bevvi un bicchiere di [farina] fresca.") },

  { id: "b1_001", difficolta: 1, tipo: "semantico", correzione: "latte",
    tokens: tok("La mucca produce [vino] nella stalla.") },
  { id: "b1_002", difficolta: 1, tipo: "semantico", correzione: "pane",
    tokens: tok("Il fornaio sforna ogni mattina il [ferro] caldo.") },
  { id: "b1_003", difficolta: 1, tipo: "semantico", correzione: "letto",
    tokens: tok("La nonna si addormentò presto sul [forno] in camera.") },
  { id: "b1_004", difficolta: 1, tipo: "semantico", correzione: "biblioteca",
    tokens: tok("Per studiare in silenzio andò in [discoteca] con i libri.") },
  { id: "b1_005", difficolta: 1, tipo: "semantico", correzione: "scrivere",
    tokens: tok("Usò la penna per [cucinare] una lunga lettera.") },
  { id: "b1_006", difficolta: 1, tipo: "semantico", correzione: "miele",
    tokens: tok("Le api operose producono il dolce [sale] nell'alveare.") },
  { id: "b1_007", difficolta: 1, tipo: "semantico", correzione: "guidare",
    tokens: tok("Mio nonno imparò a [camminare] l'automobile a vent'anni.") },
  { id: "b1_008", difficolta: 1, tipo: "semantico", correzione: "occhi",
    tokens: tok("Per leggere i giornali porto sempre gli occhiali sugli [orecchi].") },
  { id: "b1_009", difficolta: 1, tipo: "semantico", correzione: "vento",
    tokens: tok("La bandiera sventolava al [silenzio] di marzo.") },
  { id: "b1_010", difficolta: 1, tipo: "semantico", correzione: "calze",
    tokens: tok("D'inverno indossava sempre delle pesanti [mani] di lana.") },
  { id: "b1_011", difficolta: 1, tipo: "semantico", correzione: "ridere",
    tokens: tok("Quando sentì la barzelletta non poté fare a meno di [piangere].") },
  { id: "b1_012", difficolta: 1, tipo: "semantico", correzione: "dolce",
    tokens: tok("Lo zucchero ha un sapore intensamente [amaro].") },
  { id: "b1_013", difficolta: 1, tipo: "semantico", correzione: "estate",
    tokens: tok("Andiamo al mare ogni anno in piena [primavera] di agosto.") },
  { id: "b1_014", difficolta: 1, tipo: "semantico", correzione: "ascoltare",
    tokens: tok("Accese la radio per [guardare] le notizie del mattino.") },
  { id: "b1_015", difficolta: 1, tipo: "semantico", correzione: "calde",
    tokens: tok("Davanti al caminetto le sue mani diventarono finalmente [fredde].") },

  // ═══════════════════ Difficoltà 2–3: errori meno ovvi ════════════════════
  { id: "b2_001", difficolta: 2, tipo: "semantico", correzione: "bagnata",
    tokens: tok("Dopo la pioggia la strada era tutta [asciutta] e scivolosa.") },
  { id: "b2_002", difficolta: 2, tipo: "semantico", correzione: "cucinare",
    tokens: tok("Mia moglie prese il grembiule per [dormire] la cena.") },
  { id: "b2_003", difficolta: 2, tipo: "semantico", correzione: "ombrello",
    tokens: tok("Cominciò a piovere e aprii subito il [ventaglio].") },
  { id: "b2_004", difficolta: 2, tipo: "semantico", correzione: "freddo",
    tokens: tok("Quel mattino di gennaio faceva un gran [caldo] in piazza.") },
  { id: "b2_005", difficolta: 2, tipo: "semantico", correzione: "medico",
    tokens: tok("Si sentiva male e chiamò subito il [postino] di famiglia.") },
  { id: "b2_006", difficolta: 2, tipo: "semantico", correzione: "fioraio",
    tokens: tok("Per il suo anniversario corse subito dal [macellaio] a comprare delle rose.") },
  { id: "b2_007", difficolta: 2, tipo: "semantico", correzione: "salire",
    tokens: tok("Per arrivare in cima alla torre dovettero [scendere] duecento gradini.") },
  { id: "b2_008", difficolta: 2, tipo: "semantico", correzione: "innaffiare",
    tokens: tok("Ogni mattina prendeva la pompa per [bruciare] il giardino.") },
  { id: "b2_009", difficolta: 2, tipo: "semantico", correzione: "marinaio",
    tokens: tok("Suo figlio si arruolò giovanissimo come [contadino] nella marina militare.") },
  { id: "b2_010", difficolta: 2, tipo: "semantico", correzione: "pesce",
    tokens: tok("Sul mercato del porto si vendeva ogni mattina del [legno] freschissimo.") },
  { id: "b2_011", difficolta: 2, tipo: "semantico", correzione: "innamorato",
    tokens: tok("Da quando l'aveva conosciuta si sentiva profondamente [arrabbiato].") },
  { id: "b2_012", difficolta: 2, tipo: "semantico", correzione: "veloce",
    tokens: tok("La lepre attraversò il prato con un balzo incredibilmente [lento].") },
  { id: "b2_013", difficolta: 2, tipo: "semantico", correzione: "luna",
    tokens: tok("Quella notte il cielo era illuminato da una grande [pioggia] piena.") },
  { id: "b2_014", difficolta: 2, tipo: "semantico", correzione: "violino",
    tokens: tok("Da bambino suo padre gli regalò un piccolo [martello] da concerto.") },
  { id: "b2_015", difficolta: 2, tipo: "semantico", correzione: "pelliccia",
    tokens: tok("Per andare a teatro indossò la sua più elegante [scopa] di visone.") },

  { id: "b3_001", difficolta: 3, tipo: "semantico", correzione: "spegnere",
    tokens: tok("I pompieri arrivarono in fretta per [accendere] l'incendio.") },
  { id: "b3_002", difficolta: 3, tipo: "semantico", correzione: "tempesta",
    tokens: tok("Le onde altissime annunciavano l'arrivo di una grande [carezza].") },
  { id: "b3_003", difficolta: 3, tipo: "semantico", correzione: "applausi",
    tokens: tok("Al termine del concerto il pubblico riempì la sala di [fischi] entusiasti.") },
  { id: "b3_004", difficolta: 3, tipo: "semantico", correzione: "vendere",
    tokens: tok("Il fruttivendolo espose la cassetta per [regalare] le pesche mature.") },
  { id: "b3_005", difficolta: 3, tipo: "semantico", correzione: "tristezza",
    tokens: tok("Alla notizia della morte del cane provò una profonda [allegria].") },
  { id: "b3_006", difficolta: 3, tipo: "semantico", correzione: "fame",
    tokens: tok("Non mangiavano da tre giorni e avevano una [sete] terribile.") },
  { id: "b3_007", difficolta: 3, tipo: "semantico", correzione: "lavare",
    tokens: tok("Mise i panni nel catino per [stirare] le macchie più ostinate.") },
  { id: "b3_008", difficolta: 3, tipo: "semantico", correzione: "ringraziò",
    tokens: tok("Ricevuto il regalo, la bambina [insultò] educatamente la zia.") },
  { id: "b3_009", difficolta: 3, tipo: "semantico", correzione: "soldi",
    tokens: tok("Mise da parte tutti i suoi [sassi] per comprare la casa al mare.") },
  { id: "b3_010", difficolta: 3, tipo: "semantico", correzione: "carestia",
    tokens: tok("L'anno della grande siccità tutto il paese soffrì una terribile [abbondanza].") },
  { id: "b3_011", difficolta: 3, tipo: "semantico", correzione: "scolaro",
    tokens: tok("Il piccolo Giovanni era il più diligente [pensionato] della classe.") },
  { id: "b3_012", difficolta: 3, tipo: "semantico", correzione: "fragile",
    tokens: tok("Quella tazza di porcellana è molto antica e [robusta].") },
  { id: "b3_013", difficolta: 3, tipo: "semantico", correzione: "pulita",
    tokens: tok("La cameriera lasciò la stanza perfettamente [sporca] e profumata.") },
  { id: "b3_014", difficolta: 3, tipo: "semantico", correzione: "lacrime",
    tokens: tok("Alla fine del film le scendevano dagli occhi grosse [risate] di commozione.") },
  { id: "b3_015", difficolta: 3, tipo: "semantico", correzione: "atterrò",
    tokens: tok("Dopo un lungo volo l'aereo finalmente [decollò] all'aeroporto di Linate.") },
  { id: "b3_016", difficolta: 3, tipo: "semantico", correzione: "buio",
    tokens: tok("Nel cuore della notte la stanza era totalmente [luminosa].") },
  { id: "b3_017", difficolta: 3, tipo: "semantico", correzione: "diluvio",
    tokens: tok("Dopo settimane di siccità il cielo regalò un improvviso [sole] di mezzogiorno.") },
  { id: "b3_018", difficolta: 3, tipo: "semantico", correzione: "complimenti",
    tokens: tok("Per il bel discorso ricevette dai colleghi sinceri [rimproveri].") },

  // ═══════════════════ Difficoltà 4–5: frasi medie, errori sottili ═════════
  { id: "b4_001", difficolta: 4, tipo: "semantico", correzione: "diagnosi",
    tokens: tok("Dopo una lunga visita il medico formulò la sua [ricetta] preoccupata.") },
  { id: "b4_002", difficolta: 4, tipo: "semantico", correzione: "discorso",
    tokens: tok("Davanti alla folla il sindaco pronunciò un breve [racconto] di ringraziamento.") },
  { id: "b4_003", difficolta: 4, tipo: "semantico", correzione: "rumore",
    tokens: tok("Il martello pneumatico produceva un fastidioso [profumo] per tutta la via.") },
  { id: "b4_004", difficolta: 4, tipo: "semantico", correzione: "ferita",
    tokens: tok("Cadde dalla bicicletta e dalla gamba uscì una piccola [risata] di sangue.") },
  { id: "b4_005", difficolta: 4, tipo: "semantico", correzione: "spese",
    tokens: tok("Tornò dal mercato con il borsone pieno di pesanti [vincite].") },
  { id: "b4_006", difficolta: 4, tipo: "semantico", correzione: "rinunciare",
    tokens: tok("Dopo lunga meditazione decise di [accettare] al posto di consigliere.") },
  { id: "b4_007", difficolta: 4, tipo: "semantico", correzione: "tappeto",
    tokens: tok("Steso in salotto c'era un magnifico [vassoio] persiano antico.") },
  { id: "b4_008", difficolta: 4, tipo: "semantico", correzione: "pioggia",
    tokens: tok("Per tutta la settimana cadde sul paese un'ininterrotta [bonaccia] sottile.") },
  { id: "b4_009", difficolta: 4, tipo: "semantico", correzione: "smarrita",
    tokens: tok("Nella confusione della stazione la giovane sposa appariva del tutto [trovata].") },
  { id: "b4_010", difficolta: 4, tipo: "semantico", correzione: "vergogna",
    tokens: tok("Per l'errore commesso davanti a tutti provò una profonda [vanità].") },
  { id: "b4_011", difficolta: 4, tipo: "semantico", correzione: "scogliere",
    tokens: tok("Le barche pescherecce passavano vicine alle alte [pianure] della costa.") },
  { id: "b4_012", difficolta: 4, tipo: "semantico", correzione: "tradire",
    tokens: tok("Promise solennemente alla moglie di non [proteggere] mai la sua fiducia.") },
  { id: "b4_013", difficolta: 4, tipo: "semantico", correzione: "ferro",
    tokens: tok("Il fabbro batteva con forza sul [legno] ancora rovente dell'incudine.") },
  { id: "b4_014", difficolta: 4, tipo: "semantico", correzione: "vedovo",
    tokens: tok("Dopo la perdita della moglie rimase [scapolo] per molti anni.") },
  { id: "b4_015", difficolta: 4, tipo: "semantico", correzione: "vittoria",
    tokens: tok("La squadra azzurra festeggiò a lungo l'inattesa [sconfitta] del campionato.") },
  { id: "b4_016", difficolta: 4, tipo: "semantico", correzione: "tramonto",
    tokens: tok("Dalla terrazza si vedeva un meraviglioso [crepuscolo] alle sei del mattino.") },
  { id: "b4_017", difficolta: 4, tipo: "semantico", correzione: "raccolse",
    tokens: tok("Si chinò sulla soglia e [seminò] con cura le chiavi cadute.") },
  { id: "b4_018", difficolta: 4, tipo: "semantico", correzione: "modesto",
    tokens: tok("Nonostante i grandi successi era un uomo profondamente [vanitoso] e riservato.") },

  { id: "b5_001", difficolta: 5, tipo: "semantico", correzione: "ammirare",
    tokens: tok("Al museo i visitatori si fermarono a [riscaldare] il famoso quadro fiammingo.") },
  { id: "b5_002", difficolta: 5, tipo: "semantico", correzione: "promessa",
    tokens: tok("Mantenne con onore la [domanda] fatta al padre prima di partire.") },
  { id: "b5_003", difficolta: 5, tipo: "semantico", correzione: "ricordare",
    tokens: tok("Da vecchio amava [inventare] gli anni passati al fronte con i commilitoni.") },
  { id: "b5_004", difficolta: 5, tipo: "semantico", correzione: "argomento",
    tokens: tok("Il professore introdusse alla classe un nuovo [oggetto] di storia antica.") },
  { id: "b5_005", difficolta: 5, tipo: "semantico", correzione: "silenzio",
    tokens: tok("Dopo l'esplosione cadde sulla piazza un pesante [rumore] di stupore.") },
  { id: "b5_006", difficolta: 5, tipo: "semantico", correzione: "speranza",
    tokens: tok("Anche nei momenti più difficili non perse mai la sua [paura] nel futuro.") },
  { id: "b5_007", difficolta: 5, tipo: "semantico", correzione: "consolare",
    tokens: tok("La vecchia zia tentò invano di [insultare] la nipote disperata.") },
  { id: "b5_008", difficolta: 5, tipo: "semantico", correzione: "cammino",
    tokens: tok("Il pellegrino riprese all'alba il suo lungo [pranzo] verso Roma.") },
  { id: "b5_009", difficolta: 5, tipo: "semantico", correzione: "diluviare",
    tokens: tok("Le nuvole erano nere e tutti pensavano che stesse per [splendere] a lungo.") },
  { id: "b5_010", difficolta: 5, tipo: "semantico", correzione: "esperto",
    tokens: tok("Per quel lavoro delicato chiamarono un [principiante] di assoluta fiducia.") },
  { id: "b5_011", difficolta: 5, tipo: "semantico", correzione: "alfabeto",
    tokens: tok("La maestra insegnava ai bambini le ventuno lettere dell'[orologio] italiano.") },
  { id: "b5_012", difficolta: 5, tipo: "semantico", correzione: "matrimonio",
    tokens: tok("Tutti i parenti si riunirono per il sontuoso [funerale] della giovane sposa.") },
  { id: "b5_013", difficolta: 5, tipo: "semantico", correzione: "fortuna",
    tokens: tok("Vinse alla lotteria una somma enorme: una vera e propria [sfortuna] insperata.") },
  { id: "b5_014", difficolta: 5, tipo: "semantico", correzione: "freschezza",
    tokens: tok("Il vino bianco va servito tenendo conto della sua piacevole [stanchezza].") },
  { id: "b5_015", difficolta: 5, tipo: "semantico", correzione: "ringraziamento",
    tokens: tok("Si alzò in piedi e pronunciò un breve [insulto] per il dono ricevuto.") },
  { id: "b5_016", difficolta: 5, tipo: "semantico", correzione: "ricovero",
    tokens: tok("Dopo l'incidente il paziente ebbe bisogno di un lungo [licenziamento] in ospedale.") },
  { id: "b5_017", difficolta: 5, tipo: "semantico", correzione: "scolpita",
    tokens: tok("La statua di Michelangelo era stata [dipinta] da un solo blocco di marmo.") },
  { id: "b5_018", difficolta: 5, tipo: "semantico", correzione: "esultare",
    tokens: tok("Tutta la curva cominciò a [piangere] per il gol del campione.") },

  // ═══════════════════ Difficoltà 6: semantici sottili (parole vicine, falsi amici) ═════
  // L'errore è una parola "quasi" giusta: stesso campo semantico, ma collocazione
  // o significato preciso sbagliato. Niente antonimi banali.

  { id: "b6_001", difficolta: 6, tipo: "semantico", correzione: "sostenere",
    tokens: tok("Per uscire dalla povertà la famiglia dovette [sostentare] enormi sacrifici per molti anni.") },
  { id: "b6_002", difficolta: 6, tipo: "semantico", correzione: "evince",
    tokens: tok("Dalle parole del testimone si [evade] chiaramente la dinamica esatta dei fatti.") },
  { id: "b6_003", difficolta: 6, tipo: "semantico", correzione: "destituito",
    tokens: tok("Per la grave mancanza il vicepresidente fu [licenziato] dal proprio incarico nel consiglio direttivo.") },
  { id: "b6_004", difficolta: 6, tipo: "semantico", correzione: "esperire",
    tokens: tok("L'avvocato gli consigliò di [esprimere] tutte le vie legali prima di rivolgersi al tribunale.") },
  { id: "b6_005", difficolta: 6, tipo: "semantico", correzione: "comprovato",
    tokens: tok("Le indagini hanno [compreso] in modo definitivo la sua estraneità ai fatti contestati.") },
  { id: "b6_006", difficolta: 6, tipo: "semantico", correzione: "tributò",
    tokens: tok("Il pubblico [restituì] all'anziano direttore d'orchestra una lunghissima ovazione finale.") },
  { id: "b6_007", difficolta: 6, tipo: "semantico", correzione: "consultabili",
    tokens: tok("I documenti dell'archivio sono [esauribili] solo previo permesso scritto del soprintendente.") },
  { id: "b6_008", difficolta: 6, tipo: "semantico", correzione: "segna",
    tokens: tok("Quell'orologio antico [batte] sempre con dieci minuti di anticipo rispetto a quello del Comune.") },
  { id: "b6_009", difficolta: 6, tipo: "semantico", correzione: "ricostruì",
    tokens: tok("Lo storico [risalì] le origini della casata fino al Cinquecento toscano con grande precisione.") },
  { id: "b6_010", difficolta: 6, tipo: "semantico", correzione: "emise",
    tokens: tok("Dopo sei ore di camera di consiglio il giudice [erogò] la sentenza definitiva.") },
  { id: "b6_011", difficolta: 6, tipo: "semantico", correzione: "conformi",
    tokens: tok("I bilanci della società risultano pienamente [pertinenti] alle nuove direttive europee in materia.") },
  { id: "b6_012", difficolta: 6, tipo: "semantico", correzione: "annoverato",
    tokens: tok("Il giovane pittore va sicuramente [enumerato] tra i talenti più promettenti della sua generazione.") },

  // ═══════════════════ Difficoltà 7: semantici molto sottili ═══════════════
  // Differenze di registro, collocazione tecnica, sfumature di significato.

  { id: "b7_001", difficolta: 7, tipo: "semantico", correzione: "fonte",
    tokens: tok("Il giornalista non volle rivelare il nome della sua [fontana] interna al ministero.") },
  { id: "b7_002", difficolta: 7, tipo: "semantico", correzione: "perorò",
    tokens: tok("L'avvocato difensore [perpetrò] la propria causa con straordinaria abilità retorica.") },
  { id: "b7_003", difficolta: 7, tipo: "semantico", correzione: "conferì",
    tokens: tok("Il rettore [conferiva] in via riservata con i decani della facoltà di lettere.") },
  { id: "b7_004", difficolta: 7, tipo: "semantico", correzione: "esimere",
    tokens: tok("Il preside cercò invano di [esibire] il maestro dai turni di assistenza pomeridiani.") },
  { id: "b7_005", difficolta: 7, tipo: "semantico", correzione: "addurre",
    tokens: tok("Per giustificare il ritardo non riuscì a [dedurre] alcuna ragione convincente.") },
  { id: "b7_006", difficolta: 7, tipo: "semantico", correzione: "denotava",
    tokens: tok("La calligrafia minuta e precisa [connotava] un carattere meticoloso e riservato.") },
  { id: "b7_007", difficolta: 7, tipo: "semantico", correzione: "comminata",
    tokens: tok("La pena [conferita] all'imputato fu di dodici anni di reclusione effettiva.") },
  { id: "b7_008", difficolta: 7, tipo: "semantico", correzione: "ostativo",
    tokens: tok("La nuova normativa non rappresenta un fattore [obiettivo] alla concessione del permesso.") },
  { id: "b7_009", difficolta: 7, tipo: "semantico", correzione: "differire",
    tokens: tok("Il consiglio decise unanimemente di [deferire] la votazione alla seduta della prossima settimana.") },
  { id: "b7_010", difficolta: 7, tipo: "semantico", correzione: "delegato",
    tokens: tok("L'incarico di rappresentanza fu [demandato] dal sindaco a un consigliere di sua fiducia.") },
  { id: "b7_011", difficolta: 7, tipo: "semantico", correzione: "indurre",
    tokens: tok("Le sue continue allusioni miravano chiaramente a [istruire] il testimone in errore.") },
  { id: "b7_012", difficolta: 7, tipo: "semantico", correzione: "imputabile",
    tokens: tok("Il guasto è [imputato] a una negligenza commessa durante la manutenzione ordinaria.") },
  { id: "b7_013", difficolta: 7, tipo: "semantico", correzione: "remissivo",
    tokens: tok("Davanti ai superiori adottava sempre un atteggiamento [omissivo] e accondiscendente.") },
  { id: "b7_014", difficolta: 7, tipo: "semantico", correzione: "fugace",
    tokens: tok("Lo scrittore concesse alla cronista soltanto un'intervista [fugata] di pochi minuti.") },

  // ═══════════════════ Difficoltà 8: sintattici e semantici fini ═══════════
  // Sintattici: reggenza verbale, congiuntivo retto, concordanza a distanza.

  { id: "b8_001", difficolta: 8, tipo: "sintattico", correzione: "abituarsi",
    tokens: tok("I nuovi assunti dovettero [abituarsene] alla rigida disciplina imposta dal capoufficio.") },
  { id: "b8_002", difficolta: 8, tipo: "sintattico", correzione: "vada",
    tokens: tok("Bisogna assolutamente che lui [va] dal medico prima della fine della settimana.") },
  { id: "b8_003", difficolta: 8, tipo: "sintattico", correzione: "dato",
    tokens: tok("Il preside si rese conto che gli avevano [data] un'informazione del tutto inesatta.") },
  { id: "b8_004", difficolta: 8, tipo: "sintattico", correzione: "cui",
    tokens: tok("Il libro [che] ti ho parlato la settimana scorsa è finalmente disponibile in libreria.") },
  { id: "b8_005", difficolta: 8, tipo: "sintattico", correzione: "siano",
    tokens: tok("Sebbene le previsioni [sono] decisamente sfavorevoli, vuole comunque partire all'alba.") },
  { id: "b8_006", difficolta: 8, tipo: "sintattico", correzione: "venuti",
    tokens: tok("I tecnici della ditta sono [venuto] questa mattina presto per riparare il guasto della caldaia.") },
  { id: "b8_007", difficolta: 8, tipo: "semantico", correzione: "afferire",
    tokens: tok("Le competenze tecniche [aderiscono] esclusivamente all'ufficio del responsabile di settore.") },
  { id: "b8_008", difficolta: 8, tipo: "semantico", correzione: "ostinato",
    tokens: tok("Mostrò per tutta la trattativa un atteggiamento sorprendentemente [arrendevole] verso ogni richiesta.") },
  { id: "b8_009", difficolta: 8, tipo: "semantico", correzione: "ratificare",
    tokens: tok("Il parlamento si preparava a [revocare] solennemente il trattato firmato l'anno precedente.") },
  { id: "b8_010", difficolta: 8, tipo: "semantico", correzione: "annoverava",
    tokens: tok("Tra i suoi pochi amici stretti [enumerava] anche un noto giudice della corte d'appello.") },
  { id: "b8_011", difficolta: 8, tipo: "semantico", correzione: "trascurò",
    tokens: tok("Negli ultimi mesi della malattia [curò] completamente i propri affari, lasciandoli al figlio maggiore.") },
  { id: "b8_012", difficolta: 8, tipo: "semantico", correzione: "esimere",
    tokens: tok("Cercò inutilmente di [esonerare] il proprio assistente da ogni responsabilità formale.") },
  { id: "b8_013", difficolta: 8, tipo: "semantico", correzione: "ingerirsi",
    tokens: tok("Non è opportuno che il consiglio voglia [ingerire] negli affari interni della commissione.") },
  { id: "b8_014", difficolta: 8, tipo: "semantico", correzione: "esimente",
    tokens: tok("Il tribunale non riconobbe alcuna circostanza [esimia] in favore dell'imputato.") },

  // ═══════════════════ Difficoltà 9: errori fini, gli ultimi che sfuggono ═════
  // Consecutio temporum, congiuntivo non rispettato, sfumature lessicali.

  { id: "b9_001", difficolta: 9, tipo: "sintattico", correzione: "fossero",
    tokens: tok("Il maestro non sapeva con certezza se i ragazzi [erano] davvero pronti per la prova finale.") },
  { id: "b9_002", difficolta: 9, tipo: "sintattico", correzione: "avesse",
    tokens: tok("Tutti pensavano che il colonnello [aveva] mentito ai superiori durante il lungo interrogatorio.") },
  { id: "b9_003", difficolta: 9, tipo: "sintattico", correzione: "fosse",
    tokens: tok("Sembrava ormai certo che il documento più importante [era] andato perduto durante il trasloco.") },
  { id: "b9_004", difficolta: 9, tipo: "sintattico", correzione: "avrebbe",
    tokens: tok("Aveva promesso al padre che [avesse] terminato gli studi entro la primavera successiva.") },
  { id: "b9_005", difficolta: 9, tipo: "sintattico", correzione: "viste",
    tokens: tok("Quelle vecchie carte di famiglia, una volta [visto], non le dimenticò più per tutta la vita.") },
  { id: "b9_006", difficolta: 9, tipo: "sintattico", correzione: "fossi",
    tokens: tok("Se [ero] al tuo posto, accetterei senza esitazioni quella proposta inattesa.") },
  { id: "b9_007", difficolta: 9, tipo: "sintattico", correzione: "lette",
    tokens: tok("Le notizie più importanti del giornale, dopo averle [letto] tutte, vennero archiviate dal direttore.") },
  { id: "b9_008", difficolta: 9, tipo: "semantico", correzione: "tacita",
    tokens: tok("Tra i due vecchi colleghi esisteva ormai un'intesa [esplicita], mai messa per iscritto.") },
  { id: "b9_009", difficolta: 9, tipo: "semantico", correzione: "circostanziato",
    tokens: tok("Il funzionario presentò un rapporto [generico] e ricco di dati puntualmente verificabili.") },
  { id: "b9_010", difficolta: 9, tipo: "semantico", correzione: "lacunoso",
    tokens: tok("Il discorso del ministro risultò sorprendentemente [esauriente], lasciando molti dubbi in sospeso.") },
  { id: "b9_011", difficolta: 9, tipo: "semantico", correzione: "esitanti",
    tokens: tok("Davanti al magistrato i due testimoni rilasciarono dichiarazioni [risolute] e palesemente contraddittorie.") },
  { id: "b9_012", difficolta: 9, tipo: "semantico", correzione: "perentorio",
    tokens: tok("Il funzionario rispose con un tono [premuroso] che non ammetteva replica alcuna.") },
  { id: "b9_013", difficolta: 9, tipo: "semantico", correzione: "estromesso",
    tokens: tok("Per la sua condotta fu [estradato] dalla commissione disciplinare con voto unanime.") },
  { id: "b9_014", difficolta: 9, tipo: "semantico", correzione: "preterintenzionale",
    tokens: tok("Il magistrato derubricò l'accusa in omicidio [preventivo], data l'assenza di dolo specifico.") },
  { id: "b9_015", difficolta: 9, tipo: "semantico", correzione: "compunto",
    tokens: tok("Davanti al feretro mantenne per tutta la cerimonia un atteggiamento sobrio e [compatito].") },
  { id: "b9_016", difficolta: 9, tipo: "semantico", correzione: "elusivo",
    tokens: tok("A ogni domanda diretta rispondeva con un sorriso garbato ma [eluso].") },
];

// ── Selezione ────────────────────────────────────────────────────────────────

export function filtraCorpus(
  difficoltaMin: number,
  difficoltaMax: number,
  tipiAmmessi: readonly TipoErrore[],
): readonly ItemBozza[] {
  return CORPUS_BOZZE.filter(
    (b) =>
      b.difficolta >= difficoltaMin &&
      b.difficolta <= difficoltaMax &&
      tipiAmmessi.includes(b.tipo),
  );
}
