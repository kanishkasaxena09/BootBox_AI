export const roleOptions = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'AI Engineer', 'Data Scientist', 'Cyber Security Engineer', 'Cloud Engineer',
  'DevOps Engineer', 'Android Developer', 'Product Manager', 'UI/UX Designer',
  'Business Analyst', 'Marketing Manager',
];

export const experienceLevels = [
  { id: 'student', label: 'Student', short: 'Student' },
  { id: 'fresher', label: 'Fresher', short: 'Fresher' },
  { id: 'entry', label: 'Entry Level (0–2 Years)', short: 'Entry' },
  { id: 'intermediate', label: 'Intermediate (3–6 Years)', short: 'Intermediate' },
  { id: 'senior', label: 'Senior (6–10 Years)', short: 'Senior' },
  { id: 'lead', label: 'Lead (10+ Years)', short: 'Lead' },
];

export const interviewTypes = [
  { id: 'technical', label: 'Technical', icon: '💻' },
  { id: 'hr', label: 'HR', icon: '👤' },
  { id: 'behavioral', label: 'Behavioral', icon: '🧠' },
  { id: 'system-design', label: 'System Design', icon: '🏗️' },
  { id: 'coding', label: 'Coding', icon: '⌨️' },
  { id: 'mixed', label: 'Mixed Interview', icon: '🎯' },
];

export const difficulties = [
  { id: 'easy', label: 'Easy', color: 'emerald' },
  { id: 'medium', label: 'Medium', color: 'amber' },
  { id: 'hard', label: 'Hard', color: 'rose' },
  { id: 'company', label: 'Company Specific', color: 'violet' },
];

export const companyOptions = [
  'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix',
  'Adobe', 'Oracle', 'IBM', 'TCS', 'Infosys', 'Accenture', 'Wipro', 'Other',
];

export const questionCounts = [5, 10, 15, 20];

