export interface RecruitmentStage {
  roundNumber: number;
  name: string;
  type: 'Aptitude' | 'Coding' | 'Technical' | 'Managerial' | 'HR' | 'System Design' | 'Communication';
  duration: string;
  elimination: boolean;
  description: string;
  keyTopics: string[];
  tips: string[];
  sampleQuestions: string[];
}

export interface CompanyRecruitmentProfile {
  id: string;
  name: string;
  logo: string;
  color: string;
  ctc: string;
  roles: string[];
  minCgpa: number;
  allowedArrears: number;
  eligibleBranches: string[];
  difficultyLevel: 'Easy' | 'Medium' | 'Medium-Hard' | 'Hard';
  overview: string;
  hiringTimeline: string;
  selectionRatio: string;
  requiredSkills: string[];
  coreCSFocus: string[];
  stages: RecruitmentStage[];
  previousYearQuestions: {
    coding: { title: string; difficulty: 'Easy' | 'Medium' | 'Hard'; description: string; topic: string }[];
    technicalCore: { question: string; subject: string; sampleAnswerHint: string }[];
    hr: { question: string; intent: string; tips: string }[];
  };
  preparationRoadmap: {
    week1: string;
    week2: string;
    week3: string;
    dayBeforeDrive: string;
  };
}

