import { getSession } from '@auth0/nextjs-auth0';

export default async function handler(req) {
    // Log query parameters for debugging
    console.log('Query Parameters:', req.query);

    // const session = await getSession(req, res);
    // console.log('SESSION:', session);

    // if (!session || !session.user) {
    //     return res.status(401).json({ message: "Unauthorized" });
    // }

    // const { user } = session;
    // console.log('USER-CALLBACK:', user);


    // try {
    //     // Fetch the session to get user data
    //     const session = await getSession(req, res);
    //     if (!session || !session.user) {
    //         return res.status(401).json({ message: "Unauthorized" });
    //     }

    //     // Extract user details from session
    //     const { user } = session;
    //     const userData = {
    //         user_id: user.sub,
    //         email: user.email,
    //         name: user.name,
    //     };

    //     // Send data to FastAPI endpoint
    //     const response = await fetch("https://api.example.com/save-user", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(userData),
    //     });

    //     if (!response.ok) {
    //         throw new Error("Failed to save user data");
    //     }

    //     // Redirect to home or another page after callback
    //     res.redirect(302, "/dashboard"); // Redirect to your desired page
    // } catch (error) {
    //     console.error("Error handling Auth0 callback:", error);
    //     res.status(500).json({ message: "Error handling callback" });
    // }

}