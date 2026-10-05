# Helpdesk Ticketing System — Frontend

Next.js 14 (App Router) frontend for the helpdesk backend, styled as an "ops console":
a dark, terminal-like sidebar against a light working area, with ticket IDs and
timestamps set in monospace, and a colored "status rail" on every ticket row that
carries priority/status at a glance — like LEDs on a server rack.

## Design system

- **Colors** — `#F6F7F5` paper background, `#12151A` console-dark sidebar, `#2451B3`
  cobalt primary, plus a semantic signal palette for priority/status: amber (medium/
  in-progress), red (critical), teal (resolved), plum (assigned), slate (low/waiting).
- **Type** — Manrope (headers/nav), Work Sans (body), JetBrains Mono (ticket IDs,
  timestamps, status codes).
- **Signature element** — the status rail (a 4px colored bar) on every ticket card,
  monospace ticket codes (`TCK-3F9A2C`), and a history timeline styled like a commit log.

All tokens live in `tailwind.config.ts` and `src/app/globals.css` — change them there
to re-skin the whole app.

## Getting started

```bash
cp .env.local.example .env.local   # point NEXT_PUBLIC_API_URL at your backend
npm install
npm run dev
```

Requires the [helpdesk-backend](../helpdesk-backend) API running (defaults to
`http://localhost:4000/v1`).

Log in using the seeded accounts. The **ADMIN email is the email configured in the backend `.env` file using `SEED_ADMIN_EMAIL`**.

For example:

```env
SEED_ADMIN_EMAIL=example@mail.com
SEED_ADMIN_PASSWORD=password

## Structure

```
src/
├── app/
│   ├── login/, register/           # public auth pages (split console shell)
│   └── (dashboard)/                # protected route group — auth-guarded layout
│       ├── dashboard/               # role-adaptive stats + recent tickets
│       ├── tickets/, tickets/[id]/, tickets/new/
│       └── admin/users/, admin/categories/   # admin-only
├── components/
│   ├── ui/          # shadcn-style primitives, restyled to the console tokens
│   ├── layout/       # sidebar, topbar, auth shell, providers
│   ├── tickets/       # status/priority badges, ticket row, comments, history
│   └── dashboard/     # stat card
├── hooks/            # TanStack Query hooks (tickets, users, categories)
└── lib/
    ├── api-client.ts      # fetch wrapper: JWT header + silent refresh-on-401
    ├── auth-context.tsx    # current user, login/register/logout
    ├── types.ts            # mirrors the backend's Prisma models
    └── validations/        # Zod schemas shared with React Hook Form
```

## Key decisions

- **Status transitions are mirrored client-side** (`ALLOWED_TRANSITIONS` in the ticket
  detail page) so the status dropdown only ever offers legal moves — the backend still
  enforces this authoritatively, this is just so the UI doesn't offer dead ends.
- **Role-based UI, not just role-based data** — the sidebar, the assign control, and
  the "internal note" checkbox in comments only render for roles that can use them,
  matching the backend's RBAC exactly.
- **Auth tokens in localStorage** — pragmatic for a portfolio project; a production
  system would likely move to httpOnly cookies to reduce XSS exposure. Worth calling
  out if this comes up in an interview.

## Known environment note

`next build` fetches Manrope / Work Sans / JetBrains Mono from Google Fonts at build
time via `next/font/google`. This requires outbound internet access — if you're building
in a fully offline/sandboxed CI environment, either allow that domain or swap to local
font files with `next/font/local`.
