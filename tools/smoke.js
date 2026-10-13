// Smoke test: load the REAL terminal.js + main.js against a minimal DOM shim.
// Catches load-time crashes (TDZ, undefined refs) without a browser.
'use strict';

function makeEl(id) {
  const el = {
    id, children: [], style: {}, textContent: '', _inner: '', hidden: false,
    dataset: {},
    classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    addEventListener() {}, removeEventListener() {},
    set innerHTML(v) { this._inner = v; }, get innerHTML() { return this._inner; },
    get lastChild() { return this.children[this.children.length - 1] || null; },
    appendChild(c) { this.children.push(c); return c; },
    removeChild(c) { this.children = this.children.filter(x => x !== c); return c; },
    replaceWith() {}, closest() { return null; },
    clientWidth: 800, scrollHeight: 100, scrollTop: 0, offsetWidth: 0,
  };
  return el;
}
const els = {};
global.document = {
  documentElement: makeEl('html'),
  body: makeEl('body'),
  getElementById: id => (els[id] = els[id] || makeEl(id)),
  createElement: tag => {
    if (tag === 'template') {
      const t = makeEl('template');
      let parsed = null;
      Object.defineProperty(t, 'innerHTML', {
        set(v) { parsed = makeEl('parsed'); },
        get() { return ''; },
      });
      t.content = { get firstChild() { return parsed; } };
      return t;
    }
    return makeEl(tag);
  },
  querySelectorAll: sel => [],
  querySelector: sel => null,
  addEventListener() {},
};
global.matchMedia = () => ({ matches: true });   // prefers-reduced-motion: reduce
global.location = { search: '' };
global.addEventListener = () => {};
global.fetch = () => Promise.reject(new Error('offline'));
global.window = { innerWidth: 1400 };
global.requestAnimationFrame = cb => { setTimeout(() => cb(0), 0); };
// IntersectionObserver for main.js reveal fallback
global.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };

require(require('path').join(__dirname, '..', 'terminal.js'));
require(require('path').join(__dirname, '..', 'main.js'));

setTimeout(() => {
  const term = global.window.BAFTerm;
  if (!term) { console.error('FAIL: window.BAFTerm missing'); process.exit(1); }
  console.log('BAFTerm ok, blocks =', term.blocks);
  const body = els['term-body'];
  term.showBlocks(4);
  console.log('lines after showBlocks(4):', body.children.length);
  term.seekProgress(1);
  console.log('lines after seekProgress(1):', body.children.length);
  console.log('footer profit cell:', els['tf-profit'].textContent);
  console.log('footer flips cell:', els['tf-flips'].textContent);
  console.log('footer logsum cell:', els['tf-logsum'].textContent);
  console.log('footer logi cell:', els['tf-logi'].textContent);
  if (body.children.length < 10) { console.error('FAIL: too few lines rendered'); process.exit(1); }
  if (!/^\+\d/.test(els['tf-profit'].textContent)) { console.error('FAIL: profit cell empty'); process.exit(1); }
  console.log('SMOKE OK');
  process.exit(0);
}, 2600);   // let one auto-play interval + walker tick fire
