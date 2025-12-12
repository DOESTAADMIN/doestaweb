"use client";

import { useState, useEffect } from "react";
import { agencyService } from "@/lib/api";
import { FaEdit, FaTrash, FaGlobe, FaHandshake } from "react-icons/fa";

interface Agency {
    id: number;
    name: string;
    type: string;
    commissionRate: number;
    contact?: string;
    code?: string;
}

export default function AgencyList() {
    const [agencies, setAgencies] = useState<Agency[]>([]);

    useEffect(() => {
        loadAgencies();
    }, []);

    const loadAgencies = async () => {
        try {
            const res = await agencyService.getAll();
            setAgencies(res.data);
            if (res.data.length === 0) {
                await agencyService.seed();
                const res2 = await agencyService.getAll();
                setAgencies(res2.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 font-semibold uppercase text-xs">
                    <tr>
                        <th className="px-6 py-4">Kod</th>
                        <th className="px-6 py-4">Acente Adı</th>
                        <th className="px-6 py-4">Tip</th>
                        <th className="px-6 py-4">Komisyon</th>
                        <th className="px-6 py-4">İletişim</th>
                        <th className="px-6 py-4">Durum</th>
                        <th className="px-6 py-4 text-right">İşlemler</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                    {agencies.map((agency) => (
                        <tr key={agency.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                            <td className="px-6 py-4 font-mono text-gray-400">{agency.code}</td>
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                                    {agency.type === "OTA" ? <FaGlobe /> : <FaHandshake />}
                                </div>
                                {agency.name}
                            </td>
                            <td className="px-6 py-4">{agency.type}</td>
                            <td className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">%{agency.commissionRate}</td>
                            <td className="px-6 py-4 text-gray-500">{agency.contact || '-'}</td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                    Aktif
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right space-x-2">
                                <button className="text-gray-500 hover:text-blue-600 transition-colors"><FaEdit /></button>
                                <button className="text-gray-500 hover:text-red-600 transition-colors"><FaTrash /></button>
                            </td>
                        </tr>
                    ))}
                    {agencies.length === 0 && (
                        <tr><td colSpan={7} className="text-center py-6 text-gray-400">Kayıt yok.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
