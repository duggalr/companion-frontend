import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faComment, faXmark, faQuestion } from "@fortawesome/free-solid-svg-icons";


const ExperimentalLayout = () => {
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

        <div className="flex flex-col items-center min-h-screen mt-24">

            {/* Top Header */}
            <div className="flex justify-between items-center w-full max-w-5xl py-4 border-b border-gray-300">

                {/* Current Chapter and Title */}
                <div className="text-left flex text-[16px] tracking-normal">
                    <h1 className="font-semibold text-gray-900">Chapter 2: </h1>
                    <p className="text-gray-600 pl-2 text-[15px]">Variables and Simple Data Types</p>
                </div>

                {/* Next Chapter */}
                {/* <div className="text-right flex text-[15px] tracking-normal">
                    <h1 className="text-gray-900 hover:text-blue-400 cursor-pointer">
                        Next Chapter <FontAwesomeIcon icon={faArrowRight} className="pl-1 text-[14px]" />
                    </h1>
                </div> */}

            </div>

            <div>

                {/* Notes Section */}
                <div className="w-full max-w-[950px] mt-14">
                    <h3 className="text-[18px] tracking-normal font-semibold text-gray-800 mb-6">
                        Module: Introduction to Running Python Programs
                    </h3>
                    <p className="text-gray-700 p-1 leading-10">
                        This module introduces the basics of running a Python script. We look at how a simple script like &apos;hello_world.py&apos; is executed by Python. Python interprets the code line by line and prints output on the console. Understanding the role of the Python interpreter and syntax highlighting in code editors is also covered.
                    </p>
                </div>

                <div className="mt-8 text-center space-x-4">
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
                        Proceed to an Example
                        <FontAwesomeIcon icon={faArrowRight} className="pl-1" />
                    </button>
                </div>

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

export default ExperimentalLayout;