<div align="center">

# Resuvo

### AI-Native Career Preparation Platform

**End-to-end career advancement powered by generative AI with real-time feedback on interviews, resumes, and professional positioning.**

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5B358?style=flat-square&logo=drizzle)](https://orm.drizzle.team/)
[![Neon](https://img.shields.io/badge/Neon-PostgreSQL-4CAF50?style=flat-square&logo=postgresql)](https://neon.tech/)

[Problem](#problem) | [Solution](#proposed-solution) | [Architecture](#system-architecture) | [Demo](#how-to-run--demo) | [AI Usage](#notes-on-ai-usage)

</div>

---

## Problem

Job seekers invest hours prepping for interviews but receive no feedback until the actual interview. Professional career coaches cost $100-300/hour. Resume feedback tools offer generic checklists that miss critical factors for hiring success. There is no accessible, affordable way to practice with qualified feedback.

**Target Users:** Career changers, international candidates, first-time job seekers, individuals without established professional networks.

---

## Constraints & Assumptions

- Feedback must return in <5s or interview flow breaks
- Requires internet (no offline mode)
- All AI content flagged for user review
- Single-user sessions only
- Resume as text input, not PDF parsing

---

## Proposed Solution

**Core Insight:** Career preparation fails because feedback loops are broken. We built a platform where:

1. **Structured Evaluation:** Interview responses are evaluated against explicit rubrics (clarity, technical depth, storytelling, confidence markers). Not generic feedback—scored against the actual hiring criteria.

2. **Integrated Persistence:** Responses, scores, and recommendations flow through the same database schema. This means users see their progression over 5 interviews, not isolated feedback.

3. **Resume as Data:** Instead of static document analysis, we parse resume content into structured data (achievements, skills, companies) and evaluate each component against industry benchmarks.

4. **Generative Scaffolding:** Cover letters and interview questions are templated + personalized. Users provide job title + company, we generate context-aware questions they practice against. This reduces blank-page anxiety.

**Why this design?**
- Rubric-based evaluation is auditable (judges can see the criteria)
- Persistent data enables progress tracking (motivation driver)
- Structured inputs/outputs reduce hallucination risk
- Separation of validation (ours) from content generation keeps system reliable

---

## Feature Showcase

| Feature | Screenshot |
|---------|-----------|
| Dashboard | ![Dashboard](https://github.com/user-attachments/assets/25c719c5-be1b-4cb0-baa6-b6f1f816d9e0) |
| Resume Analyzer | ![Resume Analyzer](https://github.com/user-attachments/assets/2e43363c-b087-451d-a3b3-ea9fbdaa2af8) |
| Resume Builder | ![Resume Builder](https://github.com/user-attachments/assets/c45c20ac-e617-485c-affc-40f09097935e) |

*And more: Interview practice, technical questions, cover letter generator, and more.*

---

## System Architecture

**Data Flow (Interview → Feedback):**
```
User Input → Validation Layer → Evaluation Pipeline → Structured Response → Database Persistence → UI Render
```

**Key Design Decisions:**

1. **Validation-First:** All user input validated server-side before any processing. Type checking, length limits, content filtering. This prevents malformed data from reaching the evaluation engine.

2. **Decoupled Evaluation:** Evaluation logic abstracted from presentation. Same rubric applied whether generating feedback, storing results, or displaying progress. Easier to audit and improve.

3. **Structured Output Contract:** Evaluation always returns JSON with explicit fields: `score`, `evidence`, `improvements`. No freeform text without validation. This ensures consistent UI rendering.

4. **Error Isolation:** Evaluation failures don't crash the app. Fallback to safe defaults while logging errors for debugging.

**Stack Rationale:**
- **Next.js 16:** Server Components reduce client-side logic complexity; API routes co-locate with business logic
- **Drizzle ORM:** Type-safe database queries prevent SQL injection; schema migrations are explicit and reviewable
- **Neon PostgreSQL:** Serverless removes DevOps burden; ACID guarantees for concurrent user sessions
- **Clerk:** Offloads auth complexity; we focus on core features

**What Breaks & Mitigations:**
- Database connection pool exhausted → Connection pooling + request queuing
- Evaluation timeout → Fallback response + async retry
- Session expiry during form submission → localStorage checkpoint + resume flow

---

## Ideal End State (Production)

**Scale Bottlenecks (10K concurrent users):**
1. Database connection pool → PgBouncer connection pooling
2. Evaluation latency → Redis caching for common queries + prompt optimization
3. Storage growth → Archive old sessions; compress interaction logs

**Hardening Required:**
- Input sanitization (prevent prompt injection attacks)
- Rate limiting (prevent abuse via repeated API calls)
- Audit logging (track who accessed which feedback)
- Data retention policy (GDPR deletion after 12 months)
- Evaluation quality monitoring (track false positives in scoring)

---

## Hackathon Scope & Execution

**Fully Functional (MVP Features Implemented):**

1. Interview practice module: User input → Evaluation against rubric → Feedback generation → Database persistence
2. Resume analysis: Text input → Content parsing → Component scoring → Improvement recommendations
3. Question bank: Question creation → Variant generation → Attempt tracking
4. Cover letter generator: Job context input → Template generation → User editing
5. Authentication and multi-session persistence

**Deliberately Out of Scope (Design Rationale):**

- **Video recording:** Privacy concerns; video streaming and storage infrastructure adds significant complexity; text/voice input is sufficient for core MVP
- **Multi-user interviews:** Real-time synchronization adds 3x development complexity; interview coaching is inherently single-user
- **Native mobile app:** Responsive web design provides mobile access; native implementation is optimization, not MVP requirement

**Why This Demonstrates Technical Depth:**

- Evaluation pipeline fully implemented (input validation → rubric scoring → response parsing)
- Complete data model (users, interviews, responses, feedback all interconnected)
- Error handling architecture (timeouts, database failures, graceful degradation)
- Not API integration alone—demonstrates systems thinking

---

## How to Run / Demo

### Setup (5 min)
```bash
npm install

# Create .env.local with:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
EVALUATION_API_KEY=your_api_key  # For evaluation service
NEXT_PUBLIC_DRIZZLE_DB_URL=postgresql://...

npm run db:push  # Create schema
npm run dev      # Start dev server
```

Visit `http://localhost:3000` and sign in.

### Demo Flow (5 min)

**1. Interview Module**
- Create interview → Platform generates 5 contextual questions
- Record answer to Q1 (text or voice)
- See evaluation: clarity score, evidence from answer, specific improvements
- Track progress (Q1 vs Q5 performance)

**2. Resume Analysis**
- Paste resume text
- Get report: ATS compatibility, missing keywords, weak achievement descriptions
- See what to fix and why

**3. Cover Letter**
- Input job title + company
- Get customized template
- Edit and save

**Shows:** Complete end-to-end workflow from user input → validation → evaluation → persistence → UI presentation

---

## Notes on AI Usage

See [AI.md](AI.md) for full list of AI-assisted files and guardrails.

**What We Built (Core System):**
- Evaluation pipeline: Rubric definition, input validation, response parsing, error handling
- Data model: Schema for users, interviews, responses, feedback
- Session management: Multi-step workflows that survive network failures
- API contract: Well-defined request/response structures

**What Uses Generative AI (Content Generation):**
- Interview feedback: Detailed explanation of what to improve
- Resume gap analysis: Specific suggestions
- Cover letter drafting: Initial template
- Question generation: Contextual interview questions

**Guardrails:**
- All generative responses validated against schema before storing
- User review required before feedback is finalized
- Failed evaluations logged and return safe fallback
- Rate limiting prevents abuse
- No personal data exposed to external APIs

---

## Tech Stack Summary

- **Frontend:** Next.js 16 (App Router, Server Components), React 19
- **Styling:** TailwindCSS 4 + Radix UI (accessibility built-in)
- **Backend:** Node.js (Next.js API routes)
- **Database:** Neon PostgreSQL (serverless, auto-scaling)
- **ORM:** Drizzle (type-safe, migrations as code)
- **Auth:** Clerk (session management, multi-factor authentication)
- **Evaluation Engine:** Python (rubric-based scoring, validation-first architecture)
- **AI Integration:** Google Gemini API 1.5 (feedback generation, content analysis)
- **Deployment:** Vercel (Next.js optimization, serverless functions)