export const COMPANY_PROFILES: Record<string, CompanyRecruitmentProfile> = {
  zoho: {
    id: 'zoho',
    name: 'Zoho Corporation',
    logo: 'ZHO',
    color: '#E42527',
    ctc: '5.00 - 8.50 LPA',
    roles: ['Software Developer', 'Member Technical Staff', 'QA Engineer'],
    minCgpa: 6.5,
    allowedArrears: 0,
    eligibleBranches: ['CSE', 'IT', 'AI & DS', 'ECE', 'EEE', 'Mechatronics'],
    difficultyLevel: 'Medium-Hard',
    overview: 'Zoho focuses heavily on pure programming, problem-solving from scratch without library shortcuts (especially in C/Java/C++), and designing small functional applications in Round 3.',
    hiringTimeline: 'Annual On-Campus Drive in August - September',
    selectionRatio: '~5-8% from registered candidates',
    requiredSkills: ['C', 'Java', 'C++', 'Data Structures', 'OOP Concepts', 'Algorithm Design', 'Logic Building'],
    coreCSFocus: ['Object Oriented Programming', 'Database Design (Normalization)', 'Operating Systems (Threads/Locks)', 'Memory Management'],
    stages: [
      {
        roundNumber: 1,
        name: 'Round 1: General Aptitude & C/Java Logic',
        type: 'Aptitude',
        duration: '90 Minutes',
        elimination: true,
        description: 'Pen & Paper or Online test consisting of 25 Aptitude MCQs (Speed-Maths, Time & Work, P&C) and 25 Technical snippets (Find output, pointer arithmetic, recursion traces, operator precedence in C/Java).',
        keyTopics: ['Pointers in C', 'Recursion Tracing', 'Operator Precedence', 'Time and Distance', 'Bitwise Operators'],
        tips: [
          'Beware of negative marking or tricky pointer syntax in C.',
          'Solve Aptitude quickly to leave at least 45 minutes for C dry-runs.',
          'Pay close attention to pre/post-increments and loop boundary conditions.'
        ],
        sampleQuestions: [
          'What is the output of `int a=5; printf("%d %d %d", a++, ++a, a);` in GCC?',
          'Find output: Pointer to array vs Array of pointers memory offset calculation.',
          'A train 150m long passes a pole in 15 seconds. How long will it take to pass a 300m bridge?'
        ]
      },
      {
        roundNumber: 2,
        name: 'Round 2: Basic Programming (Hands-on)',
        type: 'Coding',
        duration: '90 Minutes (5-7 Problems)',
        elimination: true,
        description: 'Solving foundational algorithmic problems. Evaluators test clean logic, handling of all edge cases, and zero use of built-in helpers (e.g., reversing strings without built-in libraries).',
        keyTopics: ['2D Matrix Spiral / Rotations', 'Pattern Printing', 'String Manipulation without built-ins', 'Array Rearrangement', 'Mathematical Numbers (Automorphic, Armstrong)'],
        tips: [
          'Do NOT use built-in sort or string reverse methods; write your own helper functions.',
          'Keep your code clean with proper variable names and indentation.',
          'Test with empty strings, negative inputs, and single element arrays before calling the invigilator.'
        ],
        sampleQuestions: [
          'Print string characters based on frequency: e.g. "a1b10" -> "a" followed by "b" ten times.',
          'Print a snake-like pattern or Spiral Matrix of order N*N.',
          'Find whether the second string is a substring of the first string without using `indexOf` or `strstr`.'
        ]
      },
      {
        roundNumber: 3,
        name: 'Round 3: Advanced Programming / App Development',
        type: 'System Design',
        duration: '2.5 to 3 Hours (1 Complex Problem)',
        elimination: true,
        description: 'Design and implement a fully functional console application with menus, data storage (classes/objects/collections), validations, and business logic.',
        keyTopics: ['Console UI Loop', 'Object Oriented Modular Design', 'State Management (In-Memory)', 'Validation & Cancellation Flow'],
        tips: [
          'Start by creating modular classes (e.g., Booking, Train, User, SeatManager).',
          'Ensure the console menu has clear numeric choices (1. Book, 2. Cancel, 3. View Status, 4. Exit).',
          'Demonstrate edge-case handling (waiting list allocation, invalid dates, insufficient balance).'
        ],
        sampleQuestions: [
          'Railway Ticket Reservation System (with Confirmed, RAC, Waiting List, and Cancellation logic).',
          'Taxi Booking Application (nearest free cab allocation, surge pricing, travel history).',
          'Call Taxi / Dungeon Game / Snake & Ladder console game with multi-player support.'
        ]
      },
      {
        roundNumber: 4,
        name: 'Round 4: Technical Interview',
        type: 'Technical',
        duration: '45 - 60 Minutes',
        elimination: true,
        description: 'Face-to-face deep dive into your Round 3 code, Resume projects, Data Structures, OOPs concepts, and live whiteboard problem solving.',
        keyTopics: ['OOP 4 Pillars & Real-life examples', 'Stack / Queue / Linked List implementations', 'Database Schema Design', 'Resume Project Architecture'],
        tips: [
          'Be ready to explain every line of code you wrote in Round 3.',
          'If you mention React/Node/Python on your resume, be prepared for in-depth foundational questions.',
          'Communicate your thought process aloud before writing code.'
        ],
        sampleQuestions: [
          'How would you optimize your Round 3 app if there were 1,000,000 concurrent booking requests?',
          'Difference between abstraction and encapsulation with real-world automobile example.',
          'Design DB tables for an E-commerce system with 3NF normalization.'
        ]
      },
      {
        roundNumber: 5,
        name: 'Round 5: HR / Culture Fit Interview',
        type: 'HR',
        duration: '20 - 30 Minutes',
        elimination: false,
        description: 'Assesses career aspirations, attitude, cultural alignment with Zoho’s unique work ethics, and long-term commitment.',
        keyTopics: ['Why Zoho?', 'Handling failure and pressure', 'Willingness to learn new frameworks', 'Long term goals'],
        tips: [
          'Show genuine interest in product development and learning autonomy.',
          'Highlight self-driven coding projects or hackathon experiences.'
        ],
        sampleQuestions: [
          'Why do you want to join Zoho over service companies?',
          'Tell me about a difficult bug you spent days debugging and how you solved it.',
          'Are you comfortable working in Zoho offices (Chennai, Tenkasi, etc.)?'
        ]
      }
    ],
    previousYearQuestions: {
      coding: [
        { title: 'String Expansion (a2b3 -> aabbb)', difficulty: 'Easy', description: 'Given a string containing letters and numbers, expand it by repeating each letter number times.', topic: 'Strings' },
        { title: 'Railway Ticket Booking Engine', difficulty: 'Hard', description: 'Build console app supporting 63 Berths, 18 RAC, 10 Waiting list, automatic berth allocation by preference (Lower/Middle/Upper) and cancellation re-allocation.', topic: 'OOPs & System Design' },
        { title: 'Spiral Matrix with Dynamic Fill', difficulty: 'Medium', description: 'Fill an N*N matrix spirally clockwise with natural numbers and print it properly aligned.', topic: '2D Arrays' },
        { title: 'Find Substring Position without Library', difficulty: 'Easy', description: 'Implement your own version of strstr(s1, s2) returning 0-based index or -1.', topic: 'Pointers / Strings' }
      ],
      technicalCore: [
        { question: 'Why does Java not support multiple inheritance with classes but supports it with interfaces?', subject: 'Java / OOP', sampleAnswerHint: 'To prevent the Diamond Problem and ambiguous method resolutions.' },
        { question: 'Explain how garbage collection works in Java / C++ memory allocation.', subject: 'Memory Management', sampleAnswerHint: 'Discuss heap vs stack, reference counting, and generational garbage collection mark-and-sweep.' },
        { question: 'What is indexing in DBMS and what is the difference between B-Tree and Hash Indexing?', subject: 'DBMS', sampleAnswerHint: 'B-Tree supports range queries O(log n), Hash index supports O(1) exact match queries.' }
      ],
      hr: [
        { question: 'Tell me about yourself highlighting your passion for software building.', intent: 'Check practical experience vs rote memorization', tips: 'Focus on coding platforms, projects built, and what excites you about Zoho.' },
        { question: 'What would you do if assigned a proprietary internal framework with minimal documentation?', intent: 'Assess resilience and adaptability', tips: 'Explain how you explore source code, test inputs, and collaborate with seniors.' }
      ]
    },
    preparationRoadmap: {
      week1: 'Master C/Java fundamentals, pointer arithmetic, recursion traces, and 25+ pattern & string problems without built-in functions.',
      week2: 'Implement 5 complete console applications from scratch: Ticket Booking, Library System, ATM Simulator, Splitwise, Taxi Booking.',
      week3: 'Review Core CS: OOPs in depth, 3NF Normalization, Indexing, and practice whiteboard coding on Linked Lists & Trees.',
      dayBeforeDrive: 'Rest well, revise common C output tracing snippets, and review your top 2 resume projects thoroughly.'
    }
  },

  tcs: {
    id: 'tcs',
    name: 'Tata Consultancy Services (TCS)',
    logo: 'TCS',
    color: '#004B8D',
    ctc: '3.36 - 9.00 LPA (Ninja / Digital / Prime)',
    roles: ['Ninja Software Engineer (3.36L)', 'Digital Software Engineer (7.0L)', 'Prime Specialist (9.0L)'],
    minCgpa: 6.0,
    allowedArrears: 1,
    eligibleBranches: ['All Engineering Branches (CSE, IT, ECE, EEE, MECH, CIVIL, etc.)'],
    difficultyLevel: 'Medium',
    overview: 'TCS conducts TCS NQT (National Qualifier Test) featuring Foundation + Advanced cognitive and programming sections. High scorers in Advanced get shortlisted directly for Digital & Prime interviews.',
    hiringTimeline: 'July - August (NQT Drive)',
    selectionRatio: '~15-20% selection rate in campus pool',
    requiredSkills: ['Quantitative Aptitude', 'Reasoning & Verbal', 'C / C++ / Java / Python', 'Basic DSA', 'SQL'],
    coreCSFocus: ['SQL & Joins', 'Software Engineering Life Cycle (SDLC)', 'Basic Data Structures', 'Cloud Basics'],
    stages: [
      {
        roundNumber: 1,
        name: 'Round 1: TCS NQT (Foundation + Advanced Section)',
        type: 'Aptitude',
        duration: '165 Minutes',
        elimination: true,
        description: 'Foundation Section (75 mins: Numerical, Verbal, Reasoning) + Advanced Section (90 mins: Advanced Quantitative, Advanced Reasoning, and 2 Hands-on Coding questions).',
        keyTopics: ['Number Systems', 'Permutation & Combination', 'Reading Comprehension', 'Coding in Java/Python/C++', 'Array & String Math'],
        tips: [
          'No negative marking, so attempt all aptitude questions.',
          'Coding Question 1 is usually Easy (Loops/Strings), Question 2 is Medium (Arrays/Dynamic/Hash).',
          'Submitting at least 1 full working code + 1 partial gets you into the Digital/Prime interview tier.'
        ],
        sampleQuestions: [
          'Find the number of prime numbers in a given range [L, R] whose sum of digits is also prime.',
          'Given an array of integers representing item prices, find the maximum profit possible with 2 transactions.',
          'Calculate total parking fee based on 2-wheeler and 4-wheeler vehicle counts from given equation.'
        ]
      },
      {
        roundNumber: 2,
        name: 'Round 2: Technical Interview (TR)',
        type: 'Technical',
        duration: '30 - 45 Minutes',
        elimination: true,
        description: 'Interviewer tests fundamentals of chosen programming language, OOPS, SQL queries, and asks for line-by-line explanation of your Final Year / Mini Project.',
        keyTopics: ['SQL Joins & Group By', 'OOPs Concepts', 'SDLC Models (Agile vs Waterfall)', 'Project Workflow'],
        tips: [
          'Know every diagram and API endpoint in your Mini Project.',
          'Write clean SQL queries on paper when asked.',
          'Mention recent technology trends (GenAI, Cloud, DevOps) if interviewing for Digital/Prime.'
        ],
        sampleQuestions: [
          'Write a SQL query to find the 2nd highest salary of an employee.',
          'Explain the difference between Primary Key, Unique Key, and Candidate Key.',
          'What is the role of Polymorphism in software maintainability?'
        ]
      },
      {
        roundNumber: 3,
        name: 'Round 3: Managerial & HR Interview (MR/HR)',
        type: 'HR',
        duration: '15 - 20 Minutes',
        elimination: false,
        description: 'Assesses communication skills, willingness to relocate to any TCS delivery center, night shifts, and commitment to service agreement.',
        keyTopics: ['Relocation flexibility', 'Team collaboration', 'Handling deadlines', 'TCS history & values'],
        tips: [
          'Always respond with flexibility regarding work location and shifts.',
          'Demonstrate clear communication and positive body language.'
        ],
        sampleQuestions: [
          'Are you ready to relocate anywhere in India based on business requirements?',
          'Where do you see yourself in 3 years at TCS?',
          'How do you manage conflict with a project teammate?'
        ]
      }
    ],
    previousYearQuestions: {
      coding: [
        { title: 'Toggle Bits of a Number', difficulty: 'Easy', description: 'Given a positive integer N, invert all the bits of its binary representation and return the decimal equivalent.', topic: 'Bit Manipulation' },
        { title: 'Subarray with Given Sum', difficulty: 'Medium', description: 'Find a contiguous subarray whose sum equals S in an array of non-negative integers.', topic: 'Sliding Window / Two Pointers' },
        { title: 'Word Frequency in Text', difficulty: 'Easy', description: 'Count and display the occurrence of each unique word in a given paragraph.', topic: 'Hash Map' }
      ],
      technicalCore: [
        { question: 'What is the difference between inner join, left join, and full outer join?', subject: 'DBMS / SQL', sampleAnswerHint: 'Illustrate with Venn diagrams: matching records vs all left rows with NULL on missing right side.' },
        { question: 'What is the difference between Process and Thread?', subject: 'Operating Systems', sampleAnswerHint: 'Process has independent memory space; Threads share address space within the same process.' },
        { question: 'Explain ACID properties in Database transactions.', subject: 'DBMS', sampleAnswerHint: 'Atomicity, Consistency, Isolation, Durability.' }
      ],
      hr: [
        { question: 'Why TCS when other IT companies also offer similar profiles?', intent: 'Check company knowledge & loyalty', tips: 'Mention TCS scale, Tata group values, training at ILP Trivandrum, and diverse domain exposure.' }
      ]
    },
    preparationRoadmap: {
      week1: 'Complete 100 TCS NQT Quantitative and Logical Aptitude questions (IndiaBIX / PrepInsta patterns).',
      week2: 'Practice 30 standard coding questions in Java/Python (Array transformations, Bitwise, String parsing).',
      week3: 'Prepare 15 standard SQL queries (Joins, Aggregates, Subqueries) and rehearse your resume project demo.',
      dayBeforeDrive: 'Review TCS NQT format, ensure good sleep, and keep college ID and government ID handy.'
    }
  },

  infosys: {
    id: 'infosys',
    name: 'Infosys',
    logo: 'INFY',
    color: '#007CC3',
    ctc: '3.60 - 9.50 LPA (System Engineer / DSE / Specialist Programmer)',
    roles: ['Systems Engineer (3.6L)', 'Digital Specialist Engineer (6.5L)', 'Specialist Programmer (9.5L)'],
    minCgpa: 6.0,
    allowedArrears: 0,
    eligibleBranches: ['CSE', 'IT', 'AI & DS', 'ECE', 'EEE'],
    difficultyLevel: 'Medium',
    overview: 'Infosys hiring has dedicated tiers. High performance in pseudocode, technical ability, and advanced coding (HackWithInfy / InfyTQ) unlocks Specialist Programmer (SP) roles with 9.5 LPA packages.',
    hiringTimeline: 'August - October',
    selectionRatio: '~12-15% selection rate',
    requiredSkills: ['Reasoning Ability', 'Pseudocode Debugging', 'Python / Java', 'Data Structures', 'Web Basics'],
    coreCSFocus: ['Data Structures (Stacks, Queues, Trees)', 'DBMS & Normalization', 'Computer Networks (OSI Model)'],
    stages: [
      {
        roundNumber: 1,
        name: 'Round 1: Online Assessment (Cognitive + Technical)',
        type: 'Aptitude',
        duration: '100 Minutes (54 Questions)',
        elimination: true,
        description: 'Includes Reasoning Ability (15 Qs, 25 mins), Technical Ability (Mathematical Thinking 10 Qs, 35 mins), Verbal Ability (20 Qs, 20 mins), Pseudocode (5 Qs, 10 mins), Numerical Puzzle (4 Qs, 10 mins).',
        keyTopics: ['Data Interpretation', 'Pseudocode Analysis', 'Syllogisms', 'Verbal Reasoning', 'Number Puzzles'],
        tips: [
          'Sectional cutoff applies! You must clear each section individually.',
          'Pseudocode questions check pointer logic, bitwise ops, and loop invariants.',
          'Puzzles require algebraic reasoning and systematic pattern elimination.'
        ],
        sampleQuestions: [
          'Trace pseudocode with recursive function calls and bitwise XOR operations.',
          'Solve grid mathematical puzzle with missing numbers satisfying row/column sum constraints.',
          'Data Sufficiency question on ages and ratios.'
        ]
      },
      {
        roundNumber: 2,
        name: 'Round 2: Technical + HR Composite Interview',
        type: 'Technical',
        duration: '35 - 50 Minutes',
        elimination: true,
        description: 'Comprehensive evaluation covering your preferred language, DSA basics, web fundamentals, database queries, and situational behavior questions.',
        keyTopics: ['OOPs Concepts', 'Sorting Algorithms Complexity', 'Project Architecture', 'Infosys Mysore Training readiness'],
        tips: [
          'Be crisp with Big-O time and space complexities for QuickSort, MergeSort, Binary Search.',
          'Express excitement for the world-renowned Infosys Mysore training program.'
        ],
        sampleQuestions: [
          'Explain the internal working of HashMap in Java.',
          'What is the difference between TCP and UDP? Give real-world examples.',
          'Write a program to detect if a linked list contains a cycle (Floyd’s algorithm).'
        ]
      }
    ],
    previousYearQuestions: {
      coding: [
        { title: 'Longest Palindromic Substring', difficulty: 'Medium', description: 'Find the longest palindromic substring in a given string S.', topic: 'Dynamic Programming / Expansion' },
        { title: 'Minimum Coins for Target Change', difficulty: 'Medium', description: 'Determine minimum number of coins needed to make given amount.', topic: 'Greedy / DP' }
      ],
      technicalCore: [
        { question: 'Explain the 7 layers of OSI Model and their primary protocols.', subject: 'Computer Networks', sampleAnswerHint: 'Physical, Data Link, Network, Transport, Session, Presentation, Application.' },
        { question: 'What is method overloading vs method overriding?', subject: 'OOP / Java', sampleAnswerHint: 'Overloading is compile-time (same method name, different signature); Overriding is runtime (subclass overrides superclass method).' }
      ],
      hr: [
        { question: 'Why Infosys and what are your expectations from the Mysore Campus training?', intent: 'Assess motivation and learning commitment', tips: 'Mention world-class infrastructure, foundation training in modern tech, and global projects.' }
      ]
    },
    preparationRoadmap: {
      week1: 'Practice Infosys-specific pseudocode and puzzle sections on PrepInsta / FacePrep.',
      week2: 'Solve 20 medium DSA problems (Binary Trees, Recursion, HashMaps).',
      week3: 'Revise Computer Networks OSI layers, DBMS Keys, and Java/Python internals.',
      dayBeforeDrive: 'Review time-management strategy for sectional timed test.'
    }
  },

  accenture: {
    id: 'accenture',
    name: 'Accenture',
    logo: 'ACN',
    color: '#A100FF',
    ctc: '4.50 - 6.50 LPA (ASE / FSE)',
    roles: ['Associate Software Engineer (4.5L)', 'Full Stack Engineer (6.5L)'],
    minCgpa: 6.5,
    allowedArrears: 0,
    eligibleBranches: ['All Engineering Branches'],
    difficultyLevel: 'Medium',
    overview: 'Accenture uses a fast-tracked elimination pipeline: Cognitive + Tech Assessment -> Immediate Coding Test -> Communication Assessment -> Final Technical/HR Interview.',
    hiringTimeline: 'September - November',
    selectionRatio: '~18-22%',
    requiredSkills: ['Cognitive Reasoning', 'Pseudocode', 'MS Office & Cloud Basics', 'C/C++/Java/Python', 'Verbal Fluency'],
    coreCSFocus: ['Network Security', 'Cloud Computing Concepts', 'Object Oriented Programming', 'Common Technology Fundamentals'],
    stages: [
      {
        roundNumber: 1,
        name: 'Stage 1: Cognitive and Technical Assessment',
        type: 'Aptitude',
        duration: '90 Minutes (90 Questions)',
        elimination: true,
        description: '6 Sections: English Ability (17 Qs), Critical Thinking & Problem Solving (18 Qs), Abstract Reasoning (15 Qs), Common Application & MS Office (12 Qs), Pseudocode (18 Qs), Networking & Security/Cloud (10 Qs).',
        keyTopics: ['English Grammar & Vocab', 'Pseudocode Dry-runs', 'Cloud Concepts (IaaS, PaaS, SaaS)', 'Security fundamentals (Firewall, Encryption)'],
        tips: [
          'Immediate result is declared within 5-10 minutes. If you pass, Stage 2 Coding unlocks immediately!',
          'Pay extra attention to MS Office shortcuts and basic Cloud computing definitions.'
        ],
        sampleQuestions: [
          'What is the result of `XOR` operation on identical binary variables?',
          'Which cloud model delivers compute instances and storage on demand (IaaS)?',
          'Find output of nested while loop with bitwise shift operations.'
        ]
      },
      {
        roundNumber: 2,
        name: 'Stage 2: Coding Assessment (Automated)',
        type: 'Coding',
        duration: '45 Minutes (2 Questions)',
        elimination: true,
        description: '2 Algorithmic coding questions. You can code in C, C++, Java, or Python. Test cases test array processing, string formatting, and mathematical logic.',
        keyTopics: ['Array Transformations', 'String Character Replacements', 'Binary String Operations', 'Math Formulas'],
        tips: [
          'At least 1 question fully passed is required to move to Communication round.',
          'Focus on handling zero and negative test cases.'
        ],
        sampleQuestions: [
          'Count the number of carries when adding two positive integers.',
          'Given a binary string with operations A(AND), B(OR), C(XOR), evaluate the output from left to right.',
          'Find the product of the smallest pair in an array whose sum is less than or equal to a target value.'
        ]
      },
      {
        roundNumber: 3,
        name: 'Stage 3: Communication Assessment (AI Voice Evaluator)',
        type: 'Communication',
        duration: '20 Minutes',
        elimination: false,
        description: 'AI-driven voice evaluation testing Reading, Listening & Repeating, Answering Questions, and Story Retelling. Evaluates pronunciation, fluency, and vocabulary.',
        keyTopics: ['Speech Clarity', 'Active Listening', 'Fluent Sentence Construction', 'Pronunciation'],
        tips: [
          'Use a high-quality noise-cancelling headset in a quiet room.',
          'Speak at a steady, natural pace with clear articulation. Do not pause for long intervals.'
        ],
        sampleQuestions: [
          'Listen to a short paragraph and retell the story in your own words within 30 seconds.',
          'Sentence repetition: "The annual conference has been rescheduled to next Tuesday afternoon."'
        ]
      },
      {
        roundNumber: 4,
        name: 'Stage 4: Technical & HR Virtual Interview',
        type: 'Technical',
        duration: '25 - 35 Minutes',
        elimination: true,
        description: 'Evaluation of project experience, real-world scenario problem solving, adaptability to new tech stacks, and team collaboration.',
        keyTopics: ['Project Contributions', 'Agile & Teamwork', 'Handling Client Requirements', 'Continuous Learning'],
        tips: [
          'Structure your project explanations using the STAR method (Situation, Task, Action, Result).',
          'Emphasize your role in team achievements and your troubleshooting methodology.'
        ],
        sampleQuestions: [
          'Walk me through the most technically challenging module in your Mini Project.',
          'If a project deadline is moved up by one week, how do you prioritize tasks?',
          'What new technology or tool have you learned independently outside your syllabus?'
        ]
      }
    ],
    previousYearQuestions: {
      coding: [
        { title: 'Operations on Binary String', difficulty: 'Easy', description: 'Evaluate expression like "1C0C1A1B0" where A=AND, B=OR, C=XOR.', topic: 'Strings & Bitwise' },
        { title: 'Password Checker Validation', difficulty: 'Easy', description: 'Validate if a password string meets length >= 4, at least 1 numeric, 1 capital letter, no spaces or slash, and does not start with digit.', topic: 'String Validation' },
        { title: 'Max Exponent of Two in Range', difficulty: 'Medium', description: 'Find the integer in range [a, b] that has the maximum power of 2 divisor.', topic: 'Math & Loops' }
      ],
      technicalCore: [
        { question: 'What is the difference between SaaS, PaaS, and IaaS?', subject: 'Cloud Computing', sampleAnswerHint: 'IaaS provides raw infrastructure (AWS EC2), PaaS provides runtime environment (Heroku), SaaS provides complete software (Google Workspace).' },
        { question: 'Explain symmetric vs asymmetric encryption with examples.', subject: 'Network Security', sampleAnswerHint: 'Symmetric uses one shared key (AES); Asymmetric uses public-private key pair (RSA).' }
      ],
      hr: [
        { question: 'How do you handle working on a technology stack you have never used before?', intent: 'Assess agility & growth mindset', tips: 'Explain how you break down the documentation, build a Hello World PoC, and leverage official guides.' }
      ]
    },
    preparationRoadmap: {
      week1: 'Review MS Office shortcut keys, Cloud definitions, and practice 50 Accenture Pseudocode questions.',
      week2: 'Solve 20 standard Accenture coding problems (Binary String, Array carry, String manipulation).',
      week3: 'Take mock AI communication voice tests and rehearse your STAR project presentation.',
      dayBeforeDrive: 'Ensure headset and microphone work cleanly with your browser.'
    }
  },

  product: {
    id: 'product',
    name: 'Top Tier Product Companies (Google / Amazon / Microsoft)',
    logo: 'FAANG',
    color: '#10B981',
    ctc: '15.00 - 45.00 LPA',
    roles: ['Software Development Engineer (SDE-1)', 'Software Engineer (L3/L4)'],
    minCgpa: 7.5,
    allowedArrears: 0,
    eligibleBranches: ['CSE', 'IT', 'AI & DS', 'ECE'],
    difficultyLevel: 'Hard',
    overview: 'Product tier hiring demands mastery over Data Structures & Algorithms (LeetCode Medium/Hard), clean object-oriented Low-Level Design (LLD), concurrency, and behavioral leadership principles.',
    hiringTimeline: 'August - December',
    selectionRatio: '~1-3%',
    requiredSkills: ['Advanced DSA (Graphs, DP, Trees, Heaps)', 'System Design / LLD', 'Clean Code', 'Time/Space Optimization'],
    coreCSFocus: ['Advanced DSA', 'Operating Systems (Concurrency, Virtual Memory)', 'Database Internals & Indexing', 'Computer Networks (Sockets, HTTP/3)'],
    stages: [
      {
        roundNumber: 1,
        name: 'Round 1: Online Coding Assessment (OA)',
        type: 'Coding',
        duration: '90 - 120 Minutes (2-3 Problems)',
        elimination: true,
        description: 'Automated platform (HackerRank / Codility). 2-3 algorithmic challenges covering Graphs (Dijkstra/BFS), Dynamic Programming, or Advanced Tree Traversals with strict time & memory limits.',
        keyTopics: ['Dynamic Programming', 'Graph Shortest Paths', 'Binary Search on Answer Space', 'Disjoint Set Union (DSU)'],
        tips: [
          'Aim for O(N log N) or O(N) solutions; O(N^2) brute force will fail hidden test cases.',
          'Always analyze edge cases (empty input, INT_MAX overflow, cycles in graphs).'
        ],
        sampleQuestions: [
          'Given a graph of servers and latency weights, find the minimum latency path with at most K bypasses.',
          'Count the number of non-overlapping subsegments with equal XOR sums.'
        ]
      },
      {
        roundNumber: 2,
        name: 'Round 2: Technical Interview 1 (DSA & Problem Solving)',
        type: 'Technical',
        duration: '60 Minutes',
        elimination: true,
        description: 'Live pair-coding on Google Docs / CoderPad with a Senior SDE. Evaluates approach formulation, communicating trade-offs, and writing production-ready bug-free code.',
        keyTopics: ['Trees & Graphs', 'Heaps & Priority Queues', 'Two Pointers & Sliding Window'],
        tips: [
          'Never jump straight into coding. Talk through 2-3 approaches with their Big-O trade-offs first.',
          'Dry run your solution with a sample input before telling the interviewer you are done.'
        ],
        sampleQuestions: [
          'Implement an LRU Cache with O(1) get and put operations (Doubly Linked List + HashMap).',
          'Serialize and Deserialize a Binary Tree.'
        ]
      },
      {
        roundNumber: 3,
        name: 'Round 3: Technical Interview 2 (Advanced DSA + Low Level Design)',
        type: 'Technical',
        duration: '60 Minutes',
        elimination: true,
        description: 'Focuses on designing object-oriented software architectures (e.g., Parking Lot, Elevator, Rate Limiter) or challenging DP/Graph problems.',
        keyTopics: ['Design Patterns (Factory, Strategy, Observer)', 'SOLID Principles', 'Concurrency & Locks'],
        tips: [
          'Identify the core entities, relationships, and interfaces before coding.',
          'Mention extensibility and how your design handles new feature additions without modifying existing classes (Open/Closed Principle).'
        ],
        sampleQuestions: [
          'Design an In-Memory Key-Value Store with Transaction support (BEGIN, COMMIT, ROLLBACK).',
          'Design an Elevator Management System for a 20-story building.'
        ]
      },
      {
        roundNumber: 4,
        name: 'Round 4: Behavioral & Leadership / Bar Raiser Interview',
        type: 'HR',
        duration: '45 - 60 Minutes',
        elimination: true,
        description: 'Evaluates past decision making, ownership, handling technical disagreements, and alignment with leadership principles (e.g., Amazon 16 LPs, Google Googliness).',
        keyTopics: ['Customer Obsession', 'Ownership', 'Deep Dive', 'Bias for Action', 'Handling Conflict'],
        tips: [
          'Frame every answer in STAR format with quantified impact (e.g. "reduced latency by 35%").',
          'Show humility, lessons learned from failures, and intellectual curiosity.'
        ],
        sampleQuestions: [
          'Tell me about a time you took a calculated risk and failed. What did you learn?',
          'Describe a situation where you had a disagreement with your lead on technical architecture. How did you resolve it?'
        ]
      }
    ],
    previousYearQuestions: {
      coding: [
        { title: 'LRU Cache Implementation', difficulty: 'Medium', description: 'Design and implement a data structure for Least Recently Used (LRU) cache with O(1) complexity for both get and put.', topic: 'Doubly Linked List + HashMap' },
        { title: 'Word Ladder II (Shortest Transformation Sequences)', difficulty: 'Hard', description: 'Given two words and a dictionary, find all shortest transformation sequences from beginWord to endWord.', topic: 'BFS + Backtracking' },
        { title: 'Trapping Rain Water', difficulty: 'Hard', description: 'Given n non-negative integers representing an elevation map where width of each bar is 1, compute how much water it can trap after raining.', topic: 'Two Pointers / Monotonic Stack' }
      ],
      technicalCore: [
        { question: 'How does virtual memory work and what is a page fault?', subject: 'Operating Systems', sampleAnswerHint: 'Explain address translation via MMU, Page Tables, TLB cache, and swapping from disk on page fault.' },
        { question: 'Explain TCP 3-Way Handshake and 4-Way Teardown with state diagrams.', subject: 'Computer Networks', sampleAnswerHint: 'SYN, SYN-ACK, ACK for connect; FIN, ACK, FIN, ACK for disconnect with TIME_WAIT state.' }
      ],
      hr: [
        { question: 'Tell me about a time you had to deliver a project under an impossible deadline with ambiguous requirements.', intent: 'Assess Amazon LP: Deliver Results & Bias for Action', tips: 'Explain how you prioritized MVP features, aligned stakeholders, and executed iterative delivery.' }
      ]
    },
    preparationRoadmap: {
      week1: 'Solve NeetCode 75 / Striver SDE Sheet core Array, String, and Linked List problems.',
      week2: 'Master Tree, Graph (BFS/DFS, Dijkstra, Topological Sort), and Dynamic Programming patterns.',
      week3: 'Practice 4 Low Level Design problems (Parking Lot, LRU Cache, Rate Limiter, TicTacToe) and prepare 5 STAR behavioral stories.',
      dayBeforeDrive: 'Review time complexities of standard algorithms and review your top system design diagrams.'
    }
  }
};

