const fs=require('node:fs');
const file='components/studio.tsx';
let s=fs.readFileSync(file,'utf8');
const replacements=[
  ["import { Tilt } from '@/components/ui/tilt';", "import { Tilt } from '@/components/ui/tilt';\nimport { HeroTitle, OrbitalLens, MotionMarquee, MotionEffects } from '@/components/premium-motion';"],
  ['return <div className="studio" onClickCapture=', 'return <div className="studio premium-studio" data-motion={heroMotion ? "running" : "paused"} data-dialog={film || brief ? "open" : "closed"} onClickCapture='],
  ['    <a href="#work" className="skip-link">', '    <MotionEffects refreshKey={filter} paused={!heroMotion} />\n    <a href="#work" className="skip-link">'],
  ['<h1>EVERY FRAME.<br /><span>A FEELING.</span><Star className="hero-star" /></h1>', '<HeroTitle />'],
  ['<div className="hero-meta">', '<div className="hero-atmosphere" aria-hidden="true"><span /><span /><div className="perspective-floor" /></div><div className="hero-meta">'],
  ['<div className="reel-orbit" aria-hidden="true" />', '<OrbitalLens /><div className="reel-orbit" aria-hidden="true" />'],
  ["{heroMotion ? 'Ⅱ Pause previews' : '▷ Play previews'}", "{heroMotion ? 'Ⅱ Pause motion' : '▷ Play motion'}"],
  ['      <div className="brand-strip">', '      <MotionMarquee />\n      <div className="brand-strip">'],
  ['<span className="project-duration">', '<span className="card-reflection" aria-hidden="true" /><span className="project-duration">'],
];
for(const [a,b] of replacements){if(!s.includes(a))throw new Error('Missing source: '+a);s=s.replace(a,b);}
fs.writeFileSync(file,s);
