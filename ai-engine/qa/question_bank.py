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

ADVANCED_BANK = {
    "DSA": [
        {"text": "How would you design an LFU cache with O(1) average get and put operations, and what invariants must be maintained?", "keywords": ["hash map", "frequency", "doubly linked list", "O(1)", "eviction"]},
        {"text": "Given a large directed graph, how would you find strongly connected components and explain the complexity of your approach?", "keywords": ["SCC", "Tarjan", "Kosaraju", "DFS", "O(V+E)"]},
    ],
    "DBMS": [
        {"text": "How would you design a highly available database for a read-heavy global application, and what consistency trade-offs would you accept?", "keywords": ["replication", "read replica", "sharding", "consistency", "failover"]},
        {"text": "Explain MVCC and how it allows concurrent transactions while reducing read locking.", "keywords": ["MVCC", "snapshot", "version", "transaction", "isolation"]},
    ],
    "Operating Systems": [
        {"text": "How would you diagnose a production system suffering from high context-switching and CPU contention?", "keywords": ["context switch", "profiling", "scheduler", "CPU", "threads"]},
        {"text": "Explain how copy-on-write works after fork and why it can improve process creation performance.", "keywords": ["fork", "copy-on-write", "page", "memory", "shared"]},
    ],
    "OOP": [
        {"text": "Design a plugin architecture that allows new implementations to be added without modifying the core application.", "keywords": ["interface", "dependency inversion", "factory", "plugin", "open closed"]},
        {"text": "How would you refactor a large inheritance hierarchy into a composition-based design while keeping backward compatibility?", "keywords": ["composition", "delegation", "interface", "coupling", "refactor"]},
    ],
    "System Design": [
        {"text": "Design a multi-region interview platform that must survive a regional outage while keeping session data consistent enough for users to resume.", "keywords": ["multi region", "replication", "failover", "consistency", "RPO", "RTO"]},
        {"text": "Design a real-time notification system for millions of users and explain backpressure and delivery guarantees.", "keywords": ["queue", "websocket", "backpressure", "at least once", "scaling"]},
    ],
    "Computer Networks": [
        {"text": "Compare TCP and QUIC for a latency-sensitive application and explain the architectural trade-offs.", "keywords": ["QUIC", "UDP", "TLS", "multiplexing", "latency"]},
        {"text": "How would you troubleshoot intermittent latency in a distributed service when application CPU and memory look normal?", "keywords": ["DNS", "network", "packet loss", "tracing", "latency"]},
    ],
    "Java": [
        {"text": "How would you diagnose long GC pauses in a production Java service and decide which JVM metrics to inspect first?", "keywords": ["GC", "heap", "pause", "GC logs", "profiler"]},
        {"text": "Explain safe publication and the Java Memory Model, including why volatile alone does not make compound operations atomic.", "keywords": ["JMM", "volatile", "happens-before", "atomic", "synchronization"]},
    ],
    "Python": [
        {"text": "How would you design an asyncio service with bounded concurrency so slow downstream calls do not exhaust resources?", "keywords": ["asyncio", "semaphore", "backpressure", "timeout", "concurrency"]},
        {"text": "How would you investigate memory growth in a long-running Python worker process?", "keywords": ["tracemalloc", "heap", "reference", "garbage collection", "profiling"]},
    ],
    "Web Development": [
        {"text": "Design a secure browser-based authentication flow and explain CSRF, XSS, token storage, and refresh-token rotation.", "keywords": ["CSRF", "XSS", "cookie", "same site", "refresh token"]},
        {"text": "How would you diagnose a React application that becomes progressively slower after long user sessions?", "keywords": ["memory leak", "effect cleanup", "profiling", "render", "subscription"]},
    ],
    "SQL": [
        {"text": "A query is fast on 100,000 rows but slow on 100 million. How would you use an execution plan to find the bottleneck?", "keywords": ["execution plan", "index", "cardinality", "scan", "join"]},
        {"text": "Explain table partitioning and when it improves performance versus when it adds operational complexity.", "keywords": ["partition", "pruning", "range", "query", "maintenance"]},
    ],
    "Machine Learning": [
        {"text": "How would you design monitoring for a production ML model when the target label arrives weeks after prediction?", "keywords": ["drift", "data quality", "proxy metric", "delayed label", "monitoring"]},
        {"text": "Explain how you would detect training-serving skew and prevent leakage in a feature pipeline.", "keywords": ["training serving skew", "feature pipeline", "leakage", "validation", "point in time"]},
    ],
    "HR / Behavioral": [
        {"text": "Tell me about a decision where the technically correct option conflicted with a business or team constraint. How did you handle the trade-off?", "keywords": ["trade-off", "communication", "stakeholder", "decision", "impact"]},
        {"text": "Describe a situation where you had to change your approach after strong feedback from a senior teammate.", "keywords": ["feedback", "adapt", "ownership", "learning", "outcome"]},
    ],
}

DEFAULT_QUESTIONS = [
    {"text": "Walk me through your resume and what you are looking for next.", "keywords": ["experience", "goal", "skills"]},
]


def generate_questions(subject: str, difficulty: str, resume_skills: list[str] | None = None) -> list[dict]:
    subject = (subject or "").strip()
    difficulty = (difficulty or "MEDIUM").upper().strip()
    if difficulty == "ADVANCED":
        questions = ADVANCED_BANK.get(subject)
    else:
        questions = BANK.get((subject, difficulty))
    if not questions:
        any_difficulty = [v for (s, _), v in BANK.items() if s == subject]
        questions = any_difficulty[0] if any_difficulty else DEFAULT_QUESTIONS
    return questions

