/* Chapter 7: Safety Equipment (part 1): rules, lifejackets, beacons, flares */
(function () {
  const A = SR.art, C = A.C;
  const { sky, caption, rounds, wrap } = SR.share;
  const P = [];

  /* ---------- gear drawings (front views, origin at centre) ---------- */
  function lifejacket(parent, x, y, s, kind) {
    const g = A.g(parent, { transform: `translate(${x},${y}) scale(${s || 1})` });
    const col = kind === '50S' ? '#24477A' : kind === '50' ? '#F2D21B' : C.orange;
    const dk = kind === '50S' ? '#162C4C' : kind === '50' ? '#B89A0C' : '#A84F17';
    A.path(g, 'M -10 -92 Q -36 -100 -52 -94 Q -82 -30 -72 66 L -10 72 Z', { fill: col, stroke: dk, 'stroke-width': 3, 'stroke-linejoin': 'round' });
    A.path(g, 'M 10 -92 Q 36 -100 52 -94 Q 82 -30 72 66 L 10 72 Z', { fill: col, stroke: dk, 'stroke-width': 3, 'stroke-linejoin': 'round' });
    if (kind === '100') A.path(g, 'M -54 -96 Q -60 -146 0 -150 Q 60 -146 54 -96 Q 30 -110 0 -110 Q -30 -110 -54 -96 Z', { fill: col, stroke: dk, 'stroke-width': 3, 'stroke-linejoin': 'round' });
    if (kind !== '50S') { A.rect(g, -64, -56, 44, 12, { rx: 3, fill: '#E4E9EE' }); A.rect(g, 20, -56, 44, 12, { rx: 3, fill: '#E4E9EE' }); }
    [0, 36].forEach(yy => { A.rect(g, -74, yy - 6, 148, 12, { rx: 4, fill: '#1B232C' }); A.rect(g, -12, yy - 10, 24, 20, { rx: 4, fill: '#596470' }); });
    if (kind === '100') { A.circle(g, 46, -80, 6, { fill: '#E9EEF2' }); A.line(g, 46, -86, 46, -100, { stroke: '#1B232C', 'stroke-width': 3 }); }
    return g;
  }
  function epirb(parent, x, y, s, o) {
    o = o || {};
    const g = A.g(parent, { transform: `translate(${x},${y}) scale(${s || 1})` });
    A.line(g, 0, -60, 0, -150, { stroke: '#1B232C', 'stroke-width': 5, 'stroke-linecap': 'round' });
    A.path(g, 'M -34 -40 Q -34 -66 0 -66 Q 34 -66 34 -40 L 34 70 Q 34 84 20 84 L -20 84 Q -34 84 -34 70 Z', { fill: '#F2C21B', stroke: '#9A7A10', 'stroke-width': 3 });
    const strobe = A.path(g, 'M -18 -62 Q -18 -84 0 -84 Q 18 -84 18 -62 Z', { fill: '#F4F7FA', stroke: '#9AA6B1', 'stroke-width': 2 });
    A.rect(g, -26, -20, 52, 50, { rx: 6, fill: '#1B232C' });
    A.text(g, 0, 2, '406', { size: 18, weight: 700, fill: C.buoy, anchor: 'middle' });
    A.text(g, 0, 22, 'EPIRB', { size: 13, weight: 700, fill: '#fff', anchor: 'middle', ls: '0.1em' });
    A.rect(g, -14, 46, 28, 16, { rx: 4, fill: C.port });
    g.strobe = strobe;
    return g;
  }
  function plb(parent, x, y, s) {
    const g = A.g(parent, { transform: `translate(${x},${y}) scale(${s || 1})` });
    A.line(g, 18, -46, 18, -110, { stroke: '#1B232C', 'stroke-width': 4, 'stroke-linecap': 'round' });
    A.rect(g, -26, -50, 52, 100, { rx: 12, fill: C.orange, stroke: '#A84F17', 'stroke-width': 3 });
    A.rect(g, -18, -36, 36, 34, { rx: 5, fill: '#1B232C' });
    A.text(g, 0, -14, 'PLB', { size: 14, weight: 700, fill: '#fff', anchor: 'middle', ls: '0.1em' });
    A.circle(g, 0, 24, 9, { fill: C.port, stroke: '#1B232C', 'stroke-width': 2 });
    return g;
  }
  function flare(parent, x, y, s, col) {
    const g = A.g(parent, { transform: `translate(${x},${y}) scale(${s || 1})` });
    A.rect(g, -13, -70, 26, 140, { rx: 6, fill: col === 'orange' ? C.orange : C.port, stroke: '#1B232C', 'stroke-width': 2 });
    A.rect(g, -15, -78, 30, 16, { rx: 4, fill: '#1B232C' });
    A.rect(g, -13, 30, 26, 40, { rx: 4, fill: '#F4EFE3' });
    A.rect(g, -13, -40, 26, 30, { fill: 'rgba(255,255,255,0.85)' });
    return g;
  }
  function evds(parent, x, y, s) {
    const g = A.g(parent, { transform: `translate(${x},${y}) scale(${s || 1})` });
    A.circle(g, 0, 8, 46, { fill: '#F2C21B', stroke: '#9A7A10', 'stroke-width': 3 });
    const lens = A.circle(g, 0, 0, 30, { fill: '#F7FAFC', stroke: '#9AA6B1', 'stroke-width': 3 });
    const glow = A.circle(g, 0, 0, 60, { fill: '#FFFFFF', opacity: 0 });
    g.lens = lens; g.glow = glow;
    return g;
  }
  function radio(parent, x, y, s) {
    const g = A.g(parent, { transform: `translate(${x},${y}) scale(${s || 1})` });
    A.rect(g, -90, -50, 180, 100, { rx: 14, fill: '#1B232C' });
    A.rect(g, -76, -36, 92, 44, { rx: 6, fill: '#A9D7B8' });
    A.text(g, -30, -4, '16', { size: 34, weight: 700, fill: '#1B232C', anchor: 'middle' });
    A.circle(g, 52, -10, 18, { fill: '#3B4F64' });
    A.circle(g, 52, -10, 6, { fill: '#9AA6B1' });
    [-60, -30, 0].forEach(xx => A.rect(g, xx - 12, 22, 24, 12, { rx: 4, fill: '#3B4F64' }));
    A.rect(g, 66, 10, 14, 30, { rx: 4, fill: C.port });
    return g;
  }
  function extinguisher(parent, x, y, s) {
    const g = A.g(parent, { transform: `translate(${x},${y}) scale(${s || 1})` });
    A.rect(g, -30, -60, 60, 140, { rx: 26, fill: C.port, stroke: '#8E2018', 'stroke-width': 3 });
    A.rect(g, -10, -84, 20, 26, { rx: 4, fill: '#1B232C' });
    A.path(g, 'M -10 -80 L -46 -88 L -50 -80 L -12 -70 Z', { fill: '#1B232C' });
    A.path(g, 'M 10 -76 Q 50 -60 40 0', { stroke: '#1B232C', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' });
    A.rect(g, -22, -24, 44, 50, { rx: 6, fill: '#FFFFFF' });
    A.circle(g, 0, -40, 12, { fill: '#F4F7FA', stroke: '#1B232C', 'stroke-width': 2 });
    return g;
  }
  function anchorIcon(parent, x, y, s) {
    const g = A.g(parent, { transform: `translate(${x},${y}) scale(${s || 1})` });
    A.circle(g, 0, -60, 12, { fill: 'none', stroke: '#596470', 'stroke-width': 7 });
    A.line(g, 0, -48, 0, 50, { stroke: '#596470', 'stroke-width': 9, 'stroke-linecap': 'round' });
    A.line(g, -28, -24, 28, -24, { stroke: '#596470', 'stroke-width': 7, 'stroke-linecap': 'round' });
    A.path(g, 'M -52 14 Q -40 56 0 56 Q 40 56 52 14', { stroke: '#596470', 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round' });
    A.path(g, 'M -60 22 L -52 4 L -40 20 Z M 60 22 L 52 4 L 40 20 Z', { fill: '#596470' });
    return g;
  }
  function bucket(parent, x, y, s) {
    const g = A.g(parent, { transform: `translate(${x},${y}) scale(${s || 1})` });
    A.path(g, 'M -40 -30 Q 0 -90 40 -30', { stroke: '#596470', 'stroke-width': 4, fill: 'none' });
    A.path(g, 'M -46 -30 L 46 -30 L 34 50 L -34 50 Z', { fill: C.sea4, stroke: '#1E4A5C', 'stroke-width': 3, 'stroke-linejoin': 'round' });
    A.path(g, 'M 40 -60 Q 90 -40 70 40', { stroke: C.buoy, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' });
    return g;
  }

  /* ---------- coast map: land to the east (right) ---------- */
  const cx = y => 560 + 22 * Math.sin(y / 70) + 10 * Math.sin(y / 23);
  function coast(svg, o) {
    o = o || {};
    const g = A.g(svg);
    A.rect(g, 0, 0, 800, 600, { fill: '#7FB2C4' });
    let band = 'M', land = 'M 800 -10', pts = [];
    for (let y = -10; y <= 610; y += 10) pts.push([cx(y), y]);
    band += pts.map(([x, y]) => `${(x - 72).toFixed(1)} ${y}`).join(' L ') + ' L ' + pts.slice().reverse().map(([x, y]) => `${x.toFixed(1)} ${y}`).join(' L ') + ' Z';
    land += ' L ' + pts.map(([x, y]) => `${x.toFixed(1)} ${y}`).join(' L ') + ' L 800 610 Z';
    const pb = A.path(g, band, { fill: '#B8DDD5' });
    A.path(g, land, { fill: C.land });
    A.path(g, 'M ' + pts.map(([x, y]) => `${x.toFixed(1)} ${y}`).join(' L '), { fill: 'none', stroke: C.sand, 'stroke-width': 10 });
    // river and estuary
    const ry = 400, rx = cx(ry);
    A.path(g, `M ${rx - 4} ${ry - 16} C ${rx + 40} ${ry - 20} ${rx + 60} ${ry - 60} ${rx + 110} ${ry - 56} C ${rx + 170} ${ry - 50} ${rx + 190} ${ry - 10} 820 ${ry - 20} L 820 ${ry + 12} C ${rx + 190} ${ry + 26} ${rx + 160} ${ry + 46} ${rx + 100} ${ry + 30} C ${rx + 60} ${ry + 20} ${rx + 40} ${ry + 14} ${rx - 4} ${ry + 16} Z`, { fill: '#B8DDD5', stroke: '#9AC7BE', 'stroke-width': 2 });
    // harbour
    const hy = 150, hx = cx(hy);
    A.path(g, `M ${hx} ${hy - 50} L ${hx - 46} ${hy - 44} L ${hx - 52} ${hy - 6}`, { fill: 'none', stroke: '#8E8A7E', 'stroke-width': 8, 'stroke-linecap': 'round' });
    A.path(g, `M ${hx} ${hy + 50} L ${hx - 46} ${hy + 44} L ${hx - 52} ${hy + 12}`, { fill: 'none', stroke: '#8E8A7E', 'stroke-width': 8, 'stroke-linecap': 'round' });
    if (o.labels !== false) {
      A.tag(g, 300, 560, 'UNPROTECTED: BEYOND 400 m', { fill: C.deep, size: 15 });
      const t = A.text(g, cx(250) - 36, 250, 'WITHIN 400 m', { size: 14, weight: 700, fill: '#2E6B5E', anchor: 'middle', ls: '0.1em' });
      t.setAttribute('transform', `rotate(-90 ${cx(250) - 36} 250)`);
      A.text(g, rx + 120, ry - 70, 'RIVER', { size: 15, weight: 700, fill: '#5B5440', anchor: 'middle', ls: '0.14em' });
      A.text(g, hx + 30, hy + 5, 'HARBOUR', { size: 15, weight: 700, fill: '#5B5440', ls: '0.14em' });
    }
    g.pb = pb;
    return g;
  }
  const pin = (parent, x, y, col) => {
    const g = A.g(parent, { transform: `translate(${x},${y})` });
    A.path(g, 'M 0 0 C -6 -14 -16 -20 -16 -32 A 16 16 0 0 1 16 -32 C 16 -20 6 -14 0 0 Z', { fill: col || C.port, stroke: '#fff', 'stroke-width': 2.5 });
    A.circle(g, 0, -32, 6, { fill: '#fff' });
    return g;
  };

  /* ===================== PAGES ===================== */

  P.push({
    type: 'learn', title: 'Your safety gear',
    html: `<p>All safety equipment must be in very good condition and <b>accessible at all times</b>. Everyone on board needs to know:</p>
<ul><li><b>where</b> the equipment is stowed</li><li><b>how</b> to use it</li><li><b>when</b> to use it.</li></ul>
<p>Also know when it <b>expires</b>. Flares, EVDS, beacons, extinguishers and inflatable lifejackets all have dates or service intervals.</p>`,
    art(svg, S) {
      A.paperBg(svg);
      const items = [
        [g => lifejacket(g, 0, 10, 0.62, '100'), 'LIFEJACKETS'],
        [g => epirb(g, 0, 20, 0.62), 'BEACON'],
        [g => { flare(g, -18, 10, 0.6, 'red'); flare(g, 18, 10, 0.6, 'orange'); }, 'FLARES'],
        [g => radio(g, 0, 10, 0.62), 'RADIO'],
        [g => extinguisher(g, 0, 10, 0.62), 'EXTINGUISHER'],
        [g => anchorIcon(g, 0, 10, 0.7), 'ANCHOR']
      ];
      items.forEach(([draw, lbl], k) => {
        const x = 160 + (k % 3) * 240, y = 170 + Math.floor(k / 3) * 250;
        const g = A.g(svg, { transform: `translate(${x},${y})` });
        A.rect(g, -98, -98, 200, 210, { rx: 20, fill: 'rgba(18,38,58,0.1)' });
        A.rect(g, -102, -104, 200, 210, { rx: 20, fill: C.white, stroke: C.line, 'stroke-width': 1.5 });
        draw(g);
        A.text(g, -2, 92, lbl, { size: 17, weight: 700, anchor: 'middle', fill: C.ink2, ls: '0.12em' });
        gsap.from(g, { opacity: 0, y: '+=16', duration: 0.5, delay: 0.15 + k * 0.12 });
      });
    }
  });

  P.push({
    type: 'learn', title: 'Stow it within reach',
    html: `<p>As skipper, brief everyone on where the gear is kept. Stow it where it is easily reached, and preferably visible.</p>
<ul><li><b>Lifejackets</b>: ready to use, not locked in a cupboard or under bunks.</li><li><b>Flares and EVDS</b>: dry and accessible, in a waterproof container that floats.</li><li><b>EPIRB</b>: in the cockpit or near the helm.</li><li><b>Extinguisher</b>: near where a fire is likely, but still reachable if one breaks out.</li></ul>`,
    art(svg, S) {
      S.seaBg(svg);
      const b = S.boat(svg, { type: 'motor', len: 560, color: C.sea4, x: 400, y: 300, r: 0, wake: false });
      gsap.to(b, { rotation: 1.2, y: 304, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      const spots = [[250, 300, 'LIFEJACKETS', 120, 190], [300, 260, 'FLARES', 260, 120], [450, 300, 'EPIRB AT HELM', 520, 120], [190, 330, 'EXTINGUISHER', 200, 470]];
      spots.forEach(([x, y, t, tx, ty], k) => {
        const g = A.g(svg);
        A.line(g, x, y, tx, ty, { stroke: C.ink, 'stroke-width': 2.5 });
        A.circle(g, x, y, 9, { fill: C.buoy, stroke: C.ink, 'stroke-width': 2.5 });
        A.tag(g, tx, ty, t, { fill: C.ink, size: 16 });
        gsap.from(g, { opacity: 0, duration: 0.4, delay: 0.3 + k * 0.3 });
      });
    }
  });

  P.push({
    type: 'check', title: 'Ready to grab',
    q: 'Where should the lifejackets on your boat be kept?',
    opts: ['Ready to use and easy to reach', 'Locked in a cupboard below deck', 'Under the bunks, out of the way', 'In the car until they are needed'], a: 0,
    why: 'Lifejackets must be accessible and ready to use, never locked away.'
  });

  P.push({
    type: 'learn', title: 'Protected or unprotected?',
    html: `<p>The gear you must carry depends on where you go.</p>
<p><span class="term">Protected waters</span> are rivers, lakes, estuaries, harbours, and waters within <b>400 metres of the shore</b>. Cambridge Gulf and Lake Argyle are <b>not</b> protected waters.</p>
<p><span class="term">Unprotected waters</span> are everything beyond 400 metres from the shore.</p>`,
    art(svg, S) {
      const g = coast(svg);
      gsap.fromTo(g.pb, { opacity: 0.4 }, { opacity: 1, duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      const wk = A.g(svg); S.wakes(wk);
      const b = S.boat(svg, { len: 46, color: C.port, x: 220, y: 300, r: 0 });
      const st = { t: 0 };
      gsap.to(st, { t: Math.PI * 2, duration: 14, repeat: -1, ease: 'none' });
      S.loop(() => { b.x = 330 + 170 * Math.cos(st.t); b.y = 300 + 140 * Math.sin(st.t); b.rotation = st.t * 180 / Math.PI + 90; });
    }
  });

  P.push({
    type: 'try', title: 'Which waters?',
    html: `<p>Look at each pin. Is the boat in protected or unprotected waters?</p>`,
    lockMsg: 'Answer all six',
    build(svg, S, api) {
      coast(svg);
      const ins = A.g(svg, { transform: 'translate(24,24)' });
      A.rect(ins, 0, 0, 250, 180, { rx: 16, fill: C.white, stroke: C.ink, 'stroke-width': 2 });
      A.text(ins, 16, 28, 'IN THE KIMBERLEY', { size: 15, weight: 700, fill: C.ink2, ls: '0.12em' });
      A.path(ins, 'M 20 170 L 20 60 Q 60 60 80 100 Q 100 140 130 100 L 130 170 Z', { fill: '#7FB2C4' });
      A.text(ins, 75, 160, 'Cambridge Gulf', { font: 'body', size: 13, fill: C.ink, anchor: 'middle' });
      A.path(ins, 'M 160 70 Q 220 56 230 100 Q 236 150 190 140 Q 150 130 160 70 Z', { fill: '#7FB2C4' });
      A.text(ins, 196, 160, 'Lake Argyle', { font: 'body', size: 13, fill: C.ink, anchor: 'middle' });
      const lay = A.g(svg);
      let pn = null;
      rounds(api, S, {
        noun: 'Pin',
        choices: ['Protected', 'Unprotected'],
        items: [
          { x: cx(270) - 32, y: 270, a: 0, why: 'Within 400 m of the shore: protected waters.' },
          { x: 200, y: 330, a: 1, why: 'Well beyond 400 m from shore: unprotected waters.' },
          { x: cx(400) + 110, y: 390, a: 0, why: 'Rivers and estuaries are protected waters.' },
          { x: 24 + 196, y: 24 + 110, a: 1, why: 'Lake Argyle is excluded. Treat it as unprotected waters.' },
          { x: cx(150) - 26, y: 150, a: 0, why: 'Inside a harbour: protected waters.' },
          { x: 24 + 70, y: 24 + 120, a: 1, why: 'Cambridge Gulf is excluded. Treat it as unprotected waters.' }
        ],
        show(it) { if (pn) pn.remove(); pn = pin(lay, it.x, it.y); gsap.from(pn, { y: '-=30', opacity: 0, duration: 0.4, ease: 'bounce.out' }); },
        end: 'Protected means rivers, lakes, estuaries, harbours and within 400 m of shore, except Cambridge Gulf and Lake Argyle.'
      });
    }
  });

  P.push({
    type: 'learn', title: 'Registrable or not?',
    html: `<p>A <span class="term">registrable vessel</span> is any recreational boat that is, or can be, driven by mechanical power. That includes a yacht that normally sails but has a motor.</p>
<p><span class="term">Non-registrable</span> vessels include tenders and sailing dinghies.</p>
<p>The rules for safety gear depend on both things: the type of vessel and the waters.</p>`,
    art(svg, S) {
      S.seaBg(svg);
      const col = (x, h, c) => { A.rect(svg, x - 170, 40, 340, 520, { rx: 22, fill: 'rgba(255,253,248,0.55)' }); A.tag(svg, x, 80, h, { fill: c, size: 18 }); };
      col(210, 'REGISTRABLE', C.ink); col(590, 'NON-REGISTRABLE', C.sea4);
      const bs = [S.boat(svg, { type: 'motor', len: 130, color: C.port, x: 210, y: 190, r: -90, wake: false }), S.boat(svg, { type: 'yacht', len: 150, color: C.sea4, x: 210, y: 400, r: -90, wake: false }),
        S.boat(svg, { type: 'tender', len: 90, color: C.buoy, x: 590, y: 200, r: -90, wake: false }), S.boat(svg, { type: 'yacht', len: 80, color: C.orange, x: 590, y: 400, r: -90, wake: false })];
      bs.forEach((b, k) => gsap.to(b, { rotation: -88 + (k % 2) * 2, duration: 2 + k * 0.3, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
      [[210, 285, 'Motor boat'], [210, 520, 'Yacht with a motor'], [590, 285, 'Tender'], [590, 520, 'Sailing dinghy']].forEach(([x, y, t]) => A.text(svg, x, y, t, { font: 'body', size: 18, anchor: 'middle', fill: C.ink }));
    }
  });

  const GEAR = [['Lifejacket for each person', 'lj'], ['GPS EPIRB, or a worn PLB', 'bc'], ['2 red + 2 orange flares, or EVDS', 'fl'], ['VHF or HF marine radio', 'rd']];
  P.push({
    type: 'learn', title: 'What must you carry?',
    html: `<p>Every boat must carry a <b>lifejacket for each person</b> on board.</p>
<p>In <b>unprotected waters</b> you must also carry a distress beacon and flares (or an EVDS). In protected waters they are recommended.</p>
<p>A registrable boat more than <b>4 nautical miles</b> from shore in unprotected waters must also carry a <b>VHF or HF marine radio</b>.</p>`,
    art(svg, S) {
      A.paperBg(svg);
      const req = (g, x, y, on) => {
        if (on === 'r') return A.tick(g, x, y, 15, true);
        const c = A.g(g); A.circle(c, x, y, 14, { fill: 'none', stroke: C.ink3, 'stroke-width': 3 }); A.text(c, x, y + 5, 'R', { size: 13, weight: 700, anchor: 'middle', fill: C.ink3 }); return c;
      };
      A.rect(svg, 40, 70, 720, 440, { rx: 20, fill: C.white, stroke: C.line, 'stroke-width': 1.5 });
      A.text(svg, 540, 112, 'PROTECTED', { size: 18, weight: 700, anchor: 'middle', fill: '#2E6B5E', ls: '0.08em' });
      A.text(svg, 680, 112, 'UNPROTECTED', { size: 18, weight: 700, anchor: 'middle', fill: C.deep, ls: '0.08em' });
      const rows = [['r', 'r'], ['', 'r'], ['', 'r'], ['', 'r*']];
      GEAR.forEach(([t], k) => {
        const y = 170 + k * 80;
        const g = A.g(svg);
        A.line(g, 60, y - 40, 740, y - 40, { stroke: C.paper3, 'stroke-width': 1.5 });
        A.text(g, 70, y + 7, t, { font: 'body', size: 19, fill: C.ink });
        req(g, 540, y, rows[k][0]);
        req(g, 680, y, rows[k][1].replace('*', ''));
        if (rows[k][1].includes('*')) A.text(g, 680, y + 34, 'beyond 4 nm', { font: 'body', size: 13, anchor: 'middle', fill: C.ink2 });
        gsap.from(g, { opacity: 0, x: -14, duration: 0.4, delay: 0.2 + k * 0.25 });
      });
      A.tick(svg, 230, 545, 12, true); A.text(svg, 250, 551, 'Required', { font: 'body', size: 16, fill: C.ink2 });
      A.circle(svg, 400, 545, 11, { fill: 'none', stroke: C.ink3, 'stroke-width': 3 }); A.text(svg, 420, 551, 'Recommended', { font: 'body', size: 16, fill: C.ink2 });
    }
  });

  P.push({
    type: 'watch', title: 'Heading offshore',
    html: `<p>Watch the list change as the boat heads out to sea.</p>`,
    anim(svg, S) {
      coast(svg, { labels: false });
      A.line(svg, 190, 0, 190, 430, { stroke: '#fff', 'stroke-width': 3, 'stroke-dasharray': '10 8' });
      A.tag(svg, 190, 30, '4 nm', { fill: C.deep, size: 15 });
      A.tag(svg, cx(30) - 72, 30, '400 m', { fill: '#2E6B5E', size: 15 });
      const wk = A.g(svg); S.wakes(wk);
      const b = S.boat(svg, { len: 56, color: C.port, x: 760, y: 392, r: 180 });
      const panel = A.g(svg, { transform: 'translate(24,432)' });
      A.rect(panel, 0, 0, 420, 150, { rx: 16, fill: 'rgba(255,253,248,0.95)', stroke: C.ink, 'stroke-width': 2 });
      const rows = GEAR.map(([t], k) => {
        const y = 30 + k * 32;
        A.text(panel, 18, y + 5, t, { font: 'body', size: 16, fill: C.ink });
        const tg = A.tag(panel, 404, y, k === 0 ? 'REQUIRED' : 'RECOMMENDED', { fill: k === 0 ? C.stbd : C.ink3, size: 12, anchor: 'end' });
        return { tg, y };
      });
      const setReq = (tl, k, at) => { tl.call(() => { rows[k].tg.remove(); rows[k].tg = A.tag(panel, 404, rows[k].y, 'REQUIRED', { fill: C.stbd, size: 12, anchor: 'end' }); gsap.from(rows[k].tg, { scale: 1.4, transformOrigin: '50% 50%', duration: 0.3 }); }, null, at); };
      const cap = caption(svg, 70);
      const tl = gsap.timeline();
      cap.show(tl, 0.2, 'In the river: protected waters.');
      tl.to(b, { x: cx(400) + 20, duration: 3, ease: 'power1.inOut' }, 0.4);
      tl.to(b, { x: cx(400) - 90, y: 360, rotation: 200, duration: 2.6, ease: 'none' }, 3.4);
      cap.show(tl, 5.2, 'Beyond 400 m: unprotected. Beacon and flares now required.');
      setReq(tl, 1, 6); setReq(tl, 2, 6.2);
      tl.to(b, { x: 230, y: 300, rotation: 190, duration: 4, ease: 'none' }, 6);
      cap.show(tl, 10, 'Beyond 4 nm in a registrable boat: a marine radio is required.');
      tl.to(b, { x: 120, y: 280, duration: 1.6, ease: 'power1.out' }, 10);
      setReq(tl, 3, 10.6);
      tl.to({}, { duration: 2.4 });
      return tl;
    }
  });

  P.push({
    type: 'try', title: 'Pack for the trip',
    html: `<p>You are taking a <b>5.5 m registrable boat</b>, 6 nautical miles offshore, with 3 people. Tap everything the law <b>requires</b>, then check.</p>`,
    lockMsg: 'Pack the required gear',
    build(svg, S, api) {
      A.paperBg(svg);
      const items = [
        ['lj', 'Lifejackets', g => lifejacket(g, 0, 10, 0.5, '100'), true],
        ['bc', 'EPIRB', g => epirb(g, 0, 20, 0.5), true],
        ['fl', 'Flares', g => { flare(g, -16, 10, 0.5, 'red'); flare(g, 16, 10, 0.5, 'orange'); }, true],
        ['rd', 'Radio', g => radio(g, 0, 10, 0.55), true],
        ['an', 'Anchor', g => anchorIcon(g, 0, 10, 0.6), false],
        ['fx', 'Extinguisher', g => extinguisher(g, 0, 10, 0.5), false],
        ['bk', 'Bailer', g => bucket(g, 0, 10, 0.6), false],
        ['fr', 'Fishing rods', g => { A.line(g, -40, 60, 40, -70, { stroke: '#596470', 'stroke-width': 5, 'stroke-linecap': 'round' }); A.line(g, -20, 60, 50, -50, { stroke: '#8C97A3', 'stroke-width': 5, 'stroke-linecap': 'round' }); A.circle(g, -26, 36, 10, { fill: '#1B232C' }); }, false]
      ];
      const sel = new Set(); const tiles = {};
      items.forEach(([id, lbl, draw], k) => {
        const x = 110 + (k % 4) * 193, y = 160 + Math.floor(k / 4) * 260;
        const g = A.g(svg, { transform: `translate(${x},${y})`, style: 'cursor:pointer' });
        const bg = A.rect(g, -86, -110, 172, 220, { rx: 18, fill: C.white, stroke: C.line, 'stroke-width': 2 });
        draw(g);
        A.text(g, 0, 96, lbl, { size: 17, weight: 700, anchor: 'middle', fill: C.ink2, ls: '0.06em' });
        const tk = A.tick(g, 62, -86, 14, true); gsap.set(tk, { opacity: 0 });
        tiles[id] = { bg, tk };
        g.addEventListener('click', () => {
          if (api.complete) return;
          if (sel.has(id)) sel.delete(id); else sel.add(id);
          gsap.to(tk, { opacity: sel.has(id) ? 1 : 0, duration: 0.2 });
          bg.setAttribute('stroke', sel.has(id) ? C.stbd : C.line); bg.setAttribute('stroke-width', sel.has(id) ? 4 : 2);
          api.hush();
        });
      });
      const ui = document.createElement('div');
      ui.innerHTML = `<div class="chips"><button class="chip">Check my gear</button></div>`;
      api.task.appendChild(ui);
      ui.querySelector('button').onclick = () => {
        const need = items.filter(i => i[3]).map(i => i[0]);
        const miss = need.filter(i => !sel.has(i));
        const extra = [...sel].filter(i => !need.includes(i));
        const name = id => items.find(i => i[0] === id)[1].toLowerCase();
        if (!miss.length && !extra.length) { ui.remove(); api.done('All four required: lifejackets, a beacon, flares (or EVDS) and, beyond 4 nm, a marine radio. The other gear is recommended, not required.'); return; }
        if (miss.length) api.say(`Something required is missing. Think about unprotected waters beyond 4 nm.`, 'bad');
        else api.say(`The ${extra.map(name).join(', ')} ${extra.length > 1 ? 'are' : 'is'} a good idea, but not required by law. Untick ${extra.length > 1 ? 'them' : 'it'}.`, 'bad');
      };
    }
  });

  P.push({
    type: 'learn', title: 'Lifejacket levels',
    html: `<p>Lifejackets must be approved: <b>AS 4758</b> or <b>ISO 12402</b>.</p>
<ul><li><b>Level 100, 150, 275</b>: head support, turns you face up, high-visibility. For registrable vessels.</li><li><b>Level 50</b>: high-visibility, no head support. For non-registrable vessels, PWCs and sailboards.</li><li><b>Level 50S</b>: like Level 50 but not high-visibility. Popular with water skiers.</li></ul>`,
    art(svg, S) {
      A.paperBg(svg);
      [['100', 'LEVEL 100+', 160], ['50', 'LEVEL 50', 400], ['50S', 'LEVEL 50S', 640]].forEach(([k, l, x], i) => {
        const g = A.g(svg);
        A.rect(g, x - 110, 110, 220, 380, { rx: 20, fill: C.white, stroke: C.line, 'stroke-width': 1.5 });
        const j = lifejacket(g, x, 290, 1.05, k);
        A.text(g, x, 450, l, { size: 24, weight: 700, anchor: 'middle', fill: C.ink, ls: '0.06em' });
        gsap.from(g, { opacity: 0, y: 20, duration: 0.5, delay: 0.2 + i * 0.2 });
        gsap.to(j, { y: '-=6', duration: 1.6 + i * 0.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      });
    }
  });

  P.push({
    type: 'learn', title: 'Wear or carry?',
    html: `<p>In <b>protected waters</b>, carry a Level 100+ lifejacket for each person on a registrable boat.</p>
<p>In <b>unprotected waters</b>, a Level 100+ must be <b>worn</b> by everyone on a boat <b>under 4.8 m</b>, and by every <b>child aged 1 to 12</b> on any boat. On larger boats, adults must carry one each.</p>
<p>On a <b>PWC</b>, everyone must <b>wear</b> at least a Level 50S, on all waters.</p>`,
    art(svg, S) {
      S.seaBg(svg);
      const deck = (x, y, L, wear) => {
        const b = A.boatSide(svg, { len: L, x, y, color: C.sea4, console: L > 260 });
        A.person(b.crew, { x: -L * 0.2, y: -b._h * 0.8, s: 1, vest: wear ? true : null });
        if (!wear) lifejacket(svg, x + L * 0.3, y - b._h * 2.3, 0.36, '100');
      };
      deck(190, 270, 240, true);
      deck(570, 270, 360, false);
      A.waterSide(svg, 274, { opacity: 0.85 });
      A.tag(svg, 190, 350, 'UNDER 4.8 m: WEAR', { fill: C.port, size: 17 });
      A.tag(svg, 570, 350, '4.8 m AND OVER: CARRY', { fill: C.ink, size: 17 });
      A.tag(svg, 400, 470, 'UNPROTECTED WATERS', { fill: C.deep, size: 18 });
      A.text(svg, 400, 520, 'Children 1 to 12 wear one on any boat', { font: 'body', size: 19, anchor: 'middle', fill: C.ink });
    }
  });

  P.push({
    type: 'try', title: 'Must it be worn?',
    html: `<p>Read each situation. Must a lifejacket be worn, or just carried?</p>`,
    lockMsg: 'Answer all six',
    build(svg, S, api) {
      A.paperBg(svg);
      const card = A.g(svg);
      rounds(api, S, {
        noun: 'Situation',
        choices: ['Must be worn', 'Carried is enough'],
        items: [
          { t: 'An adult in a 4.2 m tinny, fishing 1 km offshore.', a: 0, why: 'Under 4.8 m in unprotected waters: a Level 100+ must be worn.' },
          { t: 'An adult on a 6 m boat, 3 km offshore.', a: 1, why: '4.8 m or more: adults must carry a Level 100+. Wearing one is still a great idea.' },
          { t: 'An 8-year-old on a 7 m boat, 2 km offshore.', a: 0, why: 'Children aged 1 to 12 must wear one in unprotected waters, on any boat.' },
          { t: 'An adult in a 4 m boat on the Swan River.', a: 1, why: 'Protected waters: a Level 100+ must be carried for each person.' },
          { t: 'A rider on a PWC in a river.', a: 0, why: 'PWC riders must wear at least a Level 50S on all waters.' },
          { t: 'An adult in a 5 m boat, 200 m off the beach.', a: 1, why: 'Within 400 m of shore is protected waters: carry one each.' }
        ],
        show(it) {
          card.innerHTML = '';
          A.rect(card, 120, 150, 560, 300, { rx: 24, fill: C.white, stroke: C.ink, 'stroke-width': 2.5 });
          wrap(it.t, 26).forEach((l, q) => A.text(card, 400, 270 + q * 44, l, { font: 'body', size: 32, weight: 700, anchor: 'middle', fill: C.ink }));
          lifejacket(card, 400, 200, 0.3, '100');
          gsap.from(card, { opacity: 0, y: 12, duration: 0.3 });
        },
        end: 'Under 4.8 m offshore, children offshore and PWC riders: always worn.'
      });
    }
  });

  P.push({
    type: 'learn', title: 'Wear it anyway',
    html: `<p>Boaters are encouraged to wear a lifejacket <b>at all times</b>. Put one on, even when not required:</p>
<ul><li>at the first sign of bad weather</li><li>between sunset and sunrise, or in poor visibility</li><li>in unfamiliar waters</li><li>in a following sea</li><li>when boating alone</li><li>if you are a poor swimmer.</li></ul>
<p>Lifejackets take time to put on. Practise in good conditions so everyone knows how they fit.</p>`,
    art(svg, S) {
      sky(svg, '#5D7385', '#9AAFBC');
      const rain = A.g(svg);
      for (let i = 0; i < 40; i++) { const l = A.line(rain, 0, 0, -8, 22, { stroke: 'rgba(255,255,255,0.55)', 'stroke-width': 2 }); gsap.fromTo(l, { x: Math.random() * 820, y: -30 }, { y: 620, x: '-=60', duration: 0.9 + Math.random() * 0.5, repeat: -1, ease: 'none', delay: -Math.random() }); }
      const b = A.boatSide(svg, { len: 360, x: 400, y: 400, color: C.port });
      A.person(b.crew, { x: -40, y: -b._h * 0.8, s: 1.1, vest: true });
      A.waterSide(svg, 404, { amp: 10, speed: 2.4 });
      gsap.to(b, { rotation: 3, svgOrigin: '400 400', duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    }
  });

  P.push({
    type: 'learn', title: 'Size and fit',
    html: `<p>A loose lifejacket works poorly. For children, check three things:</p>
<ul><li>the <b>weight range</b> on the label matches the child</li><li>it is a <b>snug</b> fit</li><li>the child is <b>comfortable</b> wearing it.</li></ul>
<p>Babies under about one year old cannot be properly catered for and should not go afloat. Adults need a snug fit too.</p>`,
    art(svg, S) {
      A.paperBg(svg);
      A.rect(svg, 150, 90, 500, 420, { rx: 24, fill: C.white, stroke: C.line, 'stroke-width': 1.5 });
      const j = lifejacket(svg, 400, 300, 1.3, '100');
      const lab = A.g(svg, { transform: 'translate(400,440)' });
      A.rect(lab, -120, -30, 240, 60, { rx: 10, fill: C.paper, stroke: C.ink2, 'stroke-width': 2 });
      A.text(lab, 0, -4, 'CHILD 15–25 kg', { size: 22, weight: 700, anchor: 'middle', fill: C.ink });
      A.text(lab, 0, 18, 'check the label', { font: 'body', size: 14, anchor: 'middle', fill: C.ink2 });
      const ar = A.g(svg);
      A.arrow(ar, 'M 200 260 L 250 260', { color: C.port, width: 5 });
      A.arrow(ar, 'M 600 260 L 550 260', { color: C.port, width: 5 });
      A.tag(svg, 400, 130, 'SNUG FIT', { fill: C.port, size: 18 });
      gsap.to(ar, { opacity: 0.3, duration: 0.7, yoyo: true, repeat: -1 });
    }
  });

  P.push({
    type: 'learn', title: 'Inflatable lifejackets',
    html: `<p>Inflatable lifejackets use a <b>CO₂ cylinder</b> to inflate. They are lighter and more comfortable, but need more care.</p>
<ul><li>Must meet AS 4758 Level 100 or higher, or ISO 12402.</li><li>Service as the manufacturer says, or <b>at least every 12 months</b>.</li><li>Check them yourself regularly for damage, and brief your crew on how they work.</li></ul>`,
    art(svg, S) {
      sky(svg, '#DCE9EC', '#EEF2EC');
      const g = A.g(svg, { transform: 'translate(400,330)' });
      A.person(g, { x: 0, y: 160, s: 2.6, vest: false });
      const flat = A.g(g);
      A.path(flat, 'M -30 -36 L -30 -60 L -20 -76 M 30 -36 L 30 -60 L 20 -76', { stroke: '#F2D21B', 'stroke-width': 16, fill: 'none', 'stroke-linecap': 'round', transform: 'translate(0,-0) scale(1)' });
      const bag = A.path(g, 'M -40 -150 Q -70 -110 -60 -30 L -10 -20 L -10 -150 Z M 40 -150 Q 70 -110 60 -30 L 10 -20 L 10 -150 Z', { fill: '#F2D21B', stroke: '#B89A0C', 'stroke-width': 3, opacity: 0 });
      const coll = A.path(g, 'M -46 -150 Q -50 -200 0 -206 Q 50 -200 46 -150 Q 24 -164 0 -164 Q -24 -164 -46 -150 Z', { fill: '#F2D21B', stroke: '#B89A0C', 'stroke-width': 3, opacity: 0 });
      const cyl = A.g(svg, { transform: 'translate(640,170)' });
      A.rect(cyl, -18, -50, 36, 100, { rx: 16, fill: '#9AA6B1', stroke: '#5E6A76', 'stroke-width': 3 });
      A.text(cyl, 0, 8, 'CO₂', { size: 18, weight: 700, anchor: 'middle', fill: C.ink });
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });
      tl.to({}, { duration: 1 });
      tl.to(flat, { opacity: 0, duration: 0.2 });
      tl.fromTo([bag, coll], { opacity: 1, scale: 0.4, transformOrigin: '50% 0%' }, { scale: 1, duration: 0.5, ease: 'back.out(2)' }, '<');
      tl.to({}, { duration: 2.4 });
      tl.to([bag, coll], { opacity: 0, duration: 0.3 });
      tl.to(flat, { opacity: 1, duration: 0.3 });
    }
  });

  P.push({
    type: 'check', title: 'Service time',
    q: 'The manufacturer gives no service interval for your inflatable lifejacket. How often should it be serviced?',
    opts: ['At least every 12 months', 'At least every five years', 'Only after it has inflated', 'Never, as it is sealed'], a: 0,
    why: 'If the manufacturer doesn’t say, have it serviced at least every 12 months.'
  });

  P.push({
    type: 'learn', title: 'Distress beacons',
    html: `<p>A GPS-enabled 406 MHz beacon sends your position to rescuers, accurate to about <b>120 m</b>.</p>
<ul><li><b>EPIRB</b>: works for at least 48 hours, floats upright, and works best in the water.</li><li><b>PLB</b>: smaller and worn on you. Works for at least 24 hours. Hold the antenna up, clear of the water and your body.</li></ul>
<p>In unprotected waters you need a GPS EPIRB, or a GPS PLB <b>worn</b> by at least one person.</p>`,
    art(svg, S) {
      sky(svg, '#CFE2EA', '#EEF2EC');
      const e = epirb(svg, 250, 330, 1.25);
      A.waterSide(svg, 400);
      gsap.to(e, { y: 8, rotation: 4, svgOrigin: '250 400', duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to(e.strobe, { attr: { fill: '#FFFFFF' }, opacity: 0.3, duration: 0.12, repeat: -1, yoyo: true, repeatDelay: 1.2 });
      A.tag(svg, 250, 520, 'EPIRB: 48 h, FLOATS', { fill: C.ink, size: 16 });
      plb(svg, 560, 300, 1.25);
      A.tag(svg, 560, 520, 'PLB: 24 h, WORN', { fill: C.ink, size: 16 });
      [0, 1, 2].forEach(k => {
        const r = A.path(svg, 'M -30 -10 Q 0 -40 30 -10', { fill: 'none', stroke: C.port, 'stroke-width': 4, 'stroke-linecap': 'round' });
        gsap.fromTo(r, { x: 250, y: 120, scale: 0.6, opacity: 1, transformOrigin: '0px 0px' }, { y: 60, scale: 2.2, opacity: 0, duration: 1.8, repeat: -1, delay: k * 0.6 });
      });
    }
  });

  P.push({
    type: 'watch', title: 'How a beacon gets help',
    html: `<p>Follow the signal from a sinking boat to the rescue.</p>`,
    anim(svg, S) {
      const bg = A.rect(svg, 0, 0, 800, 600, { fill: '#CFE2EA' });
      for (let i = 0; i < 30; i++) A.circle(svg, (i * 137) % 800, (i * 71) % 200, 1.5, { fill: '#fff', opacity: 0.6 });
      // satellite
      const sat = A.g(svg, { transform: 'translate(400,90)' });
      A.rect(sat, -70, -12, 46, 24, { fill: '#2F6F86', stroke: '#173F55', 'stroke-width': 2 });
      A.rect(sat, 24, -12, 46, 24, { fill: '#2F6F86', stroke: '#173F55', 'stroke-width': 2 });
      A.rect(sat, -20, -20, 40, 40, { rx: 6, fill: '#D9D3C3', stroke: '#596470', 'stroke-width': 2 });
      gsap.to(sat, { rotation: 6, svgOrigin: '400 90', duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      A.waterSide(svg, 470);
      A.rect(svg, 560, 440, 260, 200, { fill: C.land });
      // ground station
      const gs = A.g(svg, { transform: 'translate(640,440)' });
      A.path(gs, 'M -30 0 L 0 -40 L 30 0 Z', { fill: '#8C97A3' });
      A.path(gs, 'M -40 -70 Q 0 -20 40 -70 Z', { fill: '#F4F7FA', stroke: '#596470', 'stroke-width': 3 });
      const rc = A.g(svg, { transform: 'translate(740,440)' });
      A.rect(rc, -40, -70, 80, 70, { fill: C.white, stroke: C.ink2, 'stroke-width': 2 });
      A.text(rc, 0, -30, 'RESCUE', { size: 13, weight: 700, anchor: 'middle', fill: C.port, ls: '0.08em' });
      A.text(rc, 0, -14, 'CENTRE', { size: 13, weight: 700, anchor: 'middle', fill: C.port, ls: '0.08em' });
      const e = epirb(svg, 160, 450, 0.55);
      gsap.to(e, { y: 6, duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      const sig = (x1, y1, x2, y2) => A.path(svg, `M ${x1} ${y1} L ${x2} ${y2}`, { stroke: C.port, 'stroke-width': 4, 'stroke-dasharray': '10 10', fill: 'none', opacity: 0 });
      const s1 = sig(160, 360, 380, 110), s2 = sig(420, 110, 640, 390), s3 = sig(660, 410, 710, 410);
      const rb = S.boat(svg, { type: 'patrol', len: 70, color: C.orange, x: 900, y: 520, r: 180, wake: false });
      const cap = caption(svg, 520);
      const tl = gsap.timeline();
      cap.show(tl, 0.2, 'The beacon sends a 406 MHz distress signal with its GPS position.');
      tl.to(s1, { opacity: 1, duration: 0.3 }, 0.8).to(s1, { strokeDashoffset: -60, duration: 2, ease: 'none' }, 0.8);
      cap.show(tl, 3.4, 'Satellites pick it up and pass it to a ground station.');
      tl.to(s2, { opacity: 1, duration: 0.3 }, 3.6).to(s2, { strokeDashoffset: -60, duration: 2, ease: 'none' }, 3.6);
      cap.show(tl, 6.4, 'Rescue coordinators check the registration and send help.');
      tl.to(s3, { opacity: 1, duration: 0.3 }, 6.6);
      tl.to(rb, { x: 220, duration: 4, ease: 'power2.out' }, 8);
      cap.show(tl, 9.4, 'Rescuers head straight to the position.');
      tl.to({}, { duration: 2 });
      return tl;
    }
  });

  P.push({
    type: 'learn', title: 'Register and test it',
    html: `<ul><li><b>Register</b> your beacon with AMSA. It's free. Carry proof of registration on board, and keep your details up to date.</li><li>Check the <b>battery expiry date</b>. The beacon must be in date.</li><li>Before you head out, test it using its <b>test switch</b>, following the instructions.</li><li>Dispose of old beacons properly, never in the rubbish.</li></ul>`,
    art(svg, S) {
      A.paperBg(svg);
      const e = epirb(svg, 280, 320, 1.5);
      const lab = A.g(svg, { transform: 'translate(560,250)' });
      A.rect(lab, -130, -60, 260, 120, { rx: 12, fill: C.white, stroke: C.ink, 'stroke-width': 2.5 });
      A.text(lab, 0, -24, 'BATTERY EXPIRES', { size: 18, weight: 700, anchor: 'middle', fill: C.ink2, ls: '0.1em' });
      A.text(lab, 0, 22, '06 / 2031', { size: 40, weight: 700, anchor: 'middle', fill: C.ink });
      const tk = A.tick(svg, 680, 196, 18, true);
      const reg = A.tag(svg, 560, 400, 'REGISTERED WITH AMSA', { fill: C.stbd, size: 17 });
      const test = A.tag(svg, 280, 520, 'TEST SWITCH', { fill: C.port, size: 16 });
      gsap.to(e.strobe, { attr: { fill: '#FFFFFF' }, opacity: 0.3, duration: 0.15, repeat: -1, yoyo: true, repeatDelay: 1.6 });
      gsap.from([tk, reg], { scale: 0, transformOrigin: '50% 50%', duration: 0.4, stagger: 0.4, delay: 0.5, ease: 'back.out(2)' });
    }
  });

  P.push({
    type: 'learn', title: 'Only in real danger',
    html: `<p>Activate a beacon <b>only when human life is in grave and imminent danger</b>. For a breakdown or running out of fuel, use your radio instead.</p>
<p>If it goes off by accident, <b>turn it off</b> and call AMSA (1800 641 792) so a search is not started. You can also tell the Water Police or your local marine rescue group.</p>`,
    art(svg, S) {
      sky(svg, '#4E6274', '#8FA5B4');
      const b = A.boatSide(svg, { len: 360, x: 430, y: 380, color: C.port });
      A.person(b.crew, { x: -60, y: -b._h * 0.8, s: 1.1, vest: true, armR: 150 });
      gsap.to(b, { rotation: 14, svgOrigin: '430 380', duration: 0.1 });
      gsap.to(b, { y: '+=30', duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      A.waterSide(svg, 400, { amp: 12, speed: 2 });
      const e = epirb(svg, 140, 400, 0.6);
      gsap.to(e, { y: 8, duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to(e.strobe, { attr: { fill: '#FFFFFF' }, opacity: 0.2, duration: 0.12, repeat: -1, yoyo: true, repeatDelay: 0.8 });
      A.tag(svg, 400, 60, 'GRAVE AND IMMINENT DANGER', { fill: C.port, size: 18 });
    }
  });

  P.push({
    type: 'try', title: 'Beacon or not?',
    html: `<p>What should you do with your beacon in each situation?</p>`,
    lockMsg: 'Answer all five',
    build(svg, S, api) {
      A.paperBg(svg);
      const card = A.g(svg);
      epirb(svg, 120, 300, 0.7);
      rounds(api, S, {
        noun: 'Situation',
        choices: ['Activate it', 'Don’t activate it', 'Turn it off and call AMSA'],
        items: [
          { t: 'The motor has cut out and won’t restart. The sea is calm.', a: 1, why: 'No one is in grave danger. Use your radio to call for help.' },
          { t: 'Your boat is sinking fast, 10 km offshore.', a: 0, why: 'Lives are in grave and imminent danger. Activate it.' },
          { t: 'You knocked the beacon and it started flashing.', a: 2, why: 'Accidental activation: turn it off and call AMSA so no search starts.' },
          { t: 'You have run out of fuel near the coast.', a: 1, why: 'Not a life-threatening emergency. Use the radio.' },
          { t: 'A fire is out of control and you must abandon ship.', a: 0, why: 'Grave and imminent danger. Activate it, and take it with you.' }
        ],
        show(it) {
          card.innerHTML = '';
          A.rect(card, 220, 160, 520, 280, { rx: 24, fill: C.white, stroke: C.ink, 'stroke-width': 2.5 });
          wrap(it.t, 26).forEach((l, q) => A.text(card, 480, 260 + q * 42, l, { font: 'body', size: 29, weight: 700, anchor: 'middle', fill: C.ink }));
          gsap.from(card, { opacity: 0, y: 12, duration: 0.3 });
        },
        end: 'Beacons are only for grave and imminent danger.'
      });
    }
  });

  P.push({
    type: 'learn', title: 'Flares and EVDS',
    html: `<p>In unprotected waters carry at least <b>two red</b> and <b>two orange</b> hand-held flares. Or carry an <span class="term">EVDS</span> instead, if you also have a GPS EPIRB, or a PLB worn at all times.</p>
<ul><li><b>Orange smoke</b>: day only, about 60 seconds. Easy to see from aircraft.</li><li><b>Red hand-held</b>: day or night, about 45 seconds. Seen up to 10–12 km at night.</li><li><b>EVDS</b>: a flashing white light that lasts about 20 hours. Helps rescuers find you once they are close.</li></ul>`,
    art(svg, S) {
      A.paperBg(svg);
      [['orange', 'ORANGE SMOKE', 'DAY · 60 s', 170], ['red', 'RED FLARE', 'DAY + NIGHT · 45 s', 400]].forEach(([c, l, d, x]) => {
        A.rect(svg, x - 100, 110, 200, 380, { rx: 20, fill: C.white, stroke: C.line, 'stroke-width': 1.5 });
        flare(svg, x, 330, 1.3, c);
        A.text(svg, x, 160, l, { size: 20, weight: 700, anchor: 'middle', fill: C.ink, ls: '0.06em' });
        A.text(svg, x, 460, d, { font: 'body', size: 16, anchor: 'middle', fill: C.ink2 });
      });
      A.rect(svg, 530, 110, 200, 380, { rx: 20, fill: C.night });
      const ev = evds(svg, 630, 320, 1.1);
      A.text(svg, 630, 160, 'EVDS', { size: 20, weight: 700, anchor: 'middle', fill: '#fff', ls: '0.06em' });
      A.text(svg, 630, 460, 'DAY + NIGHT · 20 h', { font: 'body', size: 16, anchor: 'middle', fill: '#C9D6E2' });
      gsap.timeline({ repeat: -1, repeatDelay: 0.9 }).to(ev.glow, { opacity: 0.55, duration: 0.06 }).to(ev.glow, { opacity: 0, duration: 0.25 });
    }
  });

  P.push({
    type: 'watch', title: 'Day and night signals',
    html: `<p>Watch which signal stands out, by day and by night.</p>`,
    anim(svg, S) {
      const skyR = A.rect(svg, 0, 0, 800, 600, { fill: '#BFD9E4' });
      const sea = A.rect(svg, 0, 330, 800, 270, { fill: '#5F98AA' });
      const b = A.boatSide(svg, { len: 240, x: 420, y: 400, color: C.port });
      const p = A.person(b.crew, { x: -30, y: -b._h * 0.8, s: 0.9, vest: true, armR: 160 });
      const smoke = A.g(svg);
      const puffs = [];
      for (let i = 0; i < 16; i++) puffs.push(A.circle(smoke, 0, 0, 16, { fill: C.orange, opacity: 0 }));
      const hand = { x: 404, y: 236 };
      const glow = A.circle(svg, hand.x, hand.y, 70, { fill: '#FF4A3D', opacity: 0 });
      const core = A.circle(svg, hand.x, hand.y, 9, { fill: '#FFE3D9', opacity: 0 });
      const ev = evds(svg, 560, 410, 0.35); gsap.set(ev, { opacity: 0 });
      A.waterSide(svg, 404, { opacity: 0.7 });
      const cap = caption(svg);
      const tl = gsap.timeline();
      cap.show(tl, 0.2, 'By day, orange smoke shows up well, especially from the air.');
      puffs.forEach((c, i) => tl.fromTo(c, { attr: { cx: hand.x, cy: hand.y, r: 10 }, opacity: 0.9 }, { attr: { cx: hand.x + 140 + i * 6, cy: hand.y - 150 - (i % 4) * 14, r: 48 }, opacity: 0, duration: 3, ease: 'sine.out' }, 0.6 + i * 0.25));
      tl.to(skyR, { attr: { fill: '#0B1626' }, duration: 1.4 }, 5.4);
      tl.to(sea, { attr: { fill: '#0E2234' }, duration: 1.4 }, 5.4);
      cap.show(tl, 6.2, 'At night, smoke can’t be seen. A red hand-held flare can be seen for 10–12 km.');
      tl.to([glow, core], { opacity: 0.85, duration: 0.3 }, 7);
      tl.to(glow, { attr: { r: 90 }, opacity: 0.6, duration: 0.2, yoyo: true, repeat: 15, ease: 'none' }, 7.3);
      tl.to([glow, core], { opacity: 0, duration: 0.4 }, 10.6);
      cap.show(tl, 10.8, 'An EVDS flashes for hours, guiding rescuers once they are close.');
      tl.to(ev, { opacity: 1, duration: 0.3 }, 11);
      for (let k = 0; k < 5; k++) tl.to(ev.glow, { opacity: 0.8, duration: 0.06 }, 11.4 + k * 0.7).to(ev.glow, { opacity: 0, duration: 0.25 }, 11.46 + k * 0.7);
      tl.to({}, { duration: 1 });
      return tl;
    }
  });

  P.push({
    type: 'learn', title: 'Using flares safely',
    html: `<ul><li>Use them when there is a real chance of being seen.</li><li>Firing instructions are printed on each flare. Know them <b>before</b> you need them.</li><li>Red flares burn very hot and drop embers. Hold it <b>downwind</b> and point it <b>angled outwards</b>, away from you and the boat.</li><li>Store flares in a <b>waterproof container</b>, away from damp and heat over 60 °C.</li><li>Check expiry dates, and dispose of old flares properly, not in the rubbish.</li></ul>`,
    art(svg, S) {
      sky(svg, '#2A3F55', '#5B7488');
      const b = A.boatSide(svg, { len: 330, x: 360, y: 420, color: C.sea4 });
      A.person(b.crew, { x: 70, y: -b._h * 0.8, s: 1.1, vest: true, fwdR: 120 });
      A.waterSide(svg, 424, { top: '#36546A', bottom: '#1C3346' });
      const fx = 520, fy = 250;
      const tube = A.g(svg, { transform: `translate(${fx},${fy}) rotate(50)` });
      A.rect(tube, -6, -30, 12, 50, { rx: 3, fill: C.port });
      const glow = A.circle(svg, fx + 22, fy - 22, 40, { fill: '#FF4A3D', opacity: 0.5 });
      A.circle(svg, fx + 22, fy - 22, 8, { fill: '#FFE3D9' });
      gsap.to(glow, { attr: { r: 56 }, opacity: 0.75, duration: 0.15, yoyo: true, repeat: -1 });
      const emb = A.g(svg);
      for (let i = 0; i < 10; i++) { const c = A.circle(emb, 0, 0, 3, { fill: '#FFB199' }); gsap.fromTo(c, { attr: { cx: fx + 24, cy: fy - 20 }, opacity: 1 }, { attr: { cx: fx + 80 + i * 8, cy: fy + 120 }, opacity: 0, duration: 1.2, repeat: -1, delay: i * 0.12, ease: 'power1.in' }); }
      const w = A.g(svg, { transform: 'translate(640,90)' });
      A.arrow(w, 'M -60 0 L 60 0', { color: '#fff', width: 4 });
      A.text(w, 0, -16, 'WIND', { size: 16, weight: 700, anchor: 'middle', fill: '#fff', ls: '0.14em' });
    }
  });

  P.push({
    type: 'try', title: 'Which signal?',
    html: `<p>Choose the best flare for each situation.</p>`,
    lockMsg: 'Answer all three',
    build(svg, S, api) {
      const bg = A.rect(svg, 0, 0, 800, 600, { fill: '#BFD9E4' });
      const sea = A.rect(svg, 0, 330, 800, 270, { fill: '#5F98AA' });
      const heli = A.g(svg, { opacity: 0 });
      A.path(heli, 'M 0 0 Q 0 -20 30 -20 L 60 -20 Q 80 -10 70 6 L 10 6 Q 0 6 0 0 Z M 60 -10 L 130 -10 L 136 -20 L 140 -20 L 136 0 L 60 0 Z', { fill: C.port });
      A.line(heli, -10, -28, 110, -28, { stroke: '#1B232C', 'stroke-width': 4 });
      const ship = A.g(svg, { opacity: 0 });
      A.path(ship, 'M 560 330 L 720 330 L 706 346 L 572 346 Z', { fill: '#1B232C' });
      A.rect(ship, 600, 312, 40, 18, { fill: '#1B232C' });
      A.circle(ship, 620, 304, 3, { fill: '#FFF6DC' });
      const wind = A.g(svg, { opacity: 0 });
      for (let i = 0; i < 6; i++) { const l = A.line(wind, 0, 0, 60, 0, { stroke: '#fff', 'stroke-width': 3, 'stroke-linecap': 'round' }); gsap.fromTo(l, { x: -80, y: 80 + i * 40 }, { x: 860, duration: 1.2, repeat: -1, delay: i * 0.2, ease: 'none' }); }
      const b = A.boatSide(svg, { len: 220, x: 300, y: 400, color: C.sea4 });
      A.waterSide(svg, 404, { opacity: 0.7 });
      rounds(api, S, {
        noun: 'Situation',
        choices: ['Orange smoke', 'Red hand-held'],
        items: [
          { s: 'day', a: 0, why: 'Daytime and a search aircraft overhead: orange smoke is especially visible from the air.' },
          { s: 'night', a: 1, why: 'At night smoke can’t be seen. A red flare shows up for 10–12 km.' },
          { s: 'wind', a: 1, why: 'In a fresh breeze, smoke flattens and may be seen for less than 1 km. A red flare works day or night.' }
        ],
        show(it) {
          api.say(it.s === 'day' ? 'Daytime. A search helicopter is overhead.' : it.s === 'night' ? 'Night. A ship is on the horizon.' : 'Daytime, in a strong, fresh breeze. A boat is a few km away.', 'info');
          gsap.to(bg, { attr: { fill: it.s === 'night' ? '#0B1626' : '#BFD9E4' }, duration: 0.6 });
          gsap.to(sea, { attr: { fill: it.s === 'night' ? '#0E2234' : '#5F98AA' }, duration: 0.6 });
          gsap.to(heli, { opacity: it.s === 'day' ? 1 : 0, duration: 0.4 });
          if (it.s === 'day') gsap.fromTo(heli, { x: 820, y: 120 }, { x: 460, duration: 2.5, ease: 'power2.out' });
          gsap.to(ship, { opacity: it.s === 'night' ? 1 : 0, duration: 0.4 });
          gsap.to(wind, { opacity: it.s === 'wind' ? 1 : 0, duration: 0.4 });
        },
        end: 'Smoke by day, red by night or in strong wind.'
      });
    }
  });

  SR._ch7 = { P, gear: { lifejacket, epirb, plb, flare, evds, radio, extinguisher, anchorIcon, bucket }, coast, cx };
})();
