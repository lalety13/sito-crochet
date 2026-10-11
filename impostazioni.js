/* =====================================================================
   IMPOSTAZIONI DEL NEGOZIO
   ===================================================================== */

window.IMPOSTAZIONI = {

  /* 1) IL TUO NEGOZIO */
  negozio: {
    nome: "Chill",
    logo: "img/logo/logo.png",
    logoPiccolo: "img/logo/logo-scritta.png",
    slogan: "Borse all'uncinetto fatte a mano.",
    presentazione:
      "Ogni borsa nasce dalle mie mani, punto dopo punto. Scegli il modello, personalizzalo come preferisci e scrivimi su Instagram: la realizzo apposta per te.",
    instagramUtente: "crochetandchill_",
    linkOrdinePersonalizzato: "",
    tempiRealizzazione: "3-5 giorni lavorativi",
    notaPrezzi:
      "Prezzo indicativo calcolato in automatico. Spedizione e pagamento si concordano insieme in chat.",
  },

  /* 2) MODELLI DI BORSA */
  modelli: [
    {
      id: "clutch-bag",
      nome: "Clutch bag",
      tipologia: "Borsa a mano",
      prezzoBase: 30,
      coloreIniziale: "panna",
      fotoCatalogo: "",
      fotoColori: {},
    },
    {
      id: "bottega-bag",
      nome: "Bottega Bag",
      tipologia: "Borsa a secchiello",
      prezzoBase: 35,
      coloreIniziale: "rosa-cipria",
      fotoCatalogo: "",
      fotoColori: {},
    },
    {
      id: "hand-bag",
      nome: "Hand Bag",
      tipologia: "Borsa a mano",
      prezzoBase: 30,
      coloreIniziale: "nocciola",
      fotoCatalogo: "",
      fotoColori: {},
    },
  ],

  /* 3) COLORI DEL FILATO */
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

  /* 4) MANICI */
  manici: {
    tipi: [
      { id: "uncinetto", nome: "All'uncinetto", descrizione: "Morbidi, lavorati in tinta", stile: "uncinetto", coloreFisso: "", prezzoExtra: 5 },
    ],
  },

  /* 5) TRACOLLE */
  tracolle: [
    { id: "nessuna", nome: "Nessuna tracolla", stile: null, colore: "", prezzoExtra: 0 },
    { id: "uncinetto", nome: "Tracolla all'uncinetto", descrizione: "In tinta con la borsa", stile: "uncinetto", colore: "filato", prezzoExtra: 5 },
    { id: "catena-oro", nome: "Catenella oro", descrizione: "Rimovibile, con moschettoni", stile: "catena", colore: "#C9A45C", prezzoExtra: 5 },
    { id: "catena-argento", nome: "Catenella argento", descrizione: "Rimovibile, con moschettoni", stile: "catena", colore: "#C0C0C0", prezzoExtra: 5 },
  ],

  /* 6) ACCESSORI */
  accessori: [
    { id: "fiocco", nome: "Fiocco in raso", descrizione: "Rosa antico", tipo: "fiocco", colore: "#D9A7A0", prezzoExtra: 4 },
    { id: "fiore", nome: "Fiore all'uncinetto", descrizione: "Margherita applicata", tipo: "fiore", colore: "#FFFDF8", coloreCentro: "#E5B95C", prezzoExtra: 5 },
    { id: "ciondolo", nome: "Ciondolo a cuore", descrizione: "Dorato, appeso al manico", tipo: "ciondolo", colore: "#C9A45C", prezzoExtra: 6 },
    { id: "perle", nome: "Bordo di perline", descrizione: "Perle color avorio sul bordo", tipo: "perle", colore: "#FBF7F0", prezzoExtra: 7 },
    { id: "nappina", nome: "Nappina", descrizione: "In tinta con i manici", tipo: "nappina", colore: "manici", prezzoExtra: 3 },
  ],

  /* 7) ALTRE PERSONALIZZAZIONI */
  chiusure: [
    { id: "aperta", nome: "Senza chiusura", tipo: null, prezzoExtra: 0 },
    { id: "bottone", nome: "Bottone in legno", tipo: "bottone", colore: "#A47E62", prezzoExtra: 2 },
    { id: "calamita", nome: "Bottone magnetico", descrizione: "Interno, non visibile", tipo: null, prezzoExtra: 3 },
    { id: "zip", nome: "Cerniera", tipo: "zip", colore: "#8C7563", prezzoExtra: 5 },
  ],

  fodere: [
    { id: "nessuna", nome: "Senza fodera", prezzoExtra: 0 },
    { id: "cotone", nome: "Fodera in cotone", prezzoExtra: 6 },
    { id: "cotone-tasca", nome: "Fodera con taschino", prezzoExtra: 9 },
  ],

  iniziali: { attivo: true, prezzoExtra: 5, massimoCaratteri: 3 },

  /* 8) DOMANDE FREQUENTI */
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
