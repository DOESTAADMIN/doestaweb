"use client";
import { FaFileInvoiceDollar } from "react-icons/fa";

export default function FinancialReportsPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <FaFileInvoiceDollar size={48} className="mb-4 opacity-20" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Finansal Raporlar</h1>
            <p className="max-w-md text-center">Kasa defteri, trial balance, yaşlandırma raporları.</p>
        </div>
    );
}
