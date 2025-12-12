"use client";

import React from "react";

interface OccupancyChartsProps {
    forecast: any[];
    accommodationStats: any;
    boardStats: any[];
    loading: boolean;
}

// Bar Chart Component (Generic)
const BarChart = ({ title, legend, data, xLabels }: { title: string, legend?: React.ReactNode, data: number[], xLabels?: string[] }) => {

    if (!data || data.length === 0) {
        return (
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4 h-64 flex flex-col items-center justify-center">
                <span className="text-xs text-gray-400">Loading chart...</span>
            </div>
        );
    }

    const maxVal = Math.max(...data, 10); // Minimum scale of 10 to avoid flat lines

    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4 h-64 flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold flex items-center gap-2">
                    <span>📊</span> {title}
                </h3>
                {legend}
            </div>

            <div className="flex-1 relative border-l border-b border-gray-100 dark:border-zinc-800">
                <div className="absolute inset-0 flex items-end justify-around px-2 pb-2">
                    {data.map((val, i) => {
                        const height = (val / maxVal) * 80; // Scale to max 80% height
                        return (
                            <div key={i} className="w-8 bg-sky-200 dark:bg-sky-900/50 relative group flex items-end justify-center rounded-t-sm" style={{ height: `${height}%` }}>
                                <div className="absolute bottom-0 w-full bg-sky-400 group-hover:bg-sky-500 transition-colors" style={{ height: `${height * 0.6}%` }}></div>
                                <span className="text-[9px] mb-1 font-bold text-sky-900 dark:text-sky-100 z-10">{val}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
            {xLabels && (
                <div className="flex justify-around text-[9px] text-gray-400 mt-2">
                    {xLabels.map((lbl, i) => <span key={i}>{lbl}</span>)}
                </div>
            )}
        </div>
    );
}

export default function OccupancyCharts({ forecast, accommodationStats, boardStats, loading }: OccupancyChartsProps) {

    // 1. Forecast Data Mapping
    const forecastDates = forecast?.map((f: any) => f.date) || [];
    const forecastValues = forecast?.map((f: any) => f.value) || [];

    // 2. Accommodation Stats (Sold vs Comp vs House)
    const accStats = accommodationStats;
    const accommodationValues = accStats ? [accStats.sold, accStats.comp, accStats.house] : [];
    // Just 3 bars for Acc Stats

    // 3. Board Stats (Pansiyon)
    const bStats = boardStats || [];
    const boardLabels = bStats.map((b: any) => b.name);
    const boardValues = bStats.map((b: any) => b.value);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BarChart
                title="Doluluk Tahmini (9 Gün)"
                data={forecastValues}
                xLabels={forecastDates}
                legend={
                    <div className="flex gap-2 text-[10px]">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 bg-sky-400"></div> Dolu Odalar</span>
                    </div>
                }
            />
            <BarChart
                title="Konaklama Tipleri"
                data={accommodationValues}
                xLabels={["Sold", "Comp", "House"]}
                legend={
                    <div className="flex gap-2 text-[10px]">
                        <span className="text-gray-400">Satılan / Comp / House</span>
                    </div>
                }
            />
            <div className="md:col-span-2">
                <BarChart
                    title="Pansiyon Dağılımı"
                    data={boardValues}
                    xLabels={boardLabels}
                    legend={
                        <div className="flex gap-2 text-[10px]">
                            <span className="text-gray-400">Misafir Pansiyon Tipleri</span>
                        </div>
                    }
                />
            </div>
        </div>
    );
}
