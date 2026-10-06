const bank = {
  DSA: {
    mcq: [
      ['What is the time complexity of binary search on a sorted array?', ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], 1],
      ['Which data structure follows the LIFO principle?', ['Queue', 'Stack', 'Heap', 'Graph'], 1],
      ['Which traversal of a BST gives values in sorted order?', ['Preorder', 'Postorder', 'Inorder', 'Level order'], 2],
      ['Which structure is best for breadth-first search?', ['Stack', 'Queue', 'Priority queue', 'Array'], 1],
      ['What is average lookup time in a well-designed hash table?', ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], 2],
      ['Which algorithm is commonly used to find the shortest path in an unweighted graph?', ['DFS', 'BFS', 'Heap sort', 'Binary search'], 1],
      ['What is the worst-case time complexity of quicksort?', ['O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'], 3],
      ['Which data structure is commonly used to implement recursion?', ['Queue', 'Stack', 'Hash table', 'Graph'], 1],
      ['What does Big-O notation describe?', ['Exact runtime', 'Growth rate of an algorithm', 'Memory address', 'Compiler version'], 1],
      ['Which sorting algorithm is stable by its standard implementation?', ['Heap sort', 'Selection sort', 'Merge sort', 'Quick sort'], 2],
    ],
    code: [
      ['Write a function to reverse a string.', 'function reverseString(str) {\n  // write your code here\n}', 'javascript'],
      ['Write a function to find the maximum element in an array.', 'function findMax(arr) {\n  // write your code here\n}', 'javascript'],
      ['Write a function to check whether a string is a palindrome.', 'function isPalindrome(str) {\n  // write your code here\n}', 'javascript'],
      ['Write a function to count the frequency of each element in an array.', 'function frequency(arr) {\n  // write your code here\n}', 'javascript'],
      ['Write a function to remove duplicate values from an array.', 'function removeDuplicates(arr) {\n  // write your code here\n}', 'javascript'],
    ],
  },
  DBMS: {
    mcq: [
      ['Which key uniquely identifies each row in a table?', ['Foreign key', 'Primary key', 'Composite key', 'Index'], 1],
      ['Which normal form removes partial dependency?', ['1NF', '2NF', '3NF', 'BCNF'], 1],
      ['Which JOIN returns only matching rows?', ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN'], 2],
      ['What does ACID stand for?', ['Atomicity, Consistency, Isolation, Durability', 'Accuracy, Control, Index, Data', 'Access, Consistency, Integrity, Dependency', 'Atomicity, Cache, Isolation, Data'], 0],
      ['Which command permanently saves a transaction?', ['SAVE', 'COMMIT', 'MERGE', 'GRANT'], 1],
      ['Which property ensures a transaction is all-or-nothing?', ['Consistency', 'Isolation', 'Atomicity', 'Durability'], 2],
      ['What is a foreign key used for?', ['Sorting rows', 'Linking related tables', 'Encrypting data', 'Creating backups'], 1],
      ['Which object can speed up data retrieval?', ['Trigger', 'Index', 'Cursor', 'View only'], 1],
      ['What is normalization mainly used to reduce?', ['Security', 'Redundancy', 'Indexes', 'Transactions'], 1],
      ['Which SQL command removes a table definition?', ['DELETE', 'TRUNCATE', 'DROP', 'CLEAR'], 2],
    ],
    code: [
      ['Write a SQL query to return employees whose salary is greater than 50000.', 'SELECT *\nFROM employees\nWHERE salary > 50000;', 'sql'],
      ['Write a SQL query to find the second highest salary.', 'SELECT MAX(salary) AS second_highest\nFROM employees\nWHERE salary < (SELECT MAX(salary) FROM employees);', 'sql'],
      ['Write a SQL query to count employees in each department.', 'SELECT department_id, COUNT(*) AS employee_count\nFROM employees\nGROUP BY department_id;', 'sql'],
      ['Write a SQL query to return customers who have placed at least one order.', 'SELECT DISTINCT c.id, c.name\nFROM customers c\nJOIN orders o ON o.customer_id = c.id;', 'sql'],
      ['Write a SQL query to find duplicate email addresses.', 'SELECT email, COUNT(*) AS occurrences\nFROM users\nGROUP BY email\nHAVING COUNT(*) > 1;', 'sql'],
    ],
  },
  'Operating Systems': {
    mcq: [
      ['Which scheduling algorithm can cause starvation?', ['FCFS', 'Round Robin', 'Priority scheduling', 'FIFO paging'], 2],
      ['A process waiting for I/O is generally in which state?', ['Running', 'Ready', 'Waiting/Blocked', 'Terminated'], 2],
      ['Which is NOT a Coffman deadlock condition?', ['Mutual exclusion', 'Hold and wait', 'Preemption allowed', 'Circular wait'], 2],
      ['Virtual memory primarily uses which concept?', ['Caching only', 'Disk as extension of memory', 'CPU overclocking', 'Thread pooling'], 1],
      ['Which page replacement algorithm may show Belady’s anomaly?', ['LRU', 'Optimal', 'FIFO', 'Clock'], 2],
      ['Which component selects the next process to run?', ['Compiler', 'Scheduler', 'Linker', 'Loader'], 1],
      ['A semaphore is mainly used for?', ['Compilation', 'Synchronization', 'File compression', 'Networking'], 1],
      ['What does a context switch save?', ['Database rows', 'CPU/process state', 'Source code', 'Network packets'], 1],
      ['Which memory allocation can suffer external fragmentation?', ['Paging', 'Contiguous allocation', 'Pure segmentation only', 'Registers'], 1],
      ['What is thrashing?', ['Fast CPU execution', 'Excessive paging', 'Disk formatting', 'Process termination'], 1],
    ],
    code: [
      ['Write a JavaScript function maxSafeQueue(items, limit) that returns the first limit items, modelling a bounded producer-consumer queue.', 'function maxSafeQueue(items, limit) {\n  // return at most limit items\n}', 'javascript'],
      ['Write a function that simulates FCFS scheduling and returns average waiting time.', 'function fcfsWaitingTime(burstTimes) {\n  // write your code here\n}', 'javascript'],
      ['Write a JavaScript function roundRobinOrder(processes, quantum) that returns process names in one round-robin pass.', 'function roundRobinOrder(processes, quantum) {\n  // return the names after one time slice per process\n}', 'javascript'],
      ['Write a function that calculates page faults for a reference string using FIFO.', 'function fifoPageFaults(pages, capacity) {\n  // write your code here\n}', 'javascript'],
      ['Write a JavaScript function hasDeadlockCycle(edges, start) that returns true when the directed dependency graph contains a cycle reachable from start.', 'function hasDeadlockCycle(edges, start) {\n  // detect a cycle with DFS\n}', 'javascript'],
    ],
  },
  OOP: {
    mcq: [
      ['Which OOP concept hides internal implementation details?', ['Inheritance', 'Encapsulation', 'Polymorphism', 'Association'], 1],
      ['Method overloading is resolved mainly at?', ['Runtime', 'Compile time', 'Database time', 'Network time'], 1],
      ['Which relationship represents an “is-a” relationship?', ['Composition', 'Inheritance', 'Aggregation', 'Dependency'], 1],
      ['A class with an abstract method must be?', ['Final', 'Static', 'Abstract', 'Private'], 2],
      ['Which concept allows the same interface to behave differently?', ['Encapsulation', 'Polymorphism', 'Coupling', 'Cohesion'], 1],
      ['Which principle says a class should have one reason to change?', ['OCP', 'SRP', 'LSP', 'DIP'], 1],
      ['Composition usually represents which relationship?', ['is-a', 'has-a', 'uses-only', 'inherits-from'], 1],
      ['Which access modifier provides the most restrictive direct access?', ['public', 'protected', 'private', 'default'], 2],
      ['What is abstraction mainly about?', ['Showing every implementation detail', 'Exposing essential behavior while hiding details', 'Avoiding classes', 'Using global variables'], 1],
      ['Which principle encourages depending on abstractions rather than concrete classes?', ['DIP', 'SRP', 'DRY', 'YAGNI'], 0],
    ],
    code: [
      ['Create a class Rectangle with methods to calculate area and perimeter.', 'class Rectangle {\n  constructor(width, height) {\n    // initialize fields\n  }\n\n  area() {\n    // return area\n  }\n\n  perimeter() {\n    // return perimeter\n  }\n}', 'javascript'],
      ['Create a class BankAccount with deposit and withdraw methods.', 'class BankAccount {\n  constructor(balance = 0) {\n    // initialize balance\n  }\n\n  deposit(amount) {\n    // write code\n  }\n\n  withdraw(amount) {\n    // write code\n  }\n}', 'javascript'],
      ['Write a class that demonstrates method overriding with Animal and Dog.', 'class Animal {\n  speak() { return "Animal" }\n}\n\nclass Dog extends Animal {\n  // override speak()\n}', 'javascript'],
      ['Implement a simple Stack class with push, pop and peek.', 'class Stack {\n  constructor() { this.items = [] }\n  // implement push, pop and peek\n}', 'javascript'],
      ['Implement a simple interface-like PaymentProcessor using a base class and two implementations.', 'class PaymentProcessor {\n  pay(amount) { throw new Error("Not implemented") }\n}\n\n// add two concrete payment classes', 'javascript'],
    ],
  },
  Java: {
    mcq: [
      ['Which keyword is used to inherit a class in Java?', ['implements', 'extends', 'inherits', 'super'], 1],
      ['Which collection does not allow duplicate elements?', ['List', 'Set', 'ArrayList', 'Vector'], 1],
      ['Which method is the entry point of a Java application?', ['start()', 'run()', 'main()', 'init()'], 2],
      ['Which keyword prevents a method from being overridden?', ['static', 'private', 'final', 'volatile'], 2],
      ['Which exception is checked?', ['NullPointerException', 'IOException', 'ArithmeticException', 'ArrayIndexOutOfBoundsException'], 1],
      ['Which interface is implemented by classes that can be sorted naturally?', ['Runnable', 'Comparable', 'Serializable', 'Cloneable'], 1],
      ['Which collection stores key-value pairs?', ['ArrayList', 'HashSet', 'HashMap', 'Stack'], 2],
      ['What does JVM stand for?', ['Java Variable Machine', 'Java Virtual Machine', 'Java Verified Module', 'Java Visual Manager'], 1],
      ['Which keyword refers to the current object?', ['super', 'this', 'self', 'current'], 1],
      ['Which feature automatically reclaims unreachable objects?', ['JIT', 'Garbage collection', 'Reflection', 'Serialization'], 1],
    ],
    code: [
      ['Write a Java method to find the largest number in an int array.', 'static int findMax(int[] arr) {\n    // write your code here\n}', 'java'],
      ['Write a Java method to check whether a string is a palindrome.', 'static boolean isPalindrome(String s) {\n    // write your code here\n}', 'java'],
      ['Write a Java method to count vowels in a string.', 'static int countVowels(String s) {\n    // write your code here\n}', 'java'],
      ['Write a Java method to remove duplicate integers from an array using a Set.', 'static Set<Integer> uniqueValues(int[] arr) {\n    // write your code here\n}', 'java'],
      ['Write a Java method to calculate factorial using recursion.', 'static long factorial(int n) {\n    // write your code here\n}', 'java'],
    ],
  },
  Python: {
    mcq: [
      ['Which collection is immutable?', ['List', 'Dictionary', 'Set', 'Tuple'], 3],
      ['What does len([1, 2, 3]) return?', ['2', '3', '4', 'Error'], 1],
      ['Which keyword creates a function?', ['func', 'def', 'function', 'lambda'], 1],
      ['Which operator is used for exponentiation?', ['^', '**', '//', '%'], 1],
      ['Which statement handles exceptions?', ['try/except', 'if/else', 'match/case', 'for/in'], 0],
      ['Which data type stores key-value pairs?', ['list', 'tuple', 'dict', 'set'], 2],
      ['What does yield create in a function?', ['A generator', 'A class', 'A package', 'A thread'], 0],
      ['Which symbol starts a Python comment?', ['//', '#', '/*', '--'], 1],
      ['What does list.append(x) do?', ['Removes x', 'Adds x to the end', 'Sorts the list', 'Copies the list'], 1],
      ['Which keyword is used to create an anonymous function?', ['def', 'lambda', 'anon', 'func'], 1],
    ],
    code: [
      ['Write a Python function to reverse a string.', 'def reverse_string(s):\n    # write your code here\n    pass', 'python'],
      ['Write a Python function to find the largest number in a list.', 'def find_max(numbers):\n    # write your code here\n    pass', 'python'],
      ['Write a Python function to count word frequencies in a sentence.', 'def word_frequency(sentence):\n    # write your code here\n    pass', 'python'],
      ['Write a Python function to remove duplicates while preserving order.', 'def unique_values(items):\n    # write your code here\n    pass', 'python'],
      ['Write a Python function to check whether a number is prime.', 'def is_prime(n):\n    # write your code here\n    pass', 'python'],
    ],
  },
  SQL: {
    mcq: [
      ['Which clause filters grouped results?', ['WHERE', 'HAVING', 'ORDER BY', 'LIMIT'], 1],
      ['Which command removes all rows but keeps the table?', ['DROP', 'DELETE DATABASE', 'TRUNCATE', 'REMOVE'], 2],
      ['Which function counts rows?', ['SUM()', 'COUNT()', 'TOTAL()', 'ROWS()'], 1],
      ['Which clause sorts query output?', ['GROUP BY', 'HAVING', 'ORDER BY', 'WHERE'], 2],
      ['Which JOIN keeps all rows from the left table?', ['INNER JOIN', 'LEFT JOIN', 'CROSS JOIN', 'SELF JOIN'], 1],
      ['Which keyword removes duplicate rows from a SELECT result?', ['UNIQUE', 'DISTINCT', 'DIFFERENT', 'ONLY'], 1],
      ['Which aggregate function calculates an average?', ['AVG()', 'MEAN()', 'AVERAGE()', 'MID()'], 0],
      ['Which clause groups rows with the same values?', ['GROUP BY', 'ORDER BY', 'HAVING', 'MATCH'], 0],
      ['Which operator is commonly used for pattern matching?', ['LIKE', 'MATCHES', 'PATTERN', 'REGEXONLY'], 0],
      ['Which command adds a new row?', ['ALTER', 'INSERT', 'UPDATE', 'CREATE'], 1],
    ],
    code: [
      ['Write a SQL query to find the second highest salary.', 'SELECT MAX(salary)\nFROM employees\nWHERE salary < (SELECT MAX(salary) FROM employees);', 'sql'],
      ['Write a SQL query to count employees in each department.', 'SELECT department_id, COUNT(*)\nFROM employees\nGROUP BY department_id;', 'sql'],
      ['Write a SQL query to find customers with no orders.', 'SELECT c.*\nFROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id\nWHERE o.id IS NULL;', 'sql'],
      ['Write a SQL query to increase every employee salary by 10 percent.', 'UPDATE employees\nSET salary = salary * 1.10;', 'sql'],
      ['Write a SQL query to return the top 3 highest salaries.', 'SELECT *\nFROM employees\nORDER BY salary DESC\nLIMIT 3;', 'sql'],
    ],
  },
  'Computer Networks': {
    mcq: [
      ['Which protocol maps IP addresses to MAC addresses?', ['DNS', 'ARP', 'HTTP', 'FTP'], 1],
      ['TCP is primarily?', ['Connection-oriented', 'Connectionless', 'Broadcast-only', 'Hardware-only'], 0],
      ['Which layer handles routing?', ['Transport', 'Network', 'Session', 'Presentation'], 1],
      ['HTTPS commonly uses which security protocol?', ['TLS', 'ARP', 'ICMP', 'SMTP'], 0],
      ['Which device operates mainly at Layer 2?', ['Router', 'Switch', 'Gateway', 'Modem'], 1],
      ['Which protocol translates domain names to IP addresses?', ['DNS', 'DHCP', 'ARP', 'FTP'], 0],
      ['Which protocol automatically assigns IP configuration?', ['HTTP', 'DHCP', 'SSH', 'SMTP'], 1],
      ['Which port is commonly used by HTTPS?', ['21', '53', '443', '8080'], 2],
      ['Which protocol is used to send email between mail servers?', ['SMTP', 'POP3', 'DNS', 'ARP'], 0],
      ['What does IP stand for?', ['Internet Protocol', 'Internal Process', 'Internet Port', 'Input Protocol'], 0],
    ],
    code: [
      ['Write a JavaScript function normalizePort(port) that returns the numeric port when it is between 1 and 65535, otherwise -1.', 'function normalizePort(port) {\n  // validate and return the port\n}', 'javascript'],
      ['Write a function that validates an IPv4 address.', 'function isValidIPv4(address) {\n  // write your code here\n}', 'javascript'],
      ['Write a JavaScript function dnsLookup(cache, hostname, fallback) that returns the cached address when present, otherwise the fallback.', 'function dnsLookup(cache, hostname, fallback) {\n  // check cache first\n}', 'javascript'],
      ['Write a function that converts an IPv4 address to an array of four octets.', 'function toOctets(ip) {\n  // write your code here\n}', 'javascript'],
      ['Write a JavaScript function retryCount(results) that returns the number of attempts through the first successful result, with all attempts counted when none succeeds.', 'function retryCount(results) {\n  // stop counting after the first true value\n}', 'javascript'],
    ],
  },
  'Web Development': {
    mcq: [
      ['What is the purpose of HTML?', ['Structure', 'Styling', 'Database storage', 'Server deployment'], 0],
      ['What is CSS mainly used for?', ['Styling', 'Routing', 'Database queries', 'Compilation'], 0],
      ['Which HTTP method is normally used to create a resource?', ['GET', 'POST', 'DELETE', 'HEAD'], 1],
      ['What does CORS control?', ['Cross-origin browser requests', 'Database indexes', 'CPU usage', 'Image compression'], 0],
      ['Which technology is used to add behavior in a browser?', ['CSS', 'HTML', 'JavaScript', 'SQL'], 2],
      ['Which status code means Not Found?', ['200', '301', '404', '500'], 2],
      ['Which React feature stores component state?', ['useState', 'useRoute', 'useHTML', 'useCSS'], 0],
      ['What does REST commonly expose?', ['Resources through HTTP', 'Only databases', 'Only CSS', 'Desktop windows'], 0],
      ['Which storage is scoped to the browser and persists after closing it?', ['localStorage', 'call stack', 'DOM node', 'console'], 0],
      ['Which HTTP method is commonly used to partially update a resource?', ['PATCH', 'TRACE', 'OPTIONS', 'CONNECT'], 0],
    ],
    code: [
      ['Write a JavaScript function that validates whether an email string contains @ and a dot after it.', 'function isValidEmail(email) {\n  // write your code here\n}', 'javascript'],
      ['Create a React component with a counter and an increment button.', 'function Counter() {\n  // use React state here\n  // return a button that increments the count\n}', 'javascript'],
      ['Write a JavaScript function that fetches JSON from an API and returns the parsed data.', 'async function getData(url) {\n  // write your code here\n}', 'javascript'],
      ['Write a JavaScript function to debounce another function.', 'function debounce(fn, delay) {\n  // write your code here\n}', 'javascript'],
      ['Write a JavaScript function that removes duplicate values from an array.', 'function unique(items) {\n  // write your code here\n}', 'javascript'],
    ],
  },
  'Machine Learning': {
    mcq: [
      ['What is the difference between supervised and unsupervised learning?', ['Labels vs no labels', 'Images vs text', 'CPU vs GPU', 'Online vs offline only'], 0],
      ['What is overfitting?', ['Poor training accuracy', 'Good training performance but poor generalization', 'No model parameters', 'Missing data only'], 1],
      ['Which metric is useful for imbalanced classification?', ['Accuracy only', 'F1 score', 'File size', 'CPU frequency'], 1],
      ['What does PCA primarily do?', ['Increase dimensions', 'Reduce dimensions', 'Delete labels', 'Train a neural network'], 1],
      ['What is a hyperparameter?', ['A value learned directly from each training example', 'A setting chosen before/during training', 'A database key', 'A network packet'], 1],
      ['What does RMSE measure?', ['Average squared error in original units after square root', 'Classification classes', 'Training time only', 'Number of features'], 0],
      ['Which technique can help with class imbalance?', ['Class weights', 'Removing all minority examples', 'Increasing noise', 'Dropping labels'], 0],
      ['What is data leakage?', ['Using information during training that should be unavailable', 'Deleting data', 'Compressing features', 'Normalizing labels'], 0],
      ['Which method is commonly used to split data for validation?', ['train_test_split', 'merge_data', 'sort_model', 'join_train'], 0],
      ['What is a feature?', ['An input variable used by a model', 'Only the final prediction', 'A database server', 'A compiler flag'], 0],
    ],
    code: [
      ['Write Python code using scikit-learn to split X and y into training and test sets.', 'from sklearn.model_selection import train_test_split\n\n# write the split here', 'python'],
      ['Write Python code to calculate MAE for actual and predicted values.', 'from sklearn.metrics import mean_absolute_error\n\n# calculate MAE here', 'python'],
      ['Write Python code to standardize features using StandardScaler.', 'from sklearn.preprocessing import StandardScaler\n\n# create the scaler and transform X here', 'python'],
      ['Write Python code to train a simple LogisticRegression classifier.', 'from sklearn.linear_model import LogisticRegression\n\n# create the model and fit it here', 'python'],
      ['Write Python code to calculate accuracy from actual and predicted class labels.', 'from sklearn.metrics import accuracy_score\n\n# calculate accuracy here', 'python'],
    ],
  },
  'System Design': {
    mcq: [
      ['Which component is commonly used to distribute traffic across multiple servers?', ['Load balancer', 'Compiler', 'Cache only', 'Database trigger'], 0],
      ['What is horizontal scaling?', ['Increasing CPU/RAM of one server', 'Adding more servers or instances', 'Reducing database rows', 'Compressing files'], 1],
      ['Which technology is commonly used for fast temporary data storage?', ['Cache', 'Compiler', 'Firewall rule', 'Source control'], 0],
      ['What does a message queue primarily provide?', ['Asynchronous communication between components', 'CSS styling', 'Password hashing only', 'Image rendering'], 0],
      ['Which database approach is commonly used to improve read scalability?', ['Read replicas', 'Removing indexes', 'Disabling caching', 'Using one giant request'], 0],
      ['What is the main purpose of a CDN?', ['Serve content closer to users', 'Compile Java code', 'Store passwords', 'Replace all databases'], 0],
      ['Which property is important when designing a distributed system?', ['Fault tolerance', 'Single-threaded UI only', 'No monitoring', 'Unlimited memory'], 0],
      ['What does eventual consistency mean?', ['All replicas are guaranteed identical immediately', 'Replicas may become consistent after a delay', 'There is no database', 'Only one user can connect'], 1],
      ['Which technique limits how many requests a client can make?', ['Rate limiting', 'Sorting', 'Garbage collection', 'Normalization'], 0],
      ['Why are database indexes used?', ['To speed up selected queries', 'To replace backups', 'To encrypt every row', 'To remove transactions'], 0],
    ],
    code: [
      ['Write a JavaScript function base62Key(number) that converts a positive integer to a compact base-62 key.', 'function base62Key(number) {\n  // use 0-9, A-Z and a-z\n}', 'javascript'],
      ['Write a JavaScript function allowRequest(timestamps, now) that returns true when fewer than 3 requests occurred in the previous 60 seconds.', 'function allowRequest(timestamps, now) {\n  // count requests in the previous minute\n}', 'javascript'],
      ['Write a JavaScript function cacheAside(cache, key, fallback) that returns cache[key] when present, otherwise returns fallback.', 'function cacheAside(cache, key, fallback) {\n  // cache-first lookup\n}', 'javascript'],
      ['Write a JavaScript function queueRoundTrip(items, message) that appends a message and returns the next item plus the remaining queue.', 'function queueRoundTrip(items, message) {\n  // enqueue then dequeue\n}', 'javascript'],
      ['Write a JavaScript function backoffDelays(attempts, base) that returns exponential delays base, base*2, base*4 ... for the requested number of attempts.', 'function backoffDelays(attempts, base) {\n  // build exponential delays\n}', 'javascript'],
    ],
  },
  'HR / Behavioral': {
    mcq: [
      ['In the STAR method, what does S stand for?', ['Solution', 'Situation', 'Skill', 'Summary'], 1],
      ['What is the best way to answer a behavioral question?', ['Give a vague answer', 'Use a specific example and explain your actions and result', 'Only describe the team', 'Avoid the result'], 1],
      ['When discussing a weakness, what is useful to include?', ['A made-up weakness', 'A real weakness plus steps you are taking to improve', 'Only the weakness', 'A complaint about a manager'], 1],
      ['If you disagree with a teammate, what should you usually do first?', ['Ignore them', 'Understand their reasoning and discuss the trade-off', 'Escalate immediately', 'Stop the project'], 1],
      ['What makes an interview answer easier to follow?', ['Random details', 'A clear beginning, middle and conclusion', 'Very long sentences', 'Avoiding examples'], 1],
      ['What should you do if you do not know an interview answer?', ['Invent facts', 'Explain what you know and describe how you would find the answer', 'Stay silent', 'Blame the question'], 1],
      ['Which is a strong way to describe teamwork?', ['I did everything', 'I explained your contribution, collaboration and result', 'The team was good', 'We finished somehow'], 1],
      ['What does active listening include?', ['Interrupting', 'Paying attention and responding to what was said', 'Looking away', 'Planning your next sentence only'], 1],
      ['What is a good way to discuss a project failure?', ['Hide it', 'Explain what happened, what you learned and what you changed', 'Blame another person', 'Say nothing went wrong'], 1],
      ['Why are measurable results useful in interview answers?', ['They make answers longer', 'They show the impact of your work', 'They replace examples', 'They avoid responsibility'], 1],
    ],
    code: [
      ['Write a Python function star_completeness(sections) that returns how many of Situation, Task, Action and Result are non-empty.', 'def star_completeness(sections):\n    # return the count of non-empty STAR sections\n    pass', 'python'],
      ['Write a Python function count_action_words(text) that counts the words "led", "built" and "improved" case-insensitively.', 'def count_action_words(text):\n    # return the number of matching action words\n    pass', 'python'],
      ['Write a Python function answer_length_ok(text) that returns True when an answer has between 30 and 120 words inclusive.', 'def answer_length_ok(text):\n    # return True for 30..120 words\n    pass', 'python'],
      ['Write a Python function unique_skills(skills) that removes duplicate skill names while preserving order.', 'def unique_skills(skills):\n    # return unique values in original order\n    pass', 'python'],
      ['Write a Python function result_ratio(achieved, target) that returns achieved / target, or 0 when target is 0.', 'def result_ratio(achieved, target):\n    # avoid division by zero\n    pass', 'python'],
    ],
  },
}

