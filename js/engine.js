/* Skipper Ready: page engine.
   Chapters register themselves with SR.chapter({...}). The engine adds a cover
   page and an end page, handles locking, progress and the ?teacher switch. */
(function () {
  const SR = window.SR = window.SR || {};
  const A = SR.art;
  const KEY = 'skipperReady.v1';
  const teacher = new URLSearchParams(location.search).has('teacher');
  SR.teacher = teacher;

  SR.META = [
    { id: 1, title: "The Recreational Skipper's Ticket", short: 'The RST', blurb: 'Who needs a ticket, how the assessment works and what to bring.' },
    { id: 2, title: 'Rules and Regulations', short: 'Rules and regulations', blurb: 'Speed limits, pollution, registration, diving, water skiing and PWCs.' },
    { id: 3, title: 'Collision Avoidance', short: 'Collision avoidance', blurb: 'Lookout, safe speed, sound signals and who gives way.' },
    { id: 4, title: 'Navigation Lights', short: 'Navigation lights', blurb: 'Which lights a vessel shows at night, and what they tell you.' },
    { id: 5, title: 'IALA Buoyage', short: 'IALA buoyage', blurb: 'Lateral, cardinal and other marks, light rhythms, leads and sectored lights.' },
    { id: 6, title: 'Maintenance', short: 'Maintenance', blurb: 'Keeping the motor, fuel, batteries and hull reliable.' },
    { id: 7, title: 'Safety Equipment', short: 'Safety equipment', blurb: 'Lifejackets, flares, beacons, radios, extinguishers and anchors.' },
    { id: 8, title: 'Safe Operations', short: 'Safe operations', blurb: 'Trip planning, fuel, stability, weather and tides.' },
    { id: 9, title: 'Emergencies', short: 'Emergencies', blurb: 'Capsize, grounding, breakdown, fire and hypothermia.' },
    { id: 10, title: 'Practical Assessment', short: 'Practical assessment', blurb: 'The 11 practical tasks, step by step.' },
    { id: 11, title: 'Appendices', short: 'Appendices', blurb: 'Shipboard directions, glossary and acronyms.' },
    { id: 12, title: 'Practice Theory Test', short: 'Practice test', blurb: 'A 40-question practice test. Get 34 right to pass.' }
  ];
  SR.chapters = {};
  SR.chapter = function (def) { SR.chapters[def.id] = def; };

  /* ---------- storage ---------- */
  let store = {};
  try { store = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { store = {}; }
  store.ch = store.ch || {};
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { } };
  const chState = id => (store.ch[id] = store.ch[id] || { max: 0, done: false, at: 0 });
  const has = id => !!SR.chapters[id];
  const unlocked = id => has(id) && (teacher || id === 1 || chState(id - 1).done);

  /* ---------- helpers ---------- */
  const $ = (h) => { const t = document.createElement('template'); t.innerHTML = h.trim(); return t.content.firstChild; };
  const ICON = {
    anchor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2.5"/><path d="M12 7.5V21M7 11h10M4 14c0 4 3.6 7 8 7s8-3 8-7"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M13 6l6 6-6 6"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H6M11 6l-6 6 6 6"/></svg>',
    replay: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 4v5h5"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.5.9l12-7.5a1 1 0 0 0 0-1.8l-12-7.5A1 1 0 0 0 7 4.5z"/></svg>'
  };
  SR.ICON = ICON;
  const shuffle = arr => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  SR.reduce = reduce;

  let scope = null, current = null;
  function teardown() {
    if (scope) { scope.dispose(); scope = null; }
    if (current && current.ctx) current.ctx.revert();
    if (current && current.tl) current.tl.kill();
    current = null;
    // every tween in the app belongs to the page on screen, so clear them all
    gsap.globalTimeline.clear();
  }
  function stageSvg(stage) {
    const svg = A.el('svg', { viewBox: '0 0 800 600', preserveAspectRatio: 'xMidYMid meet', role: 'img' });
    stage.appendChild(svg);
    return svg;
  }

  /* ---------- routing ---------- */
  function route() {
    const h = location.hash.replace(/^#\/?/, '');
    const m = h.match(/^c\/(\d+)(?:\/(\d+))?/);
    teardown();
    if (m && unlocked(+m[1])) renderPage(+m[1], m[2] != null ? +m[2] : chState(+m[1]).at || 0);
    else renderHome();
    window.scrollTo(0, 0);
  }
  SR.go = (ch, i) => { location.hash = ch ? `#/c/${ch}/${i || 0}` : '#/'; };

  /* =================================================================
     HOME: a nautical chart with one waypoint per chapter
     ================================================================= */
  function renderHome() {
    const app = document.getElementById('app');
    app.innerHTML = '';
    const wrap = $('<div class="home-wrap"></div>');
    app.appendChild(wrap);
    const portrait = window.innerWidth < 760 || window.innerHeight > window.innerWidth * 1.15;
    const W = portrait ? 600 : 1200, H = portrait ? 1180 : 760;
    const svg = A.el('svg', { viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: portrait ? 'xMidYMin meet' : 'xMidYMid slice', role: 'img', 'aria-label': 'Course chart' }, wrap);
    wrap.querySelector('svg').style.height = portrait ? 'auto' : '100vh';
    scope = A.scope(svg);
    const S = scope;

    const pts = portrait
      ? [[140, 300], [320, 345], [455, 430], [300, 505], [135, 585], [270, 665], [440, 735], [330, 820], [150, 885], [250, 975], [430, 1040], [300, 1120]]
      : [[150, 175], [320, 128], [490, 178], [650, 120], [790, 200], [700, 330], [520, 300], [345, 360], [190, 430], [300, 560], [500, 625], [700, 575]];

    // sea
    const sid = A.uid('hs');
    const lg = A.el('radialGradient', { id: sid, cx: 0.35, cy: 0.45, r: 0.9 }, A.defs(svg));
    A.el('stop', { offset: 0, 'stop-color': '#F7F2E7' }, lg);
    A.el('stop', { offset: 1, 'stop-color': '#E6DECB' }, lg);
    A.rect(svg, 0, 0, W, H, { fill: `url(#${sid})` });
    // graticule
    const gr = A.g(svg, { stroke: '#D9CFB8', 'stroke-width': 1 });
    for (let x = 0; x <= W; x += 100) A.line(gr, x, 0, x, H);
    for (let y = 0; y <= H; y += 100) A.line(gr, 0, y, W, y);
    // depth contours
    const ct = A.g(svg, { fill: 'none', stroke: '#9DBFC6', 'stroke-width': 1.4, 'stroke-dasharray': '2 6', 'stroke-linecap': 'round', opacity: 0.9 });
    const coastX = portrait ? 520 : 935;
    for (let k = 1; k <= 4; k++) {
      let d = '';
      for (let y = -20; y <= H + 40; y += 40) {
        const x = coastX - k * (portrait ? 34 : 62) + Math.sin(y / 90 + k) * 18 + Math.sin(y / 37) * 6;
        d += (d ? ' L ' : 'M ') + x.toFixed(1) + ' ' + y;
      }
      A.path(ct, d);
    }
    // soundings
    const rnd = A.rng(11);
    const snd = A.g(svg, { opacity: 0.55 });
    for (let i = 0; i < (portrait ? 46 : 70); i++) {
      const x = 30 + rnd() * (coastX - 60), y = 30 + rnd() * (H - 60);
      if (pts.some(p => Math.abs(p[0] - x) < 110 && y > p[1] - 40 && y < p[1] + 80)) continue;
      if (!portrait && x > 800 && y > 440) continue;
      const depth = Math.round(4 + (coastX - x) / (portrait ? 14 : 22) + rnd() * 6);
      A.text(snd, x, y, String(depth), { font: 'body', size: 12, fill: '#6E8C97', italic: true, anchor: 'middle' });
    }
    // coast (WA coast: sea to the west, land to the east)
    let cd = `M ${W + 10} -10 L ${coastX + 20} -10`;
    for (let y = 0; y <= H + 20; y += 10) {
      const x = coastX + Math.sin(y / 70) * 14 + Math.sin(y / 31 + 1) * 6 + Math.sin(y / 13) * 1.5;
      cd += ` L ${x.toFixed(1)} ${y}`;
    }
    cd += ` L ${W + 10} ${H + 10} Z`;
    A.path(svg, cd, { fill: '#E7DBB9', stroke: '#fff', 'stroke-width': 9, 'stroke-linejoin': 'round' });
    A.path(svg, cd, { fill: '#DCCFAA', stroke: '#BDAE86', 'stroke-width': 1.5, transform: 'translate(10,0)' });
    const hatch = A.g(svg, { stroke: '#CBBC93', 'stroke-width': 1 });
    for (let y = 20; y < H; y += 14) A.line(hatch, coastX + 40, y, W, y);
    // island
    if (!portrait) {
      A.path(svg, 'M 560 470 q 30 -20 70 -8 q 22 10 12 26 q -30 18 -70 10 q -24 -8 -12 -28 z', { fill: '#E7DBB9', stroke: '#fff', 'stroke-width': 6 });
      A.path(svg, 'M 566 474 q 28 -17 62 -6 q 18 9 9 21 q -26 15 -62 8 q -20 -7 -9 -23 z', { fill: '#DCCFAA' });
      A.text(svg, 600, 520, 'ISLAND', { size: 13, fill: '#9C8E6A', anchor: 'middle', ls: '0.3em' });
    }
    // compass rose
    const rose = A.g(svg, { transform: portrait ? 'translate(96,1060)' : 'translate(96,650)', opacity: 0.85 });
    A.circle(rose, 0, 0, 62, { fill: 'none', stroke: '#B9AE93', 'stroke-width': 1.2 });
    A.circle(rose, 0, 0, 54, { fill: 'none', stroke: '#B9AE93', 'stroke-width': 0.8 });
    for (let a = 0; a < 360; a += 10) {
      const r1 = a % 90 === 0 ? 44 : a % 30 === 0 ? 48 : 51, t = a * Math.PI / 180;
      A.line(rose, Math.sin(t) * r1, -Math.cos(t) * r1, Math.sin(t) * 54, -Math.cos(t) * 54, { stroke: '#B9AE93', 'stroke-width': 1 });
    }
    [[0, C('ink')], [90, '#7C8C9A'], [180, '#7C8C9A'], [270, '#7C8C9A']].forEach(([a, col]) => {
      const g = A.g(rose, { transform: `rotate(${a})` });
      A.path(g, 'M 0 -42 L 7 0 L 0 0 Z', { fill: col });
      A.path(g, 'M 0 -42 L -7 0 L 0 0 Z', { fill: '#fff', stroke: col, 'stroke-width': 1 });
    });
    A.text(rose, 0, -68, 'N', { size: 18, weight: 700, anchor: 'middle', fill: C('ink') });

    // title cartouche
    const tc = A.g(svg, { transform: portrait ? 'translate(40,46)' : 'translate(820,470)' });
    const tw = portrait ? 520 : 340;
    A.rect(tc, 5, 7, tw, 150, { rx: 4, fill: 'rgba(18,38,58,0.12)' });
    A.rect(tc, 0, 0, tw, 150, { rx: 4, fill: C('white'), stroke: C('ink'), 'stroke-width': 2 });
    A.rect(tc, 7, 7, tw - 14, 136, { rx: 2, fill: 'none', stroke: C('ink'), 'stroke-width': 0.8 });
    A.text(tc, tw / 2, 40, "WA RECREATIONAL SKIPPER'S TICKET", { size: 15, weight: 700, anchor: 'middle', ls: '0.18em', fill: C('port') });
    A.text(tc, tw / 2, 98, 'Skipper Ready', { size: 60, weight: 700, anchor: 'middle', fill: C('ink') });
    A.text(tc, tw / 2, 128, 'Tap a waypoint to start a chapter', { font: 'body', size: 15, anchor: 'middle', fill: C('ink2') });

    // voyage line
    const seg = (p0, p1, p2, p3) => {
      const t = 0.5;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6 / t * 0.5, p1[1] + (p2[1] - p0[1]) / 6 / t * 0.5];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6 / t * 0.5, p2[1] - (p3[1] - p1[1]) / 6 / t * 0.5];
      return `C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`;
    };
    const P = i => pts[Math.max(0, Math.min(pts.length - 1, i))];
    let firstOpen = SR.META.findIndex(m => !chState(m.id).done);
    if (firstOpen < 0) firstOpen = pts.length - 1;
    const lineG = A.g(svg);
    for (let i = 0; i < pts.length - 1; i++) {
      const d = `M ${P(i)[0]} ${P(i)[1]} ` + seg(P(i - 1), P(i), P(i + 1), P(i + 2));
      const done = i < firstOpen;
      A.path(lineG, d, { fill: 'none', stroke: done ? C('ink') : '#8C9AA6', 'stroke-width': done ? 3 : 2.2, 'stroke-dasharray': done ? null : '3 8', 'stroke-linecap': 'round' });
    }

    // waypoints
    const wpG = A.g(svg);
    SR.META.forEach((m, i) => {
      const [x, y] = pts[i];
      const st = chState(m.id), open = unlocked(m.id), live = has(m.id);
      const g = A.g(wpG, { class: 'wp' + (open ? '' : ' locked'), tabindex: 0, role: 'button', 'aria-label': `Chapter ${m.id}: ${m.title}` + (open ? '' : ' (locked)') });
      const isTest = m.id === 12;
      A.circle(g, x + 2, y + 4, 23, { fill: 'rgba(18,38,58,0.15)' });
      A.circle(g, x, y, 23, { class: 'wp-ring', fill: st.done ? C('ink') : C('white'), stroke: open ? C('ink') : '#9AA6B1', 'stroke-width': 3, 'stroke-dasharray': open ? null : '4 4' });
      if (st.done) A.path(g, `M ${x - 8} ${y} L ${x - 2} ${y + 7} L ${x + 9} ${y - 7}`, { fill: 'none', stroke: C('white'), 'stroke-width': 3.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
      else A.text(g, x, y + 8, isTest ? '✱' : String(m.id), { size: 24, weight: 700, anchor: 'middle', fill: open ? C('ink') : '#9AA6B1' });
      const right = portrait ? x < 380 : true;
      const lx = right ? x + 34 : x - 34, ly = portrait ? y + 7 : y + 46;
      const lab = A.text(g, portrait ? lx : x, ly, m.short, { size: 21, weight: 700, anchor: portrait ? (right ? 'start' : 'end') : 'middle', fill: open ? C('ink') : '#8C9AA6' });
      if (!live) A.text(g, portrait ? lx : x, ly + 18, 'Coming soon', { font: 'body', size: 12, anchor: portrait ? (right ? 'start' : 'end') : 'middle', fill: '#8C9AA6' });
      else if (open && !st.done && st.max > 0) {
        const tot = SR.chapters[m.id].pages.length + 2;
        A.text(g, portrait ? lx : x, ly + 18, `${Math.min(100, Math.round(st.max / (tot - 1) * 100))}% done`, { font: 'body', size: 12, anchor: portrait ? (right ? 'start' : 'end') : 'middle', fill: C('ink3') });
      }
      const pick = () => showPopup(m);
      g.addEventListener('click', pick);
      g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
    });
    // boat at the current waypoint
    const cur = Math.min(firstOpen, pts.length - 1);
    const [bx, by] = pts[cur];
    const nx = P(cur + 1), ang = Math.atan2(nx[1] - by, nx[0] - bx) * 180 / Math.PI;
    const ring = A.circle(svg, bx, by, 30, { fill: 'none', stroke: C('port'), 'stroke-width': 3 });
    gsap.fromTo(ring, { attr: { r: 26 }, opacity: 0.9 }, { attr: { r: 46 }, opacity: 0, duration: 1.8, repeat: -1, ease: 'sine.out' });
    const bl = A.g(svg);
    const boat = S.boat(bl, { x: bx - Math.cos(ang * Math.PI / 180) * 52, y: by - Math.sin(ang * Math.PI / 180) * 52, r: ang, len: 46, color: C('port'), wake: false });
    gsap.to(boat, { y: '+=3', rotation: '+=3', duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });

    // popup
    const pop = $('<div class="popup" role="dialog" aria-live="polite"></div>');
    wrap.appendChild(pop);
    function showPopup(m) {
      const live = has(m.id), open = unlocked(m.id), st = chState(m.id);
      let btn = '';
      if (!live) btn = '<span style="color:var(--ink-3);font-size:15px">This chapter is still being built.</span>';
      else if (!open) btn = `<span style="color:var(--ink-3);font-size:15px">Finish chapter ${m.id - 1} to unlock this one.</span>`;
      else btn = `<button class="btn next go">${st.done ? 'Review' : st.max > 0 ? 'Continue' : 'Start'} ${ICON.next}</button>`;
      const n = live ? SR.chapters[m.id].pages.length : 0;
      pop.innerHTML = `<div class="num">${m.id === 12 ? 'Final check' : 'Chapter ' + m.id}</div><h2>${m.title}</h2><p>${m.blurb}${live ? ` <span style="color:var(--ink-3)">· ${n} pages</span>` : ''}</p><div class="row"><button class="x">Close</button>${btn}</div>`;
      pop.classList.add('show');
      pop.querySelector('.x').onclick = () => pop.classList.remove('show');
      const go = pop.querySelector('.go');
      if (go) { go.onclick = () => SR.go(m.id, st.done ? 0 : st.at || 0); go.focus(); }
    }
    // reset + teacher
    const rs = $('<button class="reset">Reset progress</button>');
    let armed = false;
    rs.onclick = () => {
      if (!armed) { armed = true; rs.textContent = 'Tap again to clear all progress'; setTimeout(() => { armed = false; rs.textContent = 'Reset progress'; }, 3500); return; }
      store = { ch: {} }; save(); route();
    };
    wrap.appendChild(rs);
    if (teacher) wrap.appendChild($('<div class="teacher-badge" style="position:absolute;left:14px;top:14px;z-index:3">Teacher mode</div>'));
  }
  function C(k) { return A.C[k]; }

  /* =================================================================
     PAGES
     ================================================================= */
  function pagesOf(ch) {
    const def = SR.chapters[ch];
    if (!def._all) def._all = [{ type: 'cover' }].concat(def.pages, [{ type: 'end' }]);
    return def._all;
  }

  function renderPage(ch, i) {
    const def = SR.chapters[ch], meta = SR.META[ch - 1];
    const pages = pagesOf(ch);
    const st = chState(ch);
    if (!teacher && i > st.max) i = st.max;
    i = Math.max(0, Math.min(pages.length - 1, i));
    st.at = i; save();
    const p = pages[i];
    const app = document.getElementById('app');
    app.innerHTML = '';
    // bar
    const bar = $(`<header class="bar"><button class="home" aria-label="Back to the chart">${ICON.anchor}<span>Chart</span></button><div class="where"><b>${ch === 12 ? '✱' : ch}</b>${meta.title}</div>${teacher ? '<span class="teacher-badge">Teacher</span>' : ''}<div class="prog"><i></i></div></header>`);
    bar.querySelector('.home').onclick = () => SR.go();
    app.appendChild(bar);
    requestAnimationFrame(() => bar.querySelector('.prog i').style.width = (i / (pages.length - 1) * 100) + '%');

    const main = $('<main class="page"></main>');
    const stage = $('<section class="stage" aria-hidden="false"></section>');
    const card = $('<section class="card"></section>');
    main.appendChild(stage); main.appendChild(card);
    app.appendChild(main);
    const svg = stageSvg(stage);
    scope = A.scope(svg);
    const S = scope;
    current = { ch, i, p };

    const kinds = { learn: 'Learn', watch: 'Watch', try: 'Try it', check: 'Quick check', recap: 'Recap', review: 'Workbook question', cover: 'Chapter ' + ch, end: 'Chapter complete' };
    let kicker = kinds[p.type] || '';
    if (p.type === 'review') kicker = `Workbook question ${p.n} of ${p.of}`;
    if (p.type === 'recap') kicker = `Recap ${p.n} of ${p.of}`;
    if (p.kicker) kicker = p.kicker;
    const kclass = { learn: '', watch: 'watch', try: 'try', check: 'check', recap: 'check', review: 'review' }[p.type] || '';
    card.appendChild($(`<div class="kicker ${kclass}">${kicker}</div>`));

    let title = p.title || '';
    if (p.type === 'cover') title = def.title || meta.title;
    if (p.type === 'end') title = 'Nice work, skipper.';
    if (title) card.appendChild($(`<h1>${title}</h1>`));
    const body = $('<div class="body"></div>');
    card.appendChild(body);
    const task = $('<div class="task"></div>');
    card.appendChild(task);
    card.appendChild($('<div class="spacer"></div>'));
    const nav = $(`<nav class="nav"><button class="btn back">${ICON.back} Back</button><span class="hint-lock"></span><button class="btn next">Next ${ICON.next}</button></nav>`);
    card.appendChild(nav);
    const back = nav.querySelector('.back'), next = nav.querySelector('.next'), hint = nav.querySelector('.hint-lock');
    if (i === 0) back.hidden = true;
    back.onclick = () => SR.go(ch, i - 1);

    let complete = false;
    const setDone = () => {
      complete = true;
      if (st.max < i + 1) { st.max = Math.min(i + 1, pages.length - 1); save(); }
      next.disabled = false; hint.textContent = '';
    };
    const lock = msg => { if (teacher || i < st.max) { next.disabled = false; return; } next.disabled = true; hint.textContent = msg; };
    next.onclick = () => { if (!next.disabled) SR.go(ch, i + 1); };

    if (p.type === 'cover') {
      next.innerHTML = `Start ${ICON.next}`;
      const qs = def.pages.filter(x => x.type === 'review').length;
      body.innerHTML = `<p>${def.intro || meta.blurb}</p><div class="cover-meta"><span>${def.pages.length} pages</span><span>About ${Math.max(10, Math.round(def.pages.length * 1.3 / 5) * 5)} minutes</span>${qs ? `<span>${qs} workbook questions at the end</span>` : ''}</div>`;
      if (def.cover) def.cover(svg, S); else coverArt(svg, S, ch);
      setDone();
    } else if (p.type === 'end') {
      st.done = true; save();
      body.innerHTML = `<p>You've finished <b>${meta.title}</b>. Your progress is saved on this device.</p>`;
      const nextCh = SR.META[ch] && has(ch + 1) ? ch + 1 : null;
      next.innerHTML = nextCh ? `Chapter ${nextCh} ${ICON.next}` : `Back to the chart ${ICON.next}`;
      next.onclick = () => nextCh ? SR.go(nextCh, 0) : SR.go();
      endArt(svg, S, ch);
      setDone();
    } else {
      if (p.html) body.innerHTML = p.html;
      if (p.type === 'learn') {
        if (p.art) p.art(svg, S); else A.paperBg(svg);
        if (p.night) stage.classList.add('night');
        setDone();
      } else if (p.type === 'watch') {
        if (p.night) stage.classList.add('night');
        const tl = p.anim(svg, S);
        current.tl = tl;
        tl.pause(0);
        const ctrl = $(`<div class="ctrl"><button class="rp" aria-label="Replay">${ICON.replay}</button><button class="pp" aria-label="Pause">${ICON.pause}</button></div>`);
        stage.appendChild(ctrl);
        const pp = ctrl.querySelector('.pp');
        const sync = () => { pp.innerHTML = tl.paused() || tl.progress() === 1 ? ICON.play : ICON.pause; pp.setAttribute('aria-label', tl.paused() ? 'Play' : 'Pause'); };
        pp.onclick = () => { if (tl.progress() === 1) tl.restart(); else tl.paused(!tl.paused()); sync(); };
        ctrl.querySelector('.rp').onclick = () => { tl.restart(); sync(); };
        tl.eventCallback('onComplete', () => { setDone(); sync(); });
        lock('Watch to the end to go on');
        if (reduce) { tl.progress(1); setDone(); sync(); }
        else S.after(450, () => { tl.play(); sync(); });
      } else if (p.type === 'try') {
        if (p.night) stage.classList.add('night');
        lock(p.lockMsg || 'Finish the activity to go on');
        const fb = $('<div class="fb"></div>');
        const api = {
          task, svg, stage,
          say(html, tone) { fb.className = 'fb show ' + (tone || 'info'); fb.innerHTML = html; },
          hush() { fb.className = 'fb'; },
          done(html) { if (html) api.say(html, 'good'); setDone(); },
          get complete() { return complete; }
        };
        p.build(svg, S, api);
        task.appendChild(fb);
      } else if (p.type === 'check' || p.type === 'recap' || p.type === 'review') {
        if (p.art) p.art(svg, S); else qArt(svg, S, p);
        lock('Pick the right answer to go on');
        buildQuestion(p, task, setDone);
      }
      if (teacher || i < st.max) { next.disabled = false; hint.textContent = ''; }
    }

    // entrance
    if (!reduce) {
      gsap.from(card.children, { y: 12, opacity: 0, duration: 0.45, stagger: 0.05, ease: 'power2.out', clearProps: 'all' });
      gsap.from(stage, { opacity: 0, duration: 0.5, ease: 'power1.out', clearProps: 'opacity' });
    }
    document.onkeydown = e => {
      if (e.target.closest && e.target.closest('input,textarea')) return;
      if (e.key === 'ArrowRight' && !next.disabled) next.click();
      if (e.key === 'ArrowLeft' && i > 0) back.click();
    };
  }

  /* ---------- multiple choice ---------- */
  function buildQuestion(p, task, setDone) {
    if (p.type === 'review') task.appendChild($('<div class="wbtag">RST Workbook self-test</div>'));
    task.appendChild($(`<p class="q">${p.q}</p>`));
    const opts = p.opts.map((t, k) => ({ t, k }));
    const ans = typeof p.a === 'string' ? 'ABCD'.indexOf(p.a) : p.a;
    const fixed = o => /^(all|none) of the above|^all the above/i.test(o.t);
    const free = shuffle(opts.filter(o => !fixed(o))), stay = opts.filter(fixed);
    const order = free.concat(stay);
    const box = $('<div class="opts" role="group"></div>');
    task.appendChild(box);
    const fb = $('<div class="fb" aria-live="polite"></div>');
    task.appendChild(fb);
    let solved = false;
    order.forEach(o => {
      const b = $(`<button class="opt"><span class="dot"></span><span>${o.t}</span></button>`);
      b.onclick = () => {
        if (solved) return;
        if (o.k === ans) {
          solved = true;
          b.classList.add('right');
          box.querySelectorAll('.opt').forEach(x => x.disabled = true);
          fb.className = 'fb show good';
          fb.innerHTML = '<b>Correct.</b> ' + (p.why || '');
          setDone();
        } else {
          b.classList.add('wrong'); b.disabled = true;
          b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake');
          fb.className = 'fb show bad';
          const h = p.hints && p.hints[o.k];
          fb.innerHTML = '<b>Not quite.</b> ' + (h || p.hint || 'Have another look and try again.');
        }
      };
      box.appendChild(b);
    });
  }

  /* ---------- default art ---------- */
  function qArt(svg, S, p) {
    A.paperBg(svg);
    const g = A.g(svg);
    if (p.type === 'review') {
      // open workbook
      A.path(g, 'M 400 160 Q 300 130 190 150 L 190 470 Q 300 450 400 480 Z', { fill: C('white'), stroke: C('line'), 'stroke-width': 2 });
      A.path(g, 'M 400 160 Q 500 130 610 150 L 610 470 Q 500 450 400 480 Z', { fill: C('white'), stroke: C('line'), 'stroke-width': 2 });
      A.path(g, 'M 400 160 L 400 480', { stroke: C('line'), 'stroke-width': 2 });
      for (let k = 0; k < 7; k++) { A.rect(g, 225, 220 + k * 30, 140 - (k % 3) * 25, 7, { rx: 3, fill: C('paper3') }); }
      A.text(g, 505, 300, 'Q' + p.n, { size: 110, weight: 700, anchor: 'middle', fill: C('ink') });
      A.text(g, 505, 360, 'SELF-TEST', { size: 22, weight: 700, anchor: 'middle', fill: C('port'), ls: '0.2em' });
      gsap.from(g, { y: 16, opacity: 0, duration: 0.6, ease: 'power2.out' });
    } else {
      A.circle(g, 403, 306, 120, { fill: 'rgba(18,38,58,0.12)' });
      A.circle(g, 400, 300, 120, { fill: C('buoy') });
      A.text(g, 400, 350, '?', { size: 170, weight: 700, anchor: 'middle', fill: C('ink') });
      gsap.from(g, { scale: 0.85, svgOrigin: '400 300', opacity: 0, duration: 0.6, ease: 'back.out(1.6)' });
    }
  }
  function coverArt(svg, S, ch) {
    S.seaBg(svg);
    A.text(svg, 400, 340, String(ch), { size: 200, weight: 700, anchor: 'middle', fill: 'rgba(255,255,255,0.7)' });
  }
  function endArt(svg, S, ch) {
    A.paperBg(svg);
    const g = A.g(svg, { transform: 'translate(400,290)' });
    const rays = A.g(g);
    for (let k = 0; k < 24; k++) A.path(rays, 'M -8 -150 L 0 -175 L 8 -150 Z', { fill: k % 2 ? C('buoy') : C('port'), transform: `rotate(${k * 15})` });
    A.circle(g, 4, 8, 130, { fill: 'rgba(18,38,58,0.15)' });
    A.circle(g, 0, 0, 130, { fill: C('ink') });
    A.circle(g, 0, 0, 114, { fill: 'none', stroke: C('buoy'), 'stroke-width': 3, 'stroke-dasharray': '2 7', 'stroke-linecap': 'round' });
    A.text(g, 0, -42, 'CHAPTER', { size: 24, weight: 700, anchor: 'middle', fill: C('buoy'), ls: '0.22em' });
    A.text(g, 0, 50, String(ch), { size: 110, weight: 700, anchor: 'middle', fill: C('white') });
    A.text(g, 0, 88, 'COMPLETE', { size: 22, weight: 700, anchor: 'middle', fill: C('buoy'), ls: '0.22em' });
    if (!reduce) {
      gsap.from(g, { scale: 0.6, svgOrigin: '400 290', opacity: 0, duration: 0.8, ease: 'back.out(1.7)' });
      gsap.to(rays, { rotation: 360, duration: 60, repeat: -1, ease: 'none', svgOrigin: '400 290' });
    }
  }

  SR.start = function () {
    gsap.registerPlugin(MotionPathPlugin, Draggable, DrawSVGPlugin);
    window.addEventListener('hashchange', route);
    let resizeT;
    window.addEventListener('resize', () => { if (!location.hash.startsWith('#/c/')) { clearTimeout(resizeT); resizeT = setTimeout(route, 250); } });
    const go = () => route();
    if (document.fonts && document.fonts.ready) Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1500))]).then(go);
    else go();
  };
})();
