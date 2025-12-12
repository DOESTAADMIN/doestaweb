"use client";

import { FaCalendarCheck } from "react-icons/fa";

export default function MaintenancePage() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <FaCalendarCheck size={48} className="mb-4 opacity-20" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Periyodik Bakım Planı</h1>
            <p className="max-w-md text-center">Asansör, jeneratör, havuz ve klima sistemlerinin periyodik bakım takvimi.</p>
        </div>
    );
}
