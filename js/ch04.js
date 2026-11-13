/* Chapter 4: Navigation Lights */
(function () {
  const A = SR.art, C = A.C;
  const { sky, caption, wedge } = SR.share;
  const WHITE = '#FFF6DC', RED = '#FF4A3D', GREEN = '#3DDC84', YEL = '#FFD23F';

  /* ---------- helpers ---------- */
  function night(svg, o) {
    o = o || {};
    A.nightBg(svg);
    if (o.sea !== false) {
      const id = A.uid('ns');
      const lg = A.el('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 }, A.defs(svg));
      A.el('stop', { offset: 0, 'stop-color': '#0F2238' }, lg); A.el('stop', { offset: 1, 'stop-color': '#071322' }, lg);
      A.rect(svg, 0, o.horizon || 300, 800, 600, { fill: `url(#${id})` });
      A.line(svg, 0, o.horizon || 300, 800, o.horizon || 300, { stroke: 'rgba(160,190,220,0.25)', 'stroke-width': 1.5 });
    }
  }
  function lamp(parent, x, y, col, r) {
    r = r || 7;
    const g = A.g(parent, { transform: `translate(${x},${y})` });
    A.circle(g, 0, 0, r * 4, { fill: col, opacity: 0.12 });
    A.circle(g, 0, 0, r * 2, { fill: col, opacity: 0.25 });
    A.circle(g, 0, 0, r, { fill: col });
    A.circle(g, 0, 0, r * 0.45, { fill: '#fff', opacity: 0.8 });
    return g;
  }
  /* top-down arcs for a boat heading up the page */
  function arcs(parent, cx, cy, r, o) {
    o = o || {};
    const g = A.g(parent);
    const parts = {};
    if (o.allround) parts.all = wedge(g, cx, cy, r * 0.8, -90, 269.9, { fill: 'rgba(255,246,220,0.18)', stroke: WHITE, 'stroke-width': 1.5 });
    else {
      parts.mast = wedge(g, cx, cy, r * 0.95, -90 - 112.5, -90 + 112.5, { fill: 'rgba(255,246,220,0.14)', stroke: WHITE, 'stroke-width': 1.5 });
      parts.stern = wedge(g, cx, cy, r * 0.7, 22.5, 157.5, { fill: 'rgba(255,246,220,0.2)', stroke: WHITE, 'stroke-width': 1.5 });
    }
    parts.stbd = wedge(g, cx, cy, r * 0.62, -90, 22.5, { fill: 'rgba(61,220,132,0.3)', stroke: GREEN, 'stroke-width': 2 });
    parts.port = wedge(g, cx, cy, r * 0.62, 157.5, 270, { fill: 'rgba(255,74,61,0.3)', stroke: RED, 'stroke-width': 2 });
    g.parts = parts;
    return g;
  }
  /* dark top-down boat with light points, heading up */
  function nightBoat(parent, x, y, L, o) {
    o = o || {};
    const g = A.g(parent, { transform: `translate(${x},${y}) rotate(${o.r == null ? -90 : o.r})` });
    const B = L * 0.4;
    A.path(g, `M ${-L / 2} ${-B / 2} L ${L * 0.2} ${-B / 2} Q ${L * 0.45} ${-B * 0.4} ${L / 2} 0 Q ${L * 0.45} ${B * 0.4} ${L * 0.2} ${B / 2} L ${-L / 2} ${B / 2} Z`, { fill: '#2A3D52', stroke: '#4E6680', 'stroke-width': 2 });
    A.rect(g, -L * 0.1, -B * 0.25, L * 0.16, B * 0.5, { rx: 4, fill: '#3B536C' });
    if (o.lights !== false) {
      lamp(g, L * 0.3, -B / 2, RED, 4.5); lamp(g, L * 0.3, B / 2, GREEN, 4.5);
      if (o.allround) lamp(g, -L * 0.05, 0, WHITE, 4.5);
      else { lamp(g, 0, 0, WHITE, 4.5); lamp(g, -L / 2, 0, WHITE, 4); }
    }
    return g;
  }
  /* side silhouette at night (bow to the right) */
  function nightSide(parent, x, y, L, o) {
    o = o || {};
    const g = A.g(parent, { transform: `translate(${x},${y})${o.flip ? ' scale(-1,1)' : ''}` });
    const h = L * 0.15;
    if (o.sail) {
      A.line(g, 0, -h, 0, -L * 0.9, { stroke: '#41546A', 'stroke-width': 4 });
      A.path(g, `M 4 ${-L * 0.86} L 4 ${-h * 1.5} L ${L * 0.34} ${-h * 1.4} Z`, { fill: '#22364B' });
      A.path(g, `M -4 ${-L * 0.8} L -4 ${-h * 1.6} L ${-L * 0.36} ${-h * 1.5} Z`, { fill: '#1D3044' });
    }
    A.path(g, `M ${-L / 2} ${-h} L ${L / 2} ${-h * 1.3} C ${L * 0.44} ${-h * 0.2} ${L * 0.3} ${h * 0.4} ${L * 0.15} ${h * 0.45} L ${-L * 0.46} ${h * 0.35} Z`, { fill: '#22364B', stroke: '#3B536C', 'stroke-width': 2 });
    if (!o.sail) A.path(g, `M ${-L * 0.1} ${-h} L ${-L * 0.1} ${-h * 1.9} L ${L * 0.1} ${-h * 1.9} L ${L * 0.16} ${-h * 1.05} Z`, { fill: '#2A3D52' });
    g.h = h;
    return g;
  }

  const P = [];

  P.push({
    type: 'learn', title: 'When lights are needed',
    html: `<p>Every vessel out between <b>sunset and sunrise</b>, whether underway or at anchor, must carry and show the correct lights. They must also be shown in daylight when visibility is poor.</p>
<p>A vessel is <span class="term">underway</span> when it is not anchored, tied to the shore or aground.</p>
<p>Check your navigation lights work before you head out.</p>`,
    art(svg, S) {
      sky(svg, '#E4EFEE', '#F6E3C4');
      const nightLayer = A.g(svg, { opacity: 0 });
      night(nightLayer, { horizon: 330 });
      const sun = A.circle(svg, 600, 230, 46, { fill: '#F2B33D' });
      const sea = A.rect(svg, 0, 330, 800, 270, { fill: '#7EB3BF' });
      const boat = nightSide(svg, 380, 440, 360);
      const h = 360 * 0.15;
      A.rect(svg, 380 - 10, 440 - h * 3.3, 6, h * 1.5, { fill: '#41546A' });
      const lights = A.g(svg, { opacity: 0 });
      lamp(lights, 380 - 7, 440 - h * 3.3, WHITE, 6); lamp(lights, 380 + 130, 440 - h * 1.2, GREEN, 5);
      const lbl = A.g(svg); A.tag(lbl, 400, 560, 'SUNSET: LIGHTS ON', { fill: C.ink });
      gsap.timeline({ repeat: -1, repeatDelay: 1.5, yoyo: true })
        .to(sun, { attr: { cy: 360 }, duration: 3, ease: 'power1.in' }, 0)
        .to(sun, { opacity: 0, duration: 1 }, 2)
        .to(sea, { opacity: 0, duration: 2.5 }, 1.5)
        .to(nightLayer, { opacity: 1, duration: 2.5 }, 1.5)
        .to(lights, { opacity: 1, duration: 0.4 }, 3.6);
    }
  });

  P.push({
    type: 'learn', title: 'Extra care at night',
    html: `<p>Many navigation marks are unlit, and there are plenty of other hazards you won't see in the dark. Keep your speed down.</p>
<p>Some areas have special limits after dark. For example, the open speed areas of the Swan and Canning rivers drop to <b>10 knots</b> between sunset and sunrise.</p>`,
    art(svg, S) {
      night(svg, { horizon: 230 });
      const R = A.rng(4);
      for (let k = 0; k < 40; k++) A.circle(svg, R() * 800, 200 + R() * 26, 1.5 + R() * 2, { fill: '#F6D27A', opacity: 0.4 + R() * 0.6 });
      // unlit beacon and a log only visible in a torch beam
      const beam = A.g(svg);
      wedge(beam, 400, 620, 520, -110, -70, { fill: 'rgba(255,246,220,0.16)' });
      gsap.fromTo(beam, { rotation: -25 }, { rotation: 25, svgOrigin: '400 620', duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      A.rect(svg, 255, 320, 10, 70, { fill: '#2D3F52' }); A.path(svg, 'M 248 320 L 272 320 L 266 300 L 254 300 Z', { fill: '#2D3F52' });
      A.path(svg, 'M 500 420 L 600 410', { stroke: '#2D3F52', 'stroke-width': 12, 'stroke-linecap': 'round' });
      A.speedSign(svg, 680, 110, 56, '10', 'KNOTS');
      A.tag(svg, 680, 190, 'SWAN AND CANNING, AFTER DARK', { fill: C.ink, size: 13 });
    }
  });

  P.push({
    type: 'learn', title: 'Night vision',
    html: `<p>Your eyes see in the dark using <span class="term">rhodopsin</span>, a molecule that is very sensitive to light. A bright white light bleaches it straight away and your night vision is gone.</p>
<p>It recovers slowly: about <b>10%</b> after 10 minutes, <b>80%</b> after 30 to 45 minutes, and the rest can take hours.</p>
<p>Red light helps. Red filters on cabin lights let you see without wrecking your night vision.</p>`,
    art(svg, S) {
      A.paperBg(svg);
      const ox = 120, oy = 470, W = 600, H = 320, X = m => ox + m * W / 60, Y = p => oy - p * H / 100;
      A.line(svg, ox, oy, ox + W, oy, { stroke: C.ink, 'stroke-width': 3 });
      A.line(svg, ox, oy, ox, oy - H, { stroke: C.ink, 'stroke-width': 3 });
      [0, 10, 20, 30, 40, 50, 60].forEach(m => { A.line(svg, X(m), oy, X(m), oy + 8, { stroke: C.ink, 'stroke-width': 2 }); A.text(svg, X(m), oy + 30, String(m), { size: 18, anchor: 'middle', weight: 600 }); });
      [0, 50, 100].forEach(p => A.text(svg, ox - 14, Y(p) + 6, p + '%', { size: 18, anchor: 'end', weight: 600 }));
      A.text(svg, ox + W / 2, oy + 62, 'MINUTES AFTER A BRIGHT WHITE LIGHT', { size: 18, weight: 700, anchor: 'middle', fill: C.ink3, ls: '0.12em' });
      A.text(svg, ox, oy - H - 18, 'NIGHT VISION', { size: 18, weight: 700, fill: C.ink3, ls: '0.12em' });
      const curve = A.path(svg, `M ${X(0)} ${Y(0)} C ${X(6)} ${Y(4)} ${X(10)} ${Y(10)} ${X(14)} ${Y(22)} C ${X(20)} ${Y(50)} ${X(28)} ${Y(74)} ${X(38)} ${Y(80)} C ${X(48)} ${Y(85)} ${X(55)} ${Y(88)} ${X(60)} ${Y(89)}`, { fill: 'none', stroke: C.port, 'stroke-width': 5, 'stroke-linecap': 'round' });
      gsap.fromTo(curve, { drawSVG: '0%' }, { drawSVG: '100%', duration: 3.5, ease: 'power1.inOut', repeat: -1, repeatDelay: 2 });
      A.tag(svg, X(10), Y(10) - 30, '10%', { fill: C.ink, size: 16 });
      A.tag(svg, X(38), Y(80) - 30, '80%', { fill: C.ink, size: 16 });
    }
  });

  P.push({
    type: 'try', title: 'Protect your night vision',
    html: `<p>You need to check the chart. Try each light and watch what happens to what you can see outside.</p>`,
    lockMsg: 'Try both lights',
    build(svg, S, api) {
      night(svg, { horizon: 250 });
      const scene = A.g(svg);
      const R = A.rng(9);
      for (let k = 0; k < 30; k++) A.circle(scene, R() * 800, 225 + R() * 20, 1.5 + R() * 2, { fill: '#F6D27A', opacity: 0.5 + R() * 0.5 });
      A.rect(scene, 255, 290, 9, 60, { fill: '#5A6E82' });
      A.path(scene, 'M 470 360 C 490 352 520 352 540 360 C 520 366 490 366 470 360 Z', { fill: '#5A6E82' });
      lamp(scene, 640, 275, GREEN, 4); lamp(scene, 630, 262, WHITE, 3);
      const veil = A.rect(svg, 0, 0, 800, 600, { fill: '#000', opacity: 0, style: 'pointer-events:none' });
      // cabin
      A.path(svg, 'M 0 600 L 0 430 L 800 430 L 800 600 Z', { fill: '#16222F' });
      A.rect(svg, 260, 455, 280, 120, { rx: 8, fill: '#E9E2CC' });
      [0, 1, 2, 3].forEach(k => A.path(svg, `M ${280 + k * 60} 470 q 20 40 40 90`, { stroke: '#9DB3C6', 'stroke-width': 2, fill: 'none' }));
      const glow = A.rect(svg, 0, 430, 800, 170, { fill: '#FFF8E8', opacity: 0, style: 'pointer-events:none' });
      const ui = document.createElement('div');
      ui.innerHTML = `<div class="chips"><button class="chip" data-v="w">White cabin light</button><button class="chip" data-v="r">Red cabin light</button></div><div class="status"></div>`;
      api.task.appendChild(ui);
      const tried = new Set();
      ui.querySelectorAll('.chip').forEach(b => b.onclick = () => {
        const v = b.dataset.v;
        gsap.killTweensOf([veil, glow]);
        if (v === 'w') {
          glow.setAttribute('fill', '#FFF8E8');
          gsap.timeline().to(glow, { opacity: 0.55, duration: 0.15 }).to(veil, { opacity: 0.93, duration: 0.15 }, 0).to(glow, { opacity: 0, duration: 0.8, delay: 1.5 }).to(veil, { opacity: 0.6, duration: 8, ease: 'power1.out' });
          api.say('The white light bleached your night vision. Outside is now almost black, and it will take 30 to 45 minutes to get most of it back.', 'bad');
        } else {
          glow.setAttribute('fill', '#FF3A2E');
          gsap.timeline().to(veil, { opacity: 0, duration: 0.6 }).to(glow, { opacity: 0.35, duration: 0.3 }, 0).to(glow, { opacity: 0, duration: 0.8, delay: 2 });
          api.say('With red light you can read the chart and still see the marks and boats outside.', 'good');
        }
        tried.add(v);
        if (tried.size === 2 && !api.complete) S.after(2600, () => api.done('Use red light at night, and keep bright white lights off.'));
      });
    }
  });

  P.push({
    type: 'learn', title: "Don't hide your lights",
    html: `<p>Check that nothing on your boat blocks your navigation lights.</p>
<p>On many trailer boats the masthead light is on a pole at the stern, and it doesn't lift high enough to be seen over the cabin top or windscreen. This is dangerous, because other skippers can't read what your boat is doing, and it is not acceptable.</p>`,
    art(svg, S) {
      sky(svg, '#16263A', '#0D1A2A');
      A.rect(svg, 0, 380, 800, 220, { fill: '#0B1828' });
      const g = A.g(svg, { transform: 'translate(430,380)' });
      const L = 380, h = L * 0.15;
      // pole
      const pole = A.g(g);
      A.rect(pole, -L * 0.48, -h * 3.2, 6, h * 2.4, { fill: '#8796A3' });
      const top = lamp(pole, -L * 0.48 + 3, -h * 3.2, WHITE, 6);
      // hull + cabin
      A.path(g, `M ${-L / 2} ${-h} L ${L / 2} ${-h * 1.3} C ${L * 0.44} ${-h * 0.2} ${L * 0.3} ${h * 0.4} ${L * 0.15} ${h * 0.45} L ${-L * 0.46} ${h * 0.35} Z`, { fill: '#2A3D52', stroke: '#4E6680', 'stroke-width': 2 });
      A.path(g, `M ${-L * 0.2} ${-h} L ${-L * 0.2} ${-h * 2.6} L ${L * 0.12} ${-h * 2.6} L ${L * 0.3} ${-h * 1.2} Z`, { fill: '#33485F', stroke: '#4E6680', 'stroke-width': 2 });
      lamp(g, L * 0.38, -h * 1.2, GREEN, 5);
      // sight line from another boat ahead
      const eye = A.g(svg, { transform: 'translate(760,330)' });
      A.circle(eye, 0, 0, 10, { fill: 'none', stroke: '#9DB3C6', 'stroke-width': 2.5 }); A.circle(eye, 0, 0, 4, { fill: '#9DB3C6' });
      const sight = A.line(svg, 750, 330, 0, 0, { stroke: '#9DB3C6', 'stroke-width': 2, 'stroke-dasharray': '6 6' });
      const x = no(svg);
      function no(par) { const n = A.g(par, { opacity: 0 }); A.circle(n, 0, 0, 16, { fill: 'none', stroke: RED, 'stroke-width': 4 }); A.line(n, -11, -11, 11, 11, { stroke: RED, 'stroke-width': 4 }); return n; }
      const lbl = A.g(svg);
      const st = { y: 0 };
      const upd = () => {
        const ly = 380 - h * 3.2 - st.y, lx = 430 - L * 0.48 + 3;
        pole.setAttribute('transform', `translate(0,${-st.y})`);
        const blocked = st.y < h * 1.2;
        sight.setAttribute('x2', lx); sight.setAttribute('y2', ly);
        sight.setAttribute('stroke', blocked ? RED : '#9DB3C6');
        x.setAttribute('transform', `translate(${430 + L * 0.12},${380 - h * 2.6 - 4})`);
        x.setAttribute('opacity', blocked ? 1 : 0);
        lbl.innerHTML = ''; A.tag(lbl, 400, 540, blocked ? 'HIDDEN BEHIND THE CABIN' : 'RAISED: CLEARLY VISIBLE', { fill: blocked ? C.port : C.stbd, size: 16 });
      };
      gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 1.6 }).fromTo(st, { y: 0 }, { y: h * 1.9, duration: 2, ease: 'power2.inOut', onUpdate: upd, onStart: upd });
      upd();
    }
  });

  P.push({
    type: 'learn', title: 'Sidelights',
    html: `<p><span class="term">Sidelights</span> show other skippers which side of your boat they're looking at.</p>
<ul><li>The <b>port</b> sidelight is <b>red</b>.</li><li>The <b>starboard</b> sidelight is <b>green</b>.</li></ul>
<p>Each shines through <b>112.5°</b>, from dead ahead to just behind the beam on its own side.</p>
<p>A memory jog: port wine is red.</p>`,
    night: true,
    art(svg, S) {
      night(svg, { sea: false });
      const a = arcs(svg, 400, 330, 270);
      [a.parts.mast, a.parts.stern].forEach(p => p.setAttribute('opacity', 0.15));
      nightBoat(svg, 400, 330, 140);
      A.tag(svg, 250, 300, 'PORT: RED', { fill: '#B3271E', size: 16 });
      A.tag(svg, 550, 300, 'STARBOARD: GREEN', { fill: '#15703F', size: 16 });
      A.tag(svg, 400, 110, '112.5° EACH SIDE', { fill: C.ink, size: 16 });
      gsap.from([a.parts.port, a.parts.stbd], { scale: 0.3, svgOrigin: '400 330', opacity: 0, duration: 0.8, stagger: 0.3, ease: 'back.out(1.4)' });
    }
  });

  P.push({
    type: 'learn', title: 'Masthead and stern lights',
    html: `<p>The white <span class="term">masthead light</span> shines forward through <b>225°</b>. The white <span class="term">stern light</span> shines aft through <b>135°</b>. Together they make a full 360° of white light.</p>
<p>On a vessel under 12 metres, these two can be combined into one <b>all-round white light</b>.</p>
<p>Fit the masthead, stern or all-round light on the centre line of the vessel if practical.</p>`,
    night: true,
    art(svg, S) {
      night(svg, { sea: false });
      const a = arcs(svg, 400, 320, 270);
      [a.parts.port, a.parts.stbd].forEach(p => p.setAttribute('opacity', 0.25));
      nightBoat(svg, 400, 320, 140);
      A.tag(svg, 400, 90, 'MASTHEAD 225°', { fill: C.ink, size: 16 });
      A.tag(svg, 400, 545, 'STERN 135°', { fill: C.ink, size: 16 });
      gsap.from(a.parts.mast, { scale: 0.3, svgOrigin: '400 320', opacity: 0, duration: 0.8, ease: 'back.out(1.4)' });
      gsap.from(a.parts.stern, { scale: 0.3, svgOrigin: '400 320', opacity: 0, duration: 0.8, delay: 0.4, ease: 'back.out(1.4)' });
    }
  });

  /* walk-around light explorer */
  P.push({
    type: 'try', title: 'Walk around the boat',
    html: `<p>Drag the slider to move around the boat. The panel shows the lights you would see from there.</p>`,
    lockMsg: 'View it from ahead, both sides and astern',
    night: true,
    build(svg, S, api) {
      night(svg, { sea: false });
      const cx = 250, cy = 300;
      arcs(svg, cx, cy, 200);
      nightBoat(svg, cx, cy, 110);
      const me = A.g(svg);
      A.circle(me, 0, 0, 14, { fill: C.buoy, stroke: '#fff', 'stroke-width': 3 });
      A.text(me, 0, 5, 'YOU', { size: 10, weight: 700, anchor: 'middle', fill: C.ink });
      const sight = A.line(svg, 0, 0, cx, cy, { stroke: 'rgba(255,255,255,0.4)', 'stroke-width': 1.5, 'stroke-dasharray': '5 5' });
      svg.appendChild(me);
      // view panel
      const pan = A.g(svg, { transform: 'translate(480,170)' });
      A.rect(pan, 0, 0, 290, 260, { rx: 18, fill: '#050C16', stroke: '#2B4058', 'stroke-width': 2 });
      A.line(pan, 10, 180, 280, 180, { stroke: 'rgba(160,190,220,0.25)' });
      A.text(pan, 145, 238, 'WHAT YOU SEE', { size: 15, weight: 700, anchor: 'middle', fill: '#7F96AD', ls: '0.16em' });
      const view = A.g(pan);
      const L = 110, Bm = L * 0.4;
      const lightsDef = [
        { k: 'mast', x: 0, y: 0, h: 70, col: WHITE, vis: t => t <= 112.5 || t >= 247.5 },
        { k: 'stern', x: -L / 2, y: 0, h: 22, col: WHITE, vis: t => t > 112.5 && t < 247.5 },
        { k: 'port', x: L * 0.3, y: -Bm / 2, h: 26, col: RED, vis: t => t >= 247.5 || t === 0 },
        { k: 'stbd', x: L * 0.3, y: Bm / 2, h: 26, col: GREEN, vis: t => t <= 112.5 }
      ];
      const ui = document.createElement('div');
      ui.innerHTML = `<label for="brg" style="font-weight:700">Where you are: <span id="bv">dead ahead</span></label><input id="brg" class="range" type="range" min="0" max="359" step="1" value="0"><div class="status" id="seen"></div>`;
      api.task.appendChild(ui);
      const inp = ui.querySelector('#brg'), bv = ui.querySelector('#bv'), seenEl = ui.querySelector('#seen');
      const seen = new Set();
      const name = t => t < 20 || t > 340 ? 'dead ahead' : t < 160 && t > 20 ? (t < 100 ? 'on the starboard bow' : t < 125 ? 'on the starboard quarter' : 'astern, starboard side') : t > 200 && t < 340 ? (t > 260 ? 'on the port bow' : t > 235 ? 'on the port quarter' : 'astern, port side') : 'astern';
      const update = t => {
        // position of viewer: bearing t clockwise from bow; bow points up
        const a = (t - 90) * Math.PI / 180, R = 200;
        const vx = cx + Math.cos(a) * R, vy = cy + Math.sin(a) * R;
        me.setAttribute('transform', `translate(${vx},${vy})`);
        sight.setAttribute('x1', vx); sight.setAttribute('y1', vy);
        bv.textContent = name(t);
        // projection: boat frame x fwd, y stbd. viewer direction from boat
        const ux = Math.cos(t * Math.PI / 180), uy = Math.sin(t * Math.PI / 180);
        const dx = -ux, dy = -uy, rx = -dy, ry = dx;
        view.innerHTML = '';
        lightsDef.forEach(l => {
          if (!l.vis(Math.round(t) % 360)) return;
          const sx = 145 + (l.x * rx + l.y * ry) * 1.1;
          lamp(view, sx, 180 - l.h * 1.6, l.col, 6);
        });
        if (t < 20 || t > 340) seen.add('ahead');
        if (t > 60 && t < 110) seen.add('stbd');
        if (t > 250 && t < 300) seen.add('port');
        if (t > 150 && t < 210) seen.add('astern');
        seenEl.textContent = `Viewed from ${seen.size} of 4 directions: ahead, starboard, port, astern`;
        if (seen.size === 4 && !api.complete) api.done('From ahead you see red, green and white. From the side, one colour and white. From astern, just white.');
      };
      inp.oninput = () => update(+inp.value);
      update(0);
    }
  });

  P.push({
    type: 'learn', title: 'Anchor light',
    html: `<p>An <span class="term">anchor light</span> is a white light that can be seen all the way around: <b>360°</b>.</p>
<p>Place it where it can best be seen, on the centre line of the vessel if practical.</p>`,
    night: true,
    art(svg, S) {
      night(svg, { sea: false });
      const ring = wedge(svg, 400, 300, 230, -90, 269.9, { fill: 'rgba(255,246,220,0.15)', stroke: WHITE, 'stroke-width': 1.5 });
      gsap.fromTo(ring, { scale: 0.85, svgOrigin: '400 300', opacity: 0.6 }, { scale: 1, opacity: 1, duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      nightBoat(svg, 400, 300, 140, { lights: false });
      lamp(svg, 400, 300, WHITE, 7);
      A.path(svg, 'M 400 230 Q 380 180 400 120', { stroke: '#6E8499', 'stroke-width': 2.5, fill: 'none', 'stroke-dasharray': '5 5' });
      A.tag(svg, 400, 560, 'ALL-ROUND WHITE: 360°', { fill: C.ink });
    }
  });

  P.push({
    type: 'learn', title: 'How far away they show',
    html: `<p>Lights must be bright enough to be seen from a minimum distance, which depends on the vessel's length. For vessels <b>under 12 metres</b>:</p>
<ul><li>masthead light: <b>2 nautical miles</b></li><li>sidelights: <b>1 nautical mile</b></li><li>stern light: <b>2 nautical miles</b></li><li>all-round lights (white, red, yellow, green): <b>2 nautical miles</b></li></ul>
<p>Bigger vessels need brighter lights. A vessel 50 m or longer needs a masthead light seen from 6 nautical miles.</p>`,
    night: true,
    art(svg, S) {
      night(svg, { horizon: 330 });
      const X = nm => 150 + nm * 270;
      lamp(svg, 90, 330, WHITE, 6); lamp(svg, 90, 350, RED, 5);
      [1, 2].forEach(nm => { A.line(svg, X(nm), 360, X(nm), 470, { stroke: '#6E8499', 'stroke-width': 2, 'stroke-dasharray': '6 6' }); A.text(svg, X(nm), 500, nm + ' n mile', { size: 22, weight: 700, anchor: 'middle', fill: '#C5D3E0' }); });
      const bars = [['SIDELIGHTS', 1, RED, 380], ['MASTHEAD, STERN, ALL-ROUND', 2, WHITE, 420]];
      bars.forEach(([t, nm, col, y], k) => {
        const b = A.rect(svg, 90, y - 10, 0, 20, { rx: 10, fill: col, opacity: 0.85 });
        gsap.to(b, { attr: { width: X(nm) - 90 }, duration: 1.6, delay: 0.4 + k * 0.4, ease: 'power2.out' });
        A.text(svg, 100, y - 18, t, { size: 15, weight: 700, fill: '#C5D3E0', ls: '0.1em' });
      });
      A.tag(svg, 400, 120, 'VESSELS UNDER 12 m', { fill: C.ink });
    }
  });

  P.push({
    type: 'check', title: 'Sidelight range',
    q: 'On a boat under 12 metres, how far away must the sidelights be visible?',
    opts: ['Half a nautical mile', '1 nautical mile', '2 nautical miles', '3 nautical miles'], a: 1,
    why: 'Sidelights on a vessel under 12 m must be visible from at least 1 nautical mile. The white lights need 2.'
  });

  /* ---------- lights by vessel type ---------- */
  const fig = (svg, L, o) => { night(svg, { sea: false }); const a = arcs(svg, 400, 300, 240, o); nightBoat(svg, 400, 300, L, o); return a; };

  P.push({
    type: 'learn', title: 'Small, slow motor boats',
    html: `<p>A motor boat <b>under 7 metres</b> long, with a top speed of <b>7 knots or less</b>, must show an <b>all-round white light</b>.</p>
<p>If possible, it should also show sidelights, either separate or combined.</p>`,
    night: true,
    art(svg, S) {
      night(svg, { sea: false });
      wedge(svg, 400, 300, 200, -90, 269.9, { fill: 'rgba(255,246,220,0.15)', stroke: WHITE, 'stroke-width': 1.5 });
      nightBoat(svg, 400, 300, 120, { lights: false });
      lamp(svg, 400, 300, WHITE, 6);
      [[RED, -1], [GREEN, 1]].forEach(([c, s]) => { const l = lamp(svg, 400 + s * 24, 270, c, 4.5); l.setAttribute('opacity', 0.5); });
      A.tag(svg, 400, 560, 'UNDER 7 m AND 7 KNOTS OR LESS', { fill: C.ink });
      A.tag(svg, 400, 190, 'SIDELIGHTS IF POSSIBLE', { fill: '#3B4F64', size: 14 });
    }
  });

  P.push({
    type: 'learn', title: 'Motor boats under 12 metres',
    html: `<p>A motor boat <b>under 12 metres</b> must show either:</p>
<ul><li>sidelights (separate or combined) and an <b>all-round white light</b>, or</li><li>sidelights (separate or combined), a <b>masthead light</b> and a <b>stern light</b></li></ul>
<p>The masthead or all-round white light must be at least <b>1 metre above</b> the sidelights.</p>`,
    night: true,
    art(svg, S) {
      night(svg, { sea: false });
      const left = A.g(svg, { transform: 'translate(-180,0)' }), right = A.g(svg, { transform: 'translate(180,0)' });
      arcs(left, 400, 290, 150, { allround: true }); nightBoat(left, 400, 290, 90, { allround: true });
      arcs(right, 400, 290, 150); nightBoat(right, 400, 290, 90);
      A.tag(svg, 220, 500, 'SIDELIGHTS + ALL-ROUND WHITE', { fill: C.ink, size: 14 });
      A.tag(svg, 580, 500, 'SIDELIGHTS + MASTHEAD + STERN', { fill: C.ink, size: 14 });
      A.text(svg, 400, 300, 'OR', { size: 28, weight: 700, anchor: 'middle', fill: '#C5D3E0' });
    }
  });

  P.push({
    type: 'learn', title: 'Motor boats 12 to 20 metres',
    html: `<p>A motor boat <b>12 to 20 metres</b> long must show a <b>masthead light</b>, a <b>stern light</b> and sidelights (separate or combined).</p>
<p>The masthead light must be at least <b>2.5 metres above the gunwale</b>. Combined sidelights must be at least 1 metre below the masthead light.</p>`,
    night: true,
    art(svg, S) {
      night(svg, { horizon: 420 });
      const s = nightSide(svg, 380, 420, 420);
      const h = s.h;
      A.rect(svg, 380 + 10, 420 - h * 3.6, 6, h * 2.4, { fill: '#41546A' });
      lamp(svg, 393, 420 - h * 3.6, WHITE, 6);
      lamp(svg, 380 + 160, 420 - h * 1.25, GREEN, 5);
      lamp(svg, 380 - 205, 420 - h * 1.05, WHITE, 5);
      const gun = 420 - h * 1.12;
      A.line(svg, 600, gun, 600, 420 - h * 3.6, { stroke: '#C5D3E0', 'stroke-width': 2 });
      A.line(svg, 590, gun, 610, gun, { stroke: '#C5D3E0', 'stroke-width': 2 }); A.line(svg, 590, 420 - h * 3.6, 610, 420 - h * 3.6, { stroke: '#C5D3E0', 'stroke-width': 2 });
      A.tag(svg, 660, 420 - h * 2.4, 'AT LEAST 2.5 m', { fill: C.ink, size: 15 });
      A.tag(svg, 300, 520, 'MASTHEAD, SIDELIGHTS, STERN', { fill: C.ink, size: 15 });
    }
  });

  P.push({
    type: 'check', title: 'Bigger motor boats',
    q: 'On a 15 metre motor boat, how high above the gunwale must the masthead light be?',
    opts: ['At least 1 metre', 'At least 1.5 metres', 'At least 2.5 metres', 'At least 4 metres'], a: 2,
    why: 'For motor boats 12 to 20 m, the masthead light must be at least 2.5 m above the gunwale.'
  });

  P.push({
    type: 'learn', title: 'Sailing boats',
    html: `<p>A sailing boat being driven by its motor is a motor boat, so it shows <b>motor boat lights</b>.</p>
<p>A sailing boat <b>under 7 metres</b>, or a boat being rowed, should show the lights for larger sailing boats. If it can't, it must have an <b>electric torch or lit lantern</b> showing a white light ready to use, and show it in time to prevent a collision.</p>`,
    night: true,
    art(svg, S) {
      night(svg, { horizon: 400 });
      nightSide(svg, 330, 400, 260, { sail: true });
      const beam = A.g(svg);
      wedge(beam, 400, 330, 360, -12, 12, { fill: 'rgba(255,246,220,0.25)' });
      lamp(svg, 400, 330, WHITE, 6);
      gsap.fromTo(beam, { opacity: 0 }, { opacity: 1, duration: 0.25, repeat: -1, yoyo: true, repeatDelay: 1.2 });
      A.tag(svg, 400, 520, 'UNDER 7 m: A TORCH READY TO SHOW', { fill: C.ink, size: 15 });
    }
  });

  P.push({
    type: 'learn', title: 'Larger sailing boats',
    html: `<p>A sailing boat <b>7 to 20 metres</b> shows either:</p>
<ul><li>a <b>combined lantern</b> at or near the top of the mast, with sidelights and stern light in one, or</li><li><b>separate sidelights and a stern light</b></li></ul>
<p>A sailing boat <b>over 20 metres</b> shows sidelights and a stern light, and may not use a combined lantern.</p>
<p>Under sail, there is <b>no masthead light</b>. That's how you tell sail from power at night.</p>`,
    night: true,
    art(svg, S) {
      night(svg, { horizon: 420 });
      nightSide(svg, 230, 420, 260, { sail: true });
      lamp(svg, 230, 420 - 260 * 0.9, GREEN, 5.5);
      A.tag(svg, 230, 520, 'COMBINED LANTERN', { fill: C.ink, size: 14 });
      nightSide(svg, 580, 420, 260, { sail: true });
      lamp(svg, 580 + 70, 420 - 39 * 1.2, GREEN, 5); lamp(svg, 580 - 125, 420 - 39 * 0.95, WHITE, 4.5);
      A.tag(svg, 580, 520, 'SEPARATE LIGHTS', { fill: C.ink, size: 14 });
    }
  });

  P.push({
    type: 'learn', title: 'Red over green',
    html: `<p>A sailing boat of any length that has sidelights and a stern light (not a combined lantern) may also show two <b>all-round lights</b> in a vertical line at or near the top of the mast: <b>red above green</b>.</p>
<p>A memory jog: <b>red over green, sailing machine</b>.</p>`,
    night: true,
    art(svg, S) {
      night(svg, { horizon: 430 });
      nightSide(svg, 400, 430, 320, { sail: true });
      lamp(svg, 400, 430 - 320 * 0.9 - 4, RED, 6.5);
      lamp(svg, 400, 430 - 320 * 0.9 + 26, GREEN, 6.5);
      lamp(svg, 400 + 90, 430 - 48 * 1.2, GREEN, 5);
      A.tag(svg, 400, 540, 'RED OVER GREEN, SAILING MACHINE', { fill: C.ink, size: 16 });
    }
  });

  /* what am I looking at */
  const LOOKS = [
    { name: 'A motor boat coming towards you', lights: [[-34, 0, GREEN], [34, 0, RED], [0, -60, WHITE]], side: { flip: false, head: true } },
    { name: 'A motor boat, showing you its port side', lights: [[30, 0, RED], [-6, -60, WHITE]], side: { flip: true } },
    { name: 'A motor boat, showing you its starboard side', lights: [[-30, 0, GREEN], [6, -60, WHITE]], side: { flip: false } },
    { name: 'A vessel going away from you', lights: [[0, 6, WHITE]], side: { stern: true } },
    { name: 'A sailing boat coming towards you', lights: [[-34, 0, GREEN], [34, 0, RED]], side: { sail: true, head: true } }
  ];
  function showLook(parent, k, reveal) {
    const L = LOOKS[k];
    if (reveal) {
      const sil = A.g(parent, { opacity: 0.55 });
      if (L.side.head || L.side.stern) {
        A.path(sil, 'M -60 0 L 60 0 L 40 34 L -40 34 Z', { fill: '#2A3D52' });
        if (L.side.sail) { A.line(sil, 0, 0, 0, -150, { stroke: '#41546A', 'stroke-width': 4 }); A.path(sil, 'M 4 -140 L 30 -10 L 4 -10 Z', { fill: '#22364B' }); }
        else A.rect(sil, -26, -30, 52, 30, { rx: 6, fill: '#2A3D52' });
      } else nightSide(sil, 0, 30, 220, { flip: L.side.flip });
    }
    L.lights.forEach(([x, y, c]) => lamp(parent, x, y, c, 7));
  }

  P.push({
    type: 'watch', title: 'What am I looking at?',
    html: `<p>At night you only see the lights. Watch how each combination tells you what a vessel is and which way it's heading.</p>`,
    night: true,
    anim(svg, S) {
      night(svg, { horizon: 330 });
      const stageG = A.g(svg, { transform: 'translate(400,330)' });
      const cap = caption(svg);
      const tl = gsap.timeline();
      LOOKS.forEach((L, k) => {
        const at = k * 4.2;
        tl.call(() => { stageG.innerHTML = ''; showLook(stageG, k, false); }, null, at);
        tl.fromTo(stageG, { opacity: 0 }, { opacity: 1, duration: 0.4 }, at + 0.01);
        tl.call(() => { stageG.innerHTML = ''; showLook(stageG, k, true); }, null, at + 2.2);
        cap.show(tl, at + 2.0, L.name + '.');
      });
      tl.to({}, { duration: 1 });
      return tl;
    }
  });

  P.push({
    type: 'try', title: 'Name that vessel',
    html: `<p>These lights are ahead of you in the dark. What are you looking at?</p>`,
    lockMsg: 'Identify all five',
    night: true,
    build(svg, S, api) {
      night(svg, { horizon: 330 });
      const stageG = A.g(svg, { transform: 'translate(400,330)' });
      const order = [3, 0, 2, 4, 1];
      const ui = document.createElement('div');
      ui.innerHTML = `<div class="opts" role="group">${LOOKS.map((L, k) => `<button class="opt" data-k="${k}"><span class="dot"></span><span>${L.name}</span></button>`).join('')}</div><div class="status"></div>`;
      api.task.appendChild(ui);
      const stt = ui.querySelector('.status');
      let i = 0, busy = false;
      const show = () => { stageG.innerHTML = ''; showLook(stageG, order[i], false); gsap.from(stageG, { opacity: 0, duration: 0.5 }); stt.textContent = `${i + 1} of ${order.length}`; ui.querySelectorAll('.opt').forEach(b => b.className = 'opt'); };
      ui.querySelectorAll('.opt').forEach(b => b.onclick = () => {
        if (busy || i >= order.length) return;
        if (+b.dataset.k === order[i]) {
          busy = true; b.className = 'opt right';
          stageG.innerHTML = ''; showLook(stageG, order[i], true);
          api.say('Yes. ' + LOOKS[order[i]].name + '.', 'good');
          S.after(1900, () => {
            busy = false; i++;
            if (i < order.length) { api.hush(); show(); }
            else { stt.textContent = ''; api.done('Red and green together: it is heading straight for you. A white light above them means power.'); }
          });
        } else { b.className = 'opt wrong'; api.say('Not that one. Look at the colours and whether there is a white light above.', 'bad'); }
      });
      show();
    }
  });

  P.push({
    type: 'learn', title: 'Vessels at anchor',
    html: `<p>A vessel <b>under 50 metres</b> at anchor shows one <b>all-round white light</b> where it can best be seen, from sunset to sunrise.</p>
<p>A vessel <b>over 50 metres</b> shows <b>two</b> all-round white lights, the forward one higher than the one aft.</p>
<p>In a busy area, show extra lights such as deck lights so you're seen, and keep a good watch. Many other light combinations show what a vessel is doing, such as fishing, dredging or not under command.</p>`,
    night: true,
    art(svg, S) {
      night(svg, { horizon: 400 });
      nightSide(svg, 200, 400, 200);
      lamp(svg, 200, 400 - 30 * 2.4, WHITE, 6);
      A.tag(svg, 200, 500, 'UNDER 50 m: ONE', { fill: C.ink, size: 14 });
      const sh = A.g(svg, { transform: 'translate(560,400)' });
      A.path(sh, 'M -170 -30 L 170 -36 L 150 20 L -160 20 Z', { fill: '#22364B', stroke: '#3B536C', 'stroke-width': 2 });
      A.rect(sh, -150, -80, 70, 50, { fill: '#2A3D52' });
      A.line(sh, 120, -36, 120, -150, { stroke: '#41546A', 'stroke-width': 4 });
      A.line(sh, -120, -80, -120, -110, { stroke: '#41546A', 'stroke-width': 4 });
      lamp(sh, 120, -150, WHITE, 6); lamp(sh, -120, -110, WHITE, 6);
      A.tag(svg, 560, 500, 'OVER 50 m: TWO, FORWARD HIGHER', { fill: C.ink, size: 14 });
    }
  });

  P.push({
    type: 'check', title: 'Anchored overnight',
    q: 'You are anchored overnight in your 6 metre boat. What light must you show?',
    opts: ['Red and green sidelights only', 'One all-round white light', 'Two all-round white lights', 'A flashing yellow light'], a: 1,
    why: 'Vessels under 50 m at anchor show one all-round white light, from sunset to sunrise.'
  });

  P.push({
    type: 'review', n: 7, of: 9, title: 'Workbook self-test',
    q: 'What lights are required on a motor boat, less than 12 metres in length, when underway at night or in reduced visibility?',
    opts: ['Sidelights and green masthead light.', 'Two all-round white lights.', 'Red and green sidelights only.', 'Red and green sidelights and either an all-round white light or a masthead light and stern light.'], a: 3,
    why: 'Under 12 m: sidelights, plus either an all-round white light, or a masthead light and stern light.'
  });

  SR.chapter({
    id: 4,
    title: 'Navigation Lights',
    intro: 'Which lights a vessel must show from sunset to sunrise, what each one means, and how to read the lights of other vessels in the dark.',
    cover(svg, S) {
      night(svg, { horizon: 300 });
      const R = A.rng(2);
      for (let k = 0; k < 50; k++) A.circle(svg, R() * 800, R() * 260, 0.8 + R() * 1.6, { fill: '#fff', opacity: 0.3 + R() * 0.6 });
      const sets = [[160, 330, [[-14, 0, GREEN], [14, 0, RED], [0, -22, WHITE]]], [520, 340, [[0, 0, RED], [-6, -26, WHITE]]], [680, 320, [[0, 0, WHITE]]], [330, 380, [[-20, 0, GREEN], [20, 0, RED], [0, -34, WHITE]]]];
      sets.forEach(([x, y, ls], k) => {
        const g = A.g(svg, { transform: `translate(${x},${y})` });
        ls.forEach(([lx, ly, c]) => lamp(g, lx, ly, c, 5));
        gsap.to(g, { opacity: 0.7, duration: 1.4 + k * 0.3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        A.path(svg, `M ${x - 30} ${y + 20} Q ${x} ${y + 26} ${x + 30} ${y + 20}`, { stroke: 'rgba(255,255,255,0.12)', 'stroke-width': 2, fill: 'none' });
      });
    },
    pages: P
  });
})();
