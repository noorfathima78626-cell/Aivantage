"""Local multi-language coding evaluator for the practice assessment.

Supported execution modes:
- Python: execute the submitted function against fixed tests.
- JavaScript: execute the submitted function with Node against fixed tests.
- Java: compile the submitted method inside a small Solution class.
- SQL: execute the submitted query against a small in-memory SQLite dataset.
- Pseudocode / unknown languages: run a structured completeness check so the
  user still receives automatic feedback instead of a manual-review message.

This is a local college/demo evaluator, not a hardened public code judge.
"""
from __future__ import annotations

import ast
import json
import os
import re
import sqlite3
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any

BLOCKED = re.compile(
    r"\b(import\s+(os|sys|subprocess|socket|pathlib|shutil|requests)|"
    r"from\s+(os|sys|subprocess|socket|pathlib|shutil)|open\s*\(|"
    r"exec\s*\(|eval\s*\(|__import__\s*\(|compile\s*\(|input\s*\()",
    re.IGNORECASE,
)

JS_BLOCKED = re.compile(r"\b(require|process\.env|child_process|fs\.|net\.|fetch\s*\()", re.IGNORECASE)


def evaluate_code(language: str, code: str, function_name: str | None = None, tests: list[dict] | None = None) -> dict:
    language = (language or "python").lower().strip()
    code = code or ""
    tests = tests or []
    function_name = function_name or _infer_function_name(code)

    if not code.strip():
        return _result(False, 0, 1, None, None, "No code was submitted.", "Write the required solution and run the checker again.", [])

    if language == "python":
        return _evaluate_python(code, function_name, tests)
    if language in {"javascript", "js"}:
        return _evaluate_javascript(code, function_name, tests)
    if language == "java":
        return _evaluate_java(code, function_name, tests)
    if language == "sql":
        return _evaluate_sql(code)
    if language in {"pseudocode", "pseudo-code", "text"}:
        return _evaluate_pseudocode(code)

    return _evaluate_static(code, language)


def _evaluate_python(code: str, function_name: str | None, tests: list[dict]) -> dict:
    blocked = BLOCKED.search(code)
    if blocked:
        return _result(False, 0, _line_of_match(code, blocked), None, None,
                       "The submission contains a blocked operation.",
                       "Use a pure function without file, process, network or dynamic-code access.", [])

    try:
        ast.parse(code)
    except SyntaxError as exc:
        return _result(False, 0, exc.lineno, None, None,
                       f"Python syntax error: {exc.msg}.",
                       "Check the highlighted line for indentation, brackets, colons and quotes.", [])

    if not function_name:
        return _result(False, 0, 1, None, None,
                       "The evaluator could not find the required function.",
                       "Use the function name shown in the question exactly.", [])

    tests = tests or _default_tests(function_name)
    if not tests:
        return _evaluate_static(code, "python")

    harness = _build_python_harness(code, function_name, tests)
    return _run_temp_process([sys.executable, "-I"], harness, code, tests, language="python", function_name=function_name)


def _evaluate_javascript(code: str, function_name: str | None, tests: list[dict]) -> dict:
    blocked = JS_BLOCKED.search(code)
    if blocked:
        return _result(False, 0, _line_of_match(code, blocked), None, None,
                       "The JavaScript submission uses a blocked browser/server operation.",
                       "Keep the solution as a pure function for this assessment.", [])
    if not function_name:
        return _evaluate_static(code, "javascript")
    tests = tests or _default_tests(function_name)
    if not tests:
        return _evaluate_static(code, "javascript")

    payload = json.dumps(tests, ensure_ascii=False)
    harness = f"""{code}\n\nconst __tests = {payload};\nlet __fn;\ntry {{ __fn = {function_name}; }} catch (e) {{ console.error('REQUIRED_FUNCTION:' + e.message); process.exit(2); }}\nfor (let i = 0; i < __tests.length; i++) {{\n  const t = __tests[i];\n  try {{\n    const actual = t.spread ? __fn(...t.input) : __fn(t.input);\n    const expected = t.expected;\n    const equal = JSON.stringify(actual) === JSON.stringify(expected) || (typeof actual === 'number' && typeof expected === 'number' && Math.abs(actual - expected) < 0.02);\n    if (!equal) {{\n      console.log('TEST_FAIL:' + (i + 1) + ': expected=' + JSON.stringify(expected) + ' actual=' + JSON.stringify(actual));\n      process.exit(1);\n    }}\n  }} catch (e) {{\n    console.log('TEST_FAIL:' + (i + 1) + ': ' + e.name + ': ' + e.message);\n    process.exit(1);\n  }}\n}}\nconsole.log('ALL_TESTS_PASSED');\n"""
    return _run_temp_process(["node"], harness, code, tests, language="javascript", function_name=function_name)


