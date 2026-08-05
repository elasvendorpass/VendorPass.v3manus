import type { ReactNode } from "react";
import Navbar from "./Navbar";

interface LandingLayoutProps {
  children: ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {children}
      </div>
    </div>
  );
}