const generic = {
  mcq: [
    ['If 20% of a number is 50, what is the number?', ['200', '250', '300', '150'], 1],
    ['Find the next number: 2, 6, 12, 20, ?', ['28', '30', '32', '36'], 1],
    ['If A is faster than B and B is faster than C, who is fastest?', ['A', 'B', 'C', 'Cannot determine'], 0],
    ['Choose the odd one out.', ['Circle', 'Square', 'Triangle', 'Blue'], 3],
    ['A train travels 120 km in 2 hours. Its speed is?', ['40 km/h', '50 km/h', '60 km/h', '80 km/h'], 2],
    ['What is 15% of 200?', ['15', '20', '30', '35'], 2],
    ['Which number is prime?', ['21', '27', '29', '33'], 2],
    ['If 5 workers finish a job in 10 days, which is a common assumption for worker-days?', ['25', '50', '100', '5'], 1],
    ['What comes next: 1, 4, 9, 16, ?', ['20', '24', '25', '36'], 2],
    ['Which is a logical comparison operator in most programming languages?', ['=', '==', '=>', ':='], 1],
  ],
  code: [
    ['Write a function to calculate the sum of numbers in an array.', 'function sum(arr) {\n  // write your code here\n}', 'javascript'],
    ['Write a function to count how many even numbers are in an array.', 'function countEven(arr) {\n  // write your code here\n}', 'javascript'],
    ['Write a function to find the average of an array of numbers.', 'function average(arr) {\n  // write your code here\n}', 'javascript'],
  ],
}

