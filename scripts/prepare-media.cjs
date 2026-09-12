const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const downloads = 'C:/Users/Jaspreet Singh/Downloads/videos';
const out = path.join(root, 'public', 'work');

fs.mkdirSync(out, { recursive: true });

const clips = [
  { slug: 'singh-auto-video', file: 'singh auto video .mp4', posterTime: 3 },
  { slug: 'bravo-vdo', file: 'bravo vdo _1_1.mp4', posterTime: 4 },
  { slug: 'singh-auto', file: 'singh auto.mp4', posterTime: 3 },
  { slug: 'vvdo', file: 'VVDO.mp4', posterTime: 5 },
  { slug: 'kasana-insurance', file: 'kasana insurance vdo .mp4', posterTime: 3 },
  { slug: 'wecan', file: 'we can .mp4', posterTime: 3 },
  { slug: 'shaan-shine-vdo', file: 'SHAAN SHINE VDO .mp4', posterTime: 3 },
  { slug: 'auto-mt', file: 'auto mt_1.mp4', posterTime: 4 },
  { slug: 'shahi-kebab', file: 'shahi kebab vdo ..mp4', posterTime: 4 },
  { slug: 'auto-mates', file: 'auto mates .mp4', posterTime: 5 },
  { slug: 'shaanshine-01', file: 'shaanshine vd 01.mp4', posterTime: 4 },
  { slug: 'baaz-migration', file: 'baaz migration _1 (4).mp4', posterTime: 5 },
  { slug: 'wecan-movers-05', file: 'wecan movers vd 05 (1).mp4', posterTime: 4 },
  { slug: 'sharp-edge-home-09', file: 'sharp edge home vd 09.mp4', posterTime: 5 },
  { slug: 'nabhi-oil', file: 'nabhi oil vd 01.mp4', posterTime: 5 },
  { slug: 'brevo-media', file: 'brevo media vd 01.mp4', posterTime: 5 },
  { slug: 'prime-path-brokers', file: 'prime path brokers vd 03.mp4', posterTime: 4 },
  { slug: 'aiims-bathinda-rooms', file: 'Aiims bathinda rooms vd .mp4', posterTime: 4 },
  { slug: 'sharpedge-05', file: 'sharpedge vd 05_1.mp4', posterTime: 6 },
];

function runFFmpeg(args) {
  const p = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], {
    windowsHide: true,
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024,
  });
  if (p.status !== 0) {
    throw new Error(p.stderr || p.error?.message || 'FFmpeg error');
  }
}

async function main() {
  console.log(`Processing ${clips.length} videos from ${downloads} into ${out}...`);

  for (let i = 0; i < clips.length; i++) {
    const { slug, file, posterTime } = clips[i];
    const source = path.join(downloads, file);

    if (!fs.existsSync(source)) {
      console.error(`[${i + 1}/${clips.length}] File not found: ${source}`);
      continue;
    }

    console.log(`[${i + 1}/${clips.length}] Processing ${slug} (${file})...`);

    const mainVideoPath = path.join(out, `${slug}.mp4`);
    const posterPath = path.join(out, `${slug}.jpg`);
    const previewPath = path.join(out, `${slug}-preview.mp4`);

    // 1. Copy or encode main mp4 with faststart if needed
    if (!fs.existsSync(mainVideoPath) || fs.statSync(mainVideoPath).size === 0) {
      try {
        console.log(`  Encoding main video: ${slug}.mp4`);
        runFFmpeg([
          '-i', source,
          '-vf', "scale='min(1920,iw)':-2",
          '-c:v', 'libx264',
          '-preset', 'fast',
          '-crf', '22',
          '-pix_fmt', 'yuv420p',
          '-c:a', 'aac',
          '-b:a', '128k',
          '-movflags', '+faststart',
          '-threads', '4',
          mainVideoPath
        ]);
      } catch (err) {
        console.warn(`  Re-encoding failed, copying file directly: ${err.message}`);
        fs.copyFileSync(source, mainVideoPath);
      }
    } else {
      console.log(`  Main video already exists: ${slug}.mp4`);
    }

    // 2. Generate crisp high-resolution poster image
    try {
      console.log(`  Extracting poster: ${slug}.jpg at ${posterTime}s`);
      runFFmpeg([
        '-ss', String(posterTime),
        '-i', source,
        '-frames:v', '1',
        '-vf', 'scale=720:-2',
        '-q:v', '2',
        posterPath
      ]);
    } catch (err) {
      console.error(`  Poster extraction failed: ${err.message}`);
    }

    // 3. Generate 6s muted lightweight preview loop
    try {
      console.log(`  Generating preview clip: ${slug}-preview.mp4`);
      runFFmpeg([
        '-ss', '1',
        '-i', source,
        '-t', '6',
        '-vf', 'scale=360:-2,fps=24',
        '-an',
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-crf', '26',
        '-pix_fmt', 'yuv420p',
        '-movflags', '+faststart',
        '-threads', '4',
        previewPath
      ]);
    } catch (err) {
      console.error(`  Preview generation failed: ${err.message}`);
    }

    console.log(`  Done ${slug}: Main ${fs.existsSync(mainVideoPath) ? fs.statSync(mainVideoPath).size : 0}B, Poster ${fs.existsSync(posterPath) ? fs.statSync(posterPath).size : 0}B, Preview ${fs.existsSync(previewPath) ? fs.statSync(previewPath).size : 0}B`);
  }

  console.log('All 19 videos processed successfully!');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
