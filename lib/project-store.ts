import { promises as fs } from 'node:fs';
import path from 'node:path';
import { projects as builtIn, type Project } from '@/lib/portfolio-data';

const file = path.join(process.cwd(), 'data', 'projects.json');

export async function readProjects(): Promise<Project[]> {
  try {
    const parsed = JSON.parse(await fs.readFile(file, 'utf8')) as unknown;
    return Array.isArray(parsed) && parsed.length ? parsed as Project[] : builtIn;
  } catch {
    return builtIn;
  }
}

export async function writeProjects(value: Project[]) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
}
