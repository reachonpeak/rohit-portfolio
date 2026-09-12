'use client';

import { useEffect, useRef, useState } from 'react';
import { HeroMediaRibbon } from '@/components/hero-media-ribbon';
import { Tilt } from '@/components/ui/tilt';
import { HeroTitle, OrbitalLens, MotionMarquee, MotionEffects } from '@/components/premium-motion';
import { projects, contact, brandCount, projectCount, type Project } from '@/lib/portfolio-data';

function Arrow({ diagonal = false, className = '' }: { diagonal?: boolean; className?: string }) {
  return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function Play() { return <svg width="15" height="17" viewBox="0 0 15 17" fill="currentColor" aria-hidden="true"><path d="M1 1.5v14L13 8.5 1 1.5Z" /></svg>; }
function Star({ className = '' }: { className?: string }) { return <svg className={className} viewBox="0 0 80 80" fill="none" aria-hidden="true"><path d="M40 0v80M0 40h80M12 12l56 56M12 68l56-56" stroke="currentColor" strokeWidth="12" /></svg>; }

function PreviewVideo({ id, active, eager = false }: { id: string; active: boolean; eager?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    function sync() {
      if (active && !motion.matches && !document.hidden) void video!.play().catch(() => {});
      else video!.pause();
    }
    sync();
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', sync);
    return () => { video.pause(); document.removeEventListener('visibilitychange', sync); motion.removeEventListener('change', sync); };
  }, [active]);
  return <video ref={ref} className={loaded ? 'preview-video ready' : 'preview-video'} src={active || eager || loaded ? `/work/${id}-preview.mp4` : undefined} poster={`/work/${id}.jpg`} muted loop playsInline preload={eager ? 'auto' : 'none'} onLoadedData={() => setLoaded(true)} tabIndex={-1} aria-hidden="true" />;
}

function ProjectCard({ project, index, open }: { project: Project; index: number; open: () => void }) {
  const [hover, setHover] = useState(false);
  return <article className={`project-card ${project.format === "landscape" ? "landscape" : ""}`} style={{ '--card-color': project.color } as React.CSSProperties}>
    <Tilt className="project-tilt"><button className="project-visual" onClick={open} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onFocus={() => setHover(true)} onBlur={() => setHover(false)} aria-label={`Play ${project.brand}: ${project.title}`}>
      <img src={`/work/${project.id}.jpg`} alt={`${project.brand} video still`} loading="lazy" width="720" height="1280" />
      <PreviewVideo id={project.id} active={hover} />
      <span className="project-topline"><span>FILM {String(index + 1).padStart(2, '0')}</span><span>{project.format === "landscape" ? "16:9" : "9:16"}</span></span>
      <span className="project-play"><Play /><span>Watch film</span></span>
      <span className="card-reflection" aria-hidden="true" /><span className="project-duration">{project.duration}</span>
    </button></Tilt>
    <div className="project-caption"><div><p>{project.category}</p><h3>{project.brand}</h3><span>{project.title}</span></div><button className="project-arrow" onClick={open} aria-label={`View ${project.brand} project`}><Arrow diagonal /></button></div>
  </article>;
}

