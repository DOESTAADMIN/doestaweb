"use client";

import { FaBriefcase, FaGlobe, FaPercent } from "react-icons/fa";

export default function AgenciesPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Acenteler</h1>
                    <p className="text-sm text-gray-500">Acente tanımları, komisyon oranları ve bağlantılar.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { name: "Booking.com", type: "OTA", comm: 15, market: "Global", color: "blue", status: "Active" },
                    { name: "Expedia", type: "OTA", comm: 18, market: "Global", color: "yellow", status: "Active" },
                    { name: "ETS Tur", type: "Local Agency", comm: 12, market: "Domestic", color: "red", status: "Active" },
                    { name: "Jolly Tur", type: "Local Agency", comm: 12, market: "Domestic", color: "orange", status: "Active" },
                    { name: "TUI", type: "Touroperator", comm: "Net", market: "Europe", color: "teal", status: "Passive" },
                ].map((agency, i) => (
                    <div key={i} className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 flex flex-col justify-between group hover:border-blue-300 transition-all">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-lg bg-${agency.color}-100 text-${agency.color}-600 flex items-center justify-center font-bold text-xl`}>
                                    {agency.name.substring(0, 1)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{agency.name}</h3>
                                    <span className="text-xs bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-gray-500">{agency.type}</span>
                                </div>
                            </div>
                            <span className={`w-2 h-2 rounded-full ${agency.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between p-2 bg-gray-50 dark:bg-zinc-800/50 rounded">
                                <span className="text-gray-500 flex items-center gap-2"><FaPercent /> Komisyon</span>
                                <span className="font-bold">{agency.comm === 'Net' ? 'Net Fiyat' : `%${agency.comm}`}</span>
                            </div>
                            <div className="flex justify-between p-2 bg-gray-50 dark:bg-zinc-800/50 rounded">
                                <span className="text-gray-500 flex items-center gap-2"><FaGlobe /> Pazar</span>
                                <span className="font-bold">{agency.market}</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex gap-2">
                            <button className="flex-1 py-2 text-xs font-bold bg-blue-50 text-blue-600 rounded hover:bg-blue-100">Kontratlar</button>
                            <button className="flex-1 py-2 text-xs font-bold bg-gray-50 text-gray-600 rounded hover:bg-gray-100">Aksiyonlar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
