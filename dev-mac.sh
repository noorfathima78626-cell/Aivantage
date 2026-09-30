#!/bin/bash
set -u

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$ROOT_DIR/frontend/frontend"
BACKEND_DIR="$ROOT_DIR/backend"
AI_DIR="$ROOT_DIR/ai-engine"

PIDS=()

cleanup() {
  echo
  echo "Stopping Aivantage services..."
  for pid in "${PIDS[@]:-}"; do
    kill "$pid" 2>/dev/null || true
  done
  wait 2>/dev/null || true
  echo "Aivantage stopped."
}
trap cleanup INT TERM EXIT

if ! command -v npm >/dev/null 2>&1; then
  echo "ERROR: npm was not found. Install Node.js/npm first."
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "ERROR: python3 was not found."
  exit 1
fi

if [ ! -d "$FRONTEND_DIR" ]; then
  echo "ERROR: Frontend folder not found: $FRONTEND_DIR"
  exit 1
fi

if [ ! -d "$BACKEND_DIR" ]; then
  echo "ERROR: Backend folder not found: $BACKEND_DIR"
  exit 1
fi

if [ ! -d "$AI_DIR" ]; then
  echo "ERROR: AI engine folder not found: $AI_DIR"
  exit 1
fi

# Java backend
(
  cd "$BACKEND_DIR" || exit 1
  if [ -x "./mvnw" ]; then
    echo "[backend] Starting Spring Boot on http://localhost:8080"
    ./mvnw spring-boot:run
  elif command -v mvn >/dev/null 2>&1; then
    echo "[backend] Starting Spring Boot on http://localhost:8080"
    mvn spring-boot:run
  else
    echo "[backend] ERROR: Maven was not found. Install Maven or add a Maven wrapper (mvnw) to backend/."
    exit 1
  fi
) &
PIDS+=("$!")

# Python AI engine. Prefer a project-local virtual environment if one exists.
(
  cd "$AI_DIR" || exit 1
  if [ -x ".venv/bin/python" ]; then
    PYTHON_BIN=".venv/bin/python"
  else
    PYTHON_BIN="python3"
  fi
  echo "[ai-engine] Starting FastAPI on http://localhost:8000"
  "$PYTHON_BIN" -m uvicorn main:app --reload --port 8000
) &
PIDS+=("$!")

# React/Vite frontend.
(
  cd "$FRONTEND_DIR" || exit 1
  echo "[frontend] Starting Vite on http://localhost:5173"
  npm run dev -- --host 0.0.0.0
) &
PIDS+=("$!")

echo
 echo "=================================================="
echo "Aivantage development stack is starting"
echo "Frontend : http://localhost:5173"
echo "Backend  : http://localhost:8080"
echo "AI       : http://localhost:8000"
echo "AI health: http://localhost:8000/health"
echo "Press Ctrl+C once to stop all three services."
echo "=================================================="
echo

wait
