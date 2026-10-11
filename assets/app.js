/* =====================================================================
   LOGICA DEL SITO (catalogo, configuratore, prezzo, riepilogo)
   Tutti i contenuti personalizzabili sono in impostazioni.js.
   ===================================================================== */
(function () {
  'use strict';

  const S = window.IMPOSTAZIONI;
  const D = window.DisegnoBorse;
  if (!S || !D) {
    document.body.insertAdjacentHTML(
      'afterbegin',
      '<p style="padding:1rem;background:#fde8e4;color:#7a2e22;font-family:sans-serif">Errore: il file impostazioni.js non è stato letto. Controlla di non aver cancellato una virgola o una virgoletta nell\'ultima modifica.</p>'
    );
    return;
  }

  const N = S.negozio;
  const esc = D.esc;
  const $ = (s, el) => (el \vert{}\vert{} document).querySelector(s);   const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const trova = (lista, id) => (lista || []).find((x) => x.id === id);
  const euro = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' });
  const prezzo = (n) => euro.format(Number(n) || 0);
  const extra = (n) => (Number(n) > 0 ? '+ ' + prezzo(n) : '');
  const riduciMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const utenteIG = String(N.instagramUtente || '').replace(/^@/, '').trim();
  const linkProfilo = 'https://www.instagram.com/' + encodeURIComponent(utenteIG) + '/';
  const linkChat = N.linkOrdinePersonalizzato || 'https://ig.me/m/' + encodeURIComponent(utenteIG);
  if (!utenteIG || utenteIG === 'iltuoprofilo') {
    console.warn('[Impostazioni] Ricordati di inserire il tuo nome utente Instagram in impostazioni.js (instagramUtente).');
  }

  /* ---------- Immagini CDN ---------- */
  function urlFoto(src, larghezza) {
    if (!src) return '';
    const locale = location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(location.hostname);
    if (/^https?:\/\//.test(src) || locale) return src;
    const percorso = '/' + String(src).replace(/^\/+/, '');
    return '/.netlify/images?url=' + encodeURIComponent(percorso) + '&w=' + larghezza + '&fm=webp&q=80';
  }

  /* ---------- Stato della configurazione protetto ---------- */
  const primoModello = S.modelli && S.modelli[0] ? S.modelli[0] : { id: '', coloreIniziale: '' };
  const statoIniziale = () => ({
    modello: primoModello.id,
    filato: primoModello.coloreIniziale || (S.coloriFilato && S.coloriFilato[0] ? S.coloriFilato[0].id : ''),
    maniciTipo: S.manici && S.manici.tipi && S.manici.tipi[0] ? S.manici.tipi[0].id : '',
    maniciColore: S.manici && S.manici.colori && S.manici.colori[0] ? S.manici.colori[0].id : '',
    tracolla: S.tracolle && S.tracolle[0] ? S.tracolle[0].id : '',
    accessori: [],
    chiusura: S.chiusure && S.chiusure[0] ? S.chiusure[0].id : '',
    fodera: S.fodere && S.fodere[0] ? S.fodere[0].id : '',
    iniziali: '',
    note: '',
    vista: 'illustrazione',
  });
  let stato = statoIniziale();

  /* ---------- Colori risolti ---------- */
  function coloreFilato() {
    const c = trova(S.coloriFilato, stato.filato);
    return c ? c.colore : '#F4EBDD';
  }
  function tipoManici() { 
    return trova(S.manici && S.manici.tipi, stato.maniciTipo) || (S.manici && S.manici.tipi ? S.manici.tipi[0] : null); 
  }
  function coloreManici() {
    const t = tipoManici();
    if (t && t.coloreFisso) return t.coloreFisso;
    const c = trova(S.manici && S.manici.colori, stato.maniciColore);
    return c && c.colore ? c.colore : coloreFilato();
  }
  function risolviColore(valore) {
    if (valore === 'filato') return coloreFilato();
    if (valore === 'manici') return coloreManici();
    return valore || coloreFilato();
  }

  function opzioniDisegno(st, modello) {
    const salvato = stato;
    stato = st;
    const tr = trova(S.tracolle, st.tracolla);
    const ch = trova(S.chiusure, st.chiusura);
    const tm = tipoManici();
    const o = {
      forma: modello.forma,
      titolo: modello.nome,
      coloreFilato: coloreFilato(),
      manico: tm ? { stile: tm.stile, colore: coloreManici() } : null,
      tracolla: tr && tr.stile ? { stile: tr.stile, colore: risolviColore(tr.colore) } : null,
      chiusura: ch && ch.tipo ? { tipo: ch.tipo, colore: ch.colore || '#A47E62' } : null,
      accessori: (st.accessori || [])
        .map((id) => trova(S.accessori, id))
        .filter(Boolean)
        .map((a) => ({ tipo: a.tipo, colore: risolviColore(a.colore), coloreCentro: a.coloreCentro })),
      iniziali: st.iniziali,
    };
    stato = salvato;
    return o;
  }

  /* ---------- Calcolo del prezzo ---------- */
  function calcola() {
    const m = trova(S.modelli, stato.modello) || primoModello;
    const voci = [];
    const aggiungi = (gruppo, voce) => voci.push({ gruppo, nome: voce.nome, prezzo: Number(voce.prezzoExtra) || 0 });

    voci.push({ gruppo: 'Modello', nome: m.nome, prezzo: 0 });
    const filato = trova(S.coloriFilato, stato.filato);
    if (filato) aggiungi('Colore filato', filato);
    
    const tm = tipoManici();
    if (tm) {
      aggiungi('Manici', tm);
      if (!tm.coloreFisso && S.manici && S.manici.colori) {
        const cm = trova(S.manici.colori, stato.maniciColore);
        if (cm) aggiungi('Colore manici', cm);
      }
    }
    
    const tr = trova(S.tracolle, stato.tracolla);
    if (tr) aggiungi('Tracolla', tr);

    const acc = (stato.accessori || []).map((id) => trova(S.accessori, id)).filter(Boolean);
    if (acc.length) acc.forEach((a) => aggiungi('Accessorio', a));
    else if (S.accessori && S.accessori.length > 0) voci.push({ gruppo: 'Accessori', nome: 'Nessuno', prezzo: 0 });

    const ch = trova(S.chiusure, stato.chiusura);
    if (ch) aggiungi('Chiusura', ch);

    const fo = trova(S.fodere, stato.fodera);
    if (fo) aggiungi('Fodera', fo);

    if (S.iniziali && S.iniziali.attivo && stato.iniziali) {
      voci.push({ gruppo: 'Iniziali ricamate', nome: '«' + stato.iniziali + '»', prezzo: Number(S.iniziali.prezzoExtra) || 0 });
    }

    const base = Number(m.prezzoBase) || 0;
    const totaleExtra = voci.reduce((s, v) => s + v.prezzo, 0);
    return { modello: m, base, voci, extra: totaleExtra, totale: base + totaleExtra };
  }

  function testoOrdine(r) {
    const righe = [`Ciao ${N.nome}! Vorrei ordinare questa borsa personalizzata:`, ''];
    r.voci.forEach((v) => righe.push(`• ${v.gruppo}: ${v.nome}${v.prezzo > 0 ? ` (+${prezzo(v.prezzo)})` : ''}`));
    if (stato.note) righe.push('', `Note: ${stato.note}`);
    righe.push('', `Prezzo base: ${prezzo(r.base)}`, `Extra: ${prezzo(r.extra)}`, `TOTALE: ${prezzo(r.totale)}`, '', 'Grazie!');
    return righe.join('\n');
  }

  /* ---------- Testi generali ---------- */
  function riempiTesti() {
    $$('[data-brand]').forEach((el) => { el.textContent = N.nome; });
    $$('[data-logo]').forEach((el) => {       const src = el.dataset.logo === 'piccolo' ? N.logoPiccolo \vert{}\vert{} N.logo : N.logo;       if (!src) return;       const img = new Image();       img.alt = N.nome;       img.className = 'logo__immagine';       img.onload = () => { el.replaceChildren(img); };       img.src = src;     });     $$
('[data-slogan]').forEach((el) => { el.textContent = N.slogan; });
    $$('[data-presentazione]').forEach((el) => { el.textContent = N.presentazione; });$$
('[data-tempi]').forEach((el) => { el.textContent = N.tempiRealizzazione; });
    $$('[data-nota-prezzi]').forEach((el) => { el.textContent = N.notaPrezzi; });$$
('[data-ig-profilo]').forEach((el) => { el.href = linkProfilo; });
    
    const btnOrdina = $('#pulsante-ordina');
    if (btnOrdina) btnOrdina.href = linkChat;
    document.title = `${N.nome} — Borse all'uncinetto fatte a mano`;

    const listaDomande = $('#lista-domande');
    if (listaDomande) {
      listaDomande.innerHTML = (S.domande || [])
        .map((d) => `<details class="domanda rivela"><summary>${esc(d.domanda)}</summary><p>${esc(d.risposta)}</p></details>`)
        .join('');
    }
  }

  /* ---------- Apertura ---------- */
  function disegnaApertura() {
    const contenitoreApertura = $('#apertura-borse');
    if (!contenitoreApertura || !S.modelli || S.modelli.length < 2) return;
    const esempi = [
      { modello: S.modelli[1], filato: 'verde-salvia', tipo: 'uncinetto', col: 'panna', acc: [] },
      { modello: S.modelli[0], filato: 'rosa-chiaro', tipo: 'nessuno', col: '', acc: ['paillettes'] },
      { model: S.modelli[2] || S.modelli[0], filato: 'beige', tipo: 'nessuno', col: '', acc: [] },
    ].filter((e) => e.modello);

    contenitoreApertura.innerHTML = esempi
      .map((e, i) => {
        const st = Object.assign(statoIniziale(), {
          modello: e.modello.id,
          filato: trova(S.coloriFilato, e.filato) ? e.filato : S.coloriFilato[i % S.coloriFilato.length].id,
          maniciTipo: S.manici && S.manici.tipi ? S.manici.tipi[0].id : '',
        });
        return `<div class="apertura__borsa apertura__borsa--${i + 1}">${D.disegnaBorsa(opzioniDisegno(st, e.modello))}</div>`;
      })
      .join('');
  }

  /* ---------- Catalogo ---------- */
  function disegnaCatalogo() {
    const griglia = $('#griglia-modelli');
    if (!griglia || !S.modelli) return;
    griglia.innerHTML = S.modelli
      .map((m) => {
        const st = Object.assign(statoIniziale(), { modello: m.id, filato: m.coloreIniziale || (S.coloriFilato[0] ? S.coloriFilato[0].id : '') });
        const immagine = m.fotoCatalogo
          ? `<img src="${esc(urlFoto(m.fotoCatalogo, 700))}" alt="${esc(m.nome)}" loading="lazy" width="700" height="700">`
          : D.disegnaBorsa(opzioniDisegno(st, m));
        return `<article class="modello rivela">
          <div class="modello__immagine${m.fotoCatalogo ? ' modello__immagine--foto' : ''}">
            ${immagine}
            ${m.fotoCatalogo ? '' : '<span class="etichetta-demo">Illustrazione dimostrativa</span>'}
          </div>
          <div class="modello__testo">
            <p class="modello__tipo">${esc(m.tipologia || '')}</p>
            <h3>${esc(m.nome)}</h3>
            <p class="modello__descrizione">${esc(m.descrizione || '')}</p>
            <ul class="modello__dettagli">
              ${m.dimensioni ? `<li>${esc(m.dimensioni)}</li>` : ''}
              <li>Fatta su ordinazione</li>
            </ul>
            <div class="modello__piede">
              <p class="modello__prezzo"><span>a partire da</span> ${prezzo(m.prezzoBase)}</p>
              <button type="button" class="pulsante pulsante--pieno" data-personalizza="${esc(m.id)}">Personalizza la tua borsa</button>
            </div>
          </div>
        </article>`;
      })
      .join('');
  }

  /* ---------- Modulo del configuratore ---------- */
  function campione(nome, voce, colore) {
    const vuoto = !colore || colore === 'transparent';
    return `<label class="campione" title="${esc(voce.nome)}">
      <input type="radio" name="${nome}" value="${esc(voce.id)}">
      <span class="campione__colore${vuoto ? ' campione__colore--filato' : ''}" ${vuoto ? '' : `style="background:${esc(colore)}"`}></span>
      <span class="campione__nome">${esc(voce.nome)}</span>
      ${voce.prezzoExtra > 0 ? `<span class="campione__extra">${extra(voce.prezzoExtra)}</span>` : ''}
    </label>`;
  }

  function scelta(tipo, nome, voce) {
    return `<label class="scelta">
      <input type="${tipo}" name="${nome}" value="${esc(voce.id)}">
      <span class="scelta__corpo">
        <span class="scelta__nome">${esc(voce.nome)}</span>
        ${voce.descrizione ? `<span class="scelta__desc">${esc(voce.descrizione)}</span>` : ''}
        ${voce.prezzoExtra > 0 ? `<span class="scelta__prezzo">${extra(voce.prezzoExtra)}</span>` : ''}
      </span>
    </label>`;
  }

  function gruppo(numero, titolo, contenuto, nota) {
    return `<fieldset class="gruppo">
      <legend class="gruppo__titolo"><span class="gruppo__numero">${numero}</span>${titolo}</legend>
      ${nota ? `<p class="gruppo__nota">${nota}</p>` : ''}
      ${contenuto}
    </fieldset>`;
  }

  function costruisciModulo() {
    const formConfig = $('#form-config');
    if (!formConfig) return;

    let n = 0;
    const parti = [];

    if (S.modelli && S.modelli.length > 0) {
      parti.push(gruppo(++n, 'Modello',
        `<div class="modelli-scelta">${S.modelli.map((m) => {
          const st = Object.assign(statoIniziale(), { modello: m.id, filato: m.coloreIniziale || (S.coloriFilato[0] ? S.coloriFilato[0].id : '') });
          return `<label class="modello-scelta">
            <input type="radio" name="modello" value="${esc(m.id)}">
            <span class="modello-scelta__corpo">
              <span class="modello-scelta__mini" aria-hidden="true">${D.disegnaBorsa(opzioniDisegno(st, m))}</span>
              <span class="modello-scelta__nome">${esc(m.nome)}</span>
              <span class="modello-scelta__prezzo">${prezzo(m.prezzoBase)}</span>
            </span>
          </label>`;
        }).join('')}</div>`));
    }

    if (S.coloriFilato && S.coloriFilato.length > 0) {
      parti.push(gruppo(++n, 'Colore del filato',
        `<p class="gruppo__scelto">Colore scelto: <strong id="nome-filato"></strong></p>
         <div class="campioni">${S.coloriFilato.map((c) => campione('filato', c, c.colore)).join('')}</div>`));
    }

    if (S.manici && S.manici.tipi && S.manici.tipi.length > 0) {
      parti.push(gruppo(++n, 'Manici',
        `<div class="scelte">${S.manici.tipi.map((t) => scelta('radio', 'maniciTipo', t)).join('')}</div>
         <div class="sottogruppo" id="blocco-colore-manici">
           <p class="gruppo__scelto">Colore dei manici: <strong id="nome-colore-manici"></strong></p>
           <div class="campioni">${(S.manici.colori || []).map((c) => campione('maniciColore', c, c.colore)).join('')}</div>
         </div>
         <p class="gruppo__nota" id="nota-colore-fisso" hidden>Questo manico ha un colore naturale unico.</p>`));
    }

    if (S.tracolle && S.tracolle.length > 0) {
      parti.push(gruppo(++n, 'Tracolla',
        `<div class="scelte">${S.tracolle.map((t) => scelta('radio', 'tracolla', t)).join('')}</div>`));
    }

    if (S.accessori && S.accessori.length > 0) {
      parti.push(gruppo(++n, 'Accessori',
        `<div class="scelte">${S.accessori.map((a) => scelta('checkbox', 'accessori', a)).join('')}</div>`,
        'Puoi sceglierne più di uno, oppure nessuno.'));
    }

    if (S.chiusure && S.chiusure.length > 0) {
      parti.push(gruppo(++n, 'Chiusura',
        `<div class="scelte">${S.chiusure.map((c) => scelta('radio', 'chiusura', c)).join('')}</div>`));
    }

    if (S.fodere && S.fodere.length > 0) {
      parti.push(gruppo(++n, 'Fodera interna',
        `<div class="scelte">${S.fodere.map((f) => scelta('radio', 'fodera', f)).join('')}</div>`));
    }

    if (S.iniziali && S.iniziali.attivo) {
      const max = Number(S.iniziali.massimoCaratteri) || 3;
      parti.push(gruppo(++n, 'Iniziali ricamate <span class="facoltativo">facoltativo</span>',
        `<div class="campo">
           <input type="text" name="iniziali" id="campo-iniziali" maxlength="${max}" autocomplete="off" placeholder="Es. ${'GML'.slice(0, max)}" aria-describedby="aiuto-iniziali">
           <span class="campo__extra">${extra(S.iniziali.prezzoExtra)}</span>
         </div>
         <p class="gruppo__nota" id="aiuto-iniziali">Fino a ${max} lettere, ricamate sul davanti della borsa.</p>`));
    }

    parti.push(gruppo(++n, 'Note per me <span class="facoltativo">facoltativo</span>',
      `<textarea name="note" id="campo-note" rows="3" maxlength="400" placeholder="Hai un'idea particolare, una data entro cui ti serve la borsa o una richiesta speciale? Scrivila qui."></textarea>`));

    formConfig.innerHTML = parti.join('');
  }

  function applicaStatoAlModulo() {
    const form = $('#form-config');     if (!form) return;     const imposta = (nome, valore) => {       $$(`input[name="${nome}"]`, form).forEach((i) => { i.checked = i.value === valore; });
    };
    imposta('modello', stato.modello);
    imposta('filato', stato.filato);
    imposta('maniciTipo', stato.maniciTipo);
    imposta('maniciColore', stato.maniciColore);
    imposta('tracolla', stato.tracolla);
    imposta('chiusura', stato.chiusura);
    imposta('fodera', stato.fodera);
    $$('input[name="accessori"]', form).forEach((i) => { i.checked = (stato.accessori || []).includes(i.value); });
    const ini = $('#campo-iniziali');
    if (ini) ini.value = stato.iniziali;
    const note = $('#campo-note');
    if (note) note.value = stato.note;
  }

  function leggiModulo() {
    const form = $('#form-config');
    if (!form) return;
    const fd = new FormData(form);
    const prendi = (k, attuale) => (fd.get(k) != null ? String(fd.get(k)) : attuale);
    
    stato.modello = prendi('modello', stato.modello);
    stato.filato = prendi('filato', stato.filato);
    stato.maniciTipo = prendi('maniciTipo', stato.maniciTipo);
    stato.maniciColore = prendi('maniciColore', stato.maniciColore);
    stato.tracolla = prendi('tracolla', stato.tracolla);
    stato.chiusura = prendi('chiusura', stato.chiusura);
    stato.fodera = prendi('fodera', stato.fodera);
    stato.accessori = fd.getAll('accessori').map(String);
    
    const max = (S.iniziali && Number(S.iniziali.massimoCaratteri)) || 3;
    stato.iniziali = String(fd.get('iniziali') || '').trim().toUpperCase().slice(0, max);
    stato.note = String(fd.get('note') || '').trim();
  }

  /* ---------- Aggiornamento ---------- */
  let ultimoTotale = null;

  function aggiorna(anima) {
    const r = calcola();
    const m = r.modello;
    const filato = trova(S.coloriFilato, stato.filato);

    const formConfig = $('#form-config');
    if (formConfig) {
      formConfig.style.setProperty('--filato-attuale', coloreFilato());
    }

    const nomeFilato = $('#nome-filato');
    if (nomeFilato) nomeFilato.textContent = filato ? filato.nome : '';

    const tm = tipoManici();
    const cm = trova(S.manici && S.manici.colori, stato.maniciColore);
    
    const nomeColoreManici = $('#nome-colore-manici');
    if (nomeColoreManici) nomeColoreManici.textContent = cm ? cm.nome : '';
    
    const bloccoColoreManici = $('#blocco-colore-manici');
    if (bloccoColoreManici) bloccoColoreManici.hidden = !tm || !!tm.coloreFisso;

    const notaColoreFisso = $('#nota-colore-fisso');
    if (notaColoreFisso) notaColoreFisso.hidden = !tm || !tm.coloreFisso;

    const foto = m.fotoColori && m.fotoColori[stato.filato];
    if (!foto) stato.vista = 'illustrazione';
    
    const sceltaVista = $('#scelta-vista');     if (sceltaVista) sceltaVista.hidden = !foto;     $$('#scelta-vista [data-vista]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.vista === stato.vista)));

    const tela = $('#anteprima');
    if (tela) {
      if (stato.vista === 'foto' && foto) {
        tela.innerHTML = `<img src="${esc(urlFoto(foto, 900))}" alt="${esc(m.nome)} nel colore ${esc(filato ? filato.nome : '')}">`;
        const etichettaVista = $('#etichetta-vista');
        if (etichettaVista) etichettaVista.textContent = 'Foto reale';
        const didascalia = $('#didascalia');
        if (didascalia) didascalia.textContent = `Foto della borsa nel colore «${filato ? filato.nome : ''}».`;
      } else {
        tela.innerHTML = D.disegnaBorsa(opzioniDisegno(stato, m));
        const etichettaVista = $('#etichetta-vista');
        if (etichettaVista) etichettaVista.textContent = 'Anteprima illustrata';
        const didascalia = $('#didascalia');
        if (didascalia) didascalia.textContent = 'Illustrazione dimostrativa del configuratore.';
      }
    }

    const anteprimaNome = $('#anteprima-nome');
    if (anteprimaNome) anteprimaNome.textContent = `${m.nome} · ${filato ? filato.nome : ''}`;

    if (tela && anima !== false && !riduciMovimento) {
      tela.classList.remove('aggiornata');
      void tela.offsetWidth;
      tela.classList.add('aggiornata');
    }

    const contoRighe = $('#conto-righe');
    const extraVoci = r.voci.filter((v) => v.prezzo > 0);
    if (contoRighe) {
      contoRighe.innerHTML =
        `<li class="conto__riga conto__riga--base"><span>Prezzo base · ${esc(m.nome)}</span><span>${prezzo(r.base)}</span></li>` +
        (extraVoci.length
          ? extraVoci.map((v) => `<li class="conto__riga"><span>${esc(v.gruppo)}: ${esc(v.nome)}</span><span>${extra(v.prezzo)}</span></li>`).join('')
          : '<li class="conto__riga conto__riga--vuota"><span>Nessun extra selezionato</span><span></span></li>');
    }

    const totale = prezzo(r.totale);
    const contoTotale = $('#conto-totale');
    if (contoTotale) contoTotale.textContent = totale;
    const barraTotale = $('#barra-totale');
    if (barraTotale) barraTotale.textContent = totale;
    const riepilogoTotale = $('#riepilogo-totale');
    if (riepilogoTotale) riepilogoTotale.textContent = totale;

    if (ultimoTotale !== null && ultimoTotale !== r.totale && !riduciMovimento) {
      [contoTotale, barraTotale].forEach((el) => {
        if (!el) return;
        el.classList.remove('balzo');
        void el.offsetWidth;
        el.classList.add('balzo');
      });
    }
    ultimoTotale = r.totale;

    const riepilogoLista = $('#riepilogo-lista');
    if (riepilogo
