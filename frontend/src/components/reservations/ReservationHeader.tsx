"use client";
import React from 'react';
import { FaPlus, FaRedo } from 'react-icons/fa';

interface ReservationHeaderProps {
    onRefresh: () => void;
    onNewReservation: () => void;
    loading?: boolean;
}

export function ReservationHeader({ onRefresh, onNewReservation, loading }: ReservationHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Rezervasyon Yönetimi</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Tüm rezervasyonların listesi ve anlık takibi</p>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className="px-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all flex items-center gap-2 text-sm font-medium shadow-sm"
                >
                    <FaRedo className={`text-gray-400 ${loading ? 'animate-spin' : ''}`} />
                    Yenile
                </button>
                <button
                    onClick={onNewReservation}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all flex items-center gap-2 text-sm font-medium shadow-lg shadow-blue-500/20"
                >
                    <FaPlus size={14} />
                    Yeni Rezervasyon
                </button>
            </div>
        </div>
    );
}
