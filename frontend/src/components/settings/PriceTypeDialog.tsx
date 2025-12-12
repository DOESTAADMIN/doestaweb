"use client";

import React, { useState, useEffect } from 'react';
import { FaTimes, FaCheck, FaHistory, FaPlus, FaCopy, FaPrint, FaSave, FaArrowRight, FaArrowLeft, FaTrash } from 'react-icons/fa';
import { cn } from "@/lib/utils";

interface PriceTypeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
    onSave: (data: any) => void;
}

export default function PriceTypeDialog({ isOpen, onClose, initialData, onSave }: PriceTypeDialogProps) {
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        if (initialData) setFormData({ ...initialData });
        else setFormData({});
    }, [initialData, isOpen]);

    const handleChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
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
                        <h2 className="text-xl font-bold text-blue-900 dark:text-blue-400">Fiyat Tipleri</h2>
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
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
                        <FormInput label="Fiyat Tipi Kodu" value={formData.code || ""} onChange={(v: any) => handleChange("code", v)} />

                        <div className="flex items-center pt-4">
                            <Checkbox label="İade Edilebilir" checked={formData.isRefundable || false} onChange={(c: any) => handleChange("isRefundable", c)} />
                        </div>

                        <FormInput label="Ön Ödeme Oranı (%)" type="number" value={formData.prepayRatio || 0} onChange={(v: any) => handleChange("prepayRatio", Number(v))} />
                        <FormInput label="Fiyat Faktörü" type="number" value={formData.priceFactor || 1.0} onChange={(v: any) => handleChange("priceFactor", Number(v))} />

                        <FormInput label="Min. Kalış (Gün)" type="number" value={formData.minStay || 0} onChange={(v: any) => handleChange("minStay", Number(v))} />
                        <FormInput label="Maks. Kalış (Gün)" type="number" value={formData.maxStay || 0} onChange={(v: any) => handleChange("maxStay", Number(v))} />

                        <FormInput label="Girişten Min Gün Önce" type="number" value={formData.minDaysBefore || 0} onChange={(v: any) => handleChange("minDaysBefore", Number(v))} />
                        <FormInput label="Girişten Maks Gün Önce" type="number" value={formData.maxDaysBefore || 0} onChange={(v: any) => handleChange("maxDaysBefore", Number(v))} />
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
