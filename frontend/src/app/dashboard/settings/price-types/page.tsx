"use client";

import React, { useState, useEffect } from 'react';
import {
    FaPlus, FaPen, FaTrash, FaPrint, FaSyncAlt, FaFileExcel,
    FaBars, FaQuestionCircle, FaTimes, FaBolt
} from 'react-icons/fa';
import { cn } from "@/lib/utils";
import PriceTypeDialog from "@/components/settings/PriceTypeDialog";
import { toast } from "sonner";

const API_URL = "http://localhost:5085/api/pricetypes";

// Helper Interface
interface PriceType {
    id: number;
    code: string;
    isRefundable: boolean;
    prepayRatio: number; // decimal in backend, number in JS
    priceFactor: number;
    minStay: number;
    maxStay: number;
    minDaysBefore: number;
    maxDaysBefore: number;
    isDeleted: boolean;
}

const Tabs = ["Hepsi"];

export default function PriceTypesPage() {
    const [activeTab, setActiveTab] = useState("Hepsi");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [data, setData] = useState<PriceType[]>([]);
    const [selectedItem, setSelectedItem] = useState<any | null>(null);

    useEffect(() => {
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
            console.error("Failed to fetch price types", error);
        }
    };

    const handleSave = async (formData: any) => {
        const itemData = {
            ...formData,
            id: formData.id || 0,
            prepayRatio: Number(formData.prepayRatio || 0),
            priceFactor: Number(formData.priceFactor || 1),
            minStay: Number(formData.minStay || 0),
            maxStay: Number(formData.maxStay || 0),
            minDaysBefore: Number(formData.minDaysBefore || 0),
            maxDaysBefore: Number(formData.maxDaysBefore || 0)
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
                    toast.success("Fiyat tipi güncellendi.");
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
                    toast.success("Yeni fiyat tipi oluşturuldu.");
                } else {
                    toast.error("Kayıt oluşturulamadı.");
                }
            }
        } catch (err) {
            console.error("Error saving price type", err);
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

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50 dark:bg-black/20 p-4 relative overflow-y-auto">
            {/* Header Container */}
            <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-t-lg border border-gray-200 dark:border-zinc-800">
                {/* Title & Top controls */}
                <div className="flex justify-between items-center p-3 border-b border-gray-100 dark:border-zinc-800">
                    <h1 className="text-xl font-bold text-blue-900 dark:text-blue-400 flex items-center gap-2">
                        <FaQuestionCircle className="text-blue-900 dark:text-blue-400" /> Fiyat Tipleri
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
                    <div className="flex-1"></div>
                    <span className="text-xs text-gray-500 font-medium px-2">Toplam: {data.length}</span>
                </div>

                {/* Grid */}
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 font-semibold border-b border-gray-200 dark:border-zinc-700">
                            <tr>
                                {[
                                    "ID", "Kod", "İade Edilebilir", "Ön Ödeme %", "Fiyat Faktörü",
                                    "Min Kalış", "Max Kalış"
                                ].map((h, i) => (
                                    <th key={i} className="px-3 py-2 border-r border-gray-200 dark:border-zinc-700 min-w-[80px] whitespace-nowrap">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800 bg-white dark:bg-zinc-900">
                            {data.map((row, i) => (
                                <tr
                                    key={i}
                                    className="hover:bg-blue-50 dark:hover:bg-blue-900/10 cursor-pointer"
                                    onClick={() => handleEdit(row)}
                                >
                                    <td className="px-3 py-2 border-r border-gray-100 dark:border-zinc-800 text-gray-500">{row.id}</td>
                                    <td className="px-3 py-2 border-r border-gray-100 dark:border-zinc-800 font-medium">{row.code}</td>
                                    <td className="px-3 py-2 border-r border-gray-100 dark:border-zinc-800 text-center">{row.isRefundable ? "Evet" : "Hayır"}</td>
                                    <td className="px-3 py-2 border-r border-gray-100 dark:border-zinc-800 text-right">{row.prepayRatio}</td>
                                    <td className="px-3 py-2 border-r border-gray-100 dark:border-zinc-800 text-right">{row.priceFactor}</td>
                                    <td className="px-3 py-2 border-r border-gray-100 dark:border-zinc-800 text-right">{row.minStay}</td>
                                    <td className="px-3 py-2 border-r border-gray-100 dark:border-zinc-800 text-right">{row.maxStay}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <PriceTypeDialog
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
                "p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded text-gray-600 dark:text-gray-400 transition-colors",
                className
            )}>
            <Icon size={14} />
        </button>
    )
}
