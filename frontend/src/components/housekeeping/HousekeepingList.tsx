"use client";

import { useState } from "react";
import { FaBroom, FaCheck, FaExclamationTriangle, FaUndo } from "react-icons/fa";

type HKStatus = "Clean" | "Dirty" | "TouchUp" | "OutOfOrder";

const MOCK_HK_ROOMS = [
    { id: "101", type: "STD", status: "Clean", maid: "Ayşe K." },
    { id: "102", type: "STD", status: "Dirty", maid: "Fatma B." },
    { id: "103", type: "DLX", status: "TouchUp", maid: "Ayşe K." },
    { id: "201", type: "STD", status: "Dirty", maid: "Zeynep T." },
    { id: "202", type: "DLX", status: "Clean", maid: "Zeynep T." },
    { id: "203", type: "STE", status: "OutOfOrder", maid: "-" },
];

const STATUS_CONFIG: Record<HKStatus, { label: string; bg: string; text: string; icon: any }> = {
    Clean: { label: "Temiz", bg: "bg-green-100", text: "text-green-700", icon: FaCheck },
    Dirty: { label: "Kirli", bg: "bg-red-100", text: "text-red-700", icon: FaBroom },
    TouchUp: { label: "Kontrol", bg: "bg-yellow-100", text: "text-yellow-700", icon: FaUndo },
    OutOfOrder: { label: "Arızalı", bg: "bg-gray-200", text: "text-gray-700", icon: FaExclamationTriangle },
};

export default function HousekeepingList() {
    const [rooms, setRooms] = useState(MOCK_HK_ROOMS);

    const updateStatus = (id: string, newStatus: HKStatus) => {
        setRooms(rooms.map(r => r.id === id ? { ...r, status: newStatus } : r));
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 font-semibold uppercase text-xs">
                    <tr>
                        <th className="px-6 py-4">Oda</th>
                        <th className="px-6 py-4">Tip</th>
                        <th className="px-6 py-4">Sorumlu Personel</th>
                        <th className="px-6 py-4">Durum</th>
                        <th className="px-6 py-4 text-right">İşlemler</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                    {rooms.map(room => (
                        <tr key={room.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                            <td className="px-6 py-4 font-bold">{room.id}</td>
                            <td className="px-6 py-4">{room.type}</td>
                            <td className="px-6 py-4">{room.maid}</td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold flex w-fit items-center gap-2 ${STATUS_CONFIG[room.status as HKStatus].bg} ${STATUS_CONFIG[room.status as HKStatus].text}`}>
                                    {STATUS_CONFIG[room.status as HKStatus].label}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => updateStatus(room.id, "Clean")}
                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg tooltip"
                                        title="Temizle"
                                    >
                                        <FaCheck />
                                    </button>
                                    <button
                                        onClick={() => updateStatus(room.id, "Dirty")}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        title="Kirli İşaretle"
                                    >
                                        <FaBroom />
                                    </button>
                                    <button
                                        onClick={() => updateStatus(room.id, "OutOfOrder")}
                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                        title="Arızaya Al"
                                    >
                                        <FaExclamationTriangle />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
