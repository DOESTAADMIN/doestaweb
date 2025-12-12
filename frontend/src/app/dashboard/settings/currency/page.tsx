"use client";

import React, { useState } from 'react';
import {
    FaPlus, FaPen, FaTrash, FaPrint, FaSyncAlt, FaFileExcel,
    FaBars, FaQuestionCircle, FaTimes, FaSearch
} from 'react-icons/fa';
import { cn } from "@/lib/utils";

import { toast } from "sonner";

const API_URL = "http://localhost:5085/api/currencies";

export default function CurrencyPage() {
    const [data, setData] = useState<any[]>([]);
    const [editingCode, setEditingCode] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<any>({});

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

    const handleAdd = async () => {
        const newCurrency = {
            code: "NEW" + Math.floor(Math.random() * 100),
            description: "New Currency",
            closeInB2C: false
        };
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCurrency)
            });
            if (res.ok) {
                const created = await res.json();
                setData([...data, created]);
                startEditing(created);
            }
            else if (res.status === 409) {
                toast.error("Para birimi kodu zaten mevcut.");
            }
        } catch (err) { console.error(err); }
    };

    const startEditing = (row: any) => {
        setEditingCode(row.code);
        setEditForm({ ...row });
    };

    const handleSave = async () => {
        if (!editingCode) return;
        try {
            // In current API implementation, key is Code which is string.
            // If we change code, we technically need delete+create or key change support. 
            // For simplicity assuming code is key and immutable or we handle it carefully.
            // Here we just PUT to existing code.
            const res = await fetch(`${API_URL}/${editingCode}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });
            if (res.ok || res.status === 204) {
                setData(prev => prev.map(p => p.code === editingCode ? editForm : p));
                setEditingCode(null);
            }
        } catch (err) { console.error(err); }
    };

    const handleDelete = async () => {
        if (!editingCode) return;
        try {
            const res = await fetch(`${API_URL}/${editingCode}`, { method: 'DELETE' });
            if (res.ok || res.status === 204) {
                setData(prev => prev.filter(p => p.code !== editingCode));
                setEditingCode(null);
            }
        } catch (err) { console.error(err); }
    };

    const handleRowClick = (row: any) => {
        if (editingCode && editingCode !== row.code) {
            // switch
        }
        startEditing(row);
    };

    const handleInputChange = (field: string, value: any) => {
        setEditForm((prev: any) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50 dark:bg-black/20 p-4 relative overflow-y-auto">
            {/* Header Container */}
            <div className="bg-white dark:bg-zinc-900 shadow-sm rounded-t-lg border border-gray-200 dark:border-zinc-800 flex flex-col h-full">
                {/* Title & Top controls */}
                <div className="flex justify-between items-center p-3 border-b border-gray-100 dark:border-zinc-800 shrink-0">
                    <h1 className="text-xl font-bold text-blue-900 dark:text-blue-400 flex items-center gap-2">
                        <FaQuestionCircle className="text-blue-900 dark:text-blue-400" /> Döviz Tanımları
                    </h1>
                    <button className="text-red-300 hover:text-red-500"><FaTimes size={18} /></button>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-1 p-2 border-b border-gray-100 dark:border-zinc-800 overflow-x-auto shrink-0 bg-gray-50/50 dark:bg-zinc-900">
                    <ToolbarButton icon={FaPlus} className="text-blue-600" onClick={handleAdd} />
                    <ToolbarButton icon={FaPen} disabled={!editingCode} />
                    <ToolbarButton icon={FaTrash} className="text-red-500" onClick={handleDelete} />
                    <div className="w-px h-5 bg-gray-300 dark:bg-zinc-700 mx-1"></div>
                    <ToolbarButton icon={FaSyncAlt} onClick={() => { setEditingCode(null); handleSave(); }} title="Save" />
                    <div className="flex-1"></div>
                    <span className="text-xs text-gray-500 font-medium px-2">Toplam: {data.length}</span>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-auto bg-white dark:bg-zinc-900 relative">
                    <table className="w-full text-xs text-left border-collapse whitespace-nowrap">
                        <thead className="bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 font-semibold border-b border-gray-300 dark:border-zinc-700 sticky top-0 z-20 shadow-sm">
                            <tr>
                                <th className="px-2 py-2 border-r border-gray-300 dark:border-zinc-700 w-1/4">Kod</th>
                                <th className="px-2 py-2 border-r border-gray-300 dark:border-zinc-700 w-1/2">Adı</th>
                                <th className="px-2 py-2 border-r border-gray-300 dark:border-zinc-700 w-1/4 text-center">B2C'de Kapat</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                            {data.map((row) => {
                                const isEditing = editingCode === row.code;
                                return (
                                    <tr
                                        key={row.code}
                                        onClick={() => handleRowClick(row)}
                                        className={cn(
                                            "cursor-pointer transition-colors",
                                            isEditing ? "bg-blue-100 dark:bg-blue-900/30" : "hover:bg-blue-50 dark:hover:bg-blue-900/10"
                                        )}
                                    >
                                        <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">
                                            {isEditing ? <input className="w-full bg-transparent border-b border-blue-400 outline-none" value={editForm.code} onChange={e => handleInputChange("code", e.target.value)} /> : row.code}
                                        </td>
                                        <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700">
                                            {isEditing ? <input className="w-full bg-transparent border-b border-blue-400 outline-none" value={editForm.description} onChange={e => handleInputChange("description", e.target.value)} /> : row.description}
                                        </td>
                                        <td className="px-2 py-1 border-r border-gray-200 dark:border-zinc-700 text-center">
                                            <input type="checkbox" checked={isEditing ? editForm.closeInB2C : row.closeInB2C} disabled={!isEditing} onChange={e => handleInputChange("closeInB2C", e.target.checked)} className="rounded" />
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function ToolbarButton({ icon: Icon, className, onClick, disabled, title }: { icon: any, className?: string, onClick?: () => void, disabled?: boolean, title?: string }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={cn(
                "p-1.5 rounded text-gray-600 dark:text-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                !disabled && "hover:bg-gray-200 dark:hover:bg-zinc-700",
                className
            )}>
            <Icon size={14} />
        </button>
    )
}