def _evaluate_java(code: str, function_name: str | None, tests: list[dict]) -> dict:
    if re.search(r"\b(System\.exit|Runtime\.getRuntime|ProcessBuilder|java\.io|java\.net)\b", code):
        return _result(False, 0, _line_of_match(code, re.search(r"\b(System\.exit|Runtime\.getRuntime|ProcessBuilder|java\.io|java\.net)\b", code)), None, None,
                       "The Java submission uses an operation that is not allowed in the practice evaluator.",
                       "Keep the solution limited to the requested method.", [])
    if not function_name:
        return _evaluate_static(code, "java")
    tests = tests or _default_tests(function_name)
    if not tests:
        return _evaluate_static(code, "java")

    with tempfile.TemporaryDirectory(prefix="aivantage-java-") as temp_dir:
        root = Path(temp_dir)
        solution = root / "Solution.java"
        runner = root / "Runner.java"
        solution.write_text("import java.util.*;\npublic class Solution {\n" + code + "\n}\n", encoding="utf-8")
        runner.write_text(_java_runner(function_name, tests), encoding="utf-8")
        try:
            compile_result = subprocess.run(["javac", "Solution.java", "Runner.java"], cwd=root, capture_output=True, text=True, timeout=4)
        except Exception as exc:
            return _result(False, 0, None, None, None, f"Java evaluator could not start: {exc}", "Check that Java is installed on the AI-engine machine.", [])
        if compile_result.returncode != 0:
            line = _extract_java_line(compile_result.stderr)
            return _result(False, 0, line, None, None, _clean_error(compile_result.stderr), "Fix the Java compiler error at the indicated line and run the check again.", [])
        try:
            run_result = subprocess.run(["java", "Runner"], cwd=root, capture_output=True, text=True, timeout=3)
        except subprocess.TimeoutExpired:
            return _result(False, 0, None, None, None, "The Java solution timed out.", "Check for an infinite loop or unnecessary repeated work.", [])
        if run_result.returncode == 0 and "ALL_TESTS_PASSED" in run_result.stdout:
            return _result(True, 100, None, None, None, "All Java test cases passed.", "Good work. Next, explain the time and space complexity of the solution.", _passed_results(tests))
        failed = _parse_test_failure(run_result.stdout)
        if failed:
            failed['line'] = _first_function_body_line(code, function_name)
        message = _clean_error(run_result.stderr) or (failed.get("detail") if failed else "At least one Java test case failed.")
        suggestion = "Compare the failing input with the expected output and trace the method step by step."
        return _result(False, 0, failed.get('line') if failed else None, failed.get("number") if failed else None, failed.get("expected") if failed else None, message, suggestion, [failed] if failed else [])


