import React from 'react';
import { FaHardHat, FaTools } from 'react-icons/fa';

interface ModulePlaceholderProps {
    title: string;
    description: string;
}

export default function ModulePlaceholder({ title, description }: ModulePlaceholderProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
                <FaTools className="text-3xl text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
                {description} Bu modül şu anda geliştirme aşamasındadır ve yakında aktif olacaktır.
            </p>
            <div className="flex gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Özellik İste
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-zinc-900 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                    Dökümantasyon
                </button>
            </div>
        </div>
    );
}
