import "./globals.css";
import { Inter } from "next/font/google";
import { useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

const inter = Inter({ 
  subsets: ["latin"], 
  // variable: '--font-inter'
});

export default function RootLayout({children,}: {children: React.ReactNode;}) {
  
  const pathname = usePathname();
  const isProduction = process.env.NEXT_PUBLIC_CURRENT_ENVIRONMENT === 'production';

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      window.gtag('config', 'G-SNNKFK2WYW', {
        page_path: url,
      });
    };
    if (window.gtag) {
      handleRouteChange(pathname);
    }
  }, [pathname]);
  
  return (
    <html lang="en">
      <head>
        {isProduction && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=G-SNNKFK2WYW`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'G-SNNKFK2WYW', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );

}