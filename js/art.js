/* Skipper Ready: shared illustration and motion library.
   Every picture in the app is drawn from these pieces so the whole
   course shares one look. Stage coordinates are 800 x 600. */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const C = {
    paper: '#F4EFE3', paper2: '#EAE3D2', paper3: '#DED5BF', ink: '#12263A', ink2: '#3B4F64', ink3: '#6E7F90',
    line: '#C9BFA6', sea1: '#D6E8E9', sea2: '#A9CDD3', sea3: '#6FA6B6', sea4: '#2F6F86', deep: '#173F55',
    port: '#C8352B', stbd: '#1C8A4F', buoy: '#F0B21A', sand: '#E9D9B0', land: '#D8CCAD', land2: '#C9BC98',
    white: '#FFFDF8', night: '#0B1626', night2: '#14263D', grass: '#6E9461', reef: '#C98B6B', orange: '#E8762D',
    deck: '#E3E8E6', skin: '#E2B48C', foam: '#FFFFFF'
  };
  const HEAD = "'Barlow Condensed', 'Arial Narrow', sans-serif";
  const BODY = "'Atkinson Hyperlegible', Arial, sans-serif";
  let uidN = 0;

  const A = {
    C,
    uid(p) { return (p || 'u') + (++uidN); },
    el(tag, attrs, parent) {
      const e = document.createElementNS(NS, tag);
      if (attrs) for (const k in attrs) if (attrs[k] !== null && attrs[k] !== undefined) e.setAttribute(k, attrs[k]);
      if (parent) parent.appendChild(e);
      return e;
    },
    g(parent, attrs) { return A.el('g', attrs, parent); },
    path(parent, d, attrs) { return A.el('path', Object.assign({ d }, attrs || {}), parent); },
    rect(parent, x, y, w, h, attrs) { return A.el('rect', Object.assign({ x, y, width: w, height: h }, attrs || {}), parent); },
    circle(parent, cx, cy, r, attrs) { return A.el('circle', Object.assign({ cx, cy, r }, attrs || {}), parent); },
    line(parent, x1, y1, x2, y2, attrs) { return A.el('line', Object.assign({ x1, y1, x2, y2 }, attrs || {}), parent); },
    defs(svg) {
      let d = svg.querySelector('defs');
      if (!d) d = A.el('defs', {}, null), svg.insertBefore(d, svg.firstChild);
      return d;
    },
    text(parent, x, y, str, o) {
      o = o || {};
      const t = A.el('text', {
        x, y,
        'font-family': o.font === 'body' ? BODY : HEAD,
        'font-size': o.size || 22,
        'font-weight': o.weight || (o.font === 'body' ? 400 : 600),
        fill: o.fill || C.ink,
        'text-anchor': o.anchor || 'start',
        'dominant-baseline': o.base || null,
        'letter-spacing': o.ls || null,
        opacity: o.opacity,
        'font-style': o.italic ? 'italic' : null
      }, parent);
      t.textContent = str;
      return t;
    },
    lines(parent, x, y, arr, o) {
      o = o || {};
      const lh = o.lh || (o.size || 22) * 1.2;
      const g = A.g(parent);
      arr.forEach((s, i) => A.text(g, x, y + i * lh, s, o));
      return g;
    },
    /* rounded pill label: returns group; anchor middle by default */
    tag(parent, x, y, str, o) {
      o = o || {};
      const size = o.size || 17, padX = o.padX || 10, h = size + 12;
      const g = A.g(parent, { class: 'tag' });
      const r = A.rect(g, 0, 0, 10, h, { rx: o.rx != null ? o.rx : h / 2, fill: o.fill || C.ink, stroke: o.stroke || null, 'stroke-width': o.stroke ? 2 : null });
      const t = A.text(g, 0, h / 2 + 1, str, { size, weight: o.weight || 700, fill: o.color || C.white, anchor: 'middle', base: 'middle', ls: o.ls || '0.03em' });
      let w = 0;
      try { w = t.getComputedTextLength(); } catch (e) { }
      if (!w) w = str.length * size * 0.5;
      w += padX * 2;
      r.setAttribute('width', w);
      t.setAttribute('x', w / 2);
      const ax = o.anchor === 'start' ? 0 : o.anchor === 'end' ? w : w / 2;
      g.setAttribute('transform', `translate(${x - ax},${y - h / 2})`);
      g._w = w; g._h = h;
      return g;
    },
    /* arrow with a drawn head sized to the line */
    arrow(parent, d, o) {
      o = o || {};
      const col = o.color || C.ink, w = o.width || 4, hs = o.head || w * 3.4;
      const g = A.g(parent, { class: 'arrow' });
      const p = A.path(g, d, { fill: 'none', stroke: col, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': o.dash || null });
      const L = p.getTotalLength();
      const e = p.getPointAtLength(L), b = p.getPointAtLength(Math.max(0, L - 2));
      const ang = Math.atan2(e.y - b.y, e.x - b.x) * 180 / Math.PI;
      const head = A.path(g, `M ${hs * 0.35} 0 L ${-hs * 0.75} ${-hs * 0.6} L ${-hs * 0.45} 0 L ${-hs * 0.75} ${hs * 0.6} Z`, { fill: col, 'stroke-linejoin': 'round', stroke: col, 'stroke-width': 1 });
      head.setAttribute('transform', `translate(${e.x},${e.y}) rotate(${ang})`);
      g._path = p; g._head = head;
      return g;
    },
    /* dashed distance ring */
    ring(parent, cx, cy, r, o) {
      o = o || {};
      const g = A.g(parent, { class: 'ring' });
      A.circle(g, cx, cy, r, { fill: o.fill || 'rgba(200,53,43,0.07)', stroke: o.color || C.port, 'stroke-width': o.width || 2.5, 'stroke-dasharray': o.dash || '8 7' });
      if (o.label) A.tag(g, cx, cy - r, o.label, { fill: o.color || C.port, size: o.size || 15 });
      return g;
    },

    /* ---------------- backgrounds ---------------- */
    paperBg(svg, o) {
      o = o || {};
      const g = A.g(svg, { class: 'bg' });
      A.rect(g, 0, 0, 800, 600, { fill: o.fill || C.paper2 });
      const grid = A.g(g, { stroke: C.paper3, 'stroke-width': 1, opacity: o.grid === false ? 0 : 0.8 });
      for (let x = 50; x < 800; x += 50) A.line(grid, x, 0, x, 600);
      for (let y = 50; y < 600; y += 50) A.line(grid, 0, y, 800, y);
      return g;
    },
    seaBg(svg, o) {
      o = o || {};
      const id = A.uid('sea');
      const d = A.defs(svg);
      const lg = A.el('linearGradient', { id, x1: 0, y1: 0, x2: 0.3, y2: 1 }, d);
      A.el('stop', { offset: 0, 'stop-color': o.top || '#CFE4E6' }, lg);
      A.el('stop', { offset: 1, 'stop-color': o.bottom || '#A4CAD1' }, lg);
      const g = A.g(svg, { class: 'bg' });
      A.rect(g, 0, 0, 800, 600, { fill: `url(#${id})` });
      if (o.marks !== false) A.waveMarks(g, o.markColor || 'rgba(255,255,255,0.55)', o.density || 46);
      return g;
    },
    /* small drifting ripple strokes that make flat water feel alive */
    waveMarks(parent, col, n) {
      const g = A.g(parent, { class: 'ripples' });
      const rnd = A.rng(7);
      for (let i = 0; i < n; i++) {
        const x = rnd() * 860 - 30, y = rnd() * 620 - 10, w = 10 + rnd() * 16;
        const p = A.path(g, `M ${x} ${y} q ${w / 2} -4 ${w} 0`, { fill: 'none', stroke: col, 'stroke-width': 2, 'stroke-linecap': 'round' });
        gsap.to(p, { x: 14 + rnd() * 10, y: 3, opacity: 0.25, duration: 2.6 + rnd() * 2.4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: -rnd() * 4 });
      }
      return g;
    },
    nightBg(svg, o) {
      o = o || {};
      const id = A.uid('night');
      const d = A.defs(svg);
      const lg = A.el('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 }, d);
      A.el('stop', { offset: 0, 'stop-color': '#0A1322' }, lg);
      A.el('stop', { offset: 0.55, 'stop-color': '#13253B' }, lg);
      A.el('stop', { offset: 1, 'stop-color': '#0B1828' }, lg);
      const g = A.g(svg, { class: 'bg' });
      A.rect(g, 0, 0, 800, 600, { fill: `url(#${id})` });
      if (o.stars !== false) {
        const rnd = A.rng(3);
        for (let i = 0; i < 60; i++) {
          const s = A.circle(g, rnd() * 800, rnd() * (o.horizon || 250), rnd() * 1.3 + 0.3, { fill: '#fff', opacity: 0.25 + rnd() * 0.5 });
          if (i % 4 === 0) gsap.to(s, { opacity: 0.1, duration: 1.5 + rnd() * 2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        }
      }
      return g;
    },
    /* glow filter for lights at night */
    glow(svg, col) {
      const id = A.uid('glow');
      const f = A.el('filter', { id, x: '-200%', y: '-200%', width: '500%', height: '500%' }, A.defs(svg));
      A.el('feGaussianBlur', { stdDeviation: 6, result: 'b' }, f);
      const m = A.el('feMerge', {}, f);
      A.el('feMergeNode', { in: 'b' }, m); A.el('feMergeNode', { in: 'b' }, m); A.el('feMergeNode', { in: 'SourceGraphic' }, m);
      return `url(#${id})`;
    },
    softShadow(svg) {
      const id = A.uid('sh');
      const f = A.el('filter', { id, x: '-20%', y: '-20%', width: '140%', height: '150%' }, A.defs(svg));
      A.el('feDropShadow', { dx: 0, dy: 6, stdDeviation: 7, 'flood-color': '#12263A', 'flood-opacity': 0.18 }, f);
      return `url(#${id})`;
    },
    rng(seed) { let s = seed || 1; return () => (s = (s * 16807) % 2147483647, (s - 1) / 2147483646); },

    /* ---------------- top-down craft (bow points along +x) ---------------- */
    boat(parent, o) {
      o = o || {};
      const type = o.type || 'motor';
      const L = o.len || 110;
      const col = o.color || C.sea4;
      const root = A.g(parent, { class: 'boat' });
      const body = A.g(root);
      const draw = DRAW[type] || DRAW.motor;
      draw(body, L, col, o);
      const b = {
        g: root, body, L, type,
        x: o.x || 0, y: o.y || 0, rotation: o.r || 0, scale: o.scale || 1,
        wake: o.wake !== false, trail: [], _lx: null, _ly: null,
        set() { root.setAttribute('transform', `translate(${b.x.toFixed(2)},${b.y.toFixed(2)}) rotate(${b.rotation.toFixed(2)}) scale(${b.scale})`); }
      };
      b.set();
      if (this && this._boats) this._boats.push(b);
      return b;
    },

    /* ---------------- side views ---------------- */
    /* motor boat side view. Local origin = waterline under the middle of the boat,
       bow to the right. Put people in g.crew (local coords, deck at about -0.75h)
       so the hull side hides their legs. */
    boatSide(parent, o) {
      o = o || {};
      const L = o.len || 300, col = o.color || C.sea4, h = L * 0.15;
      const g = A.g(parent, { class: 'boat-side' });
      const svg = parent.ownerSVGElement || parent;
      // outboard (behind the hull at the transom)
      if (o.motor !== false) {
        const mx = -L / 2;
        const ob = A.g(g);
        A.path(ob, `M ${mx + L * 0.01} ${-h * 1.02} L ${mx - L * 0.03} ${-h * 1.0} L ${mx - L * 0.03} ${h * 0.95} L ${mx - L * 0.005} ${h * 1.05} L ${mx + L * 0.012} ${h * 0.6} Z`, { fill: '#22374D' });
        A.path(ob, `M ${mx - L * 0.055} ${h * 0.55} L ${mx + L * 0.02} ${h * 0.55}`, { stroke: '#22374D', 'stroke-width': 4, 'stroke-linecap': 'round' });
        A.path(ob, `M ${mx - L * 0.075} ${-h * 1.95} Q ${mx - L * 0.08} ${-h * 2.25} ${mx - L * 0.04} ${-h * 2.25} L ${mx + L * 0.005} ${-h * 2.2} Q ${mx + L * 0.02} ${-h * 2.15} ${mx + L * 0.015} ${-h * 1.85} L ${mx + L * 0.01} ${-h * 1.05} L ${mx - L * 0.06} ${-h * 1.05} Z`, { fill: C.ink });
        A.path(ob, `M ${mx - L * 0.06} ${-h * 1.9} L ${mx + L * 0.005} ${-h * 1.9}`, { stroke: C.sea3, 'stroke-width': 3, 'stroke-linecap': 'round' });
      }
      const crew = A.g(g, { class: 'crew' });
      // hull
      const hullD = `M ${-L / 2} ${-h} Q ${L * 0.1} ${-h * 1.02} ${L * 0.4} ${-h * 1.22} L ${L / 2} ${-h * 1.34} C ${L * 0.47} ${-h * 0.62} ${L * 0.41} ${-h * 0.05} ${L * 0.3} ${h * 0.38} L ${-L * 0.42} ${h * 0.46} L ${-L / 2} ${h * 0.3} Z`;
      const cid = A.uid('hc');
      const cp = A.el('clipPath', { id: cid }, A.defs(svg));
      A.path(cp, hullD);
      A.path(g, hullD, { fill: C.white });
      const deco = A.g(g, { 'clip-path': `url(#${cid})` });
      A.rect(deco, -L, -h * 0.2, L * 2, h * 2, { fill: C.ink });
      A.path(deco, `M ${-L / 2} ${-h * 0.62} Q ${L * 0.1} ${-h * 0.66} ${L * 0.5} ${-h * 0.86} L ${L * 0.5} ${-h * 0.72} Q ${L * 0.1} ${-h * 0.52} ${-L / 2} ${-h * 0.48} Z`, { fill: col });
      A.path(deco, `M ${-L / 2} ${-h * 0.98} Q ${L * 0.1} ${-h * 1.0} ${L * 0.4} ${-h * 1.2}`, { fill: 'none', stroke: 'rgba(18,38,58,0.12)', 'stroke-width': h * 0.12 });
      A.path(g, hullD, { fill: 'none', stroke: C.ink, 'stroke-width': 2.2, 'stroke-linejoin': 'round' });
      // rub rail
      A.path(g, `M ${-L / 2} ${-h} Q ${L * 0.1} ${-h * 1.02} ${L * 0.4} ${-h * 1.22} L ${L / 2} ${-h * 1.34}`, { fill: 'none', stroke: C.ink, 'stroke-width': 4, 'stroke-linecap': 'round' });
      // bow rail
      if (o.rail !== false) {
        A.path(g, `M ${L * 0.16} ${-h * 1.12 - 13} Q ${L * 0.35} ${-h * 1.2 - 14} ${L * 0.47} ${-h * 1.34 - 9}`, { fill: 'none', stroke: '#8796A3', 'stroke-width': 2.5, 'stroke-linecap': 'round' });
        [0.2, 0.32, 0.44].forEach(t => A.line(g, L * t, -h * (1.1 + t * 0.4), L * t, -h * (1.1 + t * 0.4) - 13, { stroke: '#8796A3', 'stroke-width': 2 }));
      }
      // console + windscreen
      if (o.console !== false) {
        const cx0 = -L * 0.06, cx1 = L * 0.06, top = -h * 1.85;
        A.path(g, `M ${cx0} ${-h * 1.02} L ${cx0} ${top + 6} Q ${cx0} ${top} ${cx0 + 6} ${top} L ${cx1 - 4} ${top} L ${cx1 + L * 0.025} ${-h * 1.06} Z`, { fill: C.white, stroke: C.ink, 'stroke-width': 2.2, 'stroke-linejoin': 'round' });
        A.path(g, `M ${cx1 - 6} ${top} L ${cx1 + L * 0.02} ${top} L ${cx1 - L * 0.012} ${top - h * 0.75} L ${cx1 - L * 0.04} ${top - h * 0.75} Z`, { fill: 'rgba(111,166,182,0.45)', stroke: C.ink, 'stroke-width': 2, 'stroke-linejoin': 'round' });
        // leaning post seat
        A.rect(g, -L * 0.17, -h * 1.55, L * 0.07, h * 0.5, { rx: 5, fill: col, stroke: C.ink, 'stroke-width': 2 });
      }
      g.crew = crew; g._h = h; g._L = L;
      if (o.x != null) g.setAttribute('transform', `translate(${o.x},${o.y || 0})${o.flip ? ' scale(-1,1)' : ''}`);
      return g;
    },
    /* gentle water surface for side views; returns group. y = waterline */
    waterSide(parent, y, o) {
      o = o || {};
      const g = A.g(parent, { class: 'water-side' });
      const id = A.uid('ws');
      const lg = A.el('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 }, A.defs(parent.ownerSVGElement || parent));
      A.el('stop', { offset: 0, 'stop-color': o.top || '#9FC7CF' }, lg);
      A.el('stop', { offset: 1, 'stop-color': o.bottom || '#5F98AA' }, lg);
      const amp = o.amp || 5, wl = o.wl || 90;
      let d = `M -100 ${y}`;
      for (let x = -100; x <= 1000; x += wl) d += ` q ${wl / 4} ${-amp} ${wl / 2} 0 t ${wl / 2} 0`;
      d += ` L 1000 640 L -100 640 Z`;
      const p = A.path(g, d, { fill: `url(#${id})`, opacity: o.opacity || 0.9 });
      A.path(g, d.split(' L 1000')[0], { fill: 'none', stroke: 'rgba(255,255,255,0.7)', 'stroke-width': 2.5 });
      if (o.move !== false) gsap.to(g, { x: -wl, duration: o.speed || 4, ease: 'none', repeat: -1 });
      return g;
    },

    /* flat pictogram person: origin at feet, ~100 units tall */
    person(parent, o) {
      o = o || {};
      const s = o.s || 1, col = o.color || C.ink;
      const root = A.g(parent, { class: 'person' });
      const g = A.g(root);
      const W = 11;
      const st = { stroke: col, 'stroke-width': W, 'stroke-linecap': 'round', fill: 'none' };
      const sitting = o.pose === 'sit';
      const side = !!o.side, sx = side ? 3 : 11;
      // legs
      const legs = A.g(g);
      if (sitting) {
        A.path(legs, 'M -5 -40 L 20 -40 L 22 -4', st);
        A.path(legs, 'M 4 -40 L 28 -40 L 30 -4', Object.assign({}, st, { opacity: 0.85 }));
      } else {
        A.path(legs, side ? 'M -3 -40 L -6 -4' : 'M -6 -40 L -8 -4', st);
        A.path(legs, side ? 'M 3 -40 L 6 -4' : 'M 6 -40 L 8 -4', st);
      }
      // torso
      const torso = A.path(g, side ? 'M -8 -74 Q -10 -58 -8 -40 L 8 -40 Q 10 -58 8 -74 Q 0 -78 -8 -74 Z' : 'M -11 -74 Q -13 -58 -10 -40 L 10 -40 Q 13 -58 11 -74 Q 0 -79 -11 -74 Z', { fill: col });
      if (o.vest && side) A.path(g, 'M -9.5 -73 Q -11.5 -58 -9.5 -46 L 9.5 -46 Q 11.5 -58 9.5 -73 Q 0 -77.5 -9.5 -73 Z', { fill: o.vest === true ? C.orange : o.vest });
      else if (o.vest) A.path(g, 'M -12 -73 Q -14 -58 -11 -46 L 11 -46 Q 14 -58 12 -73 Q 6 -76 3 -76 L 3 -60 L -3 -60 L -3 -76 Q -6 -76 -12 -73 Z', { fill: o.vest === true ? C.orange : o.vest });
      // arms (rotate around shoulders, 0 = hanging down)
      const armL = A.g(g, { transform: `translate(${-sx},-70)` });
      const armLi = A.g(armL);
      A.path(armLi, 'M 0 0 L 0 32', st);
      const armR = A.g(g, { transform: `translate(${sx},-70)` });
      const armRi = A.g(armR);
      A.path(armRi, 'M 0 0 L 0 32', st);
      // head
      const head = A.circle(g, 0, -91, 10.5, { fill: col });
      root.setAttribute('transform', `translate(${o.x || 0},${o.y || 0}) scale(${(o.flip ? -1 : 1) * s},${s})`);
      const p = {
        g: root, armL: armLi, armR: armRi, head, torso,
        /* deg outward from hanging; 180 = straight up */
        armTo(side, deg) { return side === 'L' ? { rotation: deg } : { rotation: -deg }; },
        setArm(side, deg) { gsap.set(side === 'L' ? armLi : armRi, { rotation: side === 'L' ? deg : -deg, transformOrigin: '0px 0px' }); }
      };
      /* side view: positive = forward (towards the way the person faces) */
      p.fwd = (arm, deg) => gsap.set(arm === 'L' ? armLi : armRi, { rotation: -deg, transformOrigin: '0px 0px' });
      if (o.fwdL != null) p.fwd('L', o.fwdL);
      if (o.fwdR != null) p.fwd('R', o.fwdR);
      if (o.armL != null) p.setArm('L', o.armL);
      if (o.armR != null) p.setArm('R', o.armR);
      return p;
    },

    /* marine safety style sign board */
    sign(parent, o) {
      o = o || {};
      const x = o.x || 0, y = o.y || 0, w = o.w || 260, h = o.h || 180;
      const g = A.g(parent, { class: 'sign', transform: `translate(${x},${y})` });
      if (o.posts !== false) {
        A.rect(g, w * 0.18 - 6, h - 4, 12, o.postH || 120, { fill: '#8C8A80' });
        A.rect(g, w * 0.82 - 6, h - 4, 12, o.postH || 120, { fill: '#8C8A80' });
      }
      A.rect(g, 4, 6, w, h, { rx: 12, fill: 'rgba(18,38,58,0.18)' });
      A.rect(g, 0, 0, w, h, { rx: 12, fill: C.white, stroke: o.border || C.deep, 'stroke-width': 7 });
      if (o.head) {
        A.path(g, `M 3.5 ${12} Q 3.5 3.5 12 3.5 L ${w - 12} 3.5 Q ${w - 3.5} 3.5 ${w - 3.5} 12 L ${w - 3.5} 46 L 3.5 46 Z`, { fill: o.border || C.deep });
        A.text(g, w / 2, 33, o.head, { size: 24, weight: 700, fill: C.white, anchor: 'middle', ls: '0.06em' });
      }
      const inner = A.g(g, { transform: `translate(0,${o.head ? 46 : 0})` });
      g.inner = inner;
      return g;
    },
    /* round speed limit plate */
    speedSign(parent, cx, cy, r, num, unit) {
      const g = A.g(parent, { class: 'speed-sign' });
      A.circle(g, cx + 3, cy + 5, r, { fill: 'rgba(18,38,58,0.18)' });
      A.circle(g, cx, cy, r, { fill: C.white });
      A.circle(g, cx, cy, r * 0.86, { fill: 'none', stroke: C.port, 'stroke-width': r * 0.16 });
      A.text(g, cx, cy + r * 0.2, num, { size: r * 0.95, weight: 700, anchor: 'middle', fill: C.ink });
      A.text(g, cx, cy + r * 0.52, unit || 'KNOTS', { size: r * 0.22, weight: 700, anchor: 'middle', fill: C.ink, ls: '0.1em' });
      return g;
    },
    /* sheet of paper with folded corner */
    doc(parent, o) {
      o = o || {};
      const w = o.w || 170, h = o.h || 220, f = 26;
      const g = A.g(parent, { class: 'doc', transform: `translate(${o.x || 0},${o.y || 0}) rotate(${o.r || 0})` });
      A.path(g, `M 5 8 L ${w - f + 5} 8 L ${w + 5} ${f + 8} L ${w + 5} ${h + 8} L 5 ${h + 8} Z`, { fill: 'rgba(18,38,58,0.14)' });
      A.path(g, `M 0 0 L ${w - f} 0 L ${w} ${f} L ${w} ${h} L 0 ${h} Z`, { fill: C.white, stroke: C.line, 'stroke-width': 1.5 });
      A.path(g, `M ${w - f} 0 L ${w - f} ${f} L ${w} ${f}`, { fill: C.paper2, stroke: C.line, 'stroke-width': 1.5 });
      if (o.band) A.rect(g, 0, 0, 10, h, { fill: o.band });
      if (o.title) A.lines(g, 22, 40, [].concat(o.title), { size: o.tsize || 21, weight: 700, lh: (o.tsize || 21) * 1.05 });
      const n = o.rows == null ? 6 : o.rows, top = o.rowTop || 90;
      for (let i = 0; i < n; i++) A.rect(g, 22, top + i * 18, (w - 50) * (i % 3 === 2 ? 0.6 : 1), 6, { rx: 3, fill: C.paper3 });
      return g;
    },
    tick(parent, x, y, r, good) {
      const g = A.g(parent, { transform: `translate(${x},${y})` });
      A.circle(g, 0, 0, r, { fill: good === false ? C.port : C.stbd });
      if (good === false) A.path(g, `M ${-r * 0.35} ${-r * 0.35} L ${r * 0.35} ${r * 0.35} M ${r * 0.35} ${-r * 0.35} L ${-r * 0.35} ${r * 0.35}`, { stroke: '#fff', 'stroke-width': r * 0.22, 'stroke-linecap': 'round' });
      else A.path(g, `M ${-r * 0.42} 0 L ${-r * 0.1} ${r * 0.32} L ${r * 0.45} ${-r * 0.3}`, { stroke: '#fff', 'stroke-width': r * 0.22, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      return g;
    },
    /* dial gauge; returns {g, set(v)} */
    gauge(parent, o) {
      o = o || {};
      const x = o.x || 0, y = o.y || 0, r = o.r || 80, max = o.max || 40, a0 = -220, a1 = 40;
      const g = A.g(parent, { class: 'gauge', transform: `translate(${x},${y})` });
      A.circle(g, 3, 5, r, { fill: 'rgba(18,38,58,0.2)' });
      A.circle(g, 0, 0, r, { fill: C.ink });
      A.circle(g, 0, 0, r - 6, { fill: '#1B3550' });
      const ang = v => (a0 + (a1 - a0) * v / max) * Math.PI / 180;
      if (o.zone) {
        const [z0, z1, zc] = o.zone;
        const p0 = ang(z0), p1 = ang(z1), rr = r - 14;
        A.path(g, `M ${Math.cos(p0) * rr} ${Math.sin(p0) * rr} A ${rr} ${rr} 0 ${(p1 - p0) > Math.PI ? 1 : 0} 1 ${Math.cos(p1) * rr} ${Math.sin(p1) * rr}`, { fill: 'none', stroke: zc || C.port, 'stroke-width': 8 });
      }
      const step = o.step || 5;
      for (let v = 0; v <= max; v += step) {
        const a = ang(v);
        A.line(g, Math.cos(a) * (r - 20), Math.sin(a) * (r - 20), Math.cos(a) * (r - 30), Math.sin(a) * (r - 30), { stroke: '#fff', 'stroke-width': 2.5, 'stroke-linecap': 'round' });
        if (v % (step * 2) === 0) A.text(g, Math.cos(a) * (r - 44), Math.sin(a) * (r - 44) + 6, String(v), { size: r * 0.17, fill: '#fff', anchor: 'middle', weight: 600 });
      }
      A.text(g, 0, r * 0.5, o.label || 'KNOTS', { size: r * 0.15, fill: C.sea2, anchor: 'middle', weight: 700, ls: '0.12em' });
      const needle = A.g(g);
      A.path(needle, `M -4 6 L 0 ${-(r - 22)} L 4 6 Z`, { fill: C.buoy });
      A.circle(g, 0, 0, 8, { fill: C.buoy });
      const st = { v: o.value || 0 };
      const put = () => needle.setAttribute('transform', `rotate(${a0 + 90 + (a1 - a0) * st.v / max})`);
      put();
      return { g, st, set(v, dur) { return gsap.to(st, { v, duration: dur == null ? 0.6 : dur, ease: 'power2.out', onUpdate: put }); } };
    },

    /* ---------------- scenery (top-down) ---------------- */
    swimmer(parent, x, y, s) {
      const g = A.g(parent, { transform: `translate(${x},${y}) scale(${s || 1})` });
      A.circle(g, 0, 0, 18, { fill: 'none', stroke: 'rgba(255,255,255,0.8)', 'stroke-width': 2 });
      A.path(g, 'M -12 4 Q 0 -6 12 4', { stroke: C.skin, 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' });
      A.circle(g, 0, -2, 6.5, { fill: '#5B3A26' });
      A.circle(g, 0, 8, 7, { fill: C.orange, opacity: 0.9 });
      gsap.to(g.firstChild, { attr: { r: 24 }, opacity: 0, duration: 1.8, repeat: -1, ease: 'sine.out' });
      return g;
    },
    mooringBuoy(parent, x, y, col) {
      const g = A.g(parent, { transform: `translate(${x},${y})` });
      A.circle(g, 1.5, 2.5, 8, { fill: 'rgba(18,38,58,0.2)' });
      A.circle(g, 0, 0, 8, { fill: col || C.white, stroke: C.ink, 'stroke-width': 1.5 });
      return g;
    },
    beacon(parent, x, y, kind) {
      const g = A.g(parent, { transform: `translate(${x},${y})` });
      const col = kind === 'port' ? C.port : kind === 'stbd' ? C.stbd : C.buoy;
      A.circle(g, 2, 3, 9, { fill: 'rgba(18,38,58,0.22)' });
      A.circle(g, 0, 0, 9, { fill: col, stroke: C.ink, 'stroke-width': 1.5 });
      A.circle(g, 0, 0, 3, { fill: C.ink });
      return g;
    },
    jetty(parent, x, y, w, h, o) {
      o = o || {};
      const g = A.g(parent, { class: 'jetty' });
      A.rect(g, x + 4, y + 6, w, h, { fill: 'rgba(18,38,58,0.18)', rx: 2 });
      A.rect(g, x, y, w, h, { fill: '#B68E62', stroke: '#7A5A39', 'stroke-width': 2, rx: 2 });
      const horiz = w > h;
      const n = Math.floor((horiz ? w : h) / 9);
      for (let i = 1; i < n; i++) {
        if (horiz) A.line(g, x + i * 9, y + 1, x + i * 9, y + h - 1, { stroke: '#93704A', 'stroke-width': 1.2 });
        else A.line(g, x + 1, y + i * 9, x + w - 1, y + i * 9, { stroke: '#93704A', 'stroke-width': 1.2 });
      }
      if (o.piles !== false) {
        const m = Math.max(2, Math.floor((horiz ? w : h) / 60));
        for (let i = 0; i <= m; i++) {
          const t = i / m;
          const px = horiz ? x + 4 + t * (w - 8) : x - 3, py = horiz ? y - 3 : y + 4 + t * (h - 8);
          A.circle(g, px, py, 4, { fill: '#6B4E31' });
          A.circle(g, horiz ? px : x + w + 3, horiz ? y + h + 3 : py, 4, { fill: '#6B4E31' });
        }
      }
      return g;
    },
    /* irregular shoreline: pts along the water edge; land on the side away from water */
    land(parent, d, o) {
      o = o || {};
      const g = A.g(parent, { class: 'land' });
      A.path(g, d, { fill: o.sand || C.sand, stroke: 'rgba(255,255,255,0.7)', 'stroke-width': 10, 'stroke-linejoin': 'round' });
      A.path(g, d, { fill: o.fill || C.land, transform: o.inset || 'translate(0,0)', stroke: C.land2, 'stroke-width': 1.5 });
      return g;
    },
    tree(parent, x, y, r) {
      const g = A.g(parent, { transform: `translate(${x},${y})` });
      A.circle(g, 3, 4, r, { fill: 'rgba(18,38,58,0.15)' });
      A.circle(g, 0, 0, r, { fill: '#7E9C6A' });
      A.circle(g, -r * 0.25, -r * 0.25, r * 0.55, { fill: '#93B07C' });
      return g;
    },
    house(parent, x, y, w, h, col) {
      const g = A.g(parent, { transform: `translate(${x},${y})` });
      A.rect(g, 3, 4, w, h, { fill: 'rgba(18,38,58,0.16)' });
      A.rect(g, 0, 0, w, h, { fill: col || '#C26B4E' });
      A.line(g, 0, h / 2, w, h / 2, { stroke: 'rgba(0,0,0,0.18)', 'stroke-width': 2 });
      return g;
    },
    flagA(parent, x, y, w, o) {
      o = o || {};
      const h = w * 0.8;
      const g = A.g(parent, { class: 'flagA', transform: `translate(${x},${y})` });
      const cloth = A.g(g);
      A.rect(cloth, 0, 0, w / 2, h, { fill: C.white, stroke: C.ink, 'stroke-width': 1.5 });
      A.path(cloth, `M ${w / 2} 0 L ${w} 0 L ${w * 0.72} ${h / 2} L ${w} ${h} L ${w / 2} ${h} Z`, { fill: '#1D4FA0', stroke: C.ink, 'stroke-width': 1.5, 'stroke-linejoin': 'round' });
      g.cloth = cloth;
      if (o.wave !== false) gsap.to(cloth, { skewY: 4, scaleX: 0.95, transformOrigin: '0% 50%', duration: 0.9, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      return g;
    }
  };

  /* ---------- craft drawings ---------- */
  const DRAW = {
    motor(g, L, col, o) {
      const B = L * 0.4;
      const hull = `M ${-L / 2} ${-B / 2} L ${L * 0.1} ${-B / 2} C ${L * 0.3} ${-B / 2} ${L * 0.45} ${-B * 0.3} ${L / 2} 0 C ${L * 0.45} ${B * 0.3} ${L * 0.3} ${B / 2} ${L * 0.1} ${B / 2} L ${-L / 2} ${B / 2} Z`;
      A.path(g, hull, { fill: 'rgba(18,38,58,0.2)', transform: 'translate(3,5)' });
      // outboard
      A.rect(g, -L / 2 - L * 0.11, -B * 0.14, L * 0.13, B * 0.28, { rx: B * 0.08, fill: C.ink });
      A.rect(g, -L / 2 - L * 0.09, -B * 0.08, L * 0.05, B * 0.16, { rx: 2, fill: '#2C4560' });
      A.path(g, hull, { fill: C.white, stroke: C.ink, 'stroke-width': 1.6, 'stroke-linejoin': 'round' });
      // deck
      const s = 0.82;
      A.path(g, hull, { fill: C.deck, transform: `translate(${-L * 0.03},0) scale(${s})` });
      A.path(g, `M ${-L / 2 + 3} ${-B / 2 + 3} L ${L * 0.1} ${-B / 2 + 3}`, { stroke: col, 'stroke-width': 2.5, 'stroke-linecap': 'round' });
      A.path(g, `M ${-L / 2 + 3} ${B / 2 - 3} L ${L * 0.1} ${B / 2 - 3}`, { stroke: col, 'stroke-width': 2.5, 'stroke-linecap': 'round' });
      // rear seat
      A.rect(g, -L * 0.36, -B * 0.3, L * 0.1, B * 0.6, { rx: 4, fill: col });
      // console + screen
      A.rect(g, -L * 0.08, -B * 0.19, L * 0.15, B * 0.38, { rx: 3, fill: C.white, stroke: C.ink, 'stroke-width': 1.3 });
      A.circle(g, -L * 0.035, B * 0.06, B * 0.06, { fill: C.ink2 });
      A.path(g, `M ${L * 0.085} ${-B * 0.26} Q ${L * 0.15} 0 ${L * 0.085} ${B * 0.26}`, { stroke: C.ink2, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' });
      // bow hatch
      A.path(g, `M ${L * 0.25} ${-B * 0.13} L ${L * 0.38} 0 L ${L * 0.25} ${B * 0.13} Z`, { fill: C.white, stroke: C.line, 'stroke-width': 1.2, 'stroke-linejoin': 'round' });
    },
    patrol(g, L, col, o) {
      DRAW.motor(g, L, col || C.deep, o);
      const B = L * 0.4;
      A.rect(g, -L * 0.14, -B * 0.28, L * 0.26, B * 0.56, { rx: 4, fill: C.deep });
      for (let i = 0; i < 4; i++) A.rect(g, -L * 0.12 + i * L * 0.06, -B * 0.28, L * 0.03, B * 0.56, { fill: i % 2 ? C.white : C.deep, opacity: 0.9 });
    },
    yacht(g, L, col, o) {
      const B = L * 0.3;
      const hull = `M ${-L / 2} ${-B * 0.38} C ${-L * 0.2} ${-B * 0.55} ${L * 0.2} ${-B * 0.55} ${L / 2} 0 C ${L * 0.2} ${B * 0.55} ${-L * 0.2} ${B * 0.55} ${-L / 2} ${B * 0.38} Z`;
      A.path(g, hull, { fill: 'rgba(18,38,58,0.2)', transform: 'translate(3,5)' });
      A.path(g, hull, { fill: C.white, stroke: C.ink, 'stroke-width': 1.6 });
      A.path(g, hull, { fill: '#D9D2BF', transform: `translate(${-L * 0.02},0) scale(0.84)` });
      A.rect(g, -L * 0.45, -B * 0.22, L * 0.22, B * 0.44, { rx: 4, fill: C.white, stroke: C.line });
      A.rect(g, -L * 0.18, -B * 0.24, L * 0.22, B * 0.48, { rx: 6, fill: col });
      const mx = L * 0.08;
      if (o.sail !== false) {
        const side = o.tack === 'port' ? -1 : 1;
        A.path(g, `M ${mx} 0 Q ${-L * 0.12} ${side * B * 0.9} ${-L * 0.36} ${side * B * 0.55} L ${mx} 0 Z`, { fill: 'rgba(255,253,248,0.95)', stroke: C.ink2, 'stroke-width': 1.4, 'stroke-linejoin': 'round' });
        A.path(g, `M ${L * 0.46} 0 Q ${L * 0.22} ${side * B * 0.75} ${mx + 4} ${side * B * 0.45} Z`, { fill: 'rgba(255,253,248,0.9)', stroke: C.ink2, 'stroke-width': 1.2 });
      } else {
        A.line(g, mx, 0, -L * 0.34, 0, { stroke: C.ink2, 'stroke-width': 3, 'stroke-linecap': 'round' });
      }
      A.circle(g, mx, 0, 3.5, { fill: C.ink });
    },
    pwc(g, L, col, o) {
      const B = L * 0.36;
      const hull = `M ${-L / 2} ${-B * 0.42} L ${L * 0.15} ${-B / 2} C ${L * 0.4} ${-B / 2} ${L / 2} ${-B * 0.2} ${L / 2} 0 C ${L / 2} ${B * 0.2} ${L * 0.4} ${B / 2} ${L * 0.15} ${B / 2} L ${-L / 2} ${B * 0.42} Z`;
      A.path(g, hull, { fill: 'rgba(18,38,58,0.2)', transform: 'translate(2,4)' });
      A.path(g, hull, { fill: col || C.port, stroke: C.ink, 'stroke-width': 1.4 });
      A.path(g, `M ${L * 0.15} ${-B * 0.38} C ${L * 0.36} ${-B * 0.38} ${L * 0.44} ${-B * 0.15} ${L * 0.44} 0 C ${L * 0.44} ${B * 0.15} ${L * 0.36} ${B * 0.38} ${L * 0.15} ${B * 0.38} Z`, { fill: C.white, opacity: 0.85 });
      A.rect(g, -L * 0.38, -B * 0.16, L * 0.48, B * 0.32, { rx: B * 0.16, fill: C.ink });
      A.line(g, L * 0.13, -B * 0.42, L * 0.13, B * 0.42, { stroke: C.ink, 'stroke-width': 3, 'stroke-linecap': 'round' });
    },
    tender(g, L, col, o) {
      const B = L * 0.48;
      const hull = `M ${-L / 2} ${-B * 0.42} L ${L * 0.15} ${-B / 2} C ${L * 0.42} ${-B / 2} ${L / 2} ${-B * 0.25} ${L / 2} 0 C ${L / 2} ${B * 0.25} ${L * 0.42} ${B / 2} ${L * 0.15} ${B / 2} L ${-L / 2} ${B * 0.42} Z`;
      A.path(g, hull, { fill: 'rgba(18,38,58,0.2)', transform: 'translate(2,4)' });
      A.path(g, hull, { fill: col || '#8A97A3', stroke: C.ink, 'stroke-width': 1.4 });
      A.path(g, hull, { fill: C.deck, transform: 'scale(0.72)' });
      A.rect(g, -L * 0.05, -B * 0.36, L * 0.1, B * 0.72, { fill: C.white, stroke: C.line });
      A.rect(g, -L / 2 - L * 0.12, -B * 0.12, L * 0.14, B * 0.24, { rx: 3, fill: C.ink });
    },
    ferry(g, L, col, o) {
      const B = L * 0.3;
      const hull = `M ${-L / 2} ${-B / 2} L ${L * 0.2} ${-B / 2} C ${L * 0.4} ${-B / 2} ${L / 2} ${-B * 0.2} ${L / 2} 0 C ${L / 2} ${B * 0.2} ${L * 0.4} ${B / 2} ${L * 0.2} ${B / 2} L ${-L / 2} ${B / 2} Z`;
      A.path(g, hull, { fill: 'rgba(18,38,58,0.22)', transform: 'translate(4,7)' });
      A.path(g, hull, { fill: C.white, stroke: C.ink, 'stroke-width': 2 });
      A.rect(g, -L * 0.42, -B * 0.38, L * 0.66, B * 0.76, { rx: 8, fill: col || C.stbd });
      A.rect(g, L * 0.12, -B * 0.3, L * 0.1, B * 0.6, { rx: 4, fill: C.ink2 });
      for (let i = 0; i < 6; i++) A.rect(g, -L * 0.38 + i * L * 0.075, -B * 0.32, L * 0.05, B * 0.1, { rx: 2, fill: 'rgba(255,255,255,0.65)' });
      for (let i = 0; i < 6; i++) A.rect(g, -L * 0.38 + i * L * 0.075, B * 0.22, L * 0.05, B * 0.1, { rx: 2, fill: 'rgba(255,255,255,0.65)' });
    }
  };
  A.DRAW = DRAW;

  /* ---------- page scope: tickers, timers, wakes ---------- */
  A.scope = function (svg) {
    const S = Object.create(A);
    S._loops = []; S._timers = []; S._boats = []; S.svg = svg;
    S.loop = function (fn) { gsap.ticker.add(fn); S._loops.push(fn); return fn; };
    S.unloop = function (fn) { gsap.ticker.remove(fn); };
    S.after = function (ms, fn) { const t = setTimeout(fn, ms); S._timers.push(t); return t; };
    /* layer that draws V-shaped wakes behind every boat with wake:true */
    S.wakes = function (layer) {
      const groups = new Map();
      const LIFE = 2.4;
      S.loop(() => {
        const now = gsap.ticker.time;
        S._boats.forEach(b => {
          if (!b.wake) return;
          let G = groups.get(b);
          if (!G) {
            G = { bands: [0, 1, 2].map(i => A.path(layer, '', { fill: 'rgba(255,255,255,' + (0.42 - i * 0.12) + ')' })), edge: A.path(layer, '', { fill: 'none', stroke: 'rgba(255,255,255,0.75)', 'stroke-width': 2, 'stroke-linecap': 'round' }) };
            groups.set(b, G);
          }
          const a = b.rotation * Math.PI / 180;
          const sx = b.x - Math.cos(a) * b.L * b.scale * 0.56, sy = b.y - Math.sin(a) * b.L * b.scale * 0.56;
          if (b._lx == null) { b._lx = sx; b._ly = sy; }
          const dist = Math.hypot(sx - b._lx, sy - b._ly);
          if (dist > 2.5) { b.trail.unshift({ x: sx, y: sy, a, t: now, v: Math.min(dist, 12) }); b._lx = sx; b._ly = sy; }
          while (b.trail.length && now - b.trail[b.trail.length - 1].t > LIFE) b.trail.pop();
          if (b.trail.length > 90) b.trail.length = 90;
          const pts = b.trail;
          const w0 = b.L * b.scale * 0.16;
          const side = (p, sgn) => {
            const age = now - p.t, w = w0 + age * b.L * b.scale * 0.22 * (0.4 + p.v / 12);
            return [p.x + Math.cos(p.a + Math.PI / 2) * w * sgn, p.y + Math.sin(p.a + Math.PI / 2) * w * sgn];
          };
          const n = pts.length;
          const cuts = [0, Math.floor(n * 0.33), Math.floor(n * 0.66), n];
          for (let k = 0; k < 3; k++) {
            const seg = pts.slice(cuts[k], Math.min(n, cuts[k + 1] + 1));
            if (seg.length < 2) { G.bands[k].setAttribute('d', ''); continue; }
            const L1 = seg.map(p => side(p, 1)), R1 = seg.map(p => side(p, -1)).reverse();
            G.bands[k].setAttribute('d', 'M' + L1.concat(R1).map(q => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' L') + 'Z');
          }
          if (n > 2) {
            const head = pts.slice(0, Math.floor(n * 0.6));
            const e1 = head.map(p => side(p, 1)), e2 = head.map(p => side(p, -1));
            G.edge.setAttribute('d', 'M' + e1.map(q => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' L') + ' M' + e2.map(q => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' L'));
          } else G.edge.setAttribute('d', '');
        });
      });
    };
    /* keep every boat's transform in sync with its tweened x/y/rotation */
    S.loop(() => S._boats.forEach(b => b.set()));
    S.dispose = function () {
      S._loops.forEach(fn => gsap.ticker.remove(fn));
      S._timers.forEach(t => clearTimeout(t));
      S._loops = []; S._timers = []; S._boats = [];
    };
    return S;
  };

  window.SR = window.SR || {};
  window.SR.art = A;
})();
