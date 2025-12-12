"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

interface SidebarContextType {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (value: boolean) => void;
    toggleSidebar: () => void;
    openSidebar: () => void;
    closeSidebar: () => void;
    activeModule: string;
    setActiveModule: (module: string) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeModule, setActiveModule] = useState('reservation');

    // Optional: Persist to localStorage
    useEffect(() => {
        const saved = localStorage.getItem("sidebarOpen");
        if (saved !== null) {
            setIsSidebarOpen(saved === "true");
        }
        const savedModule = localStorage.getItem("activeModule");
        if (savedModule) {
            setActiveModule(savedModule);
        }
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => {
            const newVal = !prev;
            localStorage.setItem("sidebarOpen", String(newVal));
            return newVal;
        });
    };

    const openSidebar = () => {
        setIsSidebarOpen(true);
        localStorage.setItem("sidebarOpen", "true");
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
        localStorage.setItem("sidebarOpen", "false");
    };

    const setModule = (module: string) => {
        setActiveModule(module);
        localStorage.setItem("activeModule", module);
    };

    return (
        <SidebarContext.Provider
            value={{
                isSidebarOpen,
                setIsSidebarOpen,
                toggleSidebar,
                openSidebar,
                closeSidebar,
                activeModule,
                setActiveModule: setModule
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
}
