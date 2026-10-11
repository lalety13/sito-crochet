/* =====================================================================
   DISEGNO DELLE BORSE (anteprima illustrata a livelli)
   Non serve modificare questo file: colori, manici e accessori si
   cambiano da impostazioni.js. Ogni scelta della cliente corrisponde
   a un livello SVG che viene ridisegnato davvero.
   ===================================================================== */
(function () {
  'use strict';

  let contatore = 0;

  // Geometria di ciascuna forma (viewBox 400 × 460)
  const FORME = {
    tote: {
      corpo: 'M78 178 H322 Q336 178 338 192 L358 404 Q361 432 333 432 H67 Q39 432 42 404 L62 192 Q64 178 78 178 Z',
      bordoY: 178, bordoH: 28, base: 432, ombra: 160,
      manico: { ax: 130, bx: 270, y: 186, picco: 46 },
      tracolla: { ax: 66, bx: 334, y: 200 },
      pos: {
        fiocco: [292, 368], fiore: [108, 368], iniziali: [200, 330], chiusura: [200, 192],
        perle: [76, 324, 216],
      },
    },
    secchiello: {
      corpo: 'M96 196 H304 Q318 196 319 210 L332 372 Q336 440 200 440 Q64 440 68 372 L81 210 Q82 196 96 196 Z',
      bordoY: 196, bordoH: 28, base: 440, ombra: 140, cordino: true,
      manico: { ax: 126, bx: 274, y: 204, picco: 66 },
      tracolla: { ax: 84, bx: 316, y: 214 },
      pos: {
        fiocco: [282, 352], fiore: [118, 352], iniziali: [200, 320], chiusura: [262, 210],
        perle: [96, 304, 234],
      },
    },
    mezzaluna: {
      corpo: 'M50 240 H350 Q358 240 357 252 Q348 432 200 432 Q52 432 43 252 Q42 240 50 240 Z',
      bordoY: 240, bordoH: 26, base: 432, ombra: 130,
      manico: { ax: 122, bx: 278, y: 248, picco: 84 },
      tracolla: { ax: 52, bx: 348, y: 252 },
      pos: {
        fiocco: [268, 362], fiore: [132, 362], iniziali: [200, 318], chiusura: [200, 253],
        perle: [62, 338, 276],
      },
    },
  };

  const SPESSORE_MANICO = { uncinetto: 15, ecopelle: 11, bambu: 14, perline: 14 };
  const SPESSORE_TRACOLLA = { uncinetto: 9, ecopelle: 7, catena: 5 };

  function esc(t) {
    return String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function luminosita(hex) {
    let h = String(hex || '').replace('#', '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    if (h.length !== 6) return 0.8;
    const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }

  function percorsoManico(m, dx, dy) {
    const ax = m.ax + dx, bx = m.bx + dx, y = m.y + dy, p = m.picco + dy;
    return `M${ax} ${y} C ${ax - 12} ${p}, ${bx + 12} ${p}, ${bx} ${y}`;
  }

  function percorsoTracolla(t) {
    return `M${t.ax} ${t.y} C ${t.ax - 34} -130, ${t.bx + 34} -130, ${t.bx} ${t.y}`;
  }

  // Disegna un manico o una tracolla nello stile richiesto
  function cordone(d, stile, colore, s) {
    const base = `d="${d}" fill="none"`;
    switch (stile) {
      case 'ecopelle':
        return `<path ${base} stroke="${colore}" stroke-width="${s}" stroke-linecap="round"/>
          <path ${base} stroke="#000" stroke-opacity=".12" stroke-width="${s}" stroke-linecap="round" transform="translate(0 1.5)" style="mix-blend-mode:multiply"/>
          <path ${base} stroke="#fff" stroke-opacity=".6" stroke-width="1.3" stroke-dasharray="5 4"/>`;
      case 'bambu':
        return `<path ${base} stroke="${colore}" stroke-width="${s}" stroke-linecap="round"/>
          <path ${base} stroke="#5b4026" stroke-opacity=".35" stroke-width="${s + 1}" stroke-dasharray="2.5 26"/>
          <path ${base} stroke="#fff" stroke-opacity=".3" stroke-width="${s * 0.3}" stroke-linecap="round"/>`;
      case 'perline':
        return `<path ${base} stroke="${colore}" stroke-width="${s}" stroke-linecap="round" stroke-dasharray="0.01 ${s + 2}"/>
          <path ${base} stroke="#000" stroke-opacity=".12" stroke-width="${s}" stroke-linecap="round" stroke-dasharray="0.01 ${s + 2}" transform="translate(1.5 1.5)"/>
          <path ${base} stroke="#fff" stroke-opacity=".65" stroke-width="${s * 0.3}" stroke-linecap="round" stroke-dasharray="0.01 ${s + 2}" transform="translate(-2 -2)"/>`;
      case 'catena':
        return `<path ${base} stroke="${colore}" stroke-width="${s}" stroke-linecap="round" stroke-dasharray="7 5"/>
          <path ${base} stroke="#fff" stroke-opacity=".55" stroke-width="${s * 0.35}" stroke-linecap="round" stroke-dasharray="7 5"/>`;
      default: // uncinetto
        return `<path ${base} stroke="${colore}" stroke-width="${s}" stroke-linecap="round"/>
          <path ${base} stroke="#000" stroke-opacity=".16" stroke-width="${s}" stroke-dasharray="2 5"/>
          <path ${base} stroke="#fff" stroke-opacity=".24" stroke-width="${s * 0.4}" stroke-dasharray="4 3"/>`;
    }
  }

  function fiocco(x, y, c) {
    const bordo = 'stroke="#000" stroke-opacity=".14" stroke-width="1.2"';
    return `<g class="liv-acc" transform="translate(${x} ${y})">
      <path d="M-4 4 L-22 44 L-12 41 L-8 49 L3 8 Z" fill="${c}" ${bordo}/>
      <path d="M4 4 L22 44 L12 41 L8 49 L-3 8 Z" fill="${c}" ${bordo}/>
      <path d="M0 0 C-12 -26 -44 -26 -42 0 C-44 26 -12 26 0 0 Z" fill="${c}" ${bordo}/>
      <path d="M0 0 C12 -26 44 -26 42 0 C44 26 12 26 0 0 Z" fill="${c}" ${bordo}/>
      <path d="M-5 0 C-14 -13 -31 -13 -31 0 C-31 13 -14 13 -5 0 Z" fill="#000" fill-opacity=".1"/>
      <path d="M5 0 C14 -13 31 -13 31 0 C31 13 14 13 5 0 Z" fill="#000" fill-opacity=".1"/>
      <rect x="-8" y="-11" width="16" height="22" rx="6" fill="${c}" ${bordo}/>
      <rect x="-5" y="-8" width="5" height="16" rx="2.5" fill="#fff" fill-opacity=".3"/>
    </g>`;
  }

  function fiore(x, y, c, centro) {
    let petali = '';
    for (let i = 0; i < 6; i++) {
      const a = ((i * 60 - 90) * Math.PI) / 180;
      petali += `<ellipse cx="${(Math.cos(a) * 15).toFixed(1)}" cy="${(Math.sin(a) * 15).toFixed(1)}" rx="10" ry="12.5" transform="rotate(${i * 60} ${(Math.cos(a) * 15).toFixed(1)} ${(Math.sin(a) * 15).toFixed(1)})" fill="${c}" stroke="#000" stroke-opacity=".18" stroke-width="1.2"/>`;
    }
    return `<g class="liv-acc" transform="translate(${x} ${y})">${petali}
      <circle r="9" fill="${centro || '#E5B95C'}"/>
      <circle r="6" fill="none" stroke="#000" stroke-opacity=".18" stroke-dasharray="1.5 2"/>
    </g>`;
  }

  function perle(x1, x2, y, c) {
    let s = '';
    for (let x = x1; x <= x2; x += 15) {
      s += `<circle cx="${x}" cy="${y}" r="5.4" fill="${c}" stroke="#000" stroke-opacity=".18"/>
        <circle cx="${x - 1.7}" cy="${y - 1.8}" r="1.7" fill="#fff"/>`;
    }
    return `<g class="liv-acc">${s}</g>`;
  }

  function nappina(x, y, c) {
    let fili = '';
    for (let i = -6; i <= 6; i += 2) {
      fili += `<path d="M${i * 0.8} 28 Q ${i * 1.1} 52 ${i * 1.6} 76" stroke="${c}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    }
    return `<g class="liv-acc" transform="translate(${x} ${y})">
      <path d="M0 0 V18" stroke="${c}" stroke-width="2.6"/>
      <circle cy="20" r="5" fill="${c}"/>
      ${fili}
      <path d="M-6 28 Q0 80 6 28" fill="#000" fill-opacity=".08"/>
      <rect x="-8" y="25" width="16" height="7" rx="3" fill="${c}"/>
      <rect x="-8" y="25" width="16" height="7" rx="3" fill="#000" fill-opacity=".2"/>
    </g>`;
  }

  function ciondolo(x, y, c) {
    return `<g class="liv-acc" transform="translate(${x} ${y})">
      <path d="M0 0 V32" stroke="${c}" stroke-width="2.2" stroke-dasharray="3 2"/>
      <circle cy="36" r="4.5" fill="none" stroke="${c}" stroke-width="2.2"/>
      <path transform="translate(0 56) scale(1.5)" d="M0 7 C -13 -2, -8 -14, 0 -7 C 8 -14, 13 -2, 0 7 Z" fill="${c}" stroke="#000" stroke-opacity=".15"/>
      <ellipse cx="-5" cy="49" rx="2.5" ry="4" fill="#fff" fill-opacity=".55" transform="rotate(-30 -5 49)"/>
    </g>`;
  }

  function bottone(x, y, c) {
    return `<g class="liv-acc" transform="translate(${x} ${y})">
      <circle r="11" fill="${c}" stroke="#000" stroke-opacity=".2"/>
      <circle r="7.5" fill="none" stroke="#000" stroke-opacity=".15"/>
      <circle cx="-2.6" cy="-2.6" r="1.6" fill="#3b2c22" fill-opacity=".6"/>
      <circle cx="2.6" cy="-2.6" r="1.6" fill="#3b2c22" fill-opacity=".6"/>
      <circle cx="-2.6" cy="2.6" r="1.6" fill="#3b2c22" fill-opacity=".6"/>
      <circle cx="2.6" cy="2.6" r="1.6" fill="#3b2c22" fill-opacity=".6"/>
    </g>`;
  }

  /**
   * Restituisce l'SVG della borsa.
   * o = { forma, coloreFilato, manico:{stile,colore}, tracolla:{stile,colore}|null,
   *       accessori:[{tipo,colore,coloreCentro}], chiusura:{tipo,colore}|null,
   *       iniziali:"", titolo:"" }
   */
  function disegnaBorsa(o) {
    const f = FORME[o.forma] || FORME.tote;
    const id = 'borsa' + ++contatore;
    const c = o.coloreFilato || '#F4EBDD';
    const p = f.pos;
    const manico = o.manico || { stile: 'uncinetto', colore: c };
    const sm = SPESSORE_MANICO[manico.stile] || 15;
    const acc = {};
    (o.accessori || []).forEach((a) => { acc[a.tipo] = a; });
    const yBordo = f.bordoY + f.bordoH / 2;
    const out = [];

    out.push(`<defs>
      <pattern id="${id}-m" width="12" height="10" patternUnits="userSpaceOnUse">
        <path d="M1 2 Q6 9.5 11 2" fill="none" stroke="#000" stroke-opacity=".13" stroke-width="1.6"/>
        <path d="M2.2 1.4 Q6 6.4 9.8 1.4" fill="none" stroke="#fff" stroke-opacity=".24" stroke-width="1.2"/>
      </pattern>
      <linearGradient id="${id}-o" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stop-color="#fff" stop-opacity=".2"/>
        <stop offset=".45" stop-color="#fff" stop-opacity="0"/>
        <stop offset="1" stop-color="#000" stop-opacity=".16"/>
      </linearGradient>
      <linearGradient id="${id}-v" x1="0" x2="0" y1="0" y2="1">
        <stop offset=".55" stop-color="#000" stop-opacity="0"/>
        <stop offset="1" stop-color="#000" stop-opacity=".14"/>
      </linearGradient>
      <clipPath id="${id}-c"><path d="${f.corpo}"/></clipPath>
    </defs>`);

    // Ombra a terra
    out.push(`<ellipse cx="200" cy="${f.base + 12}" rx="${f.ombra}" ry="9" fill="#6E5444" fill-opacity=".13"/>`);

    // Livello: tracolla (dietro la borsa)
    if (o.tracolla && o.tracolla.stile) {
      out.push(`<g class="liv-tracolla">${cordone(percorsoTracolla(f.tracolla), o.tracolla.stile, o.tracolla.colore, SPESSORE_TRACOLLA[o.tracolla.stile] || 7)}</g>`);
    }

    // Livello: manico posteriore
    out.push(`<g class="liv-manico" style="filter:brightness(.8)">${cordone(percorsoManico(f.manico, 12, -8), manico.stile, manico.colore, sm)}</g>`);

    // Livello: corpo all'uncinetto
    out.push(`<path d="${f.corpo}" fill="${c}"/>`);
    let interno = `<rect width="400" height="460" fill="url(#${id}-m)"/>
      <rect x="0" y="${f.bordoY}" width="400" height="${f.bordoH}" fill="#000" fill-opacity=".07"/>
      <line x1="0" x2="400" y1="${f.bordoY + f.bordoH}" y2="${f.bordoY + f.bordoH}" stroke="#000" stroke-opacity=".14" stroke-width="1.5" stroke-dasharray="3 3"/>`;
    if (f.cordino) {
      interno += `<line x1="0" x2="400" y1="${yBordo}" y2="${yBordo}" stroke="${manico.colore}" stroke-width="4.5" stroke-dasharray="16 9" stroke-linecap="round"/>`;
    }
    if (o.chiusura && o.chiusura.tipo === 'zip') {
      interno += `<line x1="0" x2="400" y1="${yBordo}" y2="${yBordo}" stroke="${o.chiusura.colore}" stroke-width="6"/>
        <line x1="0" x2="400" y1="${yBordo}" y2="${yBordo}" stroke="#fff" stroke-opacity=".5" stroke-width="3" stroke-dasharray="1.5 2"/>`;
    }
    interno += `<rect width="400" height="460" fill="url(#${id}-o)"/><rect width="400" height="460" fill="url(#${id}-v)"/>`;
    out.push(`<g clip-path="url(#${id}-c)">${interno}</g>`);
    out.push(`<path d="${f.corpo}" fill="none" stroke="#000" stroke-opacity=".1" stroke-width="1.5"/>`);

    // Coulisse del secchiello con pompon
    if (f.cordino) {
      const pom = (x, y) => `<circle cx="${x}" cy="${y}" r="10" fill="${manico.colore}"/><circle cx="${x}" cy="${y}" r="10" fill="url(#${id}-m)"/><circle cx="${x}" cy="${y}" r="10" fill="none" stroke="#000" stroke-opacity=".12"/>`;
      out.push(`<g><path d="M200 ${yBordo} q -6 30 -16 56 M200 ${yBordo} q 6 30 16 56" fill="none" stroke="${manico.colore}" stroke-width="4" stroke-linecap="round"/>
        <path d="M200 ${yBordo} q -6 30 -16 56 M200 ${yBordo} q 6 30 16 56" fill="none" stroke="#000" stroke-opacity=".15" stroke-width="4" stroke-dasharray="2 3"/>
        ${pom(184, yBordo + 62)}${pom(216, yBordo + 62)}</g>`);
    }

    // Livello: chiusura
    if (o.chiusura && o.chiusura.tipo === 'bottone') out.push(bottone(p.chiusura[0], p.chiusura[1], o.chiusura.colore));
    if (o.chiusura && o.chiusura.tipo === 'zip') {
      const zx = (f.manico.ax + f.manico.bx) / 2 + 40;
      out.push(`<g class="liv-acc"><rect x="${zx - 4}" y="${yBordo - 5}" width="8" height="10" rx="2" fill="${o.chiusura.colore}"/>
        <path d="M${zx} ${yBordo + 4} v18" stroke="${o.chiusura.colore}" stroke-width="5" stroke-linecap="round"/>
        <circle cx="${zx}" cy="${yBordo + 22}" r="3" fill="#fff" fill-opacity=".6"/></g>`);
    }

    // Livelli: accessori sul corpo
    if (acc.perle) out.push(perle(p.perle[0], p.perle[1], p.perle[2], acc.perle.colore));
    if (acc.fiore) out.push(fiore(p.fiore[0], p.fiore[1], acc.fiore.colore, acc.fiore.coloreCentro));
    if (o.iniziali) {
      const colTesto = luminosita(c) > 0.62 ? '#7A5640' : '#FBF6EE';
      out.push(`<text class="liv-acc" x="${p.iniziali[0]}" y="${p.iniziali[1]}" text-anchor="middle" dominant-baseline="middle"
        font-family="'Great Vibes', 'Brush Script MT', cursive" font-size="52" fill="${colTesto}" stroke="#000" stroke-opacity=".08">${esc(o.iniziali)}</text>`);
    }
    if (acc.fiocco) out.push(fiocco(p.fiocco[0], p.fiocco[1], acc.fiocco.colore));

    // Livello: manico anteriore
    out.push(`<g class="liv-manico">${cordone(percorsoManico(f.manico, 0, 0), manico.stile, manico.colore, sm)}</g>`);

    // Livelli: accessori appesi ai manici
    if (acc.nappina) out.push(nappina(f.manico.ax, f.manico.y + 2, acc.nappina.colore));
    if (acc.ciondolo) out.push(ciondolo(f.manico.bx, f.manico.y + 2, acc.ciondolo.colore));

    return `<svg viewBox="0 0 400 460" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(o.titolo || 'Illustrazione della borsa')}">${out.join('')}</svg>`;
  }

  window.DisegnoBorse = { disegnaBorsa, forme: Object.keys(FORME), esc };
})();
