import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { UNITS, CTA, waHref, mapsHref, type UnitKey } from '../data/site';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const $ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => c.querySelector(s) as T | null;
const $$ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => Array.from(c.querySelectorAll(s)) as T[];
const root = document.documentElement;
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/* ============ unit state ============ */
const pageUnit = (document.body.dataset.unit || null) as UnitKey | null;
let unit: UnitKey | null = pageUnit;
if (!unit) {
  try { const s = localStorage.getItem('gofit-unit') as UnitKey | null; if (s && UNITS[s]) unit = s; } catch { /* storage off */ }
}

function msgFor(k: UnitKey, mod?: string | null) { return CTA.message(UNITS[k].name, mod); }

function refreshLinks() {
  $$<HTMLAnchorElement>('[data-wa]').forEach((a) => {
    const k = (a.dataset.unit as UnitKey) || unit;
    if (!k) return;
    a.href = waHref(k, msgFor(k, a.dataset.mod), a.dataset.wa);
  });
}
function setUnit(k: UnitKey) {
  if (!UNITS[k]) return;
  unit = k;
  try { localStorage.setItem('gofit-unit', k); } catch { /* storage off */ }
  $$('[data-u-short]').forEach((el) => { el.textContent = UNITS[k].short; });
  refreshLinks();
}
if (unit) setUnit(unit);

/* ============ chalk puff ============ */
const cv = $<HTMLCanvasElement>('#chalk');
const cx = cv?.getContext('2d') ?? null;
type P = { x: number; y: number; vx: number; vy: number; r: number; life: number; dec: number };
let parts: P[] = [];
let cvOn = false;
const DPR = Math.min(window.devicePixelRatio || 1, 2);
function sizeCv() { if (!cv) return; cv.width = innerWidth * DPR; cv.height = innerHeight * DPR; cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px'; }
sizeCv();
function puff(x: number, y: number, n = 34) {
  if (RM || !cx) return;
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, sp = 0.6 + Math.random() * 3.2;
    parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1.2, r: 2 + Math.random() * 9, life: 1, dec: 0.012 + Math.random() * 0.02 });
  }
  if (!cvOn) { cvOn = true; requestAnimationFrame(tickCv); }
}
function tickCv() {
  if (!cx) return;
  cx.setTransform(DPR, 0, 0, DPR, 0, 0);
  cx.clearRect(0, 0, innerWidth, innerHeight);
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    p.x += p.vx; p.y += p.vy; p.vx *= 0.95; p.vy = p.vy * 0.95 - 0.03; p.r *= 1.018; p.life -= p.dec;
    if (p.life <= 0) { parts.splice(i, 1); continue; }
    const g = cx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
    g.addColorStop(0, `rgba(245,244,238,${0.5 * p.life})`);
    g.addColorStop(1, 'rgba(245,244,238,0)');
    cx.fillStyle = g; cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, Math.PI * 2); cx.fill();
  }
  if (parts.length) requestAnimationFrame(tickCv);
  else { cvOn = false; cx.clearRect(0, 0, innerWidth, innerHeight); }
}

