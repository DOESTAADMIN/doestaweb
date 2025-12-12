"use client";

import React, { useState } from 'react';
import {
    FaPrint, FaSyncAlt, FaFileExcel, FaArrowUp, FaArrowDown,
    FaFilter, FaDollarSign, FaChartLine, FaWallet, FaCalendarAlt,
    FaBolt, FaSearch, FaTimes, FaQuestionCircle
} from 'react-icons/fa';
import { cn } from "@/lib/utils";

// Types for grid columns
const COLUMNS = [
    "Kasa Adı", "Ödeyen Dep.", "Kullanıcı", "Bakiye", "Döviz",
    "Para Alınan", "Odadan Alınan", "Döviz Alınan", "Odaya İade",
    "Döviz Verilen", "Para Verilen", "Extra"
];

export default function CashBankPage() {
    const [isFilterOpen, setIsFilterOpen] = useState(true);
    const [isUserBased, setIsUserBased] = useState(false);

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50 dark:bg-black/20">
            {/* Header / Top Bar */}
            <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 p-2 flex flex-col gap-2">

                {/* Title & Help */}
                <div className="flex justify-between items-center px-2 pt-1">
                    <h1 className="text-xl font-bold text-blue-900 dark:text-blue-400 flex items-center gap-2">
                        <FaQuestionCircle className="text-blue-900 dark:text-blue-400" /> Ön Kasa
                        <span className="text-[10px] font-normal bg-gray-500 text-white px-1.5 rounded ml-2">Ön Kasa</span>
                    </h1>
                    {/* Report Search Mock */}
                    <div className="flex items-center bg-gray-200 dark:bg-zinc-800 rounded p-1 w-32 justify-between cursor-not-allowed opacity-60">
                        <span className="text-xs text-gray-500 pl-2">Rapor...</span>
                        <FaSearch size={10} className="text-gray-400 mr-1" />
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1">
                    <ToolbarButton icon={FaPrint} />
                    <ToolbarButton icon={FaSyncAlt} />
                    <ToolbarButton icon={FaFileExcel} color="text-green-600" />
                    <div className="w-px h-6 bg-gray-300 dark:bg-zinc-700 mx-1"></div>
                    <ToolbarButton icon={FaArrowUp} text="" />
                    <ToolbarButton icon={FaArrowDown} text="" /> {/* Adding Down for symmetry though screenshot shows one line-ish */}
                    <div className="w-px h-6 bg-gray-300 dark:bg-zinc-700 mx-1"></div>
                    <ToolbarButton icon={FaTimes} />
                    <div className="w-px h-6 bg-gray-300 dark:bg-zinc-700 mx-1"></div>
                    <ToolbarButton icon={FaDollarSign} />
                    <ToolbarButton icon={FaChartLine} />
                    <ToolbarButton icon={FaWallet} />
                    <ToolbarButton icon={FaCalendarAlt} />
                    <div className="w-px h-6 bg-gray-300 dark:bg-zinc-700 mx-1"></div>
                    <ToolbarButton icon={FaBolt} />
                    <ToolbarButton icon={FaBolt} /> {/* Second bolt icon mock if needed */}
                </div>

                {/* Filter Panel (Collapsible) */}
                <div className="bg-gray-100 dark:bg-zinc-800/50 p-2 rounded border border-gray-200 dark:border-zinc-700 flex flex-col gap-2">
                    <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                        <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">Filters</span>
                        <FaFilter size={12} className="text-gray-500" />
                    </div>

                    {isFilterOpen && (
                        <div className="flex flex-wrap items-center gap-6 pt-1">
                            {/* Date Picker Mock */}
                            <div className="flex flex-col gap-1 w-48">
                                <label className="text-[10px] text-gray-500 font-bold uppercase">Tarih</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        defaultValue="2.9.2020"
                                        className="w-full text-sm font-bold border-b-2 border-blue-900 bg-transparent py-1 focus:outline-none dark:text-white"
                                    />
                                    <FaCalendarAlt className="absolute right-0 top-1 text-gray-400" size={12} />
                                </div>
                            </div>

                            {/* User Based Toggle */}
                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsUserBased(!isUserBased)}>
                                <div className={cn("w-8 h-4 rounded-full relative transition-colors", isUserBased ? "bg-green-500" : "bg-gray-300")}>
                                    <div className={cn("w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all shadow-sm", isUserBased ? "left-4.5" : "left-0.5")}></div>
                                </div>
                                <span className="text-xs text-gray-600 dark:text-gray-300 font-medium select-none">Kullanıcı Bazlı</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Empty Grid */}
            <div className="flex-1 overflow-auto bg-white dark:bg-zinc-900 p-2 relative">
                <table className="w-full text-xs text-left border-collapse border border-gray-300 dark:border-zinc-700">
                    <thead className="sticky top-0 bg-gray-50 dark:bg-zinc-800 z-10 shadow-sm">
                        <tr className="text-gray-600 dark:text-gray-300">
                            {COLUMNS.map((header, i) => (
                                <th key={i} className="p-1 border border-gray-300 dark:border-zinc-700 font-semibold min-w-[100px] bg-gray-100 dark:bg-zinc-800/80">
                                    <div className="flex flex-col gap-1">
                                        <span className="px-1">{header}</span>
                                        <input
                                            type="text"
                                            className="w-full px-1 py-0.5 border border-gray-300 dark:border-zinc-600 rounded-sm bg-white dark:bg-zinc-900 focus:outline-none focus:border-blue-500 text-[10px]"
                                        />
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Empty Body as per screenshot */}
                        {Array.from({ length: 15 }).map((_, i) => (
                            <tr key={i} className="h-8 hover:bg-gray-50 dark:hover:bg-gray-800">
                                {COLUMNS.map((_, j) => (
                                    <td key={j} className="border border-gray-200 dark:border-zinc-800"></td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="sticky bottom-0 bg-white dark:bg-zinc-900 font-bold text-gray-700 dark:text-gray-200 border-t-2 border-gray-300 dark:border-zinc-700">
                        <tr>
                            <td colSpan={5} className="p-2 border-r border-gray-300 dark:border-zinc-700"></td>
                            <td className="p-2 border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800"></td>
                            <td className="p-2 border border-gray-300 dark:border-zinc-700"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {/* Bottom Status Bar Mock */}
            <div className="border-t border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-1 flex items-center justify-between text-[10px] text-gray-500">
                <div className="flex gap-4">
                    <span>HOTELID: 20054 - demo7815 - 02.09.2020</span>
                </div>
                <div className="flex gap-4 font-bold px-4">
                    {/* Totals mock */}
                    <span>0</span>
                    <span>0</span>
                </div>
            </div>
        </div>
    );
}

function ToolbarButton({ icon: Icon, color, text }: { icon: any, color?: string, text?: string }) {
    return (
        <button className={cn(
            "p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded transition-colors text-gray-600 dark:text-gray-400",
            color && color
        )}>
            <Icon size={14} />
            {text && <span className="text-xs ml-1">{text}</span>}
        </button>
    )
}
