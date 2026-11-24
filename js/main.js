/* Vijaya Nursing Home – Chest Pain Hospital */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var PHONE_WA = '917842652341';

  document.body.classList.add('js-beat');
  $('#year').textContent = new Date().getFullYear();

  /* Load every image up front (lazy images inside the horizontal gallery and
     other off-screen blocks never loaded in some browsers / when opened from disk),
     and retry any that fail */
  function retryImg(img) {
    var n = +img.dataset.retry || 0;
    if (n >= 3) return;
    img.dataset.retry = n + 1;
    var src = img.getAttribute('src');
    setTimeout(function () { img.removeAttribute('src'); img.setAttribute('src', src); }, 400 * (n + 1));
  }
  $$('img').forEach(function (img) {
    img.loading = 'eager';
    img.decoding = 'async';
    img.addEventListener('error', function () { retryImg(img); });
  });

  /* ---------- Loader ---------- */
  var loader = $('#loader');
  var revealed = false;
  function ready() {
    if (revealed) return;
    revealed = true;
    loader.classList.add('done');
    document.body.classList.add('ready');
  }
  window.addEventListener('load', function () { setTimeout(ready, reduced ? 0 : 1500); });
  setTimeout(ready, 3500);

  /* ---------- Language (EN / Telugu) ---------- */
  var TE = {
    brandSub: 'చెస్ట్ పెయిన్ హాస్పిటల్ · తుని',
    nSrv: 'సేవలు', nFac: 'సౌకర్యాలు', nDoc: 'వైద్యులు', nCon: 'సంప్రదించండి',
    callNow: 'కాల్ చేయండి',
    eyebrow: '24×7 తెరిచే ఉంటుంది · అత్యవసర సేవలు · తుని',
    h1a: 'ప్రతి', h1b: 'గుండె చప్పుడు', h1c: 'విలువైనదే.',
    lead: 'మీ గుండెకు, మీ కుటుంబానికి కరుణతో కూడిన, అందుబాటు ధరలో, రోజంతా వైద్య సేవలు — తుని నడిబొడ్డున.',
    emerg: 'అత్యవసరం · ఇప్పుడే కాల్ చేయండి', book: 'అపాయింట్‌మెంట్',
    open: 'తెరిచి', specs: 'వైద్య సేవలు', days: 'రోజులు, ఏడాది పొడవునా',
    live: 'లైవ్ పల్స్', nowOpen: 'ఇప్పుడు తెరిచి ఉంది',
    kSrv: 'మేము చికిత్స చేసేవి', tSrv: 'ఒకే చూరు కింద, అన్ని వైద్య సేవలు.',
    sSrv: 'అర్ధరాత్రి వచ్చే ఛాతీ నొప్పి నుండి సాధారణ చెక్-అప్ వరకు — మా వైద్యులు, నర్సులు ప్రతిరోజూ అందుబాటులో ఉంటారు.',
    kJour: 'మీ సందర్శన', tJour: 'గుమ్మం నుండి కోలుకునే వరకు — మీరు ఒంటరి కాదు.',
    kFac: 'ఆసుపత్రి లోపల', tFac: 'శుభ్రం. ప్రశాంతం. సిద్ధం.',
    kDoc: 'మా వైద్యులు', tDoc: 'అనుభవజ్ఞులైన చేతులు. మృదువైన హృదయాలు.',
    sDoc: 'వైద్యులు, సిబ్బంది అందించే శ్రద్ధ, ఆత్మీయ ఆతిథ్యం, నిజాయితీతో కూడిన అందుబాటు ధరల చికిత్సను రోగులు ఎప్పుడూ ప్రశంసిస్తారు.',
    kCon: 'మమ్మల్ని కనుగొనండి', tCon: 'ఒక్క కాల్ దూరంలో ఉన్నాం.'
  };
  var langBtn = $('#langBtn');
  var i18nEls = $$('[data-i18n]');
  i18nEls.forEach(function (el) { el.dataset.en = el.textContent; });

  function setLang(l) {
    document.documentElement.lang = l;
    i18nEls.forEach(function (el) {
      var k = el.dataset.i18n;
      el.textContent = (l === 'te' && TE[k]) ? TE[k] : el.dataset.en;
    });
    var spans = $$('span', langBtn);
    spans[0].classList.toggle('on', l === 'en');
    spans[1].classList.toggle('on', l === 'te');
    langBtn.setAttribute('aria-label', l === 'en' ? 'Switch language to Telugu' : 'Switch language to English');
    try { localStorage.setItem('vnh-lang', l); } catch (e) {}
  }
  langBtn.addEventListener('click', function () {
    setLang(document.documentElement.lang === 'en' ? 'te' : 'en');
  });
  try { if (localStorage.getItem('vnh-lang') === 'te') setLang('te'); } catch (e) {}

  /* ---------- Nav ---------- */
  var nav = $('#nav'), burger = $('#burger'), navLinks = $('#navLinks'), fill = $('#scrollFill');
  burger.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  $$('a', navLinks).forEach(function (a) {
    a.addEventListener('click', function () {
      navLinks.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  var tLine = $('#tLine'), timeline = $('#timeline');
  var steps = $$('li', timeline), stageImgs = $$('.j-frame img'), dots = $$('.j-dots i'), jNum = $('#jNum'), jCap = $('#jCap');
  var activeStep = -1;
  function setStep(n) {
    if (n === activeStep) return;
    activeStep = n;
    steps.forEach(function (s, i) { s.classList.toggle('active', i === n); });
    stageImgs.forEach(function (im, i) { im.classList.toggle('on', i === n); });
    dots.forEach(function (d, i) { d.classList.toggle('on', i <= n); });
    jNum.textContent = '0' + (n + 1);
    jCap.textContent = steps[n].dataset.cap;
  }
  function onScroll() {
    var y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
    nav.classList.toggle('solid', y > 40);
    fill.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    var r = timeline.getBoundingClientRect();
    var p = (window.innerHeight * 0.6 - r.top) / r.height;
    tLine.style.setProperty('--p', Math.max(0, Math.min(1, p)) * 100 + '%');
    var mid = window.innerHeight * (window.innerWidth <= 1000 ? 0.62 : 0.5), best = 0, bd = Infinity;
    steps.forEach(function (s, i) {
      var b = s.getBoundingClientRect();
      var d = Math.abs(b.top + Math.min(b.height, 160) / 2 - mid);
      if (d < bd) { bd = d; best = i; }
    });
    setStep(best);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal + counters ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(function (el, i) {
    if (el.classList.contains('card')) el.style.transitionDelay = (i % 4) * 60 + 'ms';
    io.observe(el);
  });

  function countUp(el) {
    var target = +el.dataset.count, start = performance.now(), dur = 1600;
    if (reduced) { el.textContent = target; return; }
    (function step(now) {
      var t = Math.min(1, (now - start) / dur);
      el.textContent = Math.round(target * (1 - Math.pow(1 - t, 4)));
      if (t < 1) requestAnimationFrame(step);
    })(start);
  }
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); }
    });
  });
  $$('[data-count]').forEach(function (el) { cio.observe(el); });

  /* ---------- Tilt, spotlight, magnetic, cursor ---------- */
  if (finePointer && !reduced) {
    $$('.tilt').forEach(function (el) {
      var max = el.classList.contains('photo-card') ? 5 : 9;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--ry', ((px - 0.5) * max * 2).toFixed(2) + 'deg');
        el.style.setProperty('--rx', ((0.5 - py) * max * 2).toFixed(2) + 'deg');
        el.style.setProperty('--mx', (px * 100) + '%');
        el.style.setProperty('--my', (py * 100) + '%');
      });
      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
      });
    });

    $$('.magnetic').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
        var dy = (e.clientY - (r.top + r.height / 2)) * 0.3;
        el.style.translate = dx.toFixed(1) + 'px ' + dy.toFixed(1) + 'px';
      });
      el.addEventListener('pointerleave', function () { el.style.translate = '0 0'; });
    });
  }

  var cursor = $('#cursor');
  if (finePointer && window.innerWidth > 900 && !reduced) {
    document.body.classList.add('has-cursor');
    var cx = 0, cy = 0, tx = 0, ty = 0;
    window.addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY;
      cursor.classList.add('show');
    });
    document.addEventListener('pointerleave', function () { cursor.classList.remove('show'); });
    (function loop() {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      cursor.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
      requestAnimationFrame(loop);
    })();
    document.addEventListener('pointerover', function (e) {
      cursor.classList.toggle('big', !!e.target.closest('a,button,label,summary,.tap'));
    });
  }

  /* ---------- IST clock + today's hours ---------- */
  var clockEl = $('#istClock');
  function tickClock() {
    var now = new Date();
    clockEl.textContent = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true
    }).format(now).toUpperCase();
  }
  tickClock();
  setInterval(tickClock, 15000);
  var dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  var wd = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', weekday: 'short' }).format(new Date());
  var todayLi = $('#hoursList [data-d="' + dayMap[wd] + '"]');
  if (todayLi) todayLi.classList.add('today');

  /* ---------- Hero ECG monitor ---------- */
  (function ecg() {
    var cv = $('#ecg'), ctx = cv.getContext('2d');
    var W, H, dpr, base, amp, ys, head = 0, dist = 0, last = 0, lastBeat = 0;
    var bpm = 72, speed = 170; // px per second
    var bpmEl = $('#bpm'), heart = $('.heart-beat'), glow = $('.hero-glow');
    var visible = true;

    function g(t, c, w) { var d = (t - c) / w; return Math.exp(-d * d); }
    function wave(t) {
      return 0.14 * g(t, 0.16, 0.035) - 0.12 * g(t, 0.295, 0.011) + 1 * g(t, 0.325, 0.010)
        - 0.28 * g(t, 0.355, 0.012) + 0.26 * g(t, 0.58, 0.05);
    }
    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      var r = cv.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      base = H * (W < 900 ? 0.82 : 0.7);
      amp = Math.min(150, H * 0.2);
      ys = new Float32Array(Math.ceil(W) + 2).fill(NaN);
      head = 0;
    }
    function thump() {
      if (reduced) return;
      heart.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' }], { duration: 600, easing: 'ease-out' });
      glow.animate([{ opacity: .55, transform: 'scale(1)' }, { opacity: 1, transform: 'scale(1.1)' }, { opacity: .55, transform: 'scale(1)' }], { duration: 700, easing: 'ease-out' });
    }
    function draw(now) {
      requestAnimationFrame(draw);
      if (!visible) { last = now; return; }
      var dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
      var move = speed * dt, pxBeat = speed * 60 / bpm;
      var prevDist = dist; dist += move;
      var prevHead = head; head += move;

      // fill samples between prevHead and head
      for (var x = Math.floor(prevHead); x <= Math.floor(head) && x < ys.length; x++) {
        var d = dist - (head - x);
        var ph = ((d % pxBeat) + pxBeat) % pxBeat / pxBeat;
        ys[x] = base - wave(ph) * amp;
      }
      // beat event when passing the R peak
      var b = Math.floor((dist / pxBeat) + (1 - 0.325));
      if (b !== lastBeat) {
        lastBeat = b;
        bpm = Math.max(68, Math.min(78, bpm + (Math.random() - 0.5) * 3));
        bpmEl.textContent = Math.round(bpm);
        thump();
      }
      if (head >= W) { head = 0; }

      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      var gap = 60, hx = Math.floor(head);

      function stroke(from, to, c0, c1, gx0, gx1) {
        var gr = ctx.createLinearGradient(gx0, 0, gx1, 0);
        gr.addColorStop(0, c0); gr.addColorStop(1, c1);
        ctx.strokeStyle = gr;
        ctx.beginPath();
        var started = false;
        for (var i = from; i <= to && i < ys.length; i++) {
          if (isNaN(ys[i])) { started = false; continue; }
          if (!started) { ctx.moveTo(i, ys[i]); started = true; } else ctx.lineTo(i, ys[i]);
        }
        ctx.stroke();
      }
      ctx.shadowColor = '#2de1b0'; ctx.shadowBlur = 12;
      stroke(0, hx, 'rgba(45,225,176,0)', 'rgba(45,225,176,1)', Math.max(0, hx - W * 0.6), hx);
      if (hx + gap < W) stroke(hx + gap, Math.ceil(W), 'rgba(45,225,176,0)', 'rgba(45,225,176,.55)', hx + gap, W);
      ctx.shadowBlur = 0;
      if (!isNaN(ys[hx])) {
        ctx.fillStyle = '#fff'; ctx.shadowColor = '#2de1b0'; ctx.shadowBlur = 22;
        ctx.beginPath(); ctx.arc(hx, ys[hx], 4.5, 0, 6.2832); ctx.fill(); ctx.shadowBlur = 0;
      }
    }
    resize();
    window.addEventListener('resize', resize);
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(cv);
    if (reduced) {
      // static, fully drawn trace
      for (var x = 0; x < ys.length; x++) {
        var ph = ((x % 240) / 240);
        ys[x] = base - wave(ph) * amp;
      }
      head = ys.length - 3;
      draw = function () {};
      ctx.strokeStyle = 'rgba(45,225,176,.8)'; ctx.lineWidth = 2.5; ctx.beginPath();
      ys.forEach(function (y, i) { i ? ctx.lineTo(i, y) : ctx.moveTo(i, y); });
      ctx.stroke();
      return;
    }
    requestAnimationFrame(draw);
  })();

  /* ---------- Gallery + lightbox ---------- */
  (function gallery() {
    var g = $('#gallery'), down = false, sx = 0, sl = 0, moved = false;
    var allFigs = $$('figure', g), figs = allFigs.slice(), cur = 0;
    var lb = $('#lightbox'), lbImg = $('#lbImg'), lbCap = $('#lbCap');
    function layout() {
      figs = allFigs.filter(function (f) { return !f.hidden; });
      allFigs.forEach(function (f) { f.classList.remove('lift'); });
      figs.forEach(function (f, i) { f.classList.toggle('lift', i % 2 === 1); });
    }
    layout();
    $$('#gFilters button').forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.dataset.f;
        $$('#gFilters button').forEach(function (x) {
          var on = x === b; x.classList.toggle('on', on); x.setAttribute('aria-selected', on);
        });
        allFigs.forEach(function (f) { f.hidden = !(k === 'all' || f.dataset.c === k); });
        g.scrollTo({ left: 0 });
        layout();
      });
    });
    function show(i) {
      cur = (i + figs.length) % figs.length;
      var im = $('img', figs[cur]);
      lbImg.src = im.currentSrc || im.src;
      lbImg.alt = im.alt;
      lbCap.textContent = $('figcaption', figs[cur]).textContent;
    }
    function open(i) {
      show(i);
      if (typeof lb.showModal === 'function') lb.showModal(); else lb.setAttribute('open', '');
    }
    function close() { if (lb.close) lb.close(); else lb.removeAttribute('open'); }
    allFigs.forEach(function (f) {
      f.tabIndex = 0;
      f.setAttribute('role', 'button');
      f.setAttribute('aria-label', 'Open photo: ' + $('figcaption', f).textContent);
      f.addEventListener('click', function () { if (!moved) open(figs.indexOf(f)); });
      f.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(figs.indexOf(f)); } });
    });
    $('#lbClose').addEventListener('click', close);
    $('#lbPrev').addEventListener('click', function () { show(cur - 1); });
    $('#lbNext').addEventListener('click', function () { show(cur + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') show(cur + 1);
      if (e.key === 'ArrowLeft') show(cur - 1);
    });

    $('#gPrev').addEventListener('click', function () { g.scrollBy({ left: -Math.min(500, g.clientWidth * 0.8), behavior: 'smooth' }); });
    $('#gNext').addEventListener('click', function () { g.scrollBy({ left: Math.min(500, g.clientWidth * 0.8), behavior: 'smooth' }); });
    g.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = false; sx = e.clientX; sl = g.scrollLeft;
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - sx;
      if (Math.abs(dx) > 5) { moved = true; g.classList.add('drag'); }
      g.scrollLeft = sl - dx;
    });
    window.addEventListener('pointerup', function () {
      if (!down) return;
      down = false; g.classList.remove('drag');
      setTimeout(function () { moved = false; }, 0);
    });
    g.addEventListener('keydown', function (e) {
      if (e.target !== g) return;
      if (e.key === 'ArrowRight') g.scrollBy({ left: 300, behavior: 'smooth' });
      if (e.key === 'ArrowLeft') g.scrollBy({ left: -300, behavior: 'smooth' });
    });
  })();

  /* ---------- Appointment form -> WhatsApp ---------- */
  (function form() {
    var f = $('#apptForm'), err = $('#formErr');
    var dateEl = f.elements.date;
    var today = new Date();
    dateEl.min = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = f.elements.name.value.trim();
      var phone = f.elements.phone.value.replace(/[^\d]/g, '').replace(/^(91|0)(?=\d{10}$)/, '');
      f.elements.name.classList.toggle('bad', !name);
      f.elements.phone.classList.toggle('bad', phone.length !== 10);
      if (!name || phone.length !== 10) {
        err.hidden = false;
        err.textContent = !name ? 'Please enter your name.' : 'Please enter a valid 10-digit mobile number.';
        return;
      }
      err.hidden = true;
      var lines = [
        'Hello Vijaya Nursing Home, I would like to visit.',
        'Name: ' + name,
        'Phone: ' + phone,
        'Need: ' + f.elements.need.value
      ];
      if (dateEl.value) lines.push('Preferred day: ' + dateEl.value);
      if (f.elements.msg.value.trim()) lines.push('Note: ' + f.elements.msg.value.trim());
      window.open('https://wa.me/' + PHONE_WA + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    });
  })();
})();