/* ============ menu ============ */
const menu = $('#menu');
const burger = $<HTMLButtonElement>('#burger');
const hdr = $('#hdr');
function closeMenu() {
  if (!menu || !burger || !menu.classList.contains('open')) return;
  menu.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Abrir menu');
  root.style.overflow = '';
}
burger?.addEventListener('click', () => {
  if (!menu) return;
  const o = !menu.classList.contains('open');
  menu.classList.toggle('open', o);
  burger.setAttribute('aria-expanded', String(o));
  burger.setAttribute('aria-label', o ? 'Fechar menu' : 'Abrir menu');
  root.style.overflow = o ? 'hidden' : '';
  if (o) hdr?.classList.remove('hide');
});
$$('.menu__nav a').forEach((a) => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

/* ============ unit sheet ============ */
const sheet = $<HTMLDialogElement>('#sheet');
let shMode: 'wa' | 'unit' | 'page' = 'wa';
let shOrigin = 'site';
let shMod: string | null = null;
function shUpdate() {
  if (!sheet) return;
  const sel = $<HTMLInputElement>('input[name="su"]:checked', sheet);
  const go = $<HTMLAnchorElement>('#shgo')!;
  const msg = $('#shmsg')!;
  if (!sel) { go.setAttribute('aria-disabled', 'true'); msg.textContent = 'Escolha a unidade para ver a mensagem.'; return; }
  const k = sel.value as UnitKey;
  go.removeAttribute('aria-disabled');
  if (shMode === 'wa') { const t = msgFor(k, shMod); msg.textContent = `“${t}”`; go.href = waHref(k, t, shOrigin); }
  else if (shMode === 'page') go.href = `/${UNITS[k].slug}/`;
  else go.href = '#';
}
function openSheet(mode: 'wa' | 'unit' | 'page', origin?: string, mod?: string | null) {
  if (!sheet) return;
  shMode = mode; shOrigin = origin || 'site'; shMod = mod || null;
  $$<HTMLInputElement>('input[name="su"]', sheet).forEach((r) => { r.checked = r.value === unit; });
  $('#shprev')!.hidden = mode !== 'wa';
  $('#shgot')!.textContent = mode === 'wa' ? 'Continuar no WhatsApp' : mode === 'page' ? 'Ver a unidade' : 'Confirmar unidade';
  $('#sh-t')!.textContent = mode === 'page' ? 'Qual unidade você quer conhecer?' : 'Em qual unidade você vai treinar?';
  const go = $<HTMLAnchorElement>('#shgo')!;
  if (mode === 'wa') go.target = '_blank'; else go.removeAttribute('target');
  shUpdate();
  if (typeof sheet.showModal === 'function') { if (!sheet.open) sheet.showModal(); } else sheet.setAttribute('open', '');
}
function closeSheet() { if (!sheet) return; if (sheet.open && sheet.close) sheet.close(); else sheet.removeAttribute('open'); }
if (sheet) {
  $$<HTMLInputElement>('input[name="su"]', sheet).forEach((r) => r.addEventListener('change', shUpdate));
  $('#shx')?.addEventListener('click', closeSheet);
  sheet.addEventListener('click', (e) => { if (e.target === sheet) closeSheet(); });
  $('#shgo')?.addEventListener('click', (e) => {
    const sel = $<HTMLInputElement>('input[name="su"]:checked', sheet);
    if (!sel) { e.preventDefault(); return; }
    const k = sel.value as UnitKey;
    setUnit(k); showUnit(k);
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    puff(r.left + r.width / 2, r.top + r.height / 2);
    if (shMode === 'page') return; // segue o link para a página da unidade
    if (shMode !== 'wa') e.preventDefault();
    setTimeout(closeSheet, shMode === 'wa' ? 150 : 260);
  });
}
$$('[data-open-unit]').forEach((b) => b.addEventListener('click', () => { closeMenu(); openSheet('unit'); }));
$$('[data-open-page]').forEach((b) => b.addEventListener('click', () => openSheet('page')));

/* ============ faq: a resposta se revela ao abrir; no computador abre com o mouse, no celular com toque ============ */
const faqItems = $$<HTMLDetailsElement>('.faq details');
const faqOpen = (d: HTMLDetailsElement) => {
  if (d.open && !d.dataset.closing) return;
  delete d.dataset.closing;
  d.open = true;
  const a = $('.ans', d);
  if (!a || RM) return;
  gsap.killTweensOf([a, ...Array.from(a.children)]);
  gsap.fromTo(a, { height: 0, clipPath: 'inset(0% 0% 100% 0%)' }, { height: 'auto', clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6, ease: 'power3.out', clearProps: 'height,clipPath' });
  gsap.fromTo(a.children, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.07, delay: 0.12, ease: 'power2.out', clearProps: 'transform,opacity,visibility' });
};
const faqClose = (d: HTMLDetailsElement) => {
  if (!d.open || d.dataset.closing) return;
  const a = $('.ans', d);
  if (!a || RM) { d.open = false; return; }
  d.dataset.closing = '1';
  gsap.killTweensOf([a, ...Array.from(a.children)]);
  gsap.to(a, {
    height: 0, clipPath: 'inset(0% 0% 100% 0%)', duration: 0.35, ease: 'power2.in',
    onComplete: () => { if (d.dataset.closing) { d.open = false; delete d.dataset.closing; } gsap.set(a, { clearProps: 'height,clipPath' }); },
  });
};
faqItems.forEach((d) => {
  $('summary', d)?.addEventListener('click', (e) => {
    e.preventDefault();
    if (d.open && !d.dataset.closing) faqClose(d);
    else { faqItems.forEach((o) => { if (o !== d) faqClose(o); }); faqOpen(d); }
  });
  if (!FINE) return;
  let t: number | undefined;
  // Pequena espera evita abrir tudo quando o mouse só atravessa a lista.
  d.addEventListener('mouseenter', () => { clearTimeout(t); t = window.setTimeout(() => { faqItems.forEach((o) => { if (o !== d) faqClose(o); }); faqOpen(d); }, 140); });
  // Fecha só quando o mouse sai da pergunta inteira, resposta incluída.
  d.addEventListener('mouseleave', () => { clearTimeout(t); t = window.setTimeout(() => faqClose(d), 160); });
});

