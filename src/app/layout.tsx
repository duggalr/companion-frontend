import "./globals.css";
import { Inter } from "next/font/google";
// import { useEffect } from 'react';
// import Script from 'next/script';
// import { usePathname } from 'next/navigation';
import { GoogleAnalytics } from '@next/third-parties/google';

const inter = Inter({ 
  subsets: ["latin"], 
  // variable: '--font-inter'
});

export const metadata = {
  title: 'Companion | Personal AI Tutor',
};


export default function RootLayout({children,}: {children: React.ReactNode;}) {
  
  return (
    <html lang="en">
      <head>
        {/* <title>Companion | Personal AI Tutor</title> */}
      </head>
      <body className={inter.className}>{children}</body>
      <GoogleAnalytics gaId="G-SNNKFK2WYW" />
    </html>
  );

}