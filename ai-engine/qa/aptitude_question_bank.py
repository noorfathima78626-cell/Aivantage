"""Hand-curated offline fallback bank for Aptitude mode (MCQ + coding).

Used when no AI provider is configured, or when the AI engine is
unreachable. This bank did not exist before - previously Aptitude mode had
NO offline fallback at all (the plain interview question_bank.py only knows
how to produce free-text Q&A, not MCQ/coding-shaped questions).

All coding questions below were verified against a reference solution
before being added here - see verify_coding_questions.py.

Coding questions are deliberately Python-only. The AI engine's own
generation prompt (question_generator.py) defaults generated code questions
to language="python" with a single-argument function signature
(`def solve(x): ...`), which is the strongest available evidence for what
the actual code evaluator expects - better to match that known-working
shape than guess at multi-language support that may not exist.
"""
import random

APTITUDE_BANK = {
    "DSA": {
        "mcq": [
            {"text": "What is the time complexity of searching in a balanced binary search tree?",
             "options": ["O(1)", "O(log n)", "O(n)", "O(n log n)"], "answerIndex": 1},
            {"text": "Which data structure follows Last-In-First-Out (LIFO) order?",
             "options": ["Queue", "Stack", "Linked List", "Heap"], "answerIndex": 1},
            {"text": "What is the worst-case time complexity of quicksort?",
             "options": ["O(n log n)", "O(n^2)", "O(log n)", "O(n)"], "answerIndex": 1},
            {"text": "Which traversal of a binary search tree visits nodes in sorted order?",
             "options": ["Pre-order", "In-order", "Post-order", "Level-order"], "answerIndex": 1},
            {"text": "Which data structure is best suited for implementing a priority queue?",
             "options": ["Array", "Heap", "Stack", "Singly linked list"], "answerIndex": 1},
            {"text": "What is the space complexity of standard merge sort?",
             "options": ["O(1)", "O(log n)", "O(n)", "O(n^2)"], "answerIndex": 2},
        ],
        "code": [
            {"text": "Write a function that takes a list of integers and returns True if any value appears more than once, otherwise False.",
             "starterCode": "def contains_duplicate(nums):\n    pass",
             "functionName": "contains_duplicate", "language": "python",
             "tests": [{"input": [1, 2, 3, 4], "expected": False},
                       {"input": [1, 2, 3, 1], "expected": True},
                       {"input": [], "expected": False}]},
            {"text": "Write a function that takes a string and returns the length of its longest substring without repeating characters.",
             "starterCode": "def longest_unique_substring(s):\n    pass",
             "functionName": "longest_unique_substring", "language": "python",
             "tests": [{"input": "abcabcbb", "expected": 3},
                       {"input": "bbbbb", "expected": 1},
                       {"input": "", "expected": 0}]},
        ],
    },
    "DBMS": {
        "mcq": [
            {"text": "Which normal form eliminates transitive dependency?",
             "options": ["1NF", "2NF", "3NF", "BCNF"], "answerIndex": 2},
            {"text": "In ACID, what does the 'I' stand for?",
             "options": ["Integrity", "Isolation", "Indexing", "Independence"], "answerIndex": 1},
            {"text": "Which key uniquely identifies a row in a table and cannot be null?",
             "options": ["Foreign key", "Candidate key", "Primary key", "Composite key"], "answerIndex": 2},
            {"text": "Which SQL JOIN returns all rows from the left table regardless of a match?",
             "options": ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL JOIN"], "answerIndex": 1},
            {"text": "Which index type physically reorders the table's data?",
             "options": ["Non-clustered index", "Clustered index", "Bitmap index", "Hash index"], "answerIndex": 1},
            {"text": "A transaction reading uncommitted data from another transaction causes what?",
             "options": ["Phantom read", "Dirty read", "Non-repeatable read", "Deadlock"], "answerIndex": 1},
            {"text": "Which of these is NOT one of the ACID properties?",
             "options": ["Atomicity", "Consistency", "Durability", "Scalability"], "answerIndex": 3},
            {"text": "What is the default isolation level in MySQL's InnoDB engine?",
             "options": ["Read Uncommitted", "Read Committed", "Repeatable Read", "Serializable"], "answerIndex": 2},
        ],
        "code": [],
    },
    "Operating Systems": {
        "mcq": [
            {"text": "Which scheduling algorithm is most associated with causing starvation of low-priority processes?",
             "options": ["Round Robin", "First Come First Served", "Priority Scheduling", "Multilevel Queue"], "answerIndex": 2},
            {"text": "A deadlock requires four conditions to hold. Which of these is NOT one of them?",
             "options": ["Mutual Exclusion", "Hold and Wait", "Preemption", "Circular Wait"], "answerIndex": 2},
            {"text": "Virtual memory is most commonly implemented using which technique?",
             "options": ["Caching", "Paging", "Spooling", "Buffering"], "answerIndex": 1},
            {"text": "Which of these is a non-preemptive scheduling algorithm?",
             "options": ["Round Robin", "First Come First Served", "Shortest Remaining Time First", "Multilevel Feedback Queue"], "answerIndex": 1},
            {"text": "Threads in the same process typically share which of these?",
             "options": ["Program counter", "Register set", "Address space", "Stack"], "answerIndex": 2},
            {"text": "Which page replacement algorithm can suffer from Belady's anomaly?",
             "options": ["LRU", "FIFO", "Optimal", "LFU"], "answerIndex": 1},
            {"text": "Which OS component is primarily responsible for context switching?",
             "options": ["Compiler", "Dispatcher", "Loader", "Linker"], "answerIndex": 1},
            {"text": "A system is in a 'safe state' if:",
             "options": ["No process is currently waiting", "There exists some execution order that avoids deadlock", "All resources are currently free", "CPU utilization is at 100%"], "answerIndex": 1},
        ],
        "code": [],
    },
    "OOP": {
        "mcq": [
            {"text": "Which OOP principle allows a subclass to provide its own implementation of a method defined in its superclass?",
             "options": ["Encapsulation", "Polymorphism", "Abstraction", "Composition"], "answerIndex": 1},
            {"text": "Encapsulation primarily refers to:",
             "options": ["Allowing multiple inheritance", "Bundling data and methods together while restricting direct access to internal state", "Hiding all methods from subclasses", "Compiling code faster"], "answerIndex": 1},
            {"text": "An abstract class differs from an interface mainly in that:",
             "options": ["It cannot have any methods", "It can contain both implemented and unimplemented methods", "It cannot be inherited", "It must be instantiated directly"], "answerIndex": 1},
            {"text": "'Favor composition over inheritance' suggests:",
             "options": ["Always avoiding inheritance entirely", "Building behavior by combining objects rather than deep inheritance hierarchies", "Using only static methods", "Avoiding interfaces entirely"], "answerIndex": 1},
            {"text": "Method overloading is resolved at:",
             "options": ["Runtime", "Compile time", "Link time", "Garbage collection time"], "answerIndex": 1},
            {"text": "The Single Responsibility Principle (from SOLID) states that:",
             "options": ["A class should implement every interface", "A class should have only one reason to change", "A class should have no public methods", "A class should always be abstract"], "answerIndex": 1},
        ],
        "code": [
            {"text": "Write a function that takes a string and returns True if its brackets ((), [], {}) are balanced and correctly nested, otherwise False.",
             "starterCode": "def validate_balanced_parentheses(s):\n    pass",
             "functionName": "validate_balanced_parentheses", "language": "python",
             "tests": [{"input": "({[]})", "expected": True},
                       {"input": "(]", "expected": False},
                       {"input": "", "expected": True},
                       {"input": "((()", "expected": False}]},
            {"text": "Write a function that takes a list and returns a new list with duplicates removed, preserving the order of first occurrence.",
             "starterCode": "def deduplicate_preserve_order(items):\n    pass",
             "functionName": "deduplicate_preserve_order", "language": "python",
             "tests": [{"input": [1, 2, 2, 3, 1, 4], "expected": [1, 2, 3, 4]},
                       {"input": [], "expected": []},
                       {"input": [5, 5, 5], "expected": [5]}]},
        ],
    },
    "System Design": {
        "mcq": [
            {"text": "To reduce read load on a primary database, you would typically add:",
             "options": ["More write nodes", "Read replicas", "A bigger primary server only", "More indexes only"], "answerIndex": 1},
            {"text": "The CAP theorem states a distributed system can fully guarantee at most:",
             "options": ["All 3 of Consistency, Availability, Partition tolerance", "2 of the 3", "Only 1 of the 3", "None of the 3"], "answerIndex": 1},
            {"text": "In the cache-aside pattern:",
             "options": ["The database writes directly to the cache", "The application checks the cache first and loads from the DB on a miss", "The cache updates the database automatically", "The cache is write-through only"], "answerIndex": 1},
            {"text": "Horizontal scaling means:",
             "options": ["Adding more RAM/CPU to one machine", "Adding more machines", "Upgrading the database engine", "Reducing the number of servers"], "answerIndex": 1},
            {"text": "A load balancer using round robin:",
             "options": ["Sends all traffic to the fastest server", "Distributes requests evenly in rotation", "Only load balances on failure", "Caches every response"], "answerIndex": 1},
            {"text": "A common technique to handle sudden traffic spikes without crashing is:",
             "options": ["Disabling logging", "Rate limiting / backpressure", "Removing the load balancer", "Setting all timeouts to zero"], "answerIndex": 1},
            {"text": "In a message queue, 'at least once' delivery means:",
             "options": ["A message is delivered exactly once", "A message might be delivered more than once but is never lost", "A message might be lost but never duplicated", "Delivery is not guaranteed at all"], "answerIndex": 1},
            {"text": "A CDN primarily improves:",
             "options": ["Database write speed", "Latency for static content delivery", "Server-side computation speed", "Password security"], "answerIndex": 1},
        ],
        "code": [],
    },
    "Computer Networks": {
        "mcq": [
            {"text": "Which OSI layer is primarily responsible for routing?",
             "options": ["Data Link", "Network", "Transport", "Session"], "answerIndex": 1},
            {"text": "Which guarantee does TCP provide that UDP does not?",
             "options": ["Lower latency", "Reliable, ordered delivery", "Broadcast support", "Smaller header size"], "answerIndex": 1},
            {"text": "What is the default port for HTTPS?",
             "options": ["80", "443", "8080", "21"], "answerIndex": 1},
            {"text": "DNS primarily translates:",
             "options": ["IP addresses to MAC addresses", "Domain names to IP addresses", "Ports to protocols", "URLs to HTML"], "answerIndex": 1},
            {"text": "Which of these protocols operates at the transport layer?",
             "options": ["HTTP", "TCP", "DNS", "FTP"], "answerIndex": 1},
            {"text": "A subnet mask of 255.255.255.0 corresponds to which network prefix?",
             "options": ["/8", "/16", "/24", "/32"], "answerIndex": 2},
            {"text": "Which statement about UDP is true?",
             "options": ["Connection-oriented with guaranteed delivery", "Connectionless with no delivery guarantee", "Only used for sending email", "Encrypts all traffic by default"], "answerIndex": 1},
            {"text": "ARP is used to resolve:",
             "options": ["A domain name to an IP address", "An IP address to a MAC address", "A MAC address to a port number", "A hostname to a port number"], "answerIndex": 1},
        ],
        "code": [],
    },
    "Java": {
        "mcq": [
            {"text": "Which keyword prevents a class from being subclassed in Java?",
             "options": ["static", "final", "private", "abstract"], "answerIndex": 1},
            {"text": "Java Strings are:",
             "options": ["Mutable", "Immutable", "Primitive types", "Thread-unsafe by design"], "answerIndex": 1},
            {"text": "Which Java collection does NOT allow duplicate elements?",
             "options": ["List", "Set", "Map (values)", "Array"], "answerIndex": 1},
            {"text": "What is the default value of a boolean instance variable in Java?",
             "options": ["true", "false", "null", "0"], "answerIndex": 1},
            {"text": "Which keyword is used to handle an exception in Java?",
             "options": ["throw", "catch", "raise", "except"], "answerIndex": 1},
            {"text": "Before Java 8, an interface could only contain:",
             "options": ["Concrete methods", "Abstract methods", "Constructors", "Instance variables with assigned values"], "answerIndex": 1},
            {"text": "Which statement about Java's garbage collector is true?",
             "options": ["Developers must manually free memory", "It automatically reclaims memory used by unreachable objects", "It only runs once at JVM shutdown", "It deletes all static variables periodically"], "answerIndex": 1},
            {"text": "What does `==` compare when used on two Java String objects?",
             "options": ["String content, always", "Reference (memory address), not content", "Only the first character", "Hash code only"], "answerIndex": 1},
        ],
        "code": [],
    },
    "Python": {
        "mcq": [
            {"text": "Which of these is a mutable type in Python?",
             "options": ["Tuple", "String", "List", "Int"], "answerIndex": 2},
            {"text": "The `yield` keyword is used to create:",
             "options": ["A decorator", "A generator", "A lambda", "A context manager"], "answerIndex": 1},
            {"text": "Python's Global Interpreter Lock (GIL) primarily affects:",
             "options": ["I/O-bound async performance", "CPU-bound multithreading performance", "Memory allocation speed", "Import speed"], "answerIndex": 1},
            {"text": "Compared to equivalent for-loops, list comprehensions in Python are generally:",
             "options": ["Always slower", "More concise and often faster", "Only usable with numbers", "Deprecated in Python 3"], "answerIndex": 1},
            {"text": "`*args` in a function signature collects:",
             "options": ["Extra keyword arguments into a dict", "Extra positional arguments into a tuple", "Only the first argument", "Nothing - it's a syntax error"], "answerIndex": 1},
            {"text": "Which statement correctly describes `is` vs `==` in Python?",
             "options": ["They are always interchangeable", "`is` checks identity, `==` checks equality", "`is` is just a faster version of `==`", "`==` checks identity, `is` checks equality"], "answerIndex": 1},
        ],
        "code": [
            {"text": "Write a function that takes a (possibly nested) list and returns a single flat list of all its elements in order.",
             "starterCode": "def flatten(nested):\n    pass",
             "functionName": "flatten", "language": "python",
             "tests": [{"input": [1, [2, 3, [4]], 5], "expected": [1, 2, 3, 4, 5]},
                       {"input": [[1, 2], [3, [4, 5]]], "expected": [1, 2, 3, 4, 5]},
                       {"input": [], "expected": []}]},
            {"text": "Write a function that takes a string and returns the number of vowels (a, e, i, o, u) in it, case-insensitive.",
             "starterCode": "def count_vowels(s):\n    pass",
             "functionName": "count_vowels", "language": "python",
             "tests": [{"input": "Hello World", "expected": 3},
                       {"input": "xyz", "expected": 0},
                       {"input": "AEIOUaeiou", "expected": 10}]},
        ],
    },
    "Web Development": {
        "mcq": [
            {"text": "Which HTTP method is idempotent (repeating it has the same effect as calling it once)?",
             "options": ["POST", "PUT", "PATCH", "CONNECT"], "answerIndex": 1},
            {"text": "A CORS error in the browser typically occurs because:",
             "options": ["The server is down", "The browser blocks a cross-origin request without the proper headers", "The client has no internet connection", "JavaScript is disabled"], "answerIndex": 1},
            {"text": "In React, `useState` returns:",
             "options": ["Only a value", "A state value and a setter function", "A Promise", "A class instance"], "answerIndex": 1},
            {"text": "Which HTTP status code means 'Not Found'?",
             "options": ["200", "301", "404", "500"], "answerIndex": 2},
            {"text": "Data stored in localStorage persists:",
             "options": ["Only for the current tab's session", "Until explicitly cleared, surviving browser restarts", "For 24 hours only", "Until the page is refreshed"], "answerIndex": 1},
            {"text": "Which statement about JWTs is true?",
             "options": ["The payload is always encrypted", "The payload is base64-encoded, not encrypted, by default", "JWTs cannot be decoded by the client", "JWTs remove the need for HTTPS"], "answerIndex": 1},
            {"text": "In CSS Flexbox, `justify-content` controls alignment along the:",
             "options": ["Cross axis", "Main axis", "Z-axis", "Grid lines only"], "answerIndex": 1},
            {"text": "REST APIs are typically designed to be:",
             "options": ["Stateful, requiring server-side sessions", "Stateless between requests", "Usable only over WebSockets", "Limited to XML payloads"], "answerIndex": 1},
        ],
        "code": [],
    },
    "SQL": {
        "mcq": [
            {"text": "Which clause filters groups after aggregation has been applied?",
             "options": ["WHERE", "HAVING", "GROUP BY", "ORDER BY"], "answerIndex": 1},
            {"text": "An INNER JOIN returns:",
             "options": ["All rows from the left table", "Only matching rows from both tables", "All rows from both tables regardless of match", "Only unmatched rows"], "answerIndex": 1},
            {"text": "Which function returns the number of rows in a result set?",
             "options": ["SUM()", "COUNT()", "AVG()", "LEN()"], "answerIndex": 1},
            {"text": "A composite primary key is:",
             "options": ["Two unrelated keys in different tables", "More than one column together uniquely identifying a row", "A primary key that references another table", "A key with no constraints at all"], "answerIndex": 1},
            {"text": "Which statement correctly compares DELETE and TRUNCATE?",
             "options": ["They are identical in every way", "DELETE can use a WHERE clause and is logged row-by-row; TRUNCATE removes all rows and is typically faster", "TRUNCATE can use a WHERE clause", "DELETE cannot be rolled back"], "answerIndex": 1},
            {"text": "Which SQL keyword removes duplicate rows from a result set?",
             "options": ["UNIQUE", "DISTINCT", "FILTER", "GROUP"], "answerIndex": 1},
            {"text": "A self-join is used when:",
             "options": ["Two different tables need to be joined", "A table needs to be joined to itself", "Joining is not possible", "Only for recursive CTEs"], "answerIndex": 1},
            {"text": "An index on a column generally speeds up:",
             "options": ["Only INSERT statements", "Read/lookup queries, at some cost to write speed", "Only DELETE statements", "Nothing - it is purely cosmetic"], "answerIndex": 1},
        ],
        "code": [],
    },
    "Machine Learning": {
        "mcq": [
            {"text": "Overfitting means:",
             "options": ["The model is too simple to learn patterns", "The model performs well on training data but poorly on unseen data", "The model trains too quickly", "The model has no parameters"], "answerIndex": 1},
            {"text": "Which metric is generally best for a highly imbalanced classification problem?",
             "options": ["Accuracy alone", "F1 score", "Mean squared error", "R-squared"], "answerIndex": 1},
            {"text": "In supervised learning, the training data includes:",
             "options": ["Only inputs, no labels", "Labeled examples (input-output pairs)", "Random noise only", "Only labels, no inputs"], "answerIndex": 1},
            {"text": "L2 regularization primarily helps by:",
             "options": ["Increasing model complexity", "Penalizing large weights to reduce overfitting", "Speeding up data loading", "Removing all features automatically"], "answerIndex": 1},
            {"text": "Cross-validation is primarily used to:",
             "options": ["Increase the training data size", "Get a more reliable estimate of model performance on unseen data", "Permanently replace the test set", "Reduce the number of features"], "answerIndex": 1},
            {"text": "A confusion matrix for binary classification shows:",
             "options": ["Only overall accuracy", "True/false positives and true/false negatives", "The learning rate over time", "Feature correlations"], "answerIndex": 1},
            {"text": "Gradient descent is used to:",
             "options": ["Maximize the training data size", "Minimize a loss function by iteratively updating parameters", "Normalize input features", "Split data into train/test sets"], "answerIndex": 1},
            {"text": "Which of these is an unsupervised learning technique?",
             "options": ["Linear regression", "K-means clustering", "Logistic regression", "Decision tree classification"], "answerIndex": 1},
        ],
        "code": [],
    },
    "HR / Behavioral": {
        "mcq": [
            {"text": "The STAR method helps structure an interview answer around:",
             "options": ["Speed, Timing, Accuracy, Review", "Situation, Task, Action, Result", "Strategy, Talent, Ambition, Risk", "Strengths, Targets, Attitude, Resume"], "answerIndex": 1},
            {"text": "When asked about a weakness, the strongest answers typically:",
             "options": ["Claim to have no weaknesses", "Name a real weakness and describe concrete steps taken to improve it", "Deflect with a joke", "Describe a strength disguised as a weakness"], "answerIndex": 1},
            {"text": "If you disagree with a teammate's technical decision, the best first step is usually to:",
             "options": ["Escalate to a manager immediately", "Discuss your concerns directly and listen to their reasoning", "Quietly redo their work without telling them", "Avoid the topic entirely"], "answerIndex": 1},
            {"text": "When describing a past failure in an interview, it is most effective to emphasize:",
             "options": ["Who else was at fault", "What you learned and changed afterward", "That it wasn't a big deal", "How often it has happened since"], "answerIndex": 1},
            {"text": "A common purpose of behavioral interview questions is to:",
             "options": ["Test your memorization of company trivia", "Predict future behavior based on how you've handled similar situations before", "Check your typing speed", "Confirm your resume dates"], "answerIndex": 1},
            {"text": "When facing a tight deadline with competing priorities, a strong approach to describe is:",
             "options": ["Working on everything simultaneously without a plan", "Explaining how you prioritized tasks and communicated trade-offs", "Ignoring lower-priority tasks without telling anyone", "Asking to extend every deadline"], "answerIndex": 1},
            {"text": "Demonstrating 'ownership' in an interview answer usually means:",
             "options": ["Taking credit for a team's work", "Taking responsibility for outcomes, including mistakes, without blaming others", "Working alone on everything", "Avoiding difficult projects"], "answerIndex": 1},
            {"text": "When asked 'why do you want to work here,' a strong answer connects:",
             "options": ["Only salary and benefits", "Your specific skills and interests to what the company actually does", "That it was the only company that responded", "Nothing in particular"], "answerIndex": 1},
        ],
        "code": [],
    },
}


def generate_aptitude_questions(subject: str, exclude: list[str] | None = None, count: int = 6) -> list[dict]:
    """Offline fallback for Aptitude mode. Returns a shuffled mix of MCQ and
    (where available) coding questions for the given subject, excluding any
    question text already seen. Assigns stable-looking ids for the response
    shape AiEngineClient/SessionService already expect."""
    exclude_set = set(exclude or [])
    pool = APTITUDE_BANK.get(subject, {"mcq": [], "code": []})

    mcq = [q for q in pool["mcq"] if q["text"] not in exclude_set]
    code = [q for q in pool["code"] if q["text"] not in exclude_set]
    random.shuffle(mcq)
    random.shuffle(code)

    num_code = min(len(code), 2 if count >= 4 else 1)
    selected = code[:num_code] + mcq[:max(0, count - num_code)]
    random.shuffle(selected)

    out = []
    for i, q in enumerate(selected):
        item = dict(q)
        item["id"] = f"bank-aptitude-{i + 1}"
        item["type"] = "code" if "functionName" in q else "mcq"
        out.append(item)
    return out