document.addEventListener('click', (e) => {
  const a = (e.target as Element).closest?.('[data-wa]') as HTMLAnchorElement | null;
  if (!a) return;
  const k = (a.dataset.unit as UnitKey) || unit;
  if (!k) { e.preventDefault(); closeMenu(); openSheet('wa', a.dataset.wa, a.dataset.mod); return; }
  a.href = waHref(k, msgFor(k, a.dataset.mod), a.dataset.wa);
  puff(e.clientX || 0, e.clientY || 0);
});

/* ============ hero: the bar wipe + spotlight ============ */
const hero = $('#hero');
const h1 = $('.hero h1');
const wipe = $('.hero__wipe');
if (hero && h1 && wipe && !RM) {
  const intro = $$('.hero [data-intro]');
  const stars = $$('.hero__bar svg');
  gsap.set(h1, { autoAlpha: 0 });
  gsap.set(intro, { autoAlpha: 0, y: 18 });
  gsap.set('.hero__bar', { scaleX: 0, transformOrigin: 'left center' });
  gsap.set(stars, { scale: 0 });
  root.classList.add('is-in');
  const tl = gsap.timeline({ delay: 0.15 });
  // Se a aba abrir em segundo plano, a animação espera; nunca deixa o título escondido.
  setTimeout(() => { if (tl.progress() < 1) tl.progress(1); }, 3200);
  tl.to(wipe, { scaleX: 1, duration: 0.5, ease: 'power4.inOut' })
    .set(h1, { autoAlpha: 1 })
    .set(wipe, { transformOrigin: 'right center' })
    .to(wipe, { scaleX: 0, duration: 0.55, ease: 'power4.inOut' })
    .to(intro, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'expo.out' }, '-=0.3')
    .to('.hero__bar', { scaleX: 1, duration: 0.9, ease: 'power4.inOut' }, '<')
    .to(stars, { scale: 1, duration: 0.4, stagger: 0.07, ease: 'back.out(3)' }, '-=0.35');
} else {
  root.classList.add('is-in');
}

const lit = $('#lit');
if (hero && lit && !RM) {
  const sp = { x: 0.7, y: 0.52, tx: 0.7, ty: 0.52, user: false, t: 0 };
  let heroVis = true;
  hero.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    const r = hero.getBoundingClientRect();
    sp.tx = (e.clientX - r.left) / r.width; sp.ty = (e.clientY - r.top) / r.height; sp.user = true;
  });
  hero.addEventListener('pointerleave', () => { sp.user = false; });
  ScrollTrigger.create({ trigger: hero, start: 'top bottom', end: 'bottom top', onToggle: (s) => { heroVis = s.isActive; } });
  gsap.ticker.add(() => {
    if (!heroVis) return;
    sp.t += 0.006;
    if (!sp.user) { sp.tx = 0.66 + Math.sin(sp.t) * 0.18; sp.ty = 0.5 + Math.sin(sp.t * 1.7) * 0.14; }
    sp.x += (sp.tx - sp.x) * 0.08; sp.y += (sp.ty - sp.y) * 0.08;
    lit.style.setProperty('--mx', (sp.x * 100).toFixed(2) + '%');
    lit.style.setProperty('--my', (sp.y * 100).toFixed(2) + '%');
  });
}

