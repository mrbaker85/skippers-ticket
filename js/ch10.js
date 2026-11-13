/* Chapter 10: Practical Assessment */
(function () {
  const A = SR.art, C = A.C;
  const { sky, caption, rounds, spot, order, wrap, outboard } = SR.share;
  const { lifejacket, radio } = SR._ch7.gear;
  const P = [];
  const D2R = Math.PI / 180;

  /* ---------- helpers ---------- */
  /* top-down wharf along the top of the stage; bottom edge at y = 190 */
  function wharf(svg, bollards) {
    A.jetty(svg, -20, 70, 840, 120);
    (bollards || []).forEach(x => bollard(svg, x, 168));
  }
  function bollard(parent, x, y) {
    A.circle(parent, x + 1.5, y + 2.5, 9, { fill: 'rgba(18,38,58,0.25)' });
    A.circle(parent, x, y, 9, { fill: '#2A3642' });
    A.circle(parent, x, y, 4.5, { fill: '#55626F' });
  }
  function cleat(parent, x, y, r) {
    const g = A.g(parent, { transform: `translate(${x},${y}) rotate(${r || 0})` });
    A.rect(g, -15, -4, 30, 8, { rx: 4, fill: '#2A3642' });
    A.rect(g, -4, -7, 8, 14, { rx: 3, fill: '#2A3642' });
    return g;
  }
  function rope(parent, d, o) {
    o = o || {};
    const g = A.g(parent, { class: 'rope' });
    A.path(g, d, { fill: 'none', stroke: '#6B5A3E', 'stroke-width': (o.w || 4) + 2.5, 'stroke-linecap': 'round' });
    const p = A.path(g, d, { fill: 'none', stroke: o.color || '#EADFC4', 'stroke-width': o.w || 4, 'stroke-linecap': 'round' });
    g.p = p;
    return g;
  }
  function fender(parent, x, y) {
    const g = A.g(parent);
    A.rect(g, x - 15, y - 6, 30, 12, { rx: 6, fill: '#2F6F86', stroke: C.ink, 'stroke-width': 1.5 });
    A.rect(g, x - 9, y - 6, 4, 12, { fill: 'rgba(255,255,255,0.35)' });
    return g;
  }
  /* world point of a boat-local point */
  function wp(b, lx, ly) {
    const a = b.rotation * D2R;
    return [b.x + lx * Math.cos(a) - ly * Math.sin(a), b.y + lx * Math.sin(a) + ly * Math.cos(a)];
  }
  /* helm and gear readout */
  function hud(svg, x, y) {
    const g = A.g(svg, { transform: `translate(${x},${y})` });
    A.rect(g, 3, 5, 240, 104, { rx: 16, fill: 'rgba(18,38,58,0.22)' });
    A.rect(g, 0, 0, 240, 104, { rx: 16, fill: C.white, stroke: C.ink, 'stroke-width': 2 });
    A.text(g, 52, 22, 'WHEEL', { size: 13, weight: 700, anchor: 'middle', fill: C.ink3, ls: '0.14em' });
    A.text(g, 162, 22, 'GEAR', { size: 13, weight: 700, anchor: 'middle', fill: C.ink3, ls: '0.14em' });
    const wo = A.g(g, { transform: 'translate(52,62)' });
    const wi = A.g(wo);
    A.circle(wi, 0, 0, 28, { fill: 'none', stroke: C.ink, 'stroke-width': 6 });
    [0, 120, 240].forEach(a => A.path(wi, 'M 0 0 L 0 -25', { stroke: C.ink, 'stroke-width': 4, transform: `rotate(${a})` }));
    A.circle(wi, 0, 0, 7, { fill: C.ink });
    A.rect(wi, -4, -33, 8, 11, { rx: 3, fill: C.port });
    const hl = A.rect(g, 99, 40, 40, 44, { rx: 10, fill: C.ink });
    const ts = ['F', 'N', 'R'].map((t, k) => A.text(g, 119 + k * 44, 71, t, { size: 26, weight: 700, anchor: 'middle', fill: C.ink }));
    const off = A.tag(g, 162, 62, 'ENGINE OFF', { fill: C.port, size: 15 });
    off.style.opacity = 0;
    const st = { d: 0 };
    const paint = k => {
      hl.style.opacity = k < 0 ? 0 : 1;
      off.style.opacity = k < 0 ? 1 : 0;
      ts.forEach((t, j) => { t.setAttribute('fill', j === k ? C.white : C.ink); t.style.opacity = k < 0 ? 0 : 1; });
      if (k >= 0) gsap.to(hl, { attr: { x: 99 + k * 44 }, duration: 0.25, ease: 'power2.out' });
    };
    paint(1);
    return {
      g,
      wheel(tl, at, deg) { tl.to(st, { d: deg, duration: 0.6, ease: 'power2.inOut', onUpdate: () => wi.setAttribute('transform', `rotate(${st.d.toFixed(1)})`) }, at); },
      gear(tl, at, k) { tl.call(paint, [k], at); },
      reset() { st.d = 0; wi.setAttribute('transform', ''); paint(1); }
    };
  }
  const card = (parent, x, y, w, h) => { A.rect(parent, x + 4, y + 6, w, h, { rx: 18, fill: 'rgba(18,38,58,0.14)' }); return A.rect(parent, x, y, w, h, { rx: 18, fill: C.white, stroke: C.line, 'stroke-width': 1.5 }); };

  /* ---------- 1. How it works ---------- */
  const TASKS = ['Rules and safety', 'Mooring lines', 'Safety briefing', 'Pre-start checks', 'Voyage plan', 'Leave the berth', 'Man overboard', 'Use a transit', 'Controlled stop', 'Berth the boat', 'Log off'];
  P.push({
    type: 'learn', title: 'The practical assessment',
    html: `<p>Once you pass the theory test, an assessor takes you out on the water for the <b>practical assessment</b>.</p>
<ul><li>It takes about <b>30 minutes</b> and runs as one continuous trip.</li><li>There are <b>11 tasks</b>, marked against <b>62 criteria</b>.</li><li>You pass with at least <b>56 criteria</b>, so six or fewer can be wrong.</li><li>Skippering <b>unsafely</b> at any point is an immediate fail.</li></ul>
<p>This chapter walks through each task, so you know exactly what the assessor wants to see.</p>`,
    art(svg, S) {
      A.paperBg(svg);
      const g = A.g(svg);
      A.rect(g, 236, 34, 340, 540, { rx: 18, fill: 'rgba(18,38,58,0.16)' });
      A.rect(g, 228, 26, 340, 540, { rx: 18, fill: '#B68E62', stroke: '#7A5A39', 'stroke-width': 2 });
      A.rect(g, 248, 60, 300, 488, { rx: 6, fill: C.white });
      A.rect(g, 338, 14, 120, 40, { rx: 10, fill: '#8796A3', stroke: C.ink, 'stroke-width': 2 });
      A.text(g, 398, 100, 'PRACTICAL ASSESSMENT', { size: 20, weight: 700, anchor: 'middle', fill: C.port, ls: '0.1em' });
      TASKS.forEach((t, k) => {
        const y = 140 + k * 36;
        A.rect(g, 270, y - 18, 24, 24, { rx: 5, fill: 'none', stroke: C.ink2, 'stroke-width': 2 });
        A.text(g, 306, y + 1, `${k + 1}. ${t}`, { font: 'body', size: 18, fill: C.ink });
        const tk = A.path(g, `M 274 ${y - 7} L 281 ${y} L 293 ${y - 16}`, { fill: 'none', stroke: C.stbd, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
        gsap.from(tk, { drawSVG: 0, duration: 0.3, delay: 0.5 + k * 0.18 });
      });
      const badge = A.g(svg, { transform: 'translate(640,460)' });
      A.circle(badge, 3, 5, 78, { fill: 'rgba(18,38,58,0.18)' });
      A.circle(badge, 0, 0, 78, { fill: C.ink });
      A.text(badge, 0, 6, '56/62', { size: 40, weight: 700, anchor: 'middle', fill: C.white });
      A.text(badge, 0, 34, 'TO PASS', { size: 15, weight: 700, anchor: 'middle', fill: C.buoy, ls: '0.16em' });
      gsap.from(badge, { scale: 0.5, opacity: 0, svgOrigin: '640 460', duration: 0.6, delay: 2.6, ease: 'back.out(2)' });
    }
  });

  P.push({
    type: 'learn', title: 'On the day',
    html: `<p>A few things that help:</p>
<ul><li>The assessor can <b>repeat</b> an instruction, but can't coach you.</li><li>If the assessor writes notes, it doesn't mean you've made a mistake.</li><li>If you have trouble with <b>language or hearing</b>, tell the assessor before you start.</li><li>You can use the assessor's boat or your own <b>registered</b> boat. Extra crew can come along.</li></ul>`,
    art(svg, S) {
      sky(svg);
      A.waterSide(svg, 420, { amp: 6 });
      const b = A.boatSide(svg, { len: 470, x: 400, y: 430, color: C.sea4 });
      const h = b._h;
      const me = A.person(b.crew, { x: -40, y: -h * 0.78, s: 0.95, side: true, vest: true, fwdR: 70 });
      const as = A.person(b.crew, { x: -150, y: -h * 0.78, s: 0.95, side: true, vest: C.buoy, fwdR: 55 });
      const clip = A.g(b.crew, { transform: `translate(-120,${-h * 0.78 - 62}) rotate(-12)` });
      A.rect(clip, 0, 0, 26, 34, { rx: 3, fill: '#B68E62', stroke: '#7A5A39', 'stroke-width': 1.5 });
      A.rect(clip, 4, 6, 18, 24, { fill: C.white });
      A.waterSide(svg, 440, { amp: 4, opacity: 0.55 });
      gsap.to(b, { y: '+=5', rotation: 1, svgOrigin: '400 430', duration: 2.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      const t1 = A.tag(svg, 240, 250, 'ASSESSOR', { fill: C.buoy, color: C.ink, size: 16 });
      const t2 = A.tag(svg, 380, 250, 'YOU', { fill: C.port, size: 16 });
      [t1, t2].forEach((t, k) => gsap.from(t, { opacity: 0, y: '-=10', duration: 0.5, delay: 0.4 + k * 0.3 }));
      const sp = A.g(svg, { transform: 'translate(70,40)' });
      A.rect(sp, 0, 0, 380, 64, { rx: 18, fill: C.white, stroke: C.line, 'stroke-width': 1.5 });
      A.path(sp, 'M 170 62 L 186 88 L 200 62 Z', { fill: C.white });
      A.text(sp, 190, 40, '“Head for the jetty, please.”', { font: 'body', size: 21, anchor: 'middle', fill: C.ink, italic: true });
      gsap.from(sp, { opacity: 0, y: 10, duration: 0.5, delay: 1.2 });
    }
  });

  /* ---------- Task 1 ---------- */
  P.push({
    type: 'learn', title: 'Task 1: Operate within the rules',
    html: `<p>Task 1 is marked <b>the whole time</b> you're on the water. The assessor watches that you:</p>
<ul><li><b>Keep your impact low:</b> no wash, noise or rubbish, and leave wildlife alone. Store waste on board.</li><li><b>Follow the rules:</b> keep a lookout, keep to starboard in channels, pass port to port, obey speed limits.</li><li><b>Have the boat and gear in good order,</b> with a current rego label.</li><li><b>Keep watching safety:</b> depth, sea state, water coming aboard, and passengers seated to keep the boat level. No hands on the gunwale when berthing.</li></ul>`,
    art(svg, S) {
      A.paperBg(svg);
      const tiles = [[60, 50, 'LOW IMPACT'], [420, 50, 'FOLLOW THE RULES'], [60, 320, 'GEAR IN ORDER'], [420, 320, 'WATCH SAFETY']];
      tiles.forEach(([x, y, t], k) => {
        const g = A.g(svg);
        card(g, x, y, 320, 230);
        A.text(g, x + 160, y + 206, t, { size: 19, weight: 700, anchor: 'middle', fill: C.ink, ls: '0.1em' });
        if (k === 0) {
          [0, 1, 2].forEach(j => {
            const p = A.path(g, `M ${x + 60} ${y + 70 + j * 34} q 25 -14 50 0 t 50 0 t 50 0 t 50 0`, { fill: 'none', stroke: C.sea3, 'stroke-width': 6, 'stroke-linecap': 'round' });
            gsap.fromTo(p, { x: 0 }, { x: -50, duration: 2.4, repeat: -1, ease: 'none' });
          });
          A.rect(g, x + 40, y + 50, 16, 110, { fill: C.white });
          A.rect(g, x + 264, y + 50, 16, 110, { fill: C.white });
        }
        if (k === 1) A.speedSign(g, x + 160, y + 98, 70, '8');
        if (k === 2) lifejacket(g, x + 160, y + 104, 0.85, '100');
        if (k === 3) {
          A.rect(g, x + 80, y + 36, 160, 120, { rx: 12, fill: '#1B232C' });
          A.rect(g, x + 94, y + 50, 132, 92, { rx: 6, fill: '#2C5E6E' });
          A.text(g, x + 160, y + 72, 'DEPTH', { size: 14, weight: 700, anchor: 'middle', fill: '#A9D7B8', ls: '0.14em' });
          const d = A.text(g, x + 160, y + 124, '4.2 m', { size: 40, weight: 700, anchor: 'middle', fill: '#E9F6FA' });
          const st = { v: 4.2 };
          gsap.to(st, { v: 2.6, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut', onUpdate: () => d.textContent = st.v.toFixed(1) + ' m' });
        }
        gsap.from(g, { opacity: 0, y: 14, duration: 0.5, delay: 0.2 + k * 0.18 });
      });
    }
  });

  P.push({
    type: 'try', title: 'Good practice or lost marks?',
    html: `<p>The assessor is watching all trip. Decide whether each one is good practice or would lose you marks.</p>`,
    lockMsg: 'Sort all six',
    build(svg, S, api) {
      A.paperBg(svg);
      const g = A.g(svg);
      card(g, 80, 110, 640, 380);
      const big = A.g(g);
      const items = [
        { t: 'Slowing down so your wash doesn’t rock the moored boats', a: 0, why: 'Good practice. Keeping your wash down is part of low impact.', bad: 'This is exactly what the assessor wants: low wash near moored boats.' },
        { t: 'Throwing bait bags over the side on the way back', a: 1, why: 'Lost marks. Store your rubbish on board and take it home.', bad: 'Rubbish over the side is pollution. Store it on board.' },
        { t: 'Keeping to the starboard side of the channel', a: 0, why: 'Good practice. Keep to starboard in a channel.', bad: 'That’s the rule: keep to the starboard side of a channel.' },
        { t: 'A passenger fending off the jetty with a hand on the gunwale', a: 1, why: 'Lost marks. Hands on the gunwale can be crushed when berthing.', bad: 'Fingers on the gunwale can be crushed against the jetty.' },
        { t: 'A registration label that ran out last month', a: 1, why: 'Lost marks. The rego label must be current.', bad: 'The boat must have a current registration label.' },
        { t: 'Seating passengers so the boat sits level', a: 0, why: 'Good practice. Seating passengers for trim keeps the boat safe.', bad: 'Seating people to keep the boat level is good seamanship.' }
      ];
      rounds(api, S, {
        items, choices: ['Good practice', 'Lost marks'], noun: 'Situation',
        show(it) {
          big.innerHTML = '';
          const ls = wrap(it.t, 30);
          ls.forEach((l, k) => A.text(big, 400, 300 - (ls.length - 1) * 22 + k * 44, l, { font: 'body', size: 30, weight: 700, anchor: 'middle', fill: C.ink }));
          gsap.from(big, { opacity: 0, y: 10, duration: 0.35 });
        },
        right(it) { const t = A.tick(big, 400, 180, 26, it.a === 0); gsap.from(t, { scale: 0, svgOrigin: '400 180', duration: 0.35, ease: 'back.out(2)' }); },
        end: 'The assessor marks Task 1 the whole way through, so these habits count from start to finish.'
      });
    }
  });

  /* ---------- Task 2 ---------- */
  function alongside(svg, S, faulty) {
    S.seaBg(svg);
    wharf(svg, []);
    const b = S.boat(svg, { len: 300, color: C.sea4, x: 400, y: 258, r: faulty ? 3 : 0, wake: false });
    const L = A.g(svg);
    const jc1 = [630, 160], jc2 = [170, 160];
    cleat(L, jc1[0], jc1[1]); cleat(L, jc2[0], jc2[1]);
    const bc = wp(b, 100, -30), sc = wp(b, -128, -40);
    cleat(L, bc[0], bc[1], b.rotation); cleat(L, sc[0], sc[1], b.rotation);
    rope(L, `M ${bc[0]} ${bc[1]} Q ${(bc[0] + jc1[0]) / 2 + 6} ${(bc[1] + jc1[1]) / 2 + 10} ${jc1[0]} ${jc1[1]}`);
    if (!faulty) {
      rope(L, `M ${sc[0]} ${sc[1]} Q ${(sc[0] + jc2[0]) / 2 - 6} ${(sc[1] + jc2[1]) / 2 + 10} ${jc2[0]} ${jc2[1]}`);
      [wp(b, -70, -63), wp(b, 50, -63)].forEach(p => fender(L, p[0], p[1]));
    } else {
      rope(L, `M ${sc[0]} ${sc[1]} Q 236 196 214 150 Q 206 128 226 122`);
      A.circle(L, 222, 128, 14, { fill: 'none', stroke: '#6B5A3E', 'stroke-width': 6.5 });
      A.circle(L, 222, 128, 14, { fill: 'none', stroke: '#EADFC4', 'stroke-width': 4 });
      A.circle(L, 222, 128, 7, { fill: 'none', stroke: '#EADFC4', 'stroke-width': 3 });
      [wp(b, 0, -63), wp(b, 90, -61)].forEach(p => fender(L, p[0], p[1]));
      // chafe on the bow line where it crosses the edge
      const cx = 566, cy = 190;
      for (let k = 0; k < 7; k++) A.path(L, `M ${cx - 6 + k * 2} ${cy - 4} l ${-6 + k * 2} ${k % 2 ? 9 : -9}`, { stroke: '#EADFC4', 'stroke-width': 1.6, 'stroke-linecap': 'round' });
      // scrape marks
      for (let k = 0; k < 4; k++) A.path(L, `M ${238 + k * 9} 186 l 12 -10`, { stroke: '#FFFDF8', 'stroke-width': 2, opacity: 0.8 });
    }
    return b;
  }
  P.push({
    type: 'learn', title: 'Task 2: Mooring lines',
    html: `<p>Before you leave, show the assessor you can check and use the mooring gear:</p>
<ul><li><b>Check the mooring lines</b> for chafe and wear, including splices.</li><li><b>Check the berthing gear:</b> fenders, cleats, and on pens or moorings the shackles and hardware too.</li><li><b>Secure the boat</b> with lines and cleats.</li></ul>
<p class="note">One bow line is enough to show you can secure the boat.</p>`,
    art(svg, S) {
      alongside(svg, S, false);
      const t = [[630, 236, 'BOW LINE'], [400, 330, 'FENDERS'], [630, 122, 'CLEAT']];
      t.forEach(([x, y, s], k) => { const g = A.tag(svg, x, y, s, { fill: C.ink, size: 16 }); gsap.from(g, { opacity: 0, y: '+=8', duration: 0.4, delay: 0.4 + k * 0.3 }); });
    }
  });
  P.push({
    type: 'try', title: 'Check the lines',
    html: `<p>Something isn’t right with how this boat is tied up. Tap the <b>three</b> problems.</p>`,
    lockMsg: 'Find all three',
    build(svg, S, api) {
      alongside(svg, S, true);
      spot(api, S, svg, {
        spots: [
          { x: 566, y: 190, r: 46, why: '<b>Chafed bow line.</b> It’s rubbing on the edge of the jetty. Replace it or protect it.' },
          { x: 252, y: 192, r: 46, why: '<b>No fender at the stern.</b> The hull is grinding on the jetty.' },
          { x: 222, y: 130, r: 46, why: '<b>Stern line not made fast.</b> It’s lying on the jetty, not tied to a cleat.' }
        ],
        miss: 'That part looks fine. Look at the lines, the cleats and the fenders.',
        end: 'Check lines, fenders and cleats before every trip.'
      });
    }
  });

  /* ---------- Task 3 ---------- */
  function briefBoat(svg, S) {
    S.seaBg(svg);
    const b = S.boat(svg, { len: 520, color: C.sea4, x: 400, y: 300, wake: false });
    gsap.to(b, { rotation: 1.2, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    return b;
  }
  P.push({
    type: 'learn', title: 'Task 3: Safety briefing',
    html: `<p>Before you head out, brief your passengers. You must:</p>
<ul><li>Tell them what <b>types of safety gear</b> are on board.</li><li>Show <b>where</b> each item is kept.</li><li>Explain <b>when lifejackets must be worn</b>.</li><li>Check, out loud, that everyone has <b>understood</b>.</li></ul>
<p>Keep it short and clear, like a cabin crew briefing.</p>`,
    art(svg, S) {
      briefBoat(svg, S);
      const pts = [[240, 300, 160, 140, 'LIFEJACKETS'], [400, 300, 400, 120, 'FLARES + EPIRB'], [380, 340, 300, 470, 'EXTINGUISHER'], [580, 300, 620, 470, 'ANCHOR + BAILER']];
      pts.forEach(([x, y, tx, ty, s], k) => {
        const g = A.g(svg);
        A.line(g, x, y, tx, ty, { stroke: C.ink, 'stroke-width': 2.5, 'stroke-dasharray': '5 5' });
        A.circle(g, x, y, 9, { fill: C.buoy, stroke: C.ink, 'stroke-width': 2.5 });
        A.tag(g, tx, ty, s, { fill: C.ink, size: 16 });
        gsap.from(g, { opacity: 0, duration: 0.5, delay: 0.3 + k * 0.35 });
      });
    }
  });
  P.push({
    type: 'try', title: 'Give the briefing',
    html: `<p>Put the four parts of the briefing in order. Tap the first one.</p>`,
    lockMsg: 'Finish the briefing',
    build(svg, S, api) {
      briefBoat(svg, S);
      const layers = [0, 1, 2, 3].map(() => A.g(svg, { opacity: 0 }));
      [['LIFEJACKETS', 160, 130], ['FLARES + EPIRB', 400, 110], ['EXTINGUISHER', 290, 480], ['ANCHOR + BAILER', 630, 480]].forEach(([s, x, y]) => A.tag(layers[0], x, y, s, { fill: C.ink, size: 16 }));
      [[240, 300, 160, 148], [400, 300, 400, 128], [380, 340, 290, 462], [580, 300, 630, 462]].forEach(([x, y, tx, ty]) => {
        A.line(layers[1], x, y, tx, ty, { stroke: C.ink, 'stroke-width': 2.5, 'stroke-dasharray': '5 5' });
        A.circle(layers[1], x, y, 9, { fill: C.buoy, stroke: C.ink, 'stroke-width': 2.5 });
      });
      A.tag(layers[2], 400, 560, 'WHEN YOU MUST WEAR A LIFEJACKET', { fill: C.port, size: 17 });
      const ok = A.g(layers[3], { transform: 'translate(700,90)' });
      A.circle(ok, 0, 0, 46, { fill: C.stbd });
      A.text(ok, 0, 9, 'ALL OK?', { size: 20, weight: 700, anchor: 'middle', fill: C.white });
      order(api, S, {
        steps: ['Name the types of safety gear on board', 'Show where each item is kept', 'Explain when lifejackets must be worn', 'Check everyone has understood'],
        step(n) { gsap.to(layers[n], { opacity: 1, duration: 0.5 }); },
        end: 'What gear, where it is, when to wear it, then check they understood.'
      });
    }
  });

  /* ---------- Task 4 ---------- */
  const PRE = ['Fuel fumes (inboards)', 'Fuel lines on, cocks open', 'Enough fuel', 'Coolant level', 'Cooling intakes clear', 'Safety lanyard on', 'Motor in neutral', 'Prop area clear'];
  P.push({
    type: 'learn', title: 'Task 4: Pre-start checks',
    html: `<p>Before you start the motor, check:</p>
<ul><li><b>Fuel fumes</b> in the engine space (inboards).</li><li><b>Fuel lines</b> connected and fuel cocks open, and <b>enough fuel</b>.</li><li><b>Coolant level</b>. Never open a hot, pressurised cap.</li><li><b>Cooling water intakes</b> clear of plastic bags and weed.</li><li><b>Safety lanyard</b> clipped on, motor in <b>neutral</b>, and nobody near the <b>propeller</b>.</li></ul>
<p>Then start the motor.</p>`,
    art(svg, S) {
      A.paperBg(svg);
      const g = A.g(svg);
      A.waterSide(g, 420, { amp: 4 });
      outboard(g, 160, 330, 1.0);
      A.waterSide(g, 430, { amp: 4, opacity: 0.5 });
      card(svg, 330, 60, 420, 480);
      A.text(svg, 540, 108, 'BEFORE YOU START', { size: 22, weight: 700, anchor: 'middle', fill: C.port, ls: '0.12em' });
      PRE.forEach((t, k) => {
        const y = 156 + k * 44;
        A.rect(svg, 360, y - 20, 26, 26, { rx: 6, fill: 'none', stroke: C.ink2, 'stroke-width': 2 });
        A.text(svg, 402, y, t, { font: 'body', size: 20, fill: C.ink });
        const tk = A.path(svg, `M 364 ${y - 8} L 372 ${y} L 384 ${y - 16}`, { fill: 'none', stroke: C.stbd, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
        gsap.from(tk, { drawSVG: 0, duration: 0.3, delay: 0.5 + k * 0.3 });
      });
      const go = A.tag(svg, 540, 506, 'NOW START THE MOTOR', { fill: C.stbd, size: 18 });
      gsap.from(go, { opacity: 0, scale: 0.8, transformOrigin: '50% 50%', duration: 0.4, delay: 3.1 });
    }
  });
  P.push({
    type: 'try', title: 'Ready to start?',
    html: `<p>You’re about to turn the key. Decide whether it’s safe to start.</p>`,
    lockMsg: 'Answer all six',
    build(svg, S, api) {
      A.paperBg(svg);
      const g = A.g(svg);
      A.waterSide(g, 440, { amp: 4 });
      outboard(g, 150, 350, 1.0);
      A.waterSide(g, 450, { amp: 4, opacity: 0.5 });
      // console
      card(g, 330, 40, 430, 260);
      A.text(g, 545, 76, 'AT THE HELM', { size: 16, weight: 700, anchor: 'middle', fill: C.ink3, ls: '0.14em' });
      A.rect(g, 380, 110, 120, 160, { rx: 14, fill: '#27323E' });
      A.text(g, 440, 132, 'F', { size: 16, weight: 700, anchor: 'middle', fill: '#fff' });
      A.text(g, 440, 196, 'N', { size: 16, weight: 700, anchor: 'middle', fill: '#fff' });
      A.text(g, 440, 260, 'R', { size: 16, weight: 700, anchor: 'middle', fill: '#fff' });
      const lever = A.g(g, { transform: 'translate(462,250)' });
      A.rect(lever, -6, -110, 12, 110, { rx: 6, fill: '#8796A3' });
      A.circle(lever, 0, -110, 16, { fill: C.port });
      A.circle(g, 462, 250, 10, { fill: '#55626F' });
      A.circle(g, 640, 160, 34, { fill: '#27323E' });
      A.rect(g, 634, 132, 12, 40, { rx: 4, fill: '#C3CBD3' });
      A.text(g, 640, 216, 'KEY', { size: 14, weight: 700, anchor: 'middle', fill: C.ink3, ls: '0.14em' });
      const lan = A.g(g);
      A.path(lan, 'M 700 130 q 30 30 0 60 q -30 30 0 60', { fill: 'none', stroke: C.port, 'stroke-width': 5, 'stroke-linecap': 'round' });
      A.rect(lan, 690, 112, 20, 20, { rx: 4, fill: C.port });
      A.text(g, 700, 284, 'LANYARD', { size: 14, weight: 700, anchor: 'middle', fill: C.ink3, ls: '0.14em' });
      // fuel tank
      const tk = A.g(g, { transform: 'translate(500,370)' });
      A.rect(tk, 0, 0, 170, 110, { rx: 14, fill: C.port, stroke: '#7E1F18', 'stroke-width': 3 });
      A.rect(tk, 20, -14, 40, 18, { rx: 4, fill: '#7E1F18' });
      A.text(tk, 85, 70, 'FUEL', { size: 26, weight: 700, anchor: 'middle', fill: '#fff', ls: '0.12em' });
      A.path(g, 'M 500 420 Q 380 470 230 300', { fill: 'none', stroke: '#1B232C', 'stroke-width': 7, 'stroke-linecap': 'round' });
      const cock = A.g(g, { transform: 'translate(420,450)' });
      A.circle(cock, 0, 0, 12, { fill: C.buoy, stroke: C.ink, 'stroke-width': 2 });
      const handle = A.rect(cock, -18, -4, 36, 8, { rx: 3, fill: C.ink });
      // mutable bits
      const bag = A.g(g, { opacity: 0 });
      A.path(bag, 'M 140 410 q 20 -16 40 -2 q 8 20 -6 34 q -24 8 -38 -6 q -8 -14 4 -26 z', { fill: 'rgba(255,255,255,0.85)', stroke: C.ink3, 'stroke-width': 1.5 });
      const mate = A.g(g, { opacity: 0 });
      A.person(mate, { x: 60, y: 470, s: 0.75, side: true, flip: true });
      const ring = A.circle(g, 0, 0, 40, { fill: 'none', stroke: C.buoy, 'stroke-width': 6, opacity: 0 });
      const q = document.createElement('p'); q.className = 'q'; api.task.appendChild(q);
      const items = [
        { t: 'The gear lever is pushed forward.', a: 1, at: [462, 140], why: 'Right. Put it in <b>neutral</b> before you start.', bad: 'It’s in gear. Starting now could send the boat lurching forward.' },
        { t: 'The safety lanyard is lying on the dash.', a: 1, at: [700, 180], why: 'Right. Clip the lanyard on first.', bad: 'If you go overboard, nothing will stop the motor. Clip it on.' },
        { t: 'A plastic bag is stuck over the water intake.', a: 1, at: [160, 426], why: 'Right. Clear the cooling water intake.', bad: 'With the intake blocked, the motor will overheat.' },
        { t: 'The fuel cock is turned off.', a: 1, at: [420, 450], why: 'Right. Open the fuel cock.', bad: 'No fuel can reach the motor with the cock closed.' },
        { t: 'Your mate is rinsing their feet by the propeller.', a: 1, at: [96, 420], why: 'Right. Nobody near the propeller.', bad: 'A person near the propeller could be badly hurt.' },
        { t: 'Lines on, cock open, fuel and coolant checked, intakes clear, lanyard on, neutral, prop clear.', a: 0, at: [640, 160], why: 'All checked. Start the motor.', bad: 'Everything has been checked. It is safe to start now.' }
      ];
      rounds(api, S, {
        items, choices: ['Start it', 'Not yet'], noun: 'Check',
        show(it, i) {
          q.textContent = it.t;
          gsap.set(lever, { rotation: i === 0 ? -30 : 0, svgOrigin: '462 250' });
          gsap.set(lan, { x: i === 1 ? -60 : 0, y: i === 1 ? 120 : 0, rotation: i === 1 ? 70 : 0, svgOrigin: '700 120' });
          gsap.set(bag, { opacity: i === 2 ? 1 : 0 });
          gsap.set(handle, { rotation: i === 3 ? 90 : 0, svgOrigin: '420 450' });
          gsap.set(mate, { opacity: i === 4 ? 1 : 0 });
          gsap.fromTo(ring, { attr: { cx: it.at[0], cy: it.at[1], r: 20 }, opacity: 0 }, { attr: { r: 44 }, opacity: 1, duration: 0.45, ease: 'back.out(2)' });
        },
        end: 'Neutral, lanyard on, intakes clear, fuel on, prop clear. Now you can start.'
      });
    }
  });

  /* ---------- Task 5 ---------- */
  P.push({
    type: 'learn', title: 'Task 5: Voyage plan',
    html: `<p>Log on with a responsible person or a marine rescue group. You can write it down, simulate a radio call, or use another method. Give all eight:</p>
<ul><li>vessel name, rego number or call sign</li><li>departure time, as a clock time like <b>0715</b></li><li>where you’re leaving from, and your destination</li><li>what you plan to do</li><li>how many people are on board</li><li>fuel in <b>litres</b>, not “plenty”</li><li>estimated time of return, as a clock time.</li></ul>`,
    art(svg, S) {
      A.paperBg(svg);
      radio(svg, 160, 120, 0.9);
      const g = A.g(svg, { transform: 'translate(60,200)' });
      A.rect(g, 4, 6, 680, 340, { rx: 22, fill: 'rgba(18,38,58,0.14)' });
      A.rect(g, 0, 0, 680, 340, { rx: 22, fill: C.white, stroke: C.line, 'stroke-width': 1.5 });
      A.path(g, 'M 70 2 L 90 -30 L 120 2 Z', { fill: C.white, stroke: C.line, 'stroke-width': 1.5 });
      A.rect(g, 66, 0, 58, 4, { fill: C.white });
      const ls = ['“Marine rescue, this is AB150,', 'departing Fremantle Boat Harbour at 0750', 'to go fishing at Carnac Island.', 'Three people on board, 120 litres of fuel.', 'Estimated time of return is 1430, over.”'];
      ls.forEach((l, k) => { const t = A.text(g, 34, 66 + k * 56, l, { font: 'body', size: 25, fill: C.ink }); gsap.from(t, { opacity: 0, x: -10, duration: 0.4, delay: 0.3 + k * 0.5 }); });
    }
  });
  P.push({
    type: 'try', title: 'Build the voyage plan',
    html: `<p>Fill the gaps in this log-on call. Pick the version an assessor would accept.</p>`,
    lockMsg: 'Fill every gap',
    build(svg, S, api) {
      A.paperBg(svg);
      radio(svg, 160, 110, 0.9);
      const g = A.g(svg, { transform: 'translate(40,190)' });
      A.rect(g, 4, 6, 720, 360, { rx: 22, fill: 'rgba(18,38,58,0.14)' });
      A.rect(g, 0, 0, 720, 360, { rx: 22, fill: C.white, stroke: C.line, 'stroke-width': 1.5 });
      const slots = [
        { q: 'Who is calling?', ok: 'AB150', no: 'my boat', bad: 'Use the boat’s name, rego number or call sign.' },
        { q: 'Departure time?', ok: '0750', no: 'this morning', bad: 'Give a clock time, like 0750.' },
        { q: 'Leaving from?', ok: 'Fremantle Boat Harbour', no: 'the usual ramp', bad: 'Name the place. “The usual ramp” means nothing to a rescuer.' },
        { q: 'Where to, and why?', ok: 'go fishing at Carnac Island', no: 'head out for a bit', bad: 'Say where you’re going and what you’ll do there.' },
        { q: 'People on board?', ok: 'three people on board', no: 'a few of us', bad: 'Give the exact number of people.' },
        { q: 'Fuel?', ok: '120 litres of fuel', no: 'plenty of fuel', bad: 'Give the fuel in litres, not “plenty”.' },
        { q: 'Back by?', ok: '1430', no: 'late arvo', bad: 'Give a clock time, like 1430.' }
      ];
      const filled = slots.map(() => null);
      const T = [['“Marine rescue, this is ', 0, ','], ['departing ', 2, ' at ', 1], ['to ', 3, '.'], ['', 4, ', ', 5, '.'], ['Estimated time of return is ', 6, ', over.”']];
      const lines = T.map((_, k) => A.text(g, 30, 64 + k * 62, '', { font: 'body', size: 24, fill: C.ink }));
      const draw = hi => T.forEach((row, k) => {
        lines[k].textContent = '';
        row.forEach(part => {
          const ts = A.el('tspan', {}, lines[k]);
          if (typeof part === 'number') {
            ts.textContent = filled[part] || '________';
            ts.setAttribute('fill', filled[part] ? (part === hi ? C.stbd : C.ink) : C.ink3);
            if (filled[part]) ts.setAttribute('font-weight', 700);
          } else ts.textContent = part;
        });
      });
      draw();
      const q = document.createElement('p'); q.className = 'q'; api.task.appendChild(q);
      const box = document.createElement('div'); box.className = 'chips'; api.task.appendChild(box);
      const stt = document.createElement('div'); stt.className = 'status'; api.task.appendChild(stt);
      let i = 0;
      const show = () => {
        const s = slots[i];
        q.textContent = s.q;
        stt.textContent = `Gap ${i + 1} of ${slots.length}`;
        const opts = Math.random() < 0.5 ? [s.ok, s.no] : [s.no, s.ok];
        box.innerHTML = opts.map(o => `<button class="chip">${o}</button>`).join('');
        box.querySelectorAll('.chip').forEach(b => b.onclick = () => {
          if (b.textContent !== s.ok) { api.say(s.bad, 'bad'); b.classList.add('shake'); setTimeout(() => b.classList.remove('shake'), 400); return; }
          filled[i] = s.ok; draw(i); api.hush();
          i++;
          if (i < slots.length) show();
          else { q.textContent = ''; box.innerHTML = ''; stt.textContent = ''; api.done('That’s a complete voyage plan: who, when, from, to, why, how many, how much fuel and when you’ll be back.'); }
        });
      };
      show();
    }
  });

  /* ---------- Task 6 ---------- */
  P.push({
    type: 'learn', title: 'Task 6: Leaving the berth',
    html: `<p>When you leave the berth, the assessor checks that you:</p>
<ul><li>make sure it’s <b>safe</b> and you won’t <b>impede</b> other boats</li><li>allow for the <b>wind and current</b></li><li>leave with <b>little or no impact</b> on the boat or jetty</li><li>use sensible <b>revs</b> and <b>smooth</b> gear changes</li><li><b>stow the lines</b> once you’re clear.</li></ul>`,
    art(svg, S) {
      S.seaBg(svg);
      const wk = A.g(svg); S.wakes(wk);
      wharf(svg, [250, 560]);
      S.boat(svg, { len: 150, color: C.port, x: 400, y: 234, wake: false });
      const o = S.boat(svg, { len: 120, color: C.stbd, x: 900, y: 440, r: 180 });
      gsap.to(o, { x: -120, duration: 12, repeat: -1, ease: 'none' });
      const fl = A.g(svg, { transform: 'translate(700,520)' });
      A.circle(fl, 0, 0, 44, { fill: C.white, stroke: C.line, 'stroke-width': 1.5 });
      A.arrow(fl, 'M 22 -22 L -18 18', { width: 5, color: C.ink });
      A.text(fl, 0, 66, 'WIND', { size: 15, weight: 700, anchor: 'middle', fill: C.ink, ls: '0.14em' });
      const t = A.tag(svg, 400, 300, 'CHECK ALL AROUND FIRST', { fill: C.ink, size: 16 });
      gsap.from(t, { opacity: 0, y: '+=8', duration: 0.5, delay: 0.6 });
    }
  });

  P.push({
    type: 'watch', title: 'Leaving with an outboard',
    html: `<p>With an outboard or sterndrive, the stern does nearly all the turning, and it moves the way the propeller points.</p><p>Watch the wheel and the gear.</p>`,
    anim(svg, S) {
      S.seaBg(svg);
      const wk = A.g(svg); S.wakes(wk);
      wharf(svg, [250, 560]);
      const b = S.boat(svg, { len: 150, color: C.port, x: 400, y: 234 });
      const lines = A.g(svg);
      const l1 = rope(lines, 'M 470 220 Q 520 205 560 168'), l2 = rope(lines, 'M 335 218 Q 290 205 250 168');
      const h = hud(svg, 16, 476);
      const cap = caption(svg, 14);
      const tl = gsap.timeline();
      h.gear(tl, 0, 1); h.wheel(tl, 0, 0);
      tl.set(lines, { opacity: 1 }, 0);
      cap.show(tl, 0.2, 'Check all around. Let go the lines and stow them.');
      tl.to(lines, { opacity: 0, duration: 0.6 }, 2.2);
      cap.show(tl, 3.2, 'Wheel away from the jetty, then reverse gently.');
      h.wheel(tl, 3.6, 90); h.gear(tl, 4.4, 2);
      tl.to(b, { x: 372, y: 252, rotation: -22, duration: 2.4, ease: 'sine.inOut' }, 4.6);
      cap.show(tl, 7.2, 'Bow clear: wheel toward the jetty, keep reversing.');
      h.wheel(tl, 7.4, -90);
      tl.to(b, { x: 250, y: 300, rotation: 0, duration: 2.8, ease: 'sine.inOut' }, 7.8);
      cap.show(tl, 10.8, 'Parallel and clear: neutral, wheel straight, then ahead.');
      h.gear(tl, 11, 1); h.wheel(tl, 11.2, 0); h.gear(tl, 12, 0);
      tl.to(b, { x: 960, duration: 4.5, ease: 'power1.in' }, 12.2);
      return tl;
    }
  });

  function springScene(svg, S, mode) {
    S.seaBg(svg);
    wharf(svg, mode === 'leave' ? [300] : [380]);
    const b = S.boat(svg, { len: 220, color: C.sea4, x: 400, y: 252, wake: false });
    const sp = A.g(svg);
    const piv = mode === 'leave' ? [500, 200] : [500, 200];
    const st = { r: 0 };
    const draw = () => {
      // rotate around the bow shoulder
      const a = st.r * D2R, lx = 100, ly = -44;
      b.rotation = st.r;
      b.x = piv[0] - (lx * Math.cos(a) - ly * Math.sin(a));
      b.y = piv[1] - (lx * Math.sin(a) + ly * Math.cos(a));
      const c = wp(b, 80, -36);
      sp.innerHTML = '';
      const bx = mode === 'leave' ? 300 : 380;
      rope(sp, `M ${c[0].toFixed(1)} ${c[1].toFixed(1)} L ${bx} 168`);
    };
    draw();
    if (mode === 'leave') gsap.to(st, { r: -24, duration: 2.6, yoyo: true, repeat: -1, repeatDelay: 0.8, ease: 'sine.inOut', onUpdate: draw });
    else { st.r = -20; draw(); gsap.to(st, { r: 0, duration: 2.6, yoyo: true, repeat: -1, repeatDelay: 0.8, ease: 'sine.inOut', onUpdate: draw }); }
    A.arrow(svg, mode === 'leave' ? 'M 250 330 Q 236 380 260 420' : 'M 250 420 Q 236 380 262 330', { width: 5, color: C.port });
    A.tag(svg, 400, 520, mode === 'leave' ? 'FORWARD GEAR, WHEEL TOWARD THE JETTY' : 'FORWARD IDLE, WHEEL AWAY FROM THE JETTY', { fill: C.ink, size: 16 });
    A.tag(svg, mode === 'leave' ? 330 : 400, 128, 'SPRING LINE', { fill: C.buoy, color: C.ink, size: 15 });
  }
  P.push({
    type: 'learn', title: 'Leaving with a shaft drive',
    html: `<p>Inboard shaft drives steer with a rudder, so they leave differently.</p>
<p><b>Single shaft:</b> rig a spring from the bow leading aft to the jetty. Wheel toward the berth and go ahead slowly: the stern swings out. Then neutral, let go the spring, wheel away and reverse out.</p>
<p><b>Twin shaft:</b> outer engine ahead and inner engine astern to swing the stern out. Then both astern, then ahead on the inner engine.</p>`,
    art(svg, S) { springScene(svg, S, 'leave'); }
  });
  P.push({
    type: 'check', title: 'First move',
    q: 'Your outboard boat is tied up with its port side to the jetty. After letting go the lines, what do you do first?',
    opts: ['Wheel away from the jetty, then reverse gently', 'Wheel toward the jetty, then go ahead firmly', 'Leave the wheel straight and go ahead slowly', 'Wheel away from the jetty, then go ahead fast'],
    a: 0,
    why: 'Reversing with the wheel turned away swings the stern clear while the bow stays off the jetty.'
  });

  /* ---------- Task 7: man overboard ---------- */
  P.push({
    type: 'learn', title: 'Task 7: Man overboard',
    html: `<p>The assessor will throw something in to be the person. You need to:</p>
<ul><li>turn <b>hard toward the side</b> they fell, so the stern and propeller swing away</li><li>throw (or pretend to throw) a <b>flotation aid</b></li><li>keep them <b>in sight</b> the whole time</li><li>circle <b>well clear</b> and come back <b>into the wind or current</b>, whichever is stronger</li><li>approach at the <b>slowest speed</b> you can still steer, and stop beside them, downwind</li><li><b>turn the engine off</b>, then get them aboard.</li></ul>`,
    art(svg, S) {
      S.seaBg(svg);
      const path = A.path(svg, 'M 400 560 L 400 380 C 400 300 520 250 600 300 C 680 350 660 520 560 580 C 480 625 405 600 405 520 L 405 420', { fill: 'none', stroke: C.ink, 'stroke-width': 4, 'stroke-dasharray': '10 9', 'stroke-linecap': 'round' });
      gsap.from(path, { opacity: 0, duration: 1.2, delay: 0.2 });
      A.swimmer(svg, 446, 392, 1.2);
      const w = A.g(svg, { transform: 'translate(110,110)' });
      A.circle(w, 0, 0, 52, { fill: C.white, stroke: C.line, 'stroke-width': 1.5 });
      A.arrow(w, 'M 0 -30 L 0 26', { width: 6, color: C.ink });
      A.text(w, 0, 76, 'WIND', { size: 15, weight: 700, anchor: 'middle', fill: C.ink, ls: '0.14em' });
      [[400, 470, '1'], [560, 270, '2'], [640, 450, '3'], [405, 560, '4'], [372, 430, '5']].forEach(([x, y, n], k) => {
        const g = A.g(svg);
        A.circle(g, x, y, 17, { fill: C.port, stroke: C.white, 'stroke-width': 3 });
        A.text(g, x, y + 7, n, { size: 20, weight: 700, anchor: 'middle', fill: C.white });
        gsap.from(g, { scale: 0, svgOrigin: `${x} ${y}`, duration: 0.35, delay: 0.5 + k * 0.6, ease: 'back.out(2)' });
      });
    }
  });
  P.push({
    type: 'watch', title: 'Picking someone up',
    html: `<p>Watch the whole recovery. Notice the boat comes back <b>into the wind</b> and stops with the person beside it.</p>`,
    anim(svg, S) {
      S.seaBg(svg);
      const wk = A.g(svg); S.wakes(wk);
      const w = A.g(svg, { transform: 'translate(90,100)' });
      A.circle(w, 0, 0, 46, { fill: C.white, stroke: C.line, 'stroke-width': 1.5 });
      A.arrow(w, 'M 0 -26 L 0 22', { width: 6, color: C.ink });
      A.text(w, 0, 68, 'WIND', { size: 14, weight: 700, anchor: 'middle', fill: C.ink, ls: '0.14em' });
      const sight = A.line(svg, 0, 0, 0, 0, { stroke: C.port, 'stroke-width': 2, 'stroke-dasharray': '4 6', opacity: 0 });
      const pm = A.g(svg, { opacity: 0 });
      const per = A.swimmer(pm, 0, 0, 1.1);
      const pos = { x: 444, y: 384 };
      const ringG = A.g(svg, { opacity: 0 });
      A.circle(ringG, 0, 0, 13, { fill: 'none', stroke: C.orange, 'stroke-width': 7 });
      A.circle(ringG, 0, 0, 13, { fill: 'none', stroke: C.white, 'stroke-width': 7, 'stroke-dasharray': '6 14' });
      const b = S.boat(svg, { len: 120, color: C.sea4, x: 400, y: 680, r: -90 });
      const h = hud(svg, 16, 476);
      const cap = caption(svg, 14);
      let watching = false;
      S.loop(() => {
        pm.setAttribute('transform', `translate(${pos.x},${pos.y})`);
        if (watching) { sight.setAttribute('x1', b.x); sight.setAttribute('y1', b.y); sight.setAttribute('x2', pos.x); sight.setAttribute('y2', pos.y); }
      });
      const tl = gsap.timeline();
      tl.call(() => { watching = false; }, null, 0);
      h.gear(tl, 0, 0); h.wheel(tl, 0, 0);
      tl.set([pm, ringG, sight], { opacity: 0 }, 0);
      tl.set(pos, { x: 444, y: 384 }, 0);
      tl.set(b, { x: 400, y: 680, rotation: -90 }, 0);
      tl.to(b, { y: 380, duration: 2.6, ease: 'none' }, 0.2);
      cap.show(tl, 1.6, '“Man overboard, starboard side!”');
      tl.set(pm, { opacity: 1 }, 2.5);
      tl.from(per, { scale: 0.3, transformOrigin: '50% 50%', duration: 0.4 }, 2.5);
      cap.show(tl, 3.0, 'Turn hard toward that side, so the stern swings away.');
      h.wheel(tl, 2.7, 120);
      tl.to(b, { motionPath: { path: 'M 400 380 C 400 300 520 250 600 300 C 680 350 660 520 560 580 C 480 625 405 600 405 540', autoRotate: true }, duration: 8, ease: 'none' }, 2.8);
      tl.set(ringG, { opacity: 1, x: 410, y: 360 }, 3.4);
      tl.to(ringG, { x: 470, y: 398, duration: 0.8, ease: 'power1.out' }, 3.4);
      cap.show(tl, 4.6, 'Throw a flotation aid and keep them in sight.');
      tl.call(() => { watching = true; }, null, 4.6);
      tl.to(sight, { opacity: 0.85, duration: 0.4 }, 4.6);
      tl.to(pos, { y: 396, duration: 8, ease: 'none' }, 4);
      tl.to(ringG, { y: '+=10', duration: 7, ease: 'none' }, 4.3);
      cap.show(tl, 7.4, 'Circle well clear, and line up to come back into the wind.');
      h.wheel(tl, 9.6, 0);
      cap.show(tl, 10.8, 'Approach at the slowest speed you can steer.');
      tl.to(b, { y: 404, duration: 3.4, ease: 'power2.out' }, 10.8);
      h.gear(tl, 12.6, 1);
      cap.show(tl, 14.4, 'Stopped beside them. Engine off, then get them aboard.');
      h.gear(tl, 14.6, -1);
      tl.to(sight, { opacity: 0, duration: 0.3 }, 14.6);
      tl.to(pos, { x: 430, y: 404, duration: 1.2, ease: 'power1.inOut' }, 15.6);
      tl.to(pm, { opacity: 0, duration: 0.5 }, 16.6);
      tl.to(ringG, { opacity: 0, duration: 0.5 }, 16.6);
      tl.to({}, { duration: 1.2 });
      return tl;
    }
  });
  P.push({
    type: 'try', title: 'Man overboard, in order',
    html: `<p>Someone has just gone over the side. Tap the steps in order.</p>`,
    lockMsg: 'Finish the recovery',
    build(svg, S, api) {
      S.seaBg(svg);
      A.swimmer(svg, 420, 300, 1.8);
      const big = A.g(svg);
      order(api, S, {
        steps: ['Turn hard toward the side they fell', 'Throw them a flotation aid', 'Keep them in sight the whole time', 'Circle well clear, come back into the wind', 'Approach slowly and stop beside them', 'Turn the engine off, then get them aboard'],
        step(n) {
          if (n === 1) { const r = A.g(big, { transform: 'translate(470,330)' }); A.circle(r, 0, 0, 18, { fill: 'none', stroke: C.orange, 'stroke-width': 9 }); gsap.from(r, { x: -200, y: 120, duration: 0.6, ease: 'power1.out' }); }
          if (n === 5) A.tag(big, 420, 420, 'ENGINE OFF', { fill: C.port, size: 18 });
        },
        end: 'Turn toward, throw, watch, circle clear, approach into the wind, engine off.'
      });
    }
  });

  /* ---------- Task 8: transits ---------- */
  P.push({
    type: 'learn', title: 'Task 8: Using a transit',
    html: `<p>A <span class="term">transit</span> is two fixed objects that line up from where you are, like a beacon in front of a roof. You’re somewhere on the line through them.</p>
<p>Two transits that cross give you your <b>position</b>, even without a chart.</p>
<p>In the assessment you must <b>tell the assessor which two objects</b> you’re using, then <b>steer a steady course</b> along the transit for <b>30 seconds</b>.</p>`,
    art(svg, S) {
      S.seaBg(svg);
      A.land(svg, 'M -20 -20 L 820 -20 L 820 120 Q 700 150 600 128 Q 480 100 380 140 Q 260 180 140 150 Q 60 130 -20 160 Z');
      A.house(svg, 230, 92, 44, 30, C.port);
      A.tree(svg, 640, 96, 18);
      const l1 = A.line(svg, 252, 112, 470, 470, { stroke: C.port, 'stroke-width': 3, 'stroke-dasharray': '8 8' });
      const l2 = A.line(svg, 640, 100, 470, 470, { stroke: C.stbd, 'stroke-width': 3, 'stroke-dasharray': '8 8' });
      A.beacon(svg, 340, 256, 'stbd');
      A.beacon(svg, 572, 248, 'port');
      [l1, l2].forEach((l, k) => gsap.from(l, { opacity: 0, duration: 0.8, delay: 0.4 + k * 1.2 }));
      const b = S.boat(svg, { len: 70, color: C.ink, x: 470, y: 500, r: -90, wake: false });
      const t = A.tag(svg, 470, 560, 'YOUR POSITION', { fill: C.ink, size: 16 });
      gsap.from(t, { opacity: 0, duration: 0.5, delay: 2.8 });
      const ring = A.circle(svg, 470, 470, 14, { fill: 'none', stroke: C.buoy, 'stroke-width': 5 });
      gsap.from(ring, { attr: { r: 50 }, opacity: 0, duration: 0.6, delay: 2.8 });
    }
  });
  P.push({
    type: 'try', title: 'Hold the transit',
    html: `<p>Line the beacon up under the house, then hold it there while the current pushes you off. If the marks split, steer toward the <b>lower (front) mark</b>.</p><p>Hold the transit for 10 seconds.</p>`,
    lockMsg: 'Hold the transit for 10 seconds',
    build(svg, S, api) {
      const id = A.uid('tsky');
      const lg = A.el('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 }, A.defs(svg));
      A.el('stop', { offset: 0, 'stop-color': '#CFE3EA' }, lg); A.el('stop', { offset: 1, 'stop-color': '#F3EEE0' }, lg);
      A.rect(svg, 0, 0, 800, 600, { fill: `url(#${id})` });
      const world = A.g(svg);
      A.rect(world, -200, 300, 1200, 400, { fill: '#6FA6B6' });
      A.path(world, 'M -200 300 Q -60 230 120 262 Q 300 240 420 258 Q 600 228 760 262 Q 900 270 1000 300 Z', { fill: C.land2 });
      A.path(world, 'M -200 300 Q 0 276 200 286 Q 400 272 600 286 Q 800 276 1000 300 Z', { fill: C.sand });
      for (let k = 0; k < 9; k++) A.path(world, `M ${-120 + k * 110} ${340 + (k % 3) * 40} q 14 -5 28 0`, { fill: 'none', stroke: 'rgba(255,255,255,0.5)', 'stroke-width': 2.5, 'stroke-linecap': 'round' });
      const rear = A.g(world);
      A.rect(rear, -22, 236, 44, 30, { fill: C.white, stroke: C.ink, 'stroke-width': 1.5 });
      A.path(rear, 'M -30 238 L 0 214 L 30 238 Z', { fill: C.port, stroke: C.ink, 'stroke-width': 1.5 });
      const front = A.g(world);
      A.rect(front, -4, 270, 8, 90, { fill: C.stbd });
      A.path(front, 'M -14 270 L 0 248 L 14 270 Z', { fill: C.stbd });
      A.path(front, 'M -20 358 q 20 -8 40 0', { fill: 'none', stroke: '#fff', 'stroke-width': 3 });
      // bow and windscreen frame
      A.path(svg, 'M 220 600 Q 400 470 580 600 Z', { fill: C.white, stroke: C.ink, 'stroke-width': 3 });
      A.path(svg, 'M 400 500 L 400 600', { stroke: C.line, 'stroke-width': 3 });
      A.rect(svg, -10, -10, 820, 40, { fill: C.ink });
      A.rect(svg, -10, -10, 40, 620, { fill: C.ink }); A.rect(svg, 770, -10, 40, 620, { fill: C.ink });
      // stopwatch
      const sw = A.g(svg, { transform: 'translate(690,100)' });
      A.circle(sw, 0, 0, 46, { fill: C.white, stroke: C.ink, 'stroke-width': 3 });
      const arc = A.circle(sw, 0, 0, 38, { fill: 'none', stroke: C.stbd, 'stroke-width': 8, transform: 'rotate(-90)', 'stroke-dasharray': `0 ${2 * Math.PI * 38}` });
      const num = A.text(sw, 0, 10, '0', { size: 30, weight: 700, anchor: 'middle', fill: C.ink });
      const lab = A.tag(svg, 400, 70, 'MARKS SPLIT', { fill: C.port, size: 17 });
      // controls
      const ui = document.createElement('div'); ui.className = 'chips';
      ui.innerHTML = '<button class="chip" data-d="-1">Steer to port</button><button class="chip" data-d="1">Steer to starboard</button>';
      api.task.appendChild(ui);
      const stt = document.createElement('div'); stt.className = 'status'; stt.textContent = 'Press and hold a button to steer.'; api.task.appendChild(stt);
      let steer = 0, x0 = 5, v = 0, held = 0, t = 0, fin = false;
      ui.querySelectorAll('.chip').forEach(b => {
        const on = e => { e.preventDefault(); steer = +b.dataset.d; b.classList.add('on'); };
        const off = () => { steer = 0; b.classList.remove('on'); };
        b.addEventListener('pointerdown', on); b.addEventListener('pointerup', off); b.addEventListener('pointerleave', off); b.addEventListener('pointercancel', off);
      });
      S.loop(() => {
        const dt = Math.min(gsap.ticker.deltaRatio() / 60, 0.05);
        t += dt;
        const drift = fin ? 0 : 1.1 + Math.sin(t * 0.7) * 0.9;
        v += ((steer * 5 + drift) - v) * Math.min(1, dt * 3);
        x0 += v * dt;
        x0 = Math.max(-14, Math.min(14, x0));
        const fx = 400 - x0 * 14, rx = 400 - x0 * 5;
        front.setAttribute('transform', `translate(${fx.toFixed(1)},0)`);
        rear.setAttribute('transform', `translate(${rx.toFixed(1)},0)`);
        world.setAttribute('transform', `rotate(${(Math.sin(t * 1.3) * 0.8).toFixed(2)} 400 300)`);
        const inLine = Math.abs(fx - rx) < 12;
        lab.querySelector('rect').setAttribute('fill', inLine ? C.stbd : C.port);
        lab.querySelector('text').textContent = inLine ? 'IN LINE' : 'MARKS SPLIT';
        if (!fin && inLine) {
          held += dt;
          const f = Math.min(1, held / 10);
          arc.setAttribute('stroke-dasharray', `${(f * 2 * Math.PI * 38).toFixed(1)} ${2 * Math.PI * 38}`);
          num.textContent = Math.floor(Math.min(10, held));
          if (held >= 10) { fin = true; stt.textContent = ''; ui.style.display = 'none'; api.done('Steady on the transit. In the assessment you’ll hold it for 30 seconds.'); }
        }
      });
    }
  });

  /* ---------- Task 9: controlled stop ---------- */
  P.push({
    type: 'learn', title: 'Task 9: Controlled stop',
    html: `<p>At about <b>5 knots</b>, the assessor will tell you to stop. You must stop within <b>two boat lengths</b>:</p>
<ul><li>check it’s <b>safe</b>, including behind you</li><li><b>shout a warning</b>: “Hold on!”</li><li><b>reduce revs</b>, then shift to <b>neutral</b></li><li>shift <b>firmly into reverse</b></li><li>add <b>enough revs</b> to stop.</li></ul>
<p class="note">The pause in neutral protects the gearbox. Too many revs in reverse just makes the propeller lose its grip.</p>`,
    art(svg, S) {
      A.paperBg(svg);
      const g = A.g(svg, { transform: 'translate(400,400)' });
      A.path(g, 'M -170 0 A 170 170 0 0 1 170 0', { fill: 'none', stroke: C.paper3, 'stroke-width': 30, 'stroke-linecap': 'round', transform: 'rotate(0)' });
      [['F', -50, C.stbd], ['N', 0, C.ink], ['R', 50, C.port]].forEach(([t, a, col]) => {
        const r = a * D2R;
        A.text(g, Math.sin(r) * 215, -Math.cos(r) * 215 + 12, t, { size: 40, weight: 700, anchor: 'middle', fill: col });
      });
      A.rect(g, -110, 0, 220, 90, { rx: 16, fill: '#27323E' });
      const lev = A.g(g);
      A.rect(lev, -9, -190, 18, 190, { rx: 9, fill: '#8796A3' });
      A.circle(lev, 0, -190, 30, { fill: C.port });
      A.circle(g, 0, 0, 18, { fill: '#55626F' });
      const lab = A.tag(svg, 400, 540, 'CRUISING AHEAD', { fill: C.ink, size: 20 });
      const set = s => { lab.querySelector('text').textContent = s; const t = lab.querySelector('text'); let w = 0; try { w = t.getComputedTextLength(); } catch (e) { } w = (w || s.length * 10) + 20; lab.querySelector('rect').setAttribute('width', w); t.setAttribute('x', w / 2); lab.setAttribute('transform', `translate(${400 - w / 2},${540 - lab._h / 2})`); };
      const st = { a: -50 };
      const up = () => lev.setAttribute('transform', `rotate(${st.a.toFixed(1)})`);
      up();
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });
      tl.call(set, ['CRUISING AHEAD'], 0).set(st, { a: -50, onUpdate: up }, 0)
        .call(set, ['“HOLD ON!”'], 1)
        .call(set, ['REVS DOWN'], 2).to(st, { a: -30, duration: 0.6, onUpdate: up }, 2)
        .call(set, ['NEUTRAL: LET THE REVS DROP'], 3).to(st, { a: 0, duration: 0.5, onUpdate: up }, 3)
        .call(set, ['FIRMLY INTO REVERSE'], 4.6).to(st, { a: 30, duration: 0.25, ease: 'power2.out', onUpdate: up }, 4.6)
        .call(set, ['ADD REVS TO STOP'], 5.8).to(st, { a: 50, duration: 0.8, onUpdate: up }, 5.8)
        .to({}, { duration: 1.6 });
    }
  });
  P.push({
    type: 'watch', title: 'Stop in two boat lengths',
    html: `<p>Watch the gear and how far the boat travels after the call to stop.</p>`,
    anim(svg, S) {
      S.seaBg(svg);
      const wk = A.g(svg); S.wakes(wk);
      const L = 120;
      const br = A.g(svg, { opacity: 0 });
      A.path(br, `M 360 220 L 360 236 L ${360 + 2 * L} 236 L ${360 + 2 * L} 220`, { fill: 'none', stroke: C.ink, 'stroke-width': 3 });
      A.line(br, 360 + L, 228, 360 + L, 244, { stroke: C.ink, 'stroke-width': 3 });
      A.text(br, 360 + L, 214, 'TWO BOAT LENGTHS', { size: 16, weight: 700, anchor: 'middle', fill: C.ink, ls: '0.12em' });
      const sw = A.g(svg, { opacity: 0 });
      A.swimmer(sw, 680, 300, 1.2);
      const b = S.boat(svg, { len: L, color: C.port, x: -100, y: 300 });
      const shout = A.g(svg, { opacity: 0 });
      A.tag(shout, 0, 0, '“HOLD ON!”', { fill: C.buoy, color: C.ink, size: 18 });
      const h = hud(svg, 16, 476);
      const cap = caption(svg, 14);
      const tl = gsap.timeline();
      h.gear(tl, 0, 0);
      tl.set([br, sw, shout], { opacity: 0 }, 0);
      tl.set(b, { x: -100 }, 0);
      tl.to(b, { x: 300, duration: 4.4, ease: 'none' }, 0.2);
      cap.show(tl, 0.4, 'Cruising at about 5 knots.');
      tl.to(sw, { opacity: 1, duration: 0.4 }, 3.2);
      cap.show(tl, 3.2, 'Stop! First, a quick look behind.');
      tl.to(br, { opacity: 1, duration: 0.4 }, 4.4);
      tl.set(shout, { opacity: 1, x: 300, y: 250 }, 4.6);
      cap.show(tl, 4.6, 'Shout a warning, revs down, then neutral.');
      h.gear(tl, 5.0, 1);
      tl.to(b, { x: 390, duration: 1.6, ease: 'none' }, 4.6);
      cap.show(tl, 6.2, 'Firmly into reverse, then add revs.');
      h.gear(tl, 6.3, 2);
      tl.to(b, { x: 470, duration: 1.8, ease: 'power2.out' }, 6.2);
      tl.to(shout, { opacity: 0, duration: 0.3 }, 7);
      h.gear(tl, 8.4, 1);
      cap.show(tl, 8.4, 'Stopped, well inside two boat lengths.');
      tl.to({}, { duration: 1.8 });
      return tl;
    }
  });
  P.push({
    type: 'try', title: 'Controlled stop, in order',
    html: `<p>You’re doing 5 knots and the assessor says “Stop!” Tap the steps in order.</p>`,
    lockMsg: 'Finish the stop',
    build(svg, S, api) {
      S.seaBg(svg);
      const wk = A.g(svg); S.wakes(wk);
      const b = S.boat(svg, { len: 140, color: C.port, x: 160, y: 300 });
      const h = hud(svg, 16, 476);
      const tl = gsap.timeline();
      const sp = [80, 70, 55, 40, 20, 0];
      order(api, S, {
        steps: ['Check it is safe, including behind', 'Shout a warning to the crew', 'Reduce the engine revs', 'Shift into neutral', 'Shift firmly into reverse', 'Add revs to stop the boat'],
        step(n) {
          if (n === 3) h.gear(gsap.timeline(), 0, 1);
          if (n === 4) h.gear(gsap.timeline(), 0, 2);
          gsap.to(b, { x: `+=${sp[n]}`, duration: 0.8, ease: 'power1.out' });
        },
        end: 'Look, warn, revs down, neutral, reverse, then revs to stop. Done right, it’s quick.'
      });
    }
  });

  /* ---------- Task 10: berthing ---------- */
  P.push({
    type: 'learn', title: 'Task 10: Berthing',
    html: `<p>Coming alongside, the assessor checks that you:</p>
<ul><li>make sure it’s <b>safe</b> and don’t <b>impede</b> other boats</li><li>pick the right <b>side</b> for the wind and current</li><li>approach <b>slowly</b>, at the slowest speed you can still steer</li><li>approach at a sensible <b>angle</b>: about 45° in ideal conditions, starting your swing about two boat lengths out</li><li>use <b>smooth, timely</b> gear changes and low <b>revs</b></li><li>arrive with <b>little or no impact</b>, then <b>secure</b> the boat.</li></ul>`,
    art(svg, S) {
      S.seaBg(svg);
      wharf(svg, [330]);
      const ghost = S.boat(svg, { len: 120, color: C.ink3, x: 610, y: 470, r: 225, wake: false });
      ghost.g.setAttribute('opacity', 0.35);
      const p = A.path(svg, 'M 650 510 L 430 290 Q 400 252 330 238', { fill: 'none', stroke: C.ink, 'stroke-width': 3, 'stroke-dasharray': '8 8' });
      gsap.from(p, { opacity: 0, duration: 0.8, delay: 0.3 });
      S.boat(svg, { len: 120, color: C.port, x: 330, y: 228, r: 180, wake: false });
      A.tag(svg, 420, 470, 'APPROACH AT 30–45°', { fill: C.port, size: 16 });
      const t = A.tag(svg, 600, 380, 'START THE SWING ABOUT 2 BOAT LENGTHS OUT', { fill: C.ink, size: 15 });
      gsap.from(t, { opacity: 0, duration: 0.5, delay: 1.6 });
      A.circle(svg, 470, 330, 10, { fill: C.buoy, stroke: C.ink, 'stroke-width': 2.5 });
    }
  });
  P.push({
    type: 'try', title: 'Which way to berth?',
    html: `<p>Moored boats swing until their bows point into the combined wind and current. It’s usually easiest to berth with your bow pointing the same way.</p><p>Look at the moored boats. Which way should your bow point at the jetty?</p>`,
    lockMsg: 'Answer all three',
    build(svg, S, api) {
      S.seaBg(svg);
      wharf(svg, [240, 560]);
      const lay = A.g(svg);
      const items = [
        { dir: 180, a: 0, why: 'The moored boats point left, into the current. Berth bow to the left.' },
        { dir: 0, a: 1, why: 'Their bows point right, so that’s where the wind and current come from. Berth bow to the right.' },
        { dir: 180, a: 0, why: 'Bows point left. Come alongside heading left, into the wind and current.' }
      ];
      rounds(api, S, {
        items, choices: ['Bow to the left', 'Bow to the right'], noun: 'Harbour',
        bad: 'Look at which way the moored boats are pointing.',
        show(it, i) {
          lay.innerHTML = '';
          [[200, 380], [400, 450], [620, 370], [300, 530], [560, 520]].forEach(([x, y], k) => {
            A.mooringBuoy(lay, x + (it.dir === 0 ? 44 : -44), y, C.buoy);
            const r = A.path(lay, `M ${x + (it.dir === 0 ? 36 : -36)} ${y} L ${x + (it.dir === 0 ? 30 : -30)} ${y}`, { stroke: '#6B5A3E', 'stroke-width': 3 });
            const bb = S.boat(lay, { len: 70 + (k % 2) * 14, color: [C.sea4, C.port, C.stbd, C.ink2, C.sea3][k], x, y, r: it.dir + (k % 2 ? 6 : -5), wake: false });
            gsap.from(bb, { rotation: `+=${k % 2 ? 50 : -50}`, duration: 1.4, ease: 'elastic.out(1,0.5)' });
          });
          if (i === 1) {
            for (let k = 0; k < 4; k++) A.arrow(lay, `M ${640 - k * 10} ${250 + k * 26} l -60 0`, { width: 3, color: 'rgba(255,255,255,0.85)' });
          }
          gsap.from(lay, { opacity: 0, duration: 0.4 });
        },
        right(it) {
          const g = S.boat(lay, { len: 120, color: C.white, x: 400, y: 236, r: it.a === 0 ? 180 : 0, wake: false });
          g.g.setAttribute('opacity', 0.9);
          gsap.from(g.g, { opacity: 0, duration: 0.5 });
        },
        end: 'Moored boats are the best wind-and-current gauge in the harbour.'
      });
    }
  });
  P.push({
    type: 'watch', title: 'Coming alongside with an outboard',
    html: `<p>This boat comes alongside with its <b>starboard</b> side to the jetty. The stern swings toward the berth and the bow barely moves.</p>`,
    anim(svg, S) {
      S.seaBg(svg);
      const wk = A.g(svg); S.wakes(wk);
      wharf(svg, [250, 470]);
      const b = S.boat(svg, { len: 150, color: C.port, x: 860, y: 600, r: 215 });
      const lines = A.g(svg, { opacity: 0 });
      rope(lines, 'M 270 222 Q 262 196 250 168'); rope(lines, 'M 395 220 Q 440 200 470 168');
      const h = hud(svg, 16, 476);
      const cap = caption(svg, 14);
      const tl = gsap.timeline();
      h.gear(tl, 0, 0); h.wheel(tl, 0, 0);
      tl.set(lines, { opacity: 0 }, 0);
      tl.set(b, { x: 860, y: 600, rotation: 215 }, 0);
      cap.show(tl, 0.2, 'Slow speed, aiming at your spot, at 30 to 45°.');
      tl.to(b, { x: 560, y: 390, duration: 3.6, ease: 'none' }, 0.2);
      cap.show(tl, 3.8, '2 to 3 boat lengths out: wheel away from the berth.');
      h.wheel(tl, 3.8, -100);
      tl.to(b, { x: 420, y: 274, rotation: 196, duration: 2.8, ease: 'none' }, 3.8);
      cap.show(tl, 6.6, 'Bow nearly there: neutral, wheel toward the berth.');
      h.gear(tl, 6.6, 1); h.wheel(tl, 6.9, 100);
      tl.to(b, { x: 358, y: 246, rotation: 190, duration: 1.4, ease: 'power1.out' }, 6.6);
      cap.show(tl, 8.4, 'Reverse: it stops the boat and pulls the stern in.');
      h.gear(tl, 8.4, 2);
      tl.to(b, { x: 332, y: 234, rotation: 180, duration: 1.6, ease: 'power2.out' }, 8.4);
      h.gear(tl, 10.2, 1); h.wheel(tl, 10.4, 0);
      cap.show(tl, 10.4, 'Neutral, and secure the lines.');
      tl.to(lines, { opacity: 1, duration: 0.6 }, 11);
      tl.to({}, { duration: 1.6 });
      return tl;
    }
  });
  P.push({
    type: 'learn', title: 'Berthing with a shaft drive',
    html: `<p><b>Single shaft:</b> most have a right-handed propeller, so the stern kicks to port in reverse and the <b>port side</b> is easier to put alongside. Come in at a shallow angle and use reverse to stop with the bow’s shoulder almost touching. Then put a spring on from the forward end, wheel away from the berth and go ahead at idle. The boat comes in alongside.</p>
<p><b>Twin shaft:</b> approach slowly, then put the inner engine ahead and the outer engine astern to pull the stern in.</p>`,
    art(svg, S) { springScene(svg, S, 'berth'); }
  });

  function linesScene(svg, S) {
    S.seaBg(svg);
    wharf(svg, [110, 250, 560, 690]);
    S.boat(svg, { len: 300, color: C.sea4, x: 400, y: 258, wake: false });
    [[330, 195], [470, 195]].forEach(([x, y]) => fender(svg, x, y));
    const L = A.g(svg);
    const defs = [
      { d: 'M 540 236 Q 640 210 690 168', n: '1', x: 628, y: 206 },
      { d: 'M 285 228 Q 430 215 560 168', n: '2', x: 470, y: 196 },
      { d: 'M 515 228 Q 380 215 250 168', n: '3', x: 330, y: 197 },
      { d: 'M 258 240 Q 160 214 110 168', n: '4', x: 172, y: 209 }
    ];
    const ls = defs.map(o => { const r = rope(L, o.d); r.n = o; return r; });
    return ls;
  }
  P.push({
    type: 'learn', title: 'Mooring lines',
    html: `<p>Small boats may only need a bow line and a stern line. Bigger boats use four:</p>
<ol><li><b>Bow line</b>: from the bow, forward to the jetty.</li><li><b>Stern spring</b>: from the stern, leading forward.</li><li><b>Bow spring</b>: from the bow, leading aft.</li><li><b>Stern line</b>: from the stern, aft to the jetty.</li></ol>
<p>Springs stop the boat surging forward and back. For the assessment, an amidships line, or a spring with the motor in gear, can be enough.</p>`,
    art(svg, S) {
      const ls = linesScene(svg, S);
      ls.forEach((r, k) => {
        gsap.from(r.p.previousSibling, { drawSVG: 0, duration: 0.8, delay: 0.3 + k * 0.6 });
        gsap.from(r.p, { drawSVG: 0, duration: 0.8, delay: 0.3 + k * 0.6 });
        const g = A.g(svg);
        A.circle(g, r.n.x, r.n.y, 16, { fill: C.ink, stroke: C.white, 'stroke-width': 3 });
        A.text(g, r.n.x, r.n.y + 7, r.n.n, { size: 19, weight: 700, anchor: 'middle', fill: C.white });
        gsap.from(g, { opacity: 0, duration: 0.3, delay: 0.9 + k * 0.6 });
      });
      A.tag(svg, 640, 330, 'BOW', { fill: C.ink, size: 15 });
      A.tag(svg, 170, 330, 'STERN', { fill: C.ink, size: 15 });
    }
  });
  P.push({
    type: 'try', title: 'Name the lines',
    html: `<p>Which mooring line is highlighted?</p>`,
    lockMsg: 'Name all four',
    build(svg, S, api) {
      const ls = linesScene(svg, S);
      A.tag(svg, 640, 330, 'BOW', { fill: C.ink, size: 15 });
      A.tag(svg, 170, 330, 'STERN', { fill: C.ink, size: 15 });
      const items = [
        { k: 1, a: 2, why: 'The <b>stern spring</b> runs from the stern, leading forward.' },
        { k: 0, a: 0, why: 'The <b>bow line</b> runs from the bow, forward to the jetty.' },
        { k: 3, a: 3, why: 'The <b>stern line</b> runs from the stern, aft to the jetty.' },
        { k: 2, a: 1, why: 'The <b>bow spring</b> runs from the bow, leading aft.' }
      ];
      rounds(api, S, {
        items, choices: ['Bow line', 'Bow spring', 'Stern spring', 'Stern line'], noun: 'Line',
        bad: 'Look at which end of the boat it starts from, and which way it leads.',
        show(it) {
          ls.forEach((r, j) => { gsap.to(r, { opacity: j === it.k ? 1 : 0.25, duration: 0.3 }); r.p.setAttribute('stroke', j === it.k ? C.buoy : '#EADFC4'); });
        },
        end: 'Bow line, stern spring, bow spring, stern line.'
      });
    }
  });

  /* ---------- Task 11 ---------- */
  P.push({
    type: 'learn', title: 'Task 11: Log off',
    html: `<p>Back at the ramp, tell the person who has your trip plan that you’re home safe. You can write it down, simulate a radio call, or use another method. You must give:</p>
<ul><li>the vessel’s <b>name, rego number or call sign</b> (you can make one up)</li><li>that you’ve <b>returned safely</b>.</li></ul>`,
    art(svg, S) {
      A.paperBg(svg);
      const bub = (y, txt, side, who, d) => {
        const ls = wrap(txt, 40), h = 30 + ls.length * 28, w = 540;
        const x = side === 'l' ? 40 : 800 - 40 - w;
        const g = A.g(svg, { transform: `translate(${x},${y})` });
        A.rect(g, 0, 0, w, h, { rx: 16, fill: side === 'l' ? C.white : C.deep, stroke: side === 'l' ? C.line : 'none', 'stroke-width': 1.5 });
        A.text(g, 18, 22, who, { size: 13, weight: 700, fill: side === 'l' ? C.port : C.buoy, ls: '0.12em' });
        ls.forEach((l, q) => A.text(g, 18, 50 + q * 28, l, { font: 'body', size: 21, fill: side === 'l' ? C.ink : '#fff', italic: side !== 'l' }));
        gsap.from(g, { opacity: 0, y: '+=12', duration: 0.45, delay: d });
      };
      bub(50, '“Marine rescue, this is AB150, over.”', 'l', 'YOU', 0.3);
      bub(150, '(Marine rescue answers your call.)', 'r', 'MARINE RESCUE', 1.1);
      bub(240, '“Marine rescue, this is AB150. We have safely returned from our voyage and are signing off, over.”', 'l', 'YOU', 1.9);
      bub(400, '(Marine rescue acknowledges.)', 'r', 'MARINE RESCUE', 2.7);
      bub(490, '“Thank you marine rescue, out.”', 'l', 'YOU', 3.4);
    }
  });
  P.push({
    type: 'check', title: 'Logging off',
    q: 'Which log-off message gives the assessor both things they need?',
    opts: ['“This is AB150. We are back safe and signing off.”', '“Hi, it’s Sam here. We are all back now, thanks.”', '“This is AB150. We caught four snapper today.”', '“We are back early because the wind came up.”'],
    a: 0,
    why: 'It names the vessel and says you’ve returned safely.'
  });
  P.push({
    type: 'learn', title: 'After the assessment',
    html: `<p>Pass both parts and you’ll receive an <b>RST interim certificate</b>. Your RST card follows.</p>
<ul><li>Always <b>carry your RST</b> when you’re skippering.</li><li>Keep your safety gear <b>in date</b>. Flares carried in unprotected waters must be in date.</li></ul>
<p>Then keep learning: every trip makes you a better skipper.</p>`,
    art(svg, S) {
      A.paperBg(svg);
      const d = A.doc(svg, { x: 250, y: 70, w: 300, h: 400, title: ['RST interim', 'certificate'], band: C.stbd, tsize: 28, rows: 7, rowTop: 140 });
      gsap.from(d, { y: '+=20', opacity: 0, duration: 0.6, delay: 0.2 });
      const seal = A.g(svg, { transform: 'translate(500,420)' });
      A.circle(seal, 0, 0, 56, { fill: C.port });
      A.circle(seal, 0, 0, 46, { fill: 'none', stroke: '#fff', 'stroke-width': 2, 'stroke-dasharray': '3 5' });
      A.text(seal, 0, 10, 'PASS', { size: 28, weight: 700, anchor: 'middle', fill: '#fff', ls: '0.12em' });
      gsap.from(seal, { scale: 2, opacity: 0, svgOrigin: '500 420', duration: 0.5, delay: 0.9, ease: 'power3.in' });
    }
  });

  /* ---------- recap ---------- */
  const R = [
    { q: 'To pass the practical, how many of the 62 criteria can you get wrong?', opts: ['Up to 3', 'Up to 6', 'Up to 10', 'Up to 12'], a: 1, why: 'You need at least 56 of 62, so six or fewer can be wrong. Skippering unsafely is an immediate fail.' },
    { q: 'Why turn the engine off before pulling someone out of the water?', opts: ['So the propeller can’t injure them', 'To save fuel during the rescue', 'So you can hear them calling', 'Because the assessor says so'], a: 0, why: 'A turning propeller near a person in the water can cause terrible injuries.' },
    { q: 'In a controlled stop, why pause in neutral before reverse?', opts: ['It lets the revs drop and protects the gearbox', 'It gives your passengers time to sit down', 'It lets the boat glide to a natural stop', 'It warns other boats that you are stopping'], a: 0, why: 'Going straight from ahead to astern can badly damage the gearbox.' },
    { q: 'How should fuel be given in a voyage plan?', opts: ['As an amount in litres, like 120 litres', 'As “plenty”, if the tank is nearly full', 'As a fraction of the tank, like three-quarters', 'As the number of hours it will last'], a: 0, why: 'The workbook asks for fuel in litres, not “plenty”.' },
    { q: 'How can you tell which way the wind and current are pushing in a harbour?', opts: ['Look at which way moored boats are pointing', 'Look at which way the jetty is facing', 'Ask the assessor before you start', 'Watch which way other boats are moving'], a: 0, why: 'Moored boats swing until their bows point into the combined wind and current.' }
  ];
  R.forEach((r, k) => P.push(Object.assign({ type: 'recap', n: k + 1, of: R.length }, r)));

  SR.chapter({
    id: 10, title: 'Practical Assessment',
    intro: 'The 11 tasks you’ll do on the water, what the assessor is looking for in each, and how to do the manoeuvres. Ends with a short recap.',
    cover(svg, S) {
      S.seaBg(svg);
      const wk = A.g(svg); S.wakes(wk);
      wharf(svg, [200, 600]);
      const b = S.boat(svg, { len: 150, color: C.port, x: 700, y: 520, r: 215 });
      gsap.to(b, { motionPath: { path: 'M 700 520 C 600 420 500 300 400 250 C 360 232 340 234 320 234', autoRotate: true }, duration: 6, ease: 'power2.out' });
      A.text(svg, 120, 420, '10', { size: 200, weight: 700, fill: 'rgba(255,255,255,0.7)' });
    },
    pages: P
  });
})();
