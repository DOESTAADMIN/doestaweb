"use client";

import { FaTools, FaExclamationTriangle, FaPlus, FaSearch } from "react-icons/fa";

export default function JobOrdersPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Teknik Servis İş Emirleri</h1>
                    <p className="text-sm text-gray-500">Arıza ve bakım talepleri yönetimi.</p>
                </div>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700">
                    <FaPlus /> Arıza Bildir
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Status Columns */}
                {["Açık", "İşlemde", "Tamamlandı"].map(status => (
                    <div key={status} className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col h-[calc(100vh-12rem)]">
                        <div className={`p-4 border-b border-gray-100 dark:border-gray-800 font-bold flex justify-between items-center ${status === 'Açık' ? 'text-red-600 bg-red-50 dark:bg-red-900/10' :
                                status === 'İşlemde' ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/10' :
                                    'text-green-600 bg-green-50 dark:bg-green-900/10'
                            }`}>
                            {status} Talepler
                            <span className="text-xs bg-white px-2 py-0.5 rounded shadow-sm text-gray-600">3</span>
                        </div>

                        <div className="p-2 flex-1 overflow-y-auto space-y-2 bg-gray-50 dark:bg-zinc-950/50">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white dark:bg-zinc-900 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 cursor-pointer hover:border-blue-400 group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-gray-400">#TK-10{i}</span>
                                        <span className="text-xs bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-gray-500">Oda 10{i}</span>
                                    </div>
                                    <div className="flex items-start gap-2 mb-2">
                                        <FaExclamationTriangle className="text-orange-500 mt-1 flex-shrink-0" size={12} />
                                        <p className="text-sm font-medium leading-tight">Klima su akıtıyor, halı ıslanmış.</p>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-gray-400">
                                        <span>HK - Ayşe Y.</span>
                                        <span>12:30</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
