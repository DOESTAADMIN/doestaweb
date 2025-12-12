"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface ChartProps {
    data: any[];
}

export function RevenueChart({ data }: ChartProps) {
    if (!data || data.length === 0) return <div className="h-[300px] flex items-center justify-center text-gray-400">Veri yok...</div>;

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" tickFormatter={(val: string) => val.split('T')[0].slice(8, 10)} stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₺${value / 1000}k`} />
                <Tooltip
                    cursor={{ fill: '#F1F5F9' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`₺${value.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`, 'Gelir']}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} name="Günlük Gelir" />
            </BarChart>
        </ResponsiveContainer>
    );
}

export function OccupancyChart({ data }: ChartProps) {
    if (!data || data.length === 0) return <div className="h-[300px] flex items-center justify-center text-gray-400">Veri yok...</div>;

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} stroke="#E2E8F0" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="date" type="category" tickFormatter={(val: string) => val.split('T')[0].slice(8, 10)} width={30} stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                    cursor={{ fill: '#F1F5F9' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`%${value}`, 'Doluluk']}
                />
                <Bar dataKey="occupancyRate" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} name="Doluluk Oranı" />
            </BarChart>
        </ResponsiveContainer>
    );
}
