/* Chapter 1: The Recreational Skipper's Ticket */
(function () {
  const A = SR.art, C = A.C;

  /* simplified outline of Australia (lon, lat) */
  const AUS = [[113.6, -22.0], [114.2, -26.0], [115.0, -29.5], [115.7, -32.0], [115.0, -33.6], [115.1, -34.4], [117.9, -35.1], [121.9, -33.9], [124.0, -33.0], [126.0, -32.3], [129.0, -31.6], [131.5, -31.5], [134.0, -32.8], [135.6, -34.8], [137.6, -33.0], [138.0, -34.8], [139.5, -35.6], [140.8, -38.0], [143.5, -38.8], [145.0, -38.4], [146.4, -39.1], [148.0, -37.8], [150.0, -37.5], [150.9, -34.4], [151.3, -33.8], [152.5, -32.0], [153.6, -28.6], [153.1, -26.5], [152.9, -25.3], [150.8, -23.0], [149.0, -21.0], [146.8, -19.2], [145.4, -16.2], [145.3, -14.9], [143.6, -14.0], [142.5, -10.7], [141.6, -12.6], [141.5, -15.5], [141.0, -17.0], [139.3, -17.4], [137.8, -16.2], [135.8, -15.0], [136.9, -12.3], [135.0, -12.2], [132.6, -11.3], [130.9, -12.4], [130.1, -13.4], [129.6, -14.9], [129.0, -14.95], [128.1, -15.0], [126.8, -13.8], [125.0, -15.0], [123.6, -16.2], [122.2, -18.0], [121.0, -19.6], [118.8, -20.3], [116.7, -20.6], [114.6, -21.8]];
  const TAS = [[144.7, -40.7], [148.3, -40.9], [148.0, -43.2], [146.0, -43.6], [145.2, -42.3]];
  function ausMap(parent, ox, oy, k) {
    const pr = ([lo, la]) => [(lo - 112) * k + ox, (-la - 10) * k + oy];
    const toD = arr => 'M ' + arr.map(p => pr(p).map(v => v.toFixed(1)).join(' ')).join(' L ') + ' Z';
    const g = A.g(parent);
    A.path(g, toD(AUS), { fill: 'rgba(18,38,58,0.14)', transform: 'translate(4,6)' });
    A.path(g, toD(AUS), { fill: C.land, stroke: C.white, 'stroke-width': 3, 'stroke-linejoin': 'round' });
    A.path(g, toD(TAS), { fill: C.land, stroke: C.white, 'stroke-width': 3, 'stroke-linejoin': 'round' });
    const iB = AUS.findIndex(p => p[0] === 129.0 && p[1] === -31.6), iT = AUS.findIndex(p => p[0] === 129.0 && p[1] === -14.95);
    const wa = AUS.slice(0, iB + 1).concat(AUS.slice(iT));
    const waP = A.path(g, toD(wa), { fill: C.port, stroke: C.white, 'stroke-width': 3, 'stroke-linejoin': 'round' });
    g.wa = waP; g.pr = pr;
    return g;
  }

  /* an RST card, drawn generically (no agency branding) */
  function rstCard(parent, x, y, s) {
    const g = A.g(parent, { transform: `translate(${x},${y}) scale(${s || 1})` });
    A.rect(g, 8, 12, 360, 228, { rx: 18, fill: 'rgba(18,38,58,0.2)' });
    A.rect(g, 0, 0, 360, 228, { rx: 18, fill: C.white, stroke: C.line, 'stroke-width': 1.5 });
    A.path(g, 'M 0 18 Q 0 0 18 0 L 342 0 Q 360 0 360 18 L 360 58 L 0 58 Z', { fill: C.deep });
    A.text(g, 22, 38, "RECREATIONAL SKIPPER'S TICKET", { size: 20, weight: 700, fill: C.white, ls: '0.06em' });
    // wave stripe
    A.path(g, 'M 0 58 Q 60 70 120 58 T 240 58 T 360 58 L 360 66 Q 300 78 240 66 T 120 66 T 0 66 Z', { fill: C.sea3, opacity: 0.6 });
    // photo
    A.rect(g, 22, 82, 92, 116, { rx: 8, fill: C.sea1 });
    A.circle(g, 68, 122, 20, { fill: C.sea3 });
    A.path(g, 'M 36 198 Q 40 156 68 152 Q 96 156 100 198 Z', { fill: C.sea3 });
    // fields
    [0, 1, 2, 3].forEach(k => {
      A.rect(g, 134, 88 + k * 30, 60, 7, { rx: 3, fill: C.paper3 });
      A.rect(g, 134, 100 + k * 30, k === 1 ? 120 : 190, 9, { rx: 4, fill: C.ink2, opacity: 0.75 });
    });
    // little boat emblem
    const e = A.g(g, { transform: 'translate(318,196)' });
    A.circle(e, 0, 0, 22, { fill: C.buoy });
    A.path(e, 'M -13 2 L 13 2 L 8 9 L -9 9 Z', { fill: C.ink });
    A.path(e, 'M -2 2 L -2 -12 L 9 0 Z', { fill: C.ink });
    return g;
  }

  /* side-view sea scene used by a few pages */
  function sideScene(svg, S, o) {
    o = o || {};
    const sky = A.uid('sky');
    const lg = A.el('linearGradient', { id: sky, x1: 0, y1: 0, x2: 0, y2: 1 }, A.defs(svg));
    A.el('stop', { offset: 0, 'stop-color': o.top || '#E9F1F0' }, lg);
    A.el('stop', { offset: 1, 'stop-color': o.bottom || '#F6F0E2' }, lg);
    const bg = A.rect(svg, 0, 0, 800, 600, { fill: `url(#${sky})` });
    return bg;
  }

  SR.chapter({
    id: 1,
    title: "The Recreational Skipper's Ticket",
    intro: "Start here: who needs a Recreational Skipper's Ticket, how the theory and practical assessments work, and what you need to bring on the day.",
    cover(svg, S) {
      S.seaBg(svg);
      A.land(svg, 'M 560 -20 C 600 60 640 90 700 120 C 760 150 790 210 830 230 L 830 -20 Z');
      A.tree(svg, 720, 60, 20); A.tree(svg, 770, 120, 16); A.tree(svg, 650, 30, 15);
      A.jetty(svg, 610, 96, 14, 120);
      const mb = S.boat(svg, { x: 655, y: 170, r: 90, len: 64, color: C.stbd, wake: false });
      gsap.to(mb, { rotation: 92, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      [[180, 90], [240, 120], [300, 80]].forEach(([x, y]) => A.mooringBuoy(svg, x, y));
      const wk = A.g(svg);
      S.wakes(wk);
      const b = S.boat(svg, { len: 96, color: C.port });
      gsap.to(b, { motionPath: { path: 'M 90 470 C 200 330 420 250 600 320 C 760 380 700 540 470 520 C 300 505 10 610 90 470 Z', autoRotate: true }, duration: 18, repeat: -1, ease: 'none' });
      rstCard(svg, 70, 170, 0.62);
    },
    pages: [
      /* 1 */
      {
        type: 'learn', title: "What is the RST?",
        html: `<p>The <span class="term">Recreational Skipper's Ticket (RST)</span> is WA's licence for skippering a recreational boat. It shows you have the minimum skills and knowledge to keep yourself, your passengers and other water users safe.</p>
<p>It is based on a set of skills that every Australian marine safety authority has agreed on, so it promotes the same safe habits right around the country.</p>
<p>You earn it in two parts: a <b>theory</b> test and a <b>practical</b> assessment on the water. Some people who already hold a recognised qualification can be exempt.</p>`,
        art(svg, S) {
          A.paperBg(svg);
          const card = rstCard(svg, 210, 120, 1);
          gsap.from(card, { y: '+=40', opacity: 0, rotation: -4, transformOrigin: '50% 50%', duration: 0.9, ease: 'power3.out' });
          const parts = [['THEORY', 'test', 260], ['PRACTICAL', 'assessment', 540]];
          parts.forEach(([a, b, x], k) => {
            const g = A.g(svg, { transform: `translate(${x},450)` });
            A.rect(g, -110, -46, 220, 92, { rx: 16, fill: k ? C.stbd : C.deep });
            A.text(g, 0, -4, a, { size: 34, weight: 700, anchor: 'middle', fill: C.white, ls: '0.06em' });
            A.text(g, 0, 26, b, { font: 'body', size: 18, anchor: 'middle', fill: 'rgba(255,255,255,0.85)' });
            gsap.from(g, { y: '+=30', opacity: 0, duration: 0.6, delay: 0.6 + k * 0.2, ease: 'back.out(1.6)' });
          });
          A.text(svg, 400, 466, '+', { size: 50, weight: 700, anchor: 'middle', fill: C.ink2 });
        }
      },
      /* 2 */
      {
        type: 'learn', title: 'Who needs one?',
        html: `<p>The person in charge of a recreational vessel with a motor <b>over 6 hp (4.5 kW)</b> must hold an RST.</p>
<p>Horsepower (hp) and kilowatts (kW) both measure how powerful a motor is. A small dinghy motor of 6 hp or less doesn't need an RST. Almost every runabout, cabin cruiser and jet ski does.</p>
<p class="note">The rule is about the motor, not the length of the boat.</p>`,
        art(svg, S) {
          A.paperBg(svg);
          const x0 = 90, x1 = 710, y = 390, max = 60;
          const X = hp => x0 + (x1 - x0) * hp / max;
          A.rect(svg, x0, y - 22, X(6) - x0, 44, { rx: 0, fill: '#CFE3D4' });
          A.rect(svg, X(6), y - 22, x1 - X(6), 44, { fill: '#F2D2CD' });
          A.rect(svg, x0, y - 22, x1 - x0, 44, { rx: 8, fill: 'none', stroke: C.ink, 'stroke-width': 2 });
          for (let h = 0; h <= max; h += 10) {
            A.line(svg, X(h), y + 22, X(h), y + 34, { stroke: C.ink, 'stroke-width': 2 });
            A.text(svg, X(h), y + 58, h + ' hp', { size: 20, anchor: 'middle', fill: C.ink2 });
          }
          A.line(svg, X(6), y - 22, X(6), y + 150, { stroke: C.port, 'stroke-width': 4 });
          A.tag(svg, X(6) + 8, y + 158, 'LIMIT: 6 hp (4.5 kW)', { fill: C.port, anchor: 'start' });
          A.text(svg, (x0 + X(6)) / 2, y + 7, 'NO', { size: 18, weight: 700, anchor: 'middle', fill: C.stbd });
          A.text(svg, (X(6) + x1) / 2, y + 8, 'RST REQUIRED', { size: 22, weight: 700, anchor: 'middle', fill: C.port, ls: '0.1em' });
          // outboard that slides along the scale
          const ob = A.g(svg);
          const og = A.g(ob, { transform: 'translate(0,0)' });
          A.rect(og, -26, -150, 52, 64, { rx: 14, fill: C.ink });
          A.rect(og, -18, -138, 36, 10, { rx: 4, fill: C.sea3 });
          A.rect(og, -7, -88, 14, 56, { fill: C.ink });
          A.path(og, 'M -16 -36 L 16 -36 L 10 -28 L -10 -28 Z', { fill: C.ink });
          const lab = A.g(ob);
          const plate = A.rect(lab, -60, -216, 120, 44, { rx: 10, fill: C.white, stroke: C.ink, 'stroke-width': 2 });
          const t = A.text(lab, 0, -186, '', { size: 26, weight: 700, anchor: 'middle' });
          const st = { hp: 2 };
          const put = () => {
            ob.setAttribute('transform', `translate(${X(st.hp)},${y - 6})`);
            t.textContent = Math.round(st.hp) + ' hp';
            const need = st.hp > 6;
            plate.setAttribute('fill', need ? '#FBE9E6' : '#E6F3EB');
            plate.setAttribute('stroke', need ? C.port : C.stbd);
          };
          put();
          gsap.timeline({ repeat: -1, repeatDelay: 0.6 })
            .to(st, { hp: 5, duration: 1.4, ease: 'power1.inOut', onUpdate: put })
            .to(st, { hp: 40, duration: 2.2, ease: 'power2.inOut', onUpdate: put, delay: 0.6 })
            .to(st, { hp: 2, duration: 1.8, ease: 'power2.inOut', onUpdate: put, delay: 1.2 });
        }
      },
      /* 3 */
      {
        type: 'learn', title: 'Skipper or driver?',
        html: `<p>The workbook uses two words carefully.</p>
<p>The <span class="term">skipper</span> is the person responsible for the safe operation of the vessel and the safety of everyone on board.</p>
<p>The <span class="term">driver</span> is the person at the helm, physically operating the controls.</p>
<p>Often they are the same person. But a learner can drive while an RST holder on board is the skipper and stays responsible.</p>`,
        art(svg, S) {
          sideScene(svg, S);
          const boat = A.g(svg);
          const hull = A.boatSide(boat, { x: 400, y: 420, len: 420, color: C.sea4 });
          A.person(hull.crew, { x: -46, y: -48, s: 1.05, side: true, color: C.ink, fwdL: 62, fwdR: 78 });
          A.person(hull.crew, { x: -128, y: -48, s: 1.1, side: true, color: C.port, vest: C.buoy, fwdL: -8, fwdR: 12 });
          A.waterSide(svg, 420);
          gsap.to(boat, { y: 4, rotation: 0.8, transformOrigin: '400px 420px', duration: 1.8, yoyo: true, repeat: -1, ease: 'sine.inOut' });
          const t1 = A.tag(svg, 250, 130, 'SKIPPER', { fill: C.port, size: 22 });
          A.text(svg, 250, 178, 'responsible for everyone', { font: 'body', size: 17, anchor: 'middle', fill: C.ink2 });
          const t2 = A.tag(svg, 540, 170, 'DRIVER', { fill: C.ink, size: 22 });
          A.text(svg, 540, 218, 'at the controls', { font: 'body', size: 17, anchor: 'middle', fill: C.ink2 });
          A.path(svg, 'M 258 190 L 272 246', { stroke: C.port, 'stroke-width': 2.5, 'stroke-dasharray': '4 5' });
          A.path(svg, 'M 520 228 L 376 262', { stroke: C.ink, 'stroke-width': 2.5, 'stroke-dasharray': '4 5' });
          gsap.from([t1, t2], { y: '-=10', opacity: 0, duration: 0.6, stagger: 0.3, delay: 0.4, ease: 'back.out(2)' });
        }
      },
      /* 4 */
      {
        type: 'try', title: 'What can you do at each age?',
        html: `<p>Age limits decide who can hold an RST and what they can do with it. Drag the slider to see what a person is allowed to do at each age.</p>`,
        build(svg, S, api) {
          A.paperBg(svg);
          const rows = [
            ['Hold an RST', 14],
            ['Skipper a boat with a motor of 6 hp or less', 10],
            ['Drive without an RST, with an RST holder supervising', 10],
            ['Skipper a boat with a motor over 6 hp', 14],
            ['Skipper at more than 8 knots', 16],
            ['Skipper between sunset and sunrise', 16],
            ['Skipper a boat engaged in towing', 17],
            ['Drive a boat towing a water skier', 17],
            ['Supervise a driver who has no RST', 18]
          ];
          const top = 74, rh = 54;
          A.text(svg, 40, 48, 'WHAT YOU CAN DO', { size: 18, weight: 700, ls: '0.14em', fill: C.ink3 });
          const ageT = A.text(svg, 760, 52, '', { size: 40, weight: 700, anchor: 'end', fill: C.port });
          const marks = rows.map(([label, min], k) => {
            const y = top + k * rh;
            const g = A.g(svg);
            A.rect(g, 30, y, 740, rh - 8, { rx: 10, fill: C.white, opacity: 0.85 });
            A.text(g, 96, y + 30, label, { font: 'body', size: 18, fill: C.ink });
            const yes = A.tick(g, 62, y + 23, 15, true), no = A.tick(g, 62, y + 23, 15, false);
            no.setAttribute('opacity', 0);
            const minT = A.text(g, 752, y + 30, min + '+', { size: 20, weight: 700, anchor: 'end', fill: C.ink3, opacity: 0 });
            return { yes, no, min, minT, g };
          });
          const ui = document.createElement('div');
          ui.innerHTML = `<label for="age" style="font-weight:700">Age</label><input id="age" class="range" type="range" min="8" max="18" step="1" value="12"><div class="status">Try at least four different ages.</div>`;
          api.task.appendChild(ui);
          const input = ui.querySelector('input'), status = ui.querySelector('.status');
          const seen = new Set();
          const group = a => a < 10 ? 0 : a < 14 ? 1 : a < 16 ? 2 : a < 17 ? 3 : a < 18 ? 4 : 5;
          const show = (age, first) => {
            ageT.textContent = age === 18 ? '18 or older' : age === 8 ? 'Under 10' : 'Age ' + age;
            marks.forEach(m => {
              const ok = age >= m.min;
              gsap.to(m.yes, { opacity: ok ? 1 : 0, scale: ok ? 1 : 0.6, transformOrigin: '62px 0px', duration: first ? 0 : 0.3, ease: 'back.out(2)' });
              gsap.to(m.no, { opacity: ok ? 0 : 0.35, duration: first ? 0 : 0.3 });
              m.minT.setAttribute('opacity', ok ? 0 : 1);
            });
            if (!first) {
              seen.add(group(age));
              if (!api.complete) status.textContent = seen.size >= 4 ? '' : `${4 - seen.size} more age group${4 - seen.size === 1 ? '' : 's'} to try.`;
              if (seen.size >= 4 && !api.complete) api.done('Notice that 14 is the first age you can hold an RST, but 16 is when the speed and night limits come off.');
            }
          };
          show(12, true);
          input.addEventListener('input', () => show(+input.value));
        }
      },
      /* 5 */
      {
        type: 'learn', title: 'Aged 14 or 15?',
        html: `<p>You can get an RST from age 14. Until you turn 16, two extra limits apply:</p>
<ul><li>you may only skipper in <b>daylight hours</b></li><li>your speed must <b>not exceed 8 knots</b></li></ul>
<p>A <span class="term">knot</span> is a speed of one nautical mile per hour, about 1.85 km/h, so 8 knots is roughly 15 km/h.</p>`,
        art(svg, S) {
          const sky = A.uid('sky');
          const lg = A.el('linearGradient', { id: sky, x1: 0, y1: 0, x2: 0, y2: 1 }, A.defs(svg));
          const s0 = A.el('stop', { offset: 0, 'stop-color': '#CFE6EC' }, lg);
          const s1 = A.el('stop', { offset: 1, 'stop-color': '#F7EFDC' }, lg);
          A.rect(svg, 0, 0, 800, 600, { fill: `url(#${sky})` });
          const sun = A.circle(svg, 120, 380, 34, { fill: C.buoy });
          const dark = A.rect(svg, 0, 0, 800, 600, { fill: C.night, opacity: 0 });
          A.waterSide(svg, 430, { top: '#8EBBC6', bottom: '#4E879B' });
          const boat = A.g(svg);
          const bs = A.boatSide(boat, { x: 520, y: 432, len: 230, color: C.port });
          A.person(bs.crew, { x: -26, y: -26, s: 0.62, side: true, color: C.ink, vest: C.orange, fwdL: 60, fwdR: 75 });
          svg.appendChild(svg.querySelector('.water-side'));
          gsap.to(boat, { y: 3, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
          const gz = A.gauge(svg, { x: 650, y: 150, r: 92, max: 40, zone: [8, 40, C.port], step: 4 });
          const lim = A.tag(svg, 650, 268, 'MAX 8 KNOTS', { fill: C.port, size: 18 });
          const label = A.tag(svg, 200, 520, 'DAYLIGHT ONLY', { fill: C.ink, size: 20 });
          const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
          tl.set(sun, { attr: { cx: 120, cy: 380 } })
            .to(sun, { duration: 6, ease: 'none', motionPath: { path: 'M 120 380 Q 300 40 480 380' } }, 0)
            .add(gz.set(8, 2.2), 0.4)
            .to(dark, { opacity: 0.62, duration: 1.4 }, 5)
            .to(label, { scale: 1.12, transformOrigin: '50% 50%', duration: 0.3, yoyo: true, repeat: 3 }, 5.2)
            .to(dark, { opacity: 0, duration: 1.2 }, 7.8);
          tl.add(gz.set(4, 1.5), 6.5);
        }
      },
      /* 6 */
      {
        type: 'check', title: 'Mia is 15 and holds an RST.',
        q: 'Which trip is Mia allowed to skipper?',
        opts: ['A morning fishing trip at 7 knots', 'An evening cruise home after dark', 'A quick run across the bay at 20 knots', 'Towing a friend on a ski tube at noon'],
        a: 0,
        why: 'At 14 and 15 you can only skipper in daylight and at 8 knots or less. Towing needs a skipper aged at least 17.',
        hints: { 1: 'Under 16, skippering is daylight only.', 2: 'Under 16, the top speed is 8 knots.', 3: 'Skippering a boat that is towing needs you to be at least 17.' },
        art(svg, S) {
          A.paperBg(svg);
          const g = A.g(svg, { transform: 'translate(400,300)' });
          A.circle(g, 4, 8, 150, { fill: 'rgba(18,38,58,0.14)' });
          A.circle(g, 0, 0, 150, { fill: C.white, stroke: C.ink, 'stroke-width': 3 });
          A.text(g, 0, 30, '15', { size: 150, weight: 700, anchor: 'middle', fill: C.ink });
          A.text(g, 0, 80, 'YEARS OLD', { size: 22, weight: 700, anchor: 'middle', fill: C.port, ls: '0.2em' });
          gsap.from(g, { scale: 0.8, svgOrigin: '400 300', opacity: 0, duration: 0.7, ease: 'back.out(1.8)' });
        }
      },
      /* 7 */
      {
        type: 'try', title: 'The theory test',
        html: `<p>The theory test has <b>40 multiple-choice questions</b> on everything in this course: rules, collision avoidance, lights, buoyage, maintenance, safety equipment, safe operations and emergencies.</p>
<p>Drag the score to see what happens next.</p>`,
        build(svg, S, api) {
          A.paperBg(svg);
          const cells = [];
          for (let k = 0; k < 40; k++) {
            const c = k % 10, r = Math.floor(k / 10);
            const x = 150 + c * 52, y = 70 + r * 58;
            cells.push(A.rect(svg, x, y, 44, 48, { rx: 8, fill: C.white, stroke: C.line, 'stroke-width': 2 }));
          }
          const scoreT = A.text(svg, 400, 360, '', { size: 64, weight: 700, anchor: 'middle', fill: C.ink });
          const plate = A.g(svg, { transform: 'translate(400,450)' });
          const pr = A.rect(plate, -300, -54, 600, 108, { rx: 18, fill: C.ink });
          const pt1 = A.text(plate, 0, -8, '', { size: 34, weight: 700, anchor: 'middle', fill: C.white });
          const pt2 = A.text(plate, 0, 30, '', { font: 'body', size: 18, anchor: 'middle', fill: 'rgba(255,255,255,0.9)' });
          const ui = document.createElement('div');
          ui.innerHTML = `<label for="sc" style="font-weight:700">Questions right</label><input id="sc" class="range" type="range" min="20" max="40" step="1" value="25"><div class="status">See all three outcomes.</div>`;
          api.task.appendChild(ui);
          const input = ui.querySelector('input'), status = ui.querySelector('.status');
          const seen = new Set();
          const show = (n, first) => {
            cells.forEach((c, k) => c.setAttribute('fill', k < n ? (n >= 34 ? C.stbd : n >= 30 ? C.buoy : C.port) : C.white));
            scoreT.textContent = n + ' / 40';
            let o;
            if (n >= 34) o = [C.stbd, 'Pass', 'Go on to the practical assessment.'];
            else if (n >= 30) o = ['#B98500', 'Not enough yet', 'You can try a different set of questions the same day.'];
            else o = [C.port, 'Try another day', 'Fewer than 30 means sitting the test again on another day.'];
            pr.setAttribute('fill', o[0]); pt1.textContent = o[1]; pt2.textContent = o[2];
            if (!first) {
              gsap.fromTo(plate, { scale: 0.96 }, { scale: 1, duration: 0.3, ease: 'back.out(3)', svgOrigin: '400 450' });
              seen.add(n >= 34 ? 2 : n >= 30 ? 1 : 0);
              if (seen.size === 3 && !api.complete) api.done('You need <b>34 or more</b> to pass. You can have at most <b>two attempts in one day</b>.');
              else if (!api.complete) status.textContent = `${3 - seen.size} outcome${3 - seen.size === 1 ? '' : 's'} left to find.`;
            }
          };
          show(25, true);
          input.addEventListener('input', () => show(+input.value));
        }
      },
      /* 8 */
      {
        type: 'learn', title: 'The practical assessment',
        html: `<p>The practical takes about <b>30 minutes</b>. You show the assessor a well-run boating trip, from preparation to tying up again. That includes a safety briefing, starting the motor, logging a voyage plan, leaving a berth, a man overboard pick-up, fixing your position, a controlled stop, berthing and logging off.</p>
<p>The assessor marks 62 criteria. You must get <b>at least 56</b> (six wrong or less). You can do one practical per day.</p>
<p>Pass both parts and you get a <b>Receipt of Completion</b>, which lets you skipper straight away. Your RST card is posted to you once the Department of Transport processes it.</p>`,
        art(svg, S) {
          A.paperBg(svg);
          const g = A.g(svg, { transform: 'translate(182,34) scale(0.94)' });
          A.rect(g, 8, 14, 460, 520, { rx: 20, fill: 'rgba(18,38,58,0.18)' });
          A.rect(g, 0, 0, 460, 520, { rx: 20, fill: '#9C7A52' });
          A.rect(g, 22, 40, 416, 460, { rx: 6, fill: C.white });
          A.rect(g, 160, -14, 140, 44, { rx: 10, fill: C.ink2 });
          A.text(g, 230, 82, 'PRACTICAL ASSESSMENT', { size: 22, weight: 700, anchor: 'middle', ls: '0.1em' });
          const bad = new Set([9, 27, 44]);
          const items = [];
          for (let k = 0; k < 62; k++) {
            const c = k % 8, r = Math.floor(k / 8);
            const x = 66 + c * 47, y = 120 + r * 46;
            A.rect(g, x - 15, y - 15, 30, 30, { rx: 6, fill: 'none', stroke: C.line, 'stroke-width': 2 });
            const t = A.tick(g, x, y, 13, !bad.has(k));
            t.setAttribute('opacity', 0);
            items.push(t);
          }
          const count = A.text(svg, 400, 588, '', { size: 26, weight: 700, anchor: 'middle', fill: C.ink });
          const st = { n: 0 };
          gsap.timeline({ repeat: -1, repeatDelay: 2.2 })
            .set(items, { opacity: 0 })
            .set(st, { n: 0 })
            .to(items, { opacity: 1, duration: 0.08, stagger: 0.07 })
            .to(st, { n: 62, duration: 62 * 0.07, ease: 'none', onUpdate: () => { const n = Math.round(st.n); const ok = n - [...bad].filter(b => b < n).length; count.textContent = `${ok} of 62 correct · need 56`; } }, '<');
        }
      },
      /* 9 */
      {
        type: 'learn', title: 'Paperwork before your assessment',
        html: `<p>Before you can be assessed you fill in an <b>RST application form</b> and show:</p>
<ul><li><b>Eyesight:</b> at least <b>6/12</b> vision in at least one eye (glasses allowed). A driver's licence or learner's permit proves this. Otherwise a doctor, nurse or optometrist signs an eyesight declaration.</li>
<li><b>Medical fitness:</b> you must tell the Department of Transport about any condition that could affect safe boating, such as seizures or fainting, heart disease, blood pressure problems, arthritis or type 1 diabetes. A doctor may need to sign a medical form.</li>
<li><b>Under 18:</b> a letter of consent signed by a parent or legal guardian.</li></ul>`,
        art(svg, S) {
          A.paperBg(svg);
          const d1 = A.doc(svg, { x: 120, y: 140, w: 200, h: 270, r: -8, title: ['RST', 'application'], band: C.deep });
          const d2 = A.doc(svg, { x: 300, y: 110, w: 200, h: 270, r: 0, title: ['Eyesight', 'declaration'], band: C.stbd, rows: 0 });
          const d3 = A.doc(svg, { x: 480, y: 140, w: 200, h: 270, r: 8, title: ['Letter of', 'consent'], band: C.port });
          // eye chart on d2
          const ec = A.g(d2, { transform: 'translate(100,120)' });
          [['E', 44], ['F P', 30], ['T O Z', 22], ['L P E D', 16]].forEach(([s, z], k) => A.text(ec, 0, k * 34, s, { font: 'body', size: z, weight: 700, anchor: 'middle', fill: C.ink, ls: '0.2em' }));
          A.tag(d2, 100, 245, '6/12', { fill: C.stbd, size: 18 });
          // signature on d3
          A.path(d3, 'M 30 220 C 50 190 60 240 80 210 S 110 200 120 225 S 150 205 170 215', { fill: 'none', stroke: C.ink, 'stroke-width': 2.5, 'stroke-linecap': 'round' });
          gsap.from([d1, d2, d3], { y: '+=60', opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out' });
          A.tag(svg, 400, 520, 'UNDER 18? ADD A CONSENT LETTER', { fill: C.ink, size: 18 });
        }
      },
      /* 10 */
      {
        type: 'try', title: 'Prove who you are',
        html: `<p>You must prove your identity with <b>one full</b> document, or <b>one primary plus one secondary</b> document. Bring originals or certified copies, and at least one must show your signature.</p>
<p>Sort each document into the right group.</p>`,
        build(svg, S, api) {
          A.paperBg(svg);
          const items = [
            ['Photo driver\'s licence (Australian)', 'Full', 'card'],
            ['Australian passport', 'Full', 'book'],
            ['WA Photo Card', 'Full', 'card'],
            ['Birth certificate (certified copy)', 'Primary', 'sheet'],
            ['Overseas passport', 'Primary', 'book'],
            ['WA firearm licence', 'Primary', 'card'],
            ['Medicare card', 'Secondary', 'card'],
            ['Bank card', 'Secondary', 'card'],
            ['Electricity bill, under 12 months old', 'Secondary', 'sheet']
          ];
          const why = {
            Full: 'A full document proves who you are on its own.',
            Primary: 'A primary document needs a secondary one with it.',
            Secondary: 'A secondary document only counts alongside a primary one.'
          };
          const counters = { Full: 0, Primary: 0, Secondary: 0 };
          const bins = {};
          ['Full', 'Primary', 'Secondary'].forEach((n, k) => {
            const x = 140 + k * 260;
            const g = A.g(svg, { transform: `translate(${x},470)` });
            A.rect(g, -110, -60, 220, 120, { rx: 16, fill: C.white, stroke: C.line, 'stroke-width': 2, 'stroke-dasharray': '6 6' });
            A.text(g, 0, -22, n.toUpperCase(), { size: 26, weight: 700, anchor: 'middle', fill: [C.deep, C.stbd, '#9A6B00'][k], ls: '0.08em' });
            const c = A.text(g, 0, 26, '0', { size: 34, weight: 700, anchor: 'middle', fill: C.ink3 });
            bins[n] = { g, c, x };
          });
          const holder = A.g(svg);
          let idx = 0, cur = null;
          const icon = (g, kind) => {
            if (kind === 'card') {
              A.rect(g, -120, -70, 240, 140, { rx: 14, fill: C.white, stroke: C.ink, 'stroke-width': 2 });
              A.rect(g, -100, -46, 62, 76, { rx: 6, fill: C.sea2 });
              A.circle(g, -69, -18, 13, { fill: C.sea4 });
              [0, 1, 2].forEach(k => A.rect(g, -20, -40 + k * 24, 110 - k * 20, 10, { rx: 5, fill: C.paper3 }));
            } else if (kind === 'book') {
              A.rect(g, -80, -100, 160, 200, { rx: 10, fill: C.deep });
              A.circle(g, 0, -10, 34, { fill: 'none', stroke: C.buoy, 'stroke-width': 3 });
              A.rect(g, -40, 50, 80, 8, { rx: 4, fill: C.buoy });
            } else {
              A.path(g, 'M -90 -110 L 60 -110 L 90 -80 L 90 110 L -90 110 Z', { fill: C.white, stroke: C.ink, 'stroke-width': 2 });
              [0, 1, 2, 3, 4, 5].forEach(k => A.rect(g, -66, -70 + k * 26, 130 - (k % 2) * 40, 9, { rx: 4, fill: C.paper3 }));
            }
          };
          const ui = document.createElement('div');
          ui.innerHTML = `<p class="q" style="margin-bottom:10px"></p><div class="chips"><button class="chip" data-v="Full">Full</button><button class="chip" data-v="Primary">Primary</button><button class="chip" data-v="Secondary">Secondary</button></div><div class="status"></div>`;
          api.task.appendChild(ui);
          const q = ui.querySelector('.q'), status = ui.querySelector('.status');
          const showItem = () => {
            holder.innerHTML = '';
            if (idx >= items.length) return;
            const [name, , kind] = items[idx];
            cur = A.g(holder, { transform: 'translate(400,200) scale(1.3)' });
            icon(cur, kind);
            q.textContent = name;
            status.textContent = `Document ${idx + 1} of ${items.length}`;
            gsap.from(cur, { y: '-=40', opacity: 0, rotation: -4, duration: 0.5, ease: 'back.out(1.6)' });
          };
          ui.querySelectorAll('.chip').forEach(b => b.onclick = () => {
            if (idx >= items.length) return;
            const [name, ans] = items[idx];
            if (b.dataset.v === ans) {
              const bin = bins[ans];
              counters[ans]++;
              api.say(`<b>${ans}.</b> ${why[ans]}`, 'good');
              const moving = cur; cur = null;
              gsap.to(moving, { x: bin.x, y: 470, scale: 0.3, opacity: 0, duration: 0.55, ease: 'power2.in', onComplete: () => { bin.c.textContent = counters[ans]; gsap.fromTo(bin.g, { scale: 1.08 }, { scale: 1, duration: 0.3, svgOrigin: bin.x + ' 470' }); idx++; if (idx < items.length) showItem(); else { q.textContent = 'All sorted.'; status.textContent = ''; api.done('Remember: one <b>full</b> document, or one <b>primary</b> plus one <b>secondary</b>.'); } } });
            } else {
              api.say(`Not ${b.dataset.v.toLowerCase()}. Try again.`, 'bad');
              gsap.fromTo(cur, { x: 392 }, { x: 400, duration: 0.4, ease: 'elastic.out(1,0.3)' });
            }
          });
          showItem();
        }
      },
      /* 11 */
      {
        type: 'learn', title: 'Booking and practising',
        html: `<p>You book your assessment with an <b>RST authorised provider</b>. The Department of Transport keeps the list of providers across the state.</p>
<p>The assessor sets their own fee, so prices vary and it pays to shop around. A fee may apply for each attempt, plus a recording fee.</p>
<p>A training course <b>isn't compulsory</b>. You can study on your own and practise with a <span class="term">supervising skipper</span>: a parent, relative or friend who holds an RST and is <b>at least 18</b>.</p>`,
        art(svg, S) {
          sideScene(svg, S);
          A.land(svg, 'M -20 300 L 140 300 Q 170 330 190 420 L -20 420 Z');
          A.jetty(svg, 150, 392, 170, 14, { piles: false });
          const boat = A.g(svg);
          const bs = A.boatSide(boat, { x: 520, y: 432, len: 380, color: C.stbd });
          A.person(bs.crew, { x: -42, y: -43, s: 1, side: true, color: C.ink, vest: C.orange, fwdL: 60, fwdR: 76 });
          A.person(bs.crew, { x: -112, y: -43, s: 1.05, side: true, color: C.stbd, vest: C.orange, fwdL: 10, fwdR: 120 });
          A.waterSide(svg, 432);
          gsap.to(boat, { y: 4, rotation: 0.6, transformOrigin: '520px 432px', duration: 1.7, yoyo: true, repeat: -1, ease: 'sine.inOut' });
          A.tag(svg, 330, 150, 'SUPERVISING SKIPPER', { fill: C.stbd, size: 20 });
          A.text(svg, 330, 194, 'holds an RST · aged 18+', { font: 'body', size: 17, anchor: 'middle', fill: C.ink2 });
          A.tag(svg, 650, 220, 'LEARNER', { fill: C.ink, size: 20 });
          A.path(svg, 'M 345 204 L 400 268', { stroke: C.stbd, 'stroke-width': 2.5, 'stroke-dasharray': '4 5' });
          A.path(svg, 'M 630 238 L 486 278', { stroke: C.ink, 'stroke-width': 2.5, 'stroke-dasharray': '4 5' });
        }
      },
      /* 12 */
      {
        type: 'learn', title: 'After you pass',
        html: `<ul><li><b>Lost or damaged card:</b> apply for a replacement card (a fee may apply).</li>
<li><b>Other states:</b> every state's ticket is recognised in the others, like a car licence. Check the local rules when you visit.</li>
<li><b>Coming to WA:</b> an approved interstate or overseas ticket counts as an RST for <b>three months</b> after you arrive. After that, apply for an RST through <span class="term">Skills Recognition</span>.</li>
<li><b>Skills Recognition</b> also lets people who already hold a listed qualification apply for an RST through an authorised provider, without the assessment.</li></ul>`,
        art(svg, S) {
          A.seaBg(svg, { top: '#DCEBEC', bottom: '#BCD8DD', density: 30 });
          const m = ausMap(svg, 80, 40, 14.2);
          gsap.fromTo(m.wa, { opacity: 0.4 }, { opacity: 1, duration: 1.1, yoyo: true, repeat: -1, ease: 'sine.inOut' });
          const pr = m.pr;
          const [wx, wy] = pr([121, -26]);
          A.text(svg, wx, wy + 8, 'WA', { size: 40, weight: 700, anchor: 'middle', fill: C.white });
          const from = [[[146, -31]], [[135, -20]], [[144, -37]]];
          from.forEach(([[lo, la]], k) => {
            const [x, y] = pr([lo, la]);
            const a = A.arrow(svg, `M ${x} ${y} Q ${(x + wx) / 2} ${Math.min(y, wy) - 90} ${wx + 40} ${wy - 10}`, { color: C.ink, width: 3.5, dash: '2 9' });
            gsap.from(a, { opacity: 0, duration: 0.6, delay: 0.3 + k * 0.25 });
          });
          // calendar
          const cal = A.g(svg, { transform: 'translate(36,420)' });
          A.rect(cal, 6, 8, 180, 150, { rx: 14, fill: 'rgba(18,38,58,0.18)' });
          A.rect(cal, 0, 0, 180, 150, { rx: 14, fill: C.white, stroke: C.ink, 'stroke-width': 2 });
          A.path(cal, 'M 0 14 Q 0 0 14 0 L 166 0 Q 180 0 180 14 L 180 40 L 0 40 Z', { fill: C.port });
          A.text(cal, 90, 102, '3', { size: 72, weight: 700, anchor: 'middle' });
          A.text(cal, 90, 134, 'MONTHS', { size: 20, weight: 700, anchor: 'middle', fill: C.ink2, ls: '0.14em' });
          gsap.from(cal, { scale: 0.7, opacity: 0, duration: 0.6, delay: 0.8, ease: 'back.out(2)', transformOrigin: '90px 75px' });
        }
      },
      /* recap */
      {
        type: 'recap', n: 1, of: 3,
        q: 'Who must hold an RST?',
        opts: ['Anyone in charge of a boat over 6 metres long', 'The person in charge of a boat with a motor over 6 hp', 'Every person who drives any kind of motor boat', 'Anyone taking a boat into unprotected waters'],
        a: 1,
        why: 'The rule is about the motor: over 6 hp (4.5 kW) means the person in charge needs an RST.'
      },
      {
        type: 'recap', n: 2, of: 3,
        q: 'How many theory questions must you get right before you can do the practical?',
        opts: ['30 out of 40', '32 out of 40', '34 out of 40', '36 out of 40'],
        a: 2,
        why: '34 or more is a pass. 30 to 33 lets you try a different set the same day.'
      },
      {
        type: 'recap', n: 3, of: 3,
        q: 'Who can be your supervising skipper while you practise?',
        opts: ['Any adult who owns a registered boat', 'An RST holder who is at least 18', 'An RST holder who is at least 16', 'Only an authorised RST assessor'],
        a: 1,
        why: 'A supervising skipper can be a parent, relative or friend, as long as they hold an RST and are at least 18.'
      }
    ]
  });
})();
