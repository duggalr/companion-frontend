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
                "description": "## What is a List?\n\nSo, **what is a list?** Think of a list like a container where you can keep a bunch of items in a specific order. So, if you're building a card game like poker, you might want to keep track of a deck of cards, and the order of those cards matters.\n\n\n### **Key Points:**\n- A list is just a collection of things that are ordered (so the order *counts*! 👀).\n- Lists let you group multiple items into one variable (like a deck of cards).\n- In Python, we define a list using square brackets `[]`."
            },
            'example': {
                'description': "#Below is a list with 4 elements.\n#You can run the code by clicking the Run Button on the top right.\n\nlist_one = [1, 2, 3, 4]\nprint(list_one)\n"
            },
            'try_exercise': {
                'description': "Try creating your own list on the IDE to the right with 3 numbers of your choice and print them out. Remember, use square brackets and separate the items with commas."
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

    const [consoleOutput, setConsoleOutput] = useState('Console Output');


    const _createTypewriterEffect = (text, set_text_fn, current_index, text_type) => {
        if (current_index < text.length) {

            // Delay the typing effect by 20ms
            setTimeout(() => {

                console.log('text_type', text_type);

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
            }

        }
    };
    
    const currentModuleIndex = useRef(0);
    const currentModuleDict = useRef({});

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
            'show_try_exercise_button'
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
        
        // setShowTryChallenge(true);

        // _showTryExercise();

        // setTryExer
        // // showTryExerciseButton
    };


    const handleRunButtonClick = async () => {
        setConsoleOutput('>>> example run...')
    }


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
                                        href="#"
                                        className={`inline-block p-0 px-4 pb-1 border-b-2 rounded-t-lg ${
                                            (currentActiveTab === 'note')
                                            ? 'text-blue-600 border-blue-600 font-bold dark:text-blue-500 dark:border-blue-500'
                                            : 'text-gray-600 border-transparent dark:text-gray-400'
                                        }`}
                                        aria-current={currentActiveTab ? 'page' : undefined}
                                    >
                                        Dashboard
                                    </a>
                                </li>
                                <li className="me-2">
                                    {/* <a href="#" className="inline-block p-0 px-4 pb-1 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">Challenge</a> */}
                                    <a
                                        href="#"
                                        className={`inline-block p-0 px-4 pb-1 border-b-2 rounded-t-lg ${
                                            (currentActiveTab === 'challenge')
                                            ? 'text-blue-600 border-blue-600 font-bold dark:text-blue-500 dark:border-blue-500'
                                            : 'text-gray-600 border-transparent dark:text-gray-400'
                                        }`}
                                        aria-current={currentActiveTab ? 'page' : undefined}
                                    >
                                        Challenge
                                    </a>
                                </li>
                            </ul>
                        </div>

                    )}
                    
                    {(currentActiveTab === 'note') && (

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-gray-900 font-bold">
                                    {noteDict.title}
                                </h3>
                                <p className="text-[15px] tracking-normal leading-9 pt-4">
                                    {/* <TypeWriter text={noteDict.description} /> */}
                                    {/* <Markdown> */}
                                        {currentNoteText}
                                    {/* </Markdown> */}
                                </p>

                            </div>
                        </div>

                    )}

                    {(currentActiveTab === 'challenge') && (

                        <div className="space-y-4">
                            <div>
                                <p className="text-[15px] tracking-normal leading-9 pt-4">
                                    {/* <TypeWriter text={noteDict.description} /> */}
                                    {/* <Markdown> */}
                                        {currentTryExerciseText}
                                    {/* </Markdown> */}
                                </p>

                            </div>
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
                                    Try a Challenge
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

                                {/* TODO: start here by getting submit layout shown with challenge submissions and proceed from there */}
                                    <button
                                        type="button"
                                        className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                    >Submit</button>

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