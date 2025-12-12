"use client";
import { FaThumbsDown } from "react-icons/fa";

export default function ComplaintsPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <FaThumbsDown size={48} className="mb-4 opacity-20" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Şikayet Yönetimi</h1>
            <p className="text-center">Misafir şikayet takip ve çözüm süreci.</p>
        </div>
    );
}
