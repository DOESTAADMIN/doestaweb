"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
    { name: 'Temiz', value: 85, color: '#22c55e' }, // Green
    { name: 'Kirli', value: 12, color: '#ef4444' }, // Red
    { name: 'Dokunma (DND)', value: 5, color: '#eab308' }, // Yellow
    { name: 'Arızalı (OOO)', value: 3, color: '#64748b' }, // Gray
];

const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-[10px] font-bold">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export default function RoomStatusChart() {
    return (
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 shadow-sm h-full flex flex-col">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 border-b pb-2">Oda Durumları</h3>

            <div className="h-64 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderLabel}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ fontSize: '12px' }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Stat */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[80%] text-center pointer-events-none">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">150</span>
                    <p className="text-[10px] text-gray-400 uppercase">Toplam</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="text-center">
                    <p className="text-xs text-gray-500">Boş Temiz</p>
                    <p className="font-bold text-green-600">42</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-500">Dolu Kirli</p>
                    <p className="font-bold text-red-600">12</p>
                </div>
            </div>
        </div>
    );
}
