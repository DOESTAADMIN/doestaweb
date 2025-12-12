import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { X, Copy, Check } from "lucide-react";
import { ReservationLog } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";

interface LogDetailModalProps {
    log: ReservationLog;
    onClose: () => void;
}

export function LogDetailModal({ log, onClose }: LogDetailModalProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(JSON.stringify(log, null, 2));
        setCopied(true);
        toast.success("Log detayları kopyalandı");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Log Detayı</h2>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                            <span className="font-mono bg-slate-200 px-1.5 py-0.5 rounded text-slate-700 text-xs">ID: {log.id}</span>
                            <span>•</span>
                            <span>{format(new Date(log.date), 'dd MMMM yyyy HH:mm:ss', { locale: tr })}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-red-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-50 rounded border border-slate-100">
                            <label className="text-xs font-bold text-slate-400 uppercase">Modül</label>
                            <p className="font-medium text-slate-700">{log.module}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded border border-slate-100">
                            <label className="text-xs font-bold text-slate-400 uppercase">İşlem</label>
                            <p className="font-medium text-slate-700">{log.action}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded border border-slate-100">
                            <label className="text-xs font-bold text-slate-400 uppercase">Kullanıcı</label>
                            <p className="font-medium text-slate-700">{log.user}</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded border border-slate-100">
                            <label className="text-xs font-bold text-slate-400 uppercase">Ref ID</label>
                            <p className="font-medium text-slate-700">{log.reservationId || '-'}</p>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold text-slate-400 uppercase">Teknik Detay (JSON)</label>
                            <button
                                onClick={handleCopy}
                                className="text-xs flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors"
                            >
                                {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                                {copied ? 'Kopyalandı' : 'Kopyala'}
                            </button>
                        </div>
                        <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-auto text-xs font-mono max-h-60 border border-slate-800">
                            {JSON.stringify(log, null, 2)}
                        </pre>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-xl flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-bold shadow-sm transition-colors">
                        Tamam
                    </button>
                </div>
            </div>
        </div>
    );
}
