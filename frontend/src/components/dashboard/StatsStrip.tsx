"use client";

import { FaBed, FaSignInAlt, FaSignOutAlt, FaUser, FaMoneyBillWave, FaArrowUp, FaConciergeBell } from "react-icons/fa";

interface StatProps {
    label: string;
    value: string | number;
    subValue?: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    trend?: string;
}

function StatBox({ label, value, subValue, icon: Icon, color, bg, trend }: StatProps) {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-xl p-3 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className={`w-10 h-10 rounded-lg ${bg} ${color} flex items-center justify-center text-lg shrink-0`}>
                <Icon />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-tight truncate">{label}</p>
                <div className="flex items-baseline gap-1.5">
                    <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white leading-tight">{value}</span>
                    {subValue && <span className="text-[10px] text-gray-400 font-medium">{subValue}</span>}
                </div>
            </div>
            {trend && (
                <div className="absolute top-2 right-2 text-[10px] font-bold text-green-600 bg-green-50 px-1.5 rounded-md flex items-center gap-0.5">
                    <FaArrowUp size={8} /> {trend}
                </div>
            )}
        </div>
    );
}

export default function StatsStrip() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            <StatBox
                label="Doluluk"
                value="82%"
                subValue="124 Oda"
                icon={FaBed}
                color="text-blue-600"
                bg="bg-blue-50 dark:bg-blue-900/20"
                trend="5%"
            />
            <StatBox
                label="Gelecek"
                value="24"
                subValue="45 Pax"
                icon={FaSignInAlt}
                color="text-green-600"
                bg="bg-green-50 dark:bg-green-900/20"
            />
            <StatBox
                label="Gidecek"
                value="18"
                subValue="32 Pax"
                icon={FaSignOutAlt}
                color="text-red-600"
                bg="bg-red-50 dark:bg-red-900/20"
            />
            <StatBox
                label="Konaklayan"
                value="106"
                subValue="212 Pax"
                icon={FaUser}
                color="text-purple-600"
                bg="bg-purple-50 dark:bg-purple-900/20"
            />
            <StatBox
                label="Günlük Gelir"
                value="€14.2K"
                subValue="Toplam"
                icon={FaMoneyBillWave}
                color="text-emerald-600"
                bg="bg-emerald-50 dark:bg-emerald-900/20"
                trend="12%"
            />
            <StatBox
                label="Kirli Oda"
                value="12"
                subValue="HK"
                icon={FaConciergeBell}
                color="text-orange-600"
                bg="bg-orange-50 dark:bg-orange-900/20"
            />
        </div>
    );
}