/* ============ hero: vídeo em tríptico ============ */
const reel = $$<HTMLVideoElement>('.hero__strip video');
const playBtn = $<HTMLButtonElement>('#heroplay');
const HERO_RATE = 0.6;
if (hero && reel.length) {
  const strips = $$('.hero__strip', hero);
  const mobile = matchMedia('(max-width: 760px)');
  const saveData = !!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  // Movimento reduzido ou economia de dados: fica no pôster até a pessoa pedir o vídeo.
  let paused = RM || saveData;
  let inView = true;
  const load = (v: HTMLVideoElement) => {
    if (v.dataset.ready) return;
    v.dataset.ready = '1';
    const t = Number(v.dataset.t || 0);
    if (t) v.addEventListener('loadedmetadata', () => { v.currentTime = t; }, { once: true });
    v.addEventListener('playing', () => v.classList.add('on'), { once: true });
    v.preload = 'auto';
    v.src = mobile.matches ? '/video/hero-540.mp4' : '/video/hero-720.mp4';
    // Mais lento que o original, para a filmagem respirar.
    v.defaultPlaybackRate = HERO_RATE;
    v.playbackRate = HERO_RATE;
    v.addEventListener('play', () => { v.playbackRate = HERO_RATE; });
  };
  const sync = () => {
    reel.forEach((v, i) => {
      const on = !paused && inView && !document.hidden && (i === 0 || !mobile.matches);
      if (on) { load(v); v.play().catch(() => {}); } else if (!v.paused) v.pause();
    });
    playBtn?.classList.toggle('is-paused', paused);
    playBtn?.setAttribute('aria-label', paused ? 'Reproduzir vídeo' : 'Pausar vídeo');
  };
  if (playBtn) {
    playBtn.hidden = false;
    playBtn.addEventListener('click', () => { paused = !paused; sync(); });
  }
  ScrollTrigger.create({ trigger: hero, start: 'top bottom', end: 'bottom top', onToggle: (s) => { inView = s.isActive; sync(); } });
  document.addEventListener('visibilitychange', sync);
  mobile.addEventListener('change', sync);
  sync();

  if (!RM && !mobile.matches) {
    gsap.from(strips, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.1, stagger: 0.12, ease: 'power4.inOut', delay: 0.1, clearProps: 'clipPath' });
  }
  // A faixa sob o cursor acende, como a luz que seguia o cursor na versão com foto.
  if (FINE) {
    let hot = -1;
    hero.addEventListener('pointermove', (e) => {
      if (mobile.matches) return;
      const r = hero.getBoundingClientRect();
      const i = clamp(Math.floor(((e.clientX - r.left) / r.width) * strips.length), 0, strips.length - 1);
      if (i === hot) return;
      strips[hot]?.classList.remove('hot');
      strips[i].classList.add('hot');
      hot = i;
    });
    hero.addEventListener('pointerleave', () => { strips[hot]?.classList.remove('hot'); hot = -1; });
  }
}

/* ============ cartões com foto: em touch, acendem ao passar pelo centro da tela ============ */
if (!FINE && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle('lit', e.isIntersecting)), { rootMargin: '-38% -20% -38% -20%' });
  $$('.mc, .bx').forEach((c) => { if ($('.zoom', c)) io.observe(c); });
}

/* ============ estrutura: cartões se revelam com o amarelo, depois o preto, depois a foto ============ */
const bxs = $$('.bento .bx');
if (bxs.length && !RM) {
  bxs.forEach((c) => {
    c.classList.add('rv-pre');
    c.insertAdjacentHTML('beforeend', '<i class="rv rv--y" aria-hidden="true"></i><i class="rv rv--k" aria-hidden="true"></i>');
  });
  const reveal = (c: HTMLElement, delay: number) => {
    const y = $('.rv--y', c), k = $('.rv--k', c), media = $$(':scope > .zoom :is(img, video)', c);
    gsap.timeline({ delay })
      .to(y, { scaleX: 1, duration: 0.42, ease: 'power3.inOut' })
      .to(k, { scaleX: 1, duration: 0.42, ease: 'power3.inOut' }, '-=0.24')
      .add(() => { c.classList.remove('rv-pre'); y?.remove(); })
      .set(k, { transformOrigin: 'right center' })
      .fromTo(media, { scale: 1.18 }, { scale: 1, duration: 1.1, ease: 'expo.out', clearProps: 'transform' })
      .to(k, { scaleX: 0, duration: 0.55, ease: 'power3.inOut', onComplete: () => k?.remove() }, '<');
  };
  // Um cartão por vez, na ordem de leitura: cada um começa 0,6 s depois do anterior.
  const GAP = 0.6;
  let nextAt = 0;
  ScrollTrigger.batch(bxs, {
    start: 'top+=30% bottom', once: true,
    onEnter: (els) => {
      (els as HTMLElement[]).sort((x, y) => bxs.indexOf(x) - bxs.indexOf(y)).forEach((el) => {
        const now = performance.now() / 1000;
        const at = Math.max(now, nextAt);
        nextAt = at + GAP;
        reveal(el, at - now);
      });
    },
  });
}

/* ============ vídeos de cartão: carregam perto da tela e só tocam visíveis ============ */
const autoVids = $$<HTMLVideoElement>('video[data-auto]');
if (autoVids.length && 'IntersectionObserver' in window) {
  const saveData = !!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    const v = e.target as HTMLVideoElement;
    if (e.isIntersecting) {
      if (!v.src && v.dataset.src) { v.src = v.dataset.src; v.preload = 'auto'; }
      if (!RM && !saveData && !v.dataset.hold) v.play().catch(() => {});
    } else if (!v.paused) v.pause();
  }), { rootMargin: '200px 0px' });
  autoVids.forEach((v) => io.observe(v));
}

