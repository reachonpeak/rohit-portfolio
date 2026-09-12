const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
function write(name, content) {
  const target = path.resolve(root, name);
  if (!target.startsWith(root + path.sep)) throw new Error('Invalid destination');
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}
async function download(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  return Buffer.from(await response.arrayBuffer());
}
async function main() {
  const registry = JSON.parse(fs.readFileSync(path.join(root, 'portfolio-source.json'), 'utf8'));
  const media = new Set();
  for (const file of registry.files) {
    let content = file.content.replaceAll('John Doe', 'Jasveer Editor').replaceAll('>JD<', '>JE<')
      .replaceAll('@/registry/hirael/bases/radix/ui/button', '@/components/ui/button');
    for (const match of content.matchAll(/https:\/\/hirael\.com\/media\/templates\/portfolio\/[a-zA-Z0-9._-]+/g)) media.add(match[0]);
    content = content.replaceAll('https://hirael.com/media/templates/portfolio/', '/media/');
    if (file.target.endsWith('/hero.tsx')) content = content
      .replace("['Creative', 'Developer', 'Founder', 'Scholar']", "['Video Editor', 'Visual Storyteller', 'Creative']")
      .replace('lives in Chicago.', 'bringing stories to life.')
      .replace('Designing seamless digital interactions by focusing on the unique nuances which bring systems to life.', 'Crafting stories through thoughtful cuts, cinematic motion, and attention to every frame.')
      .replace('relative flex h-dvh', 'relative isolate flex h-dvh');
    if (file.target.endsWith('/contact.tsx')) content = content.replace('relative overflow-hidden bg-', 'relative isolate overflow-hidden bg-');
    write(file.target, content);
  }
  write('lib/utils.ts', "import { clsx, type ClassValue } from 'clsx';\nimport { twMerge } from 'tailwind-merge';\nexport function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }\n");
  write('components/ui/button.tsx', "import * as React from 'react';\nimport { cn } from '@/lib/utils';\ntype Props = React.ComponentProps<'button'> & { variant?: 'ghost'; size?: 'icon-lg' };\nexport function Button({className, variant, size, ...props}: Props) { return <button data-slot=\"button\" className={cn('inline-flex size-10 items-center justify-center cursor-pointer transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white',className)} {...props} />; }\n");
  write('app/page.tsx', "import Portfolio from '@/components/templates/portfolio/portfolio';\nexport default function Page() { return <main><Portfolio /></main>; }\n");
  write('app/layout.tsx', "import type { Metadata } from 'next';\nimport './globals.css';\nexport const metadata: Metadata = { title: 'Jasveer Editor | Portfolio', description: 'Jasveer Editor — video editing and visual storytelling.' };\nexport default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang=\"en\"><body>{children}</body></html>; }\n");
  write('app/globals.css', '@import "tailwindcss";\nhtml, body { margin: 0; background: #0a0a0a; color: #f5f5f5; }\n');
  write('postcss.config.mjs', 'export default { plugins: { "@tailwindcss/postcss": {} } };\n');
  write('next.config.ts', "import type { NextConfig } from 'next';\nconst config: NextConfig = { output: 'export', images: { unoptimized: true }, turbopack: { root: process.cwd() } };\nexport default config;\n");
  write('tsconfig.json', JSON.stringify({compilerOptions:{target:'ES2017',lib:['dom','dom.iterable','esnext'],allowJs:true,skipLibCheck:true,strict:true,noEmit:true,esModuleInterop:true,module:'esnext',moduleResolution:'bundler',resolveJsonModule:true,isolatedModules:true,jsx:'react-jsx',incremental:true,plugins:[{name:'next'}],paths:{'@/*':['./*']}},include:['next-env.d.ts','**/*.ts','**/*.tsx','.next/types/**/*.ts','.next/dev/types/**/*.ts'],exclude:['node_modules']}, null, 2));
  write('package.json', JSON.stringify({name:'jasveer-editor',version:'1.0.0',private:true,scripts:{dev:'next dev --hostname 127.0.0.1 --port 3010',build:'next build',typecheck:'tsc --noEmit'},dependencies:{next:'^16.3.4',react:'^19.2.0','react-dom':'^19.2.0',gsap:'^3.13.0',motion:'^12.0.0',clsx:'^2.1.1','tailwind-merge':'^3.0.0'},devDependencies:{typescript:'^5.9.0','@types/node':'^22.0.0','@types/react':'^19.0.0','@types/react-dom':'^19.0.0',tailwindcss:'^4.0.0','@tailwindcss/postcss':'^4.0.0'}},null,2));
  write('.gitignore', 'node_modules/\n.next/\nout/\n*.tsbuildinfo\n*.log\n');
  write('Start Jasveer Editor.cmd', '@echo off\r\ncd /d "%~dp0"\r\nif not exist node_modules (\r\n  call npm install\r\n  if errorlevel 1 (pause & exit /b 1)\r\n)\r\necho Open http://localhost:3010 in your browser after Ready appears.\r\ncall npm run dev\r\npause\r\n');
  write('README.md', '# Jasveer Editor\n\nPersonalized local copy of the Hirael portfolio linked from https://21st.dev/@mohammadshehadeh/templates/hirael-portfolio. Source downloaded from the author\'s current public registry: https://hirael.com/r/portfolio.json. This may be newer than the commit pinned by 21st.dev. Original snapshot: portfolio-source.json. Author: Mohammad Shehadeh; MIT license retained in LICENSE.\n\n## Open\nDouble-click **Start Jasveer Editor.cmd**, then open http://localhost:3010. Node.js 22 or newer is recommended. Dependencies are installed if missing.\n\n## Edit\nTemplate code is in components/templates/portfolio/. Name and introduction: hero.tsx. Email and social links: contact.tsx. Projects: selected-works.tsx. Journal: journal.tsx. Statistics: stats.tsx. Images and video: public/media/.\n\nThe name and editor introduction are personalized. Projects, journal, statistics, email and social links are still the original template examples; replace them with real details before publishing. Images and background video are downloaded locally. Google fonts are fetched during the first build.\n\n## Commands\n- npm run dev: local preview on port 3010\n- npm run typecheck: TypeScript check\n- npm run build: production export in out/\n\nsetup-template.cjs reproduces the initial extraction from portfolio-source.json and downloads the public assets. Running it again overwrites personalized source and configuration files, so do not run it after making your own edits.\n');
  write('LICENSE', await download('https://raw.githubusercontent.com/MohammadShehadeh/hirael/85b198f0ab19238ac3bdfe410cd9766d065b1974/LICENSE'));
  for (const url of media) {
    const filename = new URL(url).pathname.split('/').pop();
    const data = await download(url);
    write('public/media/' + filename, data);
    console.log(`${filename}: ${data.length} bytes`);
  }
  console.log(`Created Jasveer Editor with ${registry.files.length} template files and ${media.size} local assets.`);
}
main().catch(error => { console.error(error); process.exit(1); });