function shuffle(items) {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const SESSION_PREFIX = 'aivantage_aptitude_session_v3_'

const CODE_TESTS = {
  maxSafeQueue: [{ input: [[1,2,3,4], 2], expected: [1,2], spread: true }],
  roundRobinOrder: [{ input: [["A","B","C"], 1], expected: ["A","B","C"], spread: true }],
  hasDeadlockCycle: [{ input: [{A:['B'],B:['C'],C:['A']}, 'A'], expected: true, spread: true }, { input: [{A:['B'],B:['C'],C:[]}, 'A'], expected: false, spread: true }],
  normalizePort: [{ input: 443, expected: 443 }, { input: 70000, expected: -1 }],
  dnsLookup: [{ input: [{example:'1.2.3.4'}, 'example', '0.0.0.0'], expected: '1.2.3.4', spread: true }, { input: [{}, 'example', '0.0.0.0'], expected: '0.0.0.0', spread: true }],
  retryCount: [{ input: [false,false,true,false], expected: 3 }, { input: [false,false,false], expected: 3 }],
  base62Key: [{ input: 0, expected: '0' }, { input: 61, expected: 'z' }, { input: 62, expected: '10' }],
  allowRequest: [{ input: [[950,980], 1000], expected: true, spread: true }, { input: [[941,950,980], 1000], expected: false, spread: true }],
  cacheAside: [{ input: [{a:10}, 'a', 99], expected: 10, spread: true }, { input: [{}, 'a', 99], expected: 99, spread: true }],
  queueRoundTrip: [{ input: [[1,2], 3], expected: { next: 1, remaining: [2,3] }, spread: true }],
  backoffDelays: [{ input: [4, 100], expected: [100,200,400,800], spread: true }],
  reverseString: [
    { input: 'hello', expected: 'olleh' },
    { input: 'Aivantage', expected: 'egatnav iA'.replace(' ', '') },
  ],
  findMax: [
    { input: [3, 9, 2, 7], expected: 9 },
    { input: [-5, -2, -11], expected: -2 },
  ],
  isPalindrome: [
    { input: 'level', expected: true },
    { input: 'interview', expected: false },
  ],
  frequency: [
    { input: ['a', 'b', 'a'], expected: { a: 2, b: 1 } },
    { input: [1, 1, 2], expected: { '1': 2, '2': 1 } },
  ],
  removeDuplicates: [
    { input: [1, 2, 1, 3, 2], expected: [1, 2, 3] },
    { input: ['a', 'a', 'b'], expected: ['a', 'b'] },
  ],
  fcfsWaitingTime: [
    { input: [5, 3, 8], expected: 2.67 },
    { input: [2, 2, 2], expected: 1.33 },
  ],
  fifoPageFaults: [
    { input: [[1, 2, 1, 3, 1, 2], 2], expected: 4 },
    { input: [[1, 2, 3, 1, 2, 3], 2], expected: 6 },
  ],
  isValidIPv4: [
    { input: '192.168.1.10', expected: true },
    { input: '300.1.1.1', expected: false },
  ],
  toOctets: [
    { input: '10.20.30.40', expected: [10, 20, 30, 40] },
    { input: '127.0.0.1', expected: [127, 0, 0, 1] },
  ],
  isValidEmail: [
    { input: 'user@example.com', expected: true },
    { input: 'user@example', expected: false },
  ],
  unique: [
    { input: [1, 2, 1, 3], expected: [1, 2, 3] },
    { input: ['x', 'x', 'y'], expected: ['x', 'y'] },
  ],
  reverse_string: [
    { input: 'hello', expected: 'olleh' },
    { input: 'AIV', expected: 'VIA' },
  ],
  word_frequency: [
    { input: 'red blue red', expected: { red: 2, blue: 1 } },
    { input: 'one one two', expected: { one: 2, two: 1 } },
  ],
  unique_values: [
    { input: [1, 2, 1, 3], expected: [1, 2, 3] },
    { input: ['a', 'a', 'b'], expected: ['a', 'b'] },
  ],
  is_prime: [
    { input: 29, expected: true },
    { input: 21, expected: false },
  ],
  countVowels: [
    { input: 'Interview', expected: 4 },
    { input: 'xyz', expected: 0 },
  ],
  factorial: [
    { input: 5, expected: 120 },
    { input: 0, expected: 1 },
  ],
  star_completeness: [
    { input: ['Situation', 'Task', 'Action', 'Result'], expected: 4 },
    { input: ['Situation', '', 'Action', ''], expected: 2 },
  ],
  count_action_words: [
    { input: 'I led a team and built a dashboard and improved speed.', expected: 3 },
    { input: 'I tested the project.', expected: 0 },
  ],
  answer_length_ok: [
    { input: Array(30).fill('word').join(' '), expected: true },
    { input: 'too short', expected: false },
  ],
  result_ratio: [
    { input: [80, 100], expected: 0.8 },
    { input: [5, 0], expected: 0 },
  ],
}

function inferFunctionName(starterCode = '') {
  const match = starterCode.match(/(?:function|def|static\s+\w+\s+|async\s+function)\s+([A-Za-z_]\w*)/) 
  return match ? match[1] : null
}

function codeEntry(subject, raw, index) {
  const [text, starterCode, language] = raw
  const functionName = inferFunctionName(starterCode)
  return {
    id: `${subject}-code-${index + 1}`,
    type: 'code',
    text,
    starterCode,
    language,
    functionName,
    tests: functionName ? (CODE_TESTS[functionName] || []) : [],
  }
}

function readSessionQuestions(sessionKey) {
  if (!sessionKey) return null
  try {
    const saved = JSON.parse(sessionStorage.getItem(`${SESSION_PREFIX}${sessionKey}`) || 'null')
    return Array.isArray(saved) && saved.length ? saved : null
  } catch {
    return null
  }
}

function saveSessionQuestions(sessionKey, questions) {
  if (!sessionKey) return
  try { sessionStorage.setItem(`${SESSION_PREFIX}${sessionKey}`, JSON.stringify(questions)) } catch {}
}

export function getAptitudeQuestions(subject = 'General', round = 1, sessionKey = '') {
  const cached = readSessionQuestions(sessionKey)
  if (cached) return cached

  const source = bank[subject] || generic
  const safeRound = Math.max(1, Math.min(3, Number(round) || 1))
  const mcqPool = source.mcq.map(([text, options, answerIndex], index) => ({
    id: `${subject}-r${safeRound}-mcq-${index + 1}`,
    type: 'mcq', text, options, answerIndex,
  }))

  // The bank has at least 9 MCQs for the supported subjects. Each round uses
  // a different 3-question slice, so Round 1/2/3 cannot reuse the same MCQs.
  const start = (safeRound - 1) * 3
  let selectedMcq = mcqPool.slice(start, start + 3)
  if (selectedMcq.length < 3) selectedMcq = mcqPool.slice(0, 3)

  const codingPool = source.code || []
  const codeRaw = codingPool[(safeRound - 1) % Math.max(1, codingPool.length)]
  const selectedCode = codeRaw ? codeEntry(subject, codeRaw, (safeRound - 1) % codingPool.length) : null
  const questions = shuffle([...selectedMcq, ...(selectedCode ? [selectedCode] : [])])

  saveSessionQuestions(sessionKey, questions)
  return questions
}
