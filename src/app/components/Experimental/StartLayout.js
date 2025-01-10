import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
// import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorageUtils";
import {  getFromLocalStorage, saveToLocalStorage } from '@/lib/utils/localStorageUtils';


const StartLayout = () => {

    const [showChatLayout, setShowChatLayout] = useState(false);
    const currentUserInputMessageRef = useRef("");
    const [currentUserInputMessage, setCurrentUserInputMessage] = useState("");
    const [sendBtnEnabled, setSendBtnEnabled] = useState(false);

    const handleStartCourseBtnClick = () => {
        setShowChatLayout(true);
    };

    const handleNewInputValue = (e) => {

        let user_input_message = e.target.value;
        setCurrentUserInputMessage(user_input_message);
        currentUserInputMessageRef.current = user_input_message;

        if (user_input_message.trim() !== "") {
            setSendBtnEnabled(true);
        } else {
            setSendBtnEnabled(false);
        }
    
    };


    // TODO: Show Course Module with User Goals
    const [showUserCourseModule, setShowUserCourseModule] = useState(false);
    const [userGoalSummary, setUserGoalSummary] = useState("");
    const userGoalSummaryRef = useRef("");

    // User Summary Generation
    const generateAndDisplayUserSummary = async () => {

        let user_messages = JSON.parse(getFromLocalStorage('new_course_chat_messages'));
        console.log('user_messages:', user_messages);
        
        let all_chat_messages_str = "";
        for (let i = 0; i <= messages.length-1; i++) {
            if (messages[i].sender == 'user'){
                all_chat_messages_str += "USER: " + messages[i].text + "\n";
            } else {
                all_chat_messages_str += "AI: " + messages[i].text + "\n";
            }
        };

        console.log('all-chat-messages:', all_chat_messages_str);

        let user_conversation_data = {'user_conversation_string': all_chat_messages_str};
        console.log('user-summary-data:', user_conversation_data);

        const endPointUrl = 'http://127.0.0.1:8000/generate_user_goal_summary';
        const apiResponse = await fetch(endPointUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user_conversation_data)
        });

        console.log('api-response:', apiResponse);

        if (apiResponse['success'] === true){

            setUserGoalSummary(apiResponse['ai_response_message_string']);
            setShowUserCourseModule(true);

        }

    }

    // Websocket Chat Messages
    const wsRef = useRef(null);
    const accumulatedMessageRef = useRef("");
    const [messages, setMessages] = useState([{
        text: `Welcome! 👋 I'm Companion, your AI teacher and tutor.

I will get you very familiar with Python and will always be there provide feedback and answer any questions you may have, as you go through the course!

Before we start, I'm curious as to why you want to learn Python? Are you just curious? Do you want to become a developer? Do you have a specific project in mind? Maybe you can briefly tell me in a sentence or two...

By giving me this information, I can be of better assistance as you progress the course.`,
        sender: "bot",
        }
    ]);
    const [generatedMessage, setGeneratedMessage] = useState("");
    const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [messagesDisabled, setMessagesDisabled] = useState(false);


    // Websocket
    useEffect(() => {

        const websocket_url = 'ws://127.0.0.1:8000/ws_learn_about_user';
        const socket = new WebSocket(websocket_url);

        socket.onopen = () => {
            console.log("WebSocket connection established");
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log('message:', message);

            if (message['type'] == 'user_goal_chat'){

                const msg_text = message['response'];

                // TODO: if message == 'DONE'
                if (msg_text === "DONE"){

                    console.log('MESSAGING COMPLETE...')
                    // Generate Summary
                    setMessagesDisabled(true);                    
                    
                    let all_user_messages = JSON.parse(getFromLocalStorage('new_course_chat_messages'));
                    let all_chat_messages_str = "";
                    for (let i = 0; i <= all_user_messages.length-1; i++) {
                        if (all_user_messages[i].sender == 'user'){
                            all_chat_messages_str += "USER: " + all_user_messages[i].text + "\n";
                        } else {
                            all_chat_messages_str += "AI: " + all_user_messages[i].text + "\n";
                        }
                    };

                    // // TODO:
                    let tmp_payload = {
                        'user_chat_history_string': all_chat_messages_str
                    };
                    console.log('tmp-payload-new:', tmp_payload);

                    wsRef.current.send(JSON.stringify(tmp_payload));
                    setShowUserCourseModule(true);

                }
                else if (msg_text === "MODEL_GEN_COMPLETE") {
                    
                    if (accumulatedMessageRef.current !== 'DONE'){

                        setMessages((prevMessages) => [
                            ...prevMessages,
                            { text: accumulatedMessageRef.current, sender: "bot" },
                        ]);

                    }

                    setTimeout(() => {
                        setGeneratedMessage("");
                        setIsGeneratingMessage(false);
                        setIsLoading(false);
                    }, 50);

                }
                else {
                    accumulatedMessageRef.current += msg_text;
                    setGeneratedMessage((prev) => prev + msg_text);
                    setIsGeneratingMessage(true);                    
                }

            }

            else if (message['type'] == 'user_summary'){

                const summary_text = message['response'];

                if (summary_text === "SUMMARY_GEN_COMPLETE"){

                    // TODO: pass here

                    // setMessages((prevMessages) => [
                    //     ...prevMessages,
                    //     { text: accumulatedMessageRef.current, sender: "bot" },
                    // ]);

                    // const [userGoalSummary, setUserGoalSummary] = useState("");
                }
                else {

                    userGoalSummaryRef.current += summary_text;
                    setUserGoalSummary((prev) => prev + summary_text);

                    // setUserGoalSummary()
                    // summary_text

                    // accumulatedMessageRef.current += msg_text;
                    // setGeneratedMessage((prev) => prev + msg_text);
                    // setIsGeneratingMessage(true);
                }

            }

            // if (message === 'DONE') {

            //     console.log('done...');

            //     setMessages((prevMessages) => [
            //         ...prevMessages,
            //         { text: accumulatedMessageRef.current, sender: "bot" },
            //     ]);

            //     setTimeout(() => {
            //         setGeneratedMessage("");
            //         setIsGeneratingMessage(false);
            //         setIsLoading(false);
            //     }, 50);

            //     // Generate Summary
            //     setMessagesDisabled(true);
            //     generateAndDisplayUserSummary();

            // } else if (message === "MODEL_GEN_COMPLETE") {

            //     setMessages((prevMessages) => [
            //         ...prevMessages,
            //         { text: accumulatedMessageRef.current, sender: "bot" },
            //     ]);

            //     setTimeout(() => {
            //         setGeneratedMessage("");
            //         setIsGeneratingMessage(false);
            //         setIsLoading(false);
            //     }, 50);

            // } 
            
            // else {
            //     accumulatedMessageRef.current += message;
            //     setGeneratedMessage((prev) => prev + message);
            //     setIsGeneratingMessage(true);
            // }

        };

        socket.onclose = () => {
            console.log("WebSocket connection closed");
        };

        wsRef.current = socket;

        return () => {
            socket.close();
        };

    }, []);

    
    const _sendMessage = async (payload) => {

        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(payload));
        }

    };

    const handleUserMessageSend = () => {
        let current_user_msg = currentUserInputMessageRef.current;
     
        accumulatedMessageRef.current = "";

        let all_chat_messages_str = "";
        for (let i = 0; i <= messages.length-1; i++) {
            if (messages[i].sender == 'user'){
                all_chat_messages_str += "USER: " + messages[i].text + "\n";
            } else {
                all_chat_messages_str += "AI: " + messages[i].text + "\n";
            }
        };

        const messageForBackend = {
            text: current_user_msg,
            past_messages_string: all_chat_messages_str,
            sender: 'user',
            type: 'user_message',
        };
        console.log('message-for-backend:', messageForBackend);

        setMessages((messages) => [...messages, messageForBackend]);
        setCurrentUserInputMessage("");
        _sendMessage(messageForBackend);

    };

    // Chat Messages Event Listener for Local Storage
    useEffect(() => {
        if (messages.length > 0) {
            saveToLocalStorage('new_course_chat_messages', JSON.stringify(messages));
        }
    }, [messages]);


    // Course Module List
    const course_syllabus_list = [
        {
            "id": '509266a3-2c78-47f1-93ab-1080e8761404',
            "chapter_name": "Chapter 2: Variables and Data Types",
            "chapter_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sodales eros ut massa vehicula malesuada.",

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
            "chapter_description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sodales eros ut massa vehicula malesuada.",

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

        }

    ]

    return (

        <div className="flex-grow overflow-y-scroll no-scrollbar mt-16">
        
            {(showUserCourseModule === true) ? 

                (
                    
                    <div className="flex flex-col items-center min-h-screen mt-0">

                        <div className="flex flex-grow w-full max-w-[1020px] py-0">

                            {/* Left Column */}
                            <div className="w-1/2 p-0 pt-0">
                                <h2 className="text-[19px] font-semibold text-gray-800 mb-4">
                                    So Rahul, let&apos;s proceed...
                                </h2>

                                {/* Summary */}
                                <div className="space-y-4">
                                    <div>
                                        {/* <h3 className="text-gray-700 font-medium">Title</h3> */}
                                        <p className="text-gray-600 text-[15.5px] tracking-normal leading-9 pt-2">
                                            {userGoalSummary}
                                            {/* To summarize, you want to learn python because lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                                            <br/><br/>
                                            Vestibulum gravida, sapien non mattis dictum, nulla eros consequat nisl, tristique blandit sem ante sit amet urna. Pellentesque nisi mi, blandit vel varius non, sollicitudin eget tortor. Quisque dictum nulla.
                                            <br/><br/>
                                            Pellentesque nisi mi, blandit vel varius non, sollicitudin eget tortor. Quisque dictum nulla. */}
                                        </p>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="mt-8 text-center space-x-4">
                                    <button
                                        type="button"
                                        className="py-3 px-5 me-2 mb-2 text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                    >
                                        Let&apos;s Start!
                                        <FontAwesomeIcon icon={faArrowRight} className="pl-1" />
                                    </button>
                                </div>
                                
                            </div>

                            {/* Right Column */}
                            <div className="w-2/3 ml-6 flex flex-col pt-0 border-l-2 border-gray-50">
                                <h2 className="text-lg font-semibold text-gray-800 mb-6 ml-8">
                                    Syllabus
                                </h2>

                                <ol className="relative border-s border-gray-200 dark:border-gray-700 ml-10">
                                    {course_syllabus_list.map((item) => (
                                        <li
                                            className="mb-8 ms-4"
                                            key={item.id}
                                        >

                                            <div className="absolute w-4 h-4 bg-gray-200 rounded-full mt-1.5 -start-2 border border-white dark:border-gray-900 dark:bg-gray-700"></div>

                                            <a
                                                className="cursor-pointer"
                                            >
                                                <h3 
                                                    className="inline text-lg font-semibold text-blue-600 hover:text-blue-400"
                                                >
                                                    {item.chapter_name}
                                                </h3>

                                                {/* <ol className="relative mt-4">
                                                    {item['module_list'].map((module_item) => (
                                                        
                                                        <li
                                                            className="mb-4 ms-4"
                                                            key={module_item.module_number}
                                                        >
                                                            <h3
                                                                className="inline text-base font-normal text-blue-500 hover:text-blue-600 dark:text-blue-400 hover:dark:text-blue-500"
                                                            >
                                                                Module: {module_item.module_name}
                                                            </h3>
                                                        </li>

                                                    ))}
                                                </ol> */}
                                            </a>

                                            <p className="mb-4 pt-1 text-[15px] font-normal text-gray-500 dark:text-gray-400">
                                                {item.chapter_description}
                                            </p>

                                        </li>
                                    ))}
                                </ol>

                                {/* TODO: show modules */}

                            </div>

                        </div>

                    </div>

                    // <div className="flex flex-col items-center min-h-screen mt-20">
                    // <div className="flex flex-grow w-full max-w-[1020px] py-0">
                        
                    //     <div className="w-1/2 p-0 pt-8">

                    //         <h2 className="text-[19px] font-semibold text-gray-800 mb-4">
                    //             To summarize:
                    //         </h2>
                            
                    //         <p>
                    //         Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis et blandit magna, at lobortis tellus. Sed suscipit vehicula nisl non ullamcorper. Sed maximus, nunc sed tempor pretium, nisi leo vestibulum lectus, mollis sollicitudin sapien mi lobortis tellus.
                    //         </p>
                            
                    //     </div>

                    //     <div className="w-1/2 p-0 pt-8">

                    //         <h2 className="text-[19px] font-semibold text-gray-800 mb-4">
                    //             Column Two
                    //         </h2>

                    //     </div>

                    // </div>

                ): (

                    (showChatLayout === true) ? (
                    
                        // Center this 
                        <div className="flex flex-col h-4/5 dark:bg-gray-900 p-4 max-w-4xl mx-auto min-h-[80vh] max-h-[80vh]">
        
                            <h1 className="mb-6 text-[24px] font-bold leading-none tracking-tight text-gray-900 dark:text-white">
                                Before we start with the course, let&apos;s learn a bit more about you...
                            </h1>
        
                            {/* Messages Area */}
                            <div
                                // bg-[#F3F4F6] dark:bg-gray-800
                                className="flex-grow overflow-y-auto p-4 space-y-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50"
                            >
        
                                {/* Message List */}
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`${
                                        msg.sender === "user"
                                            ? "self-end bg-blue-400 text-white"
                                            : "self-start bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        } p-3 rounded-lg w-full max-w-full break-words text-[13px] whitespace-pre-wrap`}
                                    >
                                        {msg.text}
                                    </div>
                                ))}
        
                                {/* Display the streaming message here */}
                                {isGeneratingMessage && (
                                    <div className="self-start bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg w-full max-w-full break-words text-[13px] whitespace-pre-wrap">
                                        {generatedMessage}
                                    </div>
                                )}
        
                                {/* <div
                                    className={`self-end bg-blue-400 text-white p-3 rounded-lg w-full max-w-full break-words text-[14px] leading-6 whitespace-pre-wrap`}
                                >
                                    Welcome! 👋 I&apos;m <strong>Companion</strong>, your AI teacher and tutor.
                                    <br/><br/>
                                    I will get you very familiar with Python and will always be there provide feedback and answer any questions you may have, as you go through the course!
                                    <br/><br/>
                                    Before we start, I&apos;m curious as to why you want to learn Python? Are you just curious? Do you want to become a developer? Do you have a specific project in mind? Maybe you can briefly tell me in a sentence or two...
                                    <br/><br/>
                                    By giving me this information, I can be of better assistance as you progress the course.
                                </div> */}
        
                                {/* <div
                                    className={`self-start bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg w-full max-w-full break-words text-[14px] leading-6 whitespace-pre-wrap`}
                                >
                                    Phasellus risus orci, malesuada aliquam dui a, suscipit pulvinar velit. Ut tempor fringilla nisi vitae ultrices.
                                </div> */}
        
                            </div>
        
                            {/* Input area - textarea */}
                            <div className="flex items-center border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
        
                                <textarea
                                    value={currentUserInputMessage}
                                    onChange={(e) => handleNewInputValue(e)}                            
                                    className="text-[14px] flex-grow resize-y p-3 bg-gray-50 dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 mr-2"
                                    placeholder="type a message..."
                                    rows={1}
                                    style={{ minHeight: '50px', maxHeight: '120px' }}
                                    disabled={messagesDisabled}
                                />
        
                                <button
                                    // className={`${"w-[100px] py-2 text-[14px] bg-blue-600 text-white opacity-90 font-medium rounded-xl hover:bg-blue-700 transition-all cursor-pointer"}`}
                                    className={`${messagesDisabled ?
                                        "w-[100px] py-2 text-[14px] bg-blue-600 text-white opacity-90 font-medium rounded-xl hover:bg-blue-700 transition-all cursor-pointer" : 
                                        "w-[100px] py-2 text-[14px] text-white dark:text-black bg-blue-500 dark:bg-gray-500 cursor-not-allowed font-medium rounded-xl"
                                    }`}
                                    onClick={handleUserMessageSend}
                                    disabled={messagesDisabled}
                                >
                                    <FontAwesomeIcon icon={faPaperPlane} className="text-white pr-2" />
                                    Send
                                </button>
        
                            </div>
                        
                        </div>
        
        
                    ): (
        
                        <div className="flex flex-col items-center min-h-screen">
        
                            <h1 className="mb-4 text-[32px] font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">Learn Python with an <span className="text-blue-600 dark:text-blue-500">AI Teacher</span>.</h1>
        
                            <p className="mb-4 mt-1 text-lg font-normal tracking-wide text-gray-500 dark:text-gray-400">
                                This is intended for those who never programmed in Python before...
                            </p>
        
                            <button
                                type="button"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-3 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 mt-2"
                                onClick={handleStartCourseBtnClick}
                            >
                                Let&apos;s Begin! <FontAwesomeIcon icon={faArrowRight} className="pl-1" />
                            </button>
        
                            </div>
        
                    )
                    
                )

            }

        </div>
        
    )

};

export default StartLayout;