/* ============================================================================
   Live terminal — a faithful BAF session as a fixed, SEEKABLE script.
   Scroll drives it (main.js scrubs seekProgress); falls back to auto-play.
   Vocabulary mirrors real frikadellen_baf logs.
   ========================================================================== */
(function () {
  const body = document.getElementById('term-body');
  if (!body) return;
  const elP = document.getElementById('tf-profit');
  const elF = document.getElementById('tf-flips');
  const elS = document.getElementById('tf-speed');
  const elU = document.getElementById('tf-purse');
  const elT = document.getElementById('tf-uptime');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── helpers ─────────────────────────────────────────────────────────── */
  const rint = (a, b) => Math.floor(a + Math.random() * (b - a + 1));
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
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

  /* ── data pool (from flips.json + real logs) ─────────────────────────── */
  const AH = [
    { n: 'Mantid Helianthus Helmet',           p: 63999999, t: 75305504, f: 'model' },
    { n: 'Heroic Hyperion ✪✪✪✪✪',             p: 600000000, t: 726900000, f: 'Sniper Median' },
    { n: 'Soul Whip',                          p: 16000000, t: 25900000, f: 'Sniper Median' },
    { n: "Ancient Necron's Leggings ✪✪✪✪✪",    p: 23000000, t: 36191576, f: 'Sniper' },
    { n: 'Red Claw Artifact',                  p: 15000000, t: 21000000, f: 'Sniper Median' },
    { n: 'Eternal Hoof',                       p: 15000000, t: 22910865, f: 'Sniper' },
    { n: 'Terror Chestplate ✪✪✪✪✪',           p: 44000000, t: 55900000, f: 'Sniper' },
    { n: 'Shadow Assassin Chestplate ✪✪✪✪✪',  p: 19000000, t: 27400000, f: 'model' },
    { n: 'Erudite Deific Spade',               p: 41000000, t: 55000000, f: 'model' },
    { n: 'Auspicious Jasper Drill X',          p: 65000000, t: 84743776, f: 'Sniper Median' },
    { n: 'Waxed Soulweaver Gloves ✪✪✪✪✪',      p: 10000000, t: 19703258, f: 'Sniper' },
    { n: "Bustling Rancher's Boots",           p: 5100000,  t: 7108500,  f: 'model' },
    { n: '[Lvl 95] Blue Whale',                p: 20000000, t: 27500000, f: 'Sniper Median' },
    { n: 'Fabled Reaper Falchion ✪✪✪✪✪',       p: 30000000, t: 41200000, f: 'Sniper' },
  ];
  const RELIST = [
    { n: '[Lvl 90] Tiger', p: 38160151 }, { n: '[Lvl 25] Monkey', p: 23382498 },
    { n: '[Lvl 92] Griffin', p: 22049999 }, { n: 'Blazing Jade Belt', p: 81337038 },
    { n: "Necrotic Storm's Leggings ✪✪✪✪✪", p: 30219112 },
  ];
  const SELLABLE = ['Mantid Fermento Chestplate', 'Mossy Fermento Chestplate', 'Withered Vorpal Katana', "Necrotic Storm's Boots ✪✪✪✪✪"];
  const BZ = [
    { n: 'Plant Matter', amt: 34, ppu: 11432.5 }, { n: 'Enchanted Diamond', amt: 7, ppu: 1301.7 },
    { n: 'Enchanted Ice', amt: 128, ppu: 322.4 }, { n: 'Mycelium', amt: 64, ppu: 890.1 },
  ];
  const BUYERS = ['_FendinX_', 'M3l4ncholy', 'jedizak', 'mouse92', 'Mayhemi__', 'idkhsq', 'Skylias', 'koraxis', 'rainpvp', 'Threadless'];
  const MOD = { ws: 'ws::client', bc: 'bot::client', bh: 'bot::handlers', cq: 'cmd_queue' };

  /* ── script builder ──────────────────────────────────────────────────── */
  let vt = new Date('2026-07-13T23:54:00Z').getTime();
  function ts() {
    vt += rint(30, 120);
    const d = new Date(vt), p = (x, n = 2) => String(x).padStart(n, '0');
    return p(d.getUTCHours()) + ':' + p(d.getUTCMinutes()) + ':' + p(d.getUTCSeconds()) + '.' + p(d.getUTCMilliseconds(), 3);
  }
  function L(msg, dim) {
    return `<span class="ln${dim ? ' dim' : ''}">` + msg + '</span>';
  }
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
    ];
  }
  function buyOk() {
    const it = pick(AH), profit = it.t - it.p, ms = rint(48, 72);
    return [
      step(L(BAF + ' Trying to purchase flip: ' + S('t-item', esc(it.n)) + ' for ' + S('t-money', commas(it.p)) + ' coins ' + S('t-key', '(Target: ' + commas(it.t) + ', Profit: ' + commas(profit) + ')'))),
      step(L('Putting coins in escrow...', true)),
      step(L(BAF + ' Auction bought in ' + S('t-ms', ms + 'ms'))),
      step(L('Processing purchase...', true)),
      step(L('You purchased ' + S('t-item', esc(it.n)) + ' for ' + S('t-money', commas(it.p) + ' coins') + '!')),
      step(L(BAF + ' 🏷 BIN listed: ' + S('t-item', esc(it.n)) + ' @ ' + S('t-money', commas(it.t)) + ' coins for 6h'), { f: 1 }),
    ];
  }
  function buyMiss() {
    const it = pick(AH), profit = it.t - it.p, ms = rint(50, 62);
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
    const it = pick(AH), buyer = pick(BUYERS), price = it.t, net = Math.round(price * 0.99);
    return [
      step(L(S('t-cmd', '[Auction]') + ' ' + esc(buyer) + ' bought ' + S('t-item', esc(it.n)) + ' for ' + S('t-money', commas(price)) + ' coins ' + S('t-key', 'CLICK'))),
      step(L(BAF + ' ' + S('t-ok', '⚡ SOLD') + ' ' + S('t-item', esc(it.n)) + ' to ' + esc(buyer) + ' for ' + S('t-money', commas(price) + ' coins') + '!')),
      step(L('You collected ' + S('t-money', commas(net) + ' coins') + ' from selling ' + S('t-item', esc(it.n)) + ' to ' + S('t-cmd', '[MVP+] ' + buyer) + ' in an auction!')),
    ];
  }
  function bazaar() {
    const it = pick(BZ), total = Math.round(it.amt * it.ppu);
    return [
      step(L(S('t-cofl', '[Bazaar]') + ' Sell Offer Setup! ' + S('t-cmd', it.amt + 'x') + ' ' + S('t-item', esc(it.n)) + ' for ' + S('t-money', commas(total) + ' coins') + '.')),
    ];
  }

  /* each block = one full action (a whole buy / sell / bazaar / the startup) */
  const BLOCKS = [
    startup(),
    buyOk(), sold(), bazaar(),
    buyOk(), buyMiss(), sold(),
    buyOk(), sold(), bazaar(),
    buyMiss(), buyOk(), sold(),
    buyOk(), sold(), bazaar(),
  ];
  const NB = BLOCKS.length;

  const startTs = Date.now() - (4 * 3600 + rint(0, 3000)) * 1000;

  /* ── DOM render: reveal whole blocks (one action per scroll step) ─────── */
  let shownBlocks = 0;
  function appendLine(html) {
    const tpl = document.createElement('template');
    tpl.innerHTML = html;
    body.appendChild(tpl.content.firstChild);
  }
  function renderBlocks(n) {
    n = Math.max(0, Math.min(NB, Math.round(n)));
    if (n > shownBlocks) {
      for (let b = shownBlocks; b < n; b++) BLOCKS[b].forEach(st => appendLine(st.html));
    } else if (n < shownBlocks) {
      let rm = 0; for (let b = n; b < shownBlocks; b++) rm += BLOCKS[b].length;
      for (let i = 0; i < rm; i++) body.lastChild && body.removeChild(body.lastChild);
    }
    shownBlocks = n;
    body.scrollTop = body.scrollHeight;
  }

  /* ── live session stats — advance with TIME, independent of scroll ───── */
  let profit = 2.41e9 + rint(0, 6e7), flips = 318 + rint(0, 10), purse = 823406920, disp = profit;
  function paintStats() {
    if (elP) elP.textContent = '+' + short(disp);
    if (elF) elF.textContent = commas(flips);
    if (elU) elU.textContent = short(purse);
    if (elT) { const s = Math.floor((Date.now() - startTs) / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); elT.textContent = h + 'h ' + String(m).padStart(2, '0') + 'm'; }
  }
  function landFlip() { /* a flip lands every ~1.4–3.2s */
    profit += rint(180000, 3400000);
    if (chance(0.55)) flips += 1;
    purse += rint(-4e6, 7e6); if (purse < 4e8) purse += 3e8;
    setTimeout(landFlip, rint(1400, 3200));
  }
  (function raf() { /* smooth count-up toward the running total */
    disp += (profit - disp) * 0.08; if (Math.abs(profit - disp) < 1) disp = profit;
    paintStats(); requestAnimationFrame(raf);
  })();
  if (!reduce) setTimeout(landFlip, 900);

  /* ── auto-play fallback (until the scroll driver takes over) ─────────── */
  let driven = false, autoTimer = null;
  function startAuto() {
    if (driven) return;
    let n = 1;
    autoTimer = setInterval(() => {
      if (driven) { clearInterval(autoTimer); return; }
      n++;
      if (n > NB) { while (body.firstChild) body.removeChild(body.firstChild); shownBlocks = 0; n = 1; }
      renderBlocks(n);
    }, 1500);
  }

  window.BAFTerm = {
    blocks: NB,
    showBlocks: renderBlocks,
    seekProgress: (p) => renderBlocks(1 + clamp01(p) * (NB - 1)),
    takeOver: () => { driven = true; if (autoTimer) clearInterval(autoTimer); },
  };

  /* boot: show the startup block, then auto-play unless a scroll driver claims it */
  renderBlocks(1);
  if (!reduce) setTimeout(startAuto, 800);
  else renderBlocks(Math.min(4, NB)); /* reduced motion: a few actions, static */
})();
