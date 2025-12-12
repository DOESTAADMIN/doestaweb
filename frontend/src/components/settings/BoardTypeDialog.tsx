"use client";

import React, { useState, useEffect } from 'react';
import { FaTimes, FaCheck, FaHistory, FaPlus, FaCopy, FaPrint, FaSave, FaArrowRight, FaArrowLeft, FaTrash, FaPen } from 'react-icons/fa';
import { cn } from "@/lib/utils";

interface BoardTypeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
    onSave: (data: any) => void;
}

export default function BoardTypeDialog({ isOpen, onClose, initialData, onSave }: BoardTypeDialogProps) {
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        if (initialData) setFormData({ ...initialData });
        else setFormData({});
    }, [initialData, isOpen]);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-4xl rounded-lg shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-zinc-800">
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-gray-500 text-sm border border-gray-300 px-1 rounded">TR</span>
                        <h2 className="text-xl font-bold text-blue-900 dark:text-blue-400">Pansiyon Tipleri</h2>
                        <div className="flex gap-1 ml-4">
                            <button className="text-gray-400 hover:text-gray-600"><FaHistory size={14} /></button>
                            <button className="text-gray-400 hover:text-gray-600"><FaArrowLeft size={14} /></button>
                            <button className="text-gray-400 hover:text-gray-600"><FaPlus size={14} onClick={() => setFormData({})} /></button>
                            <button className="text-gray-400 hover:text-gray-600"><FaCopy size={14} /></button>
                            <button className="text-gray-400 hover:text-gray-600"><FaPrint size={14} /></button>
                            <button className="text-gray-400 hover:text-gray-600" onClick={handleSave}><FaSave size={14} /></button>
                            <button className="text-gray-400 hover:text-gray-600"><FaArrowRight size={14} /></button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleSave} className="text-blue-600 hover:text-blue-700">
                            <FaCheck size={20} />
                        </button>
                        <button onClick={onClose} className="text-red-500 hover:text-red-600">
                            <FaTimes size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 bg-white dark:bg-zinc-900">

                    {/* Top Form */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
                        <FormInput label="Pansiyon Tipi Adı" value={formData.name || ""} onChange={v => handleChange("name", v)} />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="font-bold text-sm pt-6">{formData.code}</div>
                            <FormInput label="Sistem Pansiyon Tipi" value={formData.sysType || ""} onChange={v => handleChange("sysType", v)} />
                        </div>

                        <FormInput label="Ytş Ekstra Ücreti" type="number" value={formData.extraAdult || 0} onChange={v => handleChange("extraAdult", Number(v))} />
                        <FormInput label="B.Çck Ekstra Ücret" type="number" value={formData.extraBigChild || 0} onChange={v => handleChange("extraBigChild", Number(v))} />
                        <FormInput label="K.Çck Ekstra Ücret" type="number" value={formData.extraSmallChild || 0} onChange={v => handleChange("extraSmallChild", Number(v))} />
                        <FormInput label="Bbk Ekstra Ücret" type="number" value={formData.extraBaby || 0} onChange={v => handleChange("extraBaby", Number(v))} />

                        <FormInput label="CRM Kod" />
                        <FormInput label="PMS Kodu" />
                        <div className="col-span-2">
                            <FormInput label="Açıklama" value={formData.description || ""} onChange={v => handleChange("description", v)} />
                        </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="flex gap-6 mb-6">
                        <Checkbox label="B2C'de Kapat" checked={formData.closeInB2C || false} onChange={c => handleChange("closeInB2C", c)} />
                        <Checkbox label="Pasif" checked={formData.isPassive || false} onChange={c => handleChange("isPassive", c)} />
                        <Checkbox label="Dış sync devre dışı" />
                        <Checkbox label="Skip On Daily Prices #" />
                    </div>

                    {/* Sub-Section: Pansiyon Ayrımı (Simplified for now - can escalate if needed) */}
                    <div className="border border-gray-200 dark:border-zinc-700 rounded-lg overflow-hidden opacity-50 pointer-events-none">
                        <div className="p-2 bg-gray-50 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
                            <h3>Pansiyon Ayrımı (Not Implemented)</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FormInput({ label, placeholder, value, onChange, type = "text" }: any) {
    return (
        <div className="relative pt-4">
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={e => onChange && onChange(e.target.value)}
                className="peer w-full border-b border-gray-300 dark:border-zinc-700 bg-transparent py-1 text-sm focus:border-blue-500 outline-none transition-colors placeholder-transparent text-gray-900 dark:text-white"
            />
            <label className="absolute left-0 top-0 text-xs text-gray-500 dark:text-gray-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-0 peer-focus:text-xs">
                {label}
            </label>
        </div>
    )
}

function Checkbox({ label, checked, onChange }: any) {
    return (
        <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded border-gray-300 dark:border-zinc-600" checked={checked} onChange={e => onChange && onChange(e.target.checked)} />
            <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
        </label>
    )
}

// Unused toolbar removed for brevity or can be kept if needed
function ToolbarButton({ icon: Icon, className, onClick }: { icon: any, className?: string, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "p-1.5 rounded text-gray-600 dark:text-gray-400 transition-colors hover:bg-gray-200 dark:hover:bg-zinc-700",
                className
            )}>
            <Icon size={12} />
        </button>
    )
}
