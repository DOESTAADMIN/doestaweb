"use client";

import React from "react";
import { FaPrint, FaSync, FaFileExcel, FaChevronUp, FaFilter } from "react-icons/fa";

interface DashboardBottomTablesProps {
    data: any[];
    loading: boolean;
    onRefresh: () => void;
}

export default function DashboardBottomTables({ data, loading, onRefresh }: DashboardBottomTablesProps) {

    if (loading || !data) return <div className="text-xs text-center p-4">Yükleniyor...</div>;

    // Extract dynamic headers from the first data item
    const [collapsed, setCollapsed] = React.useState(false);

    // Extract dynamic headers from the first data item
    const roomTypes = data.length > 0 && data[0].types ? Object.keys(data[0].types) : [];

    // Handlers
    const handlePrint = () => window.print();

    const handleExcel = () => {
        if (!data || data.length === 0) return;
        // Simple CSV construction
        const headers = ["Tarih", "Toplam Boş", "Toplam Dolu", ...roomTypes.flatMap(t => [`${t} Boş`, `${t} Dolu`])];
        const rows = data.map(row => {
            const rowData = [
                row.date,
                row.total.empty,
                row.total.full,
                ...roomTypes.flatMap(type => {
                    const stats = row.types[type] || { empty: 0, full: 0 };
                    return [stats.empty, stats.full];
                })
            ];
            return rowData.join(",");
        });

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "musaitlik_raporu.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-4">
            {/* Oda Tipi Müsaitlik */}
            <div className={`bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4 transition-all duration-300 ${collapsed ? "h-16 overflow-hidden" : ""}`}>
                <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-zinc-800 pb-2">
                    <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold">Oda Tipi Müsaitlik (7 Günlük)</h3>
                    <div className="flex gap-2 text-gray-500">
                        <button onClick={handlePrint} className="hover:text-blue-600" title="Yazdır"><FaPrint /></button>
                        <button onClick={onRefresh} className="hover:text-blue-600" title="Yenile"><FaSync /></button>
                        <button onClick={handleExcel} className="hover:text-green-600" title="Excel İndir"><FaFileExcel /></button>
                        <button onClick={() => setCollapsed(!collapsed)} className={`hover:text-blue-600 transition-transform ${collapsed ? "rotate-180" : ""}`} title={collapsed ? "Genişlet" : "Daralt"}><FaChevronUp /></button>
                    </div>
                </div>

                {!collapsed && (
                    <>
                        {/* Filters Mock */}
                        <div className="bg-gray-50 dark:bg-zinc-800/50 p-3 rounded mb-4 text-xs flex gap-4 items-center text-gray-500">
                            <span className="font-bold flex items-center gap-1"><FaFilter /> Tarih Aralığı</span>
                            {data.length > 0 && (
                                <>
                                    <span>Başlangıç: <b className="text-gray-700 dark:text-gray-300">{data[0].date}</b></span>
                                    <span>Bitiş: <b className="text-gray-700 dark:text-gray-300">{data[data.length - 1].date}</b></span>
                                </>
                            )}
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-center border-collapse">
                                <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-500 font-semibold border-b border-gray-200 dark:border-zinc-700">
                                    <tr>
                                        <th className="p-2 border-r dark:border-zinc-700 text-left min-w-[100px]">Tarih</th>
                                        <th className="p-2 border-r dark:border-zinc-700" colSpan={2}>Toplam</th>
                                        {roomTypes.map(type => (
                                            <th key={type} className="p-2 border-r dark:border-zinc-700" colSpan={2}>{type}</th>
                                        ))}
                                    </tr>
                                    <tr className="text-[10px] text-gray-400">
                                        <th className="p-1 border-r dark:border-zinc-700"></th>
                                        <th className="p-1 border-r dark:border-zinc-700">Boş</th>
                                        <th className="p-1 border-r dark:border-zinc-700">Dolu</th>
                                        {roomTypes.map(type => (
                                            <React.Fragment key={type}>
                                                <th className="p-1 border-r dark:border-zinc-700">Boş</th>
                                                <th className="p-1 border-r dark:border-zinc-700">Dolu</th>
                                            </React.Fragment>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                                    {data.map((row, i) => (
                                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-zinc-800/30">
                                            <td className="p-2 border-r dark:border-zinc-700 text-left text-gray-500 font-medium">{row.date}</td>
                                            <td className="p-2 border-r dark:border-zinc-700 text-blue-600 bg-blue-50/30 font-bold">{row.total.empty}</td>
                                            <td className="p-2 border-r dark:border-zinc-700 text-red-600">{row.total.full}</td>
                                            {roomTypes.map(type => {
                                                const stats = row.types[type] || { empty: 0, full: 0 };
                                                return (
                                                    <React.Fragment key={type}>
                                                        <td className="p-2 border-r dark:border-zinc-700 text-gray-700">{stats.empty}</td>
                                                        <td className="p-2 border-r dark:border-zinc-700 text-gray-400">{stats.full > 0 ? stats.full : '-'}</td>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>

            {/* Call Center Takipleri */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg p-4">
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-4">Call Center Takipleri</h3>
                <div className="h-20 flex items-center justify-center text-gray-400 text-xs text-center border border-dashed rounded">
                    Kayıt bulunamadı
                </div>
            </div>
        </div>
    );
}
