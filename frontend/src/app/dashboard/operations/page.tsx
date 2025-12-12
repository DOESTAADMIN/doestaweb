"use client";

import Link from "next/link";
import { FaKey, FaSignOutAlt, FaClock } from "react-icons/fa";

export default function OperationsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Operasyonlar</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Günlük giriş ve çıkış işlemlerini yönetin.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Check-in Card */}
                <Link
                    href="/dashboard/operations/checkin"
                    className="group block p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all hover:border-blue-200 dark:hover:border-blue-900"
                >
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                        <FaKey size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Check-in İşlemleri</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Yeni gelen misafirlerin giriş işlemlerini yapın, kimlik tarayın ve oda anahtarı verin.
                    </p>
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                        <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                        <span>Bekleyen 5 Giriş Var</span>
                    </div>
                </Link>

                {/* Check-out Card */}
                <Link
                    href="/dashboard/operations/checkout"
                    className="group block p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all hover:border-orange-200 dark:hover:border-orange-900"
                >
                    <div className="w-16 h-16 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center mb-6 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                        <FaSignOutAlt size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Check-out İşlemleri</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Ayrılan misafirlerin çıkış işlemlerini yapın, harcamaları tahsil edin ve faturasını kesin.
                    </p>
                    <div className="flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400">
                        <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
                        <span>Bekleyen 3 Çıkış Var</span>
                    </div>
                </Link>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <FaClock className="text-gray-400" />
                    Bugünün Hareketleri
                </h3>
                <div className="space-y-4">
                    {/* Mock Timeline */}
                    {[
                        { time: "14:30", type: "Check-in", guest: "Ahmet Yılmaz", room: "201", user: "Resepsiyon" },
                        { time: "12:15", type: "Check-out", guest: "Mehmet Demir", room: "105", user: "Resepsiyon" },
                        { time: "11:00", type: "Check-out", guest: "Ayşe Kaya", room: "302", user: "Resepsiyon" },
                    ].map((log, i) => (
                        <div key={i} className="flex items-center gap-4 text-sm">
                            <span className="w-16 font-mono text-gray-500">{log.time}</span>
                            <span className={`px-2 py-1 rounded text-xs font-bold w-20 text-center ${log.type === "Check-in" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" : "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
                                }`}>{log.type}</span>
                            <span className="font-medium text-gray-900 dark:text-gray-200">{log.guest}</span>
                            <span className="text-gray-500">Oda: {log.room}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
