/* Chapter 2 (part 2): environment, registration, diving, skiing, PWCs, workbook questions */
(function () {
  const A = SR.art, C = A.C;
  const { P, helpers } = SR._ch2;
  const { sky, no, caption, river } = helpers;

  /* ---------- side-view craft for the registration activity ---------- */
  function yachtSide(parent, L) {
    const g = A.g(parent), h = L * 0.12;
    A.path(g, `M ${-L * 0.06} ${h * 0.4} L ${L * 0.08} ${h * 0.4} L ${L * 0.05} ${h * 2.6} L ${-L * 0.04} ${h * 2.6} Z`, { fill: C.ink });
    A.path(g, `M ${-L * 0.42} ${h * 0.35} L ${-L * 0.38} ${h * 1.5} L ${-L * 0.34} ${h * 0.3} Z`, { fill: C.ink });
    A.line(g, 0, -h, 0, -L * 1.05, { stroke: C.ink, 'stroke-width': 5, 'stroke-linecap': 'round' });
    A.path(g, `M 6 ${-L * 1.0} L 6 ${-h * 1.6} L ${L * 0.36} ${-h * 1.5} Z`, { fill: C.white, stroke: C.ink3, 'stroke-width': 1.5, 'stroke-linejoin': 'round' });
    A.path(g, `M -6 ${-L * 0.95} L -6 ${-h * 1.8} L ${-L * 0.4} ${-h * 1.7} Z`, { fill: '#F3EEE0', stroke: C.ink3, 'stroke-width': 1.5, 'stroke-linejoin': 'round' });
    A.path(g, `M ${-L * 0.46} ${-h} L ${L * 0.5} ${-h * 1.15} C ${L * 0.44} ${-h * 0.2} ${L * 0.3} ${h * 0.4} ${L * 0.1} ${h * 0.45} L ${-L * 0.4} ${h * 0.35} Z`, { fill: C.white, stroke: C.ink, 'stroke-width': 2.2, 'stroke-linejoin': 'round' });
    A.path(g, `M ${-L * 0.45} ${-h * 0.45} L ${L * 0.48} ${-h * 0.6}`, { stroke: C.sea4, 'stroke-width': 4 });
    return g;
  }
  function tenderSide(parent, L) {
    const g = A.g(parent), h = L * 0.2;
    const mx = -L / 2;
    A.path(g, `M ${mx + 4} ${-h * 1.8} L ${mx - 14} ${-h * 1.8} L ${mx - 14} ${-h * 1.1} L ${mx + 4} ${-h * 1.1} Z`, { fill: C.ink });
    A.path(g, `M ${mx - 2} ${-h * 1.1} L ${mx - 8} ${-h * 1.1} L ${mx - 8} ${h * 0.9} L ${mx - 2} ${h * 0.9} Z`, { fill: '#22374D' });
    A.path(g, `M ${-L / 2} ${-h} L ${L * 0.5} ${-h * 1.25} C ${L * 0.42} ${-h * 0.2} ${L * 0.3} ${h * 0.5} ${L * 0.15} ${h * 0.5} L ${-L * 0.46} ${h * 0.4} Z`, { fill: '#9DA8B0', stroke: C.ink, 'stroke-width': 2.2, 'stroke-linejoin': 'round' });
    A.path(g, `M ${-L / 2} ${-h * 0.95} L ${L * 0.5} ${-h * 1.2}`, { stroke: '#65737F', 'stroke-width': 6, 'stroke-linecap': 'round' });
    return g;
  }
  function pwcSide(parent, L) {
    const g = A.g(parent), h = L * 0.14;
    A.path(g, `M ${-L / 2} ${-h * 0.9} L ${L * 0.15} ${-h * 1.05} L ${L * 0.5} ${-h * 0.7} C ${L * 0.45} ${0} ${L * 0.3} ${h * 0.5} ${L * 0.1} ${h * 0.5} L ${-L * 0.48} ${h * 0.4} Z`, { fill: C.white, stroke: C.ink, 'stroke-width': 2.2, 'stroke-linejoin': 'round' });
    A.path(g, `M ${-L * 0.42} ${-h * 0.9} L ${-L * 0.05} ${-h * 1.0} Q ${L * 0.02} ${-h * 1.9} ${L * 0.14} ${-h * 1.8} L ${L * 0.2} ${-h * 1.05} Z`, { fill: C.port, stroke: C.ink, 'stroke-width': 2, 'stroke-linejoin': 'round' });
    A.path(g, `M ${-L * 0.4} ${-h * 1.05} Q ${-L * 0.25} ${-h * 1.55} ${-L * 0.08} ${-h * 1.1}`, { fill: C.ink, stroke: C.ink, 'stroke-width': 2 });
    A.line(g, L * 0.1, -h * 1.9, L * 0.2, -h * 2.05, { stroke: C.ink, 'stroke-width': 6, 'stroke-linecap': 'round' });
    return g;
  }
  function fish(parent, x, y, s, col) {
    const g = A.g(parent, { transform: `translate(${x},${y}) scale(${s || 1})` });
    const b = A.g(g);
    A.path(b, 'M -20 0 L -34 -11 L -32 0 L -34 11 Z', { fill: col || C.buoy });
    A.path(b, 'M -22 0 C -10 -13 12 -13 24 0 C 12 13 -10 13 -22 0 Z', { fill: col || C.buoy });
    A.circle(b, 14, -3, 2.4, { fill: C.ink });
    g.b = b;
    return g;
  }
  function whale(parent, x, y, s, r) {
    const g = A.g(parent, { transform: `translate(${x},${y}) rotate(${r || 0}) scale(${s || 1})` });
    A.path(g, 'M 70 0 C 70 -22 30 -30 -10 -24 C -40 -20 -60 -10 -80 -4 L -100 -22 L -96 0 L -100 22 L -80 4 C -60 10 -40 20 -10 24 C 30 30 70 22 70 0 Z', { fill: '#4B6375' });
    A.path(g, 'M 10 -22 L -4 -44 L -16 -22 Z M 10 22 L -4 44 L -16 22 Z', { fill: '#4B6375' });
    A.path(g, 'M 60 -6 C 40 -10 10 -10 -20 -8', { stroke: 'rgba(255,255,255,0.25)', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' });
    return g;
  }
  function dolphin(parent, x, y, s, r) {
    const g = A.g(parent, { transform: `translate(${x},${y}) rotate(${r || 0}) scale(${s || 1})` });
    A.path(g, 'M 36 0 L 28 -4 C 10 -9 -16 -8 -28 -3 L -40 -12 L -36 0 L -40 12 L -28 3 C -16 8 10 9 28 4 Z', { fill: '#7E95A5' });
    A.path(g, 'M 4 -7 L -6 -18 L -10 -7 Z M 4 7 L -6 18 L -10 7 Z', { fill: '#7E95A5' });
    return g;
  }
  /* one-question-at-a-time picker used by two try pages */
  function picker(api, items, values, onShow, endMsg) {
    const ui = document.createElement('div');
    ui.innerHTML = `<p class="q" style="margin-bottom:10px"></p><div class="chips">${values.map(v => `<button class="chip" data-v="${v}">${v}</button>`).join('')}</div><div class="status"></div>`;
    api.task.appendChild(ui);
    const q = ui.querySelector('.q'), st = ui.querySelector('.status');
    let i = 0;
    const show = () => { q.textContent = items[i].q; st.textContent = `${i + 1} of ${items.length}`; onShow(i, false); };
    ui.querySelectorAll('.chip').forEach(b => b.onclick = () => {
      if (i >= items.length) return;
      const it = items[i];
      if (b.dataset.v === it.a) {
        api.say(`<b>${it.a}.</b> ${it.why}`, 'good');
        onShow(i, true);
        ui.querySelectorAll('.chip').forEach(c => c.disabled = true);
        setTimeout(() => {
          ui.querySelectorAll('.chip').forEach(c => c.disabled = false);
          i++;
          if (i < items.length) { api.hush && api.hush(); show(); }
          else { q.textContent = 'All done.'; st.textContent = ''; ui.querySelector('.chips').style.display = 'none'; api.done(endMsg); }
        }, 1900);
      } else api.say(`Not ${b.dataset.v}. Have another go.`, 'bad');
    });
    show();
  }

  /* ===================================================================
     MARINE ANIMALS AND HABITAT
     =================================================================== */
  P.push({
    type: 'learn', title: 'Anchor on sand',
    html: `<p>Damaging the seabed with your anchor is an act of vandalism you may never realise you're committing.</p>
<p>Reefs and seagrass beds are very important to sea life, so avoid anchoring on them. You can almost always find a patch of sand among them that your anchor won't hurt.</p>
<p>If you have no choice but to anchor on reef, use a specialised <b>reef anchor</b>. Some parts of marine parks have no-anchoring rules.</p>`,
    art(svg, S) {
      S.seaBg(svg, { top: '#BFDCDD', bottom: '#93C1C7', marks: false });
      const R = A.rng(7);
      // seagrass meadow
      const grass = A.g(svg);
      A.path(grass, 'M -20 300 C 80 260 200 250 300 290 C 360 315 380 380 340 440 C 300 500 160 520 60 600 L -20 620 Z', { fill: '#7FA27A', opacity: 0.85 });
      for (let k = 0; k < 140; k++) {
        const x = R() * 360 - 10, y = 280 + R() * 330;
        if (y < 300 - x * 0.05) continue;
        A.path(grass, `M ${x} ${y} q ${R() * 6 - 3} -10 ${R() * 4 - 2} -18`, { stroke: '#5E8459', 'stroke-width': 2.4, fill: 'none', 'stroke-linecap': 'round' });
      }
      // reef
      const reef = A.g(svg);
      A.path(reef, 'M 500 -20 C 520 60 600 110 700 120 C 760 126 800 160 830 200 L 830 -20 Z', { fill: C.reef, opacity: 0.85 });
      A.path(reef, 'M 560 380 C 600 340 700 330 760 360 C 820 390 820 480 760 520 C 700 560 600 560 560 500 C 530 460 530 410 560 380 Z', { fill: C.reef, opacity: 0.85 });
      for (let k = 0; k < 40; k++) { const x = 560 + R() * 230, y = 350 + R() * 190; if (((x - 670) / 120) ** 2 + ((y - 445) / 95) ** 2 < 1) A.circle(reef, x, y, 4 + R() * 9, { fill: '#B5755A', opacity: 0.8 }); }
      for (let k = 0; k < 30; k++) { const x = 560 + R() * 260, y = R() * 140; if (y < 120 * ((x - 500) / 330) + 10) A.circle(reef, x, y, 4 + R() * 8, { fill: '#B5755A', opacity: 0.8 }); }
      // sand patch
      A.path(svg, 'M 360 180 C 430 150 540 170 560 240 C 580 310 520 370 440 370 C 370 370 330 320 330 270 C 330 230 340 195 360 180 Z', { fill: '#EADBB3' });
      A.tag(svg, 150, 410, 'SEAGRASS', { fill: '#4C7048', size: 15 });
      A.tag(svg, 680, 445, 'REEF', { fill: '#8D4E35', size: 15 });
      A.tag(svg, 445, 330, 'SAND', { fill: C.ink, size: 15 });
      // anchor drop
      const wk = A.g(svg); S.wakes(wk);
      const b = S.boat(svg, { len: 110, color: C.port });
      const rode = A.path(svg, '', { stroke: C.ink, 'stroke-width': 2.5, fill: 'none', 'stroke-dasharray': '5 4' });
      const anc = A.g(svg, { opacity: 0 });
      A.circle(anc, 0, -12, 5, { fill: 'none', stroke: C.ink, 'stroke-width': 3 });
      A.path(anc, 'M 0 -7 L 0 12 M -10 4 Q -10 14 0 14 Q 10 14 10 4', { stroke: C.ink, 'stroke-width': 3.5, fill: 'none', 'stroke-linecap': 'round' });
      const ripple = A.circle(svg, 450, 260, 6, { fill: 'none', stroke: '#fff', 'stroke-width': 3, opacity: 0 });
      S.loop(() => { if (+anc.getAttribute('opacity') > 0 || gsap.getProperty(anc, 'opacity') > 0) rode.setAttribute('d', `M ${b.x + 44} ${b.y} L ${gsap.getProperty(anc, 'x')} ${gsap.getProperty(anc, 'y')}`); else rode.setAttribute('d', ''); });
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
      tl.set(b, { x: -100, y: 220, rotation: 0 }).set(anc, { opacity: 0, x: 380, y: 220 })
        .to(b, { x: 330, duration: 4, ease: 'power2.out' })
        .set(anc, { opacity: 1, x: 380, y: 220 })
        .to(anc, { x: 450, y: 262, duration: 0.9, ease: 'power2.in' })
        .fromTo(ripple, { attr: { r: 6 }, opacity: 0.9 }, { attr: { r: 40 }, opacity: 0, duration: 1.2 }, '>-0.05')
        .to(b, { x: 300, rotation: -10, duration: 3, ease: 'sine.inOut' }, '<')
        .to({}, { duration: 3 })
        .to([anc, b], { opacity: 0, duration: 0.5 })
        .set(b, { opacity: 1 });
    }
  });

  P.push({
    type: 'learn', title: 'Give wildlife space',
    html: `<p>Don't try to get close to <b>sea lions</b>, <b>whales</b>, <b>dolphins</b> or <b>whale sharks</b>. They can become distressed, especially if they have babies with them.</p>
<p>Keep your speed low enough to make very little wash near wildlife, and keep noise down.</p>`,
    art(svg, S) {
      S.seaBg(svg);
      const pod = A.g(svg);
      const mum = whale(pod, 420, 260, 1.5, -8), calf = whale(pod, 470, 330, 0.75, -8);
      gsap.to(pod, { x: '-=30', y: '+=6', duration: 9, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      const dg = A.g(svg);
      [[150, 470, 0], [200, 500, 8], [110, 520, -6]].forEach(([x, y, r]) => dolphin(dg, x, y, 1, r - 20));
      gsap.to(dg, { x: '+=40', y: '-=20', duration: 6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      // sea lion on a rock
      A.path(svg, 'M 620 470 C 640 430 720 420 760 450 C 790 475 770 520 720 525 C 670 530 610 510 620 470 Z', { fill: '#A79E8C' });
      A.path(svg, 'M 650 465 C 670 450 720 452 740 466 L 760 460 L 752 474 C 730 486 680 488 655 480 Z', { fill: '#6A5340' });
      A.ring(svg, 440, 290, 175, { color: C.ink2, fill: 'rgba(18,38,58,0.04)', dash: '10 8' });
      A.tag(svg, 440, 115, 'KEEP YOUR DISTANCE', { fill: C.ink2, size: 15 });
      const wk = A.g(svg); S.wakes(wk);
      const b = S.boat(svg, { len: 90, color: C.port });
      gsap.timeline({ repeat: -1 }).set(b, { x: 860, y: 90, rotation: 170 })
        .to(b, { motionPath: { path: 'M 860 90 C 700 60 300 50 140 120 C 30 170 10 300 -120 360', autoRotate: true }, duration: 16, ease: 'none' });
    }
  });

  P.push({
    type: 'learn', title: 'Wake, wash and noise',
    html: `<p>Careless driving is a form of pollution too. Wake and wash can damage boats on moorings and in pens, and injure the people on board.</p>
<p>Near these areas, and near wildlife, keep your speed low enough to make <b>negligible wash</b>.</p>
<p>Limit the noise you control, such as music, and make sure your exhaust hasn't become louder as your motor has aged.</p>`,
    art(svg, S) {
      sky(svg);
      A.rect(svg, 0, 300, 800, 26, { fill: '#B68E62' });
      for (let x = 30; x < 800; x += 120) A.rect(svg, x, 300, 10, 140, { fill: '#7A5A39' });
      const moored = A.g(svg);
      const ms = A.boatSide(moored, { x: 520, y: 380, len: 260, color: C.stbd, flip: true });
      const pp = A.person(ms.crew, { x: -10, y: -30, s: 0.7, side: true, color: C.ink, vest: C.orange, fwdR: 30 });
      const water = A.waterSide(svg, 382, { amp: 3 });
      const passer = A.g(svg);
      A.boatSide(passer, { len: 170, color: C.port });
      svg.appendChild(water);
      const fastTag = A.g(svg, { opacity: 0 }); A.tag(fastTag, 400, 120, 'TOO FAST: WASH ROCKS MOORED BOATS', { fill: C.port });
      const slowTag = A.g(svg, { opacity: 0 }); A.tag(slowTag, 400, 120, 'SLOW: NEGLIGIBLE WASH', { fill: C.stbd });
      const crest = A.path(svg, 'M -50 0 Q 0 -30 50 0', { fill: 'rgba(255,255,255,0.9)', stroke: '#fff', 'stroke-width': 3, opacity: 0 });
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });
      tl.set(passer, { x: -200, y: 460 })
        .to(fastTag, { opacity: 1, duration: 0.3 }, 0)
        .to(passer, { x: 1000, duration: 2.6, ease: 'none' }, 0)
        .fromTo(crest, { x: 300, y: 400, opacity: 1 }, { x: 520, y: 384, duration: 1.2, ease: 'none' }, 1.2)
        .to(crest, { opacity: 0, duration: 0.3 }, 2.4)
        .to(moored, { rotation: 6, svgOrigin: '520 380', duration: 0.35, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 2.3)
        .to(fastTag, { opacity: 0, duration: 0.3 }, 4.6)
        .set(passer, { x: -200 }, 4.8)
        .to(slowTag, { opacity: 1, duration: 0.3 }, 5)
        .to(passer, { x: 1000, duration: 9, ease: 'none' }, 5)
        .to(moored, { rotation: 1, svgOrigin: '520 380', duration: 1.2, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 9)
        .to(slowTag, { opacity: 0, duration: 0.3 }, 14);
    }
  });

  /* ===================================================================
     SEWAGE AND POLLUTION
     =================================================================== */
  P.push({
    type: 'watch', title: 'What sewage does',
    html: `<p>Sewage from boats lowers water quality and creates a health risk, especially at popular spots. Watch what happens when too much of it ends up in the water.</p>`,
    anim(svg, S) {
      const id = A.uid('uw');
      const lg = A.el('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 }, A.defs(svg));
      A.el('stop', { offset: 0, 'stop-color': '#86BCC6' }, lg);
      A.el('stop', { offset: 1, 'stop-color': '#2C6478' }, lg);
      sky(svg, '#E4EFEE', '#F2ECDD');
      A.rect(svg, 0, 160, 800, 440, { fill: `url(#${id})` });
      A.path(svg, 'M 0 560 C 200 540 400 570 600 545 C 700 535 760 550 800 545 L 800 600 L 0 600 Z', { fill: '#CDB98B' });
      const R = A.rng(3);
      for (let k = 0; k < 26; k++) { const x = 20 + k * 30 + R() * 10; A.path(svg, `M ${x} 560 q ${R() * 10 - 5} -30 ${R() * 8 - 4} -${40 + R() * 30}`, { stroke: '#5E8459', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }); }
      const boat = A.g(svg); A.boatSide(boat, { x: 260, y: 162, len: 240, color: C.sea4 });
      A.waterSide(svg, 162, { amp: 3, opacity: 0.35 });
      // nutrients
      const nut = A.g(svg); const dots = [];
      for (let k = 0; k < 40; k++) dots.push(A.circle(nut, 250, 190, 3 + R() * 3, { fill: '#8A6A3A', opacity: 0 }));
      // algae
      const alg = A.g(svg); const blobs = [];
      for (let k = 0; k < 70; k++) blobs.push(A.circle(alg, 20 + R() * 760, 175 + R() * 70, 6 + R() * 12, { fill: k % 3 ? '#7FAE4E' : '#9CC25F', opacity: 0 }));
      // fish
      const fishes = [[420, 380, C.buoy], [560, 440, C.orange], [300, 470, '#E3C547'], [650, 340, C.buoy]].map(([x, y, c]) => fish(svg, x, y, 1.3, c));
      fishes.forEach((f, k) => gsap.to(f.b, { x: k % 2 ? -14 : 14, duration: 1.6 + k * 0.3, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
      // oxygen meter
      const om = A.g(svg, { transform: 'translate(730,260)' });
      A.rect(om, -22, 0, 44, 200, { rx: 12, fill: 'rgba(255,253,248,0.85)', stroke: C.ink, 'stroke-width': 2 });
      const lvl = A.rect(om, -14, 8, 28, 184, { rx: 7, fill: '#5CA8D8' });
      A.text(om, 0, -12, 'OXYGEN', { size: 15, weight: 700, anchor: 'middle', fill: '#fff', ls: '0.1em' });
      // bacteria
      const bac = A.g(svg, { opacity: 0 });
      for (let k = 0; k < 12; k++) { const x = 120 + R() * 520, y = 280 + R() * 220; A.rect(bac, x, y, 22, 9, { rx: 4.5, fill: '#B0476B', transform: `rotate(${R() * 180} ${x + 11} ${y + 4.5})` }); }
      const cap = caption(svg, 300);
      const tl = gsap.timeline();
      cap.show(tl, 0, 'Sewage released from a boat adds nutrients to the water.');
      dots.forEach((d, k) => tl.fromTo(d, { attr: { cx: 250, cy: 190 }, opacity: 0.9 }, { attr: { cx: 250 + (R() - 0.5) * 520, cy: 190 + R() * 60 }, duration: 3, ease: 'power2.out' }, 0.6 + k * 0.03));
      cap.show(tl, 4.2, 'Large amounts of nutrients feed an algal bloom.');
      tl.to(dots, { opacity: 0, duration: 1 }, 4.4);
      blobs.forEach((b, k) => tl.fromTo(b, { attr: { r: 1 }, opacity: 0 }, { attr: { r: b.getAttribute('r') }, opacity: 0.85, duration: 1.2, ease: 'back.out(2)' }, 4.6 + k * 0.03));
      cap.show(tl, 8.4, 'The bloom uses up the oxygen in the water.');
      tl.to(lvl, { attr: { y: 160, height: 32 }, fill: C.port, duration: 3, ease: 'power1.in' }, 8.6);
      cap.show(tl, 12, 'Without oxygen, larger marine life dies.');
      fishes.forEach((f, k) => { tl.to(f, { rotation: 180, svgOrigin: `${[420, 560, 300, 650][k]} ${[380, 440, 470, 340][k]}`, duration: 1.2, ease: 'power2.inOut' }, 12.4 + k * 0.25); tl.to(f, { opacity: 0.45, duration: 1 }, 12.6 + k * 0.25); });
      cap.show(tl, 15.6, 'Bacteria in sewage can make people sick, by contact or by eating seafood.');
      tl.to(bac, { opacity: 1, duration: 0.8 }, 15.8);
      tl.to({}, { duration: 3 });
      return tl;
    }
  });

  P.push({
    type: 'learn', title: 'Cutting down on sewage',
    html: `<p>You can reduce the sewage released into the water by:</p>
<ul><li>using <b>shore toilets</b> when you're in harbour, rather than your boat's toilet</li><li>fitting an <b>approved sewage treatment system</b> to your boat, if possible</li></ul>
<p>The State Government has also set up <b>three sewage discharge zones</b>, based on the risk to public health and the environment.</p>`,
    art(svg, S) {
      sky(svg);
      A.path(svg, 'M -20 300 L 820 300 L 820 620 L -20 620 Z', { fill: '#BCD9DE' });
      A.path(svg, 'M -20 240 L 420 240 L 420 330 L -20 330 Z', { fill: '#C9C2B2' });
      // toilet block
      const tb = A.g(svg, { transform: 'translate(130,110)' });
      A.rect(tb, 6, 10, 200, 130, { fill: 'rgba(18,38,58,0.15)' });
      A.rect(tb, 0, 0, 200, 130, { fill: C.white, stroke: C.ink, 'stroke-width': 2.5 });
      A.path(tb, 'M -14 0 L 100 -44 L 214 0 Z', { fill: C.sea4, stroke: C.ink, 'stroke-width': 2.5, 'stroke-linejoin': 'round' });
      A.rect(tb, 30, 50, 46, 80, { fill: C.ink2 }); A.rect(tb, 124, 50, 46, 80, { fill: C.ink2 });
      const icon = (x, skirt) => { A.circle(tb, x, 28, 7, { fill: C.ink }); A.path(tb, skirt ? `M ${x - 9} 54 L ${x - 5} 38 L ${x + 5} 38 L ${x + 9} 54 Z` : `M ${x - 6} 54 L ${x - 6} 38 L ${x + 6} 38 L ${x + 6} 54 Z`, { fill: C.ink }); };
      icon(53, false); icon(147, true);
      A.tag(svg, 230, 76, 'SHORE FACILITIES', { fill: C.stbd, size: 15 });
      const wk = A.g(svg); S.wakes(wk);
      const b = S.boat(svg, { x: 610, y: 420, r: 180, len: 150, color: C.port, wake: false });
      gsap.to(b, { rotation: 183, duration: 2.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      A.tag(svg, 610, 510, 'TIED UP IN HARBOUR', { fill: C.ink, size: 15 });
      const walk = A.path(svg, 'M 560 400 C 520 350 460 330 420 300 C 380 270 340 260 300 250', { fill: 'none', stroke: C.stbd, 'stroke-width': 3, 'stroke-dasharray': '2 9', 'stroke-linecap': 'round' });
      gsap.fromTo(walk, { strokeDashoffset: 0 }, { strokeDashoffset: -44, duration: 1.2, repeat: -1, ease: 'none' });
    }
  });

  P.push({
    type: 'learn', title: 'Pollution is serious',
    html: `<p>WA has over 13,500 km of coastline, with sea life found nowhere else in the world. Protecting it is everyone's responsibility.</p>
<p>State and Commonwealth laws cover every kind of marine pollution: rubbish, oil, plastics and sewage. Penalties can reach <b>$200,000</b> for a person and <b>$1,000,000</b> for a company.</p>`,
    art(svg, S) {
      A.paperBg(svg);
      const card = (x, y, big, small, col, d) => {
        const g = A.g(svg, { transform: `translate(${x},${y})` });
        A.rect(g, 6, 8, 300, 200, { rx: 18, fill: 'rgba(18,38,58,0.15)' });
        A.rect(g, 0, 0, 300, 200, { rx: 18, fill: C.white, stroke: C.line, 'stroke-width': 1.5 });
        A.rect(g, 0, 0, 300, 12, { rx: 6, fill: col });
        const t = A.text(g, 150, 112, '$0', { size: 64, weight: 700, anchor: 'middle', fill: C.ink });
        A.text(g, 150, 160, small, { size: 22, weight: 700, anchor: 'middle', fill: C.ink3, ls: '0.14em' });
        const st = { v: 0 };
        gsap.to(st, { v: big, duration: 1.8, delay: d, ease: 'power2.out', onUpdate: () => t.textContent = '$' + (Math.round(st.v / 1000) * 1000).toLocaleString('en-AU') });
        return g;
      };
      card(70, 170, 200000, 'A PERSON', C.port, 0.3);
      card(430, 170, 1000000, 'A COMPANY', C.deep, 0.6);
      A.text(svg, 400, 120, 'MAXIMUM PENALTY', { size: 26, weight: 700, anchor: 'middle', fill: C.ink2, ls: '0.2em' });
    }
  });

  /* rubbish distances */
  P.push({
    type: 'learn', title: "What can't go overboard",
    html: `<p>Small boats should store all rubbish, oily water and chemicals on board, and get rid of them properly back in port. The rules for dumping are:</p>
<ul><li><b>Oil, chemicals or plastic:</b> never, anywhere. Plastic includes synthetic rope, fishing line and nets.</li><li><b>Floating rubbish:</b> not within <b>25 nautical miles</b> of land.</li><li><b>Garbage</b> such as food, paper, rags, glass or metal: not within <b>12 nautical miles</b> of land, or <b>3 nautical miles</b> if it has been through an approved grinder.</li></ul>`,
    art(svg, S) {
      S.seaBg(svg);
      const X = nm => 100 + nm * 22;
      A.land(svg, 'M -20 -20 L 70 -20 C 90 100 60 200 90 300 C 110 400 70 500 90 620 L -20 620 Z');
      [3, 12, 25].forEach(nm => {
        A.line(svg, X(nm), 40, X(nm), 440, { stroke: C.ink2, 'stroke-width': 2, 'stroke-dasharray': '7 7' });
        A.tag(svg, X(nm), 40, nm + ' nm', { fill: C.ink, size: 16 });
      });
      [[(X(3) + X(12)) / 2, ['GROUND-UP', 'GARBAGE OK'], C.ink2], [(X(12) + X(25)) / 2, ['ALL GARBAGE', 'OK'], C.ink2], [(X(25) + 800) / 2, ['FLOATING', 'RUBBISH OK'], C.ink2]].forEach(([x, t, col], k) => {
        const g = A.g(svg); A.text(g, x, 220, t[0], { size: 19, weight: 700, anchor: 'middle', fill: col, ls: '0.06em' }); A.text(g, x, 244, t[1], { size: 19, weight: 700, anchor: 'middle', fill: col, ls: '0.06em' });
        gsap.from(g, { opacity: 0, y: '+=10', duration: 0.5, delay: 0.3 + k * 0.25 });
      });
      A.rect(svg, 120, 470, 560, 70, { rx: 14, fill: 'rgba(200,53,43,0.1)', stroke: C.port, 'stroke-width': 2 });
      A.text(svg, 400, 513, 'OIL, CHEMICALS, PLASTIC: NEVER', { size: 24, weight: 700, anchor: 'middle', fill: C.port, ls: '0.06em' });
    }
  });

  P.push({
    type: 'try', title: 'How far out?',
    html: `<p>Slide the boat further from land. Watch what may and may not go overboard at each distance.</p>`,
    lockMsg: 'Visit all four distance bands',
    build(svg, S, api) {
      S.seaBg(svg);
      const X = nm => 110 + nm * 22;
      A.land(svg, 'M -20 -20 L 70 -20 C 90 100 60 200 90 300 C 110 400 70 500 90 620 L -20 620 Z');
      A.tree(svg, 30, 120, 18); A.tree(svg, 45, 420, 15);
      [3, 12, 25].forEach(nm => { A.line(svg, X(nm), 30, X(nm), 330, { stroke: C.ink2, 'stroke-width': 2, 'stroke-dasharray': '7 7' }); A.tag(svg, X(nm), 30, nm + ' nm', { fill: C.ink, size: 15 }); });
      const wk = A.g(svg); S.wakes(wk);
      const b = S.boat(svg, { x: X(1), y: 200, len: 80, color: C.port });
      const items = [['Oil or oily bilge water', () => false], ['Plastic, rope, fishing line', () => false], ['Food, paper, glass, metal', nm => nm >= 12], ['Same garbage, ground up', nm => nm >= 3], ['Floating rubbish', nm => nm >= 25]];
      const rows = items.map(([t], k) => {
        const g = A.g(svg, { transform: `translate(120,${370 + k * 44})` });
        A.rect(g, 0, -18, 560, 38, { rx: 10, fill: C.white, opacity: 0.92 });
        A.text(g, 52, 7, t, { font: 'body', size: 18, fill: C.ink });
        const ic = A.g(g, { transform: 'translate(24,1)' });
        const lab = A.text(g, 548, 7, '', { size: 18, weight: 700, anchor: 'end' });
        return { ic, lab };
      });
      const ui = document.createElement('div');
      ui.innerHTML = `<label for="nm" style="font-weight:700">Distance from land: <span id="nmv">1</span> nm</label><input id="nm" class="range" type="range" min="0" max="28" step="1" value="1"><div class="status" id="bands">Bands visited: 1 of 4</div>`;
      api.task.appendChild(ui);
      const inp = ui.querySelector('#nm'), nmv = ui.querySelector('#nmv'), bands = ui.querySelector('#bands');
      const seen = new Set();
      const update = nm => {
        nmv.textContent = nm;
        gsap.to(b, { x: X(Math.max(nm, 0.6)), duration: 0.5, ease: 'power2.out' });
        rows.forEach((r, k) => {
          const ok = items[k][1](nm);
          r.ic.innerHTML = ''; A.tick(r.ic, 0, 0, 13, ok);
          r.lab.textContent = ok ? 'Allowed' : 'Not allowed';
          r.lab.setAttribute('fill', ok ? C.stbd : C.port);
        });
        seen.add(nm < 3 ? 0 : nm < 12 ? 1 : nm < 25 ? 2 : 3);
        bands.textContent = `Bands visited: ${seen.size} of 4`;
        if (seen.size === 4 && !api.complete) api.done('Oil and plastic are never allowed, however far out you are.');
      };
      inp.oninput = () => update(+inp.value);
      update(1);
    }
  });

  P.push({
    type: 'learn', title: 'Bilges and refuelling',
    html: `<p><b>Bilges:</b> keep them clean and dry. An automatic bilge pump that pumps oily water overboard will land you in trouble. Check fuel lines and seals, fix oil leaks quickly, fit a drip tray under the engine, and use oil-absorbent material if it leaks.</p>
<p><b>Refuelling</b> is the most common time for spills. Avoid overfilling by:</p>
<ul><li>knowing how much fuel you need, leaving room for it to expand</li><li>never leaving the nozzle unattended</li><li>listening for fuel blowing back from the tank breather, and slowing down</li></ul>`,
    art(svg, S) {
      A.paperBg(svg);
      const t = A.g(svg, { transform: 'translate(200,200)' });
      A.rect(t, 8, 10, 400, 230, { rx: 26, fill: 'rgba(18,38,58,0.15)' });
      A.rect(t, 0, 0, 400, 230, { rx: 26, fill: C.white, stroke: C.ink, 'stroke-width': 4 });
      const cid = A.uid('tk');
      const cp = A.el('clipPath', { id: cid }, A.defs(svg)); A.rect(cp, 200, 200, 400, 230, { rx: 26 });
      const fuel = A.rect(svg, 200, 430, 400, 0, { fill: C.buoy, 'clip-path': `url(#${cid})` });
      const lineY = 200 + 230 * 0.18;
      A.line(svg, 190, lineY, 610, lineY, { stroke: C.port, 'stroke-width': 2.5, 'stroke-dasharray': '8 6' });
      A.tag(svg, 670, lineY, 'STOP HERE', { fill: C.port, size: 15 });
      A.tag(svg, 400, lineY - 26, 'ROOM TO EXPAND', { fill: C.ink2, size: 14 });
      // filler and breather
      A.rect(svg, 240, 150, 40, 54, { fill: C.ink2 });
      A.path(svg, 'M 230 70 L 300 70 L 300 100 L 268 100 L 268 150 L 252 150 L 252 100 L 230 100 Z', { fill: C.ink });
      A.rect(svg, 540, 160, 14, 44, { fill: C.ink2 }); A.path(svg, 'M 536 160 L 580 160 L 580 150 L 536 150 Z', { fill: C.ink2 });
      A.tag(svg, 600, 120, 'BREATHER', { fill: C.ink, size: 14 });
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 });
      tl.set(fuel, { attr: { y: 430, height: 0 } }).to(fuel, { attr: { y: lineY, height: 430 - lineY }, duration: 5, ease: 'power1.inOut' }).to({}, { duration: 1.5 }).to(fuel, { opacity: 0, duration: 0.4 }).set(fuel, { opacity: 1 });
    }
  });

  P.push({
    type: 'learn', title: 'Reporting a spill',
    html: `<p>Under WA law, the polluter must report any spill of oil or noxious substances to the Department of Transport. There are penalties for not reporting. Give:</p>
<ul><li>when and where it happened</li><li>the name and registration number of the vessel</li><li>the type and size of the pollution</li><li>anything else that's relevant</li></ul>
<p>Oil Spill Response Coordination Unit, 24 hours: <b>(08) 9480 9924</b></p>`,
    art(svg, S) {
      S.seaBg(svg);
      const id = A.uid('sheen');
      const rg = A.el('radialGradient', { id }, A.defs(svg));
      [['0', '#5B6E8C', 0.55], ['0.4', '#7FA06A', 0.45], ['0.7', '#C9A46A', 0.4], ['1', '#9C7BB0', 0]].forEach(([o, c, a]) => A.el('stop', { offset: o, 'stop-color': c, 'stop-opacity': a }, rg));
      const sheen = A.path(svg, 'M 120 260 C 160 170 330 160 400 210 C 470 260 440 360 340 390 C 240 420 90 350 120 260 Z', { fill: `url(#${id})` });
      gsap.fromTo(sheen, { scale: 0.6, svgOrigin: '280 280' }, { scale: 1.05, svgOrigin: '280 280', duration: 6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      const ph = A.g(svg, { transform: 'translate(500,110)' });
      A.rect(ph, 8, 10, 210, 380, { rx: 30, fill: 'rgba(18,38,58,0.2)' });
      A.rect(ph, 0, 0, 210, 380, { rx: 30, fill: C.ink });
      A.rect(ph, 12, 40, 186, 300, { rx: 10, fill: C.white });
      A.text(ph, 105, 92, 'OIL SPILL', { size: 22, weight: 700, anchor: 'middle', fill: C.ink3, ls: '0.12em' });
      A.text(ph, 105, 116, 'REPORTING 24 HR', { size: 16, weight: 700, anchor: 'middle', fill: C.ink3, ls: '0.1em' });
      A.text(ph, 105, 168, '(08)', { size: 30, weight: 700, anchor: 'middle', fill: C.ink });
      A.text(ph, 105, 208, '9480 9924', { size: 36, weight: 700, anchor: 'middle', fill: C.ink });
      const call = A.g(ph, { transform: 'translate(105,280)' });
      A.circle(call, 0, 0, 30, { fill: C.stbd });
      A.path(call, 'M -12 -12 C -14 -2 -4 12 10 13 L 14 6 L 6 2 L 2 6 C -3 4 -6 0 -7 -5 L -3 -8 L -7 -16 Z', { fill: '#fff' });
      gsap.to(call, { scale: 1.12, svgOrigin: '605 390', duration: 0.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    }
  });

  /* ===================================================================
     REGISTRATION
     =================================================================== */
  P.push({
    type: 'learn', title: 'Which boats are registered?',
    html: `<p>Any vessel that is, or can be, driven by mechanical power must be registered with the Department of Transport, with an annual fee. That includes <b>electric motors</b> and <b>sailing boats</b> that can take a motor.</p>
<p>Fees help pay for ramps, jetties, navigation aids, patrols and safety education.</p>
<p>Boats registered in another state can be used here for <b>3 months</b> before they must be registered in WA (<b>30 days</b> from the Northern Territory).</p>`,
    art(svg, S) {
      A.paperBg(svg);
      const row = (y, label, draw, ok, d) => {
        const g = A.g(svg, { transform: `translate(0,${y})` });
        A.rect(g, 60, -56, 680, 112, { rx: 18, fill: C.white, stroke: C.line });
        draw(A.g(g, { transform: 'translate(190,10)' }));
        A.text(g, 330, 8, label, { font: 'body', size: 22, weight: 700, fill: C.ink });
        A.tick(g, 680, 0, 24, ok);
        gsap.from(g, { opacity: 0, x: '-=20', duration: 0.5, delay: d, ease: 'power2.out' });
      };
      row(110, 'Motor boat', g => A.boatSide(g, { len: 160, color: C.port }), true, 0.1);
      row(240, 'Yacht that can take a motor', g => { g.setAttribute('transform', 'translate(190,22)'); yachtSide(g, 90); }, true, 0.25);
      row(370, 'Electric motor boat', g => A.boatSide(g, { len: 160, color: C.stbd }), true, 0.4);
      row(500, 'Canoe or surf ski, no motor', g => { A.path(g, 'M -90 -10 C -40 -22 40 -22 90 -10 C 40 0 -40 0 -90 -10 Z', { fill: C.buoy, stroke: C.ink, 'stroke-width': 2 }); }, false, 0.55);
    }
  });

  P.push({
    type: 'learn', title: 'Tenders',
    html: `<p>A <span class="term">tender</span> is the small boat that ferries people between a bigger boat and the shore. It doesn't need to be registered if it:</p>
<ul><li>is no more than <b>3.1 metres</b> long</li><li>has a motor no bigger than <b>5 hp (3.73 kW)</b></li><li>is only used as a lifeboat or for ship-to-shore trips from its parent vessel</li></ul>
<p>A tender must still carry the safety gear required for where it's used.</p>`,
    art(svg, S) {
      S.seaBg(svg);
      const wk = A.g(svg); S.wakes(wk);
      const parent = S.boat(svg, { x: 520, y: 220, r: 200, len: 260, color: C.deep, wake: false });
      gsap.to(parent, { rotation: 203, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      const t = S.boat(svg, { type: 'tender', len: 66, color: '#9DA8B0' });
      A.land(svg, 'M -20 420 C 120 400 250 470 360 520 C 420 548 460 600 470 620 L -20 620 Z');
      A.tree(svg, 60, 520, 20); A.tree(svg, 140, 560, 16);
      gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 1.2 })
        .fromTo(t, { x: 450, y: 290, rotation: 150 }, { motionPath: { path: 'M 450 290 C 380 330 320 380 250 430', autoRotate: true }, duration: 5, ease: 'power1.inOut' });
      A.tag(svg, 600, 470, 'UP TO 3.1 m AND 5 hp', { fill: C.ink });
    }
  });

  P.push({
    type: 'learn', title: 'Buying and selling',
    html: `<p>Tell the Department of Transport when things change:</p>
<ul><li>the <b>owner</b> has <b>15 days</b> to report changes to the boat's details or their address</li><li>the <b>seller</b> has <b>7 days</b> after selling the boat</li><li>the <b>buyer</b> has <b>15 days</b> after buying it</li></ul>
<p>Each year you pay the fee, you get a new <span class="term">registration label</span>. It is colour coded and shows the month and year it expires.</p>`,
    art(svg, S) {
      A.paperBg(svg);
      [[150, 'SELLER', 7, C.port], [400, 'BUYER', 15, C.stbd], [650, 'OWNER', 15, C.deep]].forEach(([x, who, d, col], k) => {
        const g = A.g(svg, { transform: `translate(${x - 90},140)` });
        A.rect(g, 6, 8, 180, 200, { rx: 16, fill: 'rgba(18,38,58,0.15)' });
        A.rect(g, 0, 0, 180, 200, { rx: 16, fill: C.white, stroke: C.line });
        A.path(g, 'M 0 16 Q 0 0 16 0 L 164 0 Q 180 0 180 16 L 180 50 L 0 50 Z', { fill: col });
        [40, 140].forEach(rx => A.rect(g, rx - 5, -12, 10, 26, { rx: 5, fill: C.ink2 }));
        A.text(g, 90, 34, who, { size: 22, weight: 700, anchor: 'middle', fill: '#fff', ls: '0.12em' });
        A.text(g, 90, 140, String(d), { size: 80, weight: 700, anchor: 'middle', fill: C.ink });
        A.text(g, 90, 178, 'DAYS', { size: 20, weight: 700, anchor: 'middle', fill: C.ink3, ls: '0.2em' });
        gsap.from(g, { y: '+=24', opacity: 0, duration: 0.6, delay: 0.2 + k * 0.18, ease: 'back.out(1.6)' });
      });
      const lab = A.g(svg, { transform: 'translate(300,400)' });
      A.rect(lab, 0, 0, 200, 120, { rx: 14, fill: C.buoy, stroke: C.ink, 'stroke-width': 2 });
      A.text(lab, 100, 38, 'AB123', { size: 30, weight: 700, anchor: 'middle', fill: C.ink });
      A.text(lab, 100, 72, 'EXPIRES', { size: 16, weight: 700, anchor: 'middle', fill: C.ink2, ls: '0.14em' });
      A.text(lab, 100, 100, '03 / 2027', { size: 24, weight: 700, anchor: 'middle', fill: C.ink });
      gsap.from(lab, { rotation: -8, svgOrigin: '400 460', opacity: 0, duration: 0.6, delay: 0.8, ease: 'back.out(2)' });
    }
  });

  P.push({
    type: 'learn', title: 'Where the numbers go',
    html: `<ul><li><b>Motor boats:</b> midships, on both sides, clearly visible and not under the flare of the bow. 150 mm high, 25 mm wide.</li><li><b>Yachts:</b> on the side, just forward of the transom (the flat back). 50 mm high, 12 mm wide.</li><li><b>Tenders:</b> the parent vessel's number on each side, forward of the transom. 50 mm high, 12 mm wide.</li><li><b>PWCs:</b> both sides, clearly visible. 100 mm high, 25 mm wide, black on white.</li></ul>
<p>The label goes on the <b>port</b> (left) side, next to the numbers.</p>`,
    art(svg, S) {
      sky(svg);
      const mb = A.g(svg);
      const bs = A.boatSide(mb, { x: 400, y: 330, len: 440, color: C.sea4, flip: true });
      A.waterSide(svg, 332, { amp: 4 });
      const n = A.g(svg);
      A.text(n, 400, 290, 'AB123', { size: 34, weight: 700, anchor: 'middle', fill: C.ink, ls: '0.06em' });
      A.rect(n, 470, 266, 40, 30, { rx: 4, fill: C.buoy, stroke: C.ink, 'stroke-width': 1.5 });
      A.tag(svg, 400, 170, 'MIDSHIPS, NOT UNDER THE BOW FLARE', { fill: C.ink, size: 15 });
      A.tag(svg, 600, 420, 'LABEL: PORT SIDE, NEXT TO NUMBERS', { fill: C.port, size: 15 });
      A.arrow(svg, 'M 560 405 C 540 370 510 330 495 304', { color: C.port, width: 3 });
      A.text(svg, 230, 480, 'BOW', { size: 18, weight: 700, fill: C.ink2, ls: '0.2em', anchor: 'middle' });
      A.arrow(svg, 'M 280 474 L 160 474', { color: C.ink2, width: 3 });
      gsap.from(n, { opacity: 0, y: '-=12', duration: 0.6, delay: 0.4 });
    }
  });

  P.push({
    type: 'try', title: 'Put the numbers on',
    html: `<p>For each craft, tap the part of the hull where its registration numbers belong.</p>`,
    lockMsg: 'Place the numbers on all four craft',
    build(svg, S, api) {
      sky(svg);
      const stage = A.g(svg);
      const water = A.waterSide(svg, 382, { amp: 4 });
      const crafts = [
        { name: 'Motor boat', a: 'mid', draw: g => A.boatSide(g, { len: 420, color: C.sea4 }), L: 420, h: 0.15, size: '150 mm high, 25 mm wide', why: 'Midships on both sides, clear of the bow flare.' },
        { name: 'Yacht', a: 'aft', draw: g => yachtSide(g, 340), L: 340, h: 0.12, size: '50 mm high, 12 mm wide', why: 'Just forward of the transom.' },
        { name: 'Tender', a: 'aft', draw: g => tenderSide(g, 220), L: 220, h: 0.2, size: '50 mm high, 12 mm wide', why: "The parent vessel's number, forward of the transom." },
        { name: 'PWC', a: 'mid', draw: g => pwcSide(g, 300), L: 300, h: 0.14, size: '100 mm high, 25 mm wide, black on white', why: 'Both sides, where they are clearly visible.' }
      ];
      const ui = document.createElement('div');
      ui.innerHTML = `<p class="q" style="margin-bottom:6px"></p><div class="status"></div>`;
      api.task.appendChild(ui);
      const q = ui.querySelector('.q'), st = ui.querySelector('.status');
      let i = 0, busy = false;
      const show = () => {
        stage.innerHTML = '';
        const c = crafts[i];
        const g = A.g(stage, { transform: 'translate(400,380)' });
        c.draw(g);
        const h = c.L * c.h;
        const zones = [['bow', c.L * 0.22, c.L * 0.5], ['mid', -c.L * 0.15, c.L * 0.18], ['aft', -c.L * 0.5, -c.L * 0.2]];
        zones.forEach(([k, x0, x1]) => {
          const z = A.rect(g, x0, -h * 1.15, x1 - x0, h * 1.05, { rx: 8, fill: 'rgba(240,178,26,0.18)', stroke: C.ink, 'stroke-width': 2.5, 'stroke-dasharray': '7 6', opacity: 0.9, style: 'cursor:pointer' });
          z.addEventListener('click', () => {
            if (busy) return;
            if (k === c.a) {
              busy = true;
              z.setAttribute('stroke', C.stbd); z.setAttribute('opacity', 1);
              const t = A.text(g, (x0 + x1) / 2, -h * 0.45, 'AB123', { size: Math.min(30, h * 0.6), weight: 700, anchor: 'middle', fill: C.ink, ls: '0.04em' });
              gsap.from(t, { opacity: 0, duration: 0.4 });
              api.say(`<b>${c.name}:</b> ${c.why} ${c.size}.`, 'good');
              setTimeout(() => {
                busy = false; i++;
                if (i < crafts.length) { show(); }
                else { q.textContent = 'All four done.'; st.textContent = ''; api.done('And remember: the registration label goes on the port side, next to the numbers.'); }
              }, 2200);
            } else {
              api.say(k === 'bow' ? 'Numbers under the bow flare are hard to see. Try again.' : 'Not quite. Try another part of the hull.', 'bad');
              gsap.fromTo(z, { stroke: C.port }, { stroke: C.ink, duration: 0.8 });
            }
          });
        });
        gsap.from(g, { x: '-=60', opacity: 0, duration: 0.6, ease: 'power3.out' });
        q.textContent = c.name;
        st.textContent = `Craft ${i + 1} of ${crafts.length}`;
      };
      svg.appendChild(water);
      water.style.pointerEvents = 'none';
      A.text(svg, 120, 470, 'BOW', { size: 18, weight: 700, fill: '#fff', ls: '0.2em', anchor: 'middle' });
      A.arrow(svg, 'M 170 490 L 290 490', { color: '#fff', width: 3 });
      show();
    }
  });

  P.push({
    type: 'check', title: 'The label',
    q: 'Where must the registration label be stuck?',
    opts: ['On the starboard side, near the bow', 'On the port side, next to the numbers', 'On the transom, beside the motor', 'Inside the boat, near the console'], a: 1,
    why: 'The label goes on the port side of the vessel, next to the registration number.'
  });

  /* ===================================================================
     DIVING
     =================================================================== */
  P.push({
    type: 'watch', title: 'Divers below',
    html: `<p>A vessel with divers working from it must show the right day or night signal. Watch for the details.</p>`,
    anim(svg, S) {
      const day = A.g(svg);
      sky(day);
      A.waterSide(day, 400, { amp: 4 });
      const bt = A.g(day);
      const bs = A.boatSide(bt, { x: 300, y: 402, len: 300, color: C.sea4 });
      A.line(bt, 300, 340, 300, 190, { stroke: C.ink, 'stroke-width': 5, 'stroke-linecap': 'round' });
      const fl = A.flagA(bt, 302, 194, 150);
      const dims = A.g(day, { opacity: 0 });
      A.tag(dims, 377, 162, 'AT LEAST 750 mm', { fill: C.ink, size: 15 });
      A.tag(dims, 520, 242, '600 mm', { fill: C.ink, size: 15 });
      // buoy flag
      const bf = A.g(day, { opacity: 0, transform: 'translate(620,400)' });
      A.circle(bf, 0, 0, 18, { fill: C.orange, stroke: C.ink, 'stroke-width': 2 });
      A.line(bf, 0, -10, 0, -110, { stroke: C.ink, 'stroke-width': 3 });
      A.flagA(bf, 1, -110, 60);
      A.tag(bf, 0, 50, 'ON A BUOY: 300 x 200 mm', { fill: C.ink, size: 14 });
      // night
      const night = A.g(svg, { opacity: 0 });
      A.rect(night, 0, 0, 800, 600, { fill: C.night });
      A.waterSide(night, 400, { amp: 4, top: '#1B3550', bottom: '#0D1E30', opacity: 1 });
      const nb = A.g(night);
      A.boatSide(nb, { x: 300, y: 402, len: 300, color: C.sea4 });
      A.rect(nb, 0, 0, 800, 600, { fill: 'rgba(11,22,38,0.55)' });
      A.line(nb, 300, 340, 300, 150, { stroke: '#41546A', 'stroke-width': 5 });
      const lights = [[170, C.port], [210, '#FFFFFF'], [250, C.port]].map(([y, c]) => {
        const g = A.g(nb);
        A.circle(g, 300, y, 22, { fill: c, opacity: 0.25 });
        A.circle(g, 300, y, 9, { fill: c });
        return g;
      });
      A.tag(night, 470, 210, 'RED, WHITE, RED: ALL ROUND', { fill: C.port, size: 15 });
      const diver = A.g(night, { opacity: 0, transform: 'translate(640,396)' });
      A.circle(diver, 0, 0, 11, { fill: '#1A1A1A', stroke: '#41546A', 'stroke-width': 2 });
      const fl2 = A.circle(diver, 0, -24, 8, { fill: C.buoy });
      const fl2g = A.circle(diver, 0, -24, 30, { fill: C.buoy, opacity: 0.3 });
      A.tag(diver, -10, 50, 'NO BOAT: FLASHING YELLOW OR ORANGE', { fill: C.buoy, color: C.ink, size: 14 });
      const cap = caption(svg);
      const tl = gsap.timeline();
      cap.show(tl, 0, 'By day: International Code Flag "A", white and blue with a swallowtail.');
      tl.to(dims, { opacity: 1, duration: 0.4 }, 1.6);
      cap.show(tl, 4.5, 'The flag can be shown from a buoy instead, but it must be at least 300 x 200 mm.');
      tl.to(bf, { opacity: 1, duration: 0.5 }, 4.8);
      cap.show(tl, 9, 'By night: three all-round lights in a vertical line, red over white over red.');
      tl.to(night, { opacity: 1, duration: 1 }, 9);
      lights.forEach((l, k) => tl.from(l, { opacity: 0, duration: 0.4 }, 10 + k * 0.4));
      cap.show(tl, 13.5, 'Divers without a vessel show a flashing yellow or orange light, visible from 200 m.');
      tl.to(diver, { opacity: 1, duration: 0.5 }, 13.8);
      tl.to([fl2, fl2g], { opacity: 0.1, duration: 0.25, repeat: 9, yoyo: true }, 14.2);
      tl.to({}, { duration: 1 });
      return tl;
    }
  });

  P.push({
    type: 'learn', title: 'Keep 50 metres clear',
    html: `<p>All vessels must keep at least <b>50 metres</b> clear of vessels, buoys or areas showing a dive signal.</p>
<p>If you can't keep 50 m away, go at a safe speed with care until you're well clear, and keep a good lookout for people in the water.</p>
<p>A dive flag won't stop other boats coming close, so divers should listen before surfacing. Snorkellers are strongly encouraged to fly one too.</p>`,
    art(svg, S) {
      S.seaBg(svg);
      const dv = S.boat(svg, { x: 380, y: 300, r: 30, len: 110, color: C.white, wake: false });
      A.ring(svg, 380, 300, 170, { label: '50 m', color: C.port });
      A.flagA(svg, 395, 250, 50);
      const bub = A.g(svg);
      [[300, 360], [450, 230], [330, 220]].forEach(([x, y], k) => {
        for (let j = 0; j < 3; j++) { const c = A.circle(bub, x + j * 6, y, 3 + j, { fill: 'none', stroke: '#fff', 'stroke-width': 2 }); gsap.fromTo(c, { attr: { r: 1 }, opacity: 1 }, { attr: { r: 10 }, opacity: 0, duration: 1.8, repeat: -1, delay: k * 0.4 + j * 0.6 }); }
      });
      const wk = A.g(svg); S.wakes(wk);
      const b = S.boat(svg, { len: 90, color: C.port });
      gsap.timeline({ repeat: -1 }).set(b, { x: -100, y: 520, rotation: -10 })
        .to(b, { motionPath: { path: 'M -100 520 C 150 500 380 520 560 470 C 680 430 720 300 680 200 C 650 120 740 40 900 30', autoRotate: true }, duration: 12, ease: 'none' });
    }
  });

  P.push({
    type: 'learn', title: 'If a dive goes wrong',
    html: `<p>Leaving a boat unattended while diving is dangerous. Keep a responsible person on board to raise the alarm if a diver is overdue, or to look after the boat if it drifts.</p>
<p>The Water Police Coordination Centre listens 24/7 on <b>VHF channel 16</b> (and 27 MHz channel 88, being phased out), or call <b>000</b>.</p>
<p>Fiona Stanley Hospital coordinates treatment of civilian diving accidents: <b>(08) 6152 2222</b>. Say straight away it's about a diving accident.</p>`,
    art(svg, S) {
      A.paperBg(svg);
      const r = A.g(svg, { transform: 'translate(140,140)' });
      A.rect(r, 8, 12, 520, 260, { rx: 26, fill: 'rgba(18,38,58,0.2)' });
      A.rect(r, 0, 0, 520, 260, { rx: 26, fill: C.ink });
      A.rect(r, 30, 34, 300, 120, { rx: 10, fill: '#9FC3A5' });
      A.text(r, 50, 74, 'CH', { size: 24, weight: 700, fill: '#2F4A35' });
      const ch = A.text(r, 300, 136, '16', { size: 96, weight: 700, anchor: 'end', fill: '#1E3324' });
      A.text(r, 50, 140, 'VHF', { size: 22, weight: 700, fill: '#2F4A35' });
      A.circle(r, 430, 94, 52, { fill: '#2A4560', stroke: '#41546A', 'stroke-width': 4 });
      A.line(r, 430, 94, 430, 54, { stroke: C.buoy, 'stroke-width': 5, 'stroke-linecap': 'round' });
      for (let k = 0; k < 12; k++) A.rect(r, 40 + k * 24, 186, 14, 44, { rx: 4, fill: '#2A4560' });
      A.rect(r, 360, 190, 130, 40, { rx: 10, fill: C.port });
      A.text(r, 425, 217, 'DISTRESS', { size: 18, weight: 700, anchor: 'middle', fill: '#fff', ls: '0.08em' });
      A.tag(svg, 250, 470, '000', { fill: C.port, size: 26 });
      A.tag(svg, 510, 470, 'DIVE ACCIDENT (08) 6152 2222', { fill: C.ink, size: 17 });
      gsap.to(r.lastChild.previousSibling, { opacity: 0.6, duration: 0.7, yoyo: true, repeat: -1 });
    }
  });

  P.push({
    type: 'try', title: 'Before you dive',
    html: `<p>The workbook lists these checks before every dive. Tap each one as you read it.</p>`,
    lockMsg: 'Tick every item',
    build(svg, S, api) {
      S.seaBg(svg, { top: '#7FB3C0', bottom: '#245468', marks: false });
      const items = ['Check the weather: it can change quickly', 'Tell a friend your dive site and return time', 'Set entry and exit points', 'Choose a course, allowing for currents', 'Agree on a maximum time and depth', 'Review communication and hand signals', 'Agree on a return air pressure, usually 50 bar', 'Decide what to do if separated, and in an emergency'];
      const done = new Set();
      items.forEach((t, k) => {
        const y = 70 + k * 62;
        const g = A.g(svg, { transform: `translate(60,${y})`, style: 'cursor:pointer' });
        const bg = A.rect(g, 0, -24, 680, 50, { rx: 12, fill: 'rgba(255,253,248,0.92)' });
        const box = A.rect(g, 16, -12, 26, 26, { rx: 6, fill: C.white, stroke: C.ink2, 'stroke-width': 2.5 });
        const tk = A.path(g, 'M 22 1 L 28 8 L 38 -5', { stroke: '#fff', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0 });
        A.text(g, 60, 8, t, { font: 'body', size: 19, fill: C.ink });
        g.addEventListener('click', () => {
          if (done.has(k)) return;
          done.add(k);
          box.setAttribute('fill', C.stbd); box.setAttribute('stroke', C.stbd);
          gsap.to(tk, { opacity: 1, duration: 0.2 });
          gsap.fromTo(g, { x: 66 }, { x: 60, duration: 0.4, ease: 'back.out(3)' });
          if (done.size === items.length) api.done('All set. A dive flag must also be visible from every direction.');
        });
        gsap.from(g, { opacity: 0, y: '+=10', duration: 0.4, delay: k * 0.06 });
      });
    }
  });

  P.push({
    type: 'check', title: 'Flag ahead',
    q: 'You see this flag on a boat ahead. What should you do?',
    opts: ['Keep 50 m clear, or go slowly and watch for divers', 'Pass on the starboard side at normal speed', 'Stop your motor until the flag comes down', 'Sound your horn so the divers know you are near'], a: 0,
    why: 'Flag A means divers are down. Stay 50 m clear, or if you can\'t, slow down and keep a sharp lookout.',
    art(svg, S) { S.seaBg(svg); A.line(svg, 300, 460, 300, 180, { stroke: C.ink, 'stroke-width': 6, 'stroke-linecap': 'round' }); A.flagA(svg, 303, 184, 260); }
  });

  /* ===================================================================
     WATER SKIING
     =================================================================== */
  P.push({
    type: 'learn', title: 'What counts as water skiing',
    html: `<p><span class="term">Water skiing</span> means being towed over the water by a vessel at <b>8 knots or more</b>, on skis, an aquaplane, other gear, or bare feet. It includes <b>wakeboards</b>, <b>kneeboards</b> and <b>inflatables</b>.</p>
<p>It's a high-risk activity. As the skipper, you're responsible for the safety of your crew and the skier. Know the ski area's layout, direction, hours, take-off and landing areas, and hazards.</p>`,
    art(svg, S) {
      S.seaBg(svg);
      const wk = A.g(svg); S.wakes(wk);
      const b = S.boat(svg, { len: 120, color: C.port });
      const rope = A.path(svg, '', { stroke: C.ink, 'stroke-width': 2, fill: 'none' });
      const tube = A.g(svg);
      A.circle(tube, 0, 0, 22, { fill: C.buoy, stroke: C.ink, 'stroke-width': 2 }); A.circle(tube, 0, 0, 9, { fill: C.orange });
      const path = 'M -200 450 C 100 450 300 300 400 260 C 520 210 650 150 1000 150';
      gsap.timeline({ repeat: -1 }).set(b, { x: -200, y: 450 }).to(b, { motionPath: { path, autoRotate: true }, duration: 8, ease: 'none' });
      S.loop(() => {
        const a = b.rotation * Math.PI / 180;
        const tx = b.x - Math.cos(a) * 150, ty = b.y - Math.sin(a) * 150 + Math.sin(gsap.ticker.time * 2) * 10;
        tube.setAttribute('transform', `translate(${tx},${ty})`);
        rope.setAttribute('d', `M ${b.x - Math.cos(a) * 60} ${b.y - Math.sin(a) * 60} L ${tx} ${ty}`);
      });
      const gz = A.gauge(svg, { x: 680, y: 470, r: 80, max: 30, zone: [8, 30, C.port], step: 5, value: 22 });
      A.tag(svg, 680, 360, '8 KNOTS OR MORE', { fill: C.port, size: 15 });
    }
  });

  P.push({
    type: 'learn', title: 'The ski boat crew',
    html: `<p>Skiing needs at least three people: the skipper, an observer and the skier.</p>
<ul><li><b>Skipper:</b> at least <b>17</b>, and must hold an RST or be supervised by an RST holder aged 18 or over. Faces forward and keeps a lookout.</li><li><b>Observer:</b> at least <b>14</b>. Watches the skier at all times, reports to the skipper, warns of boats coming from behind, and knows the hand signals.</li><li><b>Skier:</b> any age. A Level 50 or 50S lifejacket is recommended.</li></ul>`,
    art(svg, S) {
      sky(svg);
      const bt = A.g(svg);
      const bs = A.boatSide(bt, { x: 470, y: 380, len: 360, color: C.port });
      A.person(bs.crew, { x: -40, y: -40, s: 0.95, side: true, color: C.ink, vest: C.orange, fwdL: 60, fwdR: 72 });
      A.person(bs.crew, { x: -120, y: -40, s: 0.9, side: true, color: C.stbd, vest: C.orange, flip: true, fwdL: 20 });
      const water = A.waterSide(svg, 382);
      const sk = A.g(svg, { transform: 'translate(110,384)' });
      A.person(sk, { x: 0, y: 0, s: 0.95, side: true, color: C.deep, vest: C.buoy, fwdL: 70, fwdR: 80 });
      A.rect(sk, -40, -4, 90, 8, { rx: 4, fill: C.ink });
      A.line(svg, 160, 314, 300, 330, { stroke: C.ink, 'stroke-width': 2 });
      gsap.to(sk, { y: '-=6', rotation: -3, duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      A.tag(svg, 450, 170, 'SKIPPER 17+', { fill: C.ink });
      A.tag(svg, 300, 220, 'OBSERVER 14+', { fill: C.stbd });
      A.tag(svg, 110, 240, 'SKIER: ANY AGE', { fill: C.deep });
    }
  });

  P.push({
    type: 'learn', title: 'Ski areas',
    html: `<p>You may only ski in a <b>gazetted ski area</b>, during its permitted times. Signs on the foreshore and at nearby ramps show the boundaries, the direction to ski (clockwise or anticlockwise), the hours, and the take-off and landing areas. Buoys may mark the boundary in the water.</p>
<p>If an area is too crowded to ski safely, go elsewhere or come back later. The skipper must sit in the seat, not on the gunwale or seat back.</p>`,
    art(svg, S) {
      S.seaBg(svg);
      A.land(svg, 'M -20 470 C 200 500 600 480 820 460 L 820 620 L -20 620 Z');
      A.rect(svg, 300, 432, 200, 50, { rx: 10, fill: 'rgba(240,178,26,0.3)', stroke: C.buoy, 'stroke-width': 2, 'stroke-dasharray': '6 5' });
      A.text(svg, 400, 520, 'TAKE-OFF AND LANDING', { size: 16, weight: 700, anchor: 'middle', fill: '#8A6000', ls: '0.12em' });
      [[60, 80], [260, 50], [540, 50], [740, 80], [60, 380], [740, 380]].forEach(([x, y]) => { A.circle(svg, x, y, 9, { fill: C.buoy, stroke: C.ink, 'stroke-width': 1.5 }); });
      const loop = 'M 400 400 C 650 400 700 330 700 240 C 700 140 600 110 400 110 C 200 110 100 140 100 240 C 100 330 150 400 400 400';
      A.path(svg, loop, { fill: 'none', stroke: 'rgba(255,255,255,0.7)', 'stroke-width': 3, 'stroke-dasharray': '10 10' });
      A.arrow(svg, 'M 690 300 C 700 270 702 250 700 230', { color: '#fff', width: 4 });
      A.arrow(svg, 'M 110 180 C 100 200 98 220 100 250', { color: '#fff', width: 4 });
      A.tag(svg, 400, 250, 'ANTICLOCKWISE', { fill: C.ink, size: 15 });
      const wk = A.g(svg); S.wakes(wk);
      const b = S.boat(svg, { len: 80, color: C.port });
      const rope = A.path(svg, '', { stroke: C.ink, 'stroke-width': 1.5, fill: 'none' });
      const skier = A.circle(svg, 0, 0, 7, { fill: C.buoy, stroke: C.ink, 'stroke-width': 1.5 });
      const rev = 'M 400 400 C 150 400 100 330 100 240 C 100 140 200 110 400 110 C 600 110 700 140 700 240 C 700 330 650 400 400 400';
      gsap.to(b, { motionPath: { path: rev, autoRotate: true }, duration: 14, repeat: -1, ease: 'none' });
      S.loop(() => {
        const a = b.rotation * Math.PI / 180;
        const sx = b.x - Math.cos(a) * 90, sy = b.y - Math.sin(a) * 90;
        skier.setAttribute('cx', sx); skier.setAttribute('cy', sy);
        rope.setAttribute('d', `M ${b.x - Math.cos(a) * 40} ${b.y - Math.sin(a) * 40} L ${sx} ${sy}`);
      });
    }
  });

  P.push({
    type: 'watch', title: 'Hand signals',
    html: `<p>Hand signals let the skier, observer and driver talk to each other and to other boats. Watch the four standard signals.</p>`,
    anim(svg, S) {
      A.paperBg(svg);
      A.circle(svg, 400, 300, 210, { fill: C.white, opacity: 0.7 });
      const fig = A.g(svg);
      const p = A.person(fig, { x: 400, y: 480, s: 2.4, color: C.ink, vest: C.orange });
      const sea = A.waterSide(svg, 440, { amp: 5, opacity: 0.95 });
      gsap.set(sea, { opacity: 0 });
      const who = A.g(svg);
      const whoTag = { el: null };
      const setWho = (t, col) => { who.innerHTML = ''; A.tag(who, 400, 110, t, { fill: col, size: 20 }); };
      const cap = caption(svg);
      const tl = gsap.timeline();
      const arms = (l, r, at, d) => { tl.to(p.armL, { rotation: l, transformOrigin: '0px 0px', duration: d || 0.6, ease: 'power2.inOut' }, at); tl.to(p.armR, { rotation: -r, transformOrigin: '0px 0px', duration: d || 0.6, ease: 'power2.inOut' }, at); };
      tl.call(() => setWho('DRIVER', C.ink), null, 0);
      cap.show(tl, 0, 'Waiting to take off: the driver holds both hands up, off the controls.');
      arms(165, 165, 0.6);
      arms(0, 0, 4);
      tl.call(() => setWho('OBSERVER', C.stbd), null, 4.4);
      cap.show(tl, 4.4, 'Skier down: the observer holds one arm straight up so other boats look out.');
      arms(0, 178, 5);
      arms(0, 0, 8.6);
      tl.call(() => setWho('SKIER IN THE WATER', C.deep), null, 9);
      cap.show(tl, 9, 'Skier down and OK: the fallen skier raises both arms.');
      tl.to(fig, { y: 110, duration: 0.8, ease: 'power2.in' }, 9.2);
      tl.to(sea, { opacity: 1, duration: 0.5 }, 9.3);
      arms(160, 160, 10);
      arms(0, 0, 13.4);
      tl.to(fig, { y: 0, duration: 0.8, ease: 'power2.out' }, 13.6);
      tl.to(sea, { opacity: 0, duration: 0.4 }, 13.6);
      tl.call(() => setWho('DRIVER', C.ink), null, 14);
      cap.show(tl, 14, 'Dropping off a skier: the driver raises and lowers a hand above the head.');
      arms(0, 170, 14.6, 0.5);
      tl.to(p.armR, { rotation: -120, duration: 0.5, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 15.2);
      arms(0, 0, 18.4);
      tl.to({}, { duration: 0.6 });
      return tl;
    }
  });

  P.push({
    type: 'check', title: 'Skier down',
    q: 'Your skier falls. What signal does the observer give?',
    opts: ['Both arms waved slowly side to side', 'One arm held straight up in the air', 'A hand patted on top of the head', 'A thumb pointed back towards the skier'], a: 1,
    why: 'Only the observer gives this one: one arm straight up tells other boats a skier is in the water.'
  });

  P.push({
    type: 'learn', title: 'Distances to remember',
    html: `<ul><li>Don't drive closer than <b>50 m</b> directly behind a skier or another vessel.</li><li>Stay at least <b>50 m</b> from shore, except when taking off or landing in a gazetted area.</li><li>Don't tow a skier within <b>30 m</b> of shore or a take-off or landing area, unless taking off or landing.</li><li>When landing a skier, don't come within <b>25 m</b> of the shore where they landed.</li><li>After dropping a skier, go <b>60 m</b> on before stopping to pull in the rope.</li><li>Don't let a rope trail within <b>30 m</b> of shore unless a skier is holding it.</li><li>Trick skiing: not within <b>100 m</b> of a take-off or landing area.</li></ul>`,
    art(svg, S) {
      S.seaBg(svg);
      A.land(svg, 'M -20 500 C 200 520 600 505 820 495 L 820 620 L -20 620 Z');
      const wk = A.g(svg); S.wakes(wk);
      const lead = S.boat(svg, { x: 560, y: 200, r: 180, len: 90, color: C.stbd });
      const sk1 = A.circle(svg, 680, 200, 7, { fill: C.buoy, stroke: C.ink, 'stroke-width': 1.5 });
      A.line(svg, 600, 200, 674, 200, { stroke: C.ink, 'stroke-width': 1.5 });
      const me = S.boat(svg, { x: 300, y: 200, r: 180, len: 90, color: C.port, wake: false });
      A.path(svg, 'M 350 228 L 520 228', { stroke: C.port, 'stroke-width': 3, 'stroke-dasharray': '7 6' });
      A.tag(svg, 435, 255, '50 m BEHIND', { fill: C.port, size: 15 });
      A.line(svg, 0, 380, 800, 380, { stroke: C.port, 'stroke-width': 2, 'stroke-dasharray': '7 7' });
      A.tag(svg, 150, 380, '50 m FROM SHORE', { fill: C.port, size: 15 });
      A.line(svg, 0, 440, 800, 440, { stroke: C.buoy, 'stroke-width': 2, 'stroke-dasharray': '7 7' });
      A.tag(svg, 620, 440, '30 m: NO TOWING, NO TRAILING ROPE', { fill: '#8A6000', size: 14 });
    }
  });

  P.push({
    type: 'try', title: 'Ski distances',
    html: `<p>Pick the right distance for each situation.</p>`,
    lockMsg: 'Answer all six',
    build(svg, S, api) {
      S.seaBg(svg);
      A.land(svg, 'M -20 500 C 200 520 600 505 820 495 L 820 620 L -20 620 Z');
      const layer = A.g(svg);
      const items = [
        { q: 'Closest you may drive directly behind a skier', a: '50 m', why: 'Never closer than 50 m directly behind a skier or another vessel.', d: [400, 180, 400, 360] },
        { q: 'Distance from shore, unless taking off or landing', a: '50 m', why: 'Stay 50 m (or as gazetted) from shore.', d: [400, 310, 400, 500] },
        { q: 'Closest you may tow a skier to a take-off or landing area', a: '30 m', why: 'Except when actually taking off or landing.', d: [400, 380, 400, 500] },
        { q: 'Closest you may come to the shore where your skier landed', a: '25 m', why: 'Turn away at least 25 m from that shore.', d: [400, 410, 400, 500] },
        { q: 'How far to go on before stopping to pull in the rope', a: '60 m', why: 'Then return under 8 knots if heading to shore.', d: [250, 380, 620, 380] },
        { q: 'Trick skiing: distance from a take-off or landing area', a: '100 m', why: 'Trick skiers stay 100 m from take-off and landing areas.', d: [400, 200, 400, 500] }
      ];
      const tow = (x, y, r, col, skier) => {
        const g = A.g(layer);
        const bt = A.boat(g, { x, y, r, len: 80, color: col || C.port, wake: false });
        if (skier !== false) {
          const a = r * Math.PI / 180, sx = x - Math.cos(a) * 110, sy = y - Math.sin(a) * 110;
          A.line(g, x - Math.cos(a) * 38, y - Math.sin(a) * 38, sx, sy, { stroke: C.ink, 'stroke-width': 1.5 });
          A.circle(g, sx, sy, 8, { fill: C.buoy, stroke: C.ink, 'stroke-width': 1.5 });
        }
        return g;
      };
      const zone = () => { A.rect(layer, 330, 470, 180, 40, { rx: 8, fill: 'rgba(240,178,26,0.35)', stroke: C.buoy, 'stroke-width': 2, 'stroke-dasharray': '6 5' }); A.text(layer, 420, 548, 'TAKE-OFF / LANDING', { size: 14, weight: 700, anchor: 'middle', fill: '#8A6000', ls: '0.1em' }); };
      const scenes = [
        () => { tow(380, 180, 180, C.stbd); tow(720, 180, 180, C.port, false); return [510, 210, 680, 210]; },
        () => { tow(420, 300, 0); return [420, 330, 420, 490]; },
        () => { zone(); tow(560, 300, 180); return [560, 330, 500, 470]; },
        () => { A.person(layer, { x: 470, y: 500, s: 0.35, color: C.deep, vest: C.buoy }); tow(300, 380, 200, C.port, false); return [330, 400, 455, 480]; },
        () => { A.circle(layer, 230, 300, 8, { fill: C.buoy, stroke: C.ink, 'stroke-width': 1.5 }); A.swimmer(layer, 230, 300, 0.8); tow(620, 300, 0, C.port, false); A.path(layer, 'M 620 300 L 750 300', { stroke: C.ink, 'stroke-width': 1.5, 'stroke-dasharray': '3 4' }); return [250, 340, 600, 340]; },
        () => { zone(); tow(440, 160, 0); A.tag(layer, 330, 110, 'TRICK SKIER', { fill: C.deep, size: 14 }); return [380, 190, 420, 470]; }
      ];
      picker(api, items, ['25 m', '30 m', '50 m', '60 m', '100 m'], (i, solved) => {
        layer.innerHTML = '';
        const [x1, y1, x2, y2] = scenes[i]();
        const ln = A.path(layer, `M ${x1} ${y1} L ${x2} ${y2}`, { stroke: solved ? C.stbd : C.port, 'stroke-width': 4, 'stroke-dasharray': '10 8', 'stroke-linecap': 'round' });
        A.circle(layer, x1, y1, 6, { fill: solved ? C.stbd : C.port }); A.circle(layer, x2, y2, 6, { fill: solved ? C.stbd : C.port });
        const hz = Math.abs(x2 - x1) > Math.abs(y2 - y1);
        A.tag(layer, (x1 + x2) / 2 + (hz ? 0 : 50), (y1 + y2) / 2 - (hz ? 30 : 0), solved ? items[i].a : '?', { fill: solved ? C.stbd : C.port, size: 24 });
        if (!solved) gsap.from(layer, { opacity: 0, duration: 0.4 });
      }, 'Nice. These distances keep skiers, swimmers and other boats apart.');
    }
  });

  P.push({
    type: 'learn', title: 'Sharing the ski area',
    html: `<p>All motor boat rules still apply when towing a skier. A ski boat has <b>no priority</b> over a vessel passing through the ski area.</p>
<p>A boat about to take off with a skier must <b>give way</b> to a ski boat coming in to land one.</p>
<p>Slalom courses and ski jumps need the Department of Transport's written approval, a safety zone marked by red 200 mm buoys with 300 mm orange pennants, and slalom skiers must wear a Level 50 or 50S lifejacket. Skiers should also get back any ski they lose.</p>`,
    art(svg, S) {
      S.seaBg(svg);
      A.land(svg, 'M -20 470 C 200 500 600 480 820 460 L 820 620 L -20 620 Z');
      const wk = A.g(svg); S.wakes(wk);
      const land = S.boat(svg, { len: 90, color: C.stbd });
      const wait = S.boat(svg, { x: 470, y: 420, r: -100, len: 90, color: C.port, wake: false });
      A.tag(svg, 470, 340, 'WAITS', { fill: C.port, size: 15 });
      gsap.timeline({ repeat: -1, repeatDelay: 1 }).set(land, { x: 900, y: 150, rotation: 160 })
        .to(land, { motionPath: { path: 'M 900 150 C 650 200 450 300 360 400 C 340 420 330 430 320 440', autoRotate: true }, duration: 5, ease: 'power1.inOut' })
        .to(land, { motionPath: { path: 'M 320 440 C 300 400 250 300 -150 250', autoRotate: true }, duration: 4, ease: 'power1.in' }, '+=0.6');
      A.tag(svg, 600, 110, 'LANDING BOAT HAS RIGHT OF WAY', { fill: C.stbd, size: 15 });
    }
  });

  /* ===================================================================
     PERSONAL WATER CRAFT
     =================================================================== */
  P.push({
    type: 'learn', title: 'PWCs are motor boats',
    html: `<p><span class="term">Personal water craft</span> (PWCs, often called jet skis) are driven by a water jet. As far as the rules go, they are motor boats: the same ages, registration and gear rules apply.</p>
<p><b>Within protected waters, or up to 400 m from shore:</b> you need an RST and a lifejacket for each person (one worn, minimum Level 50S).</p>
<p><b>Beyond 400 m in unprotected waters:</b> you also need an in-date GPS EPIRB or PLB, and in-date flares or an EVDS.</p>
<p>A marine radio is recommended, and required beyond 4 nautical miles.</p>`,
    art(svg, S) {
      S.seaBg(svg);
      A.land(svg, 'M -20 -20 L 120 -20 C 140 150 110 300 140 620 L -20 620 Z');
      A.line(svg, 430, 0, 430, 600, { stroke: C.ink, 'stroke-width': 2.5, 'stroke-dasharray': '9 8' });
      A.tag(svg, 430, 40, '400 m', { fill: C.ink, size: 18 });
      const col = (x, title, list) => { A.text(svg, x, 110, title, { size: 18, weight: 700, anchor: 'middle', fill: C.ink2, ls: '0.12em' }); list.forEach((t, k) => A.tag(svg, x, 160 + k * 46, t, { fill: k > 1 ? C.port : C.deep, size: 15 })); };
      col(280, 'INSIDE', ['RST', 'LIFEJACKET WORN']);
      col(610, 'BEYOND', ['RST', 'LIFEJACKET WORN', 'EPIRB OR PLB', 'FLARES OR EVDS']);
      const wk = A.g(svg); S.wakes(wk);
      const p = S.boat(svg, { type: 'pwc', len: 60, color: C.port });
      gsap.timeline({ repeat: -1, yoyo: true }).fromTo(p, { x: 200, y: 450, rotation: 0 }, { motionPath: { path: 'M 200 450 C 350 430 500 470 700 440', autoRotate: true }, duration: 6, ease: 'sine.inOut' });
    }
  });

  P.push({
    type: 'learn', title: 'Freestyling and wake jumping',
    html: `<p><span class="term">Freestyling</span> is driving a PWC so others can't predict its course or speed: doughnuts, 180° turns, hops and jumps. <span class="term">Wave or wake jumping</span> is riding over a wave or wake to get airborne.</p>
<p>Both are banned:</p>
<ul><li>in any speed-restricted area</li><li>within <b>30 m</b> of another PWC</li><li>within <b>50 m</b> of another vessel or a person in the water</li></ul>
<p>On the Swan and Canning Riverpark, freestyling is only allowed in the gazetted area downstream of the Narrows Bridge.</p>`,
    art(svg, S) {
      S.seaBg(svg);
      const wk = A.g(svg); S.wakes(wk);
      const other = S.boat(svg, { type: 'pwc', x: 180, y: 180, r: 20, len: 60, color: C.stbd, wake: false });
      A.ring(svg, 180, 180, 75, { label: '30 m', color: C.buoy, fill: 'rgba(240,178,26,0.08)' });
      const mb = S.boat(svg, { x: 620, y: 430, r: 200, len: 110, color: C.deep, wake: false });
      A.ring(svg, 620, 430, 125, { label: '50 m', color: C.port });
      A.swimmer(svg, 200, 470, 1);
      A.ring(svg, 200, 470, 125, { label: '50 m', color: C.port });
      const p = S.boat(svg, { type: 'pwc', len: 60, color: C.port });
      gsap.to(p, { motionPath: { path: 'M 470 230 C 560 160 520 80 450 110 C 380 140 360 230 430 260 C 480 280 520 250 470 230', autoRotate: true }, duration: 3.4, repeat: -1, ease: 'none' });
      A.tag(svg, 450, 330, 'FREESTYLE: WELL CLEAR', { fill: C.ink, size: 15 });
    }
  });

  P.push({
    type: 'learn', title: 'Where PWCs can go',
    html: `<p>PWCs are <b>banned</b> on the Swan River upstream of the Windan Bridge, the Canning River upstream of Salter Point, and in all Swan River marine parks.</p>
<p>They're allowed in all Swan and Canning ski areas except <b>Belmont</b>, and in most large offshore ski areas, such as Warnbro, Cockburn Sound and Geographe Bay. Check local guides and ramp signs.</p>
<p>PWC numbers go on both sides: <b>100 mm high, black on white</b>, with the label on the port side. Tow-in surfing has its own rules.</p>`,
    art(svg, S) {
      S.seaBg(svg, { top: '#C9E0E3', bottom: '#AFD0D6' });
      A.land(svg, 'M -20 -20 L 820 -20 L 820 120 C 700 140 600 100 520 150 C 470 180 460 230 400 240 C 330 250 300 200 230 220 C 160 240 120 300 60 290 C 20 284 0 300 -20 300 Z');
      A.land(svg, 'M -20 620 L -20 470 C 80 450 160 500 260 470 C 360 440 420 380 520 390 C 600 398 640 470 820 450 L 820 620 Z');
      A.path(svg, 'M 300 240 L 320 400', { stroke: '#9C978A', 'stroke-width': 18, 'stroke-linecap': 'round' });
      A.tag(svg, 310, 320, 'BRIDGE', { fill: C.ink2, size: 13 });
      A.rect(svg, -10, 280, 300, 200, { fill: 'rgba(200,53,43,0.12)' });
      A.text(svg, 150, 380, 'NO PWCs', { size: 28, weight: 700, anchor: 'middle', fill: C.port, ls: '0.1em' });
      A.text(svg, 150, 410, 'UPSTREAM', { size: 16, weight: 700, anchor: 'middle', fill: C.port, ls: '0.2em' });
      const wk = A.g(svg); S.wakes(wk);
      const p = S.boat(svg, { type: 'pwc', len: 54, color: C.stbd });
      gsap.timeline({ repeat: -1 }).set(p, { x: 900, y: 320, rotation: 180 })
        .to(p, { motionPath: { path: 'M 900 320 C 700 300 520 300 400 320 C 370 325 360 340 380 360 C 420 380 600 360 900 380', autoRotate: true }, duration: 9, ease: 'none' });
      no(svg, 360, 330, 24);
    }
  });

  P.push({
    type: 'check', title: 'Freestyle space',
    q: 'How close to another PWC can you freestyle or wake jump?',
    opts: ['No closer than 15 metres', 'No closer than 30 metres', 'No closer than 60 metres', 'No closer than 100 metres'], a: 1,
    why: 'Stay 30 m from other PWCs, and 50 m from other vessels or people in the water.'
  });

  /* ===================================================================
     WORKBOOK SELF-TEST
     =================================================================== */
  const R9 = [
    ['When operating a motor boat near a person in the water you must:', ['Not exceed 4 knots within 100 metres.', 'Not exceed 6 knots within 100 metres.', 'Not exceed 8 knots within 50 metres.', 'Not exceed 10 knots within 50 metres.'], 2, 'The 8-knot rule applies within 50 metres of a person in the water.'],
    ['What is the maximum speed limit within 15 metres of a vessel underway?', ['4 knots.', '7 knots.', '8 knots.', '10 knots.'], 2, 'Within 15 metres of a vessel underway, the limit is 8 knots.'],
    ['What is the maximum speed limit within a mooring area or boat haven?', ['4 knots.', '7 knots.', '8 knots.', '10 knots.'], 2, 'Mooring areas are 8-knot zones unless signposted otherwise.'],
    ['What types of boating accidents must be reported?', ['All accidents.', 'All accidents involving motor boats or water skiers.', 'Accidents resulting in serious injury or death, or if the vessel has been damaged enough to make it unseaworthy or unsafe.', 'Accidents involving loss of life, personal injury or property damage over $1000.'], 2, 'Serious injury, death, or a vessel made unseaworthy or unsafe must be reported within 72 hours.'],
    ['What vessels are required to be registered?', ['Vessels fitted with an engine of 5 hp or more.', 'Other than a tender, all recreational vessels that are fitted with, or can be fitted with an engine.', 'All recreational vessels over 3.1 metres fitted with an engine.', 'None of the above.'], 1, 'Any vessel that is, or can be, mechanically powered must be registered, apart from qualifying tenders.'],
    ['What does this flag (pictured) indicate?', ['Dangerous cargo being carried on board a vessel – keep well away.', 'Diver below – keep 50 metres clear or travel at the slowest possible speed and keep a good lookout for people in the water.', 'Shallow water – proceed with caution in the vicinity.', 'Vessel aground keep clear.'], 1, 'Code flag A means divers are down.'],
    ['A Recreational Skipper\'s Ticket entitles you to drive:', ['Vessels under 8 metres in length only.', 'All recreational vessels.', 'All commercial vessels.', 'All recreational and commercial vessels.'], 1, 'An RST covers recreational vessels only.'],
    ['What is the maximum speed limit within 50 metres of a jetty, wharf or the shore?', ['8 knots.', '6 knots.', '10 knots.', 'No speed limit applies.'], 0, 'Within 50 metres of a jetty, wharf, bank or low water mark, the limit is 8 knots.'],
    ['A holder of an RST under the age of 16 is restricted to operating a vessel:', ['That is less than 4 metres in length.', 'With a motor under 6 hp.', 'During daylight hours and at a speed of less than 8 knots.', 'All of the above.'], 2, 'Skippers aged 14 or 15 must drive in daylight only, and under 8 knots.']
  ];
  R9.forEach(([q, opts, a, why], k) => {
    const pg = { type: 'review', n: k + 1, of: R9.length, title: 'Workbook self-test', q, opts, a, why, fixed: true };
    if (k === 5) pg.art = (svg) => { A.paperBg(svg); A.line(svg, 250, 470, 250, 150, { stroke: C.ink, 'stroke-width': 6, 'stroke-linecap': 'round' }); A.flagA(svg, 253, 154, 300); };
    P.push(pg);
  });

  SR.chapter({
    id: 2,
    title: 'Rules and Regulations',
    intro: 'Speed limits, the law on the water, alcohol and drugs, protecting the marine environment, registration, diving, water skiing and personal water craft.',
    cover(svg, S) {
      river(svg, S, { top: 120, bottom: 600 });
      A.speedSign(svg, 650, 70, 48, '8', 'KNOTS');
      A.rect(svg, 646, 118, 8, 40, { fill: '#8C8A80' });
      A.jetty(svg, 200, 40, 30, 140);
      [[420, 260], [500, 240], [580, 270]].forEach(([x, y]) => A.mooringBuoy(svg, x, y));
      const wk = A.g(svg); S.wakes(wk);
      const b = S.boat(svg, { len: 100, color: C.port });
      gsap.to(b, { motionPath: { path: 'M -120 430 C 200 420 400 380 560 400 C 700 418 760 470 940 470', autoRotate: true }, duration: 11, repeat: -1, ease: 'none' });
      const y = S.boat(svg, { type: 'yacht', len: 90, color: C.stbd, tack: 'stbd' });
      gsap.to(y, { motionPath: { path: 'M 900 320 C 600 330 300 300 -120 330', autoRotate: true }, duration: 26, repeat: -1, ease: 'none' });
    },
    pages: P
  });
})();
