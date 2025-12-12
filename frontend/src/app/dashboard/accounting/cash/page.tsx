"use client";

import { FaMoneyBillAlt, FaArrowRight, FaHistory, FaLandmark, FaWallet, FaPrint } from "react-icons/fa";

export default function CashPage() {
    return (
        <div className="flex flex-col h-full space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600">
                    <FaWallet />
                </div>
                Kasa İşlemleri (Cash Management)
            </h1>

            {/* Cash Balances - Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Cash TL */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><FaMoneyBillAlt size={80} /></div>
                    <p className="font-medium text-emerald-100">Ana Kasa (TL)</p>
                    <h2 className="text-4xl font-bold mt-2">₺ 14,250.00</h2>
                    <div className="mt-6 flex gap-2">
                        <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-bold backdrop-blur-sm transition-colors">Para Ekle</button>
                        <button className="bg-white text-emerald-600 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:scale-105 transition-transform">Banka Teslim</button>
                    </div>
                </div>

                {/* Forex EUR */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <p className="font-bold text-gray-500 uppercase text-xs tracking-wider">EUR Kasa</p>
                            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold">Döviz</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">€ 2,450.00</h2>
                        <p className="text-xs text-gray-400 mt-1">≈ ₺ 85,750 (Kur: 35.00)</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button className="flex-1 bg-gray-50 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 py-2 rounded-lg text-xs font-bold transition-colors">İşlem Yap</button>
                    </div>
                </div>

                {/* Forex USD */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <p className="font-bold text-gray-500 uppercase text-xs tracking-wider">USD Kasa</p>
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold">Döviz</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">$ 850.00</h2>
                        <p className="text-xs text-gray-400 mt-1">≈ ₺ 27,200 (Kur: 32.00)</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button className="flex-1 bg-gray-50 hover:bg-gray-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 py-2 rounded-lg text-xs font-bold transition-colors">İşlem Yap</button>
                    </div>
                </div>
            </div>

            {/* Recent Cash Flow - List */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm flex-1 flex flex-col">
                <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-zinc-900/50">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <FaHistory className="text-gray-400" />
                        Nakit Hareketleri (Bugün)
                    </h3>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors"><FaPrint /></button>
                </div>

                <div className="flex-1 overflow-auto p-0">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-default transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i % 2 === 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                    <FaMoneyBillAlt />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white text-sm">{i % 2 === 0 ? 'Kasa Çıkış (Gider)' : 'Tahsilat (Oda 205)'}</p>
                                    <p className="text-xs text-gray-500">14:3{i} • Kasiyer: Ahmet</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-mono font-bold ${i % 2 === 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {i % 2 === 0 ? '-' : '+'} ₺ {i * 150}.00
                                </p>
                                <p className="text-[10px] text-gray-400 font-bold bg-gray-100 dark:bg-zinc-800 px-1.5 rounded inline-block">NAKİT</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-b-2xl border-t border-gray-100 dark:border-gray-800 text-center">
                    <button className="text-blue-600 text-sm font-bold hover:underline">Tüm Hareketleri Gör</button>
                </div>
            </div>
        </div>
    );
}
