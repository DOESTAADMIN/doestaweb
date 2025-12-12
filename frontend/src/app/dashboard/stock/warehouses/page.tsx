"use client";

import { useState, useEffect } from "react";
import { stockService } from "@/lib/api";
import { FaWarehouse } from "react-icons/fa";

interface Warehouse {
    id: number;
    name: string;
    type: string;
}

interface InventoryItem {
    id: number;
    product: { name: string; unit: string };
    quantity: number;
    warehouseId: number;
}

export default function WarehousesPage() {
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [selectedWh, setSelectedWh] = useState<number | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (selectedWh) loadInventory(selectedWh);
    }, [selectedWh]);

    const loadData = async () => {
        try {
            const res = await stockService.getWarehouses();
            setWarehouses(res.data);
            if (res.data.length === 0) {
                await stockService.seed();
                const res2 = await stockService.getWarehouses();
                setWarehouses(res2.data);
            }
            if (res.data.length > 0) setSelectedWh(res.data[0].id);
        } catch (error) {
            console.error(error);
        }
    };

    const loadInventory = async (whId: number) => {
        try {
            const res = await stockService.getInventory(whId);
            setInventory(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Depolar</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Warehouse List */}
                <div className="space-y-4">
                    {warehouses.map(wh => (
                        <div
                            key={wh.id}
                            onClick={() => setSelectedWh(wh.id)}
                            className={`p-4 rounded-xl border border-gray-200 dark:border-gray-800 cursor-pointer transition-all flex items-center gap-4 ${selectedWh === wh.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-white dark:bg-zinc-900 hover:bg-gray-50'
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${selectedWh === wh.id ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>
                                <FaWarehouse size={20} />
                            </div>
                            <div>
                                <div className="font-bold text-lg">{wh.name}</div>
                                <div className={`text-xs ${selectedWh === wh.id ? 'text-blue-100' : 'text-gray-500'}`}>{wh.type} DEPO</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Inventory List */}
                <div className="md:col-span-2 bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                    <h3 className="font-bold border-b pb-4 mb-4">Depo Mevcudu</h3>
                    <table className="w-full text-left text-sm">
                        <thead className="text-gray-500">
                            <tr>
                                <th className="pb-2">Ürün</th>
                                <th className="pb-2 text-right">Miktar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {inventory.map(item => (
                                <tr key={item.id}>
                                    <td className="py-3 font-medium">{item.product?.name}</td>
                                    <td className="py-3 text-right">
                                        <span className={`font-bold ${item.quantity < 0 ? 'text-red-500' : 'text-green-600'}`}>
                                            {item.quantity} {item.product?.unit}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {inventory.length === 0 && (
                                <tr>
                                    <td colSpan={2} className="py-8 text-center text-gray-400">Bu depoda henüz stok hareketi yok.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
