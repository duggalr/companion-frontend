"use client";
import { useEffect, useState } from 'react';
import TopNavBar from '../components/Utils/TopNavBar';
import { getUserAccessToken } from '@/lib/getUserAccessToken';
import DashboardLayout from '../components/Dashboard/DashboardLayout';


export default function Dashboard() {

    const [userAccessToken, setUserAccessToken] = useState(null);
    const [userIsAuthenticated, setUserIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch access token on component mount
    const handleFetchUserData = async () => {
        try {

            let user_access_token = await getUserAccessToken();
            console.log('user_access_token_response:', user_access_token);

            if (user_access_token !== undefined) {
                                
                setUserAccessToken(user_access_token);
                setUserIsAuthenticated(true);
                setLoading(false);

            } else {

                setUserIsAuthenticated(false);
                setLoading(false);

            }

        } catch (error) {
            console.error("Error fetching access token:", error);
            setUserIsAuthenticated(false);
        }
    };

    // Initial fetch of user data on mount
    useEffect(() => {
        handleFetchUserData();
    }, []);

    // Update page title
    useEffect(() => {
        document.title = "Dashboard";
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
                            accessToken={userAccessToken}
                            userAuthenticated={userIsAuthenticated}
                            pageLoading={loading}
                        />
                        <DashboardLayout 
                            accessToken={userAccessToken}
                            userAuthenticated={userIsAuthenticated}
                            pageLoading={loading}
                        />
                    </>
                )}
            </main>

        </>

    );

}