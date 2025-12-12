"use client";

import { useState, useEffect } from "react";
import { rateService } from "@/lib/api";
import { FaTag, FaInfoCircle, FaCalendarCheck } from "react-icons/fa";

interface Rate {
    id: number;
    code: string;
    name: string;
    basePrice: number;
    currency: string;
    boardType: string;
}

export default function RateList() {
    const [rates, setRates] = useState<Rate[]>([]);

    useEffect(() => {
        loadRates();
    }, []);

    const loadRates = async () => {
        try {
            const res = await rateService.getAll();
            setRates(res.data);
            if (res.data.length === 0) {
                await rateService.seed();
                const res2 = await rateService.getAll();
                setRates(res2.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rates.map((rate) => (
                <div key={rate.id} className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-blue-200 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                            <FaTag size={20} />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">{rate.basePrice} {rate.currency}</span>
                    </div>

                    <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-1">{rate.name}</h3>
                    <p className="text-sm text-gray-400 font-mono mb-4">{rate.code}</p>

                    <div className="bg-gray-50 dark:bg-zinc-800 p-3 rounded-lg text-xs text-gray-500 flex items-start gap-2">
                        <FaInfoCircle className="mt-0.5" />
                        Pansiyon: {rate.boardType}
                    </div>
                </div>
            ))}

            {/* Add New Card */}
            <div className="bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-gray-400 hover:border-blue-300 hover:text-blue-500 hover:bg-white dark:hover:bg-zinc-900 transition-all cursor-pointer">
                <FaCalendarCheck size={32} className="mb-2" />
                <span className="font-semibold">Yeni Fiyat Kodu Ekle</span>
            </div>
        </div>
    );
}
