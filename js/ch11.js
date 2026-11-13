/* Chapter 11: Appendices (shipboard directions, glossary, acronyms, consent letter) */
(function () {
  const A = SR.art, C = A.C;
  const { sky, rounds, wrap } = SR.share;
  const P = [];
  const card = (parent, x, y, w, h, fill) => { A.rect(parent, x + 4, y + 6, w, h, { rx: 18, fill: 'rgba(18,38,58,0.14)' }); return A.rect(parent, x, y, w, h, { rx: 18, fill: fill || C.white, stroke: C.line, 'stroke-width': 1.5 }); };
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* one question at a time, each with its own options */
  function quiz(api, S, o) {
    let i = 0, busy = false;
    const box = document.createElement('div'); box.className = 'chips'; api.task.appendChild(box);
    const stt = document.createElement('div'); stt.className = 'status'; api.task.appendChild(stt);
    const show = () => {
      const it = o.items[i];
      stt.textContent = `${o.noun || 'Word'} ${i + 1} of ${o.items.length}`;
      if (o.show) o.show(it, i);
      box.innerHTML = shuffle(it.opts.map((t, k) => ({ t, k }))).map(x => `<button class="chip" data-k="${x.k}">${x.t}</button>`).join('');
      box.querySelectorAll('.chip').forEach(b => b.onclick = () => {
        if (busy) return;
        if (+b.dataset.k === 0) {
          busy = true; b.classList.add('on'); api.say(it.why || `Yes: <b>${it.opts[0]}</b>.`, 'good');
          S.after(1700, () => {
            busy = false; i++;
            if (i < o.items.length) { api.hush(); show(); }
            else { box.innerHTML = ''; stt.textContent = ''; api.done(o.end); }
          });
        } else { b.disabled = true; b.classList.add('shake'); api.say(it.bad || 'Not that one. Try again.', 'bad'); }
      });
    };
    show();
  }

  /* ---------- shipboard directions ---------- */
  const DIRS = [
    ['DEAD AHEAD', 400, 70], ['ON THE PORT BOW', 190, 130], ['ON THE STARBOARD BOW', 610, 130], ['ABEAM', 120, 300], ['ABEAM', 680, 300],
    ['ON THE PORT QUARTER', 190, 470], ['ON THE STARBOARD QUARTER', 610, 470], ['ASTERN', 400, 540]
  ];
  function dirScene(svg, S) {
    S.seaBg(svg);
    const ring = A.g(svg);
    A.circle(ring, 400, 300, 200, { fill: 'none', stroke: 'rgba(255,255,255,0.7)', 'stroke-width': 2, 'stroke-dasharray': '6 8' });
    A.line(ring, 400, 80, 400, 520, { stroke: 'rgba(255,255,255,0.6)', 'stroke-width': 2 });
    A.line(ring, 180, 300, 620, 300, { stroke: 'rgba(255,255,255,0.6)', 'stroke-width': 2 });
    const b = S.boat(svg, { len: 170, color: C.port, x: 400, y: 300, r: -90, wake: false });
    gsap.to(b, { rotation: -89, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    A.tag(svg, 300, 300, 'PORT', { fill: C.port, size: 14 });
    A.tag(svg, 500, 300, 'STARBOARD', { fill: C.stbd, size: 14 });
    return b;
  }
  P.push({
    type: 'learn', title: 'Shipboard directions',
    html: `<p>Boaties describe where something is <b>relative to the boat</b>, not with left and right.</p>
<ul><li><b>Dead ahead</b>: straight in front. <b>Astern</b>: straight behind.</li><li><b>Abeam</b>: at right angles to the centreline, out to the side.</li><li><b>On the bow</b>: forward of abeam, port or starboard side.</li><li><b>On the quarter</b>: behind abeam, port or starboard side.</li></ul>
<p>“Boat on the starboard bow!” tells the skipper exactly where to look.</p>`,
    art(svg, S) {
      dirScene(svg, S);
      DIRS.forEach(([t, x, y], k) => {
        const g = A.tag(svg, x, y, t, { fill: C.ink, size: 15 });
        gsap.from(g, { opacity: 0, scale: 0.8, transformOrigin: '50% 50%', duration: 0.4, delay: 0.3 + k * 0.25 });
      });
    }
  });
  P.push({
    type: 'try', title: 'Where is it?',
    html: `<p>Another boat appears. Call out where it is.</p>`,
    lockMsg: 'Answer all six',
    build(svg, S, api) {
      dirScene(svg, S);
      const lay = A.g(svg);
      const items = [
        { x: 560, y: 150, r: -150, a: 2, why: 'Forward of abeam on the right: <b>on the starboard bow</b>.' },
        { x: 400, y: 545, r: -90, a: 6, why: 'Straight behind: <b>astern</b>.' },
        { x: 240, y: 450, r: 30, a: 4, why: 'Behind abeam on the left: <b>on the port quarter</b>.' },
        { x: 670, y: 300, r: 90, a: 3, why: 'At right angles to the centreline: <b>abeam</b>.' },
        { x: 400, y: 70, r: 90, a: 0, why: 'Straight in front: <b>dead ahead</b>.' },
        { x: 240, y: 150, r: 20, a: 1, why: 'Forward of abeam on the left: <b>on the port bow</b>.' }
      ];
      rounds(api, S, {
        items, choices: ['Dead ahead', 'On the port bow', 'On the starboard bow', 'Abeam', 'On the port quarter', 'On the starboard quarter', 'Astern'], noun: 'Boat',
        bad: 'Is it forward or behind abeam? And which side?',
        show(it) {
          lay.innerHTML = '';
          const o = S.boat(lay, { len: 70, color: C.stbd, x: it.x, y: it.y, r: it.r, wake: false });
          const ring = A.circle(lay, it.x, it.y, 46, { fill: 'none', stroke: C.buoy, 'stroke-width': 4 });
          gsap.from(ring, { attr: { r: 16 }, opacity: 0, duration: 0.5, ease: 'back.out(2)' });
          gsap.from(o.g, { opacity: 0, duration: 0.4 });
        },
        wait: 1700,
        end: 'Ahead, bow, abeam, quarter, astern: now everyone knows where to look.'
      });
    }
  });

  /* ---------- parts of a boat ---------- */
  function hullScene(svg) {
    sky(svg, '#E4EFEE', '#F6F0E2');
    const b = A.boatSide(svg, { len: 520, x: 400, y: 380, color: C.sea4 });
    A.waterSide(svg, 380, { amp: 5, opacity: 0.55, move: false });
    return b;
  }
  const PARTS = {
    bow: [650, 290], transom: [148, 345], gunwale: [470, 298], keel: [380, 418]
  };
  function dim(parent, x, y1, y2, label, col, lx, ly) {
    const g = A.g(parent);
    A.line(g, x, y1 + 6, x, y2 - 6, { stroke: col, 'stroke-width': 3.5 });
    A.path(g, `M ${x - 8} ${y1 + 10} L ${x} ${y1} L ${x + 8} ${y1 + 10} Z`, { fill: col });
    A.path(g, `M ${x - 8} ${y2 - 10} L ${x} ${y2} L ${x + 8} ${y2 - 10} Z`, { fill: col });
    if (label) { A.line(g, x, (y1 + y2) / 2, lx, ly, { stroke: col, 'stroke-width': 2 }); A.tag(g, lx, ly, label, { fill: col, size: 15 }); }
    return g;
  }
  P.push({
    type: 'learn', title: 'Parts of a boat',
    html: `<ul><li><b>Bow</b>: the front. <b>Stern</b>: the back. <b>Transom</b>: the flat stern of a square-sterned boat.</li><li><b>Gunwale</b>: the upper edge of the boat’s sides.</li><li><b>Freeboard</b>: the height from the water up to the gunwale.</li><li><b>Draught</b>: how deep the boat sits in the water.</li><li><b>Keel</b>: the bottom of the boat’s centreline. <b>Chine</b>: where the bottom meets the sides.</li><li><b>Beam</b>: the boat’s width.</li></ul>`,
    art(svg, S) {
      hullScene(svg);
      const L = A.g(svg);
      const lab = [['BOW', 690, 220, PARTS.bow], ['TRANSOM', 110, 250, PARTS.transom], ['GUNWALE', 520, 220, PARTS.gunwale], ['KEEL', 300, 500, PARTS.keel]];
      lab.forEach(([t, x, y, p], k) => {
        const g = A.g(L);
        A.line(g, x, y, p[0], p[1], { stroke: C.ink, 'stroke-width': 2 });
        A.circle(g, p[0], p[1], 6, { fill: C.buoy, stroke: C.ink, 'stroke-width': 2 });
        A.tag(g, x, y, t, { fill: C.ink, size: 15 });
        gsap.from(g, { opacity: 0, duration: 0.4, delay: 0.3 + k * 0.3 });
      });
      const f = dim(L, 330, 302, 380, 'FREEBOARD', C.port, 230, 250);
      const d = dim(L, 250, 380, 416, 'DRAUGHT', C.stbd, 180, 470);
      gsap.from([f, d], { opacity: 0, duration: 0.5, delay: 1.6, stagger: 0.4 });
    }
  });
  P.push({
    type: 'try', title: 'Name the part',
    html: `<p>What’s the highlighted part called?</p>`,
    lockMsg: 'Name all six',
    build(svg, S, api) {
      hullScene(svg);
      const lay = A.g(svg);
      const items = [
        { k: 'gunwale', a: 2, why: 'The <b>gunwale</b> is the upper edge of the sides.' },
        { k: 'draught', a: 4, why: '<b>Draught</b> is how deep the boat sits in the water.' },
        { k: 'bow', a: 0, why: 'The <b>bow</b> is the front of the boat.' },
        { k: 'freeboard', a: 3, why: '<b>Freeboard</b> is the height from the water to the gunwale.' },
        { k: 'keel', a: 5, why: 'The <b>keel</b> is the bottom of the centreline.' },
        { k: 'transom', a: 1, why: 'The <b>transom</b> is the flat stern of a square-sterned boat.' }
      ];
      rounds(api, S, {
        items, choices: ['Bow', 'Transom', 'Gunwale', 'Freeboard', 'Draught', 'Keel'], noun: 'Part',
        bad: 'Not quite. Look again at what is highlighted.',
        show(it) {
          lay.innerHTML = '';
          if (it.k === 'freeboard') dim(lay, 330, 302, 380, '', C.buoy);
          else if (it.k === 'draught') dim(lay, 250, 380, 416, '', C.buoy);
          else {
            const p = PARTS[it.k];
            const r = A.circle(lay, p[0], p[1], 30, { fill: 'none', stroke: C.buoy, 'stroke-width': 6 });
            gsap.from(r, { attr: { r: 10 }, opacity: 0, duration: 0.45, ease: 'back.out(2)' });
          }
          gsap.from(lay, { opacity: 0, duration: 0.3 });
        },
        end: 'Bow, transom, gunwale, freeboard, draught and keel.'
      });
    }
  });

  /* ---------- glossary ---------- */
  P.push({
    type: 'learn', title: 'Words for moving',
    html: `<ul><li><b>Ahead</b>: toward the bow. <b>Astern</b>: toward the stern, or putting the engine in reverse.</li><li><b>Underway</b>: not anchored or tied up. If you’re drifting, you’re underway.</li><li><b>Making way</b>: underway and moving through the water. <b>Headway</b> is forward motion.</li><li><b>Leeway</b>: sideways movement caused by the wind.</li><li><b>Yaw</b>: swinging off course for a moment, as in a quartering sea.</li><li><b>Stand on</b>: keep your course and speed. <b>Give way</b>: change speed or direction to avoid another boat.</li></ul>`,
    art(svg, S) {
      S.seaBg(svg);
      const wk = A.g(svg); S.wakes(wk);
      const b = S.boat(svg, { len: 150, color: C.sea4, x: 160, y: 200, r: 0 });
      gsap.to(b, { x: 640, y: 380, duration: 7, repeat: -1, ease: 'none' });
      const tr = A.path(svg, 'M 120 200 L 700 200', { stroke: C.ink, 'stroke-width': 3, 'stroke-dasharray': '8 8', fill: 'none' });
      A.tag(svg, 640, 170, 'HEADING', { fill: C.ink, size: 15 });
      A.arrow(svg, 'M 120 470 L 330 470', { width: 5, color: C.ink });
      A.tag(svg, 225, 500, 'HEADWAY', { fill: C.ink, size: 15 });
      A.arrow(svg, 'M 560 470 L 560 540', { width: 5, color: C.port });
      A.tag(svg, 620, 505, 'LEEWAY', { fill: C.port, size: 15 });
      const w = A.g(svg, { transform: 'translate(700,80)' });
      A.circle(w, 0, 0, 44, { fill: C.white, stroke: C.line, 'stroke-width': 1.5 });
      A.arrow(w, 'M 0 -24 L 0 22', { width: 6, color: C.ink });
      A.text(w, 0, 66, 'WIND', { size: 14, weight: 700, anchor: 'middle', fill: C.ink, ls: '0.14em' });
    }
  });
  P.push({
    type: 'learn', title: 'Words for wind and sea',
    html: `<ul><li><b>Windward</b>: toward where the wind comes from. <b>Leeward</b>: the downwind side.</li><li><b>Lee</b>: the side sheltered from the wind. A <b>lee shore</b> is the shore the wind blows onto, so keep clear of it.</li><li><b>Sea room</b>: a safe distance from the shore and other hazards.</li><li><b>Sea state</b>: wind, waves and swell combined. <b>Swell waves</b> come from distant weather systems.</li><li><b>King wave</b>: an unusually big wave where a sea wave and swell peak together.</li><li><b>Following sea</b>: waves travelling the same way as you.</li></ul>`,
    art(svg, S) {
      S.seaBg(svg);
      A.land(svg, 'M 300 220 Q 380 150 470 180 Q 540 210 520 300 Q 500 380 400 380 Q 300 370 280 300 Q 270 250 300 220 Z');
      A.land(svg, 'M -20 470 Q 200 440 400 470 Q 600 500 820 460 L 820 620 L -20 620 Z');
      const lee = A.path(svg, 'M 505 215 L 740 330 L 660 440 L 430 375 Z', { fill: 'rgba(255,255,255,0.35)' });
      A.tag(svg, 660, 300, 'LEE (SHELTER)', { fill: C.stbd, size: 15 });
      A.tag(svg, 400, 520, 'LEE SHORE: KEEP CLEAR', { fill: C.port, size: 15 });
      A.tag(svg, 120, 380, 'WINDWARD', { fill: C.ink, size: 15 });
      for (let k = 0; k < 4; k++) {
        const ar = A.arrow(svg, `M ${30} ${110 + k * 60} l 100 60`, { width: 4, color: C.white });
        gsap.fromTo(ar, { x: -20, opacity: 0 }, { x: 30, opacity: 1, duration: 1.8, repeat: -1, delay: k * 0.3, ease: 'sine.inOut', yoyo: true });
      }
      const b = S.boat(svg, { len: 80, color: C.sea4, x: 580, y: 380, r: 200, wake: false });
      gsap.to(b, { y: 390, duration: 2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    }
  });
  P.push({
    type: 'learn', title: 'Words for tides and distance',
    html: `<ul><li><b>Flood</b>: a rising tide. <b>Ebb</b>: a falling tide.</li><li><b>Spring tides</b>, at new and full moon, have the biggest rise and fall. <b>Neap tides</b>, in between, have the smallest.</li><li><b>Tidal range</b>: the difference between high and low water. A <b>sounding</b> is a depth measurement.</li><li><b>Set</b>: the direction a current is flowing toward.</li><li>A <b>nautical mile</b> is 1.852 km. A <b>knot</b> is 1 nautical mile per hour, about 1.8 km/h. A <b>fathom</b> is 6 feet, about 2 m.</li></ul>`,
    art(svg, S) {
      A.paperBg(svg);
      const g = A.g(svg, { transform: 'translate(260,60)' });
      A.rect(g, 0, 0, 280, 480, { rx: 16, fill: C.white, stroke: C.line, 'stroke-width': 1.5 });
      const cid = A.uid('tg');
      const cp = A.el('clipPath', { id: cid }, A.defs(svg));
      A.rect(cp, 0, 0, 280, 480, { rx: 16 });
      const water = A.rect(g, 0, 300, 280, 200, { fill: C.sea3, 'clip-path': `url(#${cid})` });
      A.rect(g, 120, 20, 40, 440, { fill: C.buoy, stroke: C.ink, 'stroke-width': 2 });
      for (let k = 0; k <= 10; k++) {
        A.line(g, 120, 40 + k * 40, k % 2 ? 140 : 160, 40 + k * 40, { stroke: C.ink, 'stroke-width': 2 });
        if (k % 2 === 0) A.text(g, 175, 46 + k * 40, String(5 - k / 2) + ' m', { font: 'body', size: 16, fill: C.ink });
      }
      const lab = A.tag(svg, 400, 560, 'FLOOD: RISING', { fill: C.stbd, size: 16 });
      const t = lab.querySelector('text'), r = lab.querySelector('rect');
      const tl = gsap.timeline({ repeat: -1 });
      tl.call(() => { t.textContent = 'FLOOD: RISING'; r.setAttribute('fill', C.stbd); })
        .to(water, { attr: { y: 120 }, duration: 3.5, ease: 'sine.inOut' })
        .call(() => { t.textContent = 'EBB: FALLING'; r.setAttribute('fill', C.port); })
        .to(water, { attr: { y: 300 }, duration: 3.5, ease: 'sine.inOut' });
      dimArrow(svg, 600, 180, 360, 'TIDAL RANGE');
    }
  });
  function dimArrow(svg, x, y1, y2, lab) {
    const g = A.g(svg);
    A.line(g, x, y1 + 6, x, y2 - 6, { stroke: C.ink, 'stroke-width': 3 });
    A.path(g, `M ${x - 8} ${y1 + 10} L ${x} ${y1} L ${x + 8} ${y1 + 10} Z`, { fill: C.ink });
    A.path(g, `M ${x - 8} ${y2 - 10} L ${x} ${y2} L ${x + 8} ${y2 - 10} Z`, { fill: C.ink });
    A.line(g, x - 60, y1, x + 20, y1, { stroke: C.ink, 'stroke-width': 1.5, 'stroke-dasharray': '4 4' });
    A.line(g, x - 60, y2, x + 20, y2, { stroke: C.ink, 'stroke-width': 1.5, 'stroke-dasharray': '4 4' });
    A.tag(g, x + 14, (y1 + y2) / 2, lab, { fill: C.ink, size: 14, anchor: 'start' });
  }
  P.push({
    type: 'try', title: 'Know the lingo',
    html: `<p>Read the meaning, then pick the word.</p>`,
    lockMsg: 'Match all eight',
    build(svg, S, api) {
      A.paperBg(svg);
      const g = A.g(svg);
      card(g, 80, 130, 640, 340);
      A.text(g, 400, 190, 'WHICH WORD MEANS…', { size: 18, weight: 700, anchor: 'middle', fill: C.port, ls: '0.16em' });
      const big = A.g(g);
      const items = [
        { t: 'The side sheltered from the wind', opts: ['Lee', 'Leeway', 'Windward', 'Wake'] },
        { t: 'Sideways movement of a boat caused by wind', opts: ['Leeway', 'Yaw', 'Set', 'Wash'] },
        { t: 'A falling tide, or the stream it makes', opts: ['Ebb', 'Flood', 'Neap', 'Swell'] },
        { t: 'The shore the wind is blowing onto', opts: ['Lee shore', 'Sea room', 'Fairway', 'Windward'] },
        { t: 'Not anchored or tied up, even if drifting', opts: ['Underway', 'Making way', 'Stand on', 'Headway'] },
        { t: 'Tides at new and full moon, with the biggest rise and fall', opts: ['Spring tides', 'Neap tides', 'Tidal range', 'King waves'] },
        { t: 'The direction a current is flowing toward', opts: ['Set', 'Ebb', 'Yaw', 'Leeway'] },
        { t: 'A safe distance from the shore and other hazards', opts: ['Sea room', 'Fairway', 'Freeboard', 'Lee'] }
      ];
      quiz(api, S, {
        items,
        show(it) {
          big.innerHTML = '';
          const ls = wrap(it.t, 26);
          ls.forEach((l, k) => A.text(big, 400, 320 - (ls.length - 1) * 24 + k * 48, l, { font: 'body', size: 32, weight: 700, anchor: 'middle', fill: C.ink }));
          gsap.from(big, { opacity: 0, y: 10, duration: 0.35 });
        },
        end: 'You can talk like a skipper now. The full glossary is at the back of the workbook.'
      });
    }
  });

  /* ---------- acronyms ---------- */
  const ACR = [['ABP', 'Australian Builders Plate'], ['AMSA', 'Australian Maritime Safety Authority'], ['EPIRB', 'Emergency Position Indicating Radio Beacon'], ['EVDS', 'Electronic Visual Distress Signal'],
    ['G', 'Centre of gravity'], ['GPS', 'Global Positioning System'], ['HELP', 'Heat Escape Lessening Position'], ['IALA', 'International Association of Lighthouse Authorities'],
    ['MOB', 'Man overboard'], ['PFD', 'Personal flotation device'], ['PLB', 'Personal locator beacon'], ['POI', 'Proof of identity'],
    ['PWC', 'Personal water craft'], ['RST', 'Recreational Skipper’s Ticket'], ['VMR', 'Volunteer Marine Rescue'], ['WST', 'Western Standard Time']];
  P.push({
    type: 'learn', title: 'Acronyms',
    html: `<p>You’ll meet these short forms in the workbook, on gear and on the radio.</p><p>Most you already know from earlier chapters. Check the ones you’re less sure of.</p>`,
    art(svg, S) {
      A.paperBg(svg);
      ACR.forEach(([a, m], k) => {
        const x = 24 + (k % 4) * 192, y = 22 + Math.floor(k / 4) * 142;
        const g = A.g(svg);
        A.rect(g, x, y, 176, 126, { rx: 14, fill: C.white, stroke: C.line, 'stroke-width': 1.5 });
        A.text(g, x + 88, y + 50, a, { size: 36, weight: 700, anchor: 'middle', fill: k % 3 === 0 ? C.port : k % 3 === 1 ? C.deep : C.stbd });
        wrap(m, 20).forEach((l, q) => A.text(g, x + 88, y + 80 + q * 18, l, { font: 'body', size: 14, anchor: 'middle', fill: C.ink2 }));
        gsap.from(g, { opacity: 0, y: 10, duration: 0.35, delay: 0.1 + k * 0.06 });
      });
    }
  });
  P.push({
    type: 'try', title: 'What does it stand for?',
    html: `<p>Pick what each one stands for.</p>`,
    lockMsg: 'Answer all six',
    build(svg, S, api) {
      A.paperBg(svg);
      const g = A.g(svg);
      card(g, 160, 140, 480, 320);
      const big = A.text(g, 400, 330, '', { size: 120, weight: 700, anchor: 'middle', fill: C.deep });
      const items = [
        { a: 'EPIRB', opts: ['Emergency Position Indicating Radio Beacon', 'Electronic Position Indicator and Radio Booster', 'Emergency Personal Inflatable Rescue Buoy', 'Electronic Protected Inshore Rescue Beacon'] },
        { a: 'EVDS', opts: ['Electronic Visual Distress Signal', 'Emergency Vessel Distress System', 'Electronic Vessel Detection Signal', 'Emergency Visual Display Screen'] },
        { a: 'HELP', opts: ['Heat Escape Lessening Position', 'Hypothermia Emergency Life Position', 'Heat Energy Loss Prevention', 'Huddle Every Lifejacket Position'] },
        { a: 'PFD', opts: ['Personal flotation device', 'Primary floating device', 'Personal floating dinghy', 'Portable flare device'] },
        { a: 'ABP', opts: ['Australian Builders Plate', 'Approved Boat Passengers', 'Australian Boating Permit', 'Automatic Bilge Pump'] },
        { a: 'MOB', opts: ['Man overboard', 'Marine operations base', 'Motor on board', 'Mooring off berth'] }
      ];
      quiz(api, S, {
        items, noun: 'Acronym',
        show(it) { big.textContent = it.a; gsap.from(big, { opacity: 0, scale: 0.85, svgOrigin: '400 300', duration: 0.35 }); },
        end: 'Six for six. The full list is in the workbook’s appendix.'
      });
    }
  });

  /* ---------- consent letter ---------- */
  P.push({
    type: 'learn', title: 'Under 18? Letter of consent',
    html: `<p>If you’re under 18, you need a <b>letter of consent</b> from a parent or legal guardian before you can be issued with an RST.</p>
<p>The workbook has a ready-made letter at the back. It asks for:</p>
<ul><li>your family name, other names and address</li><li>whether the person signing is your father, mother or legal guardian</li><li>their name, signature and the date.</li></ul>`,
    art(svg, S) {
      A.paperBg(svg);
      const g = A.g(svg, { transform: 'translate(210,40) rotate(-2)' });
      A.rect(g, 6, 8, 380, 520, { fill: 'rgba(18,38,58,0.14)' });
      A.rect(g, 0, 0, 380, 520, { fill: C.white, stroke: C.line, 'stroke-width': 1.5 });
      A.text(g, 30, 50, 'Letter of Consent', { size: 30, weight: 700, fill: C.ink });
      A.rect(g, 30, 64, 120, 4, { fill: C.port });
      [['I consent that', 110], ['Who resides at', 170], ['may be issued with an RST.', 230]].forEach(([t, y]) => {
        A.text(g, 30, y, t, { font: 'body', size: 17, fill: C.ink2 });
        if (y < 230) A.line(g, 30, y + 26, 350, y + 26, { stroke: C.ink3, 'stroke-width': 1.5, 'stroke-dasharray': '3 4' });
      });
      ['Father', 'Mother', 'Legal guardian'].forEach((t, k) => {
        A.rect(g, 30 + k * 110, 268, 20, 20, { rx: 4, fill: 'none', stroke: C.ink, 'stroke-width': 2 });
        A.text(g, 58 + k * 110, 284, t, { font: 'body', size: 15, fill: C.ink });
      });
      const tk = A.path(g, 'M 144 276 L 150 284 L 160 270', { fill: 'none', stroke: C.port, 'stroke-width': 3.5, 'stroke-linecap': 'round' });
      gsap.from(tk, { drawSVG: 0, duration: 0.4, delay: 0.8 });
      [['Name', 350], ['Signature', 410], ['Date', 470]].forEach(([t, y]) => {
        A.text(g, 30, y, t, { font: 'body', size: 15, weight: 700, fill: C.ink2 });
        A.line(g, 120, y + 2, 350, y + 2, { stroke: C.ink3, 'stroke-width': 1.5 });
      });
      const sig = A.path(g, 'M 130 402 q 14 -26 24 -4 q 8 16 18 -10 q 10 -18 16 6 q 6 14 22 -4 q 16 -12 40 -2', { fill: 'none', stroke: C.deep, 'stroke-width': 2.5, 'stroke-linecap': 'round' });
      gsap.from(sig, { drawSVG: 0, duration: 1.2, delay: 1.3 });
    }
  });

  /* ---------- recap ---------- */
  const R = [
    { q: 'Another boat is at right angles to your centreline, off to the side. Where is it?', opts: ['Abeam', 'On the bow', 'On the quarter', 'Dead ahead'], a: 0, why: 'At right angles to the centreline is abeam.' },
    { q: 'What is freeboard?', opts: ['The height from the water up to the gunwale', 'The depth of the hull below the waterline', 'The width of the boat at its widest point', 'The length from the bow to the transom'], a: 0, why: 'Freeboard is the vertical distance from the water to the gunwale.' },
    { q: 'How long is one nautical mile?', opts: ['1.852 kilometres', '1.609 kilometres', '1.000 kilometre', '2.000 kilometres'], a: 0, why: 'A nautical mile is 1.852 km. A knot is one nautical mile per hour.' }
  ];
  R.forEach((r, k) => P.push(Object.assign({ type: 'recap', n: k + 1, of: R.length }, r)));

  SR.chapter({
    id: 11, title: 'Appendices',
    intro: 'Shipboard directions, the words and acronyms skippers use, and the consent letter for under-18s. Ends with a short recap.',
    cover(svg, S) {
      dirScene(svg, S);
      A.text(svg, 60, 560, '11', { size: 160, weight: 700, fill: 'rgba(255,255,255,0.7)' });
    },
    pages: P
  });
})();
