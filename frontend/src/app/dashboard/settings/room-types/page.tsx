"use client";

import React, { useState } from 'react';
import {
    FaPlus, FaPen, FaTrash, FaPrint, FaSyncAlt, FaFileExcel,
    FaBars, FaQuestionCircle, FaTimes
} from 'react-icons/fa';
import { cn } from "@/lib/utils";
import RoomTypeDialog from "@/components/settings/RoomTypeDialog";
import { toast } from "sonner";

export default function RoomTypesPage() {
    const [activeTab, setActiveTab] = useState("Aktif");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);

    const API_URL = "http://localhost:5085/api/roomtypes";

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
        const itemData = {
            ...formData,
            id: formData.id || 0,
            // Ensure string/number conversions if needed, backend expects decimals/ints
            count: Number(formData.count || 0),
            sngFactor: Number(formData.sngFactor || 1),
            dblFactor: Number(formData.dblFactor || 1),
            trpFactor: Number(formData.trpFactor || 1),
            quadFactor: Number(formData.quadFactor || 1),
            extraBedCoef: Number(formData.extraBedCoef || 0),
            maxBed: Number(formData.maxBed || 2),
            workLoad: Number(formData.workLoad || 1)
        };

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
                    toast.success("Oda tipi başarıyla güncellendi.");
                } else {
                    toast.error("Güncelleme başarısız oldu.");
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
                    toast.success("Yeni oda tipi oluşturuldu.");
                } else {
                    toast.error("Kayıt oluşturulamadı.");
                }
            }
        } catch (err) {
            console.error("Error saving room type", err);
            toast.error("Bir hata oluştu.");
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

    const filteredData = data.filter(item => {
        if (activeTab === "Aktif") return !item.isDeleted && !item.isPassive;
        if (activeTab === "Pasif") return item.isPassive;
        if (activeTab === "Silindi") return item.isDeleted;
        return true;
    });

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50 dark:bg-black/20 p-4 relative overflow-y-auto">
            {/* Header Container */}
            <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-t-lg border border-gray-200 dark:border-zinc-800">
                {/* Title & Top controls */}
                <div className="flex justify-between items-center p-3 border-b border-gray-100 dark:border-zinc-800">
                    <h1 className="text-xl font-bold text-blue-900 dark:text-blue-400 flex items-center gap-2">
                        <FaQuestionCircle className="text-blue-900 dark:text-blue-400" /> Oda Tipleri
                    </h1>
                    <button className="text-red-300 hover:text-red-500"><FaTimes size={18} /></button>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-1 p-2 border-b border-gray-100 dark:border-zinc-800 overflow-x-auto">
                    <ToolbarButton icon={FaPlus} className="text-blue-600" onClick={handleAdd} />
                    <ToolbarButton icon={FaPen} onClick={() => selectedItem && handleEdit(selectedItem)} />
                    <ToolbarButton icon={FaTrash} className="text-red-500" />
                    <div className="w-px h-5 bg-gray-300 dark:bg-zinc-700 mx-1"></div>
                    <ToolbarButton icon={FaPrint} />
                    <ToolbarButton icon={FaSyncAlt} onClick={fetchData} />
                    <ToolbarButton icon={FaFileExcel} />
                    <ToolbarButton icon={FaBars} />

                    <div className="flex-1"></div>
                    <span className="text-xs text-gray-500 font-medium px-2">Toplam: {filteredData.length}</span>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-100 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 px-2 pt-1 gap-1">
                    {Tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-6 py-2 text-xs font-bold transition-colors relative top-px",
                                activeTab === tab
                                    ? "bg-white dark:bg-zinc-900 text-gray-800 dark:text-white border border-b-0 border-gray-300 dark:border-zinc-700 rounded-t shadow-sm"
                                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 border border-transparent"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 font-semibold border-b border-gray-200 dark:border-zinc-700">
                            <tr>
                                {[
                                    "ID", "Oda Tipi Adı", "Oda Tipi Grubu", "Oda Tipi Kodu", "Oda Sayısı",
                                    "Sng Faktörü", "Dbl Faktörü", "Trp Faktörü", "Quad Faktörü",
                                    "Ekstra Yatak Katsayısı", "Max Yatak", "İş Yükü Oranı"
                                ].map((h, i) => (
                                    <th key={i} className="px-3 py-2 border-r border-gray-200 dark:border-zinc-700 min-w-[80px] whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                            {filteredData.map((row, i) => (
                                <tr
                                    key={i}
                                    className="hover:bg-blue-50 dark:hover:bg-blue-900/10 cursor-pointer"
                                    onClick={() => handleEdit(row)}
                                >
                                    <td className="px-3 py-2 border-r border-gray-100 dark:border-zinc-800 text-gray-500">{row.id}</td>
                                    <td className="px-3 py-2 border-r border-gray-100 dark:border-zinc-800 font-medium">{row.name}</td>
                                    <td className="px-3 py-2 border-r border-gray-100 dark:border-zinc-800">{row.group}</td>
                                    <td className="px-3 py-2 border-r border-gray-100 dark:border-zinc-800">{row.code}</td>
                                    <td className="px-3 py-2 border-r border-gray-100 dark:border-zinc-800 text-center">{row.count}</td>
                                    <td className="px-3 py-2 border-r border-gray-100 dark:border-zinc-800 text-right">{row.sngFactor}</td>
                                    <td className="px-3 py-2 border-r border-gray-100 dark:border-zinc-800 text-right">{row.dblFactor}</td>
                                    <td className="px-3 py-2 border-r border-gray-100 dark:border-zinc-800 text-right">{row.trpFactor}</td>
                                    <td className="px-3 py-2 border-r border-gray-100 dark:border-zinc-800 text-right">{row.quadFactor}</td>
                                    <td className="px-3 py-2 border-r border-gray-100 dark:border-zinc-800 text-right">{row.extraBedCoef}</td>
                                    <td className="px-3 py-2 border-r border-gray-100 dark:border-zinc-800 text-right">{row.maxBed}</td>
                                    <td className="px-3 py-2 border-r border-gray-100 dark:border-zinc-800 text-right">{row.workLoad}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer Pagination */}
                <div className="p-1 border-t border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex justify-center border-b rounded-b-lg">
                    <div className="border border-gray-300 px-2 text-xs font-bold text-gray-600">10</div>
                </div>
            </div>

            <RoomTypeDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                initialData={selectedItem}
                onSave={handleSave}
            />
        </div>
    );
}

const Tabs = ["Aktif", "Pasif", "Silindi", "Hepsi"];

function ToolbarButton({ icon: Icon, className, onClick }: { icon: any, className?: string, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded text-gray-600 dark:text-gray-400 transition-colors",
                className
            )}>
            <Icon size={14} />
        </button>
    )
}
