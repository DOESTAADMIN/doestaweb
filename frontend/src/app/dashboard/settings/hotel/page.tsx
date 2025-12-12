"use client";
import { FaHotel } from "react-icons/fa";

export default function HotelSettingsPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <FaHotel size={48} className="mb-4 opacity-20" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Otel Ayarları</h1>
            <p className="text-center">Genel otel bilgileri, logo ve parametreler.</p>
        </div>
    );
}
