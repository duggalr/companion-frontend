import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faSpinner } from "@fortawesome/free-solid-svg-icons";


const MainGeneralTutorLayout = ({ }) => {

    return (

        <div className="flex h-screen">

            {/* Left Navbar */}
            <div className="flex flex-col w-64 bg-gray-100 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600 p-4 h-screen pt-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Past Conversations
                </h3>
                <ul className="space-y-3 text-[14px]">
                    <li className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg p-2 cursor-pointer">
                        Conversation 1
                    </li>
                    <li className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg p-2 cursor-pointer">
                        Conversation 2
                    </li>
                    <li className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg p-2 cursor-pointer">
                        Conversation 3
                    </li>
                    <li className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg p-2 cursor-pointer">
                        Conversation 4
                    </li>
                    {/* Add more conversation list items as needed */}
                </ul>
            </div>

            {/* General Tutor Content */}
            <div className="flex flex-col justify-start items-center flex-grow bg-[#F3F4F6] dark:bg-gray-900">

                {/* Header */}
                <div className="flex flex-col text-center pt-10">
                    <h2 className="text-[29px] font-bold">
                        Chat with Tutor
                    </h2>
                    <p className="text-[15px] text-gray-500 pt-2 tracking-normal">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum.
                        Need an IDE, visit the <a href="/playground" className="font-medium text-blue-500 dark:text-blue-400 hover:underline">playground</a>.
                    </p>
                </div>

                {/* Messages Div */}
                <div className="flex justify-center mt-6 w-full px-4">
                    <div
                        className="overflow-y-auto min-h-[500px] max-h-[500px] w-full max-w-4xl p-4 space-y-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-[#F3F4F6] dark:bg-gray-800"
                    >
                        <div
                            className="self-start bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg w-full max-w-full break-words text-[13px] whitespace-pre-wrap"
                        >
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        </div>

                        <div
                            className="self-end bg-blue-400 text-white p-3 rounded-lg w-full max-w-full break-words text-[13px] whitespace-pre-wrap"
                        >
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        </div>
                        
                    </div>
                </div>

                {/* Input and Button */}
                <div className="flex justify-center mt-4 w-full px-4">
                    <div className="flex w-full max-w-4xl space-x-2">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-[#F3F4F6] dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            className="px-4 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        >
                            Send
                        </button>
                    </div>
                </div>

            </div>

        </div>



        // <div>

        //     {/* Left Navbar */}
        //     <div className="flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600 p-4 h-screen">
        //         <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Past Conversations</h3>
        //         <ul className="space-y-3">
        //             <li className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg p-2 cursor-pointer">
        //                 Conversation 1
        //             </li>
        //             <li className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg p-2 cursor-pointer">
        //                 Conversation 2
        //             </li>
        //             <li className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg p-2 cursor-pointer">
        //                 Conversation 3
        //             </li>
        //             <li className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg p-2 cursor-pointer">
        //                 Conversation 4
        //             </li>
        //             {/* Add more conversation list items as needed */}
        //         </ul>
        //     </div>


        //     {/* General Tutor */}
        //     <div className="justify-start items-center h-screen bg-[#F3F4F6] dark:bg-gray-900">

        //         {/* Header */}
        //         <div className="flex flex-col text-center pt-10">
        //             <h2 className="text-[29px] font-bold">
        //                 Chat with Tutor
        //             </h2>
        //             <p className="text-[16px] text-gray-500 pt-2 tracking-normal">
        //                 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum.
        //                 Need an IDE, visit the <a href="/playground" className="font-medium text-blue-500 dark:text-blue-400 hover:underline">playground</a>.
        //             </p>
        //         </div>

        //         {/* Messages Div */}
        //         <div className="flex justify-center mt-6 w-full px-4">
        //             <div
        //                 className="overflow-y-auto min-h-[500px] max-h-[500px] w-full max-w-4xl p-4 space-y-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-[#F3F4F6] dark:bg-gray-800"
        //             >
        //                 <div
        //                     className="self-start bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg w-full max-w-full break-words text-[13px] whitespace-pre-wrap"
        //                 >
        //                     Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        //                 </div>

        //                 <div
        //                     className="self-end bg-blue-400 text-white p-3 rounded-lg w-full max-w-full break-words text-[13px] whitespace-pre-wrap"
        //                 >
        //                     Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        //                 </div>
        //             </div>
        //         </div>

        //         {/* Input and Button */}
        //         <div className="flex justify-center mt-4 w-full px-4">
        //             <div className="flex w-full max-w-4xl space-x-2">
        //                 <input
        //                     type="text"
        //                     placeholder="Type your message..."
        //                     className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-[#F3F4F6] dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        //                 />
        //                 <button
        //                     className="px-4 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        //                 >
        //                     Send
        //                 </button>
        //             </div>
        //         </div>

        //     </div>

        // </div>








        // <div className="flex flex-col justify-start items-center h-screen bg-[#F3F4F6] dark:bg-gray-900">

        //     {/* Header */}
        //     <div className="flex flex-col text-center pt-10">
        //         <h2 className="text-[29px] font-bold">
        //             Chat with Tutor
        //         </h2>
        //         <p className="text-[16px] text-gray-500 pt-2 tracking-normal">
        //             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum.
        //             Need an IDE, visit the <a href="/playground" className="font-medium text-blue-500 dark:text-blue-400 hover:underline">playground</a>.
        //         </p>
        //     </div>

        //     {/* Messages Div */}
        //     <div className="flex justify-center mt-6 w-full px-4">
        //         <div
        //             className="overflow-y-auto min-h-[500px] max-h-[500px] w-full max-w-4xl p-4 space-y-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-[#F3F4F6] dark:bg-gray-800"
        //         >
        //             <div
        //                 className="self-start bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg w-full max-w-full break-words text-[13px] whitespace-pre-wrap"
        //             >
        //                 Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        //             </div>

        //             <div
        //                 className="self-end bg-blue-400 text-white p-3 rounded-lg w-full max-w-full break-words text-[13px] whitespace-pre-wrap"
        //             >
        //                 Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        //             </div>
        //         </div>
        //     </div>

        //     {/* Input and Button */}
        //     <div className="flex justify-center mt-4 w-full px-4">
        //         <div className="flex w-full max-w-4xl space-x-2">
        //             <input
        //                 type="text"
        //                 placeholder="Type your message..."
        //                 className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-[#F3F4F6] dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        //             />
        //             <button
        //                 className="px-4 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        //             >
        //                 Send
        //             </button>
        //         </div>
        //     </div>

        // </div>

    )

};

export default MainGeneralTutorLayout;