const codingQuestions = [
  {
    category: 'Coding', title: 'Two Sum Problem',
    howToAnswer: 'Start by clarifying the input constraints. Discuss brute force O(n²) first, then optimize using a hash map for O(n) time. Explain your thought process step by step.',
    keyPoints: ['Understand input/output format', 'Clarify edge cases (empty array, no solution)', 'Explain brute force first', 'Optimize with hash map', 'Discuss time and space complexity'],
    commonMistakes: ['Jumping to solution without clarifying', 'Ignoring edge cases like duplicate values', 'Not discussing complexity', 'Forgetting to handle negative numbers'],
    sampleAnswer: 'I would use a hash map to store each number\'s index as I iterate. For each element, I check if the complement (target - current) exists in the map. If yes, return both indices. This gives O(n) time and O(n) space.',
    followUpQuestions: ['What if the array is sorted?', 'Can you solve it in O(1) space?', 'What if there are multiple pairs?', 'How would you handle very large arrays?'],
    estimatedTime: '5 Minutes',
    coding: {
      problemStatement: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution.',
      constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', 'Exactly one valid answer exists'],
      exampleInput: 'nums = [2, 7, 11, 15], target = 9',
      exampleOutput: '[0, 1]',
      hints: ['Think about what you need to look up for each element.', 'A hash map can give you O(1) lookups.'],
      optimalApproach: 'Hash Map — iterate once, store complements, O(n) time.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
    },
  },
  {
    category: 'Coding', title: 'Reverse a Linked List',
    howToAnswer: 'Clarify whether it\'s singly or doubly linked. Walk through the iterative approach using three pointers (prev, curr, next). Then mention the recursive approach.',
    keyPoints: ['Handle empty list and single node', 'Use three pointers for iterative', 'Preserve next before overwriting', 'Discuss both iterative and recursive', 'State time and space complexity'],
    commonMistakes: ['Losing reference to next node', 'Not handling empty list', 'Creating cycles in the list', 'Forgetting to return new head'],
    sampleAnswer: 'Iteratively: use prev=null, curr=head. While curr exists, save next, point curr.next to prev, advance both. Return prev as new head. O(n) time, O(1) space. Recursively: reverse rest of list first, then link current node.',
    followUpQuestions: ['Can you do it recursively?', 'What about reversing a sub-list?', 'How would you reverse nodes in k-groups?', 'What\'s the stack usage for recursive approach?'],
    estimatedTime: '5 Minutes',
    coding: {
      problemStatement: 'Given the head of a singly linked list, reverse the list and return the reversed list.',
      constraints: ['The number of nodes is in range [0, 5000]', '-5000 ≤ Node.val ≤ 5000'],
      exampleInput: 'head = [1, 2, 3, 4, 5]',
      exampleOutput: '[5, 4, 3, 2, 1]',
      hints: ['Think about how to reverse pointers one by one.', 'You need to track three nodes at a time.'],
      optimalApproach: 'Iterative with three pointers — O(n) time, O(1) space.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
    },
  },
  {
    category: 'Coding', title: 'Valid Parentheses',
    howToAnswer: 'Explain the stack approach: push opening brackets, pop on closing and check match. Discuss the importance of checking stack is empty at the end.',
    keyPoints: ['Use a stack data structure', 'Map closing to opening brackets', 'Check stack empty before pop', 'Verify stack is empty at end', 'Handle all bracket types'],
    commonMistakes: ['Forgetting to check if stack is empty before popping', 'Not handling unmatched closing brackets', 'Only checking one bracket type', 'Returning true before checking stack is empty'],
    sampleAnswer: 'Iterate through string. For opening brackets, push to stack. For closing brackets, check if stack top matches. At the end, return true if stack is empty. O(n) time, O(n) space.',
    followUpQuestions: ['What if only one type of bracket?', 'Can you solve it without a stack for simple cases?', 'How about generating valid parentheses?', 'What about handling nested comments?'],
    estimatedTime: '5 Minutes',
    coding: {
      problemStatement: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
      constraints: ['1 ≤ s.length ≤ 10⁴', 's consists of parentheses only'],
      exampleInput: 's = "([{}])"',
      exampleOutput: 'true',
      hints: ['Use a stack to track opening brackets.', 'Each closing bracket should match the most recent opening.'],
      optimalApproach: 'Stack-based matching — O(n) time, O(n) space.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
    },
  },
  {
    category: 'Coding', title: 'Merge Two Sorted Arrays',
    howToAnswer: 'Start from the end of both arrays and fill from the back of the first array. Discuss why this is better than creating a new array.',
    keyPoints: ['Use two pointers from the end', 'Fill result from the back', 'Handle remaining elements', 'Discuss in-place vs new array', 'Compare time complexities'],
    commonMistakes: ['Overwriting elements before they are read', 'Not handling different array lengths', 'Using extra space unnecessarily', 'Off-by-one errors with indices'],
    sampleAnswer: 'Start from the end of both arrays. Compare elements, place the larger one at the end of nums1. Continue until one array is exhausted, then copy remaining. O(m+n) time, O(1) space.',
    followUpQuestions: ['What if arrays have very different lengths?', 'Can you merge k sorted arrays?', 'How about merging sorted linked lists?', 'What if the arrays are on disk?'],
    estimatedTime: '5 Minutes',
    coding: {
      problemStatement: 'You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n representing the number of elements in nums1 and nums2 respectively. Merge nums2 into nums1.',
      constraints: ['nums1.length == m + n', 'nums2.length == n', '0 ≤ m, n ≤ 200', 'Arrays are sorted'],
      exampleInput: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3',
      exampleOutput: '[1,2,2,3,5,6]',
      hints: ['Start filling from the end to avoid overwriting.', 'Compare elements from the back of both arrays.'],
      optimalApproach: 'Two pointers from the end — O(m+n) time, O(1) space.',
      timeComplexity: 'O(m + n)',
      spaceComplexity: 'O(1)',
    },
  },
  {
    category: 'Coding', title: 'LRU Cache Implementation',
    howToAnswer: 'Explain the combination of hash map and doubly linked list. Map provides O(1) lookup, DLL provides O(1) insertion/removal and maintains order.',
    keyPoints: ['HashMap for O(1) key lookup', 'Doubly linked list for O(1) move/remove', 'Move accessed item to head on get', 'Evict from tail on capacity overflow', 'Discuss design decisions for capacity'],
    commonMistakes: ['Using singly linked list instead of doubly', 'Forgetting to update map on move operations', 'Not handling edge cases (capacity 1)', 'Incorrect eviction order'],
    sampleAnswer: 'HashMap maps keys to DLL nodes. Get: move node to front, return value. Put: if key exists update and move; else add to front, if over capacity evict tail and remove from map. Both operations O(1).',
    followUpQuestions: ['What if we need thread safety?', 'How would you make it LFU instead?', 'Can you implement TTL-based expiration?', 'What about distributed LRU cache?'],
    estimatedTime: '10 Minutes',
    coding: {
      problemStatement: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement get and put in O(1) time.',
      constraints: ['1 ≤ capacity ≤ 3000', '0 ≤ key ≤ 10⁴', '0 ≤ value ≤ 10⁵', 'At most 2 × 10⁵ calls to get and put'],
      exampleInput: 'cache = new LRUCache(2); cache.put(1,1); cache.put(2,2); cache.get(1); cache.put(3,3);',
      exampleOutput: 'null, null, null, 1, null',
      hints: ['Combine hash map with a linked list.', 'Move accessed items to mark them as recently used.'],
      optimalApproach: 'HashMap + Doubly Linked List — O(1) get and put.',
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(capacity)',
    },
  },
  {
    category: 'Coding', title: 'Binary Tree Level Order Traversal',
    howToAnswer: 'Use BFS with a queue. Process all nodes at current level before moving to next. Track level size before processing.',
    keyPoints: ['BFS with queue', 'Track level size at each iteration', 'Process all nodes in current level', 'Add children to queue', 'Return list of lists'],
    commonMistakes: ['Mixing up BFS and DFS', 'Not tracking level boundaries', 'Adding null nodes to queue', 'Incorrect level grouping'],
    sampleAnswer: 'Use a queue, start with root. While queue not empty, record level size, process that many nodes, enqueue their children. Collect each level\'s values in a sub-array. O(n) time, O(n) space.',
    followUpQuestions: ['How about zigzag level order?', 'Can you do it with DFS?', 'What about finding the deepest level?', 'How to find the right side view?'],
    estimatedTime: '5 Minutes',
    coding: {
      problemStatement: 'Given the root of a binary tree, return the level order traversal of its nodes\' values (i.e., from left to right, level by level).',
      constraints: ['The number of nodes is in range [0, 2000]', '-1000 ≤ Node.val ≤ 1000'],
      exampleInput: 'root = [3, 9, 20, null, null, 15, 7]',
      exampleOutput: '[[3], [9, 20], [15, 7]]',
      hints: ['Use a queue for BFS traversal.', 'Process all nodes at current level before next.'],
      optimalApproach: 'BFS with queue — O(n) time, O(n) space.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
    },
  },
  {
    category: 'Coding', title: 'Find the Duplicate Number',
    howToAnswer: 'Discuss the Floyd\'s cycle detection approach — treat the array as a linked list where value at index i points to index nums[i]. The cycle start is the duplicate.',
    keyPoints: ['Floyd\'s tortoise and hare', 'Array as implicit linked list', 'Phase 1: detect cycle', 'Phase 2: find cycle entrance', 'No modification to array'],
    commonMistakes: ['Using extra space (sorting/hash set)', 'Not understanding why cycle exists', 'Off-by-one in cycle detection', 'Confusing the duplicate with cycle start'],
    sampleAnswer: 'Treat array as a linked list where nums[i] is the next pointer. Use slow/fast pointers to find cycle entrance. The duplicate number is where the cycle begins. O(n) time, O(1) space, no array modification.',
    followUpQuestions: ['What if there are multiple duplicates?', 'Can you find all duplicates?', 'How would you modify the array approach?', 'What about finding duplicates in unsorted array?'],
    estimatedTime: '10 Minutes',
    coding: {
      problemStatement: 'Given an array of integers nums containing n + 1 integers where each integer is in the range [1, n] inclusive. There is only one repeated number, find it.',
      constraints: ['1 ≤ n ≤ 10⁵', '1 ≤ nums[i] ≤ n', 'All integers in nums appear only once except for exactly one'],
      exampleInput: 'nums = [1, 3, 4, 2, 2]',
      exampleOutput: '2',
      hints: ['Think of the array as a linked list.', 'The values can be treated as pointers to next indices.'],
      optimalApproach: 'Floyd\'s Cycle Detection — O(n) time, O(1) space.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
    },
  },
  {
    category: 'Coding', title: 'Longest Consecutive Sequence',
    howToAnswer: 'Use a HashSet for O(1) lookups. For each number, check if it\'s the start of a sequence (num-1 not in set), then count consecutive numbers.',
    keyPoints: ['HashSet for O(1) lookups', 'Only start counting from sequence start', 'Skip numbers that are not sequence starts', 'Track maximum length', 'O(n) overall time'],
    commonMistakes: ['Sorting first (O(n log n))', 'Checking every number instead of sequence starts', 'Using nested loops', 'Not handling empty array'],
    sampleAnswer: 'Add all numbers to a set. For each num, if num-1 is not in set, it\'s a sequence start. Count forward from there. Track max length. O(n) time because each number is visited at most twice.',
    followUpQuestions: ['What if you need the actual sequence?', 'Can you solve it with sorting?', 'How about finding the second longest?', 'What about 2D grid version?'],
    estimatedTime: '8 Minutes',
    coding: {
      problemStatement: 'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. Must run in O(n) time.',
      constraints: ['0 ≤ nums.length ≤ 10⁵', '-10⁹ ≤ nums[i] ≤ 10⁹'],
      exampleInput: 'nums = [100, 4, 200, 1, 3, 2]',
      exampleOutput: '4',
      hints: ['Use a Set for O(1) lookups.', 'Only start counting if the current number is the beginning of a sequence.'],
      optimalApproach: 'HashSet — O(n) time, O(n) space.',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
    },
  },
  {
    category: 'Coding', title: 'Implement Trie (Prefix Tree)',
    howToAnswer: 'Explain the trie node structure (children map + isEnd flag). Walk through insert, search, and startsWith operations step by step.',
    keyPoints: ['Node has children map and isEnd flag', 'Insert: traverse/create nodes character by character', 'Search: traverse and check isEnd at final node', 'StartsWith: traverse without checking isEnd', 'Discuss time complexity per operation'],
    commonMistakes: ['Not marking the end of a word correctly', 'Forgetting to handle empty prefix', 'Using array instead of map for children', 'Not checking null during traversal'],
    sampleAnswer: 'Each node stores a map of children and an isEnd flag. Insert traverses/creates nodes for each char. Search traverses and checks isEnd. StartsWith traverses only. All operations are O(m) where m is the word/prefix length.',
    followUpQuestions: ['How would you support delete?', 'Can you implement autocomplete?', 'How about spell-checking?', 'What about compressed tries?'],
    estimatedTime: '8 Minutes',
    coding: {
      problemStatement: 'Implement a trie with insert, search, and startsWith methods.',
      constraints: ['1 ≤ word.length, prefix.length ≤ 2000', 'word and prefix consist only of lowercase English letters', 'At most 3 × 10⁴ calls in total'],
      exampleInput: 'trie.insert("apple"); trie.search("apple"); trie.startsWith("app");',
      exampleOutput: 'null, true, true',
      hints: ['Each node should have a map of children and a boolean flag.', 'Search checks the flag at the last character.'],
      optimalApproach: 'Trie with hash map children — O(m) per operation.',
      timeComplexity: 'O(m) per operation',
      spaceComplexity: 'O(total characters)',
    },
  },
  {
    category: 'Coding', title: 'Median of Two Sorted Arrays',
    howToAnswer: 'Explain the binary search approach on the smaller array. Partition both arrays such that left half has exactly (m+n+1)/2 elements and all left ≤ all right.',
    keyPoints: ['Binary search on smaller array', 'Partition so left half is correct size', 'Handle edge cases (empty arrays)', 'O(log(min(m,n))) time', 'No need to merge arrays'],
    commonMistakes: ['Merging arrays first (O(m+n))', 'Off-by-one in partition calculations', 'Not handling odd/even total length', 'Forgetting edge cases with empty arrays'],
    sampleAnswer: 'Binary search on the smaller array. For each partition, check if maxLeft1 ≤ minRight2 and maxLeft2 ≤ minRight1. If not, adjust the search. Final median is (max of lefts / min of rights) or average.',
    followUpQuestions: ['Can you extend this to find kth element?', 'What if arrays have duplicates?', 'How about finding the mean instead?', 'What about streaming sorted arrays?'],
    estimatedTime: '15 Minutes',
    coding: {
      problemStatement: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. Overall run time complexity should be O(log (m+n)).',
      constraints: ['nums1.length == m', 'nums2.length == n', '0 ≤ m ≤ 1000', '0 ≤ n ≤ 1000', '1 ≤ m + n ≤ 2000'],
      exampleInput: 'nums1 = [1, 3], nums2 = [2]',
      exampleOutput: '2.0',
      hints: ['Can you do better than O(m+n)?', 'Binary search on the partition position.'],
      optimalApproach: 'Binary search on smaller array — O(log(min(m,n))) time.',
      timeComplexity: 'O(log(min(m, n)))',
      spaceComplexity: 'O(1)',
    },
  },
];

