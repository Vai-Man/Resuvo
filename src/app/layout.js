import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import ClerkProvider from "@/services/clerk/components/ClerkProvider";
import Navbar from "@/components/Navbar";
import NavbarWrapper from "@/components/NavbarWrapper";


const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "Resuvo - AI-Powered Career Intelligence",
  description: "Master interviews, optimize resumes, and advance your career with Resuvo's intelligent preparation platform.",
};

export default function RootLayout({ children }) {

  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        translate="no"
        className="notranslate"
      >
        <body className={`${openSans.variable} antialiased font-sans`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableColorScheme
            disableTransitionOnChange
          >
            <NavbarWrapper />
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
