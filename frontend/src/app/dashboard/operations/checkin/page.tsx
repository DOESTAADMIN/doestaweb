"use client";

import { useState } from "react";
import { FaSearch, FaArrowRight, FaIdCard, FaKey, FaCheck, FaInfoCircle } from "react-icons/fa";
import { Input } from "@/components/ui/Input";

// Mock Data for Search
const MOCK_ARRIVALS = [
    { id: "RES-001", guest: "Ali Veli", room: "101", type: "Standard", status: "Bekliyor" },
    { id: "RES-002", guest: "Zeynep Yılmaz", room: "205", type: "Deluxe", status: "Bekliyor" },
    { id: "RES-003", guest: "Canan Dağ", room: "303", type: "Suite", status: "Geldi" },
];

export default function CheckInPage() {
    const [selectedRes, setSelectedRes] = useState<typeof MOCK_ARRIVALS[0] | null>(null);

    const handleCheckIn = () => {
        alert("Check-in işlemi başarıyla tamamlandı!");
        setSelectedRes(null);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Check-in İşlemi</h1>
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
                                placeholder="Rezervasyon No veya İsim..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-zinc-800 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Today's Arrival List */}
                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-zinc-800/50">
                            <h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Bugünkü Girişler</h3>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                            {MOCK_ARRIVALS.map((res) => (
                                <div
                                    key={res.id}
                                    onClick={() => setSelectedRes(res)}
                                    className={`p-4 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors ${selectedRes?.id === res.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{res.guest}</p>
                                            <p className="text-xs text-gray-500">{res.id}</p>
                                        </div>
                                        <span className="text-xs font-bold px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded text-gray-600 dark:text-gray-400">
                                            Oda {res.room}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Check-in Process Form */}
                <div className="lg:col-span-2">
                    {selectedRes ? (
                        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col h-full">
                            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedRes.guest}</h2>
                                    <p className="text-sm text-gray-500">{selectedRes.type} Oda - {selectedRes.room} numaralı odaya giriş</p>
                                </div>
                                <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                    Hazır
                                </div>
                            </div>

                            <div className="p-6 flex-1 space-y-6">

                                {/* Step 1: ID Check */}
                                <div className="flex gap-4 items-start">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
                                        <FaIdCard size={20} />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <h3 className="font-semibold">Kimlik Kontrolü</h3>
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" id="id_check" className="w-4 h-4 text-blue-600 rounded" />
                                            <label htmlFor="id_check" className="text-sm text-gray-700 dark:text-gray-300">Kimlik bilgileri doğrulandı ve fotokopisi alındı.</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100 dark:bg-zinc-800" />

                                {/* Step 2: Payment/Deposit */}
                                <div className="flex gap-4 items-start">
                                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-600">
                                        <span className="font-bold text-lg">₺</span>
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex justify-between">
                                            <h3 className="font-semibold">Ödeme & Depozito</h3>
                                            <span className="text-sm text-red-500 font-medium">Kalan Tutar: ₺4.500</span>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 block mb-1">Tahsil Edilen Tutar (Opsiyonel)</label>
                                            <Input type="number" placeholder="0.00" className="max-w-xs" />
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100 dark:bg-zinc-800" />

                                {/* Step 3: Key Handover */}
                                <div className="flex gap-4 items-start">
                                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600">
                                        <FaKey size={20} />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <h3 className="font-semibold">Anahtar Teslimi</h3>
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" id="key_check" className="w-4 h-4 text-orange-600 rounded" />
                                            <label htmlFor="key_check" className="text-sm text-gray-700 dark:text-gray-300">Oda anahtarı teslim edildi.</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg flex gap-3 text-sm text-blue-800 dark:text-blue-300">
                                    <FaInfoCircle className="mt-0.5 flex-shrink-0" />
                                    <p>Misafirin özel isteği: <strong>Deniz manzaralı oda.</strong> Şu anki oda (205) bu özelliği karşılıyor.</p>
                                </div>

                            </div>

                            <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900/50 flex justify-end gap-3 rounded-b-xl">
                                <button
                                    onClick={() => setSelectedRes(null)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-zinc-700 rounded-lg transition-colors"
                                >
                                    İptal
                                </button>
                                <button
                                    onClick={handleCheckIn}
                                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                                >
                                    <FaCheck /> Check-in Tamamla
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center text-gray-400 p-12 text-center">
                            <FaArrowRight size={48} className="mb-4 opacity-20" />
                            <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">İşlem Yapılacak Rezervasyonu Seçin</h3>
                            <p className="text-sm mt-2">Sol taraftaki listeden bir misafir seçerek check-in işlemine başlayabilirsiniz.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
