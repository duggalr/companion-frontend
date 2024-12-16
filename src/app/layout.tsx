import "./globals.css";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
// import { UserProvider as Auth0UserProvider } from '@auth0/nextjs-auth0/client';
// import { InternalUserProvider } from '../context/UserContext';
import { InternalUserProvider } from "@/context/UserContext";

const inter = Inter({ 
    subsets: ["latin"], 
});
  
export const metadata = {
    title: 'Companion | Personal AI Tutor',
};

export default function RootLayout({children}: {children: React.ReactNode;}) {
    
    return (
        <html lang="en">
            <head>
                <script src="https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.js" async></script>
            </head>

            {/* <Auth0UserProvider> */}
            <InternalUserProvider>
                <body className={inter.className}>{children}</body>
                <GoogleAnalytics gaId="G-SNNKFK2WYW" />
            </InternalUserProvider>
            {/* </Auth0UserProvider> */}
        </html>
    );

}