import random
"""Deterministic subject-aware interview question bank.
The selected subject and difficulty are preserved end-to-end so the frontend
receives questions that actually match the user's choice.
"""

BANK = {
    ("DSA", "EASY"): [
        {"text": "What is the time complexity of binary search, and why?", "keywords": ["log n", "sorted", "divide", "half"]},
        {"text": "Explain the difference between an array and a linked list.", "keywords": ["contiguous", "memory", "pointer", "insertion", "access"]},
        {"text": "What is a stack and where would you use one?", "keywords": ["LIFO", "push", "pop", "function calls", "undo"]},
    ],
    ("DSA", "MEDIUM"): [
        {"text": "How would you detect a cycle in a linked list?", "keywords": ["fast", "slow", "pointer", "floyd", "cycle"]},
        {"text": "Explain how a hash map achieves average O(1) lookup.", "keywords": ["hash function", "bucket", "collision", "load factor"]},
        {"text": "How would you find the first non-repeating character in a string efficiently?", "keywords": ["hash map", "frequency", "two pass", "O(n)"]},
    ],
    ("DSA", "HARD"): [
        {"text": "Walk through how you would design an LRU cache from scratch.", "keywords": ["hash map", "doubly linked list", "eviction", "O(1)"]},
        {"text": "How would you find the median of two sorted arrays more efficiently than merging them?", "keywords": ["binary search", "partition", "log", "sorted arrays"]},
    ],
    ("DBMS", "EASY"): [
        {"text": "What is the difference between a primary key and a foreign key?", "keywords": ["unique", "reference", "relationship", "constraint"]},
        {"text": "What is normalization in a database?", "keywords": ["redundancy", "anomaly", "normal form", "dependency"]},
    ],
    ("DBMS", "MEDIUM"): [
        {"text": "Explain database normalization and why it matters.", "keywords": ["redundancy", "anomaly", "normal form", "dependency"]},
        {"text": "What is the difference between clustered and non-clustered indexes?", "keywords": ["index", "physical order", "lookup", "leaf"]},
    ],
    ("DBMS", "HARD"): [
        {"text": "Explain transaction isolation levels and a problem each level can prevent.", "keywords": ["ACID", "dirty read", "non-repeatable", "phantom", "serializable"]},
        {"text": "How would you diagnose and reduce a database deadlock?", "keywords": ["lock", "transaction", "order", "timeout", "deadlock"]},
    ],
    ("Operating Systems", "EASY"): [
        {"text": "What is the difference between a process and a thread?", "keywords": ["memory", "process", "thread", "shared", "context"]},
        {"text": "What is a context switch?", "keywords": ["CPU", "state", "process", "scheduler"]},
    ],
    ("Operating Systems", "MEDIUM"): [
        {"text": "Explain deadlock and the four Coffman conditions.", "keywords": ["mutual exclusion", "hold and wait", "no preemption", "circular wait"]},
        {"text": "What is virtual memory and how does paging work?", "keywords": ["page", "RAM", "disk", "page table", "virtual address"]},
    ],
    ("Operating Systems", "HARD"): [
        {"text": "Compare demand paging and page replacement strategies such as LRU and FIFO.", "keywords": ["page fault", "LRU", "FIFO", "replacement", "memory"]},
        {"text": "How would you design a thread-safe producer-consumer system?", "keywords": ["mutex", "semaphore", "buffer", "synchronization"]},
    ],
    ("OOP", "EASY"): [
        {"text": "Explain encapsulation, inheritance, polymorphism, and abstraction with examples.", "keywords": ["encapsulation", "inheritance", "polymorphism", "abstraction"]},
        {"text": "What is the difference between an interface and an abstract class?", "keywords": ["contract", "implementation", "abstract", "multiple inheritance"]},
    ],
    ("OOP", "MEDIUM"): [
        {"text": "Explain method overloading and method overriding.", "keywords": ["compile time", "runtime", "same name", "parameters", "inheritance"]},
        {"text": "What is composition and when would you prefer it over inheritance?", "keywords": ["has-a", "reuse", "coupling", "flexibility"]},
    ],
    ("OOP", "HARD"): [
        {"text": "Design a notification system using appropriate OOP principles and patterns.", "keywords": ["interface", "strategy", "observer", "dependency", "extensible"]},
        {"text": "How would you apply SOLID principles to refactor a tightly coupled class?", "keywords": ["single responsibility", "open closed", "dependency inversion", "interface"]},
    ],
    ("System Design", "EASY"): [
        {"text": "How would you design a URL shortening service at a high level?", "keywords": ["hash", "database", "cache", "unique", "redirect"]},
        {"text": "What is the difference between horizontal and vertical scaling?", "keywords": ["servers", "resources", "scale out", "scale up"]},
    ],
    ("System Design", "MEDIUM"): [
        {"text": "How would you design a scalable chat application?", "keywords": ["websocket", "message queue", "database", "scaling", "presence"]},
        {"text": "How would you design a file upload and storage service?", "keywords": ["object storage", "CDN", "chunk", "metadata", "scalability"]},
    ],
    ("System Design", "HARD"): [
        {"text": "Design a globally distributed rate limiter and explain consistency trade-offs.", "keywords": ["token bucket", "redis", "distributed", "consistency", "latency"]},
        {"text": "How would you design a recommendation feed for millions of users?", "keywords": ["ranking", "cache", "fanout", "database", "queue"]},
    ],
    ("Computer Networks", "EASY"): [
        {"text": "Explain the difference between TCP and UDP.", "keywords": ["connection", "reliable", "packet", "speed", "handshake"]},
        {"text": "What happens when you enter a URL in a browser?", "keywords": ["DNS", "TCP", "HTTP", "server", "response"]},
    ],
    ("Computer Networks", "MEDIUM"): [
        {"text": "Explain the TCP three-way handshake and why it is needed.", "keywords": ["SYN", "ACK", "connection", "sequence"]},
        {"text": "What is the difference between a hub, switch, and router?", "keywords": ["MAC", "IP", "network", "forwarding"]},
    ],
    ("Computer Networks", "HARD"): [
        {"text": "How does congestion control work in TCP?", "keywords": ["slow start", "window", "congestion", "loss", "throughput"]},
        {"text": "How would you troubleshoot intermittent packet loss in a distributed application?", "keywords": ["latency", "trace", "network", "packet", "monitoring"]},
    ],
    ("Java", "EASY"): [
        {"text": "What is the difference between JDK, JRE, and JVM?", "keywords": ["compile", "runtime", "virtual machine"]},
        {"text": "Why are Java strings immutable?", "keywords": ["security", "pool", "thread safe", "immutable"]},
    ],
    ("Java", "MEDIUM"): [
        {"text": "Explain the difference between HashMap and ConcurrentHashMap.", "keywords": ["thread safe", "synchronization", "concurrency", "hash"]},
        {"text": "What is garbage collection and how does Java manage memory?", "keywords": ["heap", "objects", "garbage collector", "references"]},
    ],
    ("Java", "HARD"): [
        {"text": "Explain Java concurrency using threads, executors, and CompletableFuture.", "keywords": ["thread", "executor", "future", "async", "synchronization"]},
        {"text": "How would you diagnose a memory leak in a Java application?", "keywords": ["heap dump", "references", "profiler", "GC"]},
    ],
    ("Python", "EASY"): [
        {"text": "Explain the difference between a list, tuple, set, and dictionary.", "keywords": ["mutable", "immutable", "unique", "key value"]},
        {"text": "What are Python decorators?", "keywords": ["function", "wrapper", "@", "behavior"]},
    ],
    ("Python", "MEDIUM"): [
        {"text": "Explain generators and the yield keyword.", "keywords": ["iterator", "lazy", "yield", "memory"]},
        {"text": "What is the Global Interpreter Lock and how does it affect threads?", "keywords": ["GIL", "thread", "CPU", "concurrency"]},
    ],
    ("Python", "HARD"): [
        {"text": "Compare multithreading, multiprocessing, and asyncio for a Python service.", "keywords": ["GIL", "process", "async", "I/O", "CPU"]},
        {"text": "How would you profile and optimize a slow Python application?", "keywords": ["profiler", "complexity", "memory", "benchmark"]},
    ],
    ("Web Development", "EASY"): [
        {"text": "What is the difference between HTML, CSS, and JavaScript?", "keywords": ["structure", "style", "behavior"]},
        {"text": "What is REST and what do GET and POST mean?", "keywords": ["HTTP", "resource", "GET", "POST", "API"]},
    ],
    ("Web Development", "MEDIUM"): [
        {"text": "Explain how React state and props differ.", "keywords": ["state", "props", "component", "render"]},
        {"text": "What is CORS and why do browsers enforce it?", "keywords": ["origin", "browser", "headers", "security"]},
    ],
    ("Web Development", "HARD"): [
        {"text": "How would you optimize a slow React application?", "keywords": ["memoization", "lazy loading", "render", "profiling"]},
        {"text": "Design authentication for a modern web application.", "keywords": ["token", "session", "JWT", "refresh", "security"]},
    ],
    ("SQL", "EASY"): [
        {"text": "What is the difference between WHERE and HAVING?", "keywords": ["filter", "group", "aggregate"]},
        {"text": "Explain INNER JOIN and LEFT JOIN.", "keywords": ["join", "matching", "rows", "null"]},
    ],
    ("SQL", "MEDIUM"): [
        {"text": "How would you find the second highest salary using SQL?", "keywords": ["subquery", "MAX", "dense rank", "order"]},
        {"text": "What is an index and when can it hurt performance?", "keywords": ["lookup", "write", "storage", "query plan"]},
    ],
    ("SQL", "HARD"): [
        {"text": "Explain window functions and give a practical use case.", "keywords": ["OVER", "PARTITION BY", "rank", "window"]},
        {"text": "How would you optimize a slow query on a large table?", "keywords": ["execution plan", "index", "join", "filter"]},
    ],
    ("Machine Learning", "EASY"): [
        {"text": "What is the difference between supervised and unsupervised learning?", "keywords": ["labels", "classification", "clustering", "training"]},
        {"text": "What is overfitting?", "keywords": ["training", "generalization", "validation", "complex"]},
    ],
    ("Machine Learning", "MEDIUM"): [
        {"text": "Explain precision, recall, and F1 score.", "keywords": ["true positive", "false positive", "false negative", "balance"]},
        {"text": "How would you handle an imbalanced dataset?", "keywords": ["sampling", "class weight", "metrics", "SMOTE"]},
    ],
    ("Machine Learning", "HARD"): [
        {"text": "How would you detect and reduce data leakage in an ML pipeline?", "keywords": ["train test", "future information", "pipeline", "validation"]},
        {"text": "Describe how you would deploy and monitor a production ML model.", "keywords": ["drift", "monitoring", "deployment", "latency", "retraining"]},
    ],
    ("HR / Behavioral", "EASY"): [
        {"text": "Tell me about a project you are proud of and your specific role in it.", "keywords": ["role", "outcome", "challenge", "impact"]},
        {"text": "Describe a time you disagreed with a teammate. How did you resolve it?", "keywords": ["communication", "compromise", "listen", "resolution"]},
    ],
    ("HR / Behavioral", "MEDIUM"): [
        {"text": "Tell me about a failure and what you learned from it.", "keywords": ["ownership", "lesson", "improvement", "reflection"]},
        {"text": "Describe a time you worked under a difficult deadline.", "keywords": ["prioritize", "communication", "deadline", "result"]},
    ],
    ("HR / Behavioral", "HARD"): [
        {"text": "Describe a conflict where you had to influence someone without formal authority.", "keywords": ["influence", "communication", "stakeholder", "outcome"]},
        {"text": "Tell me about a difficult ethical decision you had to make.", "keywords": ["integrity", "decision", "impact", "responsibility"]},
    ],
}

DEFAULT_QUESTIONS = [
    {"text": "Walk me through your resume and what you are looking for next.", "keywords": ["experience", "goal", "skills"]},
]


def generate_questions(subject: str, difficulty: str, resume_skills: list[str] | None = None, round_number: int = 1) -> list[dict]:
    subject = (subject or "").strip()
    difficulty = (difficulty or "MEDIUM").upper().strip()
    questions = BANK.get((subject, difficulty))
    if not questions:
        any_difficulty = [v for (s, _), v in BANK.items() if s == subject]
        questions = any_difficulty[0] if any_difficulty else DEFAULT_QUESTIONS
    pool = list(questions)
    if len(pool) > 1:
        random.Random(f"{subject}|{difficulty}|{round_number}").shuffle(pool)
    return pool
