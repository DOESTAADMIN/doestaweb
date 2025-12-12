"use client";

import GuestTable from "@/components/guests/GuestTable";
import { FaUserPlus, FaSearch, FaFilter, FaDownload } from "react-icons/fa";

export default function GuestsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Misafir Veritabanı</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tüm misafir kayıtları ve geçmişleri.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-zinc-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-zinc-700">
                        <span className="flex items-center gap-2">
                            <FaDownload /> Dışa Aktar
                        </span>
                    </button>
                    <button className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors">
                        <span className="flex items-center gap-2">
                            <FaUserPlus /> Yeni Misafir
                        </span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Ad, Soyad, TC No veya Telefon ile ara..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white outline-none">
                            <option value="">Tümü</option>
                            <option value="vip">Sadece VIP</option>
                        </select>
                        <button className="px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700">
                            <FaFilter />
                        </button>
                    </div>
                </div>

                <GuestTable />
            </div>
        </div>
    );
}
