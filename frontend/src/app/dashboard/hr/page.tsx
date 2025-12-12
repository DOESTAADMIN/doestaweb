"use client";

import { FaUserTie, FaClock, FaCalendarAlt, FaPlus, FaSearch } from "react-icons/fa";

export default function HrPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Personel Yönetimi</h1>
                    <p className="text-sm text-gray-500">Çalışanlar, vardiya ve izin takibi.</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                        <FaPlus /> Yeni Personel
                    </button>
                    <button className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-900 border border-gray-700">
                        <FaCalendarAlt /> Vardiya Planı
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: "Toplam Personel", val: 45, color: "blue", icon: FaUserTie },
                    { label: "İzinli", val: 3, color: "orange", icon: FaCalendarAlt },
                    { label: "Şu An Mesai", val: 28, color: "green", icon: FaClock },
                    { label: "Yeni Başlayan", val: 2, color: "purple", icon: FaPlus },
                ].map((s, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg bg-${s.color}-100 text-${s.color}-600 flex items-center justify-center`}>
                            <s.icon />
                        </div>
                        <div>
                            <div className="text-xs text-gray-500">{s.label}</div>
                            <div className="font-bold text-lg">{s.val}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">
                <div className="flex gap-4 mb-4">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input className="pl-10 pr-4 py-2 w-full border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Personel Adı, Departman Ara..." />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-500 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Ad Soyad</th>
                                <th className="px-6 py-4">Departman</th>
                                <th className="px-6 py-4">Pozisyon</th>
                                <th className="px-6 py-4">Vardiya</th>
                                <th className="px-6 py-4">Durum</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                            {[
                                { name: "Ahmet Yılmaz", dept: "Housekeeping", pos: "Kat Şefi", shift: "08:00 - 16:00", status: "Active" },
                                { name: "Ayşe Kaya", dept: "Front Office", pos: "Resepsiyonist", shift: "16:00 - 24:00", status: "Active" },
                                { name: "Mehmet Demir", dept: "Kitchen", pos: "Aşçıbaşı", shift: "08:00 - 17:00", status: "OnLeave" },
                                { name: "Zeynep Çelik", dept: "Service", pos: "Garson", shift: "12:00 - 22:00", status: "Active" },
                            ].map((p, i) => (
                                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                                    <td className="px-6 py-4 font-bold flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                            {p.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        {p.name}
                                    </td>
                                    <td className="px-6 py-4">{p.dept}</td>
                                    <td className="px-6 py-4">{p.pos}</td>
                                    <td className="px-6 py-4 text-xs font-mono">{p.shift}</td>
                                    <td className="px-6 py-4">
                                        {p.status === 'Active' ? (
                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Çalışıyor</span>
                                        ) : (
                                            <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-bold">İzinli</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-blue-600 hover:underline text-xs font-bold">Detay</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
