import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { eventBus } from "@/lib/eventBus";

export interface Notification {
  id: string;
  title: string;
  body?: string;
  level: "info" | "success" | "warning" | "critical";
  createdAt: string;
  read: boolean;
  link?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  push: (n: Omit<Notification, "id" | "createdAt" | "read">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

const SEED: Notification[] = [
  { id: "n1", title: "Methodology section needs review", level: "info", createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), read: false, link: "/supervisor/reviews" },
  { id: "n2", title: "Integrity score below threshold", body: "proj-014 dropped to 62%", level: "warning", createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(), read: false },
  { id: "n3", title: "Ethics application submitted", level: "info", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), read: true },
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(SEED);

  const push = useCallback((n: Omit<Notification, "id" | "createdAt" | "read">) => {
    setNotifications((prev) => [{
      ...n,
      id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      read: false,
    }, ...prev].slice(0, 100));
  }, []);

  useEffect(() => {
    return eventBus.subscribe((e) => {
      if (e.type === "review.requested") push({ title: "New review requested", level: "info", link: "/supervisor/reviews" });
      if (e.type === "ethics.requested") push({ title: "Ethics review requested", level: "warning", link: "/admin/compliance" });
      if (e.type === "ai.policy.changed") push({ title: "AI policy updated", level: "info" });
    });
  }, [push]);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, push, markRead, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) return { notifications: [], unreadCount: 0, push: () => {}, markRead: () => {}, markAllRead: () => {} } as NotificationContextType;
  return ctx;
};
