# 🧭 Project Decisions – Travel Globe

A living document outlining core architectural and tooling decisions.

---

## 🧩 Frontend

- **Vite + React + TypeScript** – Lightweight, fast dev experience.
- **TailwindCSS** – Utility-first styling.
- **ShadCN UI** – Accessible, pre-built UI components.
- **TanStack Query** – Powerful client-side data fetching/caching.
- **Zod (client)** – Form and input validation.
- **Cloudflare Workers** – Deployment target using edge-native compute.

---

## 🛠 Backend

- **Cloudflare Workers** – Serverless backend logic (e.g. form submission).
- **Cloudflare Functions** – If needed, for more structured serverless routing.
- **Cloudflare R2 (optional)** – For image storage as an alternative to Supabase.
- **Supabase** – Used for initial storage backend, especially for user-uploaded images.
- **Zod (server)** – Schema validation for backend logic.

---

## 🔐 Auth (optional for now)

- **Supabase Auth** – Social provider login support (Google, Facebook).
- **Future-ready** – Auth setup kept flexible for production rollout.

---

## ✅ Testing & CI/CD

- **Jest** – Unit testing for logic-heavy code.
- **Playwright** – End-to-end browser testing.
- **GitHub Actions** – CI pipeline for auto testing, linting, and deployment.

---

## 🚀 Deployment

- **Cloudflare Workers** – Main target for frontend/backend combo.
- **GitHub Integration** – Auto deploy on push using GitHub Actions.

---

## 🧪 Developer Experience

- **TypeScript** – Fast builds, static typing.
- **Cursor.dev** – Used with team rules & code navigation.
- **Zod + TanStack + Tailwind** – Core trio for typed validation, caching, styling.

---

## 🗺 Project Description

> **Travel Globe** – A personal interactive globe that visualizes user-submitted travel images and geocoordinates.

---

_This doc evolves with the stack. Update as needed._
