"use client";

import { FaChartBar, FaFileDownload, FaFilter } from "react-icons/fa";

export default function GenericReportPage({ title, description }: { title: string, description: string }) {
    return (
        <div className="flex flex-col h-full bg-white dark:bg-zinc-950 p-4 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <FaChartBar className="text-blue-600" />
                        {title}
                    </h1>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm text-gray-700 font-bold">
                        <FaFilter /> Filtrele
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white font-bold shadow-sm">
                        <FaFileDownload /> PDF İndir
                    </button>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-zinc-900/50">
                <div className="text-center text-gray-400">
                    <FaChartBar size={48} className="mx-auto mb-2 opacity-50" />
                    <p className="font-medium">Rapor verileri hazırlanıyor...</p>
                    <p className="text-xs">Lütfen tarih aralığı seçiniz.</p>
                </div>
            </div>
        </div>
    );
}