function FilmDialog({ project, close, change }: { project: Project; close: () => void; change: (p: Project) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [failed, setFailed] = useState(false);
  const current = projects.findIndex(p => p.id === project.id);
  useEffect(() => {
    const old = document.body.style.overflow;
    const active = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    ref.current?.showModal();
    return () => { document.body.style.overflow = old; active?.focus(); };
  }, []);
  return <dialog ref={ref} className="film-dialog" aria-labelledby="film-title" onCancel={close} onClick={e => { if (e.target === e.currentTarget) close(); }}>
    <div className={`film-shell ${project.format === "landscape" ? "wide-film" : ""}`}><div className="film-screen"><video key={project.id} src={`/work/${project.id}.mp4`} poster={`/work/${project.id}.jpg`} controls autoPlay playsInline preload="metadata" onError={() => setFailed(true)} />{failed && <p className="media-error">This video could not be played. <a href={`/work/${project.id}.mp4`}>Open the video file</a>.</p>}</div>
      <div className="film-info"><button className="dialog-close" onClick={close} aria-label="Close video">×</button><span className="eyebrow">SELECTED FILM / {String(current + 1).padStart(2, '0')}</span><p className="film-brand">{project.brand}</p><h2 id="film-title">{project.title}</h2><p>{project.description}</p><div className="film-tags">{project.details.map(t => <span key={t}>{t}</span>)}</div><dl><div><dt>Format</dt><dd>{project.format === "landscape" ? "Landscape · 16:9" : "Vertical · 9:16"}</dd></div><div><dt>Runtime</dt><dd>{project.duration}</dd></div></dl><button className="text-link" onClick={() => { setFailed(false); change(projects[(current + 1) % projects.length]); }}>Next film <Arrow /></button><span className="film-hint">Sound on for the full experience.</span></div>
    </div>
  </dialog>;
}

function BriefDialog({ close }: { close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    const old = document.body.style.overflow;
    const active = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    ref.current?.showModal();
    return () => { document.body.style.overflow = old; active?.focus(); };
  }, []);
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const body = `PROJECT BRIEF — JASVIR EDITOR\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nProject: ${data.get('type')}\nTimeline: ${data.get('timeline')}\n\nThe idea:\n${data.get('idea')}\n`;
    if (contact.email) { window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent('New project — '+data.get('name'))}&body=${encodeURIComponent(body)}`; }
    else {
      const url = URL.createObjectURL(new Blob([body], { type: 'text/plain;charset=utf-8' }));
      const a = document.createElement('a'); a.href = url; a.download = 'project-brief-jasveer-editor.txt'; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000); setSaved(true);
    }
  }
  return <dialog ref={ref} className="brief-dialog" aria-labelledby="brief-title" onCancel={close} onClick={e => { if (e.target === e.currentTarget) close(); }}><div className="brief-inner"><button className="dialog-close" onClick={close} aria-label="Close project brief">×</button><span className="eyebrow">THE NEXT GOOD STORY</span><h2 id="brief-title">Starts with<br />your idea<span>.</span></h2><p>{contact.email ? 'Tell me what you have in mind. Let’s make it happen.' : 'Put your idea into a brief. Save it and share it with Jasvir when you’re ready.'}</p><form onSubmit={submit}><div className="form-row"><label>Your name<input name="name" autoComplete="name" required placeholder="Name" /></label><label>Your email<input name="email" type="email" autoComplete="email" required placeholder="you@company.com" /></label></div><div className="form-row"><label>What are we making?<select name="type"><option>Social reels & ads</option><option>Brand film</option><option>Automotive promo</option><option>Something else</option></select></label><label>Timeline<input name="timeline" placeholder="e.g. Within two weeks" /></label></div><label>The idea<textarea name="idea" rows={3} required placeholder="The brand, the audience, and what you want them to feel." /></label><button type="submit" className="lime-button">{contact.email ? 'Open email with brief' : 'Save project brief'}<Arrow diagonal /></button><p role="status" className="form-status">{saved ? 'Brief downloaded. Share the file with Jasvir to discuss your project.' : 'Your details stay in your browser until you choose to share them.'}</p></form></div></dialog>;
}

const services = [
  { number: '01', title: 'Short-form. Long-lasting impact.', label: 'REELS & SOCIAL ADS', text: 'Sharp hooks, intentional pacing, and captions that belong in the frame. Vertical edits shaped for the way people actually watch.', tags: ['Instagram Reels', 'Brand promos', 'Talking-head edits'] },
  { number: '02', title: 'Give your story a signature.', label: 'BRAND & COMMERCIAL', text: 'From a personal introduction to a product showcase, build a story with a clear message, a consistent visual language, and a strong finish.', tags: ['Brand storytelling', 'Product showcases', 'Automotive content'] },
  { number: '03', title: 'Make every detail count.', label: 'MOTION & FINISHING', text: 'Animated type, purposeful transitions, balanced colour, and sound that supports the picture. The finishing touches that make an edit feel complete.', tags: ['Motion graphics', 'Caption design', 'Colour & sound'] },
];

export default function Studio() {
  const [filter, setFilter] = useState('All work');
  const [film, setFilm] = useState<Project | null>(null);
  const [brief, setBrief] = useState(false);
  const [menu, setMenu] = useState(false);
  const [service, setService] = useState<number | null>(0);
  const [heroMotion, setHeroMotion] = useState(true);
  const returnFocus = useRef<HTMLButtonElement | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const [heroVisible, setHeroVisible] = useState(true);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: 0 });
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);
  const visible = filter === 'All work' ? projects : projects.filter(p => p.category === filter);
  const restoreFocus = () => requestAnimationFrame(() => returnFocus.current?.focus({ preventScroll: true }));
  return <div className="studio premium-studio" data-motion={heroMotion ? "running" : "paused"} data-dialog={film || brief ? "open" : "closed"} onClickCapture={e => {
    const target = e.target as Element;
    if (!target.closest('dialog')) {
      const button = target.closest('button');
      if (button) returnFocus.current = button;
    }
  }}>
    <MotionEffects refreshKey={filter} paused={!heroMotion} />
    <a href="#work" className="skip-link">Skip to selected work</a>
    <header className="site-nav"><a className="wordmark" href="#home" aria-label="Jasvir Editor home"><img className="actual-logo" src="/brand/js-monogram.webp" alt="JS video editor logo" width="46" height="46" /><span>JASVIR<span className="wordmark-sub">SINGH / VIDEO EDITOR</span></span></a><nav className={menu ? 'nav-links open' : 'nav-links'} aria-label="Main navigation"><a href="#work" onClick={() => setMenu(false)}>The work <span>{projectCount}</span></a><a href="#about" onClick={() => setMenu(false)}>The editor</a><a href="#services" onClick={() => setMenu(false)}>What I do</a></nav><button className="nav-contact" onClick={() => setBrief(true)}>Let’s talk <Arrow diagonal /></button><button className="menu-toggle" aria-label={menu ? 'Close navigation' : 'Open navigation'} aria-expanded={menu} onClick={() => setMenu(!menu)}>{menu ? '×' : '☰'}</button></header>
    <main>
      <section id="home" ref={heroRef} className="hero section-wrap"><div className="hero-atmosphere" aria-hidden="true"><span /><span /><div className="perspective-floor" /></div><div className="hero-meta"><span><i className="status-dot" /> INDEPENDENT VIDEO EDITOR</span><span className="hero-edition">SELECTED WORK / VOL. 01</span></div><div className="hero-main"><div className="hero-copy"><HeroTitle /><div className="hero-intro"><span className="intro-line" /><p>I’m Jasvir. I turn footage into stories<br className="desktop-break" /> that make people <em>stop, watch, and feel.</em></p></div><div className="hero-actions"><button className="lime-button" onClick={() => setFilm(projects[0])}><span className="small-play"><Play /></span>Play featured film<Arrow diagonal /></button><a href="#work" className="text-link">Explore the work <Arrow /></a></div></div><Tilt className="hero-tilt" rotationFactor={13}><div className={`hero-reels ${heroMotion ? "motion-on" : "motion-off"}`}><OrbitalLens /><div className="reel-orbit" aria-hidden="true" /><button className="hero-reel reel-back" onClick={() => setFilm(projects[2])} aria-label="Play Meubles Navcan film"><PreviewVideo id="meubles-navcan" active={heroMotion && heroVisible && !film && !brief} eager /><span>NAVCAN / 003</span></button><button className="hero-reel reel-front" onClick={() => setFilm(projects[0])} aria-label="Play Auto Mates featured film"><PreviewVideo id="automates" active={heroMotion && heroVisible && !film && !brief} eager /><span className="reel-record"><i /> IN THE FRAME</span><span className="hero-reel-play"><Play /></span><span className="reel-caption">AUTO MATES <span>00:22 ↗</span></span></button><span className="reel-sticker">BUILT TO<br /><b>HOLD ATTENTION.</b></span></div></Tilt></div><HeroMediaRibbon active={heroMotion && heroVisible && !film && !brief} paused={!heroMotion} toggle={() => setHeroMotion(value => !value)} open={id => setFilm(projects.find(project => project.id === id) || projects[0])} /><div className="hero-bottom"><div className="mini-profile"><img src="/work/jasveer-portrait.webp" alt="" width="44" height="44" /><span>A real person.<br /><strong>A different perspective.</strong></span></div><span className="hero-bottom-note">GOOD STORIES DON’T JUST HAPPEN.<br />THEY’RE EDITED.</span><a className="scroll-link" href="#work">SCROLL TO DISCOVER <span>↓</span></a></div></section>
      <MotionMarquee />
      <div className="brand-strip"><span className="brand-strip-label">BRANDS IN THE FRAME</span><div><span className="brand-auto">AUTO MATES</span><span className="brand-signature">Signature<span>MIGRATION</span></span><span className="brand-navcan">MEUBLES <b>NAVCAN</b></span><span className="brand-peak">reach on peak<span>↗</span></span><span className="brand-wecan">WECAN <span>MOVERS</span></span></div></div>
      <section id="work" className="work-section section-wrap"><div className="section-heading"><div><span className="eyebrow"><span className="tiny-cross">✳</span> 01 / SELECTED WORK</span><h2>LESS SCROLL.<br /><span>MORE PLAY.</span></h2></div><p>Brand stories, social campaigns, and the details<br className="desktop-break" /> that make a moment worth watching.</p></div><div className="work-toolbar"><div className="filters" role="group" aria-label="Filter projects">{['All work','Brand stories','Social & ads','Spaces & places','Food & wellness','Automotive'].map(f => <button key={f} className={filter === f ? 'active' : ''} aria-pressed={filter === f} onClick={() => setFilter(f)}>{f}{f === 'All work' && <span>{projectCount}</span>}</button>)}</div><span className="work-count" aria-live="polite">{String(visible.length).padStart(2,'0')} FILMS / SOUND ON</span></div><div className="project-grid">{visible.map(p => <ProjectCard key={p.id} project={p} index={projects.indexOf(p)} open={() => setFilm(p)} />)}</div><div className="work-bottom"><span>Every frame here is from a real edit.</span><a href="#contact">Your brand could be next <Arrow diagonal /></a></div></section>
      <section id="about" className="about-section"><div className="section-wrap about-grid"><Tilt className="portrait-composition" rotationFactor={8}><div className="portrait-frame"><img src="/work/jasveer-portrait.webp" alt="Jasvir, video editor and visual storyteller" loading="lazy" width="1000" height="1734" /><span className="portrait-label">THE PERSON BEHIND THE TIMELINE</span></div><span className="portrait-tag">A little instinct.<br /><em>A lot of intention.</em></span><Star className="portrait-star" /></Tilt><div className="about-copy"><span className="eyebrow">02 / MEET THE EDITOR</span><h2>HI, I’M<br />JASVIR<span className="lime-period">.</span></h2><p className="about-lead">I see the story<br />between the frames.</p><p>An expression. A beat. The split second before a cut. That’s where an edit starts to feel like something.</p><p>I bring that attention to brand promos, social content, and product films. My work combines clear storytelling with animated type, thoughtful pacing, and a visual finish that feels intentional.</p><div className="about-facts"><div><strong>{projectCount}</strong><span>SELECTED FILMS</span></div><div><strong>{String(brandCount).padStart(2,"0")}</strong><span>FEATURED BRANDS</span></div><div><strong>02</strong><span>FILM FORMATS</span></div></div><a className="dark-button" href="#services">Here’s what I can bring <Arrow diagonal /></a></div></div></section>
      <section className="identity-section section-wrap"><a className="identity-banner" href="/brand/linkedin-banner.png" target="_blank" rel="noreferrer" aria-label="View Jasvir Singh identity banner"><img src="/brand/linkedin-banner.webp" alt="Jasvir Singh, video editor. Phone 9517717717. Email jassijattu06@gmail.com." loading="lazy" width="1584" height="396" /></a><div className="identity-links"><span>THE SIGNATURE / JASVIR SINGH</span><a href="/brand/jasvir-singh.vcf" download>Save my contact ↗</a><a href="/brand/contact-artwork.png" target="_blank" rel="noreferrer">Contact artwork ↗</a><a href="/brand/logo-original.png" target="_blank" rel="noreferrer">JS identity ↗</a></div></section>
      <section id="services" className="services-section section-wrap"><div className="section-heading"><div><span className="eyebrow"><span className="tiny-cross">✳</span> 03 / THE CRAFT</span><h2>YOUR VISION.<br /><span>MY TIMELINE.</span></h2></div><p>From the first cut to the final export.<br />A considered edit, all the way through.</p></div><div className="service-list">{services.map((s,i) => <article className={`service ${service===i ? 'expanded' : ''}`} key={s.number}><button className="service-toggle" onClick={() => setService(service===i ? null : i)} aria-expanded={service===i} aria-controls={`service-${i}`}><span className="service-number">/{s.number}</span><span className="service-name"><span>{s.label}</span><strong>{s.title}</strong></span><span className="service-plus">{service===i ? '−' : '+'}</span></button><div id={`service-${i}`} className="service-content" hidden={service!==i}><p>{s.text}</p><div>{s.tags.map(t => <span key={t}>{t}</span>)}</div></div></article>)}</div></section>
      <section className="process-section section-wrap"><div className="process-title"><span className="eyebrow">04 / THE WAY WE WORK</span><h2>GOOD WORK.<br />NO GUESSWORK.</h2><p>Clear steps. Room for ideas.<br />An edit that feels right.</p></div><div className="process-steps">{[{n:'01',title:'Find the story.',text:'We talk about your brand, your audience, and what you want the video to do.'},{n:'02',title:'Build the feeling.',text:'I shape the footage, find the pace, and bring the first cut to life with graphics and sound.'},{n:'03',title:'Fine-tune. Then share.',text:'We work through your feedback and get the finished edit ready for its screen.'}].map(s => <div key={s.n}><span>{s.n}</span><h3>{s.title}</h3><p>{s.text}</p></div>)}</div></section>
      <section id="contact" className="contact-section"><div className="section-wrap"><div className="contact-top"><span className="eyebrow">HAVE SOMETHING IN MIND?</span><span>LET’S MAKE IT WORTH WATCHING.</span></div><button className="contact-headline" onClick={() => setBrief(true)}><span>LET’S MAKE<br /><span>THEM FEEL.</span></span><span className="contact-arrow"><Arrow diagonal /></span></button><div className="contact-bottom"><p>Bathinda, Punjab · Working with brands everywhere.<br />Let’s give your story the edit it deserves.</p><button className="dark-button" onClick={() => setBrief(true)}>Start a project <Arrow diagonal /></button></div>{(contact.email || contact.phone || contact.whatsapp || contact.instagram) && <div className="contact-links">{contact.phone && <a href={`tel:${contact.phone.replace(/\s/g,"")}`}>{contact.phone} ↗</a>}{contact.email && <a href={`mailto:${contact.email}`}>{contact.email} ↗</a>}{contact.whatsapp && <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer">WhatsApp ↗</a>}{contact.instagram && <a href={contact.instagram} target="_blank" rel="noreferrer">Instagram ↗</a>}</div>}</div></section>
    </main><footer className="site-footer section-wrap"><a href="#home" className="footer-logo">JASVIR<span>✳</span></a><span>© {new Date().getFullYear()} Jasvir Editor</span><span>EDITED WITH INTENTION.</span><a href="#home" className="back-top">BACK TO TOP ↑</a></footer>
    {film && <FilmDialog project={film} close={() => { setFilm(null); restoreFocus(); }} change={setFilm} />}{brief && <BriefDialog close={() => { setBrief(false); restoreFocus(); }} />}
  </div>;
}
