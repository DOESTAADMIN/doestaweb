"use client";

import { useState, useEffect } from "react";
import { FaBed, FaCalendarCheck, FaConciergeBell, FaDoorOpen, FaFileInvoice, FaIdCard, FaKey, FaLuggageCart, FaMoon, FaUserClock, FaChartLine } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { dashboardService } from "@/lib/api";

const subModules = [
    { title: "Rezervasyonlar", icon: FaCalendarCheck, desc: "Bireysel veya grup rezervasyonu oluşturun", link: "/dashboard/front-office/reservations", color: "bg-blue-500" },
    { title: "Check-In Girişler", icon: FaKey, desc: "Bugünkü giriş işlemleri", link: "/dashboard/front-office/reservations?filter=today", color: "bg-green-500" },
    { title: "Check-Out Çıkışlar", icon: FaDoorOpen, desc: "Bugünkü çıkış işlemleri", link: "/dashboard/front-office/reservations?filter=checkout", color: "bg-red-500" },
    { title: "Oda Planı (Rack)", icon: FaBed, desc: "Oda durumları ve blokaj", link: "/dashboard/room-plan", color: "bg-purple-500" },
    { title: "Misafir Listesi", icon: FaIdCard, desc: "Misafir kartları arşivi", link: "/dashboard/front-office/guests", color: "bg-indigo-500" },
    { title: "Night Audit", icon: FaMoon, desc: "Gün sonu işlemleri", link: "/dashboard/front-office/night-audit", color: "bg-gray-700" },
    { title: "Housekeeping", icon: FaConciergeBell, desc: "Oda temizlik takibi", link: "/dashboard/housekeeping", color: "bg-pink-500" },
    { title: "Muhasebe & Folyo", icon: FaFileInvoice, desc: "Harcamalar ve faturalar", link: "/dashboard/accounting", color: "bg-orange-500" },
];

export default function FrontOfficePage() {
    const router = useRouter();
    const [stats, setStats] = useState({
        arrivals: 0,
        departures: 0,
        inHouse: 0,
        occupancy: 0
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const res = await dashboardService.getStats();
            setStats(res.data);
        } catch (error) {
            console.error("Stats load failed", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ön Büro Yönetimi</h1>
                    <p className="text-gray-500 dark:text-gray-400">Resepsiyon ve misafir operasyonları merkezi</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => router.push('/dashboard/front-office/reservations?modal=new')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <FaLuggageCart />
                        Hızlı Check-In
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/reports')}
                        className="px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
                    >
                        Raporlar
                    </button>
                </div>
            </div>

            {/* Submodules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {subModules.map((mod, idx) => (
                    <Link
                        key={idx}
                        href={mod.link}
                        className="group bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900 transition-all duration-200 flex flex-col"
                    >
                        <div className={`h-12 w-12 rounded-lg ${mod.color} bg-opacity-10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            <mod.icon className={`text-2xl ${mod.color.replace('bg-', 'text-')}`} />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {mod.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                            {mod.desc}
                        </p>
                    </Link>
                ))}
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Anlık Durum (Canlı Veri)</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div
                            onClick={() => router.push('/dashboard/front-office/reservations?filter=today')}
                            className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800 cursor-pointer hover:bg-blue-100 transition-colors"
                        >
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.arrivals}</div>
                            <div className="text-xs text-blue-600/80 dark:text-blue-400/80 font-medium">Gelecek</div>
                        </div>
                        <div
                            onClick={() => router.push('/dashboard/front-office/reservations?status=CheckedIn')}
                            className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-800 cursor-pointer hover:bg-green-100 transition-colors"
                        >
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.inHouse}</div>
                            <div className="text-xs text-green-600/80 dark:text-green-400/80 font-medium">İçeride (Oda)</div>
                        </div>
                        <div
                            onClick={() => router.push('/dashboard/front-office/reservations?filter=checkout')}
                            className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-800 cursor-pointer hover:bg-red-100 transition-colors"
                        >
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.departures}</div>
                            <div className="text-xs text-red-600/80 dark:text-red-400/80 font-medium">Çıkış Yapacak</div>
                        </div>
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-100 dark:border-purple-800">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">%{stats.occupancy}</div>
                            <div className="text-xs text-purple-600/80 dark:text-purple-400/80 font-medium">Doluluk</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Uyarılar & Notlar</h3>
                    <ul className="space-y-3">
                        <li className="flex gap-3 items-start text-sm">
                            <span className="w-2 h-2 mt-1.5 rounded-full bg-red-500 shrink-0" />
                            <span className="text-gray-600 dark:text-gray-300">102 Nolu oda kliması arızalı, teknik servise bildirildi.</span>
                        </li>
                        <li className="flex gap-3 items-start text-sm">
                            <span className="w-2 h-2 mt-1.5 rounded-full bg-yellow-500 shrink-0" />
                            <span className="text-gray-600 dark:text-gray-300">VIP misafir (Mr. Smith) saat 14:00'te giriş yapacak.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
