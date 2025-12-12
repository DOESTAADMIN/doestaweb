"use client";

import { FaBullhorn, FaCalendarCheck, FaGift } from "react-icons/fa";

export default function CampaignsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kampanyalar</h1>
                    <p className="text-sm text-gray-500">Aktif promosyon ve indirimlerin yönetimi.</p>
                </div>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700">
                    <FaBullhorn /> Kampanya Oluştur
                </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-500 font-bold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Kampanya Adı</th>
                            <th className="px-6 py-4">Tip</th>
                            <th className="px-6 py-4">İndirim</th>
                            <th className="px-6 py-4">Geçerlilik Tarihleri</th>
                            <th className="px-6 py-4">Durum</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                            <td className="px-6 py-4 font-bold flex items-center gap-2">
                                <FaGift className="text-purple-500" /> Early Bird 2025
                            </td>
                            <td className="px-6 py-4">Erken Rezervasyon</td>
                            <td className="px-6 py-4 font-bold text-green-600">%20</td>
                            <td className="px-6 py-4 text-xs text-gray-500">01.01.2025 - 31.03.2025</td>
                            <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Aktif</span></td>
                        </tr>
                        <tr className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                            <td className="px-6 py-4 font-bold flex items-center gap-2">
                                <FaGift className="text-blue-500" /> Long Stay (7+)
                            </td>
                            <td className="px-6 py-4">Uzun Dönem</td>
                            <td className="px-6 py-4 font-bold text-green-600">%10</td>
                            <td className="px-6 py-4 text-xs text-gray-500">Her Zaman</td>
                            <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Aktif</span></td>
                        </tr>
                        <tr className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                            <td className="px-6 py-4 font-bold flex items-center gap-2">
                                <FaGift className="text-gray-400" /> Black Friday
                            </td>
                            <td className="px-6 py-4">Özel Gün</td>
                            <td className="px-6 py-4 font-bold text-green-600">%40</td>
                            <td className="px-6 py-4 text-xs text-gray-500">20.11.2024 - 27.11.2024</td>
                            <td className="px-6 py-4"><span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs font-bold">Süresi Doldu</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
