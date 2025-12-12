"use client";

import { useSidebar } from "@/contexts/SidebarContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useNotification, Notification as NotifType } from "@/contexts/NotificationContext";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
    FaBars, FaMoon, FaSun, FaBell, FaSignOutAlt, FaUserCircle,
    FaChartPie, FaMoneyBillWave, FaChartBar, FaTh, FaCheckDouble,
    FaCalendarAlt, FaUserFriends, FaCalculator, FaGlobe, FaUtensils,
    FaClipboardList, FaCogs, FaBolt, FaLayerGroup
} from "react-icons/fa";
import { IoIosSearch, IoMdClose } from "react-icons/io";
import { menuItems as defaultMenuItems, MenuItem, moduleMenus } from "@/lib/menuData"; // Ensure this import is correct based on previous step
import { cn } from "@/lib/utils";

// --- Module Configuration --
const modules = [
    { id: 'status', title: 'Durum', icon: FaChartPie, href: '/dashboard' },
    { id: 'distribution', title: 'Dağılım', icon: FaGlobe, href: '/dashboard/distribution/channels' }, // Updated
    { id: 'occupancy', title: 'Doluluk', icon: FaChartBar, href: '/dashboard/reports/occupancy' }, // Updated
    { id: 'management', title: 'Yönetim', icon: FaUserFriends, href: '/dashboard/reports/management' }, // Updated
    { id: 'rates', title: 'Fiyatlar', icon: FaMoneyBillWave, href: '/dashboard/sales/rates' },
    { id: 'rack', title: 'Rack', icon: FaTh, href: '/dashboard/room-plan' },
    { id: 'blockage', title: 'Blokaj', icon: FaCheckDouble, href: '/dashboard/room-plan/blockage' },
    { id: 'reservation', title: 'Rezervasyon', icon: FaCalendarAlt, href: '/dashboard/front-office/reservations' },
    { id: 'staying', title: 'Konaklayan', icon: FaUserFriends, href: '/dashboard/front-office/guests' },
    { id: 'cashier', title: 'Önkasa', icon: FaCalculator, href: '/dashboard/accounting/cash-bank' },
    { id: 'booking', title: 'Booking', icon: FaGlobe, href: '/dashboard/online' },
    { id: 'pos', title: 'POS', icon: FaUtensils, href: '/dashboard/pos' },
    { id: 'quick_posting', title: 'Hızlı Posting', icon: FaBolt, href: '/dashboard/pos/quick' }, // New
    { id: 'tasks', title: 'İşler', icon: FaClipboardList, href: '/dashboard/tasks' },
];