const systemDesignQuestions = [
  {
    category: 'System Design', title: 'Design a URL Shortener like bit.ly',
    howToAnswer: 'Start with requirements (functional + non-functional), then design the encoding scheme, database schema, API design, and discuss scaling strategies.',
    keyPoints: ['Base62 encoding of auto-increment IDs', 'Redis for hot mappings, PostgreSQL for storage', '301 vs 302 redirects', 'Analytics and click tracking', 'Rate limiting and abuse prevention', 'Custom aliases support'],
    commonMistakes: ['Using MD5/SHA for encoding (collisions)', 'Not considering database choice', 'Ignoring rate limiting', 'No caching strategy', 'Forgetting analytics requirements'],
    sampleAnswer: 'Use base62 encoding of auto-increment IDs for short URLs. Store mappings in Redis for fast lookups with PostgreSQL as persistent store. Implement 301 redirects for SEO. Track clicks with an async analytics pipeline. Support custom aliases and expiry.',
    followUpQuestions: ['How do you handle custom aliases?', 'What about the analytics pipeline?', 'How do you prevent abuse?', 'How would you handle 100M URLs?'],
    estimatedTime: '10 Minutes',
    systemDesign: {
      functionalRequirements: ['Shorten URL to generate short link', 'Redirect short URL to original', 'Custom aliases', 'Link expiration', 'Analytics tracking'],
      nonFunctionalRequirements: ['Low latency redirect (<100ms)', 'High availability', 'Scale to billions of URLs', '99.9% uptime', 'Horizontal scalability'],
      scalability: ['Use consistent hashing for database sharding', 'CDN for popular URLs', 'Redis cluster for caching layer', 'Async analytics pipeline with Kafka'],
      databases: ['PostgreSQL for persistent storage', 'Redis for caching hot URLs', 'ClickHouse or BigQuery for analytics'],
      caching: ['Redis LRU cache for top 20% URLs', 'CDN edge caching for popular redirects', 'Cache invalidation on link expiration'],
      apiDesign: ['POST /api/shorten {longUrl, customAlias?, expiry?}', 'GET /:shortCode (redirect)', 'GET /api/analytics/:shortCode', 'DELETE /api/links/:shortCode'],
      tradeoffs: ['301 (cached by browser) vs 302 (trackable) redirects', 'SQL vs NoSQL for storage', 'Sync vs async analytics', 'ID generation: auto-increment vs UUID vs Snowflake'],
    },
  },
  {
    category: 'System Design', title: 'Design a Real-time Chat Application',
    howToAnswer: 'Cover WebSocket connections, message persistence, presence system, group messaging, and delivery guarantees. Discuss trade-offs between consistency and availability.',
    keyPoints: ['WebSocket for real-time bidirectional messaging', 'Message queue (Kafka) for fan-out', 'Redis Pub/Sub for cross-server messaging', 'Message ordering with sequence numbers', 'Online presence via heartbeat', 'End-to-end encryption possibilities'],
    commonMistakes: ['Using polling instead of WebSockets', 'Not handling reconnection', 'Ignoring message ordering', 'No offline message storage', 'Not scaling the message broker'],
    sampleAnswer: 'Use WebSockets for real-time messaging with a connection manager service. Store messages in Cassandra for write-heavy workloads. Use Redis Pub/Sub for cross-server message routing. Implement message queues for offline delivery. Track presence with heartbeat mechanism.',
    followUpQuestions: ['How do you handle message ordering?', 'What about read receipts?', 'How would you implement E2E encryption?', 'How do you scale to 1M concurrent users?'],
    estimatedTime: '10 Minutes',
    systemDesign: {
      functionalRequirements: ['One-on-one messaging', 'Group chats', 'Message history', 'Online/offline status', 'Read receipts', 'File sharing'],
      nonFunctionalRequirements: ['Real-time delivery (<100ms)', 'Message ordering guarantee', 'Offline message storage', 'Scale to millions of concurrent users', 'Message persistence'],
      scalability: ['WebSocket connection pooling', 'Horizontal scaling of chat servers', 'Database sharding by chat room', 'CDN for media/file delivery', 'Kafka for message streaming'],
      databases: ['Cassandra for message storage (write-heavy)', 'Redis for presence, sessions, recent messages', 'PostgreSQL for user data and chat metadata'],
      caching: ['Redis for recent messages per chat', 'Presence cache for online status', 'User profile caching'],
      apiDesign: ['POST /api/messages {chatId, content, type}', 'GET /api/messages/:chatId?cursor=&limit=', 'WS /ws/chat (upgrade to WebSocket)', 'POST /api/chats {participants, type}'],
      tradeoffs: ['WebSocket vs SSE for real-time', 'Message ordering vs availability', 'Sync vs async message delivery', 'SQL vs NoSQL for message storage', 'Push vs pull for notifications'],
    },
  },
  {
    category: 'System Design', title: 'Design a Rate Limiter',
    howToAnswer: 'Start with why rate limiting is needed (DDoS, abuse, fair usage). Discuss algorithms (Token Bucket, Sliding Window), then placement (client-side vs server-side vs middleware).',
    keyPoints: ['Token Bucket vs Sliding Window Log vs Fixed Window', 'Distributed rate limiting with Redis', 'Race condition handling with Lua scripts', 'Graceful degradation strategies', 'Monitoring and alerting', 'Different limits per user tier'],
    commonMistakes: ['Using fixed window (boundary burst problem)', 'Not handling distributed scenarios', 'Blocking too aggressively', 'Not monitoring rate limit hits', 'Ignoring legitimate traffic spikes'],
    sampleAnswer: 'Implement Token Bucket algorithm using Redis for distributed rate limiting. Use Lua scripts for atomic operations. Differentiate limits by API endpoint and user tier. Return 429 with Retry-After header. Add monitoring for rate limit violations.',
    followUpQuestions: ['How do you handle distributed rate limiting?', 'What about different limits per API?', 'How do you prevent the thundering herd?', 'What monitoring do you need?'],
    estimatedTime: '8 Minutes',
    systemDesign: {
      functionalRequirements: ['Limit requests per time window', 'Different limits per endpoint/user', 'Return meaningful error on limit exceeded', 'Support multiple rate limit rules', 'Distributed across servers'],
      nonFunctionalRequirements: ['Sub-millisecond latency', 'Minimal memory footprint', 'Thread-safe operations', 'Fault tolerant (degrade gracefully)', 'No single point of failure'],
      scalability: ['Redis cluster for distributed counters', 'Local rate limiting as fallback', 'Sticky sessions for stateful limiting', 'Sharded counters to avoid hotspots'],
      databases: ['Redis (primary) for rate limit counters', 'PostgreSQL for rate limit configuration', 'In-memory local cache as fallback'],
      caching: ['Local in-memory counter for hot paths', 'Redis for distributed state', 'Configuration caching to avoid DB lookups'],
      apiDesign: ['Rate limit headers: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset', '429 Too Many Requests with Retry-After', 'GET /api/admin/rate-limits (view config)', 'PUT /api/admin/rate-limits (update config)'],
      tradeoffs: ['Token Bucket vs Sliding Window', 'Centralized vs distributed limiting', 'Hard limit vs graceful degradation', 'Per-request vs per-second limiting'],
    },
  },
  {
    category: 'System Design', title: 'Design a News Feed System',
    howToAnswer: 'Discuss fan-out on write vs fan-out on read, feed ranking, media delivery, and how to handle celebrities with millions of followers.',
    keyPoints: ['Fan-out on write for regular users', 'Fan-out on read for celebrities', 'Feed ranking with ML signals', 'Media CDN delivery', 'Pull vs push for feed generation', 'Caching strategy for feeds'],
    commonMistakes: ['Fan-out on write for everyone (celebrity problem)', 'No feed ranking (chronological only)', 'Not caching feeds', 'Missing media optimization', 'No real-time updates'],
    sampleAnswer: 'Use hybrid fan-out: push for regular users (<10K followers), pull for celebrities. Store feeds in Redis sorted sets. Rank with ML model based on engagement signals. Serve media via CDN. Real-time updates via WebSockets for active users.',
    followUpQuestions: ['How do you handle the celebrity problem?', 'What about feed ranking?', 'How do you handle media in feeds?', 'What about real-time feed updates?'],
    estimatedTime: '10 Minutes',
    systemDesign: {
      functionalRequirements: ['Create and view news feed', 'Follow/unfollow users', 'Like, comment, share posts', 'Real-time feed updates', 'Rich media support'],
      nonFunctionalRequirements: ['Feed generation <200ms', 'Scale to billions of posts', 'Support viral content (celebrity posts)', 'Consistent feed ordering', 'High availability'],
      scalability: ['Hybrid fan-out (push + pull)', 'Feed generation sharded by user', 'Media CDN for content delivery', 'Database sharding by user ID', 'Horizontal scaling of feed service'],
      databases: ['PostgreSQL for user data and posts', 'Redis for feed caching and social graph', 'Cassandra for post storage (write-heavy)', 'Elasticsearch for search'],
      caching: ['Redis sorted sets for pre-computed feeds', 'CDN for media content', 'Memcached for feed fragments', 'Local cache for active user feeds'],
      apiDesign: ['POST /api/posts {content, media}', 'GET /api/feed?cursor=&limit=', 'POST /api/follow/:userId', 'POST /api/posts/:postId/like', 'POST /api/posts/:postId/comment'],
      tradeoffs: ['Fan-out on write vs read', 'Chronological vs ranked feed', 'Consistency vs availability', 'Pre-compute vs on-demand feed generation'],
    },
  },
  {
    category: 'System Design', title: 'Design a Distributed Cache',
    howToAnswer: 'Start with use cases (database caching, session storage, CDN). Discuss consistency models, eviction policies, and failure handling.',
    keyPoints: ['Consistent hashing for distribution', 'LRU/LFU eviction policies', 'Cache-aside vs read-through/write-through', 'Cache invalidation strategies', 'Hot key handling', 'Failure modes and recovery'],
    commonMistakes: ['Thundering herd on cache miss', 'Not handling hot keys', 'Cache stampede', 'Inconsistent hashing gaps', 'No monitoring for cache hit ratio'],
    sampleAnswer: 'Implement consistent hashing with virtual nodes for distribution. Use LRU eviction with configurable TTL. Support cache-aside pattern. Handle hot keys with local caching. Monitor hit ratio and evictions. Use read replicas for read-heavy workloads.',
    followUpQuestions: ['How do you handle cache invalidation?', 'What about the thundering herd problem?', 'How do you monitor cache performance?', 'What about multi-region caching?'],
    estimatedTime: '10 Minutes',
    systemDesign: {
      functionalRequirements: ['GET/PUT/DELETE key-value pairs', 'TTL-based expiration', 'Configurable eviction policies', 'Cluster support', 'Pub/Sub for invalidation'],
      nonFunctionalRequirements: ['Sub-millisecond latency', '99.9% availability', 'Scale to millions of keys', 'Memory efficient', 'Thread-safe operations'],
      scalability: ['Consistent hashing with virtual nodes', 'Horizontal scaling by adding nodes', 'Read replicas for read-heavy workloads', 'Client-side sharding library'],
      databases: ['In-memory hash table per node', 'Disk-backed for large datasets (Redis AOF)', 'Configuration store (etcd/Consul)'],
      caching: ['Multi-level caching (L1 local, L2 distributed)', 'Bloom filter for negative caching', 'Cache warming on node addition'],
      apiDesign: ['GET /cache/:key', 'PUT /cache/:key {value, ttl}', 'DELETE /cache/:key', 'GET /cache/cluster/status', 'POST /cache/invalidate pattern'],
      tradeoffs: ['Strong vs eventual consistency', 'Synchronous vs asynchronous replication', 'Cache-aside vs write-through vs write-behind', 'Single-threaded vs multi-threaded'],
    },
  },
  {
    category: 'System Design', title: 'Design a Video Streaming Platform',
    howToAnswer: 'Cover video upload pipeline, transcoding, adaptive bitrate streaming (HLS/DASH), CDN delivery, and recommendation system basics.',
    keyPoints: ['Chunked video upload', 'Transcoding pipeline (FFmpeg + queue)', 'HLS/DASH for adaptive streaming', 'Multi-resolution encoding', 'CDN for global delivery', 'Recommendation engine'],
    commonMistakes: ['No adaptive bitrate streaming', 'Synchronous transcoding', 'Not chunking uploads', 'Ignoring mobile bandwidth', 'No content moderation pipeline'],
    sampleAnswer: 'Accept chunked uploads, store in object storage. Trigger async transcoding to multiple resolutions via job queue. Serve via HLS with adaptive bitrate. Use CDN for global delivery. Build a recommendation engine based on watch history and engagement.',
    followUpQuestions: ['How do you handle live streaming?', 'What about DRM protection?', 'How do you optimize for mobile?', 'What about content moderation?'],
    estimatedTime: '12 Minutes',
    systemDesign: {
      functionalRequirements: ['Upload videos', 'Stream videos with adaptive quality', 'Search and discover videos', 'Like, comment, subscribe', 'Video recommendations'],
      nonFunctionalRequirements: ['Start playback in <2s', 'Support 4K streaming', 'Global availability', 'Scale to billions of views', 'Handle viral content spikes'],
      scalability: ['Chunked upload with resumable support', 'Async transcoding pipeline', 'CDN for video delivery', 'Database sharding by video ID', 'Microservices architecture'],
      databases: ['PostgreSQL for metadata', 'S3/object storage for video files', 'Redis for sessions and counters', 'Elasticsearch for search', 'ClickHouse for analytics'],
      caching: ['CDN edge caching for popular videos', 'Transcoded segments cached at CDN', 'Metadata caching in Redis', 'Thumbnail CDN caching'],
      apiDesign: ['POST /api/videos/upload (chunked)', 'GET /api/videos/:id/stream (HLS manifest)', 'GET /api/videos/:id (metadata)', 'POST /api/videos/:id/like', 'GET /api/videos/search?q='],
      tradeoffs: ['Upload now vs process later', 'HLS vs DASH for streaming', 'Pre-transcode all resolutions vs on-demand', 'CDN cost vs latency'],
    },
  },
];

