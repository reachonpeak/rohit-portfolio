'use client';

import { useEffect, useRef } from 'react';

export function HeroTitle() {
  return <h1 className="kinetic-title" aria-label="Every frame. A feeling.">
    {['EVERY FRAME.', 'A FEELING.'].map((line, row) => <span className={`title-line title-line-${row}`} aria-hidden="true" key={line}>{[...line].map((letter, i) => <span className="title-letter" key={i} style={{ '--letter-delay': `${.12 + row * .18 + i * .035}s` } as React.CSSProperties}>{letter === ' ' ? '\u00a0' : letter}</span>)}</span>)}
    <span className="title-accent" aria-hidden="true">✳</span>
  </h1>;
}

export function OrbitalLens() {
  return <div className="orbital-lens" aria-hidden="true"><div className="lens-aura" /><div className="lens-space"><div className="lens-assembly"><div className="lens-hoop hoop-one" /><div className="lens-hoop hoop-two" /><div className="lens-hoop hoop-three" /><div className="lens-hoop hoop-four" /><div className="lens-core"><span>JS</span></div><span className="orbit-pearl pearl-one" /><span className="orbit-pearl pearl-two" /></div></div><span className="lens-caption">STORIES IN ORBIT / ALWAYS IN MOTION</span></div>;
}

export function MotionMarquee() {
  const words = ['STORIES THAT MOVE', 'FRAMES THAT FEEL', 'EDITS THAT STAY'];
  return <div className="motion-marquee" aria-label="Stories that move. Frames that feel. Edits that stay."><div className="marquee-rail" aria-hidden="true">{[0,1].map(group => <div className="marquee-group" key={group}>{words.map((word,i) => <span key={word} className={i % 2 ? 'marquee-outline' : ''}>{word}<i>✳</i></span>)}</div>)}</div></div>;
}

export function MotionEffects({ refreshKey, paused }: { refreshKey: string; paused: boolean }) {
  const progress = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.current?.style.setProperty('transform', `scaleX(${max > 0 ? scrollY / max : 0})`);
      frame = 0;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update(); addEventListener('scroll', onScroll, { passive:true }); addEventListener('resize', onScroll);
    return () => { cancelAnimationFrame(frame); removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); };
  }, []);
  useEffect(() => {
    const root = document.querySelector('.studio');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const syncVisibility = () => root?.setAttribute('data-page-visible', document.hidden ? 'false' : 'true');
    syncVisibility(); document.addEventListener('visibilitychange', syncVisibility);
    if (paused || reduced.matches) return () => document.removeEventListener('visibilitychange', syncVisibility);
    const animations: Animation[] = [];
    const observer = new IntersectionObserver(entries => {
      for(const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as HTMLElement;
        if (!element.dataset.revealed) {
          element.dataset.revealed = 'true';
          animations.push(element.animate([{opacity:0,transform:'translate3d(0,32px,0)',filter:'blur(5px)'},{opacity:1,transform:'translate3d(0,0,0)',filter:'blur(0px)'}],{duration:800,easing:'cubic-bezier(.16,1,.3,1)'}));
        }
        observer.unobserve(element);
      }
    }, {threshold:.08});
    document.querySelectorAll('.section-heading,.project-card,.about-copy,.portrait-composition,.identity-section,.service,.process-title,.process-steps>div,.contact-headline').forEach(el => observer.observe(el));
    return () => { observer.disconnect(); animations.forEach(animation=>animation.cancel()); document.removeEventListener('visibilitychange',syncVisibility); };
  }, [refreshKey, paused]);
  return <div className="reading-progress" aria-hidden="true"><div ref={progress} /></div>;
}
