import React, { useState, useRef, useEffect } from 'react';
import 'aos/dist/aos.css'; // Import AOS styles
import AOS from 'aos';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faXmark } from "@fortawesome/free-solid-svg-icons";
import { getFromLocalStorage, saveToLocalStorage, removeFromLocalStorage } from '@/lib/utils/localStorageUtils';
import DashboardTopNavBar from "@/app/components/Experimental/DashboardTopNavBar";
import { Progress } from "@/components/ui/progress";


const CourseHomeLayout = () => {

    // Course Module List
    const course_syllabus_list = [
        {
            "id": '509266a3-2c78-47f1-93ab-1080e8761404',
            "chapter_name": "Chapter 2: Variables and Data Types",
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
            "chapter_name": "Chapter 3: Lists",
            "chapter_description": "This chapter introduces and explains the concept of lists in Python.",

            "module_list": [
                {
                    "module_name": "Introduction to Lists in Python",
                    "notes": "A list is a collection of items in a particular order. Lists allow you to store multiple items in a single variable and are defined by square brackets `[]`. Unlike arrays in many other programming languages, Python lists can contain elements of different types. Lists are mutable, meaning their content can be changed after their creation.",
                    "examples": [
                        {
                            "description": "Create a simple list of bicycle brands.",
                            "code": "bicycles = ['trek', 'cannondale', 'redline', 'specialized']\nprint(bicycles)"
                        },
                        {
                            "description": "Using lists to store numeric and mixed data types.",
                            "code": "mixed_list = [1, 'apple', 3.14, True]\nprint(mixed_list)"
                        }
                    ],
                    "exercises": [
                        {
                            "question": "Create a list of your favorite fruits and print the entire list.",
                            "difficulty": "Beginner"
                        },
                        {
                            "question": "Create a list that contains a combination of strings, integers, and floats. Print the list and verify the types of each element.",
                            "difficulty": "Beginner"
                        }
                    ]
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

        },

    ];

    const [showSubModules, setShowSubModules] = useState(false);
    const [showSubModulesIDList, setShowSubModulesIDList] = useState([]);

    const addToModuleIdList = (index) => {

        setShowSubModulesIDList(prevState => {
            if (!prevState.includes(index)) {
                return [...prevState, index];
            }
            return prevState;
        });
    };

    const removeFromModuleIdList = (index) => {
        setShowSubModulesIDList(prevState => {
            return prevState.filter(item => item !== index);
        });
    };


    const [courseMetaData, setCourseMetaData] = useState({});
    const [courseCompletedModuleList, setCourseCompletedModuleList] = useState([]);
    const [isCourseGenerating, setIsCourseGenerating] = useState(false);
    const [courseGenerationProgress, setCourseGenerationProgress] = useState(null);

    const _handleUserCourseModuleFetch = async () => {

        let anon_user_id = getFromLocalStorage('user_id');
        const payload = {'user_id': anon_user_id};

        const apiResponse = await fetch(`http://127.0.0.1:8000/fetch_user_course_details`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        const response_data = await apiResponse.json();
        console.log('Response Data:', response_data);        

        if (response_data['success'] === true){
            let user_course_rv_dict = response_data['user_course_object'];
            let is_course_generating = user_course_rv_dict['is_course_generating'];

            // TODO: first update the course module state and then update the is-generating stuff

            setCourseMetaData({
                "course_name": user_course_rv_dict['course_name'],
                "course_description": user_course_rv_dict['course_description'],
                "is_course_generating": user_course_rv_dict['is_course_generating']
            });

            setCourseCompletedModuleList(user_course_rv_dict['current_course_module_list']);

            if (is_course_generating === true){

                setIsCourseGenerating(true);

                const interval = setInterval(async () => {
                    const response = await fetch(`http://127.0.0.1:8000/course-gen-task-status/${task_id}`);
                    const data = await response.json();
                    console.log('Course Status Data:', data);

                    setCourseGenerationProgress(data.progress);

                    const updated_course_data = data['user_course_object'];

                    setCourseMetaData({
                        "course_name": updated_course_data['course_name'],
                        "course_description": updated_course_data['course_description'],
                        "is_course_generating": updated_course_data['is_course_generating']
                    });
                    setCourseCompletedModuleList(updated_course_data['current_course_module_list']);
        
                    if (data.state === "SUCCESS" || data.state === "FAILURE") {
                        clearInterval(interval);
                        setIsCourseGenerating(false);
                        setCourseGenerationProgress(100);
                    }

                }, 2000); // Poll every second
        
                // TODO: test out and fix all bugs; etc. + finalize
                return () => clearInterval(interval);

            }

        }

    };

    // handle animations
    useEffect(() => {

        // Initial Animations
        AOS.init({
            duration: 1000, // Animation duration in milliseconds
            once: true,     // Trigger animation only once
        });

    }, []);


    // TODO: handle course fetch
    useEffect(() => {

        // Fetch the course modules for the user
        _handleUserCourseModuleFetch();

    }, []);


    return (

        <>

            {/* Dashboard Top NavBar */}
            <DashboardTopNavBar />

            {/* Course Home Layout */}
            {/* TODO: finalize UI and finish (1) and proceed to (2) */}

            {/* max-w-[1100px] */}
            {/* <div className="flex flex-col min-h-screen mt-8"> */}
            <div className="flex flex-col items-start min-h-screen mt-8 mx-auto w-[80%] sm:w-[63%]">

                {/* <h1 className="mb-4 text-[24px] font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">
                    Python Fundamentals for Card Game Development
                </h1>
                <Progress value={33} /> */}
                {/* <div className="flex items-center justify-between"> */}
                    <h1
                        className="mb-4 text-[26px] font-extrabold leading-none tracking-tight text-gray-900 dark:text-white"
                        data-aos="fade-down"
                    >
                        {/* Mastering Python for Card Game Development: The War Edition! 🎯 */}
                        🎯 {courseMetaData.course_name}
                    </h1>

                    <p
                        className="text-gray-400 text-[15px] leading-8 mb-2 mt-1 pr-10"
                        data-aos="fade-down"
                    >
                        {/* We&apos;ll start by sharpening your existing skills and then dive into the core concepts necessary for implementing class-based structures and game logic. 🚀 */}
                        {courseMetaData.course_description}
                    </p>

                    <div 
                        className="flex items-center space-x-2 pt-4 mb-0"
                        data-aos="fade-down"
                    >
                        <span className="text-gray-800 dark:text-white text-[13px] font-medium">
                            Your Course Progress: (2%)
                        </span>
                        <Progress value={2} className="w-40" />

                        {
                            (isCourseGenerating === true) && (
                                <>
                                    <span className='px-1 text-[12px]'>|</span>
                                    <span className="text-gray-800 dark:text-white text-[13px] font-medium">
                                        AI Course Generation Progress: (33%)
                                    </span>
                                    <Progress value={courseGenerationProgress} className="w-40" />
                                </>
                            )
                        }

                        {/* <span className="text-gray-600 dark:text-white text-[13px] font-normal">33%</span> */}                        
                    </div>
                {/* </div> */}

                <hr className="h-px mt-4 bg-gray-300 border-1 dark:bg-gray-700 w-[95%]"data-aos="fade-up" />

                {/* <p
                    className="text-gray-400"
                >
                    We'll start by sharpening your existing skills and then dive into the core concepts necessary for implementing class-based structures and game logic. 🚀
                </p> */}

                {/* Course Syllabus List */}
                <ol 
                    className="relative border-s border-gray-200 dark:border-gray-700 mt-8"
                    data-aos="fade-in"
                >
                    {/* {course_syllabus_list.map((item, index) => ( */}
                    {courseCompletedModuleList.map((item, index) => (
                        <li
                            className="mb-8 ms-4"
                            key={item.parent_module_object_id}
                        >
                            <div
                                className="absolute w-4 h-4 bg-gray-200 rounded-full mt-1.5 -start-2 border border-white dark:border-gray-900 dark:bg-gray-700"
                            ></div>

                            <a
                                className="cursor-pointer"
                                href={`/learn-python/module/${item.parent_module_object_id}`}                                
                            >
                                <h3 
                                    className="inline text-lg font-semibold text-blue-500 hover:text-blue-600"
                                >
                                    {item.parent_module_name}
                                </h3>
                            </a>

                            {(showSubModulesIDList.includes(index)) ? (

                                <div>
                                    <p className="mb-1 pt-2 text-[14.5px] font-normal text-gray-500 dark:text-gray-400">
                                        {item.parent_module_description}
                                    </p>

                                    {/* TODO: test and finalize this; get all functionality + UI complete and finalized for here */}

                                    <span
                                        className="text-red-500 text-[13px] cursor-pointer hover:text-red-300"
                                        onClick={() => removeFromModuleIdList(index)}
                                    >
                                        Hide Modules
                                    </span>

                                    <ol className="relative mt-4">
                                        {item['sub_modules'].map((module_item) => (

                                            <li
                                                className="mb-2 ms-4"
                                                key={module_item.sub_module_object_id}
                                            >
                                                <h3
                                                    className="inline text-[14px] font-normal text-blue-400 hover:font-semibold"
                                                >
                                                    {/* <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 pr-2 dark:text-white w-4 h-4" /> */}
                                                    <FontAwesomeIcon icon={faCheckCircle} className="text-gray-400 pr-2 dark:text-white w-4 h-4" />
                                                    Module: {module_item.sub_module_name}
                                                </h3>
                                            </li>

                                        ))}
                                    </ol>
                                </div>

                            ) : (

                                <div>
                                    {/* data-aos="fade-in" */}

                                    <p className="mb-2 pt-2 text-[14.5px] font-normal text-gray-500 dark:text-gray-400 tracking-normal">
                                        {item.parent_module_description}
                                    </p>

                                    {(item['sub_modules'].length > 0) && (

                                        <span
                                            className="text-blue-400 text-[13px] cursor-pointer hover:text-blue-600"
                                            onClick={() => addToModuleIdList(index)}
                                        >
                                            Show Modules
                                        </span>

                                    )}

                                </div>

                            )}

                        </li>
                    ))}
                </ol>

            </div>

        </>

        // <div className="flex flex-col min-h-screen mt-12 ml-0 items-center">

        //     <h1 className="mb-4 text-[24px] font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">
        //         Modules - Introduction to Python
        //     </h1>

            // <ol className="relative border-s border-gray-200 dark:border-gray-700 mt-6">
            //     {course_syllabus_list.map((item, index) => (
            //         <li
            //             className="mb-8 ms-4"
            //             key={item.id}
            //         >

            //             <div className="absolute w-4 h-4 bg-gray-200 rounded-full mt-1.5 -start-2 border border-white dark:border-gray-900 dark:bg-gray-700"></div>

            //             <a
            //                 className="cursor-pointer"
            //                 href={`/learn-python/module/${index}`}
            //             >
            //                 <h3 
            //                     className="inline text-lg font-semibold text-blue-600 hover:text-blue-400"
            //                 >
            //                     {item.chapter_name}
            //                 </h3>
            //             </a>

            //             {(showSubModulesIDList.includes(index)) ? (

            //                 <div>
            //                     <p className="mb-1 pt-2 text-[15px] font-normal text-gray-500 dark:text-gray-400">
            //                         {item.chapter_description}
            //                     </p>

            //                     <span
            //                         className="text-red-500 text-[14px] cursor-pointer hover:text-red-300"
            //                         onClick={() => removeFromModuleIdList(index)}
            //                     >
            //                     Hide Modules
            //                     </span>

            //                     <ol className="relative mt-4">
            //                         {item['module_list'].map((module_item) => (
                                        
            //                             <li
            //                                 className="mb-4 ms-4"
            //                                 key={module_item.module_number}
            //                             >
            //                                 <h3
            //                                     className="inline text-base font-normal text-blue-400"
            //                                 >
            //                                     Module: {module_item.module_name}
            //                                 </h3>
            //                             </li>

            //                         ))}
            //                     </ol>
            //                 </div>

            //             ) : (

            //                 <div>

            //                     <p className="mb-1 pt-2 text-[15px] font-normal text-gray-500 dark:text-gray-400">
            //                         {item.chapter_description}
            //                     </p>

            //                     <span
            //                         className="text-blue-400 text-[14px] cursor-pointer hover:text-blue-600"
            //                         onClick={() => addToModuleIdList(index)}
            //                     >
            //                         Show Modules
            //                     </span>

            //                 </div>

            //             )}

            //         </li>
            //     ))}
            // </ol>

        // </div>

    );

}

export default CourseHomeLayout;