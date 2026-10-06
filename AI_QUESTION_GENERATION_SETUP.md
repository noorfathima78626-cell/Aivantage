# AI question generation

Aivantage now asks the Python AI engine to generate fresh questions for **both Aptitude and One-on-One**.

Set these environment variables before starting the AI engine:

```bash
export OPENAI_API_KEY="your_api_key"
export OPENAI_MODEL="gpt-6-luna"
```

The engine uses the Responses API and falls back to the local question bank if no key is configured or the provider is temporarily unavailable.

Round generation includes the subject, difficulty, mode, round number, resume skills, and questions used in earlier rounds so the AI is instructed not to repeat them.

For Aptitude, the AI creates a mix of MCQ and coding questions. For One-on-One, it creates spoken-answer questions only.
