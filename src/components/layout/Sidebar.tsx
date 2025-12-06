import React, { useState, useEffect } from "react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  Zap,
  Palette,
  Package,
  FolderOpen,
  Bell,
  Key,
  Globe,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Zap, label: "AI Generator", path: "/generator" },
  { icon: Palette, label: "Brand Kit", path: "/brand-kit" },
  { icon: Package, label: "Templates", path: "/templates" },
  { icon: FolderOpen, label: "Projects", path: "/projects" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
  { icon: Key, label: "API Keys", path: "/api-keys" },
  { icon: Globe, label: "Domains", path: "/domains" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user } = useUser();
  const userInitials = user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  const [isExpanded, setIsExpanded] = useState(() => {
    // Check localStorage for saved state
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-expanded');
      return saved === null ? true : saved === 'true';
    }
    return true;
  });

  // Toggle sidebar expanded state
  const toggleSidebar = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-expanded', String(newState));
    }
  };

  // Update CSS variable when expanded state changes
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-width',
      isExpanded ? '240px' : '64px'
    );
  }, [isExpanded]);

  // Close mobile sidebar when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      if (typeof window !== 'undefined' && window.innerWidth < 768) { // md breakpoint
        onClose();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handleRouteChange);
      return () => window.removeEventListener('popstate', handleRouteChange);
    }
  }, [onClose]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isExpanded ? 240 : 64,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed left-0 top-16 bottom-0 bg-card border-r border-border z-40",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Collapse button - desktop only */}
          <div className="hidden md:flex justify-end p-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-8 w-8 hover:bg-white hover:text-white group"
              aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isExpanded ? (
                <ChevronLeft className="h-4 w-4 group-hover:text-black" />
              ) : (
                <ChevronRight className="h-4 w-4 group-hover:text-black" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground",
                  "hover:bg-secondary hover:text-foreground transition-all duration-200",
                  "group relative"
                )}
                activeClassName="bg-secondary text-foreground font-medium"
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {isExpanded && (
                  <span className="text-sm">{item.label}</span>
                )}
                {!isExpanded && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-foreground text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-border">
                    {item.label}
                  </div>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User Profile Section */}
          <div className={cn(
            "border-t border-border p-4",
            !isExpanded && "p-2"
          )}>
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'User'} />
                <AvatarFallback className="bg-secondary text-foreground">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              {isExpanded && user && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{user.fullName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.primaryEmailAddress?.emailAddress}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
