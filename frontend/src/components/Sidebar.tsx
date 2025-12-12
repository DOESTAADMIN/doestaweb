"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import NextImage from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/contexts/SidebarContext";
import {
    FaHome, FaChevronDown, FaCircle
} from "react-icons/fa";
import { cn } from "@/lib/utils";

// --- Types ---
import { MenuItem, moduleMenus } from "@/lib/menuData";


// --- Sidebar Item ---
const SidebarItem = ({ item, level = 0, isSidebarOpen }: { item: MenuItem, level?: number, isSidebarOpen: boolean }) => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const hasChildren = item.items && item.items.length > 0;
    const isActive = item.href ? pathname === item.href : false;
    const isChildActive = hasChildren ? item.items?.some(sub => sub.href && pathname.startsWith(sub.href)) : false;

    useEffect(() => {
        if (isChildActive) setIsOpen(true);
    }, [isChildActive]);

    const Icon = item.icon || FaCircle;
    const isMain = level === 0;

    // Collapsed Mode Logic: Only show icons for top level
    if (!isSidebarOpen && isMain) {
        return (
            <div className="relative group mb-2 flex justify-center w-full">
                <Link
                    href={item.href || "#"}
                    className={cn(
                        "p-2.5 rounded-xl transition-colors",
                        (isActive || isChildActive)
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                            : "text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    )}
                >
                    <Icon size={20} />
                </Link>
                {/* Tooltip on hover */}
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                    {item.title}
                </div>
            </div>
        );
    }

    // Hidden content if collapsed and not main (recursive items shouldn't act weirdly, but usually we hide sidebar content)
    if (!isSidebarOpen) return null;

    if (hasChildren) {
        return (
            <div className="mb-1">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "relative h-10 w-full flex items-center justify-between px-3 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 group select-none",
                        (isOpen || isChildActive)
                            ? "text-blue-600 bg-blue-50/50 dark:bg-blue-900/10 dark:text-blue-400"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                    )}
                >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Icon size={isMain ? 16 : 6} className={cn(
                            "flex-shrink-0 transition-colors",
                            (isOpen || isChildActive) ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                        )} />
                        <span className="truncate uppercase tracking-wide">{item.title}</span>
                    </div>
                    <FaChevronDown
                        size={10}
                        className={cn("transition-transform duration-200", isOpen ? "rotate-180" : "rotate-0")}
                    />
                </button>

                <div className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out pl-4",
                    isOpen ? "max-h-[2000px] opacity-100 mt-1" : "max-h-0 opacity-0"
                )}>
                    {item.items?.map((sub, idx) => (
                        <SidebarItem key={idx} item={sub} level={level + 1} isSidebarOpen={isSidebarOpen} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <Link
            href={item.href || "#"}
            className={cn(
                "relative h-10 w-full flex items-center justify-between px-3 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 group mb-1",
                isActive
                    ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-zinc-800/50"
            )}
        >
            {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-600 rounded-r-full" />
            )}
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <Icon size={isMain ? 16 : 8} className={cn(
                    "flex-shrink-0 transition-colors",
                    isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400",
                    !isMain && !item.icon && "ml-1"
                )} />
                <span className="truncate uppercase tracking-wide">{item.title}</span>
            </div>
        </Link>
    );
};

// --- Main Sidebar Component ---
export default function Sidebar() {
    const { isSidebarOpen, setIsSidebarOpen, activeModule } = useSidebar() as any;

    // Get menu for current active module
    const currentMenu = moduleMenus[activeModule] || moduleMenus['reservation'];

    return (
        <>
            {/* Mobile Backdrop */}
            <div
                className={cn(
                    "lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity",
                    isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar Container */}
            <div className={cn(
                "fixed left-0 bottom-0 z-40 bg-white dark:bg-zinc-950 border-r border-gray-100 dark:border-gray-800 transition-all duration-300 transform flex flex-col shadow-[1px_0_20px_0_rgba(0,0,0,0.02)]",
                "top-16",
                isSidebarOpen ? "w-[260px] translate-x-0" : "w-[0px] lg:w-[70px] -translate-x-full lg:translate-x-0",
            )}>
                {/* Module Title (Only when open) */}
                {isSidebarOpen && (
                    <div className="px-5 py-3 border-b border-gray-50 dark:border-zinc-900">
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                            MENÜDE ARA
                        </span>
                        <input className="mt-1 w-full bg-gray-50 dark:bg-zinc-900 border-none rounded p-1.5 text-xs text-gray-700 dark:text-gray-300 outline-none placeholder-gray-400" placeholder="Ara..." />
                    </div>
                )}

                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-hide">
                    {currentMenu.map((item, idx) => (
                        <div key={idx}>
                            <SidebarItem item={item} isSidebarOpen={isSidebarOpen} />
                        </div>
                    ))}
                </nav>

                {/* Footer User Profile - REMOVED as requested */}
            </div>
        </>
    );
}
