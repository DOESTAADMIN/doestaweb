"use client";

import React, { useState } from 'react';
import {
    FaPlus, FaPrint, FaSync, FaFileExcel, FaBolt, FaFilter,
    FaBed, FaInfoCircle, FaSearch
} from 'react-icons/fa';
import { cn } from "@/lib/utils";

// Mock Data
interface GuestRow {
    odaNo: string;
    odaTipi: string;
    voucherNo: string;
    acente: string;
    misafirAdi: string;
    gelis: string;
    ayrilis: string;
    gun: number;
    oda: number;
    yetiskin: number;
    cocuk: number;
    bebek: number;
    fiyat: number;
    doviz: string;
    rezId: string;
    status?: "InHouse" | "CheckedOut";
    bgClass?: string;
}

const mockData: GuestRow[] = [
    { odaNo: "102", odaTipi: "DLX", voucherNo: "", acente: "ERS", misafirAdi: "Marcel Neal", gelis: "02.09.2020 15:00", ayrilis: "09.09.2020 12:00", gun: 7, oda: 1, yetiskin: 2, cocuk: 0, bebek: 0, fiyat: 500.00, doviz: "EUR", rezId: "5.028.646", bgClass: "bg-red-50 dark:bg-red-900/10" },
    { odaNo: "105", odaTipi: "STD", voucherNo: "", acente: "BOOKING.COM", misafirAdi: "Isabella Katherine", gelis: "31.08.2020 15:00", ayrilis: "04.09.2020 12:00", gun: 4, oda: 1, yetiskin: 2, cocuk: 0, bebek: 0, fiyat: 880.00, doviz: "EUR", rezId: "5.486.494" },
    { odaNo: "106", odaTipi: "DLX", voucherNo: "", acente: "BOOKING.COM", misafirAdi: "Cadence Damaris", gelis: "29.08.2020 15:00", ayrilis: "02.09.2020 12:00", gun: 4, oda: 1, yetiskin: 2, cocuk: 0, bebek: 0, fiyat: 1000.00, doviz: "EUR", rezId: "5.486.483" },
    { odaNo: "110", odaTipi: "DLX", voucherNo: "", acente: "BOOKING.COM", misafirAdi: "Isabella Smith", gelis: "28.08.2020 15:00", ayrilis: "02.09.2020 12:00", gun: 5, oda: 1, yetiskin: 2, cocuk: 0, bebek: 0, fiyat: 1000.00, doviz: "EUR", rezId: "5.486.403" },
    { odaNo: "111", odaTipi: "STD", voucherNo: "", acente: "BOOKING.COM", misafirAdi: "Roy Wilson", gelis: "29.08.2020 15:00", ayrilis: "03.09.2020 12:00", gun: 5, oda: 1, yetiskin: 2, cocuk: 0, bebek: 0, fiyat: 880.00, doviz: "EUR", rezId: "5.486.421" },
    { odaNo: "112", odaTipi: "DLX", voucherNo: "", acente: "BOOKING.COM", misafirAdi: "Patrick Raymond", gelis: "28.08.2020 15:00", ayrilis: "02.09.2020 00:00", gun: 5, oda: 1, yetiskin: 2, cocuk: 0, bebek: 0, fiyat: 1056.00, doviz: "EUR", rezId: "5.486.583" },
    { odaNo: "113", odaTipi: "STD", voucherNo: "", acente: "BOOKING.COM", misafirAdi: "Taylor Wilson", gelis: "28.08.2020 15:00", ayrilis: "02.09.2020 12:00", gun: 5, oda: 1, yetiskin: 2, cocuk: 0, bebek: 0, fiyat: 940.00, doviz: "EUR", rezId: "5.486.404" },
    { odaNo: "114", odaTipi: "DLX", voucherNo: "", acente: "BOOKING.COM", misafirAdi: "Williams Taylor", gelis: "31.08.2020 15:00", ayrilis: "05.09.2020 12:00", gun: 5, oda: 1, yetiskin: 2, cocuk: 0, bebek: 0, fiyat: 1000.00, doviz: "EUR", rezId: "5.486.424" },
    { odaNo: "115", odaTipi: "STD", voucherNo: "", acente: "BOOKING.COM", misafirAdi: "Adriana Brandi", gelis: "30.08.2020 15:00", ayrilis: "03.09.2020 12:00", gun: 4, oda: 1, yetiskin: 2, cocuk: 0, bebek: 0, fiyat: 880.00, doviz: "EUR", rezId: "5.486.481" },
    { odaNo: "116", odaTipi: "DLX", voucherNo: "", acente: "BOOKING.COM", misafirAdi: "Barry Austyn", gelis: "28.08.2020 15:00", ayrilis: "02.09.2020 12:00", gun: 5, oda: 1, yetiskin: 2, cocuk: 0, bebek: 0, fiyat: 1000.00, doviz: "EUR", rezId: "5.486.553" },
    { odaNo: "122", odaTipi: "DLX", voucherNo: "", acente: "BOOKING.COM", misafirAdi: "Taylor Vance", gelis: "31.08.2020 15:00", ayrilis: "05.09.2020 12:00", gun: 5, oda: 1, yetiskin: 2, cocuk: 0, bebek: 0, fiyat: 1000.00, doviz: "EUR", rezId: "5.486.585", bgClass: "bg-pink-100 dark:bg-pink-900/20" }, // Special highlight shown in screenshot
    { odaNo: "1225", odaTipi: "DLX", voucherNo: "", acente: "BOOKING.COM", misafirAdi: "Share With Taylor Vance", gelis: "31.08.2020 15:00", ayrilis: "05.09.2020 12:00", gun: 5, oda: 0, yetiskin: 2, cocuk: 0, bebek: 0, fiyat: 1286.00, doviz: "EUR", rezId: "5.507.450", bgClass: "bg-pink-100 dark:bg-pink-900/20" },
    { odaNo: "202", odaTipi: "JUNSUI", voucherNo: "", acente: "ERS", misafirAdi: "Aslı Bucak", gelis: "28.08.2020 15:00", ayrilis: "03.09.2020 12:00", gun: 6, oda: 1, yetiskin: 2, cocuk: 0, bebek: 0, fiyat: 0.00, doviz: "EUR", rezId: "4.333.553", bgClass: "bg-red-50 dark:bg-red-900/10" },
    { odaNo: "301", odaTipi: "PNR", voucherNo: "", acente: "BOOKING.COM", misafirAdi: "Walker Zachary", gelis: "28.08.2020 15:00", ayrilis: "02.09.2020 12:00", gun: 5, oda: 1, yetiskin: 2, cocuk: 0, bebek: 0, fiyat: 1240.00, doviz: "EUR", rezId: "5.486.600" },
    { odaNo: "303", odaTipi: "STD", voucherNo: "", acente: "BOOKING.COM", misafirAdi: "Bethany Brown", gelis: "28.08.2020 15:00", ayrilis: "02.09.2020 12:00", gun: 5, oda: 1, yetiskin: 2, cocuk: 0, bebek: 0, fiyat: 940.00, doviz: "EUR", rezId: "5.486.430", bgClass: "bg-blue-50 dark:bg-blue-900/10" },
];

