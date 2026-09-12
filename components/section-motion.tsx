'use client';

import { useEffect, useRef } from 'react';

/** Decorative camera-lens rings, drawn in CSS so no 3D runtime is downloaded. */
export function LensSculpture() {
  return <div className="motion-lens" aria-hidden="true">
    <div className="motion-lens-axis"><i /><i /><i /><span /></div>
  </div>;
}

export function SectionMotion({ paused, dialogOpen, refreshKey, toggle }: {
  paused: boolean;
  dialogOpen: boolean;
  refreshKey: string;
  toggle: () => void;
}) {
  const control = useRef<HTMLButtonElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = control.current?.closest<HTMLElement>('.reference-studio');
    if (!root) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    const animations = new Set<Animation>();
    let enabled = false;
    let pointerFrame = 0;
    let scrollFrame = 0;
    let activeCard: HTMLElement | null = null;
    const hero = root.querySelector<HTMLElement>('.hero-art');
    const resetHero = () => {
      hero?.style.removeProperty('--hero-look-x');
      hero?.style.removeProperty('--hero-look-y');
    };

    const resetCard = () => {
      cancelAnimationFrame(pointerFrame);
      pointerFrame = 0;
      if (!activeCard) return;
      for (const name of ['--depth-x', '--depth-y', '--shine-x', '--shine-y']) activeCard.style.removeProperty(name);
      activeCard.removeAttribute('data-tilting');
      activeCard = null;
    };
    const sync = () => {
      enabled = !paused && !dialogOpen && !reduced.matches && !document.hidden;
      root.dataset.motion = enabled ? 'running' : 'paused';
      if (!enabled) {
        cancelAnimationFrame(pointerFrame);
        pointerFrame = 0;
        resetCard();
        resetHero();
        animations.forEach(animation => animation.cancel());
        animations.clear();
      }
    };
    sync();
    reduced.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);

    const depthSelector = '.offering,.project-card,.about-portrait,.service-card,.review,.craft-card,.cta-banner,.contact-details>a';
    root.querySelectorAll<HTMLElement>(depthSelector).forEach(el => { el.dataset.depth = ''; });

    const onMove = (event: PointerEvent) => {
      if (!enabled || !finePointer.matches || event.pointerType !== 'mouse') return;
      if (hero && event.target instanceof Node && hero.contains(event.target)) {
        const rect = hero.getBoundingClientRect();
        hero.style.setProperty('--hero-look-x', `${((event.clientX - rect.left) / rect.width - .5) * 18}px`);
        hero.style.setProperty('--hero-look-y', `${((event.clientY - rect.top) / rect.height - .5) * 14}px`);
      } else {
        resetHero();
      }
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-depth]') : null;
      if (target !== activeCard) resetCard();
      if (!target) return;
      activeCard = target;
      cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        pointerFrame = 0;
        const rect = target.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
        const amount = target.classList.contains('cta-banner') ? 4 : 9;
        target.style.setProperty('--depth-x', `${(0.5 - y) * amount}deg`);
        target.style.setProperty('--depth-y', `${(x - 0.5) * amount}deg`);
        target.style.setProperty('--shine-x', `${x * 100}%`);
        target.style.setProperty('--shine-y', `${y * 100}%`);
        target.dataset.tilting = 'true';
      });
    };
    const onLeave = () => { cancelAnimationFrame(pointerFrame); pointerFrame = 0; resetCard(); resetHero(); };
    root.addEventListener('pointermove', onMove, { passive: true });
    root.addEventListener('pointerleave', onLeave);

    const revealSelector = '.hero-copy>*,.hero-art,.client-strip,.offering,.section-heading,.filters,.project-card,.about-portrait,.about-copy>*,.about-signature,.service-card,.craft-heading,.craft-card,.process-section>div,.process-steps>li,.cta-banner,.contact-heading,.contact-details>a,.contact-details>div,.contact-note,.site-footer';
    const reveal = new IntersectionObserver(entries => {
      let stagger = 0;
      for (const entry of entries) {
        const element = entry.target as HTMLElement;
        if (!entry.isIntersecting || element.dataset.motionRevealed) continue;
        element.dataset.motionRevealed = 'true';
        reveal.unobserve(element);
        if (!enabled) continue;
        const animation = element.animate([
          { opacity: 0, transform: `${getComputedStyle(element).transform === 'none' ? '' : getComputedStyle(element).transform} perspective(1100px) translate3d(0,28px,-35px) rotateX(7deg)` },
          { opacity: 1, transform: getComputedStyle(element).transform },
        ], { duration: 850, delay: Math.min(stagger++ * 55, 220), easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' });
        animations.add(animation);
        animation.onfinish = () => { animations.delete(animation); animation.cancel(); };
      }
    }, { threshold: 0.08 });
    root.querySelectorAll(revealSelector).forEach(el => reveal.observe(el));

    const visibility = new IntersectionObserver(entries => {
      entries.forEach(entry => { (entry.target as HTMLElement).dataset.inView = String(entry.isIntersecting); });
    }, { rootMargin: '80px' });
    root.querySelectorAll('main>section,.site-footer').forEach(el => visibility.observe(el));

    const updateProgress = () => {
      scrollFrame = 0;
      root.dataset.scrolled = String(scrollY > 24);
      const sections = Array.from(root.querySelectorAll<HTMLElement>('main>section[id]'));
      let current = 'home';
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= 150) current = section.id;
      }
      root.querySelectorAll<HTMLAnchorElement>('.navigation a').forEach(link => {
        if (link.hash === `#${current}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.current?.style.setProperty('transform', `scaleX(${max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0})`);
    };
    const onScroll = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateProgress); };
    const resize = new ResizeObserver(onScroll);
    resize.observe(root);
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    updateProgress();

    return () => {
      reveal.disconnect(); visibility.disconnect(); resize.disconnect();
      cancelAnimationFrame(pointerFrame); cancelAnimationFrame(scrollFrame);
      animations.forEach(animation => animation.cancel());
      resetCard();
      resetHero();
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
      reduced.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
    };
  }, [paused, dialogOpen, refreshKey]);

  return <>
    <div className="motion-progress" aria-hidden="true"><div ref={progress} /></div>
    <button ref={control} className="motion-control" onClick={toggle} aria-pressed={paused} aria-label={paused ? 'Resume animations' : 'Pause animations'}>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">{paused ? <path d="m4 2 9 6-9 6Z" /> : <path d="M4 2h3v12H4zm5 0h3v12H9z" />}</svg>
      <span>{paused ? 'Resume motion' : 'Pause motion'}</span>
    </button>
  </>;
}
