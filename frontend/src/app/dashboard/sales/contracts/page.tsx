"use client";

import { FaFileSignature, FaSearch, FaDownload } from "react-icons/fa";

export default function ContractsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kontratlar</h1>
                    <p className="text-sm text-gray-500">Acente ve kurumsal sözleşme yönetimi.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input className="pl-10 pr-4 py-2 text-sm border rounded-lg bg-gray-50 w-64" placeholder="Kontrat Ara..." />
                    </div>
                </div>

                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-500 font-bold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Kontrat ID</th>
                            <th className="px-6 py-4">Acente / Firma</th>
                            <th className="px-6 py-4">Sezon</th>
                            <th className="px-6 py-4">Durum</th>
                            <th className="px-6 py-4 text-right">Dosya</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                            <td className="px-6 py-4 font-mono font-bold text-blue-600">CNT-2025-001</td>
                            <td className="px-6 py-4 font-bold">ETS Turizm A.Ş.</td>
                            <td className="px-6 py-4">Yaz 2025</td>
                            <td className="px-6 py-4"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">İmza Aşamasında</span></td>
                            <td className="px-6 py-4 text-right"><FaDownload className="cursor-pointer text-gray-400 hover:text-gray-600" /></td>
                        </tr>
                        <tr className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                            <td className="px-6 py-4 font-mono font-bold text-blue-600">CNT-2024-055</td>
                            <td className="px-6 py-4 font-bold">TUI UK Ltd.</td>
                            <td className="px-6 py-4">Kış 2024/25</td>
                            <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Onaylandı</span></td>
                            <td className="px-6 py-4 text-right"><FaDownload className="cursor-pointer text-gray-400 hover:text-gray-600" /></td>
                        </tr>
                        <tr className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                            <td className="px-6 py-4 font-mono font-bold text-blue-600">CNT-2024-001</td>
                            <td className="px-6 py-4 font-bold">Booking.com</td>
                            <td className="px-6 py-4">2024 (Yıllık)</td>
                            <td className="px-6 py-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Onaylandı</span></td>
                            <td className="px-6 py-4 text-right"><FaDownload className="cursor-pointer text-gray-400 hover:text-gray-600" /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
