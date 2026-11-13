/* Chapter 6: Maintenance */
(function () {
  const A = SR.art, C = A.C;
  const { sky, caption } = SR.share;
  const P = [];

  /* ---------- shared activity helpers (used by later chapters too) ---------- */
  function toSvg(svg, e) { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); }

  /* one question at a time, answered with chips */
  function rounds(api, S, o) {
    let i = 0, busy = false;
    const ui = document.createElement('div');
    ui.innerHTML = `<div class="chips">${o.choices.map((c, k) => `<button class="chip" data-k="${k}">${c}</button>`).join('')}</div><div class="status"></div>`;
    api.task.appendChild(ui);
    const stt = ui.querySelector('.status');
    const show = () => { stt.textContent = `${o.noun || 'Question'} ${i + 1} of ${o.items.length}`; if (o.show) o.show(o.items[i], i); };
    ui.querySelectorAll('.chip').forEach(b => b.onclick = () => {
      if (busy || i >= o.items.length) return;
      const it = o.items[i];
      if (+b.dataset.k === it.a) {
        busy = true; api.say(it.why, 'good'); if (o.right) o.right(it, i);
        S.after(o.wait || 2000, () => {
          busy = false; i++;
          if (i < o.items.length) { api.hush(); show(); }
          else { stt.textContent = ''; ui.querySelector('.chips').style.display = 'none'; if (o.last) o.last(); api.done(o.end); }
        });
      } else { api.say(it.bad || o.bad || 'Not quite. Have another look.', 'bad'); if (o.wrong) o.wrong(it, i); }
    });
    show();
    return ui;
  }

  /* tap the problems in a picture */
  function spot(api, S, svg, o) {
    const found = new Set(), lay = A.g(svg);
    const stt = document.createElement('div'); stt.className = 'status'; api.task.appendChild(stt);
    const upd = () => stt.textContent = `Found ${found.size} of ${o.spots.length}`;
    upd();
    svg.style.cursor = 'pointer';
    svg.addEventListener('pointerdown', e => {
      if (found.size === o.spots.length) return;
      const p = toSvg(svg, e);
      const k = o.spots.findIndex((s, j) => !found.has(j) && Math.hypot(p.x - s.x, p.y - s.y) < (s.r || 50));
      if (k < 0) { api.say(o.miss || 'Nothing wrong there. Keep looking.', 'info'); return; }
      found.add(k);
      const s = o.spots[k], r = s.r || 50;
      const ring = A.circle(lay, s.x, s.y, r - 6, { fill: 'none', stroke: C.buoy, 'stroke-width': 5 });
      gsap.from(ring, { attr: { r: 8 }, opacity: 0, duration: 0.45, ease: 'back.out(2)' });
      const t = A.tick(lay, s.x + r * 0.68, s.y - r * 0.68, 14, true);
      gsap.from(t, { scale: 0, transformOrigin: '50% 50%', duration: 0.35, delay: 0.15, ease: 'back.out(2)' });
      upd();
      if (found.size === o.spots.length) api.done(s.why + (o.end ? ' ' + o.end : ''));
      else api.say(s.why, 'good');
    });
  }

  /* tap steps in the right order */
  function order(api, S, o) {
    const ui = document.createElement('div');
    const mix = o.steps.map((s, k) => k);
    for (let k = mix.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [mix[k], mix[j]] = [mix[j], mix[k]]; }
    if (mix.every((v, k) => v === k)) mix.reverse();
    ui.innerHTML = `<div class="opts">${mix.map(k => `<button class="opt" data-k="${k}"><span class="ordn"></span>${o.steps[k]}</button>`).join('')}</div>`;
    api.task.appendChild(ui);
    let n = 0;
    ui.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      if (n >= o.steps.length || b.classList.contains('right')) return;
      if (+b.dataset.k === n) {
        b.classList.add('right'); b.querySelector('.ordn').textContent = (n + 1) + '. ';
        if (o.step) o.step(n);
        n++;
        if (n === o.steps.length) api.done(o.end); else api.say(o.good ? o.good(n - 1) : 'Yes. What comes next?', 'good');
      } else {
        b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 400);
        api.say(o.bad ? o.bad(n) : 'Not yet. What has to happen before that?', 'bad');
      }
    });
  }

  /* outboard motor, side view. origin at the transom bracket line; boat is to the right */
  function outboard(parent, x, y, s, o) {
    o = o || {};
    const g = A.g(parent, { transform: `translate(${x},${y}) scale(${s || 1})` });
    const body = o.color || '#27323E', trim = '#4C5B6B';
    A.rect(g, 30, -150, 26, 64, { rx: 5, fill: '#5B6670' });
    A.path(g, 'M -14 -122 L 22 -122 L 18 54 L -10 54 Z', { fill: body });
    A.path(g, 'M -6 -110 L -2 40', { stroke: 'rgba(255,255,255,0.12)', 'stroke-width': 5, 'stroke-linecap': 'round' });
    A.rect(g, -54, 38, 88, 8, { rx: 4, fill: trim });
    A.path(g, 'M -40 68 Q -42 56 -20 54 L 30 54 Q 48 60 48 72 Q 48 86 30 90 L -20 90 Q -42 88 -40 76 Z', { fill: body });
    A.path(g, 'M -6 88 L 14 88 L 8 130 L 0 130 Z', { fill: body });
    const drain = A.circle(g, 8, 82, 4.5, { fill: '#C3CBD3', stroke: '#141B22', 'stroke-width': 1.5 });
    const prop = A.g(g, { transform: 'translate(-48,72)' });
    A.rect(prop, -10, -7, 14, 14, { rx: 4, fill: '#8C97A3' });
    const blades = A.g(prop);
    A.path(blades, 'M -5 -5 Q -18 -28 -5 -46 Q 7 -28 2 -5 Z', { fill: '#AEB8C2', stroke: '#5E6A76', 'stroke-width': 1.5 });
    A.path(blades, 'M -5 5 Q -18 28 -5 46 Q 7 28 2 5 Z', { fill: '#AEB8C2', stroke: '#5E6A76', 'stroke-width': 1.5 });
    A.path(g, 'M -54 -150 Q -62 -206 -20 -216 L 30 -216 Q 58 -212 58 -180 L 52 -130 Q 50 -120 38 -120 L -42 -120 Q -54 -122 -54 -150 Z', { fill: body });
    A.path(g, 'M -50 -170 L 54 -170', { stroke: o.stripe || C.sea3, 'stroke-width': 4 });
    A.path(g, 'M -44 -200 Q -32 -209 -10 -209', { stroke: 'rgba(255,255,255,0.22)', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round' });
    A.circle(g, -52, -132, 3.8, { fill: '#0B1016' });
    g.prop = prop; g.blades = blades; g.drain = drain;
    return g;
  }
  /* hull stern to the right of an outboard drawn at (x,y,s) */
  function sternHull(parent, x, y, s) {
    const g = A.g(parent, { transform: `translate(${x},${y}) scale(${s || 1})` });
    A.path(g, 'M 56 -176 L 520 -196 L 520 -14 L 120 -2 Q 64 0 56 -24 Z', { fill: C.white, stroke: C.ink, 'stroke-width': 2.5, 'stroke-linejoin': 'round' });
    A.path(g, 'M 56 -70 L 520 -78 L 520 -14 L 120 -2 Q 64 0 56 -24 Z', { fill: C.ink });
    A.path(g, 'M 56 -124 L 520 -136 L 520 -114 L 57 -104 Z', { fill: C.sea4 });
    A.path(g, 'M 56 -176 L 520 -196', { stroke: C.ink, 'stroke-width': 5, 'stroke-linecap': 'round' });
    return g;
  }
  /* telltale stream from an outboard at (x,y,s); returns path */
  function telltale(parent, x, y, s, mode) {
    const g = A.g(parent, { transform: `translate(${x},${y}) scale(${s || 1})` });
    const p = A.path(g, 'M -54 -132 Q -104 -134 -122 -40', { fill: 'none', stroke: '#E9F6FA', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-dasharray': '12 7' });
    const tw = gsap.to(p, { strokeDashoffset: -38, duration: 0.45, repeat: -1, ease: 'none' });
    g.tw = tw; g.p = p;
    if (mode === 'none') gsap.set(p, { opacity: 0 });
    if (mode === 'weak') { p.setAttribute('d', 'M -54 -132 Q -70 -128 -74 -90'); gsap.to(p, { opacity: 0, duration: 0.25, repeat: -1, yoyo: true, repeatDelay: 0.4 }); }
    return g;
  }

  Object.assign(SR.share, { toSvg, rounds, spot, order, outboard, sternHull, telltale });

  /* small helper: a panel card */
  const wrap = (str, n) => str.split(' ').reduce((ls, w) => { const l = ls[ls.length - 1]; if (l && (l + ' ' + w).length <= n) ls[ls.length - 1] = l + ' ' + w; else ls.push(w); return ls; }, []);
  SR.share.wrap = wrap;
  const card = (parent, x, y, w, h, fill) => A.rect(parent, x, y, w, h, { rx: 18, fill: fill || C.white, stroke: C.line, 'stroke-width': 1.5 });

  /* ---------- battery drawing ---------- */
  function battery(parent, x, y, s, o) {
    o = o || {};
    const g = A.g(parent, { transform: `translate(${x},${y}) scale(${s || 1})` });
    A.rect(g, -100, -70, 200, 130, { rx: 10, fill: '#2F3A45' });
    A.rect(g, -100, -70, 200, 26, { rx: 10, fill: '#3C4955' });
    A.text(g, 0, 20, 'MARINE', { size: 30, weight: 700, fill: '#E8EEF2', anchor: 'middle', ls: '0.14em' });
    A.text(g, 0, 44, '12 V', { size: 18, weight: 700, fill: C.sea2, anchor: 'middle', ls: '0.1em' });
    if (o.caps !== false) [-50, -18, 14, 46].forEach(cx => A.rect(g, cx - 9, -64, 18, 12, { rx: 4, fill: '#24303B' }));
    const pos = A.g(g, { transform: 'translate(-72,-70)' });
    A.rect(pos, -11, -16, 22, 18, { rx: 3, fill: '#B88A3A' });
    A.text(pos, 0, -24, '+', { size: 26, weight: 700, fill: C.port, anchor: 'middle' });
    const neg = A.g(g, { transform: 'translate(72,-70)' });
    A.rect(neg, -11, -16, 22, 18, { rx: 3, fill: '#9EA6AE' });
    A.text(neg, 0, -24, '–', { size: 26, weight: 700, fill: C.ink, anchor: 'middle' });
    g.pos = pos; g.neg = neg;
    return g;
  }

  /* ===================== PAGES ===================== */

  P.push({
    type: 'learn', title: 'Look after your boat',
    html: `<p>A well-maintained vessel is basic to safety at sea.</p>
<p>Poor motor maintenance alone causes <b>thousands of calls for help</b> every year. Flat batteries, blocked fuel and worn parts leave boats drifting and waiting for a tow.</p>
<p>This chapter covers what to check, and when, to keep your boat reliable and seaworthy.</p>`,
    art(svg, S) {
      S.seaBg(svg);
      const wk = A.g(svg); S.wakes(wk);
      const line = A.path(svg, '', { fill: 'none', stroke: C.buoy, 'stroke-width': 3, 'stroke-linecap': 'round' });
      const tug = S.boat(svg, { type: 'patrol', len: 120, color: C.orange, r: 180, x: 980, y: 300 });
      const dead = S.boat(svg, { type: 'motor', len: 96, color: C.sea4, r: 180, x: 1180, y: 300 });
      dead.wake = false;
      const st = { x: 980 };
      gsap.fromTo(st, { x: 980 }, { x: -420, duration: 22, ease: 'none', repeat: -1 }).progress(0.3);
      S.loop(() => {
        tug.x = st.x; dead.x = st.x + 210; dead.y = 300 + Math.sin(st.x / 60) * 3; dead.rotation = 180 + Math.sin(st.x / 80) * 3;
        const x1 = tug.x + 60, x2 = dead.x - 48;
        line.setAttribute('d', `M ${x1} 300 Q ${(x1 + x2) / 2} 306 ${x2} ${dead.y}`);
      });
      A.tag(svg, 400, 520, 'POOR MAINTENANCE = A LONG TOW HOME', { fill: C.ink, size: 18 });
    }
  });

  P.push({
    type: 'learn', title: 'Service every year',
    html: `<p>Have your motor serviced by a specialised workshop <b>at least once a year</b>, even if you hardly use it. The service checks vital internal parts, such as the water pump.</p>
<p>If you work your motor hard, have the <b>gearbox oil changed every three months</b>.</p>`,
    art(svg, S) {
      A.paperBg(svg);
      const M = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const tiles = [];
      M.forEach((m, k) => {
        const x = 130 + (k % 4) * 140, y = 110 + Math.floor(k / 4) * 130;
        const t = A.g(svg, { transform: `translate(${x},${y})` });
        A.rect(t, 4, 6, 120, 110, { rx: 14, fill: 'rgba(18,38,58,0.12)' });
        const bg = A.rect(t, 0, 0, 120, 110, { rx: 14, fill: C.white, stroke: C.line, 'stroke-width': 1.5 });
        A.text(t, 60, 32, m, { size: 22, weight: 700, anchor: 'middle', fill: C.ink2, ls: '0.1em' });
        tiles.push({ t, bg, x, y });
      });
      const drops = [2, 5, 8, 11].map(k => {
        const d = A.g(svg, { transform: `translate(${tiles[k].x + 60},${tiles[k].y + 72})`, opacity: 0 });
        A.path(d, 'M 0 -22 Q 16 0 16 8 A 16 16 0 0 1 -16 8 Q -16 0 0 -22 Z', { fill: '#C9962E' });
        A.path(d, 'M -6 4 Q -6 12 2 14', { stroke: 'rgba(255,255,255,0.6)', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' });
        return d;
      });
      const stamp = A.g(svg, { opacity: 0 });
      const sg = A.g(stamp, { transform: `translate(${tiles[11].x + 60},${tiles[11].y + 55}) rotate(-12)` });
      A.rect(sg, -78, -26, 156, 52, { rx: 8, fill: 'rgba(200,53,43,0.1)', stroke: C.port, 'stroke-width': 4 });
      A.text(sg, 0, 10, 'SERVICE', { size: 28, weight: 700, anchor: 'middle', fill: C.port, ls: '0.12em' });
      const key = A.g(svg);
      A.path(key, 'M 160 528 Q 176 506 176 498 A 16 16 0 0 0 144 498 Q 144 506 160 528 Z', { fill: '#C9962E', transform: 'translate(0,-6)' });
      A.text(key, 190, 504, 'Gearbox oil (hard use)', { font: 'body', size: 18, fill: C.ink2 });
      A.rect(key, 430, 484, 40, 26, { rx: 5, fill: 'none', stroke: C.port, 'stroke-width': 3 });
      A.text(key, 484, 504, 'Workshop service', { font: 'body', size: 18, fill: C.ink2 });
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });
      tiles.forEach((tt, k) => {
        tl.to(tt.bg, { attr: { fill: '#FFF2C9' }, duration: 0.15 }, k * 0.45);
        tl.to(tt.bg, { attr: { fill: C.white }, duration: 0.4 }, k * 0.45 + 0.45);
        const di = [2, 5, 8, 11].indexOf(k);
        if (di >= 0) tl.fromTo(drops[di], { opacity: 0, y: '-=0' }, { opacity: 1, duration: 0.3 }, k * 0.45 + 0.1);
      });
      tl.fromTo(stamp, { opacity: 0, scale: 1.6, transformOrigin: `${tiles[11].x + 60}px ${tiles[11].y + 55}px` }, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' }, 11 * 0.45 + 0.3);
      tl.to({}, { duration: 2.2 });
      tl.to(drops.concat([stamp]), { opacity: 0, duration: 0.4 });
    }
  });

  P.push({
    type: 'check', title: 'Working hard',
    q: 'You work your motor hard. How often should the gearbox oil be changed?',
    opts: ['Every three months', 'Every two years', 'Only once a year', 'Before every trip'], a: 0,
    why: 'A hard-working motor needs its gearbox oil changed every three months, on top of the yearly service.'
  });

  P.push({
    type: 'learn', title: 'Electrics and corrosion',
    html: `<p>Electrical systems on boats commonly fail through <span class="term">corrosion</span>. Salt water and damp eat away at metal connections.</p>
<ul><li>Inspect often and keep everything clean.</li><li>Spray terminals and connectors with a corrosion-retarding spray.</li><li>Keep electrical fittings dry.</li><li>Check your <b>navigation lights work</b>, even if you only plan a daytime trip.</li></ul>`,
    art(svg, S) {
      A.paperBg(svg);
      card(svg, 120, 90, 560, 420);
      // a terminal block with two screws
      const blk = A.g(svg, { transform: 'translate(400,330)' });
      A.rect(blk, -150, -40, 300, 80, { rx: 10, fill: '#3A4652' });
      const wires = [['#C8352B', -80], ['#1B232C', 80]];
      wires.forEach(([col, x]) => {
        A.path(blk, `M ${x} 40 L ${x} 150`, { stroke: col, 'stroke-width': 16, 'stroke-linecap': 'round' });
        A.circle(blk, x, 0, 26, { fill: '#C9A55A', stroke: '#8B6F35', 'stroke-width': 3 });
        A.path(blk, `M ${x - 12} 0 L ${x + 12} 0`, { stroke: '#8B6F35', 'stroke-width': 5, 'stroke-linecap': 'round' });
      });
      const crud = A.g(blk);
      const rnd = A.rng(4);
      wires.forEach(([, x]) => { for (let i = 0; i < 16; i++) { const a = rnd() * 6.28, r = 16 + rnd() * 18; A.circle(crud, x + Math.cos(a) * r, Math.sin(a) * r * 0.8, 5 + rnd() * 7, { fill: rnd() > 0.5 ? '#6FBF8E' : '#E6EFE6', opacity: 0.95 }); } });
      // spray can
      const can = A.g(svg, { transform: 'translate(640,170) rotate(-35)' });
      A.rect(can, -22, 0, 44, 110, { rx: 10, fill: C.sea4 });
      A.rect(can, -22, 30, 44, 34, { fill: C.buoy });
      A.rect(can, -10, -20, 20, 22, { rx: 4, fill: '#9AA6B1' });
      A.rect(can, -16, -28, 14, 10, { rx: 3, fill: C.ink });
      const mist = A.g(svg);
      for (let i = 0; i < 18; i++) A.circle(mist, 0, 0, 3 + (i % 3), { fill: '#BFE3EE', opacity: 0 });
      const lab = A.tag(svg, 400, 140, 'CORRODED', { fill: C.port, size: 18 });
      const lab2 = A.tag(svg, 400, 140, 'CLEAN, DRY, SPRAYED', { fill: C.stbd, size: 18 });
      gsap.set(lab2, { opacity: 0 });
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
      tl.from(crud.children, { scale: 0, transformOrigin: '50% 50%', stagger: 0.04, duration: 0.3 });
      tl.to({}, { duration: 1 });
      [...mist.children].forEach((m, i) => {
        tl.fromTo(m, { attr: { cx: 610, cy: 160 }, opacity: 0.9 }, { attr: { cx: 300 + (i % 6) * 40, cy: 300 + Math.floor(i / 6) * 20 }, opacity: 0, duration: 0.9, ease: 'power1.out' }, 1.6 + i * 0.05);
      });
      tl.to(crud.children, { scale: 0, transformOrigin: '50% 50%', stagger: 0.03, duration: 0.25 }, 2.1);
      tl.to(lab, { opacity: 0, duration: 0.3 }, 2.3);
      tl.to(lab2, { opacity: 1, duration: 0.3 }, 2.6);
      tl.to({}, { duration: 2.2 });
      tl.to(lab2, { opacity: 0, duration: 0.3 });
      tl.to(lab, { opacity: 1, duration: 0.3 });
    }
  });

  P.push({
    type: 'learn', title: 'Batteries',
    html: `<p>A <b>flat battery</b> is one of the most common reasons boaters call marine rescue.</p>
<ul><li>Use a genuine <b>marine battery</b>. Your motor's handbook says what capacity.</li><li>Check and charge it regularly. If it won't hold charge, have it tested or replaced.</li><li>Secure it with <b>brackets</b> inside a <b>ventilated container</b>.</li><li>In an enclosed space, make sure it is properly ventilated.</li></ul>`,
    art(svg, S) {
      A.paperBg(svg);
      // ventilated box
      A.rect(svg, 196, 236, 420, 270, { rx: 18, fill: 'rgba(18,38,58,0.15)' });
      A.rect(svg, 190, 228, 420, 270, { rx: 18, fill: '#5E7E8E' });
      A.rect(svg, 190, 228, 420, 40, { rx: 18, fill: '#6F909F' });
      [0, 1, 2, 3, 4].forEach(k => A.rect(svg, 250 + k * 64, 240, 40, 12, { rx: 6, fill: '#2C4250' }));
      battery(svg, 400, 400, 1.05);
      // strap bracket
      A.rect(svg, 240, 378, 320, 18, { rx: 6, fill: C.buoy, stroke: '#9A7210', 'stroke-width': 2 });
      A.circle(svg, 252, 387, 5, { fill: '#9A7210' }); A.circle(svg, 548, 387, 5, { fill: '#9A7210' });
      A.tag(svg, 400, 530, 'BRACKETS + A VENTILATED BOX', { fill: C.ink, size: 18 });
      // gas venting
      const gas = A.g(svg);
      for (let i = 0; i < 10; i++) {
        const c = A.circle(gas, 270 + (i % 5) * 64, 240, 6 + (i % 3) * 2, { fill: 'none', stroke: C.sea3, 'stroke-width': 2.5 });
        gsap.fromTo(c, { attr: { cy: 240 }, opacity: 0.9 }, { attr: { cy: 120 }, opacity: 0, duration: 2.6, repeat: -1, delay: i * 0.27, ease: 'sine.out' });
      }
      A.text(svg, 640, 150, 'Charging gas', { font: 'body', size: 18, fill: C.ink2 });
      A.text(svg, 640, 172, 'escapes safely', { font: 'body', size: 18, fill: C.ink2 });
    }
  });

  P.push({
    type: 'learn', title: 'Battery care',
    html: `<ul><li>Keep terminals and cables <b>clean</b>, and grease the terminals.</li><li>Keep connections <b>tight</b> and secure.</li><li>Top up the cells with <b>distilled water</b> and check each cell with a <span class="term">hydrometer</span>, if the battery can be serviced.</li><li><b>Turn off the power to the charger before you disconnect the charger leads.</b> This can prevent damage.</li></ul>`,
    art(svg, S) {
      A.paperBg(svg);
      const b = battery(svg, 360, 420, 1.2);
      // charger
      const ch = A.g(svg, { transform: 'translate(560,150)' });
      A.rect(ch, 0, 0, 170, 110, { rx: 14, fill: C.ink });
      A.text(ch, 85, 34, 'CHARGER', { size: 18, weight: 700, fill: '#fff', anchor: 'middle', ls: '0.12em' });
      const led = A.circle(ch, 40, 74, 10, { fill: C.stbd });
      const sw = A.g(ch, { transform: 'translate(118,74)' });
      A.rect(sw, -26, -16, 52, 32, { rx: 16, fill: '#3B4F64' });
      const knob = A.circle(sw, 10, 0, 12, { fill: '#fff' });
      const onT = A.text(ch, 118, 104, 'ON', { size: 13, weight: 700, fill: C.sea2, anchor: 'middle', ls: '0.1em' });
      // leads
      const red = A.path(svg, 'M 600 260 C 560 330 300 260 274 318', { fill: 'none', stroke: C.port, 'stroke-width': 7, 'stroke-linecap': 'round' });
      const blk = A.path(svg, 'M 690 260 C 690 330 470 260 446 318', { fill: 'none', stroke: '#1B232C', 'stroke-width': 7, 'stroke-linecap': 'round' });
      const clipR = A.rect(svg, 262, 312, 24, 18, { rx: 4, fill: C.port });
      const clipB = A.rect(svg, 434, 312, 24, 18, { rx: 4, fill: '#1B232C' });
      const steps = A.g(svg);
      const s1 = A.tag(steps, 640, 330, '1  POWER OFF', { fill: C.stbd, size: 17 });
      const s2 = A.tag(steps, 640, 372, '2  LEADS OFF', { fill: C.stbd, size: 17 });
      gsap.set([s1, s2], { opacity: 0 });
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.4 });
      tl.to({}, { duration: 1 });
      tl.to(knob, { attr: { cx: -10 }, fill: '#9AA6B1', duration: 0.3 });
      tl.to(led, { attr: { fill: '#3B4F64' }, duration: 0.2 }, '<');
      tl.call(() => onT.textContent = 'OFF', null, '<');
      tl.to(s1, { opacity: 1, duration: 0.3 }, '<');
      tl.to([red, clipR], { y: -60, x: 20, opacity: 0.25, duration: 0.6 }, '+=0.8');
      tl.to([blk, clipB], { y: -60, x: 20, opacity: 0.25, duration: 0.6 }, '<0.2');
      tl.to(s2, { opacity: 1, duration: 0.3 }, '<');
      tl.to({}, { duration: 2 });
      tl.to([red, clipR, blk, clipB], { y: 0, x: 0, opacity: 1, duration: 0.4 });
      tl.to([s1, s2], { opacity: 0, duration: 0.3 }, '<');
      tl.to(knob, { attr: { cx: 10 }, fill: '#fff', duration: 0.3 }, '<');
      tl.to(led, { attr: { fill: C.stbd }, duration: 0.2 }, '<');
      tl.call(() => onT.textContent = 'ON', null, '<');
    }
  });

  P.push({
    type: 'try', title: 'Battery inspection',
    html: `<p>This battery set-up has four problems. Tap each one.</p>`,
    lockMsg: 'Find all four problems',
    build(svg, S, api) {
      A.paperBg(svg);
      // box without vents
      A.rect(svg, 116, 266, 430, 260, { rx: 18, fill: 'rgba(18,38,58,0.15)' });
      A.rect(svg, 110, 258, 430, 260, { rx: 18, fill: '#5E7E8E' });
      A.rect(svg, 110, 258, 430, 40, { rx: 18, fill: '#6F909F' });
      A.text(svg, 325, 284, 'SEALED LID', { size: 15, weight: 700, fill: '#2C4250', anchor: 'middle', ls: '0.14em' });
      // loose battery, tilted, no strap
      const bg = A.g(svg, { transform: 'translate(325,430) rotate(-7)' });
      const b = battery(bg, 0, 0, 1);
      // corrosion on + terminal
      const rnd = A.rng(9);
      for (let i = 0; i < 14; i++) { const a = rnd() * 6.28, r = 8 + rnd() * 14; A.circle(b.pos, Math.cos(a) * r, -6 + Math.sin(a) * r * 0.7, 4 + rnd() * 5, { fill: rnd() > 0.5 ? '#6FBF8E' : '#E6EFE6' }); }
      // wall socket with charger switched on, someone pulling lead
      const wall = A.g(svg, { transform: 'translate(640,140)' });
      A.rect(wall, -60, -50, 120, 100, { rx: 12, fill: C.white, stroke: C.line, 'stroke-width': 2 });
      A.rect(wall, -36, -24, 30, 48, { rx: 4, fill: C.paper2 });
      A.rect(wall, -30, -18, 18, 18, { rx: 3, fill: C.port });
      A.text(wall, -21, 40, 'ON', { size: 13, weight: 700, fill: C.port, anchor: 'middle' });
      A.circle(wall, 26, 0, 14, { fill: C.paper2 });
      const cable = A.path(svg, 'M 666 140 C 700 260 620 330 470 352', { fill: 'none', stroke: '#1B232C', 'stroke-width': 6, 'stroke-linecap': 'round' });
      const hand = A.g(svg, { transform: 'translate(470,352)' });
      A.circle(hand, 0, 0, 13, { fill: C.skin });
      gsap.to(hand, { x: 8, y: -10, duration: 0.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to(bg, { rotation: -3, svgOrigin: '325 430', duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      spot(api, S, svg, {
        spots: [
          { x: 325, y: 280, r: 60, why: '<b>No ventilation.</b> A battery box must be ventilated so charging gas can escape.' },
          { x: 325, y: 445, r: 70, why: '<b>Not secured.</b> Batteries must be held down with brackets.' },
          { x: 250, y: 360, r: 46, why: '<b>Corroded terminal.</b> Clean it, grease it and make sure it is tight.' },
          { x: 640, y: 135, r: 60, why: '<b>Charger still on.</b> Turn off the power before you disconnect the leads.' }
        ],
        end: 'Well spotted.'
      });
    }
  });

  P.push({
    type: 'learn', title: 'Spark plugs',
    html: `<p>Modern spark plugs last a long time. When one fails, cleaning it is unlikely to bring it back to life.</p>
<p>So carry a <b>spare set of new plugs</b> and a <b>spark plug spanner</b>, and keep your machinery well serviced.</p>`,
    art(svg, S) {
      A.paperBg(svg);
      card(svg, 140, 100, 520, 400);
      const plug = (x, y, r) => {
        const g = A.g(svg, { transform: `translate(${x},${y}) rotate(${r})` });
        A.rect(g, -6, -150, 12, 20, { rx: 3, fill: '#8C97A3' });
        A.path(g, 'M -16 -132 L 16 -132 L 14 -40 L -14 -40 Z', { fill: '#F2F0EA', stroke: '#B9B3A3', 'stroke-width': 2 });
        [-118, -104, -90].forEach(yy => A.line(g, -15, yy, 15, yy, { stroke: '#D9D3C3', 'stroke-width': 3 }));
        A.path(g, 'M -24 -40 L 24 -40 L 24 -10 L -24 -10 Z', { fill: '#9AA6B1', stroke: '#6B7783', 'stroke-width': 2 });
        A.rect(g, -12, -10, 24, 42, { fill: '#B5BEC7' });
        for (let k = 0; k < 6; k++) A.line(g, -12, -6 + k * 7, 12, -2 + k * 7, { stroke: '#7D8995', 'stroke-width': 2 });
        A.path(g, 'M -4 32 L 4 32 L 4 44 M 4 44 L -10 44', { stroke: '#6B7783', 'stroke-width': 4, fill: 'none' });
        return g;
      };
      const plugs = [plug(280, 370, -8), plug(350, 380, -2), plug(420, 380, 4)];
      // spanner
      const sp = A.g(svg, { transform: 'translate(560,300) rotate(20)' });
      A.rect(sp, -14, -140, 28, 200, { rx: 10, fill: '#7D8995' });
      A.rect(sp, -26, -170, 52, 46, { rx: 10, fill: '#7D8995' });
      A.circle(sp, 0, -147, 13, { fill: C.white });
      A.rect(sp, -34, 40, 68, 16, { rx: 8, fill: C.ink });
      A.tag(svg, 400, 470, 'SPARE PLUGS + SPANNER', { fill: C.ink, size: 18 });
      gsap.from(plugs, { y: -30, opacity: 0, stagger: 0.25, duration: 0.6, ease: 'back.out' });
      gsap.to(sp, { rotation: '+=10', svgOrigin: '560 300', duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    }
  });

  P.push({
    type: 'learn', title: 'The water pump',
    html: `<p>The motor is cooled by water pumped through it by a rubber <span class="term">impeller</span>. Impellers are normally changed at the <b>annual service</b>. Change it more often if you have run in the shallows and stirred up sand.</p>
<p>Every time you start the motor, make sure water is coming out of the exhaust or the <span class="term">telltale</span>, the small stream at the back. Check regularly for water leaks.</p>`,
    art(svg, S) {
      sky(svg, '#DCE9EC', '#EEF2EC');
      outboard(svg, 260, 330, 1.2);
      sternHull(svg, 260, 330, 1.2);
      telltale(svg, 260, 330, 1.2);
      A.waterSide(svg, 300);
      const lab = A.tag(svg, 150, 150, 'TELLTALE', { fill: C.ink, size: 16 });
      A.arrow(svg, 'M 150 168 Q 160 160 180 170', { color: C.ink, width: 3 });
      // impeller inset
      const ins = A.g(svg, { transform: 'translate(620,170)' });
      A.circle(ins, 3, 5, 88, { fill: 'rgba(18,38,58,0.2)' });
      A.circle(ins, 0, 0, 88, { fill: C.white, stroke: C.line, 'stroke-width': 2 });
      A.circle(ins, 0, 0, 70, { fill: '#DCE3E8' });
      const imp = A.g(ins);
      for (let k = 0; k < 8; k++) A.path(imp, 'M 0 -18 Q 26 -40 18 -64', { stroke: '#1B232C', 'stroke-width': 9, fill: 'none', 'stroke-linecap': 'round', transform: `rotate(${k * 45})` });
      A.circle(imp, 0, 0, 20, { fill: '#1B232C' });
      A.circle(imp, 0, 0, 7, { fill: '#8C97A3' });
      A.text(ins, 0, 112, 'IMPELLER', { size: 16, weight: 700, anchor: 'middle', fill: C.ink2, ls: '0.14em' });
      gsap.to(imp, { rotation: 360, svgOrigin: '0 0', duration: 1.2, repeat: -1, ease: 'none' });
    }
  });

  P.push({
    type: 'try', title: 'Check the telltale',
    html: `<p>You have just started the motor. Look at the telltale, then decide.</p>`,
    lockMsg: 'Check all three starts',
    build(svg, S, api) {
      sky(svg, '#DCE9EC', '#EEF2EC');
      outboard(svg, 260, 330, 1.2);
      sternHull(svg, 260, 330, 1.2);
      let tt = null;
      const wl = A.waterSide(svg, 300);
      const lay = A.g(svg);
      rounds(api, S, {
        noun: 'Start',
        choices: ['All good, carry on', 'Stop the motor and check'],
        items: [
          { mode: 'none', a: 1, why: 'No water means no cooling. Stop the motor before it overheats and find out why.' },
          { mode: 'ok', a: 0, why: 'A steady stream: cooling water is flowing. Off you go.' },
          { mode: 'weak', a: 1, why: 'A weak, spluttering stream means the cooling water is struggling. Stop and check.' }
        ],
        show(it) { if (tt) tt.remove(); tt = telltale(lay, 260, 330, 1.2, it.mode); svg.insertBefore(lay, wl); },
        end: 'Check the telltale every time you start the motor.'
      });
    }
  });

  P.push({
    type: 'learn', title: 'Gearbox oil',
    html: `<p>Bleed a little oil from the <b>drain screw</b> on the gear case and look at it.</p>
<p>Clean oil is fine. If <b>water</b> appears, or the oil looks <b>milky</b>, water is getting into the gearbox. Take the motor to a <b>service centre</b>.</p>`,
    art(svg, S) {
      sky(svg, '#E5EDEA', '#F2ECDD');
      const m = outboard(svg, 300, 230, 1.5, {});
      A.tag(svg, 312, 400, 'DRAIN SCREW', { fill: C.ink, size: 16 });
      const drop = A.path(svg, 'M 0 -10 Q 8 0 8 4 A 8 8 0 0 1 -8 4 Q -8 0 0 -10 Z', { fill: '#C9962E' });
      gsap.set(drop, { x: 312, y: 360, opacity: 0 });
      // glasses
      const glass = (x, col, label, good) => {
        const g = A.g(svg, { transform: `translate(${x},420)` });
        A.path(g, 'M -40 0 L 40 0 L 32 110 L -32 110 Z', { fill: 'rgba(255,255,255,0.6)', stroke: C.ink2, 'stroke-width': 2.5, 'stroke-linejoin': 'round' });
        A.path(g, 'M -36 46 L 36 46 L 32 108 L -32 108 Z', { fill: col });
        if (label === 'WATER') { A.path(g, 'M -33 86 L 33 86 L 32 108 L -32 108 Z', { fill: '#7FB6D0' }); }
        A.text(g, 0, 140, label, { size: 17, weight: 700, anchor: 'middle', fill: C.ink2, ls: '0.1em' });
        A.tick(g, 36, -6, 14, good);
        return g;
      };
      glass(540, '#C9962E', 'CLEAR', true);
      glass(640, '#E8DCC2', 'MILKY', false);
      glass(740, '#C9962E', 'WATER', false);
      gsap.timeline({ repeat: -1, repeatDelay: 0.6 }).to(drop, { opacity: 1, duration: 0.2 }).to(drop, { y: 420, duration: 0.6, ease: 'power2.in' }).to(drop, { opacity: 0, duration: 0.2 });
    }
  });

  P.push({
    type: 'try', title: 'Read the oil',
    html: `<p>You bleed some oil from the drain screw. What should you do?</p>`,
    lockMsg: 'Judge all three samples',
    build(svg, S, api) {
      A.paperBg(svg);
      const g = A.g(svg, { transform: 'translate(400,170)' });
      A.path(g, 'M -110 0 L 110 0 L 88 300 L -88 300 Z', { fill: 'rgba(255,255,255,0.7)', stroke: C.ink2, 'stroke-width': 4, 'stroke-linejoin': 'round' });
      const oil = A.path(g, 'M -100 120 L 100 120 L 88 296 L -88 296 Z', { fill: '#C9962E' });
      const water = A.path(g, 'M -92 240 L 92 240 L 88 296 L -88 296 Z', { fill: '#7FB6D0', opacity: 0 });
      const shine = A.path(g, 'M -70 140 L -60 280', { stroke: 'rgba(255,255,255,0.5)', 'stroke-width': 8, 'stroke-linecap': 'round' });
      rounds(api, S, {
        noun: 'Sample',
        choices: ['It looks fine', 'Take it to a service centre'],
        items: [
          { col: '#E6DAC0', w: 0, a: 1, why: 'Milky oil means water has got into the gearbox. Take the motor to a service centre.' },
          { col: '#C9962E', w: 0, a: 0, why: 'Clear, clean oil. Nothing to worry about.' },
          { col: '#C9962E', w: 1, a: 1, why: 'Water is sitting under the oil. Take the motor to a service centre.' }
        ],
        show(it) { gsap.to(oil, { attr: { fill: it.col }, duration: 0.4 }); gsap.to(water, { opacity: it.w, duration: 0.4 }); },
        end: 'Water in the gearbox will eventually make it fail, so act early.'
      });
    }
  });

  P.push({
    type: 'learn', title: 'Fuel and fire',
    html: `<p>Fuel, for engines or stoves, is the most common part of boat <b>fires and explosions</b>. Leaks and poor ventilation are the usual problems.</p>
<ul><li>Regularly inspect fuel and gas tanks, valves, pumps and lines for corrosion and leaks.</li><li>Get problems fixed by an expert. Temporary repairs can be dangerous.</li><li>Do the <b>sniff test</b> each time you board. If you smell fuel, find the problem.</li></ul>`,
    art(svg, S) {
      sky(svg, '#DCE9EC', '#EEF2EC');
      const hull = A.g(svg);
      A.path(hull, 'M 90 300 L 720 290 L 690 470 L 140 480 Z', { fill: C.white, stroke: C.ink, 'stroke-width': 3, 'stroke-linejoin': 'round' });
      A.path(hull, 'M 120 330 L 700 322 L 680 450 L 150 458 Z', { fill: '#E6E2D6' });
      // tank
      A.rect(hull, 330, 370, 200, 70, { rx: 12, fill: C.port });
      A.text(hull, 430, 414, 'FUEL', { size: 22, weight: 700, fill: '#fff', anchor: 'middle', ls: '0.16em' });
      A.path(hull, 'M 330 400 C 260 400 200 380 160 360', { stroke: '#1B232C', 'stroke-width': 6, fill: 'none' });
      A.waterSide(svg, 440);
      // person sniffing
      const p = A.person(svg, { x: 610, y: 300, s: 1.2, side: true, flip: true, fwdR: 40, fwdL: 20 });
      gsap.to(p.g, { rotation: -6, svgOrigin: '610 300', duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      const fumes = A.g(svg);
      for (let i = 0; i < 6; i++) {
        const f = A.path(fumes, 'M 0 0 q 8 -10 0 -20 q -8 -10 0 -20', { stroke: '#9FB06A', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' });
        gsap.fromTo(f, { x: 380 + i * 25, y: 370, opacity: 0 }, { y: 250, x: `+=${20 + i * 6}`, opacity: 0.8, duration: 2.4, repeat: -1, delay: i * 0.4, ease: 'sine.out', yoyo: false });
      }
      A.tag(svg, 600, 160, 'SNIFF TEST EVERY TIME', { fill: C.ink, size: 18 });
    }
  });

  P.push({
    type: 'learn', title: 'Keep fuel clean',
    html: `<ul><li>Check and change <b>fuel filters</b> often, and carry spares.</li><li>Keep tanks <b>topped up</b> and closed when not in use. Less air in the tank means less <span class="term">condensation</span>, and less water in your fuel.</li><li>Clean out portable tanks at least yearly. Replace old fuel after a long time unused: water is likely to have built up in it.</li><li>Don't use petrol-oil <b>pre-mix older than three months</b>. Keep oil injection reservoirs full.</li></ul>`,
    art(svg, S) {
      A.paperBg(svg);
      card(svg, 120, 110, 560, 380);
      const filt = A.g(svg, { transform: 'translate(270,300)' });
      A.rect(filt, -50, -110, 100, 30, { rx: 6, fill: '#5B6670' });
      A.rect(filt, -44, -80, 88, 160, { rx: 14, fill: 'rgba(214,232,233,0.7)', stroke: C.ink2, 'stroke-width': 3 });
      const fuel = A.rect(filt, -40, -40, 80, 116, { rx: 10, fill: '#E9C86A' });
      const bad = A.rect(filt, -40, 50, 80, 26, { rx: 8, fill: '#7FB6D0' });
      A.text(filt, 0, 120, 'FILTER', { size: 16, weight: 700, anchor: 'middle', fill: C.ink2, ls: '0.14em' });
      const jug = A.g(svg, { transform: 'translate(520,300)' });
      A.path(jug, 'M -70 -90 L 50 -90 L 70 -70 L 70 100 L -70 100 Z', { fill: C.port, stroke: '#8E2018', 'stroke-width': 3, 'stroke-linejoin': 'round' });
      A.rect(jug, -40, -116, 40, 26, { rx: 4, fill: '#1B232C' });
      A.text(jug, 0, 10, 'PRE-MIX', { size: 18, weight: 700, fill: '#fff', anchor: 'middle', ls: '0.1em' });
      const dt = A.g(jug, { transform: 'translate(0,48)' });
      A.rect(dt, -48, -18, 96, 34, { rx: 6, fill: C.white });
      A.text(dt, 0, 6, 'USE BY 3 MONTHS', { size: 12, weight: 700, fill: C.ink, anchor: 'middle' });
      gsap.to(bad, { attr: { y: 76, height: 0 }, duration: 1.2, repeat: -1, yoyo: true, repeatDelay: 1, ease: 'sine.inOut' });
    }
  });

  P.push({
    type: 'watch', title: 'Water in the tank',
    html: `<p>Two tanks sit for weeks. One is half full, one is topped up. Watch what happens as days and nights go by.</p>`,
    anim(svg, S) {
      const bgc = A.rect(svg, 0, 0, 800, 600, { fill: '#E3EDF0' });
      A.rect(svg, 0, 470, 800, 130, { fill: C.paper2 });
      const sun = A.circle(svg, 400, 90, 30, { fill: C.buoy });
      const tank = (x, level, label) => {
        const g = A.g(svg, { transform: `translate(${x},250)` });
        A.rect(g, -130, -10, 260, 230, { rx: 26, fill: 'rgba(255,255,255,0.55)', stroke: C.ink2, 'stroke-width': 4 });
        A.rect(g, -24, -30, 48, 22, { rx: 4, fill: C.ink2 });
        const fuel = A.rect(g, -126, 216 - level, 252, level, { rx: 22, fill: '#E9C86A' });
        const water = A.rect(g, -126, 216, 252, 0, { rx: 10, fill: '#5FA2C4' });
        const drops = A.g(g);
        A.text(g, 0, 262, label, { size: 20, weight: 700, anchor: 'middle', fill: C.ink2, ls: '0.1em' });
        return { g, fuel, water, drops, level };
      };
      const half = tank(220, 100, 'HALF FULL'), full = tank(580, 222, 'TOPPED UP');
      const cap = caption(svg);
      const tl = gsap.timeline();
      cap.show(tl, 0.2, 'Warm days and cold nights make moisture condense in the empty space.');
      for (let d = 0; d < 4; d++) {
        const t0 = 1 + d * 2.4;
        tl.to(bgc, { attr: { fill: '#1A2B40' }, duration: 0.9 }, t0);
        tl.to(sun, { attr: { fill: '#E8EEF2', r: 22 }, duration: 0.9 }, t0);
        for (let k = 0; k < 4; k++) {
          const dx = -100 + k * 60 + d * 7;
          const dr = A.path(half.drops, 'M 0 -6 Q 5 0 5 3 A 5 5 0 0 1 -5 3 Q -5 0 0 -6 Z', { fill: '#5FA2C4', opacity: 0 });
          gsap.set(dr, { x: dx, y: 10 });
          tl.to(dr, { opacity: 1, duration: 0.3 }, t0 + 0.5 + k * 0.1);
          tl.to(dr, { y: 210, duration: 0.8, ease: 'power2.in' }, t0 + 1.0 + k * 0.1);
          tl.to(dr, { opacity: 0, duration: 0.1 }, t0 + 1.8 + k * 0.1);
        }
        tl.to(half.water, { attr: { y: 216 - (d + 1) * 7, height: (d + 1) * 7 }, duration: 0.4 }, t0 + 1.8);
        tl.to(bgc, { attr: { fill: '#E3EDF0' }, duration: 0.9 }, t0 + 1.5);
        tl.to(sun, { attr: { fill: C.buoy, r: 30 }, duration: 0.9 }, t0 + 1.5);
      }
      cap.show(tl, 6, 'Water is heavier than fuel, so it sinks to the bottom.');
      cap.show(tl, 11, 'The topped-up tank has almost no air, so very little water forms.');
      tl.to({}, { duration: 3 });
      return tl;
    }
  });

  P.push({
    type: 'check', title: 'Topped up',
    q: 'Why should you keep your fuel tanks topped up when the boat is not in use?',
    opts: ['Less air means less condensation', 'The boat sits lower and steadier', 'Full tanks keep the motor quieter', 'Fuel gauges only work when full'], a: 0,
    why: 'A full tank has little air space, so less moisture condenses and less water ends up in your fuel.'
  });

  P.push({
    type: 'learn', title: 'Propellers',
    html: `<p>The prop's rubber <span class="term">bushing</span> can fail, especially after hitting sand or rocks. Carry a <b>spare propeller</b>, even a second-hand one.</p>
<p>Keep props clean: hammer out small bends, file jagged bits smooth, or replace a badly damaged prop.</p>
<p><b>Fishing line</b> wrapped around the prop shaft can destroy the gearbox seals and let water in. Remove the prop regularly to check.</p>`,
    art(svg, S) {
      A.paperBg(svg);
      card(svg, 110, 110, 580, 380);
      const g = A.g(svg, { transform: 'translate(400,300)' });
      // gear case nose
      A.path(g, 'M 120 -40 L 260 -40 L 260 40 L 120 40 Q 80 40 70 0 Q 80 -40 120 -40 Z', { fill: '#27323E' });
      // seal ring
      const seal = A.rect(g, 52, -22, 18, 44, { rx: 4, fill: C.ink2 });
      // shaft
      A.rect(g, -120, -10, 180, 20, { fill: '#9AA6B1' });
      // prop hub + blades (side)
      A.rect(g, -110, -26, 90, 52, { rx: 14, fill: '#8C97A3' });
      A.path(g, 'M -80 -26 Q -110 -90 -70 -150 Q -40 -90 -50 -26 Z', { fill: '#AEB8C2', stroke: '#5E6A76', 'stroke-width': 2 });
      A.path(g, 'M -80 26 Q -110 90 -70 150 Q -40 90 -50 26 Z', { fill: '#AEB8C2', stroke: '#5E6A76', 'stroke-width': 2 });
      // fishing line wraps
      let d = 'M -240 -120 C -150 -60 -20 -40 0 -12';
      for (let k = 0; k < 7; k++) d += ` C ${6 + k * 6} -12 ${10 + k * 6} 14 ${4 + k * 6} 14 C ${-2 + k * 6} 14 ${4 + k * 6} -12 ${12 + k * 6} -12`;
      const fl = A.path(g, d, { fill: 'none', stroke: '#2FB3A0', 'stroke-width': 3, 'stroke-linecap': 'round' });
      const leak = A.g(g);
      for (let i = 0; i < 4; i++) A.circle(leak, 0, 0, 5, { fill: '#5FA2C4', opacity: 0 });
      const lab = A.tag(svg, 520, 180, 'LINE CUTS THE SEAL', { fill: C.port, size: 16 });
      gsap.set(lab, { opacity: 0 });
      const L = fl.getTotalLength();
      gsap.set(fl, { strokeDasharray: L, strokeDashoffset: L });
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
      tl.to(fl, { strokeDashoffset: 0, duration: 3, ease: 'power1.inOut' });
      tl.to(seal, { attr: { fill: C.port }, duration: 0.3 });
      tl.to(lab, { opacity: 1, duration: 0.3 }, '<');
      [...leak.children].forEach((c, i) => tl.fromTo(c, { attr: { cx: 40, cy: 0 }, opacity: 1 }, { attr: { cx: 130 + i * 25, cy: (i % 2 ? 14 : -14) }, opacity: 0, duration: 1 }, '-=0.75'));
      tl.to({}, { duration: 1.5 });
      tl.to([fl, lab], { opacity: 0, duration: 0.4 });
      tl.set(fl, { strokeDashoffset: L, opacity: 1 });
      tl.set(seal, { attr: { fill: C.ink2 } });
    }
  });

  P.push({
    type: 'learn', title: 'Hull and anodes',
    html: `<p><span class="term">Anodes</span> are blocks of soft metal bolted to the motor and hull. They corrode away so your motor and hull don't. Check them, and <b>replace them when about 40 per cent eroded</b>.</p>
<p>Also check the hull for cracks, rust or blistering, make sure the <b>bilges are clean and dry</b>, and remove stray metal items from aluminium boats.</p>`,
    art(svg, S) {
      A.paperBg(svg);
      card(svg, 130, 100, 540, 400);
      const an = A.g(svg, { transform: 'translate(320,300)' });
      A.rect(an, -90, -50, 180, 100, { rx: 10, fill: 'none', stroke: C.line, 'stroke-width': 3, 'stroke-dasharray': '8 6' });
      const block = A.rect(an, -90, -50, 180, 100, { rx: 10, fill: '#B9C2CB', stroke: '#7D8995', 'stroke-width': 2 });
      A.circle(an, -50, 0, 9, { fill: '#5B6670' }); A.circle(an, 50, 0, 9, { fill: '#5B6670' });
      A.text(an, 0, 90, 'ANODE', { size: 18, weight: 700, anchor: 'middle', fill: C.ink2, ls: '0.16em' });
      // meter
      const mx = 560;
      A.rect(svg, mx - 20, 170, 40, 260, { rx: 20, fill: C.paper2, stroke: C.line, 'stroke-width': 2 });
      const fill = A.rect(svg, mx - 14, 176, 28, 248, { rx: 14, fill: C.stbd });
      A.line(svg, mx - 34, 176 + 248 * 0.4, mx + 34, 176 + 248 * 0.4, { stroke: C.port, 'stroke-width': 3 });
      A.text(svg, mx + 42, 176 + 248 * 0.4 + 6, '40%', { size: 18, weight: 700, fill: C.port });
      const pct = A.text(svg, mx, 160, '0% eroded', { size: 18, weight: 700, anchor: 'middle', fill: C.ink2 });
      const rep = A.tag(svg, 320, 190, 'REPLACE NOW', { fill: C.port, size: 18 });
      gsap.set(rep, { opacity: 0 });
      const st = { v: 0 };
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
      tl.to(st, {
        v: 40, duration: 4, ease: 'none', onUpdate() {
          const f = st.v / 100;
          block.setAttribute('width', 180 * (1 - f * 0.9)); block.setAttribute('x', -90 + 90 * f * 0.9);
          block.setAttribute('height', 100 * (1 - f * 0.7)); block.setAttribute('y', -50 + 50 * f * 0.7);
          fill.setAttribute('y', 176 + 248 * f); fill.setAttribute('height', 248 * (1 - f));
          pct.textContent = Math.round(st.v) + '% eroded';
        }
      });
      tl.to(fill, { attr: { fill: C.port }, duration: 0.3 });
      tl.to(rep, { opacity: 1, duration: 0.3 }, '<');
      tl.to({}, { duration: 2 });
      tl.to(rep, { opacity: 0, duration: 0.3 });
      tl.set(st, { v: 0 }); tl.set(fill, { attr: { fill: C.stbd, y: 176, height: 248 } });
      tl.set(block, { attr: { x: -90, y: -50, width: 180, height: 100 } });
      tl.call(() => pct.textContent = '0% eroded');
    }
  });

  const SCHED = [
    ['PRE-TRIP', C.stbd, ['Bungs in', 'Bilges clean and dry', 'Test bilge pump', 'Safety gear in date', 'No LP gas leaks', 'Test steering']],
    ['POST-TRIP', C.sea4, ['Flush motor with fresh water', 'Bungs out', 'LP gas valves off', 'Battery isolator off']],
    ['MONTHLY', C.orange, ['Inspect LP gas hoses', 'Battery: top up and clean', 'Inspect safety gear']],
    ['YEARLY', C.port, ['Motor serviced', 'LP gas system serviced', 'Clean fuel tank', 'Change impeller']]
  ];
  P.push({
    type: 'learn', title: 'A maintenance schedule',
    html: `<p>Some jobs happen every trip, others monthly or yearly. The workbook's schedule is a good guide, and your manufacturer's handbook has the details.</p>
<p>Before a trip, check things like the bungs, bilges, steering, nav lights and safety gear. After a trip, flush the motor and take the bungs out. Have any <b>LP gas system serviced every year</b>.</p>`,
    art(svg, S) {
      A.paperBg(svg);
      SCHED.forEach(([h, col, items], k) => {
        const x = 30 + k * 188;
        const g = A.g(svg, { transform: `translate(${x},70)` });
        A.rect(g, 3, 5, 176, 460, { rx: 16, fill: 'rgba(18,38,58,0.12)' });
        A.rect(g, 0, 0, 176, 460, { rx: 16, fill: C.white, stroke: C.line, 'stroke-width': 1.5 });
        A.path(g, 'M 0 16 Q 0 0 16 0 L 160 0 Q 176 0 176 16 L 176 48 L 0 48 Z', { fill: col });
        A.text(g, 88, 33, h, { size: 21, weight: 700, fill: '#fff', anchor: 'middle', ls: '0.08em' });
        let yy = 78;
        items.forEach((it, j) => {
          const row = A.g(g, { transform: `translate(14,${yy})` });
          A.circle(row, 8, 0, 8, { fill: col, opacity: 0.85 });
          const ls = wrap(it, 16);
          ls.forEach((l, q) => A.text(row, 24, 6 + q * 19, l, { font: 'body', size: 15, fill: C.ink }));
          yy += 24 + ls.length * 19;
          gsap.from(row, { opacity: 0, x: -10, duration: 0.4, delay: 0.3 + k * 0.35 + j * 0.08 });
        });
      });
    }
  });

  P.push({
    type: 'try', title: 'When do you do it?',
    html: `<p>Sort each job into the right part of the schedule.</p>`,
    lockMsg: 'Sort all eight jobs',
    build(svg, S, api) {
      A.paperBg(svg);
      const cols = SCHED.map(([h, col], k) => {
        const x = 30 + k * 188;
        const g = A.g(svg, { transform: `translate(${x},250)` });
        A.rect(g, 0, 0, 176, 320, { rx: 16, fill: C.white, stroke: C.line, 'stroke-width': 1.5 });
        A.path(g, 'M 0 16 Q 0 0 16 0 L 160 0 Q 176 0 176 16 L 176 44 L 0 44 Z', { fill: col });
        A.text(g, 88, 30, h, { size: 20, weight: 700, fill: '#fff', anchor: 'middle', ls: '0.08em' });
        return { x, n: 0, col };
      });
      const job = A.g(svg);
      const jobT = A.text(job, 400, 132, '', { font: 'body', size: 26, weight: 700, anchor: 'middle', fill: C.ink });
      const jobBg = A.rect(job, 120, 82, 560, 80, { rx: 18, fill: C.white, stroke: C.ink, 'stroke-width': 2.5 });
      job.insertBefore(jobBg, jobT);
      const items = [
        ['Put the bungs in', 0], ['Flush the motor with fresh water', 1], ['Have the LP gas system serviced', 3], ['Check for LP gas leaks', 0],
        ['Inspect LP gas hoses and cylinders', 2], ['Take the bungs out', 1], ['Clean the fuel tank with solvent', 3], ['Test the bilge pump', 0]
      ].map(([t, a]) => ({ t, a, why: `<b>${['Pre-trip', 'Post-trip', 'Monthly', 'Yearly'][a]}.</b> ${t}.` }));
      rounds(api, S, {
        noun: 'Job',
        choices: ['Pre-trip', 'Post-trip', 'Monthly', 'Yearly'],
        items,
        show(it) { jobT.textContent = it.t; gsap.fromTo(job, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.3 }); },
        right(it) {
          const c = cols[it.a];
          const chip = A.g(svg, { transform: `translate(${c.x + 10},${306 + c.n * 64})` });
          A.rect(chip, 0, 0, 156, 54, { rx: 10, fill: c.col, opacity: 0.14 });
          const words = it.t.split(' '); const l1 = [], l2 = [];
          words.forEach(w => ((l1.join(' ') + ' ' + w).length < 19 && !l2.length ? l1 : l2).push(w));
          A.text(chip, 10, 22, l1.join(' '), { font: 'body', size: 14, fill: C.ink });
          if (l2.length) A.text(chip, 10, 42, l2.join(' '), { font: 'body', size: 14, fill: C.ink });
          gsap.from(chip, { opacity: 0, y: -40, duration: 0.4 });
          c.n++;
          gsap.to(job, { opacity: 0, duration: 0.3, delay: 0.6 });
        },
        bad: 'Not quite. Is it something you do every trip, or less often?',
        end: 'That is the rhythm: quick checks every trip, deeper checks monthly and yearly.'
      });
    }
  });

  /* ---------- workbook self-test ---------- */
  P.push({
    type: 'review', n: 1, of: 5, title: 'Workbook self-test',
    q: 'How often should you have the motor on your vessel serviced?',
    opts: ['Before each time you use the vessel.', 'Every four months.', 'At least once a year.', 'Once every two years.'], a: 2,
    why: 'Have the motor serviced by a specialised workshop at least once a year, even if you use it very little.'
  });
  P.push({
    type: 'review', n: 2, of: 5, title: 'Workbook self-test',
    q: 'Before you go on a boating trip you should?',
    opts: ['Test navigation lights.', 'Check bilges are clean and dry.', 'Check steering.', 'All of the above.'], a: 3,
    why: 'All of these are pre-trip checks.'
  });
  P.push({
    type: 'review', n: 3, of: 5, title: 'Workbook self-test',
    q: 'You should replace old fuel after a long period of inactivity because?',
    opts: ['Your vessel won’t reach top speed.', 'The oil will settle on the bottom of the tank.', 'The octane level will reduce with time.', 'Water is likely to have built up in it.'], a: 3,
    why: 'Condensation builds up water in fuel that sits for a long time.'
  });
  P.push({
    type: 'review', n: 4, of: 5, title: 'Workbook self-test',
    q: 'Batteries in a vessel should be located?',
    opts: ['In a ventilated container.', 'In a sealed container.', 'As low as possible in the bilge.', 'On deck, exposed to the elements.'], a: 0,
    why: 'Secure batteries with brackets inside a ventilated container.'
  });
  P.push({
    type: 'review', n: 5, of: 5, title: 'Workbook self-test',
    q: 'If your vessel is fitted with a LP gas system, how often should you have it serviced?',
    opts: ['Before each trip.', 'After each trip.', 'Monthly.', 'Yearly.'], a: 3,
    why: 'Have the LP gas system serviced yearly. Check for leaks before each trip and inspect hoses monthly.'
  });

  SR.chapter({
    id: 6,
    title: 'Maintenance',
    intro: 'Servicing, batteries, cooling, gearbox oil, fuel, propellers, anodes and a maintenance schedule.',
    cover(svg, S) {
      sky(svg, '#DCE9EC', '#F2ECDD');
      const m = outboard(svg, 330, 330, 1.25);
      sternHull(svg, 330, 330, 1.25);
      telltale(svg, 330, 330, 1.25);
      A.waterSide(svg, 300);
      gsap.to(m.blades, { scaleY: -1, transformOrigin: '50% 50%', duration: 0.12, repeat: -1, yoyo: true, ease: 'none' });
    },
    pages: P
  });
})();
