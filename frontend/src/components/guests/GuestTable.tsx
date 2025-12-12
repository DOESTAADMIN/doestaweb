"use client";

import { useState } from "react";
import { FaEdit, FaEye, FaTrash, FaStar } from "react-icons/fa";
import { cn } from "@/lib/utils";

// Mock Data
const MOCK_GUESTS = [
    {
        id: 1,
        name: "Ahmet Yılmaz",
        identity: "12345678901",
        phone: "+90 555 123 45 67",
        email: "ahmet@example.com",
        stays: 5,
        lastStay: "2024-11-20",
        totalSpent: 12500,
        vip: true
    },
    {
        id: 2,
        name: "Ayşe Demir",
        identity: "98765432109",
        phone: "+90 555 987 65 43",
        email: "ayse@example.com",
        stays: 1,
        lastStay: "2024-12-05",
        totalSpent: 2500,
        vip: false
    },
    {
        id: 3,
        name: "Mehmet Öz",
        identity: "56789012345",
        phone: "+90 532 000 00 00",
        email: "mehmet@example.com",
        stays: 12,
        lastStay: "2024-12-10",
        totalSpent: 45000,
        vip: true
    },
];

export default function GuestTable() {
    const [guests, setGuests] = useState(MOCK_GUESTS);

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-zinc-800 dark:text-gray-400">
                    <tr>
                        <th className="px-6 py-3">Misafir</th>
                        <th className="px-6 py-3">İletişim</th>
                        <th className="px-6 py-3 text-center">Konaklama Sayısı</th>
                        <th className="px-6 py-3">Son Konaklama</th>
                        <th className="px-6 py-3">Harcama</th>
                        <th className="px-6 py-3 text-right">İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    {guests.map((guest) => (
                        <tr key={guest.id} className="bg-white border-b dark:bg-zinc-900 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="font-medium text-gray-900 dark:text-white">{guest.name}</div>
                                    {guest.vip && <FaStar className="text-yellow-400" size={14} title="VIP" />}
                                </div>
                                <div className="text-xs text-gray-500">{guest.identity}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-gray-900 dark:text-white">{guest.phone}</div>
                                <div className="text-xs text-gray-500">{guest.email}</div>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-semibold">
                                    {guest.stays}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                {new Date(guest.lastStay).toLocaleDateString('tr-TR')}
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                ₺{guest.totalSpent.toLocaleString('tr-TR')}
                            </td>
                            <td className="px-6 py-4 text-right space-x-2">
                                <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                                    <FaEye />
                                </button>
                                <button className="text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-300">
                                    <FaEdit />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
