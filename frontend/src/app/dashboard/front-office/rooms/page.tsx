"use client";

import React, { useEffect, useState } from 'react';
import { roomService } from '@/lib/api';
import { FaBed, FaSearch, FaFilter, FaPlus, FaEllipsisV } from 'react-icons/fa';

interface Room {
    id: number;
    number: string;
    type: string;
    status: string;
    price: number;
    capacity: number;
    isOccupied: boolean;
}

export default function RoomsPage() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('All');

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const data = await roomService.getAll();
            setRooms(data);
        } catch (err) {
            setError('Oda verileri yüklenirken bir hata oluştu. Lütfen bağlantınızı kontrol edin.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Clean': return 'bg-green-100 text-green-800 border-green-200';
            case 'Dirty': return 'bg-red-100 text-red-800 border-red-200';
            case 'Occupied': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'DnD': return 'bg-purple-100 text-purple-800 border-purple-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const filteredRooms = filterStatus === 'All'
        ? rooms
        : rooms.filter(r => r.status === filterStatus);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Oda Yönetimi</h1>
                    <p className="text-gray-500 dark:text-gray-400">Tüm odaların anlık durumu ve yönetimi</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => fetchRooms()}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Yenile
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                        <FaPlus size={14} /> Yeni Oda Ekle
                    </button>
                </div>
            </div>

            {/* Filters & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {['All', 'Clean', 'Dirty', 'Occupied'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`p-4 rounded-xl border transition-all ${filterStatus === status
                                ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-300'
                                : 'bg-white border-gray-200 hover:border-blue-200'
                            }`}
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-500">
                                {status === 'All' ? 'Toplam Oda' : status}
                            </span>
                            <FaBed className={`text-lg ${filterStatus === status ? 'text-blue-600' : 'text-gray-300'}`} />
                        </div>
                        <div className="mt-2 text-2xl font-bold text-gray-900">
                            {status === 'All' ? rooms.length : rooms.filter(r => r.status === status).length}
                        </div>
                    </button>
                ))}
            </div>

            {/* Room List Table */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-zinc-800/50 text-gray-500 dark:text-gray-400 font-medium">
                            <tr className="border-b border-gray-100 dark:border-gray-800">
                                <th className="px-6 py-4">Oda No</th>
                                <th className="px-6 py-4">Tip</th>
                                <th className="px-6 py-4">Durum</th>
                                <th className="px-6 py-4">Fiyat</th>
                                <th className="px-6 py-4">Kapasite</th>
                                <th className="px-6 py-4">Doluluk</th>
                                <th className="px-6 py-4 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        Veriler yükleniyor...
                                    </td>
                                </tr>
                            ) : filteredRooms.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        Kayıt bulunamadı.
                                    </td>
                                </tr>
                            ) : (
                                filteredRooms.map((room) => (
                                    <tr key={room.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                                            {room.number}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {room.type}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(room.status)}`}>
                                                {room.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                            €{room.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {room.capacity} Kişi
                                        </td>
                                        <td className="px-6 py-4">
                                            {room.isOccupied ? (
                                                <span className="text-red-600 font-medium text-xs">Dolu</span>
                                            ) : (
                                                <span className="text-green-600 font-medium text-xs">Boş</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-gray-400 hover:text-blue-600 transition-colors">
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
        </div>
    );
}
