/* Chapter 9: Emergencies */
(function () {
  const A = SR.art, C = A.C;
  const { sky, caption, rounds, order, wrap, outboard } = SR.share;
  const gear = SR._ch7.gear;
  const P = [];
  const BLUE = '#1F4E9C';

  const scard = (svg, text, y, size) => {
    const g = A.g(svg);
    const ls = wrap(text, size > 28 ? 26 : 30);
    A.rect(g, 110, y, 580, 70 + ls.length * (size + 12), { rx: 24, fill: C.white, stroke: C.ink, 'stroke-width': 2.5 });
    ls.forEach((l, q) => A.text(g, 400, y + 56 + q * (size + 12), l, { font: 'body', size, weight: 700, anchor: 'middle', fill: C.ink }));
    gsap.from(g, { opacity: 0, y: 12, duration: 0.3 });
    return g;
  };
  /* upturned hull, side view; origin waterline centre */
  function upturned(parent, x, y, L) {
    const g = A.g(parent, { transform: `translate(${x},${y})` });
    const h = L * 0.13;
    A.path(g, `M ${-L / 2} ${h * 0.4} L ${-L * 0.42} ${-h * 0.6} L ${L * 0.3} ${-h * 0.7} C ${L * 0.42} ${-h * 0.4} ${L * 0.48} ${0} ${L / 2} ${h * 0.6} Z`, { fill: C.white, stroke: C.ink, 'stroke-width': 2.5, 'stroke-linejoin': 'round' });
    A.path(g, `M ${-L * 0.44} ${-h * 0.3} L ${L * 0.36} ${-h * 0.42}`, { stroke: C.port, 'stroke-width': 5 });
    return g;
  }
  function flagN(parent, x, y, w) {
    const g = A.g(parent, { transform: `translate(${x},${y})` });
    const c = w / 4;
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) A.rect(g, i * c, j * c * 0.7, c, c * 0.7, { fill: (i + j) % 2 ? '#fff' : BLUE });
    A.rect(g, 0, 0, w, c * 2.8, { fill: 'none', stroke: C.ink, 'stroke-width': 1.5 });
    return g;
  }
  function flagC(parent, x, y, w) {
    const g = A.g(parent, { transform: `translate(${x},${y})` });
    const h = w * 0.7, s = h / 5;
    [BLUE, '#fff', C.port, '#fff', BLUE].forEach((col, k) => A.rect(g, 0, k * s, w, s, { fill: col }));
    A.rect(g, 0, 0, w, h, { fill: 'none', stroke: C.ink, 'stroke-width': 1.5 });
    return g;
  }
  /* a person in the water: head and shoulders with lifejacket */
  function floater(parent, x, y, s) {
    const g = A.g(parent, { transform: `translate(${x},${y}) scale(${s || 1})` });
    A.path(g, 'M -18 6 Q -20 -14 0 -16 Q 20 -14 18 6 Z', { fill: C.orange });
    A.circle(g, 0, -26, 11, { fill: C.ink });
    return g;
  }

  /* ===================== PAGES ===================== */
  P.push({
    type: 'learn', title: 'Help others',
    html: `<p>Well-prepared boaters seldom have big problems. But accidents happen, so be ready.</p>
<p>When not using your radio, keep it on the distress channel or your marine rescue group's working channel, so you can help others.</p>
<p>It is a <b>legal obligation</b> to help if you hear a distress call or see distress signals or a burning boat. You don't have to tow another boat, but you can <b>stand by</b> until marine rescue arrives.</p>`,
    art(svg, S) {
      S.seaBg(svg);
      const wk = A.g(svg); S.wakes(wk);
      const smoke = A.g(svg);
      const victim = S.boat(svg, { len: 100, color: C.sea4, x: 520, y: 260, r: 30, wake: false });
      for (let i = 0; i < 10; i++) { const c = A.circle(smoke, 0, 0, 14, { fill: '#55606B', opacity: 0 }); gsap.fromTo(c, { attr: { cx: 520, cy: 250, r: 10 }, opacity: 0.7 }, { attr: { cx: 600 + i * 6, cy: 120 - i * 4, r: 40 }, opacity: 0, duration: 3, repeat: -1, delay: i * 0.3 }); }
      const me = S.boat(svg, { len: 100, color: C.port, x: 120, y: 480, r: -40 });
      gsap.to(me, { x: 400, y: 330, duration: 5, ease: 'power2.out' });
      A.tag(svg, 200, 560, 'YOU MUST GO AND HELP', { fill: C.ink, size: 17 });
    }
  });

  P.push({
    type: 'check', title: 'Do you have to tow?',
    q: 'A nearby boat has broken down and asks you for a tow. What must you do?',
    opts: ['You don’t have to tow, but you can stand by', 'You must tow it back to the ramp', 'You must not go near it at all', 'You must call a Mayday for it'], a: 0,
    why: 'You are not obliged to tow. You can stand by until marine rescue arrives.'
  });

  P.push({
    type: 'learn', title: 'Take charge',
    html: `<p>In an emergency the skipper must be the skipper: act <b>decisively and logically</b>.</p>
<ul><li>Make passengers as safe as possible. That almost always means <b>lifejackets on</b>, and may mean moving people or preparing to abandon the boat.</li><li>Stop the emergency getting worse. For example, a broken fuel line could start a fire.</li><li>Decide quickly if you need outside help. If you do, ask for it <b>straight away</b>.</li></ul>`,
    art(svg, S) {
      sky(svg, '#7D93A6', '#B6C6D0');
      const b = A.boatSide(svg, { len: 440, x: 400, y: 410, color: C.port });
      const sk = A.person(b.crew, { x: -100, y: -b._h * 0.8, s: 1.15, side: true, fwdR: 80, vest: true });
      [10, 70, 130].forEach((x, k) => {
        const p = A.person(b.crew, { x, y: -b._h * 0.8, s: k === 1 ? 0.8 : 1, vest: false, flip: true });
        const v = A.path(b.crew, `M ${x - 11} ${-b._h * 0.8 - 73 * (k === 1 ? 0.8 : 1)} l 22 0 l 1 ${27 * (k === 1 ? 0.8 : 1)} l -24 0 Z`, { fill: C.orange, opacity: 0 });
        gsap.to(v, { opacity: 1, duration: 0.3, delay: 1 + k * 0.6 });
      });
      A.waterSide(svg, 414, { amp: 8, speed: 2.4 });
      gsap.to(b, { rotation: 3, svgOrigin: '400 410', duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      A.tag(svg, 400, 90, 'LIFEJACKETS ON, EVERYONE', { fill: C.port, size: 18 });
    }
  });

  P.push({
    type: 'learn', title: 'Calling for help',
    html: `<ul><li><b>Radio</b>: usually the best. Longer range than visual signals, keeps working while the battery lasts, lets you say what help you need and where you are, and rescuers can home in on it.</li><li><b>EPIRB</b>: calls for help even after the boat has sunk, with no help from you.</li><li><b>Flares</b>: short range. You need to see a rescuer before you fire one.</li><li><b>EVDS</b>: guides rescuers in the final stage, alongside a GPS beacon.</li><li><b>Phone</b>: no substitute for a radio, but a useful back-up. Take it if you abandon ship.</li></ul>`,
    art(svg, S) {
      A.paperBg(svg);
      const items = [[g => gear.radio(g, 0, 0, 0.8), 'RADIO'], [g => gear.epirb(g, 0, 20, 0.7), 'EPIRB'], [g => { gear.flare(g, -16, 10, 0.6, 'red'); gear.flare(g, 16, 10, 0.6, 'orange'); }, 'FLARES'], [g => gear.evds(g, 0, 0, 0.9), 'EVDS']];
      items.forEach(([d, l], k) => {
        const x = 230 + (k % 2) * 340, y = 175 + Math.floor(k / 2) * 250;
        const g = A.g(svg, { transform: `translate(${x},${y})` });
        A.rect(g, -130, -110, 260, 220, { rx: 20, fill: C.white, stroke: k === 0 ? C.stbd : C.line, 'stroke-width': k === 0 ? 4 : 1.5 });
        d(g);
        A.text(g, 0, 92, l, { size: 20, weight: 700, anchor: 'middle', fill: C.ink2, ls: '0.1em' });
        if (k === 0) A.tag(g, 0, -110, 'USUALLY BEST', { fill: C.stbd, size: 14 });
        gsap.from(g, { opacity: 0, y: '+=14', duration: 0.4, delay: 0.2 + k * 0.2 });
      });
    }
  });

  P.push({
    type: 'learn', title: 'Recognised distress signals',
    html: `<p>Other internationally recognised distress signals include:</p>
<ul><li>slowly <b>raising and lowering outstretched arms</b></li><li>continuous sounding of a <b>fog horn</b></li><li>the code flags <b>N over C</b></li><li>a red flare or orange smoke</li><li>smoke or flames on a boat</li><li>a gun or explosive signal about once a minute</li><li>a Mayday radio call.</li></ul>`,
    art(svg, S) {
      A.paperBg(svg);
      const c1 = A.g(svg, { transform: 'translate(220,300)' });
      A.rect(c1, -150, -200, 300, 400, { rx: 22, fill: C.white, stroke: C.line, 'stroke-width': 1.5 });
      const p = A.person(c1, { x: 0, y: 130, s: 2, vest: true });
      p.setArm('L', 90); p.setArm('R', 90);
      gsap.to([p.armL], { rotation: 170, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: '0px 0px' });
      gsap.to([p.armR], { rotation: -170, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: '0px 0px' });
      A.text(c1, 0, 180, 'ARMS UP AND DOWN, SLOWLY', { size: 15, weight: 700, anchor: 'middle', fill: C.ink2, ls: '0.06em' });
      const c2 = A.g(svg, { transform: 'translate(580,300)' });
      A.rect(c2, -150, -200, 300, 400, { rx: 22, fill: C.white, stroke: C.line, 'stroke-width': 1.5 });
      A.line(c2, -70, -170, -70, 160, { stroke: C.ink2, 'stroke-width': 5 });
      flagN(c2, -66, -150, 150);
      flagC(c2, -66, -30, 150);
      A.text(c2, 10, 180, 'FLAGS N OVER C', { size: 15, weight: 700, anchor: 'middle', fill: C.ink2, ls: '0.06em' });
    }
  });

  P.push({
    type: 'try', title: 'Distress or not?',
    html: `<p>Is each one a recognised distress signal?</p>`,
    lockMsg: 'Answer all five',
    build(svg, S, api) {
      A.paperBg(svg);
      let card = null;
      rounds(api, S, {
        noun: 'Signal',
        choices: ['Distress signal', 'Not a distress signal'],
        items: [
          { t: 'Someone slowly raises and lowers both outstretched arms.', a: 0, why: 'A recognised distress signal.' },
          { t: 'One short blast on the horn.', a: 1, why: 'That is a manoeuvring signal: “I am turning to starboard.”' },
          { t: 'A fog horn sounding continuously.', a: 0, why: 'Continuous sounding of a fog horn means distress.' },
          { t: 'Code flag N flying above code flag C.', a: 0, why: 'N over C is an international distress signal.' },
          { t: 'A friend on another boat waves one arm to say hello.', a: 1, why: 'A friendly wave isn’t distress. The signal is both arms, slowly up and down.' }
        ],
        show(it) { if (card) card.remove(); card = scard(svg, it.t, 190, 30); },
        end: 'Know the signals, so you can recognise someone who needs help.'
      });
    }
  });

  P.push({
    type: 'learn', title: 'Why boats capsize',
    html: `<p>Capsizes are a major cause of boating deaths. Common causes:</p>
<ul><li>overloading, or a badly spread load</li><li><b>broaching</b> when running with a following sea, more likely if the bow isn't trimmed up</li><li>free surface effect from water aboard, or a shifting load</li><li>poor driving</li><li>getting caught by breakers on the seaward side of a reef</li><li>everyone on one side pulling pots when wind and waves hit.</li></ul>`,
    art(svg, S) {
      sky(svg, '#9DB2C0', '#CFDAE0');
      const b = A.g(svg);
      const bs = A.boatSide(b, { len: 240, x: 400, y: 360, color: C.sea4, console: false });
      [60, 90, 120].forEach(x => A.person(bs.crew, { x, y: -bs._h * 0.8, s: 0.8, side: true, fwdR: 60, fwdL: 60 }));
      A.waterSide(svg, 364, { amp: 16, wl: 160, speed: 1.8 });
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
      tl.to(b, { rotation: 10, svgOrigin: '400 360', duration: 1.2, ease: 'sine.inOut' });
      tl.to(b, { rotation: 4, svgOrigin: '400 360', duration: 1, ease: 'sine.inOut' });
      tl.to(b, { rotation: 22, svgOrigin: '400 360', duration: 0.9, ease: 'power2.in' });
      tl.to(b, { rotation: 8, svgOrigin: '400 360', duration: 1.4, ease: 'sine.inOut' });
      tl.to(b, { rotation: 0, svgOrigin: '400 360', duration: 1, ease: 'sine.inOut' });
      A.tag(svg, 400, 100, 'ALL ON ONE SIDE PULLING POTS', { fill: C.port, size: 17 });
    }
  });

  P.push({
    type: 'watch', title: 'If you capsize',
    html: `<p>Watch what to do if your boat turns over.</p>`,
    anim(svg, S) {
      sky(svg, '#BFD0DA', '#E3EAEC');
      const hull = upturned(svg, 400, 330, 340);
      A.waterSide(svg, 334, { amp: 6, opacity: 0.85 });
      const ppl = [floater(svg, 250, 360, 1), floater(svg, 560, 365, 1), floater(svg, 300, 390, 0.85), floater(svg, 520, 395, 1)];
      const land = A.g(svg, { opacity: 0 });
      A.path(land, 'M 640 250 Q 700 230 800 240 L 800 300 L 640 300 Z', { fill: C.land });
      const counter = A.tag(svg, 400, 120, '', { fill: C.ink, size: 18 });
      gsap.set(counter, { opacity: 0 });
      const cap = caption(svg);
      const tl = gsap.timeline();
      cap.show(tl, 0.2, 'First, make sure everyone is there. Count heads.');
      ppl.forEach((p, k) => tl.to(p, { scale: 1.25, transformOrigin: '50% 50%', duration: 0.2, yoyo: true, repeat: 1 }, 1 + k * 0.5));
      cap.show(tl, 3.6, 'Stay with the boat. It is far easier to spot than a person.');
      cap.show(tl, 6.6, 'If you can’t right it, get as much of yourselves onto the hull as you can.');
      tl.to(ppl[0], { x: 120, y: -50, duration: 1.2 }, 7);
      tl.to(ppl[1], { x: -80, y: -50, duration: 1.2 }, 7.3);
      tl.to(ppl[2], { x: 140, y: -70, duration: 1.2 }, 7.6);
      tl.to(ppl[3], { x: -140, y: -75, duration: 1.2 }, 7.9);
      cap.show(tl, 10, 'Keep lifejackets on. Don’t swim for shore: distances are deceptive.');
      tl.to(land, { opacity: 1, duration: 0.6 }, 10.4);
      tl.to({}, { duration: 2.6 });
      return tl;
    }
  });

  P.push({
    type: 'try', title: 'Stay or swim?',
    html: `<p>Your boat has capsized and you can't right it. What should you do?</p>`,
    lockMsg: 'Answer all three',
    build(svg, S, api) {
      A.paperBg(svg);
      let card = null;
      rounds(api, S, {
        noun: 'Situation',
        choices: ['Stay with the boat', 'Swim ashore'],
        items: [
          { t: '4 nautical miles off the coast. The hull is floating.', a: 0, why: 'Stay with the boat. It is easier to spot, and the shore is far too far.' },
          { t: 'The shore looks close, maybe 1 km, but there are rocks and surf.', a: 0, why: 'Distances are deceptive and there’s no safe landing. Stay with the boat.' },
          { t: 'The strongest swimmer offers to swim for help.', a: 0, why: 'Stay together with the boat. A lone swimmer is very hard to see.' }
        ],
        show(it) { if (card) card.remove(); card = scard(svg, it.t, 190, 30); },
        end: 'Only swim if shore is very close with a safe landing place. Otherwise, stay with the boat.'
      });
    }
  });

  P.push({
    type: 'learn', title: 'If you are sinking',
    html: `<p>Most trailer boats have flotation and seldom sink. Bigger boats without flotation usually take some time.</p>
<ul><li>Keep lifejackets handy, emergency gear in a <b>watertight drum</b>, and water in a container that floats.</li><li>Before you abandon ship, send a <b>Mayday</b> and activate your <b>EPIRB</b>.</li><li>Don't take clothes off. If there's time, put more on.</li><li>Stay together in the <b>huddle</b> position to keep warm.</li></ul>`,
    art(svg, S) {
      sky(svg, '#7D93A6', '#B6C6D0');
      const b = A.g(svg);
      A.boatSide(b, { len: 360, x: 430, y: 340, color: C.sea4 });
      gsap.set(b, { rotation: -12, svgOrigin: '430 340', y: 40 });
      gsap.to(b, { y: 50, duration: 2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      A.waterSide(svg, 344, { amp: 8 });
      const e = gear.epirb(svg, 160, 360, 0.55);
      gsap.to(e.strobe, { attr: { fill: '#FFFFFF' }, opacity: 0.2, duration: 0.12, repeat: -1, yoyo: true, repeatDelay: 0.8 });
      gsap.to(e, { y: 6, duration: 1.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      const drum = A.g(svg, { transform: 'translate(250,350)' });
      A.rect(drum, -26, -36, 52, 60, { rx: 8, fill: C.buoy, stroke: '#9A7210', 'stroke-width': 3 });
      A.rect(drum, -30, -44, 60, 12, { rx: 4, fill: C.ink });
      gsap.to(drum, { y: 5, rotation: 4, duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      A.tag(svg, 400, 90, 'MAYDAY + EPIRB BEFORE YOU ABANDON SHIP', { fill: C.port, size: 17 });
    }
  });

  P.push({
    type: 'learn', title: 'Running aground',
    html: `<p>Groundings are very common. Speed and the type of bottom often decide whether it's a scrape or a disaster.</p>
<ul><li>Look after your passengers first. A sudden stop can cause serious injuries.</li><li>Check for damage. Is it leaking? Raise the leg and check the propeller.</li><li>If it seems fine, probe the depth around you with a boat hook. Push off, or wait for the tide to rise.</li><li>If the boat is unseaworthy or hard aground, call for help.</li></ul>`,
    art(svg, S) {
      sky(svg, '#DCE9EC', '#EEF2EC');
      A.rect(svg, 0, 360, 800, 240, { fill: '#7FB2C4' });
      A.path(svg, 'M 300 600 Q 420 380 560 400 Q 700 420 800 470 L 800 600 Z', { fill: C.sand });
      const b = A.g(svg);
      A.boatSide(b, { len: 260, x: 0, y: 0, color: C.port, console: true });
      gsap.fromTo(b, { x: 120, y: 360 }, { x: 430, y: 340, rotation: -6, duration: 2.2, ease: 'power3.out', repeat: -1, repeatDelay: 2 });
      A.waterSide(svg, 364, { opacity: 0.5, amp: 3 });
    }
  });

  P.push({
    type: 'learn', title: 'Avoiding groundings',
    html: `<p>Groundings are almost always preventable. Know where you should be and where you actually are, and keep a good lookout.</p>
<ul><li>Plan your trip on a <b>chart</b> and take it with you. Make sure there's enough depth the whole way.</li><li>Know what every <b>navigation mark</b> looks like and means. Not all are lit at night.</li><li>If you're ever unsure of your position or a mark, <b>slow down</b>.</li></ul>`,
    art(svg, S) {
      S.seaBg(svg);
      A.land(svg, 'M 520 0 Q 600 200 560 360 Q 540 460 620 610 L 820 610 L 820 0 Z');
      A.path(svg, 'M 330 220 Q 420 180 470 260 Q 430 330 350 300 Z', { fill: C.reef, opacity: 0.55 });
      A.beacon(svg, 300, 240, 'north');
      const wk = A.g(svg); S.wakes(wk);
      const b = S.boat(svg, { len: 70, color: C.port, x: 120, y: 520, r: -60 });
      const path = { t: 0 };
      gsap.to(path, { t: 1, duration: 7, repeat: -1, ease: 'none', onUpdate() { const t = path.t; b.x = 120 + t * 300 - Math.sin(t * Math.PI) * 60; b.y = 520 - t * 500; b.rotation = -70 - Math.cos(t * Math.PI) * 20; } });
      A.tag(svg, 200, 120, 'PLAN THE ROUTE ON A CHART', { fill: C.ink, size: 16 });
    }
  });

  P.push({
    type: 'learn', title: 'If the motor won’t start',
    html: `<p>Well-maintained motors rarely break down. Try this checklist:</p>
<ul><li>Kill switch lanyard attached? Fuel in the tank? Air vent open?</li><li>Fuel lines connected and not kinked? Is the <b>fuel bulb hard</b>? If not, squeeze it.</li><li>Choke closing? Air intake clear?</li><li>Cranking too slowly? Check the battery connections.</li><li>Wait five minutes and try again.</li><li>Flat battery or broken cord? Start it with a rope around the flywheel.</li><li>Change the spark plugs and fuses.</li></ul>`,
    art(svg, S) {
      sky(svg, '#E8EEE6', '#F2ECDD');
      outboard(svg, 260, 330, 1.2);
      const tank = A.g(svg, { transform: 'translate(600,430)' });
      A.path(tank, 'M -80 -60 L 60 -60 L 80 -40 L 80 60 L -80 60 Z', { fill: C.port, stroke: '#8E2018', 'stroke-width': 3, 'stroke-linejoin': 'round' });
      A.circle(tank, 50, -66, 10, { fill: '#1B232C' });
      A.path(svg, 'M 520 420 C 420 400 380 300 300 230', { fill: 'none', stroke: '#1B232C', 'stroke-width': 7 });
      const bulb = A.el('ellipse', { cx: 430, cy: 362, rx: 26, ry: 16, fill: '#1B232C' }, svg);
      gsap.to(bulb, { attr: { ry: 9 }, duration: 0.3, yoyo: true, repeat: -1, repeatDelay: 0.4 });
      A.tag(svg, 430, 320, 'SQUEEZE UNTIL HARD', { fill: C.ink, size: 15 });
      const ks = A.g(svg, { transform: 'translate(560,190)' });
      A.rect(ks, -40, -26, 80, 52, { rx: 10, fill: C.port });
      A.text(ks, 0, 8, 'KILL', { size: 20, weight: 700, anchor: 'middle', fill: '#fff' });
      A.path(svg, 'M 600 190 C 680 180 700 260 660 300', { fill: 'none', stroke: C.buoy, 'stroke-width': 4, 'stroke-dasharray': '2 6', 'stroke-linecap': 'round' });
      A.tag(svg, 640, 130, 'LANYARD ON?', { fill: C.ink, size: 15 });
    }
  });

  P.push({
    type: 'try', title: 'Troubleshoot it',
    html: `<p>The motor won't start. What should you try for each clue?</p>`,
    lockMsg: 'Fix all three',
    build(svg, S, api) {
      A.paperBg(svg);
      let card = null;
      rounds(api, S, {
        noun: 'Clue',
        choices: ['Squeeze the fuel bulb', 'Clip on the kill switch', 'Check battery connections'],
        items: [
          { t: 'Nothing happens when you turn the key. The kill switch lanyard is lying on the floor.', a: 1, why: 'Most motors won’t start without the kill switch clip in place.' },
          { t: 'The fuel bulb feels soft and floppy.', a: 0, why: 'Squeeze the bulb until it is hard to prime the fuel system.' },
          { t: 'The motor turns over very slowly.', a: 2, why: 'Slow cranking points to the battery. Check the connections are clean and tight.' }
        ],
        show(it) { if (card) card.remove(); card = scard(svg, it.t, 170, 30); },
        end: 'Work through the checklist calmly. Most “breakdowns” are simple fixes.'
      });
    }
  });

  P.push({
    type: 'learn', title: 'Still won’t start?',
    html: `<p>If you can't restart the motor, <b>anchor</b> to hold your position and keep the bow into the sea.</p>
<p>A breakdown on its own is <b>not</b> a reason for a Mayday or Pan Pan, unless you are drifting into danger or have other problems. Call marine rescue for help.</p>`,
    art(svg, S) {
      sky(svg, '#DCE9EC', '#EEF2EC');
      A.rect(svg, 0, 300, 800, 50, { fill: '#7FB2C4' });
      A.path(svg, 'M 0 350 Q 200 344 400 350 T 800 350 L 800 600 L 0 600 Z', { fill: C.sand });
      const bg = A.g(svg);
      const b = A.g(bg, { transform: 'translate(560,302)' });
      A.boatSide(A.g(b, { transform: 'scale(-1,1)' }), { len: 200, color: C.port });
      A.path(svg, 'M 470 284 Q 400 340 250 346', { fill: 'none', stroke: '#8A6F44', 'stroke-width': 4 });
      const an = A.g(svg, { transform: 'translate(240,342) rotate(-90) scale(0.4)' });
      SR._ch7.gear.anchorIcon(an, 0, 0, 1);
      A.rect(svg, 0, 303, 800, 12, { fill: '#7FB2C4', opacity: 0.5 });
      gsap.to(bg, { rotation: -4, svgOrigin: '560 302', duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      const r = gear.radio(svg, 640, 110, 0.8);
      A.tag(svg, 640, 180, 'CALL MARINE RESCUE', { fill: C.ink, size: 16 });
    }
  });

  P.push({
    type: 'learn', title: 'Preventing fire',
    html: `<p>Prevention beats firefighting. LP gas and petrol fires are more like explosions. Common causes:</p>
<ul><li>overheated oil on a galley stove</li><li>overloaded or badly wired electrics</li><li>oily rags touching hot engine parts</li><li>leaking fuel or gas lines</li><li>poor refuelling.</li></ul>
<p><b>Fuel vapour is heavier than air</b>. It sinks into the bilge and won't leave without help. Before starting an inboard, open the engine box, check for leaks and <b>sniff low in the bilge</b>.</p>`,
    art(svg, S) {
      sky(svg, '#DCE9EC', '#EEF2EC');
      A.path(svg, 'M 90 220 L 720 210 L 690 470 L 140 480 Z', { fill: C.white, stroke: C.ink, 'stroke-width': 3, 'stroke-linejoin': 'round' });
      A.path(svg, 'M 120 250 L 700 242 L 680 450 L 150 458 Z', { fill: '#E6E2D6' });
      A.rect(svg, 260, 300, 160, 90, { rx: 12, fill: C.ink2 });
      A.text(svg, 340, 352, 'ENGINE', { size: 20, weight: 700, anchor: 'middle', fill: '#fff', ls: '0.12em' });
      const vap = A.g(svg);
      for (let i = 0; i < 14; i++) { const c = A.circle(vap, 0, 0, 10, { fill: '#B7C66A', opacity: 0 }); gsap.fromTo(c, { attr: { cx: 440 + (i % 4) * 14, cy: 290 }, opacity: 0.8 }, { attr: { cx: 200 + i * 30, cy: 440 }, opacity: 0.25, duration: 3, repeat: -1, delay: i * 0.2, ease: 'power1.in' }); }
      A.tag(svg, 420, 160, 'VAPOUR SINKS INTO THE BILGE', { fill: C.ink, size: 17 });
    }
  });

  P.push({
    type: 'learn', title: 'Refuelling safely',
    html: `<p>Refuelling is when most fuel spills happen.</p>
<ul><li>Turn off everything that uses electricity, gas or fuel.</li><li>Send passengers ashore, and take portable tanks out of the boat.</li><li>Have an extinguisher near the filler.</li><li>Know how much you need. Don't overfill: leave room for the fuel to expand.</li><li>Keep the nozzle touching the filler while fuel flows.</li><li>Check the bilge and sniff for fuel. <b>Don't start the motor until the smell has gone.</b></li></ul>`,
    art(svg, S) {
      sky(svg, '#E8EEE6', '#F2ECDD');
      A.rect(svg, 0, 470, 800, 130, { fill: '#C9C2B0' });
      const pump = A.g(svg, { transform: 'translate(160,470)' });
      A.rect(pump, -50, -260, 100, 260, { rx: 10, fill: C.port });
      A.rect(pump, -36, -230, 72, 60, { rx: 6, fill: '#1B232C' });
      A.text(pump, 0, -192, '32.4 L', { size: 18, weight: 700, anchor: 'middle', fill: C.buoy });
      A.path(svg, 'M 210 340 C 300 360 300 250 420 250', { fill: 'none', stroke: '#1B232C', 'stroke-width': 8 });
      A.path(svg, 'M 410 238 L 460 250 L 456 262 L 410 260 Z', { fill: '#596470' });
      A.path(svg, 'M 470 260 L 760 250 L 740 420 L 490 430 Z', { fill: C.white, stroke: C.ink, 'stroke-width': 3, 'stroke-linejoin': 'round' });
      A.circle(svg, 466, 258, 9, { fill: '#1B232C' });
      SR._ch7.gear.extinguisher(svg, 560, 410, 0.45);
      A.tag(svg, 470, 200, 'NOZZLE TOUCHING THE FILLER', { fill: C.ink, size: 15 });
    }
  });

  P.push({
    type: 'try', title: 'Safe or unsafe?',
    html: `<p>Is each refuelling habit safe or unsafe?</p>`,
    lockMsg: 'Answer all five',
    build(svg, S, api) {
      A.paperBg(svg);
      let card = null;
      rounds(api, S, {
        noun: 'Habit',
        choices: ['Safe', 'Unsafe'],
        items: [
          { t: 'Passengers stay on board while you fill up.', a: 1, why: 'Send passengers ashore while refuelling.' },
          { t: 'You fill the tank right to the brim.', a: 1, why: 'Leave room for the fuel to expand.' },
          { t: 'You keep the nozzle touching the filler the whole time.', a: 0, why: 'Correct. It stops sparks from static.' },
          { t: 'You start the motor straight after filling up.', a: 1, why: 'Check the bilge and wait until any fuel smell has gone.' },
          { t: 'You take the portable tank out of the boat to fill it.', a: 0, why: 'Correct. Fill portable tanks on shore.' }
        ],
        show(it) { if (card) card.remove(); card = scard(svg, it.t, 190, 30); },
        end: 'Everything off, people ashore, no overfilling, and sniff before you start.'
      });
    }
  });

  P.push({
    type: 'learn', title: 'LP gas',
    html: `<p>LP gas systems must be installed by a <b>licensed gas fitter</b>.</p>
<p>Like petrol vapour, LP gas is <b>heavier than air</b>. Stow the cylinder <b>above deck</b>, where any leak will spill over the side.</p>
<p>When you finish cooking, turn the gas off <b>at the cylinder</b> and let the burner go out on its own. Then turn the stove off.</p>`,
    art(svg, S) {
      sky(svg, '#DCE9EC', '#EEF2EC');
      const cyl = A.g(svg, { transform: 'translate(300,300)' });
      A.rect(cyl, -50, -100, 100, 190, { rx: 40, fill: '#E0E4E8', stroke: '#8C97A3', 'stroke-width': 4 });
      A.rect(cyl, -20, -130, 40, 34, { rx: 6, fill: '#596470' });
      const valve = A.g(cyl, { transform: 'translate(0,-136)' });
      A.rect(valve, -30, -8, 60, 16, { rx: 8, fill: C.port });
      A.text(cyl, 0, 10, 'LPG', { size: 26, weight: 700, anchor: 'middle', fill: C.ink });
      A.path(svg, 'M 300 168 C 380 120 460 160 500 260', { fill: 'none', stroke: '#1B232C', 'stroke-width': 6 });
      const st = A.g(svg, { transform: 'translate(560,320)' });
      A.rect(st, -70, -30, 140, 60, { rx: 8, fill: '#3B4F64' });
      const flame = A.g(st);
      [-30, -15, 0, 15, 30].forEach(x => A.path(flame, `M ${x - 6} -30 Q ${x} -54 ${x + 6} -30 Z`, { fill: '#4C8BF5' }));
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
      tl.to(valve, { rotation: 90, svgOrigin: '0 0', duration: 0.5 }, 1);
      tl.to(flame, { scaleY: 0.2, opacity: 0, transformOrigin: '50% 100%', duration: 1.6 }, 1.8);
      tl.to({}, { duration: 1 });
      tl.to(valve, { rotation: 0, svgOrigin: '0 0', duration: 0.1 });
      tl.to(flame, { scaleY: 1, opacity: 1, duration: 0.1 });
      A.tag(svg, 300, 470, '1  OFF AT THE CYLINDER', { fill: C.ink, size: 16 });
      A.tag(svg, 560, 470, '2  LET THE FLAME GO OUT', { fill: C.ink, size: 16 });
    }
  });

  P.push({
    type: 'learn', title: 'Fighting a fire',
    html: `<p>Human life comes first. The boat is secondary.</p>
<ol><li>Raise the alarm and do a head count.</li><li>Make a radio call, or use your EPIRB/PLB if needed.</li><li>Get someone to take charge of the safety gear and move passengers away from the fire.</li><li>In an enclosed space, close openings to cut the air supply.</li><li>Close off fuel and gas lines.</li><li>Fight it with extinguishers, a fire blanket or buckets. Throwing burning items overboard may be best.</li></ol>
<p>Once it's out, keep watching. Fires can restart.</p>`,
    art(svg, S) {
      sky(svg, '#C9B9A4', '#E9DFD0');
      const b = A.boatSide(svg, { len: 460, x: 400, y: 420, color: C.sea4 });
      [-170, -120].forEach((x, k) => A.person(b.crew, { x, y: -b._h * 0.8, s: 1, vest: true }));
      A.person(b.crew, { x: 40, y: -b._h * 0.8, s: 1.1, side: true, flip: true, fwdR: 70, vest: true });
      const fire = A.g(svg, { transform: 'translate(560,380)' });
      [[-20, 70], [10, 100], [36, 66]].forEach(([x, h]) => { const f = A.path(fire, `M ${x - 22} 0 Q ${x - 26} ${-h * 0.5} ${x} ${-h} Q ${x + 26} ${-h * 0.5} ${x + 22} 0 Z`, { fill: C.orange }); gsap.to(f, { scaleY: 0.8, transformOrigin: '50% 100%', duration: 0.3, yoyo: true, repeat: -1 }); });
      A.waterSide(svg, 424);
      A.tag(svg, 250, 140, 'PEOPLE MOVED AWAY', { fill: C.stbd, size: 16 });
    }
  });

  P.push({
    type: 'try', title: 'Fire! In order',
    html: `<p>Tap the steps for dealing with a fire, in order.</p>`,
    lockMsg: 'Put all six in order',
    build(svg, S, api) {
      sky(svg, '#C9B9A4', '#E9DFD0');
      const fire = A.g(svg, { transform: 'translate(400,420)' });
      const fl = [[-60, 160], [0, 220], [60, 170], [-110, 110], [110, 120]].map(([x, h]) => { const f = A.path(fire, `M ${x - 40} 0 Q ${x - 46} ${-h * 0.5} ${x} ${-h} Q ${x + 46} ${-h * 0.5} ${x + 40} 0 Z`, { fill: C.orange, opacity: 0.95 }); gsap.to(f, { scaleY: 0.85, transformOrigin: '50% 100%', duration: 0.3 + Math.random() * 0.2, yoyo: true, repeat: -1 }); return f; });
      A.rect(svg, 0, 420, 800, 180, { fill: '#3B4F64' });
      order(api, S, {
        steps: ['Raise the alarm and count heads', 'Make a radio call (or use the EPIRB)', 'Move passengers away from the fire', 'Close openings, fuel and gas lines', 'Fight it with an extinguisher or blanket', 'Keep watching in case it restarts'],
        step(n) { if (n >= 4) gsap.to(fl, { scaleY: n === 4 ? 0.3 : 0.05, opacity: n === 4 ? 0.6 : 0, transformOrigin: '50% 100%', duration: 0.8, overwrite: true }); },
        good: n => ['Yes. Then get help on the way.', 'Next, protect the people.', 'Now starve the fire.', 'Now fight it.', 'And finally?'][n],
        bad: n => ['People first: what tells everyone there’s a fire?', 'Get help coming early.', 'Protect your passengers next.', 'Cut off air and fuel before fighting it.', 'Now actually put it out.', 'One last step once it’s out.'][n],
        end: 'Alarm and head count, call for help, protect people, cut air and fuel, fight it, then keep watching.'
      });
    }
  });

  P.push({
    type: 'learn', title: 'First aid and seasickness',
    html: `<p>Knives, hooks, sea creatures and engines mean injuries happen. Do a <b>first aid course</b> and carry a good kit.</p>
<p>To limit <b>seasickness</b>:</p>
<ul><li>take medication at the recommended time, or try ginger or an acupressure band</li><li>avoid greasy food and alcohol</li><li>sit in the lowest-motion part of the boat, usually near the stern, in the open air.</li></ul>
<p>It's often worse when stopped, so getting underway can help. Sip water: bad seasickness dehydrates fast.</p>`,
    art(svg, S) {
      sky(svg, '#DCE9EC', '#EEF2EC');
      const b = A.boatSide(svg, { len: 460, x: 400, y: 400, color: C.sea4 });
      A.person(b.crew, { x: -170, y: -b._h * 0.8, s: 1, pose: 'sit', vest: true });
      A.waterSide(svg, 404, { amp: 10, speed: 2 });
      gsap.to(b, { rotation: 4, svgOrigin: '220 400', duration: 1.4, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      A.tag(svg, 230, 150, 'LEAST MOTION: NEAR THE STERN', { fill: C.stbd, size: 16 });
      A.arrow(svg, 'M 230 172 L 230 260', { color: C.stbd, width: 4 });
    }
  });

  P.push({
    type: 'learn', title: 'Hypothermia',
    html: `<p><span class="term">Hypothermia</span> is when the body's core temperature drops. Cold water drains heat many times faster than air. Swimming or treading water makes it worse.</p>
<p>Most heat is lost from the <b>head, armpits and groin</b>. Get out of the water, or onto the hull, if you can.</p>
<ul><li><b>HELP</b> position: legs together and drawn up, arms tight against the sides of your chest, head back.</li><li><b>Huddle</b>: a group in a tight circle, sides touching, arms around each other.</li></ul>`,
    art(svg, S) {
      A.rect(svg, 0, 0, 800, 600, { fill: '#5F98AA' });
      for (let k = 0; k < 30; k++) A.path(svg, `M ${(k * 97) % 800} ${(k * 53) % 600} q 8 -4 16 0`, { fill: 'none', stroke: 'rgba(255,255,255,0.4)', 'stroke-width': 2 });
      // HELP: side view, tucked
      const hp = A.g(svg, { transform: 'translate(220,300)' });
      A.path(hp, 'M -10 -40 Q -30 0 -10 40 L 30 60 L 40 30 L 10 20 Q 14 0 10 -40 Z', { fill: C.ink });
      A.path(hp, 'M -24 -46 Q 0 -62 22 -46 L 18 10 L -20 10 Z', { fill: C.orange });
      A.circle(hp, 0, -70, 18, { fill: C.ink });
      A.text(hp, 0, 130, 'HELP', { size: 28, weight: 700, anchor: 'middle', fill: '#fff', ls: '0.14em' });
      gsap.to(hp, { y: 8, duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      // huddle: top view
      const hd = A.g(svg, { transform: 'translate(560,300)' });
      for (let k = 0; k < 5; k++) { const a = k * 72 * Math.PI / 180; const g = A.g(hd, { transform: `translate(${Math.cos(a) * 58},${Math.sin(a) * 58})` }); A.circle(g, 0, 0, 30, { fill: C.orange }); A.circle(g, 0, 0, 16, { fill: C.ink }); }
      A.circle(hd, 0, 0, 58, { fill: 'none', stroke: 'rgba(255,255,255,0.5)', 'stroke-width': 3, 'stroke-dasharray': '6 6' });
      A.text(hd, 0, 130, 'HUDDLE', { size: 28, weight: 700, anchor: 'middle', fill: '#fff', ls: '0.14em' });
      gsap.to(hd, { rotation: 8, svgOrigin: '560 300', duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    }
  });

  P.push({
    type: 'learn', title: 'Signs of hypothermia',
    html: `<p>Suspect hypothermia if someone has been in cold water or wind and is <b>drowsy</b> and <b>cold to touch</b>. Other signs:</p>
<ul><li>faint, slow pulse</li><li>shallow breathing</li><li>confusion and slurred speech</li><li>dilated pupils.</li></ul>`,
    art(svg, S) {
      A.paperBg(svg);
      const th = A.g(svg, { transform: 'translate(400,300)' });
      A.rect(th, -26, -200, 52, 330, { rx: 26, fill: C.white, stroke: C.ink, 'stroke-width': 4 });
      A.circle(th, 0, 150, 46, { fill: C.sea4, stroke: C.ink, 'stroke-width': 4 });
      const col = A.rect(th, -12, -40, 24, 180, { rx: 12, fill: C.sea4 });
      for (let k = 0; k < 8; k++) A.line(th, 26, -170 + k * 36, 46, -170 + k * 36, { stroke: C.ink2, 'stroke-width': 3 });
      gsap.fromTo(col, { attr: { y: -150, height: 290 } }, { attr: { y: 20, height: 120 }, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.fromTo(col, { attr: { fill: C.port } }, { attr: { fill: C.sea4 }, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      A.tag(svg, 400, 560, 'CORE TEMPERATURE FALLING', { fill: C.sea4, size: 18 });
    }
  });

  P.push({
    type: 'learn', title: 'Treating hypothermia',
    html: `<p>Stop further heat loss and warm the person <b>gradually</b>.</p>
<ul><li>Get them out of the cold and wind. Remove wet clothes if practical.</li><li>Warm them with dry blankets, towels, or skin-to-skin contact.</li><li>Warm the <b>head and neck, sides of the chest, armpits and groin</b>.</li><li><b>Don't</b> warm, rub or massage arms and legs. <b>No alcohol.</b> Don't let them walk around.</li><li>If unconscious, put them on their side with the airway clear, and keep warming.</li><li>Get medical help.</li></ul>`,
    art(svg, S) {
      A.paperBg(svg);
      const g = A.g(svg, { transform: 'translate(420,300)' });
      A.rect(g, -330, -150, 640, 300, { rx: 30, fill: '#9DB7C4', opacity: 0.5 });
      [[-190, -86], [-190, 62]].forEach(([x, y]) => A.rect(g, x, y, 150, 24, { rx: 12, fill: C.skin }));
      [[-20, -42], [-20, 14]].forEach(([x, y]) => A.rect(g, x, y, 250, 28, { rx: 14, fill: '#3B4F64' }));
      A.rect(g, -210, -62, 200, 124, { rx: 30, fill: C.sea4 });
      A.rect(g, -246, -16, 40, 32, { rx: 8, fill: C.skin });
      A.circle(g, -275, 0, 36, { fill: C.skin });
      A.path(g, 'M -300 -20 Q -275 -44 -250 -24', { fill: 'none', stroke: '#5B3A26', 'stroke-width': 10, 'stroke-linecap': 'round' });
      const zones = [[-232, 0, 'NECK', -1], [-180, -62, 'ARMPIT', -1], [-110, 52, 'CHEST SIDES', 1], [-12, 0, 'GROIN', -1]];
      zones.forEach(([x, y, l, up], k) => {
        const c = A.circle(g, x, y, 26, { fill: C.port, opacity: 0 });
        gsap.to(c, { opacity: 0.6, duration: 0.8, yoyo: true, repeat: -1, delay: k * 0.3 });
        A.tag(g, x, y + up * 64 + (up < 0 ? -20 : 20), l, { fill: C.port, size: 14 });
      });
      A.circle(g, -110, -52, 26, { fill: C.port, opacity: 0.35 });
      const no = A.g(g, { transform: 'translate(150,0)' });
      A.circle(no, 0, 0, 42, { fill: 'rgba(255,255,255,0.7)', stroke: C.ink, 'stroke-width': 5 });
      A.line(no, -30, -30, 30, 30, { stroke: C.ink, 'stroke-width': 5 });
      A.tag(g, 150, 84, 'DON’T RUB LIMBS', { fill: C.ink, size: 14 });
    }
  });

  P.push({
    type: 'try', title: 'Do or don’t?',
    html: `<p>Someone has hypothermia. Should you do each of these?</p>`,
    lockMsg: 'Answer all six',
    build(svg, S, api) {
      A.paperBg(svg);
      let card = null;
      rounds(api, S, {
        noun: 'Action',
        choices: ['Do it', 'Don’t do it'],
        items: [
          { t: 'Wrap them in dry blankets.', a: 0, why: 'Yes: stop heat loss and warm them gradually.' },
          { t: 'Rub their arms and legs hard to warm them up.', a: 1, why: 'Don’t warm, rub or massage limbs.' },
          { t: 'Give them a nip of rum to warm them.', a: 1, why: 'No alcohol.' },
          { t: 'Warm their armpits, chest sides and neck.', a: 0, why: 'Yes: these are the high heat-loss areas.' },
          { t: 'Walk them around the deck to get the blood moving.', a: 1, why: 'Don’t let them walk around.' },
          { t: 'They pass out: lay them on their side, airway clear.', a: 0, why: 'Yes, and keep warming them. Get medical help.' }
        ],
        show(it) { if (card) card.remove(); card = scard(svg, it.t, 190, 30); },
        end: 'Warm the core gently, protect from wind, no alcohol, no rubbing limbs, get help.'
      });
    }
  });

  /* ---------- workbook self-test ---------- */
  const R = (n, q, opts, a, why) => P.push({ type: 'review', n, of: 6, title: 'Workbook self-test', q, opts, a, why });
  R(1, 'Your vessel capsizes 4 nautical miles off the mainland shore. In most circumstances if a vessel capsizes it is best to:', ['Swim away from the vessel.', 'Try swimming to the shore as a group.', 'Send the strongest swimmer to get help.', 'Stay with the vessel.'], 3, 'Stay with the boat. It is much easier to spot than people in the water.');
  R(2, 'Most vessel groundings can be avoided by:', ['Planning your trips using a chart.', 'Knowing what navigation marks look like and mean.', 'Slowing down if you are unsure of a situation.', 'All of the above.'], 3, 'All three prevent groundings.');
  R(3, 'If you are out in a motor boat in calm weather and the motor cuts out unexpectedly, you should first:', ['Fire flares.', 'Radio Mayday.', 'Drop the anchor and assess your options.', 'Swim for shore.'], 2, 'Anchor to hold your position, then work through the problem.');
  R(4, 'Fuel vapour will not leave a compartment without assistance due to:', ['Fuel vapours being the same weight as air.', 'Fuel vapours being lighter than air.', 'Fuel vapours being heavier than air.', 'All of the above.'], 2, 'Fuel vapour is heavier than air, so it sinks into the bilge.');
  R(5, 'After a period of being exposed to cold water the most likely effect on the body will be:', ['Hunger.', 'Hypothermia.', 'Dehydration.', 'Thirst.'], 1, 'Cold water quickly lowers body temperature: hypothermia.');
  R(6, 'Who is responsible for the safety of all on board a recreational vessel?', ['The owner or their representative.', 'The most experienced person on board.', 'Any qualified person.', 'The skipper.'], 3, 'The skipper is responsible for everyone on board.');

  SR.chapter({
    id: 9,
    title: 'Emergencies',
    intro: 'Helping others, distress signals, capsize, sinking, grounding, breakdowns, fire, first aid and hypothermia.',
    cover(svg, S) {
      sky(svg, '#7D93A6', '#B6C6D0');
      const h = upturned(svg, 400, 330, 360);
      [[300, 300, 1], [420, 296, 1], [520, 302, 0.9]].forEach(([x, y, s]) => floater(svg, x, y, s));
      A.waterSide(svg, 334, { amp: 8, opacity: 0.85 });
      const e = gear.epirb(svg, 650, 350, 0.5);
      gsap.to(e.strobe, { attr: { fill: '#FFFFFF' }, opacity: 0.2, duration: 0.12, repeat: -1, yoyo: true, repeatDelay: 0.8 });
    },
    pages: P
  });
})();
