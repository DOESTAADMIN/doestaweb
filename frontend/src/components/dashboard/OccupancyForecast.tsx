"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const data = [
    { day: 'Pzt', occ: 82, arr: 24, dep: 18 },
    { day: 'Sal', occ: 85, arr: 15, dep: 12 },
    { day: 'Çar', occ: 90, arr: 10, dep: 5 },
    { day: 'Per', occ: 92, arr: 8, dep: 6 },
    { day: 'Cum', occ: 95, arr: 12, dep: 9 },
    { day: 'Cmt', occ: 98, arr: 20, dep: 15 },
    { day: 'Paz', occ: 75, arr: 5, dep: 25 },
    { day: 'Pzt', occ: 70, arr: 8, dep: 14 },
    { day: 'Sal', occ: 65, arr: 10, dep: 12 },
    { day: 'Çar', occ: 68, arr: 14, dep: 10 },
    { day: 'Per', occ: 72, arr: 16, dep: 12 },
    { day: 'Cum', occ: 80, arr: 18, dep: 8 },
    { day: 'Cmt', occ: 90, arr: 22, dep: 10 },
    { day: 'Paz', occ: 85, arr: 10, dep: 20 },
];

export default function OccupancyForecast() {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">14 Günlük Doluluk Tahmini</h3>
                <select className="text-[10px] border rounded bg-gray-50 p-1">
                    <option>Doluluk %</option>
                    <option>Gelir</option>
                    <option>ADR</option>
                </select>
            </div>

            <div className="flex-1 min-h-[250px] w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                        barSize={12}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#6B7280' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#6B7280' }}
                            domain={[0, 100]}
                        />
                        <Tooltip
                            cursor={{ fill: '#F3F4F6' }}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '11px' }}
                        />
                        <ReferenceLine y={80} stroke="orange" strokeDasharray="3 3" />
                        <Bar dataKey="occ" name="Doluluk %" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="arr" name="Giriş" fill="#22C55E" radius={[4, 4, 0, 0]} stackId="a" />
                        <Bar dataKey="dep" name="Çıkış" fill="#EF4444" radius={[4, 4, 0, 0]} stackId="a" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
