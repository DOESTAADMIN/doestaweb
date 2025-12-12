"use client";

import React, { useState } from 'react';
import {
    FaPlus, FaPen, FaTrash, FaPrint, FaSyncAlt, FaFileExcel,
    FaBars, FaQuestionCircle, FaTimes, FaCheck, FaFilter, FaEquals, FaSearch
} from 'react-icons/fa';
import { cn } from "@/lib/utils";

// Mock Data Interfaces
interface BedType {
    id: number;
    systemBedType: string; // Enum-like: 'Double', 'French', 'King', etc.
    name: string;
    isDisabled: boolean;
    isDeleted: boolean;
}

// Initial Mock Data
const API_URL = "http://localhost:5085/api/bedtypes";
const Tabs = ["Aktif", "Pasif", "Silindi"];
const SYSTEM_BED_TYPES = ["Twin", "French", "Double", "Queen", "King"];

export default function BedTypesPage() {
    const [activeTab, setActiveTab] = useState("Aktif");
    const [data, setData] = useState<BedType[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<BedType>>({});

    // Filtering logic (client side for now)
    const filteredData = data.filter(item => {
        if (activeTab === "Aktif") return !item.isDeleted && !item.isDisabled;
        if (activeTab === "Pasif") return !item.isDeleted && item.isDisabled;
        if (activeTab === "Silindi") return item.isDeleted;
        return true;
    });

    React.useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch(API_URL);
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (error) {
            console.error("Failed to fetch bed types", error);
        }
    };

    // Handlers
    const handleAdd = async () => {
        const newRow = {
            systemBedType: "Twin",
            name: "Yeni Yatak Tipi",
            isDisabled: false,
            isDeleted: false
        };
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRow)
            });
            if (res.ok) {
                const created = await res.json();
                setData([created, ...data]);
                startEditing(created);
            }
        } catch (error) {
            console.error("Error creating bed type", error);
        }
    };

    const startEditing = (row: BedType) => {
        setEditingId(row.id);
        setEditForm({ ...row });
    };

    const handleSave = async () => {
        if (!editingId || !editForm) return;

        try {
            const res = await fetch(`${API_URL}/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });

            if (res.ok || res.status === 204) {
                setData(prev => prev.map(row =>
                    row.id === editingId ? { ...row, ...editForm } as BedType : row
                ));
                setEditingId(null);
                setEditForm({});
            }
        } catch (error) {
            console.error("Error updating bed type", error);
        }
    };

    const handleDelete = async () => {
        if (editingId) {
            try {
                const res = await fetch(`${API_URL}/${editingId}`, { method: 'DELETE' });
                if (res.ok || res.status === 204) {
                    setData(prev => prev.filter(r => r.id !== editingId));
                    setEditingId(null);
                }
            } catch (error) {
                console.error("Error deleting bed type", error);
            }
        }
    };

    const handleInputChange = (field: keyof BedType, value: any) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    const handleRowClick = (row: BedType) => {
        if (editingId === row.id) return;
        startEditing(row);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50 dark:bg-black/20 p-4 relative overflow-y-auto">
            {/* Header Container */}
            <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-t-lg border border-gray-200 dark:border-zinc-800 flex flex-col h-full">
                {/* Title & Top controls */}
                <div className="flex justify-between items-center p-3 border-b border-gray-100 dark:border-zinc-800 shrink-0">
                    <h1 className="text-xl font-bold text-blue-900 dark:text-blue-400 flex items-center gap-2">
                        <FaQuestionCircle className="text-blue-900 dark:text-blue-400" /> Yatak Tipi
                    </h1>
                    <button className="text-red-300 hover:text-red-500"><FaTimes size={18} /></button>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-1 p-2 border-b border-gray-100 dark:border-zinc-800 overflow-x-auto shrink-0 bg-gray-50/50 dark:bg-zinc-900">
                    <ToolbarButton icon={FaPlus} className="text-blue-600" onClick={handleAdd} />
                    <ToolbarButton icon={FaPen} onClick={() => { }} disabled={!editingId} /> {/* Edit happens on click mostly */}
                    <ToolbarButton icon={FaTrash} className="text-red-500" onClick={handleDelete} />
                    <div className="w-px h-5 bg-gray-300 dark:bg-zinc-700 mx-1"></div>
                    <ToolbarButton icon={FaCheck} className="text-green-600" onClick={handleSave} />
                    <ToolbarButton icon={FaPrint} />
                    <ToolbarButton icon={FaSyncAlt} />
                    <ToolbarButton icon={FaFileExcel} />
                    <div className="w-px h-5 bg-gray-300 dark:bg-zinc-700 mx-1"></div>
                    <ToolbarButton icon={FaFilter} />
                    <ToolbarButton icon={FaEquals} />

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
                    <table className="w-full text-xs text-left border-collapse">
                        <thead className="bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 font-semibold border-b border-gray-300 dark:border-zinc-700 sticky top-0 z-20 shadow-sm">
                            <tr>
                                <th className="px-2 py-2 border-r border-gray-300 dark:border-zinc-700 w-1/4">Sistem Yatak Tipi</th>
                                <th className="px-2 py-2 border-r border-gray-300 dark:border-zinc-700 w-1/2">Yatak Tipi</th>
                                <th className="px-2 py-2 border-r border-gray-300 dark:border-zinc-700 w-24 text-center">ISDISABLED</th>
                                <th className="px-2 py-2 border-gray-300 dark:border-zinc-700 w-24 text-center">ISDELETED</th>
                            </tr>
                            {/* Filter Row Placeholder - matching generic grid look */}
                            <tr className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-300 dark:border-zinc-700">
                                <th className="p-1 border-r border-gray-200 dark:border-zinc-700">
                                    <div className="relative">
                                        <input type="text" className="w-full border border-gray-300 dark:border-zinc-600 rounded px-1 py-0.5 font-normal focus:outline-none focus:border-blue-400 dark:bg-zinc-900" />
                                        <FaSearch className="absolute right-1 top-1.5 text-gray-400" size={10} />
                                    </div>
                                </th>
                                <th className="p-1 border-r border-gray-200 dark:border-zinc-700">
                                    <div className="relative">
                                        <input type="text" className="w-full border border-gray-300 dark:border-zinc-600 rounded px-1 py-0.5 font-normal focus:outline-none focus:border-blue-400 dark:bg-zinc-900" />
                                        <FaSearch className="absolute right-1 top-1.5 text-gray-400" size={10} />
                                    </div>
                                </th>
                                <th className="p-1 border-r border-gray-200 dark:border-zinc-700"></th>
                                <th className="p-1"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-gray-400">No Rows To Show</td>
                                </tr>
                            ) : (
                                filteredData.map((row) => {
                                    const isEditing = editingId === row.id;
                                    return (
                                        <tr
                                            key={row.id}
                                            onClick={() => handleRowClick(row)}
                                            className={cn(
                                                "cursor-pointer transition-colors",
                                                isEditing
                                                    ? "bg-blue-100 dark:bg-blue-900/30"
                                                    : "hover:bg-blue-50 dark:hover:bg-blue-900/10 focus:bg-blue-100" // Selection color
                                            )}
                                        >
                                            <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">
                                                {isEditing ? (
                                                    <select
                                                        className="w-full border border-blue-400 rounded px-1 py-0.5 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        value={editForm.systemBedType}
                                                        onChange={(e) => handleInputChange('systemBedType', e.target.value)}
                                                        autoFocus
                                                    >
                                                        {SYSTEM_BED_TYPES.map(type => (
                                                            <option key={type} value={type}>{type}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <span className="px-1">{row.systemBedType}</span>
                                                )}
                                            </td>
                                            <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">
                                                {isEditing ? (
                                                    <input
                                                        type="text"
                                                        className="w-full border border-blue-400 rounded px-1 py-0.5 bg-white dark:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        value={editForm.name || ""}
                                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                                    />
                                                ) : (
                                                    <span className="px-1">{row.name}</span>
                                                )}
                                            </td>
                                            <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700 text-center">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300"
                                                    checked={isEditing ? editForm.isDisabled : row.isDisabled}
                                                    onChange={(e) => isEditing && handleInputChange('isDisabled', e.target.checked)}
                                                    disabled={!isEditing}
                                                />
                                            </td>
                                            <td className="px-2 py-1 border-gray-200 dark:border-zinc-700 text-center">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-gray-300"
                                                    checked={isEditing ? editForm.isDeleted : row.isDeleted}
                                                    onChange={(e) => isEditing && handleInputChange('isDeleted', e.target.checked)}
                                                    disabled={!isEditing}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Status */}
                {/* Similar to RoomTypes header but at bottom? Or just keep pure utility. Nothing special shown in screenshot other than Toplam: 0 which I put in toolbar. */}
            </div>
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
