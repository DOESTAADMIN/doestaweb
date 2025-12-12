"use client";

import React, { useState, useEffect } from 'react';
import {
    FaPlus, FaPen, FaTrash, FaPrint, FaSyncAlt, FaFileExcel,
    FaBars, FaQuestionCircle, FaTimes, FaBolt, FaFilter, FaSearch
} from 'react-icons/fa';
import { cn } from "@/lib/utils";
import RoomDialog from "@/components/settings/RoomDialog";
import { toast } from "sonner";

const API_URL = "http://localhost:5085/api/rooms";

const Tabs = ["Aktif", "Hepsi", "Silindi"];

export default function RoomDefinitionsPage() {
    const [activeTab, setActiveTab] = useState("Aktif");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<any | null>(null);
    const [rooms, setRooms] = useState<any[]>([]);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const res = await fetch(API_URL);
            if (res.ok) {
                const data = await res.json();
                setRooms(data);
            }
        } catch (error) {
            console.error("Failed to fetch rooms", error);
        }
    };

    // Filter logic
    const filteredData = rooms.filter(room => {
        if (activeTab === "Aktif") return !room.isDeleted && !room.isPassive;
        if (activeTab === "Silindi") return room.isDeleted;
        return true;
    });

    const handleEdit = (room: any) => {
        setSelectedRoom(room);
        setIsDialogOpen(true);
    };

    const handleAdd = () => {
        setSelectedRoom(null);
        setIsDialogOpen(true);
    };

    const handleSave = async (formData: any) => {
        // Just simple mapping for now
        const roomData = { ...formData, id: formData.id || 0 };
        // If ID is 0 or undefined, it's POST, else PUT

        try {
            if (roomData.id) {
                // UPDATE
                const res = await fetch(`${API_URL}/${roomData.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(roomData)
                });
                if (res.ok || res.status === 204) {
                    setIsDialogOpen(false);
                    fetchRooms();
                    toast.success("Oda kartı güncellendi.");
                } else {
                    toast.error("Güncelleme başarısız.");
                }
            } else {
                // CREATE
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(roomData)
                });
                if (res.ok) {
                    setIsDialogOpen(false);
                    fetchRooms();
                    toast.success("Yeni oda kartı oluşturuldu.");
                } else {
                    toast.error("Kayıt oluşturulamadı.");
                }
            }
        } catch (err) {
            console.error("Error saving room", err);
            toast.error("Bağlantı hatası.");
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50 dark:bg-black/20 p-4 relative overflow-y-auto">
            {/* Header Container */}
            <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-t-lg border border-gray-200 dark:border-zinc-800 flex flex-col h-full">
                {/* Title & Top controls */}
                <div className="flex justify-between items-center p-3 border-b border-gray-100 dark:border-zinc-800 shrink-0">
                    <h1 className="text-xl font-bold text-blue-900 dark:text-blue-400 flex items-center gap-2">
                        <FaQuestionCircle className="text-blue-900 dark:text-blue-400" /> Odalar
                    </h1>
                    <button className="text-red-300 hover:text-red-500"><FaTimes size={18} /></button>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-1 p-2 border-b border-gray-100 dark:border-zinc-800 overflow-x-auto shrink-0 bg-gray-50/50 dark:bg-zinc-900">
                    <ToolbarButton icon={FaPlus} className="text-blue-600" onClick={handleAdd} />
                    <ToolbarButton icon={FaPen} onClick={() => selectedRoom && handleEdit(selectedRoom)} />
                    <ToolbarButton icon={FaTrash} className="text-red-500" />
                    <div className="w-px h-5 bg-gray-300 dark:bg-zinc-700 mx-1"></div>
                    <ToolbarButton icon={FaPrint} />
                    <ToolbarButton icon={FaSyncAlt} onClick={fetchRooms} />
                    <ToolbarButton icon={FaFileExcel} />
                    <ToolbarButton icon={FaBars} />
                    <div className="w-px h-5 bg-gray-300 dark:bg-zinc-700 mx-1"></div>
                    <div className="relative group">
                        <button className="flex items-center gap-2 px-2 py-1.5 text-gray-600 hover:bg-gray-100 rounded">
                            <FaBolt size={14} />
                        </button>
                        <div className="absolute top-full left-0 mt-1 w-48 bg-white shadow-lg border rounded hidden group-hover:block z-50">
                            <div className="p-2 text-sm hover:bg-gray-50 cursor-pointer flex items-center gap-2">
                                <span className="transform rotate-90 text-gray-400">↳</span> Oda Kopyalama
                            </div>
                        </div>
                    </div>

                    <div className="flex-1"></div>
                    <span className="text-xs text-gray-500 font-medium px-2">Toplam: {filteredData.length}</span>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-100 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 px-2 pt-1 gap-1 shrink-0">
                    {Tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-6 py-2 text-xs font-bold transition-colors relative top-px",
                                activeTab === tab
                                    ? "bg-white dark:bg-zinc-900 text-gray-800 dark:text-white border border-b-0 border-gray-300 dark:border-zinc-700 rounded-t shadow-sm z-10"
                                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 border border-transparent"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-auto bg-white dark:bg-zinc-900 relative">
                    <table className="w-full text-xs text-left border-collapse whitespace-nowrap">
                        <thead className="bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 font-semibold border-b border-gray-300 dark:border-zinc-700 sticky top-0 z-20 shadow-sm">
                            <tr>
                                {[
                                    "Oda No", "Durum", "Oda Tipi", "Yatak Tipi", "Kat", "Lokasyon",
                                    "Manzara", "Açıklama", "Silindi", "Pasif", "Anahtar No",
                                    "Yanındaki Odalar", "Özellikler", "Telefon No", "Ücretli Tv",
                                    "Anahtar", "Internet", "Klima No"
                                ].map((h, i) => (
                                    <th key={i} className="px-2 py-2 border-r border-gray-300 dark:border-zinc-700 min-w-[80px]">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                            <tr className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-300 dark:border-zinc-700">
                                {Array.from({ length: 18 }).map((_, i) => (
                                    <th key={i} className="p-1 border-r border-gray-200 dark:border-zinc-700">
                                        {i < 8 ? (
                                            <div className="relative">
                                                <input type="text" className="w-full border border-gray-300 dark:border-zinc-600 rounded px-1 py-0.5 font-normal focus:outline-none focus:border-blue-400 dark:bg-zinc-900" />
                                            </div>
                                        ) : null}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                            {filteredData.map((row, i) => (
                                <tr
                                    key={row.id}
                                    onClick={() => handleEdit(row)}
                                    className={cn(
                                        "hover:bg-blue-50 dark:hover:bg-blue-900/10 cursor-pointer transition-colors",
                                        // row.id === "201" ? "bg-blue-100/50" : "" // Removed simple logic
                                    )}
                                >
                                    <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">{row.number}</td>
                                    <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700 text-green-600">{row.status}</td>
                                    <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">{row.type}</td>
                                    <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">{row.bedType}</td>
                                    <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">{row.floor}</td>
                                    <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">{row.location}</td>
                                    <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">{row.view}</td>
                                    <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">{row.description}</td>
                                    <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700 text-center">
                                        <input type="checkbox" checked={row.isDeleted} readOnly className="rounded" />
                                    </td>
                                    <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700 text-center">
                                        <input type="checkbox" checked={row.isPassive} readOnly className="rounded" />
                                    </td>
                                    <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">{row.keyNo}</td>
                                    <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">{row.connectedRooms}</td>
                                    <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">{row.features}</td>
                                    <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">{row.phoneNo}</td>
                                    <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">{row.paidTv}</td>
                                    <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">{row.key}</td>
                                    <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">{row.internet}</td>
                                    <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">{row.acNo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>

            <RoomDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                initialData={selectedRoom}
                onSave={handleSave}
            />
        </div>
    );
}

function ToolbarButton({ icon: Icon, className, onClick, disabled }: { icon: any, className?: string, onClick?: () => void, disabled?: boolean }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "p-1.5 rounded text-gray-600 dark:text-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                !disabled && "hover:bg-gray-200 dark:hover:bg-zinc-700",
                className
            )}>
            <Icon size={14} />
        </button>
    )
}
