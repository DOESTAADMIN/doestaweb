"use client";

import React, { useState } from "react";
import { FaChevronDown, FaChevronRight, FaSearch } from "react-icons/fa";
import { cn } from "@/lib/utils";

const FilterSection = ({ title, isOpen, onToggle, children }: { title: string, isOpen: boolean, onToggle: () => void, children: React.ReactNode }) => (
    <div className="border-b border-gray-100 dark:border-zinc-800 py-2">
        <button className="flex items-center justify-between w-full text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded p-1" onClick={onToggle}>
            {title}
            {isOpen ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
        </button>
        {isOpen && <div className="pl-2 space-y-1">{children}</div>}
    </div>
);

const CheckboxFilter = ({ label, count, colorClass }: { label: string, count?: number, colorClass?: string }) => (
    <label className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:text-blue-600 w-full">
        <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3 h-3" />
        <span className={cn("flex-1", colorClass)}>{label}</span>
        {count !== undefined && <span className="text-gray-300">({count})</span>}
    </label>
);

export default function RoomRackSidebar() {
    const [sections, setSections] = useState<Record<string, boolean>>({
        musaitlik: true,
        odaTipi: true,
        durum: true,
        oda: true,
        yatak: false,
        manzara: false,
        kat: false
    });

    const toggle = (key: string) => setSections(prev => ({ ...prev, [key]: !prev[key] }));

    return (
        <div className="w-64 flex-shrink-0 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 p-4 h-full overflow-y-auto">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                <span>🏰</span> Müsaitlik
            </h3>

            {/* Müsaitlik Section */}
            <FilterSection title="Oda Müsaitlik Durumu" isOpen={sections.musaitlik} onToggle={() => toggle('musaitlik')}>
                <CheckboxFilter label="Occupied" count={32} />
                <CheckboxFilter label="Vacant" count={28} />
            </FilterSection>

            {/* Oda Tipi Section */}
            <FilterSection title="Oda Tipi" isOpen={sections.odaTipi} onToggle={() => toggle('odaTipi')}>
                <CheckboxFilter label="CON" count={4} />
                <CheckboxFilter label="DLX" count={20} />
                <CheckboxFilter label="JUNSUI" count={1} />
                <CheckboxFilter label="PNR" count={10} />
                <CheckboxFilter label="STD" count={20} />
                <CheckboxFilter label="SUIT" count={5} />
            </FilterSection>

            {/* Durum Section */}
            <FilterSection title="Durum" isOpen={sections.durum} onToggle={() => toggle('durum')}>
                <CheckboxFilter label="Temiz" count={60} colorClass="text-blue-500" />
                <CheckboxFilter label="Kirli" count={5} colorClass="text-red-500" />
            </FilterSection>

            {/* Oda No Search Section */}
            <FilterSection title="Oda" isOpen={sections.oda} onToggle={() => toggle('oda')}>
                <h4 className="text-[10px] text-gray-400 mb-1">Oda No</h4>
                <div className="relative">
                    <input type="text" placeholder="Ara..." className="w-full text-xs p-1 pl-1 border border-gray-200 dark:border-zinc-700 rounded bg-gray-50 dark:bg-zinc-800" />
                    <FaSearch className="absolute right-2 top-1.5 text-gray-400" size={10} />
                </div>
            </FilterSection>

            {/* Yatak Tipi */}
            <FilterSection title="Yatak Tipi" isOpen={sections.yatak} onToggle={() => toggle('yatak')}>
                <CheckboxFilter label="FRN" count={37} />
                <CheckboxFilter label="KNG" count={6} />
                <CheckboxFilter label="TWN" count={15} />
            </FilterSection>

            {/* Manzara */}
            <FilterSection title="Manzara" isOpen={sections.manzara} onToggle={() => toggle('manzara')}>
                <CheckboxFilter label="JUNGLESIDE" count={31} />
                <CheckboxFilter label="RIVERSIDE" count={24} />
            </FilterSection>

            {/* Kat */}
            <FilterSection title="Kat" isOpen={sections.kat} onToggle={() => toggle('kat')}>
                {[1, 2, 3, 4, 5].map(k => <CheckboxFilter key={k} label={`${k}. Kat`} count={25} />)}
            </FilterSection>

        </div>
    );
}
