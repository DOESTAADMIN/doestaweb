"use client";

import { useState, useEffect } from "react";
import { posTableService } from "@/lib/api";
import { FaChair } from "react-icons/fa";

interface PosTable {
    id: number;
    name: string;
    zone: string;
    capacity: number;
    status: string;
    currentBillAmount: number;
}

export default function TablesPage() {
    const [tables, setTables] = useState<PosTable[]>([]);

    useEffect(() => {
        loadTables();
    }, []);

    const loadTables = async () => {
        try {
            const res = await posTableService.getAll();
            setTables(res.data);
            if (res.data.length === 0) {
                // Auto seed on first load if empty
                await posTableService.seed();
                const res2 = await posTableService.getAll();
                setTables(res2.data);
            }
        } catch (error) {
            console.error("Failed tables", error);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Masa Planı</h1>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {tables.map(table => (
                    <div
                        key={table.id}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative overflow-hidden ${table.status === 'Occupied'
                                ? 'bg-red-50 border-red-500 text-red-700'
                                : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-gray-800 hover:border-blue-400'
                            }`}
                    >
                        <div className="flex justify-between mb-4">
                            <span className="font-bold text-lg">{table.name}</span>
                            <span className="text-xs bg-black/10 px-2 py-0.5 rounded">{table.capacity} Kişi</span>
                        </div>

                        <div className="flex items-center justify-center py-4">
                            <FaChair size={32} className={`opacity-20 ${table.status === 'Occupied' ? 'text-red-600' : 'text-gray-400'}`} />
                        </div>

                        {table.status === 'Occupied' && (
                            <div className="absolute bottom-0 left-0 w-full bg-red-500 text-white text-center text-sm font-bold py-1">
                                {table.currentBillAmount} ₺
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