def _evaluate_sql(code: str) -> dict:
    if re.search(r"\b(attach|detach|pragma|vacuum|load_extension|readfile|writefile)\b", code, re.IGNORECASE):
        return _result(False, 0, _line_of_match(code, re.search(r"\b(attach|detach|pragma|vacuum|load_extension|readfile|writefile)\b", code, re.IGNORECASE)), None, None,
                       "This SQL statement uses an operation outside the practice database.", "Use a SELECT/INSERT/UPDATE/DELETE query against the tables described in the question.", [])

    db = sqlite3.connect(":memory:")
    try:
        cur = db.cursor()
        cur.executescript("""
        CREATE TABLE employees(id INTEGER, name TEXT, department_id INTEGER, salary REAL);
        INSERT INTO employees VALUES (1,'Asha',10,60000),(2,'Ben',10,45000),(3,'Cara',20,80000),(4,'Dev',20,70000),(5,'Esha',30,80000);
        CREATE TABLE customers(id INTEGER, name TEXT);
        INSERT INTO customers VALUES (1,'Asha'),(2,'Ben'),(3,'Cara');
        CREATE TABLE orders(id INTEGER, customer_id INTEGER);
        INSERT INTO orders VALUES (101,1),(102,1),(103,3);
        CREATE TABLE users(id INTEGER, email TEXT);
        INSERT INTO users VALUES (1,'a@example.com'),(2,'a@example.com'),(3,'b@example.com');
        """)
        rows = cur.execute(code).fetchall()
        columns = [d[0] for d in cur.description] if cur.description else []
        lower = code.lower()
        # Deterministic expectations based on the question patterns used by the bank.
        if "salary > 50000" in lower:
            expected = [(1,'Asha',10,60000.0),(3,'Cara',20,80000.0),(4,'Dev',20,70000.0),(5,'Esha',30,80000.0)]
        elif "second highest" in lower:
            expected = [(70000.0,)]
        elif "count(*)" in lower and "group by department_id" in lower:
            expected = [(10,2),(20,2),(30,1)]
        elif "no orders" in lower:
            expected = [(2,'Ben')]
        elif "top 3" in lower and "order by salary desc" in lower:
            expected = [(3,'Cara',20,80000.0),(5,'Esha',30,80000.0),(4,'Dev',20,70000.0)]
        elif "duplicate email" in lower:
            expected = [('a@example.com',2)]
        elif "placed at least one order" in lower:
            expected = [(1,'Asha'),(3,'Cara')]
        elif "count employees" in lower and "department" in lower:
            expected = [(10,2),(20,2),(30,1)]
        else:
            # For UPDATE/other SQL questions, successful execution plus a safe mutation
            # is the automatic check.
            return _result(True, 100, None, None, None, "SQL executed successfully against the practice schema.", "Also verify the query's performance and edge cases.", [])
        if _rows_equal(rows, expected):
            return _result(True, 100, None, None, None, "The SQL query returned the expected result for the supplied dataset.", "Good work. Consider indexes and edge cases for larger tables.", [{"test": 1, "passed": True, "expected": expected}])
        return _result(False, 0, 1, 1, expected, "The SQL query executed, but its result did not match the expected result.", "Check the JOIN, WHERE, GROUP BY, ORDER BY or subquery logic shown in the question.", [{"test": 1, "passed": False, "expected": expected, "actual": rows, "columns": columns}])
    except Exception as exc:
        return _result(False, 0, 1, 1, None, f"SQL error: {exc}", "Read the SQL error and check table names, aliases, joins, conditions and syntax.", [])
    finally:
        db.close()


def _evaluate_pseudocode(code: str) -> dict:
    lowered = code.lower()
    placeholder_count = sum(lowered.count(x) for x in ("todo", "write your code here", "// add", "# add", "pass"))
    if placeholder_count:
        return _result(False, 35, _line_of_placeholder(code), None, None, "The pseudocode still contains placeholder instructions instead of a complete solution.", "Replace every placeholder with the actual algorithm steps, including inputs, state changes, conditions and the final result.", [])
    if len(code.split()) < 12:
        return _result(False, 45, 1, None, None, "The pseudocode is too short to demonstrate the required algorithm.", "Include the main steps, decision points, data structures and termination condition.", [])
    return _result(True, 80, None, None, None, "The pseudocode contains a complete-looking algorithm structure. This mode uses automatic structure checking rather than execution.", "Add edge cases and explain the time/space complexity of the design.", [])


def _evaluate_static(code: str, language: str) -> dict:
    lowered = code.lower()
    if "write your code here" in lowered or re.search(r"\bpass\b", lowered):
        return _result(False, 25, _line_of_placeholder(code), None, None, f"The {language} submission still contains placeholder code.", "Replace the placeholder with the complete implementation requested by the question.", [])
    return _result(True, 70, None, None, None, f"The {language} submission passed the automatic structure check.", "Run it with representative edge cases and review its time and space complexity.", [])


def _run_temp_process(command: list[str], harness: str, user_code: str, tests: list[dict], language: str, function_name: str | None = None) -> dict:
    with tempfile.TemporaryDirectory(prefix="aivantage-code-") as temp_dir:
        ext = ".py" if language == "python" else ".js"
        path = Path(temp_dir) / f"submission{ext}"
        path.write_text(harness, encoding="utf-8")
        env = os.environ.copy()
        env["PYTHONPATH"] = ""
        env["PYTHONNOUSERSITE"] = "1"
        try:
            completed = subprocess.run(command + [str(path)], cwd=temp_dir, capture_output=True, text=True, timeout=3, env=env)
        except subprocess.TimeoutExpired:
            return _result(False, 0, None, None, None, f"The {language} code timed out.", "Check for an infinite loop or an unnecessarily expensive algorithm.", [])
        except Exception as exc:
            return _result(False, 0, None, None, None, f"The evaluator could not run the submission: {exc}", "Check that the runtime for this language is installed.", [])
        if completed.returncode == 0 and "ALL_TESTS_PASSED" in completed.stdout:
            return _result(True, 100, None, None, None, f"All {language} test cases passed.", "Good work. Next, explain the time and space complexity of your solution.", _passed_results(tests))
        if "REQUIRED_FUNCTION:" in completed.stdout:
            return _result(False, 0, 1, None, None, "The required function was not found.", "Use the function name shown in the question exactly.", [])
        failed = _parse_test_failure(completed.stdout)
        line = _extract_user_line(completed.stderr, len(user_code.splitlines()))
        if line is None and failed:
            line = _first_function_body_line(user_code, function_name)
        message = failed.get("detail") if failed else _clean_error(completed.stderr) or "At least one test case failed."
        suggestion = _suggestion_from_error(message)
        return _result(False, 0, line, failed.get("number") if failed else None, failed.get("expected") if failed else None, message, suggestion, [failed] if failed else [])