const technicalQuestions = [
  {
    category: 'Technical', title: 'Explain the CAP Theorem',
    howToAnswer: 'Define all three properties (Consistency, Availability, Partition Tolerance), explain why you can only guarantee 2 of 3, and give real-world examples of CP and AP systems.',
    keyPoints: ['Consistency = all nodes see same data', 'Availability = every request gets a response', 'Partition Tolerance = system works despite network failures', 'Since partitions happen, choose C or A', 'CP: ZooKeeper, HBase. AP: Cassandra, DynamoDB'],
    commonMistakes: ['Saying you can have all three', 'Confusing consistency with atomicity', 'Not mentioning real-world examples', 'Ignoring that partitions are inevitable'],
    sampleAnswer: 'CAP theorem states a distributed system can guarantee at most 2 of 3 properties. Since network partitions are inevitable, you choose between CP (consistent but may reject requests) like ZooKeeper, or AP (always available but may serve stale data) like Cassandra.',
    followUpQuestions: ['What is PACELC?', 'How does Netflix handle this?', 'What about Spanner?', 'How do modern databases handle this?'],
    estimatedTime: '3 Minutes',
  },
  {
    category: 'Technical', title: 'How does garbage collection work in Java?',
    howToAnswer: 'Explain heap memory regions (Young, Old), GC algorithms (G1, ZGC), and the lifecycle of objects from creation to collection.',
    keyPoints: ['Heap divided into Young and Old generations', 'Young gen: Eden + Survivor spaces', 'Minor GC: collects short-lived objects', 'Major GC: collects Old generation', 'G1 GC: region-based, predictable pauses', 'ZGC: ultra-low latency'],
    commonMistakes: ['Saying GC is manual', 'Forgetting to mention different algorithms', 'Not explaining generational concept', 'Ignoring impact on application performance'],
    sampleAnswer: 'Java uses automatic garbage collection. Objects start in Young generation. After surviving multiple GC cycles, they promote to Old generation. G1 GC divides heap into regions for predictable pauses. ZGC achieves sub-millisecond pauses for large heaps.',
    followUpQuestions: ['What are the GC tuning parameters?', 'How do you detect memory leaks?', 'What is the difference between G1 and ZGC?', 'When would you choose ZGC over G1?'],
    estimatedTime: '4 Minutes',
  },
  {
    category: 'Technical', title: 'Explain the difference between processes and threads',
    howToAnswer: 'Compare memory space, communication mechanisms, creation overhead, and use cases. Mention context switching costs.',
    keyPoints: ['Process: isolated memory space', 'Thread: shared memory within process', 'Process creation is expensive (fork)', 'Thread creation is lightweight', 'Context switching cost differs', 'Use cases for each'],
    commonMistakes: ['Saying threads have separate memory', 'Not mentioning shared resources', 'Ignoring context switching costs', 'Forgetting about IPC mechanisms'],
    sampleAnswer: 'Processes have isolated memory and communicate via IPC (pipes, sockets). Threads share memory within a process but need synchronization (mutexes, semaphores). Process creation is expensive; threads are lightweight. Context switching between processes is costlier than between threads.',
    followUpQuestions: ['What is a green thread?', 'How do goroutines differ?', 'What about coroutine models?', 'How does async/await relate?'],
    estimatedTime: '3 Minutes',
  },
  {
    category: 'Technical', title: 'What is a microservices architecture?',
    howToAnswer: 'Define microservices, compare with monolith, discuss service decomposition, communication patterns, and challenges like distributed transactions.',
    keyPoints: ['Small, independently deployable services', 'Organized around business capabilities', 'Each service owns its data', 'Communication via HTTP/gRPC/messaging', 'Challenges: distributed transactions, service discovery', 'Benefits: independent scaling, tech diversity'],
    commonMistakes: ['Distributed monolith anti-pattern', 'Too many services too early', 'Shared databases', 'Synchronous-only communication', 'Ignoring observability'],
    sampleAnswer: 'Microservices decompose applications into small, independently deployable services organized around business capabilities. Each service owns its data and communicates via lightweight protocols. Benefits include independent scaling and deployment, but challenges include distributed transactions and operational complexity.',
    followUpQuestions: ['When should you NOT use microservices?', 'How do you handle distributed transactions?', 'What about service mesh?', 'How do you test microservices?'],
    estimatedTime: '4 Minutes',
  },
  {
    category: 'Technical', title: 'Explain the concept of database indexing',
    howToAnswer: 'Explain B-tree indexes, how they speed up queries, trade-offs with write performance, and when to use different index types.',
    keyPoints: ['B-tree is the most common index structure', 'Speeds up read queries dramatically', 'Slows down writes (index maintenance)', 'Composite indexes and leftmost prefix', 'Covering indexes for index-only scans', 'When NOT to index'],
    commonMistakes: ['Over-indexing (write performance hit)', 'Not understanding composite index order', 'Indexing low-cardinality columns', 'Ignoring index maintenance cost', 'Not analyzing query patterns first'],
    sampleAnswer: 'Database indexes use B-tree structures to enable O(log n) lookups instead of O(n) full table scans. Composite indexes follow leftmost prefix rules. Covering indexes include all query columns to avoid table lookups. Trade-off: each index slows down INSERT/UPDATE/DELETE operations.',
    followUpQuestions: ['What are hash indexes?', 'Explain covering indexes', 'When should you NOT index?', 'What about partial indexes?'],
    estimatedTime: '4 Minutes',
  },
  {
    category: 'Technical', title: 'What is the difference between REST and GraphQL?',
    howToAnswer: 'Compare data fetching patterns, over/under-fetching, schema design, caching strategies, and when to choose each.',
    keyPoints: ['REST: resource-based, multiple endpoints', 'GraphQL: single endpoint, flexible queries', 'REST over/under-fetching problem', 'GraphQL client-specified queries', 'REST caching is simpler (HTTP)', 'GraphQL subscriptions for real-time'],
    commonMistakes: ['Saying GraphQL replaces REST entirely', 'Ignoring N+1 problem in GraphQL', 'Not discussing caching implications', 'Forgetting about tooling maturity differences'],
    sampleAnswer: 'REST uses resource-based URLs with fixed data shapes, leading to over/under-fetching. GraphQL uses a single endpoint with client-specified queries, returning exactly what\'s needed. REST benefits from HTTP caching; GraphQL needs application-level caching. Choose based on client flexibility needs.',
    followUpQuestions: ['What about the N+1 problem?', 'How does caching differ?', 'What about API versioning?', 'When would you use GraphQL subscriptions?'],
    estimatedTime: '4 Minutes',
  },
];

