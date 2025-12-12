"use client";

import { useState } from "react";
import {
    FaPlus, FaFileExcel, FaFilter, FaSearch, FaArrowUp, FaArrowDown,
    FaMoneyBillWave, FaCreditCard, FaExchangeAlt, FaUtensils, FaBed, FaGlassCheers
} from "react-icons/fa";
import { cn } from "@/lib/utils";

// Mock financial transactions (Elektra Style)
// Types: Income, Expense, Transfer
// Categories: Accommodation, F&B, Extra, Salary, Supplier
const mockTransactions = [
    { id: "TRX-8901", date: "25.07.2019 14:30", type: "Income", category: "Accommodation", desc: "Room 101 Payment", amount: 450.00, user: "Admin", method: "Credit Card" },
    { id: "TRX-8902", date: "25.07.2019 14:45", type: "Income", category: "F&B", desc: "Restaurant Bill #4021", amount: 32.50, user: "Waiter1", method: "Cash" },
    { id: "TRX-8903", date: "25.07.2019 15:00", type: "Expense", category: "Supplier", desc: "Food Supply Payment (Metro)", amount: -1250.00, user: "Manager", method: "Bank Transfer" },
    { id: "TRX-8904", date: "25.07.2019 15:15", type: "Income", category: "Extra", desc: "Spa Massage x2", amount: 120.00, user: "SpaUser", method: "Room Charge" },
    { id: "TRX-8905", date: "25.07.2019 15:30", type: "Expense", category: "Maintenance", desc: "AC Repair Part", amount: -85.00, user: "Tech1", method: "Cash" },
    { id: "TRX-8906", date: "25.07.2019 16:00", type: "Income", category: "Accommodation", desc: "Room 205 Deposit", amount: 200.00, user: "Reception2", method: "Credit Card" },
    { id: "TRX-8907", date: "25.07.2019 16:10", type: "Income", category: "F&B", desc: "Pool Bar Order", amount: 15.00, user: "Bar1", method: "Room Charge" },
    { id: "TRX-8908", date: "25.07.2019 16:45", type: "Transfer", category: "Cash Drop", desc: "Front Desk Cash -> Safe", amount: 500.00, user: "Manager", method: "Internal" },
    { id: "TRX-8909", date: "25.07.2019 17:00", type: "Income", category: "Accommodation", desc: "Agency Payment (Expedia)", amount: 2450.00, user: "Accounting", method: "Bank Transfer" },
    { id: "TRX-8910", date: "25.07.2019 17:30", type: "Expense", category: "Salary", desc: "Daily Worker Pay", amount: -50.00, user: "HR", method: "Cash" },
];

export default function TransactionsPage() {
    return (
        <div className="flex flex-col h-[calc(100vh-80px)] bg-white dark:bg-zinc-950">
            {/* Header Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-zinc-900">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <FaExchangeAlt className="text-blue-600" />
                        Gelir / Gider Hareketleri
                    </h1>
                    <p className="text-xs text-gray-500">Tüm finansal işlem dökümü</p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-lg border border-green-100 dark:border-green-800">
                        <p className="text-[10px] text-green-600 font-bold uppercase">Toplam Gelir</p>
                        <p className="text-lg font-bold text-green-700 dark:text-green-400">€ 3,267.50</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg border border-red-100 dark:border-red-800">
                        <p className="text-[10px] text-red-600 font-bold uppercase">Toplam Gider</p>
                        <p className="text-lg font-bold text-red-700 dark:text-red-400">€ 1,385.00</p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg border border-blue-100 dark:border-blue-800">
                        <p className="text-[10px] text-blue-600 font-bold uppercase">Net Bakiye</p>
                        <p className="text-lg font-bold text-blue-700 dark:text-blue-400">€ 1,882.50</p>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-zinc-900 border-b border-gray-200 dark:border-gray-800">
                <div className="flex-1 relative max-w-sm">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                    <input
                        type="text"
                        placeholder="İşlem No, Açıklama Ara..."
                        className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-zinc-800 outline-none focus:border-blue-500"
                    />
                </div>
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-1"></div>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold transition-colors">
                    <FaPlus /> Yeni İşlem
                </button>
                <button className="p-1.5 text-gray-600 hover:bg-white hover:text-green-600 rounded border border-transparent hover:border-gray-200 transition-all">
                    <FaFileExcel size={14} />
                </button>
                <button className="p-1.5 text-gray-600 hover:bg-white hover:text-blue-600 rounded border border-transparent hover:border-gray-200 transition-all">
                    <FaFilter size={14} />
                </button>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto bg-gray-100 dark:bg-zinc-950 p-2">
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-gray-50 dark:bg-zinc-800 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-600 dark:text-gray-300">
                            <tr>
                                <th className="p-2 w-24">Tarih</th>
                                <th className="p-2 w-20">Fiş No</th>
                                <th className="p-2 w-24">Tür</th>
                                <th className="p-2 w-32">Kategori</th>
                                <th className="p-2">Açıklama</th>
                                <th className="p-2 w-32">Ödeme Yöntemi</th>
                                <th className="p-2 w-24 text-right">Tutar</th>
                                <th className="p-2 w-24">Kullanıcı</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {mockTransactions.map((trx) => (
                                <tr key={trx.id} className="hover:bg-blue-50 dark:hover:bg-blue-900/10 group transition-colors">
                                    <td className="p-2 font-mono text-gray-500">{trx.date}</td>
                                    <td className="p-2 font-mono font-medium">{trx.id}</td>
                                    <td className="p-2">
                                        <span className={cn(
                                            "px-1.5 py-0.5 rounded text-[10px] font-bold border",
                                            trx.type === 'Income' ? "bg-green-50 text-green-700 border-green-200" :
                                                trx.type === 'Expense' ? "bg-red-50 text-red-700 border-red-200" :
                                                    "bg-gray-50 text-gray-700 border-gray-200"
                                        )}>
                                            {trx.type === 'Income' ? 'GELİR' : trx.type === 'Expense' ? 'GİDER' : 'VİRMAN'}
                                        </span>
                                    </td>
                                    <td className="p-2 flex items-center gap-1.5">
                                        {trx.category === 'Accommodation' && <FaBed className="text-gray-400" />}
                                        {trx.category === 'F&B' && <FaUtensils className="text-gray-400" />}
                                        {trx.category}
                                    </td>
                                    <td className="p-2 font-medium text-gray-900 dark:text-gray-200">{trx.desc}</td>
                                    <td className="p-2 flex items-center gap-1.5 text-gray-500">
                                        {trx.method === 'Cash' && <FaMoneyBillWave />}
                                        {trx.method === 'Credit Card' && <FaCreditCard />}
                                        {trx.method}
                                    </td>
                                    <td className={cn(
                                        "p-2 text-right font-bold",
                                        trx.amount > 0 ? "text-green-600" : "text-red-600"
                                    )}>
                                        {trx.amount > 0 ? '+' : ''}{trx.amount.toFixed(2)}
                                    </td>
                                    <td className="p-2 text-gray-500">{trx.user}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-50 dark:bg-zinc-800 border-t border-gray-200 dark:border-gray-700 font-bold">
                            <tr>
                                <td colSpan={6} className="p-2 text-right">Genel Toplam:</td>
                                <td className="p-2 text-right text-blue-600">€ 1,882.50</td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}
