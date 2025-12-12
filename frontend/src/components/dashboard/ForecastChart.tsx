"use client";

import React from "react";
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from "react-icons/fa";

interface ForecastChartProps {
    forecast: any[];
    loading: boolean;
    currentDate: Date;
    onDateChange: (date: Date) => void;
}

export default function ForecastChart({ forecast, loading, currentDate, onDateChange }: ForecastChartProps) {
    const maxValue = 70; // Benchmark for visualization

    const handlePrevClick = () => {
        const prev = new Date(currentDate);
        prev.setDate(prev.getDate() - 7); // Go back 1 week? Or 1 day? User said "Date navigation", usually means scrolling. Let's do 1 day for granular control or 7 for pagination. Logic showed 9 days. Let's do 1 day shifts.
        // Wait, the chart shows 9 days. Moving 1 day is smoother.
        prev.setDate(prev.getDate() - 1);
        onDateChange(prev);
    };

    const handleNextClick = () => {
        const next = new Date(currentDate);
        next.setDate(next.getDate() + 1);
        onDateChange(next);
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4 h-64 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Yükleniyor...</span>
            </div>
        );
    }

    const chartData = forecast ? forecast.map((f: any) => ({
        date: f.date,
        fullDate: f.fullDate,
        dolu: f.value,
        bos: Math.max(0, 40 - f.value),
        blok: 0,
        kapali: 0,
        arrivals: f.arrivals || 0,
        departures: f.departures || 0
    })) : [];

    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold flex items-center gap-2">
                    <span>📊</span> Müsaitlik (9 Gün)
                </h3>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs">
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-sky-300"></div> Dolu Oda</span>
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-200"></div> Boş Odalar</span>
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-purple-300"></div> Blok</span>
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-500"></div> Kapalı</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative flex items-center gap-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded px-2 py-1 text-xs hover:border-blue-500 transition-colors cursor-pointer group">
                            {/* Native Date Picker hidden but clickable covering the area */}
                            <input
                                type="date"
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                value={currentDate.toISOString().split('T')[0]}
                                onChange={(e) => {
                                    if (e.target.value) {
                                        onDateChange(new Date(e.target.value));
                                    }
                                }}
                            />
                            <span className="min-w-[80px] text-center group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                {currentDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                            <FaCalendarAlt className="text-gray-400 group-hover:text-blue-500" />
                        </div>
                        <button onClick={handlePrevClick} className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow-sm"><FaChevronLeft size={10} /></button>
                        <button onClick={handleNextClick} className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow-sm"><FaChevronRight size={10} /></button>
                    </div>
                </div>
            </div>

            <div className="relative h-64 w-full">
                {/* Y-Axis Grid Lines */}
                {[0, 10, 20, 30, 40, 50, 60, 70].map((val, i) => (
                    <div key={i} className="absolute w-full border-b border-gray-100 dark:border-zinc-800 flex items-center" style={{ bottom: `${(val / maxValue) * 100}%` }}>
                        <span className="absolute -left-6 text-[10px] text-gray-400">{val}</span>
                    </div>
                ))}

                {/* Bars */}
                <div className="absolute inset-0 flex items-end justify-around pl-6 pt-4 pb-6">
                    {chartData.map((item, idx) => {
                        return (
                            <div key={idx} className="flex flex-col items-center gap-2 w-12 h-full justify-end group">
                                <div className="w-full flex flex-col justify-end h-full relative">
                                    {/* Stacked Bars */}
                                    {item.kapali > 0 && <div style={{ height: `${(item.kapali / maxValue) * 100}%` }} className="w-full bg-gray-500 shadow-sm relative group-hover:opacity-90 transition-opacity">
                                        {item.kapali > 5 && <span className="absolute inset-0 flex items-center justify-center text-[9px] text-white">{item.kapali}</span>}
                                    </div>}
                                    {item.blok > 0 && <div style={{ height: `${(item.blok / maxValue) * 100}%` }} className="w-full bg-purple-300 shadow-sm relative group-hover:opacity-90 transition-opacity">
                                        <span className="absolute inset-0 flex items-center justify-center text-[9px] text-purple-900 font-bold">{item.blok}</span>
                                    </div>}
                                    {item.bos > 0 && <div style={{ height: `${(item.bos / maxValue) * 100}%` }} className="w-full bg-yellow-100 border-t border-yellow-200 shadow-sm relative group-hover:opacity-90 transition-opacity">
                                        <span className="absolute inset-0 flex items-center justify-center text-[9px] text-yellow-700 font-bold">{item.bos}</span>
                                    </div>}
                                    {item.dolu > 0 && <div style={{ height: `${(item.dolu / maxValue) * 100}%` }} className="w-full bg-sky-300 shadow-sm relative group-hover:opacity-90 transition-opacity">
                                        <span className="absolute inset-0 flex items-center justify-center text-[9px] text-sky-900 font-bold">{item.dolu}</span>
                                    </div>}
                                </div>
                                <span className="text-[10px] text-gray-500 font-medium">{item.date}</span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Geliş - Ayrılış (Smaller Chart Below) */}
            <div className="mt-8">
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold flex items-center gap-2 mb-4">
                    <span>📊</span> Geliş - Ayrılış
                </h3>
                <div className="h-40 relative w-full border-t border-l border-gray-200 dark:border-zinc-800">
                    <div className="absolute inset-0 flex items-end justify-around pb-4 pl-2">
                        {chartData.map((item, idx) => {
                            // Scale factor for visibility: assume max 20 arrivals/departures?
                            const MAX_IO = 20;
                            const arrH = Math.min(100, (item.arrivals / MAX_IO) * 100);
                            const depH = Math.min(100, (item.departures / MAX_IO) * 100);

                            return (
                                <div key={idx} className="flex flex-col items-center gap-1 w-8 h-full justify-end group">
                                    <div className="flex gap-1 w-full items-end h-full justify-center">
                                        {/* Arrivals Bar */}
                                        <div style={{ height: `${arrH}%` }} className="w-3 bg-green-500 rounded-t relative group-hover:opacity-90">
                                            {item.arrivals > 0 && <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-gray-500 font-bold">{item.arrivals}</span>}
                                        </div>
                                        {/* Departures Bar */}
                                        <div style={{ height: `${depH}%` }} className="w-3 bg-red-400 rounded-t relative group-hover:opacity-90">
                                            {item.departures > 0 && <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-gray-500 font-bold">{item.departures}</span>}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="flex gap-4 justify-center mt-2 text-[10px] text-gray-500">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-sm"></div> Geliş</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-400 rounded-sm"></div> Ayrılış</div>
                </div>
            </div>
        </div>
    );
}
