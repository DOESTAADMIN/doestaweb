"use client";

import React, { useState } from 'react';
import {
    FaHistory, FaPrint, FaLock, FaCheck, FaTimes,
    FaCamera, FaChevronDown, FaChevronUp, FaMapMarkerAlt,
    FaHeadset, FaCreditCard, FaListUl
} from 'react-icons/fa';
import { cn } from "@/lib/utils";

export default function HotelInfoPage() {
    const [sections, setSections] = useState({
        general: true,
        address: true,
        map: true
    });

    const toggleSection = (key: keyof typeof sections) => {
        setSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50 dark:bg-black/20 p-4 relative overflow-y-auto">
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-t-lg p-3 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-500 text-sm">TR</span>
                    <h1 className="text-xl font-bold text-blue-900 dark:text-blue-400">Temel Bilgiler</h1>
                    <div className="flex gap-2 text-gray-400 ml-4">
                        <button className="hover:text-blue-600"><FaHistory /></button>
                        <button className="hover:text-blue-600"><FaPrint /></button>
                        <button className="hover:text-blue-600"><FaLock /></button>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right text-[10px] text-gray-500">
                        <div>Program Tarihi : 14.09.2020</div>
                        <div>HOTELID : 22265</div>
                    </div>
                    <button className="text-green-600 hover:text-green-700 text-xl"><FaCheck /></button>
                    <button className="text-red-500 hover:text-red-600 text-xl"><FaTimes /></button>
                </div>
            </div>

            {/* Content Space */}
            <div className="flex-1 space-y-4 pt-4">

                {/* General Information Section */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                    <div className="bg-gray-100 dark:bg-zinc-800 px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-zinc-700 flex justify-between cursor-pointer" onClick={() => toggleSection('general')}>
                        <span>Genel Bilgiler</span>
                        {sections.general ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                    </div>

                    {sections.general && (
                        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-6">
                            {/* Logo Upload */}
                            <div className="col-span-1 flex flex-col gap-2">
                                <div className="aspect-square bg-gray-200 dark:bg-zinc-800 rounded-lg flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 dark:border-zinc-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors">
                                    <FaCamera size={48} />
                                    <span className="text-xs mt-2 font-medium">Logo Yükle</span>
                                </div>
                                <label className="text-xs text-gray-500">Logo</label>
                            </div>

                            {/* Forms */}
                            <div className="col-span-3 grid grid-cols-2 gap-x-8 gap-y-4">
                                <FormItem label="Otel Adı" value="EBA TV Otel" />
                                <div className="flex items-end gap-2">
                                    <FormItem label="Alt Alan Adı" value="eba-tv-otel" containerClass="flex-1" />
                                    <span className="text-xs text-gray-500 mb-2">.elektrabulut.com</span>
                                </div>

                                <FormItem label="E-posta" value="halduntasdelen@gmail.com" />
                                <FormItem label="Yetkili" value="Haldun TAŞDELEN" />

                                <FormItem label="Otel Tipi" value="" type="select" />
                                <div className="col-span-2">
                                    <FormItem label="Otel Tanımı" value="" type="textarea" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormItem label="Oda Kapasitesi" value="40" />
                                    <FormItem label="Yatak Kapasitesi" value="" />
                                </div>

                                <FormItem label="Sistem Tarihi" value="14.9.2020" icon={true} />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormItem label="Fiyat Para Birimi" value="TRY" />
                                    <FormItem label="Varsayılan Döviz" value="TRY" />
                                </div>

                                <div className="flex justify-end col-span-2 items-end gap-4 mt-2">
                                    <button className="bg-blue-800 text-white px-6 py-2 rounded shadow-sm hover:bg-blue-900 flex items-center gap-2 text-sm font-bold w-48 justify-center">
                                        <FaCreditCard /> Şimdi Öde
                                    </button>
                                </div>

                                <FormItem label="POS Para Birimi" value="" />

                                <div className="flex justify-end col-span-1 items-end mt-2">
                                    <button className="bg-blue-800 text-white px-6 py-2 rounded shadow-sm hover:bg-blue-900 flex items-center gap-2 text-sm font-bold w-48 justify-center">
                                        <FaListUl /> Anlaşma
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Address & Map Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Address Section */}
                    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden h-fit">
                        <div className="bg-gray-100 dark:bg-zinc-800 px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-zinc-700 flex justify-between cursor-pointer" onClick={() => toggleSection('address')}>
                            <span>Adres ve İletişim</span>
                            {sections.address ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                        </div>
                        {sections.address && (
                            <div className="p-4 space-y-4">
                                <FormItem label="Adres" value="" type="textarea" />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormItem label="Şehir" value="" />
                                    <FormItem label="Telefon" value="+905336293001" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormItem label="Web sitesi" value="" />
                                    <FormItem label="Cep(SMS İçin)" value="" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Map Section */}
                    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden h-fit">
                        <div className="bg-gray-100 dark:bg-zinc-800 px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-zinc-700 flex justify-between cursor-pointer" onClick={() => toggleSection('map')}>
                            <span>Harita</span>
                            {sections.map ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
                        </div>
                        {sections.map && (
                            <div className="p-4 grid grid-cols-3 gap-4">
                                <div className="col-span-2 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormItem label="Enlem" value="" />
                                        <FormItem label="Boylam" value="" />
                                    </div>
                                    <FormItem label="Yakın Yerler" value="" />
                                    <FormItem label="Yol Tarifi" value="" />
                                </div>
                                <div className="col-span-1 flex flex-col item-center justify-center text-center text-gray-400 border border-gray-200 rounded p-4">
                                    <FaMapMarkerAlt size={24} className="mx-auto mb-2" />
                                    <span className="text-xs">Harita</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Live Assistant FAB */}
            <button className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 z-50 group">
                <FaHeadset size={24} />
                <span className="absolute right-full mr-4 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity">
                    Canlı Asistan
                </span>
            </button>
        </div>
    );
}

function FormItem({ label, value, type = "text", icon = false, containerClass = "" }: { label: string, value: string, type?: "text" | "select" | "textarea", icon?: boolean, containerClass?: string }) {
    return (
        <div className={cn("flex flex-col gap-1", containerClass)}>
            {type === "textarea" ? (
                <textarea
                    className="w-full border-b border-gray-300 dark:border-zinc-700 bg-transparent py-1 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-500 resize-none h-8 min-h-[32px]"
                    defaultValue={value}
                />
            ) : (
                <div className="relative">
                    <input
                        type="text"
                        className="w-full border-b border-gray-300 dark:border-zinc-700 bg-transparent py-1 text-sm font-bold text-gray-800 dark:text-gray-200 focus:outline-none focus:border-blue-500"
                        defaultValue={value}
                    />
                    {/* Triangle for select mock or icon */}
                </div>
            )}
            <label className="text-[10px] text-gray-400">{label}</label>
        </div>
    )
}
