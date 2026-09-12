const path = require('node:path');
require('@next/env').loadEnvConfig(path.resolve(__dirname, '..'));
const nodemailer = require('nodemailer');

async function main() {
  const user = process.env.GMAIL_USER?.trim();
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, '');
  if (user !== 'jasvir.visual06@gmail.com' || !pass) {
    console.error('Add the Gmail app password to GMAIL_APP_PASSWORD in .env.local first.');
    process.exitCode = 1;
    return;
  }
  const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com', port: 465, secure: true, auth: { user, pass },
    connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 20000,
  });
  try {
    await transport.verify();
    console.log('Gmail connection and authentication verified. No email was sent.');
  } catch (error) {
    console.error(error.code === 'EAUTH'
      ? 'Gmail rejected authentication. Check the account and its app password.'
      : 'Could not connect to Gmail. Check network access and try again.');
    process.exitCode = 1;
  } finally {
    transport.close();
  }
}
main();
