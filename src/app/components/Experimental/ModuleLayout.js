import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faComment, faXmark, faQuestion } from "@fortawesome/free-solid-svg-icons";
// import ExampleLayout from "@/app/components/Experimental/ExampleLayout";
import FloatingChat from "@/app/components/Experimental/FloatingChat";
import NoteParentLayout from "@/app/components/Experimental/NoteParentLayout";
import SecondNoteParentLayout from "@/app/components/Experimental/SecondNoteParentLayout";
import TypeWriter from "@/app/components/Experimental/TypeWriter";


// Course Module List
const course_syllabus_list = [

    {
        "id": '509266a3-2c78-47f1-93ab-1080e8761404',
        "chapter_number": 2,
        "chapter_name": "Variables and Data Types",
        "chapter_description": "This chapter introduces and explains the concept of variables and common data types in Python.",

        "module_list": [
            {
                "module_number": 1,
                "module_name": "Introduction to Running Python Programs",
                "notes": "This module introduces the basics of running a Python script. We look at how a simple script like 'hello_world.py' is executed by Python. Python interprets the code line by line and prints output on the console. Understanding the role of the Python interpreter and syntax highlighting in code editors is also covered.",
                "examples": [
                    {
                        "description": "Running a simple Python program.",
                        "code": "print(\"Hello Python world!\")"
                    },
                    {
                        "description": "Observing syntax highlighting in an editor.",
                        "code": "message = \"Hello World!\"\nprint(message)"
                    }
                ],
                "exercises": [
                    {
                        "question": "Create a Python file named 'greet.py' and write a program to print 'Hello, Python Learner!'.",
                        "difficulty": "Beginner"
                    },
                    {
                        "question": "What is syntax highlighting, and how does it help in writing Python programs?",
                        "difficulty": "Beginner"
                    }
                ]
            },

            {
                "module_number": 2,
                "module_name": "Understanding Variables in Python",
                "notes": "This module explains what variables are in Python and how they are used to store data. Variables can hold a value, and this value can be changed or updated in the program. The module also covers how Python handles variable reassignment and offers rules for naming variables.",
                "examples": [
                    {
                        "description": "Using variables to store a message and printing it.",
                        "code": "message = \"Hello Python world!\"\nprint(message)"
                    },
                    {
                        "description": "Changing the value of a variable and printing it again.",
                        "code": "message = \"Hello Python World!\"\nprint(message)\n\nmessage = \"Hello Python Enthusiasts!\"\nprint(message)"
                    }
                ],
                "exercises": [
                    {
                        "question": "What rules must be followed when naming variables in Python?",
                        "difficulty": "Beginner"
                    },
                    {
                        "question": "Create a program that stores your favorite quote in a variable and prints it two times, changing the variable’s value once.",
                        "difficulty": "Beginner"
                    }
                ]
            },

            {
                "module_number": 3,
                "module_name": "Working with Strings",
                "notes": "In this module, you learn what strings are and how to use them in Python programs. It covers string creation, changing string case using methods like `title()`, `upper()`, and `lower()`, and demonstrates concatenating strings with the '+' operator.",
                "examples": [
                    {
                        "description": "Using string methods to change case.",
                        "code": "name = \"ada lovelace\"\nprint(name.title())\nprint(name.upper())\nprint(name.lower())"
                    },
                    {
                        "description": "Concatenating strings to form complete messages.",
                        "code": "first_name = \"ada\"\nlast_name = \"lovelace\"\nfull_name = first_name + \" \" + last_name\nprint(\"Hello, \" + full_name.title() + \"!\")"
                    }
                ],
                "exercises": [
                    {
                        "question": "Store your first and last name in two variables, then concatenate them to display your full name with a message.",
                        "difficulty": "Beginner"
                    },
                    {
                        "question": "Experiment with different string methods: Convert the string 'Python programming is fun!' to uppercase, lowercase, and titlecase.",
                        "difficulty": "Beginner"
                    }
                ]
            },

            {
                "module_number": 4,
                "module_name": "Dealing with Whitespace in Strings",
                "notes": "This module explains how to handle whitespace in strings using methods like `rstrip()`, `lstrip()`, and `strip()`. It highlights the importance of clean string input and output and shows how to include tabs (`\\t`) and new lines (`\\n`) in strings.",
                "examples": [
                    {
                        "description": "Stripping whitespace from strings.",
                        "code": "favorite_language = 'python '\nprint(favorite_language.rstrip())"
                    },
                    {
                        "description": "Including tabs and newlines in strings.",
                        "code": "print(\"Languages:\n\tPython\n\tJavaScript\")"
                    }
                ],
                "exercises": [
                    {
                        "question": "Create a string with extra spaces and demonstrate the use of `lstrip()`, `rstrip()`, and `strip()` methods.",
                        "difficulty": "Beginner"
                    },
                    {
                        "question": "Print the list of languages you know, formatted with new lines and tabs.",
                        "difficulty": "Beginner"
                    }
                ]
            },

            {
                "module_number": 5,
                "module_name": "Basic Numeric Operations in Python",
                "notes": "This module covers how to perform basic arithmetic operations in Python, such as addition, subtraction, multiplication, division, and exponentiation. It also explains the order of operations and introduces the concept of floating-point numbers.",
                "examples": [
                    {
                        "description": "Performing arithmetic operations.",
                        "code": "print(2 + 3)\nprint(3 - 2)\nprint(2 * 3)\nprint(3 / 2)\nprint(3 ** 2)"
                    },
                    {
                        "description": "Working with floating numbers.",
                        "code": "print(0.2 + 0.1)\nprint(2 * 0.2)"
                    }
                ],
                "exercises": [
                    {
                        "question": "Write a program using arithmetic operations to print four lines resulting in the number 8 (addition, subtraction, multiplication, and division).",
                        "difficulty": "Beginner"
                    },
                    {
                        "question": "Define a variable for your favorite number and print a sentence revealing your favorite number using arithmetic operations.",
                        "difficulty": "Beginner"
                    }
                ]
            },

            {
                "module_number": 6,
                "module_name": "Using Comments in Python Code",
                "notes": "This module highlights the importance of comments in Python code. It explains how comments are written using the `#` symbol and emphasizes the value of using comments to document code for yourself and others.",
                "examples": [
                    {
                        "description": "Writing a simple comment.",
                        "code": "# This line is a comment describing the code below\nprint(\"Hello, World!\")"
                    },
                    {
                        "description": "Documenting a section of code with comments.",
                        "code": "# The following code calculates the square of a number\ndef square(number):\n    return number ** 2\n\nprint(square(3))"
                    }
                ],
                "exercises": [
                    {
                        "question": "Add comments to a program you've written, explaining what the program does. Include your name and the date at the top.",
                        "difficulty": "Beginner"
                    },
                    {
                        "question": "Why are comments useful in programs?",
                        "difficulty": "Beginner"
                    }
                ]
            },

            {
                "module_number": 7,
                "module_name": "Understanding Python Philosophy",
                "notes": "This module discusses the philosophy of Python programming, known as 'The Zen of Python'. Key principles include simplicity, readability, and there's one way to do it. These principles guide Python developers in writing clean, maintainable code.",
                "examples": [
                    {
                        "description": "Reflecting on 'The Zen of Python'.",
                        "code": "import this # Outputs The Zen of Python to the console."
                    }
                ],
                "exercises": [
                    {
                        "question": "While reading 'The Zen of Python', which principles stand out to you and why?",
                        "difficulty": "Beginner"
                    },
                    {
                        "question": "Reflect on a piece of your previous code. How could you apply the principle 'Simple is better than complex'?",
                        "difficulty": "Beginner"
                    }
                ]
            }
        ],

        "quiz_list": [
            {
                'question': "What character is used to initiate a comment in Python?",
                'question_type': "multiple_choice",
                'choice_list': ["@", "//", "#", "\\*"],
                'solution': "#"
            },
            {
                'question': "What is the value of `print(3 + 4 * 2)`?",
                'question_type': "multiple_choice",
                'choice_list': ["14", "11", "10", "None of these"],
                'solution': "11"
            },
            {
                'question': "Which of the following is the correct syntax for printing 'Hello World!' in Python 3?",
                'question_type': "multiple_choice",
                'choice_list': [`print 'Hello World!'`, "`print(\"Hello World!\")`", "`echo \"Hello World!\"`", "`printf \"Hello World!\"`"],
                'solution': "`print(\"Hello World!\")`"
            },
            {
                'question': "What will the following code print?\n\nmessage = 'The Zen of Python'\nprint(message.title())\n",
                'question_type': "multiple_choice",
                'choice_list': [`the zen of python`, `THE ZEN OF PYTHON`, `The Zen Of Python`, `the Zen Of Python`],
                'solution': `The Zen Of Python`
            },
            
            {
                "question": "Write a program that uses two predefined variables: `first_name` and `last_name`, then prints a message greeting the user using their full name in titlecase.",
                'question_type': "programming_exercise",
                "solution": "first_name = 'John'\nlast_name = 'Doe'\nfull_name = f'{first_name} {last_name}'\ngreeting = full_name.title()\nprint(f'Hello, {greeting}!' )"
            },
            {
                "question": "Store a string with leading, trailing, and extra spaces in a variable. Apply all the different strip methods and print the results.",
                'question_type': "programming_exercise",
                "solution": "string_with_spaces = '  Hello, world!   '\n\n# Using strip() to remove leading and trailing spaces\nprint(string_with_spaces.strip())\n\n# Using lstrip() to remove leading spaces\nprint(string_with_spaces.lstrip())\n\n# Using rstrip() to remove trailing spaces\nprint(string_with_spaces.rstrip())"
            },
            {
                "question": "Demonstrate arithmetic operations resulting in the number 16 with at least 3 different operations.",
                'question_type': "programming_exercise",
                "solution": "result1 = 8 + 8\nresult2 = 32 / 2\nresult3 = 4 * 4\nprint(result1, result2, result3)"
            },
            {
                "question": "Write a program that uses two predefined variables: `name` and `message`, then prints a message to a famous person in history. The message should include the person's name and their quote.",
                'question_type': "programming_exercise",
                "solution": "name = 'Albert Einstein'\nmessage = 'Life is like riding a bicycle. To keep your balance, you must keep moving.'\n\n# Using variables to store the famous person's name and their quote\nprint(f'{name} once said, \"{message}\"')"
            }
        ]
    },

    {
        "id": 'cb6e8ad4-e457-430f-8641-1241c4d93f2d',
        "chapter_number": 3,
        "chapter_name": "Lists",
        "chapter_description": "This chapter introduces and explains the concept of lists in Python.",

        "module_list": [
            {
                "module_number": 1,
                "module_name": "Introduction to Lists",
                "order": [

                    {
                        "title": "What is a List?",
                        "description": "So, **what is a list?** Think of a list like a container where you can keep a bunch of items in a specific order. So, if you're building a card game like poker, you might want to keep track of a deck of cards, and the order of those cards matters. Here's an example..",
                        "key_points": [
                            "A list is just a collection of things that are ordered (so the order *counts*! 👀).",
                            "Lists let you group multiple items into one variable (like a deck of cards).",
                            "In Python, we define a list using square brackets `[]`."
                        ],
                        "example": "[1, 2, 3, 4]",
                        "try_it": "Try creating your own list on the IDE to the right with 3 numbers of your choice and print it out. Remember, use square brackets and separate the items with commas."
                    },

                    {
                        "title": "How to Create a List",
                        "description": "Creating a list in Python is pretty simple. You just need to use square brackets `[]`, and separate your items with commas. For example, imagine you're starting a simple list of cards for a game. You might just put numbers, like this: [1, 2, 5, 3, 4, 'Ace', 'King']",
                        "key_points": [
                            "Use square brackets `[]` to create your list.",
                            "Items inside the list are separated by commas.",
                            "The items can be anything—numbers, words, or even more lists!"
                        ],
                        "example": "[\"apple\", 1, 3.14, True]",
                        "try_it": "Try creating a list with 3 different types of items—like a string, an integer, and a float—and print it out."
                    },

                    {
                        "title": "Lists Can Hold Different Types of Items",
                        "description": "To expand on the last section examples further, here’s something cool about Python lists: you can store different types of data in the same list! In many other programming languages, you’d need to stick with one type of data per list (like all numbers or all strings). But in Python, you can mix and match—this is super useful when you want to track a variety of things, like card values and suits.",
                        "key_points": [
                            "Lists in Python are flexible — different types of items can live in the same list.",
                            "You could mix numbers, strings, booleans, etc. in one list. Imagine a list with card values and suits!",
                            "This is way easier than some other languages where you’d need separate arrays for different types."
                        ],
                        "example": "[1, \"banana\", 3.14, False, 'Ace', 42, 'Game of Life']",
                        "try_it": "Try creating a list with 4 items: a number, a string, a boolean, and a float. Print your list to see how Python handles the mix of types."
                    },

                    {
                        "title": "Lists are Ordered",
                        "description": "One important thing to know is that **order matters** in lists. So, if you're creating a deck of cards for a game, the order of the cards will stay the same unless you change it. This could be really useful when you need to shuffle a deck or pick cards from a specific spot.",
                        "key_points": [
                          "The items in a list stay in the same order you put them in.",
                          "You can access any item in the list by its position, or **index**. The first item is at position 0, the second at position 1, and so on."
                        ],
                        "example": "[\"apple\", \"banana\", \"cherry\"]",
                        "indexing_example": "\"If you want the first item, it's at index 0. So `list[0]` will give you 'apple'.\"",
                        "try_it": "Create a list of 5 items (any items you want). Try accessing the first item using `list[0]`, then access the last item using `list[-1]`."
                    },

                    {
                        "title": "Lists are Mutable",
                        "description": "A key thing to know about lists is that they are **mutable**. This just means that you can change them after you create them. Let’s say you make a list of some cards, and you want to swap one of the cards for another—no problem! You can update lists easily.",
                        "key_points": [
                            "You can change the items in a list at any time.",
                            "This is different from other data types in Python (like strings or tuples) that you can’t change after they're created."
                        ],
                        "example": "[1, 2, 3]",
                        "modification_example": "If you do `list[0] = 10`, the list will change to `[10, 2, 3]`.",
                        "try_it": "Create a list of 3 numbers, then change the second number by assigning a new value to `list[1]`. Print the list before and after the change."
                    },

                    {
                        "title": "Quick Recap & Practice",
                        "description": "Okay, let’s recap everything we’ve learned so far. You’ve got a good grasp of what lists are and how they work. Now let’s do a little practice to make sure it sticks!",
                        "key_points": [
                          "Lists are collections of ordered items.",
                          "You can store different types of items in the same list.",
                          "Lists are mutable—meaning you can change them anytime!"
                        ],
                        "exercise": "Create a list with 3 different items: one number, one word, and one boolean. Then, change one of the items in your list. For example, you could change a number to another number or swap a word.",
                        "try_it": "Now that you’ve practiced creating and modifying lists, try to create a list with 5 items (mix up the data types) and change one of the middle items. Print your list before and after the change."
                    }
                      
                ],
                
            },

            {
                "module_name": "Accessing Elements in Lists",
                "notes": "Elements in a list are accessed by their index positions, which start at 0. You can use negative indexes to access elements from the end of a list. Using an index position, you can access, modify, or remove an element from a list.",
                "examples": [
                    {
                        "description": "Access the first and last element of a list.",
                        "code": "bicycles = ['trek', 'cannondale', 'redline', 'specialized']\nprint(bicycles[0])  # First element\nprint(bicycles[-1])  # Last element"
                    },
                    {
                        "description": "Modify the second element in a list and print the new list.",
                        "code": "names = ['Alice', 'Bob', 'Charlie']\nnames[1] = 'Brian'\nprint(names)"
                    }
                ],
                "exercises": [
                    {
                        "question": "Create a list of three cities you would like to visit. Access each city and print a personalized message for it.",
                        "difficulty": "Beginner"
                    },
                    {
                        "question": "Create a list of numbers and print the last two elements using negative indexing.",
                        "difficulty": "Beginner"
                    }
                ]
            },

            {
                "module_name": "Modifying Lists",
                "notes": "Lists in Python can be modified by changing, adding, or removing elements. You can change an element using its index, append new elements to the list, insert elements at a specific position, and remove elements using various methods.",
                "examples": [
                    {
                        "description": "Change an element in a list.",
                        "code": "motorcycles = ['honda', 'yamaha', 'suzuki']\nmotorcycles[0] = 'ducati'\nprint(motorcycles)"
                    },
                    {
                        "description": "Append a new element and insert an element at a specific position.",
                        "code": "motorcycles.append('harley')\nmotorcycles.insert(1, 'bmw')\nprint(motorcycles)"
                    }
                ],
                "exercises": [
                    {
                        "question": "Add a new item to any position in a list of animal names.",
                        "difficulty": "Beginner"
                    },
                    {
                        "question": "Modify all elements in a list of numbers by adding 1 to each element.",
                        "difficulty": "Intermediate"
                    }
                ]
            },

            {
                "module_name": "Removing Elements from Lists",
                "notes": "Python provides several ways to remove elements from a list: using the del statement, the pop() method (which can remove elements at specific positions and also let you use the removed value), and the remove() method (which removes elements by value).",
                "examples": [
                    {
                        "description": "Remove elements using del and pop methods.",
                        "code": "numbers = [0, 1, 2, 3, 4]\ndel numbers[0]\nprint(numbers)\npopped_value = numbers.pop(2)\nprint(numbers)\nprint('Popped value:', popped_value)"
                    },
                    {
                        "description": "Remove an element by value.",
                        "code": "fruits = ['apple', 'banana', 'orange']\nfruits.remove('banana')\nprint(fruits)"
                    }
                ],
                "exercises": [
                    {
                        "question": "Remove a guest from a list of dinner invites according to their name.",
                        "difficulty": "Beginner"
                    },
                    {
                        "question": "Use pop() to simulate a stack and print the popped items.",
                        "difficulty": "Intermediate"
                    }
                ]
            },

            {
                "module_name": "Organizing and Managing Lists",
                "notes": "Lists in Python can be organized using methods like sort() for permanent sorting, sorted() for temporary sorting, and reverse() to reverse the order of elements. The len() function is used to find the length of the list.",
                "examples": [
                    {
                        "description": "Sort a list permanently and temporarily.",
                        "code": "cars = ['bmw', 'audi', 'toyota', 'subaru']\ncars.sort()\nprint(cars)\nprint(sorted(cars, reverse=True))"
                    },
                    {
                        "description": "Reverse and find the length of a list.",
                        "code": "cars.reverse()\nprint(cars)\nprint('Length of list:', len(cars))"
                    }
                ],
                "exercises": [
                    {
                        "question": "Create a list of countries and sort it permanently and temporarily.",
                        "difficulty": "Beginner"
                    },
                    {
                        "question": "Write a program that reverses a list of words and prints their length.",
                        "difficulty": "Intermediate"
                    }
                ]
            },

            {
                "module_name": "Handling Index Errors with Lists",
                "notes": "Index errors occur when trying to access an index that does not exist in the list. Python throws a list index out of range error in such cases. To handle lists dynamically, always ensure that the index you're trying to access is valid, and remember that lists start with an index of 0.",
                "examples": [
                    {
                        "description": "Access an invalid index to demonstrate an IndexError.",
                        "code": "letters = ['a', 'b', 'c']\ntry:\n    print(letters[3])\nexcept IndexError as e:\n    print(e)"
                    },
                    {
                        "description": "Use negative indexing to prevent errors.",
                        "code": "letters = ['a', 'b', 'c']\nprint(letters[-1])"
                    }
                ],
                "exercises": [
                    {
                        "question": "Create a list and attempt to access an index that doesn't exist. Note the error and fix it.",
                        "difficulty": "Beginner"
                    },
                    {
                        "question": "Create a dynamic list and safely access elements that might not exist using condition checks.",
                        "difficulty": "Advanced"
                    }
                ]
            }

        ],

        "quiz_list": [
            {
                "question": "What symbol is used to define a list in Python?",
                'question_type': "multiple_choice",
                "choice_list": ["{}", "[]", "()", "<>"],
                "solution": "[]"
            },
            {
                "question": "If `my_list = ['a', 'b', 'c', 'd']`, what is the result of `my_list[1]`?",
                'question_type': "multiple_choice",
                "choice_list": ["a", "b", "c", "d"],
                "answer": "b"
            },
            {
                "question": "How do you add an element to the end of a list in Python?",
                'question_type': "multiple_choice",
                "choice_list": ["append()", "add()", "insert()", "push()"],
                "answer": "append()"
            },
            {
                "question": "Given `fruits = ['apple', 'banana', 'cherry']`, what will `print(fruits[-1])` output?",
                'question_type': "multiple_choice",
                "choice_list": ["apple", "banana", "cherry", "None"],
                "answer": "cherry"
            },
            {
                "question": "Which method would you use to permanently sort a list in Python?",
                'question_type': "multiple_choice",
                "choice_list": ["sort()", "sorted()", "order()", "arrange()"],
                "answer": "sort()"
            },
            {
                "question": "What will be the output of the following code?\n\n```python\ncars = ['bmw', 'audi', 'toyota', 'subaru']\ncars.reverse()\nprint(cars)\n```",
                'question_type': "multiple_choice",
                "choice_list": ["['bmw', 'audi', 'toyota', 'subaru']", "['subaru', 'toyota', 'audi', 'bmw']", "['audi', 'bmw', 'subaru', 'toyota']", "['toyota', 'subaru', 'audi', 'bmw']"],
                "answer": "['subaru', 'toyota', 'audi', 'bmw']"
            },

            {
                "question": "Write a function `get_last_element()` that takes a list and returns its last element without using negative indexing.",
                "question_type": "programming_exercise",
                "solution": "def get_last_element(lst):\n    # Ensure the list is not empty\n    if len(lst) == 0:\n        return None  # or raise an exception depending on requirements\n    # Return the last element using len() to access the last index\n    return lst[len(lst) - 1]\n\n# Test the function\nexample_list = [10, 20, 30, 40, 50]\nprint(get_last_element(example_list))  # Output: 50"
            },

            {
                "question": "Write a function `reverse_list()` that takes a list and returns the list in reverse order, without using the `reverse()` method or slicing.",
                "question_type": "programming_exercise",
                "solution": "def reverse_list(lst):\n    reversed_lst = []\n    # Iterate through the list in reverse order using a for loop\n    for i in range(len(lst) - 1, -1, -1):\n        reversed_lst.append(lst[i])\n    return reversed_lst\n\n# Test the function\nexample_list = [10, 20, 30, 40, 50]\nprint(reverse_list(example_list))  # Output: [50, 40, 30, 20, 10]"
            },

            {
                "question": "Write a function `get_middle_element()` that takes a list and returns the middle element. If the list has an even number of elements, return the first of the two middle elements.",
                "question_type": "programming_exercise",
                "solution": "def get_middle_element(lst):\n    # Check if the list is empty\n    if len(lst) == 0:\n        return None\n    middle_index = len(lst) // 2  # Integer division to find the middle index\n    return lst[middle_index] if len(lst) % 2 != 0 else lst[middle_index - 1]\n\n# Test the function\nexample_list_odd = [10, 20, 30, 40, 50]\nexample_list_even = [10, 20, 30, 40]\nprint(get_middle_element(example_list_odd))  # Output: 30\nprint(get_middle_element(example_list_even))  # Output: 20"
            }
        ]

    }

];


