"use client";

import { useState } from "react";
import { FaEye, FaPlus, FaPrint, FaTrash } from "react-icons/fa";

const MOCK_FOLIOS = [
    { id: "FOL-101", room: "201", guest: "Ahmet Yılmaz", balance: 1250, status: "Open" },
    { id: "FOL-102", room: "305", guest: "Ayşe Kaya", balance: 0, status: "Paid" },
    { id: "FOL-103", room: "102", guest: "Mehmet Demir", balance: 450, status: "Open" },
];

export default function FolioList() {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 font-semibold uppercase text-xs">
                    <tr>
                        <th className="px-6 py-4">Folyo No</th>
                        <th className="px-6 py-4">Oda</th>
                        <th className="px-6 py-4">Misafir</th>
                        <th className="px-6 py-4">Bakiye</th>
                        <th className="px-6 py-4">Durum</th>
                        <th className="px-6 py-4 text-right">İşlemler</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                    {MOCK_FOLIOS.map(folio => (
                        <tr key={folio.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                            <td className="px-6 py-4 font-medium">{folio.id}</td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-gray-100 dark:bg-zinc-700 rounded text-xs font-bold">{folio.room}</span>
                            </td>
                            <td className="px-6 py-4">{folio.guest}</td>
                            <td className={`px-6 py-4 font-bold ${folio.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                ₺{folio.balance.toLocaleString('tr-TR')}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${folio.status === 'Open'
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                    }`}>
                                    {folio.status === 'Open' ? 'Açık' : 'Ödendi'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                <button className="text-gray-500 hover:text-blue-600"><FaEye /></button>
                                <button className="text-gray-500 hover:text-gray-800"><FaPrint /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