const hrQuestions = [
  {
    category: 'HR', title: 'Tell me about yourself',
    howToAnswer: 'Use Present-Past-Future framework. Start with current role/situation, mention relevant past experiences, and end with future aspirations aligned to the role.',
    keyPoints: ['Present: current role and key achievement', 'Past: relevant experience and skills', 'Future: career goals aligned to this role', 'Keep it under 2 minutes', 'Connect everything to the target role'],
    commonMistakes: ['Reciting your resume word by word', 'Being too personal', 'Rambing without structure', 'Not connecting to the role', 'Going over 2 minutes'],
    sampleAnswer: "I'm a software engineer with 3 years of experience building scalable web applications. At my current company, I led the migration of our monolith to microservices, reducing deployment time by 70%. Before that, I built real-time data pipelines at a fintech startup. I'm now looking to bring my systems design expertise to a senior role where I can drive architectural decisions at scale.",
    followUpQuestions: ['What are you most proud of?', 'Why are you looking to switch?', 'What makes you different from other candidates?'],
    estimatedTime: '2 Minutes',
  },
  {
    category: 'HR', title: 'Why do you want to work at this company?',
    howToAnswer: 'Research the company\'s mission, products, culture, and recent news. Be specific about what attracts you and how your goals align.',
    keyPoints: ['Show genuine knowledge of the company', 'Reference specific products or initiatives', 'Connect your values to their mission', 'Mention growth opportunities', 'Be authentic, not generic'],
    commonMistakes: ['Giving a generic answer', 'Only mentioning salary/benefits', 'Not researching the company', 'Being dishonest about interests', 'Not asking follow-up questions'],
    sampleAnswer: "I'm drawn to your mission of building accessible financial tools. Your recent launch of the developer API platform shows a commitment to innovation that I want to be part of. The engineering blog posts on distributed systems demonstrate the technical depth I'm looking for, and I believe my experience with scalable architectures would be directly applicable.",
    followUpQuestions: ['What do you know about our products?', 'How do you see yourself contributing?', 'What excites you most about this role?'],
    estimatedTime: '2 Minutes',
  },
  {
    category: 'HR', title: 'What are your salary expectations?',
    howToAnswer: 'Research market rates on Glassdoor/Levels.fyi, provide a researched range, emphasize total compensation, and show flexibility.',
    keyPoints: ['Research market rates beforehand', 'Provide a range, not a fixed number', 'Consider total compensation (equity, benefits)', 'Show flexibility for negotiation', 'Ask about their compensation philosophy'],
    commonMistakes: ['Giving a number too early', 'Not researching market rates', 'Being too rigid', 'Focusing only on base salary', 'Being apologetic about asking'],
    sampleAnswer: "Based on my research and the role's scope, I'm targeting $95K-$115K for base salary. That said, I'm interested in the total package including equity, benefits, and growth opportunities. I'm flexible and more interested in finding the right fit than hitting a specific number.",
    followUpQuestions: ['What about equity?', 'How does your compensation structure work?', 'What benefits are most important to you?'],
    estimatedTime: '2 Minutes',
  },
  {
    category: 'HR', title: 'Where do you see yourself in 5 years?',
    howToAnswer: 'Show ambition aligned with the company\'s growth path. Demonstrate you\'ve thought about your career progression and how this role fits.',
    keyPoints: ['Show growth trajectory', 'Align with company\'s career ladder', 'Mention specific skills you want to develop', 'Show leadership aspirations', 'Connect to the current role'],
    commonMistakes: ['Saying "in your job"', 'Being too vague', 'Not connecting to the role', 'Showing no ambition', 'Being unrealistic'],
    sampleAnswer: "In 5 years, I see myself as a technical leader driving architectural decisions for large-scale systems. I want to grow from writing code to mentoring engineers and shaping technical strategy. This role gives me the foundation to develop both technical depth and leadership skills while contributing to products that matter.",
    followUpQuestions: ['What skills do you want to develop?', 'How do you plan to get there?', 'What does leadership mean to you?'],
    estimatedTime: '2 Minutes',
  },
  {
    category: 'HR', title: 'Do you have any questions for us?',
    howToAnswer: 'Always have questions ready. Ask about team culture, technical challenges, growth opportunities, and success metrics. Never say "no."',
    keyPoints: ['Ask about team dynamics and culture', 'Inquire about technical challenges', 'Ask about growth and learning', 'Understand success metrics', 'Show genuine curiosity'],
    commonMistakes: ['Saying "no, I have no questions"', 'Asking about salary in first interview', 'Asking easily Googleable questions', 'Not listening to answers', 'Asking too many questions'],
    sampleAnswer: "Yes, I have a few. What does the onboarding process look like for new engineers? How does the team decide which projects to prioritize? What's the biggest technical challenge the team is currently tackling? And how do you measure success in this role?",
    followUpQuestions: ['Can you tell me about the team structure?', 'What technologies are you adopting?', 'How do you support engineer growth?'],
    estimatedTime: '2 Minutes',
  },
];

