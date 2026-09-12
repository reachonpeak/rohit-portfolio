// Exercise the actual route with a fake SMTP transport; no network or email delivery.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync(require('node:path').join(__dirname, '../app/api/contact/route.ts'), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText;

function setup(options = {}) {
  const sent = [];
  let closed = 0;
  const exports = {};
  vm.runInNewContext(compiled, {
    exports, Request, Response, Buffer, Date, URL,
    process: { env: { GMAIL_USER: 'jasvir.visual06@gmail.com', GMAIL_APP_PASSWORD: options.missing ? '' : 'fake test password' } },
    require(name) {
      if (name === '@/lib/portfolio-data') return { contact: { email: 'jasvir.visual06@gmail.com' } };
      if (name === 'nodemailer') return { createTransport(config) {
        assert.equal(config.secure, true);
        assert.equal(config.port, 465);
        return {
          async sendMail(message) {
            sent.push(message);
            if (options.fail) throw new Error('Private SMTP response');
            return { accepted: options.reject ? [] : ['jasvir.visual06@gmail.com'] };
          },
          close() { closed++; },
        };
      } };
      throw new Error(`Unexpected import: ${name}`);
    },
  });
  return { post: exports.POST, sent, closed: () => closed };
}
const valid = { name: 'Test Visitor', email: 'visitor@example.com', service: 'Video Editing', message: 'A test project.' };
function request(data = valid, origin = 'http://localhost:3010', contentType = 'application/json') {
  return new Request('http://localhost:3010/api/contact', {
    method: 'POST', headers: { origin, 'content-type': contentType },
    body: typeof data === 'string' ? data : JSON.stringify(data),
  });
}
async function main() {
  for (const [req, status] of [
    [request(valid, 'https://unrelated.example'), 403],
    [request(valid, 'http://localhost:3010', 'text/plain'), 415],
    [request('{broken'), 400], [request('null'), 400],
    [request({ ...valid, email: 'a@example.com\r\nBcc: b@example.com' }), 400],
    [request({ ...valid, service: 'Unknown' }), 400],
    [request({ ...valid, message: 'x'.repeat(5001) }), 400],
    [request({ ...valid, website: 'spam' }), 400],
    [request('x'.repeat(16385)), 413],
  ]) {
    const app = setup();
    assert.equal((await app.post(req)).status, status);
    assert.equal(app.sent.length, 0);
  }
  assert.equal((await setup({ missing: true }).post(request())).status, 503);
  const app = setup();
  const response = await app.post(request({ ...valid, to: 'attacker@example.com' }));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).ok, true);
  assert.equal(app.sent[0].to, 'jasvir.visual06@gmail.com');
  assert.equal(app.sent[0].replyTo.address, valid.email);
  assert.equal(app.closed(), 1);
  for (let i = 0; i < 4; i++) assert.equal((await app.post(request())).status, 200);
  assert.equal((await app.post(request())).status, 429);
  for (const options of [{ fail: true }, { reject: true }]) {
    const failed = setup(options);
    const response = await failed.post(request());
    assert.equal(response.status, 502);
    assert.equal((await response.text()).includes('Private SMTP'), false);
    assert.equal(failed.closed(), 1);
  }
  console.log('Contact checks passed: validation, body limit, missing credentials, fixed recipient, Reply-To, SMTP failures, cleanup, and rate limit. No email sent.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
