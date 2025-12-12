"use client";

import RateList from "@/components/settings/RateList";
import { FaPlus } from "react-icons/fa";

export default function RatesPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fiyat Kodları ve Kurallar</h1>
                    <p className="text-sm text-gray-500">Günlük fiyatlar, promosyonlar ve kısıtlamaları yönetin.</p>
                </div>
            </div>

            <RateList />
        </div>
    );
}
