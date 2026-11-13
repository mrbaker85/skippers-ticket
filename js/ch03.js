/* Chapter 3: Collision Avoidance */
(function () {
  const A = SR.art, C = A.C;
  const share = SR.share = SR.share || {};

  /* ---------- shared helpers (also used by chapters 4 and 5) ---------- */
  function sky(svg, top, bottom) {
    const id = A.uid('sky');
    const lg = A.el('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 }, A.defs(svg));
    A.el('stop', { offset: 0, 'stop-color': top || '#E4EFEE' }, lg);
    A.el('stop', { offset: 1, 'stop-color': bottom || '#F6F0E2' }, lg);
    return A.rect(svg, 0, 0, 800, 600, { fill: `url(#${id})` });
  }
  function caption(svg, y) {
    const g = A.g(svg, { opacity: 0 });
    const r = A.rect(g, 0, 0, 10, 50, { rx: 14, fill: 'rgba(18,38,58,0.92)' });
    const t = A.text(g, 0, 32, '', { font: 'body', size: 19, fill: '#fff', anchor: 'middle' });
    const set = str => {
      t.textContent = str;
      let w = 0; try { w = t.getComputedTextLength(); } catch (e) { }
      w = (w || str.length * 9) + 44;
      r.setAttribute('width', w); r.setAttribute('x', -w / 2);
      g.setAttribute('transform', `translate(400,${y || 14})`);
    };
    return {
      g, set,
      show(tl, at, str) {
        tl.to(g, { opacity: 0, duration: 0.2 }, at);
        tl.call(() => set(str), null, at + 0.2);
        tl.to(g, { opacity: 1, duration: 0.3 }, at + 0.22);
      }
    };
  }
  /* pie slice from angle a0 to a1 (degrees, 0 = +x, clockwise) */
  function wedge(parent, cx, cy, r, a0, a1, attrs) {
    const p = a => [cx + Math.cos(a * Math.PI / 180) * r, cy + Math.sin(a * Math.PI / 180) * r];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return A.path(parent, `M ${cx} ${cy} L ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${(a1 - a0) > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z`, attrs);
  }
  /* label tag that follows a boat */
  function follow(S, svg, boat, txt, col, off) {
    const t = A.tag(svg, 0, 0, txt, { fill: col || C.ink, size: 16, rx: 8 });
    S.loop(() => t.setAttribute('transform', `translate(${(boat.x - t._w / 2).toFixed(1)},${(boat.y - t._h / 2 - (off || boat.L * boat.scale * 0.55 + 14)).toFixed(1)})`));
    return t;
  }
  /* ship horn through Web Audio. pattern: array of 's' (short) or 'p' (prolonged) */
  let actx = null;
  function horn(pattern) {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      if (actx.state === 'suspended') actx.resume();
      let t = actx.currentTime + 0.05;
      pattern.forEach(k => {
        const d = k === 'p' ? 4 : 0.8;
        const out = actx.createGain(); out.gain.value = 0;
        const lp = actx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
        [110, 165, 220].forEach((f, i) => { const o = actx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; const g = actx.createGain(); g.gain.value = [0.5, 0.25, 0.18][i]; o.connect(g); g.connect(lp); o.start(t); o.stop(t + d + 0.1); });
        lp.connect(out); out.connect(actx.destination);
        out.gain.setValueAtTime(0, t); out.gain.linearRampToValueAtTime(0.16, t + 0.06); out.gain.setValueAtTime(0.16, t + d - 0.08); out.gain.linearRampToValueAtTime(0, t + d);
        t += d + 0.55;
      });
    } catch (e) { }
  }
  /* expanding sound arcs in front of a point */
  function blasts(parent, x, y, n, dir) {
    const g = A.g(parent, { transform: `translate(${x},${y}) rotate(${dir || 0})` });
    const tl = gsap.timeline();
    for (let k = 0; k < n; k++) {
      [0, 1, 2].forEach(j => {
        const arc = A.path(g, 'M 0 -18 A 18 18 0 0 1 0 18', { fill: 'none', stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0 });
        tl.fromTo(arc, { attr: { transform: 'scale(1)' }, opacity: 0.9 }, { attr: { transform: 'scale(3.2)' }, opacity: 0, duration: 0.9, ease: 'power1.out' }, k * 1.35 + j * 0.16);
      });
    }
    return { g, tl };
  }
  /* the four collision sectors around a boat heading up the page */
  function sectors(parent, cx, cy, r, o) {
    o = o || {};
    const g = A.g(parent);
    // bow = -90deg. starboard: -90 .. 22.5, stern: 22.5 .. 157.5, port: 157.5 .. 270
    const st = wedge(g, cx, cy, r, -90, 22.5, { fill: 'rgba(28,138,79,0.16)', stroke: C.stbd, 'stroke-width': 2 });
    const sn = wedge(g, cx, cy, r, 22.5, 157.5, { fill: 'rgba(255,253,248,0.35)', stroke: C.ink3, 'stroke-width': 2 });
    const pt = wedge(g, cx, cy, r, 157.5, 270, { fill: 'rgba(200,53,43,0.14)', stroke: C.port, 'stroke-width': 2 });
    if (o.labels !== false) {
      A.tag(g, cx + r * 0.55, cy - r * 0.35, 'STARBOARD 112.5°', { fill: C.stbd, size: 15 });
      A.tag(g, cx - r * 0.55, cy - r * 0.35, 'PORT 112.5°', { fill: C.port, size: 15 });
      A.tag(g, cx, cy + r * 0.62, 'STERN 135°', { fill: C.ink2, size: 15 });
    }
    g.st = st; g.sn = sn; g.pt = pt;
    return g;
  }
  share.sky = sky; share.caption = caption; share.wedge = wedge; share.follow = follow; share.horn = horn; share.blasts = blasts; share.sectors = sectors;

  const P = [];

  /* ===================================================================
     THE BASICS
     =================================================================== */
  P.push({
    type: 'learn', title: 'Traffic laws of the sea',
    html: `<p>The <span class="term">International Regulations for Preventing Collisions at Sea</span> apply on all WA waters, and on the water all over the world. They are the traffic laws of the sea, and every vessel afloat has to obey them.</p>
<p>The full rules are very detailed. This chapter covers the main principles every skipper needs.</p>`,
    art(svg, S) {
      S.seaBg(svg);
      const wk = A.g(svg); S.wakes(wk);
      const ship = S.boat(svg, { type: 'ferry', len: 300, color: C.deep });
      gsap.timeline({ repeat: -1 }).set(ship, { x: -260, y: 170, rotation: 8 }).to(ship, { x: 1060, y: 230, duration: 30, ease: 'none' });
      const y = S.boat(svg, { type: 'yacht', len: 90, color: C.stbd, tack: 'port' });
      gsap.timeline({ repeat: -1 }).set(y, { x: 900, y: 420, rotation: 195 }).to(y, { x: -120, y: 350, duration: 34, ease: 'none' });
      const m = S.boat(svg, { len: 90, color: C.port });
      gsap.timeline({ repeat: -1 }).set(m, { x: 250, y: 680, rotation: -80 }).to(m, { motionPath: { path: 'M 250 680 C 280 520 360 420 520 380 C 640 350 700 280 760 -100', autoRotate: true }, duration: 12, ease: 'none' });
      A.tag(svg, 400, 545, 'THE SAME RULES, EVERYWHERE', { fill: C.ink });
    }
  });

  P.push({
    type: 'learn', title: 'Everyone must avoid collisions',
    html: `<p>Every skipper has a responsibility to avoid a collision.</p>
<p>Even when the rules say another vessel should keep out of your way, if it doesn't, you must be ready to act yourself. Having right of way never means you can drive into danger.</p>`,
    art(svg, S) {
      S.seaBg(svg);
      const wk = A.g(svg); S.wakes(wk);
      const a = S.boat(svg, { len: 100, color: C.port }), b = S.boat(svg, { len: 100, color: C.stbd });
      follow(S, svg, a, 'YOU', C.port);
      const warn = A.g(svg, { opacity: 0 }); A.tag(warn, 400, 560, "THEY SHOULD GIVE WAY, BUT HAVEN'T. SLOW DOWN.", { fill: C.port, size: 17 });
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
      tl.set(a, { x: -60, y: 330, rotation: 0 }).set(b, { x: 430, y: -60, rotation: 90 }).set(warn, { opacity: 0 })
        .to(a, { x: 220, duration: 3, ease: 'none' }, 0)
        .to(b, { y: 180, duration: 3, ease: 'none' }, 0)
        .to(warn, { opacity: 1, duration: 0.3 }, 2.2)
        .to(a, { x: 290, duration: 2, ease: 'power2.out' }, 3)
        .to(b, { y: 720, duration: 6, ease: 'none' }, 3)
        .to(a, { x: 900, duration: 5, ease: 'power1.in' }, 6.2)
        .to(warn, { opacity: 0, duration: 0.3 }, 7);
    }
  });

  P.push({
    type: 'learn', title: 'Keep a good lookout',
    html: `<p>Perhaps the most important rule of all: keep a good <span class="term">lookout</span>.</p>
<p>The skipper must look out with their eyes, their ears and every other means available, at all times. Use radar, a depth sounder and a chart plotter if you have them, especially at night and in poor visibility.</p>`,
    art(svg, S) {
      S.seaBg(svg);
      const me = S.boat(svg, { x: 400, y: 470, r: -90, len: 120, color: C.port, wake: false });
      const cone = A.g(svg);
      wedge(cone, 400, 440, 420, -120, -60, { fill: 'rgba(255,253,248,0.35)', stroke: 'rgba(255,255,255,0.8)', 'stroke-width': 2 });
      gsap.fromTo(cone, { rotation: -70 }, { rotation: 70, svgOrigin: '400 440', duration: 5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      const hz = [[150, 170], [600, 140], [690, 330], [110, 350]];
      hz.forEach(([x, y], k) => {
        const g = A.g(svg);
        if (k === 0) A.swimmer(g, x, y, 1);
        else if (k === 1) A.boat(g, { type: 'yacht', x, y, r: 160, len: 70, color: C.stbd, wake: false });
        else if (k === 2) { A.path(g, `M ${x - 40} ${y} L ${x + 40} ${y - 8}`, { stroke: '#7A5A39', 'stroke-width': 12, 'stroke-linecap': 'round' }); }
        else A.boat(g, { type: 'pwc', x, y, r: -30, len: 50, color: C.buoy, wake: false });
      });
      // eye + ear icons
      const ic = A.g(svg, { transform: 'translate(640,520)' });
      A.rect(ic, -120, -34, 240, 68, { rx: 34, fill: C.white, opacity: 0.92 });
      A.path(ic, 'M -96 0 Q -76 -18 -56 0 Q -76 18 -96 0 Z', { fill: 'none', stroke: C.ink, 'stroke-width': 3.5 }); A.circle(ic, -76, 0, 5, { fill: C.ink });
      A.path(ic, 'M -16 -14 C -16 -26 12 -26 12 -8 C 12 4 0 6 0 16 C 0 24 -12 24 -14 16', { fill: 'none', stroke: C.ink, 'stroke-width': 3.5, 'stroke-linecap': 'round' });
      const rd = A.g(ic, { transform: 'translate(74,0)' });
      A.circle(rd, 0, 0, 20, { fill: '#1B3550' }); A.circle(rd, 0, 0, 12, { fill: 'none', stroke: '#5FBF7F', 'stroke-width': 1.5 });
      const sw = A.line(rd, 0, 0, 0, -18, { stroke: '#5FBF7F', 'stroke-width': 2.5 });
      gsap.to(sw, { rotation: 360, svgOrigin: '714 520', duration: 2.5, repeat: -1, ease: 'none' });
    }
  });

  /* lookout spotting game */
  P.push({
    type: 'try', title: 'What can you see?',
    html: `<p>You're at the helm. Tap every hazard you can spot ahead.</p>`,
    lockMsg: 'Find all six hazards',
    build(svg, S, api) {
      sky(svg, '#D9E8EC', '#EEF2EC');
      const id = A.uid('sea');
      const lg = A.el('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 }, A.defs(svg));
      A.el('stop', { offset: 0, 'stop-color': '#8DB9C3' }, lg); A.el('stop', { offset: 1, 'stop-color': '#3F7F94' }, lg);
      A.rect(svg, 0, 230, 800, 370, { fill: `url(#${id})` });
      A.path(svg, 'M 0 232 C 120 226 220 224 330 228 L 330 232 Z', { fill: '#A9B7A5' });
      A.path(svg, 'M 560 231 C 620 214 700 210 800 222 L 800 232 L 560 232 Z', { fill: '#9DAF9A' });
      const R = A.rng(11);
      for (let k = 0; k < 60; k++) { const y = 240 + R() * 340, w = 6 + (y - 230) * 0.08; A.path(svg, `M ${R() * 800} ${y} q ${w / 2} ${-w * 0.25} ${w} 0`, { stroke: 'rgba(255,255,255,0.5)', 'stroke-width': 1 + (y - 230) * 0.006, fill: 'none' }); }
      const items = [];
      const add = (x, y, r, name, draw) => {
        const g = A.g(svg, { style: 'cursor:pointer' });
        draw(g);
        const hit = A.circle(g, x, y, r, { fill: 'rgba(255,255,255,0.001)' });
        const ring = A.circle(svg, x, y, r * 0.9, { fill: 'none', stroke: C.buoy, 'stroke-width': 4, opacity: 0 });
        items.push({ g, name, ring, found: false, x, y });
        g.addEventListener('click', () => {
          const it = items.find(i => i.g === g);
          if (it.found) return;
          it.found = true;
          gsap.fromTo(ring, { opacity: 1, attr: { r: r * 1.6 } }, { attr: { r: r * 0.9 }, duration: 0.4, ease: 'back.out(2)' });
          A.tag(svg, x, y - r - 14, name, { fill: C.ink, size: 14 });
          const n = items.filter(i => i.found).length;
          cnt.textContent = `Found ${n} of ${items.length}`;
          if (n === items.length) api.done('A good lookout scans the whole horizon, near and far, all the time.');
        });
      };
      add(250, 300, 34, 'KAYAK', g => { A.path(g, 'M 225 304 C 240 298 260 298 275 304 C 260 308 240 308 225 304 Z', { fill: C.buoy, stroke: C.ink, 'stroke-width': 1 }); A.circle(g, 250, 293, 4, { fill: C.ink }); A.line(g, 238, 290, 262, 298, { stroke: C.ink, 'stroke-width': 1.5 }); });
      add(600, 420, 36, 'SWIMMER', g => { A.circle(g, 600, 420, 7, { fill: '#5B3A26' }); A.path(g, 'M 588 426 Q 600 420 612 426', { stroke: C.skin, 'stroke-width': 3, fill: 'none' }); A.circle(g, 600, 432, 9, { fill: C.orange, opacity: 0.8 }); });
      add(470, 248, 30, 'YACHT', g => { A.path(g, 'M 458 250 L 482 250 L 478 255 L 462 255 Z', { fill: C.white, stroke: C.ink, 'stroke-width': 1 }); A.path(g, 'M 470 249 L 470 226 L 480 248 Z', { fill: C.white, stroke: C.ink3, 'stroke-width': 1 }); });
      add(150, 500, 46, 'LOG', g => { A.path(g, 'M 110 505 L 190 492', { stroke: '#6B4E31', 'stroke-width': 13, 'stroke-linecap': 'round' }); A.path(g, 'M 120 510 Q 150 514 182 500', { stroke: 'rgba(255,255,255,0.5)', 'stroke-width': 2, fill: 'none' }); });
      add(700, 285, 30, 'CRAY POT FLOAT', g => { A.circle(g, 700, 288, 6, { fill: C.orange, stroke: C.ink, 'stroke-width': 1 }); });
      add(380, 236, 30, 'SHIP', g => { A.path(g, 'M 352 236 L 408 236 L 404 242 L 356 242 Z', { fill: C.deep }); A.rect(g, 392, 228, 10, 8, { fill: C.white }); });
      // windscreen frame
      const fr = A.g(svg, { style: 'pointer-events:none' });
      A.path(fr, 'M 0 600 L 0 520 Q 400 470 800 520 L 800 600 Z', { fill: C.white, stroke: C.ink, 'stroke-width': 3 });
      A.path(fr, 'M 0 520 Q 400 470 800 520', { fill: 'none', stroke: C.ink, 'stroke-width': 10 });
      A.circle(fr, 400, 560, 40, { fill: 'none', stroke: C.ink, 'stroke-width': 8 });
      A.line(fr, 400, 520, 400, 600, { stroke: C.ink, 'stroke-width': 6 });
      A.line(fr, 360, 560, 440, 560, { stroke: C.ink, 'stroke-width': 6 });
      const ui = document.createElement('div');
      ui.innerHTML = '<div class="status" id="cnt">Found 0 of 6</div>';
      api.task.appendChild(ui);
      const cnt = ui.querySelector('#cnt');
    }
  });

  P.push({
    type: 'learn', title: 'Safe speed',
    html: `<p>The lookout rule links to <span class="term">safe speed</span>: a speed that gives you enough time to manoeuvre and avoid a collision.</p>
<p>To decide on a safe speed, think about:</p>
<ul><li><b>visibility</b></li><li>how much <b>traffic</b> is around</li><li><b>background lights</b> on shore that can hide navigation lights at night</li><li>the <b>depth</b> of the water</li></ul>`,
    art(svg, S) {
      A.paperBg(svg);
      const card = (x, y, title, draw, d) => {
        const g = A.g(svg, { transform: `translate(${x},${y})` });
        A.rect(g, 5, 7, 300, 200, { rx: 18, fill: 'rgba(18,38,58,0.14)' });
        A.rect(g, 0, 0, 300, 200, { rx: 18, fill: C.white, stroke: C.line });
        draw(A.g(g, { transform: 'translate(150,88)' }));
        A.text(g, 150, 180, title, { size: 22, weight: 700, anchor: 'middle', fill: C.ink, ls: '0.1em' });
        gsap.from(g, { opacity: 0, y: '+=16', duration: 0.5, delay: d, ease: 'power2.out' });
      };
      card(70, 60, 'VISIBILITY', g => { A.path(g, 'M -70 -10 Q -40 -30 -10 -10 Q 20 -36 50 -10 Q 80 -10 70 10 L -70 10 Q -90 0 -70 -10 Z', { fill: '#C9D3D8' }); [20, 40].forEach(y => A.line(g, -80, y, 80, y, { stroke: '#C9D3D8', 'stroke-width': 8, 'stroke-linecap': 'round' })); }, 0.1);
      card(430, 60, 'TRAFFIC', g => { [[-60, 10, 0, C.port], [10, -20, 20, C.stbd], [60, 30, -10, C.sea4]].forEach(([x, y, r, c]) => A.boat(g, { x, y, r, len: 54, color: c, wake: false })); }, 0.2);
      card(70, 330, 'BACKGROUND LIGHTS', g => { A.rect(g, -100, -50, 200, 100, { rx: 10, fill: C.night }); [[-70, 10], [-40, -10], [-10, 20], [30, -5], [60, 15], [80, -20]].forEach(([x, y]) => A.circle(g, x, y, 4, { fill: '#F6D27A' })); A.circle(g, 0, 0, 5, { fill: C.port }); A.circle(g, 12, 0, 5, { fill: C.stbd }); }, 0.3);
      card(430, 330, 'WATER DEPTH', g => { A.path(g, 'M -100 -30 L 100 -30', { stroke: C.sea3, 'stroke-width': 4 }); A.path(g, 'M -100 40 C -40 40 0 -10 40 -14 C 70 -16 90 20 100 40 Z', { fill: C.sand }); A.line(g, -20, -30, -20, 14, { stroke: C.ink, 'stroke-width': 2, 'stroke-dasharray': '4 4' }); }, 0.4);
    }
  });

  P.push({
    type: 'check', title: 'Choosing a speed',
    q: 'Which of these is NOT one of the things to consider when choosing a safe speed?',
    opts: ['How much traffic is around you', 'How bright the lights are on shore', 'How fast your motor can go', 'How deep the water is'], a: 2,
    why: 'Safe speed depends on visibility, traffic, background lights and depth, not on what your boat is capable of.'
  });

  /* ===================================================================
     RISK OF COLLISION
     =================================================================== */
  P.push({
    type: 'learn', title: 'Is it a collision course?',
    html: `<p>Keep checking every vessel nearby to see if it will come close.</p>
<p>A useful technique is to watch your line of sight to the other vessel, called the <span class="term">bearing</span>. If the other vessel doesn't move ahead or drop back against a fixed point on your boat, the bearing is steady and you are on, or nearly on, a <b>collision course</b>.</p>
<p>Any action you then take must be obvious to the other vessel and make you pass well clear.</p>`,
    art(svg, S) {
      sky(svg);
      const water = A.waterSide(svg, 300, { amp: 3 });
      // other boat seen from the side, growing but not moving sideways
      const ob = A.g(svg);
      A.boatSide(A.g(ob, { transform: 'scale(-1,1)' }), { len: 120, color: C.stbd });
      svg.appendChild(water);
      // windscreen post as fixed reference
      A.rect(svg, 0, 470, 800, 130, { fill: C.white });
      A.path(svg, 'M 0 470 L 800 470', { stroke: C.ink, 'stroke-width': 8 });
      A.rect(svg, 556, 120, 14, 360, { fill: C.ink });
      A.tag(svg, 563, 100, 'FIXED POINT ON YOUR BOAT', { fill: C.ink, size: 14 });
      A.tag(svg, 300, 520, 'STAYS IN LINE AND GETS BIGGER = DANGER', { fill: C.port, size: 16 });
      gsap.timeline({ repeat: -1, repeatDelay: 0.8 }).fromTo(ob, { attr: { transform: 'translate(620,302) scale(0.25)' } }, { attr: { transform: 'translate(620,302) scale(1.6)' }, duration: 7, ease: 'power1.in' });
    }
  });

  P.push({
    type: 'watch', title: 'Watching the bearing',
    html: `<p>The lines show your line of sight to the other boat every couple of seconds. Watch how they behave in each case.</p>`,
    anim(svg, S) {
      S.seaBg(svg);
      const lines = A.g(svg);
      const wk = A.g(svg); S.wakes(wk);
      const a = S.boat(svg, { len: 80, color: C.port, r: -90 }), b = S.boat(svg, { len: 80, color: C.stbd, r: 180 });
      follow(S, svg, a, 'YOU', C.port);
      const cap = caption(svg);
      const tl = gsap.timeline();
      const run = (at, bSpeed, label) => {
        const st = { t: 0 };
        tl.call(() => { lines.innerHTML = ''; }, null, at);
        tl.fromTo(st, { t: 0 }, {
          t: 1, duration: 7.2, ease: 'none',
          onStart() { st.k = -1; },
          onUpdate() {
            const T = st.t * 7.2;
            a.x = 330; a.y = 560 - T * 36;
            b.x = 760 - T * 36 * bSpeed; b.y = 290;
            const k = Math.floor(T / 1.4);
            if (k > (st.k == null ? -1 : st.k) && T < 6.9) {
              st.k = k;
              const ln = A.line(lines, a.x, a.y, b.x, b.y, { stroke: C.ink, 'stroke-width': 2, 'stroke-dasharray': '6 6', opacity: 0.85 });
              gsap.from(ln, { opacity: 0, duration: 0.3 });
            }
          }
        }, at);
        cap.show(tl, at, label);
      };
      run(0.2, 1.59, 'The lines stay parallel: a steady bearing. You are on a collision course.');
      run(8.6, 2.1, 'The bearing moves ahead: the other boat will pass in front, well clear.');
      tl.to({}, { duration: 0.8 });
      return tl;
    }
  });

  P.push({
    type: 'try', title: 'Steady or moving?',
    html: `<p>Watch the lines of sight, then decide what will happen.</p>`,
    lockMsg: 'Answer all three',
    build(svg, S, api) {
      S.seaBg(svg);
      const lines = A.g(svg);
      const wk = A.g(svg); S.wakes(wk);
      const a = S.boat(svg, { len: 80, color: C.port, r: -90 }), b = S.boat(svg, { len: 80, color: C.stbd });
      follow(S, svg, a, 'YOU', C.port);
      const sc = [
        { bx: 691, by: 290, vx: -1.3, vy: 0, br: 180, a: 'Collision course', why: 'The lines stayed parallel. A steady bearing means a collision course.' },
        { bx: 60, by: 200, vx: 1.6, vy: 0.3, br: 10, a: 'Will pass clear', why: 'The bearing kept moving ahead, so the other boat passes in front.' },
        { bx: 16, by: 290, vx: 1.2, vy: 0, br: 0, a: 'Collision course', why: 'The bearing stayed steady, so you are on a collision course, even from the port side.' }
      ];
      let i = 0, tw = null;
      const play = () => {
        const s = sc[i];
        lines.innerHTML = '';
        if (tw) tw.kill();
        const st = { t: 0, k: -1 };
        b.rotation = s.br;
        tw = gsap.fromTo(st, { t: 0 }, {
          t: 1, duration: 7, ease: 'none', repeat: -1, repeatDelay: 0.8,
          onRepeat() { lines.innerHTML = ''; st.k = -1; },
          onUpdate() {
            const T = st.t * 7;
            a.x = 340; a.y = 560 - T * 36;
            b.x = s.bx + T * 36 * s.vx; b.y = s.by + T * 36 * s.vy;
            const k = Math.floor(T / 1.3);
            if (k > st.k && T < 6.5) { st.k = k; A.line(lines, a.x, a.y, b.x, b.y, { stroke: C.ink, 'stroke-width': 2, 'stroke-dasharray': '6 6', opacity: 0.85 }); }
          }
        });
      };
      const ui = document.createElement('div');
      ui.innerHTML = `<div class="chips"><button class="chip" data-v="Collision course">Collision course</button><button class="chip" data-v="Will pass clear">Will pass clear</button></div><div class="status"></div>`;
      api.task.appendChild(ui);
      const stt = ui.querySelector('.status');
      stt.textContent = 'Situation 1 of 3';
      ui.querySelectorAll('.chip').forEach(btn => btn.onclick = () => {
        if (i >= sc.length) return;
        if (btn.dataset.v === sc[i].a) {
          api.say(sc[i].why, 'good');
          i++;
          if (i < sc.length) { stt.textContent = `Situation ${i + 1} of 3`; S.after(1600, play); }
          else { stt.textContent = ''; ui.querySelector('.chips').style.display = 'none'; api.done('Check the bearing early and often. If it stays steady, act early.'); }
        } else api.say('Watch the lines again: are they staying parallel, or swinging?', 'bad');
      });
      play();
    }
  });

  P.push({
    type: 'learn', title: 'Restricted visibility',
    html: `<p>Fog and heavy rain can make it hard to see. In restricted visibility:</p>
<ul><li>keep a good lookout</li><li>turn your navigation lights on</li><li>go at a safe speed for the conditions</li><li>be ready to stop or manoeuvre to avoid a collision</li></ul>`,
    art(svg, S) {
      S.seaBg(svg);
      const wk = A.g(svg); S.wakes(wk);
      const o = S.boat(svg, { len: 90, color: C.stbd });
      gsap.timeline({ repeat: -1 }).set(o, { x: 900, y: 200, rotation: 170 }).to(o, { x: -150, y: 320, duration: 16, ease: 'none' });
      const me = S.boat(svg, { x: 380, y: 460, r: -80, len: 110, color: C.port, wake: false });
      [[C.port, -1], [C.stbd, 1]].forEach(([c, s]) => { const l = A.circle(me.body, 14, s * 20, 5, { fill: c }); });
      A.circle(me.body, -10, 0, 5, { fill: '#fff' });
      const fog = A.g(svg);
      const R = A.rng(5);
      for (let k = 0; k < 16; k++) {
        const e = A.el('ellipse', { cx: R() * 900 - 50, cy: R() * 600, rx: 160 + R() * 160, ry: 50 + R() * 50, fill: '#EEF1F0', opacity: 0.55 }, fog);
        gsap.to(e, { attr: { cx: '+=' + (60 + R() * 80) }, duration: 8 + R() * 6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      }
      A.tag(svg, 400, 560, 'LIGHTS ON, SLOW DOWN, LOOK AND LISTEN', { fill: C.ink });
    }
  });

  /* ===================================================================
     SOUND SIGNALS
     =================================================================== */
  P.push({
    type: 'learn', title: 'Sound signals',
    html: `<p>Ships and ferries sometimes use their horn to show what they're about to do. A <span class="term">short blast</span> lasts about one second.</p>
<ul><li><b>One short:</b> I am altering course to starboard.</li><li><b>Two short:</b> I am altering course to port.</li><li><b>Three short:</b> my engines are going astern (backwards).</li><li><b>Five short:</b> officially, I'm unsure of your intentions. In practice: you're not following the rules, get out of the way.</li></ul>`,
    art(svg, S) {
      A.paperBg(svg);
      const rows = [[1, 'STARBOARD'], [2, 'PORT'], [3, 'ASTERN'], [5, 'GET CLEAR']];
      rows.forEach(([n, t], k) => {
        const g = A.g(svg, { transform: `translate(100,${90 + k * 115})` });
        A.rect(g, 0, -40, 600, 84, { rx: 18, fill: C.white, stroke: C.line });
        for (let j = 0; j < n; j++) { const d = A.rect(g, 30 + j * 46, -12, 34, 22, { rx: 11, fill: C.ink }); gsap.fromTo(d, { opacity: 0.25 }, { opacity: 1, duration: 0.2, repeat: -1, repeatDelay: 3.2, yoyo: true, delay: k * 0.9 + j * 0.35 }); }
        A.text(g, 570, 12, t, { size: 30, weight: 700, anchor: 'end', fill: [C.stbd, C.port, C.ink, C.port][k], ls: '0.08em' });
      });
    }
  });

  P.push({
    type: 'try', title: 'Hear the horn',
    html: `<p>Tap each signal to hear it and see what the ferry does. Turn your sound on.</p>`,
    lockMsg: 'Play all four signals',
    build(svg, S, api) {
      S.seaBg(svg);
      const wk = A.g(svg); S.wakes(wk);
      const me = S.boat(svg, { x: 640, y: 470, r: -120, len: 70, color: C.port, wake: false });
      follow(S, svg, me, 'YOU', C.port);
      const f = S.boat(svg, { type: 'ferry', len: 220, color: C.deep, x: 400, y: 300, r: -90 });
      const ui = document.createElement('div');
      const sigs = [[1, 'One short'], [2, 'Two short'], [3, 'Three short'], [5, 'Five short']];
      ui.innerHTML = `<div class="chips">${sigs.map(([n, t]) => `<button class="chip" data-n="${n}">${t}</button>`).join('')}</div><div class="status">Played 0 of 4</div>`;
      api.task.appendChild(ui);
      const stt = ui.querySelector('.status');
      const heard = new Set();
      let busy = false, bl = null;
      const meaning = { 1: 'I am altering course to <b>starboard</b>.', 2: 'I am altering course to <b>port</b>.', 3: 'My engines are going <b>astern</b>.', 5: "I'm unsure of your intentions. In practice: <b>get out of the way</b>." };
      ui.querySelectorAll('.chip').forEach(btn => btn.onclick = () => {
        if (busy) return;
        busy = true;
        const n = +btn.dataset.n;
        gsap.killTweensOf(f);
        f.x = 400; f.y = 300; f.rotation = -90;
        horn(Array(n).fill('s'));
        if (bl) bl.g.remove();
        bl = blasts(svg, f.x, f.y - 120, n, -90);
        api.say(`<b>${btn.textContent}:</b> ${meaning[n]}`, 'info');
        const T = n * 1.35;
        if (n === 1) gsap.to(f, { motionPath: { path: 'M 400 300 C 400 240 430 190 520 160', autoRotate: true }, duration: 3, delay: T * 0.5, ease: 'power1.inOut' });
        if (n === 2) gsap.to(f, { motionPath: { path: 'M 400 300 C 400 240 370 190 280 160', autoRotate: true }, duration: 3, delay: T * 0.5, ease: 'power1.inOut' });
        if (n === 3) gsap.to(f, { y: 380, duration: 3, delay: T * 0.5, ease: 'power1.inOut' });
        if (n === 5) gsap.to(me, { x: 700, y: 540, rotation: 60, duration: 2.6, delay: 1, ease: 'power1.inOut', onComplete: () => gsap.to(me, { x: 640, y: 470, rotation: -120, duration: 2, delay: 1 }) });
        S.after(Math.max(T * 1000 + 600, 3600), () => {
          busy = false; heard.add(n);
          stt.textContent = `Played ${heard.size} of 4`;
          if (heard.size === 4 && !api.complete) api.done('One for starboard, two for port, three for astern, five for "get out of the way".');
        });
      });
    }
  });

  P.push({
    type: 'check', title: 'Two blasts',
    q: 'A ferry ahead gives two short blasts. What is it telling you?',
    opts: ['It is altering course to port', 'It is altering course to starboard', 'Its engines are going astern', 'It wants you to stop at once'], a: 0,
    why: 'Two short blasts means "I am altering course to port".'
  });

  /* ===================================================================
     RULES OF THE ROAD
     =================================================================== */
  P.push({
    type: 'learn', title: 'The golden rule',
    html: `<p>Keep a good lookout at all times and be ready to give way. If you have to give way, do it in good time, with a move the other skipper can clearly see.</p>
<p>The golden rule is:</p>
<p style="font-size:1.25em;font-weight:700;line-height:1.35">Look to the right, give way to the right, turn to the right and stay to the right.</p>`,
    art(svg, S) {
      S.seaBg(svg);
      const me = S.boat(svg, { x: 400, y: 480, r: -90, len: 120, color: C.port, wake: false });
      const words = ['LOOK', 'GIVE WAY', 'TURN', 'STAY'];
      words.forEach((w, k) => {
        const y = 100 + k * 66;
        const g = A.g(svg);
        A.arrow(g, `M 470 ${y} L 640 ${y}`, { color: C.stbd, width: 6 });
        A.text(g, 455, y + 9, w, { size: 30, weight: 700, anchor: 'end', fill: C.ink, ls: '0.06em' });
        A.text(g, 660, y + 9, 'RIGHT', { size: 30, weight: 700, fill: C.stbd, ls: '0.06em' });
        gsap.from(g, { opacity: 0, x: '-=20', duration: 0.5, delay: 0.3 + k * 0.35, ease: 'power2.out' });
      });
      gsap.to(me, { rotation: -70, duration: 1.5, yoyo: true, repeat: -1, repeatDelay: 1, ease: 'sine.inOut' });
    }
  });

  P.push({
    type: 'learn', title: 'The three sectors',
    html: `<p>Think of the water around your boat in three sectors:</p>
<ul><li><b>Starboard sector</b> (112.5° on your right, from dead ahead): if any vessel approaches here, <b>give way</b>.</li><li><b>Port sector</b> (112.5° on your left): if a motor boat approaches here, keep your course and speed with caution.</li><li><b>Stern sector</b> (135° behind): if any vessel approaches here, keep your course and speed with caution.</li></ul>
<p>In the last two, be ready to act if the other vessel doesn't. Sailing boats can change things.</p>`,
    art(svg, S) {
      S.seaBg(svg);
      const sc = sectors(svg, 400, 320, 250);
      gsap.from([sc.st, sc.pt, sc.sn], { opacity: 0, scale: 0.6, svgOrigin: '400 320', duration: 0.6, stagger: 0.25, ease: 'back.out(1.4)' });
      S.boat(svg, { x: 400, y: 320, r: -90, len: 110, color: C.port, wake: false });
    }
  });

  P.push({
    type: 'try', title: 'Give way or stand on?',
    html: `<p>A motor boat is approaching from the position shown. What do you do?</p>`,
    lockMsg: 'Answer all six',
    build(svg, S, api) {
      S.seaBg(svg);
      const sc = sectors(svg, 400, 320, 260, { labels: false });
      S.boat(svg, { x: 400, y: 320, r: -90, len: 90, color: C.port, wake: false });
      const wk = A.g(svg); S.wakes(wk);
      const o = S.boat(svg, { len: 70, color: C.stbd });
      const bearings = [40, 300, 180, 95, 262, 150];
      const sectorOf = b => (b < 112.5 ? 'st' : b > 247.5 ? 'pt' : 'sn');
      const ans = { st: 'Give way', pt: 'Hold course and speed', sn: 'Hold course and speed' };
      const why = { st: 'It is in your starboard sector, so you give way: turn right, slow down, or both.', pt: 'It is in your port sector. Hold your course and speed, but be ready to act.', sn: 'It is coming from astern, so it is overtaking and must keep clear. Hold your course and speed.' };
      let i = 0, tw = null;
      const show = () => {
        const br = bearings[i];
        const ang = (br - 90) * Math.PI / 180;
        const sx = 400 + Math.cos(ang) * 300, sy = 320 + Math.sin(ang) * 300;
        const ex = 400 + Math.cos(ang) * 190, ey = 320 + Math.sin(ang) * 190;
        o.rotation = Math.atan2(320 - sy, 400 - sx) * 180 / Math.PI;
        if (tw) tw.kill();
        tw = gsap.fromTo(o, { x: sx, y: sy }, { x: ex, y: ey, duration: 3, ease: 'power1.out', repeat: -1, repeatDelay: 0.8 });
        [sc.st, sc.pt, sc.sn].forEach(w => w.setAttribute('opacity', 0.35));
        stt.textContent = `Boat ${i + 1} of ${bearings.length}`;
      };
      const ui = document.createElement('div');
      ui.innerHTML = `<div class="chips"><button class="chip" data-v="Give way">Give way</button><button class="chip" data-v="Hold course and speed">Hold course and speed</button></div><div class="status"></div>`;
      api.task.appendChild(ui);
      const stt = ui.querySelector('.status');
      let busy = false;
      ui.querySelectorAll('.chip').forEach(btn => btn.onclick = () => {
        if (busy || i >= bearings.length) return;
        const s = sectorOf(bearings[i]);
        if (btn.dataset.v === ans[s]) {
          busy = true;
          sc[s].setAttribute('opacity', 1);
          api.say(why[s], 'good');
          S.after(1800, () => {
            busy = false; i++;
            if (i < bearings.length) show();
            else { if (tw) tw.kill(); stt.textContent = ''; ui.querySelector('.chips').style.display = 'none'; api.done('Starboard sector: give way. Port or stern: hold your course and speed, with caution.'); }
          });
        } else api.say('Look at which sector the boat is coming from.', 'bad');
      });
      show();
    }
  });

  P.push({
    type: 'learn', title: 'Power gives way to sail',
    html: `<p>In general, motor boats must keep out of the way of:</p>
<ul><li><b>sailing vessels</b></li><li>vessels <b>hampered</b> by their work, such as dredging or cable laying</li></ul>
<p>Remember it as: <b>power gives way to sail</b>.</p>`,
    art(svg, S) {
      S.seaBg(svg);
      const wk = A.g(svg); S.wakes(wk);
      const y = S.boat(svg, { type: 'yacht', len: 110, color: C.stbd, tack: 'stbd' });
      gsap.timeline({ repeat: -1 }).set(y, { x: 900, y: 260, rotation: 180 }).to(y, { x: -150, duration: 14, ease: 'none' });
      const m = S.boat(svg, { len: 90, color: C.port });
      follow(S, svg, m, 'GIVES WAY', C.port);
      gsap.timeline({ repeat: -1 }).set(m, { x: 360, y: 700, rotation: -90 })
        .to(m, { y: 420, duration: 3, ease: 'power1.out' })
        .to(m, { motionPath: { path: 'M 360 420 C 360 400 340 390 330 390', autoRotate: true }, duration: 1.2 })
        .to(m, { rotation: -90, duration: 3.5, ease: 'sine.inOut' })
        .to(m, { motionPath: { path: 'M 330 390 C 320 300 300 200 290 -120', autoRotate: true }, duration: 6.3, ease: 'power1.in' });
      A.tag(svg, 600, 540, 'POWER GIVES WAY TO SAIL', { fill: C.ink });
    }
  });

  P.push({
    type: 'learn', title: 'Overtaking',
    html: `<p>This rule overrides all the others. The <b>overtaking</b> vessel, including a sailing boat, must keep out of the way of the vessel being overtaken.</p>
<p>You can pass on either side, but keep well clear: the other skipper may not have seen you.</p>
<p>If you are being overtaken, hold your course and speed until the other vessel is past and well clear.</p>`,
    art(svg, S) {
      S.seaBg(svg);
      const wk = A.g(svg); S.wakes(wk);
      const b = S.boat(svg, { len: 100, color: C.stbd }), a = S.boat(svg, { len: 100, color: C.port });
      follow(S, svg, a, 'A', C.port); follow(S, svg, b, 'B', C.stbd);
      A.tag(svg, 400, 540, 'A KEEPS CLEAR OF B', { fill: C.ink });
      gsap.timeline({ repeat: -1 })
        .set(b, { x: 200, y: 330, rotation: 0 }).set(a, { x: -150, y: 330, rotation: 0 })
        .to(b, { x: 620, duration: 10, ease: 'none' }, 0)
        .to(a, { motionPath: { path: 'M -150 330 C 50 330 150 330 230 250 C 300 190 450 190 560 200 C 700 210 760 280 950 330', autoRotate: true }, duration: 10, ease: 'none' }, 0);
    }
  });

  P.push({
    type: 'watch', title: 'Crossing',
    html: `<p>When two motor boats cross, the one with the other on its <b>starboard</b> (right) side gives way.</p>`,
    anim(svg, S) {
      S.seaBg(svg);
      const wk = A.g(svg); S.wakes(wk);
      const a = S.boat(svg, { len: 90, color: C.port }), b = S.boat(svg, { len: 90, color: C.stbd });
      follow(S, svg, a, 'A', C.port); follow(S, svg, b, 'B', C.stbd);
      const cap = caption(svg);
      const sec = A.g(svg, { opacity: 0 });
      const tl = gsap.timeline();
      tl.set(a, { x: 330, y: 640, rotation: -90 }).set(b, { x: 880, y: 300, rotation: 180 });
      cap.show(tl, 0, 'B is on A\'s starboard side, so A gives way.');
      tl.to(a, { y: 470, duration: 3, ease: 'none' }, 0.3);
      tl.to(b, { x: 620, duration: 3, ease: 'none' }, 0.3);
      cap.show(tl, 3.4, 'A turns right and slows, to pass behind B.');
      tl.to(a, { motionPath: { path: 'M 330 470 C 330 430 360 400 420 390 C 520 380 560 450 600 470', autoRotate: true }, duration: 4.5, ease: 'power1.inOut' }, 3.3);
      tl.to(b, { x: 200, duration: 5.5, ease: 'none' }, 3.3);
      tl.to(a, { motionPath: { path: 'M 600 470 C 640 480 660 420 640 300 C 625 200 620 100 620 -100', autoRotate: true }, duration: 4, ease: 'power1.in' }, 7.8);
      tl.to(b, { x: -150, duration: 3, ease: 'none' }, 8.8);
      cap.show(tl, 8.2, 'B, with A on its port side, held its course and speed.');
      tl.to({}, { duration: 1.5 });
      return tl;
    }
  });

  P.push({
    type: 'learn', title: 'If you have right of way',
    html: `<p>If the other vessel is on your <b>port</b> (left) side, you have right of way. Hold your course and speed.</p>
<p>But if the other vessel seems to be leaving it too late, you must act yourself. The right rule still applies: if you change course, turn to <b>starboard</b>. You can also slow down, or do both.</p>`,
    art(svg, S) {
      S.seaBg(svg);
      const wk = A.g(svg); S.wakes(wk);
      const me = S.boat(svg, { len: 90, color: C.port }), o = S.boat(svg, { len: 90, color: C.stbd });
      follow(S, svg, me, 'YOU', C.port);
      const warn = A.g(svg, { opacity: 0 }); A.tag(warn, 400, 70, 'THEY ARE NOT GIVING WAY', { fill: C.port, size: 17 });
      gsap.timeline({ repeat: -1, repeatDelay: 1 })
        .set(me, { x: 420, y: 650, rotation: -90 }).set(o, { x: -80, y: 290, rotation: 0 }).set(warn, { opacity: 0 })
        .to(me, { y: 450, duration: 3, ease: 'none' }, 0)
        .to(o, { x: 200, duration: 3, ease: 'none' }, 0)
        .to(warn, { opacity: 1, duration: 0.3 }, 2.2)
        .to(me, { motionPath: { path: 'M 420 450 C 420 420 440 400 480 395 C 560 385 640 380 900 370', autoRotate: true }, duration: 5, ease: 'power1.inOut' }, 3)
        .to(o, { x: 950, duration: 7, ease: 'none' }, 3)
        .to(warn, { opacity: 0, duration: 0.3 }, 6);
      A.tag(svg, 600, 540, 'TURN TO STARBOARD, SLOW, OR BOTH', { fill: C.ink, size: 15 });
    }
  });

  P.push({
    type: 'watch', title: 'Meeting head on',
    html: `<p>When two power-driven vessels meet head on, <b>both</b> alter course to starboard and pass port side to port side.</p>`,
    anim(svg, S) {
      S.seaBg(svg);
      const wk = A.g(svg); S.wakes(wk);
      const a = S.boat(svg, { len: 90, color: C.port }), b = S.boat(svg, { len: 90, color: C.stbd });
      follow(S, svg, a, 'A', C.port); follow(S, svg, b, 'B', C.stbd);
      const cap = caption(svg);
      const tl = gsap.timeline();
      tl.set(a, { x: -100, y: 310, rotation: 0 }).set(b, { x: 900, y: 310, rotation: 180 });
      cap.show(tl, 0, 'Two motor boats meeting head on.');
      tl.to(a, { motionPath: { path: 'M -100 310 L 180 310 C 260 310 300 340 360 380 C 420 410 520 410 600 390 C 680 370 760 330 900 320', autoRotate: true }, duration: 9, ease: 'none' }, 0.3);
      tl.to(b, { motionPath: { path: 'M 900 310 L 620 310 C 540 310 500 280 440 240 C 380 210 280 210 200 230 C 120 250 40 290 -100 300', autoRotate: true }, duration: 9, ease: 'none' }, 0.3);
      cap.show(tl, 2.6, 'Both turn to starboard (right) in good time.');
      cap.show(tl, 6.2, 'They pass port side to port side, well clear.');
      tl.to({}, { duration: 0.5 });
      return tl;
    }
  });

  P.push({
    type: 'learn', title: 'If they turn the wrong way',
    html: `<p>If the other vessel turns the wrong way when you meet head on, turn even <b>more to the right</b>, slow down, or stop your vessel.</p>
<p>Never turn left to dodge them: they may correct at the same moment and turn straight into you.</p>`,
    art(svg, S) {
      S.seaBg(svg);
      const wk = A.g(svg); S.wakes(wk);
      const a = S.boat(svg, { len: 90, color: C.port }), b = S.boat(svg, { len: 90, color: C.stbd });
      follow(S, svg, a, 'YOU', C.port);
      gsap.timeline({ repeat: -1, repeatDelay: 1 })
        .set(a, { x: -100, y: 320, rotation: 0 }).set(b, { x: 900, y: 320, rotation: 180 })
        .to(a, { motionPath: { path: 'M -100 320 L 200 320 C 280 320 320 380 340 440 C 350 480 350 500 350 510', autoRotate: true }, duration: 6, ease: 'power1.out' }, 0)
        .to(b, { motionPath: { path: 'M 900 320 L 600 320 C 520 320 480 360 420 400 C 360 430 300 420 -150 420', autoRotate: true }, duration: 8, ease: 'none' }, 0);
      A.tag(svg, 600, 540, 'MORE RIGHT, SLOW DOWN, OR STOP', { fill: C.ink, size: 15 });
    }
  });

  P.push({
    type: 'learn', title: 'Keep right in a channel',
    html: `<p>In a narrow channel or river, keep to the <b>starboard</b> (right-hand) side, whichever way you're going. Boats coming the other way will then pass port side to port side.</p>`,
    art(svg, S) {
      S.seaBg(svg, { top: '#C9E0E3', bottom: '#AFD0D6' });
      const bank = (y, up) => { let d = `M -20 ${up ? -20 : 640} L -20 ${y}`; for (let x = 0; x <= 820; x += 20) d += ` L ${x} ${(y + Math.sin(x / 90 + (up ? 0 : 2)) * 8).toFixed(1)}`; d += ` L 820 ${up ? -20 : 640} Z`; A.land(svg, d); };
      bank(140, true); bank(470, false);
      A.line(svg, 0, 305, 800, 305, { stroke: '#fff', 'stroke-width': 2, 'stroke-dasharray': '14 12', opacity: 0.7 });
      const wk = A.g(svg); S.wakes(wk);
      const up = S.boat(svg, { len: 90, color: C.port }), dn = S.boat(svg, { len: 90, color: C.stbd });
      gsap.timeline({ repeat: -1 }).set(up, { x: -120, y: 390, rotation: 0 }).to(up, { x: 940, duration: 10, ease: 'none' });
      gsap.timeline({ repeat: -1, delay: 2 }).set(dn, { x: 940, y: 220, rotation: 180 }).to(dn, { x: -120, duration: 10, ease: 'none' });
      A.tag(svg, 400, 545, 'STAY TO THE RIGHT', { fill: C.ink });
    }
  });

  /* who gives way, mixed */
  P.push({
    type: 'try', title: 'Who gives way?',
    html: `<p>You are the red boat. Pick what you should do in each situation.</p>`,
    lockMsg: 'Answer all six',
    build(svg, S, api) {
      S.seaBg(svg);
      const layer = A.g(svg);
      const me = (x, y, r) => { const b = A.boat(layer, { x, y, r, len: 90, color: C.port, wake: false }); A.tag(layer, x, y + 64, 'YOU', { fill: C.port, size: 15 }); return b; };
      const course = (d, col) => A.arrow(layer, d, { color: col || 'rgba(18,38,58,0.55)', width: 3, dash: '8 7' });
      const sc = [
        { q: 'A motor boat is crossing from your right.', a: 'Give way', why: 'It is on your starboard side, so you give way.', draw() { me(400, 470, -90); course('M 400 410 L 400 150'); A.boat(layer, { x: 680, y: 260, r: 180, len: 90, color: C.stbd, wake: false }); course('M 620 260 L 300 260'); } },
        { q: 'A motor boat is crossing from your left.', a: 'Hold course and speed', why: 'It is on your port side. Hold your course and speed, with caution.', draw() { me(400, 470, -90); course('M 400 410 L 400 150'); A.boat(layer, { x: 120, y: 260, r: 0, len: 90, color: C.stbd, wake: false }); course('M 180 260 L 500 260'); } },
        { q: 'A motor boat is coming straight at you.', a: 'Turn to starboard', why: 'Head on, both vessels turn to starboard.', draw() { me(400, 470, -90); A.boat(layer, { x: 400, y: 130, r: 90, len: 90, color: C.stbd, wake: false }); course('M 400 410 L 400 200'); } },
        { q: 'You are catching up to a slower boat.', a: 'Give way', why: 'The overtaking vessel always keeps clear.', draw() { me(400, 470, -90); A.boat(layer, { x: 400, y: 220, r: -90, len: 90, color: C.stbd, wake: false }); course('M 400 410 L 400 290'); } },
        { q: 'A yacht under sail is crossing from your left.', a: 'Give way', why: 'Power gives way to sail, whichever side it is on.', draw() { me(400, 470, -90); course('M 400 410 L 400 150'); A.boat(layer, { type: 'yacht', x: 120, y: 250, r: 0, len: 100, color: C.stbd, wake: false, tack: 'port' }); course('M 180 250 L 500 250'); } },
        { q: 'A faster boat is overtaking you.', a: 'Hold course and speed', why: 'Hold your course and speed until it is past and well clear.', draw() { me(400, 260, -90); A.boat(layer, { x: 400, y: 500, r: -90, len: 90, color: C.stbd, wake: false }); course('M 400 440 C 420 380 480 340 490 260'); } }
      ];
      const items = sc.map(s => ({ q: s.q, a: s.a, why: s.why }));
      const ui = document.createElement('div');
      const vals = ['Give way', 'Hold course and speed', 'Turn to starboard'];
      ui.innerHTML = `<p class="q" style="margin-bottom:10px"></p><div class="chips">${vals.map(v => `<button class="chip" data-v="${v}">${v}</button>`).join('')}</div><div class="status"></div>`;
      api.task.appendChild(ui);
      const q = ui.querySelector('.q'), stt = ui.querySelector('.status');
      let i = 0, busy = false;
      const show = () => { layer.innerHTML = ''; sc[i].draw(); gsap.from(layer, { opacity: 0, duration: 0.4 }); q.textContent = items[i].q; stt.textContent = `${i + 1} of ${items.length}`; };
      ui.querySelectorAll('.chip').forEach(btn => btn.onclick = () => {
        if (busy || i >= items.length) return;
        if (btn.dataset.v === items[i].a) {
          busy = true;
          api.say(`<b>${items[i].a}.</b> ${items[i].why}`, 'good');
          S.after(1900, () => {
            busy = false; i++;
            if (i < items.length) { api.hush(); show(); }
            else { q.textContent = 'All done.'; stt.textContent = ''; ui.querySelector('.chips').style.display = 'none'; api.done('Look right, give way right, turn right, stay right.'); }
          });
        } else api.say('Not quite. Think about the golden rule and who is overtaking.', 'bad');
      });
      show();
    }
  });

  P.push({
    type: 'check', title: 'Being overtaken',
    q: 'A boat is overtaking you on your port side. What should you do?',
    opts: ['Slow right down so it can pass', 'Turn to starboard to make room', 'Hold your course and speed', 'Speed up so it cannot pass'], a: 2,
    why: 'When you are being overtaken, hold your course and speed until the other vessel is past and well clear.'
  });

  /* ===================================================================
     WORKBOOK SELF-TEST (Q1-6 of the shared set)
     =================================================================== */
  const Q = [
    ['You are in charge of a motor boat with right of way and an approaching motor boat did not seem to be taking action to prevent a collision, what would you do?', ['Speed up because you have a bigger engine and you can get past in time to prevent a collision.', 'Exercise caution and take any necessary avoiding action.', 'Maintain your same course and speed because it is on your starboard side and they should give way to you.', 'Let off an internationally recognised distress signal.'], 1, 'Every skipper must act to avoid a collision, even when they have right of way.'],
    ['What is implied by "maintaining a good lookout"?', ['Looking ahead.', 'Looking forward and to each side.', 'Looking behind.', 'By sight, hearing and all available means.'], 3, 'A lookout uses sight, hearing and every available means, at all times.'],
    ['You are overtaking another vessel. What action do you take?', ['Overtake on the starboard (right) side.', 'Overtake on the port (left) side.', 'Keep out of the way of the vessel you are overtaking.', 'No special action to be taken.'], 2, 'The overtaking vessel must keep out of the way. You may pass on either side.'],
    ['When travelling upstream in a narrow channel or river, where should you operate your vessel?', ['On the port (left hand) side.', 'On the starboard (right hand) side.', 'In the middle of the channel.', 'On either side when safe to do so.'], 1, 'Keep to the starboard side of a channel, whichever way you are travelling.'],
    ['What is the sound signal for "I am operating astern propulsion"?', ['Three short blasts.', 'Two short blasts.', 'One short blast.', 'One prolonged blast.'], 0, 'Three short blasts: my engines are going astern.'],
    ['Which vessel must give way in the situation pictured?', ['Vessel A gives way to vessel B.', 'Vessel B gives way to vessel A.', 'Neither – they should continue their course until one gives way.'], 0, 'B is on A\'s starboard side, so A gives way.']
  ];
  Q.forEach(([q, opts, a, why], k) => {
    const pg = { type: 'review', n: k + 1, of: 9, title: 'Workbook self-test', q, opts, a, why };
    if (k === 5) pg.art = (svg) => {
      S6(svg);
    };
    P.push(pg);
  });
  function S6(svg) {
    A.seaBg(svg);
    const a = A.boat(svg, { x: 330, y: 450, r: -90, len: 110, color: C.port, wake: false });
    const b = A.boat(svg, { x: 600, y: 220, r: 180, len: 110, color: C.stbd, wake: false });
    A.arrow(svg, 'M 330 380 L 330 160', { color: 'rgba(18,38,58,0.55)', width: 3, dash: '8 7' });
    A.arrow(svg, 'M 530 220 L 200 220', { color: 'rgba(18,38,58,0.55)', width: 3, dash: '8 7' });
    A.tag(svg, 330, 530, 'A', { fill: C.port, size: 24 });
    A.tag(svg, 600, 290, 'B', { fill: C.stbd, size: 24 });
  }

  SR.chapter({
    id: 3,
    title: 'Collision Avoidance',
    intro: 'The traffic laws of the sea: keeping a lookout, safe speed, spotting a collision course, sound signals, and who gives way to whom.',
    cover(svg, S) {
      S.seaBg(svg);
      const sc = sectors(svg, 400, 330, 230, { labels: false });
      sc.setAttribute('opacity', 0.75);
      const wk = A.g(svg); S.wakes(wk);
      S.boat(svg, { x: 400, y: 330, r: -90, len: 100, color: C.port, wake: false });
      const o = S.boat(svg, { len: 80, color: C.stbd });
      gsap.timeline({ repeat: -1 }).set(o, { x: 920, y: 130, rotation: 160 }).to(o, { motionPath: { path: 'M 920 130 C 700 180 600 160 520 120 C 440 80 300 60 -120 90', autoRotate: true }, duration: 14, ease: 'none' });
    },
    pages: P
  });
})();
