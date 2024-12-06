"use client";
import { useEffect, useState, useContext } from 'react';
import TopNavBar from '../components/Utils/TopNavBar';
// import PlaygroundLayout from '../components/PlaygroundLayout/MainLayout';
import NewPlaygroundLayout from '../components/NewPlayground/NewPlaygroundLayout';
import { UserContext } from '../../context/UserContext';
// import { validAuthenticatedUser } from '@/lib/api/checkAuthenticatedUser';


// export default function Home({ searchParams }: { searchParams: Record<string, string | string[]> }) {
export default function Home() {

    const [loading, setLoading] = useState(true);
    const userContext = useContext(UserContext);

    // Update page title
    useEffect(() => {
        document.title = "Companion | Playground";
    }, []);

    useEffect(() => {
        if (userContext && userContext.loading === false){
            setLoading(false);
            // if (userContext.isAuthenticated === true){
            //     _handleUserValidation();
            // }
        }
    }, [userContext]);

    return (
        
        // overflow-auto no-scrollbar
        <main className="h-screen">

            {/* className='h-screen overflow-hidden' */}
            {loading ? (
                // Loading indicator while page is loading
                <div>Loading...</div>
            ) : (

                <div>

                    <TopNavBar userAuthenticated={userContext?.isAuthenticated} />
                    <NewPlaygroundLayout
                        accessToken={userContext?.userAccessToken}
                        userAuthenticated={userContext?.isAuthenticated}
                        pageLoading={loading}
                    />

                </div>

            )}

        </main>
    );
}