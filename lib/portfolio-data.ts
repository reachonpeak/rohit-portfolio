export type Project = {
  id: string;
  brand: string;
  title: string;
  category: 'Brand stories' | 'Social & ads' | 'Automotive' | 'Spaces & places' | 'Food & wellness';
  format?: 'landscape';
  duration: string;
  description: string;
  details: string[];
  color: string;
  image?: string;
  video?: string;
};

export const projects: Project[] = [
  { id: 'singh-auto-video', brand: 'Singh Auto', title: 'Performance in every frame.', category: 'Automotive', duration: '00:18', description: 'A dynamic automotive promotional reel capturing vehicle aesthetics, road presence, and performance cuts with rhythmic pacing and bold sound design.', details: ['Automotive Reel', 'Sound Design', 'Vertical 9:16'], color: '#abc4ce' },
  { id: 'bravo-vdo', brand: 'Bravo Media', title: 'Edits that command attention.', category: 'Social & ads', duration: '00:22', description: 'High-energy commercial edit blending fast-paced cuts, synchronized sound hits, and crisp visual storytelling built for maximum digital engagement.', details: ['Social Campaign', 'Fast Cuts', 'Audio Sync'], color: '#d8a7c9' },
  { id: 'singh-auto', brand: 'Singh Auto', title: 'Crafted for the showroom.', category: 'Automotive', duration: '00:15', description: 'A polished dealership reel highlighting craftsmanship, exterior silhouettes, and premium vehicle finishes with smooth cinematic speed ramps.', details: ['Showroom Reel', 'Speed Ramps', 'Cinematic Grade'], color: '#b4c7a0' },
  { id: 'vvdo', brand: 'VVDO Studio', title: 'Cinematic visual storytelling.', category: 'Brand stories', duration: '01:05', description: 'An immersive brand showcase combining lifestyle footage, narrative pacing, and deep atmospheric color grading to deliver an emotional brand message.', details: ['Brand Story', 'Long Form', 'Color Grading'], color: '#acc0ab' },
  { id: 'kasana-insurance', brand: 'Kasana Insurance', title: 'Clarity in financial protection.', category: 'Brand stories', duration: '00:21', description: 'A conversational, confidence-building promo tailored for insurance and advisory services with animated highlights and clear typography.', details: ['Corporate Explainer', 'Kinetic Text', 'Trust Building'], color: '#bca98d' },
  { id: 'wecan', brand: 'WeCan Services', title: 'Smooth transitions, every move.', category: 'Brand stories', duration: '00:16', description: 'Quick, punchy brand promo designed to showcase seamless service delivery, customer satisfaction, and reliable logistics.', details: ['Service Promo', 'Snappy Cuts', 'Modern Grade'], color: '#bdaccc' },
  { id: 'shaan-shine-vdo', brand: 'Shaan Shine Detailing', title: 'The ultimate mirror finish.', category: 'Automotive', duration: '00:14', description: 'An ultra-crisp car detailing reel focusing on glossy reflections, foam washes, and precision ceramic coating processes.', details: ['Auto Detailing', 'Macro Shots', 'Punchy Sound'], color: '#8ab4f8' },
  { id: 'auto-mt', brand: 'Auto Mates', title: 'Motion, speed, and precision.', category: 'Automotive', duration: '00:23', description: 'A fast-paced vehicle showcase with rolling shots, engine audio emphasis, and smooth motion blur transitions.', details: ['Vehicle Showcase', 'Engine Audio', 'Motion Blur'], color: '#a7c4bc' },
  { id: 'shahi-kebab', brand: 'Shahi Kebab', title: 'Flavors that speak for themselves.', category: 'Food & wellness', duration: '00:21', description: 'A mouthwatering food commercial highlighting sizzle sounds, rich marinade colors, and flame-grilled perfection.', details: ['Culinary Ad', 'ASMR Audio', 'Warm Grading'], color: '#e8a87c' },
  { id: 'auto-mates', brand: 'Auto Mates Cars', title: 'Driven by pure detail.', category: 'Automotive', duration: '00:27', description: 'A comprehensive car dealership edit tracking inventory, interior luxury, and customer handover moments with high polish.', details: ['Dealership Reel', 'Interior Details', 'Vertical Delivery'], color: '#abc4ce' },
  { id: 'shaanshine-01', brand: 'Shaan Shine Detailing', title: 'Flawless protection & shine.', category: 'Automotive', duration: '00:26', description: 'Behind-the-scenes detailing film showing before-and-after paint correction, steam cleaning, and hydrophobic water beading.', details: ['Before & After', 'Detailing Process', 'Hydrophobic Action'], color: '#9bb8cd' },
  { id: 'baaz-migration', brand: 'Baaz Migration', title: 'Empowering global ambitions.', category: 'Brand stories', duration: '00:46', description: 'An authoritative, inspiring immigration consultancy film highlighting success stories, visa milestones, and expert guidance.', details: ['Visa Consultancy', 'Presenter Edits', 'Animated Graphics'], color: '#d4a373' },
  { id: 'wecan-movers-05', brand: 'WeCan Movers', title: 'Relocation made effortless.', category: 'Brand stories', duration: '00:27', description: 'Engaging commercial for professional moving services featuring careful packing, efficient transport, and seamless delivery.', details: ['Moving Commercial', 'Logistics Story', 'Animated Captions'], color: '#bdaccc' },
  { id: 'sharp-edge-home-09', brand: 'Sharp Edge Homes', title: 'Architectural elegance defined.', category: 'Spaces & places', duration: '00:31', description: 'A vertical architecture tour capturing natural light, open-plan spaces, and high-end exterior construction artistry.', details: ['Modern Architecture', 'Lighting Showcase', 'Property Reel'], color: '#afc2b3' },
  { id: 'nabhi-oil', brand: 'Nabhi Oil', title: 'Natural wellness & heritage care.', category: 'Food & wellness', duration: '01:23', description: 'Presenter-led Ayurvedic wellness explainer with illustrative graphics, benefit callouts, and clean educational transitions.', details: ['Ayurvedic Wellness', 'Product Explainer', 'Educational Graphics'], color: '#a5b895' },
  { id: 'brevo-media', brand: 'Brevo Media', title: 'Creative commercials with punch.', category: 'Social & ads', duration: '00:42', description: 'A modern commercial featuring visual kinetic hooks, sound effects, dynamic zooms, and brand typography.', details: ['Digital Ad', 'Kinetic Typography', 'Sound FX'], color: '#dfb4a1' },
  { id: 'prime-path-brokers', brand: 'Prime Path Brokers', title: 'Smart financial pathways.', category: 'Brand stories', duration: '00:29', description: 'A clean, modern finance reel connecting home loan advisory with animated milestone markers and transparent communication.', details: ['Mortgage Advisory', 'Motion Infographics', 'Corporate Reel'], color: '#b9c5a8' },
  { id: 'aiims-bathinda-rooms', brand: 'AIIMS Bathinda Stays', title: 'Comfortable spaces & stays.', category: 'Spaces & places', duration: '00:35', description: 'A walk-through real estate reel showcasing fully furnished rooms, amenities, peaceful surroundings, and proximity.', details: ['Room Tour', 'Accommodation', 'Wide Angles'], color: '#97b29c' },
  { id: 'sharpedge-05', brand: 'Sharp Edge Homes', title: 'Luxury living & interior craftsmanship.', category: 'Spaces & places', format: 'landscape', duration: '00:36', description: 'A cinematic 16:9 widescreen showcase of luxury bespoke interiors, custom cabinetry, ambient lighting, and refined fixtures.', details: ['Landscape 16:9', 'Interior Craftsmanship', 'Cinematic Home Tour'], color: '#c0aa92' },
];

export const contact = { email: 'rohitvermapb03@gmail.com', phone: '+91 62392 64499', whatsapp: '6239264499', instagram: '' };
export const brandCount = new Set(projects.map(project => project.brand)).size;
export const projectCount = String(projects.length).padStart(2, '0');
