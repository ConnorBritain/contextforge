# 🏗️ ContextForge

ContextForge is a **Firebase‑native, AI‑powered document generator** that turns structured inputs into polished “context packs” your LLMs (OpenAI / Anthropic) can immediately consume.  
Out of the box it supports six high‑value formats:

1. Brand & Positioning Briefs  
2. Business Dimensional Profiles  
3. AI Style Guides  
4. Personal Bio Documents  
5. Offer Documentation Briefs  
6. Sales‑Messaging Playbooks  [oai_citation_attribution:0‡GitHub](https://github.com/ConnorBritain/contextforge/commit/eaab4072e3e1fc26b9a27cd46b91ae2011aee2d4)  

## ✨ Key Features
| Area | Status | Notes |
| --- | --- | --- |
| Multi‑step wizard | ✅ Complete | Progressive form with autosave & dev‑friendly JSON schema |
| AI generation | 🔄 In progress | Streams completions from OpenAI / Anthropic; token metering built‑in |
| Auth | 🔄 In progress | Firebase Auth (email + Google OAuth) |
| Database | ✅ Firestore | Switched from MongoDB to **Firestore** for unified auth + data  [oai_citation_attribution:1‡GitHub](https://github.com/connorbritain/contextforge) |
| Usage tracking | ✅ Complete | Server‑side token counter, Stripe‑ready hooks |
| Dashboards | ✅ Complete | Admin view for docs & token spend |
| CI / CD | ✅ Complete | GitHub Actions → Firebase Hosting + Functions |
| Tests | 🔄 In progress | E2E playwright tests against Emulator Suite |

## 🏗️ Tech Stack
| Layer | Implementation |
| --- | --- |
| Front‑end | React 18 + Vite + Tailwind |
| Back‑end | Cloud Functions (TypeScript) generated via Firebase Studio |
| Data | **Firestore** (documents & analytics), Storage for uploads |
| Auth | Firebase Auth (JWT) |
| AI Providers | OpenAI Chat Completions & Anthropic Claude |
| DevOps | Docker for local dev, Firebase Emulator Suite, GitHub Actions |

## 🚀 Quick start

### 1. clone & install
git clone https://github.com/connorbritain/contextforge
cd contextforge && npm install

### 2. start local emulators (auth, firestore, functions)
npm run dev

## 3. env vars (./.env.local)
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
FIREBASE_PROJECT_ID=contextforge-local

## Deploy to Firebase Hosting + Functions

### one‑command deploy (requires Firebase CLI)
firebase deploy --only hosting,functions

Firebase Studio users can simply “Import Repository” → “Deploy” and the agent handles CI, build and promotion automatically.

## 🔐 Security highlights
-	•	Firebase Auth JWT validation on every request
-	•	Firestore rules enforce per‑user document isolation
-	•	Helmet, CORS, and rate‑limiting middle‑ware on all endpoints

## 📅 Project Roadmap

See ROADMAP.md for milestone‑level detail; high‑level phases are:
	1.	Core functionality (auth + AI streaming)
	2.	Payments & tiered pricing
	3.	Multi‑context outputs, differential updates
	4.	Enterprise features (SSO, team spaces, white‑label)
