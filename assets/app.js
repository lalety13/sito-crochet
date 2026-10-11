/* =====================================================================
   LOGICA DEL SITO (catalogo, configuratore, prezzo, riepilogo)
   ===================================================================== */
(function () {
  'use strict';

  const S = window.IMPOSTAZIONI;
  const D = window.DisegnoBorse;
  if (!S || !D) {
    document.body.insertAdjacentHTML(
      'afterbegin',
      '<p style="padding:1rem;background:#fde8e4;color:#7a2e22;font-family:sans-serif">Errore: il file impostazioni.js non è stato letto correttamente.</p>'
    );
    return;
  }

  const N = S.negozio || {};
  const esc = D.esc || ((s) => s);
  const $ = (s, el) => (el \vert{}\vert{} document).querySelector(s);   const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const trova = (lista, id) => (lista || []).find((x) => x.id === id);
  const euro = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' });
  const prezzo = (n) => euro.format(Number(n) || 0);
  const extra = (n) => (Number(n) > 0 ? '+ ' + prezzo(n) : '');
  const riduciMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const utenteIG = String(N.instagramUtente || '').replace(/^@/, '').trim();
  const linkProfilo = 'https://www.instagram.com/' + encodeURIComponent(utenteIG) + '/';
  const linkChat = N.linkOrdinePersonalizzato || 'https://ig.me/m/' + encodeURIComponent(utenteIG);

  function urlFoto(src, larghezza) {
    if (!src) return '';
    const locale = location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(location.hostname);
    if (/^https?:\/\//.test(src) || locale) return src;
    const percorso = '/' + String(src).replace(/^\/+/, '');
    return '/.netlify/images?url=' + encodeURIComponent(percorso) + '&w=' + larghezza + '&fm=webp&q=80';
  }

  /* ---------- Stato protetto al 100% da array vuoti ---------- */
  const statoIniziale = () => {
    const primoModello = (S.modelli && S.modelli.length > 0) ? S.modelli[0] : { id: '', coloreIniziale: '' };
    const primoFilato = (S.coloriFilato && S.coloriFilato.length > 0) ? S.coloriFilato[0] : { id: '' };
    const primoManico = (S.manici && S.manici.tipi && S.manici.tipi.length > 0) ? S.manici.tipi[0] : { id: '' };
    const primaTracolla = (S.tracolle && S.tracolle.length > 0) ? S.tracolle[0] : { id: '' };

    return {
      modello: primoModello.id,
      filato: primoModello.coloreIniziale || primoFilato.id,
      maniciTipo: primoManico.id,
      tracolla: primaTracolla.id,
      accessori: [],
      iniziali: '',
      note: '',
      vista: 'illustrazione',
    };
  };
  let stato = statoIniziale();

  function coloreFilato() {
    const c = trova(S.coloriFilato, stato.filato);
    return c && c.colore && c.colore !== 'transparent' ? c.colore : '#F4EBDD';
  }
  
  function tipoManici() { 
    return trova(S.manici && S.manici.tipi, stato.maniciTipo) || (S.manici && S.manici.tipi ? S.manici.tipi[0] : null); 
  }

  function opzioniDisegno(st, modello) {
    const salvato = stato;
    stato = st;
    const tr = trova(S.tracolle, st.tracolla);
    const tm = tipoManici();
    const o = {
      forma: modello.forma,
      titolo: modello.nome,
      coloreFilato: coloreFilato(),
      manico: tm ? { stile: tm.stile, colore: coloreFilato() } : null,
      tracolla: tr && tr.stile ? { stile: tr.stile, colore: coloreFilato() } : null,
      accessori: (st.accessori || [])
        .map((id) => trova(S.accessori, id))
        .filter(Boolean)
        .map((a) => ({ tipo: a.tipo, colore: coloreFilato() })),
    };
    stato = salvato;
    return o;
  }

  function calcola() {
    const primoModelloFallback = (S.modelli && S.modelli.length > 0) ? S.modelli[0] : { nome: 'Borsa', prezzoBase: 30 };
    const m = trova(S.modelli, stato.modello) || primoModelloFallback;
    const voci = [];
    const aggiungi = (gruppo, voce) => voci.push({ gruppo, nome: voce.nome, prezzo: Number(voce.prezzoExtra) || 0 });

    voci.push({ gruppo: 'Modello', nome: m.nome, prezzo: 0 });
    const filato = trova(S.coloriFilato, stato.filato);
    if (filato) aggiungi('Colore filato', filato);
    
    const tm = tipoManici();
    if (tm) aggiungi('Manici', tm);
    
    const tr = trova(S.tracolle, stato.tracolla);
    if (tr) aggiungi('Tracolla', tr);

    const acc = (stato.accessori || []).map((id) => trova(S.accessori, id)).filter(Boolean);
    if (acc.length) acc.forEach((a) => aggiungi('Accessorio', a));

    const base = Number(m.prezzoBase) || 0;
    const totaleExtra = voci.reduce((s, v) => s + v.prezzo, 0);
    return { modello: m, base, voci, extra: totaleExtra, totale: base + totaleExtra };
  }

  function testoOrdine(r) {
    const righe = [`Ciao ${N.nome || 'Negoziante'}! Vorrei ordinare questa borsa personalizzata:`, ''];
    r.voci.forEach((v) => righe.push(`• ${v.gruppo}: ${v.nome}${v.prezzo > 0 ? ` (+${prezzo(v.prezzo)})` : ''}`));
    if (stato.note) righe.push('', `Note: ${stato.note}`);
    righe.push('', `Prezzo base: ${prezzo(r.base)}`, `Extra: ${prezzo(r.extra)}`, `TOTALE: ${prezzo(r.totale)}`, '', 'Grazie!');
    return righe.join('\n');
  }

  function riempiTesti() {
    $$('[data-brand]').forEach((el) => { el.textContent = N.nome \vert{}\vert{} ''; });$$
('[data-slogan]').forEach((el) => { el.textContent = N.slogan || ''; });
    $$('[data-presentazione]').forEach((el) => { el.textContent = N.presentazione \vert{}\vert{} ''; });$$
('[data-tempi]').forEach((el) => { el.textContent = N.tempiRealizzazione || ''; });
    $$('[data-nota-prezzi]').forEach((el) => { el.textContent = N.notaPrezzi \vert{}\vert{} ''; });$$
('[data-ig-profilo]').forEach((el) => { el.href = linkProfilo; });
    
    const btnOrdina = $('#pulsante-ordina');
    if (btnOrdina) btnOrdina.href = linkChat;
    document.title = `${N.nome || 'Borse'} — Uncinetto`;

    const listaDomande = $('#lista-domande');
    if (listaDomande && S.domande) {
      listaDomande.innerHTML = S.domande
        .map((d) => `<details class="domanda rivela"><summary>${esc(d.domanda)}</summary><p>${esc(d.risposta)}</p></details>`)
        .join('');
    }
  }

  function disegnaApertura() {
    const contenitoreApertura = $('#apertura-borse');
    if (!contenitoreApertura || !S.modelli || S.modelli.length === 0) return;
    const m = S.modelli[0];
    const st = Object.assign(statoIniziale(), { modello: m.id });
    contenitoreApertura.innerHTML = `<div class="apertura__borsa">${D.disegnaBorsa(opzioniDisegno(st, m))}</div>`;
  }

  function disegnaCatalogo() {
    const griglia = $('#griglia-modelli');
    if (!griglia || !S.modelli) return;
    griglia.innerHTML = S.modelli
      .map((m) => {
        const st = Object.assign(statoIniziale(), { modello: m.id, filato: m.coloreIniziale || (S.coloriFilato[0] ? S.coloriFilato[0].id : '') });
        const immagine = D.disegnaBorsa(opzioniDisegno(st, m));
        return `<article class="modello rivela">
          <div class="modello__immagine">${immagine}</div>
          <div class="modello__testo">
            <p class="modello__tipo">${esc(m.tipologia || '')}</p>
            <h3>${esc(m.nome)}</h3>
            <div class="modello__piede">
              <p class="modello__prezzo"><span>a partire da</span> ${prezzo(m.prezzoBase)}</p>
              <button type="button" class="pulsante pulsante--pieno" data-personalizza="${esc(m.id)}">Personalizza la tua borsa</button>
            </div>
          </div>
        </article>`;
      })
      .join('');
  }

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
          const st = Object.assign(statoIniziale(), { modello: m.id });
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
        `<div class="scelte">${S.manici.tipi.map((t) => scelta('radio', 'maniciTipo', t)).join('')}</div>`));
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

    parti.push(gruppo(++n, 'Note per me <span class="facoltativo">facoltativo</span>',
      `<textarea name="note" id="campo-note" rows="3" maxlength="400" placeholder="Scrivi qui eventuali richieste speciali."></textarea>`));

    formConfig.innerHTML = parti.join('');
  }

  function applicaStatoAlModulo() {
    const form = $('#form-config');     if (!form) return;     const imposta = (nome, valore) => {       $$(`input[name="${nome}"]`, form).forEach((i) => { i.checked = i.value === valore; });
    };
    imposta('modello', stato.modello);
    imposta('filato', stato.filato);
    imposta('maniciTipo', stato.maniciTipo);
    imposta('tracolla', stato.tracolla);
    $$('input[name="accessori"]', form).forEach((i) => { i.checked = (stato.accessori || []).includes(i.value); });
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
    stato.tracolla = prendi('tracolla', stato.tracolla);
    stato.accessori = fd.getAll('accessori').map(String);
    stato.note = String(fd.get('note') || '').trim();
  }

  function aggiorna() {
    const r = calcola();
    const m = r.modello;
    const filato = trova(S.coloriFilato, stato.filato);

    const nomeFilato = $('#nome-filato');
    if (nomeFilato) nomeFilato.textContent = filato ? filato.nome : '';

    const tela = $('#anteprima');
    if (tela) {
      tela.innerHTML = D.disegnaBorsa(opzioniDisegno(stato, m));
    }

    const anteprimaNome = $('#anteprima-nome');
    if (anteprimaNome) anteprimaNome.textContent = `${m.nome} · ${filato ? filato.nome : ''}`;

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
    ['#conto-totale', '#barra-totale', '#riepilogo-totale'].forEach(sel => {
      const el = $(sel);
      if (el) el.textContent = totale;
    });

    const riepilogoLista = $('#riepilogo-lista');
    if (riepilogoLista) {
      riepilogoLista.innerHTML =
        r.voci.map((v) => {
          const costo = v.gruppo === 'Modello' ? prezzo(r.base) : extra(v.prezzo);
          return `<li><span>${esc(v.gruppo)}</span><strong>${esc(v.nome)}</strong><em>${costo}</em></li>`;
        }).join('') +
        (stato.note ? `<li><span>Note</span><strong>${esc(stato.note)}</strong><em></em></li>` : '');
    }

    const riepilogoTesto = $('#riepilogo-testo');
    if (riepilogoTesto) riepilogoTesto.value = testoOrdine(r);
  }

  function copia(testo) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(testo).then(() => true, () => false);
    }
    return Promise.resolve(false);
  }

  function avviso(testo) {
    const el = $('#avviso');
    if (!el) return;
    el.textContent = testo;
    el.classList.add('visibile');
    setTimeout(() => el.classList.remove('visibile'), 4200);
  }

  function collegaEventi() {
    const form = $('#form-config');
    if (form) {
      form.addEventListener('change', () => { leggiModulo(); aggiorna(); });
      form.addEventListener('input', (e) => {
        if (e.target.name === 'note') { leggiModulo(); aggiorna(); }
      });
      form.addEventListener('submit', (e) => e.preventDefault());
    }

    const grigliaModelli = $('#griglia-modelli');
    if (grigliaModelli) {
      grigliaModelli.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-personalizza]');
        if (!btn) return;
        const m = trova(S.modelli, btn.dataset.personalizza);
        if (!m) return;
        stato.modello = m.id;
        applicaStatoAlModulo();
        aggiorna();
        const conf = $('#configuratore');
        if (conf) conf.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    const btnCopia = $('#pulsante-copia');
    if (btnCopia) {
      btnCopia.addEventListener('click', () => {
        const riepilogoTesto = $('#riepilogo-testo');
        if (!riepilogoTesto) return;
        copia(riepilogoTesto.value).then((ok) => {
          avviso(ok ? 'Riepilogo copiato ✓' : 'Copia non riuscita.');
        });
      });
    }

    const btnOrdina = $('#pulsante-ordina');
    if (btnOrdina) {
      btnOrdina.addEventListener('click', () => {
        const riepilogoTesto = $('#riepilogo-testo');
        if (!riepilogoTesto) return;
        copia(riepilogoTesto.value);
      });
    }
  }

  /* ---------- Avvio ---------- */
  riempiTesti();
  disegnaApertura();
  disegnaCatalogo();
  costruisciModulo();
  applicaStatoAlModulo();
  collegaEventi();
  aggiorna();
})();
