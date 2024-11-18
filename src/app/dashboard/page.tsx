"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState, useContext } from 'react';
import TopNavBar from '../components/Utils/TopNavBar';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { UserContext } from '../../context/UserContext';
// import { validAuthenticatedUser } from '@/lib/api/checkAuthenticatedUser';


export default function Dashboard() {

    const router = useRouter();
    const [loading, setLoading] = useState(true);

    const userContext = useContext(UserContext);

    // Update page title
    useEffect(() => {
        document.title = "Dashboard";
    }, []);

    // const _handleUserValidation = async() => {
    //     let user_access_token = userContext?.userAccessToken;
    //     let validated_user_data = await validAuthenticatedUser(user_access_token);
    //     console.log('validated-user-data-response-playground:', validated_user_data);
    // }

    // Updatiing user context
    useEffect(() => {

        if (userContext && userContext.loading === false){

            if (userContext.isAuthenticated === false){
                router.push('/');
            } else {
                setLoading(false);
                // _handleUserValidation();
            }

        }

    }, [userContext, router]);


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
                        <DashboardLayout 
                            accessToken={userContext?.userAccessToken}
                            userAuthenticated={userContext?.isAuthenticated}
                        />
                    </>
                )}
            </main>

        </>

    );

}