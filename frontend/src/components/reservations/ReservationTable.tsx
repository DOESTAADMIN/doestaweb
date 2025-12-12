"use client";
import React from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import { Reservation } from '@/hooks/useReservations';

interface ReservationTableProps {
    reservations: Reservation[];
    loading: boolean;
}

export function ReservationTable({ reservations, loading }: ReservationTableProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900';
            case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900';
            case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900';
            case 'CheckedIn': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900';
            default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-soft border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50/50 dark:bg-zinc-800/50 border-b border-gray-100 dark:border-gray-800">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400">Misafir</th>
                            <th className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400">Oda No</th>
                            <th className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400">Giriş</th>
                            <th className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400">Çıkış</th>
                            <th className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400">Tutar</th>
                            <th className="px-6 py-4 font-semibold text-gray-500 dark:text-gray-400">Durum</th>
                            <th className="px-6 py-4 text-right font-semibold text-gray-500 dark:text-gray-400">İşlem</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={7} className="px-6 py-4">
                                        <div className="h-4 bg-gray-100 dark:bg-zinc-800 rounded w-full"></div>
                                    </td>
                                </tr>
                            ))
                        ) : reservations.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                                    Kayıt bulunamadı.
                                </td>
                            </tr>
                        ) : (
                            reservations.map((res) => (
                                <tr key={res.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">
                                        {res.guestName}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                        <span className="font-mono bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded text-xs">{res.roomId}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                        {new Date(res.checkInDate).toLocaleDateString("tr-TR")}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                        {new Date(res.checkOutDate).toLocaleDateString("tr-TR")}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">
                                        €{res.totalPrice.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusColor(res.status)}`}>
                                            {res.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                            <FaEllipsisV />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
