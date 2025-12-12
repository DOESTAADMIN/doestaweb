"use client";

import { useState } from "react";
import { FaFileInvoiceDollar, FaCheckDouble, FaPrint, FaSearch } from "react-icons/fa";

const MOCK_ORDERS = [
    { id: "ADS-1092", table: "Masa 1", time: "12:30", items: 4, total: 1450, status: "Open", staff: "Ali V." },
    { id: "ADS-1091", table: "Masa 5", time: "11:45", items: 2, total: 320, status: "Paid", staff: "Ayşe Y." },
    { id: "ADS-1090", table: "Bar 2", time: "11:15", items: 1, total: 120, status: "Paid", staff: "Mehmet K." },
    { id: "ADS-1089", table: "Masa 3", time: "10:30", items: 6, total: 2300, status: "Open", staff: "Ali V." },
    { id: "ADS-1088", table: "Masa 2", time: "09:15", items: 3, total: 450, status: "Paid", staff: "Zeynep T." },
];

export default function OrdersPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Adisyonlar</h1>
                    <p className="text-sm text-gray-500">Günlük sipariş ve adisyon takibi.</p>
                </div>
                <div className="flex gap-2 text-sm text-gray-600">
                    <div className="px-3 py-1 bg-white border rounded shadow-sm">Toplam: <b>5 Adet</b></div>
                    <div className="px-3 py-1 bg-white border rounded shadow-sm">Ciro: <b>₺4,640</b></div>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input className="pl-10 pr-4 py-2 text-sm border rounded-lg bg-gray-50 w-64" placeholder="Adisyon No veya Masa Ara..." />
                    </div>
                    <button className="text-sm font-bold text-blue-600 hover:underline">Rapor Al</button>
                </div>

                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-500 font-bold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Adisyon No</th>
                            <th className="px-6 py-4">Masa</th>
                            <th className="px-6 py-4">Saat</th>
                            <th className="px-6 py-4">Personel</th>
                            <th className="px-6 py-4">Kalem</th>
                            <th className="px-6 py-4">Tutar</th>
                            <th className="px-6 py-4">Durum</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        {MOCK_ORDERS.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                <td className="px-6 py-4 font-mono font-bold text-gray-700 dark:text-gray-300">#{order.id}</td>
                                <td className="px-6 py-4 font-bold">{order.table}</td>
                                <td className="px-6 py-4 text-gray-500">{order.time}</td>
                                <td className="px-6 py-4">{order.staff}</td>
                                <td className="px-6 py-4">{order.items} Ürün</td>
                                <td className="px-6 py-4 font-bold text-blue-600">₺{order.total}</td>
                                <td className="px-6 py-4">
                                    {order.status === "Open" ? (
                                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">AÇIK</span>
                                    ) : (
                                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex items-center gap-1"><FaCheckDouble /> ÖDENDİ</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right text-gray-400">
                                    <button className="hover:text-gray-800"><FaPrint /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
