"use client";
import { useEffect, useState, useContext } from 'react';
// import { useUser } from '@auth0/nextjs-auth0/client';
import TopNavBar from '../components/Utils/TopNavBar';
// import MainLayout from '../components/PlaygroundLayout/MainLayout';
import SecondLayout from '../components/PlaygroundLayout/SecondLayout';
import Head from 'next/head';
// import { getUserAccessToken } from '../../lib/internal/getUserAccessToken';
import { UserContext } from '../../context/UserContext';



export default function Home({ searchParams }) {

    const [userAccessToken, setUserAccessToken] = useState(null);
    const [userIsAuthenticated, setUserIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);  // by default false

    const userContext = useContext(UserContext);
    console.log('user-context-data:', userContext);

    const _handleInitialLoad = () => {
        setLoading(false);
    };

    useEffect(() => {
        _handleInitialLoad();
    }, []);

    // TODO: 
        // start here by continuning refactor and finalization

    // // Fetch access token on component mount
    // const handleFetchUserData = async () => {
    //     try {

    //         let user_access_token = await getUserAccessToken();
    //         console.log('user_access_token_response:', user_access_token);

    //         if (user_access_token !== undefined) {
                                
    //             setUserAccessToken(user_access_token);
    //             setUserIsAuthenticated(true);
    //             setLoading(false);

    //         } else {

    //             setUserIsAuthenticated(false);
    //             setLoading(false);

    //         }

    //     } catch (error) {
    //         console.error("Error fetching access token:", error);
    //         setUserIsAuthenticated(false);
    //     }
    // };

    // // Initial fetch of user data on mount
    // useEffect(() => {
    //     handleFetchUserData();
    // }, []);

    // Update page title
    useEffect(() => {
        document.title = "Playground";
    }, []);

    return (
        <>
            {/* <Head>
                <title>Playground</title>
            </Head> */}
            {/* <main>
                <TopNavBar
                    accessToken={userAccessToken}
                    userAuthenticated={userIsAuthenticated}
                    pageLoading={loading}
                />
                <SecondLayout
                    accessToken={userAccessToken}
                    userAuthenticated={userIsAuthenticated}
                    pageLoading={loading}
                />
            </main> */}

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
                        <SecondLayout
                            accessToken={userAccessToken}
                            userAuthenticated={userIsAuthenticated}
                            pageLoading={loading}
                            searchParams={searchParams}
                        />
                    </>
                )}
            </main>

        </>
    );
}



// export default function Home() {

//     // useEffect(() => {}, []);
//     useEffect(() => {
//         document.title = "Playground"; // Fallback in case the Head component doesn't work
//     }, []);

//     // TODO:
//     const { user } = useUser();
//     const [userAccessToken, setUserAccessToken] = useState(null);
//     const [userIsAuthenticated, setUserIsAuthenticated] = useState(false);
//     const [loading, setLoading] = useState(true);

//     const handleFetchUserData = async () => {
//         try {
//             const res = await fetch('/api/get-access-token', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });
//             const { accessToken } = await res.json();

//             console.log('access-token:', accessToken);

//             if (accessToken !== undefined) {
//                 setUserAccessToken(accessToken);
//                 setUserIsAuthenticated(true);
//                 setLoading(true);
//             };
//         } catch (error) {
//             console.error("Error fetching access token or data:", error);
//         }
//     };

//     useEffect(() => {
//         handleFetchUserData();
//     }, []);


//     return (
       
//         <>
//             <Head>
//                 <title>Playground</title>
//             </Head>
//             <main>
//                 <TopNavBar 
//                     accessToken={userAccessToken}
//                     userAuthenticated={userIsAuthenticated}
//                     pageLoading={loading}
//                 />
//                 <SecondLayout 
//                     accessToken={userAccessToken}
//                     userAuthenticated={userIsAuthenticated}
//                     pageLoading={loading}
//                 />

//             </main>
//         </>

//     );

// }


{/* <MainLayout 
                    accessToken={userAccessToken}
                    userAuthenticated={userIsAuthenticated}
                    pageLoading={loading}
                /> */}