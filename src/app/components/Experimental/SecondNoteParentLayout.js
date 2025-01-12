import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faComment, faXmark, faQuestion, faPlay } from "@fortawesome/free-solid-svg-icons";
import Markdown from 'react-markdown';
// import TypeWriter from "@/app/components/Experimental/TypeWriter";


const SecondNoteParentLayout = ({chapterDict, noteDict}) => {

    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);

    const [showExample, setShowExample] = useState(false);
    const [currentExampleDict, setCurrentExampleDict] = useState({});
    const [currentTextIndex, setCurrentTextIndex] = useState(0);

    let tmp_list = [
        {
            "title": "What is a List?",
            "description": "So, **what is a list?** Think of a list like a container where you can keep a bunch of items in a specific order. So, if you're building a card game like poker, you might want to keep track of a deck of cards, and the order of those cards matters. Here's an example..",
            "key_points": [
                "A list is just a collection of things that are ordered (so the order *counts*! 👀).",
                "Lists let you group multiple items into one variable (like a deck of cards).",
                "In Python, we define a list using square brackets `[]`."
            ]
        },
        {
            // 'example': "#The below is a list with 4 elements.\nlist_one = [1, 2, 3, 4]\nprint(list_one)\n",
            'description': "#The below is a list with 4 elements.\nlist_one = [1, 2, 3, 4]\nprint(list_one)\n",
        },
        // {
        //     "try_it": "Try creating your own list on the IDE to the right with 3 numbers of your choice and print it out. Remember, use square brackets and separate the items with commas."
        // }
    ]

    const createTypewriterEffect = (text) => {

        let timeout;
        for (let idx = 0; idx <= text.length-1; idx++){
            let current_ch = text[idx];
            setCurrentText(previousText => previousText + current_ch);
        }

    };

    const _handleNoteSequenceShow = async () => {

        createTypewriterEffect(tmp_list[0].description);

    }

    // TODO: typewriting effect
    useEffect(() => {

        _handleNoteSequenceShow();

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
                            <h3 className="text-gray-900 font-medium">
                                {noteDict.title}
                            </h3>
                            <p className="text-[15px] tracking-normal leading-9 pt-4">
                                {/* <TypeWriter text={noteDict.description} /> */}
                                {currentText}
                            </p>
                            {/* <h3 className="text-gray-900 font-medium pt-5 pb-4">
                                Key Points:
                            </h3>
                            <ul className="list-disc space-y-4">

                                {noteDict.key_points.map((item, index) => (
                                    <li className="text-[15px] ml-3 " key={index}>
                                        {item}
                                    </li>
                                ))}

                            </ul> */}

                            {/* <p>
                                Key Points:
                            </p> */}
                            {/* TODO: */}
                            {/* Key Points */}
                            {/* Try it */}

                            {/* <p className="text-gray-600 text-[15.5px] tracking-normal leading-9 pt-4">
                                {noteDict.description}
                            </p> */}
                        </div>
                    </div>

                    {/* Buttons */}
                    {/* <div className="mt-6 text-center space-x-2">
                        <button
                            type="button"
                            className="py-3 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        >
                            <FontAwesomeIcon icon={faQuestion} className="pr-1" />
                            Ask a Question
                        </button>

                        <button
                            type="button"
                            className="py-3 px-5 me-2 mb-2 text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                            Challenge Me
                            <FontAwesomeIcon icon={faArrowRight} className="pl-1" />
                        </button>
                    </div> */}

                </div>


                {/* Second Half */}
                {(showExample === true) ? (

                    <div className="w-1/2 ml-0 flex flex-col pt-0 border-l-2 border-gray-50">

                            <div className="flex-grow p-4 pt-0 pb-0">
                                
                                <div className="flex justify-between">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Code</h2>
                                    <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-[13.5px] px-3 py-0 me-0 mb-3 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                                        <FontAwesomeIcon icon={faPlay} className="pl-1 pr-1 text-[12px]"/>{" "}Run
                                    </button>
                                </div>
                                
                                <textarea
                                        className="w-full h-64 resize-none rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none p-2 font-mono text-sm text-gray-800"
                                        placeholder="# Write your code here..."
                                    >
                                        {currentText}
                                    </textarea>

                                <div className="flex-grow p-0 pt-4">
                                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Console Output</h2>
                                    <div className="h-40 overflow-auto bg-black text-green-500 p-2 rounded-md font-mono text-sm">
                                    Console output will appear here...
                                    </div>
                                </div>

                            </div>

                        </div>

                    ) : (

                        null 

                    )}

                </div>


            </div>

    )

};

export default SecondNoteParentLayout;