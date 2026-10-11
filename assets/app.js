/* =====================================================================
   LOGICA DEL SITO (catalogo, configuratore, prezzo, riepilogo)
   Non serve modificare questo file: tutti i contenuti sono in
   impostazioni.js.
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
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
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

  /* ---------- Immagini: usa il Netlify Image CDN quando il sito è online ---------- */
  function urlFoto(src, larghezza) {
    if (!src) return '';
    const locale = location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(location.hostname);
    if (/^https?:\/\//.test(src) || locale) return src;
    const percorso = '/' + String(src).replace(/^\/+/, '');
    return '/.netlify/images?url=' + encodeURIComponent(percorso) + '&w=' + larghezza + '&fm=webp&q=80';
  }

  /* ---------- Stato della configurazione ---------- */
  const primoModello = S.modelli[0];
  const statoIniziale = () => ({
    modello: primoModello.id,
    filato: primoModello.coloreIniziale || S.coloriFilato[0].id,
    maniciTipo: S.manici.tipi[0].id,
    maniciColore: S.manici.colori[0].id,
    tracolla: S.tracolle[0].id,
    accessori: [],
    chiusura: S.chiusure[0].id,
    fodera: S.fodere[0].id,
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
  function tipoManici() { return trova(S.manici.tipi, stato.maniciTipo) || S.manici.tipi[0]; }
  function coloreManici() {
    const t = tipoManici();
    if (t.coloreFisso) return t.coloreFisso;
    const c = trova(S.manici.colori, stato.maniciColore);
    return c && c.colore ? c.colore : coloreFilato();
  }
  function risolviColore(valore) {
    if (valore === 'filato') return coloreFilato();
    if (valore === 'manici') return coloreManici();
    return valore || coloreFilato();
  }

  function opzioniDisegno(st, modello) {
    // st permette di disegnare anche borse diverse da quella in configurazione (catalogo, apertura)
    const salvato = stato;
    stato = st;
    const tr = trova(S.tracolle, st.tracolla);
    const ch = trova(S.chiusure, st.chiusura);
    const tm = tipoManici();
    const o = {
      forma: modello.forma,
      titolo: modello.nome,
      coloreFilato: coloreFilato(),
      manico: { stile: tm.stile, colore: coloreManici() },
      tracolla: tr && tr.stile ? { stile: tr.stile, colore: risolviColore(tr.colore) } : null,
      chiusura: ch && ch.tipo ? { tipo: ch.tipo, colore: ch.colore || '#A47E62' } : null,
      accessori: st.accessori
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
    aggiungi('Manici', tm);
    if (!tm.coloreFisso) {
      const cm = trova(S.manici.colori, stato.maniciColore);
      if (cm) aggiungi('Colore manici', cm);
    }
    const tr = trova(S.tracolle, stato.tracolla);
    if (tr) aggiungi('Tracolla', tr);
    const acc = stato.accessori.map((id) => trova(S.accessori, id)).filter(Boolean);
    if (acc.length) acc.forEach((a) => aggiungi('Accessorio', a));
    else voci.push({ gruppo: 'Accessori', nome: 'Nessuno', prezzo: 0 });
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

  /* ---------- Testi generali del negozio ---------- */
  function riempiTesti() {
    $$('[data-brand]').forEach((el) => { el.textContent = N.nome; });
    // Logo: sostituisce il nome scritto; se l'immagine manca o non si carica resta il nome
    $$('[data-logo]').forEach((el) => {
      const src = el.dataset.logo === 'piccolo' ? N.logoPiccolo || N.logo : N.logo;
      if (!src) return;
      const img = new Image();
      img.alt = N.nome;
      img.className = 'logo__immagine';
      img.onload = () => { el.replaceChildren(img); };
      img.src = src;
    });
    $$('[data-slogan]').forEach((el) => { el.textContent = N.slogan; });
    $$('[data-presentazione]').forEach((el) => { el.textContent = N.presentazione; });
    $$('[data-tempi]').forEach((el) => { el.textContent = N.tempiRealizzazione; });
    $$('[data-nota-prezzi]').forEach((el) => { el.textContent = N.notaPrezzi; });
    $$('[data-ig-profilo]').forEach((el) => { el.href = linkProfilo; });
    $('#pulsante-ordina').href = linkChat;
    document.title = `${N.nome} — Borse all'uncinetto fatte a mano`;

    $('#lista-domande').innerHTML = (S.domande || [])
      .map((d) => `<details class="domanda rivela"><summary>${esc(d.domanda)}</summary><p>${esc(d.risposta)}</p></details>`)
      .join('');
  }

  /* ---------- Apertura: tre borse illustrate ---------- */
  function disegnaApertura() {
    const esempi = [
      { modello: S.modelli[1], filato: 'salvia', tipo: 'perline', col: 'panna', acc: ['fiore'] },
      { modello: S.modelli[0], filato: 'rosa-cipria', tipo: 'ecopelle', col: 'cuoio', acc: ['fiocco', 'ciondolo'] },
      { modello: S.modelli[2], filato: 'panna', tipo: 'bambu', col: 'panna', acc: ['perle'] },
    ].filter((e) => e.modello);
    $('#apertura-borse').innerHTML = esempi
      .map((e, i) => {
        const st = Object.assign(statoIniziale(), {
          modello: e.modello.id,
          filato: trova(S.coloriFilato, e.filato) ? e.filato : S.coloriFilato[i % S.coloriFilato.length].id,
          maniciTipo: trova(S.manici.tipi, e.tipo) ? e.tipo : S.manici.tipi[0].id,
          maniciColore: trova(S.manici.colori, e.col) ? e.col : S.manici.colori[0].id,
          accessori: e.acc.filter((a) => trova(S.accessori, a)),
        });
        return `<div class="apertura__borsa apertura__borsa--${i + 1}">${D.disegnaBorsa(opzioniDisegno(st, e.modello))}</div>`;
      })
      .join('');
  }

  /* ---------- Catalogo ---------- */
  function disegnaCatalogo() {
    $('#griglia-modelli').innerHTML = S.modelli
      .map((m) => {
        const st = Object.assign(statoIniziale(), { modello: m.id, filato: m.coloreIniziale || S.coloriFilato[0].id });
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
            <p class="modello__descrizione">${esc(m.descrizione)}</p>
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
    const vuoto = !colore;
    return `<label class="campione" title="${esc(voce.nome)}">
      <input type="radio" name="${nome}" value="${esc(voce.id)}">
      <span class="campione__colore${vuoto ? ' campione__colore--filato' : ''}" ${vuoto ? '' : `style="--c:${esc(colore)}"`}></span>
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
    let n = 0;
    const parti = [];

    parti.push(gruppo(++n, 'Modello',
      `<div class="modelli-scelta">${S.modelli.map((m) => {
        const st = Object.assign(statoIniziale(), { modello: m.id, filato: m.coloreIniziale || S.coloriFilato[0].id });
        return `<label class="modello-scelta">
          <input type="radio" name="modello" value="${esc(m.id)}">
          <span class="modello-scelta__corpo">
            <span class="modello-scelta__mini" aria-hidden="true">${D.disegnaBorsa(opzioniDisegno(st, m))}</span>
            <span class="modello-scelta__nome">${esc(m.nome)}</span>
            <span class="modello-scelta__prezzo">${prezzo(m.prezzoBase)}</span>
          </span>
        </label>`;
      }).join('')}</div>`));

    parti.push(gruppo(++n, 'Colore del filato',
      `<p class="gruppo__scelto">Colore scelto: <strong id="nome-filato"></strong></p>
       <div class="campioni">${S.coloriFilato.map((c) => campione('filato', c, c.colore)).join('')}</div>`));

    parti.push(gruppo(++n, 'Manici',
      `<div class="scelte">${S.manici.tipi.map((t) => scelta('radio', 'maniciTipo', t)).join('')}</div>
       <div class="sottogruppo" id="blocco-colore-manici">
         <p class="gruppo__scelto">Colore dei manici: <strong id="nome-colore-manici"></strong></p>
         <div class="campioni">${S.manici.colori.map((c) => campione('maniciColore', c, c.colore)).join('')}</div>
       </div>
       <p class="gruppo__nota" id="nota-colore-fisso" hidden>Questo manico ha un colore naturale unico.</p>`));

    parti.push(gruppo(++n, 'Tracolla',
      `<div class="scelte">${S.tracolle.map((t) => scelta('radio', 'tracolla', t)).join('')}</div>`));

    parti.push(gruppo(++n, 'Accessori',
      `<div class="scelte">${S.accessori.map((a) => scelta('checkbox', 'accessori', a)).join('')}</div>`,
      'Puoi sceglierne più di uno, oppure nessuno.'));

    parti.push(gruppo(++n, 'Chiusura',
      `<div class="scelte">${S.chiusure.map((c) => scelta('radio', 'chiusura', c)).join('')}</div>`));

    parti.push(gruppo(++n, 'Fodera interna',
      `<div class="scelte">${S.fodere.map((f) => scelta('radio', 'fodera', f)).join('')}</div>`,
      'La fodera è all\'interno: non si vede nell\'anteprima, ma è inclusa nel prezzo e nel riepilogo.'));

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

    $('#form-config').innerHTML = parti.join('');
  }

  // Porta lo stato attuale dentro i controlli del modulo
  function applicaStatoAlModulo() {
    const form = $('#form-config');
    const imposta = (nome, valore) => {
      $$(`input[name="${nome}"]`, form).forEach((i) => { i.checked = i.value === valore; });
    };
    imposta('modello', stato.modello);
    imposta('filato', stato.filato);
    imposta('maniciTipo', stato.maniciTipo);
    imposta('maniciColore', stato.maniciColore);
    imposta('tracolla', stato.tracolla);
    imposta('chiusura', stato.chiusura);
    imposta('fodera', stato.fodera);
    $$('input[name="accessori"]', form).forEach((i) => { i.checked = stato.accessori.includes(i.value); });
    const ini = $('#campo-iniziali');
    if (ini) ini.value = stato.iniziali;
    $('#campo-note').value = stato.note;
  }

  function leggiModulo() {
    const fd = new FormData($('#form-config'));
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

  /* ---------- Aggiornamento di anteprima, prezzo e riepilogo ---------- */
  let ultimoTotale = null;

  function aggiorna(anima) {
    const r = calcola();
    const m = r.modello;
    const filato = trova(S.coloriFilato, stato.filato);

    // Colore "come il filato" nei campioni dei manici
    $('#form-config').style.setProperty('--filato-attuale', coloreFilato());

    // Etichette dei colori scelti
    $('#nome-filato').textContent = filato ? filato.nome : '';
    const tm = tipoManici();
    const cm = trova(S.manici.colori, stato.maniciColore);
    $('#nome-colore-manici').textContent = cm ? cm.nome : '';
    $('#blocco-colore-manici').hidden = !!tm.coloreFisso;
    $('#nota-colore-fisso').hidden = !tm.coloreFisso;

    // Anteprima: illustrazione a livelli oppure foto reale (se presente per quel colore)
    const foto = m.fotoColori && m.fotoColori[stato.filato];
    if (!foto) stato.vista = 'illustrazione';
    $('#scelta-vista').hidden = !foto;
    $$('#scelta-vista [data-vista]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.vista === stato.vista)));

    const tela = $('#anteprima');
    if (stato.vista === 'foto' && foto) {
      tela.innerHTML = `<img src="${esc(urlFoto(foto, 900))}" alt="${esc(m.nome)} nel colore ${esc(filato ? filato.nome : '')}">`;
      $('#etichetta-vista').textContent = 'Foto reale';
      $('#didascalia').textContent = `Foto della borsa nel colore «${filato ? filato.nome : ''}». Manici, tracolla e accessori scelti sono nel riepilogo: passa a «Illustrazione» per vederli.`;
    } else {
      tela.innerHTML = D.disegnaBorsa(opzioniDisegno(stato, m));
      $('#etichetta-vista').textContent = 'Anteprima illustrata';
      $('#didascalia').textContent = 'Illustrazione dimostrativa: mostra colore, manici, tracolla, chiusura e accessori scelti. La borsa vera è fatta a mano e ogni pezzo è unico.';
    }
    $('#anteprima-nome').textContent = `${m.nome} · ${filato ? filato.nome : ''}`;
    if (anima !== false && !riduciMovimento) {
      tela.classList.remove('aggiornata');
      void tela.offsetWidth;
      tela.classList.add('aggiornata');
    }

    // Conto
    const extraVoci = r.voci.filter((v) => v.prezzo > 0);
    $('#conto-righe').innerHTML =
      `<li class="conto__riga conto__riga--base"><span>Prezzo base · ${esc(m.nome)}</span><span>${prezzo(r.base)}</span></li>` +
      (extraVoci.length
        ? extraVoci.map((v) => `<li class="conto__riga"><span>${esc(v.gruppo)}: ${esc(v.nome)}</span><span>${extra(v.prezzo)}</span></li>`).join('')
        : '<li class="conto__riga conto__riga--vuota"><span>Nessun extra selezionato</span><span></span></li>');
    const totale = prezzo(r.totale);
    $('#conto-totale').textContent = totale;
    $('#barra-totale').textContent = totale;
    $('#riepilogo-totale').textContent = totale;
    if (ultimoTotale !== null && ultimoTotale !== r.totale && !riduciMovimento) {
      [$('#conto-totale'), $('#barra-totale')].forEach((el) => {
        el.classList.remove('balzo');
        void el.offsetWidth;
        el.classList.add('balzo');
      });
    }
    ultimoTotale = r.totale;

    // Riepilogo
    $('#riepilogo-lista').innerHTML =
      r.voci.map((v) => {
        const costo = v.gruppo === 'Modello' ? prezzo(r.base) : extra(v.prezzo);
        return `<li><span>${esc(v.gruppo)}</span><strong>${esc(v.nome)}</strong><em>${costo}</em></li>`;
      }).join('') +
      (stato.note ? `<li><span>Note</span><strong>${esc(stato.note)}</strong><em></em></li>` : '');
    $('#riepilogo-testo').value = testoOrdine(r);
  }

  /* ---------- Copia, condivisione e avvisi ---------- */
  function copiaVecchioMetodo(testo) {
    const ta = document.createElement('textarea');
    ta.value = testo;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }
  function copia(testo) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(testo).then(() => true, () => copiaVecchioMetodo(testo));
    }
    return Promise.resolve(copiaVecchioMetodo(testo));
  }

  let timerAvviso;
  function avviso(testo) {
    const el = $('#avviso');
    el.textContent = testo;
    el.classList.add('visibile');
    clearTimeout(timerAvviso);
    timerAvviso = setTimeout(() => el.classList.remove('visibile'), 4200);
  }

  function selezionaTestoRiepilogo() {
    const ta = $('#riepilogo-testo');
    ta.focus();
    ta.select();
  }

  /* ---------- Eventi ---------- */
  function collegaEventi() {
    const form = $('#form-config');
    form.addEventListener('change', () => { leggiModulo(); aggiorna(); });
    form.addEventListener('input', (e) => {
      if (e.target.name === 'iniziali' || e.target.name === 'note') { leggiModulo(); aggiorna(false); }
    });
    form.addEventListener('submit', (e) => e.preventDefault());

    // "Personalizza la tua borsa" dal catalogo
    $('#griglia-modelli').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-personalizza]');
      if (!btn) return;
      const m = trova(S.modelli, btn.dataset.personalizza);
      if (!m) return;
      stato.modello = m.id;
      if (m.coloreIniziale && trova(S.coloriFilato, m.coloreIniziale)) stato.filato = m.coloreIniziale;
      stato.vista = 'illustrazione';
      applicaStatoAlModulo();
      aggiorna();
      $('#configuratore').scrollIntoView({ behavior: riduciMovimento ? 'auto' : 'smooth', block: 'start' });
    });

    // Illustrazione / Foto reale
    $('#scelta-vista').addEventListener('click', (e) => {
      const b = e.target.closest('[data-vista]');
      if (!b) return;
      stato.vista = b.dataset.vista;
      aggiorna();
    });

    // Copia riepilogo
    $('#pulsante-copia').addEventListener('click', () => {
      copia($('#riepilogo-testo').value).then((ok) => {
        if (ok) avviso('Riepilogo copiato ✓  Ora incollalo nel messaggio Instagram.');
        else { selezionaTestoRiepilogo(); avviso('Copia automatica non disponibile: il testo è selezionato, copialo a mano.'); }
      });
    });

    // Ordina tramite Instagram: copia il riepilogo e lascia aprire il link (nuova scheda / app)
    $('#pulsante-ordina').addEventListener('click', () => {
      copia($('#riepilogo-testo').value).then((ok) => {
        avviso(ok
          ? 'Riepilogo copiato ✓  Incollalo nella chat Instagram e invia il messaggio.'
          : 'Ricordati di copiare il riepilogo qui sotto e incollarlo nella chat Instagram.');
      });
    });

    // Condividi (smartphone): apre il menu di condivisione del telefono
    if (navigator.share) {
      const b = $('#pulsante-condividi');
      b.hidden = false;
      b.addEventListener('click', () => {
        navigator.share({ title: `Ordine ${N.nome}`, text: $('#riepilogo-testo').value }).catch(() => {});
      });
    }

    // Ricomincia
    $('#pulsante-ricomincia').addEventListener('click', () => {
      stato = statoIniziale();
      applicaStatoAlModulo();
      aggiorna();
      avviso('Configurazione azzerata.');
      $('#configuratore').scrollIntoView({ behavior: riduciMovimento ? 'auto' : 'smooth', block: 'start' });
    });
  }

  /* ---------- Animazioni all'ingresso e barra mobile ---------- */
  function animazioni() {
    const elementi = $$('.rivela');
    if (riduciMovimento || !('IntersectionObserver' in window)) {
      elementi.forEach((el) => el.classList.add('visibile'));
    } else {
      const io = new IntersectionObserver((voci) => {
        voci.forEach((v) => {
          if (v.isIntersecting) { v.target.classList.add('visibile'); io.unobserve(v.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      elementi.forEach((el) => io.observe(el));
    }

    const barra = $('#barra-mobile');
    if (!('IntersectionObserver' in window)) return;
    let inConfiguratore = false, inRiepilogo = false;
    const aggiornaBarra = () => {
      const mostra = inConfiguratore && !inRiepilogo;
      barra.classList.toggle('visibile', mostra);
      barra.setAttribute('aria-hidden', String(!mostra));
      $('a', barra).tabIndex = mostra ? 0 : -1;
    };
    new IntersectionObserver(([v]) => { inConfiguratore = v.isIntersecting; aggiornaBarra(); }).observe($('#configuratore'));
    new IntersectionObserver(([v]) => { inRiepilogo = v.isIntersecting; aggiornaBarra(); }, { threshold: 0.15 }).observe($('#riepilogo'));
  }

  /* ---------- Avvio ---------- */
  riempiTesti();
  disegnaApertura();
  disegnaCatalogo();
  costruisciModulo();
  applicaStatoAlModulo();
  collegaEventi();
  aggiorna();
  animazioni();
})();
