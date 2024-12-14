"use client";
import { useEffect, useState, useContext } from 'react';
import TopNavBar from '../components/Utils/TopNavBar';
import PlaygroundLayout from '../components/PlaygroundLayout/MainLayout';
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
        <>
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
                        <PlaygroundLayout
                            accessToken={userContext?.userAccessToken}
                            userAuthenticated={userContext?.isAuthenticated}
                            pageLoading={loading}
                        />
                    </>
                )}
            </main>

        </>
    );
}