/**
 * Helper to get all company profiles
 */
export const getAllCompanyProfiles = (): CompanyRecruitmentProfile[] => {
  return Object.values(COMPANY_PROFILES);
};

/**
 * Match student stats against company profile
 */
export const analyzeStudentForCompany = (
  companyId: string,
  studentStats: {
    name: string;
    department: string;
    cgpa: number;
    skills: string[];
    codingProblemsSolved: number;
    placementScore: number;
  }
) => {
  const normalizedId = companyId.toLowerCase().trim();
  const company = COMPANY_PROFILES[normalizedId] || 
    Object.values(COMPANY_PROFILES).find(c => 
      c.name.toLowerCase().includes(normalizedId) || normalizedId.includes(c.name.toLowerCase())
    ) || COMPANY_PROFILES.zoho;

  const isCgpaEligible = studentStats.cgpa >= company.minCgpa;
  
  // Matched skills calculation
  const matchedSkills = company.requiredSkills.filter(reqSkill =>
    studentStats.skills.some(studentSkill =>
      studentSkill.toLowerCase().includes(reqSkill.toLowerCase()) ||
      reqSkill.toLowerCase().includes(studentSkill.toLowerCase())
    )
  );

  const missingSkills = company.requiredSkills.filter(reqSkill =>
    !matchedSkills.includes(reqSkill)
  );

  // Readiness Score
  const cgpaComponent = Math.min(100, (studentStats.cgpa / 10) * 100);
  const skillMatchComponent = (matchedSkills.length / Math.max(1, company.requiredSkills.length)) * 100;
  const codingComponent = Math.min(100, (studentStats.codingProblemsSolved / 250) * 100);
  
  const estimatedReadiness = Math.round(
    (cgpaComponent * 0.25) + (skillMatchComponent * 0.45) + (codingComponent * 0.30)
  );

  return {
    company,
    isCgpaEligible,
    cgpaDifference: Number((studentStats.cgpa - company.minCgpa).toFixed(2)),
    matchedSkills,
    missingSkills,
    estimatedReadiness,
    recommendations: generateTargetedRecommendations(company, studentStats, isCgpaEligible, missingSkills),
  };
};

