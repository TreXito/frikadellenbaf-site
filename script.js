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
// banner is centered with the neighbours peeking on either side. It auto-
// advances every 5s (with a fill bar showing the countdown) and can be dragged
// / swiped left-right on touch or mouse. Seamless infinite loop via clones on
// both ends. Responsive from phones to ultrawide.
(function () {
    const section = document.getElementById('live');
    const viewport = document.getElementById('carousel');
    const track = document.getElementById('ctrack');
    if (!section || !viewport || !track) return;

    const CYCLE_MS = 5000, ANIM_MS = 600, CLONES = 2;
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
        // Clones on BOTH ends so dragging either direction always reveals a neighbour.
        const head = data.slice(-CLONES), tail = data.slice(0, CLONES);
        [...head, ...data, ...tail].forEach(f => track.appendChild(makeSlide(f)));
        const slides = Array.from(track.children);
        section.hidden = false;

        // Progress bar (fills over CYCLE_MS, then advances).
        const bar = document.createElement('div'); bar.className = 'cs-bar';
        const fill = document.createElement('i'); bar.appendChild(fill);
        viewport.appendChild(bar);

        let active = CLONES, slideW = 0, gap = 24;
        function measure() {
            const vw = viewport.clientWidth;
            // Phones: card takes most of the width (slim peeks). Desktop/ultrawide:
            // capped so it never balloons, peeks stay generous.
            slideW = vw < 600 ? Math.round(vw * 0.84)
                              : Math.min(540, Math.round(vw * 0.5));
            gap = Math.max(10, Math.round(slideW * 0.05));
            slides.forEach(s => s.style.width = slideW + 'px');
            track.style.gap = gap + 'px';
            bar.style.width = slideW + 'px';
        }
        function restX(i) { return viewport.clientWidth/2 - (i*(slideW+gap) + slideW/2); }
        function center(i, animate) {
            track.style.transition = animate ? `transform ${ANIM_MS}ms cubic-bezier(.5,0,.2,1)` : 'none';
            track.style.transform = `translateX(${restX(i)}px)`;
            slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
        }
        function settle() {
            // Jump from a clone to its real twin without animation, after the slide finishes.
            if (active >= CLONES + real) { active -= real; center(active, false); }
            else if (active < CLONES)   { active += real; center(active, false); }
        }
        function go(dir) {                          // dir: +1 next, -1 prev
            active += dir;
            center(active, true);
            elapsed = 0; fill.style.width = '0%';
            setTimeout(settle, ANIM_MS + 30);
        }

        measure(); center(active, false);
        window.addEventListener('resize', () => { measure(); center(active, false); });

        // ── auto-advance with a fill bar (rAF so pause/drag freeze it cleanly) ──
        let elapsed = 0, last = performance.now(), hovered = false, dragging = false;
        function frame(now) {
            const dt = now - last; last = now;
            if (!hovered && !dragging) {
                elapsed += dt;
                fill.style.width = Math.min(100, elapsed / CYCLE_MS * 100) + '%';
                if (elapsed >= CYCLE_MS) go(1);
            }
            requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
        viewport.addEventListener('mouseenter', () => { hovered = true; });
        viewport.addEventListener('mouseleave', () => { hovered = false; });

        // ── drag / swipe (pointer events: works for touch + mouse) ──
        let startX = 0, startY = 0, dragDX = 0, baseX = 0, decided = false;
        viewport.addEventListener('pointerdown', e => {
            dragging = true; decided = false; dragDX = 0;
            startX = e.clientX; startY = e.clientY; baseX = restX(active);
            track.style.transition = 'none';
        });
        viewport.addEventListener('pointermove', e => {
            if (!dragging) return;
            const dx = e.clientX - startX, dy = e.clientY - startY;
            if (!decided) {
                if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
                if (Math.abs(dy) > Math.abs(dx)) { dragging = false; return; } // vertical → let page scroll
                decided = true;
                try { viewport.setPointerCapture(e.pointerId); } catch (_) {}
                viewport.classList.add('grabbing');
            }
            dragDX = dx;
            track.style.transform = `translateX(${baseX + dx}px)`;
        });
        function endDrag() {
            if (!dragging) return;
            dragging = false; viewport.classList.remove('grabbing');
            if (!decided) return;
            const threshold = Math.max(40, slideW * 0.18);
            if (dragDX <= -threshold) go(1);
            else if (dragDX >= threshold) go(-1);
            else { center(active, true); elapsed = 0; fill.style.width = '0%'; }
        }
        viewport.addEventListener('pointerup', endDrag);
        viewport.addEventListener('pointercancel', endDrag);
    }).catch(() => { /* no data — leave section hidden */ });
})();
