import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ReservationLog, reservationService } from "@/lib/api";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { History, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    reservationId?: number;
}

export default function HistoryModal({ isOpen, onClose, reservationId }: HistoryModalProps) {
    const [logs, setLogs] = useState<ReservationLog[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && reservationId) {
            loadHistory();
        }
    }, [isOpen, reservationId]);

    const loadHistory = async () => {
        if (!reservationId) return;
        setIsLoading(true);
        try {
            const data = await reservationService.getHistory(reservationId);
            setLogs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <History size={20} />
                        İşlem Geçmişi
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto min-h-[300px] border rounded-md p-2 bg-slate-50 relative">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                            <RefreshCw className="animate-spin text-blue-500" />
                        </div>
                    )}

                    {logs.length === 0 && !isLoading && (
                        <div className="text-center text-gray-500 py-8 text-sm">
                            Henüz işlem kaydı bulunmuyor.
                        </div>
                    )}

                    <div className="space-y-3">
                        {logs.map((log) => (
                            <div key={log.id} className="bg-white p-3 rounded shadow-sm border border-gray-100 text-sm">
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide
                                        ${log.action === 'Create' ? 'bg-green-100 text-green-700' :
                                            log.action === 'Update' ? 'bg-blue-100 text-blue-700' :
                                                log.action === 'CheckIn' ? 'bg-purple-100 text-purple-700' :
                                                    log.action === 'CheckOut' ? 'bg-gray-200 text-gray-700' :
                                                        'bg-gray-100 text-gray-600'}`}>
                                        {log.action}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {format(new Date(log.date), "dd MMM HH:mm", { locale: tr })}
                                    </span>
                                </div>
                                <p className="text-gray-700 font-medium">{log.description}</p>
                                <div className="mt-1 text-xs text-gray-400 flex items-center gap-1">
                                    User: {log.user}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
