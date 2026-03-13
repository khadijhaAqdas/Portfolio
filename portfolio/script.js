'use strict';
/* ====================================================
   ALEX CARTER PORTFOLIO — script.js
   Features:
   • Sticky nav with active-link highlighting
   • Particle canvas background in hero
   • Typewriter effect for hero subtitle
   • Scroll-reveal (IntersectionObserver)
   • Animated counter numbers
   • Animated skill bars
   • Project category filtering
   • Mobile hamburger menu
   • Contact form validation & submission
   ==================================================== */

// ── HELPERS ───────────────────────────────────────────
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

/* ══════════════════════════════════════════════════════
   1. NAV — scroll + active link
══════════════════════════════════════════════════════ */
const nav = $('nav');
const navLinks = $$('.nav-link');
const sections = $$('section[id]');

window.addEventListener('scroll', onScroll, { passive: true });

function onScroll() {
    // Sticky bg
    nav.classList.toggle('scrolled', window.scrollY > 20);

    // Active nav link (highlight whichever section is in view)
    let current = '';
    sections.forEach(sec => {
        const top = sec.offsetTop - 120;
        if (window.scrollY >= top) current = sec.id;
    });

    navLinks.forEach(link => {
        const href = link.getAttribute('href').slice(1);
        link.classList.toggle('active', href === current);
    });
}

// Initial call
onScroll();

/* ══════════════════════════════════════════════════════
   2. HAMBURGER / MOBILE MENU
══════════════════════════════════════════════════════ */
const hamburger = $('hamburger');
const mobileMenu = $('mobile-menu');
const mobileLinks = $$('.mobile-link');

hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    mobileMenu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
});

// Close on link click
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    });
});

/* ══════════════════════════════════════════════════════
   3. PARTICLE CANVAS
══════════════════════════════════════════════════════ */
(function initParticles() {
    const canvas = $('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
    const COUNT = 60;
    const COLORS = ['rgba(124,108,254,', 'rgba(6,182,212,', 'rgba(255,255,255,'];

    function resize() {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() { this.reset(true); }

        reset(initial = false) {
            this.x = Math.random() * W;
            this.y = initial ? Math.random() * H : H + 10;
            this.r = Math.random() * 1.5 + 0.5;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = -(Math.random() * 0.4 + 0.1);
            this.life = 0;
            this.maxLife = Math.random() * 300 + 200;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life++;
            if (this.life > this.maxLife || this.y < -10) this.reset();
        }

        draw() {
            const a = Math.sin((this.life / this.maxLife) * Math.PI) * 0.7;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = this.color + a + ')';
            ctx.fill();
        }
    }

    for (let i = 0; i < COUNT; i++) particles.push(new Particle());

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p1 = particles[i], p2 = particles[j];
                const dx = p1.x - p2.x, dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = 'rgba(124,108,254,' + (0.12 * (1 - dist / 100)) + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    let animId;
    function loop() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        animId = requestAnimationFrame(loop);
    }

    loop();
})();

/* ══════════════════════════════════════════════════════
   4. TYPEWRITER
══════════════════════════════════════════════════════ */
(function initTypewriter() {
    const el = $('typewriter');
    if (!el) return;

    const words = ['web apps.', 'APIs.', 'SaaS products.', 'open-source tools.', 'scalable systems.'];
    let wIdx = 0;
    let cIdx = 0;
    let deleting = false;
    let pauseTimer = null;

    function tick() {
        const word = words[wIdx];

        if (!deleting) {
            cIdx++;
            el.textContent = word.slice(0, cIdx);
            if (cIdx === word.length) {
                deleting = true;
                pauseTimer = setTimeout(tick, 2200);
                return;
            }
            setTimeout(tick, 80);
        } else {
            cIdx--;
            el.textContent = word.slice(0, cIdx);
            if (cIdx === 0) {
                deleting = false;
                wIdx = (wIdx + 1) % words.length;
                setTimeout(tick, 400);
                return;
            }
            setTimeout(tick, 45);
        }
    }

    setTimeout(tick, 800);
})();

