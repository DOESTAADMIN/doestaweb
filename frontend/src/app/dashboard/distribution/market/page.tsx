"use client";

import { useEffect, useState } from "react";
import { analyticsService } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { DollarSign, Users, Briefcase } from "lucide-react";

export default function DistributionMarketPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        analyticsService.getMarket().then(res => {
            setData(res);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Yükleniyor...</div>;

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800">Pazar Analizi (Market Distribution)</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><DollarSign /></div>
                    <div>
                        <p className="text-sm text-gray-500">Toplam Pazar Geliri</p>
                        <p className="text-xl font-bold">{data?.totalRevenue?.toLocaleString('tr-TR', { style: 'currency', currency: 'EUR' })}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg"><Users /></div>
                    <div>
                        <p className="text-sm text-gray-500">Toplam Rezervasyon</p>
                        <p className="text-xl font-bold">{data?.totalReservations}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Briefcase /></div>
                    <div>
                        <p className="text-sm text-gray-500">Segment Sayısı</p>
                        <p className="text-xl font-bold">{data?.metrics?.length}</p>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg shadow h-[400px]">
                    <h3 className="font-bold text-gray-700 mb-4">Gelir Dağılımı (Revenue by Market)</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={data?.metrics}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="label" fontSize={12} tickLine={false} />
                            <YAxis fontSize={12} tickLine={false} tickFormatter={(val) => `€${val / 1000}k`} />
                            <Tooltip formatter={(val: number) => `€${val.toLocaleString()}`} />
                            <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-4 rounded-lg shadow h-[400px]">
                    <h3 className="font-bold text-gray-700 mb-4">Rezervasyon Payı (Share %)</h3>
                    <ResponsiveContainer width="100%" height="90%">
                        <PieChart>
                            <Pie
                                data={data?.metrics}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="count"
                                nameKey="label"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {data?.metrics?.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-bold border-b">
                        <tr>
                            <th className="p-4">Pazar Segmenti</th>
                            <th className="p-4 text-right">Rezervasyon</th>
                            <th className="p-4 text-right">Gelir</th>
                            <th className="p-4 text-right">ADR (Ort. Günlük Fiyat)</th>
                            <th className="p-4 text-right">Pay %</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data?.metrics?.map((m: any, i: number) => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="p-4 font-medium">{m.label || "Tanımsız"}</td>
                                <td className="p-4 text-right">{m.count}</td>
                                <td className="p-4 text-right font-mono text-blue-600">€{m.revenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                                <td className="p-4 text-right">€{m.adr.toFixed(2)}</td>
                                <td className="p-4 text-right">{m.percentage.toFixed(1)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
