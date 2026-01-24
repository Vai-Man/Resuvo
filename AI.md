# AI Usage

## Our Code (Core System)
- Next.js architecture, routing, middleware
- Drizzle ORM schema & migrations
- Clerk auth integration
- Validation & error handling
- UI components & state logic
- Database queries & session management

## AI-Generated (Content)
- Interview feedback text
- Resume analysis reports
- Cover letter drafts
- Interview questions

## Files Using AI

**Server Actions (5):**
- src/actions/resume-analyzer.js
- src/actions/resume-signal-audit.js
- src/actions/cover-letter.js
- src/actions/questions.js
- src/actions/resume.js

**Client Components (7):**
- src/app/dashboard/interview/_components/AddNewInterview.jsx
- src/app/dashboard/interview/[interviewId]/start/_components/RecordAnswerSection.jsx
- src/app/dashboard/analyze-resume/_components/ResumePageClient.jsx
- src/app/dashboard/resume-signal-audit/page.jsx
- src/app/dashboard/questions/_components/AddNewQuestion.jsx
- src/app/dashboard/questions/[questionId]/_components/NewQuestionClientPage.jsx
- src/app/dashboard/cover-letter/_components/AddNewCoverLetter.jsx

**AI Wrapper (1):**
- src/utils/GeminiAIModal.js (handles API calls, validation, retries)

## Guardrails
- All responses validated against JSON schema
- User review required before saving AI content
- Failed requests return safe fallback
- Rate limiting per user (1 req/2s)
- No personal data sent to external APIs

## Tech
- Google Gemini 1.5 (@google/generative-ai v0.24.1)
- Temperature 0.7
