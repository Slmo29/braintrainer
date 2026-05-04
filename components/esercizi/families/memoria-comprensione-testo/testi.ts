/**
 * components/esercizi/families/memoria-comprensione-testo/testi.ts
 *
 * Pool di 20 testi narrativi italiani pre-generati con domande
 * fattuali e inferenziali (3 ciascuna, 4 opzioni).
 *
 * Band per nFrasi:
 *   3 frasi → lv 1-2  (nOpzioni 3 → idxCorr ≤ 2 per tutti)
 *   4 frasi → lv 3-5  (nOpzioni 3 → idxCorr ≤ 2 per tutti)
 *   5 frasi → lv 6-8  (nOpzioni 3 o 4 → idxCorr ≤ 2 per tutti)
 *   6 frasi → lv 9-10 (nOpzioni 4 → idxCorr 0-3)
 */

export interface MCTDomanda {
  testo:   string;
  opzioni: string[];  // 4 opzioni
  idxCorr: number;    // indice risposta corretta
}

export interface MCTesto {
  id:           string;
  nFrasi:       number;
  testo:        string;
  fattuale:     MCTDomanda[];
  inferenziale: MCTDomanda[];
}

export const MC_TESTI: readonly MCTesto[] = [

  // ── nFrasi = 3 (lv 1-2) ───────────────────────────────────────────────────

  {
    id: "mercato",
    nFrasi: 3,
    testo:
      "Maria va al mercato ogni martedì mattina. " +
      "Acquista verdure fresche e un mazzo di fiori gialli. " +
      "La fruttivendola le regala sempre una piccola mela come benvenuto.",
    fattuale: [
      {
        testo: "Quando va Maria al mercato?",
        opzioni: ["Ogni lunedì pomeriggio", "Ogni martedì mattina", "Ogni giovedì sera", "Ogni venerdì"],
        idxCorr: 1,
      },
      {
        testo: "Cosa compra Maria al mercato?",
        opzioni: ["Verdure fresche e fiori gialli", "Solo carne e salumi", "Pane e dolci", "Solo frutta"],
        idxCorr: 0,
      },
      {
        testo: "Cosa le regala la fruttivendola?",
        opzioni: ["Del formaggio fresco", "Un mazzo di fiori", "Una piccola mela", "Un sacchetto di frutta"],
        idxCorr: 2,
      },
    ],
    inferenziale: [
      {
        testo: "Che tipo di rapporto c'è tra Maria e la fruttivendola?",
        opzioni: ["Si conoscono bene e la fruttivendola è gentile con lei", "Non si conoscono affatto", "La fruttivendola è scortese", "Si incontrano solo a volte"],
        idxCorr: 0,
      },
      {
        testo: "Maria va al mercato spesso o raramente?",
        opzioni: ["Solo d'estate", "Raramente, quando ne ha bisogno", "Regolarmente ogni settimana", "Due volte al mese"],
        idxCorr: 2,
      },
      {
        testo: "Perché la fruttivendola regala sempre la mela a Maria?",
        opzioni: ["La mela è in scadenza", "Maria è una cliente abituale e fidata", "Lo fa con tutti i clienti", "Maria lo ha chiesto una volta"],
        idxCorr: 1,
      },
    ],
  },

  {
    id: "passeggiata",
    nFrasi: 3,
    testo:
      "Ogni sera dopo cena, Luigi fa una passeggiata nel parco vicino a casa. " +
      "Si ferma sempre sulla panchina accanto alla fontana. " +
      "Osserva i bambini giocare e respira l'aria fresca.",
    fattuale: [
      {
        testo: "Quando va Luigi a passeggiare?",
        opzioni: ["Al mattino presto", "Ogni sera dopo cena", "Il pomeriggio", "Solo la domenica"],
        idxCorr: 1,
      },
      {
        testo: "Dove si ferma Luigi durante la passeggiata?",
        opzioni: ["Al bar del parco", "Sulla panchina accanto alla fontana", "Davanti all'ingresso del parco", "Sotto un grande albero"],
        idxCorr: 1,
      },
      {
        testo: "Cosa osserva Luigi dalla panchina?",
        opzioni: ["I cani al guinzaglio", "I bambini giocare", "Le auto passare", "Gli uccelli sul laghetto"],
        idxCorr: 1,
      },
    ],
    inferenziale: [
      {
        testo: "Che tipo di abitudine è quella di Luigi?",
        opzioni: ["Saltuaria e irregolare", "Fissa e quotidiana", "Legata alle stagioni", "Solo nei giorni festivi"],
        idxCorr: 1,
      },
      {
        testo: "Come si sente probabilmente Luigi durante la passeggiata?",
        opzioni: ["Stanco e annoiato", "Sereno e rilassato", "Agitato e frettoloso", "Triste e solo"],
        idxCorr: 1,
      },
      {
        testo: "Perché Luigi sceglie sempre la stessa panchina?",
        opzioni: ["È vicina all'uscita del parco", "È sempre libera", "È il suo posto preferito", "È la più comoda del parco"],
        idxCorr: 2,
      },
    ],
  },

  {
    id: "telefonata",
    nFrasi: 3,
    testo:
      "Ogni domenica mattina, Rosa chiama sua figlia che vive a Milano. " +
      "La conversazione dura sempre almeno mezz'ora. " +
      "Si raccontano la settimana trascorsa e fanno programmi per l'estate.",
    fattuale: [
      {
        testo: "Quando chiama Rosa sua figlia?",
        opzioni: ["Ogni giovedì sera", "Ogni domenica mattina", "Ogni sabato pomeriggio", "Ogni lunedì"],
        idxCorr: 1,
      },
      {
        testo: "Quanto dura la telefonata?",
        opzioni: ["Dieci minuti", "Almeno mezz'ora", "Cinque minuti", "Esattamente un'ora"],
        idxCorr: 1,
      },
      {
        testo: "Di cosa parlano Rosa e sua figlia?",
        opzioni: ["Di notizie e politica", "Della settimana trascorsa e dei programmi estivi", "Di sport e attualità", "Di ricette di cucina"],
        idxCorr: 1,
      },
    ],
    inferenziale: [
      {
        testo: "Che tipo di rapporto hanno Rosa e sua figlia?",
        opzioni: ["Freddo e formale", "Affettuoso e costante", "Teso e difficile", "Distante e raro"],
        idxCorr: 1,
      },
      {
        testo: "Perché parlano anche di programmi per l'estate?",
        opzioni: ["Perché è la loro stagione preferita", "Perché si vedono raramente e vogliono pianificare un incontro", "Perché hanno già prenotato una vacanza", "Perché l'estate sta per iniziare"],
        idxCorr: 1,
      },
      {
        testo: "Cosa ci dice il fatto che la conversazione dura sempre mezz'ora?",
        opzioni: ["Parlano lentamente", "Hanno molto da dirsi e si vogliono bene", "La connessione è cattiva", "Non sanno come concludere la chiamata"],
        idxCorr: 1,
      },
    ],
  },

  {
    id: "caffe_bar",
    nFrasi: 3,
    testo:
      "Ogni mattina alle otto, Pietro entra al bar all'angolo e ordina un caffè e un cornetto alla marmellata. " +
      "Il barista lo conosce così bene che prepara l'ordinazione appena lo vede entrare. " +
      "Pietro chiacchiera un po' con gli altri clienti prima di andare al lavoro.",
    fattuale: [
      {
        testo: "A che ora va Pietro al bar?",
        opzioni: ["Alle sette", "Alle otto", "Alle nove", "Alle sei e mezza"],
        idxCorr: 1,
      },
      {
        testo: "Cosa ordina Pietro al bar?",
        opzioni: ["Cappuccino e brioche", "Caffè e cornetto alla marmellata", "Tè e biscotti", "Caffè e tramezzino"],
        idxCorr: 1,
      },
      {
        testo: "Cosa fa Pietro prima di andare al lavoro?",
        opzioni: ["Legge il giornale", "Chiacchiera con gli altri clienti", "Telefona a casa", "Fa una passeggiata"],
        idxCorr: 1,
      },
    ],
    inferenziale: [
      {
        testo: "Cosa si capisce dal fatto che il barista prepara l'ordinazione appena vede Pietro?",
        opzioni: ["Il bar è molto organizzato", "Pietro è un cliente abitudinario e conosciuto", "Il barista è molto veloce", "Pietro ha sempre fretta"],
        idxCorr: 1,
      },
      {
        testo: "Pietro va al bar solo o incontra persone?",
        opzioni: ["Va sempre da solo senza parlare con nessuno", "Incontra altri clienti con cui socializza", "Va con un amico fisso ogni giorno", "Va con sua moglie"],
        idxCorr: 1,
      },
      {
        testo: "Che tipo di persona sembra essere Pietro?",
        opzioni: ["Timido e solitario", "Socievole e abitudinario", "Frettoloso e scostante", "Indeciso e nervoso"],
        idxCorr: 1,
      },
    ],
  },

  {
    id: "gatto_micio",
    nFrasi: 3,
    testo:
      "Il gatto di Paolo si chiama Micio ed è arancione con gli occhi verdi. " +
      "Ogni mattina aspetta sulla soglia che Paolo gli porti la ciotola del latte. " +
      "Quando Paolo è in ritardo, Micio miagola forte per farlo svegliare.",
    fattuale: [
      {
        testo: "Come si chiama il gatto di Paolo?",
        opzioni: ["Birillo", "Micio", "Tigre", "Fufi"],
        idxCorr: 1,
      },
      {
        testo: "Di che colore è il gatto?",
        opzioni: ["Grigio con occhi gialli", "Arancione con occhi verdi", "Nero con occhi azzurri", "Bianco con occhi marroni"],
        idxCorr: 1,
      },
      {
        testo: "Cosa fa Micio quando Paolo è in ritardo?",
        opzioni: ["Si nasconde sotto il letto", "Miagola forte", "Gratta alla porta", "Va a dormire"],
        idxCorr: 1,
      },
    ],
    inferenziale: [
      {
        testo: "Che tipo di rapporto c'è tra Paolo e Micio?",
        opzioni: ["Un rapporto di abitudine e affetto reciproco", "Paolo dimentica spesso di nutrire il gatto", "Micio è selvaggio e indipendente", "Paolo vorrebbe liberarsi del gatto"],
        idxCorr: 0,
      },
      {
        testo: "Perché Micio miagola quando Paolo è in ritardo?",
        opzioni: ["Vuole giocare", "Ha fame e aspetta il latte", "Ha paura di qualcosa", "Sente dei rumori strani"],
        idxCorr: 1,
      },
      {
        testo: "Cosa fa capire che Micio ha imparato la routine di Paolo?",
        opzioni: ["Dorme molto durante il giorno", "Aspetta ogni mattina con puntualità sulla soglia", "Preferisce stare fuori casa", "Miagola solo di notte"],
        idxCorr: 1,
      },
    ],
  },

  // ── nFrasi = 4 (lv 3-5) ───────────────────────────────────────────────────

  {
    id: "torta_domenica",
    nFrasi: 4,
    testo:
      "Ogni domenica mattina, la nonna Giulia prepara una torta di mele per tutta la famiglia. " +
      "Usa sempre la stessa ricetta scritta a mano da sua madre tanti anni fa. " +
      "Il profumo della torta si sente da tutto il piano di scale. " +
      "I nipoti arrivano sempre di corsa quando sentono quell'odore.",
    fattuale: [
      {
        testo: "Quando prepara la torta nonna Giulia?",
        opzioni: ["Il sabato sera", "Ogni domenica mattina", "Durante la settimana", "Solo a Natale"],
        idxCorr: 1,
      },
      {
        testo: "Da dove viene la ricetta della torta?",
        opzioni: ["Da un libro di cucina", "Scritta a mano da sua madre", "Da internet", "Dal pasticciere del paese"],
        idxCorr: 1,
      },
      {
        testo: "Chi arriva di corsa quando sente l'odore della torta?",
        opzioni: ["I vicini di casa", "I nipoti", "Il marito", "Le amiche di Giulia"],
        idxCorr: 1,
      },
    ],
    inferenziale: [
      {
        testo: "Perché nonna Giulia usa sempre la stessa ricetta scritta a mano?",
        opzioni: ["Non sa usare i libri moderni", "Tiene alla tradizione di famiglia", "È l'unica ricetta che conosce", "Quella ricetta è la più semplice"],
        idxCorr: 1,
      },
      {
        testo: "Cosa si capisce dal fatto che i nipoti arrivano di corsa?",
        opzioni: ["Hanno sempre molta fame", "Adorano la torta della nonna e la aspettano", "Hanno sentito un rumore strano", "Sono venuti per un'altra ragione"],
        idxCorr: 1,
      },
      {
        testo: "Che valore ha questa torta domenicale per la famiglia?",
        opzioni: ["È solo un dolce settimanale", "È un momento di unione e tradizione familiare", "È importante perché costa poco", "È l'unico dolce che sanno preparare"],
        idxCorr: 1,
      },
    ],
  },

  {
    id: "treno_pendolare",
    nFrasi: 4,
    testo:
      "Carlo prende il treno ogni mattina per andare in ufficio nella città vicina. " +
      "Parte sempre dal terzo binario alle sette e venti. " +
      "Sul treno legge il giornale e a volte si addormenta. " +
      "La sera torna con l'ultimo treno delle sei e cinque.",
    fattuale: [
      {
        testo: "Perché Carlo prende il treno?",
        opzioni: ["Per andare a trovare la famiglia", "Per andare in ufficio", "Per fare una gita", "Per motivi di salute"],
        idxCorr: 1,
      },
      {
        testo: "Da quale binario parte Carlo?",
        opzioni: ["Dal primo", "Dal secondo", "Dal terzo", "Dal quarto"],
        idxCorr: 2,
      },
      {
        testo: "Cosa fa Carlo sul treno la mattina?",
        opzioni: ["Guarda fuori dal finestrino", "Legge il giornale e a volte si addormenta", "Telefona ai colleghi", "Lavora al computer"],
        idxCorr: 1,
      },
    ],
    inferenziale: [
      {
        testo: "Carlo vive nella stessa città dove lavora?",
        opzioni: ["Sì, a pochi passi dall'ufficio", "No, lavora in una città vicina diversa da quella in cui abita", "Sì, ma preferisce il treno all'auto", "Non è possibile saperlo dal testo"],
        idxCorr: 1,
      },
      {
        testo: "Perché Carlo a volte si addormenta sul treno?",
        opzioni: ["Il viaggio è regolare e un po' monotono", "Ha lavorato tutta la notte", "Il treno fa molto rumore", "Ha mangiato troppo"],
        idxCorr: 0,
      },
      {
        testo: "Come si potrebbe descrivere lo stile di vita di Carlo?",
        opzioni: ["Molto variato e imprevedibile", "Regolare e da pendolare", "Irregolare con orari diversi ogni giorno", "Libero senza obblighi fissi"],
        idxCorr: 1,
      },
    ],
  },

  {
    id: "orto_giuseppe",
    nFrasi: 4,
    testo:
      "Giuseppe coltiva un piccolo orto dietro casa da quando è andato in pensione. " +
      "Ogni mattina lo annaffia e controlla che le piante stiano bene. " +
      "Quest'anno ha piantato pomodori, zucchine e basilico. " +
      "Porta sempre un po' di verdura ai vicini quando il raccolto è abbondante.",
    fattuale: [
      {
        testo: "Da quando coltiva l'orto Giuseppe?",
        opzioni: ["Da sempre, sin da bambino", "Da quando è andato in pensione", "Da cinque anni esatti", "Da quando si è trasferito in quella casa"],
        idxCorr: 1,
      },
      {
        testo: "Cosa ha piantato Giuseppe quest'anno?",
        opzioni: ["Insalata, carote e prezzemolo", "Pomodori, zucchine e basilico", "Fagioli, piselli e menta", "Patate, cipolle e rosmarino"],
        idxCorr: 1,
      },
      {
        testo: "Cosa fa Giuseppe con la verdura in abbondanza?",
        opzioni: ["La vende al mercato", "La porta ai vicini", "La conserva per l'inverno", "La lascia nell'orto"],
        idxCorr: 1,
      },
    ],
    inferenziale: [
      {
        testo: "Come ha cambiato la pensione la vita di Giuseppe?",
        opzioni: ["Gli ha dato tempo per dedicarsi a una passione come il giardinaggio", "Non ha cambiato niente nella sua routine", "Lo ha reso più triste e inattivo", "Lo ha portato a viaggiare molto"],
        idxCorr: 0,
      },
      {
        testo: "Che tipo di persona è Giuseppe, in base ai suoi comportamenti?",
        opzioni: ["Egoista e avaro", "Generoso e premuroso verso gli altri", "Disinteressato e trascurato", "Timido e solitario"],
        idxCorr: 1,
      },
      {
        testo: "Perché Giuseppe porta la verdura ai vicini?",
        opzioni: ["Per vendergliela a poco prezzo", "Perché ne produce più di quanta ne consuma", "Perché i vicini glielo hanno chiesto esplicitamente", "Perché non gli piace la verdura"],
        idxCorr: 1,
      },
    ],
  },

  {
    id: "biblioteca_paese",
    nFrasi: 4,
    testo:
      "La biblioteca del paese è aperta dal martedì al sabato, dalle nove alle diciassette. " +
      "Ogni settimana arrivano nuovi libri che la bibliotecaria Carla mette in ordine sugli scaffali. " +
      "Molti anziani del paese la frequentano per leggere i giornali in silenzio. " +
      "C'è anche un angolo speciale per i bambini con libri illustrati colorati.",
    fattuale: [
      {
        testo: "Quando è aperta la biblioteca?",
        opzioni: ["Tutti i giorni tranne la domenica", "Dal martedì al sabato", "Solo lunedì e venerdì", "Dal lunedì al venerdì"],
        idxCorr: 1,
      },
      {
        testo: "Cosa fa Carla quando arrivano nuovi libri?",
        opzioni: ["Li mette in una scatola", "Li mette in ordine sugli scaffali", "Li consegna ai lettori", "Li registra al computer"],
        idxCorr: 1,
      },
      {
        testo: "Cosa c'è nell'angolo speciale per i bambini?",
        opzioni: ["Giochi e puzzle", "Libri illustrati colorati", "Computer e tablet", "Audiovisivi e film"],
        idxCorr: 1,
      },
    ],
    inferenziale: [
      {
        testo: "Perché molti anziani vanno in biblioteca a leggere i giornali?",
        opzioni: ["La biblioteca li distribuisce gratuitamente", "È un posto tranquillo dove trascorrere il tempo", "È l'unico posto con i giornali in paese", "Vi incontrano i loro amici"],
        idxCorr: 1,
      },
      {
        testo: "Come si capisce che la biblioteca è un luogo per tutte le età?",
        opzioni: ["Ha orari molto lunghi", "Offre servizi sia per anziani che per bambini", "Ha molto personale a disposizione", "È aperta anche la domenica"],
        idxCorr: 1,
      },
      {
        testo: "Cosa mostra che la biblioteca è ben gestita?",
        opzioni: ["È aperta molte ore al giorno", "I libri vengono aggiornati ogni settimana e tenuti in ordine", "Ha molti spazi diversi al suo interno", "Ci lavorano molte persone"],
        idxCorr: 1,
      },
    ],
  },

  {
    id: "temporale_luglio",
    nFrasi: 4,
    testo:
      "Un pomeriggio di luglio il cielo si è improvvisamente coperto di nuvole scure. " +
      "Silvia stava lavorando in giardino quando le prime gocce hanno cominciato a cadere. " +
      "Ha fatto appena in tempo a portare dentro i cuscini delle sedie prima che scoppiasse il temporale. " +
      "La pioggia è durata tutta la notte e ha rinfrescato l'aria.",
    fattuale: [
      {
        testo: "In quale mese è ambientata la storia?",
        opzioni: ["In giugno", "In luglio", "In agosto", "In settembre"],
        idxCorr: 1,
      },
      {
        testo: "Cosa stava facendo Silvia quando ha cominciato a piovere?",
        opzioni: ["Leggeva sul balcone", "Lavorava in giardino", "Dormiva nel pomeriggio", "Cucinava in cucina"],
        idxCorr: 1,
      },
      {
        testo: "Quanto è durata la pioggia?",
        opzioni: ["Qualche ora", "Tutto il pomeriggio", "Tutta la notte", "Due giorni"],
        idxCorr: 2,
      },
    ],
    inferenziale: [
      {
        testo: "Perché Silvia ha appena fatto in tempo a salvare i cuscini?",
        opzioni: ["Era distratta e non aveva sentito le prime gocce", "Il temporale è arrivato molto velocemente", "I cuscini erano molto pesanti e difficili da spostare", "Non aveva visto le nuvole in cielo"],
        idxCorr: 1,
      },
      {
        testo: "L'estate di quell'anno era calda?",
        opzioni: ["No, era una stagione fresca", "Sì, perché la pioggia ha dovuto 'rinfrescare' l'aria", "Non è possibile saperlo dal testo", "Sì, ma solo nel mese di giugno"],
        idxCorr: 1,
      },
      {
        testo: "Perché Silvia ha portato dentro i cuscini?",
        opzioni: ["Per lavarli", "Per non farli bagnare dalla pioggia", "Perché aveva finito di lavorare", "Perché qualcuno gliel'aveva chiesto"],
        idxCorr: 1,
      },
    ],
  },

  // ── nFrasi = 5 (lv 6-8) ───────────────────────────────────────────────────

  {
    id: "visita_medico",
    nFrasi: 5,
    testo:
      "Stamattina Giovanni è andato dal medico per una visita di controllo. " +
      "Ha aspettato quasi un'ora in sala d'attesa leggendo una vecchia rivista. " +
      "Il dottore lo ha visitato e gli ha detto che stava bene. " +
      "Gli ha però consigliato di camminare almeno mezz'ora al giorno. " +
      "Giovanni è uscito dall'ambulatorio sollevato e soddisfatto.",
    fattuale: [
      {
        testo: "Perché Giovanni è andato dal medico?",
        opzioni: ["Aveva un forte dolore alla schiena", "Per una visita di controllo", "Per ritirare una ricetta", "Per un problema urgente"],
        idxCorr: 1,
      },
      {
        testo: "Quanto ha aspettato Giovanni in sala d'attesa?",
        opzioni: ["Dieci minuti", "Mezz'ora", "Quasi un'ora", "Più di due ore"],
        idxCorr: 2,
      },
      {
        testo: "Cosa gli ha consigliato il dottore?",
        opzioni: ["Di riposarsi di più", "Di camminare almeno mezz'ora al giorno", "Di seguire una dieta specifica", "Di tornare tra una settimana"],
        idxCorr: 1,
      },
    ],
    inferenziale: [
      {
        testo: "Come si sentiva Giovanni quando è uscito dall'ambulatorio?",
        opzioni: ["Preoccupato per i risultati della visita", "Sollevato perché le notizie erano buone", "Deluso per il lungo tempo di attesa", "Arrabbiato con il medico"],
        idxCorr: 1,
      },
      {
        testo: "Perché il medico ha consigliato di camminare?",
        opzioni: ["Per aiutarlo a dimagrire", "Come misura preventiva per mantenersi in salute", "Perché Giovanni aveva un problema alle gambe", "Perché Giovanni lavorava seduto tutto il giorno"],
        idxCorr: 1,
      },
      {
        testo: "Cosa ci fa capire che la visita è andata bene?",
        opzioni: ["L'attesa è durata meno del previsto", "Giovanni è uscito sollevato e soddisfatto", "Il medico non ha prescritto farmaci", "Il medico ha fatto molti complimenti"],
        idxCorr: 1,
      },
    ],
  },

  {
    id: "trasloco_anna",
    nFrasi: 5,
    testo:
      "Anna ha deciso di traslocare in un appartamento più piccolo dopo che i suoi figli sono cresciuti e se ne sono andati. " +
      "Ha impiegato tre giorni per fare tutte le scatole con i suoi oggetti. " +
      "Il giorno del trasloco è arrivata una ditta con un grande camion. " +
      "I vicini di casa le hanno portato dei fiori come augurio. " +
      "Adesso Anna si trova bene nel nuovo appartamento, che è più luminoso e facile da pulire.",
    fattuale: [
      {
        testo: "Perché Anna ha deciso di traslocare?",
        opzioni: ["Per risparmiare sull'affitto", "Perché i figli sono cresciuti e andati via", "Per stare vicina al lavoro", "Per seguire il marito"],
        idxCorr: 1,
      },
      {
        testo: "Quanti giorni ha impiegato Anna per fare le scatole?",
        opzioni: ["Un giorno", "Due giorni", "Tre giorni", "Una settimana"],
        idxCorr: 2,
      },
      {
        testo: "Cosa le hanno portato i vicini il giorno del trasloco?",
        opzioni: ["Un dolce fatto in casa", "Una bottiglia di vino", "Dei fiori", "Un regalo avvolto"],
        idxCorr: 2,
      },
    ],
    inferenziale: [
      {
        testo: "Perché Anna ha scelto un appartamento più piccolo?",
        opzioni: ["Per risparmiare denaro", "Da sola non ha più bisogno di molto spazio", "Perché il vecchio era troppo costoso", "Perché il nuovo è in un quartiere migliore"],
        idxCorr: 1,
      },
      {
        testo: "Come si sono comportati i vicini di Anna?",
        opzioni: ["Con indifferenza totale", "In modo affettuoso e premuroso", "Con fastidio per il rumore del trasloco", "Con curiosità senza avvicinarsi"],
        idxCorr: 1,
      },
      {
        testo: "Cosa ci dice che Anna è soddisfatta del trasloco?",
        opzioni: ["Ha impiegato poco tempo a fare le scatole", "Il nuovo appartamento è luminoso e facile da pulire e lei si trova bene", "Ha avuto molti aiuti", "Non ha rimpianti per il vecchio quartiere"],
        idxCorr: 1,
      },
    ],
  },

  {
    id: "festa_paese",
    nFrasi: 5,
    testo:
      "Ogni anno, il secondo sabato di agosto, il piccolo paese di San Rocco organizza la sua festa tradizionale. " +
      "La piazza principale viene decorata con luci colorate e bandierine. " +
      "Di sera arriva una banda musicale che suona fino a mezzanotte. " +
      "I banchi dei dolci e delle specialità locali attirano molte persone dai paesi vicini. " +
      "L'anno scorso è venuta anche la televisione regionale a fare un servizio.",
    fattuale: [
      {
        testo: "Quando si svolge la festa di San Rocco?",
        opzioni: ["Il primo domenica di luglio", "Il secondo sabato di agosto", "La vigilia di Ferragosto", "Il 15 agosto"],
        idxCorr: 1,
      },
      {
        testo: "Fino a che ora suona la banda musicale?",
        opzioni: ["Fino alle dieci di sera", "Fino alle undici", "Fino a mezzanotte", "Fino all'una di notte"],
        idxCorr: 2,
      },
      {
        testo: "Cosa è successo l'anno scorso alla festa?",
        opzioni: ["Ha vinto un premio regionale", "È arrivata la televisione regionale", "È venuto un cantante famoso", "Ci sono stati fuochi d'artificio speciali"],
        idxCorr: 1,
      },
    ],
    inferenziale: [
      {
        testo: "Come mai la festa attira persone dai paesi vicini?",
        opzioni: ["Perché è gratuita per tutti i visitatori", "Per i dolci e le specialità locali che si trovano solo lì", "Perché è la festa più grande della regione", "Perché la televisione la trasmette in diretta"],
        idxCorr: 1,
      },
      {
        testo: "La festa di San Rocco è un evento importante?",
        opzioni: ["No, è poco frequentata", "Sì, è attesa e riconosciuta anche fuori dal paese", "È importante solo per i commercianti locali", "Solo per i giovani del paese"],
        idxCorr: 1,
      },
      {
        testo: "Cosa si capisce dalla presenza della televisione regionale?",
        opzioni: ["La festa è diventata molto nota nella regione", "La televisione copre tutte le feste dei piccoli paesi", "Qualcuno ha pagato per il servizio televisivo", "È stata una casualità non prevista"],
        idxCorr: 0,
      },
    ],
  },

  {
    id: "pescatore_lago",
    nFrasi: 5,
    testo:
      "Ogni domenica mattina, Enzo si alza presto e va a pescare sul lago a cinque chilometri da casa. " +
      "Porta con sé un piccolo cestino con pane, formaggio e acqua fresca. " +
      "Resta seduto sulla riva per tutta la mattina, anche quando non prende niente. " +
      "Sua moglie dice sempre che va lì per stare in pace, non per il pesce. " +
      "Il pomeriggio torna a casa riposato e di buon umore.",
    fattuale: [
      {
        testo: "Ogni quando va a pescare Enzo?",
        opzioni: ["Ogni giorno all'alba", "Ogni sabato mattina", "Ogni domenica mattina", "Ogni tanto, senza orario fisso"],
        idxCorr: 2,
      },
      {
        testo: "Cosa porta con sé Enzo nel cestino?",
        opzioni: ["Frutta, acqua e biscotti", "Pane, formaggio e acqua fresca", "Panini imbottiti e caffè", "Solo acqua e qualche snack"],
        idxCorr: 1,
      },
      {
        testo: "Come torna a casa Enzo il pomeriggio?",
        opzioni: ["Stanco e di cattivo umore", "Deluso perché non ha preso pesci", "Riposato e di buon umore", "Frettoloso e affamato"],
        idxCorr: 2,
      },
    ],
    inferenziale: [
      {
        testo: "Secondo la moglie, perché va davvero a pescare Enzo?",
        opzioni: ["Per portare il pesce fresco a casa", "Per stare in pace e rilassarsi", "Per incontrare gli amici al lago", "Per mantenersi in forma all'aria aperta"],
        idxCorr: 1,
      },
      {
        testo: "Cosa ci fa capire che per Enzo la pesca non è lo scopo principale?",
        opzioni: ["Non porta mai a casa il pesce", "Resta sulla riva tutta la mattina anche quando non prende niente", "Il lago è troppo lontano da casa", "Non porta gli attrezzi giusti"],
        idxCorr: 1,
      },
      {
        testo: "Che beneficio porta a Enzo questa abitudine domenicale?",
        opzioni: ["Risparmiare sul cibo acquistando il pesce", "Tornare a casa riposato e sereno", "Fare nuove amicizie al lago", "Mantenersi fisicamente in forma"],
        idxCorr: 1,
      },
    ],
  },

  {
    id: "lezione_cucina",
    nFrasi: 5,
    testo:
      "Teresa ha deciso di imparare a cucinare i piatti della tradizione italiana da una cuoca esperta del paese. " +
      "La prima lezione è stata dedicata alla pasta fresca fatta a mano. " +
      "La cuoca le ha insegnato come lavorare la farina con le uova fino a ottenere un impasto liscio. " +
      "Teresa ha fatto fatica all'inizio, ma alla fine ha tirato la sfoglia da sola con grande soddisfazione. " +
      "Adesso vuole invitare tutta la famiglia per farla assaggiare.",
    fattuale: [
      {
        testo: "Da chi vuole imparare a cucinare Teresa?",
        opzioni: ["Da una chef famosa in televisione", "Da una cuoca esperta del paese", "Da sua madre", "Da un libro di ricette"],
        idxCorr: 1,
      },
      {
        testo: "A cosa è stata dedicata la prima lezione?",
        opzioni: ["Al risotto ai funghi", "Alla pasta fresca fatta a mano", "Ai dolci tradizionali", "Alla pizza napoletana"],
        idxCorr: 1,
      },
      {
        testo: "Cosa vuole fare Teresa adesso?",
        opzioni: ["Aprire un ristorante", "Iscriversi a un corso professionale", "Invitare la famiglia per far assaggiare la pasta", "Vendere la pasta al mercato"],
        idxCorr: 2,
      },
    ],
    inferenziale: [
      {
        testo: "Come ha reagito Teresa di fronte alla difficoltà iniziale?",
        opzioni: ["Si è scoraggiata e ha smesso subito", "Ha continuato con impegno fino a riuscirci", "Ha chiesto alla cuoca di farlo per lei", "Ha deciso di guardare soltanto"],
        idxCorr: 1,
      },
      {
        testo: "Perché Teresa vuole far assaggiare la pasta alla famiglia?",
        opzioni: ["Per dimostrare le sue nuove capacità e condividere la gioia", "Perché ha preparato troppa pasta", "Per ricevere un giudizio tecnico", "Perché la cuoca lo ha suggerito"],
        idxCorr: 0,
      },
      {
        testo: "Che atteggiamento ha Teresa verso questa esperienza?",
        opzioni: ["Scettico e poco motivato", "Entusiasta e desideroso di migliorare e condividere", "Indifferente senza aspettative", "Ansioso e pieno di dubbi"],
        idxCorr: 1,
      },
    ],
  },

  // ── nFrasi = 6 (lv 9-10) ─────────────────────────────────────────────────

  {
    id: "vacanza_montagna",
    nFrasi: 6,
    testo:
      "La famiglia Rossi ha deciso di trascorrere una settimana in un piccolo albergo di montagna durante le vacanze di luglio. " +
      "Il padre ha scelto l'albergo perché offriva un menù con piatti tipici della zona. " +
      "Ogni mattina si alzavano presto e partivano per lunghe camminate tra i boschi. " +
      "I bambini raccoglievano fiori di campo e la madre fotografava i panorami. " +
      "Un giorno hanno incontrato un vecchio pastore con il suo gregge di pecore. " +
      "La sera tutti erano stanchi ma felici e si addormentavano subito dopo cena.",
    fattuale: [
      {
        testo: "Quando ha fatto la vacanza la famiglia Rossi?",
        opzioni: ["In agosto", "In luglio", "A Pasqua", "A giugno"],
        idxCorr: 1,
      },
      {
        testo: "Perché il padre ha scelto quell'albergo?",
        opzioni: ["Era il più economico della zona", "Aveva una piscina riscaldata", "Offriva piatti tipici della zona nel menù", "Era consigliato da un amico fidato"],
        idxCorr: 2,
      },
      {
        testo: "Chi hanno incontrato durante una camminata?",
        opzioni: ["Un gruppo di escursionisti stranieri", "Un vecchio pastore con le pecore", "Una guardia forestale", "Altri turisti con bambini"],
        idxCorr: 1,
      },
    ],
    inferenziale: [
      {
        testo: "Come trascorreva le giornate la famiglia in montagna?",
        opzioni: ["Riposandosi in albergo e uscendo solo la sera", "Camminando nei boschi durante il giorno e riposando la sera", "Visitando le città vicine in auto", "Facendo attività sportive organizzate"],
        idxCorr: 1,
      },
      {
        testo: "Cosa ci fa capire che le vacanze erano riuscite bene?",
        opzioni: ["Non hanno avuto problemi di nessun tipo", "Tutti erano stanchi ma felici la sera", "Hanno speso poco rispetto alle aspettative", "Il tempo era sempre bello e soleggiato"],
        idxCorr: 1,
      },
      {
        testo: "Che tipo di vacanza era quella della famiglia Rossi?",
        opzioni: ["Rilassante in spiaggia", "Attiva e a contatto con la natura e la tradizione locale", "Culturale con visite a musei e monumenti", "Avventurosa con sport estremi"],
        idxCorr: 1,
      },
    ],
  },

  {
    id: "quaderno_ricette",
    nFrasi: 6,
    testo:
      "La nonna Elvira ha scritto su un quaderno tutte le ricette che ha imparato durante la sua vita. " +
      "Alcune vengono dalla sua mamma, altre le ha inventate lei nel corso degli anni. " +
      "Il suo piatto più famoso è il coniglio in umido con le olive, che prepara solo nelle occasioni speciali. " +
      "Quando i nipoti vengono a trovarla, le chiedono sempre di cucinarlo. " +
      "Una volta ha provato a insegnare la ricetta alla nipote maggiore, ma i passaggi erano così tanti che hanno deciso di cucinare insieme ogni volta. " +
      "Adesso il quaderno è un vero tesoro di famiglia.",
    fattuale: [
      {
        testo: "Dove ha scritto le ricette la nonna Elvira?",
        opzioni: ["Su foglietti sparsi", "Su un libro di cucina stampato", "Su un quaderno", "Sul telefono"],
        idxCorr: 2,
      },
      {
        testo: "Qual è il piatto più famoso di nonna Elvira?",
        opzioni: ["Le lasagne al forno", "Il coniglio in umido con le olive", "Il risotto ai funghi porcini", "La torta di mele"],
        idxCorr: 1,
      },
      {
        testo: "Cosa hanno deciso nonna Elvira e la nipote?",
        opzioni: ["Che la nipote impari da sola con il quaderno", "Che la nonna scriva tutti i passaggi in modo più chiaro", "Che cucinino insieme ogni volta", "Che la ricetta rimanga segreta"],
        idxCorr: 2,
      },
    ],
    inferenziale: [
      {
        testo: "Perché i passaggi erano 'così tanti' da rendere difficile l'insegnamento?",
        opzioni: ["La nipote non era portata per la cucina", "La ricetta è molto elaborata e complessa", "La nonna non sapeva spiegare bene", "Non c'era abbastanza tempo a disposizione"],
        idxCorr: 1,
      },
      {
        testo: "Perché il quaderno è definito 'un tesoro di famiglia'?",
        opzioni: ["Perché è molto antico e prezioso", "Perché è difficile da trovare", "Perché raccoglie la memoria culinaria e affettiva della famiglia nel tempo", "Perché contiene ricette segrete tramandate da generazioni"],
        idxCorr: 2,
      },
      {
        testo: "Cosa si capisce dal fatto che i nipoti chiedono sempre quel piatto?",
        opzioni: ["È l'unica cosa che la nonna sa cucinare bene", "Il piatto è il simbolo dell'amore e della tradizione della nonna per la famiglia", "I nipoti non amano la cucina moderna", "La nonna offre solo quel piatto quando ci sono ospiti"],
        idxCorr: 1,
      },
    ],
  },

  {
    id: "restauro_chiesa",
    nFrasi: 6,
    testo:
      "La piccola chiesa del paese di Montecervo aveva bisogno di importanti lavori di restauro dopo anni di abbandono. " +
      "Il sindaco ha lanciato una raccolta fondi tra i cittadini per raccogliere il denaro necessario. " +
      "In poco tempo gli abitanti hanno contribuito generosamente con donazioni grandi e piccole. " +
      "I lavori sono durati sei mesi e hanno coinvolto artigiani locali specializzati. " +
      "Quando la chiesa è stata riaperta, tutto il paese si è riunito per la messa di inaugurazione. " +
      "Oggi la chiesa è di nuovo il cuore della vita del paese.",
    fattuale: [
      {
        testo: "Perché la chiesa aveva bisogno di restauro?",
        opzioni: ["Aveva subito un terremoto", "Dopo anni di abbandono", "A causa di un incendio", "Per un problema strutturale alle fondamenta"],
        idxCorr: 1,
      },
      {
        testo: "Chi ha lanciato la raccolta fondi?",
        opzioni: ["Il parroco della chiesa", "Un'associazione di volontari", "Il sindaco del paese", "Il vescovo della diocesi"],
        idxCorr: 2,
      },
      {
        testo: "Quanto sono durati i lavori di restauro?",
        opzioni: ["Tre mesi", "Un anno intero", "Sei mesi", "Due anni e mezzo"],
        idxCorr: 2,
      },
    ],
    inferenziale: [
      {
        testo: "Come si sono comportati i cittadini di fronte alla raccolta fondi?",
        opzioni: ["Con diffidenza e scarsa partecipazione", "Con generosità e spirito comunitario", "Solo i più ricchi hanno contribuito con donazioni", "Hanno atteso che pagasse direttamente il comune"],
        idxCorr: 1,
      },
      {
        testo: "Cosa ci dice la frase 'la chiesa è il cuore della vita del paese'?",
        opzioni: ["La chiesa è al centro geografico del paese", "La chiesa ha un ruolo fondamentale nella comunità locale", "La chiesa è il luogo più frequentato del paese", "La chiesa organizza molte attività per i cittadini"],
        idxCorr: 1,
      },
      {
        testo: "Perché è stato importante coinvolgere artigiani locali nel restauro?",
        opzioni: ["Perché lavoravano a un costo inferiore agli esterni", "Per valorizzare le competenze locali e coinvolgere ulteriormente la comunità", "Perché erano gli unici disponibili in quel periodo", "Perché il sindaco li conosceva personalmente"],
        idxCorr: 1,
      },
    ],
  },

  {
    id: "gita_nipoti",
    nFrasi: 6,
    testo:
      "I nipoti di Concetta, Marco e Giulia, sono venuti a trovarla per una settimana durante le vacanze estive. " +
      "Il primo giorno li ha portati al mare, dove hanno giocato in acqua tutta la mattina. " +
      "Il secondo giorno sono andati al parco naturale vicino al paese per una passeggiata tra gli alberi. " +
      "La nonna ha insegnato loro i nomi di tutti i fiori e delle piante che conosceva. " +
      "Il terzo giorno hanno cucinato insieme la pizza e i biscotti nel forno di casa. " +
      "Alla fine della settimana i bambini non volevano più andarsene.",
    fattuale: [
      {
        testo: "Come si chiamano i nipoti di Concetta?",
        opzioni: ["Luca e Sofia", "Marco e Giulia", "Pietro e Anna", "Davide e Maria"],
        idxCorr: 1,
      },
      {
        testo: "Dove sono andati il primo giorno?",
        opzioni: ["Al museo della città", "Al mare", "Al parco naturale", "In montagna"],
        idxCorr: 1,
      },
      {
        testo: "Cosa hanno fatto insieme il terzo giorno?",
        opzioni: ["Sono andati in bicicletta nel parco", "Hanno visitato un castello medievale", "Hanno cucinato pizza e biscotti", "Sono andati al cinema del paese"],
        idxCorr: 2,
      },
    ],
    inferenziale: [
      {
        testo: "Cosa ha trasmesso la nonna ai nipoti durante la settimana?",
        opzioni: ["Solo divertimento e giochi all'aria aperta", "Conoscenza della natura e tradizioni familiari in cucina", "Storie e racconti del passato di famiglia", "Solo belle esperienze al mare e nei parchi"],
        idxCorr: 1,
      },
      {
        testo: "Perché i bambini non volevano andarsene alla fine della settimana?",
        opzioni: ["Non volevano tornare a scuola dopo le vacanze", "La settimana era stata ricca di esperienze belle con la nonna", "La casa della nonna era molto grande e confortevole", "Avevano ancora molte cose che volevano fare"],
        idxCorr: 1,
      },
      {
        testo: "Che tipo di nonna è Concetta in base al testo?",
        opzioni: ["Una nonna passiva che lascia fare ai bambini", "Una nonna attiva che pianifica esperienze e trasmette sapere", "Una nonna molto severa e tradizionalista", "Una nonna che preferisce la tranquillità e il riposo"],
        idxCorr: 1,
      },
    ],
  },

  {
    id: "mercatino_natale",
    nFrasi: 6,
    testo:
      "Ogni anno, dal primo dicembre fino alla vigilia di Natale, nel centro storico della città si apre il mercatino di Natale. " +
      "Decine di casette di legno vengono allestite dai commercianti locali con prodotti artigianali, dolci tipici e decorazioni. " +
      "L'aria profuma di cannella, vin brulé e castagne arrostite. " +
      "I bambini si avvicinano incantati alle bancarelle illuminate e i nonni comprano i loro giocattoli preferiti. " +
      "Molti visitatori vengono anche dai paesi vicini per passeggiare tra le luci e respirare l'atmosfera natalizia. " +
      "L'ultimo giorno c'è sempre un concerto corale che chiude la manifestazione.",
    fattuale: [
      {
        testo: "Quando inizia il mercatino di Natale?",
        opzioni: ["Il 6 dicembre", "Il primo dicembre", "Il 15 novembre", "Il primo dell'avvento"],
        idxCorr: 1,
      },
      {
        testo: "Di cosa profuma l'aria al mercatino?",
        opzioni: ["Di pane appena sfornato e cioccolato", "Di cannella, vin brulé e castagne arrostite", "Di fiori e agrumi", "Di torrone, miele e cannella"],
        idxCorr: 1,
      },
      {
        testo: "Come si conclude il mercatino l'ultimo giorno?",
        opzioni: ["Con uno spettacolo di fuochi d'artificio", "Con un concerto corale", "Con la sfilata di Babbo Natale per le vie", "Con la distribuzione di regali ai bambini"],
        idxCorr: 1,
      },
    ],
    inferenziale: [
      {
        testo: "Cosa ci fa capire che il mercatino è molto apprezzato?",
        opzioni: ["I prezzi sono molto convenienti per tutti", "Attira visitatori anche dai paesi vicini", "È un evento molto antico e storico", "Ha molte bancarelle con prodotti diversi"],
        idxCorr: 1,
      },
      {
        testo: "Come si crea l'atmosfera natalizia al mercatino?",
        opzioni: ["Con la musica moderna e le luci colorate ovunque", "Attraverso profumi, luci e prodotti artigianali tipici della tradizione", "Con la presenza di Babbo Natale tutto il giorno", "Con gli addobbi sugli alberi del centro storico"],
        idxCorr: 1,
      },
      {
        testo: "Cosa si capisce dal fatto che i nonni comprano i giocattoli per i nipoti?",
        opzioni: ["I giocattoli al mercatino hanno prezzi molto bassi", "C'è un legame familiare caldo che si esprime anche nei regali", "I bambini hanno consegnato una lista dei desideri", "I genitori non hanno tempo di fare acquisti al mercatino"],
        idxCorr: 1,
      },
    ],
  },
];
