"use client";

import { FaUtensils, FaArrowRight, FaSearch } from "react-icons/fa";

export default function RecipesPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reçeteler</h1>
                    <p className="text-sm text-gray-500">Ürün maliyet ve üretim reçeteleri.</p>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-4">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input className="pl-10 pr-4 py-2 w-full border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Menü Ürünü Ara..." />
                    </div>
                </div>

                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-500 font-bold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Ürün Adı</th>
                            <th className="px-6 py-4">Kategori</th>
                            <th className="px-6 py-4">Satış Fiyatı</th>
                            <th className="px-6 py-4">Maliyet</th>
                            <th className="px-6 py-4">Karlılık</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        {[
                            { name: "Izgara Köfte", cat: "Ana Yemek", sale: 350, cost: 125, profit: 64 },
                            { name: "Mercimek Çorbası", cat: "Çorba", sale: 120, cost: 15, profit: 87 },
                            { name: "Sezar Salata", cat: "Salata", sale: 240, cost: 65, profit: 73 },
                            { name: "Sütlaç", cat: "Tatlı", sale: 150, cost: 35, profit: 76 },
                        ].map((rec, i) => (
                            <tr key={i} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                                <td className="px-6 py-4 font-bold flex items-center gap-2">
                                    <FaUtensils className="text-orange-400" /> {rec.name}
                                </td>
                                <td className="px-6 py-4">{rec.cat}</td>
                                <td className="px-6 py-4 font-bold">₺{rec.sale}</td>
                                <td className="px-6 py-4 text-red-600">₺{rec.cost}</td>
                                <td className="px-6 py-4">
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                        <div className={`bg-green-500 h-2 rounded-full`} style={{ width: `${rec.profit}%` }} />
                                    </div>
                                    <span className="text-xs text-green-600 font-bold">%{rec.profit}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-xs border border-blue-200 flex items-center gap-1 ml-auto">
                                        Reçete <FaArrowRight size={10} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
