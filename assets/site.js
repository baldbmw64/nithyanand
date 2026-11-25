/* Nithyanand – gemeinsame Interaktionen der Unterseiten */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* Ornament-Ecken (angelehnt an die gedruckte Speisekarte) */
  const ORN = `<svg viewBox="0 0 80 80" fill="none" stroke="currentColor" stroke-linecap="round" aria-hidden="true">
    <path d="M3 80V20C3 10 10 3 20 3h60" stroke-width="3"/>
    <path d="M13 80V28c0-8.5 6.5-15 15-15h52" stroke-width="1.2"/>
    <rect x="19" y="19" width="9" height="9" stroke-width="2"/>
    <path d="M3 34c9 0 13-5 13-11s-6-9-10-5" stroke-width="2.4"/>
    <path d="M34 3c0 9-5 13-11 13s-9-6-5-10" stroke-width="2.4"/></svg>`;
  $$('[data-orn]').forEach(el => {
    el.dataset.orn.split(' ').forEach(pos => el.insertAdjacentHTML('afterbegin', `<span class="orn ${pos}">${ORN}</span>`));
    el.classList.add('frame');
  });

  /* Navigation */
  const nav = $('.nav');
  if (nav) {
    const burger = $('.burger', nav);
    burger && burger.addEventListener('click', () => nav.classList.toggle('open'));
    $$('ul a', nav).forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
    const solid = () => nav.classList.toggle('solid', scrollY > 30 || nav.dataset.solid === 'always');
    solid(); addEventListener('scroll', solid, { passive: true });
  }

  /* gerissene Papierkanten */
  $$('.tear').forEach(el => {
    const W = 1200, H = 40; let d = `M0 ${H} L0 ${18 + Math.random() * 8}`;
    for (let x = 0; x < W;) { x += 8 + Math.random() * 22; d += ` L${Math.min(x, W).toFixed(1)} ${(6 + Math.random() * 24).toFixed(1)}`; }
    d += ` L${W} ${H} Z`;
    el.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><path d="${d}" fill="${el.dataset.color}"/></svg>`;
  });

  /* Reveal beim Scrollen */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  $$('.rv').forEach(el => io.observe(el));

  window.NY = { $, $$ };
})();
