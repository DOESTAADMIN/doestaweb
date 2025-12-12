"use client";

import { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUtensils } from "react-icons/fa";
import { MOCK_MENU, MenuItem } from "../data";

export default function MenuPage() {
    const [menu, setMenu] = useState<MenuItem[]>(MOCK_MENU);
    const [search, setSearch] = useState("");

    const filteredMenu = menu.filter(m =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Menü Yönetimi</h1>
                    <p className="text-sm text-gray-500">Restoran ve POS ürünlerini yönetin.</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                    <FaPlus /> Yeni Ürün
                </button>
            </div>

            {/* Toolbar */}
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Ürün Ara..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 w-64 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div className="flex gap-2">
                    {["All", "Main", "Starter", "Drink", "Dessert"].map(cat => (
                        <button key={cat} className="px-3 py-1 text-xs font-bold border rounded hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-500 font-bold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Ürün Adı</th>
                            <th className="px-6 py-4">Kategori</th>
                            <th className="px-6 py-4">Fiyat</th>
                            <th className="px-6 py-4">Durum</th>
                            <th className="px-6 py-4 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        {filteredMenu.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors group">
                                <td className="px-6 py-4 font-mono text-gray-400">#{item.id}</td>
                                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                                        <FaUtensils size={12} />
                                    </div>
                                    {item.name}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400">
                                        {item.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-mono font-bold text-blue-600">
                                    ₺{item.price.toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                    {item.available ? (
                                        <span className="text-green-600 font-bold text-xs flex items-center gap-1">Aktif</span>
                                    ) : (
                                        <span className="text-red-500 font-bold text-xs">Pasif</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded"><FaEdit /></button>
                                        <button className="p-2 text-red-600 hover:bg-red-50 rounded"><FaTrash /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
