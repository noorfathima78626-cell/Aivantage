const bank = {
  DSA: [
    ['What is the time complexity of binary search on a sorted array?', ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], 1],
    ['Which data structure follows the LIFO principle?', ['Queue', 'Stack', 'Heap', 'Graph'], 1],
    ['Which traversal of a BST gives values in sorted order?', ['Preorder', 'Postorder', 'Inorder', 'Level order'], 2],
    ['Which structure is best for a breadth-first search?', ['Stack', 'Queue', 'Priority queue', 'Array'], 1],
    ['What is the average lookup time in a well-designed hash table?', ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], 2],
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
  DSA: {
    1: {
      id: 'dsa-code-r1', type: 'code', language: 'python', functionName: 'find_max',
      text: 'Coding Round 1: Write find_max(numbers) to return the largest number in a non-empty list.',
      starterCode: 'def find_max(numbers):\n    # return the largest value\n    pass',
      tests: [{ input: [3, 9, 2, 7], expected: 9 }, { input: [-5, -2, -11], expected: -2 }, { input: [42], expected: 42 }],
    },
    2: {
      id: 'dsa-code-r2', type: 'code', language: 'python', functionName: 'two_sum',
      text: 'Coding Round 2: Write two_sum(data) where data is [numbers, target]. Return the two indices whose values add to target.',
      starterCode: 'def two_sum(data):\n    numbers, target = data\n    # return [index1, index2]\n    pass',
      tests: [{ input: [[2, 7, 11, 15], 9], expected: [0, 1] }, { input: [[3, 2, 4], 6], expected: [1, 2] }],
    },
    3: {
      id: 'dsa-code-r3', type: 'code', language: 'python', functionName: 'is_valid_parentheses',
      text: 'Coding Round 3: Write is_valid_parentheses(text) to return True only when brackets are correctly balanced and nested.',
      starterCode: 'def is_valid_parentheses(text):\n    # brackets: (), [], {}\n    pass',
      tests: [{ input: '()[]{}', expected: true }, { input: '([{}])', expected: true }, { input: '([)]', expected: false }, { input: '(((', expected: false }],
    },
  },
  Python: {
    1: {
      id: 'python-code-r1', type: 'code', language: 'python', functionName: 'count_vowels',
      text: 'Coding Round 1: Write count_vowels(text) to return the number of vowels in a string.',
      starterCode: 'def count_vowels(text):\n    # count a, e, i, o, u\n    pass',
      tests: [{ input: 'Interview', expected: 4 }, { input: 'AIVANTAGE', expected: 5 }, { input: 'xyz', expected: 0 }],
    },
    2: {
      id: 'python-code-r2', type: 'code', language: 'python', functionName: 'first_non_repeating',
      text: 'Coding Round 2: Write first_non_repeating(text) to return the first character that appears once, or None.',
      starterCode: 'def first_non_repeating(text):\n    # return the first unique character\n    pass',
      tests: [{ input: 'swiss', expected: 'w' }, { input: 'aabbcdde', expected: 'c' }, { input: 'aabb', expected: null }],
    },
    3: {
      id: 'python-code-r3', type: 'code', language: 'python', functionName: 'merge_intervals',
      text: 'Coding Round 3: Write merge_intervals(intervals) to merge overlapping [start, end] ranges.',
      starterCode: 'def merge_intervals(intervals):\n    # return merged intervals\n    pass',
      tests: [{ input: [[1, 3], [2, 6], [8, 10], [9, 12]], expected: [[1, 6], [8, 12]] }, { input: [[1, 4], [4, 5]], expected: [[1, 5]] }],
    },
  },
}

export function getAptitudeQuestions(subject = 'General', round = 1) {
  const source = bank[subject] || generic
  const mcqs = source.map(([text, options, answerIndex], index) => ({
    id: `${subject}-${round}-mcq-${index + 1}`,
    type: 'mcq', text, options, answerIndex,
  }))
  const coding = codingBank[subject]?.[Number(round)]
  return coding ? [...mcqs, coding] : mcqs
}