const ModuleLayout = ({ module_id }) => {

    const [isChatOpen, setIsChatOpen] = useState(false);
    const chatRef = useRef(null);

    const [currentModuleInfoDict, setCurrentModuleInfoDict] = useState({});
    const [currentSubModuleFullList, setCurrentSubModuleFullList] = useState([]);
    
    const [currentSubModuleOrderIndex, setCurrentSubModuleOrderIndex] = useState(0);
    const [currentSubModule, setCurrentSubModule] = useState({});
    const [currentSubModuleMaterialDict, setCurrentSubModuleMaterialDict] = useState({});
    const [nextType, setNextType] = useState(null);

    // Initial State Loading
    const [isLoading, setLoading] = useState(true);


    const handleClickOutside = (event) => {
        if (chatRef.current && !chatRef.current.contains(event.target)) {
            setIsChatOpen(false);
        }
    };

    const handleSubModuleNextClick = async () => {

        let current_idx = currentSubModuleOrderIndex + 1;
        console.log('current_idx', current_idx);
        setCurrentSubModuleOrderIndex(current_idx);

        let li = currentSubModuleFullList;
        console.log('current-li:', li[current_idx]);
        setCurrentSubModule(li[current_idx]);

        // set to first
        let first_info = li[0]['order'][current_idx];
        console.log('tmp-first-info-new:', first_info);
        setCurrentSubModuleMaterialDict(first_info);
       
        // console.log('first_info:', first_info);
        // setCurrentSubModuleMaterialDict(first_info);        

        // // next type
        // let next_type = li[current_idx]['order'][1]['type'];
        // console.log('next-type:', next_type);
        // setNextType(next_type);

    };


    useEffect(() => {
        if (isChatOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isChatOpen]);


    useEffect(() => {

        console.log('MODULE ID:', module_id);

        let module_dict = course_syllabus_list[module_id];
        console.log('module-dict:', module_dict);

        setCurrentModuleInfoDict({
            id: module_dict['id'],
            chapter_number: module_dict['chapter_number'],
            chapter_name: module_dict['chapter_name'],
            chapter_description: module_dict['chapter_description']
        });

        let current_sub_module_list = module_dict['module_list'];
        setCurrentSubModuleFullList(current_sub_module_list);

        // Always start at first sub-module (unless otherwise specifed from backend)
        let current_sub_module_index = 0;
        setCurrentSubModuleOrderIndex(current_sub_module_index);
        setCurrentSubModule(current_sub_module_list[current_sub_module_index]);

        // Start and show the first information dict in the order list
        let first_material_to_present = current_sub_module_list[current_sub_module_index]['order'][0];
        console.log('first_material_to_present:', first_material_to_present);
        setCurrentSubModuleMaterialDict(first_material_to_present);

        let next_material_to_present = current_sub_module_list[current_sub_module_index]['order'][1]['type'];
        console.log('next-type:', next_material_to_present);
        setNextType(next_material_to_present);

        // TODO: 
        setLoading(false);

        // let first_info = current_sub_module_list[0]['order'][0];
        // console.log('first_info:', first_info);
        // setCurrentSubModuleMaterialDict(first_info);

        // // id: '509266a3-2c78-47f1-93ab-1080e8761404',
        // // chapter_number: 2,
        // // chapter_name: "Variables and Data Types",
        // // chapter_description: "This chapter introduces and explains the concept of variables and common data types in Python."
        
        // console.log('current-sub-mod-dict:', current_sub_module_list[0]);
        // setCurrentSubModule(current_sub_module_list[0]);
        
        // // set to first
        // let first_info = current_sub_module_list[0]['order'][0];
        // console.log('first_info:', first_info);
        // setCurrentSubModuleMaterialDict(first_info);

        // let next_type = current_sub_module_list[0]['order'][1]['type'];
        // console.log('next-type:', next_type);
        // setNextType(next_type);

    }, [module_id]);


    if (isLoading === true) return(
        <span>Loading</span>
    );

    return (

        // items-center
        <div className="flex flex-col min-h-screen mt-12 ml-44">

            {/* Top Header */}
            <div className="flex justify-between w-full max-w-5xl py-2 border-b border-gray-300">

                {/* Current Chapter and Title */}
                <div className="text-left flex text-[16px] tracking-normal">
                    <h1 className="font-semibold text-gray-900">Chapter {currentModuleInfoDict.chapter_number}: {currentModuleInfoDict.chapter_name}</h1>
                    <span className="px-2">
                    |
                    </span>
                    <p className="text-gray-500 text-[14px] pt-0.5">
                       Current Module {currentSubModule.module_number}: {currentSubModule.module_name}
                    </p>
                    {/* <p className="text-gray-600 pl-2 text-[15px]">{currentModuleInfoDict.chapter_name}</p> */}
                </div>
                {/* "chapter_number": 3,
        "chapter_name": "Lists", */}

                {/* Next Chapter */}
                {/* <div className="text-right flex text-[15px] tracking-normal">
                    <h1 className="text-gray-900 hover:text-blue-400 cursor-pointer">
                        Next Chapter <FontAwesomeIcon icon={faArrowRight} className="pl-1 text-[14px]" />
                    </h1>
                </div> */}

            </div>

            <div>

                {/* Notes Section */}
                <div className="w-full max-w-full mt-6">
                    {/* <h3 className="text-[18px] tracking-normal font-semibold text-gray-800 mb-6">
                        Module: {currentSubModule.module_name}
                    </h3> */}

                    <SecondNoteParentLayout
                        chapterDict={currentModuleInfoDict}
                        noteDict={currentSubModuleMaterialDict}
                    />

                    {/* <TypeWriter text={"Testing One"} /> */}
                    {/* Testing One */}
                    
                </div>

                {/* <div className="mt-8 text-center space-x-4">
                    <button
                        type="button"
                        className="py-3 px-7 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >                        
                        Question
                        <FontAwesomeIcon icon={faQuestion} className="pl-1" />
                    </button>

                    <button
                        type="button"
                        className="py-3 px-7 me-2 mb-2 text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        onClick={handleSubModuleNextClick}
                    >
                        
                        {(nextType === "example") ? (

                            <>                                
                                <span>
                                See an Example
                                </span>
                                <FontAwesomeIcon
                                    icon={faArrowRight}
                                    className="pl-1"                                
                                />
                            </>

                        ) : (
                            
                            (nextType === 'exercise') ? (

                                <>
                                    <FontAwesomeIcon
                                        icon={faArrowRight}
                                        className="pl-1"                                
                                    />
                                    <span>
                                    Proceed to Exercise
                                    </span>
                                </>

                            ) : (

                                (nextType === 'notes') ? (

                                    <>
                                        <FontAwesomeIcon
                                            icon={faArrowRight}
                                            className="pl-1"                                
                                        />
                                        <span>
                                        Proceed to Next Note
                                        </span>
                                    </>

                                ) : (
                                    null
                                )

                            ) 
                        )}

                    </button>
                   
                </div> */}

            </div>
            
            {/* Chat Interface */}
            <FloatingChat />

        </div>

    )

};

export default ModuleLayout;