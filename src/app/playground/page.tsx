"use client";
import { useEffect, useState, useContext } from 'react';
import TopNavBar from '../components/Utils/TopNavBar';
import PlaygroundLayout from '../components/PlaygroundLayout/MainLayout';
import { UserContext } from '../../context/UserContext';


export default function Home({ searchParams }) {

    const [loading, setLoading] = useState(true);

    const userContext = useContext(UserContext);
    console.log('user-context-data:', userContext);

    const _handleInitialLoad = () => {
        setLoading(false);
    };

    useEffect(() => {
        _handleInitialLoad();
    }, []);

    // Update page title
    useEffect(() => {
        document.title = "Playground";
    }, []);

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
                            userAuthenticated={userContext.isAuthenticated}
                        />
                        <PlaygroundLayout
                            accessToken={userContext.userAccessToken}
                            userAuthenticated={userContext.isAuthenticated}
                            pageLoading={loading}
                            searchParams={searchParams}
                        />
                    </>
                )}
            </main>

        </>
    );
}