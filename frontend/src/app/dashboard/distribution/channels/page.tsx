"use client";

import { useEffect, useState } from "react";
import { analyticsService } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Globe, TrendingUp, Monitor } from "lucide-react";

export default function DistributionChannelsPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        analyticsService.getChannels().then(res => {
            setData(res);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Yükleniyor...</div>;

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800">Kanal Analizi (Channel Distribution)</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg"><Monitor /></div>
                    <div>
                        <p className="text-sm text-gray-500">Toplam Kanal Geliri</p>
                        <p className="text-xl font-bold">{data?.totalRevenue?.toLocaleString('tr-TR', { style: 'currency', currency: 'EUR' })}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-pink-50 text-pink-600 rounded-lg"><Globe /></div>
                    <div>
                        <p className="text-sm text-gray-500">Aktif Kanal Sayısı</p>
                        <p className="text-xl font-bold">{data?.metrics?.length}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-lg"><TrendingUp /></div>
                    <div>
                        <p className="text-sm text-gray-500">Toplam Satış</p>
                        <p className="text-xl font-bold">{data?.totalReservations}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow h-[450px]">
                <h3 className="font-bold text-gray-700 mb-6">Kanal Performansı (Revenue by Channel)</h3>
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={data?.metrics} layout="vertical" margin={{ left: 40 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="label" type="category" width={100} tick={{ fontSize: 13, fontWeight: 500 }} />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            formatter={(val: number) => `€${val.toLocaleString()}`}
                        />
                        <Bar dataKey="revenue" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-bold border-b">
                        <tr>
                            <th className="p-4">Kanal Adı</th>
                            <th className="p-4 text-right">Rezervasyon</th>
                            <th className="p-4 text-right">Gelir</th>
                            <th className="p-4 text-right">ADR</th>
                            <th className="p-4 text-right">Pay %</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data?.metrics?.map((m: any, i: number) => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="p-4 font-medium">{m.label || "Direct"}</td>
                                <td className="p-4 text-right">{m.count}</td>
                                <td className="p-4 text-right font-mono text-indigo-600">€{m.revenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                                <td className="p-4 text-right">€{m.adr.toFixed(2)}</td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <span>{m.percentage.toFixed(1)}%</span>
                                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500" style={{ width: `${m.percentage}%` }} />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
