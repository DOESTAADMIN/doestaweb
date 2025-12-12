"use client";

import React, { useState } from 'react';
import {
    FaPlus, FaPen, FaTrash, FaPrint, FaSyncAlt, FaFileExcel,
    FaBars, FaQuestionCircle, FaTimes, FaBolt
} from 'react-icons/fa';
import { cn } from "@/lib/utils";
import BoardTypeDialog from "@/components/settings/BoardTypeDialog";
import { toast } from "sonner";

const API_URL = "http://localhost:5085/api/boardtypes";

const Tabs = ["Aktif", "Pasif", "Hepsi"];

export default function BoardTypesPage() {
    const [activeTab, setActiveTab] = useState("Aktif");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);

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
            console.error(error);
        }
    };

    const handleSave = async (formData: any) => {
        const itemData = { ...formData, id: formData.id || 0 };
        try {
            if (itemData.id) {
                // UPDATE
                const res = await fetch(`${API_URL}/${itemData.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(itemData)
                });
                if (res.ok || res.status === 204) {
                    setIsDialogOpen(false);
                    fetchData();
                    toast.success("Pansiyon tipi güncellendi.");
                } else {
                    toast.error("Güncelleme başarısız.");
                }
            } else {
                // CREATE
                const res = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(itemData)
                });
                if (res.ok) {
                    setIsDialogOpen(false);
                    fetchData();
                    toast.success("Yeni pansiyon tipi eklendi.");
                } else {
                    toast.error("Kayıt oluşturulamadı.");
                }
            }
        } catch (err) {
            console.error("Error saving", err);
            toast.error("Hata oluştu.");
        }
    };

    const handleEdit = (item: any) => {
        setSelectedItem(item);
        setIsDialogOpen(true);
    };

    const handleAdd = () => {
        setSelectedItem({});
        setIsDialogOpen(true);
    };

    // Filter
    const filteredData = data.filter(item => {
        if (activeTab === "Aktif") return !item.isPassive;
        if (activeTab === "Pasif") return item.isPassive;
        return true;
    });

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50 dark:bg-black/20 p-4 relative overflow-y-auto">
            {/* Header Container */}
            <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-t-lg border border-gray-200 dark:border-zinc-800 flex flex-col h-full">
                {/* Title & Top controls */}
                <div className="flex justify-between items-center p-3 border-b border-gray-100 dark:border-zinc-800 shrink-0">
                    <h1 className="text-xl font-bold text-blue-900 dark:text-blue-400 flex items-center gap-2">
                        <FaQuestionCircle className="text-blue-900 dark:text-blue-400" /> Pansiyon Tipleri
                    </h1>
                    <button className="text-red-300 hover:text-red-500"><FaTimes size={18} /></button>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-1 p-2 border-b border-gray-100 dark:border-zinc-800 overflow-x-auto shrink-0 bg-gray-50/50 dark:bg-zinc-900">
                    <ToolbarButton icon={FaPlus} className="text-blue-600" onClick={handleAdd} />
                    <ToolbarButton icon={FaPen} onClick={() => selectedItem && handleEdit(selectedItem)} />
                    <ToolbarButton icon={FaTrash} className="text-red-500" />
                    <div className="w-px h-5 bg-gray-300 dark:bg-zinc-700 mx-1"></div>
                    <ToolbarButton icon={FaPrint} />
                    <ToolbarButton icon={FaSyncAlt} onClick={fetchData} />
                    <ToolbarButton icon={FaFileExcel} />
                    <ToolbarButton icon={FaBars} />
                    <div className="w-px h-5 bg-gray-300 dark:bg-zinc-700 mx-1"></div>
                    <ToolbarButton icon={FaBolt} />

                    <div className="flex-1"></div>
                    <span className="text-xs text-gray-500 font-medium px-2">Toplam: {data.length}</span>
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
                                    "Pan Tipi", "Pansiyon Tipi Adı", "Sys Pan Tipi", "Ytş Ekstra Ücreti",
                                    "B.Çck Ekstra Ücreti", "K.Çck Ekstra Ücreti", "Bbk Ekstra Ücreti", "Açıklama", "B2C'de Kapat"
                                ].map((h, i) => (
                                    <th key={i} className="px-2 py-2 border-r border-gray-300 dark:border-zinc-700 min-w-[80px]">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                            {/* Filter Row */}
                            <tr className="bg-gray-50 dark:bg-zinc-800/50 border-b border-gray-300 dark:border-zinc-700">
                                {Array.from({ length: 9 }).map((_, i) => (
                                    <th key={i} className="p-1 border-r border-gray-200 dark:border-zinc-700">
                                        {i === 8 ? (
                                            <div className="text-center"><input type="checkbox" /></div>
                                        ) : (
                                            <div className="relative">
                                                <input type="text" className="w-full border border-gray-300 dark:border-zinc-600 rounded px-1 py-0.5 font-normal focus:outline-none focus:border-blue-400 dark:bg-zinc-900" />
                                            </div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                            {filteredData.map((row) => (
                                <tr
                                    key={row.id}
                                    className="hover:bg-blue-50 dark:hover:bg-blue-900/10 cursor-pointer transition-colors"
                                    onClick={() => handleEdit(row)}
                                >
                                    <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700 bg-blue-50/50">{row.code}</td>
                                    <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700 font-medium">{row.name}</td>
                                    <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">{row.sysType}</td>
                                    <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700 text-right">{row.extraAdult}</td>
                                    <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700 text-right">{row.extraBigChild}</td>
                                    <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700 text-right">{row.extraSmallChild}</td>
                                    <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700 text-right">{row.extraBaby}</td>
                                    <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">{row.description}</td>
                                    <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700 text-center">
                                        <input type="checkbox" checked={row.closeInB2C} readOnly className="rounded" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <BoardTypeDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                initialData={selectedItem}
                onSave={handleSave}
            />
        </div>
    );
}

function ToolbarButton({ icon: Icon, className, onClick }: { icon: any, className?: string, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "p-1.5 rounded text-gray-600 dark:text-gray-400 transition-colors hover:bg-gray-200 dark:hover:bg-zinc-700",
                className
            )}>
            <Icon size={14} />
        </button>
    )
}
