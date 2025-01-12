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
                'description': "Try creating your own list on the IDE to the right with 3 numbers of your choice and print it out. Remember, use square brackets and separate the items with commas."
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

    const [showTryExerciseButton, setShowTryExerciseButton] = useState(false);
    const [showSubmitExerciseButton, setShowSubmitExerciseButton] = useState(false);

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
                
            }, 10);

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

    };

    const _showExample = async () => {

        let example_element = currentModuleDict.current['example'];
        _createTypewriterEffect(
            example_element.description,
            setCurrentExampleText,
            0,
            null
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
        setShowExample(false);
        setShowTryExerciseButton(false);

        // show submit exercise button
        setShowSubmitExerciseButton(true);
        _showTryExercise();
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

                    {/* Buttons */}
                    <div className="mt-6 text-center space-x-2">

                        {/* Example Button */}
                        {(showExampleButton === true) && (
                            <button
                                type="button"
                                className="py-3 px-5 me-2 mb-2 text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                onClick={handleShowExampleClick}
                            >
                                Show Example
                                <FontAwesomeIcon icon={faArrowRight} className="pl-1" />
                            </button>
                        )}

                        {/* Try Exercise Button */}
                        {(showTryExerciseButton === true) && (
                            <button
                                type="button"
                                className="py-3 px-5 me-2 mb-2 text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                onClick={handleShowTryExerciseClick}
                            >
                                Challenge
                                <FontAwesomeIcon icon={faArrowRight} className="pl-1" />
                            </button>
                        )}

                        {/* Submit Button */}
                        {(showSubmitExerciseButton === true) && (
                            <button
                                type="button"
                                className="py-3 px-5 me-2 mb-2 text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                            >
                                Submit
                                <FontAwesomeIcon icon={faArrowRight} className="pl-1" />
                            </button>
                        )}
                        
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