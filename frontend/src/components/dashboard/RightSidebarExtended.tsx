"use client";

import React from "react";

interface RightSidebarExtendedProps {
    ageStats?: { name: string, value: number }[];
    bookingsMadeToday?: { name: string, value: number }[];
    folioTypes?: { name: string, value: number }[];
    repeaterCount?: number;
    boardStats?: { name: string, value: number }[];
}

const PieWidget = ({ title, colors, data }: { title: string, colors: string[], data?: { name: string, value: number }[] }) => {
    // If no data, show mockup or gray
    const isEmpty = !data || data.length === 0;
    const safeData = isEmpty ? [{ name: 'N/A', value: 1 }] : data;
    const total = safeData.reduce((acc, curr) => acc + curr.value, 0);

    // Calculate conic gradient segments
    let gradient = '';
    if (isEmpty) {
        gradient = '#eee 0% 100%';
    } else {
        let currentPercent = 0;
        gradient = 'conic-gradient(' + safeData.map((d, i) => {
            const start = currentPercent;
            const size = (d.value / total) * 100;
            currentPercent += size;
            return `${colors[i % colors.length]} ${start}% ${currentPercent}%`;
        }).join(', ') + ')';
    }

    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4 flex flex-col items-center">
            <h3 className="text-gray-600 dark:text-gray-400 text-xs font-semibold mb-3 self-start">{title}</h3>
            <div className="w-32 h-32 rounded-full border-8 border-gray-100 dark:border-zinc-800 flex items-center justify-center relative mb-4">
                <div className="absolute inset-2 rounded-full opacity-80"
                    style={{ background: gradient }}>
                </div>
                <div className="z-10 bg-white dark:bg-zinc-900 rounded-full w-16 h-16 flex items-center justify-center font-bold text-gray-500 text-sm">
                    {isEmpty ? "-" : total}
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-2 justify-center text-[9px] text-gray-500 w-full">
                {!isEmpty && safeData.map((d, i) => (
                    <div key={i} className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i % colors.length] }}></div>
                        {d.name} ({d.value})
                    </div>
                ))}
                {isEmpty && <span>Veri Yok</span>}
            </div>
        </div>
    )
}

export default function RightSidebarExtended({ ageStats, bookingsMadeToday, folioTypes, repeaterCount, boardStats }: RightSidebarExtendedProps) {
    return (
        <div className="space-y-4 mt-4">
            <PieWidget
                title="Pansiyon Durumu"
                colors={['#10B981', '#3B82F6', '#F59E0B', '#EF4444']}
                data={boardStats}
            />
            <PieWidget
                title="Yaş Dağılımı"
                colors={['#F97316', '#22C55E', '#EF4444', '#3B82F6']}
                data={ageStats}
            />
            <PieWidget
                title="Bugün Alınan Rezervasyonlar"
                colors={['#3B82F6', '#6366F1', '#EC4899', '#8B5CF6']}
                data={bookingsMadeToday}
            />
            <PieWidget
                title="Günlük Beklenen Folyo Tipleri"
                colors={['#F59E0B', '#A855F7', '#EF4444']}
                data={folioTypes}
            />

            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4">
                <h3 className="text-gray-600 dark:text-gray-400 text-xs font-semibold mb-3">Repeater Misafir</h3>
                <div className="flex items-center justify-center h-24 flex-col gap-2">
                    <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                        {repeaterCount !== undefined ? repeaterCount : "-"}
                    </span>
                    <span className="text-xs text-gray-400">Tekrar Gelen Misafir</span>
                </div>
            </div>
        </div>
    );
}
