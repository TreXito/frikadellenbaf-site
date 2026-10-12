/* ============================================================================
   Replay terminal — real BAF log vocabulary, driven by real flips.
   Scroll drives it (main.js scrubs seekProgress); falls back to auto-play.
   Footer counters are honest: they total what the replay has actually shown,
   next to the static public-log totals from flips.json.
   ========================================================================== */
(function () {
  const body = document.getElementById('term-body');
  if (!body) return;
  const elP = document.getElementById('tf-profit');
  const elF = document.getElementById('tf-flips');
  const elT = document.getElementById('tf-uptime');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── helpers ─────────────────────────────────────────────────────────── */
  const rint = (a, b) => Math.floor(a + Math.random() * (b - a + 1));
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const chance = (p) => Math.random() < p;
  const esc = (s) => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const commas = (n) => Math.round(n).toLocaleString('en-US');
  const clamp01 = (p) => p < 0 ? 0 : p > 1 ? 1 : p;
  const short = (n) => {
    const a = Math.abs(n);
    if (a >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (a >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (a >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    return '' + Math.round(n);
  };
  const S = (cls, t) => `<span class="${cls}">${t}</span>`;

  /* ── flip pool: real entries from the public log (flips.json) ────────── */
  /* Embedded seed so the terminal works before / without the fetch.
     Same shape as flips.json rows: n=ame, price, target, finder. */
  let AH = [
    { n: 'Hegemony Artifact',                   p: 500000000, t: 648758876, f: 'Sniper Median' },
    { n: 'Heroic Hyperion ✪✪✪✪✪',             p: 600000000, t: 726900000, f: 'Sniper Median' },
    { n: 'Soul Whip',                          p: 16000000,  t: 25900000,  f: 'Sniper Median' },
    { n: 'Jaded Glossy Mineral Chestplate',    p: 30000000,  t: 40000000,  f: 'Sniper' },
    { n: "Ancient Necron's Leggings ✪✪✪✪✪",    p: 23000000,  t: 36191576,  f: 'Sniper' },
    { n: 'Red Claw Artifact',                  p: 15000000,  t: 21000000,  f: 'Sniper Median' },
    { n: 'Eternal Hoof',                       p: 15000000,  t: 22910865,  f: 'Sniper' },
    { n: "Ancient Storm's Leggings ✪✪✪✪✪",     p: 26000000,  t: 34194260,  f: 'Sniper Median' },
    { n: 'Mossy Fermento Helmet',              p: 37000000,  t: 44302710,  f: 'Sniper Median' },
    { n: 'Ancient Warden Helmet',              p: 111000000, t: 124998999, f: 'Sniper' },
    { n: 'Waxed Soulweaver Gloves ✪✪✪✪✪',      p: 10000000,  t: 19703258,  f: 'Sniper' },
    { n: 'Auspicious Jasper Drill X',          p: 65000000,  t: 84743776,  f: 'Sniper Median' },
  ];
  fetch('../flips.json').then(r => r.ok ? r.json() : Promise.reject()).then(data => {
    if (!Array.isArray(data) || !data.length) return;
    AH = data.filter(f => f && f.item && f.price > 0 && f.target > f.price)
             .map(f => ({ n: f.item, p: f.price, t: f.target, f: f.finder || 'Sniper' }));
  }).catch(() => { /* seed pool stays */ });

  const RELIST = [
    { n: '[Lvl 90] Tiger', p: 38160151 }, { n: '[Lvl 25] Monkey', p: 23382498 },
    { n: '[Lvl 92] Griffin', p: 22049999 }, { n: 'Blazing Jade Belt', p: 81337038 },
    { n: "Necrotic Storm's Leggings ✪✪✪✪✪", p: 30219112 },
  ];
  const BZ = [
    { n: 'Plant Matter', amt: 34, ppu: 11432.5 }, { n: 'Enchanted Diamond', amt: 7, ppu: 1301.7 },
    { n: 'Enchanted Ice', amt: 128, ppu: 322.4 }, { n: 'Mycelium', amt: 64, ppu: 890.1 },
  ];
  const BUYERS = ['_FendinX_', 'M3l4ncholy', 'jedizak', 'mouse92', 'Mayhemi__', 'idkhsq', 'Skylias', 'koraxis', 'rainpvp', 'Threadless'];

  /* ── honest replay counters: total what has actually been shown ──────── */
  let shown = 0;            // sum of profit of flips whose SOLD line is on screen
  let shownFlips = 0;       // flips whose SOLD line is on screen
  let disp = 0;             // display value chasing `shown`
  let lastBuy = null;       // pairing: sell the thing we just bought at ITS target

  function paintStats() {
    if (elP) elP.textContent = '+' + short(disp);
    if (elF) elF.textContent = String(shownFlips);
  }
  (function raf() {
    disp += (shown - disp) * 0.1;
    if (Math.abs(shown - disp) < 1) disp = shown;
    paintStats();
    requestAnimationFrame(raf);
  })();

  /* ── replay clock — honest: seconds the replay has been running ───────── */
  const boot = Date.now();
  if (elT) setInterval(() => {
    const s = Math.floor((Date.now() - boot) / 1000);
    elT.textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }, 1000);

  /* ── scene builders (one scene = one complete action) ────────────────── */
  function L(msg, dim) { return `<span class="ln${dim ? ' dim' : ''}">` + msg + '</span>'; }
  const step = (html, x) => Object.assign({ html }, x || {});
  const BAF = S('t-baf', '[BAF]:');

  function startup() {
    return [
      step(L(S('t-banner', '╔══════════════════════════════════════╗'))),
      step(L(S('t-banner', '║        BAF Startup Workflow          ║'))),
      step(L(S('t-banner', '╚══════════════════════════════════════╝'))),
      step(L(BAF + ' Connected to Coflnet flip feed')),
      step(L(BAF + ' Claimed sold auctions from last session')),
      step(L(BAF + ' ' + S('t-ok', '✅ Ready to flip.'))),
      step(L('public big-flips log: ' + S('t-key', AH.length + ' entries loaded'), true)),
    ];
  }
  function buyOk() {
    const it = pick(AH), profit = it.t - it.p, ms = rint(46, 72);
    lastBuy = it;
    return [
      step(L(BAF + ' Trying to purchase flip: ' + S('t-item', esc(it.n)) + ' for ' + S('t-money', commas(it.p)) + ' coins ' + S('t-key', '(Target: ' + commas(it.t) + ', Profit: ' + commas(profit) + ')'))),
      step(L('Putting coins in escrow...', true)),
      step(L(BAF + ' Auction bought in ' + S('t-ms', ms + 'ms'))),
      step(L('Processing purchase...', true)),
      step(L('You purchased ' + S('t-item', esc(it.n)) + ' for ' + S('t-money', commas(it.p) + ' coins') + '!')),
      step(L(BAF + ' 🏷 BIN listed: ' + S('t-item', esc(it.n)) + ' @ ' + S('t-money', commas(it.t)) + ' coins for 6h')),
    ];
  }
  function buyMiss() {
    const it = pick(AH), profit = it.t - it.p, ms = rint(48, 66);
    return [
      step(L(BAF + ' Trying to purchase flip: ' + S('t-item', esc(it.n)) + ' for ' + S('t-money', commas(it.p)) + ' coins ' + S('t-key', '(Profit: ' + commas(profit) + ')'))),
      step(L('Putting coins in escrow...', true)),
      step(L(BAF + ' Auction bought in ' + S('t-ms', ms + 'ms'))),
      step(L('Processing purchase...', true)),
      step(L(S('t-red', 'There was an error with the auction house! (AUCTION_EXPIRED_OR_NOT_FOUND)'))),
      step(L('Checking escrow for recent transaction...', true)),
      step(L(S('t-warn', 'Escrow refunded ' + commas(it.p) + ' coins for BIN Auction Buy!'))),
      step(L(S('t-red', "This auction wasn't found!"))),
    ];
  }
  function sold() {
    /* sell what we bought whenever possible: price/target stay real & paired */
    const it = lastBuy || pick(AH); lastBuy = null;
    const buyer = pick(BUYERS), price = it.t, net = Math.round(price * 0.99);
    const profit = it.t - it.p;
    return [
      step(L(S('t-cmd', '[Auction]') + ' ' + esc(buyer) + ' bought ' + S('t-item', esc(it.n)) + ' for ' + S('t-money', commas(price)) + ' coins ' + S('t-key', 'CLICK'))),
      step(L(BAF + ' ' + S('t-ok', '⚡ SOLD') + ' ' + S('t-item', esc(it.n)) + ' to ' + esc(buyer) + ' for ' + S('t-money', commas(price) + ' coins') + ' ' + S('t-key', '(+' + commas(profit) + ')'))),
      step(L('You collected ' + S('t-money', commas(net) + ' coins') + ' from selling ' + S('t-item', esc(it.n)) + ' to ' + S('t-cmd', '[MVP+] ' + buyer) + ' in an auction!'),
           { profit, flip: 1 }),
    ];
  }
  function bazaar() {
    const it = pick(BZ), total = Math.round(it.amt * it.ppu);
    return [
      step(L(S('t-cofl', '[Bazaar]') + ' Sell Offer Setup! ' + S('t-cmd', it.amt + 'x') + ' ' + S('t-item', esc(it.n)) + ' for ' + S('t-money', commas(total) + ' coins') + '.')),
    ];
  }
  function idleScan() {
    const rate = rint(2400, 4200).toLocaleString('en-US');
    const tail = chance(0.45) ? ', ' + rint(120, 380) + ' filtered' : '…';
    return [step(L(S('t-cofl', '[COFL]') + ' scanning ' + S('t-cmd', rate) + ' auctions/s' + tail, true))];
  }

  /* ── the fixed scroll plan (one full action per scroll step) ─────────── */
  const PLAN = [
    startup,
    buyOk, sold, bazaar,
    buyOk, buyMiss, sold,
    buyOk, sold, bazaar,
    buyMiss, buyOk, sold,
    buyOk, sold, bazaar,
  ];
  const NB = PLAN.length;
  const cache = new Array(NB);
  function genBlock(i) {
    if (!cache[i]) cache[i] = PLAN[i]();
    return cache[i];
  }

  /* ── DOM: reveal / retract whole blocks, counters follow the screen ──── */
  let shownBlocks = 0;
  function appendStep(st) {
    const tpl = document.createElement('template');
    tpl.innerHTML = st.html;
    const el = tpl.content.firstChild;
    el.__p = st.profit || 0; el.__f = st.flip || 0;
    shown += el.__p; shownFlips += el.__f;
    body.appendChild(el);
  }
  function retractStep() {
    const el = body.lastChild; if (!el) return;
    shown -= el.__p || 0; shownFlips -= el.__f || 0;
    body.removeChild(el);
  }
  function renderBlocks(n) {
    n = Math.max(0, Math.min(NB, Math.round(n)));
    if (n > shownBlocks) {
      for (let b = shownBlocks; b < n; b++) genBlock(b).forEach(appendStep);
    } else if (n < shownBlocks) {
      let rm = 0; for (let b = n; b < shownBlocks; b++) rm += genBlock(b).length;
      for (let i = 0; i < rm; i++) retractStep();
    }
    shownBlocks = n;
    body.scrollTop = body.scrollHeight;
  }

  /* ── auto-play (mobile / non-pinned): realistic, randomised pacing ───── */
  const MAXLINES = 38;
  let driven = false, autoOn = false;
  function appendAuto(html, p, f) {
    const tpl = document.createElement('template');
    tpl.innerHTML = html;
    const el = tpl.content.firstChild;
    shown += p || 0; shownFlips += f || 0;
    body.appendChild(el);
    /* keep the window rolling, but DON'T un-count: footer totals the session */
    while (body.children.length > MAXLINES) body.removeChild(body.firstChild);
    body.scrollTop = body.scrollHeight;
  }
  function nextScene() {
    const r = Math.random();
    if (r < 0.38) return buyOk();
    if (r < 0.61) return sold();
    if (r < 0.76) return bazaar();
    if (r < 0.88) return buyMiss();
    return idleScan();
  }
  function autoTick() {
    if (driven || !autoOn) return;
    const scene = nextScene();
    let i = 0;
    (function emit() {
      if (driven || !autoOn) return;
      if (i < scene.length) {
        appendAuto(scene[i].html, scene[i].profit, scene[i].flip); i++;
        setTimeout(emit, rint(110, 560));          // lines of one action trickle in
      } else {
        setTimeout(autoTick, rint(1500, 4800));    // then a pause before the next action
      }
    })();
  }
  function startAuto() { if (driven) return; autoOn = true; setTimeout(autoTick, 750); }

  window.BAFTerm = {
    blocks: NB,
    showBlocks: renderBlocks,
    seekProgress: (p) => renderBlocks(1 + clamp01(p) * (NB - 1)),
    takeOver: () => { driven = true; autoOn = false; },
  };

  /* boot: startup block, then auto-play unless a scroll driver claims it */
  renderBlocks(1);
  if (!reduce) setTimeout(startAuto, 850);
  else renderBlocks(Math.min(4, NB)); /* reduced motion: a few actions, static */
})();