function generateTargetedRecommendations(
  company: CompanyRecruitmentProfile,
  studentStats: { cgpa: number; codingProblemsSolved: number; skills: string[] },
  isEligible: boolean,
  missingSkills: string[]
): string[] {
  const tips: string[] = [];

  if (!isEligible) {
    tips.push(`⚠️ Your current CGPA (${studentStats.cgpa}) is below ${company.name}'s minimum cutoff (${company.minCgpa}). Focus on academic recovery in upcoming internals.`);
  } else {
    tips.push(`✅ CGPA Check: You meet the eligibility criterion (${studentStats.cgpa} >= ${company.minCgpa}).`);
  }

  if (missingSkills.length > 0) {
    tips.push(`🎯 Skill Gap Focus: Prioritize learning/revising ${missingSkills.slice(0, 3).join(', ')}.`);
  }

  if (company.id === 'zoho') {
    tips.push('💡 Zoho Specific: Practice coding in pure C/Java without standard template libraries. Build at least 2 complete console applications (e.g. Railway / Taxi Booking).');
  } else if (company.id === 'tcs') {
    tips.push('💡 TCS Specific: Practice speed-aptitude for the Foundation section and solve previous year TCS NQT coding problems to target Digital/Prime (7-9 LPA) packages.');
  } else if (company.id === 'accenture') {
    tips.push('💡 Accenture Specific: Review MS Office shortcuts, cloud computing fundamentals, and take an automated speaking practice test for the Communication Round.');
  } else if (company.id === 'infosys') {
    tips.push('💡 Infosys Specific: Prepare for individual sectional timed tests and practice pseudocode tracing.');
  } else if (company.id === 'product') {
    tips.push('💡 Product Tier: Solve at least 2 medium-to-hard LeetCode problems daily on Trees, Graphs, and DP, and practice Low-Level System Design.');
  }

  if (studentStats.codingProblemsSolved < 200) {
    tips.push(`📈 Problem Solving Target: Increase your solved problem count from ${studentStats.codingProblemsSolved} to at least 250+ before the drive.`);
  }

  return tips;
}
