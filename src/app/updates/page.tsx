"use client";
import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import TopNavBar from '../components/Utils/TopNavBar';
import Changelog from '../components/Updates/Changelog';


const ChangelogPage = () => {

    const [loading, setLoading] = useState(true);
    const userContext = useContext(UserContext);

    // Update page title
    useEffect(() => {
        document.title = "Companion - Updates";
    }, []);

    useEffect(() => {
        if (userContext && userContext.loading === false){
            setLoading(false);
        }
    }, [userContext]);


    return (
        // <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        //     <Changelog />
        // </div>

        <>
            <main >
                {loading ? (
                    // Loading indicator while page is loading
                    <div>Loading...</div>
                ) : (
                    // Render components only after loading completes
                    <>
                        <TopNavBar
                            userAuthenticated={userContext?.isAuthenticated}
                        />
                        <Changelog />
                    </>
                )}
            </main>

        </>

    );
};
  
export default ChangelogPage;