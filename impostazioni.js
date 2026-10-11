/* =====================================================================
   IMPOSTAZIONI DEL NEGOZIO — è l'UNICO file che devi modificare
   ===================================================================== */

window.IMPOSTAZIONI = {

  /* ---------------------------------------------------------------
     1) IL TUO NEGOZIO
     --------------------------------------------------------------- */
  negozio: {
    nome: "Chill",
    logo: "img/logo/logo.png",
    logoPiccolo: "img/logo/logo-scritta.png",
    slogan: "Borse all'uncinetto fatte a mano, una maglia alla volta.",
    presentazione:
      "Ogni borsa nasce sulle mie mani, punto dopo punto, con filati morbidi e naturali. Scegli il modello, personalizzalo come preferisci e scrivimi su Instagram: la realizzo apposta per te.",
    instagramUtente: "crochetandchill_",
    linkOrdinePersonalizzato: "",
    tempiRealizzazione: "7–10 giorni lavorativi",
    notaPrezzi:
      "Prezzo indicativo calcolato in automatico. Spedizione e pagamento si concordano insieme in chat.",
  },

  /* ---------------------------------------------------------------
     2) MODELLI DI BORSA
     --------------------------------------------------------------- */
  modelli: [
    {
      id: "clutch-bag",
      nome: "Clutch bag",
      tipologia: "Borsa a mano",
      prezzoBase: 30,
      misure: [
        { id: "standard", nome: "Unica", prezzo: 30 }
      ],
      coloreIniziale: "bianco-panna",
      fotoCatalogo: "",
      fotoColori: {},
    },
    {
      id: "bottega-bag",
      nome: "Bottega Bag",
      tipologia: "Borsa a secchiello",
      prezzoBase: 35,
      misure: [
        { id: "standard", nome: "Unica", prezzo: 35 }
      ],
      coloreIniziale: "rosa-chiaro",
      fotoCatalogo: "",
      fotoColori: {},
    },
    {
      id: "hand-bag",
      nome: "Hand Bag",
      tipologia: "Borsa a mano",
      prezzoBase: 30,
      misure: [
        { id: "standard", nome: "Unica", prezzo: 30 }
      ],
      coloreIniziale: "beige",
      fotoCatalogo: "",
      fotoColori: {},
    },
  ],

  /* ---------------------------------------------------------------
     3) COLORI DEL FILATO
     --------------------------------------------------------------- */
  coloriFilato: [
    { id: "rosso", nome: "Rosso", colore: "#C81D25", prezzoExtra: 0 },
    { id: "bordeaux", nome: "Bordeaux", colore: "#6B1D2F", prezzoExtra: 0 },
    { id: "nero", nome: "Nero", colore: "#1C1C1C", prezzoExtra: 0 },
    { id: "bianco-ottico", nome: "Bianco ottico", colore: "#FFFFFF", prezzoExtra: 0 },
    { id: "bianco-panna", nome: "Bianco panna", colore: "#F5F2EB", prezzoExtra: 0 },
    { id: "beige", nome: "Beige", colore: "#D8C5B2", prezzoExtra: 0 },
    { id: "ecru", nome: "Ecrù", colore: "#E5DEC9", prezzoExtra: 0 },
    { id: "testa-di-moro", nome: "Testa di moro", colore: "#3F2C23", prezzoExtra: 0 },
    { id: "marrone", nome: "Marrone", colore: "#8B5A2B", prezzoExtra: 0 },
    { id: "grigio-chiaro", nome: "Grigio chiaro", colore: "#C5C5C5", prezzoExtra: 0 },
    { id: "grigio-scuro", nome: "Grigio scuro", colore: "#505050", prezzoExtra: 0 },
    { id: "fucsia", nome: "Fucsia", colore: "#D90368", prezzoExtra: 0 },
    { id: "rosa-chiaro", nome: "Rosa chiaro", colore: "#F7C1BB", prezzoExtra: 0 },
    { id: "rosa-antico", nome: "Rosa antico", colore: "#D69F9C", prezzoExtra: 0 },
    { id: "giallo", nome: "Giallo", colore: "#F3C63F", prezzoExtra: 0 },
    { id: "arancione", nome: "Arancione", colore: "#E67E22", prezzoExtra: 0 },
    { id: "verde-salvia", nome: "Verde salvia", colore: "#9FA89E", prezzoExtra: 0 },
    { id: "verde-bosco", nome: "Verde bosco", colore: "#2D4A3E", prezzoExtra: 0 },
    { id: "verde-speranza", nome: "Verde speranza", colore: "#3B7A57", prezzoExtra: 0 },
    { id: "blu-navy", nome: "Blu navy", colore: "#1B2A4A", prezzoExtra: 0 },
    { id: "blu-elettrico", nome: "Blu elettrico", colore: "#0047AB", prezzoExtra: 0 },
    { id: "azzurro-chiaro", nome: "Azzurro chiaro", colore: "#A2BCE0", prezzoExtra: 0 },
    { id: "verdeacqua", nome: "Verdeacqua", colore: "#7CA9A6", prezzoExtra: 0 },
    { id: "carta-da-zucchero", nome: "Carta da zucchero", colore: "#8CA2B3", prezzoExtra: 0 },
    { id: "due-colori-mix", nome: "Due colori / Mix (specifica in chat)", colore: "linear-gradient(135deg, #C81D25 50%, #F5F2EB 50%)", prezzoExtra: 5 },
    { id: "altro-colore", nome: "Altro colore (scrivimi)", colore: "transparent", prezzoExtra: 0 },
  ],

  /* ---------------------------------------------------------------
     4) MANICI
     --------------------------------------------------------------- */
  manici: {
    tipi: [
      { id: "nessuno", nome: "Senza manici", descrizione: "Nessun manico aggiunto", stile: null, coloreFisso: "", prezzoExtra: 0 },
      { id: "uncinetto", nome: "All'uncinetto", descrizione: "Morbidi, lavorati in tinta", stile: "uncinetto", coloreFisso: "", prezzoExtra: 5 },
    ],
    colori: [
      { id: "in-tinta", nome: "In tinta con la borsa", hex: "#F5F2EB" }
    ]
  },

  /* ---------------------------------------------------------------
     5) TRACOLLE
     --------------------------------------------------------------- */
  tracolle: [
    { id: "nessuna", nome: "Nessuna tracolla", stile: null, colore: "", prezzoExtra: 0 },
    { id: "uncinetto", nome: "Tracolla all'uncinetto", descrizione: "In tinta con la borsa", stile: "uncinetto", colore: "filato", prezzoExtra: 5 },
    { id: "catena-oro", nome: "Catenella oro", descrizione: "Rimovibile, con moschettoni", stile: "catena", colore: "#C9A45C", prezzoExtra: 5 },
    { id: "catena-argento", nome: "Catenella argento", descrizione: "Rimovibile, con moschettoni", stile: "catena", colore: "#C0C0C0", prezzoExtra: 5 },
  ],

  /* ---------------------------------------------------------------
     6) ACCESSORI
     --------------------------------------------------------------- */
  accessori: [
    { id: "nessuno", nome: "Nessun accessorio", prezzoExtra: 0 },
    { id: "paillettes", nome: "Applicazione paillettes", descrizione: "Punti luce ricamati a mano", prezzoExtra: 5 },
  ],

  /* ---------------------------------------------------------------
     7) CHIUSURE E FODERE
     --------------------------------------------------------------- */
  chiusure: [
    { id: "nessuna", nome: "Senza chiusura", prezzoExtra: 0 },
    { id: "bottone-magnetico", nome: "Bottone magnetico", prezzoExtra: 0 }
  ],
  fodere: [
    { id: "nessuna", nome: "Senza fodera", prezzoExtra: 0 },
    { id: "standard", nome: "Fodera in tessuto", prezzoExtra: 0 }
  ],

  /* ---------------------------------------------------------------
     8) DOMANDE FREQUENTI
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
