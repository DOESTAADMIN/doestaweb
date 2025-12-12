"use client";

import React from 'react';
import { FaPlaneArrival, FaPlaneDeparture, FaBed, FaUserTie, FaPercentage } from 'react-icons/fa';
import { cn } from "@/lib/utils";

interface StatusCardsProps {
    stats: any;
    loading: boolean;
}

export default function StatusCards({ stats, loading }: StatusCardsProps) {
    if (loading && !stats.arrivals) {
        return <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 opacity-50 pointer-events-none">
            {/* Skeleton / Loading State can be improved, but using opacity for now */}
            {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-24 bg-gray-100 dark:bg-zinc-800 rounded animate-pulse"></div>
            ))}
        </div>
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatusCard
                title="Gelecek"
                value={stats.arrivals || 0}
                icon={FaPlaneArrival}
                color="text-green-600"
                bgColor="bg-green-100 dark:bg-green-900/30"
            />
            <StatusCard
                title="Gidecek"
                value={stats.departures || 0}
                icon={FaPlaneDeparture}
                color="text-red-500"
                bgColor="bg-red-100 dark:bg-red-900/30"
            />
            <StatusCard
                title="İçerde"
                value={stats.inHouse || 0}
                icon={FaBed}
                color="text-blue-600"
                bgColor="bg-blue-100 dark:bg-blue-900/30"
            />
            <StatusCard
                title="Doluluk %"
                value={`%${stats.occupancy || 0}`}
                icon={FaPercentage}
                color="text-purple-600"
                bgColor="bg-purple-100 dark:bg-purple-900/30"
            />
            <StatusCard
                title="VIP"
                value={stats.vipCount || 0}
                icon={FaUserTie}
                color="text-yellow-600"
                bgColor="bg-yellow-100 dark:bg-yellow-900/30"
            />
        </div>
    );
}

function StatusCard({ title, value, icon: Icon, color, bgColor }: { title: string, value: string | number, icon: any, color: string, bgColor: string }) {
    return (
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{title}</p>
                <h3 className={cn("text-2xl font-bold mt-1", color)}>{value}</h3>
            </div>
            <div className={cn("p-3 rounded-full", bgColor)}>
                <Icon size={20} className={color} />
            </div>
        </div>
    );
}
