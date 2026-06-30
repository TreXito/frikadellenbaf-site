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

// ── Live flips feed ───────────────────────────────────────
// A rolling, anonymized snapshot loaded from flips.json. New rows slide in on
// an interval and age over time, so it reads as a live feed without any backend.
(function () {
    const section = document.getElementById('live');
    const feed = document.getElementById('feed');
    if (!section || !feed) return;

    const MAX_ROWS = 6;
    const TICK_MS = 3200;
    const RARITY = { legendary:'#f5b942', mythic:'#e0a3ff', epic:'#b08bff', rare:'#5aa9ff' };

    const fmt = (n) => {
        n = +n || 0; const a = Math.abs(n);
        if (a >= 1e9) return (n/1e9).toFixed(2)+'B';
        if (a >= 1e6) return (n/1e6).toFixed(1)+'M';
        if (a >= 1e3) return (n/1e3).toFixed(0)+'K';
        return ''+n;
    };
    const ago = (sec) => sec < 3 ? 'just now' : sec < 60 ? sec+'s ago'
        : Math.floor(sec/60)+'m '+(sec%60)+'s ago';

    const shuffle = (arr) => { for (let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; } return arr; };

    function rowHTML(f) {
        const stars = f.stars ? ` <span class="fr-stars">${f.stars}</span>` : '';
        return `<div class="fr-bar"></div>
            <div class="fr-main">
              <span class="fr-item">${f.item}${stars}</span>
              <span class="fr-sub">${fmt(f.price)} <span class="fr-arrow">→</span> ${fmt(f.target)} · ⚡${f.speed}ms · 🔎 ${f.finder}</span>
            </div>
            <div class="fr-side">
              <span class="fr-profit">+${fmt(f.profit)}</span>
              <span class="fr-roi">${f.roi}% ROI</span>
              <span class="fr-time" data-t="0">just now</span>
            </div>`;
    }

    function addRow(f, animate) {
        const el = document.createElement('div');
        el.className = 'feed-row' + (animate ? ' entering' : '');
        el.style.setProperty('--rar', RARITY[f.rarity] || '#f5b942');
        el.dataset.born = Date.now();
        el.innerHTML = rowHTML(f);
        feed.prepend(el);
        if (animate) requestAnimationFrame(() => el.classList.remove('entering'));
        while (feed.children.length > MAX_ROWS) {
            const last = feed.lastElementChild;
            last.classList.add('leaving');
            setTimeout(() => last.remove(), 400);
        }
    }

    function tickAges() {
        const now = Date.now();
        feed.querySelectorAll('.feed-row').forEach(r => {
            const t = r.querySelector('.fr-time');
            if (t) t.textContent = ago(Math.floor((now - +r.dataset.born) / 1000));
        });
    }

    fetch('flips.json').then(r => r.ok ? r.json() : Promise.reject()).then(data => {
        if (!Array.isArray(data) || !data.length) return;
        const pool = shuffle(data.slice());
        let i = 0;
        const next = () => pool[(i++) % pool.length];

        section.hidden = false;
        // Seed the feed with a few rows, pre-aged so it doesn't look empty.
        for (let s = MAX_ROWS - 1; s >= 0; s--) {
            const f = next();
            addRow(f, false);
            feed.firstElementChild.dataset.born = Date.now() - (s + 1) * 4000;
        }
        tickAges();
        setInterval(tickAges, 1000);
        setInterval(() => addRow(next(), true), TICK_MS);
    }).catch(() => { /* no feed data — leave section hidden */ });
})();
