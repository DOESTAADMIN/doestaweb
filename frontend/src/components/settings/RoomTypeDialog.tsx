"use client";

import React, { useState, useEffect } from 'react';
import {
    FaHistory, FaCheck, FaTimes,
    FaCamera, FaArrowLeft, FaArrowRight, FaLock, FaPlus
} from 'react-icons/fa';
import { cn } from "@/lib/utils";

interface RoomTypeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
    onSave: (data: any) => void;
}

export default function RoomTypeDialog({ isOpen, onClose, initialData, onSave }: RoomTypeDialogProps) {
    const [formData, setFormData] = useState<any>({});
    const [activeTab, setActiveTab] = useState("Oda Tipleri");

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData || {
                name: '',
                code: '',
                group: '',
                count: 0,
                sngFactor: 1.00,
                dblFactor: 1.00,
                trpFactor: 1.00,
                quadFactor: 1.00,
                extraBedCoef: 0.00,
                maxBed: 2,
                workLoad: 1.00,
                isPassive: false,
                isDeleted: false
            });
        }
    }, [isOpen, initialData]);

    const handleChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-5xl rounded-lg shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-blue-900 dark:text-blue-400">Oda Tipi</h2>
                        <button className="text-gray-400 hover:text-blue-600"><FaHistory /></button>
                    </div>

                    <div className="flex gap-2 text-gray-400 text-sm items-center">
                        <button><FaArrowLeft /></button>
                        <button><FaPlus /></button>
                        <button><FaLock /></button>
                        <button><FaArrowRight /></button>

                        <button onClick={handleSave} className="text-green-600 hover:text-green-700 ml-4"><FaCheck size={20} /></button>
                        <button onClick={onClose} className="text-red-500 hover:text-red-600"><FaTimes size={20} /></button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-gray-100 dark:bg-zinc-800 flex gap-1 px-2 pt-1 border-b border-gray-200 dark:border-zinc-700">
                    <TabButton active={activeTab === "Oda Tipleri"} onClick={() => setActiveTab("Oda Tipleri")}>Oda Tipleri</TabButton>
                    <TabButton active={activeTab === "Müsaitlik Havuzu"} onClick={() => setActiveTab("Müsaitlik Havuzu")}>Müsaitlik Havuzu</TabButton>
                    <TabButton active={activeTab === "Odalar"} onClick={() => setActiveTab("Odalar")}>Odalar</TabButton>
                    <TabButton active={activeTab === "Bağlantılı Odalar"} onClick={() => setActiveTab("Bağlantılı Odalar")}>Bağlantılı Odalar</TabButton>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-12 gap-6">

                        {/* Left: Image */}
                        <div className="col-span-3">
                            <div className="aspect-square bg-gray-200 dark:bg-zinc-800 rounded flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 dark:border-zinc-700 cursor-pointer">
                                <FaCamera size={64} />
                            </div>
                            <div className="mt-4">
                                <FormInput label="Resim URL" value={formData.imageUrl || ''} onChange={(v) => handleChange('imageUrl', v)} />
                            </div>
                        </div>

                        {/* Right: Main Form */}
                        <div className="col-span-9 space-y-6">
                            {/* Top Identifiers */}
                            <div className="grid grid-cols-2 gap-4">
                                <FormInput label="Oda Tipi Adı *" value={formData.name} onChange={(v) => handleChange('name', v)} required />
                                <FormInput label="Oda Tipi Kodu *" value={formData.code} onChange={(v) => handleChange('code', v)} required />
                                <FormInput label="Sistem Oda Tipi" value={formData.systemCode || ''} onChange={(v) => handleChange('systemCode', v)} />
                                <FormInput label="Oda Sayısı" value={formData.count} onChange={(v) => handleChange('count', v)} />
                            </div>

                            <FormInput label="Odanızı Kısaca Tanıtır Mısınız?" type="textarea" value={formData.description || ''} onChange={(v) => handleChange('description', v)} />

                            <div className="grid grid-cols-4 gap-4 items-end">
                                <FormInput label="Oda Tipi Grubu" value={formData.group || ''} onChange={(v) => handleChange('group', v)} />
                                <FormInput label="Odanız Kaç m² ?" value={formData.area || ''} onChange={(v) => handleChange('area', v)} />
                                <div className="flex gap-2">
                                    <FormInput label="İş Yükü Oranı" value={formData.workLoad} onChange={(v) => handleChange('workLoad', v)} />
                                    <FormInput label="Sıra No" value={formData.order || ''} onChange={(v) => handleChange('order', v)} />
                                </div>
                                <div className="flex gap-4 pb-2">
                                    <Checkbox label="Pasif" checked={formData.isPassive} onChange={(v) => handleChange('isPassive', v)} />
                                    <Checkbox label="Silindi" checked={formData.isDeleted} onChange={(v) => handleChange('isDeleted', v)} />
                                </div>
                            </div>

                            <hr className="border-gray-200 dark:border-zinc-800" />

                            {/* Capacity */}
                            <div className="grid grid-cols-6 gap-4">
                                <FormInput label="Max (Yts+Çck)" value={formData.maxCapacity || '3'} onChange={(v) => handleChange('maxCapacity', v)} />
                                <FormInput label="Max Yetişkin" value={formData.maxAdult || '3'} onChange={(v) => handleChange('maxAdult', v)} />
                                <FormInput label="Min Yetişkin" value={formData.minAdult || ''} onChange={(v) => handleChange('minAdult', v)} />
                                <FormInput label="Max Çocuk" value={formData.maxChild || ''} onChange={(v) => handleChange('maxChild', v)} />
                                <FormInput label="Min Çocuk" value={formData.minChild || ''} onChange={(v) => handleChange('minChild', v)} />
                                <FormInput label="Max Bebek" value={formData.maxBaby || ''} onChange={(v) => handleChange('maxBaby', v)} />
                            </div>

                            {/* Price Factors */}
                            <div>
                                <h4 className="text-xs font-bold text-gray-500 mb-2">Fiyat Çarpanları</h4>
                                <div className="grid grid-cols-6 gap-4">
                                    <FormInput label="Temel Oda Tipi Faktörü" value={formData.baseFactor || '1.00'} onChange={(v) => handleChange('baseFactor', v)} />
                                    <FormInput label="Sngl Faktörü" value={formData.sngFactor} onChange={(v) => handleChange('sngFactor', v)} />
                                    <FormInput label="Dbl Faktörü" value={formData.dblFactor} onChange={(v) => handleChange('dblFactor', v)} />
                                    <FormInput label="Trp Faktörü" value={formData.trpFactor} onChange={(v) => handleChange('trpFactor', v)} />
                                    <FormInput label="Quad Faktörü" value={formData.quadFactor} onChange={(v) => handleChange('quadFactor', v)} />
                                    <FormInput label="Ekstra Yatak Faktörü" value={formData.extraBedCoef} onChange={(v) => handleChange('extraBedCoef', v)} />

                                    <FormInput label="Bebek Faktörü" value={formData.babyFactor || '0.00'} onChange={(v) => handleChange('babyFactor', v)} />
                                    <FormInput label="Bebek2 Faktörü" value={formData.baby2Factor || '0.00'} onChange={(v) => handleChange('baby2Factor', v)} />
                                    <FormInput label="Çok Faktörü" value={formData.multiFactor || '0.50'} onChange={(v) => handleChange('multiFactor', v)} />
                                    <FormInput label="Çok2 Faktörü" value={formData.multi2Factor || '0.50'} onChange={(v) => handleChange('multi2Factor', v)} />
                                    <FormInput label="Genç Faktörü" value={formData.teenFactor || '0.50'} onChange={(v) => handleChange('teenFactor', v)} />
                                    <FormInput label="Genç2 Faktörü" value={formData.teen2Factor || '0.50'} onChange={(v) => handleChange('teen2Factor', v)} />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const TabButton = ({ children, active, onClick }: { children: string, active?: boolean, onClick?: () => void }) => (
    <button onClick={onClick} className={cn(
        "px-4 py-2 text-xs font-bold rounded-t transition-colors",
        active ? "bg-white dark:bg-zinc-900 border-t border-x border-gray-200 dark:border-zinc-700 text-gray-800 dark:text-white" : "text-gray-500 hover:bg-gray-200 dark:hover:bg-zinc-700"
    )}>
        {children}
    </button>
)

const FormInput = ({ label, value, type = "text", onChange, required }: { label: string, value?: string | number, type?: "text" | "textarea", onChange?: (val: string) => void, required?: boolean }) => (
    <div className="flex flex-col gap-1 w-full">
        {type === "textarea" ? (
            <textarea
                className="w-full border-b border-gray-300 dark:border-zinc-700 bg-transparent py-1 text-xs resize-none focus:outline-none focus:border-blue-500"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                rows={2}
            />
        ) : (
            <input
                type="text"
                className="w-full border-b border-gray-300 dark:border-zinc-700 bg-transparent py-1 text-sm font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-500"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                required={required}
            />
        )}
        <label className="text-[10px] text-gray-400">{label}</label>
    </div>
)

const Checkbox = ({ label, checked, onChange }: { label: string, checked?: boolean, onChange?: (val: boolean) => void }) => (
    <label className="flex items-center gap-2 cursor-pointer">
        <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={checked}
            onChange={(e) => onChange?.(e.target.checked)}
        />
        <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
    </label>
)
