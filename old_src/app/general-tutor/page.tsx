"use client";
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import TopNavBar from '../components/Utils/TopNavBar';
import MainGeneralTutorLayout from '../components/GeneralTutor/MainLayout';


const GeneralTutorPage = () => {

    const [loading, setLoading] = useState(true);
    const userContext = useContext(UserContext);

    // Update page title
    useEffect(() => {
        document.title = "Companion | General Tutor";
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
                    <>
                        <TopNavBar
                            userAuthenticated={userContext?.isAuthenticated}
                        />
                        <MainGeneralTutorLayout
                            accessToken={userContext?.userAccessToken}
                            userAuthenticated={userContext?.isAuthenticated}
                        />
                    </>
                )}
            </main>

        </>
    );
};
  
export default GeneralTutorPage;