const behavioralQuestions = [
  {
    category: 'Behavioral', title: 'Tell me about a time you led a team through a difficult project',
    howToAnswer: 'Use STAR method. Set the situation clearly, define your specific task, describe your concrete actions, and share measurable results.',
    keyPoints: ['Situation: specific context and challenge', 'Task: your specific responsibility', 'Action: concrete steps you took', 'Result: measurable outcome', 'Lessons learned'],
    commonMistakes: ['Using "we" too much without clarifying your role', 'Being vague about actions', 'Not sharing measurable results', 'Picking a trivial example', 'Not reflecting on lessons'],
    sampleAnswer: "Situation: Our 4-person team had 2 weeks to deliver a client dashboard with tight requirements. Task: I coordinated the sprint plan and managed stakeholder communication. Action: I set up daily standups, delegated based on strengths, and proactively removed blockers. Result: Delivered 2 days early with 95% client satisfaction score.",
    followUpQuestions: ['What would you do differently?', 'How did you handle disagreements?', 'What was the most challenging part?'],
    estimatedTime: '3 Minutes',
  },
  {
    category: 'Behavioral', title: 'Describe a time you failed. What did you learn?',
    howToAnswer: 'Be genuine about the failure, take ownership without blaming others, explain what you learned, and describe how you changed your behavior.',
    keyPoints: ['Take full ownership', 'Describe the impact honestly', 'Explain root cause analysis', 'Share specific changes made', 'Show growth mindset'],
    commonMistakes: ['Blaming others', 'Choosing a trivial failure', 'Not showing genuine learning', 'Not describing behavioral change', 'Being defensive'],
    sampleAnswer: "I once pushed a database migration without proper testing, causing 30 minutes of downtime during peak hours. I owned the mistake immediately. Root cause: no rollback plan and no staging environment. I implemented mandatory staging testing, created rollback procedures, and introduced migration review checklists. We haven't had a production incident from a migration since.",
    followUpQuestions: ['How did your team react?', 'What processes did you change?', 'How did this change your approach to deployments?'],
    estimatedTime: '3 Minutes',
  },
  {
    category: 'Behavioral', title: 'Tell me about a time you had to make a decision with incomplete information',
    howToAnswer: 'Show your decision-making framework, risk assessment ability, and how you course-corrected with new information.',
    keyPoints: ['Assess available information', 'Identify key risks and assumptions', 'Make a judgment call', 'Set up monitoring/checkpoints', 'Adapt as new info arrives'],
    commonMistakes: ['Being paralyzed by uncertainty', 'Not explaining your reasoning', 'Ignoring the risks', 'Not setting up checkpoints', 'Being overconfident'],
    sampleAnswer: "We had to launch a payment feature but the third-party API docs were incomplete. I assessed the risk by building a mock integration first, identified the most critical unknowns, built a fallback mechanism, and launched with real-time monitoring. We caught a minor edge case quickly thanks to the fallback, and the launch was successful.",
    followUpQuestions: ['How do you assess risk?', 'What monitoring did you set up?', 'How did you communicate the risk to stakeholders?'],
    estimatedTime: '3 Minutes',
  },
  {
    category: 'Behavioral', title: 'Give an example of when you went above and beyond',
    howToAnswer: 'Show initiative that wasn\'t in your job description, explain the impact on the team/company, and demonstrate proactive thinking.',
    keyPoints: ['Identify the opportunity', 'Explain why you took initiative', 'Describe what you did beyond your role', 'Share the measurable impact', 'Show it wasn\'t expected but valuable'],
    commonMistakes: ['Using a trivial example', 'Not quantifying the impact', 'Being humble to the point of downplaying', 'Not connecting to business value', 'Bragging without substance'],
    sampleAnswer: "During my internship, I noticed the team spent 5+ hours weekly on manual report generation. Nobody asked me to fix it, but I built a Python automation script that extracted data from our dashboard and generated PDF reports automatically. This saved the team 20+ hours monthly and became a permanent tool.",
    followUpQuestions: ['Why did you decide to do this?', 'How did your manager react?', 'Have you done this consistently?'],
    estimatedTime: '2 Minutes',
  },
  {
    category: 'Behavioral', title: 'How do you prioritize tasks when everything seems urgent?',
    howToAnswer: 'Explain your framework (impact vs effort, Eisenhower matrix, etc.), how you communicate with stakeholders, and how you manage expectations.',
    keyPoints: ['Use a prioritization framework', 'Assess business impact', 'Communicate with stakeholders', 'Set realistic expectations', 'Batch similar tasks'],
    commonMistakes: ['Saying you work overtime', 'Not having a framework', 'Ignoring stakeholder communication', 'Being rigid about prioritization', 'Not adapting to changing priorities'],
    sampleAnswer: "I use a simple impact vs effort framework. I quickly map all tasks, identify the top 2-3 with highest business impact, and communicate realistic timelines to stakeholders. I batch similar tasks to minimize context switching. When priorities conflict, I proactively discuss trade-offs with my manager rather than making assumptions.",
    followUpQuestions: ['How do you handle shifting priorities?', 'What tools do you use?', 'How do you say no?'],
    estimatedTime: '3 Minutes',
  },
];

