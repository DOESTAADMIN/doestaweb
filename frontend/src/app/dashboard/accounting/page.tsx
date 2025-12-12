"use client";

import { FaCalculator, FaMoneyBillWave, FaFileInvoiceDollar, FaChartLine } from "react-icons/fa";

export default function AccountingPage() {
    const stats = [
        { label: "Günlük Ciro", value: "₺12,450", icon: FaMoneyBillWave, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30" },
        { label: "Bekleyen Faturalar", value: "₺3,200", icon: FaFileInvoiceDollar, color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/30" },
        { label: "Kasa Bakiyesi", value: "₺8,500", icon: FaCalculator, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
        { label: "Aylık Kar/Zarar", value: "+₺125,000", icon: FaChartLine, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30" },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Muhasebe</h1>
                <p className="text-sm text-gray-500">Finansal durum özeti ve işlem kısayolları.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                            <div className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Transactions Mock */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 font-bold">Son İşlemler</div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-500 font-bold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Tarih</th>
                            <th className="px-6 py-4">Açıklama</th>
                            <th className="px-6 py-4">Kategori</th>
                            <th className="px-6 py-4 text-right">Tutar</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        <tr className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                            <td className="px-6 py-4">12.12.2024</td>
                            <td className="px-6 py-4 font-bold">Masa 5 Ödeme</td>
                            <td className="px-6 py-4">Restoran Geliri</td>
                            <td className="px-6 py-4 text-right text-green-600 font-bold">+₺450.00</td>
                        </tr>
                        <tr className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                            <td className="px-6 py-4">12.12.2024</td>
                            <td className="px-6 py-4 font-bold">Toptancı Ödemesi (Gıda A.Ş)</td>
                            <td className="px-6 py-4">Gider</td>
                            <td className="px-6 py-4 text-right text-red-600 font-bold">-₺2,100.00</td>
                        </tr>
                        <tr className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                            <td className="px-6 py-4">11.12.2024</td>
                            <td className="px-6 py-4 font-bold">Oda 101 Konaklama Bedeli</td>
                            <td className="px-6 py-4">Oda Geliri</td>
                            <td className="px-6 py-4 text-right text-green-600 font-bold">+₺1,200.00</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
