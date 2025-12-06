import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Info, AlertTriangle, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: number;
  type: "success" | "info" | "warning";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Default notifications
const defaultNotifications: Notification[] = [
  {
    id: 1,
    type: "success",
    title: "Website Published",
    message: "Your website has been successfully published and is now live.",
    timestamp: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "info",
    title: "New Template Available",
    message: "A new e-commerce template has been added to the library.",
    timestamp: "5 hours ago",
    read: false,
  },
  {
    id: 3,
    type: "warning",
    title: "Domain Verification Pending",
    message: "Please complete DNS configuration for custom domain.",
    timestamp: "1 day ago",
    read: true,
  },
  {
    id: 4,
    type: "success",
    title: "API Key Generated",
    message: "A new API key has been created successfully.",
    timestamp: "2 days ago",
    read: true,
  },
];

const NOTIFICATIONS_STORAGE_KEY = 'webcasus_notifications';

const Notifications = () => {
  // Load notifications from localStorage or use default ones
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
        return saved ? JSON.parse(saved) : defaultNotifications;
      } catch (error) {
        console.error('Failed to parse notifications from localStorage', error);
        return defaultNotifications;
      }
    }
    return defaultNotifications;
  });

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Failed to save notifications to localStorage', error);
    }
  }, [notifications]);

  const markAsRead = (id: number) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prevNotifications => {
      const updated = prevNotifications.filter(notification => notification.id !== id);
      toast.success('Notification deleted');
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({
        ...notification,
        read: true
      }))
    );
    toast.success('All notifications marked as read');
  };

  const clearAllNotifications = () => {
    if (window.confirm('Are you sure you want to clear all notifications?')) {
      setNotifications([]);
      toast.success('All notifications cleared');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-foreground" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-foreground" />;
      default:
        return <Info className="h-5 w-5 text-foreground" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold">Notifications</h2>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={markAllAsRead}
              disabled={notifications.every(n => n.read) || notifications.length === 0}
              className="w-full sm:w-auto"
            >
              Mark all as read
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearAllNotifications}
              disabled={notifications.length === 0}
              className="text-red-500 hover:text-red-600 w-full sm:w-auto"
            >
              Clear all
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          <AnimatePresence>
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  className={`bg-card border-border ${!notification.read ? "border-l-4 border-l-foreground" : ""
                    }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">{getIcon(notification.type)}</div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className={`font-semibold ${!notification.read ? "text-foreground" : "text-muted-foreground"
                              }`}>
                              {notification.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{notification.timestamp}</span>
                          {!notification.read && (
                            <Button
                              variant="link"
                              className="h-auto p-0 text-xs"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
