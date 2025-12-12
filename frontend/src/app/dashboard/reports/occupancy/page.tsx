"use client";

import { useEffect, useState } from "react";
import { analyticsService } from "@/lib/api";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { format, subDays, addDays, startOfMonth, endOfMonth } from "date-fns";
import { tr } from "date-fns/locale";

export default function OccupancyReportPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({
        start: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
        end: format(endOfMonth(new Date()), 'yyyy-MM-dd')
    });

    useEffect(() => {
        setLoading(true);
        analyticsService.getOccupancy(dateRange.start, dateRange.end).then(res => {
            setData(res);
            setLoading(false);
        });
    }, [dateRange]);

    const handleMonthChange = (offset: number) => {
        const current = new Date(dateRange.start);
        const newStart = addDays(current, offset * 30); // Approximate
        // Better to stick to real months
        const target = new Date(current.getFullYear(), current.getMonth() + offset, 1);
        setDateRange({
            start: format(startOfMonth(target), 'yyyy-MM-dd'),
            end: format(endOfMonth(target), 'yyyy-MM-dd')
        });
    };

    if (loading && data.length === 0) return <div className="p-8 text-center text-gray-500">Rapor Oluşturuluyor...</div>;

    const avgOccupancy = data.reduce((a, b) => a + b.occupancyRate, 0) / (data.length || 1);
    const totalRev = data.reduce((a, b) => a + b.revenue, 0);

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Doluluk Raporu (Occupancy)</h1>
                <div className="flex gap-2 bg-white p-1 rounded border border-gray-200">
                    <button onClick={() => handleMonthChange(-1)} className="px-3 py-1 hover:bg-gray-100 rounded text-sm">Prev Month</button>
                    <span className="px-3 py-1 text-sm font-bold border-x border-gray-100">{dateRange.start} - {dateRange.end}</span>
                    <button onClick={() => handleMonthChange(1)} className="px-3 py-1 hover:bg-gray-100 rounded text-sm">Next Month</button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                    <p className="text-sm text-gray-500">Ort. Doluluk</p>
                    <p className="text-2xl font-bold text-blue-600">%{avgOccupancy.toFixed(1)}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                    <p className="text-sm text-gray-500">Toplam Oda Geliri</p>
                    <p className="text-2xl font-bold text-green-600">€{totalRev.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
                    <p className="text-sm text-gray-500">Satılan Geceleme</p>
                    <p className="text-2xl font-bold text-purple-600">{data.reduce((a, b) => a + b.soldRooms, 0)}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                    <p className="text-sm text-gray-500">Ort. ADR</p>
                    <p className="text-2xl font-bold text-yellow-600">€{(totalRev / (data.reduce((a, b) => a + b.soldRooms, 0) || 1)).toFixed(2)}</p>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-6 rounded-lg shadow h-[400px]">
                <h3 className="font-bold text-gray-700 mb-4">Doluluk Grafiği (Occupancy vs RevPAR)</h3>
                <ResponsiveContainer width="100%" height="90%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorOcc" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(str) => format(new Date(str), 'dd MMM', { locale: tr })}
                            fontSize={12}
                        />
                        <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" unit="%" />
                        <YAxis yAxisId="right" orientation="right" stroke="#10b981" unit="€" />
                        <Tooltip
                            labelFormatter={(label) => format(new Date(label), 'dd MMMM yyyy', { locale: tr })}
                            formatter={(value: any, name: any) => [
                                name === 'occupancyRate' ? `${value.toFixed(1)}%` : `€${value.toFixed(2)}`,
                                name === 'occupancyRate' ? 'Doluluk' : (name === 'revPAR' ? 'RevPAR' : name)
                            ]}
                        />
                        <Legend />
                        <Area type="monotone" yAxisId="left" dataKey="occupancyRate" stroke="#3b82f6" fillOpacity={1} fill="url(#colorOcc)" name="Doluluk %" />
                        <Line type="monotone" yAxisId="right" dataKey="revPAR" stroke="#10b981" strokeWidth={2} name="RevPAR" dot={false} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-sm text-center">
                    <thead className="bg-gray-50 font-bold text-gray-600 border-b">
                        <tr>
                            <th className="p-3 text-left">Tarih</th>
                            <th className="p-3">Toplam Oda</th>
                            <th className="p-3">Satılan</th>
                            <th className="p-3">Doluluk %</th>
                            <th className="p-3">ADR</th>
                            <th className="p-3">RevPAR</th>
                            <th className="p-3 text-right">Gelir</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.map((row, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="p-3 text-left font-medium">{format(new Date(row.date), 'dd.MM.yyyy')}</td>
                                <td className="p-3">{row.totalRooms}</td>
                                <td className="p-3 font-bold text-blue-600">{row.soldRooms}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${row.occupancyRate > 80 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        %{row.occupancyRate.toFixed(1)}
                                    </span>
                                </td>
                                <td className="p-3">€{row.adr.toFixed(2)}</td>
                                <td className="p-3">€{row.revPAR.toFixed(2)}</td>
                                <td className="p-3 text-right font-mono">€{row.revenue.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
