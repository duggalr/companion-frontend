import { useEffect, useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import { ResizableBox } from "react-resizable";
// import CodeEditor from '../MainLeftSide/CodeEditor';
import NewCodeEditor from './NewCodeEditor';
import ConsoleChatTabs from "../MainRightSide/ConsoleChatTabs";
import { fetchPlaygroundData }  from "../../../lib/api/fetchPlaygroundData";
import { saveUserRunCode }  from "../../../lib/api/saveUserRunCode";
import RightTablayout from "./RightTabLayout";
import Editor from "@monaco-editor/react";

import useUserContext from '../../../lib/hooks/useUserContext';
import { useWebSocket } from "../../../lib/hooks/useWebSocket";


const PlaygroundLayout = ({ }) => {
    
    const FASTAPI_WEBSOCKET_URL = process.env.NEXT_PUBLIC_CHAT_WEBSOCKET_URL;
    // const router = useRouter();

    const {isAuthenticated, userAccessToken} = useUserContext();
    const {
        sendMessage,
        messages,
        generatedMessage,
        isGeneratingMessage,
        isLoading
    } = useWebSocket(FASTAPI_WEBSOCKET_URL);


    return (

        <div className="flex h-screen bg-[#f4f5f6] dark:bg-gray-900">

            {/* Parent */}
            <ResizableBox
                width={720}
                height={Infinity}
                minConstraints={[600, Infinity]}
                maxConstraints={[800, Infinity]}
                axis="x"
                className="relative"
                resizeHandles={["e"]}
                handle={
                    <div
                        className="w-[4px] bg-blue-400 dark:bg-blue-800 dark:hover:bg-blue-500 hover:bg-blue-500 cursor-ew-resize h-full absolute right-0 top-0 group-hover:w-4 transition-all duration-300 flex items-center justify-center"
                        style={{ touchAction: "none" }}
                    >
                    </div>
                }
            >

                <div className="h-screen flex flex-col">

                    {/* Code Editor - Top Half */}
                    <ResizableBox
                        width={Infinity}
                        height={500}
                        minConstraints={[Infinity, 300]}
                        maxConstraints={[Infinity, 600]}
                        axis="y"
                        className="relative"
                        resizeHandles={["s"]}
                        handle={
                        <div
                            className="h-[4px] bg-blue-400 dark:bg-blue-800 dark:hover:bg-blue-500 hover:bg-blue-500 cursor-ns-resize w-full absolute bottom-0 group-hover:h-4 transition-all duration-300 flex items-center justify-center"
                            style={{ touchAction: "none" }}
                        ></div>
                        }
                        onResizeStop={(e, data) => {
                            const stdoutHeight = `calc(100% - ${data.size.height}px)`;
                            document.documentElement.style.setProperty("--stdout-height", stdoutHeight);
                        }}
                    >
                        <div className="h-full w-full">
                            <NewCodeEditor/>
                        </div>
                    </ResizableBox>

                    {/* Stdout Output - Bottom Half */}
                    <div
                        className="ml-1 mt-2 w-[98%] overflow-y-auto rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-200 dark:bg-gray-800 text-gray-900 flex-grow"
                        style={{ height: "var(--stdout-height, 40%)" }} // Default height or calculated height
                        // style={{ height: "var(--stdout-height, 45%)", transition: "height 0.2s ease-in-out" }} // Add smooth transition
                    >
                        <p className="text-gray-600 dark:text-gray-500 pt-2 pl-3 text-[14px] tracking-normal font-normal">
                            <span className="text-blue-500">{'>> '}</span>Stdout
                        </p>
                    </div>
                </div>

            </ResizableBox>


            {/* Right Side */}
            <div
                className="flex flex-col flex-1 bg-[#F3F4F6] dark:bg-gray-900"
            >
                <RightTablayout />
            </div>

        </div>

    )

};

export default PlaygroundLayout;