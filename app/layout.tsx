import type { Metadata } from 'next';
import { Barlow_Condensed, Inter } from 'next/font/google';
import './reference.css';
import './section-motion.css';
import './hero-orbit.css';
import './portfolio-refinement.css';
const display = Barlow_Condensed({ subsets: ['latin'], weight: ['600','700','800'], variable: '--font-display', display: 'swap' });
const body = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
export const metadata: Metadata = { title: 'Jasvir Singh | Video Editor — Every Frame. A Feeling.', description: 'Video editing, brand stories, social campaigns, and motion graphics by Jasvir Singh. Explore 15 selected films across property, automotive, food, finance, and brand storytelling.', openGraph: { title: 'Jasvir Singh | Video Editor — Every Frame. A Feeling.', description: 'Selected films, crafted with intention.', type: 'website' } };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en" className={`${display.variable} ${body.variable}`}><body>{children}</body></html>; }
