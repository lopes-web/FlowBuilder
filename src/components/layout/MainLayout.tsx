
import { ReactNode, useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface MainLayoutProps {
  children: ReactNode;
  className?: string;
}

export function MainLayout({ children, className }: MainLayoutProps) {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  // Used for animations - only show content after first render
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="h-screen w-full bg-background text-foreground flex">
      <Sidebar />
      
      <main
        className={cn(
          "ml-64 w-full p-6 transition-all duration-300 ease-in-out",
          isMobile && "ml-0",
          !mounted ? "opacity-0" : "animate-fade-in",
          className
        )}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
