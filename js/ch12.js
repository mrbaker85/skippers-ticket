/* Chapter 12: Practice Theory Test (40 questions, 34 to pass). The only scored part of the app. */
(function () {
  const A = SR.art, C = A.C;
  const FORM_URL = ''; // optional results form link (score only)
  const TKEY = 'skipperReady.test';
  const PASS = 34;

  /* q, opts (first is correct), why, ch */
  const Q = [
    [1, 'Who must hold an RST to be in charge of a boat?', ['Anyone in charge of a boat with a motor over 6 hp', 'Anyone in charge of a boat longer than 4.8 metres', 'Anyone in charge of a boat in unprotected waters', 'Anyone in charge of a boat that carries passengers'], 'The RST is about the motor: over 6 hp (4.5 kW).'],
    [1, 'What is the youngest age you can hold an RST?', ['14 years', '12 years', '16 years', '17 years'], 'You can hold an RST from 14.'],
    [1, 'Jess is 15 and holds an RST. What can she do?', ['Skipper in daylight at 8 knots or less', 'Skipper at night if an adult is on board', 'Skipper at any speed in protected waters', 'Tow a water skier during daylight hours'], 'From 14 to under 16, you can only skipper in daylight at 8 knots or less.'],
    [2, 'What is the speed limit within 50 metres of a person in the water?', ['8 knots', '5 knots', '10 knots', '12 knots'], 'Within 50 m of a person in the water, the limit is 8 knots.'],
    [2, 'What is the blood alcohol limit for a skipper in WA?', ['0.05', '0.00', '0.02', '0.08'], 'The limit is 0.05, the same as for driving.'],
    [2, 'You see a boat flying a blue and white Flag A. What should you do?', ['Keep 50 m clear, or go as slowly as possible with a good lookout', 'Pass close by so the crew can hail you if they need help', 'Sound one prolonged blast and keep your course and speed', 'Stay at least 10 m away and keep to your normal speed'], 'Flag A means divers are down.'],
    [2, 'Who must be on board when you tow a water skier?', ['The driver and an observer aged 14 or over', 'The driver and an observer of any age at all', 'Only the driver, if they hold a current RST', 'The driver and an observer aged 18 or over'], 'Skiing takes three: the driver, an observer at least 14, and the skier.'],
    [2, 'Your passengers finish lunch. What do you do with the plastic wrappers?', ['Keep them on board and bin them ashore', 'Throw them overboard once well offshore', 'Sink them with a weight so they don’t float', 'Burn them in a bucket at the back of the boat'], 'Store rubbish on board and take it home. Plastics must never go over the side.'],
    [2, 'How far must a PWC stay from other PWCs when freestyling or wake jumping?', ['30 metres', '10 metres', '20 metres', '50 metres'], 'Stay 30 m from other PWCs and 50 m from other vessels and people in the water.'],
    [3, 'The compass bearing to an approaching boat stays the same. What does that mean?', ['You are on a collision course', 'It will pass safely ahead of you', 'It will pass safely behind you', 'It has stopped in the water'], 'A steady bearing means risk of collision.'],
    [3, 'A power boat is crossing from your starboard side. What do you do?', ['Give way, and pass behind it', 'Hold your course and speed', 'Speed up to cross ahead of it', 'Sound five short blasts and hold on'], 'A power boat on your starboard side has right of way. You give way.'],
    [3, 'Two power boats are meeting head on. What should they do?', ['Both turn to starboard', 'Both turn to port', 'The smaller boat stops', 'Both slow and hold course'], 'Head on, both vessels alter course to starboard.'],
    [3, 'A boat ahead gives three short blasts. What does it mean?', ['My engines are going astern', 'I am altering course to port', 'I am altering course to starboard', 'I don’t understand your intentions'], 'Three short blasts: “My engines are going astern.”'],
    [3, 'You are catching up to a slower boat. Who keeps clear?', ['You do, as the overtaking boat', 'The slower boat, as it is ahead', 'Whichever boat is smaller', 'Whichever boat is on the left'], 'The overtaking vessel always keeps clear.'],
    [3, 'A yacht under sail alone is crossing from your port side. What do you do?', ['Give way to the yacht', 'Hold your course and speed', 'Sound one short blast and go', 'Turn to port to pass ahead'], 'Power gives way to sail, whichever side it is on.'],
    [4, 'At night you see only a red light on a moving boat. What are you seeing?', ['Its port side', 'Its starboard side', 'Its stern', 'A boat at anchor'], 'The red sidelight is on the port side.'],
    [4, 'You anchor your 6 m boat overnight. What light must you show?', ['One all-round white light', 'Red and green sidelights', 'A white masthead light', 'Two all-round red lights'], 'Vessels under 50 m at anchor show one all-round white light.'],
    [5, 'Coming into harbour from sea, where do you keep the green starboard marks?', ['On your starboard side', 'On your port side', 'On either side', 'Dead ahead of you'], 'Heading in from sea, keep starboard marks on your starboard side.'],
    [5, 'You see a north cardinal mark. Where is the safe water?', ['To the north of the mark', 'To the south of the mark', 'All around the mark', 'To the east of the mark'], 'Cardinal marks are named for the side the safe water is on.'],
    [5, 'A mark is black with a red band and two black balls on top. What is it?', ['An isolated danger with safe water all around', 'A safe water mark at the start of a channel', 'A special mark showing a restricted area', 'A port lateral mark on the left of a channel'], 'Isolated danger: the danger is at the mark, with safe water around it.'],
    [5, 'What does a safe water mark look like?', ['Red and white vertical stripes, red ball on top', 'Black and yellow bands, two cones on top', 'Yellow all over, a yellow cross on top', 'Green all over, a green cone on top'], 'Safe water marks have red and white vertical stripes and a red ball topmark.'],
    [6, 'How often should your outboard be serviced?', ['At least once a year', 'Every five years', 'Only when it breaks', 'Every second year'], 'Have it serviced by a workshop at least once a year, even with little use.'],
    [6, 'There’s no water coming from the telltale. What should you do?', ['Stop the motor and find out why', 'Keep going and check it at home', 'Run it faster to push water through', 'Tilt the motor up and keep going'], 'No telltale means no cooling. Stop before the motor overheats.'],
    [6, 'You drain the gearbox oil and it looks milky. What does it mean?', ['Water has got into the gearbox', 'The oil is new and still settling', 'The gearbox has too much oil in it', 'The fuel mix is far too rich'], 'Milky oil means water in the gearbox. Take it to a service centre.'],
    [7, 'Which of these is unprotected water?', ['Lake Argyle', 'A river estuary', 'Inside a breakwater', '200 m off a beach'], 'Lake Argyle and Cambridge Gulf are treated as unprotected waters.'],
    [7, 'In unprotected waters, who must wear a lifejacket on any size of boat?', ['Children aged 1 to 12', 'Only the skipper', 'Adults over 60', 'Nobody, if carried'], 'Children aged 1 to 12 must wear one in unprotected waters.'],
    [7, 'Your EPIRB goes off by accident. What should you do?', ['Turn it off and tell AMSA straight away', 'Leave it on until a search plane arrives', 'Turn it off and say nothing to anyone', 'Remove the battery and carry on fishing'], 'Turn it off and call AMSA so no search starts.'],
    [7, 'Your motor breaks down and you need help, but nobody is in danger. Which call?', ['Pan Pan', 'Mayday', 'Securite', 'Channel check'], 'A breakdown is an urgency call: Pan Pan.'],
    [7, 'Which distress signal suits a search plane on a calm, clear day?', ['Orange smoke', 'A red flare', 'A torch', 'A whistle'], 'In daylight, orange smoke is easy to see from the air.'],
    [7, 'You used the fire extinguisher for a two-second burst. What now?', ['Have it recharged as soon as you can', 'Nothing, it still has plenty left in it', 'Shake it well and put it back in place', 'Replace it at the next annual service'], 'Recharge an extinguisher after any use, however short.'],
    [8, 'You expect to use 40 litres of fuel. How much should you carry?', ['60 litres', '40 litres', '50 litres', '80 litres'], 'Add a 50% reserve: 40 + 20 = 60 L.'],
    [8, 'Where should heavy gear be stowed?', ['Low and in the middle', 'High and up front', 'At the very stern', 'On the side decks'], 'Low and central keeps the centre of gravity low.'],
    [8, 'In the southern hemisphere, which way do winds blow around a low?', ['Clockwise', 'Anticlockwise', 'Straight out', 'Straight in'], 'Winds circle a low clockwise in the southern hemisphere.'],
    [8, 'On a weather map, the isobars are packed close together. What does it mean?', ['Strong winds', 'Light winds', 'Heavy rain', 'Clear skies'], 'The closer the isobars, the stronger the wind.'],
    [8, 'The chart shows 2 m, and the tide is 1.5 m above chart datum. How deep is it?', ['3.5 m', '2.0 m', '1.5 m', '0.5 m'], 'Total depth = charted depth + height of tide.'],
    [9, 'Your boat capsizes 2 km offshore. What is usually best?', ['Stay with the boat and climb on if you can', 'Swim for shore before you get too cold', 'Split up so rescuers spot someone', 'Take off your lifejacket to swim faster'], 'A boat is easier to find than a swimmer. Stay with it.'],
    [9, 'Why ventilate an inboard engine space before starting?', ['Fuel vapour is heavier than air and collects low', 'It cools the motor down before you start it', 'It lets the battery charge more quickly', 'It dries out the spark plugs before starting'], 'Fuel vapour sinks into the bilge and can explode.'],
    [9, 'A fire breaks out on board. What do you do first?', ['Raise the alarm and count heads', 'Fight it with the extinguisher', 'Close the fuel and gas lines', 'Move to the bow and wait'], 'Alarm and head count first, then call for help, protect people, cut fuel and air, and fight it.'],
    [9, 'Which of these should you NOT do for someone with hypothermia?', ['Give them a drink of alcohol', 'Get them out of the wind', 'Wrap them in dry blankets', 'Warm the chest and armpits'], 'No alcohol, and don’t rub their arms and legs.'],
    [9, 'Which of these is a recognised distress signal?', ['Slowly raising and lowering outstretched arms', 'Waving one arm quickly above your head', 'Flashing your navigation lights on and off', 'Standing up and pointing at the shore'], 'Slowly and repeatedly raising and lowering arms outstretched to each side.']
  ];

  /* ---------- answer store ---------- */
  let T = {};
  try { T = JSON.parse(localStorage.getItem(TKEY)) || {}; } catch (e) { T = {}; }
  T.ans = T.ans || {};
  const save = () => { try { localStorage.setItem(TKEY, JSON.stringify(T)); } catch (e) { } };
  const score = () => Q.reduce((n, q, i) => n + (T.ans[i] === 0 ? 1 : 0), 0);

  const order = i => {
    const rnd = A.rng(i * 7919 + 13), o = [0, 1, 2, 3];
    for (let k = 3; k > 0; k--) { const j = Math.floor(rnd() * (k + 1)); [o[k], o[j]] = [o[j], o[k]]; }
    return o;
  };

  function boardArt(svg, cur) {
    A.paperBg(svg);
    const g = A.g(svg);
    A.text(g, 400, 92, 'QUESTION', { size: 20, weight: 700, anchor: 'middle', fill: C.port, ls: '0.24em' });
    const n = A.text(g, 400, 250, String(cur + 1), { size: 160, weight: 700, anchor: 'middle', fill: C.ink });
    gsap.from(n, { opacity: 0, y: 12, duration: 0.4 });
    A.tag(g, 400, 300, SR.META[Q[cur][0] - 1].short.toUpperCase(), { fill: C.ink, size: 15 });
    for (let i = 0; i < Q.length; i++) {
      const x = 225 + (i % 8) * 50, y = 380 + Math.floor(i / 8) * 42;
      const done = T.ans[i] != null;
      const d = A.circle(g, x, y, 12, { fill: done ? C.ink : C.paper3, stroke: i === cur ? C.buoy : 'none', 'stroke-width': 4 });
      if (i === cur) gsap.to(d, { attr: { r: 15 }, duration: 0.7, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    }
    A.text(g, 400, 600 - 14, `${Object.keys(T.ans).length} of ${Q.length} answered`, { font: 'body', size: 15, anchor: 'middle', fill: C.ink3 });
  }

  const P = Q.map(([ch, q, opts, why], i) => ({
    type: 'try', kicker: `Question ${i + 1} of ${Q.length}`,
    lockMsg: 'Answer to go on',
    build(svg, S, api) {
      boardArt(svg, i);
      const qp = document.createElement('p'); qp.className = 'q'; qp.textContent = q; api.task.appendChild(qp);
      const box = document.createElement('div'); box.className = 'opts'; api.task.appendChild(box);
      const btns = order(i).map(k => {
        const b = document.createElement('button');
        b.className = 'opt'; b.dataset.k = k;
        b.innerHTML = `<span class="dot"></span><span>${opts[k]}</span>`;
        box.appendChild(b);
        return b;
      });
      const reveal = (pick, fresh) => {
        btns.forEach(b => {
          b.disabled = true;
          const k = +b.dataset.k;
          if (k === 0) b.classList.add('right');
          else if (k === pick) b.classList.add('wrong');
        });
        if (pick === 0) api.say(`<b>Correct.</b> ${why}`, 'good');
        else api.say(`<b>Not this time.</b> ${why}`, 'bad');
        if (fresh && pick !== 0) { const w = btns.find(b => +b.dataset.k === pick); w.classList.add('shake'); }
        api.done();
      };
      if (T.ans[i] != null) reveal(T.ans[i], false);
      else btns.forEach(b => b.onclick = () => {
        if (T.ans[i] != null) return;
        T.ans[i] = +b.dataset.k; save();
        reveal(T.ans[i], true);
      });
    }
  }));

  /* ---------- results ---------- */
  P.push({
    type: 'try', kicker: 'Your result', title: 'How did you go?',
    build(svg, S, api) {
      const n = score(), pass = n >= PASS, answered = Object.keys(T.ans).length;
      A.paperBg(svg);
      const g = A.g(svg, { transform: 'translate(400,290)' });
      const R = 170, circ = 2 * Math.PI * R;
      A.circle(g, 0, 0, R, { fill: 'none', stroke: C.paper3, 'stroke-width': 26 });
      const arc = A.circle(g, 0, 0, R, { fill: 'none', stroke: pass ? C.stbd : C.port, 'stroke-width': 26, 'stroke-linecap': 'round', transform: 'rotate(-90)', 'stroke-dasharray': `0 ${circ}` });
      const pa = (PASS / Q.length) * 2 * Math.PI - Math.PI / 2;
      A.line(g, Math.cos(pa) * (R - 22), Math.sin(pa) * (R - 22), Math.cos(pa) * (R + 22), Math.sin(pa) * (R + 22), { stroke: C.ink, 'stroke-width': 4 });
      A.text(g, Math.cos(pa) * (R + 44), Math.sin(pa) * (R + 44) + 6, String(PASS), { size: 20, weight: 700, anchor: 'middle', fill: C.ink });
      const num = A.text(g, 0, 30, '0', { size: 110, weight: 700, anchor: 'middle', fill: C.ink });
      A.text(g, 0, 70, `OUT OF ${Q.length}`, { size: 20, weight: 700, anchor: 'middle', fill: C.ink3, ls: '0.16em' });
      const badge = A.tag(svg, 400, 530, pass ? 'PASS' : 'NOT YET', { fill: pass ? C.stbd : C.port, size: 26, padX: 24 });
      badge.style.opacity = 0;
      const st = { v: 0 };
      gsap.to(st, {
        v: n, duration: SR.reduce ? 0 : 1.6, ease: 'power2.out', delay: 0.3,
        onUpdate: () => { num.textContent = Math.round(st.v); arc.setAttribute('stroke-dasharray', `${(st.v / Q.length * circ).toFixed(1)} ${circ}`); },
        onComplete: () => gsap.to(badge, { opacity: 1, duration: 0.4 })
      });

      const missed = {};
      Q.forEach((q, i) => { if (T.ans[i] !== 0) missed[q[0]] = (missed[q[0]] || 0) + 1; });
      const chs = Object.keys(missed).map(Number).sort((a, b) => missed[b] - missed[a]);
      let msg = '';
      if (pass) msg = `<p><b>${n} out of ${Q.length}.</b> That’s a pass. You need ${PASS} or more in the real theory test too.</p>`;
      else if (n >= 30) msg = `<p><b>${n} out of ${Q.length}.</b> So close. In the real test, 30 to 33 lets you try a different set of questions the same day. Brush up and have another go.</p>`;
      else msg = `<p><b>${n} out of ${Q.length}.</b> Not a pass yet. You need ${PASS}. Revisit the chapters below, then try again.</p>`;
      if (answered < Q.length) msg += `<p class="note">${Q.length - answered} questions were skipped and count as wrong.</p>`;
      if (chs.length) msg += `<p>Worth another look:</p><ul>${chs.slice(0, 4).map(c => `<li><a href="#/c/${c}/0">Chapter ${c}: ${SR.META[c - 1].title}</a> (${missed[c]} missed)</li>`).join('')}</ul>`;
      const body = document.createElement('div'); body.className = 'body'; body.innerHTML = msg;
      api.task.appendChild(body);
      const row = document.createElement('div'); row.className = 'chips';
      row.innerHTML = `<button class="chip again">Try the test again</button>${FORM_URL ? `<a class="chip" href="${FORM_URL}" target="_blank" rel="noopener">Send my score</a>` : ''}`;
      api.task.appendChild(row);
      row.querySelector('.again').onclick = () => { T.ans = {}; save(); SR.resetChapter(12, 1); SR.go(12, 1); };
      api.done();
    }
  });

  SR.chapter({
    id: 12, title: 'Practice Theory Test',
    intro: `${Q.length} multiple choice questions from across the workbook, just like the real theory test. You get one try at each, and the answer is shown straight after. Get <b>${PASS} or more</b> to pass.`,
    cover(svg, S) {
      A.paperBg(svg);
      const g = A.g(svg, { transform: 'translate(400,300)' });
      A.circle(g, 4, 8, 170, { fill: 'rgba(18,38,58,0.15)' });
      A.circle(g, 0, 0, 170, { fill: C.ink });
      A.circle(g, 0, 0, 150, { fill: 'none', stroke: C.buoy, 'stroke-width': 3, 'stroke-dasharray': '2 8', 'stroke-linecap': 'round' });
      A.text(g, 0, -50, 'PRACTICE TEST', { size: 24, weight: 700, anchor: 'middle', fill: C.buoy, ls: '0.2em' });
      A.text(g, 0, 50, `${PASS}/${Q.length}`, { size: 96, weight: 700, anchor: 'middle', fill: C.white });
      A.text(g, 0, 96, 'TO PASS', { size: 22, weight: 700, anchor: 'middle', fill: C.buoy, ls: '0.2em' });
      gsap.from(g, { scale: 0.7, opacity: 0, svgOrigin: '400 300', duration: 0.7, ease: 'back.out(1.7)' });
    },
    pages: P
  });
})();
