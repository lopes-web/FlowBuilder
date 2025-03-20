
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Grid, 
  Plus, 
  Heart, 
  Clock, 
  Users, 
  User, 
  Menu, 
  ChevronLeft 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type SidebarItem = {
  name: string;
  path: string;
  icon: React.ElementType;
  badge?: number;
};

const sidebarItems: SidebarItem[] = [
  { name: 'My Widgets', path: '/', icon: Grid },
  { name: 'Add Widget', path: '/add-widget', icon: Plus },
  { name: 'Favorites', path: '/favorites', icon: Heart, badge: 5 },
  { name: 'Recent', path: '/recent', icon: Clock },
  { name: 'Community', path: '/community', icon: Users },
  { name: 'Profile', path: '/profile', icon: User }
];

export function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth > 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);

  return (
    <>
      {/* Mobile Toggle */}
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden fixed top-4 left-4 z-50" 
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </Button>
      )}

      {/* Sidebar Backdrop for Mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed h-full z-40 transition-all duration-300 ease-in-out glass-panel",
          isCollapsed ? "w-20" : "w-64",
          isMobile && !isOpen ? "-translate-x-full" : "translate-x-0",
          isMobile ? "left-0 top-0" : "left-0 top-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-16 items-center justify-between p-4 border-b border-white/5">
            <div className={cn("flex items-center", isCollapsed && "justify-center w-full")}>
              {!isCollapsed && (
                <span className="text-lg font-medium tracking-tight">ElementorMatic</span>
              )}
              {isCollapsed && <Grid size={24} />}
            </div>
            
            {!isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar} 
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft 
                  size={18} 
                  className={cn(
                    "transition-transform duration-200", 
                    isCollapsed && "rotate-180"
                  )} 
                />
              </Button>
            )}
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 overflow-auto py-6 px-3">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center rounded-lg p-3 text-sm font-medium transition-all duration-200",
                        isActive 
                          ? "bg-primary/10 text-primary shadow-sm" 
                          : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        isCollapsed && "justify-center"
                      )}
                    >
                      <div className="relative">
                        <Icon size={20} className={cn("transition-transform", isActive && "scale-110")} />
                        
                        {/* Badge */}
                        {item.badge && !isCollapsed && (
                          <span className="absolute -top-1 -right-1 h-4 min-w-4 rounded-full bg-primary text-[10px] font-medium text-white flex items-center justify-center px-1">
                            {item.badge}
                          </span>
                        )}
                        
                        {/* Badge for collapsed state */}
                        {item.badge && isCollapsed && (
                          <span className="absolute -top-1 -right-1 h-4 min-w-4 rounded-full bg-primary text-[10px] font-medium text-white flex items-center justify-center px-1">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      
                      {!isCollapsed && (
                        <span className="ml-3 relative">
                          {item.name}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="mt-auto p-4 border-t border-white/5">
            <div className={cn(
              "flex items-center gap-3",
              isCollapsed && "justify-center"
            )}>
              <div className="h-8 w-8 rounded-full bg-primary/20 overflow-hidden flex items-center justify-center">
                <img
                  src="https://ui-avatars.com/api/?name=Alex+Morgan&background=0077ED&color=fff"
                  alt="Alex Morgan"
                  className="h-full w-full object-cover"
                />
              </div>
              {!isCollapsed && (
                <div className="leading-none">
                  <div className="text-sm font-medium">Alex Morgan</div>
                  <div className="text-xs text-muted-foreground">Pro Plan</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
