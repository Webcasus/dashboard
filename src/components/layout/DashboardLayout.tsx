import { useState, ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <motion.main
        initial={false}
        className="pt-16 min-h-screen transition-all duration-300 md:ml-[var(--sidebar-width,240px)]"
      >
        <div className="p-4 md:p-6 lg:p-8 max-w-full">
          {children}
        </div>
      </motion.main>
    </div>
  );
};

export default DashboardLayout;
