import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faComment, faXmark, faQuestion, faPlay } from "@fortawesome/free-solid-svg-icons";
import Markdown from 'react-markdown';
// import TypeWriter from "@/app/components/Experimental/TypeWriter";


const SecondNoteParentLayout = ({chapterDict, noteDict}) => {

    const tmp_list = [
        {
            'note': {
                // "title": "What is a List?",
                "description": "**What is a List?**\\n\\nSo, **what is a list?** Think of a list like a container where you can keep a bunch of items in a specific order. So, if you're building a card game like poker, you might want to keep track of a deck of cards, and the order of those cards matters.\\n\\n### **Key Points:**\\n- A list is just a collection of things that are ordered (so the order *counts*! 👀).\\n- Lists let you group multiple items into one variable (like a deck of cards).\\n- In Python, we define a list using square brackets `[]`."
            },
            'example': {
                'description': "#Below is a list with 4 elements.\n#You can run the code by clicking the Run Button on the top right.\n\nlist_one = [1, 2, 3, 4]\nprint(list_one)\n"
            },
            'try_exercise': {
                'description': "Try creating your own list on the IDE to the right with 3 numbers of your choice and print them out. Remember, use square brackets and separate the items with commas."
            }
        },

        {
            'note': {
                // "title": "What is a List?",
                "description": "## Lists with Different Types\n\nCreating a list in Python is pretty simple. You just need to use square brackets `[]`, and separate your items with commas. For example, imagine you're starting a simple list of cards for a game. You might just put numbers, like this: [1, 2, 5, 3, 4, 'Ace', 'King'].\n\n\n### **Key Points:**\nUse square brackets `[]` to create your list.\nItems inside the list are separated by commas.\nThe items can be anything—numbers, words, or even more lists!\n"
            },
            'example': {
                'description': "Below is a list with 4 elements.\n#You can run the code by clicking the Run Button on the top right.\n\nlist_with_different_types = [\"apple\", 1, 3.14, True]\nprint(list_one)\n"
            },
            'try_exercise': {
                'description': "Try creating a list with 3 different types of items—like a string, an integer, and a float—and print it out."
            }
        },

    ];

    // const [currentIndex, setCurrentIndex] = useState(0);
    const [currentNoteText, setCurrentNoteText] = useState('');

    // const [currentTyping, setCurrentTyping] = useState(false);
    const typingEffectStarted = useRef(false);

    // const [exampleIndex, setExampleIndex] = useState(0);
    const [currentExampleText, setCurrentExampleText] = useState('');
    const [currentTryExerciseText, setCurrentTryExerciseText] = useState('');

    const [showExampleButton, setShowExampleButton] = useState(false);
    const [showExample, setShowExample] = useState(false);
    const [showTryChallenge, setShowTryChallenge] = useState(false);

    const [showTryExerciseButton, setShowTryExerciseButton] = useState(false);
    const [showSubmitExerciseButton, setShowSubmitExerciseButton] = useState(false);

    const [currentActiveTab, setCurrentActiveTab] = useState('note');
    // const [noteTabVisible, setNoteTabVisible] = useState(false);
    const [tryExerciseVisible, setTryExerciseVisible] = useState(false);
    const [submissionFeedback, setSubmissionFeedback] = useState('');

    const [consoleOutput, setConsoleOutput] = useState('Console Output');
    const currentModuleIndex = useRef(0);
    const currentModuleDict = useRef({});

    const [showNextModuleDictButton, setShowNextModuleDictButton] = useState(false);


    const _createTypewriterEffect = (text, set_text_fn, current_index, text_type) => {
        if (current_index < text.length) {

            // Delay the typing effect by 20ms
            setTimeout(() => {

                // Append the next character from text
                set_text_fn(previousText => previousText + text[current_index]);
    
                // Recursive call with the next index
                _createTypewriterEffect(text, set_text_fn, current_index + 1, text_type);  
                
            }, 5);

        } else {

            if (text_type === 'show_example_button'){
                // TODO: 
                setShowExampleButton(true);
            } else if (text_type === 'show_try_exercise_button'){
                // TODO:
                setShowTryExerciseButton(true);
            } else if (text_type === 'show_submit_button'){
                setShowSubmitExerciseButton(true);
            }

        }
    };
    
    const _showNote = async () => {

        let note_element = currentModuleDict.current['note'];

        _createTypewriterEffect(
            note_element.description,
            setCurrentNoteText, 
            0, 
            'show_example_button'
        );

        setCurrentActiveTab('note');
        // setNoteTabVisible(true);

    };

    const _showExample = async () => {

        let example_element = currentModuleDict.current['example'];
        _createTypewriterEffect(
            example_element.description,
            setCurrentExampleText,
            0,
            'show_try_exercise_button'
        );

    };

    const _showTryExercise = async () => {

        let try_exercise_element = currentModuleDict.current['try_exercise'];
        _createTypewriterEffect(
            try_exercise_element.description,
            setCurrentTryExerciseText,
            0,
            'show_submit_button'
        );
        setCurrentActiveTab('challenge');
        // setNoteTabVisible(false);
    }

    const handleShowExampleClick = async () => {
        setShowExampleButton(false);
        setShowExample(true);
        _showExample();
        
        // let example_element = tmp_list[1];
        // _createTypewriterEffect(example_element.description, setExampleText, 'show_try_exercise_button');
    };

    const handleShowTryExerciseClick = async () => {
    
        setShowExampleButton(false);
        // setShowExample(false);
        setShowTryExerciseButton(false);

        // show submit exercise button
        setShowSubmitExerciseButton(true);

        setShowTryChallenge(true);
        _showTryExercise();

    };


    const handleRunButtonClick = async () => {
        setConsoleOutput('>>> example run...')
    };

    const handleSubmitButtonClick = async () => {

        setConsoleOutput('>>> example run...');
        setSubmissionFeedback('Sample Submission Feedback... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sem dui, aliquet at leo vehicula, porttitor ornare quam.');

        // Show next button if submission is successful
        
        // TODO:
        setShowSubmitExerciseButton(false);
        setShowNextModuleDictButton(true);

    };


    const handleNextLessonButtonClick = async () => {

        // increase current module-dict-index by 1

        // set current module dict
        currentModuleIndex.current = currentModuleIndex.current + 1;
        currentModuleDict.current = tmp_list[currentModuleIndex.current];
        
        // Reset to default again
        setShowNextModuleDictButton(false);
        setCurrentNoteText('');
        setCurrentExampleText('');
        setCurrentTryExerciseText('');
        setCurrentActiveTab('note');

        _showNote();

    };


    useEffect(() => {
        if (tmp_list && tmp_list.length > 0) {
        
            currentModuleIndex.current = 0;
            currentModuleDict.current = tmp_list[0];
    
            if (typingEffectStarted.current === false){
                typingEffectStarted.current = true;
                _showNote();
            }

        }

        // console.log('current-typing:', typingEffectStarted.current);
        // if (typingEffectStarted.current === false){
        //     typingEffectStarted.current = true;
        //     if (tmp_list && tmp_list.length > 0) {
        //         let first_element = tmp_list[0];
        //         _createTypewriterEffect(first_element.description, setCurrentText, 0, 'show_example_button');
        //     }
        // }

    }, []);


    return (

        <div className="flex flex-col min-h-screen mt-0">

            <div className="flex flex-grow w-full max-w-[1020px] py-0">

                {/* First Half */}
                <div 
                    // className="w-1/2 p-0 pt-2"
                    className={`p-0 pt-2 ${(showExample === true) ? "w-1/2" : "w-full"}`}
                >

                    {/* Tab Menu */}
                    {(showTryChallenge) && (
                        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 mb-6">
                            <ul className="flex flex-wrap -mb-px">
                                <li className="me-2">
                                    {/* <a href="#" className="inline-block p-0 px-4 pb-1 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active 
                                    dark:text-blue-500 dark:border-blue-500" aria-current="page">Dashboard</a> */}
                                    <a
                                        className={`inline-block p-0 px-4 pb-1 border-b-2 rounded-t-lg cursor-pointer ${
                                            (currentActiveTab === 'note')
                                            ? 'text-blue-600 border-blue-600 font-bold dark:text-blue-500 dark:border-blue-500'
                                            : 'text-gray-600 border-transparent dark:text-gray-400'
                                        }`}
                                        aria-current={currentActiveTab ? 'page' : undefined}
                                        onClick={() => setCurrentActiveTab('note')}
                                    >
                                        Note
                                    </a>
                                </li>
                                <li className="me-2">
                                    {/* <a href="#" className="inline-block p-0 px-4 pb-1 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">Challenge</a> */}
                                    <a
                                        href="#"
                                        className={`inline-block p-0 px-4 pb-1 border-b-2 rounded-t-lg cursor-pointer ${
                                            (currentActiveTab === 'challenge')
                                            ? 'text-blue-600 border-blue-600 font-bold dark:text-blue-500 dark:border-blue-500'
                                            : 'text-gray-600 border-transparent dark:text-gray-400'
                                        }`}
                                        aria-current={currentActiveTab ? 'page' : undefined}
                                        onClick={() => setCurrentActiveTab('challenge')}
                                    >
                                        Challenge
                                    </a>
                                </li>
                            </ul>
                        </div>

                    )}

                    {(currentActiveTab === 'note') && (

                        <div className="space-y-4 pr-2">
                            <div>
                                {/* <h3 className="text-gray-900 font-bold">
                                    {noteDict.title}
                                </h3> */}
                                <p className="text-[15px] tracking-normal leading-9 pt-0">
                                    {/* <TypeWriter text={noteDict.description} /> */}
                                    <Markdown>
                                        {currentNoteText}
                                    </Markdown>
                                </p>

                            </div>
                        </div>

                    )}

                    {(currentActiveTab === 'challenge') && (

                        <div className="space-y-4 pr-2">
                            <div>

                            <p className="text-[16px] font-bold pt-2">
                                Question
                            </p>
                                <p className="text-[15px] tracking-normal leading-9 pt-4">
                                    {/* <TypeWriter text={noteDict.description} /> */}
                                    <Markdown>
                                        {currentTryExerciseText}
                                    </Markdown>
                                </p>
                            </div>

                            {/* <p className='text-[16px] font-bold pb-2'>Submissions</p> */}                        

                            <p className="text-[16px] font-bold pt-4">
                                Current Solution Feedback
                            </p>
                            <p className="leading-9 text-[15px]">
                                {(submissionFeedback.length === 0) && "Write your code and submit your solution to get feedback from the AI!"}
                                {submissionFeedback}
                            </p>

                            <p className="text-[16px] font-bold pt-4">
                                Past Submissions
                            </p>

                            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-2 py-3">
                                            Date
                                        </th>
                                        <th scope="col" className="px-2 py-3">
                                            Passed
                                        </th>
                                        <th scope="col" className="px-2 py-3">
                                            Code
                                        </th>
                                        <th scope="col" className="px-2 py-3">
                                            AI Feedback
                                        </th>                            
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* <tr
                                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                    >
                                        <td className="p-3">
                                            2025-01-10
                                        </td>
                                        
                                        <td
                                            className="p-3 text-green-400"
                                        >
                                            Success
                                        </td>
                                        <td 
                                            className="p-3"
                                        >
                                            <span 
                                                className="hover:text-blue-500 hover:font-semibold cursor-pointer"
                                            >
                                                View Code
                                            </span>
                                        </td>

                                        <td 
                                            className="p-3"
                                        >
                                            <span 
                                                className="hover:text-blue-500 hover:font-semibold cursor-pointer"
                                            >
                                                View Feedback
                                            </span>
                                        </td>

                                    </tr> */}

                                </tbody>
                            </table>

                        </div>

                    )}

                    {/* Buttons */}
                    <div className="mt-6 text-center space-x-2">

                        {/* Example Button */}
                        {(showExampleButton === true) && (
                            <button
                                type="button"
                                className="py-3 px-5 me-2 mb-2 text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                onClick={handleShowExampleClick}
                            >
                                Show Me An Example
                                {/* <FontAwesomeIcon icon={faArrowRight} className="pl-1" /> */}
                            </button>
                        )}

                        {/* Try Exercise Button */}
                        {(showTryExerciseButton === true) && (

                            <div>
                                {/* <button
                                    type="button"
                                    className="py-3 px-5 me-2 mb-2 text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                    onClick={handleShowTryExerciseClick}
                                    >
                                    Ask a Question
                                    <FontAwesomeIcon icon={faQuestion} className="pl-1" />
                                </button> */}
                                <button 
                                    type="button"
                                    className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                >
                                    Ask a Question
                                    {/* <FontAwesomeIcon icon={faQuestion} className="pl-1" /> */}
                                </button>

                                <button 
                                    type="button"
                                    className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                                >
                                    Generate Another Example
                                    {/* <FontAwesomeIcon icon={faQuestion} className="pl-1" /> */}
                                </button>

                                <button
                                    type="button"
                                    className="py-3 px-5 me-2 mb-2 text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                    onClick={handleShowTryExerciseClick}
                                >
                                    Proceed to Challenge
                                    {/* <FontAwesomeIcon icon={faArrowRight} className="pl-1" /> */}
                                </button>
                            </div>
                        )}

                        {/* Submit Button */}
                        {/* {(showSubmitExerciseButton === true) && (
                            // TODO: change this color to green and then show the tabs, and set to challenge tab; proceed from there
                            <button
                                type="button"
                                className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                            >Submit</button>
                        )} */}
                        
                    </div>

                </div>


                {/* Second Half */}
                {(showExample === true) && (

                    <div className="w-1/2 ml-0 flex flex-col pt-0 border-l-2 border-gray-50">

                            <div className="flex-grow p-4 pt-0 pb-0">
                                
                                <div className="flex justify-between">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Code</h2>
                                    <button
                                        type="button"
                                        className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-[13.5px] px-3 py-0 me-0 mb-3 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                                        onClick={handleRunButtonClick}
                                    >
                                        <FontAwesomeIcon icon={faPlay} className="pl-1 pr-1 text-[12px]"/>{" "}Run
                                    </button>

                                    {/* Submit Solution Button */}
                                    {(showSubmitExerciseButton === true) && (
                                        <button
                                            type="button"
                                            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                            onClick={handleSubmitButtonClick}
                                        >Submit</button>
                                    )}

                                    {(showNextModuleDictButton === true) && (

                                        <button
                                            type="button"
                                            className="py-3 px-5 me-2 mb-2 text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                            onClick={handleNextLessonButtonClick}
                                        >
                                            Next
                                            <FontAwesomeIcon icon={faArrowRight} className="pl-1" />
                                        </button>

                                    )}

                                </div>
                                
                                <textarea
                                    className="w-full h-64 resize-none rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none p-2 font-mono text-sm text-gray-800"
                                    placeholder="# Write your code here..."
                                    value={currentExampleText}
                                ></textarea>

                                <div className="flex-grow p-0 pt-4">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Console Output</h2>
                                    <div className="h-40 overflow-auto bg-black text-green-500 p-2 rounded-md font-mono text-sm">
                                    {consoleOutput}
                                    </div>
                                </div>

                            </div>

                        </div>

                    )}

                </div>

            </div>

    )

};

export default SecondNoteParentLayout;