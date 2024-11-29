"use client";
import { useEffect, useState, useContext } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from '../../context/UserContext';
import TopNavBar from '../components/Utils/TopNavBar';
import MainGeneralTutorLayout from '../components/GeneralTutor/MainLayout';


const GeneralTutorPage = () => {

    const [loading, setLoading] = useState(true);
    const userContext = useContext(UserContext);

    // Update page title
    useEffect(() => {
        document.title = "Companion - General Tutor";
    }, []);

    useEffect(() => {
        if (userContext && userContext.loading === false){
            setLoading(false);
        }
    }, [userContext]);


    return (
        <>

            {/* className="dark:bg-gray-900 bg-[#F3F4F6]" */}
            <main>
                {loading ? (
                    // Loading indicator while page is loading
                    <div>Loading...</div>
                ) : (

                    // Render components only after loading completes
                    <>
                        <TopNavBar
                            userAuthenticated={userContext?.isAuthenticated}
                        />
                        <MainGeneralTutorLayout />
                    </>

                    // // Render components only after loading completes
                    // <div>

                    //     <div className="flex flex-col text-center justify-center mt-10">
                    //         <h2 className="text-[29px] font-bold">
                    //             Chat with Tutor
                    //         </h2>
                    //         <p className="text-[16px] text-gray-500 pt-2 tracking-normal">
                    //             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum.
                    //             Need an IDE, visit the <a href="/playground" className="font-medium text-blue-500 dark:text-blue-400 hover:underline">playground</a>.
                    //         </p>
                    //     </div>

                    //     {/* Messages Div */}

                    //     <div
                    //         className="flex justify-center mt-4"
                    //     >
                    //         <div
                    //             className="overflow-y-auto min-h-[500px] max-h-[500px] max-w-4xl flex-grow p-4 space-y-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-[#F3F4F6] dark:bg-gray-800"
                    //         >

                    //             {/* Messages */}
                    //             <div
                    //                 className="self-start bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded-lg w-full max-w-full break-words text-[13px] whitespace-pre-wrap"
                    //             >
                    //                 Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    //             </div>

                    //             <div
                    //                 className={"self-end bg-blue-400 text-white p-3 rounded-lg w-full max-w-full break-words text-[13px] whitespace-pre-wrap"}
                    //             >
                    //                 Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    //             </div>

                    //         </div>
                    //     </div>


                    //     <div className="flex space-x-4 max-w-4xl mx-auto mt-4">
                            
                    //         {/* Input */}
                    //         <input
                    //             type="text"
                    //             className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-[#F3F4F6] dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    //             placeholder="dolor sit amet..."
                    //         />

                    //         {/* Button */}
                    //         <button
                    //             className="w-[100px] h-[52px] text-[14px] text-white dark:text-black bg-blue-500 dark:bg-gray-500 font-medium rounded-lg flex items-center justify-center"
                    //         >
                    //             <FontAwesomeIcon icon={faPaperPlane} className="text-white pr-2" />
                    //             Send
                    //         </button>
                    //     </div>

                    // </div>

                )}
            </main>

        </>
    );
};
  
export default GeneralTutorPage;