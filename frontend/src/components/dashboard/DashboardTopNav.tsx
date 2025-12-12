"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    FaChartPie, FaGlobe, FaChartBar, FaUserFriends, FaMoneyBillWave,
    FaTh, FaCheckDouble, FaCalendarAlt, FaCalculator, FaUtensils,
    FaBolt, FaClipboardList
} from "react-icons/fa";

const navItems = [
    { id: 'status', title: 'Durum', icon: FaChartPie, href: '/dashboard' },
    { id: 'distribution', title: 'Dağılım', icon: FaGlobe, href: '/dashboard/distribution/channels' },
    { id: 'occupancy', title: 'Doluluk', icon: FaChartBar, href: '/dashboard/reports/occupancy' },
    { id: 'management', title: 'Yönetim', icon: FaUserFriends, href: '/dashboard/reports/management' },
    { id: 'rates', title: 'Fiyatlar', icon: FaMoneyBillWave, href: '/dashboard/sales/rates' },
    { id: 'rack', title: 'Rack', icon: FaTh, href: '/dashboard/room-plan' },
    { id: 'blockage', title: 'Blokaj', icon: FaCheckDouble, href: '/dashboard/room-plan/blockage' },
    { id: 'reservation', title: 'Rezervasyon', icon: FaCalendarAlt, href: '/dashboard/front-office/reservations' },
    { id: 'staying', title: 'Konaklayan', icon: FaUserFriends, href: '/dashboard/front-office/guests' },
    { id: 'cashier', title: 'Ön Kasa', icon: FaCalculator, href: '/dashboard/accounting/cash-bank' },
    { id: 'booking', title: 'Booking', icon: FaGlobe, href: '/dashboard/online' },
    { id: 'pos', title: 'POS', icon: FaUtensils, href: '/dashboard/pos' },
    { id: 'quick', title: 'Hızlı Posting', icon: FaBolt, href: '/dashboard/pos/quick' },
    { id: 'tasks', title: 'İşler', icon: FaClipboardList, href: '/dashboard/tasks' },
];

export default function DashboardTopNav() {
    const pathname = usePathname();

    return (
        <div className="flex items-center gap-1 overflow-x-auto bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 p-2 mb-4 scrollbar-thin">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.id}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center justify-center min-w-[70px] p-2 rounded-md transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 group",
                            isActive ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10" : "text-gray-500 dark:text-gray-400"
                        )}
                    >
                        <item.icon size={20} className={cn("mb-1", isActive ? "text-blue-600 dark:text-blue-400" : "group-hover:text-amber-500")} />
                        <span className="text-[10px] font-semibold whitespace-nowrap">{item.title}</span>
                    </Link>
                );
            })}
        </div>
    );
}