/* ============ header, progress, sticky bar ============ */
const prog = $('#prog');
const sbar = $('#sbar');
const fin = $('#agendar');
let lastY = scrollY;
function chrome() {
  const y = scrollY;
  const heroH = hero ? hero.offsetHeight : 400;
  hdr?.classList.toggle('solid', y > 30);
  hdr?.classList.toggle('past', y > heroH * 0.7);
  if (hdr && !menu?.classList.contains('open')) {
    if (y > lastY + 4 && y > heroH * 0.6) hdr.classList.add('hide');
    else if (y < lastY - 4) hdr.classList.remove('hide');
  }
  lastY = y;
  const fr = fin ? fin.getBoundingClientRect().top : Infinity;
  sbar?.classList.toggle('show', y > heroH * 0.8 && fr > innerHeight * 0.7);
}
addEventListener('scroll', chrome, { passive: true });
chrome();
if (prog) gsap.to(prog, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

$$<HTMLAnchorElement>('[data-nav]').forEach((a) => {
  const sec = document.getElementById(a.dataset.nav!);
  if (!sec) return;
  ScrollTrigger.create({ trigger: sec, start: 'top 40%', end: 'bottom 40%', onToggle: (s) => a.classList.toggle('cur', s.isActive) });
});

/* ============ marquee (speed and direction follow the scroll) ============ */
$$('[data-marquee]').forEach((m) => {
  const tr = $('.mq__track', m)!;
  const g = $('.mq__grp', tr)!;
  for (let i = 0; i < 3; i++) tr.appendChild(g.cloneNode(true));
  if (RM) return;
  let x = 0, dir = -1, boost = 0, vis = true;
  ScrollTrigger.create({ trigger: m, start: 'top bottom', end: 'bottom top', onToggle: (s) => { vis = s.isActive; } });
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => { dir = s.direction === 1 ? -1 : 1; boost = Math.min(Math.abs(s.getVelocity()) / 120, 14); } });
  gsap.ticker.add((_t, dt) => {
    if (!vis) return;
    const w = g.offsetWidth; if (!w) return;
    boost *= 0.94;
    x += dir * (0.045 + boost * 0.02) * dt;
    if (x <= -w) x += w; if (x > 0) x -= w;
    tr.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
  });
});

/* ============ board: 7-segment counters ============ */
function setDigits(el: HTMLElement, v: number) {
  const pad = Number(el.dataset.pad || 0);
  const s = String(Math.round(v)).padStart(pad, '0').slice(-pad);
  const num = $('.dnum', el);
  if (num) { num.textContent = s; return; }
  $$('.seg', el).forEach((seg, i) => { seg.dataset.d = s[i] ?? '0'; });
}
// Um número por vez: a célula surge por opacidade e conta devagar, dando tempo de leitura.
const cells = $$('.board .cell');
if (cells.length && !RM) {
  gsap.set(cells, { autoAlpha: 0, y: 14 });
  ScrollTrigger.create({
    trigger: cells[0].closest('.board')!, start: 'top 82%', once: true,
    onEnter: () => cells.forEach((cell, i) => {
      const el = $('[data-count]', cell);
      const tl = gsap.timeline({ delay: i * 0.75 });
      tl.to(cell, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power2.out' });
      if (el) {
        const to = Number(el.dataset.count), from = Number(el.dataset.from || 0), o = { v: from };
        setDigits(el, from);
        tl.to(o, { v: to, duration: 2.4, ease: 'power3.out', onUpdate: () => setDigits(el, o.v) }, 0.15);
      }
    }),
  });
}

/* ============ manifesto: words light up with the scroll ============ */
const mf = $('#manifesto');
if (mf && !RM) {
  const words = $$('.w', mf);
  const meter = $('.mf__meter', mf);
  mf.classList.add('live');
  ScrollTrigger.create({
    trigger: mf, start: 'top top', end: '+=140%', pin: true, scrub: true,
    onUpdate: (s) => {
      const n = Math.round(clamp(s.progress * 1.15, 0, 1) * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < n));
      meter?.style.setProperty('--p', clamp(s.progress * 1.15, 0, 1).toFixed(3));
    },
  });
}

