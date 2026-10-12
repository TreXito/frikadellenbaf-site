#!/usr/bin/env python3
"""Refresh flips.json from the LIVE baf-backend on TrueNAS.

Source of truth: /mnt/Datapool1/baf-backend/data/baf.sqlite (events table).
  - kind='buy'  carries raw JSON: buySpeedMs, finder, target
  - kind='sell' carries the realized sale price and realized profit
Every exported flip is a REALIZED sale paired with its buy (same instance +
item): price = what we paid, target = what it actually sold for, profit =
backend-realized profit. No estimates.

Usage (from the repo root, on a host with `ssh truenas` key access):
    python3 tools/export-flips.py
Writes flips.json plus prints fresh totals for the site copy.
"""
import json, os, re, sqlite3, subprocess, sys, tempfile, urllib.request

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(REPO, 'flips.json')
REMOTE_DB = '/mnt/Datapool1/baf-backend/data/baf.sqlite'
REMOTE_TMP = '/tmp/baf-export.sqlite'
TOP_N = 400            # rows in flips.json (walker / tape / showcase read it all)
MAX_PER_ITEM = 5       # cap repeats of one item name for variety

def fetch(url, dest):
    with urllib.request.urlopen(url, timeout=60) as r, open(dest, 'wb') as f:
        f.write(r.read())

def main():
    tmp = tempfile.mkdtemp(prefix='flipsexport-')
    db_path = os.path.join(tmp, 'baf-export.sqlite')
    subprocess.run(['ssh', 'truenas', f'sqlite3 {REMOTE_DB} ".backup {REMOTE_TMP}"'], check=True)
    try:
        subprocess.run(['scp', '-q', f'truenas:{REMOTE_TMP}', db_path], check=True)
    finally:
        subprocess.run(['ssh', 'truenas', f'rm -f {REMOTE_TMP}'], check=False)
    cofl_path = os.path.join(tmp, 'items.json')
    hyp_path = os.path.join(tmp, 'hypixel-items.json')
    fetch('https://sky.coflnet.com/api/items', cofl_path)
    fetch('https://api.hypixel.net/v2/resources/skyblock/items', hyp_path)

    cofl = json.load(open(cofl_path))
    hyp = json.load(open(hyp_path))['items']
    tier_by_tag = {i['id']: (i.get('tier') or None) for i in hyp if 'id' in i}
    lookup = {}
    for it in hyp:      # first entry wins: canonical id beats _CELEBRATION dupes
        if it.get('name') and it.get('id'):
            lookup.setdefault(it['name'].lower(), (it['id'], it.get('tier') or None))
    for it in cofl:
        n, t = it.get('name'), it.get('tag')
        if n and t:
            lookup.setdefault(n.lower(), (t, tier_by_tag.get(t)))
    COFL_TAGS = {i.get('tag') for i in cofl if i.get('tag')}

    STARS = '✪➊➋➌➍➎✦'
    PETRE = re.compile(r'^\[Lvl \d+\]\s*(\[\d+✦\]\s*)?')
    def clean(name):
        return PETRE.sub('', name or '').rstrip(STARS).strip()
    def resolve(disp):
        base = clean(disp)
        words = base.split()
        for drop in range(0, 3):   # strip reforge prefixes until it matches
            hit = lookup.get(' '.join(words[drop:]).lower())
            if hit: return hit
        if disp != base:           # a pet name: coflnet tags are PET_<NAME_UPPER>
            t = 'PET_' + base.upper().replace(' ', '_').replace("'", '')
            if t in COFL_TAGS: return (t, None)
        return (None, None)

    db = sqlite3.connect(db_path)
    c = db.cursor()
    buys = {}
    for inst, item, price, raw, ts in c.execute(
            "select instance_id, item_name, price, raw, created_at from events "
            "where kind='buy' and is_bazaar=0 and raw is not null"):
        try: r = json.loads(raw)
        except Exception: r = {}
        buys.setdefault((inst, item), []).append({
            'ts': ts, 'price': price,
            'speed': r.get('buySpeedMs'), 'finder': r.get('finder') or '',
        })
    for v in buys.values(): v.sort(key=lambda b: b['ts'])

    flips = []
    for inst, item, price, profit, ts in c.execute(
            "select instance_id, item_name, price, profit, created_at from events "
            "where kind='sell' and is_bazaar=0 and profit is not null and profit > 0"):
        cand = buys.get((inst, item)) or []
        b = None
        for cb in cand:
            if cb['ts'] <= ts: b = cb
            else: break
        if b: cand.remove(b)
        paid = b['price'] if b and b['price'] else max(1, price - profit)
        if paid <= 0: continue
        tag, tier = resolve(item)
        flips.append({
            'item': item, 'rarity': (tier or '').lower() or None, 'tag': tag,
            'price': round(paid), 'target': price, 'profit': round(profit),
            'roi': round(profit / paid * 100, 1),
            'speed': b['speed'] if b else None,
            'finder': (b['finder'] if b else '').replace('_', ' ').title(),
        })
    flips.sort(key=lambda f: -f['profit'])
    out, per = [], {}
    for f in flips:
        if per.get(f['item'], 0) >= MAX_PER_ITEM: continue
        per[f['item']] = per.get(f['item'], 0) + 1
        out.append(f)
        if len(out) >= TOP_N: break
    json.dump(out, open(OUT, 'w'))

    sells, tot, mx = c.execute(
        "select count(*), sum(profit), max(profit) from events "
        "where kind='sell' and is_bazaar=0 and profit>0").fetchone()
    print(f'wrote {OUT}: {len(out)} flips ({sum(1 for f in out if f["tag"])} tagged)')
    print(f'live totals for site copy: {sells:,} profitable sales · {tot/1e9:.1f}B realized · biggest +{mx/1e9:.2f}B')

if __name__ == '__main__':
    main()
