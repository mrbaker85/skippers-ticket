/* Chapter 7 (part 2): radios, logging on, bailers, fire, anchors, extra gear, workbook questions */
(function () {
  const A = SR.art, C = A.C;
  const { sky, caption, rounds, order, wrap } = SR.share;
  const { P, gear } = SR._ch7;
  const { radio, extinguisher, bucket, anchorIcon, lifejacket } = gear;

  /* speech bubble; side 'l' or 'r' */
  function bubble(parent, y, text, side, who) {
    const ls = wrap(text, 38), h = 32 + ls.length * 26, w = 500;
    const x = side === 'l' ? 40 : 800 - 40 - w;
    const g = A.g(parent, { transform: `translate(${x},${y})` });
    A.rect(g, 0, 0, w, h, { rx: 16, fill: side === 'l' ? C.white : C.deep, stroke: side === 'l' ? C.line : 'none', 'stroke-width': 1.5 });
    A.text(g, 18, 22, who, { size: 13, weight: 700, fill: side === 'l' ? C.port : C.buoy, ls: '0.12em' });
    ls.forEach((l, q) => A.text(g, 18, 48 + q * 26, l, { font: 'body', size: 20, fill: side === 'l' ? C.ink : '#fff' }));
    g._h = h;
    return g;
  }

  /* ---------- radios ---------- */
  P.push({
    type: 'learn', title: 'Marine radios',
    html: `<p>A registrable boat more than 4 nm from shore in unprotected waters <b>must</b> carry a VHF or HF marine radio. Everyone else is recommended to.</p>
<ul><li><b>VHF</b>: channel <b>16</b> for distress and calling, 67 as a supplementary channel.</li><li><b>HF</b>: distress on <b>4125 kHz</b>. 6215 and 8291 kHz are also monitored by the Water Police.</li><li><b>27 MHz</b>: channel <b>88</b> for distress and calling, 86 supplementary. These radios are being phased out.</li></ul>`,
    art(svg, S) {
      A.paperBg(svg);
      [['VHF', '16', 150], ['HF', '4125', 400], ['27 MHz', '88', 650]].forEach(([n, ch, x], k) => {
        const g = A.g(svg);
        A.rect(g, x - 115, 140, 230, 320, { rx: 20, fill: C.white, stroke: C.line, 'stroke-width': 1.5 });
        const r = radio(g, x, 270, 1.1);
        r.querySelector('text').textContent = ch;
        if (ch.length > 2) r.querySelector('text').setAttribute('font-size', 24);
        A.text(g, x, 190, n, { size: 26, weight: 700, anchor: 'middle', fill: C.ink, ls: '0.06em' });
        A.text(g, x, 380, 'DISTRESS', { size: 15, weight: 700, anchor: 'middle', fill: C.port, ls: '0.14em' });
        A.text(g, x, 414, n === 'HF' ? '4125 kHz' : 'Channel ' + ch, { font: 'body', size: 20, weight: 700, anchor: 'middle', fill: C.ink });
        gsap.from(g, { opacity: 0, y: 16, duration: 0.5, delay: 0.2 + k * 0.2 });
      });
    }
  });

  P.push({
    type: 'learn', title: 'Three kinds of call',
    html: `<ul><li><b>Mayday</b>: distress. A vessel or person is in <b>grave and imminent danger</b> and needs help now.</li><li><b>Pan Pan</b>: urgency. An urgent message about the safety of a vessel or person, such as a breakdown, medical emergency or man overboard.</li><li><b>Securite</b> (say-cure-e-tay): safety. An important navigation or weather warning.</li></ul>
<p>Don't wait for full-blown distress before calling for help. A Pan Pan early can stop it becoming a Mayday.</p>`,
    art(svg, S) {
      A.paperBg(svg);
      [['MAYDAY', 'DISTRESS', C.port, 'Grave and imminent danger'], ['PAN PAN', 'URGENCY', C.orange, 'Urgent safety message'], ['SECURITE', 'SAFETY', C.sea4, 'Navigation warning']].forEach(([t, s, c, d], k) => {
        const y = 80 + k * 160;
        const g = A.g(svg, { transform: `translate(110,${y})` });
        A.rect(g, 4, 6, 580, 130, { rx: 20, fill: 'rgba(18,38,58,0.12)' });
        A.rect(g, 0, 0, 580, 130, { rx: 20, fill: C.white, stroke: c, 'stroke-width': 4 });
        A.rect(g, 0, 0, 22, 130, { rx: 10, fill: c });
        A.text(g, 50, 62, t, { size: 44, weight: 700, fill: c, ls: '0.04em' });
        A.text(g, 52, 100, d, { font: 'body', size: 20, fill: C.ink });
        A.text(g, 560, 40, s, { size: 15, weight: 700, fill: C.ink3, anchor: 'end', ls: '0.16em' });
        gsap.from(g, { opacity: 0, x: -20, duration: 0.5, delay: 0.2 + k * 0.3 });
      });
    }
  });

  P.push({
    type: 'try', title: 'Which call?',
    html: `<p>Which call would you make?</p>`,
    lockMsg: 'Answer all six',
    build(svg, S, api) {
      A.paperBg(svg);
      const card = A.g(svg);
      radio(svg, 400, 480, 0.9);
      rounds(api, S, {
        noun: 'Situation',
        choices: ['Mayday', 'Pan Pan', 'Securite'],
        items: [
          { t: 'Your boat is taking on water fast and sinking.', a: 0, why: 'Grave and imminent danger: Mayday.' },
          { t: 'Your motor has broken down and you are drifting, in no immediate danger.', a: 1, why: 'A mechanical breakdown is an urgency call: Pan Pan.' },
          { t: 'You spot a large floating log in a busy channel.', a: 2, why: 'A navigation warning for others: Securite.' },
          { t: 'A crew member has a deep cut and needs medical help.', a: 1, why: 'A medical emergency is an urgency call: Pan Pan.' },
          { t: 'A fire is out of control and you are about to abandon ship.', a: 0, why: 'Lives in grave and imminent danger: Mayday.' },
          { t: 'Someone has fallen overboard.', a: 1, why: 'The workbook lists man overboard as a Pan Pan. Upgrade to Mayday if a life is in grave danger.' }
        ],
        show(it) {
          card.innerHTML = '';
          A.rect(card, 120, 90, 560, 260, { rx: 24, fill: C.white, stroke: C.ink, 'stroke-width': 2.5 });
          const ls = wrap(it.t, 28);
          ls.forEach((l, q) => A.text(card, 400, 220 - (ls.length - 1) * 21 + q * 42, l, { font: 'body', size: 29, weight: 700, anchor: 'middle', fill: C.ink }));
          gsap.from(card, { opacity: 0, y: 12, duration: 0.3 });
        },
        end: 'Mayday for grave danger, Pan Pan for urgent, Securite for warnings.'
      });
    }
  });

  P.push({
    type: 'learn', title: 'Making a Mayday call',
    html: `<p>Use a distress channel: VHF <b>16</b>, HF <b>4125</b>, or 27 MHz <b>88</b>. Stay calm and give the <b>3 Ps</b>: position, problem, people.</p>
<p>Repeat the call until someone answers. If no one answers on a distress channel, try any channel likely to be heard. Once in distress, stay on that channel.</p>`,
    art(svg, S) {
      A.paperBg(svg);
      const lines = [['“Mayday, Mayday, Mayday”', C.port], ['“This is WA 1234 Z” × 3', C.ink], ['“My position is…”', C.ink], ['“My problem is…”', C.ink], ['“I have 3 people on board”', C.ink]];
      const g = A.g(svg);
      A.rect(g, 100, 70, 600, 460, { rx: 24, fill: C.white, stroke: C.line, 'stroke-width': 1.5 });
      lines.forEach(([t, c], k) => {
        const row = A.g(g, { transform: `translate(140,${140 + k * 82})` });
        A.circle(row, 20, -8, 20, { fill: c });
        A.text(row, 20, 0, String(k + 1), { size: 22, weight: 700, anchor: 'middle', fill: '#fff' });
        A.text(row, 60, 2, t, { font: 'body', size: 28, weight: 700, fill: c });
        if (k >= 2) A.tag(row, 520, -8, ['POSITION', 'PROBLEM', 'PEOPLE'][k - 2], { fill: C.buoy, color: C.ink, size: 14 });
        gsap.from(row, { opacity: 0, x: -16, duration: 0.4, delay: 0.3 + k * 0.5 });
      });
    }
  });

  P.push({
    type: 'try', title: 'Put the Mayday in order',
    html: `<p>Tap the parts of a Mayday call in the right order.</p>`,
    lockMsg: 'Finish the call',
    build(svg, S, api) {
      A.paperBg(svg);
      const r = radio(svg, 400, 260, 2);
      const wave = A.g(svg);
      for (let k = 0; k < 3; k++) { const a = A.path(wave, 'M 0 -30 Q 20 0 0 30', { fill: 'none', stroke: C.port, 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0 }); gsap.set(a, { x: 610 + k * 26, y: 240 }); }
      order(api, S, {
        steps: ['“Mayday, Mayday, Mayday”', '“This is [boat’s rego]”, three times', '“My position is…”', '“My problem is…”', '“I have [number] people on board”'],
        step(n) {
          gsap.fromTo(wave.children, { opacity: 0.9 }, { opacity: 0, duration: 0.8, stagger: 0.12 });
        },
        good: n => ['Yes. Now say who you are.', 'Now the first P: position.', 'Then the second P: the problem.', 'And the last P: people.'][n],
        bad: n => ['Every distress call opens with the word Mayday, three times.', 'Say who is calling first.', 'Position comes first of the 3 Ps.', 'Problem comes before people.', 'People on board comes last.'][n],
        end: 'Mayday ×3, who you are, then position, problem, people.'
      });
    }
  });

  P.push({
    type: 'learn', title: 'Radio good habits',
    html: `<ul><li>VHF and HF radios need an operator's certificate of proficiency.</li><li><b>Listen</b> before you transmit, use your call sign, and keep it brief.</li><li>Make contact on the calling channel, then move to a working channel. Go back to 16 (or 88) afterwards.</li><li>Squelch only cuts background noise. Set it just past where the hiss stops.</li></ul>
<p>A <b>mobile phone is no substitute</b>. Others nearby can't hear your call, you are harder to find, and coverage and battery can fail.</p>`,
    art(svg, S) {
      A.paperBg(svg);
      const r = radio(svg, 300, 300, 1.8);
      const ph = A.g(svg, { transform: 'translate(600,300)' });
      A.rect(ph, -50, -95, 100, 190, { rx: 16, fill: '#1B232C' });
      A.rect(ph, -42, -80, 84, 150, { rx: 6, fill: '#3B4F64' });
      A.text(ph, 0, 0, 'NO', { size: 18, weight: 700, anchor: 'middle', fill: '#C9D6E2' });
      A.text(ph, 0, 22, 'SERVICE', { size: 18, weight: 700, anchor: 'middle', fill: '#C9D6E2' });
      A.tick(ph, 40, -90, 16, false);
      const others = A.g(svg);
      [[120, 120], [480, 110], [150, 500]].forEach(([x, y], k) => {
        const g = A.g(others, { transform: `translate(${x},${y})` });
        A.circle(g, 0, 0, 26, { fill: C.sea4 });
        A.path(g, 'M -17 0 L 17 0 L 11 10 L -11 10 Z', { fill: '#fff' }); A.rect(g, -8, -9, 12, 9, { rx: 2, fill: '#fff' });
        gsap.fromTo(g, { opacity: 0.3 }, { opacity: 1, duration: 0.6, yoyo: true, repeat: -1, delay: k * 0.3 });
      });
      A.tag(svg, 300, 470, 'EVERYONE NEARBY HEARS', { fill: C.stbd, size: 16 });
    }
  });

  P.push({
    type: 'learn', title: 'Log on, log off',
    html: `<p>Tell someone responsible where you are going and when you'll be back. The easiest is to <b>log on</b> by radio with your local marine rescue group, Water Police or radio base. Give them:</p>
<ul><li>the boat's name or rego, and number of people on board</li><li>departure time and place, destination and plans</li><li>how much fuel you have, and your expected return time.</li></ul>
<p>If plans change, call again. When you're back, <b>log off</b>, or a search may be started.</p>`,
    art(svg, S) {
      A.paperBg(svg);
      const tw = A.g(svg, { transform: 'translate(400,300)' });
      A.rect(tw, -60, -40, 120, 200, { fill: C.white, stroke: C.ink2, 'stroke-width': 3 });
      A.path(tw, 'M -80 -40 L 0 -100 L 80 -40 Z', { fill: C.port });
      A.line(tw, 0, -100, 0, -200, { stroke: C.ink2, 'stroke-width': 5 });
      A.text(tw, 0, 40, 'MARINE', { size: 18, weight: 700, anchor: 'middle', fill: C.ink, ls: '0.08em' });
      A.text(tw, 0, 62, 'RESCUE', { size: 18, weight: 700, anchor: 'middle', fill: C.ink, ls: '0.08em' });
      for (let k = 0; k < 3; k++) { const a = A.circle(svg, 400, 100, 20, { fill: 'none', stroke: C.port, 'stroke-width': 4 }); gsap.fromTo(a, { attr: { r: 10 }, opacity: 0.9 }, { attr: { r: 90 }, opacity: 0, duration: 2, repeat: -1, delay: k * 0.66 }); }
      A.tag(svg, 170, 500, 'LOG ON', { fill: C.stbd, size: 26 });
      A.tag(svg, 630, 500, 'LOG OFF!', { fill: C.port, size: 26 });
      A.text(svg, 400, 540, 'every trip', { font: 'body', size: 20, anchor: 'middle', fill: C.ink2 });
    }
  });

  P.push({
    type: 'watch', title: 'Logging on',
    html: `<p>This is how a log-on call sounds.</p>`,
    anim(svg, S) {
      A.paperBg(svg);
      const lay = A.g(svg);
      const msgs = [
        ['l', 'YOU', 'Marine Rescue, Marine Rescue, Marine Rescue. This is WA 1234 Z, WA 1234 Z, WA 1234 Z. Over.'],
        ['r', 'MARINE RESCUE', 'This is Marine Rescue. Please go to our working channel. Over.'],
        ['l', 'YOU', 'Going to the working channel.'],
        ['r', 'MARINE RESCUE', 'WA 1234 Z, WA 1234 Z, WA 1234 Z. Over.'],
        ['l', 'YOU', 'This is WA 1234 Z. I wish to log on. 3 people, left Hillarys at 0700, fishing 5 nm west, 80 litres of fuel, back by 1300. Over.']
      ];
      const tl = gsap.timeline();
      let y = 30;
      msgs.forEach(([s, w, t], k) => {
        const b = bubble(lay, y, t, s, w);
        gsap.set(b, { opacity: 0 });
        tl.to(b, { opacity: 1, duration: 0.4 }, 0.4 + k * 2.6);
        tl.from(b, { y: '+=14', duration: 0.4 }, '<');
        y += b._h + 16;
      });
      tl.to({}, { duration: 2.5 });
      return tl;
    }
  });

  P.push({
    type: 'check', title: 'Back home',
    q: 'Why is it so important to log off when you get back?',
    opts: ['So a search is not started for you', 'So your fuel use is recorded', 'So the radio battery is saved', 'So your rego can be renewed'], a: 0,
    why: 'If you don’t log off, the station will think you are overdue and may start a search.'
  });

  /* ---------- bailers and fire ---------- */
  P.push({
    type: 'learn', title: 'Bailer and bilge pump',
    html: `<p>All boats are recommended to carry a way of getting water out.</p>
<ul><li>A strong <b>bucket with 2 metres of rope</b> makes a great bailer, and can help fight fires too.</li><li>A <b>bilge pump</b> can be manual, electric or mechanical, and should pump about 4,000 litres an hour. An automatic electric pump needs an indicator to show when it is running.</li><li>Protect the pump intake with a strainer, and keep bilges clean so it doesn't block.</li></ul>`,
    art(svg, S) {
      sky(svg, '#DCE9EC', '#EEF2EC');
      const b = A.boatSide(svg, { len: 420, x: 400, y: 380, color: C.sea4 });
      const p = A.person(b.crew, { x: -60, y: -b._h * 0.8, s: 1.1, vest: true, fwdR: 30, fwdL: 30 });
      const bk = A.g(svg); bucket(bk, 0, 0, 0.5);
      const water = A.path(svg, '', { fill: 'none', stroke: '#7FB6D0', 'stroke-width': 8, 'stroke-linecap': 'round' });
      A.waterSide(svg, 384);
      const tl = gsap.timeline({ repeat: -1 });
      tl.fromTo(bk, { x: 350, y: 330 }, { x: 260, y: 270, duration: 0.6, ease: 'power2.out' });
      tl.call(() => water.setAttribute('d', 'M 240 280 Q 200 300 190 380'));
      tl.fromTo(water, { opacity: 1 }, { opacity: 0, duration: 0.6 });
      tl.to(bk, { x: 350, y: 330, duration: 0.6, ease: 'power2.in' });
    }
  });

  P.push({
    type: 'learn', title: 'Fire extinguishers',
    html: `<p>Extinguishers are recommended for all boats, especially those with an <b>inboard engine</b>, or cooking, heating or cooling systems that use <b>flames</b>.</p>
<p>A <b>dry powder</b> extinguisher is a good all-rounder. A bucket of water is fine for burning wood or paper, but <b>never use water on electrical or cooking oil fires</b>. A fire blanket is best for a pan of burning oil.</p>`,
    art(svg, S) {
      A.paperBg(svg);
      extinguisher(svg, 250, 320, 1.8);
      A.text(svg, 250, 490, 'DRY POWDER', { size: 22, weight: 700, anchor: 'middle', fill: C.ink, ls: '0.1em' });
      const pan = A.g(svg, { transform: 'translate(570,360)' });
      A.path(pan, 'M -80 0 L 80 0 L 66 40 L -66 40 Z', { fill: '#3B4F64' });
      A.rect(pan, 80, 6, 90, 12, { rx: 6, fill: '#1B232C' });
      const fl = A.g(pan);
      [[-40, 70], [0, 100], [40, 76]].forEach(([x, h]) => { const f = A.path(fl, `M ${x - 26} 0 Q ${x - 30} ${-h * 0.5} ${x} ${-h} Q ${x + 30} ${-h * 0.5} ${x + 26} 0 Z`, { fill: C.orange }); gsap.to(f, { scaleY: 0.8, transformOrigin: '50% 100%', duration: 0.3 + Math.random() * 0.2, yoyo: true, repeat: -1 }); });
      const no = A.g(svg, { transform: 'translate(570,180)' });
      A.circle(no, 0, 0, 52, { fill: C.white, stroke: C.port, 'stroke-width': 8 });
      A.path(no, 'M -14 -30 Q -28 0 -14 22 L 14 22 Q 28 0 14 -30 Z', { fill: '#7FB6D0' });
      A.line(no, -36, -36, 36, 36, { stroke: C.port, 'stroke-width': 8 });
      A.text(svg, 570, 460, 'NO WATER ON OIL FIRES', { size: 20, weight: 700, anchor: 'middle', fill: C.port, ls: '0.06em' });
    }
  });

  P.push({
    type: 'watch', title: 'Fighting a small fire',
    html: `<p>A 1 kg dry powder extinguisher empties in about 10 seconds, so use it well.</p>`,
    anim(svg, S) {
      A.paperBg(svg);
      A.rect(svg, 0, 470, 800, 130, { fill: C.paper3 });
      const exit = A.g(svg, { transform: 'translate(70,470)' });
      A.rect(exit, -10, -180, 90, 180, { fill: C.stbd });
      A.text(exit, 35, -150, 'EXIT', { size: 22, weight: 700, anchor: 'middle', fill: '#fff', ls: '0.1em' });
      const p = A.person(svg, { x: 300, y: 470, s: 1.5, side: true, fwdR: 70, fwdL: 60 });
      const ex = A.g(svg); extinguisher(ex, 0, 0, 0.45); gsap.set(ex, { x: 360, y: 380 });
      const fire = A.g(svg, { transform: 'translate(600,470)' });
      const flames = [[-40, 120], [0, 170], [40, 130], [-70, 80], [70, 90]].map(([x, h]) => { const f = A.path(fire, `M ${x - 30} 0 Q ${x - 34} ${-h * 0.5} ${x} ${-h} Q ${x + 34} ${-h * 0.5} ${x + 30} 0 Z`, { fill: C.orange, opacity: 0.95 }); gsap.to(f, { scaleY: 0.82, transformOrigin: '50% 100%', duration: 0.25 + Math.random() * 0.2, yoyo: true, repeat: -1 }); return f; });
      const spray = A.path(svg, 'M 390 400 Q 480 440 540 466', { fill: 'none', stroke: '#F4F2EE', 'stroke-width': 18, 'stroke-linecap': 'round', opacity: 0 });
      const cap = caption(svg);
      const tl = gsap.timeline();
      cap.show(tl, 0.2, 'Check it is the right type for the fire. Keep an exit behind you.');
      tl.to(exit, { scale: 1.06, transformOrigin: '50% 100%', duration: 0.3, yoyo: true, repeat: 3 }, 1);
      cap.show(tl, 3.4, 'Stay low, under the heat and smoke.');
      tl.to(p.g, { attr: { transform: 'translate(300,470) scale(1.5,1.2)' }, duration: 0.6 }, 3.8);
      tl.to(ex, { y: 410, duration: 0.6 }, 3.8);
      cap.show(tl, 5.6, 'Aim at the base of the fire, and sweep from side to side.');
      tl.to(spray, { opacity: 0.9, duration: 0.2 }, 6);
      tl.to(spray, { attr: { d: 'M 390 410 Q 500 460 660 466' }, duration: 0.5, yoyo: true, repeat: 5, ease: 'sine.inOut' }, 6.2);
      tl.to(flames, { scaleY: 0.15, opacity: 0, transformOrigin: '50% 100%', duration: 2.8, stagger: 0.2 }, 6.6);
      tl.to(spray, { opacity: 0, duration: 0.3 }, 9.4);
      cap.show(tl, 9.8, 'If you can’t control it, get out and close the area off.');
      tl.to({}, { duration: 2.5 });
      return tl;
    }
  });

  function gaugeArt(parent, x, y, s, o) {
    const g = A.g(parent, { transform: `translate(${x},${y}) scale(${s || 1})` });
    A.circle(g, 0, 0, 80, { fill: '#F4F7FA', stroke: '#1B232C', 'stroke-width': 8 });
    const arc = (a0, a1, col) => { const r = 58, p0 = a0 * Math.PI / 180, p1 = a1 * Math.PI / 180; return A.path(g, `M ${Math.cos(p0) * r} ${Math.sin(p0) * r} A ${r} ${r} 0 0 1 ${Math.cos(p1) * r} ${Math.sin(p1) * r}`, { fill: 'none', stroke: col, 'stroke-width': 16 }); };
    arc(-210, -150, C.port); arc(-150, -30, C.stbd); arc(-30, 30, C.port);
    A.text(g, 0, 44, 'CHARGE', { size: 14, weight: 700, anchor: 'middle', fill: C.ink2, ls: '0.14em' });
    const nd = A.g(g);
    A.path(nd, 'M -4 6 L 0 -60 L 4 6 Z', { fill: '#1B232C' });
    A.circle(g, 0, 0, 8, { fill: '#1B232C' });
    g.set = deg => gsap.to(nd, { rotation: deg, svgOrigin: '0 0', duration: 0.6, ease: 'back.out' });
    return g;
  }

  P.push({
    type: 'learn', title: 'Keep it ready',
    html: `<ul><li>Inspect extinguishers at least <b>every six months</b>.</li><li>The gauge should be in the <b>green</b>. Tap it lightly to check the needle isn't stuck.</li><li>Recharge it if the <b>security seal</b> is broken, the gauge is out of the green, or as soon as possible after any use.</li><li>Carbon dioxide extinguishers have no gauge: check them by weight.</li><li>Take dry powder extinguishers off the bracket now and then and shake them, so the powder doesn't pack down.</li></ul>`,
    art(svg, S) {
      A.paperBg(svg);
      extinguisher(svg, 230, 330, 2);
      const gg = gaugeArt(svg, 560, 260, 1.6);
      gg.set(-90);
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
      tl.to(gg, { x: '+=4', duration: 0.05, yoyo: true, repeat: 5 }, 1);
      A.tag(svg, 560, 440, 'IN THE GREEN', { fill: C.stbd, size: 18 });
    }
  });

  P.push({
    type: 'try', title: 'Ready or recharge?',
    html: `<p>Look at each extinguisher. Is it ready, or does it need recharging?</p>`,
    lockMsg: 'Check all four',
    build(svg, S, api) {
      A.paperBg(svg);
      extinguisher(svg, 230, 330, 2);
      const gg = gaugeArt(svg, 560, 250, 1.5);
      const seal = A.g(svg, { transform: 'translate(560,450)' });
      const tagT = A.text(svg, 560, 520, '', { size: 20, weight: 700, anchor: 'middle', fill: C.ink });
      rounds(api, S, {
        noun: 'Extinguisher',
        choices: ['Ready to use', 'Needs recharging'],
        items: [
          { g: -90, seal: true, t: 'Seal intact', a: 0, why: 'Gauge in the green and the seal is intact. Ready.' },
          { g: -175, seal: true, t: 'Seal intact', a: 1, why: 'The needle is out of the green. Recharge it.' },
          { g: -90, seal: false, t: 'Seal broken', a: 1, why: 'A broken security seal means it may have been used. Recharge it.' },
          { g: -100, seal: false, t: 'Used briefly last weekend', a: 1, why: 'Recharge as soon as possible after any use, even a short burst.' }
        ],
        show(it) {
          gg.set(it.g);
          seal.innerHTML = '';
          A.rect(seal, -40, -20, 80, 40, { rx: 8, fill: it.seal ? C.stbd : C.port });
          if (it.seal) A.path(seal, 'M -16 0 L -4 10 L 16 -10', { stroke: '#fff', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' });
          else A.path(seal, 'M -12 -10 L 12 10 M 12 -10 L -12 10', { stroke: '#fff', 'stroke-width': 5, 'stroke-linecap': 'round' });
          tagT.textContent = it.t;
        },
        end: 'Green gauge, seal intact, never used: ready.'
      });
    }
  });

  /* ---------- anchors ---------- */
  function anchorShape(parent, x, y, s, kind) {
    const g = A.g(parent, { transform: `translate(${x},${y}) scale(${s || 1})` });
    const st = { fill: '#596470', stroke: '#2F3A45', 'stroke-width': 2, 'stroke-linejoin': 'round' };
    if (kind === 'danforth') {
      A.rect(g, -4, -70, 8, 110, st); A.rect(g, -50, 30, 100, 10, st);
      A.path(g, 'M -6 30 L -40 -20 L -24 -24 L -2 20 Z', st); A.path(g, 'M 6 30 L 40 -20 L 24 -24 L 2 20 Z', st);
    } else if (kind === 'plough') {
      A.rect(g, -4, -70, 8, 70, Object.assign({}, st, { transform: 'rotate(-10)' }));
      A.path(g, 'M 0 0 Q -46 10 -56 50 L 0 30 L 56 50 Q 46 10 0 0 Z', st);
    } else if (kind === 'bruce') {
      A.path(g, 'M -6 -70 L 6 -70 L 10 10 L -10 10 Z', st);
      A.path(g, 'M -60 30 Q -40 0 0 6 Q 40 0 60 30 Q 30 50 0 40 Q -30 50 -60 30 Z', st);
    } else if (kind === 'admiralty') {
      A.rect(g, -4, -80, 8, 130, st); A.rect(g, -50, -64, 100, 8, st);
      A.path(g, 'M -60 10 Q -50 50 0 50 Q 50 50 60 10', { fill: 'none', stroke: '#596470', 'stroke-width': 9, 'stroke-linecap': 'round' });
      A.path(g, 'M -68 18 L -60 0 L -48 14 Z M 68 18 L 60 0 L 48 14 Z', st);
    } else {
      A.rect(g, -4, -70, 8, 100, st);
      [-50, -20, 20, 50].forEach(dx => A.path(g, `M 0 30 Q ${dx * 0.6} 30 ${dx} ${0}`, { fill: 'none', stroke: '#596470', 'stroke-width': 7, 'stroke-linecap': 'round' }));
    }
    A.circle(g, 0, -76, 8, { fill: 'none', stroke: '#596470', 'stroke-width': 5 });
    return g;
  }

  P.push({
    type: 'learn', title: 'Choosing an anchor',
    html: `<p>Carry an efficient anchor and line at all times. Choose one that holds in all seabeds.</p>
<ul><li><b>Danforth</b>: common on trailer boats, great in sand.</li><li><b>Plough (CQR)</b>: similar holding, better in mud.</li><li><b>Bruce</b>: great for bowsprit stowage.</li><li><b>Admiralty</b>: best at piercing weed, but awkward to stow.</li><li><b>Reef or grapnel</b>: an extra for rocky bottoms. Its tines straighten so it pulls free. Not suitable as your only anchor.</li></ul>`,
    art(svg, S) {
      A.paperBg(svg);
      [['danforth', 'DANFORTH'], ['plough', 'PLOUGH'], ['bruce', 'BRUCE'], ['admiralty', 'ADMIRALTY'], ['reef', 'REEF']].forEach(([k, l], i) => {
        const x = i < 3 ? 160 + i * 240 : 280 + (i - 3) * 240, y = i < 3 ? 190 : 430;
        const g = A.g(svg);
        A.rect(g, x - 100, y - 120, 200, 210, { rx: 18, fill: C.white, stroke: C.line, 'stroke-width': 1.5 });
        anchorShape(g, x, y, 1, k);
        A.text(g, x, y + 76, l, { size: 18, weight: 700, anchor: 'middle', fill: C.ink2, ls: '0.1em' });
        gsap.from(g, { opacity: 0, y: 14, duration: 0.4, delay: 0.15 + i * 0.15 });
      });
    }
  });

  P.push({
    type: 'learn', title: 'The anchor line',
    html: `<p>Use rope with a length of <b>chain</b> joining it to the anchor. The chain's weight gives a flatter pull, absorbs shocks and stops the rope chafing.</p>
<p><b>Nylon</b> rope is best: strong and stretchy. As a guide, a boat up to 5 m carries 50–70 m of 8 mm rope and 3 m of chain.</p>
<p>Join chain to anchor and rope with <b>shackles</b>, with the pins <b>moused</b> (wired shut). Tie the very end of the line, the <span class="term">bitter end</span>, to the boat so you can't lose it all.</p>`,
    art(svg, S) {
      A.paperBg(svg);
      const a = anchorShape(svg, 140, 380, 1.1, 'danforth');
      gsap.set(a, { attr: { transform: 'translate(140,380) scale(1.1) rotate(-90)' } });
      const ch = A.g(svg);
      for (let k = 0; k < 12; k++) A.el('ellipse', { cx: 236 + k * 22, cy: 380, rx: 13, ry: k % 2 ? 4 : 8, fill: 'none', stroke: '#596470', 'stroke-width': 4 }, ch);
      const sh = (x) => { const g = A.g(svg, { transform: `translate(${x},380)` }); A.path(g, 'M -12 -12 Q 0 -24 12 -12 L 12 12 L -12 12 Z', { fill: 'none', stroke: C.buoy, 'stroke-width': 5 }); A.line(g, -16, 12, 16, 12, { stroke: '#1B232C', 'stroke-width': 4 }); return g; };
      sh(218); sh(504);
      A.path(svg, 'M 516 380 C 580 380 600 300 660 300 C 720 300 700 220 740 200', { fill: 'none', stroke: '#F0E6CF', 'stroke-width': 9, 'stroke-linecap': 'round' });
      A.path(svg, 'M 516 380 C 580 380 600 300 660 300 C 720 300 700 220 740 200', { fill: 'none', stroke: '#C8B48A', 'stroke-width': 9, 'stroke-dasharray': '3 6' });
      A.tag(svg, 360, 330, 'CHAIN', { fill: C.ink, size: 16 });
      A.tag(svg, 640, 260, 'NYLON ROPE', { fill: C.ink, size: 16 });
      A.tag(svg, 360, 450, 'SHACKLES, PINS MOUSED', { fill: C.buoy, color: C.ink, size: 15 });
      A.tag(svg, 700, 160, 'BITTER END TIED ON', { fill: C.port, size: 15 });
    }
  });

  /* side-view anchoring scene. returns controls */
  function anchorScene(svg, S, o) {
    o = o || {};
    const SURF = 290, BED = 350;
    sky(svg, '#DCE9EC', '#EEF2EC');
    A.rect(svg, 0, SURF, 800, BED - SURF, { fill: '#7FB2C4' });
    A.path(svg, `M 0 ${BED} Q 200 ${BED - 6} 400 ${BED} T 800 ${BED} L 800 600 L 0 600 Z`, { fill: C.sand });
    const line = A.path(svg, '', { fill: 'none', stroke: '#8A6F44', 'stroke-width': 4, 'stroke-linecap': 'round' });
    const anc = A.g(svg); anchorShape(anc, 0, 0, 0.42, 'danforth');
    const bx0 = o.bx || 700;
    const boat = A.boatSide(svg, { len: 150, x: bx0, y: SURF + 2, color: C.port, flip: true });
    A.rect(svg, 0, SURF + 3, 800, 14, { fill: '#7FB2C4', opacity: 0.55 });
    A.line(svg, 0, SURF + 3, 800, SURF + 3, { stroke: 'rgba(255,255,255,0.8)', 'stroke-width': 2.5 });
    for (let i = 0; i < 18; i++) A.path(svg, `M ${i * 47 + 10} ${BED + 30 + (i % 3) * 40} q 6 -4 12 0`, { fill: 'none', stroke: '#CDB98B', 'stroke-width': 2.5, 'stroke-linecap': 'round' });
    const st = { bx: bx0, ax: bx0 - 60, ay: SURF + 10, L: 0 };
    const put = () => {
      boat.setAttribute('transform', `translate(${st.bx},${SURF + 2}) scale(-1,1)`);
      const bowX = st.bx - 70, bowY = SURF - 22;
      anc.setAttribute('transform', `translate(${st.ax},${st.ay - 8}) rotate(-90)`);
      const midX = (bowX + st.ax) / 2, sag = Math.min(60, Math.abs(bowX - st.ax) * 0.12);
      line.setAttribute('d', `M ${bowX} ${bowY} Q ${midX + 30} ${Math.min(BED, (bowY + st.ay) / 2 + sag)} ${st.ax + 16} ${st.ay - 4}`);
    };
    put();
    S.loop(put);
    return { st, SURF, BED, boat };
  }

  P.push({
    type: 'learn', title: 'Enough scope',
    html: `<p>The key to anchoring is letting out enough line. <span class="term">Scope</span> is the length of line compared with the depth of water.</p>
<ul><li>Calm: <b>5 : 1</b></li><li>Fair: <b>7 : 1</b></li><li>Moderate: <b>9 : 1</b></li></ul>
<p>So in 6 m of water on a calm day, let out at least 30 m. Strong wind, current or chop need more.</p>`,
    art(svg, S) {
      const sc = anchorScene(svg, S, { bx: 720 });
      const k = 60 / 6;
      const tags = [5, 7, 9].map(s => A.tag(svg, 400, 80, `${s} : 1  =  ${s * 6} m of line in 6 m`, { fill: C.ink, size: 20 }));
      gsap.set(tags, { opacity: 0 });
      A.line(svg, 760, sc.SURF, 760, sc.BED, { stroke: C.ink, 'stroke-width': 2 });
      A.text(svg, 768, (sc.SURF + sc.BED) / 2 + 6, '6 m', { size: 16, weight: 700, fill: C.ink });
      const tl = gsap.timeline({ repeat: -1 });
      [5, 7, 9].forEach((s, i) => {
        const hx = Math.sqrt(s * s - 1) * 6 * k * 0.98;
        tl.to(sc.st, { ax: 650 - hx, ay: sc.BED, duration: 1.4, ease: 'power2.inOut' });
        tl.to(tags[i], { opacity: 1, duration: 0.3 }, '<0.6');
        tl.to({}, { duration: 1.6 });
        tl.to(tags[i], { opacity: 0, duration: 0.3 });
      });
      gsap.set(sc.st, { ax: 600, ay: sc.BED });
    }
  });

  P.push({
    type: 'try', title: 'Set the scope',
    html: `<p>Let out the right amount of anchor line for the depth and weather, then drop anchor.</p>`,
    lockMsg: 'Anchor safely three times',
    build(svg, S, api) {
      const sc = anchorScene(svg, S, { bx: 740 });
      const dl = A.line(svg, 770, sc.SURF, 770, sc.BED, { stroke: C.ink, 'stroke-width': 2 });
      const dt = A.text(svg, 776, (sc.SURF + sc.BED) / 2 + 6, '', { size: 16, weight: 700, fill: C.ink });
      let info = null;
      const R = [{ w: 'Calm', d: 6, s: 5 }, { w: 'Fair', d: 5, s: 7 }, { w: 'Moderate', d: 4, s: 9 }];
      let i = 0, L = 0, busy = false;
      const ui = document.createElement('div');
      ui.innerHTML = `<label for="ln" style="font-weight:700">Line out: <span id="lnv">10</span> m</label><input id="ln" class="range" type="range" min="5" max="60" step="1" value="10"><div class="chips"><button class="chip" id="drop">Drop anchor</button></div><div class="status"></div>`;
      api.task.appendChild(ui);
      const rng = ui.querySelector('#ln'), lv = ui.querySelector('#lnv'), stt = ui.querySelector('.status');
      const kpx = () => 60 / R[i].d;
      const draw = () => {
        L = +rng.value; lv.textContent = L;
        const hx = Math.sqrt(Math.max(0, L * L - R[i].d * R[i].d)) * kpx() * 0.98;
        const ax = Math.max(14, 668 - hx);
        gsap.to(sc.st, { ax, ay: sc.BED, duration: 0.25 });
      };
      const setRound = () => {
        const r = R[i];
        rng.max = r.d * 12; rng.value = r.d * 2;
        if (info) info.remove();
        info = A.tag(svg, 400, 60, `${r.w} weather · ${r.d} m deep`, { fill: C.ink, size: 20 });
        dt.textContent = r.d + ' m';
        stt.textContent = `Anchorage ${i + 1} of ${R.length}`;
        draw();
      };
      rng.oninput = () => { if (!busy) { api.hush(); draw(); } };
      ui.querySelector('#drop').onclick = () => {
        if (busy || i >= R.length) return;
        const r = R[i], s = L / r.d;
        if (s < r.s) {
          api.say(`That's only about ${s.toFixed(1)} : 1. In ${r.w.toLowerCase()} weather you need at least ${r.s} : 1, so ${r.s * r.d} m. Watch the anchor drag.`, 'bad');
          busy = true;
          gsap.to(sc.st, { ax: '+=60', duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: 1, onComplete: () => busy = false });
        } else if (s > r.s + 2) {
          api.say(`That's ${s.toFixed(1)} : 1, much more than you need. A huge swing circle could hit other boats. Aim for about ${r.s} : 1.`, 'bad');
        } else {
          busy = true;
          api.say(`${L} m in ${r.d} m is ${s.toFixed(1)} : 1. Good for ${r.w.toLowerCase()} weather.`, 'good');
          S.after(1900, () => { busy = false; i++; if (i < R.length) { api.hush(); setRound(); } else { stt.textContent = ''; ui.querySelector('.chips').style.display = 'none'; api.done('Calm 5 : 1, fair 7 : 1, moderate 9 : 1. More wind, more line.'); } });
        }
      };
      setRound();
    }
  });

  P.push({
    type: 'watch', title: 'Dropping anchor',
    html: `<p>Watch the steps for setting an anchor.</p>`,
    anim(svg, S) {
      const sc = anchorScene(svg, S, { bx: 520 });
      gsap.set(sc.st, { bx: 520, ax: 450, ay: sc.SURF - 30 });
      const wind = A.g(svg);
      for (let i = 0; i < 4; i++) { const l = A.line(wind, 0, 0, 50, 0, { stroke: '#fff', 'stroke-width': 3, 'stroke-linecap': 'round' }); gsap.fromTo(l, { x: -60, y: 130 + i * 30 }, { x: 860, duration: 1.6, repeat: -1, delay: i * 0.4, ease: 'none' }); }
      A.tag(svg, 90, 230, 'WIND', { fill: C.sea4, size: 15 });
      const cap = caption(svg);
      const tl = gsap.timeline();
      cap.show(tl, 0.2, 'Check the weather. Pick sand or firm mud, with room to swing and enough depth at low tide.');
      cap.show(tl, 3.4, 'Head slowly into the wind. Neutral, then reverse until the boat moves astern.');
      tl.to(sc.st, { bx: 560, ax: 490, duration: 1.4, ease: 'power1.in' }, 3.8);
      cap.show(tl, 6, 'Lower the anchor to the bottom. Don’t throw it.');
      tl.to(sc.st, { ay: sc.BED, duration: 1.6, ease: 'power1.in' }, 6.2);
      cap.show(tl, 8.4, 'Pay out the line as the boat drifts back with the wind.');
      tl.to(sc.st, { bx: 760, duration: 3, ease: 'none' }, 8.6);
      cap.show(tl, 11.8, 'Secure the line. A short, gentle burst of reverse helps bed the anchor in.');
      tl.to(sc.st, { bx: 772, duration: 0.5, yoyo: true, repeat: 1 }, 12.4);
      tl.to({}, { duration: 2 });
      return tl;
    }
  });

  P.push({
    type: 'learn', title: 'Is it dragging?',
    html: `<p>Once the anchor is set, take a few bearings, or line up two fixed objects (a <span class="term">transit</span>), and keep checking them.</p>
<p>If you drift off them, put your hand on the line. A dragging anchor feels like it is <b>bouncing</b> along the bottom.</p>
<p>If it is dragging and you have room, <b>let out more line</b>. A flatter angle usually helps the anchor bite.</p>`,
    art(svg, S) {
      sky(svg, '#DCE9EC', '#EEF2EC');
      A.rect(svg, 0, 360, 800, 240, { fill: '#7FB2C4' });
      // shore transit
      A.path(svg, 'M 0 360 L 0 300 Q 200 280 400 300 T 800 290 L 800 360 Z', { fill: C.land });
      const t2 = A.g(svg); A.rect(t2, 389, 150, 12, 150, { fill: '#596470' }); A.path(t2, 'M 380 150 L 395 124 L 410 150 Z', { fill: C.buoy, stroke: '#596470', 'stroke-width': 2 });
      const t1 = A.g(svg); A.rect(t1, 380, 230, 30, 70, { fill: C.white }); A.path(t1, 'M 376 230 L 395 205 L 414 230 Z', { fill: C.port });
      const sight = A.line(svg, 395, 260, 395, 520, { stroke: C.ink, 'stroke-width': 2, 'stroke-dasharray': '8 6' });
      const eye = A.g(svg); A.circle(eye, 0, 0, 16, { fill: C.white, stroke: C.ink, 'stroke-width': 3 }); A.circle(eye, 0, 0, 6, { fill: C.ink });
      gsap.set(eye, { x: 395, y: 530 });
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
      tl.to(t2, { x: 120, duration: 3, ease: 'sine.inOut' }, 1.2);
      const lbl = A.tag(svg, 400, 100, 'THE MARKS HAVE MOVED: DRAGGING', { fill: C.port, size: 17 });
      gsap.set(lbl, { opacity: 0 });
      tl.to(lbl, { opacity: 1, duration: 0.3 });
      tl.to({}, { duration: 1.6 });
      tl.to([t2], { x: 0, duration: 0.8 });
      tl.to(lbl, { opacity: 0, duration: 0.3 }, '<');
      A.text(svg, 400, 584, 'Front and back marks in line = holding', { font: 'body', size: 17, anchor: 'middle', fill: C.white });
    }
  });

  P.push({
    type: 'learn', title: 'Getting it back',
    html: `<ul><li>Don't haul the boat up to the anchor. Motor slowly towards it while someone, or a winch, takes in the line.</li><li>When the line is vertical, secure it and let the engine break the anchor out.</li><li>If it's <b>snagged</b>, slacken off and try pulling from different directions.</li><li>Coil rope and chain <b>clockwise</b> into the well, with the anchor stowed separately, ready to run with no kinks.</li></ul>`,
    art(svg, S) {
      const sc = anchorScene(svg, S, { bx: 760 });
      gsap.set(sc.st, { bx: 760, ax: 260, ay: sc.BED });
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
      tl.to(sc.st, { bx: 340, duration: 4, ease: 'sine.inOut' });
      tl.to(sc.st, { ax: 268, ay: sc.SURF - 26, duration: 1.4, ease: 'power1.inOut' });
      tl.to({}, { duration: 1 });
      tl.set(sc.st, { bx: 760, ax: 260, ay: sc.BED });
    }
  });

  P.push({
    type: 'learn', title: 'Where not to anchor',
    html: `<p>Anchoring is <b>prohibited</b>, unless you are in distress or have DoT permission:</p>
<ul><li>in any <b>channel</b>, fairway, passage or on <b>leading lines</b></li><li>near <b>submarine cables</b> and pipelines marked on charts.</li></ul>
<p>Avoid <b>mooring areas</b>, where you could foul moorings or hit boats, and keep well away from where ships pass in ports. Avoid weed beds too.</p>`,
    art(svg, S) {
      S.seaBg(svg);
      A.path(svg, 'M 300 -10 L 500 -10 L 500 610 L 300 610 Z', { fill: 'rgba(23,63,85,0.18)' });
      for (let y = 40; y < 600; y += 110) { A.beacon(svg, 300, y, 'port'); A.beacon(svg, 500, y + 55, 'stbd'); }
      A.tag(svg, 400, 300, 'CHANNEL', { fill: C.deep, size: 16 });
      A.path(svg, 'M 560 600 C 600 400 680 300 820 260', { fill: 'none', stroke: C.buoy, 'stroke-width': 4, 'stroke-dasharray': '14 8' });
      A.tag(svg, 690, 360, 'CABLE', { fill: C.buoy, color: C.ink, size: 15 });
      [[80, 120], [150, 90], [110, 200], [190, 170], [70, 290], [170, 270]].forEach(([x, y]) => A.mooringBuoy(svg, x, y));
      A.tag(svg, 130, 360, 'MOORINGS', { fill: C.ink, size: 15 });
      const no = (x, y) => { const g = A.g(svg, { transform: `translate(${x},${y})` }); A.circle(g, 0, 0, 30, { fill: C.white, stroke: C.port, 'stroke-width': 6 }); anchorIcon(g, 0, 4, 0.3); A.line(g, -20, -20, 20, 20, { stroke: C.port, 'stroke-width': 6 }); gsap.fromTo(g, { scale: 0.9, transformOrigin: '50% 50%' }, { scale: 1.08, duration: 0.8, yoyo: true, repeat: -1 }); };
      no(400, 200); no(640, 430); no(130, 450);
    }
  });

  P.push({
    type: 'check', title: 'Choosing a spot',
    q: 'Where are you allowed to anchor, if you are not in distress?',
    opts: ['On sand clear of channels and cables', 'In the middle of a marked channel', 'On the leading line into a harbour', 'Over a marked submarine cable'], a: 0,
    why: 'Anchoring is prohibited in channels, on leading lines and near submarine cables. Sand away from them is ideal.'
  });

  P.push({
    type: 'learn', title: 'More gear worth carrying',
    html: `<p>Also think about carrying charts, a compass, water, food, extra clothing, sun protection and spare anchor line, plus:</p>
<ul><li>a <b>tool kit</b> for the checks and repairs in your motor's handbook</li><li>a <b>first aid kit</b> in a watertight box, with a first aid booklet</li><li>a <b>fire blanket</b>, especially with a galley</li><li>a <b>life buoy</b> ready to throw, ideally with a light</li><li>a buoyant, waterproof <b>torch</b> with spare batteries</li><li>a <b>life raft</b> for longer offshore trips.</li></ul>`,
    art(svg, S) {
      A.paperBg(svg);
      const it = [
        g => { A.rect(g, -60, -30, 120, 70, { rx: 8, fill: C.port }); A.rect(g, -24, -46, 48, 20, { rx: 6, fill: 'none', stroke: '#1B232C', 'stroke-width': 6 }); }, 'TOOL KIT',
        g => { A.rect(g, -60, -40, 120, 84, { rx: 12, fill: C.white, stroke: C.stbd, 'stroke-width': 5 }); A.rect(g, -8, -26, 16, 56, { fill: C.stbd }); A.rect(g, -28, -6, 56, 16, { fill: C.stbd }); }, 'FIRST AID',
        g => { A.rect(g, -50, -50, 100, 100, { rx: 8, fill: C.port }); A.rect(g, -40, 20, 80, 20, { rx: 4, fill: '#fff' }); A.line(g, -10, 50, -10, 66, { stroke: '#1B232C', 'stroke-width': 4 }); A.line(g, 10, 50, 10, 66, { stroke: '#1B232C', 'stroke-width': 4 }); }, 'FIRE BLANKET',
        g => { A.circle(g, 0, 0, 52, { fill: 'none', stroke: C.orange, 'stroke-width': 22 }); [0, 90, 180, 270].forEach(a => A.rect(g, -6, -62, 12, 22, { fill: '#fff', transform: `rotate(${a})` })); }, 'LIFE BUOY',
        g => { A.rect(g, -24, -50, 48, 90, { rx: 10, fill: C.buoy }); A.rect(g, -32, -64, 64, 22, { rx: 6, fill: '#1B232C' }); A.path(g, 'M -32 -64 L -80 -110 L 80 -110 L 32 -64 Z', { fill: '#FFF6DC', opacity: 0.6 }); }, 'TORCH',
        g => { A.el('ellipse', { cx: 0, cy: 20, rx: 64, ry: 24, fill: C.orange }, g); A.path(g, 'M -50 14 Q 0 -80 50 14 Z', { fill: C.orange, stroke: '#A84F17', 'stroke-width': 3 }); }, 'LIFE RAFT'
      ];
      for (let k = 0; k < 6; k++) {
        const x = 160 + (k % 3) * 240, y = 180 + Math.floor(k / 3) * 250;
        const g = A.g(svg, { transform: `translate(${x},${y})` });
        A.rect(g, -100, -110, 200, 210, { rx: 18, fill: C.white, stroke: C.line, 'stroke-width': 1.5 });
        it[k * 2](g);
        A.text(g, 0, 86, it[k * 2 + 1], { size: 17, weight: 700, anchor: 'middle', fill: C.ink2, ls: '0.1em' });
        gsap.from(g, { opacity: 0, y: '+=14', duration: 0.4, delay: 0.15 + k * 0.12 });
      }
    }
  });

  /* ---------- workbook self-test ---------- */
  const R = (n, q, opts, a, why) => P.push({ type: 'review', n, of: 9, title: 'Workbook self-test', q, opts, a, why });
  R(1, 'Where should safety equipment, such as flares, EVDS and lifejackets be stowed in a vessel?',
    ['In readily accessible positions protected from the sea and weather.', 'In locked compartments.', 'Away from passengers who might accidentally damage them.', 'No particular place as long as they are on board the vessel.'], 0,
    'Safety gear must be easy to reach, and protected from the sea and weather.');
  R(2, 'What items of safety equipment MUST be carried on a registrable vessel operating in unprotected waters, more than 4 nautical miles from the coast?',
    ['Two Orange and Two Red hand held flares or EVDS.', 'GPS enabled EPIRB or PLB.', 'HF or VHF marine radio.', 'All of the above.'], 3,
    'Beyond 4 nm in unprotected waters a registrable boat needs flares (or EVDS), a beacon and a marine radio, plus lifejackets.');
  R(3, 'Fire extinguishers are recommended to be carried for?',
    ['Vessels propelled by an inboard motor or with cooking, heating or cooling systems that use flames.', 'Vessels propelled by an outboard.', 'Vessels without a fire blanket.', 'Vessels propelled by an electric motor.'], 0,
    'They are especially recommended for inboard engines and anything using flames.');
  R(4, 'When anchoring a vessel, you should consider:',
    ['The length of anchor line.', 'The proximity of other vessels.', 'Any drift.', 'All of the above.'], 3,
    'Scope, swing room near other boats, and drift all matter when anchoring.');
  R(5, 'How many lifejackets must be carried on board a vessel in unprotected waters?',
    ['One for each person.', 'Four.', 'Six.', 'At least one.'], 0,
    'One lifejacket for every person on board.');
  R(6, 'Other than using your radio in a distress situation, what is the most effective way of attracting attention at night?',
    ['Waving arms up and down.', 'Letting off an orange smoke flare.', 'Using an EVDS or Red handheld flare.', 'All of the above.'], 2,
    'Smoke can’t be seen at night. A red flare or an EVDS can.');
  R(7, 'When should you activate your EPIRB or PLB?',
    ['When the motor has cut out and it won’t restart.', 'Only where human life is in grave and imminent danger.', 'If you have run out of fuel.', 'All of the above.'], 1,
    'Beacons are only for grave and imminent danger to human life.');
  R(8, 'When must an approved marine band radio be carried?',
    ['On all vessels on all waters.', 'On all registrable vessels operating beyond 4 nautical miles from shore.', 'On all non-registrable vessels operating beyond 4 nautical miles from shore.', 'On all vessels operating in unprotected waters.'], 1,
    'Registrable vessels more than 4 nm from shore must carry a VHF or HF marine radio.');
  R(9, 'What do the words “Pan Pan” indicate when said at the start of a radio message?',
    ['A very urgent message follows concerning the safety of a vessel or person.', 'A vessel is in grave and imminent danger.', 'A navigational warning is about to be announced.', 'All of the above.'], 0,
    'Pan Pan is the urgency call. Mayday is distress; Securite is a navigation warning.');

  SR.chapter({
    id: 7,
    title: 'Safety Equipment',
    intro: 'Protected and unprotected waters, lifejackets, beacons, flares, radio calls, logging on, fire, anchoring and more.',
    cover(svg, S) {
      sky(svg, '#DCE9EC', '#F2ECDD');
      const j = lifejacket(svg, 230, 320, 1.2, '100');
      const e = gear.epirb(svg, 420, 330, 1.05);
      gear.flare(svg, 560, 330, 1.1, 'red'); gear.flare(svg, 610, 330, 1.1, 'orange');
      gsap.to(e.strobe, { attr: { fill: '#FFFFFF' }, opacity: 0.3, duration: 0.12, repeat: -1, yoyo: true, repeatDelay: 1.4 });
      gsap.to(j, { y: '-=8', duration: 1.8, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    },
    pages: P
  });
})();
