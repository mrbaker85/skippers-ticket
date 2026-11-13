/* Chapter 2: Rules and Regulations */
(function () {
  const A = SR.art, C = A.C;
  const P = []; // pages, pushed in order below

  /* ---------- helpers for this chapter ---------- */
  function sky(svg, top, bottom) {
    const id = A.uid('sky');
    const lg = A.el('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 }, A.defs(svg));
    A.el('stop', { offset: 0, 'stop-color': top || '#E4EFEE' }, lg);
    A.el('stop', { offset: 1, 'stop-color': bottom || '#F6F0E2' }, lg);
    return A.rect(svg, 0, 0, 800, 600, { fill: `url(#${id})` });
  }
  /* red "not allowed" roundel */
  function no(parent, x, y, r) {
    const g = A.g(parent, { transform: `translate(${x},${y})` });
    A.circle(g, 0, 0, r, { fill: 'rgba(255,255,255,0.35)', stroke: C.port, 'stroke-width': r * 0.18 });
    A.line(g, -r * 0.68, -r * 0.68, r * 0.68, r * 0.68, { stroke: C.port, 'stroke-width': r * 0.18, 'stroke-linecap': 'round' });
    return g;
  }
  /* caption bar along the bottom of a watch animation */
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
  /* a letter tag that rides above a boat */
  function follow(S, svg, boat, txt, col) {
    const t = A.tag(svg, 0, 0, txt, { fill: col || C.ink, size: 17, rx: 8 });
    S.loop(() => t.setAttribute('transform', `translate(${(boat.x - t._w / 2).toFixed(1)},${(boat.y - t._h / 2 - boat.L * boat.scale * 0.5 - 16).toFixed(1)})`));
    return t;
  }
  /* river running left to right, banks top and bottom */
  function river(svg, S, o) {
    o = o || {};
    S.seaBg(svg, { top: '#C9E0E3', bottom: '#AFD0D6' });
    const top = o.top == null ? 90 : o.top, bot = o.bottom == null ? 530 : o.bottom;
    const bank = (y, up) => {
      let d = `M -20 ${up ? -20 : 640} L -20 ${y}`;
      for (let x = 0; x <= 820; x += 20) d += ` L ${x} ${(y + Math.sin(x / 90 + (up ? 0 : 2)) * 8 + Math.sin(x / 31) * 2).toFixed(1)}`;
      d += ` L 820 ${up ? -20 : 640} Z`;
      return A.land(svg, d);
    };
    if (top > 0) bank(top, true);
    if (bot < 600) bank(bot, false);
    return { top, bot };
  }
  function kayakCapsized(parent, x, y, r) {
    const g = A.g(parent, { transform: `translate(${x},${y}) rotate(${r || 0})` });
    A.path(g, 'M -48 0 C -30 -13 30 -13 48 0 C 30 13 -30 13 -48 0 Z', { fill: 'rgba(18,38,58,0.18)', transform: 'translate(2,4)' });
    A.path(g, 'M -48 0 C -30 -13 30 -13 48 0 C 30 13 -30 13 -48 0 Z', { fill: '#C9A227', stroke: C.ink, 'stroke-width': 1.5 });
    A.path(g, 'M -40 0 L 40 0', { stroke: '#9A7B12', 'stroke-width': 2 });
    return g;
  }
  function wave(tl, el, at) { tl.fromTo(el, { scale: 0.92 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' }, at); }

  /* ===================================================================
     DUTY AND THE LAW
     =================================================================== */
  P.push({
    type: 'learn', title: "You're responsible",
    html: `<p>Whether you skipper a huge ship or a small trailer boat, the same <span class="term">duty of care</span> applies. You are responsible for:</p>
<ul><li>the safety of your vessel, crew and passengers</li><li>not putting any other vessel in danger</li><li>being ready to help others who need it</li></ul>
<p>This chapter covers the specific rules that apply on WA's navigable waters. They all come back to these three duties.</p>`,
    art(svg, S) {
      S.seaBg(svg);
      const wk = A.g(svg); S.wakes(wk);
      const other = S.boat(svg, { x: -80, y: 120, r: 4, len: 86, color: C.stbd });
      gsap.to(other, { x: 900, y: 175, duration: 13, repeat: -1, ease: 'none' });
      A.ring(svg, 380, 330, 128, { label: 'VESSEL, CREW, PASSENGERS', color: C.port, fill: 'rgba(200,53,43,0.06)' });
      const me = S.boat(svg, { x: 380, y: 330, r: -10, len: 170, color: C.port, wake: false });
      [[-46, -20], [-46, 20], [42, 0]].forEach(([x, y]) => { A.circle(me.body, x, y, 9, { fill: C.orange }); A.circle(me.body, x, y, 5.5, { fill: '#5B3A26' }); });
      gsap.to(me, { rotation: -6, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      A.tag(svg, 400, 64, "DON'T ENDANGER OTHERS", { fill: C.stbd });
      kayakCapsized(svg, 655, 480, -20);
      A.swimmer(svg, 690, 448, 0.9);
      A.tag(svg, 650, 540, 'BE READY TO HELP', { fill: C.ink });
    }
  });

  P.push({
    type: 'learn', title: 'Who checks on you',
    html: `<p>Officers from the <b>Department of Transport</b>, <b>Fisheries</b>, the <b>Water Police</b> and other agencies enforce the boating laws. They regularly check registration and safety gear, and watch how people behave on the water.</p>
<ul><li>Carry your RST and show it when an authorised officer asks.</li><li>Tell the Department of Transport within <b>21 days</b> if you change your name or address.</li></ul>`,
    art(svg, S) {
      S.seaBg(svg);
      const wk = A.g(svg); S.wakes(wk);
      const me = S.boat(svg, { x: 350, y: 290, r: 180, len: 150, color: C.port, wake: false });
      gsap.to(me, { rotation: 183, duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      const pb = S.boat(svg, { type: 'patrol', len: 170, color: C.deep });
      const tags = [A.tag(svg, 190, 170, 'REGISTRATION', { fill: C.ink }), A.tag(svg, 350, 140, 'SAFETY GEAR', { fill: C.ink }), A.tag(svg, 510, 170, 'YOUR RST', { fill: C.port })];
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
      tl.set(tags, { opacity: 0 })
        .set(pb, { x: 900, y: 520, rotation: 200 })
        .to(pb, { motionPath: { path: 'M 900 520 C 700 470 620 420 560 400 C 500 380 440 382 370 382', autoRotate: 180 }, duration: 5, ease: 'power2.out' })
        .to(tags, { opacity: 1, duration: 0.4, stagger: 0.5 }, '-=0.6')
        .to({}, { duration: 4 })
        .to(tags, { opacity: 0, duration: 0.4 })
        .to(pb, { motionPath: { path: 'M 370 382 C 250 382 120 430 -120 520', autoRotate: 180 }, duration: 4, ease: 'power2.in' });
    }
  });

  P.push({
    type: 'learn', title: 'Know the local rules',
    html: `<p>It's the skipper's job to know the rules for the area they're boating in. Special-use (<span class="term">gazetted</span>) areas are shown on marine safety signs, charts and boating guides.</p>
<p>Ramps near ski areas have signs with that area's rules, such as the hours and which direction to ski. Speed-limited areas often have signs showing the limit.</p>
<p>Breaking the rules can mean <b>fines</b>, <b>imprisonment</b>, or your RST being <b>suspended or cancelled</b>.</p>`,
    art(svg, S) {
      sky(svg);
      A.path(svg, 'M -20 470 L 820 430 L 820 620 L -20 620 Z', { fill: C.sand });
      A.path(svg, 'M 470 445 L 820 428 L 820 620 L 560 620 Z', { fill: '#BFC3BA' });
      const sg = A.sign(svg, { x: 120, y: 70, w: 400, h: 300, head: 'SKI AREA', postH: 110 });
      const g = sg.inner;
      const row = (y, label, draw) => { draw(A.g(g, { transform: `translate(52,${y})` })); A.text(g, 100, y + 8, label, { font: 'body', size: 21, weight: 700 }); };
      row(52, 'Skiing 7 am to 7 pm', ic => { A.circle(ic, 0, 0, 22, { fill: 'none', stroke: C.ink, 'stroke-width': 4 }); A.path(ic, 'M 0 -12 L 0 0 L 9 6', { stroke: C.ink, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }); });
      row(122, 'Ski anticlockwise', ic => { A.path(ic, 'M 18 -12 A 20 20 0 1 0 20 6', { stroke: C.ink, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }); A.path(ic, 'M 10 -20 L 22 -14 L 12 -4 Z', { fill: C.ink }); });
      row(192, 'Take-off area to the left', ic => { A.path(ic, 'M 18 0 L -16 0', { stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round' }); A.path(ic, 'M -22 0 L -8 -10 L -8 10 Z', { fill: C.ink }); });
      A.speedSign(svg, 650, 230, 90, '8', 'KNOTS');
      A.rect(svg, 645, 320, 10, 130, { fill: '#8C8A80' });
      gsap.from(sg, { opacity: 0, y: '+=20', duration: 0.7, ease: 'power3.out' });
    }
  });

  P.push({
    type: 'learn', title: 'Moorings',
    html: `<p>A <span class="term">mooring</span> is a fixed anchor and buoy that a boat ties to. You need the Department of Transport's authorisation before laying a mooring in any navigable water.</p>
<p>In <b>Mooring Control Areas</b>, such as Rottnest Island and the Swan and Canning rivers, moorings must meet a set standard, and you need approval to use one.</p>
<p>Only <b>one vessel</b> may be on a mooring at a time, and it must be no bigger than the mooring was designed for.</p>`,
    art(svg, S) {
      S.seaBg(svg);
      A.arrow(svg, 'M 60 70 L 170 70', { color: C.ink2, width: 4 });
      A.text(svg, 60, 50, 'WIND', { size: 18, weight: 700, fill: C.ink2, ls: '0.14em' });
      const spots = [[230, 170], [420, 150], [610, 175], [190, 330], [380, 320], [570, 340], [260, 480], [470, 470], [660, 490]];
      const cols = [C.port, C.stbd, C.sea4, C.buoy, C.ink2, C.port, C.stbd, C.sea4, C.ink2];
      spots.forEach(([x, y], k) => {
        const outer = A.g(svg);
        const inner = A.g(outer);
        A.line(inner, x, y, x + 18, y, { stroke: C.ink2, 'stroke-width': 1.5 });
        const b = A.boat(inner, { x: x + 18 + 34, y, r: 180, len: k === 4 ? 0 : 68, color: cols[k], wake: false });
        if (k === 4) b.g.remove();
        A.mooringBuoy(outer, x, y, k === 4 ? C.buoy : C.white);
        gsap.fromTo(inner, { rotation: -9 }, { rotation: 9, svgOrigin: `${x} ${y}`, duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: k * 0.05 });
      });
      A.tag(svg, 400, 366, 'ONE VESSEL PER MOORING', { fill: C.port, size: 16 });
    }
  });

  P.push({
    type: 'learn', title: 'Nuisance and damage',
    html: `<p>You must not travel at a speed, or in a way, that causes a nuisance or damage to people or other vessels.</p>
<p>That includes the <span class="term">wash</span> from your boat: the waves it makes. Wash that hits the shore or riverbank can erode it and damage property.</p>`,
    art(svg, S) {
      sky(svg);
      // shore on the right
      A.path(svg, 'M 560 360 Q 620 330 680 300 L 820 280 L 820 620 L 600 620 Z', { fill: C.sand });
      A.path(svg, 'M 690 300 L 820 280 L 820 620 L 700 620 Z', { fill: C.land });
      A.tree(svg, 760, 250, 26); A.tree(svg, 710, 270, 18);
      const water = A.waterSide(svg, 380, { amp: 4 });
      const boat = A.g(svg);
      const bs = A.boatSide(boat, { len: 200, color: C.port });
      A.person(bs.crew, { x: -22, y: -22, s: 0.55, side: true, color: C.ink, fwdL: 60, fwdR: 70 });
      svg.appendChild(water);
      const crests = [0, 1, 2].map(() => A.path(svg, 'M -40 0 Q 0 -26 40 0', { fill: 'rgba(255,255,255,0.85)', stroke: '#fff', 'stroke-width': 3, opacity: 0 }));
      const grains = [];
      for (let k = 0; k < 14; k++) grains.push(A.circle(svg, 600 + Math.random() * 40, 340 + Math.random() * 16, 2.5 + Math.random() * 2, { fill: '#C9B27A', opacity: 0 }));
      A.tag(svg, 600, 230, 'WASH ERODES THE BANK', { fill: C.port });
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });
      tl.set(boat, { x: -150, y: 382 }).to(boat, { x: 950, duration: 4.2, ease: 'none' }, 0);
      crests.forEach((c, k) => {
        const at = 0.8 + k * 0.6;
        tl.fromTo(c, { x: 150 + k * 40, y: 380, opacity: 0, scaleX: 0.8 }, { x: 600, y: 368, opacity: 1, scaleX: 1.2, duration: 2.6, ease: 'none' }, at)
          .to(c, { opacity: 0, y: 340, duration: 0.4 }, at + 2.6);
      });
      grains.forEach((gr, k) => tl.fromTo(gr, { opacity: 1, attr: { cy: 340 + (k % 5) * 3 } }, { attr: { cy: 420 + Math.random() * 30 }, opacity: 0, duration: 1.4, ease: 'power1.in' }, 3.3 + (k % 3) * 0.5));
    }
  });

  /* ===================================================================
     SPEED LIMITS
     =================================================================== */
  P.push({
    type: 'learn', title: 'The 8-knot rule',
    html: `<p>Unless the Department of Transport has approved otherwise, you must not drive a motor boat faster than <b>8 knots</b>:</p>
<ul><li>through a bridge arch (unless skiing is allowed there)</li><li>in or through a mooring area</li><li>in water less than <b>3 metres</b> deep</li><li>within <b>15 metres</b> of a vessel that is underway</li><li>within <b>50 metres</b> of a moored vessel, a person in the water, a jetty or wharf, or a river bank or low water mark</li></ul>`,
    art(svg, S) {
      A.paperBg(svg);
      const g = A.g(svg);
      A.speedSign(g, 400, 230, 130, '8', 'KNOTS');
      gsap.from(g, { scale: 0.7, svgOrigin: '400 230', opacity: 0, duration: 0.7, ease: 'back.out(1.6)' });
      const chips = [['15 m', 'from a vessel underway', C.ink], ['50 m', 'from people, moored boats, jetties and banks', C.port], ['3 m', 'deep or less', C.sea4]];
      chips.forEach(([big, small, col], k) => {
        const y = 430 + k * 54;
        const c = A.g(svg, { transform: `translate(130,${y})` });
        A.rect(c, 0, -22, 540, 46, { rx: 12, fill: C.white, stroke: C.line });
        A.rect(c, 0, -22, 92, 46, { rx: 12, fill: col });
        A.text(c, 46, 9, big, { size: 26, weight: 700, anchor: 'middle', fill: '#fff' });
        A.text(c, 112, 8, small, { font: 'body', size: 18, fill: C.ink });
        gsap.from(c, { opacity: 0, x: '-=20', duration: 0.5, delay: 0.5 + k * 0.15, ease: 'power2.out' });
      });
    }
  });

  /* A3: speed zone map */
  P.push({
    type: 'try', title: 'Find the 8-knot zones',
    html: `<p>Tap anywhere on the river to steer the boat there. Watch the speed limit change as you pass each hazard.</p>`,
    lockMsg: 'Find at least five different zones',
    build(svg, S, api) {
      const scale = 2; // 2 px = 1 m
      const R = river(svg, S, { top: 70, bottom: 540 });
      // bank zones (50 m from bank)
      A.rect(svg, 0, R.top, 800, 50 * scale, { fill: 'rgba(200,53,43,0.07)' });
      A.rect(svg, 0, R.bot - 50 * scale, 800, 50 * scale, { fill: 'rgba(200,53,43,0.07)' });
      A.line(svg, 0, R.top + 100, 800, R.top + 100, { stroke: C.port, 'stroke-width': 1.5, 'stroke-dasharray': '6 8', opacity: 0.6 });
      A.line(svg, 0, R.bot - 100, 800, R.bot - 100, { stroke: C.port, 'stroke-width': 1.5, 'stroke-dasharray': '6 8', opacity: 0.6 });
      // shallows
      A.path(svg, 'M 300 330 C 340 300 440 300 470 330 C 500 360 430 390 370 385 C 310 380 270 360 300 330 Z', { fill: '#D9E6D2', opacity: 0.85, stroke: '#B7C9A9', 'stroke-width': 2, 'stroke-dasharray': '4 5' });
      A.text(svg, 385, 352, 'UNDER 3 m', { size: 15, weight: 700, anchor: 'middle', fill: '#5E7A52', ls: '0.08em' });
      // bridge
      const br = A.g(svg);
      A.rect(br, 92, 30, 52, 540, { fill: '#B8B3A6', stroke: '#8E897D', 'stroke-width': 2 });
      [210, 300, 390].forEach(y => A.rect(br, 86, y - 8, 64, 16, { rx: 4, fill: '#7E7A70' }));
      A.text(br, 118, 25, 'BRIDGE', { size: 14, weight: 700, anchor: 'middle', fill: C.ink2, ls: '0.1em' });
      // mooring area
      A.rect(svg, 470, 92, 260, 120, { rx: 14, fill: 'rgba(240,178,26,0.1)', stroke: C.buoy, 'stroke-width': 2, 'stroke-dasharray': '7 6' });
      A.text(svg, 600, 230, 'MOORING AREA', { size: 14, weight: 700, anchor: 'middle', fill: '#9A6B00', ls: '0.1em' });
      [[520, 130], [600, 125], [680, 135], [550, 180], [640, 180]].forEach(([x, y], k) => { A.line(svg, x, y, x + 12, y, { stroke: C.ink2 }); A.boat(svg, { x: x + 40, y, r: 180, len: 52, color: [C.port, C.stbd, C.sea4, C.ink2, C.buoy][k], wake: false }); A.mooringBuoy(svg, x, y); });
      // moored yacht with 50 m ring
      // jetty
      A.jetty(svg, 690, 420, 16, 120);
      A.ring(svg, 698, 430, 100, { color: C.port, fill: 'rgba(200,53,43,0.05)' });
      // swimmer
      A.ring(svg, 250, 450, 100, { color: C.port, fill: 'rgba(200,53,43,0.05)' });
      A.swimmer(svg, 250, 450, 1);
      // vessel underway
      const wk = A.g(svg); S.wakes(wk);
      const ves = S.boat(svg, { type: 'yacht', len: 70, color: C.sea4, x: 220, y: 270, r: 0, sail: false });
      const vring = A.circle(svg, 0, 0, 15 * scale + 30, { fill: 'rgba(200,53,43,0.08)', stroke: C.port, 'stroke-width': 2, 'stroke-dasharray': '5 5' });
      gsap.to(ves, { x: 640, duration: 22, yoyo: true, repeat: -1, ease: 'sine.inOut', onRepeat: () => { } });
      let vdir = 1, vx = ves.x;
      S.loop(() => { if (ves.x !== vx) { const d = ves.x > vx ? 0 : 180; ves.rotation += ((d - ves.rotation + 540) % 360 - 180) * 0.08; vx = ves.x; } vring.setAttribute('cx', ves.x); vring.setAttribute('cy', ves.y); });
      // the student's boat
      const me = S.boat(svg, { x: 420, y: 470, r: -90, len: 60, color: C.port });
      // gauge
      const gz = A.gauge(svg, { x: 82, y: 515, r: 58, max: 30, zone: [8, 30, C.port], step: 5, value: 20 });
      const zones = {
        bridge: 'through a bridge arch', mooring: 'in a mooring area', shallow: 'in water under 3 m deep',
        underway: 'within 15 m of a vessel underway', moored: 'within 50 m of a moored vessel', swimmer: 'within 50 m of a person in the water',
        jetty: 'within 50 m of a jetty', bank: 'within 50 m of the bank'
      };
      const inShallow = (x, y) => ((x - 385) / 95) ** 2 + ((y - 345) / 45) ** 2 < 1;
      const check = (x, y) => {
        const hits = [];
        if (x > 80 && x < 156) hits.push('bridge');
        if (x > 470 && x < 730 && y > 92 && y < 212) hits.push('mooring');
        else if (x > 420 && x < 780 && y > 30 && y < 280) hits.push('moored');
        if (inShallow(x, y)) hits.push('shallow');
        if (Math.hypot(x - ves.x, y - ves.y) < 15 * scale + 30) hits.push('underway');
        if (Math.hypot(x - 250, y - 450) < 100) hits.push('swimmer');
        if (Math.hypot(x - 698, y - 430) < 100) hits.push('jetty');
        if (y < R.top + 100 || y > R.bot - 100) hits.push('bank');
        return hits;
      };
      const status = document.createElement('div');
      status.innerHTML = `<div class="q" style="margin:0 0 6px" id="lim">Open water</div><div class="status" id="why">No 8-knot rule applies here.</div><div class="status" id="cnt">Zones found: 0 of 5</div>`;
      api.task.appendChild(status);
      const lim = status.querySelector('#lim'), why = status.querySelector('#why'), cnt = status.querySelector('#cnt');
      const found = new Set();
      let target = { x: me.x, y: me.y }, last = '';
      const pt = svg.createSVGPoint();
      const toSvg = e => { pt.x = e.clientX; pt.y = e.clientY; return pt.matrixTransform(svg.getScreenCTM().inverse()); };
      let dragging = false;
      svg.addEventListener('pointerdown', e => { dragging = true; const p = toSvg(e); target = { x: Math.max(20, Math.min(780, p.x)), y: Math.max(R.top + 14, Math.min(R.bot - 14, p.y)) }; });
      svg.addEventListener('pointermove', e => { if (!dragging) return; const p = toSvg(e); target = { x: Math.max(20, Math.min(780, p.x)), y: Math.max(R.top + 14, Math.min(R.bot - 14, p.y)) }; });
      window.addEventListener('pointerup', () => dragging = false);
      const marker = A.circle(svg, target.x, target.y, 10, { fill: 'none', stroke: C.ink, 'stroke-width': 2, opacity: 0 });
      let gaugeV = 20;
      S.loop(() => {
        const dx = target.x - me.x, dy = target.y - me.y, d = Math.hypot(dx, dy);
        marker.setAttribute('cx', target.x); marker.setAttribute('cy', target.y); marker.setAttribute('opacity', d > 8 ? 0.6 : 0);
        const hits = check(me.x, me.y);
        const maxSp = hits.length ? 1.4 : 2.6;
        if (d > 3) {
          const want = Math.atan2(dy, dx) * 180 / Math.PI;
          let diff = ((want - me.rotation + 540) % 360) - 180;
          me.rotation += diff * 0.12;
          const sp = Math.min(maxSp, d * 0.06 + 0.4);
          const a = me.rotation * Math.PI / 180;
          me.x += Math.cos(a) * sp; me.y += Math.sin(a) * sp;
        }
        const key = hits.join(',');
        if (key !== last) {
          last = key;
          hits.forEach(h => found.add(h));
          if (hits.length) { lim.textContent = 'Max 8 knots'; lim.style.color = 'var(--port)'; why.textContent = 'You are ' + hits.map(h => zones[h]).join(', and ') + '.'; }
          else { lim.textContent = 'Open water'; lim.style.color = ''; why.textContent = 'No 8-knot rule applies here.'; }
          const tgt = hits.length ? 8 : 20;
          if (tgt !== gaugeV) { gaugeV = tgt; gz.set(tgt, 0.8); }
          cnt.textContent = `Zones found: ${Math.min(found.size, 5)} of 5`;
          if (found.size >= 5 && !api.complete) api.done('Nice driving. In a river, the 50 m from the bank rule means much of the water is an 8-knot zone.');
        }
      });
    }
  });

  P.push({
    type: 'check', title: 'Swimmer ahead',
    q: 'You spot a swimmer 40 metres away. What is the fastest you may go?',
    opts: ['6 knots', '8 knots', '10 knots', '12 knots'], a: 1,
    why: 'Within 50 metres of a person in the water, the limit is 8 knots.',
    art(svg, S) {
      S.seaBg(svg);
      A.swimmer(svg, 560, 300, 1.4);
      const b = S.boat(svg, { x: 250, y: 300, len: 110, color: C.port, wake: false });
      A.path(svg, 'M 320 300 L 525 300', { stroke: C.ink, 'stroke-width': 3, 'stroke-dasharray': '8 8' });
      A.tag(svg, 420, 268, '40 m', { fill: C.ink, size: 22 });
      gsap.to(b, { y: 304, rotation: 2, duration: 1.8, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    }
  });

  P.push({
    type: 'check', title: 'Where can you go faster?',
    q: 'Under the general rule, where is there no 8-knot limit?',
    opts: ['Passing through a bridge arch', 'In water 2 metres deep', 'Passing 20 m from a moored yacht', 'In open water, 300 m from shore'], a: 3,
    why: 'Open water 300 m from shore is clear of every 8-knot rule, as long as no other limit is signposted.',
    hints: { 0: 'Bridge arches are 8-knot zones unless skiing is allowed there.', 1: 'Water under 3 m deep is an 8-knot zone.', 2: 'You must stay under 8 knots within 50 m of a moored vessel.' }
  });

  /* ===================================================================
     ON THE WATERWAY
     =================================================================== */
  P.push({
    type: 'learn', title: 'Keep channels clear',
    html: `<p>Crab nets, cray pots, fishing nets, marker buoys or any other buoyed objects are not allowed in a channel, fairway or passage without the Department of Transport's permission.</p>
<p>Anchoring or mooring in these areas is also banned unless you are in distress.</p>
<p>Never tie your boat to a beacon or any other navigation aid.</p>`,
    art(svg, S) {
      S.seaBg(svg);
      A.path(svg, 'M -20 210 C 200 180 600 240 820 200 L 820 400 C 600 430 200 380 -20 410 Z', { fill: 'rgba(47,111,134,0.18)' });
      A.text(svg, 60, 312, 'CHANNEL', { size: 18, weight: 700, fill: C.sea4, ls: '0.3em', opacity: 0.8 });
      [[150, 190, 'port'], [150, 405, 'stbd'], [400, 198, 'port'], [400, 410, 'stbd'], [650, 206, 'port'], [650, 412, 'stbd']].forEach(([x, y, k]) => A.beacon(svg, x, y, k));
      // cray pot in channel
      const pot = A.g(svg, { transform: 'translate(300,300)' });
      A.circle(pot, 0, 0, 12, { fill: C.orange, stroke: C.ink, 'stroke-width': 1.5 });
      A.path(pot, 'M 0 12 q 10 20 -4 40', { stroke: C.ink2, 'stroke-width': 2, fill: 'none' });
      no(svg, 300, 300, 40);
      A.tag(svg, 300, 245, 'NO POTS IN CHANNELS', { fill: C.port, size: 15 });
      // boat tied to beacon
      const b = A.boat(svg, { x: 520, y: 470, r: -60, len: 80, color: C.stbd, wake: false });
      A.beacon(svg, 556, 420, 'stbd');
      A.path(svg, 'M 556 420 L 540 440', { stroke: C.ink, 'stroke-width': 2.5 });
      no(svg, 545, 450, 52);
      A.tag(svg, 545, 525, 'NEVER TIE TO A BEACON', { fill: C.port, size: 15 });
    }
  });

  P.push({
    type: 'learn', title: 'Reporting an accident',
    html: `<p>If an accident causes <b>serious injury or death</b>, or damages a vessel so badly it becomes <b>unseaworthy or unsafe</b>, the owner or skipper must report it to the Department of Transport within <b>72 hours</b>.</p>
<p>A Marine Incident Report form is available from the Department of Transport's offices or website, or by phoning 13 11 56.</p>`,
    art(svg, S) {
      A.paperBg(svg);
      const g = A.g(svg, { transform: 'translate(400,270)' });
      A.rect(g, -18, -190, 36, 30, { rx: 6, fill: C.ink });
      A.circle(g, 6, 10, 170, { fill: 'rgba(18,38,58,0.16)' });
      A.circle(g, 0, 0, 170, { fill: C.white, stroke: C.ink, 'stroke-width': 10 });
      const arc = A.path(g, 'M 0 -150 A 150 150 0 1 1 -0.1 -150', { fill: 'none', stroke: C.port, 'stroke-width': 18, 'stroke-linecap': 'round' });
      for (let k = 0; k < 12; k++) { const a = k * 30 * Math.PI / 180; A.line(g, Math.sin(a) * 120, -Math.cos(a) * 120, Math.sin(a) * 134, -Math.cos(a) * 134, { stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round' }); }
      A.text(g, 0, 26, '72', { size: 120, weight: 700, anchor: 'middle', fill: C.ink });
      A.text(g, 0, 70, 'HOURS', { size: 26, weight: 700, anchor: 'middle', fill: C.port, ls: '0.2em' });
      gsap.fromTo(arc, { drawSVG: '0%' }, { drawSVG: '100%', duration: 4, ease: 'none', repeat: -1, repeatDelay: 1 });
      A.tag(svg, 250, 520, 'SERIOUS INJURY OR DEATH', { fill: C.ink, size: 16 });
      A.tag(svg, 560, 520, 'VESSEL UNSAFE', { fill: C.ink, size: 16 });
    }
  });

  P.push({
    type: 'learn', title: 'Helping people in distress',
    html: `<p>Every skipper has a <b>legal obligation</b> to help people in distress. The only exceptions are when:</p>
<ul><li>you're unable to, for example the call came from too far away</li><li>help isn't needed, for example marine rescue has taken over</li><li>it would be too dangerous</li></ul>
<p>If an accident happens near you, you must help where you can, as long as it doesn't seriously endanger you or your passengers.</p>`,
    art(svg, S) {
      S.seaBg(svg);
      const wk = A.g(svg); S.wakes(wk);
      const dinghy = A.g(svg, { transform: 'translate(560,250) rotate(25)' });
      A.path(dinghy, 'M -60 -26 L 40 -30 C 64 -30 72 -10 72 0 C 72 10 64 30 40 30 L -60 26 Z', { fill: 'rgba(18,38,58,0.18)', transform: 'translate(3,5)' });
      A.path(dinghy, 'M -60 -26 L 40 -30 C 64 -30 72 -10 72 0 C 72 10 64 30 40 30 L -60 26 Z', { fill: '#5B6E80', stroke: C.ink, 'stroke-width': 1.6 });
      A.line(dinghy, -50, 0, 60, 0, { stroke: '#41546A', 'stroke-width': 3 });
      gsap.to(dinghy, { rotation: 29, duration: 2, yoyo: true, repeat: -1, ease: 'sine.inOut', svgOrigin: '560 250' });
      A.swimmer(svg, 640, 330, 1); A.swimmer(svg, 500, 330, 1);
      const me = S.boat(svg, { len: 120, color: C.port });
      A.tag(svg, 560, 120, 'A LEGAL DUTY TO HELP', { fill: C.port });
      gsap.timeline({ repeat: -1, repeatDelay: 2 })
        .set(me, { x: -80, y: 520, rotation: -30 })
        .to(me, { motionPath: { path: 'M -80 520 C 120 420 250 420 330 380 C 380 352 410 340 430 345', autoRotate: true }, duration: 6, ease: 'power2.out' })
        .to({}, { duration: 3 });
    }
  });

  P.push({
    type: 'learn', title: 'Aquatic events',
    html: `<p>An <span class="term">aquatic event</span> is any on-water race or display that might affect normal navigation, such as a sailing regatta, rowing race or fireworks display.</p>
<p>Most aquatic events need approval from the Department of Transport. The application lets them check the event is safe for all waterway users and meets the law.</p>`,
    art(svg, S) {
      S.seaBg(svg);
      const wk = A.g(svg); S.wakes(wk);
      const mark = A.g(svg, { transform: 'translate(560,250)' });
      A.circle(mark, 2, 4, 20, { fill: 'rgba(18,38,58,0.2)' });
      A.circle(mark, 0, 0, 20, { fill: C.orange, stroke: C.ink, 'stroke-width': 2 });
      A.tag(svg, 560, 205, 'RACE MARK', { fill: C.orange, size: 14 });
      const course = 'M 60 520 C 300 480 480 360 520 290 C 560 220 640 200 700 260 C 760 330 700 420 560 460 C 400 500 200 560 60 520 Z';
      [0, 0.08, 0.16].forEach((off, k) => {
        const y = S.boat(svg, { type: 'yacht', len: 70, color: [C.port, C.stbd, C.sea4][k], tack: 'port' });
        gsap.to(y, { motionPath: { path: course, autoRotate: true, start: off, end: off + 1 }, duration: 26, repeat: -1, ease: 'none' });
      });
      const sb = A.boat(svg, { x: 170, y: 150, r: 90, len: 90, color: C.ink2, wake: false });
      A.flagA ? null : null;
      const flag = A.g(svg, { transform: 'translate(150,96)' });
      A.line(flag, 0, 0, 0, 40, { stroke: C.ink, 'stroke-width': 3 });
      A.rect(flag, 0, 0, 30, 20, { fill: C.buoy, stroke: C.ink });
      A.tag(svg, 170, 220, 'EVENT BOAT', { fill: C.ink, size: 14 });
    }
  });

  P.push({
    type: 'learn', title: 'Arms and legs inside',
    html: `<p>Once a vessel is <span class="term">underway</span> (moving, not anchored, moored or aground), everyone on board must keep every part of their body <b>inside the hull</b>.</p>
<p>Hands and feet over the side can be crushed against a jetty or another boat, or caught in the water.</p>`,
    art(svg, S) {
      S.seaBg(svg);
      A.jetty(svg, -20, 430, 840, 60);
      [120, 330, 540, 750].forEach(x => { A.circle(svg, x, 424, 9, { fill: '#6B4E31' }); });
      const wk = A.g(svg); S.wakes(wk);
      const b = S.boat(svg, { x: -200, y: 345, r: 0, len: 260, color: C.sea4 });
      const B = 260 * 0.4;
      const arm = A.line(b.body, 10, B / 2 - 14, 10, B / 2 - 14, { stroke: C.skin, 'stroke-width': 9, 'stroke-linecap': 'round' });
      A.circle(b.body, 10, B / 2 - 24, 13, { fill: C.orange });
      A.circle(b.body, 10, B / 2 - 24, 8, { fill: '#5B3A26' });
      const bad = A.g(svg, { opacity: 0 }); no(bad, 400, 200, 46); A.tag(bad, 400, 272, 'ARM OVER THE SIDE', { fill: C.port });
      const good = A.g(svg, { opacity: 0 }); A.tick(good, 400, 200, 40, true); A.tag(good, 400, 272, 'EVERYTHING INSIDE THE HULL', { fill: C.stbd });
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 });
      tl.set(b, { x: -200 }).set(arm, { attr: { y2: B / 2 + 34 } })
        .to(b, { x: 400, duration: 3.2, ease: 'power2.out' })
        .to(bad, { opacity: 1, duration: 0.3 }, 1.8)
        .to(arm, { attr: { y2: B / 2 - 14 }, duration: 0.6, ease: 'power2.inOut' }, 4)
        .to(bad, { opacity: 0, duration: 0.2 }, 4)
        .to(good, { opacity: 1, duration: 0.3 }, 4.4)
        .to(b, { x: 1000, duration: 3.2, ease: 'power2.in' }, 6)
        .to(good, { opacity: 0, duration: 0.3 }, 8.6);
    }
  });

  /* ===================================================================
     ALCOHOL AND DRUGS
     =================================================================== */
  P.push({
    type: 'learn', title: 'Alcohol and drugs',
    html: `<p>On the water, alcohol and drugs have a bigger effect on your judgement and skills, and the results can be fatal.</p>
<p>Skippers face the <b>same limits and penalties as drivers</b> on WA roads. The blood alcohol limit is <b>0.05</b>, with tougher penalties at 0.08 and 0.15.</p>
<p>The drug laws cover <b>cannabis</b>, <b>methamphetamine</b> and <b>MDMA</b>.</p>`,
    art(svg, S) {
      A.paperBg(svg);
      const x0 = 110, x1 = 690, y = 230, X = v => x0 + (x1 - x0) * v / 0.2;
      A.text(svg, 400, 110, 'BLOOD ALCOHOL CONTENT', { size: 22, weight: 700, anchor: 'middle', fill: C.ink3, ls: '0.14em' });
      const bands = [[0, 0.05, '#CFE3D4'], [0.05, 0.08, '#F7E3B0'], [0.08, 0.15, '#F2C9A8'], [0.15, 0.2, '#EBB1AA']];
      bands.forEach(([a, b, c]) => A.rect(svg, X(a), y - 30, X(b) - X(a), 60, { fill: c }));
      A.rect(svg, x0, y - 30, x1 - x0, 60, { rx: 10, fill: 'none', stroke: C.ink, 'stroke-width': 2 });
      [0.05, 0.08, 0.15].forEach((v, k) => {
        A.line(svg, X(v), y - 44, X(v), y + 44, { stroke: k ? C.ink : C.port, 'stroke-width': k ? 3 : 5 });
        A.tag(svg, X(v), y + 66, v.toFixed(2), { fill: k ? C.ink : C.port, size: 20 });
      });
      A.text(svg, X(0.025), y + 7, 'UNDER', { size: 17, weight: 700, anchor: 'middle', fill: C.stbd });
      A.tag(svg, X(0.05), y - 64, 'THE LIMIT', { fill: C.port, size: 16 });
      const bar = A.rect(svg, x0, y - 12, 0, 24, { rx: 6, fill: C.ink, opacity: 0.85 });
      gsap.timeline({ repeat: -1, repeatDelay: 1 }).set(bar, { attr: { width: 0 } }).to(bar, { attr: { width: X(0.17) - x0 }, duration: 3, ease: 'power1.inOut' }).to(bar, { attr: { width: 0 }, duration: 1.2, ease: 'power2.in', delay: 1.2 });
      A.text(svg, 400, 400, 'DRUGS TESTED FOR', { size: 20, weight: 700, anchor: 'middle', fill: C.ink3, ls: '0.14em' });
      ['Cannabis', 'Methamphetamine', 'MDMA'].forEach((d, k) => A.tag(svg, 200 + k * 200, 450, d, { fill: C.deep, size: 20 }));
    }
  });

  P.push({
    type: 'learn', title: 'Testing on the water',
    html: `<p>Department of Transport marine inspectors and WA Police can test a skipper they suspect is affected by alcohol or drugs, <b>even when the boat isn't moving</b>: tied to a jetty, on a mooring or at anchor.</p>
<p>Testing is <b>compulsory</b> after any boating incident that causes serious injury or death. If the skipper can't be identified, everyone on board may be tested.</p>
<p>Refusing a test brings penalties even bigger than the alcohol or drug offence itself.</p>`,
    art(svg, S) {
      A.paperBg(svg);
      const sg = A.sign(svg, { x: 170, y: 90, w: 460, h: 330, head: 'YOU CAN STILL BE TESTED', posts: false, border: C.ink });
      [['Tied up at a jetty', 70], ['On a mooring', 150], ['At anchor', 230]].forEach(([t, y], k) => {
        const tk = A.tick(sg.inner, 70, y, 24, true);
        A.text(sg.inner, 112, y + 9, t, { font: 'body', size: 26, weight: 700 });
        gsap.from(tk, { scale: 0, svgOrigin: `${240} ${136 + y}`, opacity: 0, duration: 0.5, delay: 0.4 + k * 0.35, ease: 'back.out(2.5)' });
      });
      A.tag(svg, 400, 480, 'COMPULSORY AFTER SERIOUS INCIDENTS', { fill: C.port, size: 18 });
    }
  });

  P.push({
    type: 'check', title: 'Tied up and tested',
    q: 'Your boat is tied up at a jetty. Can a marine officer test you for alcohol?',
    opts: ['Yes, even though the boat is secured', 'No, only while the boat is moving', 'Only if there has been an accident', 'Only if the motor is still running'], a: 0,
    why: 'Officers can test a skipper even when the boat is tied up, moored or anchored.'
  });

  /* ===================================================================
     JETTIES AND BRIDGES
     =================================================================== */
  P.push({
    type: 'watch', title: 'Right of way at a public jetty',
    html: `<p>Three situations come up at busy public jetties. Watch who gives way in each.</p>`,
    anim(svg, S) {
      const R = river(svg, S, { top: 110, bottom: 560 });
      A.arrow(svg, 'M 520 520 L 690 520', { color: C.sea4, width: 4 });
      A.text(svg, 605, 505, 'DOWN RIVER', { size: 17, weight: 700, anchor: 'middle', fill: C.sea4, ls: '0.14em' });
      A.jetty(svg, 380, 60, 40, 130);
      const wk = A.g(svg); S.wakes(wk);
      const a = S.boat(svg, { len: 80, color: C.stbd }), b = S.boat(svg, { len: 80, color: C.port });
      follow(S, svg, a, 'A', C.stbd); follow(S, svg, b, 'B', C.port);
      const cap = caption(svg);
      const tl = gsap.timeline();
      // scene 1: different directions
      tl.set(a, { x: 900, y: 290, rotation: 180 }).set(b, { x: -100, y: 300, rotation: 0 });
      cap.show(tl, 0, 'Different directions: B, heading down river, gives way to A.');
      tl.to(a, { motionPath: { path: 'M 900 290 C 700 290 560 260 470 220 C 445 208 435 200 432 196', autoRotate: true }, duration: 5.5, ease: 'power1.inOut' }, 0.4);
      tl.to(b, { motionPath: { path: 'M -100 300 C 80 300 180 320 230 360 C 260 385 250 400 230 400', autoRotate: true }, duration: 4.5, ease: 'power2.out' }, 0.4);
      tl.to({}, { duration: 1.2 });
      // scene 2: same direction
      tl.set([a, b], { opacity: 1 });
      tl.add('s2');
      tl.set(a, { x: 900, y: 230, rotation: 180 }, 's2').set(b, { x: 900, y: 360, rotation: 180 }, 's2');
      cap.show(tl, tl.duration() - 0.3, 'Same direction: B, on the outer course, gives way to A on the inner course.');
      tl.to(a, { motionPath: { path: 'M 900 230 C 720 230 560 222 470 210 C 448 206 438 200 432 196', autoRotate: true }, duration: 5, ease: 'power1.inOut' }, 's2+=0.3');
      tl.to(b, { motionPath: { path: 'M 900 360 C 760 360 680 370 640 390 C 610 405 600 410 590 410', autoRotate: true }, duration: 4, ease: 'power2.out' }, 's2+=0.3');
      tl.to({}, { duration: 1.2 });
      // scene 3: leaving at the same time
      tl.add('s3');
      tl.set(a, { x: 432, y: 196, rotation: 180 }, 's3').set(b, { x: 368, y: 150, rotation: 270 }, 's3');
      cap.show(tl, tl.duration() - 0.3, 'Leaving together: the first under way (A) has right of way. B waits until A is well clear.');
      tl.to(a, { motionPath: { path: 'M 432 196 C 470 230 520 290 640 300 C 720 306 800 300 900 300', autoRotate: true }, duration: 5, ease: 'power1.in' }, 's3+=0.8');
      tl.to(b, { rotation: 265, duration: 0.8, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 's3+=0.8');
      tl.to(b, { motionPath: { path: 'M 368 150 C 368 210 330 280 200 300 C 100 315 0 300 -120 300', autoRotate: true }, duration: 4.5, ease: 'power1.in' }, 's3+=5');
      tl.to({}, { duration: 0.6 });
      return tl;
    }
  });

  P.push({
    type: 'check', title: 'Heading for the same jetty',
    q: 'Two motor boats are heading for the same public jetty from opposite directions. Which one gives way?',
    opts: ['The boat heading down river', 'The boat heading up river', 'The boat that arrives second', 'The larger of the two boats'], a: 0,
    why: 'When boats approach a public jetty from different directions, the boat heading down river gives way to the boat heading up river.'
  });

  P.push({
    type: 'watch', title: 'The Fremantle bridges',
    html: `<p>The Fremantle bridges are the narrowest part of the river and where the tide runs strongest. Ferries, charter boats, yachts and dinghies all squeeze through.</p>
<p>Give ferries plenty of room: their steering works poorly at low speed.</p>`,
    anim(svg, S) {
      sky(svg, '#E3EEF0', '#F2ECDD');
      // bridge
      const br = A.g(svg);
      A.rect(br, -20, 110, 840, 40, { fill: '#9C978A' });
      A.rect(br, -20, 104, 840, 10, { fill: '#7E796D' });
      [120, 400, 680].forEach(x => A.rect(br, x - 22, 150, 44, 290, { fill: '#8E897D' }));
      const yacht = A.g(svg, { transform: 'translate(400,420)' });
      const yi = A.g(yacht);
      // yacht hull
      A.path(yi, 'M -150 -30 L 150 -34 Q 160 -20 140 10 L -130 10 Q -150 -10 -150 -30 Z', { fill: C.white, stroke: C.ink, 'stroke-width': 2.2 });
      A.path(yi, 'M -10 10 L 10 10 L 4 70 L -4 70 Z', { fill: C.ink });
      const mast = A.g(yi);
      A.line(mast, 0, -34, 0, -330, { stroke: C.ink, 'stroke-width': 5, 'stroke-linecap': 'round' });
      const stays = A.g(yi);
      A.line(stays, 0, -330, 150, -36, { stroke: C.ink3, 'stroke-width': 1.5 });
      A.line(stays, 0, -330, -150, -32, { stroke: C.ink3, 'stroke-width': 1.5 });
      const water = A.waterSide(svg, 430);
      const mb = A.g(svg);
      A.boatSide(A.g(mb, { transform: 'scale(-1,1)' }), { len: 200, color: C.port });
      svg.appendChild(water);
      const crest = A.path(svg, 'M -30 0 Q 0 -22 30 0', { fill: 'rgba(255,255,255,0.9)', stroke: '#fff', 'stroke-width': 3, opacity: 0 });
      const cap = caption(svg);
      const tl = gsap.timeline();
      tl.set(mast, { rotation: 0, svgOrigin: '0 -34' }).set(stays, { opacity: 1 }).set(yi, { rotation: 0 }).set(mb, { x: 950, y: 432 });
      tl.to(stays, { opacity: 0, duration: 0.4 }, 0.5);
      cap.show(tl, 0, 'Most yachts must lower their mast to pass under the downstream bridges.');
      tl.to(mast, { rotation: -88, svgOrigin: '0 -34', duration: 3, ease: 'power2.inOut' }, 0.6);
      cap.show(tl, 4, 'With the mast down, the keel makes the yacht roll more violently.');
      tl.to(yi, { rotation: 7, svgOrigin: '0 10', duration: 0.5, yoyo: true, repeat: 7, ease: 'sine.inOut' }, 4.5);
      tl.to(mb, { x: -200, duration: 3.2, ease: 'none' }, 4.2);
      tl.fromTo(crest, { x: 520, y: 432, opacity: 1 }, { x: 330, opacity: 0, duration: 1.6 }, 5);
      cap.show(tl, 8.8, 'Avoid passing a yacht near the bridges. If you must, slow down, keep well clear and cut your wake.');
      tl.set(mb, { x: 950 }, 9);
      tl.to(mb, { x: -200, duration: 7, ease: 'none' }, 9.3);
      tl.to(yi, { rotation: 1.5, svgOrigin: '0 10', duration: 1.2, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 9.6);
      tl.to({}, { duration: 1 });
      return tl;
    }
  });

  SR._ch2 = { P, helpers: { sky, no, caption, follow, river, kayakCapsized } };
})();
