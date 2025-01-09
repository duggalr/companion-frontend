import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faComment, faXmark, faQuestion, faPlay } from "@fortawesome/free-solid-svg-icons";


const ExampleLayout = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const chatRef = useRef(null);

    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setIsChatOpen(false);
      }
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

    return (

        <div className="flex flex-col items-center min-h-screen mt-20">

            {/* Top Header */}
            <div className="flex justify-between items-center w-full max-w-5xl py-4 border-b border-gray-300">

                {/* Current Chapter and Title */}
                <div className="text-left flex text-[16px] tracking-normal">
                    <h1 className="font-semibold text-gray-900">Chapter 2: </h1>
                    <p className="text-gray-600 pl-2 text-[15px]">Variables and Simple Data Types</p>
                </div>

                {/* Next Chapter */}
                <div className="text-right flex text-[15px] tracking-normal">
                    <h1 className="text-gray-900 hover:text-blue-400 cursor-pointer">
                        Next Chapter <FontAwesomeIcon icon={faArrowRight} className="pl-1 text-[14px]" />
                    </h1>
                </div>

            </div>

            {/* Content Section */}
            <div className="flex flex-grow w-full max-w-[1020px] py-0">
                
                {/* Left Side: Notes / Description and Buttons */}
                <div className="w-1/2 p-0 pt-8">

                    <h2 className="text-[19px] font-semibold text-gray-800 mb-4">
                        Running a simple Python program
                    </h2>
                    <div className="space-y-4">
                        <div>
                            {/* <h3 className="text-gray-700 font-medium">Title</h3> */}
                            <p className="text-gray-600 text-[15.5px] tracking-normal leading-9">
                                In this example, you will lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum gravida, sapien non mattis dictum, nulla eros consequat nisl, tristique blandit sem ante sit amet urna. Pellentesque nisi mi, blandit vel varius non, sollicitudin eget tortor. Quisque dictum nulla.
                            </p>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="mt-6 text-center space-x-2">
                        <button
                            type="button"
                            className="py-3 px-7 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        >
                            <FontAwesomeIcon icon={faQuestion} className="pr-1" />
                            Ask a Question
                        </button>

                        <button
                            type="button"
                            className="py-3 px-7 me-2 mb-2 text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                        >
                            Proceed to a Challenge
                            <FontAwesomeIcon icon={faArrowRight} className="pl-1" />
                        </button>
                    </div>

                </div>


                {/* Right Side: Code Editor and Console */}
                <div className="w-2/3 ml-6 flex flex-col pt-3 border-l-2 border-gray-50">
                    
                    {/* Editor */}
                    <div className="flex-grow p-4 pb-0">
                        
                        <div className="flex justify-between">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Code</h2>
                            <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-[13.5px] px-3 py-0 me-0 mb-3 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                                <FontAwesomeIcon icon={faPlay} className="pl-1 pr-1 text-[12px]"/>{" "}Run
                            </button>
                        </div>
                        
                        <textarea
                            className="w-full h-64 resize-none rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none p-2 font-mono text-sm text-gray-800"
                            placeholder="// Write your code here..."
                        >{`print('Hello World')
x = 3
y = 4
`}
                        </textarea>

                        {/* Console Output */}
                        <div className="flex-grow p-0 pt-4">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Console Output</h2>
                            <div className="h-40 overflow-auto bg-black text-green-500 p-2 rounded-md font-mono text-sm">
                            Console output will appear here...
                            </div>
                        </div>

                    </div>

                </div>


                {/* Left Side: Notes */}
                {/* <div className="w-1/3 bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Notes</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-gray-700 font-medium">Title</h3>
                            <p className="text-gray-600 text-sm">This is a placeholder for your notes. Add content here...</p>
                        </div>
                    </div>
                </div> */}

                {/* Right Side: Code Editor and Console */}
                {/* <div className="w-2/3 ml-6 bg-white shadow-md rounded-lg flex flex-col"> */}
                    
                    {/* Editor */}
                    {/* <div className="flex-grow p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Code Editor</h2>
                        <textarea
                            className="w-full h-64 resize-none rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none p-2 font-mono text-sm text-gray-800"
                            placeholder="// Write your code here..."
                        ></textarea>
                    </div> */}

                    {/* Console Tabs */}
                    {/* <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-t border-gray-200">
                        <div className="flex space-x-4">
                            <button
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="code-tab"
                            >
                                Editor
                            </button>
                            <button
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                id="console-tab"
                            >
                                Console
                            </button>
                        </div>
                        <button
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={() => alert('Run button clicked')}
                        >
                        Run
                        </button>
                    </div> */}

                    {/* Console Output */}
                    {/* <div className="flex-grow p-4 bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Console Output</h2>
                        <div className="h-40 overflow-auto bg-black text-green-500 p-2 rounded-md font-mono text-sm">
                        Console output will appear here...
                        </div>
                    </div> */}

                {/* </div> */}

            </div>

            {/* Chat Interface */}
            <div className="fixed bottom-4 right-4">

                {/* Chat Toggle Button */}
                { (isChatOpen === true) ? (

                    <button
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        className="bg-gray-500 text-white p-0 px-3 py-1 rounded-full shadow-lg hover:bg-gray-600 focus:outline-none"
                    >
                    <FontAwesomeIcon icon={faXmark} className="" />
                    </button>

                ) : (

                    <button
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        className="bg-blue-500 text-white p-0 px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                    <FontAwesomeIcon icon={faComment} className="" />
                    </button>

                )}

                {/* Chat Window */}
                {isChatOpen && (
                    <div
                        ref={chatRef}
                        className="w-80 h-96 bg-white rounded-lg shadow-lg flex flex-col overflow-hidden mt-2"
                    >
                        <div className="bg-blue-500 text-white px-4 py-2 text-lg font-medium">AI Tutor Chat</div>
                        <div className="flex-1 p-4 overflow-y-auto space-y-3">
                            <div className="bg-gray-200 text-gray-800 p-3 rounded-lg self-start w-fit">
                                <p className="text-sm">AI Tutor: How can I help you today?</p>
                            </div>
                            <div className="bg-blue-500 text-white p-3 rounded-lg self-end w-fit">
                                <p className="text-sm">You: Can you explain variables?</p>
                            </div>
                        </div>
                        <div className="border-t border-gray-300 p-2">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>
                )}
            </div>

        </div>

    )

};

export default ExampleLayout;