"use client";

import { useState } from "react";
import { FaSearch, FaArrowRight, FaFileInvoiceDollar, FaGlassMartiniAlt, FaSignOutAlt, FaCheck } from "react-icons/fa";
import { Input } from "@/components/ui/Input";

// Mock Data
const MOCK_DEPARTURES = [
    { id: "RES-010", guest: "Mehmet Demir", room: "105", balance: 0, status: "Hazır" },
    { id: "RES-011", guest: "Ayşe Kaya", room: "302", balance: 450, status: "Ödeme Bekliyor" },
];

export default function CheckOutPage() {
    const [selectedRes, setSelectedRes] = useState<typeof MOCK_DEPARTURES[0] | null>(null);

    const handleCheckOut = () => {
        alert("Check-out işlemi başarıyla tamamlandı ve fatura oluşturuldu!");
        setSelectedRes(null);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Check-out İşlemi</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Search & List */}
                <div className="space-y-4">
                    {/* Search Box */}
                    <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Oda No veya İsim..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                    </div>

                    {/* Today's Departure List */}
                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-zinc-800/50">
                            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Bugünkü Çıkışlar</h3>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                            {MOCK_DEPARTURES.map((res) => (
                                <div
                                    key={res.id}
                                    onClick={() => setSelectedRes(res)}
                                    className={`p-4 cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors ${selectedRes?.id === res.id ? 'bg-orange-50 dark:bg-orange-900/20' : ''}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{res.guest}</p>
                                            <p className="text-xs text-gray-500">Oda: {res.room}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-xs font-bold px-2 py-1 rounded ${res.balance > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                {res.balance > 0 ? `₺${res.balance}` : "Ödendi"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Check-out Process Form */}
                <div className="lg:col-span-2">
                    {selectedRes ? (
                        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col h-full">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedRes.guest}</h2>
                                    <p className="text-sm text-gray-500">Oda {selectedRes.room} - Çıkış İşlemleri</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">Kalan Bakiye</p>
                                    <p className={`text-xl font-bold ${selectedRes.balance > 0 ? "text-red-600" : "text-green-600"}`}>
                                        ₺{selectedRes.balance.toLocaleString('tr-TR')}
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 flex-1 space-y-6">

                                {/* Step 1: Minibar & Extras Check */}
                                <div className="flex gap-4 items-start">
                                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600">
                                        <FaGlassMartiniAlt size={20} />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <h3 className="font-semibold">Son Harcama Kontrolü</h3>
                                        <p className="text-sm text-gray-500">Çıkış öncesi mini bar veya son dakika harcaması var mı?</p>
                                        <div className="flex flex-wrap gap-2">
                                            <button className="px-3 py-1 text-sm border border-gray-200 dark:border-zinc-700 rounded hover:bg-gray-50">Mini Bar Ekle</button>
                                            <button className="px-3 py-1 text-sm border border-gray-200 dark:border-zinc-700 rounded hover:bg-gray-50">Hasar Kaydı Gir</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100 dark:bg-zinc-800" />

                                {/* Step 2: Invoicing */}
                                <div className="flex gap-4 items-start">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
                                        <FaFileInvoiceDollar size={20} />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <h3 className="font-semibold">Fatura ve Ödeme</h3>
                                        {selectedRes.balance > 0 ? (
                                            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                                                <p className="text-sm text-red-800 dark:text-red-300 font-medium mb-2">Ödenmesi Gereken Tutar Bulunmaktadır</p>
                                                <div className="flex gap-2">
                                                    <button className="px-3 py-1.5 bg-white shadow-sm rounded text-sm text-gray-700">Nakit</button>
                                                    <button className="px-3 py-1.5 bg-white shadow-sm rounded text-sm text-gray-700">Kredi Kartı</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-green-600">
                                                <FaCheck />
                                                <span className="text-sm font-medium">Bakiye ödenmiş. Fatura kesilebilir.</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100 dark:bg-zinc-800" />
                            </div>

                            <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900/50 flex justify-end gap-3 rounded-b-xl">
                                <button
                                    onClick={() => setSelectedRes(null)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={handleCheckOut}
                                    disabled={selectedRes.balance > 0}
                                    className={`px-6 py-2 text-white font-bold rounded-lg shadow-md transition-all flex items-center gap-2 ${selectedRes.balance > 0
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-orange-600 hover:bg-orange-700 hover:shadow-lg"
                                        }`}
                                >
                                    <FaSignOutAlt /> Check-out Tamamla
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center text-gray-400 p-12 text-center">
                            <FaArrowRight size={48} className="mb-4 opacity-20" />
                            <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">İşlem Yapılacak Odayı Seçin</h3>
                            <p className="text-sm mt-2">Sol taraftaki listeden çıkış yapacak odayı seçin.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
