"use client";

import { useEffect, useState } from "react";
import { analyticsService } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Map, Users, Plane } from "lucide-react";

export default function DistributionGeoPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        analyticsService.getGeo().then(res => {
            setData(res);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Yükleniyor...</div>;

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800">Coğrafi Analiz (Source Markets)</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-teal-50 text-teal-600 rounded-lg"><Map /></div>
                    <div>
                        <p className="text-sm text-gray-500">Farklı Uyruk Sayısı</p>
                        <p className="text-xl font-bold">{data?.metrics?.length}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users /></div>
                    <div>
                        <p className="text-sm text-gray-500">Toplam Misafir</p>
                        <p className="text-xl font-bold">{data?.totalReservations}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-sky-50 text-sky-600 rounded-lg"><Plane /></div>
                    <div>
                        <p className="text-sm text-gray-500">Toplam Gelir</p>
                        <p className="text-xl font-bold">{data?.totalRevenue?.toLocaleString('tr-TR', { style: 'currency', currency: 'EUR' })}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow h-[400px]">
                <h3 className="font-bold text-gray-700 mb-6">En Çok Gelir Getiren Ülkeler (Top 10)</h3>
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={data?.metrics?.slice(0, 10)}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="label" fontSize={12} tickLine={false} />
                        <YAxis fontSize={12} tickLine={false} tickFormatter={(val) => `€${val / 1000}k`} />
                        <Tooltip formatter={(val: number) => `€${val.toLocaleString()}`} />
                        <Bar dataKey="revenue" fill="#0d9488" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-bold border-b">
                        <tr>
                            <th className="p-4">Ülke / Uyruk</th>
                            <th className="p-4 text-right">Rezervasyon</th>
                            <th className="p-4 text-right">Gelir</th>
                            <th className="p-4 text-right">ADR</th>
                            <th className="p-4 text-right">Pay %</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {data?.metrics?.map((m: any, i: number) => (
                            <tr key={i} className="hover:bg-gray-50">
                                <td className="p-4 font-medium flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 border border-gray-200">{m.label?.substring(0, 2)}</span>
                                    {m.label || "Bilinmiyor"}
                                </td>
                                <td className="p-4 text-right">{m.count}</td>
                                <td className="p-4 text-right font-mono text-teal-700">€{m.revenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
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