/* ============ modalities: horizontal run on desktop ============ */
const hs = $('#modalidades');
const track = $('#hstrack');
const vp = $('#hsvp');
if (hs && track && vp) {
  const cards = $$('.mc', track);
  const n = cards.length;
  const hsn = $('#hsn'), hsm = $('#hsm');
  const setIdx = (i: number) => { if (hsn) hsn.textContent = String(i + 1).padStart(2, '0'); hsm?.style.setProperty('--p', ((i + 1) / n).toFixed(3)); };
  let st: ScrollTrigger | null = null;
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1024px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)', () => {
    hs.classList.add('pinned');
    const dist = () => Math.max(0, track.scrollWidth - vp.clientWidth + parseFloat(getComputedStyle(vp).paddingLeft) * 2);
    const tw = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: hs, start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 0.6, invalidateOnRefresh: true,
        onUpdate: (s) => setIdx(clamp(Math.round(s.progress * (n - 1)), 0, n - 1)),
      },
    });
    st = tw.scrollTrigger ?? null;
    return () => { hs.classList.remove('pinned'); st = null; };
  });
  vp.addEventListener('scroll', () => {
    if (st) return;
    const max = vp.scrollWidth - vp.clientWidth;
    setIdx(clamp(Math.round((max ? vp.scrollLeft / max : 0) * (n - 1)), 0, n - 1));
  }, { passive: true });
  const go = (dir: number) => {
    if (st) {
      const cur = clamp(Math.round(st.progress * (n - 1)), 0, n - 1);
      const i = clamp(cur + dir, 0, n - 1);
      window.scrollTo({ top: st.start + (i / (n - 1)) * (st.end - st.start), behavior: RM ? 'auto' : 'smooth' });
    } else {
      vp.scrollBy({ left: dir * (cards[0].offsetWidth + 20), behavior: RM ? 'auto' : 'smooth' });
    }
  };
  $('#hsprev')?.addEventListener('click', () => go(-1));
  $('#hsnext')?.addEventListener('click', () => go(1));
}

/* ============ modalidades: os cartões entram flutuando pela lateral ao chegar na seção ============ */
if (hs && track && !RM) {
  const mcs = $$('.mc', track);
  gsap.set(mcs, { x: 180, autoAlpha: 0 });
  ScrollTrigger.create({
    trigger: hs, start: 'top 65%', once: true,
    onEnter: () => gsap.to(mcs, { x: 0, autoAlpha: 1, duration: 1.4, stagger: 0.14, ease: 'expo.out', clearProps: 'x' }),
  });
}

/* ============ seções se revelam com a rolagem ============ */
if (!RM) {
  // Cabeçalhos: cada linha sobe e aparece, uma depois da outra.
  $$('.sec-head, .qz__intro, .hs__top, .pv__l, .fin__in, .story__txt').forEach((g) => {
    const lines = $$('.h2 .ln', g);
    if (lines.length) {
      // Título em duas partes: a primeira aparece e a segunda vem 0,5 s depois.
      const rest = Array.from(g.children).filter((c) => !c.contains(lines[0]));
      gsap.timeline({ scrollTrigger: { trigger: g, start: 'top 86%', once: true } })
        .from(lines[0], { y: 40, autoAlpha: 0, duration: 0.8, ease: 'expo.out', clearProps: 'transform' })
        .from(lines.slice(1), { y: 40, autoAlpha: 0, duration: 0.8, ease: 'expo.out', clearProps: 'transform' }, '+=0.5')
        .from(rest, { y: 30, autoAlpha: 0, duration: 0.8, ease: 'expo.out', clearProps: 'transform' }, '-=0.4');
      return;
    }
    gsap.from(g.children, { y: 40, autoAlpha: 0, duration: 1, stagger: 0.1, ease: 'expo.out', clearProps: 'transform', scrollTrigger: { trigger: g, start: 'top 86%', once: true } });
  });
  // Blocos de conteúdo: sobem juntos logo depois do cabeçalho.
  $$('.un__g, .com__g, .qz, .vb__panel, .faq, .others, .mods-grid').forEach((b) => {
    gsap.from(b, { y: 60, autoAlpha: 0, duration: 1.1, ease: 'expo.out', clearProps: 'transform', scrollTrigger: { trigger: b, start: 'top 88%', once: true } });
  });
}

/* ============ tilt + magnetic (fine pointers only) ============ */
if (FINE && !RM) {
  $$('[data-tilt]').forEach((c) => {
    const rx = gsap.quickTo(c, 'rotationX', { duration: 0.5, ease: 'power3.out' });
    const ry = gsap.quickTo(c, 'rotationY', { duration: 0.5, ease: 'power3.out' });
    const ty = gsap.quickTo(c, 'y', { duration: 0.5, ease: 'power3.out' });
    c.addEventListener('pointermove', (e) => {
      const r = c.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 7);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 7);
      ty(-6);
    });
    c.addEventListener('pointerleave', () => { rx(0); ry(0); ty(0); });
  });
  $$('[data-magnet], .hs__nav').forEach((b) => {
    const qx = gsap.quickTo(b, 'x', { duration: 0.45, ease: 'power3.out' });
    const qy = gsap.quickTo(b, 'y', { duration: 0.45, ease: 'power3.out' });
    b.addEventListener('pointermove', (e) => {
      const r = b.getBoundingClientRect();
      qx((e.clientX - r.left - r.width / 2) * 0.14);
      qy((e.clientY - r.top - r.height / 2) * 0.24);
    });
    b.addEventListener('pointerleave', () => { qx(0); qy(0); });
  });
}

