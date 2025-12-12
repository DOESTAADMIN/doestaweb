"use client";
import React from 'react';
import { FaCalendarCheck, FaClock } from 'react-icons/fa';
import { Reservation } from '@/hooks/useReservations';

interface ReservationStatsProps {
    reservations: Reservation[];
}

export function ReservationStats({ reservations }: ReservationStatsProps) {
    const stats = [
        { label: 'Toplam', value: reservations.length, icon: FaCalendarCheck, color: 'text-blue-600 bg-blue-50' },
        { label: 'Gelecek', value: reservations.filter(r => r.status === 'Confirmed').length, icon: FaClock, color: 'text-green-600 bg-green-50' },
        { label: 'Check-In', value: reservations.filter(r => r.status === 'CheckedIn').length, icon: FaCalendarCheck, color: 'text-purple-600 bg-purple-50' },
        { label: 'İptal', value: reservations.filter(r => r.status === 'Cancelled').length, icon: FaCalendarCheck, color: 'text-red-600 bg-red-50' },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, idx) => (
                <div key={idx} className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-soft flex items-center justify-between hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="text-xl" />
                    </div>
                </div>
            ))}
        </div>
    );
}