const Tabs = ["In House", "Bekleyen Gelişler", "Gerçekleşen Gelişler", "Bekleyen Çıkışlar", "Bugün Ayrılmış Olanlar", "VIP In House", "G. Bakiye", "Sanal Folyolar", "NoShow Folyo"];

export default function GuestsPage() {
    const [activeTab, setActiveTab] = useState("In House");

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50 dark:bg-black/20">
            {/* Header / Toolbar */}
            <div className="bg-white dark:bg-zinc-900 p-4 border-b border-gray-200 dark:border-zinc-800 space-y-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold text-blue-900 dark:text-blue-400 flex items-center gap-2">
                        <FaInfoCircle className="text-gray-400 text-sm" /> Konaklayan Listesi
                        <span className="text-xs font-normal bg-gray-600 text-white px-2 py-0.5 rounded ml-2">Konaklayan</span>
                    </h1>

                    <div className="flex items-center gap-2">
                        <button className="text-gray-500 hover:text-blue-600"><FaPlus /></button>
                        <button className="text-gray-500 hover:text-blue-600"><FaPrint /></button>
                        <button className="text-gray-500 hover:text-blue-600"><FaSync /></button>
                        <button className="text-green-600 hover:text-green-700"><FaFileExcel /></button>
                        <button className="text-gray-500 hover:text-blue-600"><FaBolt /></button>
                        <span className="text-sm font-semibold text-gray-500 ml-4">Toplam: {mockData.length}</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-0.5 overflow-x-auto border-b border-gray-300 dark:border-zinc-700 bg-gray-100 dark:bg-zinc-800 p-1">
                    {Tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-4 py-1.5 text-xs font-bold border border-b-0 rounded-t",
                                activeTab === tab
                                    ? "bg-white dark:bg-zinc-900 text-gray-800 dark:text-white border-gray-300 dark:border-zinc-600 shadow-sm"
                                    : "bg-gray-200 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 border-transparent hover:bg-gray-300 dark:hover:bg-zinc-700"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid Container */}
            <div className="flex-1 overflow-auto bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-700 relative">
                <table className="w-full text-[11px] text-left border-collapse border border-gray-300 dark:border-zinc-700 min-w-[1500px]">
                    <thead className="sticky top-0 bg-gray-100 dark:bg-zinc-800 z-30 shadow-sm outline outline-1 outline-gray-300 dark:outline-zinc-700">
                        <tr className="text-gray-600 dark:text-gray-300">
                            {[
                                "Oda No", "Oda Tipi", "Voucher No", "Acente", "Misafir Adı", 
                                "Geliş", "Ayrılış", "Gün", "Oda", "Yetişkin", "TCck", "Bebek", "Oda Fiyatları", "Döviz", "Rez Id"
                            ].map((header, i) => (
                                <th key={i} className={cn(
                                    "p-1 border border-gray-300 dark:border-zinc-700 font-bold min-w-[80px] bg-gray-100 dark:bg-zinc-800 align-top",
                                    i === 0 && "sticky left-0 z-40 outline-r outline-gray-300 dark:outline-zinc-700 shadow-[2px_0_5px_rgba(0,0,0,0.05)]" // Fixed First Column Header
                                )}>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex justify-between items-center text-[10px] cursor-pointer hover:bg-gray-200 rounded px-1">
                                            <span>{header}</span>
                                            {/* Sort Icon Mock */}
                                            <div className="flex flex-col -space-y-1 text-[8px] text-gray-400">
                                                <span>▲</span>
                                                <span>▼</span>
                                            </div>
                                        </div>
                                        <input type="text" className="w-full px-1 py-0.5 border border-gray-300 dark:border-zinc-600 rounded-sm bg-white dark:bg-zinc-900 focus:outline-none focus:border-blue-500 text-[10px] font-normal" />
                                    </div>
                                    {/* Resize Handle Mock */}
                                    <div className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-400 opacity-0 hover:opacity-100 transition-opacity"></div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {mockData.map((row, idx) => (
                            <tr key={idx} className={cn("cursor-default transition-colors text-gray-700 dark:text-gray-300", row.bgClass ? row.bgClass : "even:bg-gray-50 hover:bg-blue-50 dark:hover:bg-blue-900/10")}>
                                <td className={cn(
                                    "p-1 border border-gray-300 dark:border-zinc-700 font-semibold text-center sticky left-0 z-20 shadow-[2px_0_5px_rgba(0,0,0,0.05)]", 
                                    row.bgClass ? row.bgClass : "bg-white dark:bg-zinc-900 even:bg-gray-50" // Maintain bg for fixed col
                                )}>
                                    {row.odaNo}
                                </td>
                                <td className="p-1 border border-gray-300 dark:border-zinc-700 text-center">{row.odaTipi}</td>
                                <td className="p-1 border border-gray-300 dark:border-zinc-700">{row.voucherNo}</td>
                                {/* ... rest of columns ... using slicing or existing logic */}
                                <td className="p-1 border border-gray-300 dark:border-zinc-700 font-medium">{row.acente}</td>
                                <td className="p-1 border border-gray-300 dark:border-zinc-700 font-semibold min-w-[120px]">{row.misafirAdi}</td>
                                <td className="p-1 border border-gray-300 dark:border-zinc-700 text-center whitespace-nowrap">{row.gelis}</td>
                                <td className="p-1 border border-gray-300 dark:border-zinc-700 text-center whitespace-nowrap">{row.ayrilis}</td>
                                <td className="p-1 border border-gray-300 dark:border-zinc-700 text-center">{row.gun}</td>
                                <td className="p-1 border border-gray-300 dark:border-zinc-700 text-center">{row.oda}</td>
                                <td className="p-1 border border-gray-300 dark:border-zinc-700 text-center">{row.yetiskin}</td>
                                <td className="p-1 border border-gray-300 dark:border-zinc-700 text-center">0</td>
                                <td className="p-1 border border-gray-300 dark:border-zinc-700 text-center">{row.bebek}</td>
                                <td className="p-1 border border-gray-300 dark:border-zinc-700 text-right bg-red-50/30 text-red-600 dark:text-red-400 font-medium">{row.fiyat.toFixed(2)}</td>
                                <td className="p-1 border border-gray-300 dark:border-zinc-700 text-center">{row.doviz}</td>
                                <td className="p-1 border border-gray-300 dark:border-zinc-700 text-right text-gray-500">{row.rezId}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="sticky bottom-0 bg-gray-100 dark:bg-zinc-800 font-bold text-gray-700 dark:text-gray-200 z-30 outline outline-1 outline-gray-300 dark:outline-zinc-700">
                        <tr>
                            <td className="p-1 border border-gray-300 dark:border-zinc-700 text-right text-[10px] uppercase sticky left-0 z-40 bg-gray-100 dark:bg-zinc-800 shadow-[2px_0_5px_rgba(0,0,0,0.05)]" colSpan={1}>
                                Toplamlar:
                            </td>
                             <td colSpan={5} className="p-1 border border-gray-300 dark:border-zinc-700"></td>
                            {/* Adjustment for colSpan since first col is separated */}
                            {/* Previous logic: colSpan={6} -> OdaNo (1) + Others (5) */}
                            
                            <td className="p-1 border border-gray-300 dark:border-zinc-700 text-center">{mockData.reduce((a, b) => a + b.gun, 0)}</td>
                            <td className="p-1 border border-gray-300 dark:border-zinc-700 text-center">{mockData.reduce((a, b) => a + b.oda, 0)}</td>
                            <td className="p-1 border border-gray-300 dark:border-zinc-700 text-center">{mockData.reduce((a, b) => a + b.yetiskin, 0)}</td>
                            <td className="p-1 border border-gray-300 dark:border-zinc-700 text-center">0</td>
                            <td className="p-1 border border-gray-300 dark:border-zinc-700 text-center">{mockData.reduce((a, b) => a + b.bebek, 0)}</td>
                            <td className="p-1 border border-gray-300 dark:border-zinc-700 text-right">{mockData.reduce((a, b) => a + b.fiyat, 0).toFixed(2)}</td>
                            <td colSpan={2} className="p-1 border border-gray-300 dark:border-zinc-700"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Pagination Footer Mock */}
            <div className="bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 p-2 flex justify-between items-center text-xs text-gray-500">
                <div className="flex items-center gap-4 px-4 font-bold">
                    <span>260</span>
                    <span>30</span>
                    <span>61</span>
                    <span>0</span>
                    <span>0</span>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded">◄</button>
                    <span>1 / 1</span>
                    <button className="p-1 hover:bg-gray-100 rounded">►</button>
                </div>
            </div>
        </div>
    );
}
