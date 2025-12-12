"use client";

import { useState, useEffect } from "react";
import { accountService } from "@/lib/api";
import { FaBuilding, FaUserTie, FaWallet, FaSearch, FaPlus } from "react-icons/fa";

interface Account {
    id: number;
    name: string;
    type: string;
    balance: number;
    code?: string;
}

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [filterType, setFilterType] = useState<string>("");

    useEffect(() => {
        loadAccounts();
    }, [filterType]);

    const loadAccounts = async () => {
        try {
            const res = await accountService.getAll(filterType || undefined);
            setAccounts(res.data);
            if (res.data.length === 0 && !filterType) {
                // Auto seed if empty
                await accountService.seed();
                const res2 = await accountService.getAll();
                setAccounts(res2.data);
            }
        } catch (error) {
            console.error("Failed accounts", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cari Hesaplar</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                    <FaPlus /> Yeni Cari Kart
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 bg-white dark:bg-zinc-900 p-2 rounded-lg border border-gray-200 dark:border-gray-800 w-fit">
                {["", "Agency", "Vendor", "Customer", "Cash"].map(type => (
                    <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filterType === type
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                : "text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800"
                            }`}
                    >
                        {type === "" ? "Tümü" : type}
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-500 font-bold">
                        <tr>
                            <th className="px-6 py-4">Kod</th>
                            <th className="px-6 py-4">Cari Adı</th>
                            <th className="px-6 py-4">Tip</th>
                            <th className="px-6 py-4 text-right">Bakiye</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        {accounts.map(acc => (
                            <tr key={acc.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                                <td className="px-6 py-4 font-mono text-gray-400 text-xs">{acc.code || '-'}</td>
                                <td className="px-6 py-4 font-bold flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${acc.type === 'Agency' ? 'bg-purple-100 text-purple-600' :
                                            acc.type === 'Vendor' ? 'bg-orange-100 text-orange-600' :
                                                acc.type === 'Cash' ? 'bg-green-100 text-green-600' :
                                                    'bg-blue-100 text-blue-600'
                                        }`}>
                                        {acc.type === 'Agency' ? <FaBuilding /> :
                                            acc.type === 'Vendor' ? <FaUserTie /> :
                                                <FaWallet />}
                                    </div>
                                    {acc.name}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded text-xs font-bold text-gray-500">
                                        {acc.type}
                                    </span>
                                </td>
                                <td className={`px-6 py-4 text-right font-bold ${acc.balance > 0 ? 'text-green-600' :
                                        acc.balance < 0 ? 'text-red-500' : 'text-gray-400'
                                    }`}>
                                    {acc.balance.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-blue-600 hover:underline font-bold text-xs">Ekstre</button>
                                </td>
                            </tr>
                        ))}
                        {accounts.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-400">Kayıt bulunamadı.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
