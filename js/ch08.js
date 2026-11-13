/* Chapter 8: Safe Operations */
(function () {
  const A = SR.art, C = A.C;
  const { sky, caption, rounds, wrap, outboard, telltale } = SR.share;
  const P = [];

  /* ---------- hull cross-section (front view). origin = waterline centre ---------- */
  function hullSection(parent, x, y, s, o) {
    o = o || {};
    const svg = parent.ownerSVGElement || parent;
    const root = A.g(parent, { transform: `translate(${x},${y}) scale(${s || 1})` });
    const g = A.g(root);
    const d = 'M -150 -50 L 150 -50 L 128 30 Q 60 78 0 84 Q -60 78 -128 30 Z';
    const cid = A.uid('hs');
    A.path(A.el('clipPath', { id: cid }, A.defs(svg)), d);
    A.path(g, d, { fill: C.white, stroke: C.ink, 'stroke-width': 3, 'stroke-linejoin': 'round' });
    const inner = A.g(g, { 'clip-path': `url(#${cid})` });
    A.rect(inner, -160, 10, 320, 90, { fill: C.sea4, opacity: 0.12 });
    if (o.cabin) {
      A.path(g, 'M -70 -50 L -60 -150 L 60 -150 L 70 -50 Z', { fill: C.white, stroke: C.ink, 'stroke-width': 3, 'stroke-linejoin': 'round' });
      A.rect(g, -44, -128, 88, 30, { rx: 4, fill: 'rgba(111,166,182,0.5)' });
    }
    const Gm = A.g(g, { transform: `translate(0,${o.gy == null ? 20 : o.gy})` });
    A.circle(Gm, 0, 0, 16, { fill: C.buoy, stroke: C.ink, 'stroke-width': 2.5 });
    A.text(Gm, 0, 6, 'G', { size: 18, weight: 700, anchor: 'middle', fill: C.ink });
    return { root, g, inner, G: Gm, cid };
  }
  function seaFront(parent, y) {
    const g = A.g(parent);
    A.rect(g, 0, y, 800, 600 - y, { fill: '#7FB2C4', opacity: 0.75 });
    A.line(g, 0, y, 800, y, { stroke: '#fff', 'stroke-width': 3, opacity: 0.8 });
    return g;
  }
  const scard = (svg, text, y, size) => {
    const g = A.g(svg);
    const ls = wrap(text, size > 28 ? 26 : 30);
    A.rect(g, 110, y, 580, 70 + ls.length * (size + 12), { rx: 24, fill: C.white, stroke: C.ink, 'stroke-width': 2.5 });
    ls.forEach((l, q) => A.text(g, 400, y + 56 + q * (size + 12), l, { font: 'body', size, weight: 700, anchor: 'middle', fill: C.ink }));
    gsap.from(g, { opacity: 0, y: 12, duration: 0.3 });
    return g;
  };

  /* ===================== PAGES ===================== */
  P.push({
    type: 'learn', title: 'The skipper is responsible',
    html: `<p>The skipper is responsible for the safe operation of the boat and the safety of everyone on board. That means making sure:</p>
<ul><li>the boat is run within the rules</li><li>the safety gear works, and the boat is well maintained</li><li>the trip is properly planned: weather, tides, navigation and loading</li><li>the boat is navigated safely</li><li>everyone knows what to do in an emergency.</li></ul>`,
    art(svg, S) {
      A.paperBg(svg);
      const d = A.doc(svg, { x: 250, y: 90, w: 300, h: 420, title: ['SKIPPER’S', 'CHECKLIST'], rows: 0 });
      ['Rules', 'Safety gear', 'Boat condition', 'Trip plan', 'Safe navigation', 'Emergency briefing'].forEach((t, k) => {
        const row = A.g(svg, { transform: `translate(282,${215 + k * 50})` });
        A.rect(row, 0, -16, 24, 24, { rx: 5, fill: 'none', stroke: C.ink2, 'stroke-width': 2.5 });
        A.text(row, 38, 4, t, { font: 'body', size: 20, fill: C.ink });
        const tk = A.path(row, 'M 4 -4 L 11 3 L 24 -14', { fill: 'none', stroke: C.stbd, 'stroke-width': 4, 'stroke-linecap': 'round' });
        gsap.from(tk, { drawSVG: 0, duration: 0.3, delay: 0.5 + k * 0.35 });
      });
    }
  });

  P.push({
    type: 'learn', title: 'Is your boat up to it?',
    html: `<p>Plan even the smallest trip. Success depends as much on what you do before you leave as on what you do at sea.</p>
<p>Your boat must be seaworthy, properly equipped and <b>suitable for the trip</b>. Some boats should never leave sheltered waters: their size and hull shape don't suit the open ocean. Ask experienced people what your boat can handle.</p>`,
    art(svg, S) {
      const L = A.g(svg); const R = A.g(svg);
      A.rect(L, 0, 0, 400, 600, { fill: '#DCE9EC' }); A.rect(R, 400, 0, 400, 600, { fill: '#9DB2C0' });
      const cp = A.el('clipPath', { id: 'sv1' }, A.defs(svg)); A.rect(cp, 0, 0, 400, 600);
      const cp2 = A.el('clipPath', { id: 'sv2' }, A.defs(svg)); A.rect(cp2, 400, 0, 400, 600);
      const lg = A.g(svg, { 'clip-path': 'url(#sv1)' }), rg = A.g(svg, { 'clip-path': 'url(#sv2)' });
      const b1 = A.boatSide(lg, { len: 200, x: 200, y: 380, color: C.stbd, console: false });
      A.waterSide(lg, 384, { amp: 3 });
      const b2 = A.boatSide(rg, { len: 200, x: 600, y: 380, color: C.port, console: false });
      A.waterSide(rg, 384, { amp: 26, wl: 220, speed: 1.6, top: '#6D93A3', bottom: '#3F6E80' });
      gsap.to(b1, { y: '+=3', duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      gsap.to(b2, { rotation: 14, svgOrigin: '600 380', y: '+=22', duration: 0.8, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      A.tag(svg, 200, 120, 'SHELTERED: FINE', { fill: C.stbd, size: 18 });
      A.tag(svg, 600, 120, 'OPEN OCEAN: NOT SUITED', { fill: C.port, size: 18 });
      A.line(svg, 400, 0, 400, 600, { stroke: C.white, 'stroke-width': 4 });
    }
  });

  P.push({
    type: 'learn', title: 'Test the motor at home',
    html: `<p>Before each trip, especially with an older outboard, attach a <span class="term">flushing device</span> and test start the motor <b>before you leave home</b>.</p>
<p>It is much easier to find a problem in your driveway than at the ramp, or out at sea. Check water flows from the telltale.</p>`,
    art(svg, S) {
      sky(svg, '#E8EEE6', '#F2ECDD');
      A.rect(svg, 0, 500, 800, 100, { fill: '#C9C2B0' });
      const m = outboard(svg, 330, 290, 1.1);
      A.path(svg, 'M 386 140 L 800 120 L 800 260 L 420 262 Q 390 262 386 240 Z', { fill: C.white, stroke: C.ink, 'stroke-width': 3 });
      telltale(svg, 330, 290, 1.1);
      // muffs on the leg
      A.rect(svg, 316, 335, 26, 34, { rx: 8, fill: C.buoy, stroke: '#9A7210', 'stroke-width': 2 });
      A.path(svg, 'M 329 369 C 330 450 200 470 90 500', { fill: 'none', stroke: C.stbd, 'stroke-width': 9, 'stroke-linecap': 'round' });
      const tap = A.g(svg, { transform: 'translate(70,470)' });
      A.rect(tap, -20, -40, 40, 70, { rx: 6, fill: '#9AA6B1' });
      A.tag(svg, 190, 420, 'FLUSHING MUFFS + HOSE', { fill: C.ink, size: 15 });
      gsap.to(m.blades, { scaleY: -1, transformOrigin: '50% 50%', duration: 0.15, repeat: -1, yoyo: true, ease: 'none' });
    }
  });

  P.push({
    type: 'learn', title: 'Fuel: the 50% rule',
    html: `<p>Fuel use changes a lot with sea conditions. Carry about <b>50% more fuel</b> than you expect to use.</p>
<p>Plan it as <b>25% out, 25% back, 50% reserve</b>.</p>
<p>Example: 25 L out + 25 L back = 50 L. Add 50% of that (25 L) in reserve. Total: <b>75 L</b>.</p>
<p>If you carry spare fuel, use an approved container and have a pump or funnel to transfer it.</p>`,
    art(svg, S) {
      A.paperBg(svg);
      const x0 = 120, W = 560, y0 = 220, H = 120;
      A.rect(svg, x0 - 6, y0 - 6, W + 12, H + 12, { rx: 26, fill: C.ink });
      const segs = [[0, 0.25, C.sea4, 'OUT 25 L'], [0.25, 0.5, C.sea3, 'BACK 25 L'], [0.5, 1, C.port, 'RESERVE 25 L']];
      const bars = segs.map(([a, b, col, l], k) => {
        const r = A.rect(svg, x0 + W * a * 2 / 3 * 1.5, y0, W * (b - a), H, { fill: col });
        return r;
      });
      // real proportions: 25 / 25 / 25 of 75
      bars[0].setAttribute('x', x0); bars[0].setAttribute('width', W / 3);
      bars[1].setAttribute('x', x0 + W / 3); bars[1].setAttribute('width', W / 3);
      bars[2].setAttribute('x', x0 + 2 * W / 3); bars[2].setAttribute('width', W / 3);
      [['OUT', '25 L'], ['BACK', '25 L'], ['RESERVE', '25 L']].forEach(([a, b], k) => {
        A.text(svg, x0 + W / 6 + k * W / 3, y0 + 54, a, { size: 24, weight: 700, anchor: 'middle', fill: '#fff', ls: '0.08em' });
        A.text(svg, x0 + W / 6 + k * W / 3, y0 + 88, b, { size: 22, weight: 600, anchor: 'middle', fill: '#fff' });
      });
      A.text(svg, x0, y0 - 30, 'EXPECTED USE: 50 L', { size: 20, weight: 700, fill: C.ink2, ls: '0.08em' });
      A.path(svg, `M ${x0} ${y0 - 18} L ${x0 + 2 * W / 3} ${y0 - 18}`, { stroke: C.ink2, 'stroke-width': 3 });
      A.text(svg, x0 + W / 2, y0 + H + 70, 'CARRY 75 L', { size: 34, weight: 700, anchor: 'middle', fill: C.ink, ls: '0.06em' });
      gsap.from(bars, { attr: { width: 0 }, duration: 0.6, stagger: 0.5, ease: 'power2.out' });
    }
  });

  P.push({
    type: 'learn', title: 'Working out fuel use',
    html: `<p>Work out your motor's <b>litres per hour</b> from past trips. Note how long the motor ran and how many litres it took to top up the tank.</p>
<p><b>Litres ÷ hours = L/h.</b> 10 L after 2 hours is 5 L/h.</p>
<p>Then <b>L/h × trip hours</b> gives the fuel you'll use. A 4-hour trip at 5 L/h needs 20 L, plus the 50% safety margin: <b>30 L</b>.</p>`,
    art(svg, S) {
      A.paperBg(svg);
      A.rect(svg, 120, 90, 560, 420, { rx: 24, fill: C.white, stroke: C.line, 'stroke-width': 1.5 });
      const rows = [['10 L ÷ 2 h', '= 5 L/h'], ['5 L/h × 4 h', '= 20 L'], ['20 L + 50%', '= 30 L']];
      rows.forEach(([a, b], k) => {
        const g = A.g(svg, { transform: `translate(160,${190 + k * 110})` });
        A.text(g, 0, 0, a, { size: 46, weight: 700, fill: C.ink });
        A.text(g, 480, 0, b, { size: 46, weight: 700, fill: k === 2 ? C.port : C.sea4, anchor: 'end' });
        gsap.from(g, { opacity: 0, x: -14, duration: 0.4, delay: 0.3 + k * 0.7 });
      });
    }
  });

  P.push({
    type: 'try', title: 'Fuel planner',
    html: `<p>Work out each answer. Remember the 50% safety margin where it asks for fuel to carry.</p>`,
    lockMsg: 'Answer all three',
    build(svg, S, api) {
      A.paperBg(svg);
      let card = null;
      rounds(api, S, {
        noun: 'Question',
        choices: ['18 L', '27 L', '4 L/h', '60 L'],
        items: [
          { t: 'Last trip the motor ran 3 hours and took 12 L to top up. What is its fuel use?', a: 2, why: '12 L ÷ 3 h = 4 L/h.', bad: 'Divide the litres by the hours.' },
          { t: 'A 3-hour trip at 6 L/h. How much fuel should you carry?', a: 1, why: '6 × 3 = 18 L, plus 50% (9 L) = 27 L.', bad: 'Work out the fuel used, then add 50% of it.' },
          { t: 'You expect to use 20 L going out and 20 L coming back. How much should you carry?', a: 3, why: '40 L expected, plus 50% (20 L) reserve = 60 L.', bad: 'Out plus back, then add half of that as reserve.' }
        ],
        show(it) { if (card) card.remove(); card = scard(svg, it.t, 170, 30); },
        end: 'Litres ÷ hours gives L/h. Then add 50% to whatever you expect to use.'
      });
    }
  });

  P.push({
    type: 'learn', title: 'Stability and G',
    html: `<p><span class="term">Stability</span> is how eagerly a boat returns to upright after being tipped by wind, waves or a shifting load.</p>
<p>The <span class="term">centre of gravity</span>, <b>G</b>, is the point where all the weight of the boat, load and crew balances. G moves when weight moves.</p>
<p>Weight <b>up high</b> raises G: <b>less stable</b>. Weight <b>down low</b> lowers G: <b>more stable</b>.</p>`,
    art(svg, S) {
      sky(svg, '#DCE9EC', '#EEF2EC');
      const h = hullSection(svg, 400, 380, 1.3, { cabin: true, gy: 20 });
      seaFront(svg, 380);
      const ppl = A.g(h.g);
      const ps = [-40, 0, 40].map(x => A.person(ppl, { x, y: -50, s: 0.55 }));
      const lbl = A.tag(svg, 400, 90, 'PEOPLE ON DECK: G LOW', { fill: C.stbd, size: 18 });
      const lbl2 = A.tag(svg, 400, 90, 'PEOPLE UP TOP: G HIGHER', { fill: C.port, size: 18 });
      gsap.set(lbl2, { opacity: 0 });
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });
      tl.to(h.g, { rotation: 8, svgOrigin: '0 0', duration: 0.8, yoyo: true, repeat: 3, ease: 'sine.inOut' });
      tl.to(ppl, { y: -100, duration: 0.8, ease: 'power2.inOut' });
      tl.to(h.G, { y: -26, duration: 0.8, ease: 'power2.inOut' }, '<');
      tl.to(lbl, { opacity: 0, duration: 0.3 }, '<'); tl.to(lbl2, { opacity: 1, duration: 0.3 }, '<0.3');
      tl.to(h.g, { rotation: 13, svgOrigin: '0 0', duration: 1.3, yoyo: true, repeat: 3, ease: 'sine.inOut' });
      tl.to(ppl, { y: 0, duration: 0.8 });
      tl.to(h.G, { y: 20, duration: 0.8 }, '<');
      tl.to(lbl2, { opacity: 0, duration: 0.3 }, '<'); tl.to(lbl, { opacity: 1, duration: 0.3 }, '<0.3');
    }
  });

  P.push({
    type: 'watch', title: 'Stiff or tender?',
    html: `<p>Both boats are hit by the same wave. Watch how they come back.</p>`,
    anim(svg, S) {
      sky(svg, '#DCE9EC', '#EEF2EC');
      const a = hullSection(svg, 210, 340, 0.85, { gy: 40 });
      const b = hullSection(svg, 590, 340, 0.85, { cabin: true, gy: -70 });
      seaFront(svg, 340);
      A.tag(svg, 210, 470, 'LOW G', { fill: C.ink, size: 16 });
      A.tag(svg, 590, 470, 'HIGH G', { fill: C.ink, size: 16 });
      const cap = caption(svg);
      const tl = gsap.timeline();
      cap.show(tl, 0.2, 'A wave rolls both boats over.');
      tl.to([a.g, b.g], { rotation: 22, svgOrigin: '0 0', duration: 0.6, ease: 'power2.out' }, 1);
      cap.show(tl, 1.8, 'Low G: snaps back fast. Stiff and stable, but a jerky ride.');
      tl.to(a.g, { rotation: 0, svgOrigin: '0 0', duration: 1.6, ease: 'elastic.out(1.1,0.35)' }, 1.8);
      cap.show(tl, 5, 'High G: slow and sluggish to come back. Tender, and at risk of capsize.');
      tl.to(b.g, { rotation: 6, svgOrigin: '0 0', duration: 3.4, ease: 'sine.inOut' }, 1.8);
      tl.to(b.g, { rotation: -4, svgOrigin: '0 0', duration: 2.6, ease: 'sine.inOut' }, 5.2);
      tl.to(b.g, { rotation: 0, svgOrigin: '0 0', duration: 2, ease: 'sine.inOut' }, 7.8);
      tl.to({}, { duration: 1.4 });
      return tl;
    }
  });

  P.push({
    type: 'learn', title: 'Danger signs',
    html: `<p>Watch for a boat that is <b>tender</b>: a long, slow roll and slow to come back upright.</p>
<p><span class="term">Loll</span> is when a boat would rather lie at an angle because it has little stability upright. That is not the same as a <span class="term">list</span>, where it leans because there is more weight on one side.</p>
<p>To fix a tender boat, <b>lower G</b> by moving weight down, carefully. Sudden shifts can make things worse.</p>`,
    art(svg, S) {
      sky(svg, '#DCE9EC', '#EEF2EC');
      const a = hullSection(svg, 220, 330, 0.75, { gy: 0 });
      const box = A.rect(a.g, 70, -90, 60, 40, { rx: 4, fill: C.orange, stroke: C.ink, 'stroke-width': 2 });
      gsap.set(a.g, { rotation: 10, svgOrigin: '0 0' });
      const b = hullSection(svg, 580, 330, 0.75, { cabin: true, gy: -80 });
      gsap.set(b.g, { rotation: -12, svgOrigin: '0 0' });
      gsap.to(b.g, { rotation: -16, svgOrigin: '0 0', duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      seaFront(svg, 330);
      A.tag(svg, 220, 470, 'LIST: WEIGHT ON ONE SIDE', { fill: C.ink, size: 15 });
      A.tag(svg, 580, 470, 'LOLL: UNSTABLE UPRIGHT', { fill: C.port, size: 15 });
    }
  });

  P.push({
    type: 'learn', title: 'Load it right',
    html: `<ul><li>Keep the total load, including people, within the <b>Australian Builders Plate</b> limits.</li><li>Stow <b>heavy items low</b>, spread evenly so the bow or stern doesn't dip.</li><li>Nothing should be able to slide around. Strap down heavy gear like scuba tanks.</li><li>Water sloshing inside the boat is dangerous. The <span class="term">free surface effect</span> hurts stability far more than its weight suggests.</li><li>Keep enough <span class="term">freeboard</span> for the conditions, and for the weather getting worse.</li></ul>`,
    art(svg, S) {
      sky(svg, '#DCE9EC', '#EEF2EC');
      const h = hullSection(svg, 400, 340, 1.5, { gy: 10 });
      const wr = A.g(h.inner);
      const water = A.rect(wr, -200, 40, 400, 100, { fill: '#5FA2C4', opacity: 0.85 });
      seaFront(svg, 340);
      const st = { r: 0 };
      gsap.to(st, { r: 12, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      S.loop(() => {
        h.g.setAttribute('transform', `rotate(${st.r})`);
        wr.setAttribute('transform', `rotate(${-st.r} 0 40) translate(${st.r * 4},0)`);
      });
      A.tag(svg, 400, 90, 'FREE SURFACE: WATER RUNS TO THE LOW SIDE', { fill: C.port, size: 17 });
    }
  });

  P.push({
    type: 'try', title: 'Where does it go?',
    html: `<p>Choose the best place for each item.</p>`,
    lockMsg: 'Answer all three',
    build(svg, S, api) {
      sky(svg, '#DCE9EC', '#EEF2EC');
      const h = hullSection(svg, 400, 380, 1.3, { cabin: true, gy: 10 });
      seaFront(svg, 380);
      const spots = [[0, -170, 'A'], [-70, 34, 'B'], [130, -70, 'C']].map(([x, y, l]) => { const g = A.g(h.g, { transform: `translate(${x},${y})` }); A.circle(g, 0, 0, 22, { fill: C.ink }); A.text(g, 0, 8, l, { size: 22, weight: 700, anchor: 'middle', fill: '#fff' }); return g; });
      let card = null;
      rounds(api, S, {
        noun: 'Item',
        choices: ['A: on the cabin roof', 'B: low and central', 'C: on one side deck'],
        items: [
          { t: 'Two heavy scuba tanks', a: 1, why: 'Low and central, and strapped down so they can’t shift.' },
          { t: 'A full esky of ice and fish', a: 1, why: 'Heavy weight goes low and in the middle. That keeps G low.' },
          { t: 'Passengers when the sea gets rough', a: 1, why: 'Seated low and spread evenly. People up high raise G.' }
        ],
        show(it) { if (card) card.remove(); card = A.tag(svg, 400, 80, it.t.toUpperCase(), { fill: C.ink, size: 22 }); },
        end: 'Heavy things low, central and secured.'
      });
    }
  });

  const CAP = [['Less than 3 m', 2], ['3 m to less than 3.5 m', 3], ['3.5 m to less than 4.5 m', 4], ['4.5 m to less than 5 m', 5], ['5 m to less than 5.5 m', 6], ['5.5 m to less than 6 m', 7]];
  P.push({
    type: 'learn', title: 'Don’t overload',
    html: `<p>Overloading reduces <span class="term">freeboard</span>, so the boat is less able to handle waves and more likely to be swamped.</p>
<p>If your boat has no builder's plate or handbook limit, use this table as a guide for good conditions. Carry fewer people in rough conditions or on the open sea.</p>
<p>Each person counts as 75 kg, plus 15 kg of gear. Heavy equipment means fewer people.</p>`,
    art(svg, S) {
      A.paperBg(svg);
      A.rect(svg, 100, 60, 600, 480, { rx: 22, fill: C.white, stroke: C.line, 'stroke-width': 1.5 });
      A.text(svg, 140, 112, 'BOAT LENGTH', { size: 18, weight: 700, fill: C.ink2, ls: '0.1em' });
      A.text(svg, 660, 112, 'MAX PEOPLE', { size: 18, weight: 700, fill: C.ink2, ls: '0.1em', anchor: 'end' });
      CAP.forEach(([l, n], k) => {
        const y = 170 + k * 60;
        const g = A.g(svg);
        A.line(g, 130, y - 36, 670, y - 36, { stroke: C.paper3, 'stroke-width': 1.5 });
        A.text(g, 140, y, l, { font: 'body', size: 22, fill: C.ink });
        for (let i = 0; i < n; i++) A.circle(g, 470 + i * 26, y - 8, 9, { fill: C.sea4 });
        A.text(g, 660, y, String(n), { size: 28, weight: 700, fill: C.ink, anchor: 'end' });
        gsap.from(g, { opacity: 0, duration: 0.3, delay: 0.2 + k * 0.15 });
      });
    }
  });

  P.push({
    type: 'try', title: 'How many people?',
    html: `<p>These boats have no builder's plate. Using the guide, what is the most people each can carry in good conditions?</p>`,
    lockMsg: 'Answer all three',
    build(svg, S, api) {
      sky(svg, '#DCE9EC', '#EEF2EC');
      let b = null, t = null;
      rounds(api, S, {
        noun: 'Boat',
        choices: ['3', '4', '5', '6', '7'],
        items: [
          { L: 3.2, a: 0, why: '3 m to less than 3.5 m: 3 people.' },
          { L: 4.8, a: 2, why: '4.5 m to less than 5 m: 5 people.' },
          { L: 5.7, a: 4, why: '5.5 m to less than 6 m: 7 people.' }
        ],
        show(it) {
          if (b) b.remove(); if (t) t.remove();
          b = A.g(svg); A.boatSide(b, { len: it.L * 70, x: 400, y: 360, color: C.sea4, console: it.L > 4 }); A.waterSide(b, 364);
          t = A.tag(svg, 400, 120, it.L + ' m BOAT', { fill: C.ink, size: 24 });
        },
        end: 'Remember: fewer people in poor conditions or on the open sea.'
      });
    }
  });

  P.push({
    type: 'learn', title: 'The builder’s plate',
    html: `<p>Boats built after mid-2006 must carry an <span class="term">Australian Builders Plate</span> (ABP), clearly visible. It shows:</p>
<ul><li>maximum engine power (and often maximum engine weight)</li><li>maximum number of people</li><li>maximum load</li><li>buoyancy performance.</li></ul>`,
    art(svg, S) {
      A.paperBg(svg);
      const g = A.g(svg, { transform: 'translate(150,110)' });
      A.rect(g, 6, 8, 500, 380, { rx: 18, fill: 'rgba(18,38,58,0.18)' });
      A.rect(g, 0, 0, 500, 380, { rx: 18, fill: '#E6E9EC', stroke: '#8C97A3', 'stroke-width': 4 });
      [[20, 20], [480, 20], [20, 360], [480, 360]].forEach(([x, y]) => A.circle(g, x, y, 7, { fill: '#8C97A3' }));
      A.text(g, 250, 56, 'AUSTRALIAN BUILDERS PLATE', { size: 24, weight: 700, anchor: 'middle', fill: C.ink, ls: '0.06em' });
      [['MAX ENGINE POWER', '90 kW'], ['MAX ENGINE WEIGHT', '170 kg'], ['MAX PERSONS', '6'], ['MAX LOAD', '540 kg'], ['BUOYANCY', 'LEVEL FLOTATION']].forEach(([a, b], k) => {
        const y = 110 + k * 54;
        A.line(g, 30, y + 16, 470, y + 16, { stroke: '#C3CBD3', 'stroke-width': 1.5 });
        A.text(g, 36, y, a, { size: 18, weight: 700, fill: C.ink2, ls: '0.08em' });
        A.text(g, 464, y, b, { size: 22, weight: 700, fill: C.ink, anchor: 'end' });
      });
    }
  });

  P.push({
    type: 'watch', title: 'Basic or level flotation?',
    html: `<p>Most trailer boats under 6 m have sealed air chambers or foam for flotation. Watch what happens when two different boats are swamped.</p>`,
    anim(svg, S) {
      sky(svg, '#DCE9EC', '#EEF2EC');
      const a = A.g(svg), b = A.g(svg);
      A.boatSide(a, { len: 240, x: 210, y: 300, color: C.port, console: false });
      A.boatSide(b, { len: 240, x: 600, y: 300, color: C.stbd, console: false });
      A.waterSide(svg, 304);
      A.line(svg, 400, 60, 400, 600, { stroke: '#fff', 'stroke-width': 3, opacity: 0.6 });
      const cap = caption(svg);
      const la = A.tag(svg, 210, 520, 'BASIC FLOTATION', { fill: C.port, size: 16 });
      const lb = A.tag(svg, 600, 520, 'LEVEL FLOTATION', { fill: C.stbd, size: 16 });
      const tl = gsap.timeline();
      cap.show(tl, 0.2, 'Both boats are swamped by a wave.');
      tl.to([a, b], { y: 30, duration: 1.4, ease: 'power2.in' }, 0.8);
      cap.show(tl, 2.6, 'Basic: it won’t sink, but may float at any angle. Something to cling to.');
      tl.to(a, { y: 70, rotation: -28, svgOrigin: '210 300', duration: 2, ease: 'power1.inOut' }, 2.6);
      cap.show(tl, 6, 'Level: floats upright and level with its full load, so you can bail it out.');
      tl.to(b, { y: 18, duration: 1.4 }, 6.2);
      tl.to({}, { duration: 2.6 });
      return tl;
    }
  });

  P.push({
    type: 'check', title: 'Level flotation',
    q: 'A boat with level flotation is swamped. What should happen?',
    opts: ['It floats upright and level, and can be bailed out', 'It sinks slowly over about an hour', 'It floats bow-up with only the bow showing', 'It rolls over and floats upside down'], a: 0,
    why: 'Level flotation keeps a swamped boat upright and level with its full load, so it can be bailed or pumped dry.'
  });

  P.push({
    type: 'learn', title: 'Your passengers',
    html: `<p>Make sure you have the skills, experience and crew for the conditions. Think about your passengers: their ages, seasickness, medical needs and medication.</p>
<p>Give everyone a <b>safety briefing</b>:</p>
<ul><li>what to do in an emergency</li><li>what safety gear is on board</li><li>where it is stored</li><li>how it works.</li></ul>`,
    art(svg, S) {
      sky(svg, '#DCE9EC', '#EEF2EC');
      const b = A.boatSide(svg, { len: 520, x: 400, y: 420, color: C.sea4 });
      A.person(b.crew, { x: -150, y: -b._h * 0.8, s: 1.1, side: true, fwdR: 70, vest: true });
      [-60, 0, 60].forEach((x, k) => A.person(b.crew, { x: x - 20, y: -b._h * 0.8, s: k === 1 ? 0.75 : 1, vest: true, flip: true }));
      A.waterSide(svg, 424);
      const bub = A.g(svg, { transform: 'translate(130,140)' });
      A.rect(bub, 0, 0, 280, 90, { rx: 18, fill: C.white, stroke: C.ink, 'stroke-width': 2.5 });
      A.path(bub, 'M 60 90 L 80 120 L 100 90 Z', { fill: C.white, stroke: C.ink, 'stroke-width': 2.5 });
      A.rect(bub, 58, 86, 44, 6, { fill: C.white });
      const lines = ['Lifejackets are here…', 'The EPIRB is at the helm…', 'If someone falls in…'];
      const t = A.text(bub, 140, 54, '', { font: 'body', size: 20, anchor: 'middle', fill: C.ink });
      const tl = gsap.timeline({ repeat: -1 });
      lines.forEach(l => { tl.call(() => t.textContent = l); tl.to({}, { duration: 1.8 }); });
    }
  });

  P.push({
    type: 'learn', title: 'Look after yourselves',
    html: `<ul><li><b>Clothing</b>: it's colder on the water and the sun is stronger. Even in summer, take a spray jacket and a jumper, especially for children, plus sunscreen.</li><li><b>Fatigue</b>: noise, sun, glare, vibration and waves wear you down and lead to poor decisions.</li><li><b>Water</b>: carry more than you need. Don't fill the container right up, so it floats.</li><li><b>Food</b>: less important than water. Low protein food makes you less thirsty.</li></ul>`,
    art(svg, S) {
      sky(svg, '#F6E7C6', '#F2ECDD');
      const sun = A.g(svg, { transform: 'translate(640,140)' });
      A.circle(sun, 0, 0, 50, { fill: C.buoy });
      for (let k = 0; k < 12; k++) A.line(sun, 0, -66, 0, -86, { stroke: C.buoy, 'stroke-width': 6, 'stroke-linecap': 'round', transform: `rotate(${k * 30})` });
      gsap.to(sun, { rotation: 30, svgOrigin: '640 140', duration: 6, repeat: -1, ease: 'none' });
      const btl = A.g(svg, { transform: 'translate(260,330)' });
      A.rect(btl, -50, -110, 100, 210, { rx: 22, fill: 'rgba(214,232,233,0.7)', stroke: C.sea4, 'stroke-width': 4 });
      A.rect(btl, -46, -50, 92, 146, { rx: 18, fill: '#7FB6D0', opacity: 0.85 });
      A.rect(btl, -22, -140, 44, 32, { rx: 6, fill: C.sea4 });
      A.text(btl, 0, 140, 'AIR GAP SO IT FLOATS', { size: 15, weight: 700, anchor: 'middle', fill: C.ink2, ls: '0.08em' });
      const jk = A.g(svg, { transform: 'translate(500,360)' });
      A.path(jk, 'M -70 -90 L -20 -110 L 0 -90 L 20 -110 L 70 -90 L 90 0 L 60 10 L 56 100 L -56 100 L -60 10 L -90 0 Z', { fill: C.port, stroke: '#8E2018', 'stroke-width': 3, 'stroke-linejoin': 'round' });
      A.line(jk, 0, -90, 0, 100, { stroke: '#8E2018', 'stroke-width': 3 });
      A.text(jk, 0, 140, 'SPRAY JACKET', { size: 15, weight: 700, anchor: 'middle', fill: C.ink2, ls: '0.08em' });
    }
  });

  P.push({
    type: 'learn', title: 'Know where you are',
    html: `<ul><li>Find out about <b>local rules and conditions</b>. DoT publishes regional boating guides.</li><li>Carry the right <b>chart</b>. It shows depths, hazards and anchorages. With a chart and <b>compass</b> you can find your position and a course home if rain, fog or smoke hides the land.</li><li>A <b>GPS</b> gives your latitude and longitude instantly, ideal for radio calls. Still carry a chart and compass as back-up.</li><li>A <b>depth sounder</b> can confirm your position against the chart's depths.</li></ul>`,
    art(svg, S) {
      A.paperBg(svg);
      const ch = A.g(svg, { transform: 'translate(90,90) rotate(-3)' });
      A.rect(ch, 0, 0, 420, 400, { fill: '#F7F1DE', stroke: C.line, 'stroke-width': 2 });
      A.path(ch, 'M 300 0 C 280 120 340 200 300 300 C 280 360 320 380 330 400 L 420 400 L 420 0 Z', { fill: C.land });
      [[60, 80, '12'], [140, 160, '8'], [220, 250, '5'], [90, 300, '15'], [250, 90, '6'], [180, 340, '9']].forEach(([x, y, d]) => A.text(ch, x, y, d, { font: 'body', size: 16, fill: C.ink2, italic: true }));
      A.path(ch, 'M 0 230 C 120 210 200 200 290 170', { fill: 'none', stroke: C.sea3, 'stroke-width': 2, 'stroke-dasharray': '6 5' });
      const comp = A.g(svg, { transform: 'translate(600,230)' });
      A.circle(comp, 0, 0, 90, { fill: C.ink });
      A.circle(comp, 0, 0, 76, { fill: '#F4F7FA' });
      ['N', 'E', 'S', 'W'].forEach((l, k) => A.text(comp, Math.sin(k * Math.PI / 2) * 58, -Math.cos(k * Math.PI / 2) * 58 + 7, l, { size: 20, weight: 700, anchor: 'middle', fill: k === 0 ? C.port : C.ink }));
      const nd = A.g(comp); A.path(nd, 'M 0 -48 L 10 0 L 0 48 L -10 0 Z', { fill: C.port }); A.path(nd, 'M 0 0 L 10 0 L 0 48 L -10 0 Z', { fill: C.ink2 });
      gsap.to(nd, { rotation: 12, svgOrigin: '0 0', duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      const gps = A.g(svg, { transform: 'translate(600,440)' });
      A.rect(gps, -90, -50, 180, 100, { rx: 14, fill: '#1B232C' });
      A.rect(gps, -78, -38, 156, 76, { rx: 6, fill: '#A9D7B8' });
      A.text(gps, 0, -6, '31°59.4′ S', { size: 22, weight: 700, anchor: 'middle', fill: '#1B232C' });
      A.text(gps, 0, 22, '115°31.2′ E', { size: 22, weight: 700, anchor: 'middle', fill: '#1B232C' });
    }
  });

  /* ---------- weather ---------- */
  P.push({
    type: 'learn', title: 'Five weather checks',
    html: `<p>Know what conditions you and your boat can handle, and which ones keep you home. The Bureau of Meteorology recommends five checks:</p>
<ol><li>Are <b>warnings</b> current for your area?</li><li>Are there conditions affecting safe navigation and comfort?</li><li>What are the <b>wind</b> trends?</li><li>What are the <b>wave</b> conditions?</li><li>When is the next <b>high and low tide</b>?</li></ol>`,
    art(svg, S) {
      A.paperBg(svg);
      const icons = [
        g => { A.path(g, 'M 0 -34 L 34 28 L -34 28 Z', { fill: C.buoy, stroke: C.ink, 'stroke-width': 3, 'stroke-linejoin': 'round' }); A.rect(g, -3, -12, 6, 22, { fill: C.ink }); A.circle(g, 0, 18, 3.5, { fill: C.ink }); },
        g => { A.circle(g, 0, 0, 28, { fill: 'none', stroke: C.ink, 'stroke-width': 4 }); A.path(g, 'M -18 0 Q 0 -14 18 0 Q 0 14 -18 0 Z', { fill: C.ink }); A.circle(g, 0, 0, 5, { fill: '#fff' }); },
        g => { [-14, 0, 14].forEach((y, k) => A.path(g, `M -30 ${y} L ${14 - k * 8} ${y} Q ${26 - k * 8} ${y} ${26 - k * 8} ${y - 10}`, { fill: 'none', stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round' })); },
        g => { A.path(g, 'M -34 10 Q -24 -14 -10 10 T 14 10 T 38 10', { fill: 'none', stroke: C.sea4, 'stroke-width': 5, 'stroke-linecap': 'round' }); A.path(g, 'M -34 24 Q -24 0 -10 24 T 14 24 T 38 24', { fill: 'none', stroke: C.sea3, 'stroke-width': 5, 'stroke-linecap': 'round' }); },
        g => { A.line(g, 0, -34, 0, 34, { stroke: C.ink, 'stroke-width': 4 }); A.path(g, 'M -10 -24 L 0 -36 L 10 -24 M -10 24 L 0 36 L 10 24', { fill: 'none', stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round' }); A.rect(g, -30, -2, 60, 6, { fill: C.sea3 }); }
      ];
      ['Warnings', 'Navigation + comfort', 'Wind trends', 'Waves', 'Tides'].forEach((t, k) => {
        const y = 80 + k * 96;
        const g = A.g(svg, { transform: `translate(160,${y})` });
        A.rect(g, 0, 0, 480, 80, { rx: 16, fill: C.white, stroke: C.line, 'stroke-width': 1.5 });
        A.circle(g, 44, 40, 22, { fill: C.sea4 });
        A.text(g, 44, 48, String(k + 1), { size: 22, weight: 700, anchor: 'middle', fill: '#fff' });
        A.text(g, 86, 50, t, { size: 28, weight: 700, fill: C.ink });
        const ic = A.g(g, { transform: 'translate(424,40) scale(0.8)' }); icons[k](ic);
        gsap.from(g, { opacity: 0, x: -14, duration: 0.4, delay: 0.2 + k * 0.2 });
      });
    }
  });

  P.push({
    type: 'learn', title: 'Getting the forecast',
    html: `<p>The <b>Bureau of Meteorology website</b> has the most current and complete marine weather. Its MarineLite pages load quickly on a weak connection.</p>
<p>On the water, the WA Water Police broadcast weather on <b>VHF 16 and 67</b> at <b>0718 and 1918</b> for Perth waters (within 20 nm). Marine rescue groups also give forecasts by radio.</p>
<p>The weather can change quickly, so keep listening to updates while you're out.</p>`,
    art(svg, S) {
      A.paperBg(svg);
      const ph = A.g(svg, { transform: 'translate(260,300)' });
      A.rect(ph, -110, -200, 220, 400, { rx: 28, fill: '#1B232C' });
      A.rect(ph, -96, -180, 192, 340, { rx: 10, fill: '#F4F7FA' });
      A.rect(ph, -96, -180, 192, 46, { fill: C.deep });
      A.text(ph, 0, -150, 'MARINE FORECAST', { size: 15, weight: 700, anchor: 'middle', fill: '#fff', ls: '0.08em' });
      [['Wind', 'SW 15–20 kn'], ['Seas', '1–1.5 m'], ['Swell', '2 m'], ['Warnings', 'None']].forEach(([a, b], k) => { A.text(ph, -80, -96 + k * 60, a, { font: 'body', size: 16, fill: C.ink2 }); A.text(ph, 80, -96 + k * 60, b, { size: 20, weight: 700, fill: C.ink, anchor: 'end' }); });
      const r = SR._ch7.gear.radio(svg, 570, 300, 1.4);
      r.querySelector('text').textContent = '67';
      A.tag(svg, 570, 420, '0718 + 1918', { fill: C.ink, size: 20 });
      for (let k = 0; k < 3; k++) { const a = A.path(svg, 'M 0 -26 Q 18 0 0 26', { fill: 'none', stroke: C.port, 'stroke-width': 5, 'stroke-linecap': 'round' }); gsap.fromTo(a, { x: 710 + k * 22, y: 290, opacity: 0 }, { opacity: 1, duration: 0.4, repeat: -1, yoyo: true, delay: k * 0.3, repeatDelay: 0.6 }); }
    }
  });

  P.push({
    type: 'learn', title: 'Wind words',
    html: `<ul><li>Wind over water is given in <b>knots</b>. A forecast wind is the <b>average</b> over 10 minutes, measured 10 m up.</li><li><span class="term">Gusts</span> last a few seconds and are typically <b>30–40% stronger</b> than the average.</li><li>A <span class="term">squall</span> is a sudden, big increase in wind, usually with a change in direction. It lasts several minutes, then suddenly dies.</li></ul>`,
    art(svg, S) {
      A.paperBg(svg);
      const gg = A.gauge(svg, { x: 400, y: 280, r: 170, max: 40, step: 5, label: 'KNOTS', zone: [26, 40, C.port] });
      const st = { t: 0 };
      const lbl = A.tag(svg, 400, 520, 'AVERAGE 15 kn', { fill: C.ink, size: 20 });
      const tl = gsap.timeline({ repeat: -1 });
      tl.add(gg.set(15, 1));
      tl.call(() => { lbl.querySelector('text').textContent = 'AVERAGE 15 kn'; });
      tl.to({}, { duration: 1.4 });
      tl.add(gg.set(21, 0.3));
      tl.call(() => { lbl.querySelector('text').textContent = 'GUST 21 kn (+40%)'; });
      tl.to({}, { duration: 0.8 });
      tl.add(gg.set(14, 0.5));
      tl.call(() => { lbl.querySelector('text').textContent = 'AVERAGE 15 kn'; });
      tl.to({}, { duration: 1.4 });
      tl.add(gg.set(33, 0.6));
      tl.call(() => { lbl.querySelector('text').textContent = 'SQUALL: MINUTES, THEN DIES'; });
      tl.to({}, { duration: 2.2 });
    }
  });

  const WARN = [['STRONG WIND', 'more than 25 to 33 kn', C.buoy], ['GALE', '34 to 47 kn', C.orange], ['STORM', '48 kn or more', C.port]];
  P.push({
    type: 'learn', title: 'Wind warnings',
    html: `<p>The Bureau issues warnings for average wind speeds:</p>
<ul><li><b>Strong wind warning</b>: more than 25 knots, up to 33 knots.</li><li><b>Gale warning</b>: 34 to 47 knots.</li><li><b>Storm warning</b>: 48 knots or more.</li></ul>
<p>Remember gusts can be 30–40% stronger than these averages.</p>`,
    art(svg, S) {
      A.paperBg(svg);
      WARN.forEach(([a, b, col], k) => {
        const y = 110 + k * 140;
        const g = A.g(svg, { transform: `translate(120,${y})` });
        A.rect(g, 0, 0, 560, 110, { rx: 18, fill: C.white, stroke: col, 'stroke-width': 4 });
        A.rect(g, 0, 0, 120, 110, { rx: 18, fill: col });
        const fl = A.g(g, { transform: 'translate(40,22)' });
        A.line(fl, 0, 0, 0, 70, { stroke: C.ink, 'stroke-width': 4 });
        const flag = A.path(fl, 'M 2 2 L 50 14 L 2 26 Z', { fill: '#fff' });
        gsap.to(flag, { attr: { d: 'M 2 2 Q 30 4 50 16 Q 30 22 2 26 Z' }, duration: 0.3 + k * 0.1, yoyo: true, repeat: -1 });
        A.text(g, 150, 52, a, { size: 34, weight: 700, fill: C.ink, ls: '0.04em' });
        A.text(g, 152, 86, b, { font: 'body', size: 22, fill: C.ink2 });
        gsap.from(g, { opacity: 0, x: -14, duration: 0.4, delay: 0.2 + k * 0.3 });
      });
    }
  });

  P.push({
    type: 'try', title: 'Which warning?',
    html: `<p>The forecast average wind is shown. Which warning applies?</p>`,
    lockMsg: 'Answer all four',
    build(svg, S, api) {
      A.paperBg(svg);
      const gg = A.gauge(svg, { x: 400, y: 290, r: 180, max: 60, step: 5, label: 'KNOTS' });
      const t = A.text(svg, 400, 540, '', { size: 40, weight: 700, anchor: 'middle', fill: C.ink });
      rounds(api, S, {
        noun: 'Forecast',
        choices: ['Strong wind', 'Gale', 'Storm'],
        items: [
          { v: 40, a: 1, why: '34 to 47 knots: gale warning.' },
          { v: 28, a: 0, why: 'More than 25 and up to 33 knots: strong wind warning.' },
          { v: 52, a: 2, why: '48 knots or more: storm warning.' },
          { v: 33, a: 0, why: '33 knots is the top of the strong wind range.' }
        ],
        show(it) { gg.set(it.v, 0.8); t.textContent = it.v + ' knots'; },
        end: 'Strong wind 26–33, gale 34–47, storm 48+.'
      });
    }
  });

  P.push({
    type: 'learn', title: 'Cyclones and severe weather',
    html: `<p>The north-west of WA is one of the most cyclone-prone coasts in the world. <b>Cyclone season runs November to April</b>, with most coastal impacts from January to March.</p>
<p><b>No boat should be at sea within several hundred nautical miles of a cyclone.</b></p>
<p>In the south-west, from May to November, there are about 10 events a year with gusts up to 55 knots.</p>`,
    art(svg, S) {
      const bg = A.rect(svg, 0, 0, 800, 600, { fill: '#2A3F55' });
      const cyc = A.g(svg, { transform: 'translate(400,300)' });
      for (let k = 0; k < 4; k++) A.path(cyc, `M 0 0 C ${60 + k * 30} -20 ${120 + k * 40} 60 ${60 + k * 50} ${150 + k * 30}`, { fill: 'none', stroke: 'rgba(255,255,255,0.75)', 'stroke-width': 26 - k * 4, 'stroke-linecap': 'round', transform: `rotate(${k * 90})` });
      A.circle(cyc, 0, 0, 22, { fill: '#2A3F55', stroke: '#fff', 'stroke-width': 3 });
      gsap.to(cyc, { rotation: 360, svgOrigin: '400 300', duration: 12, repeat: -1, ease: 'none' });
      const M = ['N', 'D', 'J', 'F', 'M', 'A'];
      M.forEach((m, k) => {
        const x = 220 + k * 72;
        A.rect(svg, x - 28, 500, 56, 56, { rx: 10, fill: k >= 2 && k <= 4 ? C.port : C.orange });
        A.text(svg, x, 537, m, { size: 24, weight: 700, anchor: 'middle', fill: '#fff' });
      });
      A.text(svg, 400, 484, 'CYCLONE SEASON', { size: 18, weight: 700, anchor: 'middle', fill: '#fff', ls: '0.14em' });
    }
  });

  /* weather map */
  function synoptic(svg, o) {
    o = o || {};
    const g = A.g(svg);
    A.rect(g, 0, 0, 800, 600, { fill: '#F4F1E8' });
    const sys = (cx, cy, rs, label, cw) => {
      const sg = A.g(g);
      rs.forEach((r, k) => A.el('ellipse', { cx, cy, rx: r * 1.25, ry: r, fill: 'none', stroke: '#596470', 'stroke-width': 2.2 }, sg));
      A.text(sg, cx, cy + 16, label, { size: 48, weight: 700, anchor: 'middle', fill: label === 'L' ? C.port : C.sea4 });
      const flow = A.g(sg);
      const r = rs[1];
      for (let k = 0; k < 6; k++) {
        const a = k * 60 * Math.PI / 180;
        const x = cx + Math.cos(a) * r * 1.25, y = cy + Math.sin(a) * r;
        const dir = cw ? 1 : -1;
        const tx = -Math.sin(a) * 1.25 * dir, ty = Math.cos(a) * dir;
        const L = Math.hypot(tx, ty);
        A.arrow(flow, `M ${x - tx / L * 18} ${y - ty / L * 18} L ${x + tx / L * 18} ${y + ty / L * 18}`, { color: label === 'L' ? C.port : C.sea4, width: 4 });
      }
      gsap.to(flow, { rotation: cw ? 360 : -360, svgOrigin: `${cx} ${cy}`, duration: 16, repeat: -1, ease: 'none' });
      return sg;
    };
    if (o.L !== false) sys(o.lx || 230, o.ly || 300, o.lr || [40, 80, 120, 160], 'L', true);
    if (o.H !== false) sys(o.hx || 590, o.hy || 300, o.hr || [50, 110, 170], 'H', false);
    return g;
  }

  P.push({
    type: 'learn', title: 'Reading a weather map',
    html: `<p>A weather map, or <span class="term">synoptic chart</span>, shows lines of equal pressure called <span class="term">isobars</span>.</p>
<p>Wind flows almost parallel to the isobars. In the southern hemisphere it flows <b>clockwise around a low</b> and <b>anticlockwise around a high</b>.</p>
<p>The <b>closer together</b> the isobars, the <b>windier</b> it is.</p>`,
    art(svg, S) { synoptic(svg); A.tag(svg, 230, 70, 'LOW: CLOCKWISE', { fill: C.port, size: 17 }); A.tag(svg, 590, 70, 'HIGH: ANTICLOCKWISE', { fill: C.sea4, size: 17 }); }
  });

  P.push({
    type: 'try', title: 'Which way does it spin?',
    html: `<p>Which way does the wind flow around this system, in the southern hemisphere?</p>`,
    lockMsg: 'Answer all four',
    build(svg, S, api) {
      let m = null;
      rounds(api, S, {
        noun: 'System',
        choices: ['Clockwise', 'Anticlockwise'],
        items: [
          { k: 'L', a: 0, why: 'Lows spin clockwise in the southern hemisphere.' },
          { k: 'H', a: 1, why: 'Highs spin anticlockwise in the southern hemisphere.' },
          { k: 'H', a: 1, why: 'A high: anticlockwise.' },
          { k: 'L', a: 0, why: 'A low: clockwise.' }
        ],
        show(it, i) {
          if (m) m.remove();
          const x = 300 + (i % 2) * 200;
          m = synoptic(svg, it.k === 'L' ? { H: false, lx: x, lr: [50, 100, 150, 200] } : { L: false, hx: x, hr: [60, 130, 200] });
          m.querySelectorAll('.arrow').forEach(a => a.style.display = 'none');
          gsap.from(m, { opacity: 0, duration: 0.3 });
        },
        end: 'Low clockwise, high anticlockwise. Down here, anyway.'
      });
    }
  });

  P.push({
    type: 'check', title: 'Close isobars',
    q: 'On a weather map, the isobars are packed very close together over your area. What does that mean?',
    opts: ['Strong winds are likely', 'Calm, still conditions', 'A large tide is coming', 'Rain but very little wind'], a: 0,
    why: 'The closer the isobars, the windier it will be.'
  });

  P.push({
    type: 'learn', title: 'Wind makes waves',
    html: `<p>Wave height depends on <b>wind speed</b>, how <b>long</b> it blows, and how far it blows over open water, the <span class="term">fetch</span>.</p>
<ul><li>Wind off the land has a short fetch: smaller, but steep and close-together waves near shore.</li><li>White caps appearing means the wind is around <b>15 knots</b>. A 15 knot wind typically builds a sea of about 1.5 m.</li><li>The forecast wave height is the <b>average</b>. The odd wave can be <b>twice as high</b>.</li></ul>`,
    art(svg, S) {
      sky(svg, '#DCE9EC', '#EEF2EC');
      A.rect(svg, 0, 300, 800, 300, { fill: '#7FB2C4' });
      A.path(svg, 'M 0 300 L 0 230 Q 60 210 120 240 L 120 300 Z', { fill: C.land });
      const waves = A.g(svg);
      for (let k = 0; k < 9; k++) {
        const x = 150 + k * 72, h = 6 + k * 5;
        const w = A.path(waves, `M ${x - 36} 300 Q ${x} ${300 - h * 2} ${x + 36} 300`, { fill: '#5F98AA' });
        if (k > 4) { const c = A.path(waves, `M ${x - 10} ${300 - h} q 10 -8 20 0`, { fill: 'none', stroke: '#fff', 'stroke-width': 4, 'stroke-linecap': 'round' }); gsap.to(c, { opacity: 0.2, duration: 0.6, yoyo: true, repeat: -1, delay: k * 0.1 }); }
      }
      gsap.to(waves, { x: -12, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      A.arrow(svg, 'M 140 160 L 740 160', { color: C.ink, width: 4 });
      A.tag(svg, 440, 130, 'FETCH: DISTANCE THE WIND BLOWS OVER WATER', { fill: C.ink, size: 15 });
      A.tag(svg, 640, 230, 'WHITE CAPS ≈ 15 kn', { fill: C.white, color: C.ink, size: 15 });
    }
  });

  P.push({
    type: 'learn', title: 'Fronts, sea breezes and swell',
    html: `<ul><li>A <b>cold front</b> is drawn as a bold line with spikes. Expect squalls and rain as it passes, then showers. The wind often swings from <b>north-west to south-west</b> and gets stronger.</li><li>A <b>sea breeze</b> comes from the land heating up during the day. On the west coast it blows from the <b>south-west</b>.</li><li><span class="term">Swell</span> is made by winds far away. The longer the <b>swell period</b> (seconds between crests), the more energy it carries. Our south and west coasts often get 2–3 m swells.</li></ul>`,
    art(svg, S) {
      A.rect(svg, 0, 0, 800, 600, { fill: '#F4F1E8' });
      const fr = A.g(svg);
      A.path(fr, 'M 520 40 C 420 180 400 320 300 560', { fill: 'none', stroke: C.sea4, 'stroke-width': 6 });
      const P0 = A.path(fr, 'M 520 40 C 420 180 400 320 300 560', { fill: 'none' });
      const L = P0.getTotalLength();
      for (let s = 30; s < L; s += 60) { const p = P0.getPointAtLength(s), q = P0.getPointAtLength(s + 4); const a = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI; A.path(fr, 'M -14 0 L 14 0 L 0 -22 Z', { fill: C.sea4, transform: `translate(${p.x},${p.y}) rotate(${a + 180})` }); }
      gsap.fromTo(fr, { x: -60, opacity: 1 }, { x: 140, duration: 7, repeat: -1, ease: 'none' });
      A.arrow(svg, 'M 560 170 L 660 270', { color: C.ink, width: 5 });
      A.tag(svg, 690, 300, 'NW AHEAD', { fill: C.ink, size: 15 });
      A.arrow(svg, 'M 200 200 L 300 120', { color: C.ink, width: 5 });
      A.tag(svg, 170, 230, 'SW BEHIND', { fill: C.ink, size: 15 });
      A.tag(svg, 400, 560, 'COLD FRONT MOVING EAST', { fill: C.sea4, size: 16 });
    }
  });

  P.push({
    type: 'learn', title: 'Watch the sky',
    html: `<p>Forecasts tell you what to expect. Your own eyes can confirm it, or warn you of something worse. Watch for:</p>
<ul><li>a drop in temperature</li><li>a rising swell</li><li>solid cloud building</li><li>a falling barometer</li><li>a change in the wind.</li></ul>
<p>Almost any change can mean bad weather is on the way.</p>`,
    art(svg, S) {
      const bg = A.rect(svg, 0, 0, 800, 600, { fill: '#CFE2EA' });
      const cl = A.g(svg);
      for (let k = 0; k < 6; k++) A.el('ellipse', { cx: 900 + k * 90, cy: 120 + (k % 2) * 30, rx: 140, ry: 60, fill: '#4E6274' }, cl);
      A.rect(svg, 0, 340, 800, 260, { fill: '#7FB2C4' });
      const b = A.boatSide(svg, { len: 200, x: 300, y: 380, color: C.port });
      const ws = A.waterSide(svg, 384, { amp: 4 });
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
      tl.to(cl, { x: -900, duration: 5, ease: 'power1.inOut' });
      tl.to(bg, { attr: { fill: '#71859A' }, duration: 5 }, 0);
      tl.to(b, { rotation: 6, svgOrigin: '300 380', duration: 0.6, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 2.4);
      tl.to({}, { duration: 1.5 });
      tl.to(cl, { x: 0, duration: 0.01 });
      tl.to(bg, { attr: { fill: '#CFE2EA' }, duration: 0.01 }, '<');
      const baro = A.gauge(svg, { x: 650, y: 470, r: 90, max: 40, step: 5, label: 'PRESSURE' });
      baro.set(30, 0);
      gsap.timeline({ repeat: -1, repeatDelay: 1.5 }).add(baro.set(12, 5)).add(baro.set(30, 0.01), '+=1.5');
    }
  });

  P.push({
    type: 'learn', title: 'Coping with the weather',
    html: `<ul><li>Have a back-up plan, such as staying inside the river, reefs or islands.</li><li>Keep listening for forecast updates on the radio.</li><li>Trim the boat for the sea. Generally, <b>bow down a little into a head sea</b>, and <b>bow up in a following sea</b>.</li><li>Slowing down or a small course change can make the ride much softer.</li><li>If conditions get worse, put lifejackets on.</li><li>In poor visibility, slow down and keep an even better lookout.</li></ul>`,
    art(svg, S) {
      sky(svg, '#BFD0DA', '#E3EAEC');
      const a = A.g(svg), b = A.g(svg);
      A.boatSide(a, { len: 220, x: 210, y: 330, color: C.sea4 });
      A.boatSide(b, { len: 220, x: 590, y: 330, color: C.sea4 });
      gsap.set(a, { rotation: 4, svgOrigin: '210 330' });
      gsap.set(b, { rotation: -6, svgOrigin: '590 330' });
      A.waterSide(svg, 334, { amp: 14, wl: 140, speed: 2 });
      A.arrow(svg, 'M 380 220 L 320 220', { color: C.ink, width: 4 });
      A.tag(svg, 210, 450, 'HEAD SEA: BOW DOWN A LITTLE', { fill: C.ink, size: 15 });
      A.arrow(svg, 'M 420 220 L 480 220', { color: C.ink, width: 4 });
      A.tag(svg, 590, 450, 'FOLLOWING SEA: BOW UP', { fill: C.ink, size: 15 });
      A.text(svg, 400, 200, 'WAVES', { size: 15, weight: 700, anchor: 'middle', fill: C.ink2, ls: '0.14em' });
    }
  });

  P.push({
    type: 'learn', title: 'Tides and chart datum',
    html: `<p>In the north-west, tides are big: they can make ramps unusable at times, and tidal streams can reach <b>10 knots</b> in the Kimberley. Take tide predictions with you.</p>
<p>Chart depths are measured from <span class="term">chart datum</span>, about the lowest the tide normally falls.</p>
<p><b>Total depth = charted depth + height of tide.</b></p>`,
    art(svg, S) {
      sky(svg, '#DCE9EC', '#EEF2EC');
      const sea = A.rect(svg, 0, 260, 800, 340, { fill: '#7FB2C4' });
      A.path(svg, 'M 0 600 L 0 470 Q 200 440 400 470 T 800 450 L 800 600 Z', { fill: C.sand });
      A.line(svg, 0, 330, 800, 330, { stroke: C.ink, 'stroke-width': 2.5, 'stroke-dasharray': '10 8' });
      A.tag(svg, 120, 330, 'CHART DATUM', { fill: C.ink, size: 14 });
      const x = 520;
      A.line(svg, x, 330, x, 465, { stroke: C.port, 'stroke-width': 4 });
      A.text(svg, x + 12, 405, 'Charted 1.2 m', { size: 20, weight: 700, fill: C.port });
      const tideL = A.line(svg, x - 40, 260, x - 40, 330, { stroke: C.sea4, 'stroke-width': 4 });
      const tideT = A.text(svg, x - 52, 300, 'Tide 0.8 m', { size: 20, weight: 700, fill: C.deep, anchor: 'end' });
      A.tag(svg, 400, 90, 'TOTAL DEPTH = 1.2 + 0.8 = 2.0 m', { fill: C.ink, size: 20 });
      const st = { y: 260 };
      gsap.to(st, { y: 300, duration: 2.5, yoyo: true, repeat: -1, ease: 'sine.inOut', onUpdate() { sea.setAttribute('y', st.y); sea.setAttribute('height', 600 - st.y); tideL.setAttribute('y1', st.y); } });
    }
  });

  P.push({
    type: 'try', title: 'How deep is it?',
    html: `<p>Work out the total depth of water.</p>`,
    lockMsg: 'Answer all three',
    build(svg, S, api) {
      A.paperBg(svg);
      let card = null;
      rounds(api, S, {
        noun: 'Question',
        choices: ['0.5 m', '1.5 m', '2.3 m', '3.1 m'],
        items: [
          { t: 'The chart shows 1.0 m. The tide height is 1.3 m.', a: 2, why: '1.0 + 1.3 = 2.3 m.' },
          { t: 'The chart shows 2.5 m. The tide height is 0.6 m.', a: 3, why: '2.5 + 0.6 = 3.1 m.' },
          { t: 'The chart shows 0.2 m. The tide height is 0.3 m.', a: 0, why: '0.2 + 0.3 = 0.5 m. Too shallow for most boats!' }
        ],
        show(it) { if (card) card.remove(); card = scard(svg, it.t, 200, 32); },
        end: 'Add the tide height to the charted depth.'
      });
    }
  });

  P.push({
    type: 'learn', title: 'Weather moves the tide',
    html: `<p>Strong winds and air pressure can make the real tide differ from the prediction.</p>
<ul><li><b>Low pressure</b> tends to <b>raise</b> sea level. <b>High pressure</b> tends to <b>lower</b> it.</li><li>Wind generally piles water up in the direction it blows.</li></ul>`,
    art(svg, S) {
      sky(svg, '#DCE9EC', '#EEF2EC');
      const w = A.path(svg, '', { fill: '#7FB2C4' });
      const st = { t: 0 };
      gsap.to(st, { t: 1, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      const lo = A.tag(svg, 200, 120, 'LOW PRESSURE: SEA RISES', { fill: C.port, size: 16 });
      const hi = A.tag(svg, 600, 120, 'HIGH PRESSURE: SEA FALLS', { fill: C.sea4, size: 16 });
      A.line(svg, 0, 330, 800, 330, { stroke: C.ink, 'stroke-width': 2, 'stroke-dasharray': '8 8' });
      A.text(svg, 790, 320, 'predicted', { font: 'body', size: 15, anchor: 'end', fill: C.ink2 });
      S.loop(() => { const d = 26 * st.t; w.setAttribute('d', `M 0 ${330 - d} C 200 ${330 - d} 300 330 400 330 C 500 330 600 ${330 + d} 800 ${330 + d} L 800 600 L 0 600 Z`); });
      A.text(svg, 200, 240, 'L', { size: 60, weight: 700, anchor: 'middle', fill: C.port });
      A.text(svg, 600, 240, 'H', { size: 60, weight: 700, anchor: 'middle', fill: C.sea4 });
    }
  });

  /* ---------- workbook self-test ---------- */
  const R = (n, q, opts, a, why) => P.push({ type: 'review', n, of: 9, title: 'Workbook self-test', q, opts, a, why });
  R(1, 'As part of your trip plan you should ensure', ['Your vessel is suitable for the trip.', 'The weather and tides are favourable.', 'That all your safety gear and extras are on board, in good shape and in reach.', 'All the above.'], 3, 'All of these are part of a good trip plan.');
  R(2, 'The recommended additional fuel to carry for a boating trip is', ['10 % more fuel than you expect to use.', '20 % more fuel than you expect to use.', '50 % more fuel than you expect to use.', '100 % more fuel than you expect to use.'], 2, '25% out, 25% back, 50% reserve: 50% more than you expect to use.');
  R(3, 'Which is the most up-to-date weather forecast available?', ['Bureau of Meteorology.', 'The newspaper.', 'Last night’s television news.', 'AM/FM radio.'], 0, 'The Bureau of Meteorology website has the most current forecasts.');
  R(4, 'Which of the following wind warnings indicates that the average wind speed is expected to be 25 to 33 knots?', ['Strong wind warning.', 'Gale warning.', 'Storm warning.', 'Sea breeze.'], 0, 'Strong wind warning: more than 25 and up to 33 knots.');
  R(5, 'When about to undertake a recreational boating trip, on what occasion is it advisable to inform relatives, friends or local authorities of your travel plans and estimated time of arrival at destination or return?', ['Whenever bad weather is forecast.', 'If travelling overnight.', 'On every occasion.', 'When you go boating alone.'], 2, 'Tell someone responsible every time, and log on and off.');
  R(6, 'When loading your vessel with passengers and equipment for a day’s outing, you should:', ['Distribute the load evenly in the vessel.', 'Ensure adequate freeboard for the prevailing weather conditions and unexpected deterioration in weather conditions.', 'Restrict passengers to the recommended limit.', 'All of the above.'], 3, 'All of these keep a loaded boat safe.');
  R(7, 'If a vessel is full of water and it has basic flotation it will', ['Sink straight away.', 'Have enough flotation to prevent the vessel and its maximum load from sinking.', 'Take three hours to sink.', 'Stay well above the water.'], 1, 'Basic flotation stops the boat and its maximum load sinking, but it may float at any angle.');
  R(8, 'A low pressure system rotates in which direction?', ['Clockwise.', 'Anti-clockwise.', 'Always north.', 'Vertically.'], 0, 'In the southern hemisphere, wind flows clockwise around a low.');
  R(9, 'Which of the following may be signs of bad weather?', ['Wind shifts.', 'Increases in swell.', 'Cloud build-up.', 'All of the above.'], 3, 'Almost any change can mean bad weather is coming.');

  SR.chapter({
    id: 8,
    title: 'Safe Operations',
    intro: 'Trip planning, fuel, stability and loading, flotation, passengers, navigation aids, weather and tides.',
    cover(svg, S) {
      synoptic(svg, { lx: 250, hx: 600 });
      gsap.from(svg.lastChild, { opacity: 0, duration: 0.8 });
    },
    pages: P
  });
})();
