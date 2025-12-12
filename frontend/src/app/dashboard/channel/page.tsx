"use client";
import { FaGlobe, FaSync } from "react-icons/fa";

export default function ChannelPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kanal Yöneticisi</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                    <FaSync /> Şimdi Eşitle
                </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
                <FaGlobe size={64} className="mx-auto mb-6 text-blue-500 opacity-50" />
                <h2 className="text-xl font-bold mb-2">Online Kanal Bağlantısı</h2>
                <p className="text-gray-500 max-w-lg mx-auto mb-6">Booking.com, Expedia, Airbnb ve diğer OTA kanalları ile fiyat ve müsaitlik eşitlemesi buradan yönetilir. API bağlantısı gerektirir.</p>

                <div className="flex justify-center gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <span className="font-bold text-blue-700 block">Booking</span>
                        <span className="text-xs text-green-600 font-bold">● Bağlı</span>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                        <span className="font-bold text-yellow-700 block">Expedia</span>
                        <span className="text-xs text-green-600 font-bold">● Bağlı</span>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                        <span className="font-bold text-red-700 block">Hotels</span>
                        <span className="text-xs text-red-400 font-bold">● Hata</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