def _build_python_harness(code: str, function_name: str, tests: list[dict]) -> str:
    return f"""{code}\n\n__tests = {repr(tests)}\ntry:\n    __fn = {function_name}\nexcept NameError:\n    print('REQUIRED_FUNCTION:missing')\n    raise SystemExit(2)\nfor __i, __t in enumerate(__tests, 1):\n    try:\n        __actual = __fn(*__t['input']) if isinstance(__t['input'], list) and __t.get('spread') else __fn(__t['input'])\n        __expected = __t['expected']\n        __equal = __actual == __expected\n        if isinstance(__actual, float) and isinstance(__expected, (float, int)):\n            __equal = abs(__actual - __expected) < 0.02\n        if not __equal:\n            print(f'TEST_FAIL:{{__i}}: expected={{__expected!r}} actual={{__actual!r}}')\n            raise SystemExit(1)\n    except Exception as __exc:\n        print(f'TEST_FAIL:{{__i}}: {{type(__exc).__name__}}: {{__exc}}')\n        raise\nprint('ALL_TESTS_PASSED')\n"""


def _java_runner(function_name: str, tests: list[dict]) -> str:
    lines = ["import java.util.*;", "public class Runner {", "  static boolean eq(double a, double b) { return Math.abs(a-b) < 0.02; }", "  public static void main(String[] args) {", "    try {"]
    for i, t in enumerate(tests, 1):
        inp = t.get("input")
        expected = t.get("expected")
        if function_name in {"findMax", "uniqueValues"}:
            arg = "new int[]{" + ",".join(map(str, inp)) + "}"
        elif function_name in {"isPalindrome", "countVowels"}:
            arg = json.dumps(inp)
        elif function_name == "factorial":
            arg = str(inp)
        else:
            arg = json.dumps(inp)
        if function_name == "uniqueValues":
            exp = "new TreeSet<>(Arrays.asList(" + ",".join(map(str, expected)) + "))" if isinstance(expected, list) else "new TreeSet<>()"
            lines += [f"      var actual{i} = Solution.{function_name}({arg});", f"      if (!new TreeSet<>(actual{i}).equals({exp})) {{ System.out.println(\"TEST_FAIL:{i}: expected={expected!r} actual=\" + actual{i}); System.exit(1); }}"]
        elif isinstance(expected, bool):
            lines += [f"      var actual{i} = Solution.{function_name}({arg});", f"      if (actual{i} != {str(expected).lower()}) {{ System.out.println(\"TEST_FAIL:{i}: expected={expected} actual=\" + actual{i}); System.exit(1); }}"]
        elif isinstance(expected, (int, float)):
            lines += [f"      var actual{i} = Solution.{function_name}({arg});", f"      if (!eq(actual{i}, {expected})) {{ System.out.println(\"TEST_FAIL:{i}: expected={expected} actual=\" + actual{i}); System.exit(1); }}"]
        else:
            lines += [f"      var actual{i} = Solution.{function_name}({arg});", f"      if (!Objects.equals(actual{i}, {json.dumps(expected)})) {{ System.out.println(\"TEST_FAIL:{i}: expected={expected!r} actual=\" + actual{i}); System.exit(1); }}"]
    lines += ["      System.out.println(\"ALL_TESTS_PASSED\");", "    } catch (Throwable t) { t.printStackTrace(); System.exit(1); }", "  }", "}"]
    return "\n".join(lines)


