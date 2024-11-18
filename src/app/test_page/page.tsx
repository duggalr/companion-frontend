"use client";
import { useUser } from '@auth0/nextjs-auth0/client';


export default function TestPage() {

    const { user } = useUser();
    console.log("USER:", user);

    const handleFetchUserData = async () => {
        try {

            const res = await fetch('/api/get-access-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const { accessToken } = await res.json();
            console.log("Access token:", accessToken);

            // // Send the token to your FastAPI backend
            // const apiResponse = await fetch("http://localhost:8000/test-protected-route", {
            //     method: "POST",
            //     headers: {
            //         Authorization: `Bearer ${accessToken}`,
            //         "Content-Type": "application/json"
            //     },
            //     body: JSON.stringify({ user })
            // });

            // const data = await apiResponse.json();
            // console.log("Data from FastAPI:", data);

        } catch (error) {
            console.error("Error fetching access token or data:", error);
        }
    };

    return (
       
        <header className='mt-10'>
            {user ? (
                <>
                <p>Welcome, {user.name}!</p>
                <button onClick={handleFetchUserData}>Fetch Protected Data</button>
                <br/><br/>
                <a href="/api/auth/logout">Logout</a>
                </>
            ) : (
                <a
                    href="/api/auth/login"
                    className="p-10"
                >Login with Google</a>
            )}
      </header>

    );

}
