'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { brandCount, contact, projects, type Project } from '@/lib/portfolio-data';
import { LensSculpture, SectionMotion } from '@/components/section-motion';
import { OrbitalLens } from '@/components/premium-motion';

type IconName = 'arrow' | 'play' | 'film' | 'youtube' | 'briefcase' | 'building' | 'home' | 'gift' | 'motion' | 'instagram' | 'scissors' | 'color' | 'audio' | 'heart' | 'people' | 'mail' | 'phone' | 'pin' | 'download' | 'chat' | 'check';
function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    play: <path d="m9 5 11 7-11 7Z" fill="currentColor" strokeWidth="0" />,
    film: <><rect x="5" y="5" width="14" height="16" rx="3" /><path d="m6 5 2-3m4 3 2-3m3 3 2-3M5 10h14m-9 4 5 3-5 2Z" /></>,
    youtube: <><rect x="2" y="5" width="20" height="14" rx="5" /><path d="m10 9 5 3-5 3Z" fill="currentColor" strokeWidth="0" /></>,
    briefcase: <><rect x="3" y="7" width="18" height="14" rx="2" /><path d="M8 7V3h8v4M3 12l9 3 9-3m-9 0v4" /></>,
    building: <><rect x="4" y="4" width="16" height="17" rx="2" /><path d="M8 8h1m6 0h1m-8 4h1m6 0h1m-6 9v-5h4v5" /></>,
    home: <><path d="m2 11 10-8 10 8M5 9v12h14V9m-10 12v-8h6v8" /></>,
    gift: <><rect x="3" y="9" width="18" height="4" rx="1" /><path d="M5 13v8h14v-8M12 9v12m0-12C3 9 5 1 9 4l3 5c9 0 7-8 3-5Z" /></>,
    motion: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><path d="m15 3 6 6m-6 0 6-6M3 15l6 6m-6 0 6-6" /></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17 7h.01" /></>,
    scissors: <><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="m8 8 13 13M8 16 21 3" /></>,
    color: <><circle cx="9" cy="9" r="5" /><circle cx="15" cy="9" r="5" /><circle cx="12" cy="15" r="5" /></>,
    audio: <path d="M3 10v4m4-7v10m5-15v20m5-17v14m4-9v4" />,
    heart: <path d="M20 5c-3-3-7 0-8 2-1-2-5-5-8-2-5 5 2 11 8 15 6-4 13-10 8-15Z" />,
    people: <><circle cx="12" cy="6" r="3" /><circle cx="5" cy="15" r="3" /><circle cx="19" cy="15" r="3" /><path d="M9 21v-2a4 4 0 0 0-8 0v2m22 0v-2a4 4 0 0 0-8 0v2M8 11h8" /></>,
    mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m3 5 9 8 9-8" /></>,
    phone: <><path d="M21 11a9 9 0 0 1-13 8l-5 2 1-5a9 9 0 1 1 17-5Z" /><path d="m8 7 2 3-1 1 4 4 1-1 3 1c0 5-10 0-10-5Z" /></>,
    pin: <><path d="M20 9c0 6-8 13-8 13S4 15 4 9a8 8 0 1 1 16 0Z" /><circle cx="12" cy="9" r="3" /></>,
    download: <><path d="M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4" /></>,
    chat: <><path d="M4 3h16v14H9l-5 4Z" /><path d="M8 8h8m-8 4h5" /></>,
    check: <><rect x="3" y="3" width="18" height="18" rx="4" /><path d="m7 12 3 3 7-7" /></>,
  };
  return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Logo() { return <a href="#home" className="logo" aria-label="Rohit, home"><img className="project-logo" src="/brand/rohit-logo.png" alt="Rohit Video Editor logo" width="48" height="48" /><span>ROHIT<small>VIDEO EDITOR</small></span></a>; }