/* ============ reveals that belong to the wipe grammar ============ */
if (!RM) {
  $$('[data-reveal]').forEach((el) => {
    gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 40%', scrub: 0.5 },
    });
  });
  const deco = $$('.fin__deco i');
  if (deco.length && fin) {
    gsap.fromTo(deco, { scaleX: 0 }, { scaleX: 1, stagger: 0.12, ease: 'none', scrollTrigger: { trigger: fin, start: 'top bottom', end: 'center center', scrub: 0.5 } });
  }
}

/* ============ quiz ============ */
type Obj = 'hip' | 'ema' | 'con' | 'sau';
type Niv = 'ini' | 'int' | 'adv';
const quiz = $('#quiz');
if (quiz) {
  const Q: { obj: Obj | null; niv: Niv | null; uni: UnitKey | null } = { obj: null, niv: null, uni: null };
  let step = 1;
  const LBL = { obj: { hip: 'Ganhar massa', ema: 'Emagrecer', con: 'Condicionamento', sau: 'Saúde e rotina' }, niv: { ini: 'Começando', int: 'Já treino', adv: 'Treino pesado' } };
  const PREF: Record<Obj, string[]> = {
    hip: ['Musculação', 'Personal'],
    ema: ['Funcional', 'Cross', 'Spinning', 'Fit dance', 'Musculação'],
    con: ['Cross', 'Funcional', 'Spinning', 'Musculação'],
    sau: ['Musculação', 'Fit dance', 'Funcional', 'Personal'],
  };
  const TIP: Record<Niv, string> = {
    ini: 'Comece por cargas que você controla e deixe a equipe ajustar a progressão.',
    int: 'Você já tem base. Agora o ganho vem de variar volume e intensidade por fase.',
    adv: 'Carga alta pede técnica afiada. Aproveite o equipamento e peça ajuste fino no salão.',
  };
  const show = (n: number) => {
    step = n;
    $$<HTMLElement>('.qz__step', quiz).forEach((s) => { s.hidden = Number(s.dataset.step) !== n; });
    $('#qzres')!.hidden = n !== 4;
    $$('.qz__prog i', quiz).forEach((p, i) => p.classList.toggle('on', i < Math.min(n, 3) || n === 4));
    $('#qzstep')!.textContent = n === 4 ? 'Resultado' : `Pergunta ${n} de 3`;
    $('#qzback')!.hidden = n === 1;
    const target = n === 4 ? $('#qzres') : $(`.qz__step[data-step="${n}"]`, quiz);
    if (target && !RM) gsap.fromTo(target, { autoAlpha: 0, x: 28 }, { autoAlpha: 1, x: 0, duration: 0.55, ease: 'expo.out' });
  };
  const result = () => {
    const k = Q.uni!, u = UNITS[k], av = u.mods, pref = PREF[Q.obj!];
    const p1 = pref.find((m) => av.includes(m)) || 'Musculação';
    let p2 = pref.find((m) => m !== p1 && av.includes(m)) || av.find((m) => m !== p1) || '';
    if (Q.niv === 'ini' && k === 'fb') p2 = 'Avaliação física';
    $('#qzr1')!.textContent = p1;
    $('#qzr2')!.textContent = p2 ? `+ ${p2}` : '';
    $('#qzrp')!.textContent = `${u.pitch} ${TIP[Q.niv!]}`;
    $('#qzc1')!.textContent = LBL.obj[Q.obj!];
    $('#qzc2')!.textContent = LBL.niv[Q.niv!];
    $('#qzc3')!.textContent = u.name;
    const t = `Olá, GOFIT! Fiz o teste do site. Objetivo: ${LBL.obj[Q.obj!]}. Nível: ${LBL.niv[Q.niv!]}. Quero agendar uma visita na unidade ${u.name}. Tenho interesse em ${p1}.`;
    $<HTMLAnchorElement>('#qzwa')!.href = waHref(k, t, 'teste');
    setUnit(k); showUnit(k);
  };
  $$<HTMLButtonElement>('.qo', quiz).forEach((b) => b.addEventListener('click', () => {
    const k = b.dataset.k as 'obj' | 'niv' | 'uni';
    (Q as Record<string, string | null>)[k] = b.dataset.v!;
    $$(`.qo[data-k="${k}"]`, quiz).forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
    setTimeout(() => {
      if (k === 'obj') show(2);
      else if (k === 'niv') show(3);
      else { result(); show(4); const r = $('#qzr1')!.getBoundingClientRect(); puff(r.left + 60, r.top + 20, 40); }
    }, RM ? 0 : 260);
  }));
  $('#qzback')?.addEventListener('click', () => show(step === 4 ? 3 : Math.max(1, step - 1)));
  $('#qzredo')?.addEventListener('click', () => {
    Q.obj = Q.niv = null; Q.uni = null;
    $$('.qo', quiz).forEach((o) => o.setAttribute('aria-pressed', 'false'));
    show(1);
  });
  $('#qzwa')?.addEventListener('click', (e) => puff((e as MouseEvent).clientX, (e as MouseEvent).clientY));
}

