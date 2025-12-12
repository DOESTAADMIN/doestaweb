"use client";

import { useState, useEffect } from "react";
import { invoiceService, accountService } from "@/lib/api";
import { FaFileInvoice, FaPlus, FaSearch } from "react-icons/fa";

interface Invoice {
    id: number;
    invoiceNumber: string;
    date: string;
    account: { name: string };
    totalAmount: number;
    type: string;
    status: string;
}

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    useEffect(() => {
        loadInvoices();
    }, []);

    const loadInvoices = async () => {
        try {
            const res = await invoiceService.getAll();
            setInvoices(res.data);
        } catch (error) {
            console.error("Failed invoices", error);
        }
    };

    const handleCreateMockInvoice = async () => {
        // Helper to quickly create an invoice for demo (needs an account)
        const accRes = await accountService.getAll();
        if (accRes.data.length === 0) return alert("Önce cari hesap oluşturun.");

        const accId = accRes.data[0].id;

        await invoiceService.create({
            invoiceNumber: `INV-${Date.now().toString().substring(8)}`,
            accountId: accId,
            type: "Sales",
            totalAmount: Math.floor(Math.random() * 5000) + 100,
            items: [] // Simplified
        });
        loadInvoices();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Faturalar</h1>
                <div className="flex gap-2">
                    <button className="bg-white border text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50" onClick={handleCreateMockInvoice}>
                        + Hızlı Fatura (Demo)
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                        <FaPlus /> Yeni Fatura
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-500 font-bold">
                        <tr>
                            <th className="px-6 py-4">Tarih</th>
                            <th className="px-6 py-4">Fatura No</th>
                            <th className="px-6 py-4">Cari Hesap</th>
                            <th className="px-6 py-4">Tür</th>
                            <th className="px-6 py-4 text-right">Tutar</th>
                            <th className="px-6 py-4 text-center">Durum</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                        {invoices.map(inv => (
                            <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                                <td className="px-6 py-4 text-gray-500">{new Date(inv.date).toLocaleDateString("tr-TR")}</td>
                                <td className="px-6 py-4 font-bold text-blue-600">{inv.invoiceNumber}</td>
                                <td className="px-6 py-4 font-bold">{inv.account?.name}</td>
                                <td className="px-6 py-4">
                                    {inv.type === 'Sales' ?
                                        <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">Satış</span> :
                                        <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold">Alış</span>
                                    }
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-gray-800 dark:text-white">
                                    {inv.totalAmount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="bg-gray-100 dark:bg-zinc-800 text-gray-500 text-xs px-2 py-1 rounded font-bold">{inv.status}</span>
                                </td>
                            </tr>
                        ))}
                        {invoices.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-400">Henüz fatura girişi yapılmamış.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