export default function Header() {
    const router = useRouter();
    const { toggleSidebar, activeModule, setActiveModule } = useSidebar() as any;
    const { theme, toggleTheme } = useTheme();
    const { unreadCount, notifications, markAsRead, markAllAsRead, clearNotifications } = useNotification();

    const [mounted, setMounted] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<MenuItem[]>([]);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const searchRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    useEffect(() => setMounted(true), []);

    // Close dropdowns on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) setIsSearchOpen(false);
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) setIsNotifOpen(false);
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) setIsProfileOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Search Logic
    useEffect(() => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            return;
        }
        const term = searchTerm.toLowerCase();
        const results: MenuItem[] = [];
        const activeMenu = moduleMenus[activeModule] || [];

        const searchRecursive = (items: MenuItem[]) => {
            items.forEach(item => {
                if (item.title.toLowerCase().includes(term) && item.href) results.push(item);
                if (item.items) searchRecursive(item.items);
            });
        };

        // Search current module first, then others if needed (simplified to all modules for now)
        Object.values(moduleMenus).forEach(menu => searchRecursive(menu));

        // Dedup results based on href
        const unique = Array.from(new Set(results.map(a => a.href)))
            .map(href => results.find(a => a.href === href));

        setSearchResults(unique.slice(0, 8) as MenuItem[]);
    }, [searchTerm, activeModule]);


    const handleModuleClick = (mod: typeof modules[0]) => {
        setActiveModule(mod.id);
        if (mod.href) router.push(mod.href);
    };

    const handleNavigate = (path: string) => {
        setIsSearchOpen(false); setSearchTerm("");
        setIsNotifOpen(false); setIsProfileOpen(false);
        router.push(path);
    };

    const handleLogout = () => { router.push("/auth/login"); };

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-gray-800 shadow-sm z-50 flex items-center px-4 justify-between select-none">

            {/* Left: Branding & Search */}
            <div className="flex items-center gap-4 flex-shrink-0">
                <div className="w-32 h-8 relative cursor-pointer" onClick={() => router.push('/dashboard')}>
                    <Image src="/images/doesta.webp" alt="Doesta" fill className="object-contain" priority />
                </div>

                <button
                    className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 transition-colors"
                    onClick={toggleSidebar}
                >
                    <FaBars size={18} />
                </button>

                {/* Search Bar */}
                <div className="hidden lg:block relative" ref={searchRef}>
                    <div className="flex items-center h-9 px-3 bg-gray-100 dark:bg-zinc-900 rounded border border-gray-200 dark:border-zinc-800 w-64 focus-within:border-blue-500 transition-colors">
                        <IoIosSearch className="text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Menüde Ara"
                            className="bg-transparent border-none outline-none text-xs text-gray-700 dark:text-gray-200 w-full ml-2 placeholder-gray-500"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setIsSearchOpen(true); }}
                            onFocus={() => setIsSearchOpen(true)}
                        />
                        {searchTerm && <button onClick={() => setSearchTerm("")}><IoMdClose className="text-gray-400 hover:text-gray-600" /></button>}
                    </div>
                    {isSearchOpen && searchTerm && (
                        <div className="absolute top-10 left-0 w-full bg-white dark:bg-zinc-800 rounded shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden py-1 z-50">
                            {searchResults.length > 0 ? (
                                <ul>
                                    {searchResults.map((item, idx) => (
                                        <li key={idx}>
                                            <button onClick={() => handleNavigate(item.href!)} className="w-full text-left px-3 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 flex items-center gap-2">
                                                <span className="text-gray-400"><IoIosSearch size={12} /></span>
                                                {item.title}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : <div className="px-4 py-3 text-xs text-gray-500 text-center">Sonuç yok</div>}
                        </div>
                    )}
                </div>
            </div>

            {/* Center: Module Navigation */}
            <div className="flex-1 px-2 overflow-x-auto scrollbar-hide flex items-center justify-center h-full" ref={scrollRef}>
                {modules.map((mod) => {
                    const isActive = activeModule === mod.id;
                    const Icon = mod.icon;
                    return (
                        <button
                            key={mod.id}
                            onClick={() => handleModuleClick(mod)}
                            className={cn(
                                "flex flex-col items-center justify-center min-w-[55px] h-full gap-0.5 px-1 transition-all border-b-2",
                                isActive
                                    ? "text-blue-600 border-blue-600 bg-blue-50/50 dark:bg-blue-900/10"
                                    : "text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-zinc-800/50"
                            )}
                        >
                            <Icon size={18} className={isActive ? "text-blue-600 dark:text-blue-400" : "opacity-80"} />
                            <span className="text-[9px] font-bold tracking-tight whitespace-nowrap leading-none mt-1">{mod.title}</span>
                        </button>
                    );
                })}
            </div>

            {/* Right: Tools */}
            <div className="flex items-center gap-2 flex-shrink-0">
                <button
                    className="h-9 w-9 rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center text-gray-500 transition-colors"
                    onClick={(e) => toggleTheme(e)}
                >
                    {theme === 'dark' ? <FaSun size={14} className="text-yellow-500" /> : <FaMoon size={14} />}
                </button>

                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <button
                        className="h-9 w-9 rounded-full bg-gray-50 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 flex items-center justify-center text-gray-500 transition-colors relative"
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                    >
                        <FaBell size={14} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 border border-white rounded-full"></span>
                        )}
                    </button>
                    {isNotifOpen && (
                        <div className="absolute top-10 right-0 w-72 bg-white dark:bg-zinc-800 rounded shadow-xl border border-gray-100 dark:border-gray-700 z-50 text-xs">
                            <div className="p-2 border-b dark:border-zinc-700 flex justify-between bg-gray-50 dark:bg-zinc-900">
                                <span className="font-bold">Bildirimler ({unreadCount})</span>
                                <button onClick={markAllAsRead} className="text-blue-600">Tümünü Oku</button>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {notifications.length === 0 ? <div className="p-4 text-center text-gray-400">Bildirim yok</div> :
                                    notifications.map(n => (
                                        <div key={n.id} onClick={() => markAsRead(n.id)} className={`p-2 border-b hover:bg-gray-50 cursor-pointer ${!n.isRead ? 'bg-blue-50/50' : ''}`}>
                                            <p className="font-semibold">{n.title}</p>
                                            <p className="text-gray-500">{n.message}</p>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="h-9 w-9 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs hover:bg-red-700 shadow-sm transition-colors"
                    >
                        TR
                    </button>
                    {isProfileOpen && (
                        <div className="absolute top-10 right-0 w-48 bg-white dark:bg-zinc-800 rounded shadow-xl border border-gray-100 dark:border-gray-700 z-50 text-xs p-1">
                            <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded flex items-center gap-2" onClick={() => handleNavigate('/dashboard/settings/users')}>
                                <FaUserCircle /> Profil
                            </button>
                            <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded flex items-center gap-2 text-red-600" onClick={handleLogout}>
                                <FaSignOutAlt /> Çıkış
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
