"use client";

import { useEffect, useState } from "react";
import { analyticsService } from "@/lib/api";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format, addMonths, startOfMonth, endOfMonth, addDays } from "date-fns";
import { tr } from "date-fns/locale";

export default function ForecastReportPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    // Forecast usually looks ahead e.g. next 30 days
    const [dateRange, setDateRange] = useState({
        start: format(new Date(), 'yyyy-MM-dd'),
        end: format(addDays(new Date(), 30), 'yyyy-MM-dd')
    });

    useEffect(() => {
        setLoading(true);
        analyticsService.getForecast(dateRange.start, dateRange.end).then(res => {
            setData(res);
            setLoading(false);
        });
    }, [dateRange]);

    if (loading && data.length === 0) return <div className="p-8 text-center text-gray-500">Tahminler Oluşturuluyor...</div>;

    const totalRevenueForecast = data.reduce((a, b) => a + b.revenue, 0);

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800">Forecast Raporu (Gelecek Tahmini)</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-center items-center text-center">
                    <h3 className="text-gray-500 mb-2">Önümüzdeki 30 Gün Beklenen Gelir</h3>
                    <p className="text-4xl font-bold text-indigo-600">€{totalRevenueForecast.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-center items-center text-center">
                    <h3 className="text-gray-500 mb-2">Ortalama Beklenen Doluluk</h3>
                    <p className="text-4xl font-bold text-green-600">
                        %{(data.reduce((a, b) => a + b.occupancyRate, 0) / (data.length || 1)).toFixed(1)}
                    </p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow h-[400px]">
                <h3 className="font-bold text-gray-700 mb-4">Günlük Tahmin (Revenue & Occupancy)</h3>
                <ResponsiveContainer width="100%" height="90%">
                    <ComposedChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickFormatter={(str) => format(new Date(str), 'dd MMM', { locale: tr })}
                            fontSize={12}
                        />
                        <YAxis yAxisId="left" orientation="left" unit="€" stroke="#6366f1" />
                        <YAxis yAxisId="right" orientation="right" unit="%" stroke="#22c55e" />
                        <Tooltip
                            labelFormatter={(label) => format(new Date(label), 'dd MMMM yyyy', { locale: tr })}
                            formatter={(value: any, name: any) => [
                                name === 'occupancyRate' ? `${value.toFixed(1)}%` : `€${value.toFixed(2)}`,
                                name === 'occupancyRate' ? 'Doluluk' : 'Gelir'
                            ]}
                        />
                        <Legend />
                        <Bar yAxisId="left" dataKey="revenue" barSize={20} fill="#6366f1" radius={[4, 4, 0, 0]} name="Gelir (Rev)" />
                        <Line yAxisId="right" type="monotone" dataKey="occupancyRate" stroke="#22c55e" strokeWidth={2} name="Doluluk %" dot={false} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-sm text-center">
                    <thead className="bg-gray-50 font-bold text-gray-600 border-b">
                        <tr>
                            <th className="p-3 text-left">Tarih</th>
                            <th className="p-3">Kapasite</th>
                            <th className="p-3">Satılan</th>
                            <th className="p-3">Doluluk %</th>
                            <th className="p-3 text-right">Tahmini Gelir</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data.map((row, i) => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="p-3 text-left font-medium">{format(new Date(row.date), 'dd.MM.yyyy')}</td>
                                <td className="p-3 text-gray-400">{row.totalRooms}</td>
                                <td className="p-3 font-bold">{row.soldRooms}</td>
                                <td className="p-3">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${Math.min(row.occupancyRate, 100)}%` }}></div>
                                    </div>
                                    <span className="text-xs text-gray-500 mt-1 block">%{row.occupancyRate.toFixed(0)}</span>
                                </td>
                                <td className="p-3 text-right font-mono text-indigo-600 font-bold">€{row.revenue.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}
