import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ScrollToTop } from "../common/ScrollToTop";

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  className?: string;
}

export function Layout({
  children,
  showFooter = true,
  className = ""
}: LayoutProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${className}`}>
      <Navbar />
      <main>
        {children}
      </main>
      {showFooter && <Footer />}
      <ScrollToTop />
    </div>
  );
}
