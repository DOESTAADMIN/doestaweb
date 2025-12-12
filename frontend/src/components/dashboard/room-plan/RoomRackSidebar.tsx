"use client";

import React, { useState } from "react";
import { FaChevronDown, FaChevronRight, FaSearch } from "react-icons/fa";
import { cn } from "@/lib/utils";

export interface FilterCounts {
    occupied: number;
    vacant: number;
    clean: number;
    dirty: number;
    types: Record<string, number>;
    bedTypes: Record<string, number>;
    floors: Record<string, number>;
    views: Record<string, number>;
}

interface RoomRackSidebarProps {
    counts: FilterCounts;
    filters: {
        status: string[];
        type: string[];
        bedType: string[];
        floor: string[];
        view: string[];
        search: string;
    };
    onFilterChange: (key: string, value: string, checked: boolean) => void;
    onSearchChange: (value: string) => void;
}

const FilterSection = ({ title, isOpen, onToggle, children }: { title: string, isOpen: boolean, onToggle: () => void, children: React.ReactNode }) => (
    <div className="border-b border-gray-100 dark:border-zinc-800 py-2">
        <button className="flex items-center justify-between w-full text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 hover:bg-gray-50 dark:hover:bg-zinc-900 rounded p-1" onClick={onToggle}>
            {title}
            {isOpen ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
        </button>
        {isOpen && <div className="pl-2 space-y-1">{children}</div>}
    </div>
);

const CheckboxFilter = ({ label, count, checked, onChange, colorClass }: { label: string, count?: number, checked?: boolean, onChange?: () => void, colorClass?: string }) => (
    <label className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:text-blue-600 w-full">
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-3 h-3"
        />
        <span className={cn("flex-1", colorClass)}>{label}</span>
        {count !== undefined && <span className="text-gray-300">({count})</span>}
    </label>
);

export default function RoomRackSidebar({ counts, filters, onFilterChange, onSearchChange }: RoomRackSidebarProps) {
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

    const handleCheck = (category: string, value: string) => {
        const isChecked = (filters as any)[category]?.includes(value);
        onFilterChange(category, value, !isChecked);
    };

    return (
        <div className="w-64 flex-shrink-0 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 p-4 h-full overflow-y-auto">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
                <span>🏰</span> Müsaitlik
            </h3>

            {/* Müsaitlik Section */}
            <FilterSection title="Oda Müsaitlik Durumu" isOpen={sections.musaitlik} onToggle={() => toggle('musaitlik')}>
                <CheckboxFilter
                    label="Occupied"
                    count={counts.occupied}
                    checked={filters.status.includes('Occupied')}
                    onChange={() => handleCheck('status', 'Occupied')}
                />
                <CheckboxFilter
                    label="Vacant"
                    count={counts.vacant}
                    checked={filters.status.includes('Vacant')}
                    onChange={() => handleCheck('status', 'Vacant')}
                />
            </FilterSection>

            {/* Oda Tipi Section */}
            <FilterSection title="Oda Tipi" isOpen={sections.odaTipi} onToggle={() => toggle('odaTipi')}>
                {Object.entries(counts.types).map(([type, count]) => (
                    <CheckboxFilter
                        key={type}
                        label={type}
                        count={count}
                        checked={filters.type.includes(type)}
                        onChange={() => handleCheck('type', type)}
                    />
                ))}
            </FilterSection>

            {/* Durum Section */}
            <FilterSection title="Durum" isOpen={sections.durum} onToggle={() => toggle('durum')}>
                <CheckboxFilter
                    label="Temiz"
                    count={counts.clean}
                    checked={filters.status.includes('Clean')}
                    onChange={() => handleCheck('status', 'Clean')}
                    colorClass="text-blue-500"
                />
                <CheckboxFilter
                    label="Kirli"
                    count={counts.dirty}
                    checked={filters.status.includes('Dirty')}
                    onChange={() => handleCheck('status', 'Dirty')}
                    colorClass="text-red-500"
                />
            </FilterSection>

            {/* Oda No Search Section */}
            <FilterSection title="Oda" isOpen={sections.oda} onToggle={() => toggle('oda')}>
                <h4 className="text-[10px] text-gray-400 mb-1">Oda No</h4>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Ara..."
                        value={filters.search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full text-xs p-1 pl-1 border border-gray-200 dark:border-zinc-700 rounded bg-gray-50 dark:bg-zinc-800"
                    />
                    <FaSearch className="absolute right-2 top-1.5 text-gray-400" size={10} />
                </div>
            </FilterSection>

            {/* Yatak Tipi */}
            <FilterSection title="Yatak Tipi" isOpen={sections.yatak} onToggle={() => toggle('yatak')}>
                {Object.entries(counts.bedTypes).map(([type, count]) => (
                    <CheckboxFilter
                        key={type}
                        label={type || "Other"}
                        count={count}
                        checked={filters.bedType.includes(type || "Other")}
                        onChange={() => handleCheck('bedType', type || "Other")}
                    />
                ))}
            </FilterSection>

            {/* Manzara */}
            <FilterSection title="Manzara" isOpen={sections.manzara} onToggle={() => toggle('manzara')}>
                {Object.entries(counts.views).map(([view, count]) => (
                    <CheckboxFilter
                        key={view}
                        label={view || "Standart"}
                        count={count}
                        checked={filters.view.includes(view || "Standart")}
                        onChange={() => handleCheck('view', view || "Standart")}
                    />
                ))}
            </FilterSection>

            {/* Kat */}
            <FilterSection title="Kat" isOpen={sections.kat} onToggle={() => toggle('kat')}>
                {Object.entries(counts.floors).map(([floor, count]) => (
                    <CheckboxFilter
                        key={floor}
                        label={`${floor}. Kat`}
                        count={count}
                        checked={filters.floor.includes(floor)}
                        onChange={() => handleCheck('floor', floor)}
                    />
                ))}
            </FilterSection>

        </div>
    );
}
