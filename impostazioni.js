/* =====================================================================
   IMPOSTAZIONI DEL NEGOZIO  —  è l'UNICO file che devi modificare
   =====================================================================

   Qui trovi TUTTO: nome del negozio, link Instagram, modelli, prezzi,
   colori, manici, tracolle, accessori e domande frequenti.

   REGOLE D'ORO (per chi non programma):
   1. Modifica solo il testo tra virgolette "..." e i numeri.
   2. Non cancellare virgole, parentesi { } [ ] o virgolette.
   3. I prezzi si scrivono con il PUNTO per i decimali: 4.50 (non 4,50).
   4. "id" è un codice interno: usa solo lettere minuscole, numeri e
      trattini, senza spazi (es. "rosa-cipria"). Non deve ripetersi.
   5. I colori si scrivono in formato esadecimale, es. "#E9C2BC".
      Puoi trovare il codice di un colore su https://htmlcolorcodes.com
   6. Per AGGIUNGERE una voce, copia un blocco { ... }, incollalo subito
      dopo (separato da una virgola) e cambia i valori.
   7. Dopo ogni modifica salva il file e pubblica di nuovo il sito.
      Se la pagina resta bianca, probabilmente manca una virgola o
      una virgoletta: controlla l'ultima modifica.
   ===================================================================== */

