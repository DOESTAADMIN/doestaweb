"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Notification {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    timestamp: Date;
    type: "info" | "success" | "warning" | "error";
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Omit<Notification, "id" | "timestamp" | "isRead">) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: "1",
            title: "Hoş Geldiniz",
            message: "Doesta Premium PMS sistemine hoş geldiniz.",
            isRead: false,
            timestamp: new Date(),
            type: "info"
        },
        {
            id: "2",
            title: "Sistem Bakımı",
            message: "Bu gece 03:00'te planlı bakım çalışması yapılacaktır.",
            isRead: false,
            timestamp: new Date(Date.now() - 3600000), // 1 hour ago
            type: "warning"
        }
    ]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const addNotification = (notif: Omit<Notification, "id" | "timestamp" | "isRead">) => {
        const newNotif: Notification = {
            ...notif,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date(),
            isRead: false,
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const clearNotifications = () => {
        setNotifications([]);
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, clearNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
}
