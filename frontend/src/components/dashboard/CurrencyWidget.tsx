"use client";

import { FaArrowUp, FaArrowDown, FaEuroSign, FaDollarSign, FaPoundSign } from "react-icons/fa";

export default function CurrencyWidget() {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm h-full flex flex-col">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center justify-between">
                Döviz Kurları
                <span className="text-[10px] bg-green-100 text-green-700 px-1.5 rounded">Canlı</span>
            </h3>

            <div className="flex-1 space-y-2 overflow-y-auto min-h-0">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center text-xs">
                            <FaEuroSign />
                        </div>
                        <div>
                            <p className="font-bold text-xs text-gray-900 dark:text-white">EUR / TRY</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-xs text-gray-900 dark:text-white">35.42</p>
                        <p className="text-[9px] text-green-600 flex items-center justify-end gap-1 font-bold">
                            <FaArrowUp size={8} /> %0.2
                        </p>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 flex items-center justify-center text-xs">
                            <FaDollarSign />
                        </div>
                        <div>
                            <p className="font-bold text-xs text-gray-900 dark:text-white">USD / TRY</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-xs text-gray-900 dark:text-white">32.85</p>
                        <p className="text-[9px] text-green-600 flex items-center justify-end gap-1 font-bold">
                            <FaArrowUp size={8} /> %0.1
                        </p>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center text-xs">
                            <FaPoundSign />
                        </div>
                        <div>
                            <p className="font-bold text-xs text-gray-900 dark:text-white">GBP / TRY</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-xs text-gray-900 dark:text-white">41.12</p>
                        <p className="text-[9px] text-red-600 flex items-center justify-end gap-1 font-bold">
                            <FaArrowDown size={8} /> %0.05
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                <p className="text-[10px] text-gray-400 text-center">TCMB Kurları • 14:30</p>
            </div>
        </div>
    );
}
