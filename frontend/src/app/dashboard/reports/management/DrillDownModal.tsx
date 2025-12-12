import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { X, ExternalLink } from "lucide-react";
import { Reservation } from "@/lib/api";

interface DrillDownModalProps {
    date: string;
    reservations: Reservation[];
    onClose: () => void;
    isLoading: boolean;
}

export function DrillDownModal({ date, reservations, onClose, isLoading }: DrillDownModalProps) {
    if (!date) return null;

    // Calculate daily totals for this specific view
    const totalDailyRevenue = reservations.reduce((sum, res) => {
        // Logic to extract just this day's revenue would be complex client side if we don't have daily breakdown in Reservation model
        // For now, displaying Total Price of the reservation is standard for "who stayed", 
        // but ideally we'd show "Daily Price" for this date.
        // Let's assume the passed reservations are "Active on this date".
        return sum; // We won't sum totals here to avoid confusion comparing Daily Revenue vs Total Reservation Cost
    }, 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Detaylı Rezervasyon Listesi</h2>
                        <p className="text-sm text-slate-500 font-medium">
                            {format(new Date(date), 'dd MMMM yyyy, EEEE', { locale: tr })}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-red-500">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-0">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-4">
                            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
                            <p className="text-slate-500 text-sm font-medium">Veriler getiriliyor...</p>
                        </div>
                    ) : reservations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                            <p>Bu tarihte aktif rezervasyon bulunamadı.</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">Misafir</th>
                                    <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">Oda</th>
                                    <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">Giriş - Çıkış</th>
                                    <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider">Acenta</th>
                                    <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider text-right">Durum</th>
                                    <th className="px-6 py-3 font-medium text-xs uppercase tracking-wider text-right">Toplam Tutar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {reservations.map((res) => (
                                    <tr key={res.id} className="hover:bg-indigo-50/30 transition-colors group">
                                        <td className="px-6 py-3 font-medium text-slate-900 flex items-center gap-2">
                                            {res.guestName}
                                            {res.id && (
                                                <a href={`/dashboard/reservations?id=${res.id}`} target="_blank" className="opacity-0 group-hover:opacity-100 text-indigo-600 hover:text-indigo-800 transition-opacity">
                                                    <ExternalLink size={12} />
                                                </a>
                                            )}
                                        </td>
                                        <td className="px-6 py-3 text-slate-600 font-mono text-xs">
                                            {res.room?.number ? <span className="bg-slate-100 px-2 py-1 rounded text-slate-700 font-bold">{res.room.number}</span> : '-'}
                                        </td>
                                        <td className="px-6 py-3 text-slate-500 text-xs">
                                            {format(new Date(res.checkInDate), 'dd MMM')} - {format(new Date(res.checkOutDate), 'dd MMM')}
                                        </td>
                                        <td className="px-6 py-3 text-slate-600">
                                            {res.agency || 'Direct'}
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${res.status === 'CheckedIn' ? 'bg-emerald-100 text-emerald-700' :
                                                    res.status === 'CheckedOut' ? 'bg-gray-100 text-gray-700' :
                                                        res.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                            'bg-blue-100 text-blue-700'
                                                }`}>
                                                {res.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-right font-mono text-slate-900">
                                            {res.totalPrice.toLocaleString('tr-TR', { style: 'currency', currency: res.currency || 'EUR' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-xl flex justify-between items-center text-xs text-slate-500">
                    <span>Toplam {reservations.length} kayıt listelendi.</span>
                    <button onClick={onClose} className="px-4 py-2 bg-white border border-slate-300 shadow-sm rounded-md text-slate-700 font-bold hover:bg-slate-50">
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    );
}
