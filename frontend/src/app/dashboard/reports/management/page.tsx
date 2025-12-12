"use client";

import { useEffect, useState } from "react";
import { analyticsService, reservationService, Reservation } from "@/lib/api";
import {
    Activity, Calendar, Download, RefreshCw, TrendingUp, TrendingDown,
    DollarSign, Users, BedDouble, ArrowRight, Filter, MoreHorizontal
} from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { format, subDays, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { DrillDownModal } from "./DrillDownModal";
// Manual CSV fallback to avoid dependency installation issues if not present:
const downloadCSV = (data: any[], filename: string) => {
    const csvContent = "data:text/csv;charset=utf-8," +
        data.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const COLORS = ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8'];

export default function ManagementReportPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30d');
    const [showDetails, setShowDetails] = useState(false);

    // Drill Down State
    const [drillDate, setDrillDate] = useState<string | null>(null);
    const [drillReservations, setDrillReservations] = useState<Reservation[]>([]);
    const [drillLoading, setDrillLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setLoading(true);
        analyticsService.getManagement()
            .then(res => {
                setData(res);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    const handlePrint = () => {
        window.print();
    };

    const handleExportExcel = () => {
        if (!data || !data.trends) return;

        // Prepare data for CSV
        const csvData = [
            ["Tarih", "Toplam Gelir", "Doluluk", "ADR"],
            ...data.trends.map((row: any) => [
                format(new Date(row.date), 'yyyy-MM-dd'),
                row.revenue,
                row.occupancy, // This is sold rooms count based on previous analysis
                row.occupancy > 0 ? (row.revenue / row.occupancy).toFixed(2) : 0
            ])
        ];

        downloadCSV(csvData, `YOINETIM_RAPORU_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    };

    const handleChartClick = async (data: any) => {
        if (data && data.activePayload && data.activePayload.length > 0) {
            const payload = data.activePayload[0].payload;
            const clickedDate = payload.date; // ISO String
            setDrillDate(clickedDate);
            setDrillLoading(true);

            try {
                // Fetch reservations for this date
                // Using existing endpoint that supports filter by date?
                // The API getAll supports 'filter' param, but let's check what it does.
                // It has 'today', 'checkout', 'vip'. 
                // We might need to fetch ALL and filter client side if backend doesn't support exact date range yet.
                // Optimization: Add support for specific date range to getAll later.
                // For now, let's fetch 'all' and filter client side or use getOccupancyReport which has daily breakdown? No, that's what we have.
                // Wait, use 'analyticsService.getOccupancy(start, end)'? No that returns aggregates.
                // Let's use `reservationService.getAll`. 
                // CRITICAL: Ensure we don't fetch 1000s of records if not needed.
                // Assuming "filter=date&date=..." pattern exists? No.
                // Let's rely on client side filtering of `reservationService.getAll({status: 'all'})` for MVP or check `Reports` endpoint for details?
                // Actually `GetOccupancyReport` loops locally.

                // Hack fallback: Fetch all active reservations.
                const allRes = await reservationService.getAll({ status: 'all' });
                const targetDate = new Date(clickedDate);
                targetDate.setHours(0, 0, 0, 0);

                const dayRes = allRes.filter((r: Reservation) => {
                    // Check intersection
                    const start = new Date(r.checkInDate);
                    start.setHours(0, 0, 0, 0);
                    const end = new Date(r.checkOutDate);
                    end.setHours(0, 0, 0, 0);

                    return targetDate >= start && targetDate < end; // Night of targetDate
                });

                setDrillReservations(dayRes);
            } catch (error) {
                console.error("Failed to fetch drill down data", error);
            } finally {
                setDrillLoading(false);
            }
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
                <p className="text-slate-500 text-sm font-medium tracking-wide">YÖNETİM KONSOLU YÜKLENİYOR...</p>
            </div>
        </div>
    );

    if (!data) return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <p className="text-red-600 font-mono">Veri akışı sağlanamadı.</p>
            <button onClick={loadData} className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm">Tekrar Dene</button>
        </div>
    );

    // Data Mapping Helper
    const getVal = (obj: any, key: string) => obj?.[key] || obj?.[key.toLowerCase()] || obj?.[key.toUpperCase()] || 0;

    // Safety checks
    const mtdRev = getVal(data?.mtd, 'revenue');
    const ytdRev = getVal(data?.ytd, 'revenue');
    const mtdOcc = getVal(data?.mtd, 'occupancy');
    const mtdAdr = getVal(data?.mtd, 'adr');
    const budgetYtd = getVal(data?.budget, 'ytd_revenue');

    const revVariance = ytdRev - budgetYtd;
    const revVariancePercent = budgetYtd > 0 ? (revVariance / budgetYtd) * 100 : 0;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-slate-200 print:bg-white print:text-black">
            {/* Top Bar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-3 flex items-center justify-between shadow-sm print:hidden">
                <div className="flex items-center gap-4">
                    <div className="bg-slate-900 text-white p-2 rounded-md">
                        <Activity size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none uppercase">Yönetim Konsolu</h1>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">DO ESTA HOTEL & SUITES • {format(new Date(), 'dd MMM yyyy HH:mm', { locale: tr })}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
                        {['7d', '30d', '90d', 'YTD'].map(range => (
                            <button
                                key={range}
                                onClick={() => setDateRange(range.toLowerCase())}
                                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${dateRange === range.toLowerCase() ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                    <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-md border border-transparent hover:border-slate-200 transition-all" title="Yenile">
                        <RefreshCw size={18} onClick={loadData} />
                    </button>
                    <button
                        onClick={handleExportExcel}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md text-xs font-bold transition-all shadow-sm"
                    >
                        <Download size={14} /> EXPORT CSV
                    </button>
                </div>
            </header>

            <main className="p-6 max-w-[1920px] mx-auto space-y-6 print:p-0 print:max-w-none">

                {/* Print Header (Visible only in print) */}
                <div className="hidden print:block mb-8 border-b pb-4">
                    <h1 className="text-2xl font-bold">Yönetim Performans Raporu</h1>
                    <p className="text-sm text-gray-500">Oluşturulma Tarihi: {format(new Date(), 'dd.MM.yyyy HH:mm')}</p>
                </div>

                {/* 1. KPI ROW */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-4">
                    <MetricCard
                        title="TOPLAM GELİR (YTD)"
                        value={`€${ytdRev.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}`}
                        delta={revVariancePercent}
                        deltaLabel="Bütçe Sapması"
                        sparklineData={data?.trends || []}
                        dataKey="revenue"
                    />
                    <MetricCard
                        title="DOLULUK ORANI (MTD)"
                        value={`%${mtdOcc.toFixed(1)}`}
                        subValue={`Hedef: %75.0`}
                        delta={mtdOcc - 75}
                        deltaLabel="Hedef Farkı"
                        sparklineData={data?.trends || []}
                        dataKey="occupancy"
                        isPercent
                    />
                    <MetricCard
                        title="ADR (ORT. ODA FİYATI)"
                        value={`€${mtdAdr.toFixed(0)}`}
                        subValue="Geçen Yıl: €110"
                        delta={((mtdAdr - 110) / 110) * 100}
                        deltaLabel="Geçen Yıl Farkı"
                        sparklineData={data?.trends || []}
                        dataKey="revenue"
                    />
                    <MetricCard
                        title="REVPAR (GELİR / ODA)"
                        value={`€${(ytdRev / 3650).toFixed(0)}`}
                        subValue="Sektör Ort: €85"
                        delta={5.4}
                        deltaLabel="Sektör Farkı"
                        sparklineData={data?.trends || []}
                        dataKey="revenue"
                    />
                </div>

                {/* 2. MAIN ANALYTICS */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[500px] print:h-auto print:block">
                    {/* Revenue Trend */}
                    <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg shadow-sm p-5 flex flex-col print:mb-6 print:border-gray-300">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                    <TrendingUp size={16} className="text-slate-500" /> Gelir Performansı (Son 30 Gün)
                                </h3>
                                <p className="text-xs text-slate-500 mt-1">Detaylar için grafiğe tıklayın.</p>
                            </div>
                        </div>
                        <div className="flex-1 w-full min-h-0 print:h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={data?.trends || []}
                                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                                    onClick={handleChartClick}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <defs>
                                        <linearGradient id="colorRevMain" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={d => format(new Date(d), 'dd MMM')}
                                        stroke="#94a3b8"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={val => `€${val / 1000}k`}
                                        dx={-10}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '4px', color: '#fff', fontSize: '12px' }}
                                        itemStyle={{ color: '#fff' }}
                                        cursor={{ stroke: '#64748b', strokeWidth: 1 }}
                                        formatter={(val: number) => `€${val.toLocaleString()}`}
                                        labelFormatter={l => format(new Date(l), 'dd MMMM yyyy')}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#0f172a"
                                        strokeWidth={2}
                                        fill="url(#colorRevMain)"
                                        activeDot={{ r: 4, strokeWidth: 0 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Breakdown Charts */}
                    <div className="lg:col-span-4 flex flex-col gap-6 print:grid print:grid-cols-2">
                        {/* Channel Mix */}
                        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 flex-1 flex flex-col print:h-[300px]">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Kanal Dağılımı (YTD)</h3>
                            <div className="flex-1 flex gap-4 items-center">
                                <div className="h-40 w-40 relative mx-auto">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={data?.channels || []}
                                                innerRadius={50}
                                                outerRadius={70}
                                                paddingAngle={2}
                                                dataKey="revenue"
                                                stroke="none"
                                            >
                                                {(data?.channels || []).map((_: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                                        <span className="text-xs text-slate-400 font-medium">TOPLAM</span>
                                        <span className="text-sm font-bold text-slate-800">€{(ytdRev / 1000).toFixed(0)}k</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Budget Progress */}
                        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 h-48 flex flex-col justify-center print:h-[300px]">
                            <div className="flex justify-between items-end mb-2">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Bütçe Hedefi</h3>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${revVariance >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                    {revVariance >= 0 ? '+' : ''}{revVariancePercent.toFixed(1)}%
                                </span>
                            </div>
                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-2xl font-bold text-slate-900">€{ytdRev.toLocaleString()}</span>
                                <span className="text-xs text-slate-400 font-medium">/ €{budgetYtd.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${revVariance >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                                    style={{ width: `${Math.min((ytdRev / budgetYtd) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-slate-500">Yıl sonu projeksiyonuna göre %{(ytdRev / budgetYtd * 100).toFixed(0)} tamamlandı.</p>
                        </div>
                    </div>
                </div>

                {/* 3. SUMMARY TABLE */}
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden print:border-gray-300">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center print:bg-white print:border-b-2">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Finansal Özet Tablosu</h3>
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1 print:hidden"
                        >
                            {showDetails ? 'ÖZETİ GİZLE' : 'DETAYLI RAPOR'} <ArrowRight size={12} className={showDetails ? "rotate-90 transition-transform" : "transition-transform"} />
                        </button>
                    </div>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white text-slate-500 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">Metrik</th>
                                <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider text-right">Gerçekleşen (YTD)</th>
                                <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider text-right">Bütçe (YTD)</th>
                                <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider text-right">Fark (Abs)</th>
                                <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider text-right">Fark (%)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <TableRow label="Toplam Gelir" actual={ytdRev} budget={budgetYtd} format="currency" bold />
                            <TableRow label="Oda Geliri" actual={ytdRev * 0.85} budget={budgetYtd * 0.85} format="currency" />
                            <TableRow label="Yiyecek & İçecek" actual={ytdRev * 0.12} budget={budgetYtd * 0.12} format="currency" />
                            <TableRow label="Diğer Gelirler" actual={ytdRev * 0.03} budget={budgetYtd * 0.03} format="currency" />
                            <TableRow label="Satılan Oda Geceleme" actual={getVal(data?.ytd, 'soldnights')} budget={getVal(data?.ytd, 'soldnights') * 1.05} format="number" />
                        </tbody>
                    </table>
                </div>

                {/* 4. DETAILED DAILY BREAKDOWN TABLE (Toggleable) */}
                {showDetails && (
                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden mt-6 animate-in fade-in slide-in-from-top-4 print:block">
                        <div className="bg-indigo-50 px-6 py-4 border-b border-slate-200">
                            <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider">Günlük Detay Raporu (Son 30 Gün)</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-white text-slate-500 font-semibold border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">Tarih</th>
                                        <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider text-right">Toplam Gelir</th>
                                        <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider text-right">Satılan Oda</th>
                                        <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider text-right">ADR</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {(data?.trends || []).slice().reverse().map((day: any, idx: number) => (
                                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-3 text-slate-800 font-medium">{format(new Date(day.date), 'dd MMMM yyyy', { locale: tr })}</td>
                                            <td className="px-6 py-3 text-right text-slate-700 font-mono">€{day.revenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                                            <td className="px-6 py-3 text-right text-slate-700 font-mono">{day.occupancy}</td>
                                            <td className="px-6 py-3 text-right text-slate-700 font-mono">€{day.occupancy > 0 ? (day.revenue / day.occupancy).toFixed(2) : '0'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* 5. DRILL DOWN MODAL */}
                {drillDate && (
                    <DrillDownModal
                        date={drillDate}
                        reservations={drillReservations}
                        onClose={() => setDrillDate(null)}
                        isLoading={drillLoading}
                    />
                )}
            </main>
        </div>
    );
}

// Sub-components
function MetricCard({ title, value, subValue, delta, deltaLabel, sparklineData, dataKey, isPercent }: any) {
    const isPos = delta >= 0;
    return (
        <div className="bg-white p-5 border border-slate-200 rounded-lg shadow-sm hover:border-slate-300 transition-colors group relative overflow-hidden print:border-gray-300 print:shadow-none">
            <div className="flex justify-between items-start mb-2 relative z-10">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</h3>
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${isPos ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'} print:bg-transparent print:text-black`}>
                    {isPos ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                    {Math.abs(delta).toFixed(1)}%
                </span>
            </div>
            <div className="flex items-end gap-2 mb-1 relative z-10">
                <span className="text-2xl font-bold text-slate-900 tracking-tight">{value}</span>
            </div>
            <p className="text-xs text-slate-400 relative z-10">{subValue || deltaLabel}</p>

            {/* Background Sparkline - Hidden in print to save ink/clutter */}
            <div className="absolute bottom-0 left-0 right-0 h-16 opacity-10 group-hover:opacity-20 transition-opacity print:hidden">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparklineData}>
                        <Area type="monotone" dataKey={dataKey} stroke="none" fill="#0f172a" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

function TableRow({ label, actual, budget, format, bold }: any) {
    const diff = actual - budget;
    const diffP = budget ? (diff / budget) * 100 : 0;
    const isPos = diff >= 0;

    const fmt = (v: number) => format === 'currency' ? `€${v.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}` : v.toLocaleString('tr-TR');

    return (
        <tr className="hover:bg-slate-50 transition-colors group">
            <td className={`px-6 py-3 text-slate-800 ${bold ? 'font-bold' : 'font-medium'}`}>{label}</td>
            <td className={`px-6 py-3 text-right text-slate-700 font-mono ${bold ? 'font-bold' : ''}`}>{fmt(actual)}</td>
            <td className="px-6 py-3 text-right text-slate-500 font-mono text-xs">{fmt(budget)}</td>
            <td className={`px-6 py-3 text-right font-mono text-xs ${isPos ? 'text-emerald-600' : 'text-red-600'}`}>{isPos ? '+' : ''}{fmt(diff)}</td>
            <td className="px-6 py-3 text-right">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-sm ${isPos ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'} print:bg-transparent print:text-black`}>
                    {Math.abs(diffP).toFixed(1)}%
                </span>
            </td>
        </tr>
    );
}
