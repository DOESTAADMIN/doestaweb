"use client";

import FolioList from "@/components/folios/FolioList";
import { FaSearch, FaFilter } from "react-icons/fa";

export default function FoliosPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Folyolar ve Faturalar</h1>
                    <p className="text-sm text-gray-500">Tüm oda harcamalarını ve fatura işlemlerini yönetin.</p>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Folyo No, Oda veya Misafir Ara..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-zinc-900"
                    />
                </div>
                <button className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <FaFilter /> Filtrele
                </button>
            </div>

            <FolioList />
        </div>
    );
}
