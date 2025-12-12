"use client";

import { useState } from "react";
import { FaSignInAlt, FaSignOutAlt, FaBed, FaCrown, FaCheck, FaTimes, FaEye } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Operation {
    id: string;
    room: string;
    guest: string;
    agency: string;
    pax: string;
    balance: string;
    status: "pending" | "completed" | "cancelled";
    isVip?: boolean;
}

const mockArrivals: Operation[] = [
    { id: "1", room: "101", guest: "Ahmet Yılmaz", agency: "Booking.com", pax: "2 Ad", balance: "€450", status: "pending", isVip: true },
    { id: "2", room: "104", guest: "Sarah Johnson", agency: "Expedia", pax: "1 Ad", balance: "€120", status: "pending" },
    { id: "3", room: "205", guest: "Mehmet Demir", agency: "ETS Tur", pax: "2 Ad 1 Ch", balance: "PAID", status: "completed" },
    { id: "4", room: "302", guest: "Hans Müller", agency: "Hotelbeds", pax: "2 Ad", balance: "€850", status: "pending", isVip: true },
];

const mockDepartures: Operation[] = [
    { id: "5", room: "201", guest: "John Doe", agency: "Direct", pax: "1 Ad", balance: "€0", status: "pending" },
    { id: "6", room: "203", guest: "Jane Smith", agency: "Booking.com", pax: "2 Ad", balance: "€45", status: "pending" },
];

const mockInHouse: Operation[] = [
    { id: "7", room: "102", guest: "Veli Can", agency: "ETS", pax: "2 Ad", balance: "€100", status: "completed" },
];

export default function OperationsTable() {
    const [activeTab, setActiveTab] = useState<"arrivals" | "departures" | "inhouse" | "vip">("arrivals");
    const router = useRouter();

    const getData = () => {
        if (activeTab === "arrivals") return mockArrivals;
        if (activeTab === "departures") return mockDepartures;
        if (activeTab === "inhouse") return mockInHouse;
        if (activeTab === "vip") return mockArrivals.filter(r => r.isVip); // Mock VIP logic
        return [];
    };

    const handleAction = (id: string, action: string) => {
        // Mock action
        console.log(`Action ${action} for ${id}`);
        // Real implementation would call API
        if (action === 'checkin') router.push(`/dashboard/operations/checkin?id=${id}`);
        if (action === 'checkout') router.push(`/dashboard/operations/checkout?id=${id}`);
    }

    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-xl p-0 shadow-sm col-span-1 lg:col-span-2 overflow-hidden flex flex-col h-full">
            {/* Tabs */}
            <div className="flex border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-zinc-900/50">
                <button
                    onClick={() => setActiveTab("arrivals")}
                    className={cn(
                        "flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors border-b-2",
                        activeTab === "arrivals" ? "border-blue-600 text-blue-600 bg-white dark:bg-zinc-900" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    )}
                >
                    <FaSignInAlt className={activeTab === "arrivals" ? "text-blue-500" : "text-gray-400"} />
                    Girişler <span className="text-xs bg-blue-100 text-blue-700 px-1.5 rounded ml-1">{mockArrivals.length}</span>
                </button>
                <button
                    onClick={() => setActiveTab("departures")}
                    className={cn(
                        "flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors border-b-2",
                        activeTab === "departures" ? "border-red-600 text-red-600 bg-white dark:bg-zinc-900" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    )}
                >
                    <FaSignOutAlt className={activeTab === "departures" ? "text-red-500" : "text-gray-400"} />
                    Çıkışlar <span className="text-xs bg-red-100 text-red-700 px-1.5 rounded ml-1">{mockDepartures.length}</span>
                </button>
                <button
                    onClick={() => setActiveTab("inhouse")}
                    className={cn(
                        "flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors border-b-2",
                        activeTab === "inhouse" ? "border-purple-600 text-purple-600 bg-white dark:bg-zinc-900" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    )}
                >
                    <FaBed className={activeTab === "inhouse" ? "text-purple-500" : "text-gray-400"} />
                    Konaklayan <span className="text-xs bg-purple-100 text-purple-700 px-1.5 rounded ml-1">106</span>
                </button>
                <button
                    onClick={() => setActiveTab("vip")}
                    className={cn(
                        "flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-colors border-b-2",
                        activeTab === "vip" ? "border-amber-600 text-amber-600 bg-white dark:bg-zinc-900" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    )}
                >
                    <FaCrown className={activeTab === "vip" ? "text-amber-500" : "text-gray-400"} />
                    VIP
                </button>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 bg-gray-50 dark:bg-zinc-800/50 uppercase sticky top-0">
                        <tr>
                            <th className="px-4 py-3">Oda</th>
                            <th className="px-4 py-3">Misafir</th>
                            <th className="px-4 py-3">Acente</th>
                            <th className="px-4 py-3">Kişi</th>
                            <th className="px-4 py-3">Bakiye</th>
                            <th className="px-4 py-3 text-right">İşlem</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {getData().map((item) => (
                            <tr key={item.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors group">
                                <td className="px-4 py-2.5 font-bold text-gray-700 dark:text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <span className={cn("w-2 h-2 rounded-full", item.status === 'completed' ? 'bg-green-500' : 'bg-orange-500')}></span>
                                        {item.room}
                                    </div>
                                </td>
                                <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-white">
                                    <div className="flex items-center gap-2">
                                        {item.guest}
                                        {item.isVip && <FaCrown className="text-amber-500 text-xs" title="VIP Guest" />}
                                    </div>
                                </td>
                                <td className="px-4 py-2.5 text-gray-500">{item.agency}</td>
                                <td className="px-4 py-2.5 text-gray-500">{item.pax}</td>
                                <td className={cn("px-4 py-2.5 font-mono font-medium", item.balance === 'PAID' ? 'text-green-600' : 'text-red-600')}>
                                    {item.balance}
                                </td>
                                <td className="px-4 py-2.5 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => router.push(`/dashboard/front-office/reservations/view/${item.id}`)}
                                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                                            title="Detay"
                                        >
                                            <FaEye />
                                        </button>
                                        {activeTab === 'arrivals' && (
                                            <button
                                                onClick={() => handleAction(item.id, 'checkin')}
                                                className="p-1.5 text-green-600 hover:bg-green-50 rounded bg-green-50/50 font-semibold text-xs border border-green-200"
                                                title="Check-In"
                                            >
                                                Giriş Yap
                                            </button>
                                        )}
                                        {activeTab === 'departures' && (
                                            <button
                                                onClick={() => handleAction(item.id, 'checkout')}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded bg-red-50/50 font-semibold text-xs border border-red-200"
                                                title="Check-Out"
                                            >
                                                Çıkış Yap
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-2 border-t border-gray-100 dark:border-gray-800 text-center">
                <button
                    onClick={() => router.push('/dashboard/front-office/reservations')}
                    className="text-xs text-blue-600 hover:underline font-medium"
                >
                    Tüm Listeyi Görüntüle
                </button>
            </div>
        </div>
    );
}
