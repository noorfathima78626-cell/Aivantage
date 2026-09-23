# Interview Platform — full project

Four pieces, each in its own folder. See each folder's own README for
detail — this file is the map + "where do I actually run this" answer.

```
interview-platform/
├── database/       MySQL schema
├── backend/        Java Spring Boot — auth, resume, session orchestration
├── ai-engine/       Python FastAPI — question gen, scoring, CV/audio signals
├── frontend/        React — everything the user sees
├── API_CONTRACT.md  the interface both members code against
└── methodology.md   report-ready methodology section
```

## Where to execute each piece

**Everything runs locally on your own laptop while building — nothing needs
to be deployed anywhere yet.** Both of you should have the full repo (push
it to a shared GitHub repo so you can pull each other's work) and run
whichever pieces you're actively touching.

| Piece | Requires | Run from | Runs at |
|---|---|---|---|
| MySQL | 8.4 LTS installed (MSI installer) | — (runs as a background service) | `localhost:3306` |
| Backend (Java) | JDK 17, Maven | `backend/` folder, in IntelliJ/Eclipse or terminal | `localhost:8080` |
| AI engine (Python) | Python 3.11 | `ai-engine/` folder, terminal | `localhost:8000` |
| Frontend (React) | Node 18+ | `frontend/` folder, terminal | `localhost:5173` |

### 1. Database — do this first, once
Open MySQL Workbench (or the CLI), connect with the root password you set
during install, then run everything in `database/schema.sql`.

### 2. Backend
```bash
cd backend
mvn spring-boot:run
```
Or just open the `backend/` folder in IntelliJ and run
`InterviewPlatformApplication.java` directly — Maven dependencies resolve
automatically on first open. Update the MySQL password in
`src/main/resources/application.properties` first.

### 3. AI engine
```bash
cd ai-engine
python3.11 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 4. Frontend
```bash
cd frontend
npm install
npm run dev
```
`MOCK_MODE = true` in `src/api/api.js` means the frontend works standalone
without the other two running. Flip it to `false` once you're ready to test
real integration end-to-end.

## Who runs what, day to day

- **Whoever owns the frontend this sprint**: only needs `npm run dev` —
  MOCK_MODE means no other service has to be running.
- **Whoever owns the backend**: needs MySQL running + `mvn spring-boot:run`.
  Test endpoints directly with Postman/curl before the frontend is wired up.
- **Whoever owns the AI engine**: needs MySQL running + `uvicorn`. Use the
  auto-generated docs at `localhost:8000/docs` to test endpoints without
  needing the Java backend running.
- **Integration testing** (closer to each Monday/Thursday checkpoint): run
  all four pieces at once on one laptop, flip `MOCK_MODE` to `false`, and
  click through the full flow.
