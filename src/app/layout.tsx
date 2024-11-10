import "./globals.css";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import { UserProvider } from '@auth0/nextjs-auth0/client';

const inter = Inter({ 
  subsets: ["latin"], 
  // variable: '--font-inter'
});

export const metadata = {
  title: 'Companion | Personal AI Tutor',
};

export default function RootLayout({children,}: {children: React.ReactNode;}) {
  
  const AUTH0_AUDIENCE_URL = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE_URL;

  return (
    <html lang="en">
      <head>
        {/* <title>Companion | Personal AI Tutor</title> */}
        <script src="https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.js" async></script>
      </head>
      <UserProvider
        loginOptions={{
          authorizationParams: {
            audience: AUTH0_AUDIENCE_URL,
            scope: 'openid profile email',
          },
        }}
      >
        <body className={inter.className}>{children}</body>
        <GoogleAnalytics gaId="G-SNNKFK2WYW" />
      </UserProvider>
    </html>
  );

}