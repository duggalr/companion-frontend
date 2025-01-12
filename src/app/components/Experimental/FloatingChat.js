import React, {useState, useRef} from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faComment, faXmark, faQuestion } from "@fortawesome/free-solid-svg-icons";

// TODO:

const FloatingChat = () => {

    const [isChatOpen, setIsChatOpen] = useState(false);
    const chatRef = useRef(null);

    return (

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

    )


}

export default FloatingChat;