// ── Install Tabs ──────────────────────────────────────────
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.install-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const target = document.getElementById('tab-' + tab.dataset.tab);
        if (target) target.classList.add('active');
    });
});

// ── Navbar Scroll Effect ──────────────────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, { passive: true });

// ── Reveal on Scroll (IntersectionObserver) ───────────────
const revealElements = document.querySelectorAll(
    '.feature-card, .step, .config-block, .terminal, .screenshot-card, .video-wrapper, .feature-list-section'
);

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    revealObserver.observe(el);
});

// CSS for revealed state
const style = document.createElement('style');
style.textContent = `.revealed { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);

// ── Broken Image Fallback ─────────────────────────────────
document.querySelectorAll('.screenshot-card img').forEach(img => {
    img.addEventListener('error', () => {
        const placeholder = document.createElement('div');
        placeholder.className = 'img-error';
        const card = img.closest('.screenshot-card');
        const label = card && card.querySelector('.screenshot-label');
        placeholder.innerHTML = '<span class="img-error-icon">\uD83D\uDCF7</span>'
            + (label ? label.textContent.trim() : 'Screenshot')
            + '<span class="img-error-sub">Preview coming soon</span>';
        img.replaceWith(placeholder);
    });
});

// ── Big-flips carousel ────────────────────────────────────
// A 16:9 banner reel of real 5M+ flips (flips.json, anonymized). The active
// banner is centered with the neighbours peeking on either side, and it slides
// to the next on an interval — seamless infinite loop via cloned slides.
(function () {
    const section = document.getElementById('live');
    const viewport = document.getElementById('carousel');
    const track = document.getElementById('ctrack');
    if (!section || !viewport || !track) return;

    const ADVANCE_MS = 4200, ANIM_MS = 650, CLONES = 2;
    // True SkyBlock rarity colours for the item name (readable on dark).
    const RCOLOR = { common:'#f5f5f5', uncommon:'#5cff5c', rare:'#5b8cff', epic:'#c45bff',
        legendary:'#ffb627', mythic:'#ff66e0', divine:'#4fe0ff', special:'#ff6b6b',
        very_special:'#ff6b6b', supreme:'#ff6b6b', ultimate:'#ff4d4d' };
    const ICON = (tag) => 'https://sky.coflnet.com/static/icon/' + encodeURIComponent(tag);
    const flipLabel = (p) => p >= 100e6 ? 'INSANE FLIP' : p >= 30e6 ? 'HUGE FLIP' : 'BIG FLIP';

    const fmt = (n) => {
        n = +n || 0; const a = Math.abs(n);
        if (a >= 1e9) return (n/1e9).toFixed(2)+'B';
        if (a >= 1e6) return (n/1e6).toFixed(1)+'M';
        if (a >= 1e3) return (n/1e3).toFixed(0)+'K';
        return ''+n;
    };

    function slideHTML(f) {
        const col = RCOLOR[f.rarity] || '#ffd470';
        const icon = f.tag ? `<img class="cs-icon" src="${ICON(f.tag)}" loading="lazy" alt="" onerror="this.remove()">` : '';
        return `<div class="cs-head">
              ${icon}
              <div class="cs-headtext">
                <div class="cs-tagline"><span class="cs-tag">${flipLabel(f.profit)}</span><span class="cs-finder">🔎 ${f.finder}</span></div>
                <div class="cs-item" style="color:${col}">${f.item}</div>
              </div>
            </div>
            <div class="cs-profit">+${fmt(f.profit)}<span class="cs-roi">${f.roi}% ROI</span></div>
            <div class="cs-stats">
              <div><span>Bought</span><b>${fmt(f.price)}</b></div>
              <div><span>Target</span><b>${fmt(f.target)}</b></div>
              <div><span>Buy speed</span><b>${f.speed}ms</b></div>
            </div>`;
    }
    function makeSlide(f) {
        const el = document.createElement('div');
        el.className = 'cs';
        el.style.setProperty('--rar', RCOLOR[f.rarity] || '#f5b942');  // icon glow tint
        el.innerHTML = slideHTML(f);
        return el;
    }

    fetch('flips.json').then(r => r.ok ? r.json() : Promise.reject()).then(data => {
        if (!Array.isArray(data) || data.length < 3) return;
        for (let i = data.length-1; i>0; i--){ const j = Math.floor(Math.random()*(i+1)); [data[i],data[j]]=[data[j],data[i]]; }

        const real = data.length;
        data.forEach(f => track.appendChild(makeSlide(f)));
        for (let k = 0; k < CLONES; k++) track.appendChild(makeSlide(data[k]));  // seamless wrap
        const slides = Array.from(track.children);
        section.hidden = false;

        let active = 0, slideW = 0, gap = 24;
        function measure() {
            const vw = viewport.clientWidth;
            slideW = Math.min(470, Math.round(vw * 0.62));
            gap = Math.max(12, Math.round(slideW * 0.05));
            slides.forEach(s => s.style.width = slideW + 'px');
            track.style.gap = gap + 'px';
        }
        function center(i, animate) {
            const x = viewport.clientWidth/2 - (i*(slideW+gap) + slideW/2);
            track.style.transition = animate ? `transform ${ANIM_MS}ms cubic-bezier(.5,0,.2,1)` : 'none';
            track.style.transform = `translateX(${x}px)`;
            slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
        }
        function advance() {
            active++;
            center(active, true);
            if (active === real) {                 // reached first clone → snap back
                setTimeout(() => { active = 0; center(0, false); }, ANIM_MS + 40);
            }
        }

        measure(); center(0, false);
        let timer = setInterval(advance, ADVANCE_MS);
        window.addEventListener('resize', () => { measure(); center(active, false); });
        viewport.addEventListener('mouseenter', () => clearInterval(timer));
        viewport.addEventListener('mouseleave', () => { timer = setInterval(advance, ADVANCE_MS); });
    }).catch(() => { /* no data — leave section hidden */ });
})();
