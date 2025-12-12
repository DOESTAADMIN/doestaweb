"use client";
import { FaList } from "react-icons/fa";

export default function DefinitionsPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <FaList size={48} className="mb-4 opacity-20" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Tanımlamalar</h1>
            <p className="text-center">Oda tipleri, pansiyon tipleri, döviz kurları vb.</p>
        </div>
    );
}
