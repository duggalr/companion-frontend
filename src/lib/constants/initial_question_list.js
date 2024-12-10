export const INITIAL_QUESTION_LIST = [
    {
        'name': 'Find Palindromic Substrings',
        'question': 'Write a function that finds all palindromic substrings in a given string.',
        'input_output_list': [
            { 'input': '"abba"', 'output': '["a", "b", "bb", "abba"]' },
            { 'input': '"racecar"', 'output': '["r", "a", "c", "e", "cec", "aceca", "racecar"]' },
            { 'input': '"abc"', 'output': '["a", "b", "c"]' }
        ],
        'starter_code': `def find_palindromic_substrings(s: str) -> list:
    raise NotImplementedError`,
        'solution': `
def find_palindromic_substrings(s: str) -> list:p
    def expand_around_center(left: int, right: int):
        while left >= 0 and right < len(s) and s[left] == s[right]:
            palindromes.append(s[left:right+1])
            left -= 1
            right += 1

    palindromes = []
    for i in range(len(s)):
        expand_around_center(i, i)       # Odd-length palindromes
        expand_around_center(i, i + 1)  # Even-length alindromes
    return palindromes
`,
        'time_complexity': 'O(n^2)',
        'test_case_list': [
            { 'input': '"abba"', 'expected_output': ["a", "b", "bb", "abba"] },
            { 'input': '"racecar"', 'expected_output': ["r", "a", "c", "e", "cec", "aceca", "racecar"] },
            { 'input': '"abc"', 'expected_output': ["a", "b", "c"] },
            { 'input': '"a"', 'expected_output': ["a"] },
            { 'input': '""', 'expected_output': [] },
            { 'input': '"madamimadam"', 'expected_output': ["m", "a", "d", "madam", "a", "m", "i", "madamimadam", "a", "d", "madam", "a", "m"] },
            { 'input': '"xyzzyx"', 'expected_output': ["x", "y", "z", "zz", "yzz", "xyzzyx"] },
            { 'input': '"noonracecar"', 'expected_output': ["n", "o", "noon", "o", "n", "r", "a", "c", "e", "cec", "aceca", "racecar"] },
            { 'input': '"abcbabcba"', 'expected_output': ["a", "b", "c", "bcb", "abcba", "bcbabcba", "b", "a"] },
            { 'input': '"xyzyxxyzz"', 'expected_output': ["x", "y", "z", "yzy", "xyzyx", "x", "y", "zz", "xyzz"] }
        ]
    },

    {
        'name': 'String Compression',
        'question': 'Implement a function that compresses a string using the counts of repeated characters (e.g., "aaabb" -> "a3b2").',
        'input_output_list': [
            { 'input': '"aaabb"', 'output': '"a3b2"' },
            { 'input': '"abc"', 'output': '"a1b1c1"' },
            { 'input': '"aaAAaa"', 'output': '"a2A2a2"' }
        ],
        'starter_code': `def compress_string(s: str) -> str:
    raise NotImplementedError`,
        'solution': `
def compress_string(s: str) -> str:
    if not s:
        return ""
    compressed = []
    count = 1
    for i in range(1, len(s)):
        if s[i] == s[i - 1]:
            count += 1
        else:
            compressed.append(s[i - 1] + str(count))
            count = 1
    compressed.append(s[-1] + str(count))
    return "".join(compressed)
`,
        'time_complexity': 'O(n)'
    },

    {
        'name': 'Longest Common Prefix',
        'question': 'Write a function to find the longest common prefix among an array of strings.',
        'input_output_list': [
            { 'input': '["flower", "flow", "flight"]', 'output': '"fl"' },
            { 'input': '["dog", "racecar", "car"]', 'output': '""' },
            { 'input': '["interview", "interval", "integral"]', 'output': '"inte"' }
        ],
        'starter_code': `def longest_common_prefix(strs: list) -> str:
    raise NotImplementedError`,
        'solution': `
def longest_common_prefix(strs: list) -> str:
    if not strs:
        return ""
    prefix = strs[0]
    for string in strs[1:]:
        while string[:len(prefix)] != prefix and prefix:
            prefix = prefix[:-1]
    return prefix
`,
        'time_complexity': 'O(S)  // where S is the sum of all characters in the array',  
    },
    {
        'name': 'Evaluate Postfix Expression',
        'question': 'Create a function to evaluate a postfix expression (e.g., "3 4 + 2 *" -> 14).',
        'input_output_list': [
            { 'input': '"3 4 +"', 'output': '7' },
            { 'input': '"3 4 + 2 *"', 'output': '14' },
            { 'input': '"5 1 2 + 4 * + 3 -" ', 'output': '14' }
        ],
        'starter_code': `def evaluate_postfix(expression: str) -> int:
    raise NotImplementedError`,
        'solution': `
def evaluate_postfix(expression: str) -> int:
    stack = []
    for token in expression.split():
        if token.isdigit():
            stack.append(int(token))
        else:
            b = stack.pop()
            a = stack.pop()
            if token == '+':
                stack.append(a + b)
            elif token == '-':
                stack.append(a - b)
            elif token == '*':
                stack.append(a * b)
            elif token == '/':
                stack.append(int(a / b))
    return stack.pop()
`,
        'time_complexity': 'O(n)'
    },
    {
        'name': 'Smallest Window Containing All Characters',
        'question': 'Write a function to find the smallest window in a string containing all characters of another string.',
        'input_output_list': [
            { 'input': '"ADOBECODEBANC", "ABC"', 'output': '"BANC"' },
            { 'input': '"this is a test string", "tist"', 'output': '"t stri"' },
            { 'input': '"geeksforgeeks", "ork"', 'output': '"ksfor"' }
        ],
        'starter_code': `def min_window(s: str, t: str) -> str:
    raise NotImplementedError`,
        'solution': `
from collections import Counter

def min_window(s: str, t: str) -> str:
    if not t or not s:
        return ""
    t_count = Counter(t)
    current_count = Counter()
    left = 0
    min_len = float('inf')
    result = ""
    for right in range(len(s)):
        current_count[s[right]] += 1
        while all(current_count[char] >= t_count[char] for char in t_count):
            if right - left + 1 < min_len:
                min_len = right - left + 1
                result = s[left:right+1]
            current_count[s[left]] -= 1
            left += 1
    return result
`,
        'time_complexity': 'O(n)'
    },
    {
        'name': 'Group Anagrams',
        'question': 'Implement a function to group anagrams from an array of strings.',
        'input_output_list': [
            { 'input': '["eat", "tea", "tan", "ate", "nat", "bat"]', 'output': '[["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]' },
            { 'input': '[""]', 'output': '[[""]]' },
            { 'input': '["a"]', 'output': '[["a"]]' }
        ],
        'starter_code': `def group_anagrams(strs: list) -> list:
    raise NotImplementedError`,
        'solution': `
from collections import defaultdict

def group_anagrams(strs: list) -> list:
    anagrams = defaultdict(list)
    for string in strs:
        sorted_string = ''.join(sorted(string))
        anagrams[sorted_string].append(string)
    return list(anagrams.values())
`,
        'time_complexity': 'O(n * k log k)'  // n = number of strings, k = max length of a string
    },
    {
        'name': 'Run-Length Decoding',
        'question': 'Create a function to perform a run-length decoding of a string (e.g., "a3b2" -> "aaabb").',
        'input_output_list': [
            { 'input': '"a3b2c1"', 'output': '"aaabbc"' },
            { 'input': '"x5y2"', 'output': '"xxxxxyy"' },
            { 'input': '"z1"', 'output': '"z"' }
        ],
        'starter_code': `def run_length_decode(s: str) -> str:
    raise NotImplementedError`,
        'solution': `
def run_length_decode(s: str) -> str:
    decoded = []
    i = 0
    while i < len(s):
        char = s[i]
        i += 1
        num = 0
        while i < len(s) and s[i].isdigit():
            num = num * 10 + int(s[i])
            i += 1
        decoded.append(char * num)
    return ''.join(decoded)
`,
        'time_complexity': 'O(n)'
    },
    {
        'name': 'Valid Number Check',
        'question': 'Write a function to determine if a string is a valid number (e.g., "123", "-123.45", "1e10").',
        'input_output_list': [
            { 'input': '"123"', 'output': 'true' },
            { 'input': '"-123.45"', 'output': 'true' },
            { 'input': '"1e10abc"', 'output': 'false' }
        ],
        'starter_code': `def is_valid_number(s: str) -> bool:
    raise NotImplementedError`,
        'solution': `
def is_valid_number(s: str) -> bool:
    try:
        float(s)
        return True
    except ValueError:
        return False
`,
        'time_complexity': 'O(1)'
    },
    {
        'name': 'Rotate String Left',
        'question': 'Create a function that rotates a string left by `k` characters (e.g., "abcdef", k=2 -> "cdefab").',
        'input_output_list': [
            { 'input': '"abcdef", 2', 'output': '"cdefab"' },
            { 'input': '"xyz", 4', 'output': '"yzx"' },
            { 'input': '"rotation", 0', 'output': '"rotation"' }
        ],
        'starter_code': `def rotate_string_left(s: str, k: int) -> str:
    raise NotImplementedError`,
        'solution': `
def rotate_string_left(s: str, k: int) -> str:
    k %= len(s)
    return s[k:] + s[:k]
`,
        'time_complexity': 'O(n)'
    },
    {
        'name': 'Check Isomorphic Strings',
        'question': 'Implement a function to check if two strings are isomorphic (e.g., "egg" and "add").',
        'input_output_list': [
            { 'input': '"egg", "add"', 'output': 'true' },
            { 'input': '"foo", "bar"', 'output': 'false' },
            { 'input': '"paper", "title"', 'output': 'true' }
        ],
        'starter_code': `def are_isomorphic(s1: str, s2: str) -> bool:
    raise NotImplementedError`,
        'solution': `
def are_isomorphic(s1: str, s2: str) -> bool:
    if len(s1) != len(s2):
        return False
    mapping_s1 = {}
    mapping_s2 = {}
    for c1, c2 in zip(s1, s2):
        if mapping_s1.get(c1, c2) != c2 or mapping_s2.get(c2, c1) != c1:
            return False
        mapping_s1[c1] = c2
        mapping_s2[c2] = c1
    return True
`,
        'time_complexity': 'O(n)'
    }
];