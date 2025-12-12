"use client";

import { useEffect, useState } from "react";
import { analyticsService } from "@/lib/api";
import { format, subDays } from "date-fns";
import { tr } from "date-fns/locale";
import {
    ScrollText, Search, RefreshCw, Filter, User, Calendar,
    ShieldAlert, Download, ChevronRight, X, Layers, Clock
} from "lucide-react";
import { toast } from "sonner";
import { LogDetailModal } from "./LogDetailModal";

// Manual CSV download helper
const downloadCSV = (data: any[], filename: string) => {
    if (!data || !data.length) return;
    const headers = Object.keys(data[0]);
    const csvContent = "data:text/csv;charset=utf-8," +
        [headers.join(","), ...data.map(row => headers.map(fieldName => JSON.stringify(row[fieldName])).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export default function LogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState<any>(null);

    // Filters
    const [search, setSearch] = useState("");
    const [selectedModule, setSelectedModule] = useState<string>("");
    const [selectedUser, setSelectedUser] = useState<string>("");
    const [limit, setLimit] = useState(100);
    const [dateRange, setDateRange] = useState({
        start: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
        end: format(new Date(), 'yyyy-MM-dd')
    });

    const MODULES = [
        { key: "Reservation", label: "Rezervasyon" },
        { key: "User", label: "Kullanıcı" },
        { key: "System", label: "Sistem" },
        { key: "Authentication", label: "Giriş/Çıkış" },
        { key: "Report", label: "Raporlama" }
    ];

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadLogs();
        }, 500); // 500ms debounce for search
        return () => clearTimeout(timeoutId);
    }, [search, selectedModule, selectedUser, limit, dateRange]);

    const loadUsers = async () => {
        try {
            const res = await analyticsService.getUsers();
            setUsers(res);
        } catch (error) {
            console.error("Kullanıcılar yüklenemedi", error);
        }
    };

    const loadLogs = async () => {
        setLoading(true);
        try {
            const params: any = {
                limit: limit,
                startDate: dateRange.start,
                endDate: dateRange.end
            };

            if (selectedModule) params.module = selectedModule;
            if (selectedUser) params.user = selectedUser;

            const res = await analyticsService.getLogs(params);

            // Client-side text filter if search exists
            let filtered = res;
            if (search) {
                const q = search.toLowerCase();
                filtered = res.filter((l: any) =>
                    l.description?.toLowerCase().includes(q) ||
                    l.action?.toLowerCase().includes(q) ||
                    l.user?.toLowerCase().includes(q)
                );
            }

            setLogs(filtered);
        } catch (error) {
            toast.error("Log kayıtları alınamadı.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetFilters = () => {
        setSearch("");
        setSelectedModule("");
        setSelectedUser("");
        setLimit(100);
        setDateRange({
            start: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
            end: format(new Date(), 'yyyy-MM-dd')
        });
    };

    const handleExportCSV = () => {
        if (!logs.length) {
            toast.error("Dışa aktarılacak veri yok.");
            return;
        }

        // Flatten or select specific fields for cleaner CSV
        const exportData = logs.map(l => ({
            ID: l.id,
            Tarih: format(new Date(l.date), 'yyyy-MM-dd HH:mm:ss'),
            Modul: l.module,
            Kullanici: l.user,
            Islem: l.action,
            Aciklama: l.description,
            RefID: l.reservationId || ''
        }));

        downloadCSV(exportData, `SISTEM_LOGLARI_${format(new Date(), 'yyyyMMdd_HHmm')}.csv`);
        toast.success("CSV dosyası indirildi.");
    };

    return (
        <div className="h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm z-20">
                <div className="flex items-center gap-3">
                    <div className="bg-amber-50 text-amber-600 p-2.5 rounded-lg border border-amber-100 shadow-sm">
                        <ShieldAlert size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sistem Denetim Kayıtları</h1>
                        <p className="text-xs text-slate-500 font-medium">Güvenlik ve operasyonel işlem takibi.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => loadLogs()} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors tooltip" title="Yenile">
                        <RefreshCw size={18} />
                    </button>
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm"
                    >
                        <Download size={16} /> DIŞA AKTAR
                    </button>
                </div>
            </div>

            {/* Content Container */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar Filter Panel */}
                <div className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
                    <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-bold text-slate-700 flex items-center gap-2 text-sm">
                            <Filter size={16} className="text-indigo-500" /> Filtrele
                        </h3>
                        <button onClick={handleResetFilters} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
                            Temizle
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 space-y-6">
                        {/* Search */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Kayıt Ara</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Aciklama, islem..."
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Date Range */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                <Calendar size={12} /> Tarih Aralığı
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    className="w-full text-xs border border-slate-200 rounded-lg px-2 py-2 text-slate-600 focus:border-indigo-500 outline-none"
                                />
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    className="w-full text-xs border border-slate-200 rounded-lg px-2 py-2 text-slate-600 focus:border-indigo-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Modules */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                <Layers size={12} /> Modül
                            </label>
                            <div className="space-y-1">
                                {MODULES.map(m => (
                                    <button
                                        key={m.key}
                                        onClick={() => setSelectedModule(selectedModule === m.key ? "" : m.key)}
                                        className={`w-full text-left text-xs px-3 py-2 rounded-md font-medium transition-all flex justify-between items-center ${selectedModule === m.key ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                                    >
                                        {m.label}
                                        {selectedModule === m.key && <ChevronRight size={14} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Users */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                <User size={12} /> Kullanıcı
                            </label>
                            <select
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                            >
                                <option value="">Tüm Kullanıcılar</option>
                                {users.map((u: any) => (
                                    <option key={u.id} value={u.username}>{u.fullName} (@{u.username})</option>
                                ))}
                            </select>
                        </div>

                        {/* Limit */}
                        <div className="space-y-2 pt-4 border-t border-slate-100">
                            <label className="text-xs font-bold text-slate-500 uppercase">Gösterilecek Kayıt</label>
                            <div className="flex bg-slate-100 p-1 rounded-lg">
                                {[50, 100, 250, 500].map(l => (
                                    <button
                                        key={l}
                                        onClick={() => setLimit(l)}
                                        className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-all ${limit === l ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Table Area */}
                <div className="flex-1 bg-slate-50 overflow-hidden flex flex-col">
                    {/* Active Filters Bar */}
                    {(selectedModule || selectedUser || search) && (
                        <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center gap-3 overflow-x-auto whitespace-nowrap">
                            <span className="text-xs font-bold text-slate-400 uppercase mr-2">Seçili Filtreler:</span>
                            {selectedModule && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                                    Modül: {MODULES.find(m => m.key === selectedModule)?.label || selectedModule}
                                    <button onClick={() => setSelectedModule("")} className="hover:text-indigo-900"><X size={12} /></button>
                                </span>
                            )}
                            {selectedUser && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
                                    Kullanıcı: {selectedUser}
                                    <button onClick={() => setSelectedUser("")} className="hover:text-purple-900"><X size={12} /></button>
                                </span>
                            )}
                            {search && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold border border-orange-100">
                                    Arama: "{search}"
                                    <button onClick={() => setSearch("")} className="hover:text-orange-900"><X size={12} /></button>
                                </span>
                            )}
                        </div>
                    )}

                    {/* Table */}
                    <div className="flex-1 overflow-auto p-6">
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-w-[900px]">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                                    <tr>
                                        <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider w-24">Log ID</th>
                                        <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider w-40">Zaman</th>
                                        <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider w-32">Modül</th>
                                        <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider w-40">Kullanıcı</th>
                                        <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider w-32">İşlem</th>
                                        <th className="px-5 py-3.5 font-bold text-xs uppercase tracking-wider">Detay / Mesaj</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {loading ? (
                                        <tr><td colSpan={6} className="p-20 text-center">
                                            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                                            <p className="text-slate-500 text-xs">Yükleniyor...</p>
                                        </td></tr>
                                    ) : logs.length === 0 ? (
                                        <tr><td colSpan={6} className="p-20 text-center text-slate-400 italic flex flex-col items-center gap-2">
                                            <ScrollText size={32} className="opacity-20" />
                                            Kriterlere uygun kayıt bulunamadı.
                                        </td></tr>
                                    ) : (
                                        logs.map((log) => (
                                            <tr
                                                key={log.id}
                                                onClick={() => setSelectedLog(log)}
                                                className="hover:bg-indigo-50/50 transition-colors group cursor-pointer"
                                            >
                                                <td className="px-5 py-3 font-mono text-xs text-slate-400 font-medium">#{log.id.toString().padStart(6, '0')}</td>
                                                <td className="px-5 py-3">
                                                    <div className="flex gap-2 items-center text-slate-600">
                                                        <Clock size={12} className="text-slate-300" />
                                                        <span className="font-mono text-xs">{format(new Date(log.date), 'dd.MM.yyyy HH:mm')}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${getModuleStyle(log.module)}`}>
                                                        {log.module || 'SYSTEM'}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-[10px] font-bold border border-slate-200">
                                                            {log.user ? log.user.charAt(0).toUpperCase() : '?'}
                                                        </div>
                                                        <span className="font-bold text-xs text-slate-700">{log.user || 'System Bot'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <Badge action={log.action} />
                                                </td>
                                                <td className="px-5 py-3">
                                                    <p className="text-xs leading-relaxed max-w-xl truncate group-hover:whitespace-normal group-hover:overflow-visible text-slate-600">
                                                        {log.description}
                                                    </p>
                                                    {log.reservationId > 0 && (
                                                        <span className="inline-flex mt-1 items-center gap-1 text-[10px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-500">
                                                            Ref: RES#{log.reservationId}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 text-xs text-slate-400 text-right font-medium">
                            Bu aralıkta toplam <span className="text-slate-700 font-bold">{logs.length}</span> kayıt bulundu.
                        </div>
                    </div>
                </div>
            </div>

            {selectedLog && (
                <LogDetailModal
                    log={selectedLog}
                    onClose={() => setSelectedLog(null)}
                />
            )}
        </div>
    );
}

function Badge({ action }: { action: string }) {
    let styles = "bg-slate-100 text-slate-600 border-slate-200";
    const a = (action || "").toLowerCase();

    if (a.includes('create') || a.includes('add')) styles = "bg-emerald-50 text-emerald-700 border-emerald-200";
    else if (a.includes('update') || a.includes('edit')) styles = "bg-blue-50 text-blue-700 border-blue-200";
    else if (a.includes('delete') || a.includes('cancel')) styles = "bg-red-50 text-red-700 border-red-200";
    else if (a.includes('check')) styles = "bg-amber-50 text-amber-700 border-amber-200";
    else if (a.includes('login') || a.includes('auth')) styles = "bg-purple-50 text-purple-700 border-purple-200";

    return (
        <span className={`px-2 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider whitespace-nowrap ${styles}`}>
            {action || "UNKNOWN"}
        </span>
    );
}

function getModuleStyle(module: string): string {
    const m = (module || "").toLowerCase();
    if (m === 'reservation') return "bg-orange-50 text-orange-600 border-orange-100";
    if (m === 'user') return "bg-pink-50 text-pink-600 border-pink-100";
    if (m === 'report') return "bg-cyan-50 text-cyan-600 border-cyan-100";
    if (m === 'system') return "bg-slate-50 text-slate-600 border-slate-200";
    return "bg-slate-50 text-slate-600 border-slate-200";
}
