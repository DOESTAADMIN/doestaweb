"use client";

import { FaShoppingBasket, FaPlus, FaCalendarAlt } from "react-icons/fa";

export default function PurchasePage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Satın Alma</h1>
                    <p className="text-sm text-gray-500">Talep, teklif ve sipariş yönetimi.</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                    <FaPlus /> Yeni Talep
                </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-500 font-bold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Talep No</th>
                            <th className="px-6 py-4">Tarih</th>
                            <th className="px-6 py-4">Departman</th>
                            <th className="px-6 py-4">Açıklama</th>
                            <th className="px-6 py-4">Durum</th>
                            <th className="px-6 py-4 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        {[
                            { id: "PO-2024-85", date: "12.12.2024", dept: "Mutfak", desc: "Taze Sebze Meyve Alımı", status: "Bekliyor" },
                            { id: "PO-2024-84", date: "11.12.2024", dept: "Teknik Servis", desc: "Klima Gazı ve Yedek Parça", status: "Onaylandı" },
                            { id: "PO-2024-83", date: "10.12.2024", dept: "Housekeeping", desc: "Oda Buklet Malzemeleri", status: "Tamamlandı" },
                        ].map((po, i) => (
                            <tr key={i} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                                <td className="px-6 py-4 font-mono font-bold text-blue-600">#{po.id}</td>
                                <td className="px-6 py-4 text-gray-500 flex items-center gap-2">
                                    <FaCalendarAlt size={12} /> {po.date}
                                </td>
                                <td className="px-6 py-4 font-bold">{po.dept}</td>
                                <td className="px-6 py-4">{po.desc}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${po.status === 'Bekliyor' ? 'bg-orange-100 text-orange-700' :
                                            po.status === 'Onaylandı' ? 'bg-blue-100 text-blue-700' :
                                                'bg-green-100 text-green-700'
                                        }`}>
                                        {po.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-blue-600 font-bold text-xs border px-2 py-1 rounded">Detay</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
