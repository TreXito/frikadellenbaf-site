/* ============================================================================
   main.js — motion & interaction.
   • Scroll hero: pin the terminal, advance ONE full action per scroll step.
   • Big-flips showcase: scroll through each flip.
   • Reveals (GSAP or IntersectionObserver fallback), nav, install tabs.
   ========================================================================== */
(function () {
  const root = document.documentElement;
  root.classList.remove('no-js');
  const isStatic = location.search.indexOf('static') !== -1;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || isStatic;
  if (reduce) root.classList.add('reduce-motion');
  const desktop = window.innerWidth >= 900;
  const hasGSAP = typeof window.gsap !== 'undefined' && !reduce;
  const canPin = hasGSAP && desktop;

  /* ── nav shadow ──────────────────────────────────────────────────────── */
  const nav = document.getElementById('navbar');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  /* ── install tabs ────────────────────────────────────────────────────── */
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.install-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById('tab-' + tab.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  /* ── reveals ─────────────────────────────────────────────────────────── */
  function revealFallback() {
    if (reduce) { document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed')); return; }
    const io = new IntersectionObserver((es) => {
      es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }
  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.set('.reveal', { opacity: 0, y: 28 });
    ScrollTrigger.batch('.reveal', {
      start: 'top 88%',
      onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: .8, ease: 'power3.out', stagger: .08, overwrite: true }),
    });
    gsap.utils.toArray('.section-head').forEach(h => gsap.fromTo(h, { y: 16 }, {
      y: -12, ease: 'none', scrollTrigger: { trigger: h, start: 'top bottom', end: 'top 26%', scrub: true },
    }));
  } else {
    revealFallback();
  }

  /* ── shared: pin an element and step through `stops` discrete states ──── */
  function pinnedStepper(section, pinEl, stops, onStep, pxPer) {
    onStep(0, 0);
    ScrollTrigger.create({
      trigger: section, start: 'top top',
      end: () => '+=' + Math.max(1, stops - 1) * (pxPer || 220),
      pin: pinEl, pinSpacing: true, anticipatePin: 1, invalidateOnRefresh: true,
      snap: stops > 1 ? { snapTo: 1 / (stops - 1), duration: 0.2, ease: 'power1.inOut' } : false,
      onUpdate: self => { const p = self.progress; onStep(Math.round(p * (stops - 1)), p); },
    });
  }

  /* ── hero: headline crossfades into the terminal, then it steps ──────── */
  const shSection = document.getElementById('scroll-hero');
  const shPin = document.getElementById('sh-pin');
  const shIntro = document.getElementById('sh-intro');
  const shStage = document.getElementById('sh-stage');
  const acts = Array.from(document.querySelectorAll('#sh-acts .sh-act'));
  const bars = Array.from(document.querySelectorAll('#sh-progress i'));
  const NB = window.BAFTerm ? window.BAFTerm.blocks : 0;
  const clamp01 = (x) => x < 0 ? 0 : x > 1 ? 1 : x;

  function setPhase(p) {
    const ai = Math.max(0, Math.min(acts.length - 1, Math.floor(p * acts.length + 1e-6)));
    acts.forEach((a, i) => a.classList.toggle('active', i === ai));
    bars.forEach((b, i) => b.classList.toggle('on', i <= ai));
  }

  if (canPin && shPin && NB) {
    window.BAFTerm.takeOver();
    document.getElementById('sh-acts').classList.add('driven');
    shPin.classList.add('driven');
    window.BAFTerm.showBlocks(1);
    const INTRO = 0.2; // first slice of scroll = the headline handing off
    function update(p) {
      const k = clamp01(p / INTRO);
      const out = clamp01(k / 0.45);            // headline leaves over the first ~half
      const inn = clamp01((k - 0.55) / 0.45);   // terminal arrives after it has gone
      shIntro.style.opacity = String(1 - out);
      shIntro.style.transform = 'translateY(' + (-70 * out) + 'px)';
      shIntro.style.pointerEvents = out >= 1 ? 'none' : 'auto';
      shStage.style.opacity = String(inn);
      shStage.style.transform = 'translateY(' + (34 * (1 - inn)) + 'px)';
      const ap = clamp01((p - INTRO) / (1 - INTRO));
      window.BAFTerm.showBlocks(Math.round(ap * (NB - 1)) + 1);
      setPhase(ap);
    }
    ScrollTrigger.create({
      trigger: shSection, start: 'top top',
      end: () => '+=' + Math.round(window.innerHeight * 0.7 + NB * 180),
      pin: shPin, pinSpacing: true, anticipatePin: 1, invalidateOnRefresh: true, scrub: 0.4,
      onUpdate: self => update(self.progress),
    });
    update(0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  } else {
    acts.forEach(a => a.classList.add('active'));
    const prog = document.getElementById('sh-progress'); if (prog) prog.style.display = 'none';
  }

  /* ── live flip data: build the scroll-through showcase ───────────────── */
  const RCOLOR = {
    common: '#dfe7e0', uncommon: '#5cff5c', rare: '#5b8cff', epic: '#c45bff',
    legendary: '#ffb627', mythic: '#ff66e0', divine: '#4fe0ff', special: '#ff6b6b',
    very_special: '#ff6b6b', supreme: '#ff6b6b', ultimate: '#ff4d4d',
  };
  const ICON = (tag) => 'https://sky.coflnet.com/static/icon/' + encodeURIComponent(tag);
  const fmt = (n) => { n = +n || 0; const a = Math.abs(n); return a >= 1e9 ? (n / 1e9).toFixed(2) + 'B' : a >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : a >= 1e3 ? (n / 1e3).toFixed(0) + 'K' : '' + n; };
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  fetch('flips.json').then(r => r.ok ? r.json() : Promise.reject()).then(data => {
    if (!Array.isArray(data) || data.length < 3) return;
    const section = document.getElementById('flips');
    const rail = document.getElementById('fs-rail');
    const card = document.getElementById('fs-card');
    if (!section || !rail || !card) return;

    const top = data.slice().sort((a, b) => b.profit - a.profit).slice(0, 8);

    rail.innerHTML = top.map((f, i) => {
      const col = RCOLOR[f.rarity] || 'var(--fg-body)';
      return '<li data-i="' + i + '"><span class="fr-name" style="color:' + col + '">' + esc(f.item) + '</span><span class="fr-p">+' + fmt(f.profit) + '</span></li>';
    }).join('');
    const items = Array.from(rail.children);

    function renderFlip(i, animate) {
      const f = top[i]; if (!f) return;
      const col = RCOLOR[f.rarity] || 'var(--fg)';
      const icon = f.tag ? '<img src="' + ICON(f.tag) + '" alt="" loading="lazy" onerror="this.style.display=\'none\'">' : '';
      card.innerHTML =
        '<div class="fs-card-head">' + icon +
          '<div><div class="fs-card-name" style="color:' + col + '">' + esc(f.item) + '</div>' +
          '<div class="fs-card-finder">found by ' + esc(f.finder) + '</div></div></div>' +
        '<div class="fs-nums">' +
          '<div class="fs-num"><span>Bought</span><b>' + fmt(f.price) + '</b></div>' +
          '<div class="fs-num"><span>Sold for</span><b>' + fmt(f.target) + '</b></div>' +
          '<div class="fs-num profit"><span>Profit</span><b>+' + fmt(f.profit) + '<small>' + esc(f.roi) + '% ROI</small></b></div>' +
        '</div>';
      if (animate) { card.classList.remove('swap'); void card.offsetWidth; card.classList.add('swap'); }
      items.forEach((li, k) => li.classList.toggle('on', k === i));
    }

    section.hidden = false;
    let cur = -1;
    const step = (i) => { i = Math.max(0, Math.min(top.length - 1, i)); if (i === cur) return; const an = cur !== -1; cur = i; renderFlip(i, an); };
    step(0);

    // click the rail to jump (works everywhere)
    items.forEach((li, i) => li.addEventListener('click', () => step(i)));

    if (canPin) {
      requestAnimationFrame(() => {
        pinnedStepper(section, section.querySelector('.fs-pin'), top.length, (idx) => step(idx), 210);
        ScrollTrigger.refresh();
      });
    }
  }).catch(() => { /* no data — showcase stays hidden */ });

  /* ── broken screenshot fallback ──────────────────────────────────────── */
  document.querySelectorAll('.screenshot-card img').forEach(img => {
    img.addEventListener('error', () => {
      const cardEl = img.closest('.screenshot-card');
      const label = cardEl && cardEl.querySelector('.screenshot-label');
      const ph = document.createElement('div');
      ph.className = 'img-error';
      ph.innerHTML = (label ? label.textContent.trim() : 'Screenshot') + '<span class="img-error-sub">preview coming soon</span>';
      img.replaceWith(ph);
    });
  });
})();
