const bank = {
  DSA: [
    ['What is the time complexity of binary search on a sorted array?', ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], 1],
    ['Which data structure follows the LIFO principle?', ['Queue', 'Stack', 'Heap', 'Graph'], 1],
    ['Which traversal of a BST gives values in sorted order?', ['Preorder', 'Postorder', 'Inorder', 'Level order'], 2],
    ['Which structure is best for a breadth-first search?', ['Stack', 'Queue', 'Priority queue', 'Array'], 1],
    ['What is the average lookup time in a well-designed hash table?', ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], 2],
    ['Which technique solves Two Sum in O(n) time?', ['Sorting', 'Hash Map', 'Binary Search', 'Brute force'], 1],
    ["Which algorithm finds the maximum subarray sum in O(n) time?", ["Kadane's Algorithm", "Dijkstra's Algorithm", "Kruskal's Algorithm", 'Floyd-Warshall'], 0],
    ['Which data structure efficiently finds the Kth largest element?', ['Stack', 'Min-Heap', 'Linked List', 'Trie'], 1],
    ['Which pointer technique is used to solve 3Sum after sorting the array?', ['Single pointer', 'Two pointers', 'Random access', 'Recursion only'], 1],
    ['What is the time complexity of building a heap from n elements?', ['O(n log n)', 'O(n)', 'O(log n)', 'O(n²)'], 1],
    ['Which traversal finds the shortest path in an unweighted graph?', ['DFS', 'BFS', 'Inorder', 'Postorder'], 1],
    ['Which data structure supports efficient prefix search, as used in autocomplete?', ['Trie', 'Stack', 'Queue', 'Heap'], 0],
    ['Which technique finds the Longest Substring Without Repeating Characters efficiently?', ['Sliding Window', 'Binary Search', 'Merge Sort', 'Dynamic Programming only'], 0],
    ['Which algorithm detects a cycle in a directed graph, as used in Course Schedule?', ['BFS only', "Topological Sort (Kahn's algorithm)", 'Binary Search', 'Linear Search'], 1],
    ['Which technique solves Trapping Rain Water in O(n) time and O(1) extra space?', ['Two Pointers', 'Brute Force', 'Recursion', 'Sorting'], 0],
  ],
  DBMS: [
    ['Which key uniquely identifies each row in a table?', ['Foreign key', 'Primary key', 'Composite key', 'Index'], 1],
    ['Which normal form removes partial dependency?', ['1NF', '2NF', '3NF', 'BCNF'], 1],
    ['Which JOIN returns only matching rows?', ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN'], 2],
    ['What does ACID stand for in transactions?', ['Atomicity, Consistency, Isolation, Durability', 'Accuracy, Control, Index, Data', 'Access, Consistency, Integrity, Dependency', 'Atomicity, Cache, Isolation, Data'], 0],
    ['Which SQL command permanently saves a transaction?', ['SAVE', 'COMMIT', 'MERGE', 'GRANT'], 1],
  ],
  'Operating Systems': [
    ['Which scheduling algorithm can cause starvation?', ['FCFS', 'Round Robin', 'Priority scheduling', 'FIFO paging'], 2],
    ['A process waiting for I/O is generally in which state?', ['Running', 'Ready', 'Waiting/Blocked', 'Terminated'], 2],
    ['Which is NOT a Coffman deadlock condition?', ['Mutual exclusion', 'Hold and wait', 'Preemption allowed', 'Circular wait'], 2],
    ['Virtual memory primarily uses which concept?', ['Caching only', 'Disk as extension of memory', 'CPU overclocking', 'Thread pooling'], 1],
    ['Which page replacement algorithm may show Belady’s anomaly?', ['LRU', 'Optimal', 'FIFO', 'Clock'], 2],
  ],
  OOP: [
    ['Which OOP concept hides internal implementation details?', ['Inheritance', 'Encapsulation', 'Polymorphism', 'Association'], 1],
    ['Method overloading is resolved mainly at?', ['Runtime', 'Compile time', 'Database time', 'Network time'], 1],
    ['Which relationship represents an “is-a” relationship?', ['Composition', 'Inheritance', 'Aggregation', 'Dependency'], 1],
    ['A class with an abstract method must be?', ['Final', 'Static', 'Abstract', 'Private'], 2],
    ['Which concept allows the same interface to behave differently?', ['Encapsulation', 'Polymorphism', 'Coupling', 'Cohesion'], 1],
  ],
  Java: [
    ['Which keyword is used to inherit a class in Java?', ['implements', 'extends', 'inherits', 'super'], 1],
    ['Which collection does not allow duplicate elements?', ['List', 'Set', 'ArrayList', 'Vector'], 1],
    ['Which method is the entry point of a Java application?', ['start()', 'run()', 'main()', 'init()'], 2],
    ['Which keyword prevents a method from being overridden?', ['static', 'private', 'final', 'volatile'], 2],
    ['Which exception is checked?', ['NullPointerException', 'IOException', 'ArithmeticException', 'ArrayIndexOutOfBoundsException'], 1],
  ],
  Python: [
    ['Which collection is immutable?', ['List', 'Dictionary', 'Set', 'Tuple'], 3],
    ['What does len([1, 2, 3]) return?', ['2', '3', '4', 'Error'], 1],
    ['Which keyword creates a function?', ['func', 'def', 'function', 'lambda'], 1],
    ['Which operator is used for exponentiation?', ['^', '**', '//', '%'], 1],
    ['Which statement handles exceptions?', ['try/except', 'if/else', 'match/case', 'for/in'], 0],
  ],
  SQL: [
    ['Which clause filters grouped results?', ['WHERE', 'HAVING', 'ORDER BY', 'LIMIT'], 1],
    ['Which command removes all rows but keeps the table?', ['DROP', 'DELETE DATABASE', 'TRUNCATE', 'REMOVE'], 2],
    ['Which function counts rows?', ['SUM()', 'COUNT()', 'TOTAL()', 'ROWS()'], 1],
    ['Which clause sorts query output?', ['GROUP BY', 'HAVING', 'ORDER BY', 'WHERE'], 2],
    ['Which JOIN keeps all rows from the left table?', ['INNER JOIN', 'LEFT JOIN', 'CROSS JOIN', 'SELF JOIN'], 1],
  ],
  'Computer Networks': [
    ['Which protocol maps IP addresses to MAC addresses?', ['DNS', 'ARP', 'HTTP', 'FTP'], 1],
    ['TCP is primarily?', ['Connection-oriented', 'Connectionless', 'Broadcast-only', 'Hardware-only'], 0],
    ['Which layer handles routing?', ['Transport', 'Network', 'Session', 'Presentation'], 1],
    ['HTTPS commonly uses which security protocol?', ['TLS', 'ARP', 'ICMP', 'SMTP'], 0],
    ['Which device operates mainly at Layer 2?', ['Router', 'Switch', 'Gateway', 'Modem'], 1],
  ],
}

