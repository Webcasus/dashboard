import DashboardLayout from "@/components/layout/DashboardLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Zap, Palette, Package, TrendingUp, Users, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const stats = [
  { label: "Total Websites", value: "12", change: "+3 this month", icon: Globe },
  { label: "Active Projects", value: "8", change: "2 in progress", icon: Package },
  { label: "Monthly Visitors", value: "24.5K", change: "+12% from last month", icon: TrendingUp },
  { label: "Team Members", value: "5", change: "1 pending invite", icon: Users },
];

const quickActions = [
  {
    title: "Generate New Website",
    description: "Use AI to create a website in minutes",
    icon: Zap,
    link: "/generator",
  },
  {
    title: "Create Brand Kit",
    description: "Generate logos, colors, and fonts",
    icon: Palette,
    link: "/brand-kit",
  },
  {
    title: "Browse Templates",
    description: "Start with pre-built designs",
    icon: Package,
    link: "/templates",
  },
];

const Dashboard = () => {
  const { user } = useUser();
  return (
    <DashboardLayout>
      <div className="w-full space-y-6 md:space-y-8">
        {/* Welcome section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-1">
            Welcome back, {user?.firstName || 'User'}! 👋
          </h2>
          <p className="text-sm text-muted-foreground">
            Here's what's happening with your projects today
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold mb-2">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary">
                    <stat.icon className="h-5 w-5 text-foreground" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick actions */}
        <div>
          <h3 className="text-lg md:text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to={action.link}>
                  <Card className="p-6 bg-card border-border hover:border-foreground transition-all duration-300 cursor-pointer h-full">
                    <div className="w-12 h-12 rounded-lg bg-foreground flex items-center justify-center mb-4">
                      <action.icon className="h-6 w-6 text-background" />
                    </div>
                    <h4 className="font-semibold text-lg mb-2">{action.title}</h4>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <h3 className="text-lg md:text-xl font-semibold mb-4">Recent Activity</h3>
          <Card className="p-6 bg-card border-border">
            <div className="space-y-4">
              {[
                { action: "Website generated", project: "Tech Startup Landing", time: "2 hours ago" },
                { action: "Brand kit created", project: "E-commerce Store", time: "5 hours ago" },
                { action: "Domain connected", project: "Portfolio Site", time: "1 day ago" },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.project}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
