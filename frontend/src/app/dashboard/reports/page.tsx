"use client";

import { useEffect, useState } from "react";
import { RevenueChart, OccupancyChart } from "@/components/reports/ReportCharts";
import { analyticsService } from "@/lib/api";
import { FaCalendarAlt, FaDownload, FaChartLine, FaBed, FaWallet, FaPercentage } from "react-icons/fa";
import { toast } from "sonner";
import { format, subDays } from "date-fns";
import { tr } from "date-fns/locale";

export default function ReportsPage() {
    const [loading, setLoading] = useState(true);
    const [managementData, setManagementData] = useState<any>(null);
    const [occupancyReport, setOccupancyReport] = useState<any[]>([]);
    const [dateRange, setDateRange] = useState({
        start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
        end: format(new Date(), 'yyyy-MM-dd')
    });

    useEffect(() => {
        loadData();
    }, [dateRange]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [mgmt, occ] = await Promise.all([
                analyticsService.getManagement(),
                analyticsService.getOccupancy(dateRange.start, dateRange.end)
            ]);
            setManagementData(mgmt);
            setOccupancyReport(occ);
        } catch (error) {
            console.error(error);
            toast.error("Rapor verileri yüklenirken hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-8 bg-slate-50 min-h-screen p-8 text-slate-800 font-sans print:bg-white print:p-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6 print:hidden">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <FaChartLine className="text-indigo-600" /> Yönetim Raporları
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm">Otel performans metrikleri ve finansal analizler.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
                        <FaCalendarAlt className="text-slate-400" />
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                            className="text-sm border-none outline-none text-slate-600 font-medium bg-transparent"
                        />
                        <span className="text-slate-300">-</span>
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                            className="text-sm border-none outline-none text-slate-600 font-medium bg-transparent"
                        />
                    </div>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700 transition-all shadow-indigo-200"
                    >
                        <FaDownload /> PDF / YAZDIR
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="py-20 text-center">
                    <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-500 text-sm font-medium">Finansal veriler analiz ediliyor...</p>
                </div>
            ) : (
                <>
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <KpiCard
                            title="Toplam Gelir"
                            value={`₺${managementData?.totalRevenue?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`}
                            icon={<FaWallet size={24} />}
                            trend="+12.5%"
                            color="indigo"
                        />
                        <KpiCard
                            title="Ort. Oda Fiyatı (ADR)"
                            value={`₺${managementData?.adr?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`}
                            icon={<FaPercentage size={24} />}
                            trend="+5.2%"
                            color="blue"
                        />
                        <KpiCard
                            title="RevPAR"
                            value={`₺${managementData?.revPar?.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`}
                            icon={<FaChartLine size={24} />}
                            trend="+8.1%"
                            color="cyan"
                        />
                        <KpiCard
                            title="Doluluk Oranı"
                            value={`%${managementData?.occupancyRate}`}
                            icon={<FaBed size={24} />}
                            trend="-2.1%"
                            color="emerald"
                        />
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:block print:space-y-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 print:shadow-none print:border">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
                                Günlük Gelir Analizi
                            </h3>
                            <div className="h-[350px]">
                                <RevenueChart data={occupancyReport} />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 print:shadow-none print:border">
                            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
                                Doluluk Trendi
                            </h3>
                            <div className="h-[350px]">
                                <OccupancyChart data={occupancyReport} />
                            </div>
                        </div>
                    </div>

                    {/* Report Summary Table (Hidden in default view, visible in print or detailed view could be nice, but stick to design) */}
                    {/* Using the Management Table for detail */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden print:shadow-none print:border">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-lg font-bold text-slate-800">Operasyonel Özet</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                            <StatBox label="Toplam Oda" value={managementData?.availableRooms} />
                            <StatBox label="Satılan Oda" value={managementData?.soldRooms} />
                            <StatBox label="Arızalı Oda (OOO)" value={managementData?.outOfOrderRooms} />
                            <StatBox label="Toplam Misafir" value={managementData?.customers} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function KpiCard({ title, value, icon, trend, color }: any) {
    const colors: any = {
        indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
        blue: "bg-blue-50 text-blue-600 ring-blue-100",
        cyan: "bg-cyan-50 text-cyan-600 ring-cyan-100",
        emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ring-1 ${colors[color]} group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                {/* Mock Trend - In real app, calculate this */}
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {trend}
                </span>
            </div>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-wide mb-1 opacity-80">{title}</p>
            <h4 className="text-2xl font-bold text-slate-800 tracking-tight">{value}</h4>
        </div>
    );
}

function StatBox({ label, value }: any) {
    return (
        <div className="p-6 text-center group hover:bg-slate-50 transition-colors">
            <p className="text-xs uppercase font-bold text-slate-400 mb-2">{label}</p>
            <p className="text-3xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{value}</p>
        </div>
    );
}