window.IMPOSTAZIONI = {

  /* ---------------------------------------------------------------
     1) IL TUO NEGOZIO
     --------------------------------------------------------------- */
  negozio: {
    nome: "Chill",

    // Il tuo logo. Metti l'immagine nella cartella  sito/img/logo/
    // (meglio un PNG con lo sfondo trasparente) e scrivi qui il percorso.
    // - logo: il logo completo, usato in grande in apertura e in fondo alla pagina
    // - logoPiccolo: versione semplice per la barra in alto (qui solo la scritta "chill")
    // Lascia "" per mostrare al suo posto il nome del negozio scritto qui sopra.
    logo: "img/logo/logo.png",
    logoPiccolo: "img/logo/logo-scritta.png",
    slogan: "Borse all'uncinetto fatte a mano, una maglia alla volta.",
    presentazione:
      "Ogni borsa nasce sulle mie mani, punto dopo punto, con filati morbidi e naturali. Scegli il modello, personalizzalo come preferisci e scrivimi su Instagram: la realizzo apposta per te.",

    // >>> IMPORTANTE: scrivi qui il tuo nome utente Instagram, SENZA la @
    // Esempio: se il profilo è instagram.com/chillandcrochet scrivi "chillandcrochet"
    instagramUtente: "crochetandchill_",

    // (Facoltativo) Se vuoi usare un link diverso per il pulsante
    // "Ordina tramite Instagram", scrivilo qui. Lascia "" per usare
    // automaticamente la chat del profilo qui sopra (https://ig.me/m/...).
    linkOrdinePersonalizzato: "",

    tempiRealizzazione: "7–10 giorni lavorativi",
    notaPrezzi:
      "Prezzo indicativo calcolato in automatico. Spedizione e pagamento si concordano insieme in chat.",
  },

  /* ---------------------------------------------------------------
     2) MODELLI DI BORSA
     - prezzoBase: prezzo di partenza in euro
     - forma: il disegno usato nell'anteprima. Valori possibili:
         "tote"        (borsa a spalla rettangolare)
         "secchiello"  (borsa a secchiello con coulisse)
         "mezzaluna"   (borsa a mezzaluna)
     - coloreIniziale: id del colore mostrato all'apertura (vedi sezione 3)
     - fotoCatalogo: foto reale per la scheda del catalogo.
         Metti la foto nella cartella  sito/img/borse/  e scrivi qui
         il percorso, es. "img/borse/margherita.jpg".
         Lascia "" per usare l'illustrazione dimostrativa.
     - fotoColori: (facoltativo) foto reali della borsa per ogni colore.
         A sinistra l'id del colore, a destra il percorso della foto.
         Quando esiste una foto per il colore scelto, nell'anteprima
         compare il pulsante "Foto reale".
         Esempio:  fotoColori: { "rosa-cipria": "img/borse/margherita-rosa.jpg" },
     --------------------------------------------------------------- */
  modelli: [
    {
      id: "margherita",
      nome: "Tote Margherita",
      tipologia: "Borsa a spalla",
      descrizione:
        "Capiente e leggera, perfetta per tutti i giorni. Lavorata a punto basso fitto per una trama morbida ma resistente.",
      dimensioni: "35 × 30 cm",
      prezzoBase: 55,
      forma: "tote",
      coloreIniziale: "panna",
      fotoCatalogo: "",
      fotoColori: {},
    },
    {
      id: "lavanda",
      nome: "Secchiello Lavanda",
      tipologia: "Borsa a secchiello",
      descrizione:
        "Forma morbida con coulisse e pompon, ideale per il weekend. Si chiude con un gesto e porta con sé un tocco romantico.",
      dimensioni: "24 × 26 cm",
      prezzoBase: 48,
      forma: "secchiello",
      coloreIniziale: "rosa-cipria",
      fotoCatalogo: "",
      fotoColori: {},
    },
    {
      id: "luna",
      nome: "Mezzaluna Luna",
      tipologia: "Borsa a mano",
      descrizione:
        "Piccola ed elegante, a forma di mezzaluna. Pensata per le occasioni speciali e per le serate d'estate.",
      dimensioni: "30 × 18 cm",
      prezzoBase: 42,
      forma: "mezzaluna",
      coloreIniziale: "nocciola",
      fotoCatalogo: "",
      fotoColori: {},
    },
  ],

  /* ---------------------------------------------------------------
     3) COLORI DEL FILATO
     - colore: codice del colore mostrato nel campione e nell'anteprima
     - prezzoExtra: costo aggiuntivo (0 = nessun costo)
     --------------------------------------------------------------- */
  coloriFilato: [
    { id: "panna", nome: "Panna", colore: "#F4EBDD", prezzoExtra: 0 },
    { id: "beige", nome: "Beige sabbia", colore: "#DCC6A8", prezzoExtra: 0 },
    { id: "rosa-cipria", nome: "Rosa cipria", colore: "#E7BDB5", prezzoExtra: 0 },
    { id: "nocciola", nome: "Nocciola", colore: "#B08A6A", prezzoExtra: 0 },
    { id: "terracotta", nome: "Terracotta", colore: "#C47E62", prezzoExtra: 0 },
    { id: "salvia", nome: "Salvia", colore: "#B5BFA1", prezzoExtra: 0 },
    { id: "azzurro", nome: "Azzurro polvere", colore: "#AFC3CF", prezzoExtra: 0 },
    { id: "lilla", nome: "Lilla", colore: "#C9B6D3", prezzoExtra: 2 },
    { id: "cacao", nome: "Cacao", colore: "#6E5444", prezzoExtra: 2 },
  ],

  /* ---------------------------------------------------------------
     4) MANICI
     tipi:
     - stile: il disegno nell'anteprima. Valori possibili:
         "uncinetto", "ecopelle", "bambu", "perline"
     - coloreFisso: se il manico ha un colore unico (es. bambù naturale)
         scrivi qui il colore: la scelta del colore verrà nascosta.
         Lascia "" se la cliente può scegliere il colore.
     colori:
     - la voce con colore "" significa "stesso colore del filato".
     --------------------------------------------------------------- */
  manici: {
    tipi: [
      { id: "uncinetto", nome: "All'uncinetto", descrizione: "Morbidi, lavorati in tinta", stile: "uncinetto", coloreFisso: "", prezzoExtra: 0 },
      { id: "ecopelle", nome: "In ecopelle", descrizione: "Lisci e resistenti", stile: "ecopelle", coloreFisso: "", prezzoExtra: 6 },
      { id: "bambu", nome: "In bambù", descrizione: "Rigidi, color naturale", stile: "bambu", coloreFisso: "#C9A774", prezzoExtra: 8 },
      { id: "perline", nome: "Di perline", descrizione: "Perline in legno infilate a mano", stile: "perline", coloreFisso: "", prezzoExtra: 9 },
    ],
    colori: [
      { id: "come-filato", nome: "Come il filato", colore: "", prezzoExtra: 0 },
      { id: "panna", nome: "Panna", colore: "#F1E6D6", prezzoExtra: 0 },
      { id: "cuoio", nome: "Cuoio", colore: "#A9744F", prezzoExtra: 0 },
      { id: "marrone", nome: "Marrone", colore: "#6E5444", prezzoExtra: 0 },
      { id: "rosa", nome: "Rosa antico", colore: "#D49C95", prezzoExtra: 0 },
      { id: "nero", nome: "Nero", colore: "#3B3330", prezzoExtra: 0 },
    ],
  },

  /* ---------------------------------------------------------------
     5) TRACOLLE
     - stile: "uncinetto", "ecopelle", "catena" (lascia null per "nessuna")
     - colore: "filato" = come il filato, "manici" = come i manici,
               oppure un codice colore, es. "#C9A45C"
     --------------------------------------------------------------- */
  tracolle: [
    { id: "nessuna", nome: "Nessuna tracolla", stile: null, colore: "", prezzoExtra: 0 },
    { id: "uncinetto", nome: "Tracolla all'uncinetto", descrizione: "In tinta con la borsa", stile: "uncinetto", colore: "filato", prezzoExtra: 8 },
    { id: "ecopelle", nome: "Tracolla in ecopelle", descrizione: "Abbinata ai manici, regolabile", stile: "ecopelle", colore: "manici", prezzoExtra: 10 },
    { id: "catena", nome: "Catenella dorata", descrizione: "Rimovibile, con moschettoni", stile: "catena", colore: "#C9A45C", prezzoExtra: 12 },
  ],

  /* ---------------------------------------------------------------
     6) ACCESSORI (la cliente può sceglierne più di uno)
     - tipo: il disegno nell'anteprima. Valori possibili:
         "fiocco", "fiore", "ciondolo", "perle", "nappina"
     - colore: codice colore, oppure "filato" / "manici"
     --------------------------------------------------------------- */
  accessori: [
    { id: "fiocco", nome: "Fiocco in raso", descrizione: "Rosa antico", tipo: "fiocco", colore: "#D9A7A0", prezzoExtra: 4 },
    { id: "fiore", nome: "Fiore all'uncinetto", descrizione: "Margherita applicata", tipo: "fiore", colore: "#FFFDF8", coloreCentro: "#E5B95C", prezzoExtra: 5 },
    { id: "ciondolo", nome: "Ciondolo a cuore", descrizione: "Dorato, appeso al manico", tipo: "ciondolo", colore: "#C9A45C", prezzoExtra: 6 },
    { id: "perle", nome: "Bordo di perline", descrizione: "Perle color avorio sul bordo", tipo: "perle", colore: "#FBF7F0", prezzoExtra: 7 },
    { id: "nappina", nome: "Nappina", descrizione: "In tinta con i manici", tipo: "nappina", colore: "manici", prezzoExtra: 3 },
  ],

  /* ---------------------------------------------------------------
     7) ALTRE PERSONALIZZAZIONI
     --------------------------------------------------------------- */
  // tipo chiusura nell'anteprima: "bottone", "zip", oppure null (non si vede)
  chiusure: [
    { id: "aperta", nome: "Senza chiusura", tipo: null, prezzoExtra: 0 },
    { id: "bottone", nome: "Bottone in legno", tipo: "bottone", colore: "#A47E62", prezzoExtra: 2 },
    { id: "calamita", nome: "Bottone magnetico", descrizione: "Interno, non visibile", tipo: null, prezzoExtra: 3 },
    { id: "zip", nome: "Cerniera", tipo: "zip", colore: "#8C7563", prezzoExtra: 5 },
  ],

  // La fodera è interna: non compare nell'anteprima, ma entra nel prezzo e nel riepilogo.
  fodere: [
    { id: "nessuna", nome: "Senza fodera", prezzoExtra: 0 },
    { id: "cotone", nome: "Fodera in cotone", prezzoExtra: 6 },
    { id: "cotone-tasca", nome: "Fodera con taschino", prezzoExtra: 9 },
  ],

  // Iniziali ricamate sulla borsa (attivo: true = mostra l'opzione, false = nascondi)
  iniziali: { attivo: true, prezzoExtra: 5, massimoCaratteri: 3 },

  /* ---------------------------------------------------------------
     8) DOMANDE FREQUENTI (mostrate in fondo alla pagina)
     --------------------------------------------------------------- */
  domande: [
    {
      domanda: "Come faccio a ordinare?",
      risposta:
        "Personalizza la borsa, copia il riepilogo e inviamelo in un messaggio su Instagram. Ti rispondo con conferma, tempi e dettagli per la spedizione.",
    },
    {
      domanda: "Il prezzo è definitivo?",
      risposta:
        "Il totale mostrato è il prezzo della borsa con le opzioni scelte. La spedizione viene calcolata a parte in base alla destinazione.",
    },
    {
      domanda: "Come si paga?",
      risposta:
        "Non è richiesto alcun pagamento sul sito: concordiamo insieme in chat il metodo più comodo per te.",
    },
    {
      domanda: "Come si lava una borsa all'uncinetto?",
      risposta:
        "A mano in acqua fredda con un sapone delicato, senza strizzare. Lasciala asciugare in piano, lontano dal sole diretto.",
    },
  ],
};