/* ══════════════════════════════════════════════════════
   5. SCROLL REVEAL  (IntersectionObserver)
══════════════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

$$('.reveal').forEach(el => revealObserver.observe(el));

/* ══════════════════════════════════════════════════════
   6. COUNTER ANIMATION
══════════════════════════════════════════════════════ */
const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const end = parseInt(el.dataset.count, 10);
        const dur = 1600;
        const start = performance.now();

        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / dur, 1);
            // Ease-out quart
            const ease = 1 - Math.pow(1 - progress, 4);
            el.textContent = Math.round(ease * end).toLocaleString();
            if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
        counterObserver.unobserve(el);
    });
}, { threshold: 0.5 });

$$('.stat-number').forEach(el => counterObserver.observe(el));

/* ══════════════════════════════════════════════════════
   7. SKILL BARS
══════════════════════════════════════════════════════ */
const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
            bar.style.width = bar.dataset.width + '%';
        });
        skillObserver.unobserve(entry.target);
    });
}, { threshold: 0.3 });

$$('.skill-category').forEach(el => skillObserver.observe(el));

/* ══════════════════════════════════════════════════════
   8. PROJECT FILTER
══════════════════════════════════════════════════════ */
const filterBtns = $$('.filter-btn');
const projectCards = $$('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Show/hide + re-trigger reveal
        projectCards.forEach(card => {
            const match = filter === 'all' || card.dataset.cat === filter;
            if (match) {
                card.classList.remove('hidden');
                // Re-trigger entrance animation
                card.classList.remove('visible');
                void card.offsetHeight;
                setTimeout(() => card.classList.add('visible'), 20);
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

/* ══════════════════════════════════════════════════════
   9. CONTACT FORM VALIDATION
══════════════════════════════════════════════════════ */
const form = $('contact-form');
const submitBtn = $('form-submit');
const formSuccess = $('form-success');

form.addEventListener('submit', async e => {
    e.preventDefault();

    // Clear previous errors
    $$('.form-error').forEach(el => el.textContent = '');
    $$('input, textarea').forEach(el => el.classList.remove('invalid'));
    formSuccess.classList.remove('visible');

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    let valid = true;

    if (!name) {
        showError('name', 'name-error', 'Please enter your name.');
        valid = false;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('email', 'email-error', 'Please enter a valid email address.');
        valid = false;
    }

    if (!message || message.length < 10) {
        showError('message', 'message-error', 'Please enter at least 10 characters.');
        valid = false;
    }

    if (!valid) return;

    // Simulate sending (replace with fetch() to your backend/Formspree)
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    await simulateSend();

    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    form.reset();

    formSuccess.textContent = '✅ Message sent! I\'ll get back to you within 24 hours.';
    formSuccess.classList.add('visible');

    setTimeout(() => formSuccess.classList.remove('visible'), 6000);
});

function showError(fieldId, errId, msg) {
    $(fieldId).classList.add('invalid');
    $(errId).textContent = msg;
    $(fieldId).focus();
}

function simulateSend() {
    return new Promise(resolve => setTimeout(resolve, 1200));
}

// Remove invalid state on input
$$('input, textarea').forEach(el => {
    el.addEventListener('input', () => {
        el.classList.remove('invalid');
        const errId = el.id + '-error';
        const errEl = $(errId);
        if (errEl) errEl.textContent = '';
    });
});

/* ══════════════════════════════════════════════════════
   10. HERO INITIAL REVEALS (staggered)
══════════════════════════════════════════════════════ */
(function heroReveal() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const revealEls = hero.querySelectorAll('.reveal');
    revealEls.forEach((el, i) => {
        setTimeout(() => {
            el.style.transition = `opacity 0.8s cubic-bezier(0.22,1,0.36,1) ${i * 0.12}s, transform 0.8s cubic-bezier(0.22,1,0.36,1) ${i * 0.12}s`;
            el.classList.add('visible');
        }, 200);
    });
})();
