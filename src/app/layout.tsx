import "./globals.css";
import { Inter } from "next/font/google";
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
        {/* Flowbite */}
        {/* <link href="https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.css" rel="stylesheet" /> */}
        <script src="https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.js" async></script>
      </head>
      <body className={inter.className}>{children}</body>
      <GoogleAnalytics gaId="G-SNNKFK2WYW" />
    </html>
  );

}

// TODO:
// are the width settings on the layout different on chat vs console since it seems chat has bit wider IDE?
// the rest of the layout is fine, would recommend hiding button on mobile and just have landing page and video
// with message in brackets