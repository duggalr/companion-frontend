import { useState } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faPencil } from "@fortawesome/free-solid-svg-icons";


const ProblemLayout = ({}) => {

    return (

        <MathJaxContext>
    
            <MathJax>

                <div className="p-2 pl-4 pt-4">

                    {/* <h1 className="font-semibold text-[18px] pb-2">
                        Question
                    </h1>

                    <span>
                        edit 
                    </span> */}

                    {/* TODO: start here by contunining to finalize; once abstract layout is good, proceed to implementation as UI will really change then */}
                    <div className="flex items-center pb-2">
                        <h1 className="font-semibold text-[17px] mr-2">
                            Question
                        </h1>
                        <span className="text-[12px] text-gray-500 cursor-pointer pl-2 pt-1 text-right hover:text-blue-400">
                            <FontAwesomeIcon icon={faPencil} className="pr-1"/>
                            edit question
                        </span>
                    </div>

                    {/* <div className="flex items-center justify-between pb-2">
                        <h1 className="font-semibold text-[16.5px]">
                            Question
                        </h1>
                        <span className="text-[13px] text-gray-500 cursor-pointer flex items-center pr-4 pb-1">
                            <FontAwesomeIcon icon={faPencil} className="pr-1" />
                            edit question
                        </span>
                    </div> */}

                    <p className="px-1 pt-2 leading-7 text-[14.5px]">
                        Given a signed 32-bit integer x, return x with its digits reversed. 
                        If reversing x causes the value to go outside the signed 32-bit integer range \([-231, 231 - 1]\), then return 0.
                       Assume the environment does not allow you to store 64-bit integers (signed or unsigned).
                    </p>
 
                    <div class="relative flex py-0 pt-6 pb-4 items-center">
                        <div class="flex-grow border-t border-gray-400"></div>
                        <span class="flex-shrink mx-4 text-gray-400">Example I/O</span>
                        <div class="flex-grow border-t border-gray-400"></div>
                    </div>

                    {/* <h1 className="pt-0 font-semibold text-[18px] pb-2">
                        Examples
                    </h1> */}

                    {/* <div className="pt-2">
                        <p className="font-semibold">Example 1:</p>
                        <div>
                            <p className="pt-0 text-[15px]">
                                <span className="font-semibold pr-1">Input:</span>
                                x = 123
                            </p>
                            <p className="pt-2 text-[15px]">
                                <span className="font-semibold pr-1">Output:</span>
                                321
                            </p>    
                        </div>
                    </div> */}

                    <div className="pt-0">
                        <p className="font-semibold pb-2">Example 1:</p>
                        <div className="relative flex pl-4">
                            {/* Vertical line */}
                            <div className="absolute left-0 top-0 h-full w-[2px] bg-gray-400" />
                            {/* Content */}
                            <div>
                                <p className="pt-0 text-[15px]">
                                    <span className="font-semibold pr-1">Input:</span>
                                    x = 123
                                </p>
                                <p className="pt-2 text-[15px]">
                                    <span className="font-semibold pr-1">Output:</span>
                                    321
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8">
                        <p className="font-semibold pb-2">Example 2:</p>
                        <div className="relative flex pl-4">
                            {/* Vertical line */}
                            <div className="absolute left-0 top-0 h-full w-[2px] bg-gray-400" />
                            {/* Content */}
                            <div>
                                <p className="pt-0 text-[15px]">
                                    <span className="font-semibold pr-1">Input:</span>
                                    x = 123
                                </p>
                                <p className="pt-2 text-[15px]">
                                    <span className="font-semibold pr-1">Output:</span>
                                    321
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8">
                        <p className="font-semibold pb-2">Example 3:</p>
                        <div className="relative flex pl-4">
                            {/* Vertical line */}
                            <div className="absolute left-0 top-0 h-full w-[2px] bg-gray-400" />
                            {/* Content */}
                            <div>
                                <p className="pt-0 text-[15px]">
                                    <span className="font-semibold pr-1">Input:</span>
                                    x = 123
                                </p>
                                <p className="pt-2 text-[15px]">
                                    <span className="font-semibold pr-1">Output:</span>
                                    321
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* <div className="pt-6">
                        <div>
                            <p className="pt-2 text-[15px]">
                                <span className="font-semibold pr-1">Input:</span>
                                x = 123
                            </p>
                            <p className="pt-2 text-[15px]">
                                <span className="font-semibold pr-1">Output:</span>
                                321
                            </p>
                        </div>
                    </div> */}

                    <div className="space-x-2 pt-10">
                        <Button>Run Code</Button>
                        <Button>Chat with Tutor</Button>
                        <Button>Get Time Complexity</Button>
                    </div>

                </div>

            </MathJax>

        </MathJaxContext>

    );
    
};

export default ProblemLayout;
