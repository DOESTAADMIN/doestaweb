"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { SidebarProvider, useSidebar } from "@/contexts/SidebarContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { cn } from "@/lib/utils";

function DashboardLayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isSidebarOpen, setIsSidebarOpen } = useSidebar() as any; // Using context

    return (

        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-200">
            {/* 1. Header is now global and fixed at top */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <Header />
            </div>

            {/* 2. Sidebar is fixed left but pushed down by Header (top-16 = 4rem) */}
            <div className="pt-16">
                <Sidebar />

                {/* 3. Main Content pushed down by Header and right by Sidebar */}
                <div className={cn(
                    "transition-all duration-300 min-h-[calc(100vh-4rem)]",
                    isSidebarOpen ? "lg:ml-[260px]" : "lg:ml-[70px]"
                )}>
                    <main className="p-4 md:p-6 lg:p-8 h-full">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider>
            <SidebarProvider>
                <NotificationProvider>
                    <DashboardLayoutContent>{children}</DashboardLayoutContent>
                </NotificationProvider>
            </SidebarProvider>
        </ThemeProvider>
    );
}
