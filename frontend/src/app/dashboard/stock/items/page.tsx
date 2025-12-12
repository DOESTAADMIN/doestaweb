"use client";

import { useState, useEffect } from "react";
import { productService } from "@/lib/api";
import { FaBox, FaSearch, FaBarcode, FaEdit } from "react-icons/fa";

interface Product {
    id: number;
    name: string;
    code: string;
    price: number;
    cost: number;
    category?: { name: string };
    unit: string;
}

export default function StockItemsPage() {
    const [items, setItems] = useState<Product[]>([]);

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            const res = await productService.getAll();
            setItems(res.data);
            if (res.data.length === 0) {
                await productService.seed();
                const res2 = await productService.getAll();
                setItems(res2.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stok Kartları</h1>

            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-500 font-bold">
                        <tr>
                            <th className="px-6 py-4">Kod</th>
                            <th className="px-6 py-4">Ürün Adı</th>
                            <th className="px-6 py-4">Grup</th>
                            <th className="px-6 py-4">Birim</th>
                            <th className="px-6 py-4 text-right">Maliyet</th>
                            <th className="px-6 py-4 text-right">Satış Fiyatı</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        {items.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                                <td className="px-6 py-4 font-mono text-gray-400">{item.code || `PRD-${item.id}`}</td>
                                <td className="px-6 py-4 font-bold flex items-center gap-3">
                                    <FaBox className="text-blue-200" />
                                    {item.name}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-bold">
                                        {item.category?.name || 'Genel'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{item.unit}</td>
                                <td className="px-6 py-4 text-right text-gray-500">{item.cost} ₺</td>
                                <td className="px-6 py-4 text-right font-bold text-blue-600">{item.price} ₺</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-blue-600"><FaEdit /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
