import nodemailer from 'nodemailer';
import { contact } from '@/lib/portfolio-data';

export const runtime = 'nodejs';

const maxBytes = 16_384;
const services = ['Video Editing', 'Motion Graphics', 'Color Grading', 'Audio Enhancement', 'Something else'];
// A conservative per-process cap; multi-instance hosting also needs an edge rate limit.
let windowStart = 0;
let attempts = 0;

function error(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin) {
    return error('Please send your enquiry from this website.', 403);
  }
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') {
    return error('Please submit the project form.', 415);
  }
  if (Number(request.headers.get('content-length')) > maxBytes) {
    return error('Your enquiry is too long. Please shorten it.', 413);
  }

  let data: Record<string, unknown>;
  try {
    const reader = request.body?.getReader();
    if (!reader) return error('Please complete the project form.', 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        return error('Your enquiry is too long. Please shorten it.', 413);
      }
      chunks.push(value);
    }
    const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return error('Please complete the project form.', 400);
    }
    data = parsed as Record<string, unknown>;
  } catch {
    return error('Please complete the project form.', 400);
  }

  if (data.website) return error('Unable to submit this enquiry.', 400);
  const field = (key: string) => typeof data[key] === 'string' ? data[key].trim() : '';
  const name = field('name');
  const email = field('email');
  const service = field('service');
  const message = field('message');
  if (!name || name.length > 100 || /[\r\n\x00]/.test(name) ||
      email.length > 254 || !/^[^\s@<>(),;:"\\]+@[^\s@<>(),;:"\\]+\.[^\s@<>(),;:"\\]+$/.test(email) ||
      !services.includes(service) || !message || message.length > 5000) {
    return error('Please enter a valid name, email, service, and project description (up to 5,000 characters).', 400);
  }

  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, '');
  if (user !== contact.email || !pass) {
    return error(`The contact form is not available yet. Please email ${contact.email}.`, 503);
  }
  if (Date.now() - windowStart >= 60_000) {
    windowStart = Date.now();
    attempts = 0;
  }
  if (attempts >= 5) return error('The form is busy. Please try again in a minute.', 429);
  attempts++;

  const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com', port: 465, secure: true,
    auth: { user, pass },
    connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 20_000,
    disableFileAccess: true, disableUrlAccess: true,
  });
  try {
    const result = await transport.sendMail({
      from: { name: 'Jasvir Visual — Website', address: user },
      to: contact.email,
      replyTo: { name, address: email },
      subject: `New project enquiry: ${service}`,
      text: `New enquiry from the portfolio website\n\nName: ${name}\nEmail: ${email}\nService: ${service}\n\nProject:\n${message}`,
    });
    if (!result.accepted.length) throw new Error('Recipient not accepted');
    return Response.json({ ok: true });
  } catch {
    // Never expose SMTP responses, credentials, or visitor details in logs or errors.
    return error(`Your enquiry could not be sent. Please try again or email ${contact.email}.`, 502);
  } finally {
    transport.close();
  }
}
