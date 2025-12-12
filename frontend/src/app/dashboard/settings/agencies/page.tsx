"use client";

import AgencyList from "@/components/settings/AgencyList";
import { FaPlus } from "react-icons/fa";

export default function AgenciesPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Acente ve Kontrat Yönetimi</h1>
                    <p className="text-sm text-gray-500">Acenteleri, komisyon oranlarını ve kontratları tanımlayın.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700">
                    <FaPlus /> Yeni Acente
                </button>
            </div>

            <AgencyList />
        </div>
    );
}