# Round 3 uses a separate advanced set rather than simply reusing Round 2.
ADVANCED_OVERRIDES = {
    "DSA": [
        {"text": "How would you design an O(1)-average LRU cache and explain the failure modes under high contention?", "keywords": ["hash map", "doubly linked list", "O(1)", "eviction", "concurrency"]},
        {"text": "How would you choose between Dijkstra, Bellman-Ford, and Floyd-Warshall for different graph constraints?", "keywords": ["negative weights", "single source", "all pairs", "complexity", "Dijkstra"]},
    ],
    "DBMS": [
        {"text": "How would you design transaction boundaries and indexes for a high-write order system while preserving consistency?", "keywords": ["transaction", "index", "isolation", "write", "consistency"]},
        {"text": "Explain how query planning, composite indexes, and cardinality estimates interact on a large join.", "keywords": ["query plan", "composite index", "cardinality", "join", "optimizer"]},
    ],
    "Operating Systems": [
        {"text": "How would you investigate a production deadlock involving multiple services and shared resources?", "keywords": ["deadlock", "lock", "trace", "wait graph", "timeout"]},
        {"text": "Explain how copy-on-write, page faults, and process creation interact in a modern OS.", "keywords": ["copy-on-write", "page fault", "process", "memory", "fork"]},
    ],
    "OOP": [
        {"text": "Design an extensible payment architecture and explain where dependency inversion and strategy patterns belong.", "keywords": ["interface", "dependency inversion", "strategy", "extensible", "testing"]},
        {"text": "How would you refactor a god object while keeping backward compatibility for existing callers?", "keywords": ["single responsibility", "facade", "interface", "refactor", "compatibility"]},
    ],
    "System Design": [
        {"text": "Design a highly available notification platform with retries, idempotency, rate limiting, and observability.", "keywords": ["queue", "retry", "idempotency", "rate limit", "observability"]},
        {"text": "How would you design a multi-region service where low latency and data consistency have competing requirements?", "keywords": ["multi-region", "replication", "consistency", "latency", "failover"]},
    ],
    "Computer Networks": [
        {"text": "How would you troubleshoot intermittent TLS failures that occur only behind a load balancer?", "keywords": ["TLS", "certificate", "load balancer", "handshake", "logs"]},
        {"text": "Explain how TCP congestion control affects throughput on a high-latency lossy link.", "keywords": ["congestion window", "RTT", "packet loss", "slow start", "throughput"]},
    ],
    "Java": [
        {"text": "How would you diagnose thread contention and latency spikes in a Java service under load?", "keywords": ["thread dump", "contention", "profiler", "executor", "latency"]},
        {"text": "Explain safe publication, the Java Memory Model, and why volatile does not make compound operations atomic.", "keywords": ["JMM", "volatile", "atomic", "happens-before", "synchronization"]},
    ],
    "Python": [
        {"text": "How would you choose between asyncio, threads, and multiprocessing for a mixed I/O and CPU workload?", "keywords": ["asyncio", "threads", "multiprocessing", "GIL", "I/O"]},
        {"text": "How would you profile a memory-heavy Python service and identify object-retention problems?", "keywords": ["profiler", "heap", "tracemalloc", "references", "garbage collection"]},
    ],
    "Web Development": [
        {"text": "Design secure authentication for a browser application and explain CSRF, XSS, token storage, and refresh rotation.", "keywords": ["CSRF", "XSS", "JWT", "refresh", "secure cookie"]},
        {"text": "How would you diagnose a React page that becomes progressively slower after repeated navigation?", "keywords": ["memory leak", "effect cleanup", "profiling", "render", "subscriptions"]},
    ],
    "SQL": [
        {"text": "How would you optimize a query that is fast on small data but slow after the table reaches hundreds of millions of rows?", "keywords": ["execution plan", "index", "cardinality", "partition", "statistics"]},
        {"text": "Explain when a window function is preferable to a correlated subquery and the trade-offs involved.", "keywords": ["window function", "partition", "correlated subquery", "performance", "ranking"]},
    ],
    "Machine Learning": [
        {"text": "How would you design an ML evaluation pipeline that prevents leakage while tuning hyperparameters and selecting a final model?", "keywords": ["cross validation", "leakage", "pipeline", "holdout", "hyperparameter"]},
        {"text": "How would you detect concept drift in production and decide whether to retrain a model?", "keywords": ["concept drift", "monitoring", "distribution", "retraining", "validation"]},
    ],
    "HR / Behavioral": [
        {"text": "Describe a situation where you changed your approach after receiving difficult feedback. What evidence showed the change worked?", "keywords": ["feedback", "ownership", "change", "evidence", "result"]},
        {"text": "Tell me about a high-stakes decision where you had incomplete information and how you managed the risk.", "keywords": ["uncertainty", "risk", "decision", "communication", "outcome"]},
    ],
}

_ORIGINAL_GENERATE_QUESTIONS = generate_questions

def generate_questions(subject: str, difficulty: str, resume_skills: list[str] | None = None) -> list[dict]:
    subject = (subject or "").strip()
    difficulty = (difficulty or "MEDIUM").upper().strip()
    if difficulty == "ADVANCED" and subject in ADVANCED_OVERRIDES:
        questions = ADVANCED_OVERRIDES[subject]
    else:
        questions = BANK.get((subject, difficulty))
        if not questions:
            any_difficulty = [v for (s, _), v in BANK.items() if s == subject]
            questions = any_difficulty[0] if any_difficulty else DEFAULT_QUESTIONS
    return questions
