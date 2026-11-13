/* Chapter 5: IALA Buoyage */
(function () {
  const A = SR.art, C = A.C;
  const { sky, caption, wedge } = SR.share;
  const BLK = '#1B232C', YLW = '#F2C21B', RED = '#C8352B', GRN = '#1C8A4F';
  const LW = '#FFF6DC', LR = '#FF4A3D', LG = '#3DDC84', LY = '#FFD23F';

  /* ---------- a navigation mark, side view. origin = waterline ---------- */
  function mark(parent, x, y, type, o) {
    o = o || {};
    const s = o.s || 1;
    const g = A.g(parent, { transform: `translate(${x},${y}) scale(${s})` });
    const svg = parent.ownerSVGElement || parent;
    A.el('ellipse', { cx: 0, cy: 8, rx: 48, ry: 12, fill: '#35414D' }, g);
    const body = 'M -34 4 L -16 -130 L 16 -130 L 34 4 Z';
    const cid = A.uid('mk');
    const cp = A.el('clipPath', { id: cid }, A.defs(svg));
    A.path(cp, body);
    const b = A.g(g, { 'clip-path': `url(#${cid})` });
    const band = (y0, y1, col) => A.rect(b, -40, y0, 80, y1 - y0, { fill: col });
    const bands = {
      port: [[-140, 10, RED]], stbd: [[-140, 10, GRN]], special: [[-140, 10, YLW]],
      north: [[-140, -63, BLK], [-63, 10, YLW]], south: [[-140, -63, YLW], [-63, 10, BLK]],
      east: [[-140, -88, BLK], [-88, -40, YLW], [-40, 10, BLK]], west: [[-140, -88, YLW], [-88, -40, BLK], [-40, 10, YLW]],
      isolated: [[-140, 10, BLK], [-82, -50, RED]], safe: [], plain: [[-140, 10, o.col || '#8E9AA6']]
    }[type] || [];
    if (o.colours === false && type !== 'safe') band(-140, 10, '#9AA5B0');
    else bands.forEach(([a, c, col]) => band(a, c, col));
    if (type === 'safe' && o.colours !== false) for (let k = -3; k < 3; k++) band(-140, 10, k % 2 ? RED : '#F7F3EA').setAttribute('x', k * 13);
    if (type === 'safe' && o.colours !== false) b.querySelectorAll('rect').forEach(r => r.setAttribute('width', 13));
    A.path(g, body, { fill: 'none', stroke: '#1E2A36', 'stroke-width': 2.5, 'stroke-linejoin': 'round' });
    // mast and lantern
    A.rect(g, -3, -168, 6, 40, { fill: '#33404C' });
    A.rect(g, -8, -150, 16, 14, { rx: 3, fill: '#33404C' });
    const lamp = A.circle(g, 0, -143, 5, { fill: o.light || '#55606B' });
    const glow = A.circle(g, 0, -143, 22, { fill: o.light || 'none', opacity: 0 });
    g.lamp = lamp; g.glow = glow;
    if (o.top !== false) topmark(g, type);
    return g;
  }
  function topmark(g, type) {
    const cone = (yb, up, col) => A.path(g, up ? `M -15 ${yb} L 15 ${yb} L 0 ${yb - 24} Z` : `M -15 ${yb - 24} L 15 ${yb - 24} L 0 ${yb} Z`, { fill: col || BLK, stroke: '#1E2A36', 'stroke-width': 1.5, 'stroke-linejoin': 'round' });
    const t = {
      port: () => A.rect(g, -13, -200, 26, 30, { fill: RED, stroke: '#1E2A36', 'stroke-width': 1.5 }),
      stbd: () => cone(-170, true, GRN),
      north: () => { cone(-170, true); cone(-200, true); },
      south: () => { cone(-170, false); cone(-200, false); },
      east: () => { cone(-170, false); cone(-200, true); },
      west: () => { cone(-196, true); cone(-198, false); },
      isolated: () => { A.circle(g, 0, -181, 11, { fill: BLK }); A.circle(g, 0, -205, 11, { fill: BLK }); },
      safe: () => A.circle(g, 0, -184, 13, { fill: RED, stroke: '#1E2A36', 'stroke-width': 1.5 }),
      special: () => { A.path(g, 'M -13 -205 L 13 -179 M 13 -205 L -13 -179', { stroke: YLW, 'stroke-width': 7, 'stroke-linecap': 'round' }); A.path(g, 'M -13 -205 L 13 -179 M 13 -205 L -13 -179', { stroke: '#1E2A36', 'stroke-width': 1, 'stroke-linecap': 'round', fill: 'none', opacity: 0.4 }); }
    }[type];
    if (type === 'west') { // point to point: top cone points down, bottom cone points up
      A.path(g, 'M -15 -170 L 15 -170 L 0 -193 Z', { fill: BLK, stroke: '#1E2A36', 'stroke-width': 1.5, 'stroke-linejoin': 'round' });
      A.path(g, 'M -15 -219 L 15 -219 L 0 -196 Z', { fill: BLK, stroke: '#1E2A36', 'stroke-width': 1.5, 'stroke-linejoin': 'round' });
      return;
    }
    if (t) t();
  }
  /* small top-down chart symbols */
  function chartMark(parent, x, y, type, s) {
    const g = A.g(parent, { transform: `translate(${x},${y}) scale(${s || 1})` });
    A.circle(g, 2, 3, 12, { fill: 'rgba(18,38,58,0.22)' });
    if (type === 'port') A.rect(g, -10, -10, 20, 20, { rx: 3, fill: RED, stroke: '#1E2A36', 'stroke-width': 1.5 });
    else if (type === 'stbd') A.path(g, 'M 0 -13 L 12 10 L -12 10 Z', { fill: GRN, stroke: '#1E2A36', 'stroke-width': 1.5, 'stroke-linejoin': 'round' });
    else A.circle(g, 0, 0, 11, { fill: type === 'special' ? YLW : BLK, stroke: '#1E2A36', 'stroke-width': 1.5 });
    return g;
  }
  /* light rhythms: [on, off, on, off ...] seconds for one period */
  const RH = {
    F: [999, 0], Fl: [0.6, 3.4], LFl: [2, 8], 'Fl(3)': [0.4, 0.6, 0.4, 0.6, 0.4, 5.6], 'Fl(2)': [0.5, 0.7, 0.5, 3.3], 'Fl(2+1)': [0.4, 0.6, 0.4, 1.8, 0.4, 4.4],
    Q: [0.4, 0.6], VQ: [0.22, 0.28], Oc: [3, 1], Iso: [2, 2], 'Mo(A)': [0.5, 0.5, 1.5, 5.5],
    N: [0.4, 0.6], E: [0.4, 0.6, 0.4, 0.6, 0.4, 7.6], S: [0.4, 0.6, 0.4, 0.6, 0.4, 0.6, 0.4, 0.6, 0.4, 0.6, 0.4, 0.6, 2, 7], W: [0.4, 0.6, 0.4, 0.6, 0.4, 0.6, 0.4, 0.6, 0.4, 0.6, 0.4, 0.6, 0.4, 0.6, 0.4, 0.6, 0.4, 6]
  };
  function blink(els, code, o) {
    o = o || {};
    const seq = RH[code];
    const tl = gsap.timeline({ repeat: -1, delay: o.delay || 0 });
    let t = 0;
    tl.set(els, { opacity: 0 }, 0);
    for (let k = 0; k < seq.length; k += 2) {
      const on = Math.min(seq[k], 60), off = seq[k + 1];
      tl.set(els, { opacity: 1 }, t);
      t += on;
      if (off > 0) tl.set(els, { opacity: o.dim || 0 }, t);
      t += off;
    }
    tl.set({}, {}, t);
    return tl;
  }
  /* lamp with glow for light demos */
  function lamp(parent, x, y, col, r) {
    const g = A.g(parent, { transform: `translate(${x},${y})` });
    const off = A.circle(g, 0, 0, r, { fill: '#3A4A5C', stroke: '#56687C', 'stroke-width': 1.5 });
    const on = A.g(g);
    A.circle(on, 0, 0, r * 3.2, { fill: col, opacity: 0.18 });
    A.circle(on, 0, 0, r * 1.8, { fill: col, opacity: 0.35 });
    A.circle(on, 0, 0, r, { fill: col });
    A.circle(on, 0, 0, r * 0.45, { fill: '#fff', opacity: 0.8 });
    g.on = on;
    return g;
  }
  /* on/off strip for one period */
  function strip(parent, x, y, w, code, col) {
    const seq = RH[code];
    const tot = code === 'F' ? 1 : seq.reduce((a, b) => a + b, 0);
    const g = A.g(parent, { transform: `translate(${x},${y})` });
    A.rect(g, 0, 0, w, 14, { rx: 4, fill: '#1A2533' });
    let t = 0;
    for (let k = 0; k < seq.length; k += 2) {
      const on = code === 'F' ? 1 : seq[k];
      A.rect(g, (t / tot) * w, 1, Math.max(2, (on / tot) * w), 12, { rx: 2, fill: col || LW });
      t += on + (seq[k + 1] || 0);
    }
    return g;
  }
  function seaLine(svg, y) { return A.waterSide(svg, y, { amp: 4 }); }

  const P = [];

  P.push({
    type: 'learn', title: 'Marks that guide you',
    html: `<p>The <span class="term">IALA</span> system is an international set of buoys, beacons and lights that guides vessels clear of danger and shows where the safe water is. Australia uses <b>IALA Region A</b>.</p>
<p>Each mark has a distinctive <b>shape</b> and <b>colour</b>. Lit marks also have a distinctive light <b>colour</b> and <b>rhythm</b>.</p>
<p>Every mark is shown on the chart. When in doubt about what you're looking at, check the chart.</p>`,
    art(svg, S) {
      sky(svg);
      const types = ['port', 'stbd', 'north', 'isolated', 'safe', 'special'];
      types.forEach((t, k) => {
        const m = mark(svg, 90 + k * 124, 420, t, { s: 0.8 });
        gsap.to(m, { rotation: k % 2 ? 3 : -3, svgOrigin: `${90 + k * 124} 420`, duration: 1.8 + k * 0.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      });
      seaLine(svg, 420);
    }
  });

  /* ---------- lateral ---------- */
  P.push({
    type: 'learn', title: 'Lateral marks',
    html: `<p><span class="term">Lateral marks</span> show the port and starboard sides of a channel.</p>
<ul><li><b>Port marks</b> are red, topped by a red <b>can</b> (a flat-topped square shape).</li><li><b>Starboard marks</b> are green, topped by a green <b>triangle</b> (cone) pointing up.</li></ul>`,
    art(svg, S) {
      sky(svg);
      const p = mark(svg, 260, 440, 'port', { s: 1.25 }), s = mark(svg, 540, 440, 'stbd', { s: 1.25 });
      [[p, 260], [s, 540]].forEach(([m, x], k) => gsap.to(m, { rotation: k ? 3 : -3, svgOrigin: `${x} 440`, duration: 2, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
      seaLine(svg, 440);
      A.tag(svg, 260, 530, 'PORT: RED CAN', { fill: RED });
      A.tag(svg, 540, 530, 'STARBOARD: GREEN CONE', { fill: GRN });
    }
  });

  P.push({
    type: 'learn', title: 'Which side to leave them',
    html: `<p><b>Entering a harbour</b> or going <b>upstream</b>: leave port marks on your port side and starboard marks on your starboard side.</p>
<p><b>Leaving a harbour</b> or going <b>downstream</b>: it flips. Leave port marks on your starboard side and starboard marks on your port side.</p>
<p>A memory jog for coming in: "there's some <b>red port left</b> in the bottle".</p>`,
    art(svg, S) {
      S.seaBg(svg);
      A.land(svg, 'M -20 -20 L 820 -20 L 820 110 C 640 130 520 90 470 120 L 470 -20 L 330 -20 L 330 120 C 280 90 160 130 -20 110 Z');
      A.text(svg, 400, 60, 'HARBOUR', { size: 18, weight: 700, anchor: 'middle', fill: C.ink2, ls: '0.2em' });
      [150, 260, 370, 480].forEach(y => { chartMark(svg, 320, y, 'port'); chartMark(svg, 480, y, 'stbd'); });
      const wk = A.g(svg); S.wakes(wk);
      const b = S.boat(svg, { len: 70, color: C.port });
      const lab = A.g(svg);
      const setLab = (t) => { lab.innerHTML = ''; A.tag(lab, 640, 300, t, { fill: C.ink, size: 15 }); };
      gsap.timeline({ repeat: -1 })
        .call(() => setLab('COMING IN: RED ON YOUR LEFT'))
        .set(b, { x: 380, y: 650, rotation: -90 })
        .to(b, { y: 70, duration: 6, ease: 'none' })
        .call(() => setLab('GOING OUT: RED ON YOUR RIGHT'))
        .set(b, { x: 420, y: 70, rotation: 90 })
        .to(b, { y: 650, duration: 6, ease: 'none' });
    }
  });

  P.push({
    type: 'try', title: 'Through the channel',
    html: `<p>A single mark is ahead. Which side of your boat should it pass?</p>`,
    lockMsg: 'Answer all six',
    build(svg, S, api) {
      S.seaBg(svg);
      const layer = A.g(svg);
      const wk = A.g(svg); S.wakes(wk);
      const b = S.boat(svg, { len: 70, color: C.port });
      const items = [
        { dir: 'in', m: 'port', a: 'port' }, { dir: 'out', m: 'port', a: 'stbd' }, { dir: 'in', m: 'stbd', a: 'stbd' },
        { dir: 'out', m: 'stbd', a: 'port' }, { dir: 'up', m: 'stbd', a: 'stbd' }, { dir: 'down', m: 'port', a: 'stbd' }
      ];
      const dirTxt = { in: 'Entering harbour', out: 'Leaving harbour', up: 'Going upstream', down: 'Going downstream' };
      const ui = document.createElement('div');
      ui.innerHTML = `<p class="q" style="margin-bottom:10px"></p><div class="chips"><button class="chip" data-v="port">On my port side</button><button class="chip" data-v="stbd">On my starboard side</button></div><div class="status"></div>`;
      api.task.appendChild(ui);
      const q = ui.querySelector('.q'), stt = ui.querySelector('.status');
      let i = 0, busy = false;
      const show = () => {
        layer.innerHTML = '';
        const it = items[i];
        const going = it.dir === 'in' || it.dir === 'up';
        A.tag(layer, 400, 40, going ? 'HARBOUR / UPSTREAM AHEAD' : 'OPEN SEA / DOWNSTREAM AHEAD', { fill: C.ink, size: 14 });
        chartMark(layer, 400, 280, it.m, 1.6);
        gsap.killTweensOf(b);
        b.x = 400; b.y = 560; b.rotation = -90; b.trail.length = 0; b._lx = null;
        q.textContent = `${dirTxt[it.dir]}. Where do you leave this ${it.m === 'port' ? 'port (red)' : 'starboard (green)'} mark?`;
        stt.textContent = `${i + 1} of ${items.length}`;
      };
      ui.querySelectorAll('.chip').forEach(btn => btn.onclick = () => {
        if (busy || i >= items.length) return;
        const it = items[i];
        if (btn.dataset.v === it.a) {
          busy = true;
          const side = it.a === 'port' ? 1 : -1; // mark on my port (left) means I pass to its right
          gsap.to(b, { motionPath: { path: `M 400 560 C 400 460 ${400 + side * 80} 380 ${400 + side * 80} 280 C ${400 + side * 80} 180 400 120 400 -80`, autoRotate: true }, duration: 3.4, ease: 'power1.inOut' });
          api.say(it.dir === 'in' || it.dir === 'up' ? 'Coming in or going upstream, the mark goes on its own side.' : 'Going out or downstream, it flips to the opposite side.', 'good');
          S.after(3000, () => {
            busy = false; i++;
            if (i < items.length) { api.hush(); show(); }
            else { q.textContent = 'All done.'; stt.textContent = ''; ui.querySelector('.chips').style.display = 'none'; api.done('Red port left in the bottle on the way in. On the way out, it all flips.'); }
          });
        } else api.say('Not that side. Are you coming in or going out?', 'bad');
      });
      show();
    }
  });

  P.push({
    type: 'learn', title: 'Upstream and downstream',
    html: `<p>Lateral marks aren't always in pairs that you pass between. When you see a single mark, think about which way is upstream.</p>
<p><b>Upstream</b> is the direction the <b>flood</b> (incoming) tide flows: into harbours and up rivers. <b>Downstream</b> is the way the <b>ebb</b> tide flows, out to sea.</p>
<p>And remember: keep to your right in a channel.</p>`,
    art(svg, S) {
      S.seaBg(svg, { top: '#C9E0E3', bottom: '#AFD0D6' });
      const bank = (y, up) => { let d = `M -20 ${up ? -20 : 640} L -20 ${y}`; for (let x = 0; x <= 820; x += 20) d += ` L ${x} ${(y + Math.sin(x / 90 + (up ? 0 : 2)) * 8).toFixed(1)}`; d += ` L 820 ${up ? -20 : 640} Z`; A.land(svg, d); };
      bank(150, true); bank(460, false);
      chartMark(svg, 300, 200, 'port'); chartMark(svg, 560, 410, 'stbd'); chartMark(svg, 140, 410, 'stbd');
      const flood = A.g(svg);
      [0, 1, 2, 3, 4, 5].forEach(k => { const a = A.arrow(flood, `M ${-60 + k * 160} 305 L ${10 + k * 160} 305`, { color: 'rgba(255,255,255,0.85)', width: 4 }); gsap.to(a, { x: 160, duration: 3, repeat: -1, ease: 'none' }); });
      A.tag(svg, 400, 520, 'FLOOD TIDE FLOWS UPSTREAM', { fill: C.ink, size: 15 });
      A.text(svg, 760, 120, 'UPSTREAM', { size: 16, weight: 700, anchor: 'end', fill: C.ink2, ls: '0.2em' });
      A.text(svg, 40, 120, 'SEA', { size: 16, weight: 700, fill: C.ink2, ls: '0.2em' });
    }
  });

  P.push({
    type: 'learn', title: 'Lateral lights',
    html: `<p>When lit, port marks show a <b>red</b> light and starboard marks show a <b>green</b> light. They're the only marks that use these colours.</p>
<p>The light can flash in any rhythm except composite group flashing, Fl(2+1).</p>`,
    night: true,
    art(svg, S) {
      A.nightBg(svg);
      A.rect(svg, 0, 380, 800, 220, { fill: '#08131F' });
      const pairs = [[180, 'port', LR, 'Fl'], [330, 'stbd', LG, 'Q'], [480, 'port', LR, 'Fl(3)'], [630, 'stbd', LG, 'Fl']];
      pairs.forEach(([x, t, col, code], k) => {
        const m = mark(svg, x, 380, t, { s: 0.7 });
        m.setAttribute('opacity', 0.45);
        const l = lamp(svg, x, 380 - 143 * 0.7, col, 7);
        blink(l.on, code, { delay: k * 0.3 });
        A.text(svg, x, 470, code, { size: 20, weight: 700, anchor: 'middle', fill: '#C5D3E0' });
      });
    }
  });

  /* ---------- light characteristics ---------- */
  const lightRows = (svg, codes, names) => {
    A.nightBg(svg);
    codes.forEach((c, k) => {
      const y = 80 + k * 105;
      const l = lamp(svg, 90, y, LW, 10);
      blink(l.on, c);
      A.text(svg, 140, y - 8, c, { size: 30, weight: 700, fill: '#fff' });
      A.text(svg, 140, y + 20, names[k], { font: 'body', size: 17, fill: '#9FB3C8' });
      strip(svg, 440, y - 7, 320, c, LW);
    });
    A.text(svg, 600, 560, 'ONE PERIOD', { size: 14, weight: 700, anchor: 'middle', fill: '#7F96AD', ls: '0.2em' });
  };

  P.push({
    type: 'learn', title: 'Light rhythms, part 1',
    html: `<ul><li><b>Fixed (F):</b> shows continuously.</li><li><b>Flashing (Fl):</b> light is shorter than dark, flashes usually equal.</li><li><b>Long flashing (LFl):</b> a flash of at least 2 seconds, repeated.</li><li><b>Group flashing, e.g. Fl(3):</b> a set number of flashes, repeated.</li><li><b>Composite group flashing, Fl(2+1):</b> groups with different numbers of flashes.</li></ul>
<p>The <span class="term">period</span> is the time for one full cycle.</p>`,
    night: true,
    art(svg, S) { lightRows(svg, ['F', 'Fl', 'LFl', 'Fl(3)', 'Fl(2+1)'], ['Fixed', 'Flashing', 'Long flashing', 'Group flashing', 'Composite group flashing']); }
  });

  P.push({
    type: 'learn', title: 'Light rhythms, part 2',
    html: `<ul><li><b>Quick flashing (Q):</b> 50 or 60 flashes a minute.</li><li><b>Very quick flashing (VQ):</b> 100 or 120 flashes a minute.</li><li><b>Occulting (Oc):</b> light is longer than dark. It looks like a steady light that briefly goes out.</li><li><b>Isophase (Iso):</b> light and dark exactly equal.</li><li><b>Morse, Mo(A):</b> short and long flashes spelling a Morse letter. A is short then long.</li></ul>`,
    night: true,
    art(svg, S) { lightRows(svg, ['Q', 'VQ', 'Oc', 'Iso', 'Mo(A)'], ['Quick flashing', 'Very quick flashing', 'Occulting', 'Isophase', 'Morse code A']); }
  });

  P.push({
    type: 'try', title: 'Read the light',
    html: `<p>Watch the light for a few seconds, then pick its rhythm.</p>`,
    lockMsg: 'Answer all six',
    night: true,
    build(svg, S, api) {
      A.nightBg(svg);
      A.rect(svg, 0, 400, 800, 200, { fill: '#08131F' });
      const l = lamp(svg, 400, 250, LW, 18);
      A.rect(svg, 392, 280, 16, 120, { fill: '#1E2A36' });
      const order = ['Oc', 'Q', 'Iso', 'Fl', 'VQ', 'LFl'];
      const why = { Oc: 'More light than dark: occulting.', Q: 'About one flash a second: quick flashing.', Iso: 'Equal light and dark: isophase.', Fl: 'Short flashes with long dark gaps: flashing.', VQ: 'About two flashes a second: very quick flashing.', LFl: 'A long flash of 2 seconds or more: long flashing.' };
      let i = 0, busy = false, tl = null;
      const ui = document.createElement('div');
      ui.innerHTML = `<div class="chips">${['Fl', 'LFl', 'Q', 'VQ', 'Oc', 'Iso'].map(v => `<button class="chip" data-v="${v}">${v}</button>`).join('')}</div><div class="status"></div>`;
      api.task.appendChild(ui);
      const stt = ui.querySelector('.status');
      const show = () => { if (tl) tl.kill(); tl = blink(l.on, order[i]); stt.textContent = `Light ${i + 1} of ${order.length}`; };
      ui.querySelectorAll('.chip').forEach(b => b.onclick = () => {
        if (busy || i >= order.length) return;
        if (b.dataset.v === order[i]) {
          busy = true; api.say(`<b>${order[i]}.</b> ${why[order[i]]}`, 'good');
          S.after(1700, () => { busy = false; i++; if (i < order.length) { api.hush(); show(); } else { if (tl) tl.kill(); gsap.set(l.on, { opacity: 1 }); stt.textContent = ''; ui.querySelector('.chips').style.display = 'none'; api.done('Compare the light with the dark: that tells you most rhythms.'); } });
        } else api.say('Not quite. Is there more light or more dark? How fast is it?', 'bad');
      });
      show();
    }
  });

  P.push({
    type: 'check', title: 'Mostly on',
    q: 'A light stays on most of the time and goes dark briefly at regular intervals. What is it?',
    opts: ['Flashing', 'Isophase', 'Occulting', 'Quick flashing'], a: 2,
    why: 'Occulting: the light is on for longer than it is dark.'
  });

  /* ---------- other marks ---------- */
  const markPage = (title, type, html, light, code, lbl) => ({
    type: 'learn', title, html,
    art(svg, S) {
      sky(svg);
      const night = A.g(svg);
      const m = mark(svg, 300, 450, type, { s: 1.4, light: light });
      gsap.to(m, { rotation: 3, svgOrigin: '300 450', duration: 2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      seaLine(svg, 450);
      const panel = A.g(svg, { transform: 'translate(500,150)' });
      A.rect(panel, 0, 0, 240, 200, { rx: 18, fill: C.night });
      const l = lamp(panel, 120, 80, light, 13);
      blink(l.on, code);
      A.text(panel, 120, 160, lbl, { size: 22, weight: 700, anchor: 'middle', fill: '#fff' });
      A.text(panel, 120, 186, 'AT NIGHT', { size: 13, weight: 700, anchor: 'middle', fill: '#7F96AD', ls: '0.2em' });
    }
  });

  P.push(markPage('Isolated danger marks', 'isolated', `<p>An <span class="term">isolated danger mark</span> sits on a small danger, such as a rock, with navigable water all around it.</p>
<p>It is black with one or more red bands, with <b>two black spheres</b> on top. In general, pass as well clear as you can.</p>
<p>If lit, it shows a <b>white</b> light flashing in groups of two, Fl(2). Two flashes to match the two spheres.</p>`, LW, 'Fl(2)', 'Fl(2)'));

  P.push(markPage('Safe water marks', 'safe', `<p>A <span class="term">safe water mark</span> has safe water all around it. It most often marks the seaward end of a channel into a port, and sometimes the middle of a channel.</p>
<p>It has <b>red and white vertical stripes</b> and a single <b>red sphere</b> on top.</p>
<p>If lit, it shows a <b>white</b> light: isophase, occulting, one long flash every 10 seconds, or Morse A.</p>`, LW, 'Iso', 'Iso'));

  P.push(markPage('Special marks', 'special', `<p><span class="term">Special marks</span> show a special area or feature that you can look up on the chart, such as traffic separation, spoil grounds or aquaculture. They aren't meant to mark channels or obstructions.</p>
<p>They are <b>yellow</b>, with a <b>yellow X</b> on top.</p>
<p>If lit, the light is <b>yellow</b>, in any rhythm not used by the white lights of other marks.</p>`, LY, 'Fl', 'Fl Y'));

  P.push({
    type: 'try', title: 'Name that mark',
    html: `<p>What kind of mark is this?</p>`,
    lockMsg: 'Identify all six',
    build(svg, S, api) {
      sky(svg);
      const holder = A.g(svg);
      seaLine(svg, 470);
      const names = { port: 'Port lateral', stbd: 'Starboard lateral', isolated: 'Isolated danger', safe: 'Safe water', special: 'Special' };
      const order = ['special', 'isolated', 'stbd', 'safe', 'port', 'isolated'];
      const why = { special: 'Yellow with a yellow X.', isolated: 'Black and red with two black spheres.', stbd: 'Green with a green cone pointing up.', safe: 'Red and white stripes with a red sphere.', port: 'Red with a red can.' };
      const ui = document.createElement('div');
      ui.innerHTML = `<div class="opts" role="group">${Object.keys(names).map(k => `<button class="opt" data-k="${k}"><span class="dot"></span><span>${names[k]}</span></button>`).join('')}</div><div class="status"></div>`;
      api.task.appendChild(ui);
      const stt = ui.querySelector('.status');
      let i = 0, busy = false;
      const show = () => {
        holder.innerHTML = '';
        const m = mark(holder, 400, 470, order[i], { s: 1.5 });
        gsap.from(m, { y: '+=40', opacity: 0, duration: 0.6, ease: 'back.out(1.4)' });
        stt.textContent = `${i + 1} of ${order.length}`;
        ui.querySelectorAll('.opt').forEach(b => b.className = 'opt');
      };
      ui.querySelectorAll('.opt').forEach(b => b.onclick = () => {
        if (busy || i >= order.length) return;
        if (b.dataset.k === order[i]) {
          busy = true; b.className = 'opt right';
          api.say(`<b>${names[order[i]]}.</b> ${why[order[i]]}`, 'good');
          S.after(1700, () => { busy = false; i++; if (i < order.length) { api.hush(); show(); } else { stt.textContent = ''; api.done('Shape and colour by day, light colour and rhythm by night.'); } });
        } else { b.className = 'opt wrong'; api.say('Look at the colours and the shape on top.', 'bad'); }
      });
      show();
    }
  });

  /* ---------- cardinal ---------- */
  P.push({
    type: 'learn', title: 'Cardinal marks',
    html: `<p><span class="term">Cardinal marks</span> are used where lateral marks would be confusing. Each one tells you the <b>compass direction</b> of the safest water from a danger, such as a reef or shallows. A compass on board is very useful.</p>
<p>Pass to the <b>north</b> of a North Cardinal, the <b>east</b> of an East Cardinal, the <b>south</b> of a South Cardinal and the <b>west</b> of a West Cardinal.</p>`,
    art(svg, S) {
      S.seaBg(svg);
      A.path(svg, 'M 330 230 C 380 200 460 210 480 260 C 500 310 470 370 410 375 C 350 380 300 340 305 290 C 308 260 315 240 330 230 Z', { fill: C.reef, opacity: 0.85 });
      A.text(svg, 400, 300, 'DANGER', { size: 20, weight: 700, anchor: 'middle', fill: '#fff', ls: '0.14em' });
      const spots = { north: [400, 150], east: [580, 295], south: [400, 450], west: [220, 295] };
      Object.entries(spots).forEach(([t, [x, y]]) => {
        mark(svg, x, y + 30, t, { s: 0.42 });
        const dx = Math.sign(x - 400), dy = Math.sign(y - 295);
        A.arrow(svg, `M ${x + dx * 40} ${y + dy * 30} L ${x + dx * 110} ${y + dy * 80}`, { color: C.stbd, width: 4 });
      });
      // compass
      const cp = A.g(svg, { transform: 'translate(700,90)' });
      A.circle(cp, 0, 0, 40, { fill: C.white, stroke: C.ink, 'stroke-width': 2 });
      A.path(cp, 'M 0 -32 L 8 0 L 0 32 L -8 0 Z', { fill: C.ink });
      A.path(cp, 'M 0 -32 L 8 0 L -8 0 Z', { fill: C.port });
      A.text(cp, 0, -48, 'N', { size: 18, weight: 700, anchor: 'middle' });
    }
  });

  P.push({
    type: 'learn', title: 'Reading a cardinal mark',
    html: `<p>Cardinal marks are black and yellow, with two black cones on top. <b>The cones point to where the black is.</b></p>
<ul><li><b>North:</b> both cones point up. Black on top.</li><li><b>East:</b> cones point up and down (base to base). Black top and bottom.</li><li><b>South:</b> both cones point down. Black at the bottom.</li><li><b>West:</b> cones point inwards (point to point). Black in the middle.</li></ul>`,
    art(svg, S) {
      sky(svg);
      ['north', 'east', 'south', 'west'].forEach((t, k) => {
        const x = 110 + k * 193;
        const m = mark(svg, x, 470, t, { s: 1.05 });
        gsap.from(m, { y: '+=30', opacity: 0, duration: 0.6, delay: 0.2 + k * 0.2, ease: 'back.out(1.4)' });
      });
      seaLine(svg, 470);
      ['north', 'east', 'south', 'west'].forEach((t, k) => A.tag(svg, 110 + k * 193, 545, t.toUpperCase(), { fill: C.ink, size: 17 }));
    }
  });

  P.push({
    type: 'learn', title: 'Cardinal lights',
    html: `<p>Cardinal lights are <b>white</b>, quick (Q) or very quick (VQ) flashing. The number of flashes follows a clock face:</p>
<ul><li><b>3 o'clock = East:</b> 3 flashes</li><li><b>6 o'clock = South:</b> 6 flashes + 1 long flash</li><li><b>9 o'clock = West:</b> 9 flashes</li><li><b>12 o'clock = North:</b> continuous flashing</li></ul>
<p>The long flash for south and the continuous flashing for north stop you getting confused if you lose count.</p>`,
    night: true,
    art(svg, S) {
      A.nightBg(svg);
      const cx = 400, cy = 300, R = 190;
      A.circle(svg, cx, cy, R + 30, { fill: '#0F1F33', stroke: '#2B4058', 'stroke-width': 3 });
      for (let k = 0; k < 12; k++) { const a = k * 30 * Math.PI / 180; A.line(svg, cx + Math.sin(a) * (R + 8), cy - Math.cos(a) * (R + 8), cx + Math.sin(a) * (R + 22), cy - Math.cos(a) * (R + 22), { stroke: '#4E6680', 'stroke-width': 3 }); }
      const spots = [['N', 0, 'N', '12'], ['E', 90, 'E', '3'], ['S', 180, 'S', '6'], ['W', 270, 'W', '9']];
      spots.forEach(([lbl, deg, code, num]) => {
        const a = deg * Math.PI / 180, x = cx + Math.sin(a) * (R - 50), y = cy - Math.cos(a) * (R - 50);
        const l = lamp(svg, x, y, LW, 10);
        blink(l.on, code);
        A.text(svg, cx + Math.sin(a) * (R - 100), cy - Math.cos(a) * (R - 100) + 8, lbl, { size: 26, weight: 700, anchor: 'middle', fill: '#C5D3E0' });
        A.text(svg, cx + Math.sin(a) * (R + 48), cy - Math.cos(a) * (R + 48) + 8, num, { size: 22, weight: 700, anchor: 'middle', fill: '#7F96AD' });
      });
    }
  });

  P.push({
    type: 'try', title: 'Which cardinal?',
    html: `<p>Identify each cardinal mark. Some have lost their topmark, and some you'll only see at night.</p>`,
    lockMsg: 'Identify all six',
    build(svg, S, api) {
      const holder = A.g(svg);
      const order = [['north', 'full'], ['west', 'full'], ['south', 'colours'], ['east', 'colours'], ['east', 'light'], ['south', 'light']];
      const why = { north: 'Cones up, black on top.', east: 'Black top and bottom. At night, 3 flashes.', south: 'Black at the bottom. At night, 6 flashes and a long one.', west: 'Cones point to point, black in the middle. At night, 9 flashes.' };
      const ui = document.createElement('div');
      ui.innerHTML = `<p class="q" style="margin-bottom:10px"></p><div class="chips">${['north', 'east', 'south', 'west'].map(v => `<button class="chip" data-v="${v}">${v[0].toUpperCase() + v.slice(1)}</button>`).join('')}</div><div class="status"></div>`;
      api.task.appendChild(ui);
      const q = ui.querySelector('.q'), stt = ui.querySelector('.status');
      let i = 0, busy = false;
      const show = () => {
        holder.innerHTML = '';
        const [t, mode] = order[i];
        api.stage.classList.toggle('night', mode === 'light');
        if (mode === 'light') {
          A.nightBg(holder);
          A.rect(holder, 0, 420, 800, 180, { fill: '#08131F' });
          const l = lamp(holder, 400, 250, LW, 16);
          blink(l.on, t[0].toUpperCase());
          q.textContent = 'You see this white light at night. Count the flashes.';
        } else {
          sky(holder);
          mark(holder, 400, 480, t, { s: 1.5, top: mode === 'full' });
          seaLine(holder, 480);
          q.textContent = mode === 'full' ? 'Which cardinal is this?' : 'The topmark has fallen off. Which cardinal is it?';
        }
        stt.textContent = `${i + 1} of ${order.length}`;
      };
      ui.querySelectorAll('.chip').forEach(b => b.onclick = () => {
        if (busy || i >= order.length) return;
        const t = order[i][0];
        if (b.dataset.v === t) {
          busy = true; api.say(`<b>${t[0].toUpperCase() + t.slice(1)} cardinal.</b> ${why[t]}`, 'good');
          S.after(1800, () => { busy = false; i++; if (i < order.length) { api.hush(); show(); } else { holder.innerHTML = ''; sky(holder); ['north', 'east', 'south', 'west'].forEach((m, k) => mark(holder, 120 + k * 186, 470, m, { s: 0.9 })); seaLine(holder, 470); api.stage.classList.remove('night'); q.textContent = 'All done.'; stt.textContent = ''; ui.querySelector('.chips').style.display = 'none'; api.done('Cones point to the black. Flashes follow the clock.'); } });
        } else api.say('Not that one. Where is the black? How many flashes?', 'bad');
      });
      show();
    }
  });

  P.push({
    type: 'try', title: 'Pass on the safe side',
    html: `<p>Use the cardinal mark to choose the safe side of the reef.</p>`,
    lockMsg: 'Answer all four',
    build(svg, S, api) {
      S.seaBg(svg);
      A.path(svg, 'M 320 220 C 380 190 470 200 490 255 C 510 310 480 380 410 385 C 345 390 290 345 296 290 C 300 255 305 235 320 220 Z', { fill: C.reef, opacity: 0.85 });
      const layer = A.g(svg);
      const wk = A.g(svg); S.wakes(wk);
      const b = S.boat(svg, { len: 60, color: C.port });
      const order = ['east', 'north', 'west', 'south'];
      const pos = { north: [400, 140], east: [590, 300], south: [400, 470], west: [200, 300] };
      const route = {
        north: 'M -60 160 C 200 110 600 110 860 160', south: 'M -60 470 C 200 530 600 530 860 470',
        east: 'M 690 640 C 650 400 650 200 690 -40', west: 'M 110 640 C 150 400 150 200 110 -40'
      };
      const ui = document.createElement('div');
      ui.innerHTML = `<div class="chips">${order.slice().sort().map(v => `<button class="chip" data-v="${v}">Pass ${v}</button>`).join('')}</div><div class="status"></div>`;
      api.task.appendChild(ui);
      const stt = ui.querySelector('.status');
      let i = 0, busy = false;
      const show = () => {
        layer.innerHTML = '';
        const t = order[i], [x, y] = pos[t];
        mark(layer, x, y + 34, t, { s: 0.48 });
        b.x = -200; b.y = -200;
        stt.textContent = `${i + 1} of ${order.length}`;
      };
      ui.querySelectorAll('.chip').forEach(btn => btn.onclick = () => {
        if (busy || i >= order.length) return;
        const t = order[i];
        if (btn.dataset.v === t) {
          busy = true;
          b.trail.length = 0; b._lx = null;
          gsap.fromTo(b, { x: -200 }, { motionPath: { path: route[t], autoRotate: true }, duration: 4, ease: 'none' });
          api.say(`This is a <b>${t}</b> cardinal, so the safe water is to the ${t}.`, 'good');
          S.after(3600, () => { busy = false; i++; if (i < order.length) { api.hush(); show(); } else { stt.textContent = ''; ui.querySelector('.chips').style.display = 'none'; api.done('A cardinal is named for the side you pass it on.'); } });
        } else api.say('Identify the mark first: where is the black, which way do the cones point?', 'bad');
      });
      show();
    }
  });

  /* ---------- leads and sectored lights ---------- */
  P.push({
    type: 'learn', title: 'Leads',
    html: `<p><span class="term">Leads</span> are a pair of marks that, when lined up, show a safe path through shallow or dangerous water. They're often used to approach anchorages, and there are many at Rottnest.</p>
<p>Steer so the <b>rear lead</b> stays directly above the <b>front lead</b>.</p>
<p>If lit, leads can use any colour. Check the chart for details.</p>`,
    art(svg, S) {
      S.seaBg(svg);
      A.land(svg, 'M -20 -20 L 820 -20 L 820 120 C 600 140 200 100 -20 130 Z');
      A.path(svg, 'M 340 600 L 340 120 L 460 120 L 460 600 Z', { fill: 'rgba(255,255,255,0.18)' });
      A.path(svg, 'M 120 330 C 180 300 260 320 300 380 C 320 430 260 470 180 460 C 110 450 80 380 120 330 Z', { fill: C.reef, opacity: 0.85 });
      A.path(svg, 'M 520 280 C 600 250 700 290 720 360 C 735 420 660 460 580 440 C 510 420 480 330 520 280 Z', { fill: C.reef, opacity: 0.85 });
      A.line(svg, 400, 40, 400, 600, { stroke: C.ink, 'stroke-width': 2, 'stroke-dasharray': '8 8' });
      const ld = (y, up, lbl) => { A.rect(svg, 396, y, 8, 30, { fill: C.ink2 }); A.path(svg, up ? `M 386 ${y} L 414 ${y} L 400 ${y - 24} Z` : `M 386 ${y - 24} L 414 ${y - 24} L 400 ${y} Z`, { fill: C.orange, stroke: C.ink, 'stroke-width': 1.5 }); A.tag(svg, 470, y - 10, lbl, { fill: C.ink, size: 14 }); };
      ld(60, false, 'REAR LEAD'); ld(110, true, 'FRONT LEAD');
      const wk = A.g(svg); S.wakes(wk);
      const b = S.boat(svg, { len: 70, color: C.port });
      gsap.timeline({ repeat: -1 }).set(b, { x: 400, y: 680, rotation: -90 }).to(b, { y: 190, duration: 8, ease: 'none' });
    }
  });

  P.push({
    type: 'try', title: 'Line up the leads',
    html: `<p>You're heading in towards the leads. Slide your boat left or right until the rear lead sits directly above the front lead.</p>`,
    lockMsg: 'Line up the leads',
    build(svg, S, api) {
      sky(svg, '#DCE9EC', '#EEF2EC');
      A.rect(svg, 0, 300, 800, 300, { fill: '#7FB0BC' });
      A.path(svg, 'M -20 300 C 100 280 250 270 400 276 C 560 282 700 270 820 290 L 820 302 L -20 302 Z', { fill: '#C9BC98' });
      const scene = A.g(svg);
      const front = A.g(scene), rear = A.g(scene);
      const lead = (g, h, w, up) => { A.rect(g, -w * 0.12, -h, w * 0.24, h, { fill: '#5B6E80' }); A.path(g, up ? `M ${-w / 2} ${-h} L ${w / 2} ${-h} L 0 ${-h - w * 0.85} Z` : `M ${-w / 2} ${-h - w * 0.85} L ${w / 2} ${-h - w * 0.85} L 0 ${-h} Z`, { fill: C.orange, stroke: C.ink, 'stroke-width': 2 }); };
      lead(front, 70, 60, true); lead(rear, 150, 40, false);
      const bowG = A.g(svg);
      A.path(bowG, 'M 300 600 L 400 470 L 500 600 Z', { fill: C.white, stroke: C.ink, 'stroke-width': 3 });
      A.line(bowG, 400, 480, 400, 600, { stroke: C.ink3, 'stroke-width': 2 });
      // mini map
      const mm = A.g(svg, { transform: 'translate(620,330)' });
      A.rect(mm, 0, 0, 160, 210, { rx: 12, fill: 'rgba(255,253,248,0.9)', stroke: C.line });
      A.rect(mm, 60, 10, 40, 190, { fill: 'rgba(47,111,134,0.18)' });
      A.circle(mm, 30, 100, 22, { fill: C.reef }); A.circle(mm, 130, 120, 22, { fill: C.reef });
      A.line(mm, 80, 10, 80, 200, { stroke: C.ink, 'stroke-dasharray': '4 4' });
      const dot = A.circle(mm, 80, 180, 6, { fill: C.port });
      const ui = document.createElement('div');
      ui.innerHTML = `<label for="off" style="font-weight:700">Steer</label><input id="off" class="range" type="range" min="-100" max="100" step="1" value="-62"><div class="status" id="ls">Not lined up</div>`;
      api.task.appendChild(ui);
      const inp = ui.querySelector('#off'), ls = ui.querySelector('#ls');
      let held = 0, last = null;
      const upd = v => {
        front.setAttribute('transform', `translate(${400 - v * 2.4},300)`);
        rear.setAttribute('transform', `translate(${400 - v * 0.9},282)`);
        dot.setAttribute('cx', 80 + v * 0.6);
        const ok = Math.abs(v) <= 3;
        ls.textContent = ok ? 'Lined up: rear lead directly above the front lead' : v < 0 ? 'The rear lead is left of the front lead: you are left of the line' : 'The rear lead is right of the front lead: you are right of the line';
        ls.style.color = ok ? 'var(--good)' : '';
        if (ok && !api.complete) api.done('On the leads. If they separate, steer towards the side the front lead has moved to until they line up again.');
      };
      inp.oninput = () => upd(+inp.value);
      upd(-62);
    }
  });

  P.push({
    type: 'learn', title: 'Sectored lights',
    html: `<p>A <span class="term">sectored light</span> shows different colours in different directions to mark a safe path through shallow or dangerous water.</p>
<p>Usually the <b>white</b> sector is safe water, with <b>red</b> and <b>green</b> sectors on either side to avoid. Always check the chart for what the light means and how wide the safe path is.</p>
<p>Stay in the white. If the light turns red or green, adjust your course to bring it back to white.</p>`,
    night: true,
    art(svg, S) {
      A.nightBg(svg);
      const cx = 400, cy = 60;
      wedge(svg, cx, cy, 620, 70, 86, { fill: 'rgba(61,220,132,0.25)' });
      wedge(svg, cx, cy, 620, 86, 94, { fill: 'rgba(255,246,220,0.3)' });
      wedge(svg, cx, cy, 620, 94, 110, { fill: 'rgba(255,74,61,0.25)' });
      A.path(svg, 'M -20 -20 L 820 -20 L 820 50 C 600 70 200 40 -20 60 Z', { fill: '#1C2B3B' });
      lamp(svg, cx, cy, LW, 8);
      A.tag(svg, 400, 545, 'STAY IN THE WHITE', { fill: C.ink });
      const wk = A.g(svg); S.wakes(wk);
      const b = S.boat(svg, { len: 60, color: C.port });
      gsap.timeline({ repeat: -1 }).set(b, { x: 470, y: 640, rotation: -100 })
        .to(b, { motionPath: { path: 'M 470 640 C 460 560 420 520 405 470 C 395 430 400 380 400 120', autoRotate: true }, duration: 9, ease: 'none' });
    }
  });

  P.push({
    type: 'try', title: 'Stay in the white',
    html: `<p>Steer to keep the light white as you head in. Try drifting into the red and green to see what happens.</p>`,
    lockMsg: 'See all three colours, then get back in the white',
    night: true,
    build(svg, S, api) {
      A.nightBg(svg);
      const cx = 400, cy = 50;
      wedge(svg, cx, cy, 640, 70, 86, { fill: 'rgba(61,220,132,0.22)' });
      wedge(svg, cx, cy, 640, 86, 94, { fill: 'rgba(255,246,220,0.28)' });
      wedge(svg, cx, cy, 640, 94, 110, { fill: 'rgba(255,74,61,0.22)' });
      A.path(svg, 'M -20 -20 L 820 -20 L 820 45 C 600 60 200 35 -20 52 Z', { fill: '#1C2B3B' });
      const l = lamp(svg, cx, cy, LW, 9);
      const lc = l.on.querySelectorAll('circle');
      const wk = A.g(svg); S.wakes(wk);
      const b = S.boat(svg, { x: 400, y: 540, r: -90, len: 56, color: C.port });
      const view = A.g(svg, { transform: 'translate(660,470)' });
      A.rect(view, -90, -70, 180, 130, { rx: 14, fill: '#050C16', stroke: '#2B4058', 'stroke-width': 2 });
      const vl = lamp(view, 0, -10, LW, 12);
      const vlc = vl.on.querySelectorAll('circle');
      A.text(view, 0, 45, 'YOU SEE', { size: 13, weight: 700, anchor: 'middle', fill: '#7F96AD', ls: '0.2em' });
      const ui = document.createElement('div');
      ui.innerHTML = `<label for="st" style="font-weight:700">Steer</label><input id="st" class="range" type="range" min="-100" max="100" step="1" value="0"><div class="status" id="cs">Light: white</div>`;
      api.task.appendChild(ui);
      const inp = ui.querySelector('#st'), cs = ui.querySelector('#cs');
      const seen = new Set(['white']);
      let lastC = 'white';
      S.loop(() => {
        const want = 400 + (+inp.value) * 3;
        b.x += (want - b.x) * 0.03;
        b.y -= 0.35; if (b.y < 180) { b.y = 540; b.trail.length = 0; b._lx = null; }
        const ang = Math.atan2(b.y - cy, b.x - cx) * 180 / Math.PI;
        const col = ang < 86 ? 'green' : ang > 94 ? 'red' : 'white';
        if (col !== lastC) {
          lastC = col;
          const hex = col === 'white' ? LW : col === 'red' ? LR : LG;
          vlc.forEach((e, k) => { if (k < 3) e.setAttribute('fill', hex); });
          cs.textContent = 'Light: ' + col + (col === 'white' ? '' : col === 'red' ? '. Too far west: steer right to get back to white.' : '. Too far east: steer left to get back to white.');
          seen.add(col);
          if (seen.size === 3 && col === 'white' && !api.complete) api.done('Back in the white sector, on the safe path.');
        }
      });
    }
  });

  P.push({
    type: 'check', title: 'Using leads',
    q: 'How do you use a pair of leads?',
    opts: ['Keep the front lead on your port bow', 'Keep the rear lead directly above the front lead', 'Steer halfway between the two leads', 'Keep both leads on your starboard side'], a: 1,
    why: 'Steer to keep the rear lead directly above the front lead, and you stay on the safe path.'
  });

  /* ---------- workbook self-test Q8-9 ---------- */
  P.push({
    type: 'review', n: 8, of: 9, title: 'Workbook self-test',
    q: 'What kind of navigation mark is this?',
    opts: ['Port Lateral Mark.', 'Starboard Lateral Mark.', 'Safe Water Mark.', 'Isolated Danger Mark.'], a: 3,
    why: 'Black with a red band and two black spheres: an isolated danger mark.',
    art(svg, S) { sky(svg); mark(svg, 400, 470, 'isolated', { s: 1.55 }); seaLine(svg, 470); }
  });
  P.push({
    type: 'review', n: 9, of: 9, title: 'Workbook self-test',
    q: 'A top has fallen off a Cardinal Mark. The colours on the pole from the top down are Black – Yellow – Black. What type of navigation mark is it?',
    opts: ['West Cardinal.', 'East Cardinal.', 'North Cardinal.', 'South Cardinal.'], a: 1,
    why: 'Black top and bottom is an East cardinal. Its cones would point up and down, to the black.',
    art(svg, S) { sky(svg); mark(svg, 400, 470, 'east', { s: 1.55, top: false }); seaLine(svg, 470); }
  });

  SR.chapter({
    id: 5,
    title: 'IALA Buoyage',
    intro: 'Lateral, cardinal, isolated danger, safe water and special marks, light rhythms, leads and sectored lights.',
    cover(svg, S) {
      sky(svg, '#DCE9EC', '#F2ECDD');
      [['port', 140, 0.8], ['east', 290, 0.95], ['safe', 450, 0.85], ['stbd', 610, 0.8]].forEach(([t, x, s], k) => {
        const m = mark(svg, x, 450, t, { s });
        gsap.to(m, { rotation: k % 2 ? 3 : -3, svgOrigin: `${x} 450`, duration: 1.8 + k * 0.25, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      });
      seaLine(svg, 450);
    },
    pages: P
  });
})();
