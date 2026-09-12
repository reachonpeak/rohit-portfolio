# Gmail connection

The footer, contact card, and enquiry destination use `jasvir.visual06@gmail.com`.

1. Sign in to that Google account, enable 2-Step Verification, and create an app password at https://myaccount.google.com/apppasswords.
2. Open `.env.local` in this project and paste the app password after `GMAIL_APP_PASSWORD=`. Leave `GMAIL_USER=jasvir.visual06@gmail.com`. Spaces in the generated password are accepted.
3. Run `npm run verify:gmail` to check Gmail authentication without sending an email.
4. Restart `npm run dev` after changing credentials. The project form can then send enquiries directly to Jasvir.

Keep the app password in `.env.local`, which is excluded from Git. Never put it in a `NEXT_PUBLIC_` variable or client component.

## Portfolio admin

Set `ADMIN_PASSWORD` in `.env.local`, restart the server, then open `/admin`. The admin panel lets you add or edit project metadata and remove projects. Add the matching media files to `public/work/` using the same project id: `<id>.jpg` and `<id>.mp4`. The local JSON catalog is stored in `data/projects.json`; on a deployed host, use persistent storage because many serverless filesystems are temporary.

For deployment, use a host that runs Next.js server routes and configure the same two environment variables in that host's secret settings. `npm run build` now creates a server build; the old `out/` directory is a stale static export and cannot handle email. Use `npm start` for the production server. Apply a host-level rate limit to `/api/contact` if running multiple instances; the built-in cap is five send attempts per minute per process.

The route uses TLS on Gmail port 465, validates and limits submissions, fixes the recipient to Jasvir's address, and places the visitor's email in Reply-To. It shows success only after Gmail accepts the message; SMTP acceptance does not guarantee inbox placement.

Official references: https://support.google.com/accounts/answer/185833 and https://nodemailer.com/smtp/