const mockInterviewQuestions = [
  {
    category: 'Mock Interview', title: 'Walk me through your resume',
    howToAnswer: 'Use Present-Past-Future framework. Highlight relevant experiences, quantify achievements, and connect everything to the target role.',
    keyPoints: ['Start with current role/situation', 'Highlight 2-3 key achievements', 'Quantify impact where possible', 'Connect to target role', 'Keep it under 2 minutes'],
    commonMistakes: ['Reading from resume', 'Not quantifying achievements', 'Being too detailed', 'Not connecting to the role', 'Going over 2 minutes'],
    sampleAnswer: "I'm a software engineer with 3 years of experience. At my current company, I built a real-time analytics dashboard serving 10K+ daily users, reducing report generation time by 60%. Before that, I led a 4-person capstone project building an AI-powered study tool. I'm looking to bring my full-stack skills to a role where I can work on scalable systems.",
    followUpQuestions: ['What\'s your proudest achievement?', 'Why are you leaving your current role?', 'What unique skills do you bring?'],
    estimatedTime: '2 Minutes',
  },
  {
    category: 'Mock Interview', title: 'Why should we hire you?',
    howToAnswer: 'Map your specific skills to their needs. Show you understand the role requirements and demonstrate how your experience directly applies.',
    keyPoints: ['Reference specific job requirements', 'Provide concrete examples', 'Show unique value proposition', 'Demonstrate cultural fit', 'Be confident but not arrogant'],
    commonMistakes: ['Being too generic', 'Not referencing the job description', 'Bragging without evidence', 'Not showing enthusiasm', 'Comparing to other candidates'],
    sampleAnswer: "You need someone who can build scalable systems and collaborate across teams. I have production experience with distributed systems, a track record of shipping features under tight deadlines, and I thrive in collaborative environments. My experience with microservices migration directly matches your team's current technical challenges.",
    followUpQuestions: ['What would you do in your first 90 days?', 'How do you handle disagreements?', 'What\'s your management style?'],
    estimatedTime: '2 Minutes',
  },
  {
    category: 'Mock Interview', title: 'Describe a project you are most proud of',
    howToAnswer: 'Choose a project with technical depth and measurable impact. Explain the problem, your approach, technical decisions, and results.',
    keyPoints: ['Explain the problem clearly', 'Describe your technical approach', 'Highlight difficult decisions', 'Share measurable impact', 'Discuss what you learned'],
    commonMistakes: ['Choosing a trivial project', 'Not explaining technical depth', 'Not quantifying impact', 'Taking all credit in a team project', 'Not mentioning challenges'],
    sampleAnswer: "I built a real-time collaboration tool for my capstone. Used WebSockets for live sync, CRDTs for conflict resolution, and deployed on AWS with auto-scaling. It supported 50 concurrent users with less than 100ms latency. The hardest part was handling network partitions gracefully. It taught me the importance of choosing the right data structures for real-world constraints.",
    followUpQuestions: ['What would you do differently?', 'What was the hardest technical decision?', 'How did you test it?'],
    estimatedTime: '3 Minutes',
  },
];

