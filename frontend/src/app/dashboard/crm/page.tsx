"use client";
import { FaHeart } from "react-icons/fa";

export default function CrmPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sadakat Programı & CRM</h1>
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl border border-gray-200 dark:border-gray-800 text-center">
                <FaHeart size={48} className="mx-auto mb-4 text-red-500 opacity-50" />
                <h2 className="text-xl font-bold mb-2">Misafir İlişkileri</h2>
                <p className="text-gray-500">VIP misafir takibi, doğum günü kutlamaları ve email marketing modülleri yakında eklenecektir.</p>
            </div>
        </div>
    );
}