function Eyebrow({ children }: { children: ReactNode }) { return <p className="eyebrow"><span>▸</span> {children}</p>; }
function Stats({ icons = false }: { icons?: boolean }) {
  const values: [string, string, IconName][] = [[String(projects.length).padStart(2, '0'), 'Selected films', 'film'], [String(brandCount).padStart(2, '0'), 'Featured brands', 'briefcase'], [String(new Set(projects.map(project => project.category)).size).padStart(2, '0'), 'Collections', 'motion']];
  return <div className={`stats ${icons ? 'with-icons' : ''}`}>{values.map(([value, label, icon]) => <div key={label}>{icons && <Icon name={icon} />}<span><strong>{value}</strong><small>{label}</small></span></div>)}</div>;
}

const categories = ['All', 'Automotive', 'Real Estate', 'Business', 'Social & Ads', 'Food & Wellness', 'Reels'];

const projectTags: Record<string, string[]> = {
  'singh-auto-video': ['Automotive', 'Reels'],
  'bravo-vdo': ['Social & Ads', 'Reels'],
  'singh-auto': ['Automotive', 'Reels'],
  'vvdo': ['Business', 'Reels'],
  'kasana-insurance': ['Business', 'Reels'],
  'wecan': ['Business', 'Reels'],
  'shaan-shine-vdo': ['Automotive', 'Reels'],
  'auto-mt': ['Automotive', 'Reels'],
  'shahi-kebab': ['Food & Wellness', 'Reels'],
  'auto-mates': ['Automotive', 'Reels'],
  'shaanshine-01': ['Automotive', 'Reels'],
  'baaz-migration': ['Business', 'Reels'],
  'wecan-movers-05': ['Business', 'Reels'],
  'sharp-edge-home-09': ['Real Estate', 'Reels'],
  'nabhi-oil': ['Food & Wellness', 'Reels'],
  'brevo-media': ['Social & Ads', 'Reels'],
  'prime-path-brokers': ['Business', 'Reels'],
  'aiims-bathinda-rooms': ['Real Estate', 'Reels'],
  'sharpedge-05': ['Real Estate'],
};

const offerings: { name: string; icon: IconName; filter: string }[] = [
  { name: 'Automotive Reels', icon: 'film', filter: 'Automotive' },
  { name: 'Commercial Ads', icon: 'briefcase', filter: 'Social & Ads' },
  { name: 'Real Estate Tours', icon: 'home', filter: 'Real Estate' },
  { name: 'Brand Stories', icon: 'building', filter: 'Business' },
  { name: 'Food & Dining', icon: 'gift', filter: 'Food & Wellness' },
  { name: 'Social Media Reels', icon: 'instagram', filter: 'Reels' },
  { name: 'Motion Graphics', icon: 'motion', filter: 'Social & Ads' },
  { name: 'YouTube & Podcasts', icon: 'youtube', filter: 'Business' },
];

const services: { title: string; text: string; icon: IconName }[] = [
  { title: 'Video Editing', text: 'Clean, engaging and high-impact edits tailored for reels, commercials, and long form.', icon: 'scissors' },
  { title: 'Motion Graphics', text: 'Eye-catching animations, kinetic typography, and graphic callouts that elevate every frame.', icon: 'motion' },
  { title: 'Color Grading', text: 'Cinematic color correction and atmospheric tones designed for brand identity.', icon: 'color' },
  { title: 'Audio Enhancement', text: 'Punched-up sound design, dialogue clarity, and rhythmic music synchronization.', icon: 'audio' },
];

