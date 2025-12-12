"use client";

import React from "react";

interface DailyStatusTableProps {
    stats: any;
    loading: boolean;
}

export default function DailyStatusTable({ stats, loading }: DailyStatusTableProps) {
    if (loading && !stats.inHouse) {
        return <div className="h-full bg-gray-100 dark:bg-zinc-800 rounded animate-pulse"></div>;
    }

    // Helper to calculate percentages relative to current Occupancy
    const getPercent = (val: number) => {
        // Simple visual formatting for percent, if value exists
        return val > 0 ? "%" + val : "%0";
    };

    const tableData = [
        { label: "Sabahki Durum", room: stats.morningStatus || 0, person: (stats.morningStatus || 0) * 2, percent: "%" + (stats.occupancy || 0) },
        { label: "Gerçekleşen Gelişler", room: stats.actualArrivals || 0, person: (stats.actualArrivals || 0) * 2, percent: getPercent(stats.actualArrivals || 0) },
        { label: "Bugün Ayrılmış Olanlar", room: stats.actualDepartures || 0, person: (stats.actualDepartures || 0) * 2, percent: getPercent(stats.actualDepartures || 0) },
        { label: "Şimdiki Durum", room: stats.inHouse || 0, person: (stats.inHouse || 0) * 2, percent: "%" + (stats.occupancy || 0), highlight: true },
        { label: "Bekleyen Gelişler", room: stats.expectedArrivals || 0, person: (stats.expectedArrivals || 0) * 2, percent: getPercent(stats.expectedArrivals || 0) },
        { label: "Bekleyen Çıkışlar", room: stats.expectedDepartures || 0, person: (stats.expectedDepartures || 0) * 2, percent: getPercent(stats.expectedDepartures || 0) },
        {
            label: "Gün Sonu",
            room: ((stats.inHouse || 0) + (stats.expectedArrivals || 0) - (stats.expectedDepartures || 0)),
            person: ((stats.inHouse || 0) + (stats.expectedArrivals || 0) - (stats.expectedDepartures || 0)) * 2,
            percent: "%" + (stats.occupancy || 0) // Should ideally be recalculated occupancy
        },
    ];

    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4 h-full">
            <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-4">Şimdiki Durum</h3>

            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-100 dark:border-zinc-800">
                        <th className="text-left font-normal text-gray-400 pb-2"></th>
                        <th className="text-center font-normal text-gray-400 pb-2">Oda</th>
                        <th className="text-center font-normal text-gray-400 pb-2">Kişi</th>
                        <th className="text-right font-normal text-gray-400 pb-2">Yüzde</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
                    {tableData.map((row, idx) => (
                        <tr key={idx} className={row.highlight ? "bg-gray-50 dark:bg-zinc-800/30 font-bold" : "hover:bg-gray-50 dark:hover:bg-zinc-800/30"}>
                            <td className={`py-3 ${row.highlight ? "text-gray-800 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>
                                {row.label}
                            </td>
                            <td className="text-center py-3">{row.room}</td>
                            <td className="text-center py-3">{row.person}</td>
                            <td className="text-right py-3 text-gray-500">{row.percent}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
