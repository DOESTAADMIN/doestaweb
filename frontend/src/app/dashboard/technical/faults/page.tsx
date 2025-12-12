"use client";

import { FaWrench } from "react-icons/fa";

export default function FaultsPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <FaWrench size={48} className="mb-4 opacity-20" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Arıza Bildirimleri</h1>
            <p className="max-w-md text-center">Detaylı arıza takibi ve parça değişimi kayıtları bu ekrandan yapılacaktır.</p>
        </div>
    );
}