function ProjectCardItem({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (hovered) {
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [hovered]);

  return (
    <article
      className={`project-card ${project.format === 'landscape' ? 'is-landscape' : ''}`}
      style={{ '--project-accent': project.color } as React.CSSProperties}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <button className="project-button" onClick={onClick} aria-label={`Play ${project.brand}: ${project.title}`}>
        <div className="project-image">
          <img
            src={project.image || `/work/${project.id}.jpg`}
            alt={`${project.brand} video still`}
            loading="lazy"
            width="480"
            height="320"
          />
          <video
            ref={videoRef}
            src={`/work/${project.id}-preview.mp4`}
            poster={project.image || `/work/${project.id}.jpg`}
            muted
            loop
            playsInline
            preload="none"
            className={`card-preview-video ${hovered ? 'is-active' : ''}`}
            aria-hidden="true"
          />
          <span className="project-format-badge">{project.format === 'landscape' ? '16:9' : '9:16'}</span>
          <span className="project-icon">
            <Icon name={project.category === 'Spaces & places' ? 'home' : project.category === 'Automotive' ? 'film' : project.category === 'Food & wellness' ? 'gift' : 'youtube'} />
          </span>
          <span className="runtime"><Icon name="play" />{project.duration}</span>
          <span className="project-hover-play"><Icon name="play" /></span>
        </div>
        <div className="project-caption">
          <div className="project-caption-meta">
            <span className="project-category">{project.category}</span>
            {project.details?.[0] && <span className="project-subtag">{project.details[0]}</span>}
          </div>
          <h3>{project.brand}</h3>
          <p>{project.title}</p>
          <span className="project-open" aria-hidden="true"><Icon name="arrow" /></span>
        </div>
      </button>
    </article>
  );
}

function Modal({ children, title, close, className = '' }: { children: ReactNode; title: string; close: () => void; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const active = document.activeElement as HTMLElement | null;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.showModal();
    return () => {
      document.body.style.overflow = previous;
      active?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`modal ${className}`}
      aria-label={title}
      onCancel={close}
      onClick={e => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="modal-content">
        <button className="close-button" aria-label="Close dialog" onClick={close}>×</button>
        {children}
      </div>
    </dialog>
  );
}

export default function Studio() {
  const [motionPaused, setMotionPaused] = useState(false);
  const [filter, setFilter] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const [film, setFilm] = useState<Project | null>(null);
  const [brief, setBrief] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const menuToggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (menu) document.querySelector<HTMLAnchorElement>('.navigation a')?.focus();
  }, [menu]);

  const [sendState, setSendState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [sendError, setSendError] = useState('');
  const sending = useRef(false);
  const [catalog, setCatalog] = useState<Project[]>(projects);

  useEffect(() => {
    fetch('/api/projects', { cache: 'no-store' })
      .then(response => response.ok ? response.json() : null)
      .then(value => {
        if (Array.isArray(value) && value.length > 0) setCatalog(value);
      })
      .catch(() => undefined);
  }, []);

  const matchesFilter = (p: Project, selectedFilter: string) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Automotive') return p.category === 'Automotive' || projectTags[p.id]?.includes('Automotive');
    if (selectedFilter === 'Real Estate') return p.category === 'Spaces & places' || projectTags[p.id]?.includes('Real Estate');
    if (selectedFilter === 'Business') return p.category === 'Brand stories' || projectTags[p.id]?.includes('Business');
    if (selectedFilter === 'Social & Ads') return p.category === 'Social & ads' || projectTags[p.id]?.includes('Social & Ads');
    if (selectedFilter === 'Food & Wellness') return p.category === 'Food & wellness' || projectTags[p.id]?.includes('Food & Wellness');
    if (selectedFilter === 'Reels') return p.format !== 'landscape' || projectTags[p.id]?.includes('Reels');
    return true;
  };

  const matching = catalog.filter(p => matchesFilter(p, filter));
  const visible = showAll ? matching : matching.slice(0, 6);

  const openBrief = (service = 'Video Editing') => {
    if (sending.current) return;
    setSendState('idle');
    setSendError('');
    setBrief(service);
  };

  function chooseCategory(value: string) {
    setFilter(value);
    setShowAll(false);
  }

  function moveCategory(direction: number) {
    chooseCategory(categories[(categories.indexOf(filter) + direction + categories.length) % categories.length]);
  }

  async function submitBrief(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current || sendState === 'sent') return;
    const form = event.currentTarget;
    const data = new FormData(form);
    sending.current = true;
    setSendState('sending');
    setSendError('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        throw new Error(result.error || 'Your enquiry could not be sent. Please try again.');
      }
      setSendState('sent');
      form.reset();
    } catch (error) {
      setSendState('error');
      setSendError(error instanceof Error ? error.message : 'Your enquiry could not be sent. Please try again.');
    } finally {
      sending.current = false;
    }
  }

  const navigateFilm = (direction: number) => {
    if (!film) return;
    const currentIndex = catalog.findIndex(p => p.id === film.id);
    const nextIndex = (currentIndex + direction + catalog.length) % catalog.length;
    setFilm(catalog[nextIndex]);
  };

  const featuredLandscape = catalog.find(p => p.id === 'sharpedge-05') || catalog.find(p => p.format === 'landscape') || catalog[0];

  return (
    <div className="reference-studio">
      <SectionMotion
        paused={motionPaused}
        dialogOpen={Boolean(film || brief)}
        refreshKey={`${filter}-${showAll}`}
        toggle={() => setMotionPaused(value => !value)}
      />
      <a href="#work" className="skip-link">Skip to work</a>
      <header className="site-header wrap">
        <Logo />
        <nav
          className={menu ? 'navigation is-open' : 'navigation'}
          aria-label="Main navigation"
          onKeyDown={event => {
            if (event.key === 'Escape') {
              setMenu(false);
              menuToggle.current?.focus();
            }
          }}
        >
          {['Home', 'Work', 'Services', 'About', 'Contact'].map(item => (
            <a href={`#${item.toLowerCase()}`} onClick={() => setMenu(false)} key={item}>{item}</a>
          ))}
        </nav>
        <button className="button outline nav-cta" onClick={() => openBrief()}>
          Let’s Work <Icon name="arrow" />
        </button>
        <button
          ref={menuToggle}
          className="menu-button"
          onClick={() => setMenu(!menu)}
          aria-expanded={menu}
          aria-label="Toggle navigation"
        >
          {menu ? '×' : '☰'}
        </button>
      </header>

      <main>
        <section id="home" className="hero hero-orbit-stage wrap">
          <div className="hero-orbit-backdrop" aria-hidden="true"><span /><span /></div>
          <div className="hero-copy">
            <Eyebrow>VIDEO EDITING · MOTION · STORYTELLING</Eyebrow>
            <h1>EVERY FRAME.<br /><span>A FEELING.</span></h1>
            <p className="hero-description">
              I’m Rohit. I turn footage into stories<br />through editing, colour, sound, and motion.
            </p>
            <div className="button-row">
              <button className="button primary" onClick={() => setFilm(catalog[0])}>
                Play Featured Film <Icon name="play" />
              </button>
              <button className="button outline" onClick={() => openBrief()}>
                Let’s Work Together
              </button>
            </div>
            <Stats />
            <div className="hero-location">
              <span /> BATHINDA, INDIA <i /> CREATING WORLDWIDE
            </div>
          </div>
          <div className="hero-art" aria-label="Portrait, selected film, and rotating 3D sculpture">
            <div className="art-glow" />
            <div className="portrait-card">
              <img src="/work/rohit.png" alt="Rohit, video editor" fetchPriority="high" />
              <span className="card-mark"><Icon name="film" /></span>
              <span className="handwriting portrait-motto">Edit.<br />Create.<br />Inspire.</span>
            </div>
            <button
              className="landscape-card"
              aria-label="Watch cinematic property film"
              onClick={() => setFilm(featuredLandscape)}
            >
              <img src={featuredLandscape.image || `/work/${featuredLandscape.id}.jpg`} alt="Cinematic luxury showcase" />
              <span className="hero-film-tag">LUXURY TOUR <i /> {featuredLandscape.duration}</span>
              <span className="landscape-caption">{featuredLandscape.brand.toUpperCase()}</span>
              <span className="glowing-play"><Icon name="play" /></span>
            </button>
            <div className="hero-orbit" aria-hidden="true">
              <div className="hero-orbit-shadow" />
              <OrbitalLens />
              <span className="hero-orbit-label"><i /> THE ART OF MOTION</span>
            </div>
            <span className="handwriting art-note">MORE<br />THAN EDITING<span>⤶</span></span>
            <svg className="doodle-arrow" viewBox="0 0 70 80" fill="none" aria-hidden="true">
              <path d="M15 6C-6 40 48 64 55 38M55 38l-15 5m15-5 6 15" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        </section>

        <section className="trust-section">
          <div className="wrap">
            <div className="client-strip">
              <div className="client-strip-heading">
                <span>THE BRANDS BEHIND THE FRAMES</span>
                <span>SELECTED PORTFOLIO</span>
              </div>
              <div className="client-wordmarks">
                {['Singh Auto', 'Auto Mates Cars', 'Shaan Shine Detailing', 'Sharp Edge Homes', 'Baaz Migration', 'Kasana Insurance'].map(brand => (
                  <button
                    key={brand}
                    onClick={() => {
                      const found = catalog.find(project => project.brand.toLowerCase().includes(brand.toLowerCase().split(' ')[0]));
                      if (found) setFilm(found);
                    }}
                    aria-label={`Watch work for ${brand}`}
                  >
                    {brand}<span aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="offering-grid">
              {offerings.map(item => (
                <a
                  key={item.name}
                  href="#work"
                  onClick={() => chooseCategory(item.filter)}
                  className="offering"
                >
                  <span><Icon name={item.icon} /></span>
                  <strong>{item.name}</strong>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="work" className="work-section wrap">
          <div className="section-heading">
            <div>
              <Eyebrow>FEATURED WORK</Eyebrow>
              <h2>STORIES THAT MOVE.<br />BRANDS THAT GROW.</h2>
            </div>
            <div className="work-heading-right">
              <div>
                <p>A collection of my 19 recent projects<br />across automotive, property, brand films & social ads.</p>
                <button
                  className="button outline small"
                  onClick={() => {
                    chooseCategory('All');
                    setShowAll(true);
                  }}
                >
                  View All Work ({catalog.length}) <Icon name="arrow" />
                </button>
              </div>
              <div className="arrows">
                <button onClick={() => moveCategory(-1)} aria-label="Previous project category"><Icon name="arrow" /></button>
                <button onClick={() => moveCategory(1)} aria-label="Next project category"><Icon name="arrow" /></button>
              </div>
            </div>
          </div>

          <div className="filters" role="group" aria-label="Filter projects">
            {categories.map(item => (
              <button
                key={item}
                className={filter === item ? 'active' : ''}
                aria-pressed={filter === item}
                onClick={() => chooseCategory(item)}
              >
                {item}
                <span className="filter-count">
                  {catalog.filter(project => matchesFilter(project, item)).length}
                </span>
              </button>
            ))}
          </div>

          <p className="collection-status" role="status">
            <span>{filter === 'All' ? 'THE FULL COLLECTION' : filter.toUpperCase()}</span>
            <span>{visible.length} / {matching.length} {matching.length === 1 ? 'FILM' : 'FILMS'}</span>
          </p>

          <div className="project-grid">
            {visible.map(project => (
              <ProjectCardItem
                key={project.id}
                project={project}
                onClick={() => setFilm(project)}
              />
            ))}
          </div>

          <div className="collection-end">
            <p>Every project has a story. <span>Find the one that speaks to your brand.</span></p>
            {visible.length < matching.length && (
              <button className="button outline" onClick={() => setShowAll(true)}>
                Show all {matching.length} films <Icon name="arrow" />
              </button>
            )}
          </div>
        </section>

        <section id="about" className="about-section">
          <div className="about-grid wrap">
            <div className="about-portrait">
              <img src="/work/rohit.png" alt="Rohit in his creative studio" loading="lazy" width="1536" height="1024" />
              <span className="card-mark"><Icon name="film" /></span>
            </div>
            <div className="about-copy">
              <Eyebrow>ABOUT ME</Eyebrow>
              <h2>HI, I’M <span>ROHIT.</span></h2>
              <h3>A Video Editor Who Turns Ideas Into Impact.</h3>
              <p>I’m a video editor based in Bathinda, Punjab, working across automotive films, property showcases, social campaigns, and motion graphics. From the first cut to the final sound, I shape every detail around the story you want to tell.</p>
              <Stats icons />
              <div className="button-row">
                <button className="button primary" onClick={() => openBrief()}>
                  Let’s Work Together <Icon name="arrow" />
                </button>
                <a href="/brand/jasvir-singh.vcf" download className="button outline">
                  Save Contact <Icon name="download" />
                </a>
              </div>
            </div>
            <div className="about-signature handwriting">
              Edit.<br />Create.<br />Inspire.<span>Rohit</span>
            </div>
          </div>
        </section>

        <section id="services" className="services-section wrap">
          <div className="section-heading">
            <div>
              <Eyebrow>MY SERVICES</Eyebrow>
              <h2>MORE THAN JUST EDITING.</h2>
            </div>
            <p>Professional video editing services<br />tailored to your brand's growth.</p>
          </div>
          <div className="service-grid">
            {services.map((service, i) => (
              <button
                className={`service-card ${i === 0 ? 'featured' : ''}`}
                onClick={() => openBrief(service.title)}
                key={service.title}
              >
                <span className="service-icon"><Icon name={service.icon} /></span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <span className="service-arrow"><Icon name="arrow" /></span>
              </button>
            ))}
          </div>
        </section>

        <section className="craft-section wrap" aria-label="My approach to editing">
          <div className="craft-heading">
            <Eyebrow>BEHIND THE EDIT</Eyebrow>
            <h2>THE DETAILS<br />MAKE THE <span>DIFFERENCE.</span></h2>
            <p>A good edit is more than a sequence of shots.<br />It is the feeling that stays after the last frame.</p>
          </div>
          <div className="craft-grid">
            {[
              { n: '01', title: 'A rhythm of its own.', text: 'Pacing, pauses, and purposeful cuts that give each story room to land.', icon: 'film' },
              { n: '02', title: 'A considered finish.', text: 'Colour, sound, and typography shaped around the personality of the brand.', icon: 'color' },
              { n: '03', title: 'Made for the screen.', text: 'From vertical social edits to wide cinematic films, the format serves the story.', icon: 'motion' }
            ].map(item => (
              <article className="craft-card" key={item.n}>
                <span className="craft-number">{item.n}</span>
                <Icon name={item.icon as IconName} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="process-section wrap">
          <div>
            <Eyebrow>MY PROCESS</Eyebrow>
            <h2>SIMPLE STEPS.<br /><span>AMAZING RESULTS.</span></h2>
          </div>
          <ol className="process-steps">
            {[
              { title: 'Share Your Idea', text: 'Tell me your vision and requirements.', icon: 'chat' },
              { title: 'Edit & Create', text: 'I’ll craft your project with creativity.', icon: 'film' },
              { title: 'Review & Feedback', text: 'You review and suggest fine-tuning.', icon: 'check' },
              { title: 'Final Delivery', text: 'Get your high-definition video master.', icon: 'gift' }
            ].map((step, i) => (
              <li key={step.title}>
                <span className="step-icon"><Icon name={step.icon as IconName} /></span>
                <strong className="step-number">0{i + 1}</strong>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="cta-section wrap">
          <div className="cta-banner">
            <LensSculpture />
            <img className="cta-background" src="/work/rohit.png" alt="" loading="lazy" />
            <div className="cta-copy">
              <Eyebrow>LET’S CREATE SOMETHING INCREDIBLE</Eyebrow>
              <h2>LET’S MAKE<br />THEM FEEL.</h2>
              <p>Ready to bring your ideas to life?<br />Let’s create videos that inspire, engage and grow your brand.</p>
            </div>
            <div className="cta-actions">
              <button className="showreel-button" onClick={() => setFilm(catalog[0])}>
                <span><Icon name="play" /></span>Play Featured Film
              </button>
              <button className="button dark" onClick={() => openBrief()}>
                Let’s Work Together <Icon name="arrow" />
              </button>
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section wrap">
          <div className="contact-heading">
            <Eyebrow>GET IN TOUCH</Eyebrow>
            <h2>YOUR VISION.<br /><span>MY TIMELINE.</span></h2>
          </div>
          <div className="contact-details">
            <a href={`mailto:${contact.email}`}>
              <Icon name="mail" />
              <span><strong>{contact.email}</strong><small>Drop me an email</small></span>
            </a>
            <a href={`https://wa.me/${contact.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
              <Icon name="phone" />
              <span><strong>{contact.phone}</strong><small>Let’s talk on WhatsApp</small></span>
            </a>
            <div>
              <Icon name="pin" />
              <span><strong>Bathinda, India</strong><small>Available Worldwide</small></span>
            </div>
            <div className="social-links">
              <a href={`mailto:${contact.email}`} aria-label="Email Rohit"><Icon name="mail" /></a>
              <a href={`https://wa.me/${contact.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" aria-label="WhatsApp Rohit"><Icon name="phone" /></a>
              <a href="/brand/jasvir-singh.vcf" download aria-label="Download contact card"><Icon name="download" /></a>
              <button onClick={() => setFilm(catalog[0])} aria-label="Watch featured video"><Icon name="youtube" /></button>
            </div>
          </div>
          <p className="handwriting contact-note">Good<br />Videos.<br />Better<br />People <span>☻</span></p>
        </section>
      </main>

      <footer className="site-footer wrap">
        <div className="footer-left">
          <Logo />
          <div className="footer-contact-info">
            <a href={`mailto:${contact.email}`} className="footer-contact-link">{contact.email}</a>
            <span className="footer-dot">·</span>
            <a href={`https://wa.me/${contact.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="footer-contact-link">{contact.phone}</a>
          </div>
        </div>
        <nav aria-label="Footer navigation">
          {['Home', 'Work', 'Services', 'About', 'Contact'].map(item => (
            <a href={`#${item.toLowerCase()}`} key={item}>{item}</a>
          ))}
          <a href="/admin">Admin</a>
        </nav>
        <p>© {new Date().getFullYear()} Rohit. All rights reserved.</p>
      </footer>

      {film && (
        <Modal
          title={film.brand}
          close={() => setFilm(null)}
          className={`video-modal ${film.format === 'landscape' ? 'is-landscape-modal' : 'is-portrait-modal'}`}
        >
          <div className="modal-video-wrapper">
            <video
              key={film.id}
              src={film.video || `/work/${film.id}.mp4`}
              poster={film.image || `/work/${film.id}.jpg`}
              controls
              autoPlay
              playsInline
            />
          </div>
          <div className="video-details">
            <div>
              <Eyebrow>{film.category.toUpperCase()} · {film.duration}</Eyebrow>
              <h2>{film.brand}</h2>
              <p>{film.description}</p>
              {film.details && film.details.length > 0 && (
                <div className="video-modal-tags">
                  {film.details.map(tag => (
                    <span key={tag} className="video-tag-pill">{tag}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="video-modal-nav">
              <button className="button outline small" onClick={() => navigateFilm(-1)}>
                <Icon name="arrow" className="rotate-180" /> Prev
              </button>
              <button className="button primary small" onClick={() => navigateFilm(1)}>
                Next film <Icon name="arrow" />
              </button>
            </div>
          </div>
        </Modal>
      )}

      {brief && (
        <Modal title="Start a project" close={() => setBrief(null)} className="brief-modal">
          <Eyebrow>LET’S CREATE SOMETHING INCREDIBLE</Eyebrow>
          <h2>YOUR NEXT<br /><span>GREAT STORY.</span></h2>
          <p>Tell me what you have in mind. Let’s bring it to life.</p>
          <form onSubmit={submitBrief} aria-busy={sendState === 'sending'}>
            <div hidden aria-hidden="true">
              <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
            </div>
            <div className="form-row">
              <label>Your name<input name="name" required maxLength={100} autoComplete="name" placeholder="Your name" /></label>
              <label>Your email<input name="email" required maxLength={254} type="email" autoComplete="email" placeholder="you@example.com" /></label>
            </div>
            <label>
              What can I help with?
              <select name="service" defaultValue={brief}>
                {services.map(s => <option key={s.title}>{s.title}</option>)}
                <option>Something else</option>
              </select>
            </label>
            <label>
              Your idea
              <textarea name="message" required maxLength={5000} rows={4} placeholder="Tell me about your project, timeline, and vision…" />
            </label>
            <button className="button primary" type="submit" disabled={sendState === 'sending' || sendState === 'sent'}>
              {sendState === 'sending' ? 'Sending...' : sendState === 'sent' ? 'Enquiry Sent' : 'Send Project Enquiry'} <Icon name="arrow" />
            </button>
            <p className="form-status" role="status">
              {sendState === 'sent' ? 'Thank you! Your enquiry has been sent to Rohit.' : sendState === 'error' ? sendError : sendState === 'sending' ? 'Sending your enquiry...' : 'Your project details will be emailed directly to Rohit.'}
            </p>
          </form>
        </Modal>
      )}
    </div>
  );
}