/* ============ units panel ============ */
const upanel = $('#upanel');
let shownUnit: UnitKey = 'fb';
function fillUnit(k: UnitKey) {
  if (!upanel) return;
  const u = UNITS[k];
  const f = (n: string) => $(`[data-f="${n}"]`, upanel);
  f('role')!.textContent = `${u.role} · desde ${u.since}`;
  f('name')!.textContent = u.name;
  f('quote')!.textContent = u.quote;
  f('addr')!.textContent = `${u.address} · ${u.district}`;
  f('hoursrow')!.hidden = !u.hours;
  f('hours')!.textContent = u.hours || '';
  f('mods')!.textContent = u.mods.join(' · ');
  const feat = f('feat')!;
  feat.textContent = u.highlights.join(' · ');
  // O nome do mascote vira um link que mostra a foto dele.
  if (feat.textContent.includes('Sheriff')) {
    const [a, b] = feat.textContent.split('Sheriff');
    feat.textContent = a;
    const t = document.createElement('span');
    t.className = 'sheriff'; t.tabIndex = 0;
    t.innerHTML = 'Sheriff<span class="sheriff__pop" role="img" aria-label="Foto do Sheriff, o mascote caramelo da GOFIT Realeza"><picture><source type="image/webp" srcset="/img/sheriff-480.webp" /><img src="/img/sheriff-480.jpg" alt="" width="480" height="480" loading="lazy" /></picture></span>';
    feat.append(t, b);
  }
  const ig = f('ig') as HTMLAnchorElement; ig.textContent = '@' + u.instagram; ig.href = `https://www.instagram.com/${u.instagram}/`;
  f('cta')!.textContent = `Falar com ${u.short}`;
  (f('page') as HTMLAnchorElement).href = `/${u.slug}/`;
  (f('maps') as HTMLAnchorElement).href = mapsHref(k);
  const wa = $<HTMLAnchorElement>('#uwa')!; wa.dataset.unit = k; wa.href = waHref(k, msgFor(k), 'unidades');
  upanel.setAttribute('aria-labelledby', `tab-${k}`);
}
function showUnit(k: UnitKey) {
  if (!upanel || !UNITS[k]) return;
  $$<HTMLButtonElement>('.tab').forEach((t) => { const on = t.dataset.k === k; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
  $$('.pin').forEach((p) => p.classList.toggle('on', (p as HTMLElement).dataset.k === k));
  if (k === shownUnit) return;
  shownUnit = k;
  if (RM) { fillUnit(k); return; }
  upanel.classList.add('swap');
  setTimeout(() => { fillUnit(k); upanel.classList.remove('swap'); }, 200);
}
if (upanel) {
  const tabs = $$<HTMLButtonElement>('.tab');
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => { const k = t.dataset.k as UnitKey; showUnit(k); setUnit(k); });
    t.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return; e.preventDefault();
      const nx = tabs[(i + d + tabs.length) % tabs.length]; nx.focus(); nx.click();
    });
  });
  $$<HTMLElement>('.pin').forEach((p) => {
    p.addEventListener('click', () => { const k = p.dataset.k as UnitKey; showUnit(k); setUnit(k); });
    p.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); p.click(); } });
  });
  if (unit && unit !== 'fb') { shownUnit = unit; fillUnit(unit); showUnit(unit); }
}

/* ============ resize ============ */
let rzT: number | undefined;
addEventListener('resize', () => { clearTimeout(rzT); rzT = window.setTimeout(sizeCv, 150); });
// Gatilhos criados fora da ordem da página (pins mais abaixo, componentes) são ordenados antes de recalcular.
const refreshAll = () => { ScrollTrigger.sort(); ScrollTrigger.refresh(); };
refreshAll();
addEventListener('load', refreshAll);
document.fonts?.ready.then(refreshAll);
