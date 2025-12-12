"use client";
import { FaUserShield } from "react-icons/fa";

export default function KBSPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <FaUserShield size={48} className="mb-4 opacity-20" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">KBS / Polis Raporları</h1>
            <p className="max-w-md text-center">Emniyet Genel Müdürlüğü anlık veri gönderimi (AKBS) ve günlük polis listesi.</p>
        </div>
    );
}
