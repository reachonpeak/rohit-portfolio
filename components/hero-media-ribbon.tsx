'use client';

import { useEffect, useRef, useState } from 'react';

const media = [
  { id: 'signature-migration', label: 'Signature Migration', kind: 'FILM / 01', video: true, shape: 'portrait' },
  { id: 'wellness-city', label: 'The Wellness City', kind: 'FILM / 02', video: true, shape: 'wide' },
  { id: 'portrait', label: 'The person behind the cut', kind: 'ROHIT / PORTRAIT', image: '/work/rohit.png', shape: 'portrait' },
  { id: 'kaurz-kitchen', label: 'Kaurz Kitchen', kind: 'FILM / 03', video: true, shape: 'portrait' },
  { id: 'identity', label: 'A signature in every frame', kind: 'ROHIT / IDENTITY', image: '/brand/linkedin-banner.webp', shape: 'banner' },
];

function MediaPanel({ item, active, duplicate, open }: { item: typeof media[number]; active: boolean; duplicate: boolean; open: (id: string) => void }) {
  const panel = useRef<HTMLButtonElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .1 });
    if (panel.current) observer.observe(panel.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const clip = video.current;
    if (!clip) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      if (active && visible && !document.hidden && !reduced.matches) void clip.play().catch(() => {});
      else clip.pause();
    };
    sync(); document.addEventListener('visibilitychange', sync); reduced.addEventListener('change', sync);
    return () => { clip.pause(); document.removeEventListener('visibilitychange', sync); reduced.removeEventListener('change', sync); };
  }, [active, visible]);
  return <button ref={panel} className={`hero-media-panel media-${item.shape}`} tabIndex={duplicate ? -1 : 0} aria-label={item.video ? `Play ${item.label} from hero strip` : `About Rohit: ${item.label}`} onClick={() => item.video ? open(item.id) : document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}>
    {item.video ? <video ref={video} src={visible ? `/work/${item.id}-preview.mp4` : undefined} poster={`/work/${item.id}.jpg`} muted loop playsInline preload="none" aria-hidden="true" /> : <img src={item.image} alt="" loading="lazy" />}
    <span className="media-panel-kind">{item.kind}</span>
    <span className="media-panel-caption">{item.label}<span aria-hidden="true">{item.video ? '↗' : '✳'}</span></span>
  </button>;
}

export function HeroMediaRibbon({ active, paused, toggle, open }: { active: boolean; paused: boolean; toggle: () => void; open: (id: string) => void }) {
  return <div className="hero-media-ribbon">
    <div className="hero-ribbon-toolbar"><span><i /> THE CUTTING ROOM <small>/ FILMS & FRAMES</small></span><button className="ribbon-motion-toggle" aria-pressed={paused} onClick={toggle}>{paused ? '▷ Play motion' : 'Ⅱ Pause motion'}</button></div>
    <div className="hero-media-window"><div className="hero-media-track">{[0, 1].map(group => <div className="hero-media-group" key={group} aria-hidden={group === 1 ? true : undefined}>{media.map(item => <MediaPanel key={item.id} item={item} active={active} duplicate={group === 1} open={open} />)}</div>)}</div></div>
  </div>;
}
