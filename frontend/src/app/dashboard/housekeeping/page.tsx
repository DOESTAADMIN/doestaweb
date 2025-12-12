"use client";

import { useState, useEffect } from "react";
import { FaPrint, FaUserPlus, FaCheckCircle, FaBroom, FaUserClock, FaExclamationTriangle, FaBed } from "react-icons/fa";
import { roomService } from "@/lib/api";

type RoomStatus = "Clean" | "Dirty" | "InProgr" | "DND" | "Occupied";
type Priority = "Low" | "Medium" | "High";

export default function HousekeepingPage() {
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRooms = async () => {
        setLoading(true);
        try {
            const data = await roomService.getAll();
            const mapped = data.map((r: any) => ({
                id: r.id,
                room: r.number,
                type: r.type,
                status: r.status as RoomStatus,
                housekeeper: "-", // Backend doesn't support yet
                priority: "Low" as Priority
            }));
            setRooms(mapped);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const toggleStatus = async (room: any) => {
        const nextStatusVal: Record<string, string> = {
            "Clean": "Dirty",
            "Dirty": "Clean",
            "Occupied": "Clean", // Can clean occupied room too ideally 
            "InProgr": "Clean",
            "DND": "Dirty"
        };
        const next = nextStatusVal[room.status] || "Dirty";

        // Optimistic update
        setRooms(prev => prev.map(r => r.id === room.id ? { ...r, status: next } : r));

        try {
            await roomService.updateStatus(room.id, next);
        } catch (e) {
            console.error("Failed to update status", e);
            fetchRooms(); // Revert on failure
        }
    };

    const stats = {
        clean: rooms.filter(r => r.status === "Clean").length,
        dirty: rooms.filter(r => r.status === "Dirty").length,
        inProg: rooms.filter(r => r.status === "InProgr").length,
        dnd: rooms.filter(r => r.status === "DND").length,
    };

    if (loading) return <div className="p-10 text-center">Yükleniyor...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kat Hizmetleri (Housekeeping)</h1>
                <div className="flex gap-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                        <FaUserPlus /> Personel Ata
                    </button>
                    <button className="bg-gray-200 dark:bg-zinc-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-300">
                        <FaPrint /> Rapor
                    </button>
                </div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800 flex items-center justify-between cursor-pointer hover:bg-green-100 transition-colors">
                    <div>
                        <div className="text-green-700 dark:text-green-400 font-bold text-lg">Temiz</div>
                        <div className="text-sm text-green-600">{stats.clean} Oda</div>
                    </div>
                    <FaCheckCircle className="text-green-500 text-3xl" />
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800 flex items-center justify-between cursor-pointer hover:bg-red-100 transition-colors">
                    <div>
                        <div className="text-red-700 dark:text-red-400 font-bold text-lg">Kirli</div>
                        <div className="text-sm text-red-600">{stats.dirty} Oda</div>
                    </div>
                    <FaBroom className="text-red-500 text-3xl" />
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 flex items-center justify-between">
                    <div>
                        <div className="text-blue-700 dark:text-blue-400 font-bold text-lg">Temizleniyor</div>
                        <div className="text-sm text-blue-600">{stats.inProg} Oda</div>
                    </div>
                    <FaUserClock className="text-blue-500 text-3xl" />
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800 flex items-center justify-between">
                    <div>
                        <div className="text-purple-700 dark:text-purple-400 font-bold text-lg">DND / Arıza</div>
                        <div className="text-sm text-purple-600">{stats.dnd} Oda</div>
                    </div>
                    <FaExclamationTriangle className="text-purple-500 text-3xl" />
                </div>
            </div>

            {/* Room List with Toggle Action */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h3 className="font-bold text-gray-700 dark:text-gray-300">Oda Durum Listesi</h3>
                    <div className="flex gap-2">
                        <button className="text-sm border border-gray-300 px-3 py-1 rounded hover:bg-gray-50">Tümünü Yazdır</button>
                    </div>
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-500 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Oda</th>
                            <th className="px-6 py-4">Tip</th>
                            <th className="px-6 py-4">Durum (Tıkla Değiştir)</th>
                            <th className="px-6 py-4">Görevli</th>
                            <th className="px-6 py-4">Öncelik</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        {rooms.map((room) => (
                            <tr key={room.room} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <FaBed className="text-gray-400" /> {room.room}
                                </td>
                                <td className="px-6 py-4">{room.type}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => toggleStatus(room)}
                                        className={`px-3 py-1 rounded-full text-xs font-bold border transition-all hover:scale-105 active:scale-95 w-28 text-center ${room.status === "Clean" ? "bg-green-100 text-green-700 border-green-200" :
                                            room.status === "Dirty" ? "bg-red-100 text-red-700 border-red-200" :
                                                room.status === "Occupied" ? "bg-red-600 text-white border-red-600" :
                                                    room.status === "InProgr" ? "bg-blue-100 text-blue-700 border-blue-200" :
                                                        "bg-purple-100 text-purple-700 border-purple-200"
                                            }`}>
                                        {room.status === "Clean" ? "TERTEMİZ" :
                                            room.status === "Dirty" ? "KİRLİ" :
                                                room.status === "Occupied" ? "DOLU" :
                                                    room.status === "InProgr" ? "TEMİZLENİYOR" : room.status}
                                    </button>
                                </td>
                                <td className="px-6 py-4">{room.housekeeper}</td>
                                <td className="px-6 py-4">
                                    {room.priority === "High" && <span className="text-red-600 font-bold text-xs flex items-center gap-1"><FaExclamationTriangle /> ACİL</span>}
                                    {room.priority === "Medium" && <span className="text-orange-600 font-bold text-xs">Normal</span>}
                                    {room.priority === "Low" && <span className="text-green-600 font-bold text-xs">Düşük</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