const generic = [
  ['If 20% of a number is 50, what is the number?', ['200', '250', '300', '150'], 1],
  ['Find the next number: 2, 6, 12, 20, ?', ['28', '30', '32', '36'], 1],
  ['If A is faster than B and B is faster than C, who is fastest?', ['A', 'B', 'C', 'Cannot determine'], 0],
  ['Choose the odd one out.', ['Circle', 'Square', 'Triangle', 'Blue'], 3],
  ['A train travels 120 km in 2 hours. Its speed is?', ['40 km/h', '50 km/h', '60 km/h', '80 km/h'], 2],
]

const codingBank = {
  DSA: [
    ['Write a function that returns the largest number in an array of integers.', 'function findMax(arr) {\n  // your code here\n}'],
    ['Write a function that checks whether a given string is a palindrome.', 'function isPalindrome(str) {\n  // your code here\n}'],
  ],
  Java: [
    ['Write a method that reverses a String without using a built-in reverse function.', 'public String reverse(String s) {\n    // your code here\n}'],
  ],
  Python: [
    ['Write a function that returns True if a number is prime, False otherwise.', 'def is_prime(n):\n    # your code here\n    pass'],
  ],
  SQL: [
    ['Write a query to find the second highest salary from an Employees table with columns (id, name, salary).', '-- your query here\n'],
  ],
}

export function getAptitudeQuestions(subject = 'General') {
  const source = bank[subject] || generic
  const mcqQuestions = source.map(([text, options, answerIndex], index) => ({
    id: `${subject}-mcq-${index + 1}`,
    type: 'mcq',
    text,
    options,
    answerIndex,
  }))

  const codeSource = codingBank[subject] || []
  const codeQuestions = codeSource.map(([text, starterCode], index) => ({
    id: `${subject}-code-${index + 1}`,
    type: 'code',
    text,
    starterCode,
  }))

  return [...mcqQuestions, ...codeQuestions]
}
