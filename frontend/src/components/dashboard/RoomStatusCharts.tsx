"use client";

import React from "react";

interface RoomStatusChartsProps {
    stats: any;
    loading: boolean;
}

const PieChart = ({ data, title }: { data: { value: number; color: string; label: string }[], title: string }) => {
    // Basic SVG Pie logic
    let cumulativePercent = 0;
    const total = data.reduce((acc, curr) => acc + curr.value, 0);

    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    const slices = data.map((slice, i) => {
        if (slice.value === 0 || total === 0) return null;
        const startPercent = cumulativePercent;
        const slicePercent = slice.value / total;
        cumulativePercent += slicePercent;
        const endPercent = cumulativePercent;

        const [startX, startY] = getCoordinatesForPercent(startPercent);
        const [endX, endY] = getCoordinatesForPercent(endPercent);

        if (slicePercent >= 0.999) { // Full circle
            return <circle key={i} cx="0" cy="0" r="1" fill={slice.color} />;
        }

        const largeArcFlag = slicePercent > 0.5 ? 1 : 0;

        const pathData = [
            `M 0 0`,
            `L ${startX} ${startY}`,
            `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
            `Z`
        ].join(' ');

        return <path key={i} d={pathData} fill={slice.color} />;
    });

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
                <svg viewBox="-1.1 -1.1 2.2 2.2" className="w-full h-full transform -rotate-90">
                    {total === 0 ? <circle cx="0" cy="0" r="1" fill="#e5e7eb" /> : slices}
                </svg>
            </div>
            <div className="text-xs text-gray-500 text-center mb-2">{title}</div>

            <div className="space-y-1 w-full max-w-[150px]">
                {data.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-[10px]">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
                        </div>
                        <span className="font-bold">({item.value})</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function RoomStatusCharts({ stats, loading }: RoomStatusChartsProps) {
    if (loading && !stats.totalRooms) {
        return <div className="h-full bg-gray-100 dark:bg-zinc-800 rounded animate-pulse"></div>;
    }

    const roomStatusData = [
        { label: "Dolu Oda", value: ((stats.totalRooms || 0) - (stats.emptyRooms || 0)), color: "#3B82F6" }, // Blue
        { label: "Boş Oda", value: stats.emptyRooms || 0, color: "#E5E7EB" }, // Gray
        { label: "Blok Oda", value: stats.maintenanceCount || 0, color: "#EF4444" }, // Red
    ];

    const cleanStatusData = [
        { label: "Clean", value: stats.cleanCount || 0, color: "#0EA5E9" },   // Sky Blue
        { label: "Dirty", value: stats.dirtyCount || 0, color: "#EF4444" },   // Red 
    ];

    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4 h-full">
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-6">Oda Durum</h3>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
                <PieChart data={roomStatusData} title="Genel Durum" />
                <PieChart data={cleanStatusData} title="Temizlik Durumu" />
            </div>
        </div>
    );
}
