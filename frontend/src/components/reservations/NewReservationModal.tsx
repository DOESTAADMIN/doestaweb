import { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaSearch } from "react-icons/fa";
import { guestService } from "@/lib/api";

interface NewReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>;
}

export default function NewReservationModal({ isOpen, onClose, onSubmit }: NewReservationModalProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form States
    const [guestName, setGuestName] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        room: "",
        checkIn: new Date().toISOString().split('T')[0],
        checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        adults: "1",
        children: "0",
        agency: "ONLINE",
        board: "BB",
        balance: "100"
    });

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
        // Store guest ID internally if needed, for simplicity we just use name for now
        // In fully linked version you'd pass guestId
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({ ...formData, guestName });
            onClose();
        } catch (error) {
            alert("Error creating reservation");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-zinc-800/50">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Yeni Rezervasyon Kartı</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg transition-colors">
                        <FaTimes className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Guest Section */}
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Misafir Bilgileri</label>
                        <div className="relative">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Misafir Adı / Soyadı Ara..."
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-800/50 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={guestName}
                                        onChange={(e) => setGuestName(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="button" className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg font-bold text-sm hover:bg-blue-200 transition-colors flex items-center gap-2">
                                    <FaPlus /> Yeni
                                </button>
                            </div>

                            {/* Autocomplete Dropdown */}
                            {searchResults.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-48 overflow-auto">
                                    {searchResults.map((g: any) => (
                                        <div
                                            key={g.id}
                                            onClick={() => handleGuestSelect(g)}
                                            className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer text-sm"
                                        >
                                            <div className="font-bold">{g.firstName} {g.lastName}</div>
                                            <div className="text-xs text-gray-500">{g.identificationNumber}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Dates */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Giriş Tarihi</label>
                                <input
                                    type="date"
                                    className="w-full p-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.checkIn}
                                    onChange={e => setFormData({ ...formData, checkIn: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Çıkış Tarihi</label>
                                <input
                                    type="date"
                                    className="w-full p-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.checkOut}
                                    onChange={e => setFormData({ ...formData, checkOut: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Room & Capacity */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Oda No</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.room}
                                        onChange={e => setFormData({ ...formData, room: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fiyat</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.balance}
                                        onChange={e => setFormData({ ...formData, balance: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Yetişkin</label>
                                    <select
                                        className="w-full p-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-gray-700 rounded"
                                        value={formData.adults}
                                        onChange={e => setFormData({ ...formData, adults: e.target.value })}
                                    >
                                        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Çocuk</label>
                                    <select
                                        className="w-full p-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-gray-700 rounded"
                                        value={formData.children}
                                        onChange={e => setFormData({ ...formData, children: e.target.value })}
                                    >
                                        {[0, 1, 2, 3].map(n => <option key={n} value={n}>{n}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Board</label>
                                    <select
                                        className="w-full p-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-gray-700 rounded"
                                        value={formData.board}
                                        onChange={e => setFormData({ ...formData, board: e.target.value })}
                                    >
                                        <option value="BB">BB</option>
                                        <option value="HB">HB</option>
                                        <option value="FB">FB</option>
                                        <option value="AI">AI</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Kaydediliyor...' : 'Rezervasyonu Tamamla'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
