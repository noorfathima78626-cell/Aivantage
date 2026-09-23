# Frontend — setup & task split for Monday

## Run it
```bash
cd frontend
npm install
npm run dev
```
Opens at http://localhost:5173. `MOCK_MODE = true` in `src/api/api.js` means
every page works standalone right now — no backend needed for Monday's demo.
Flip it to `false` once the Java endpoints in `/API_CONTRACT.md` are live.

## Who owns what (so you can both commit without conflicts)

**Teammate 1 — Auth flow**
- `src/pages/Register.jsx`
- `src/pages/Login.jsx`
- `src/context/AuthContext.jsx`
- `src/App.jsx` (routing — touch this together once, then leave it alone)

**Teammate 2 — Interview flow**
- `src/pages/Dashboard.jsx` (resume upload + subject/difficulty)
- `src/pages/PreCheck.jsx` (camera/mic check)
- `src/pages/InterviewSession.jsx` (avatar + webcam + live Q&A)
- `src/pages/Results.jsx` (final report)
- `src/components/WebcamFeed.jsx`, `AvatarPanel.jsx`, `MetricChip.jsx`

Shared, touch-once: `src/index.css` (design tokens), `src/components/Navbar.jsx`.

## What to demo Monday

Click-through: Register → Login → Dashboard (upload + pick subject/difficulty)
→ PreCheck (real camera preview) → Interview Session (avatar speaks a
question aloud, you answer by voice, live metric chips update) → Results
(score + strengths + areas to improve). All of this runs off mock data —
that's expected for week 1. Real data starts flowing once the backend and
AI engine catch up in the following sprints.

## After Monday

Once Member A's `/api/auth/*`, `/api/resume/upload`, and `/api/sessions/*`
endpoints are up, flip `MOCK_MODE` to `false` — the fetch calls in
`src/api/api.js` already match the contract, so no page code should need to
change. Same for the `/signals/*` mock ticker in `InterviewSession.jsx` once
Member B's AI engine is live.


## Optional: real-time human interviewer

The One-on-One page supports a real streaming human avatar through HeyGen. The integration is optional: without configuration, the existing local interviewer video + browser speech fallback remains active.

1. Copy `.env.example` to `.env` in this frontend folder and set `VITE_HEYGEN_AVATAR_ID` and `VITE_HEYGEN_VOICE_ID`.
2. Set `HEYGEN_API_KEY` in the backend process environment. Never put the API key in the frontend `.env`.
3. Run `npm install` and restart Vite.
4. Restart the Java backend after setting the API key.

The backend exchanges the API key for a short-lived streaming token, and the browser uses that token to start the live avatar. HeyGen's current developer materials describe real-time/live avatars and streaming avatar SDK support; the older streaming-avatar package used here is retained for this local prototype because the current web SDK migration is still evolving.
