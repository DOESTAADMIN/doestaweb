"use client";

import React, { useState, useEffect } from 'react';
import { FaTimes, FaCheck, FaHistory, FaPlus, FaCopy, FaPrint, FaSave, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { cn } from "@/lib/utils";

interface RoomDialogProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: any;
    onSave: (data: any) => void;
}

const Tabs = ["Oda Bilgileri", "Oda Özellikleri", "Oda Detayları", "Bağlantılı Odalar"];

export default function RoomDialog({ isOpen, onClose, initialData, onSave }: RoomDialogProps) {
    const [activeTab, setActiveTab] = useState("Oda Bilgileri");
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        if (initialData) {
            setFormData({ ...initialData });
        } else {
            setFormData({});
        }
    }, [initialData, isOpen]);

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleSaveClick = () => {
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-4xl rounded-lg shadow-2xl flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-zinc-800">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-blue-900 dark:text-blue-400">Odalar</h2>
                        <div className="flex gap-1">
                            <button className="text-gray-400 hover:text-gray-600"><FaHistory /></button>
                            <button className="text-gray-400 hover:text-gray-600"><FaArrowLeft /></button>
                            <button className="text-gray-400 hover:text-gray-600"><FaPlus onClick={() => setFormData({})} /></button>
                            <button className="text-gray-400 hover:text-gray-600"><FaCopy /></button>
                            <button className="text-gray-400 hover:text-gray-600"><FaPrint /></button>
                            <button className="text-gray-400 hover:text-gray-600" onClick={handleSaveClick}><FaSave /></button>
                            <button className="text-gray-400 hover:text-gray-600"><FaArrowRight /></button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handleSaveClick} className="text-blue-600 hover:text-blue-700">
                            <FaCheck size={20} />
                        </button>
                        <button onClick={onClose} className="text-red-500 hover:text-red-600">
                            <FaTimes size={20} />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-100 dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700">
                    {Tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-6 py-3 text-sm font-semibold transition-colors",
                                activeTab === tab
                                    ? "bg-white dark:bg-zinc-900 text-blue-600 border-t-2 border-blue-600"
                                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 bg-gray-50 dark:bg-zinc-900/50">
                    {activeTab === "Oda Bilgileri" && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Row 1 */}
                            <FormInput
                                label="Oda No" required
                                value={formData.number || formData.roomNo || ""}
                                onChange={(val) => handleInputChange("number", val)}
                            />
                            <FormSelect
                                label="Oda Tipi" required options={["Standart", "Deluxe", "King", "Suite"]}
                                value={formData.type || formData.roomType || ""}
                                onChange={(val) => handleInputChange("type", val)}
                            />
                            <FormSelect
                                label="Yatak Tipi" options={["Twin", "French", "King"]}
                                value={formData.bedType || ""}
                                onChange={(val) => handleInputChange("bedType", val)}
                            />

                            {/* Row 2 */}
                            <FormInput
                                label="Kat"
                                value={formData.floor || ""}
                                onChange={(val) => handleInputChange("floor", val)}
                            />
                            <FormInput
                                label="Konumu"
                                value={formData.location || ""}
                                onChange={(val) => handleInputChange("location", val)}
                            />
                            <FormInput
                                label="Manzara"
                                value={formData.view || ""}
                                onChange={(val) => handleInputChange("view", val)}
                            />

                            {/* Max Yatak */}
                            <FormInput
                                label="Kapasite" type="number"
                                value={formData.capacity || 2}
                                onChange={(val) => handleInputChange("capacity", Number(val))}
                            />

                            {/* Status - simplified as select */}
                            <FormSelect
                                label="Durum" options={["Clean", "Dirty", "Occupied", "DND"]}
                                value={formData.status || "Clean"}
                                onChange={(val) => handleInputChange("status", val)}
                            />

                            <FormInput
                                label="Fiyat (Geçici)" type="number"
                                value={formData.price || 0}
                                onChange={(val) => handleInputChange("price", Number(val))}
                            />

                            <div className="flex flex-col justify-end pb-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox" className="rounded border-gray-300"
                                        checked={formData.isPassive || false}
                                        onChange={(e) => handleInputChange("isPassive", e.target.checked)}
                                    />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pasif mi?</span>
                                </label>
                            </div>
                            <div className="flex flex-col justify-end pb-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox" className="rounded border-gray-300"
                                        checked={formData.isDeleted || false}
                                        onChange={(e) => handleInputChange("isDeleted", e.target.checked)}
                                    />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Silindi</span>
                                </label>
                            </div>

                            {/* Row 4 - Full width description */}
                            <div className="col-span-1 md:col-span-3 mt-2">
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                    Açıklama
                                </label>
                                <textarea
                                    className="w-full border-b border-gray-300 dark:border-zinc-700 bg-transparent focus:border-blue-500 outline-none transition-colors min-h-[60px]"
                                    value={formData.description || ""}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                    {activeTab === "Oda Özellikleri" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput label="Özellikler (Virgülle ayırın)" value={formData.features || ""} onChange={(v) => handleInputChange("features", v)} />
                        </div>
                    )}
                    {activeTab === "Oda Detayları" && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormInput label="Anahtar No" value={formData.keyNo || ""} onChange={(v) => handleInputChange("keyNo", v)} />
                            <FormInput label="Telefon No" value={formData.phoneNo || ""} onChange={(v) => handleInputChange("phoneNo", v)} />
                            <FormInput label="Klima No" value={formData.acNo || ""} onChange={(v) => handleInputChange("acNo", v)} />
                        </div>
                    )}
                    {activeTab === "Bağlantılı Odalar" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput label="Bağlantılı Odalar IDs" value={formData.connectedRooms || ""} onChange={(v) => handleInputChange("connectedRooms", v)} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function FormInput({ label, required, placeholder, type = "text", value, onChange }: any) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange && onChange(e.target.value)}
                className="w-full border-b border-gray-300 dark:border-zinc-700 bg-transparent py-1 text-sm focus:border-blue-500 outline-none transition-colors"
                autoComplete="off"
            />
        </div>
    )
}

function FormSelect({ label, required, options, value, onChange }: any) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
                className="w-full border-b border-gray-300 dark:border-zinc-700 bg-transparent py-1 text-sm focus:border-blue-500 outline-none transition-colors"
                value={value}
                onChange={(e) => onChange && onChange(e.target.value)}
            >
                <option value="">Seçiniz</option>
                {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    )
}
