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
        <script src="https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.js" async></script>
      </head>
      <body className={inter.className}>{children}</body>
      <GoogleAnalytics gaId="G-SNNKFK2WYW" />
    </html>
  );

}