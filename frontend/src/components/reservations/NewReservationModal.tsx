import { useState, useEffect } from "react";
import { FaTimes, FaSearch, FaUserPlus, FaCalendarAlt, FaMoneyBillWave, FaCheckCircle, FaUser } from "react-icons/fa";
import { reservationService, guestService } from "@/lib/api";
import GuestDetailModal from "../reservations/GuestDetailModal";
import { toast } from "sonner";
import { differenceInDays } from "date-fns";

interface NewReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialRoom?: string;
    initialDate?: string;
}

export default function NewReservationModal({ isOpen, onClose, onSubmit, initialRoom, initialDate }: NewReservationModalProps) {
    const [guestName, setGuestName] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [guestModalOpen, setGuestModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        room: initialRoom || "",
        checkIn: initialDate || new Date().toISOString().split('T')[0],
        checkOut: initialDate ? new Date(new Date(initialDate).getTime() + 86400000).toISOString().split('T')[0] : new Date(Date.now() + 86400000).toISOString().split('T')[0],
        adults: "1",
        children: "0",
        agency: "ONLINE",
        board: "BB",
        balance: "100",
        guestId: undefined as number | undefined
    });

    useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({
                ...prev,
                room: initialRoom || "",
                checkIn: initialDate || new Date().toISOString().split('T')[0],
                checkOut: initialDate ? new Date(new Date(initialDate).getTime() + 86400000).toISOString().split('T')[0] : new Date(Date.now() + 86400000).toISOString().split('T')[0]
            }));
            setGuestName("");
            setSearchResults([]);
        }
    }, [isOpen, initialRoom, initialDate]);

    useEffect(() => {
        if (guestName.length > 2) {
            const timer = setTimeout(() => {
                guestService.getAll(guestName).then(setSearchResults);
            }, 500);
            return () => clearTimeout(timer);
        } else {
            setSearchResults([]);
        }
    }, [guestName]);

    const handleGuestSelect = (guest: any) => {
        setGuestName(guest.firstName + " " + guest.lastName);
        setSearchResults([]);
        setFormData(prev => ({ ...prev, guestId: guest.id }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({ ...formData, guestName, guestId: formData.guestId });
            onClose();
            toast.success("Rezervasyon kaydedildi.");
        } catch (error) {
            toast.error("Hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const days = differenceInDays(new Date(formData.checkOut), new Date(formData.checkIn));
    const totalPrice = (days > 0 ? days : 1) * parseFloat(formData.balance || "0");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md transition-all duration-300">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden transform transition-all scale-100 opacity-100">

                {/* Modern Header with Gradient */}
                <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex items-center justify-between overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <FaCalendarAlt className="opacity-80" />
                            Yeni Rezervasyon
                        </h2>
                        <p className="text-blue-100 text-sm mt-1">Hızlı rezervasyon oluşturma kartı</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="relative z-10 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row h-full">
                    {/* Main Form Area */}
                    <div className="flex-1 p-8 space-y-8 bg-gray-50/50 dark:bg-zinc-900/50">
                        <form id="res-form" onSubmit={handleSubmit} className="space-y-8">

                            {/* Guest Section */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">
                                    <FaUser className="text-blue-500" /> Misafir Bilgileri
                                </label>
                                <div className="relative group">
                                    <div className="flex gap-3">
                                        <div className="relative flex-1">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FaSearch className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Misafir Adı veya Soyadı..."
                                                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-800 border-2 border-gray-100 dark:border-zinc-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-gray-800 dark:text-gray-100 shadow-sm"
                                                value={guestName}
                                                onChange={(e) => setGuestName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setGuestModalOpen(true)}
                                            className="px-5 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl font-bold text-sm hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors flex items-center gap-2 border border-blue-100 dark:border-blue-800"
                                        >
                                            <FaUserPlus size={16} />
                                            <span className="hidden sm:inline">Yeni Ekle</span>
                                        </button>
                                    </div>

                                    {/* Premium Autocomplete Dropdown */}
                                    {searchResults.length > 0 && (
                                        <div className="absolute z-20 w-full mt-2 bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 rounded-xl shadow-xl max-h-60 overflow-auto divide-y divide-gray-50 dark:divide-zinc-700/50">
                                            {searchResults.map((g: any) => (
                                                <div
                                                    key={g.id}
                                                    onClick={() => handleGuestSelect(g)}
                                                    className="px-5 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer flex items-center justify-between group/item transition-colors"
                                                >
                                                    <div>
                                                        <div className="font-bold text-gray-800 dark:text-gray-100 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">{g.firstName} {g.lastName}</div>
                                                        <div className="text-xs text-gray-500 font-mono mt-0.5">{g.identificationNumber || "TC NO YOK"}</div>
                                                    </div>
                                                    <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-zinc-700 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400">
                                                        {g.firstName?.[0]}{g.lastName?.[0]}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Stay Details */}
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">
                                        <FaCalendarAlt className="text-indigo-500" /> Konaklama
                                    </label>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <span className="text-xs text-gray-500 font-semibold ml-1">Giriş Tarihi</span>
                                            <input
                                                type="date"
                                                className="w-full p-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-sm font-medium"
                                                value={formData.checkIn}
                                                onChange={e => setFormData({ ...formData, checkIn: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-xs text-gray-500 font-semibold ml-1">Çıkış Tarihi</span>
                                            <input
                                                type="date"
                                                className="w-full p-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-sm font-medium"
                                                value={formData.checkOut}
                                                onChange={e => setFormData({ ...formData, checkOut: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-gray-500 font-semibold ml-1 mb-1 block">Oda No</label>
                                            <input
                                                type="number"
                                                className="w-full p-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-sm font-bold text-lg"
                                                value={formData.room}
                                                onChange={e => setFormData({ ...formData, room: e.target.value })}
                                                required
                                                placeholder="Örn: 101"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 font-semibold ml-1 mb-1 block">Board Tipi</label>
                                            <select
                                                className="w-full p-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-sm font-medium h-[54px]"
                                                value={formData.board}
                                                onChange={e => setFormData({ ...formData, board: e.target.value })}
                                            >
                                                <option value="BB">BB (Oda Kahvaltı)</option>
                                                <option value="HB">HB (Yarım Pansiyon)</option>
                                                <option value="FB">FB (Tam Pansiyon)</option>
                                                <option value="AI">AI (Her Şey Dahil)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment & Conf */}
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-2">
                                        <FaMoneyBillWave className="text-green-500" /> Fiyatlandırma
                                    </label>

                                    <div className="space-y-1">
                                        <span className="text-xs text-gray-500 font-semibold ml-1">Günlük Oda Fiyatı (EUR)</span>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                className="w-full p-3 pl-10 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none shadow-sm font-bold text-lg"
                                                value={formData.balance}
                                                onChange={e => setFormData({ ...formData, balance: e.target.value })}
                                                required
                                            />
                                            <span className="absolute left-4 top-[50%] -translate-y-1/2 text-gray-400 font-bold">€</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-gray-500 font-semibold ml-1 mb-1 block">Yetişkin</label>
                                            <select
                                                className="w-full p-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl font-medium"
                                                value={formData.adults}
                                                onChange={e => setFormData({ ...formData, adults: e.target.value })}
                                            >
                                                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Yetişkin</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 font-semibold ml-1 mb-1 block">Çocuk</label>
                                            <select
                                                className="w-full p-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl font-medium"
                                                value={formData.children}
                                                onChange={e => setFormData({ ...formData, children: e.target.value })}
                                            >
                                                {[0, 1, 2, 3].map(n => <option key={n} value={n}>{n} Çocuk</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Sidebar Summary */}
                    <div className="w-full md:w-80 bg-gray-50 dark:bg-zinc-800/80 border-l border-gray-200 dark:border-zinc-800 p-8 flex flex-col justify-between backdrop-blur-sm">
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">ÖZET</h3>

                            <div className="space-y-4">
                                <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                                    <div className="text-xs text-gray-400 mb-1">Misafir</div>
                                    <div className="font-bold text-gray-800 dark:text-gray-100 truncate">{guestName || "Seçilmedi"}</div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Oda No</span>
                                        <span className="font-bold">{formData.room || "-"}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Geceleme</span>
                                        <span className="font-bold">{days > 0 ? days : 0} Gece</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Kişi Sayısı</span>
                                        <span className="font-bold">{formData.adults} Y, {formData.children} Ç</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200 dark:border-zinc-700">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 dark:text-gray-400 font-medium">Toplam Tutar</span>
                                        <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                                            {totalPrice.toLocaleString('tr-TR', { style: 'currency', currency: 'EUR' })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-right text-gray-400 mt-1">Vergiler dahildir</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mt-8">
                            <button
                                type="submit"
                                form="res-form"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <span className="animate-pulse">İşleniyor...</span>
                                ) : (
                                    <>
                                        <FaCheckCircle size={18} />
                                        Rezervasyonu Onayla
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full py-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 font-bold transition-colors text-sm"
                            >
                                İptal Et
                            </button>
                        </div>
                    </div>
                </div>

                {/* Guest Create Modal */}
                <GuestDetailModal
                    isOpen={guestModalOpen}
                    onClose={() => setGuestModalOpen(false)}
                    onSave={async (newGuest: any) => {
                        try {
                            setLoading(true);

                            // Map form data (ReservationGuest format) to API Guest format
                            const apiGuest = {
                                ...newGuest,
                                phoneNumber: newGuest.phone,
                                identificationNumber: newGuest.idNumber,
                                // Fix empty dates
                                birthDate: newGuest.birthDate || null,
                                idValidDate: newGuest.idValidDate || null,
                                idIssueDate: newGuest.idIssueDate || null,
                                passportValidDate: newGuest.passportValidDate || null,
                                passportIssueDate: newGuest.passportIssueDate || null,
                            };

                            // 1. Create Guest in Backend
                            const createdGuest = await guestService.create(apiGuest);

                            // 2. Update Form with new guest details
                            const fullName = `${createdGuest.firstName} ${createdGuest.lastName}`;
                            setGuestName(fullName);

                            // Store guestId in formData or separate state to pass to parent
                            setFormData(prev => ({ ...prev, guestId: createdGuest.id }));

                            toast.success("Misafir başarıyla oluşturuldu.");
                            setGuestModalOpen(false);
                        } catch (error) {
                            console.error("Failed to create guest", error);
                            toast.error("Misafir oluşturulurken hata oluştu.");
                        } finally {
                            setLoading(false);
                        }
                    }}
                    initialData={{ firstName: guestName }}
                />
            </div>
        </div>
    );
}
