document.addEventListener('DOMContentLoaded', () => {

    /* ── ローダー ── */
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => loader.classList.add('is-hidden'), 1400);
    });
    setTimeout(() => loader.classList.add('is-hidden'), 2600); // フォールバック

    /* ── ヘッダー スクロール ── */
    const header = document.getElementById('header');
    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ── ハンバーガーメニュー ── */
    const toggle = document.getElementById('navToggle');
    const mobile = document.getElementById('navMobile');
    const links = mobile.querySelectorAll('a');
    const closeMenu = () => {
        toggle.classList.remove('is-open');
        mobile.classList.remove('is-open');
        document.body.style.overflow = '';
    };
    toggle.addEventListener('click', () => {
        const open = mobile.classList.toggle('is-open');
        toggle.classList.toggle('is-open', open);
        document.body.style.overflow = open ? 'hidden' : '';
    });
    links.forEach(a => a.addEventListener('click', closeMenu));

    /* ── スクロールリビール ── */
    const reveals = document.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('is-visible');
                io.unobserve(e.target);
            }
        });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
    reveals.forEach(el => io.observe(el));

    /* ── 数字カウントアップ ── */
    const counters = document.querySelectorAll('[data-count]');
    const countIO = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const el = e.target;
            const target = parseInt(el.dataset.count, 10);
            const isYear = target > 1900;
            const dur = 1600;
            const start = performance.now();
            const from = isYear ? target - 30 : 0;
            const step = (now) => {
                const p = Math.min((now - start) / dur, 1);
                const ease = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.floor(from + (target - from) * ease);
                if (p < 1) requestAnimationFrame(step);
                else el.textContent = target;
            };
            requestAnimationFrame(step);
            countIO.unobserve(el);
        });
    }, { threshold: 0.5 });
    counters.forEach(el => countIO.observe(el));

    /* ── HEROパララックス（マウス追従） ── */
    const heroGradient = document.querySelector('.hero-gradient');
    const heroCopy = document.querySelector('.hero-copy');
    if (window.matchMedia('(min-width: 901px)').matches) {
        window.addEventListener('mousemove', (ev) => {
            const x = (ev.clientX / window.innerWidth - 0.5);
            const y = (ev.clientY / window.innerHeight - 0.5);
            if (heroGradient) heroGradient.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
            if (heroCopy) heroCopy.style.transform = `translate(${x * 12}px, ${y * 8}px)`;
        });
    }

    /* ── 粒子アニメーション ── */
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let w, h, particles = [], mouse = { x: -999, y: -999 };

    const colors = ['rgba(211,0,55,', 'rgba(42,68,128,', 'rgba(255,255,255,'];

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    function initParticles() {
        const count = Math.min(Math.floor((w * h) / 16000), 90);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,
                r: Math.random() * 1.6 + 0.4,
                c: colors[Math.floor(Math.random() * colors.length)],
                a: Math.random() * 0.5 + 0.2
            });
        }
    }
    function draw() {
        ctx.clearRect(0, 0, w, h);
        // 線
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > w) p.vx *= -1;
            if (p.y < 0 || p.y > h) p.vy *= -1;

            // マウス反発
            const dxm = p.x - mouse.x, dym = p.y - mouse.y;
            const dm = Math.hypot(dxm, dym);
            if (dm < 120) {
                p.x += (dxm / dm) * 1.2;
                p.y += (dym / dm) * 1.2;
            }

            for (let j = i + 1; j < particles.length; j++) {
                const q = particles[j];
                const d = Math.hypot(p.x - q.x, p.y - q.y);
                if (d < 130) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255,255,255,${(1 - d / 130) * 0.08})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.stroke();
                }
            }
            ctx.beginPath();
            ctx.fillStyle = p.c + p.a + ')';
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        }
        requestAnimationFrame(draw);
    }
    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('mouseout', () => { mouse.x = -999; mouse.y = -999; });
    window.addEventListener('resize', () => { resize(); initParticles(); });

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        resize(); initParticles(); draw();
    }
});
