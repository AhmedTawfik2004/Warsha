import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../hooks/useAuth";
export const metadata: Metadata = { title: "Warsha | ورشة", description: "Egypt automotive marketplace" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('warsha-theme')||'dark';var l=localStorage.getItem('warsha-lang')||'ar';document.documentElement.setAttribute('data-theme',t);document.documentElement.setAttribute('lang',l);document.documentElement.setAttribute('dir',l==='ar'?'rtl':'ltr');}catch(e){}})();` }} /></head>
      <body><AuthProvider>{children}</AuthProvider></body>
    </html>
  );
}


