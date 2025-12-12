"use client";
import { FaPoll } from "react-icons/fa";

export default function SurveysPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <FaPoll size={48} className="mb-4 opacity-20" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Misafir Anketleri</h1>
            <p className="text-center">Online anket sonuçları ve analizler.</p>
        </div>
    );
}
