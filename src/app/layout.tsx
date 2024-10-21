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

export default function RootLayout({children,}: {children: React.ReactNode;}) {
  
  // const isProduction = process.env.NEXT_PUBLIC_CURRENT_ENVIRONMENT === 'production';
  // const pathname = usePathname();

  // useEffect(() => {
  //   const handleRouteChange = (url: string) => {
  //     window.gtag('config', 'G-SNNKFK2WYW', {
  //       page_path: url,
  //     });
  //   };
  //   if (window.gtag) {
  //     handleRouteChange(pathname);
  //   }
  // }, [pathname]);
  
  return (
    <html lang="en">
      <head>
      </head>
      <body className={inter.className}>{children}</body>
      <GoogleAnalytics gaId="G-SNNKFK2WYW" />
    </html>
  );

}