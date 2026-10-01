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
      ['Write pseudocode for a producer-consumer buffer using a semaphore.', 'semaphore empty = N\nsemaphore full = 0\nsemaphore mutex = 1\n\n// write producer and consumer logic here', 'pseudocode'],
      ['Write a function that simulates FCFS scheduling and returns average waiting time.', 'function fcfsWaitingTime(burstTimes) {\n  // write your code here\n}', 'javascript'],
      ['Write pseudocode for a simple round-robin scheduler.', 'queue = processes\nwhile queue is not empty:\n  // run the first process for one time quantum\n  // requeue it if it still has work', 'pseudocode'],
      ['Write a function that calculates page faults for a reference string using FIFO.', 'function fifoPageFaults(pages, capacity) {\n  // write your code here\n}', 'javascript'],
      ['Write pseudocode for checking whether a set of resources can lead to deadlock.', 'function detectDeadlock(available, allocation, need) {\n  // write your code here\n}', 'pseudocode'],
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
      ['Write pseudocode for a simple client-server TCP exchange.', 'server.listen(8080)\nclient.connect(server)\n// send a message and receive a response', 'pseudocode'],
      ['Write a function that validates an IPv4 address.', 'function isValidIPv4(address) {\n  // write your code here\n}', 'javascript'],
      ['Write pseudocode for a simple DNS cache lookup.', 'function resolve(hostname) {\n  // check cache first\n  // query DNS if missing\n  // store and return result\n}', 'pseudocode'],
      ['Write a function that converts an IPv4 address to an array of four octets.', 'function toOctets(ip) {\n  // write your code here\n}', 'javascript'],
      ['Write pseudocode for retrying a failed network request with a maximum of 3 attempts.', 'for attempt = 1 to 3:\n  // send request\n  // stop if successful\n// report failure', 'pseudocode'],
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
      ['Design a simple URL shortener. Write pseudocode for creating a short code and storing the URL mapping.', 'function shortenUrl(longUrl) {\n  // generate a unique short code\n  // store shortCode -> longUrl\n  // return the short URL\n}', 'pseudocode'],
      ['Write pseudocode for a rate limiter that allows at most 100 requests per minute per user.', 'function allowRequest(userId, now) {\n  // track requests for the user\n  // allow only up to 100 in the last minute\n}', 'pseudocode'],
      ['Write pseudocode for a cache-aside lookup that checks cache before the database.', 'function getUser(userId) {\n  // check cache\n  // if missing, read from database\n  // store the result in cache\n  // return the user\n}', 'pseudocode'],
      ['Design a simple message queue producer and consumer in pseudocode.', 'queue = []\n\nfunction publish(message) {\n  // add message to queue\n}\n\nfunction consume() {\n  // remove and process one message\n}', 'pseudocode'],
      ['Write pseudocode for retrying a failed service call with exponential backoff.', 'function callWithRetry(request) {\n  // retry a limited number of times\n  // increase the delay after each failure\n}', 'pseudocode'],
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

const HISTORY_KEY = 'aivantage_aptitude_question_history_v2'

function readHistory() {
  try {
    const value = JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}')
    return value && typeof value === 'object' ? value : {}
  } catch {
    return {}
  }
}

function chooseFresh(items, usedIds, count) {
  let fresh = items.filter((item) => !usedIds.has(item.id))
  if (fresh.length < count) {
    usedIds.clear()
    fresh = [...items]
  }
  return shuffle(fresh).slice(0, count)
}

export function getAptitudeQuestions(subject = 'General', sessionKey = '') {
  const source = bank[subject] || generic

  // Keep one fixed question set for one assessment. This prevents React
  // development-mode re-renders/reloads from consuming another set.
  const sessionStorageKey = sessionKey
    ? `aivantage_aptitude_session_${sessionKey}`
    : ''
  if (sessionStorageKey) {
    try {
      const saved = JSON.parse(sessionStorage.getItem(sessionStorageKey) || 'null')
      if (Array.isArray(saved) && saved.length > 0) return saved
    } catch {}
  }

  const history = readHistory()
  const subjectHistory = history[subject] || { mcq: [], code: [] }
  const usedMcq = new Set(subjectHistory.mcq || [])
  const usedCode = new Set(subjectHistory.code || [])

  const mcqPool = source.mcq.map(([text, options, answerIndex], index) => ({
    id: `${subject}-mcq-${index + 1}`,
    type: 'mcq',
    text,
    options,
    answerIndex,
  }))
  const codePool = source.code.map(([text, starterCode, language], index) => ({
    id: `${subject}-code-${index + 1}`,
    type: 'code',
    text,
    starterCode,
    language,
  }))

  // Each aptitude session gets 4 MCQs + 1 coding question. Used questions are
  // remembered in this browser so Round 1, Round 2 and Round 3 do not repeat
  // until the available bank for that subject is exhausted.
  const selectedMcq = chooseFresh(mcqPool, usedMcq, Math.min(4, mcqPool.length))
  const selectedCode = chooseFresh(codePool, usedCode, Math.min(1, codePool.length))
  const questions = shuffle([...selectedMcq, ...selectedCode])

  const nextHistory = readHistory()
  nextHistory[subject] = {
    mcq: [...usedMcq, ...selectedMcq.map((q) => q.id)],
    code: [...usedCode, ...selectedCode.map((q) => q.id)],
  }
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory))
  } catch {}

  if (sessionStorageKey) {
    try {
      sessionStorage.setItem(sessionStorageKey, JSON.stringify(questions))
    } catch {}
  }

  return questions
}