const allQuestionBank = [
  ...codingQuestions,
  ...systemDesignQuestions,
  ...technicalQuestions,
  ...hrQuestions,
  ...behavioralQuestions,
  ...mockInterviewQuestions,
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function generateQuestions(setup) {
  try {
    const res = await fetch('/api/interview/generate-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(setup),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        return data.questions.map((q, i) => ({
          ...q,
          id: `ai-${Date.now()}-${i}`,
          isCompleted: false,
          isBookmarked: false,
          userRating: 0,
        }));
      }
    }
  } catch (e) {
    console.warn('AI question generation failed, using mock data:', e.message);
  }

  const { interviewType, difficulty, count } = setup;
  let pool = [...allQuestionBank];

  if (interviewType !== 'mixed') {
    const typeMap = {
      technical: 'Technical',
      hr: 'HR',
      behavioral: 'Behavioral',
      'system-design': 'System Design',
      coding: 'Coding',
    };
    const cat = typeMap[interviewType];
    if (cat) {
      pool = pool.filter(q => q.category === cat);
    }
  }

  if (difficulty && difficulty !== 'company') {
    const diffLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    const filtered = pool.filter(q => q.difficulty === diffLabel);
    if (filtered.length >= count) pool = filtered;
  }

  if (pool.length === 0) pool = [...allQuestionBank];

  const shuffled = shuffle(pool);
  return shuffled.slice(0, Math.min(count, shuffled.length)).map((q, i) => ({
    ...q,
    id: `gen-${Date.now()}-${i}`,
    isCompleted: false,
    isBookmarked: false,
    userRating: 0,
  }));
}

export const loadingMessages = [
  'Generating personalized questions...',
  'Analyzing your role...',
  'Preparing technical questions...',
  'Preparing HR questions...',
  'Generating answer strategies...',
  'Creating interview kit...',
];
