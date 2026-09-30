"""Small local coding evaluator for the interview-practice MVP.

It executes only the supported Python coding questions and runs a fixed test
suite supplied by the question. This is suitable for a local college/demo
project, not an internet-facing multi-tenant judge.
"""

from __future__ import annotations

import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path


BLOCKED = re.compile(
    r"\b(import\s+(os|sys|subprocess|socket|pathlib|shutil|requests)|"
    r"from\s+(os|sys|subprocess|socket|pathlib|shutil)|open\s*\(|"
    r"exec\s*\(|eval\s*\(|__import__\s*\(|compile\s*\(|input\s*\()",
    re.IGNORECASE,
)


def evaluate_code(language: str, code: str, function_name: str, tests: list[dict]) -> dict:
    language = (language or "python").lower().strip()
    code = code or ""

    if language != "python":
        return {
            "correct": False,
            "score": 0,
            "wrongLine": None,
            "message": f"Automatic checking is currently enabled for Python coding questions. {language.title()} evaluation is planned for the next iteration.",
            "suggestion": "Choose a Python coding question for automatic execution and test-case checking.",
            "testResults": [],
        }

    if not code.strip():
        return {
            "correct": False, "score": 0, "wrongLine": 1,
            "message": "No code was submitted.",
            "suggestion": "Write the required function and try the test cases again.",
            "testResults": [],
        }

    if BLOCKED.search(code):
        return {
            "correct": False, "score": 0, "wrongLine": _line_of_match(code, BLOCKED.search(code)),
            "message": "The submission contains a blocked operation that is not allowed in this practice evaluator.",
            "suggestion": "Use a pure function that solves the problem without file, process, network, or dynamic-code access.",
            "testResults": [],
        }

    with tempfile.TemporaryDirectory(prefix="aivantage-code-") as temp_dir:
        path = Path(temp_dir) / "submission.py"
        harness = _build_harness(code, function_name, tests)
        path.write_text(harness, encoding="utf-8")

        env = os.environ.copy()
        env["PYTHONPATH"] = ""
        env["PYTHONNOUSERSITE"] = "1"

        try:
            completed = subprocess.run(
                [sys.executable, "-I", str(path)],
                cwd=temp_dir,
                capture_output=True,
                text=True,
                timeout=2.5,
                env=env,
            )
        except subprocess.TimeoutExpired:
            return {
                "correct": False, "score": 0, "wrongLine": None,
                "message": "The code took too long to finish and timed out.",
                "suggestion": "Check for an infinite loop or an inefficient algorithm.",
                "testResults": [],
            }
        except Exception as exc:
            return {
                "correct": False, "score": 0, "wrongLine": None,
                "message": f"The evaluator could not run the submission: {exc}",
                "suggestion": "Check that the Python runtime is installed and the function syntax is valid.",
                "testResults": [],
            }

        if completed.returncode == 0:
            return {
                "correct": True,
                "score": 100,
                "wrongLine": None,
                "message": "All test cases passed. The solution is correct for the supplied cases.",
                "suggestion": "Good work. Next, explain the time and space complexity of your solution.",
                "testResults": _all_passed_results(tests),
            }

        wrong_line = _extract_user_line(completed.stderr, len(code.splitlines()))
        message, suggestion = _explain_failure(completed.stderr)
        return {
            "correct": False,
            "score": 0,
            "wrongLine": wrong_line,
            "message": message,
            "suggestion": suggestion,
            "testResults": _failed_results(completed.stdout),
        }


def _build_harness(code: str, function_name: str, tests: list[dict]) -> str:
    tests_literal = repr(tests)
    return f"""{code}\n\n__aivantage_tests = {tests_literal}\n\ntry:\n    __aivantage_fn = {function_name}\nexcept NameError:\n    raise RuntimeError('Required function {function_name} was not found.')\n\n__aivantage_results = []\nfor __i, __test in enumerate(__aivantage_tests, 1):\n    try:\n        __actual = __aivantage_fn(__test['input'])\n        __expected = __test['expected']\n        if __actual != __expected:\n            print(f'TEST_FAIL:{{__i}}: expected={{__expected!r}} actual={{__actual!r}}')\n            raise AssertionError(f'test {{__i}} failed')\n        __aivantage_results.append({{'test': __i, 'passed': True}})\n    except Exception as __exc:\n        print(f'TEST_FAIL:{{__i}}: {{type(__exc).__name__}}: {{__exc}}')\n        raise\nprint('ALL_TESTS_PASSED')\n"""


def _extract_user_line(stderr: str, code_lines: int) -> int | None:
    # Harness starts after user code, so subtract the generated prefix lines.
    matches = [int(value) for value in re.findall(r"File .*submission\.py\", line (\d+)", stderr or "")]
    user_lines = [value for value in matches if value <= code_lines]
    return user_lines[-1] if user_lines else None


def _line_of_match(code: str, match: re.Match | None) -> int | None:
    if not match:
        return None
    return code.count("\n", 0, match.start()) + 1


def _explain_failure(stderr: str) -> tuple[str, str]:
    text = (stderr or "").strip()
    if "Required function" in text:
        return "The required function was not found in your submission.", "Use the function name and parameter shown in the question exactly."
    if "SyntaxError" in text:
        return "The code contains a Python syntax error.", "Read the error location, check brackets/indentation/colons, and run the function again."
    if "IndexError" in text:
        return "The code tried to access an invalid list or string position.", "Check your loop bounds and handle empty or short inputs."
    if "TypeError" in text:
        return "The code used a value with an incompatible type.", "Check the type of each variable before applying the operation."
    if "AssertionError" in text or "TEST_FAIL" in text:
        return "At least one test case failed, so the solution is not correct yet.", "Compare your output with the expected output and trace the failing case step by step."
    return "The submitted code raised a runtime error.", "Read the error message and trace the failing line back to the input that caused it."


def _all_passed_results(tests: list[dict]) -> list[dict]:
    return [{"test": i, "passed": True, "expected": t.get("expected")} for i, t in enumerate(tests, 1)]


def _failed_results(stdout: str) -> list[dict]:
    results = []
    for line in (stdout or "").splitlines():
        if line.startswith("TEST_FAIL:"):
            parts = line.split(":", 2)
            try:
                number = int(parts[1])
            except Exception:
                number = None
            results.append({"test": number, "passed": False, "detail": parts[2].strip() if len(parts) > 2 else line})
    return results
