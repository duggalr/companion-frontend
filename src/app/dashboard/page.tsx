"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState, useContext } from 'react';
import useUserContext from "@/lib/hooks/useUserContext";
import TopNavBar from '@/app/components/Utils/TopNavBar';
import DashboardLayout from '@/app/components/Dashboard/DashboardLayout';

// import TopNavBar from '../components/Utils/TopNavBar';
// import DashboardLayout from '../components/Dashboard/DashboardLayout';
// import { UserContext } from '../../context/UserContext';
// // import { validAuthenticatedUser } from '@/lib/api/checkAuthenticatedUser';


export default function Dashboard() {

    const router = useRouter();
    const [loading, setLoading] = useState(true);
    // const { isAuthenticated, userAccessToken } = useUserContext();
    const userContext = useUserContext();

    // Update page title
    useEffect(() => {
        document.title = "Dashboard";
    }, []);

    // Updatiing user context
    useEffect(() => {

        if (userContext) {

            if (userContext.isAuthenticated === false){
                router.push('/');
            } else {
                setLoading(false);
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
                        <TopNavBar/>
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