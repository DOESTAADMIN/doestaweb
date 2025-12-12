"use client";

import { useEffect, useState } from "react";
import { analyticsService } from "@/lib/api";
import { Calendar, ArrowDownRight, ArrowUpRight, Home, TrendingUp, DollarSign, Users } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area } from "recharts";

export default function FutureReportPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        analyticsService.getFuture().then(res => {
            setData(res);
            setLoading(false);
        });
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    const summary = data?.summary || {};
    const outlook = data?.outlook || [];

    return (
        <div className="p-8 bg-gray-50 min-h-screen font-sans text-slate-800">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gelecek Durum Analizi</h1>
                    <p className="text-slate-500 mt-1">Önümüzdeki 14 günün operasyonel projeksiyonu ve bugünün anlık durumu.</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 flex items-center gap-2 text-sm font-medium text-slate-600">
                    <Calendar size={16} />
                    {format(new Date(data?.date), 'dd MMMM yyyy', { locale: tr })}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Arrivals */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ArrowDownRight size={64} className="text-emerald-600" />
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <ArrowDownRight size={20} />
                        </div>
                        <span className="text-slate-500 font-medium text-sm">Bugün Gelecek</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-800 ml-1">{summary.arrivals}</div>
                    <div className="text-xs text-emerald-600 font-medium ml-1 mt-1 flex items-center gap-1">
                        Rezervasyon
                    </div>
                </div>

                {/* Departures */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ArrowUpRight size={64} className="text-rose-600" />
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                            <ArrowUpRight size={20} />
                        </div>
                        <span className="text-slate-500 font-medium text-sm">Bugün Gidecek</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-800 ml-1">{summary.departures}</div>
                    <div className="text-xs text-rose-600 font-medium ml-1 mt-1">Oda Çıkışı</div>
                </div>

                {/* In House */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Home size={64} className="text-blue-600" />
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <Home size={20} />
                        </div>
                        <span className="text-slate-500 font-medium text-sm">İçerideki (In House)</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-800 ml-1">{summary.inHouse}</div>
                    <div className="text-xs text-blue-600 font-medium ml-1 mt-1">Aktif Oda</div>
                </div>

                {/* Revenue */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign size={64} className="text-amber-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                            <DollarSign size={20} />
                        </div>
                        <span className="text-slate-500 font-medium text-sm">Toplam Beklenen (OTB)</span>
                    </div>
                    <div className="text-3xl font-bold text-slate-800 ml-1 truncate" title={`€${summary.totalFutureRevenue?.toLocaleString()}`}>
                        €{summary.totalFutureRevenue?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                    <div className="text-xs text-amber-600 font-medium ml-1 mt-1">Gelecek 14 Gün +</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Main Graph - 14 Days Outlook */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2 min-h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-700 text-lg">14 Günlük Hareketlilik (Arrivals & Departures)</h3>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-1 text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Gel</div>
                            <div className="flex items-center gap-1 text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Git</div>
                            <div className="flex items-center gap-1 text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-blue-100 border border-blue-400"></span> Dolu</div>
                        </div>
                    </div>

                    <ResponsiveContainer width="100%" height={320}>
                        <ComposedChart data={outlook} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(str) => format(new Date(str), 'dd MMM', { locale: tr })}
                                fontSize={11}
                                tick={{ fill: '#64748b' }}
                                axisLine={false}
                                tickLine={false}
                                dy={10}
                            />
                            <YAxis
                                yAxisId="left"
                                orientation="left"
                                fontSize={11}
                                tick={{ fill: '#64748b' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                unit="%"
                                fontSize={11}
                                tick={{ fill: '#64748b' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                labelFormatter={(label) => format(new Date(label), 'eeee, dd MMMM', { locale: tr })}
                            />
                            {/* In House Area Background */}
                            <Area type="monotone" yAxisId="left" dataKey="inHouse" fill="#eff6ff" stroke="none" fillOpacity={0.5} name="İçeride" />

                            <Bar yAxisId="left" dataKey="arrivals" name="Gelecek" fill="#10b981" barSize={8} radius={[4, 4, 0, 0]} />
                            <Bar yAxisId="left" dataKey="departures" name="Gidecek" fill="#f43f5e" barSize={8} radius={[4, 4, 0, 0]} />

                            <Line yAxisId="right" type="monotone" dataKey="occupancyRate" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }} name="Doluluk %" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue Forecast Mini List */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="font-bold text-slate-700 text-lg mb-6">Gelir Tahmini</h3>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[320px]">
                        {outlook.slice(0, 10).map((day: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-700">{format(new Date(day.date), 'dd MMM, eee', { locale: tr })}</span>
                                    <span className="text-xs text-slate-400">{day.soldRooms || day.inHouse} Oda</span>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-slate-700">€{day.revenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                                    <div className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full inline-block">
                                        ADR: €{(day.revenue / (day.inHouse || 1)).toFixed(0)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-slate-700 text-lg">14 Günlük Detaylı Projeksiyon</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Tarih</th>
                                <th className="px-6 py-4 text-center">Gelecek (Arr)</th>
                                <th className="px-6 py-4 text-center">Gidecek (Dep)</th>
                                <th className="px-6 py-4 text-center">İçeride (InH)</th>
                                <th className="px-6 py-4">Doluluk %</th>
                                <th className="px-6 py-4 text-right">Günlük Gelir</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {outlook.map((day: any, i: number) => (
                                <tr key={i} className="hover:bg-slate-50 group transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-700">
                                        {format(new Date(day.date), 'dd MMMM yyyy, EEEE', { locale: tr })}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {day.arrivals > 0 ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                                {day.arrivals}
                                            </span>
                                        ) : <span className="text-slate-300">-</span>}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {day.departures > 0 ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                                                {day.departures}
                                            </span>
                                        ) : <span className="text-slate-300">-</span>}
                                    </td>
                                    <td className="px-6 py-4 text-center font-bold text-slate-700">{day.inHouse}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden w-24">
                                                <div
                                                    className="h-full bg-blue-500 rounded-full"
                                                    style={{ width: `${Math.min(day.occupancyRate, 100)}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-slate-500 w-8">%{day.occupancyRate.toFixed(0)}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono text-slate-700 font-medium">
                                        €{day.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