def _default_tests(function_name: str) -> list[dict]:
    defaults = {
        "reverseString": [{"input": "abc", "expected": "cba"}],
        "findMax": [{"input": [1, 9, 3], "expected": 9}],
        "isPalindrome": [{"input": "level", "expected": True}],
        "is_prime": [{"input": 29, "expected": True}],
        "factorial": [{"input": 5, "expected": 120}],
    }
    return defaults.get(function_name, [])


def _infer_function_name(code: str) -> str | None:
    match = re.search(r"(?:function|def|static\s+[\w<>\[\], ]+\s+|async\s+function)\s+([A-Za-z_]\w*)", code or "")
    return match.group(1) if match else None


def _line_of_match(code: str, match: re.Match | None) -> int | None:
    return code.count("\n", 0, match.start()) + 1 if match else None


def _line_of_placeholder(code: str) -> int | None:
    for i, line in enumerate(code.splitlines(), 1):
        if re.search(r"write your code here|\bpass\b|TODO|// add|# add", line, re.IGNORECASE):
            return i
    return 1


def _first_function_body_line(code: str, function_name: str | None) -> int | None:
    if not function_name:
        return None
    lines = code.splitlines()
    for index, line in enumerate(lines, 1):
        if re.search(rf'\b{re.escape(function_name)}\s*\(', line):
            for body_index in range(index, min(len(lines), index + 8) + 1):
                body = lines[body_index - 1].strip()
                if body and not body.startswith(('#', '//', '/*', '*')) and not body.endswith(('{', ':')):
                    return body_index
    return None


def _extract_user_line(stderr: str, code_lines: int) -> int | None:
    matches = [int(v) for v in re.findall(r"File .*submission(?:\.py|\.js)[\"']?, line (\d+)", stderr or "")]
    matches += [int(v) for v in re.findall(r"submission(?:\.py|\.js):(\d+)", stderr or "")]
    user = [v for v in matches if v <= code_lines]
    return user[-1] if user else None


def _extract_java_line(stderr: str) -> int | None:
    m = re.search(r"Solution\.java:(\d+):", stderr or "")
    return int(m.group(1)) - 2 if m else None


def _clean_error(text: str) -> str:
    text = (text or "").strip()
    return text.splitlines()[-1][:500] if text else ""


def _suggestion_from_error(message: str) -> str:
    m = (message or "").lower()
    if "syntaxerror" in m or "syntax error" in m:
        return "Fix the syntax on the indicated line, then run the checker again."
    if "typeerror" in m:
        return "Check the type of each value before calling methods or operators on it."
    if "indexerror" in m or "out of range" in m:
        return "Check loop bounds and handle empty or short input arrays."
    if "nameerror" in m or "not defined" in m:
        return "Check the variable/function name and make sure it is defined before use."
    if "test_fail" in m or "assertion" in m:
        return "Compare the failing test's expected and actual values, then trace that input through your algorithm."
    return "Trace the failing input step by step and check the logic around the indicated line."


def _parse_test_failure(stdout: str) -> dict:
    for line in (stdout or "").splitlines():
        if line.startswith("TEST_FAIL:"):
            parts = line.split(":", 2)
            number = int(parts[1]) if len(parts) > 1 and parts[1].isdigit() else None
            detail = parts[2].strip() if len(parts) > 2 else line
            expected = None
            actual = None
            m = re.search(r"expected=(.*?) actual=(.*)$", detail)
            if m:
                expected = _safe_parse_value(m.group(1))
                actual = _safe_parse_value(m.group(2))
            return {"test": number, "number": number, "passed": False, "detail": detail, "expected": expected, "actual": actual}
    return {}


def _safe_parse_value(value: str) -> Any:
    try:
        return ast.literal_eval(value)
    except Exception:
        try:
            return json.loads(value)
        except Exception:
            return value


def _passed_results(tests: list[dict]) -> list[dict]:
    return [{"test": i, "passed": True, "expected": t.get("expected")} for i, t in enumerate(tests, 1)]


def _rows_equal(actual: list[tuple], expected: list[tuple]) -> bool:
    return [(tuple(r) if not isinstance(r, tuple) else r) for r in actual] == expected


def _result(correct: bool, score: int, wrong_line: int | None, failed_test: int | None, expected: Any,
            message: str, suggestion: str, test_results: list[dict]) -> dict:
    actual = None
    if test_results:
        actual = test_results[0].get("actual")
    return {
        "correct": correct,
        "score": score,
        "wrongLine": wrong_line,
        "failedTest": failed_test,
        "expected": expected,
        "actual": actual,
        "message": message,
        "suggestion": suggestion,
        "testResults": test_results,
    }
