import "./globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { generateSEO, generateViewport } from "@/config/seo";
import { Toaster } from "react-hot-toast";
import { geistMono, geistSans, geistSansL } from "./Gotham-Font/font";




export const metadata =  generateSEO({});
export const viewport = generateViewport({});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistSansL.variable} ${geistSansL.className}  ${geistMono.className} ${geistMono.variable} antialiased bg-[#121215]`}
      >
        <ReactQueryProvider>{children}</ReactQueryProvider>
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
