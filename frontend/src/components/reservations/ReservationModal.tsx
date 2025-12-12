"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/Select";
import { useState, useEffect } from "react";

import { Reservation, Room, ReservationGuest, ReservationDailyPrice, FolioTransaction, api, reservationService, guestService, roomService } from "@/lib/api";
import { X, Calendar, User, CreditCard, Check, Plus, Trash2, Edit2, Search, Printer, Lock, RefreshCw, MoreHorizontal, FileText, ChevronLeft, ChevronRight, FileSpreadsheet, Users, Copy, Save, History, Info, UserPlus, Package as PackageIcon, Zap, Camera, Bell, Play, Ban, ArrowUp, Menu, ArrowRightLeft, Download, Database } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";
import GuestDetailModal from "./GuestDetailModal";
import JobRecordModal from "./JobRecordModal";
import PackagesModal from "./PackagesModal";
import HistoryModal from "./HistoryModal";
import FolioTransactionModal from "./FolioTransactionModal";
import NoteModal from "./NoteModal";

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Partial<Reservation>;
    onSave?: () => void;
}

export default function ReservationModal({ isOpen, onClose, initialData, onSave }: ReservationModalProps) {
    const [activeTab, setActiveTab] = useState("misafirler");
    const [isLoading, setIsLoading] = useState(false);
    const [availableGuests, setAvailableGuests] = useState<any[]>([]);
    const [isJobRecordOpen, setIsJobRecordOpen] = useState(false);
    const [isPackagesOpen, setIsPackagesOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isFolioModalOpen, setIsFolioModalOpen] = useState(false);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [isGuestSelectionOpen, setIsGuestSelectionOpen] = useState(false);
    const [isRoomSelectionOpen, setIsRoomSelectionOpen] = useState(false);
    const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
    const [boardTypes, setBoardTypes] = useState<any[]>([]);
    const [currencies, setCurrencies] = useState<any[]>([]);
    const [priceTypes, setPriceTypes] = useState<any[]>([]);


    // Guest Detail Modal State
    const [isGuestDetailOpen, setIsGuestDetailOpen] = useState(false);
    const [selectedGuestForEdit, setSelectedGuestForEdit] = useState<any>(null);

    // Confirmation State
    const [confirmConfig, setConfirmConfig] = useState<{ isOpen: boolean; title: string; desc: string; onConfirm: () => void }>({ isOpen: false, title: "", desc: "", onConfirm: () => { } });

    // Pricing Tab State



    const openConfirm = (title: string, desc: string, onConfirm: () => void) => {
        setConfirmConfig({ isOpen: true, title, desc, onConfirm });
    };

    const handleAddGuest = () => {
        setSelectedGuestForEdit(null); // New guest
        setIsGuestDetailOpen(true);
    };

    const handleEditGuest = (guest: any) => {
        setSelectedGuestForEdit(guest);
        setIsGuestDetailOpen(true);
    };

    const handleGuestSave = async (guestData: any) => {
        // Optimistic update
        const newGuests = [...(formData.guests || [])];

        if (selectedGuestForEdit) {
            // Update existing
            const index = newGuests.findIndex(g => g.id === selectedGuestForEdit.id || g === selectedGuestForEdit);
            if (index !== -1) newGuests[index] = { ...newGuests[index], ...guestData };
        } else {
            // Add new (generate temp ID)
            newGuests.push({
                id: 0, // 0 indicates new
                reservationId: formData.id || 0,
                isMainGuest: newGuests.length === 0,
                ...guestData
            });
        }

        setFormData(prev => ({ ...prev, guests: newGuests }));

        // If reservation ID exists, persist immediately
        if (formData.id) {
            try {
                // Ensure date is null if empty string to avoid API 400
                const apiGuestData = {
                    ...guestData,
                    birthDate: guestData.birthDate || null,
                    reservationId: formData.id
                };

                // If it's a new guest on an existing reservation, create it
                if (!selectedGuestForEdit || (selectedGuestForEdit.id === 0)) {
                    await api.post(`/reservations/${formData.id}/guests`, apiGuestData);
                } else {
                    // Update existing
                    if (selectedGuestForEdit.id) {
                        await reservationService.updateGuest(selectedGuestForEdit.id, apiGuestData);
                    }
                }
                toast.success("Misafir listesi güncellendi.");
                if (loadReservation) loadReservation(formData.id); // Reload to get fresh IDs
            } catch (e) {
                console.error(e);
                toast.error("Misafir sunucuya kaydedilemedi.");
            }
        }
    };
    useEffect(() => {
        const loadDefinitions = async () => {
            try {
                const [boards, currs, prices] = await Promise.all([
                    roomService.getBoardTypes(),
                    roomService.getCurrencies(),
                    roomService.getPriceTypes()
                ]);
                setBoardTypes(boards);
                setCurrencies(currs);
                setPriceTypes(prices);
            } catch (error) {
                console.error("Failed to load definitions", error);
            }
        };
        loadDefinitions();
    }, []);

    useEffect(() => {
        if (isRoomSelectionOpen) {
            roomService.getAll().then(setAvailableRooms).catch(console.error);
        }
    }, [isRoomSelectionOpen]);

    // Initial State
    const [formData, setFormData] = useState<Partial<Reservation>>({
        agency: "ONLINE",
        voucherNo: "",
        checkInDate: new Date().toISOString().split('T')[0],
        checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        adultCount: 2,
        childCount: 0,
        babyCount: 0,
        roomType: "STD", // Should match a real code if possible, or we derive from selection
        boardType: "BB",
        nationality: "TR",
        status: "Draft",
        guests: [],
        note: "",
        marketSegment: "Individual",
        source: "Email",
        specials: "",
        currency: "EUR", // Default
        contractType: "WALKIN",
        priceType: "Refundable",
        manualPriceActive: false,
        exchangeRate: 1.00,
        exchangeDate: new Date().toISOString().split('T')[0],
        discountActive: false,
        taxIncluded: "Included",
        applyTax: "No",
        ...initialData
    });

    useEffect(() => {
        if (isOpen && initialData?.id) {
            loadReservation(initialData.id);
        } else if (isOpen) {
            // Reset for new
            setFormData({
                agency: "ONLINE",
                checkInDate: new Date().toISOString().split('T')[0],
                checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                adultCount: 2,
                childCount: 0,
                status: "Confirmed",
                guests: [],
                roomType: "STD",
                boardType: "BB",
                nationality: "TR",
                currency: currencies[0]?.code || "EUR",
                ...initialData
            });
        }
    }, [isOpen, initialData, currencies]); // added currencies dependency to set default if loaded

    const loadReservation = async (id: number) => {
        setIsLoading(true);
        try {
            const data = await reservationService.getById(id);
            // Patch for case sensitivity if backend returns PascalCase
            if (!data.guests && (data as any).Guests) data.guests = (data as any).Guests;
            if (!data.folioTransactions && (data as any).FolioTransactions) data.folioTransactions = (data as any).FolioTransactions;
            if (!data.requests && (data as any).Requests) data.requests = (data as any).Requests;
            if (!data.notes && (data as any).Notes) data.notes = (data as any).Notes;

            // 1. Patch removed: Do not auto-create guests. User can add manually.



            // Fix case sensitive keys if needed for simple fields
            if (!data.voucherNo && (data as any).VoucherNo) data.voucherNo = (data as any).VoucherNo;
            if (!data.agency && (data as any).Agency) data.agency = (data as any).Agency;
            if (!data.roomType && (data as any).RoomType) data.roomType = (data as any).RoomType;
            if (!data.boardType && (data as any).BoardType) data.boardType = (data as any).BoardType;

            setFormData(data);
        } catch (error) {
            console.error("Failed to load reservation", error);
            toast.error("Rezervasyon yüklenemedi.");
        } finally {
            setIsLoading(false);
        }
    };

    const [isLocked, setIsLocked] = useState(false);

    const handleDisconnect = () => {
        onClose();
    };

    const handlePrint = () => {
        window.print();
    };

    const handleCopy = () => {
        const copy = { ...formData };
        delete copy.id;
        delete copy.room;
        delete copy.roomId;
        delete copy.guests;
        delete copy.folioTransactions;
        setFormData({ ...copy, status: "Draft", voucherNo: (copy.voucherNo || "") + " (Kopya)" });
        toast.info("Rezervasyon kopyalandı. Yeni kayıt olarak düzenleyebilirsiniz.");
    };

    const handleLock = () => {
        setIsLocked(!isLocked);
    };

    const handlePrev = () => {
        if (formData.id && formData.id > 1) loadReservation(formData.id - 1);
    };

    const handleNext = () => {
        if (formData.id) loadReservation(formData.id + 1);
    };

    const handleNew = () => {
        setIsLocked(false);
        setFormData({
            agency: "ONLINE",
            checkInDate: new Date().toISOString().split('T')[0],
            checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            adultCount: 2,
            childCount: 0,
            babyCount: 0,
            status: "Draft",
            guests: [],
            dailyPrices: [],
            folioTransactions: [],
            roomType: "STD",
            boardType: "BB",
            nationality: "TR",
            marketSegment: "Individual",
            source: "Email"
        });
        toast.success("Yeni rezervasyon formu açıldı.");
    };

    const handleHistory = () => {
        if (!formData.id) {
            toast.error("Kaydedilmemiş rezervasyonun geçmişi olmaz.");
            return;
        }
        setIsHistoryOpen(true);
    };

    const handleProfileAssign = async () => {
        try {
            const data = await guestService.getAll();
            setAvailableGuests(data);
            setIsGuestSelectionOpen(true);
        } catch (e) {
            console.error(e);
            alert("Misafir listesi alınamadı.");
        }
    };

    const handleSelectGuest = async (guest: any) => {
        const newGuest: Partial<ReservationGuest> = {
            firstName: guest.firstName,
            lastName: guest.lastName,
            reservationId: formData.id || 0,
            isMainGuest: false,
            passportNo: guest.passportNo || "", // Map Passport
            idNumber: guest.identificationNumber || "", // Map ID
            nationality: guest.nationality || "TR",
            phone: guest.phoneNumber || "", // Map Phone
            email: guest.email || ""
        };

        if (formData.id) {
            try {
                const added = await reservationService.addGuest(formData.id, newGuest);
                setFormData(prev => ({ ...prev, guests: [...(prev.guests || []), added] }));
                toast.success("Misafir eklendi.");
            } catch (e) { toast.error("Misafir eklenirken hata oluştu."); }
        } else {
            setFormData(prev => ({ ...prev, guests: [...(prev.guests || []), { ...newGuest, id: -(Date.now()) }] as ReservationGuest[] }));
        }
        setIsGuestSelectionOpen(false);
    };

    const handleSelectRoom = (room: Room) => {
        setFormData(prev => ({
            ...prev,
            roomId: room.id,
            room: room,
            roomType: room.type // Auto update type
        }));
        setIsRoomSelectionOpen(false);
    };

    const handleCalcPrice = () => {
        const nights = (new Date(formData.checkOutDate!).getTime() - new Date(formData.checkInDate!).getTime()) / (1000 * 3600 * 24);

        // Base price from Room or default
        let basePrice = formData.room?.price || 100;

        // Adjust for Room Type if no specific room assigned
        if (!formData.room) {
            if (formData.roomType === 'SUI') basePrice = 200;
            else if (formData.roomType === 'DLX') basePrice = 150;
        }

        // Board Type addition
        const selectedBoard = boardTypes.find(b => b.code === formData.boardType);
        let extraPerPerson = 0;
        if (selectedBoard) {
            extraPerPerson = selectedBoard.extraAdult || 0;
            // Simplified logic: assume all adults pay extra. In real world, complex logic applies.
        }

        const dailyPrice = basePrice + (extraPerPerson * (formData.adultCount || 0));

        const prices: ReservationDailyPrice[] = [];
        for (let i = 0; i < nights; i++) {
            const d = new Date(formData.checkInDate!);
            d.setDate(d.getDate() + i);
            prices.push({
                id: 0,
                reservationId: formData.id || 0,
                date: d.toISOString(),
                price: dailyPrice,
                currency: formData.currency || "EUR",
                roomType: formData.roomType || "STD",
                boardType: formData.boardType || "BB"
            });
        }
        setFormData(prev => ({
            ...prev,
            dailyPrices: prices,
            totalPrice: prices.reduce((sum, p) => sum + p.price, 0)
        }));
    };



    const handleSave = async () => {
        if (isLocked) {
            alert("Kilitli kayıt düzenlenemez.");
            return;
        }
        try {
            // Ensure guests are properly formatted
            const dataToSave = { ...formData };
            if (dataToSave.guests) {
                dataToSave.guests = dataToSave.guests.map(g => {
                    if (g.id && g.id < 0) { const { id, ...rest } = g; return rest as ReservationGuest; } // Remove temp IDs
                    return g;
                });

                // Sync Guest Name from list
                if (dataToSave.guests.length > 0) {
                    const main = dataToSave.guests.find(g => g.isMainGuest) || dataToSave.guests[0];
                    dataToSave.guestName = `${main.firstName} ${main.lastName}`;
                } else {
                    dataToSave.guestName = "İsimsiz";
                }
            }

            if (dataToSave.id) {
                await reservationService.update(dataToSave.id, dataToSave);
                toast.success("Rezervasyon güncellendi!");
            } else {
                const newRes = await reservationService.create(dataToSave);
                setFormData(newRes as Reservation);
                toast.success("Rezervasyon oluşturuldu!");
            }
            onSave?.();
        } catch (e) {
            console.error(e);
            toast.error("Kayıt başarısız!");
        }
    };

    // --- Guest Logic ---


    const updateGuest = (index: number, field: keyof ReservationGuest, value: any) => {
        if (isLocked) return;
        setFormData(prev => {
            const guests = [...(prev.guests || [])];
            guests[index] = { ...guests[index], [field]: value };
            return { ...prev, guests };
        });
    };

    const handleCreateProfile = async (guest: ReservationGuest) => {
        if (!guest.firstName || !guest.lastName) {
            toast.error("Ad ve Soyad zorunludur.");
            return;
        }

        try {
            const newProfile = {
                firstName: guest.firstName,
                lastName: guest.lastName,
                identificationNumber: guest.passportNo || guest.idNumber,
                email: guest.email,
                phoneNumber: guest.phone,
                nationality: guest.nationality || "TR",
                birthDate: guest.birthDate ? new Date(guest.birthDate) : null,
                isVip: false
            };
            await guestService.create(newProfile);
            toast.success("Misafir profili oluşturuldu!");
        } catch (e) {
            console.error(e);
            toast.error("Profil oluşturulamadı.");
        }
    };

    const handleRemoveGuest = async (idOrIndex: number) => {
        if (isLocked) return;

        openConfirm("Misafiri Sil", "Bu misafiri rezervasyondan çıkartmak istediğinize emin misiniz?", async () => {
            if (formData.id) {
                // Determine if it's a real ID or index
                // Our logic: If it's a real backend guest, it has an ID
                const guest = formData.guests?.[idOrIndex];

                // If it's a temp guest (id negative) or waiting to be saved, just remove from state
                if (guest && guest.id && guest.id > 0) {
                    try {
                        await reservationService.removeGuest(guest.id);
                        toast.success("Misafir silindi.");
                    } catch (e) { console.error(e); toast.error("Silinemedi."); return; }
                }

                setFormData(prev => ({
                    ...prev,
                    guests: prev.guests?.filter((_, i) => i !== idOrIndex)
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    guests: prev.guests?.filter((_, i) => i !== idOrIndex)
                }));
            }
        });
    };



    const handleRefresh = async () => {
        if (formData.id) {
            try {
                const refreshed = await reservationService.getById(formData.id);
                setFormData(prev => ({ ...prev, ...refreshed }));
                toast.success("Veriler yenilendi.");
            } catch (e) { toast.error("Yenileme başarısız."); }
        }
    };




    const handleStatusChange = async (newStatus: string) => {
        if (!formData.id) {
            setFormData(prev => ({ ...prev, status: newStatus }));
            return;
        }

        if (isLocked) {
            toast.error("Kilitli kayıtta durum değişikliği yapılamaz.");
            return;
        }

        try {
            if (newStatus === "CheckedIn") {
                await reservationService.checkIn(formData.id);
                toast.success("Check-In işlemi başarılı!");
                setFormData(prev => ({ ...prev, status: "CheckedIn" }));
            } else if (newStatus === "CheckedOut") {
                await reservationService.checkOut(formData.id);
                toast.success("Check-Out işlemi başarılı!");
                setFormData(prev => ({ ...prev, status: "CheckedOut" }));
            } else {
                // For other statuses, just update helper (or could call update immediately)
                // Here we just update local state, user must click Save to persist if it's just a status change like "Confirmed"
                // Or we can auto-save. Let's auto-save for status consistency.
                await reservationService.update(formData.id, { ...formData, status: newStatus });
                toast.success("Durum güncellendi.");
                setFormData(prev => ({ ...prev, status: newStatus }));
            }
        } catch (error) {
            console.error(error);
            toast.error("Durum değiştirilemedi.");
        }
    };

    // --- FOLIO TAB ---
    const handleAddFolioTransaction = () => {
        setIsFolioModalOpen(true);
    };

    const handleFolioTransactionAdded = async () => {
        if (formData.id) {
            const updated = await reservationService.getById(formData.id);
            setFormData(prev => ({ ...prev, folioTransactions: updated.folioTransactions, paidAmount: updated.paidAmount }));
        }
    };

    // --- NOTES TAB ---
    const handleAddNote = async (msg: string) => {
        if (!formData.id) return;
        try {
            const newNote = await reservationService.addNote(formData.id, { message: msg, isActive: true });
            setFormData(prev => ({ ...prev, notes: [newNote, ...(prev.notes || [])] }));
            toast.success("Not eklendi.");
        } catch (e) {
            toast.error("Not eklenemedi.");
        }
    };

    const handleDeleteNote = async (id: number) => {
        openConfirm("Notu Sil", "Notu silmek istediğinize emin misiniz?", async () => {
            try {
                await reservationService.deleteNote(id);
                setFormData(prev => ({ ...prev, notes: prev.notes?.filter(n => n.id !== id) }));
                toast.success("Not silindi.");
            } catch (e) {
                toast.error("Not silinemedi.");
            }
        });
    };

    // --- REQUESTS TAB ---
    const handleQuickRequest = () => {
        setIsJobRecordOpen(true);
    };

    const handleDeleteRequest = async (id: number) => {
        openConfirm("İsteği Sil", "İsteği silmek istediğinize emin misiniz?", async () => {
            try {
                await reservationService.deleteRequest(id);
                setFormData(prev => ({ ...prev, requests: prev.requests?.filter(r => r.id !== id) }));
                toast.success("İstek silindi.");
            } catch (e) {
                toast.error("İstek silinemedi.");
            }
        });
    };

    // Calc helpers
    const totalDebit = formData.folioTransactions?.reduce((sum, x) => sum + x.debit, 0) || 0;
    const totalCredit = formData.folioTransactions?.reduce((sum, x) => sum + x.credit, 0) || 0;

    // Balance Logic: If Folio is empty, assume Balance = TotalPrice - PaidAmount
    const displayBalance = (totalDebit === 0 && totalCredit === 0)
        ? (formData.totalPrice || 0) - (formData.paidAmount || 0)
        : totalDebit - totalCredit;

    return (
        <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="max-w-[95vw] w-[1400px] h-[90vh] p-0 gap-0 outline-none bg-gray-100 overflow-hidden flex flex-col">
                <HistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} reservationId={formData.id!} />
                <FolioTransactionModal
                    isOpen={isFolioModalOpen}
                    onClose={() => setIsFolioModalOpen(false)}
                    reservationId={formData.id!}
                    currency={formData.currency || "EUR"}
                    onTransactionAdded={handleFolioTransactionAdded}
                />
                {/* --- HEADER TOOLBAR --- */}
                <div className="bg-white border-b px-4 py-2 flex items-center justify-between shrink-0 shadow-sm z-10">
                    <div className="flex items-center gap-4">
                        <DialogTitle className="text-xl font-bold text-slate-800 tracking-tight">
                            Rezervasyon Kartı {formData.id ? `#${formData.id}` : '(Yeni)'}
                            {formData.voucherNo && <span className="ml-2 text-sm font-normal text-gray-500">Ref: {formData.voucherNo}</span>}
                        </DialogTitle>
                        <div className="flex items-center gap-1 ml-4 text-gray-500">
                            <button onClick={handleHistory} className="p-1.5 hover:bg-gray-100 rounded" title="Geçmiş"><History size={18} /></button>
                            <div className="h-4 w-px bg-gray-300 mx-1" />
                            <button onClick={handlePrev} className="p-1.5 hover:bg-gray-100 rounded" title="Önceki"><ChevronLeft size={18} /></button>
                            <button onClick={handleNext} className="p-1.5 hover:bg-gray-100 rounded" title="Sonraki"><ChevronRight size={18} /></button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={handleNew} className="p-2 hover:bg-gray-50 text-gray-600 rounded flex flex-col items-center gap-0.5 min-w-[3rem]">
                            <Plus size={18} />
                            <span className="text-[10px] font-medium">Yeni</span>
                        </button>
                        <button onClick={handleCopy} className="p-2 hover:bg-gray-50 text-gray-600 rounded flex flex-col items-center gap-0.5 min-w-[3rem]">
                            <Copy size={18} />
                            <span className="text-[10px] font-medium">Kopyala</span>
                        </button>
                        {formData.id && (
                            <button
                                onClick={() => {
                                    if (confirm("Bu rezervasyonu tamamen silmek istediğinize emin misiniz?")) {
                                        reservationService.delete(formData.id!).then(() => {
                                            toast.success("Rezervasyon silindi.");
                                            onClose();
                                            onSave?.(); // Refresh parent
                                        }).catch(() => toast.error("Silinemedi."));
                                    }
                                }}
                                className="p-2 hover:bg-red-50 text-red-600 rounded flex flex-col items-center gap-0.5 min-w-[3rem]"
                            >
                                <Trash2 size={18} />
                                <span className="text-[10px] font-medium">Sil</span>
                            </button>
                        )}
                        <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors bg-blue-50/50 p-2 rounded hover:bg-blue-100/50" onClick={handlePrint}>
                            <Printer size={20} strokeWidth={1.5} />
                            <span className="text-[10px] font-medium">Yazdır</span>
                        </button>

                        <div className="w-px h-8 bg-gray-200 mx-2"></div>
                        <button onClick={handleLock} className={`p-2 hover:bg-gray-50 rounded flex flex-col items-center gap-0.5 min-w-[3rem] ${isLocked ? "text-red-500 bg-red-50" : "text-gray-600"}`}>
                            <Lock size={18} />
                            <span className="text-[10px] font-medium">{isLocked ? "Kilitli" : "Kilitle"}</span>
                        </button>
                        <div className="h-8 w-px bg-gray-300 mx-1" />
                        <button
                            onClick={handleSave}
                            disabled={isLocked}
                            className={`px-6 py-2 rounded flex items-center gap-2 shadow-sm transition-all transform active:scale-95 ${isLocked
                                ? "bg-gray-400 cursor-not-allowed text-white"
                                : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-emerald-200"
                                }`}
                        >
                            <Save size={18} strokeWidth={2} />
                            <span className="text-xs font-bold uppercase tracking-wide">Kaydet</span>
                        </button>
                        <button onClick={handleDisconnect} className="p-2 hover:bg-red-50 text-red-600 rounded flex flex-col items-center gap-0.5 min-w-[3rem] ml-2">
                            <X size={18} />
                            <span className="text-[10px] font-medium">Kapat</span>
                        </button>
                    </div>
                </div>

                {/* --- MAIN CONTENT LAYOUT --- */}
                <div className="flex flex-1 overflow-hidden p-3 gap-3">

                    {/* --- LEFT SIDEBAR --- */}
                    <div className="w-[320px] shrink-0 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-y-auto">
                        <div className="p-4 space-y-4">
                            {/* Agency Section */}
                            <div className="space-y-3 pb-4 border-b border-gray-100">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Acenta</label>
                                <div className="relative">
                                    <select
                                        className="w-full pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                                        value={formData.agency || "ONLINE"}
                                        onChange={(e) => setFormData({ ...formData, agency: e.target.value })}
                                    >
                                        <option value="ONLINE">ONLINE</option>
                                        <option value="Booking.com">Booking.com</option>
                                        <option value="Expedia">Expedia</option>
                                        <option value="Direct">Direct Collection</option>
                                    </select>
                                    <MoreHorizontal className="absolute right-2 top-2.5 text-gray-400" size={16} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-gray-400 uppercase">Voucher No</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 text-sm font-bold text-gray-700 bg-white border-b border-gray-200 focus:border-blue-500 outline-none placeholder-gray-300"
                                        placeholder="Voucher No..."
                                        value={formData.voucherNo || ""}
                                        onChange={(e) => setFormData({ ...formData, voucherNo: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Dates Section */}
                            <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 pb-4 border-b border-gray-100">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-gray-400 uppercase block">Check-In</label>
                                    <input
                                        type="date"
                                        className="w-full text-sm font-bold text-gray-800 bg-transparent border-none p-0 focus:ring-0"
                                        value={formData.checkInDate ? formData.checkInDate.split('T')[0] : ""}
                                        onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded text-gray-500">
                                    <Calendar size={14} />
                                    <span className="text-xs font-medium">14:00</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 pb-4 border-b border-gray-100">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-gray-400 uppercase block">Check-Out</label>
                                    <input
                                        type="date"
                                        className="w-full text-sm font-bold text-gray-800 bg-transparent border-none p-0 focus:ring-0"
                                        value={formData.checkOutDate ? formData.checkOutDate.split('T')[0] : ""}
                                        onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                                    />
                                </div>
                                <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded text-gray-500">
                                    <Calendar size={14} />
                                    <span className="text-xs font-medium">11:00</span>
                                </div>
                            </div>

                            {/* Room Type & Board */}
                            <div className="grid grid-cols-2 gap-3 pb-4 border-b border-gray-100">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-gray-400 uppercase block">Oda Tipi</label>
                                    <select
                                        className="w-full py-1 bg-transparent border-b border-gray-200 text-sm font-semibold focus:border-blue-500 outline-none"
                                        value={formData.roomType || "STD"}
                                        onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                                    >
                                        <option value="STD">Standard (STD)</option>
                                        <option value="DLX">Deluxe (DLX)</option>
                                        <option value="SUI">Suite (SUI)</option>
                                        <option value="FAM">Family (FAM)</option>
                                        {/* Ideally fetch RoomTypes distinct from Rooms or a defined enum */}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-gray-400 uppercase block">Pansiyon</label>
                                    <select
                                        className="w-full py-1 bg-transparent border-b border-gray-200 text-sm font-semibold focus:border-blue-500 outline-none"
                                        value={formData.boardType || "BB"}
                                        onChange={(e) => setFormData({ ...formData, boardType: e.target.value })}
                                    >
                                        {boardTypes.map(b => (
                                            <option key={b.id} value={b.code}>{b.name} ({b.code})</option>
                                        ))}
                                        {boardTypes.length === 0 && <option value="BB">Bed & Breakfast (Default)</option>}
                                    </select>
                                </div>
                            </div>

                            {/* PAX */}
                            <div className="grid grid-cols-3 gap-2 pb-4 border-b border-gray-100">
                                <div>
                                    <label className="text-[10px] text-gray-400 block mb-1">Yetişkin</label>
                                    <input type="number" min="1" className="w-full border border-gray-200 rounded p-1 text-center text-sm font-bold"
                                        value={formData.adultCount ?? 1}
                                        onChange={(e) => setFormData({ ...formData, adultCount: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-400 block mb-1">Çocuk</label>
                                    <input type="number" min="0" className="w-full border border-gray-200 rounded p-1 text-center text-sm font-bold"
                                        value={formData.childCount ?? 0}
                                        onChange={(e) => setFormData({ ...formData, childCount: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-400 block mb-1">Bebek</label>
                                    <input type="number" min="0" className="w-full border border-gray-200 rounded p-1 text-center text-sm font-bold"
                                        value={formData.babyCount ?? 0}
                                        onChange={(e) => setFormData({ ...formData, babyCount: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            {/* Room Selection */}
                            <div className="space-y-3 pb-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-[10px] text-gray-400 uppercase">Oda</label>
                                    <Search size={14} className="text-gray-400 cursor-pointer hover:text-blue-500" onClick={() => setIsRoomSelectionOpen(true)} />
                                </div>
                                <div className="text-2xl font-black text-gray-800 tracking-tight">
                                    {formData.room?.number || "Atanmadı"}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Tip: <span className="font-medium text-gray-700">{formData.roomType || formData.room?.type || "-"}</span> |
                                    Yatak: <span className="font-medium text-gray-700">{formData.bedType || formData.room?.bedType || "King"}</span>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="mt-auto pt-4 border-t border-gray-100">
                                <label className="text-[10px] text-gray-400 uppercase block mb-1">Konaklama Durumu</label>
                                <select
                                    className={`w-full py-2 px-3 rounded font-bold text-sm outline-none appearance-none border
                                        ${formData.status === 'CheckedIn' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                                        ${formData.status === 'Confirmed' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                                        ${formData.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                                        ${!formData.status ? 'bg-gray-100 text-gray-500' : ''}
    `}
                                    value={formData.status || "Confirmed"}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                >
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="CheckedIn">Checked In</option>
                                    <option value="CheckedOut">Checked Out</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>

                        </div >
                    </div >

                    {/* --- RIGHT CONTENT AREA --- */}
                    < div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden" >

                        {/* TABS HEADER */}
                        < div className="flex items-center border-b border-gray-200 bg-gray-50 overflow-x-auto" >
                            {
                                ['misafirler', 'fiyatlandırma', 'ön_folyo', 'folyo', 'diğer', 'notlar', 'istek_şikayet'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-6 py-3 text-sm font-semibold capitalize whitespace-nowrap transition-colors relative
                                        ${activeTab === tab
                                                ? 'text-blue-600 bg-white border-b-2 border-blue-600'
                                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                            } `}
                                    >
                                        {tab.replace('_', ' ')}
                                    </button>
                                ))
                            }
                        </div >

                        {/* TAB CONTENT */}
                        < div className="flex-1 overflow-y-auto p-4 bg-white relative" >
                            {isLoading && (
                                <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                                    <RefreshCw className="animate-spin text-blue-500" />
                                </div>
                            )
                            }

                            {
                                activeTab === 'misafirler' && (
                                    <div className="space-y-4 h-full flex flex-col">
                                        {/* Guests Toolbar */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded text-xs font-bold hover:bg-blue-100 transition-colors" onClick={handleAddGuest}>
                                                <Plus size={14} /> Yeni Ekle
                                            </button>
                                            <button onClick={handleProfileAssign} className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-600 rounded text-xs font-bold hover:bg-gray-100 transition-colors">
                                                <Users size={14} /> Profil ata
                                            </button>
                                            <div className="ml-auto text-xs font-bold text-gray-500">
                                                Toplam: {formData.guests?.length || 0}
                                            </div>
                                        </div>

                                        {/* Guests Grid */}
                                        <div className="border border-gray-200 rounded-md overflow-hidden flex-1">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                                                    <tr>
                                                        <th className="p-3 w-10">#</th>
                                                        <th className="p-3">Ad</th>
                                                        <th className="p-3">Soyad</th>
                                                        <th className="p-3">Kimlik/Pasaport</th>
                                                        <th className="p-3">Uyruk</th>
                                                        <th className="p-3">Doğum Tarihi</th>
                                                        <th className="p-3">Telefon</th>
                                                        <th className="p-3 text-right">İşlemler</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {formData.guests?.map((guest, idx) => (
                                                        <tr key={guest.id || idx} className="hover:bg-blue-50/50 group transition-colors">
                                                            <td className="p-3 text-gray-400 font-mono text-xs">{idx + 1}</td>
                                                            <td className="p-3 font-medium text-gray-900">
                                                                <input type="text" value={guest.firstName} onChange={(e) => updateGuest(idx, 'firstName', e.target.value)} className="bg-transparent w-full outline-none focus:text-blue-600" />
                                                            </td>
                                                            <td className="p-3 font-medium text-gray-900">
                                                                <input type="text" value={guest.lastName} onChange={(e) => updateGuest(idx, 'lastName', e.target.value)} className="bg-transparent w-full outline-none focus:text-blue-600" />
                                                            </td>
                                                            <td className="p-3 text-gray-600">
                                                                <input type="text" value={guest.passportNo || ""} onChange={(e) => updateGuest(idx, 'passportNo', e.target.value)} className="bg-transparent w-full outline-none focus:text-blue-600" placeholder="-" />
                                                            </td>
                                                            <td className="p-3 text-gray-600">
                                                                <input type="text" value={guest.nationality || ""} onChange={(e) => updateGuest(idx, 'nationality', e.target.value)} className="bg-transparent w-full outline-none focus:text-blue-600" placeholder="TR" />
                                                            </td>
                                                            <td className="p-3 text-gray-600">
                                                                <input type="date" value={guest.birthDate ? guest.birthDate.split('T')[0] : ""} onChange={(e) => updateGuest(idx, 'birthDate', e.target.value)} className="bg-transparent w-full outline-none focus:text-blue-600" />
                                                            </td>
                                                            <td className="p-3 text-gray-600">
                                                                <input type="text" value={guest.phone || ""} onChange={(e) => updateGuest(idx, 'phone', e.target.value)} className="bg-transparent w-full outline-none focus:text-blue-600" placeholder="-" />
                                                            </td>
                                                            <td className="p-3 text-right">
                                                                <button
                                                                    onClick={() => handleCreateProfile(guest)}
                                                                    title="Profili Kaydet"
                                                                    className="text-gray-400 hover:text-blue-600 p-1 rounded"
                                                                >
                                                                    <UserPlus size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRemoveGuest(idx)} // Pass index for safe removal in draft
                                                                    className="text-gray-400 hover:text-red-600 p-1 rounded ml-1"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {(!formData.guests || formData.guests.length === 0) && (
                                                        <tr>
                                                            <td colSpan={8} className="p-8 text-center text-gray-400 italic">
                                                                Kayıtlı misafir bulunmuyor.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Bottom Fields for Guest Tab */}
                                        <div className="mt-auto pt-4 border-t border-gray-100 grid grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-gray-500">Misafir Özel İstekleri</label>
                                                <input type="text" className="w-full border-b border-gray-300 py-1 text-sm focus:border-blue-500 outline-none" placeholder="Örn: Yüksek Kat..." value={formData.note || ""} onChange={(e) => setFormData({ ...formData, note: e.target.value })} />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-gray-500">Check-In Mesajı</label>
                                                <input type="text" className="w-full border-b border-gray-300 py-1 text-sm focus:border-blue-500 outline-none" placeholder="..." />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            {
                                activeTab === 'fiyatlandırma' && (
                                    <div className="space-y-4 h-full flex flex-col">
                                        {/* Pricing Header Form */}
                                        <div className="bg-white p-2 rounded - mt-2 space-y-3 pb-4 border-b border-gray-200">
                                            {/* Row 1 */}
                                            <div className="grid grid-cols-12 gap-4 items-end">
                                                <div className="col-span-3">
                                                    <label className="text-[10px] text-blue-600 font-bold block mb-1">Kontrat *</label>
                                                    <div className="flex items-center border-b border-gray-300 pb-1">
                                                        <input
                                                            type="text"
                                                            value={formData.contractType || "WALKIN"}
                                                            onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                                                            className="w-full bg-transparent text-sm font-bold text-gray-800 outline-none uppercase"
                                                        />
                                                        <MoreHorizontal size={14} className="text-gray-400" />
                                                    </div>
                                                </div>
                                                <div className="col-span-3">
                                                    <label className="text-[10px] text-gray-400 block mb-1">Fiyat Tipi *</label>
                                                    <div className="border-b border-gray-300 pb-1">
                                                        <select
                                                            value={formData.priceType || "Refundable"}
                                                            onChange={(e) => setFormData({ ...formData, priceType: e.target.value })}
                                                            className="w-full bg-transparent text-sm text-gray-700 outline-none"
                                                        >                                                      <option value="Refundable">Refundable</option>
                                                            <option value="Non-Refundable">Non-Refundable</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="text-[10px] text-gray-400 block mb-1">Manual İnd.</label>
                                                    <div className="border-b border-gray-300 pb-1">
                                                        <select className="w-full bg-transparent text-sm text-gray-700 outline-none">
                                                            <option>-</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="text-[10px] text-gray-400 block mb-1">Atlanan İndirimler</label>
                                                    <div className="border-b border-gray-300 pb-1">
                                                        <select className="w-full bg-transparent text-sm text-gray-700 outline-none">
                                                            <option>-</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="text-[10px] text-gray-400 block mb-1">Satış Tarihi</label>
                                                    <div className="border-b border-gray-300 pb-1 flex justify-between items-center">
                                                        <span className="text-sm font-bold text-gray-800">{formData.saleDate ? new Date(formData.saleDate).toLocaleDateString("tr-TR") : '-'}</span>
                                                        <Calendar size={14} className="text-gray-400" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Row 2 */}
                                            <div className="grid grid-cols-12 gap-4 items-center">
                                                <div className="col-span-3 flex items-center gap-2">
                                                    <div
                                                        className={`w-8 h-4 rounded-full p-0.5 cursor-pointer transition-colors ${formData.manualPriceActive ? "bg-blue-600" : "bg-gray-300"}`}
                                                        onClick={() => setFormData({ ...formData, manualPriceActive: !formData.manualPriceActive })}
                                                    >                                                  <div className={`w-3 h-3 bg-white rounded-full shadow transition-transform ${formData.manualPriceActive ? "translate-x-4" : ""}`} />
                                                    </div>
                                                    <label className="text-sm text-gray-600">Manuel Fiyat Aktif</label>
                                                </div>
                                                <div className="col-span-3">
                                                    <label className="text-[10px] text-gray-400 block mb-1">Manuel Günlük Fiyat</label>
                                                    <input
                                                        type="number"
                                                        disabled={!formData.manualPriceActive}
                                                        value={formData.manualDailyPrice ?? ""}
                                                        onChange={(e) => setFormData({ ...formData, manualDailyPrice: parseFloat(e.target.value) })}
                                                        placeholder="0.00"
                                                        className="w-full border-b border-gray-300 border-dotted pb-1 text-sm bg-transparent outline-none disabled:text-gray-300"
                                                    />
                                                </div>
                                                <div className="col-span-1">
                                                    <label className="text-[10px] text-gray-400 block mb-1">Döviz *</label>
                                                    <div className="border-b border-gray-300 pb-1">
                                                        <span className="text-sm font-bold text-gray-800">{formData.currency}</span>
                                                    </div>
                                                </div>
                                                <div className="col-span-1 border-r border-gray-200 pr-2">
                                                    <label className="text-[10px] text-gray-400 block mb-1">Döviz Kuru</label>
                                                    <input
                                                        type="text"
                                                        value={formData.exchangeRate || 1.0}
                                                        onChange={(e) => setFormData({ ...formData, exchangeRate: parseFloat(e.target.value) || 1.0 })}
                                                        className="w-full border-b border-gray-300 pb-1 text-sm bg-transparent outline-none"
                                                    />
                                                </div>
                                                <div className="col-span-2 border-r border-gray-200 pr-2">
                                                    <label className="text-[10px] text-gray-400 block mb-1">Döviz Tarihi</label>
                                                    <div className="border-b border-gray-300 pb-1 flex justify-between">
                                                        <span className="text-sm text-gray-700">{formData.exchangeDate ? format(new Date(formData.exchangeDate), 'dd.MM.yyyy') : '-'}</span>
                                                        <Calendar size={12} className="text-gray-400" />
                                                    </div>
                                                </div>
                                                <div className="col-span-2 flex flex-col justify-end items-end h-full">
                                                    <label className="text-[10px] text-gray-400 block">Toplam Fiyat</label>
                                                    <span className="text-lg font-bold text-gray-800">{formData.totalPrice?.toFixed(2) || "0.00"}</span>
                                                </div>
                                            </div>

                                            {/* Row 3 */}
                                            <div className="grid grid-cols-12 gap-4 items-center">
                                                <div className="col-span-3 flex items-center gap-2">
                                                    <div
                                                        className={`w-8 h-4 rounded-full p-0.5 cursor-pointer transition-colors ${formData.discountActive ? "bg-red-600" : "bg-gray-300"}`}
                                                        onClick={() => setFormData({ ...formData, discountActive: !formData.discountActive })}
                                                    >
                                                        <div className={`w-3 h-3 bg-white rounded-full shadow transition-transform ${formData.discountActive ? "translate-x-4" : ""}`} />
                                                    </div>
                                                    <label className="text-sm text-gray-600">İndirim Aktif</label>
                                                </div>
                                                <div className="col-span-3">
                                                    <label className="text-[10px] text-gray-400 block mb-1">Vergi Basılacak Hesap</label>
                                                    <div className="border-b border-gray-300 pb-1">
                                                        <select
                                                            value={formData.taxAccount || ""}
                                                            onChange={(e) => setFormData({ ...formData, taxAccount: e.target.value })}
                                                            className="w-full bg-transparent text-sm text-gray-700 outline-none"
                                                        >                                                      <option value="">Seçiniz</option>
                                                            <option value="konaklama">Konaklama Geliri</option>
                                                            <option value="diger">Diğer Gelirler</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="text-[10px] text-gray-400 block mb-1">Vergi Uygula</label>
                                                    <div className="border-b border-gray-300 pb-1">
                                                        <select
                                                            value={formData.applyTax || "No"}
                                                            onChange={(e) => setFormData({ ...formData, applyTax: e.target.value })}
                                                            className="w-full bg-transparent text-sm text-gray-700 outline-none"
                                                        >                                                      <option value="No">Hayır</option>
                                                            <option value="Yes">Evet</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-span-2">
                                                    <label className="text-[10px] text-gray-400 block mb-1">Vergi Dahiliyet</label>
                                                    <div className="border-b border-gray-300 pb-1">
                                                        <select
                                                            value={formData.taxIncluded || "Included"}
                                                            onChange={(e) => setFormData({ ...formData, taxIncluded: e.target.value })}
                                                            className="w-full bg-transparent text-sm text-gray-700 outline-none"
                                                        >                                                      <option value="Included">Dahil</option>
                                                            <option value="Excluded">Hariç</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-span-2">
                                                    <button
                                                        onClick={async () => {
                                                            if (!formData.id) return;
                                                            try {
                                                                // Save current options first
                                                                await reservationService.update(formData.id, formData);
                                                                // Then recalculate
                                                                const updated = await reservationService.recalculatePrice(formData.id, formData.manualDailyPrice);
                                                                setFormData(prev => ({ ...prev, ...updated }));
                                                                toast.success("Fiyatlandırıldı.");
                                                            } catch (e) { toast.error("Hata oluştu."); }
                                                        }}
                                                        className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-2 rounded shadow-sm flex items-center justify-center gap-2"
                                                    >
                                                        <RefreshCw size={14} /> Fiyatlandır
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Toolbar */}
                                        <div className="flex items-center gap-4 py-2 border-b border-blue-900 border-opacity-20 text-gray-600">
                                            <div className="flex gap-2">
                                                <button onClick={handlePrint} className="hover:text-blue-600"><Printer size={16} /></button>
                                                <button onClick={handleRefresh} className="hover:text-green-600"><RefreshCw size={16} /></button>
                                                <button className="hover:text-blue-600"><Lock size={16} /></button>
                                            </div>
                                            <div className="flex gap-2 ml-auto">
                                                <span className="text-xs font-bold text-gray-500">Toplam: {formData.dailyPrices?.length || 0}</span>
                                            </div>
                                        </div>

                                        {/* Pricing Grid */}
                                        <div className="border border-gray-200 rounded-sm overflow-hidden flex-1 bg-white">
                                            <table className="w-full text-xs text-left">
                                                <thead className="bg-gray-50 font-bold border-b border-gray-200 text-gray-600">
                                                    <tr>
                                                        <th className="p-2 w-8"><input type="checkbox" /></th>
                                                        <th className="p-2">Gün</th>
                                                        <th className="p-2">Oda Tipi</th>
                                                        <th className="p-2">Pan Tipi</th>
                                                        <th className="p-2">Oda</th>
                                                        <th className="p-2 w-10">Kişi</th>
                                                        <th className="p-2 w-10">B.Ççk</th>
                                                        <th className="p-2 w-10">K.Ççk</th>
                                                        <th className="p-2 w-10">Ü.Ççk</th>
                                                        <th className="p-2 w-10">F.Ççk</th>
                                                        <th className="p-2 text-right">Fiyat</th>
                                                        <th className="p-2 text-right">Sabit Fiyat</th>
                                                        <th className="p-2 text-right">İndirim</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {formData.dailyPrices?.length === 0 && (
                                                        <tr><td colSpan={13} className="p-8 text-center text-gray-400 italic">No Rows To Show</td></tr>
                                                    )}
                                                    {formData.dailyPrices?.map((p, i) => (
                                                        <tr key={i} className="hover:bg-blue-50 transition-colors">
                                                            <td className="p-2"><input type="checkbox" /></td>
                                                            <td className="p-2 font-medium">{format(new Date(p.date), 'dd.MM.yyyy')}</td>
                                                            <td className="p-2">{p.roomType}</td>
                                                            <td className="p-2">{formData.boardType}</td>
                                                            <td className="p-2 text-blue-600 font-bold">{formData.room?.number || "-"}</td>
                                                            <td className="p-2">{formData.adultCount}</td>
                                                            <td className="p-2 text-gray-400">0</td>
                                                            <td className="p-2 text-gray-400">0</td>
                                                            <td className="p-2 text-gray-400">0</td>
                                                            <td className="p-2 text-gray-400">0</td>
                                                            <td className="p-2 text-right font-bold text-gray-800">{p.price.toFixed(2)}</td>
                                                            <td className="p-2 text-right text-gray-400">-</td>
                                                            <td className="p-2 text-right text-gray-400">-</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )
                            }
                            {
                                activeTab === 'ön_folyo' && (
                                    <div className="flex flex-col h-full bg-white">
                                        {/* Toolbar */}
                                        <div className="flex items-center gap-4 py-2 px-4 border-b border-gray-200">
                                            <div className="flex gap-2">
                                                <button onClick={handlePrint} className="text-gray-600 hover:text-blue-600"><Printer size={16} /></button>
                                                <button onClick={handleRefresh} className="text-gray-600 hover:text-green-600"><RefreshCw size={16} /></button>
                                                <button className="text-gray-600 hover:text-green-600"><FileSpreadsheet size={16} /></button>
                                            </div>
                                            <div className="flex-1" />
                                            <div className="flex gap-4 text-xs font-bold text-gray-500">
                                                <span>Toplam: {formData.dailyPrices?.length || 0}</span>
                                            </div>
                                        </div>

                                        {/* Sub-tabs / Filters */}
                                        <div className="flex items-center bg-gray-100 border-b border-gray-200 text-xs">
                                            <button className="px-6 py-2 bg-white font-bold border-r border-gray-200 border-t-2 border-t-blue-600">Hepsi</button>
                                            <button className="px-6 py-2 text-gray-600 hover:bg-gray-50 border-r border-gray-200">Ekstra</button>
                                            <button className="px-6 py-2 text-gray-600 hover:bg-gray-50 border-r border-gray-200">Acente</button>
                                            <button className="px-6 py-2 text-gray-600 hover:bg-gray-50 border-r border-gray-200">1. Kişi</button>
                                            <button className="px-6 py-2 text-gray-600 hover:bg-gray-50 border-r border-gray-200">2. Kişi</button>
                                            <button className="px-6 py-2 text-gray-600 hover:bg-gray-50 border-r border-gray-200">3. Kişi</button>
                                            <button className="px-3 py-2 text-gray-400 hover:text-gray-600 ml-auto"><ChevronRight size={14} /></button>
                                        </div>

                                        {/* Filter inputs row */}
                                        <div className="grid grid-cols-12 gap-1 p-2 bg-gray-50 border-b border-gray-200">
                                            <div className="col-span-2"><input type="text" placeholder="Tarih" className="w-full text-xs p-1 border border-gray-300 rounded" /></div>
                                            <div className="col-span-2"><input type="text" placeholder="Kaynak" className="w-full text-xs p-1 border border-gray-300 rounded" /></div>
                                            <div className="col-span-1"><input type="text" placeholder="İşlendi" className="w-full text-xs p-1 border border-gray-300 rounded" /></div>
                                            <div className="col-span-3"><input type="text" placeholder="Açıklama" className="w-full text-xs p-1 border border-gray-300 rounded" /></div>
                                            <div className="col-span-1"><input type="text" placeholder="Kişi No" className="w-full text-xs p-1 border border-gray-300 rounded" /></div>
                                            <div className="col-span-2"><input type="text" placeholder="Departman" className="w-full text-xs p-1 border border-gray-300 rounded" /></div>
                                            <div className="col-span-1"><input type="text" placeholder="Gelir" className="w-full text-xs p-1 border border-gray-300 rounded" /></div>
                                        </div>

                                        {/* Grid */}
                                        <div className="flex-1 overflow-auto">
                                            <table className="w-full text-xs text-left whitespace-nowrap">
                                                <thead className="bg-gray-50 font-bold text-gray-600 sticky top-0 shadow-sm">
                                                    <tr>
                                                        <th className="p-2 w-8"><Calendar size={14} /></th>
                                                        <th className="p-2 border-l border-gray-200">Tarih</th>
                                                        <th className="p-2 border-l border-gray-200">Kaynak</th>
                                                        <th className="p-2 border-l border-gray-200 text-center">İşlendi</th>
                                                        <th className="p-2 border-l border-gray-200">Açıklama</th>
                                                        <th className="p-2 border-l border-gray-200">Kişi No</th>
                                                        <th className="p-2 border-l border-gray-200">Departman</th>
                                                        <th className="p-2 border-l border-gray-200">Gelir</th>
                                                        <th className="p-2 border-l border-gray-200 text-right">Döviz Toplam</th>
                                                        <th className="p-2 border-l border-gray-200 text-center">Döviz</th>
                                                        <th className="p-2 border-l border-gray-200 text-right">Döviz Kuru</th>
                                                        <th className="p-2 border-l border-gray-200 text-right bg-blue-50">Toplam</th>
                                                        <th className="p-2 border-l border-gray-200 text-right bg-yellow-50">Net Toplam</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {formData.dailyPrices?.length === 0 && (
                                                        <tr><td colSpan={13} className="p-8 text-center text-gray-400 italic">No Rows To Show</td></tr>
                                                    )}
                                                    {formData.dailyPrices?.map((p, i) => (
                                                        <tr key={i} className="hover:bg-blue-50 transition-colors">
                                                            <td className="p-2 text-center text-gray-400"><FileText size={12} /></td>
                                                            <td className="p-2">{format(new Date(p.date), 'dd.MM.yyyy')}</td>
                                                            <td className="p-2 text-gray-600">Oda Fiy...</td>
                                                            <td className="p-2 text-center"><input type="checkbox" disabled className="rounded border-gray-300" /></td>
                                                            <td className="p-2">Room Price</td>
                                                            <td className="p-2 text-center">0</td>
                                                            <td className="p-2">Room</td>
                                                            <td className="p-2">Accommodation</td>
                                                            <td className="p-2 text-right">{p.price.toFixed(2)}</td>
                                                            <td className="p-2 text-center text-gray-500">{formData.currency}</td>
                                                            <td className="p-2 text-right">1,0000</td>
                                                            <td className="p-2 text-right font-bold bg-blue-50 text-blue-800">{p.price.toFixed(2)}</td>
                                                            <td className="p-2 text-right font-bold bg-yellow-50 text-yellow-800">{(p.price / 1.08).toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot className="bg-gray-50 font-bold sticky bottom-0 border-t-2 border-gray-200">
                                                    <tr>
                                                        <td colSpan={11} className="p-2 text-right"></td>
                                                        <td className="p-2 text-right bg-blue-100 text-blue-900">{formData.totalPrice?.toFixed(2)}</td>
                                                        <td className="p-2 text-right bg-yellow-100 text-yellow-900">{(formData.totalPrice ? formData.totalPrice / 1.08 : 0).toFixed(2)}</td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                )
                            }
                            {
                                activeTab === 'notlar' && (
                                    <div className="flex flex-col h-full bg-white">
                                        {/* Toolbar */}
                                        <div className="flex items-center gap-4 py-2 px-4 border-b border-gray-200 bg-gray-50">
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => setIsNoteModalOpen(true)}
                                                    className="p-1 hover:bg-gray-200 rounded text-blue-600"
                                                    title="Not Ekle"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                                <button className="p-1 hover:bg-gray-200 rounded text-gray-600"><Edit2 size={16} /></button>
                                                <button className="p-1 hover:bg-gray-200 rounded text-red-600"><Trash2 size={16} /></button>
                                                <div className="w-px h-4 bg-gray-300 mx-1 self-center"></div>
                                                <button className="p-1 hover:bg-gray-200 rounded text-green-600"><Check size={16} /></button>
                                                <button onClick={handlePrint} className="p-1 hover:bg-gray-200 rounded text-gray-600"><Printer size={16} /></button>
                                                <button onClick={handleRefresh} className="p-1 hover:bg-gray-200 rounded text-gray-600" title="Yenile"><RefreshCw size={16} /></button>
                                                <button className="p-1 hover:bg-gray-200 rounded text-green-700"><FileSpreadsheet size={16} /></button>
                                            </div>
                                            <div className="flex-1" />
                                            <div className="text-xs font-bold text-gray-500">Toplam: {formData.notes?.length || 0}</div>
                                        </div>
                                        {/* Grid Header */}
                                        <div className="border-b border-gray-200 bg-white">
                                            <div className="grid grid-cols-12 text-xs font-bold text-gray-600 border-b border-gray-200">
                                                <div className="col-span-2 p-2 border-r border-gray-200">Tarih</div>
                                                <div className="col-span-8 p-2 border-r border-gray-200">Not</div>
                                                <div className="col-span-1 p-2 border-r border-gray-200">Süre</div>
                                                <div className="col-span-1 p-2">Pasif</div>
                                            </div>
                                        </div>
                                        {/* Grid Body */}
                                        <div className="flex-1 overflow-auto">
                                            {formData.notes?.map(note => (
                                                <div key={note.id} className="grid grid-cols-12 text-xs text-gray-700 border-b hover:bg-blue-50 cursor-pointer items-center">
                                                    <div className="col-span-2 p-2 border-r border-gray-200">{format(new Date(note.createdAt), 'dd.MM.yyyy')}</div>
                                                    <div className="col-span-8 p-2 border-r border-gray-200 font-medium">{note.message}</div>
                                                    <div className="col-span-1 p-2 border-r border-gray-200">{format(new Date(note.createdAt), 'HH:mm')}</div>
                                                    <div className="col-span-1 p-2 flex justify-center">
                                                        <button onClick={() => handleDeleteNote(note.id)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                            {(!formData.notes || formData.notes.length === 0) && (
                                                <div className="flex items-center justify-center p-8 text-gray-400 text-xs italic">
                                                    Not bulunmuyor.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            }

                            {
                                activeTab === 'folyo' && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-gray-800">Folyo İşlemleri</h3>
                                            <div className="flex gap-2">
                                                <button onClick={handleAddFolioTransaction} className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded font-bold hover:bg-green-100">+ İşlem Ekle</button>
                                            </div>
                                        </div>
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200">
                                                <tr>
                                                    <th className="p-2">Tarih</th>
                                                    <th className="p-2">Açıklama</th>
                                                    <th className="p-2">Departman</th>
                                                    <th className="p-2 text-right">Borç</th>
                                                    <th className="p-2 text-right">Alacak</th>
                                                    <th className="p-2">Kur</th>
                                                    <th className="p-2 w-10"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {formData.folioTransactions?.map(t => (
                                                    <tr key={t.id} className="border-b border-gray-50 group hover:bg-red-50/10">
                                                        <td className="p-2">{t.date?.split('T')[0]}</td>
                                                        <td className="p-2 font-medium">{t.description}</td>
                                                        <td className="p-2 text-xs bg-gray-100 rounded px-1 w-min whitespace-nowrap">{t.departmentCode}</td>
                                                        <td className="p-2 text-right text-red-600">{t.debit > 0 ? t.debit.toFixed(2) : '-'}</td>
                                                        <td className="p-2 text-right text-green-600">{t.credit > 0 ? t.credit.toFixed(2) : '-'}</td>
                                                        <td className="p-2 text-gray-500 text-xs">{t.currency}</td>
                                                        <td className="p-2 text-center">
                                                            <button
                                                                onClick={() => {
                                                                    openConfirm("İşlemi Sil", "Bu işlemi silmek istediğinize emin misiniz?", async () => {
                                                                        try {
                                                                            await reservationService.deleteFolioTransaction(t.id);
                                                                            toast.success("İşlem silindi.");
                                                                            handleRefresh();
                                                                        } catch (e) {
                                                                            toast.error("Silinemedi.");
                                                                        }
                                                                    });
                                                                }}
                                                                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )
                            }
                            {
                                activeTab === 'diğer' && (
                                    <div className="bg-white h-full p-4 overflow-auto">
                                        <div className="grid grid-cols-2 gap-8">
                                            {/* Left Column */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between border-b border-gray-200 pb-1">
                                                    <label className="text-xs text-gray-500">Q Saati</label>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={12} className="text-gray-400" />
                                                        <span className="text-xs font-mono">--:--</span>
                                                    </div>
                                                </div>


                                                <div className="pt-4 space-y-4">
                                                    <div className="flex items-end justify-between border-b border-gray-300 pb-1">
                                                        <label className="text-xs text-gray-500">Firma Adı</label>
                                                        <MoreHorizontal size={14} className="text-gray-400" />
                                                    </div>
                                                    <div className="border-b border-gray-300 pb-1">
                                                        <input
                                                            type="text"
                                                            placeholder="Fatura Başlığı"
                                                            className="w-full text-sm outline-none placeholder-gray-400"
                                                            value={formData.invoiceTitle || ""}
                                                            onChange={(e) => setFormData({ ...formData, invoiceTitle: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="border-b border-gray-300 pb-1">
                                                            <input
                                                                type="text"
                                                                placeholder="Vergi Dairesi"
                                                                className="w-full text-sm outline-none placeholder-gray-400"
                                                                value={formData.taxOffice || ""}
                                                                onChange={(e) => setFormData({ ...formData, taxOffice: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="border-b border-gray-300 pb-1">
                                                            <input
                                                                type="text"
                                                                placeholder="Vergi Numarası"
                                                                className="w-full text-sm outline-none placeholder-gray-400"
                                                                value={formData.taxNumber || ""}
                                                                onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="border-b border-gray-300 pb-1">
                                                        <input
                                                            type="text"
                                                            placeholder="Fatura Adresi (Ünvan Adres VDNo)"
                                                            className="w-full text-sm outline-none placeholder-gray-400"
                                                            value={formData.invoiceAddress || ""}
                                                            onChange={(e) => setFormData({ ...formData, invoiceAddress: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="border-b border-gray-300 pb-1">
                                                        <label className="text-[10px] text-gray-400 block">Queue Time (Q-Time)</label>
                                                        <input
                                                            type="datetime-local"
                                                            className="w-full text-sm outline-none"
                                                            value={formData.qTime ? new Date(formData.qTime).toISOString().slice(0, 16) : ""}
                                                            onChange={(e) => setFormData({ ...formData, qTime: e.target.value })}
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="border-b border-gray-300 pb-1">
                                                            <label className="text-[10px] text-gray-400 block">Vergi Tipi</label>
                                                            <select
                                                                className="w-full text-sm bg-transparent outline-none"
                                                                value={formData.invoiceTaxType || ""}
                                                                onChange={(e) => setFormData({ ...formData, invoiceTaxType: e.target.value })}
                                                            >
                                                                <option value="">-</option>
                                                                <option value="Individual">Bireysel</option>
                                                                <option value="Corporate">Kurumsal</option>
                                                            </select>
                                                        </div>
                                                        <div className="border-b border-gray-300 pb-1">
                                                            <label className="text-[10px] text-gray-400 block">Rezervasyon Kart Adı</label>
                                                            <input type="text" className="w-full text-sm outline-none" />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="border-b border-gray-300 pb-1">
                                                            <label className="text-[10px] text-gray-400 block">Gerçekleşen Giriş</label>
                                                            <input
                                                                type="datetime-local"
                                                                className="w-full text-sm outline-none"
                                                                value={formData.realCheckInDate ? new Date(formData.realCheckInDate).toISOString().slice(0, 16) : ""}
                                                                onChange={(e) => setFormData({ ...formData, realCheckInDate: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="border-b border-gray-300 pb-1">
                                                            <label className="text-[10px] text-gray-400 block">Gerçekleşen Çıkış</label>
                                                            <input
                                                                type="datetime-local"
                                                                className="w-full text-sm outline-none"
                                                                value={formData.realCheckOutDate ? new Date(formData.realCheckOutDate).toISOString().slice(0, 16) : ""}
                                                                onChange={(e) => setFormData({ ...formData, realCheckOutDate: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1 mt-4">
                                                        <label className="text-xs text-blue-600 font-bold">Ödeme Durumu</label>
                                                        <select
                                                            className="w-full text-sm border-b border-gray-300 pb-1 bg-transparent outline-none"
                                                            value={formData.isPaid ? "Paid" : "Unpaid"}
                                                            onChange={(e) => setFormData({ ...formData, isPaid: e.target.value === "Paid" })}
                                                        >
                                                            <option value="Unpaid">Ödenmedi</option>
                                                            <option value="Paid">Ödendi</option>
                                                        </select>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <input type="checkbox" className="rounded text-red-600 focus:ring-red-500" defaultChecked />
                                                        <label className="text-xs text-gray-700">Günlük Fiyatları Gece Raporunda Otomatik Bas</label>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-4 bg-gray-200 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full shadow absolute left-0"></div></div>
                                                        <label className="text-xs text-gray-700">Konfirmasyon</label>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Column */}
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-xs text-gray-500 block">Kanal Yöneticisi</label>
                                                        <div className="border-b border-gray-300 h-6"></div>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-gray-500 block">Durum</label>
                                                        <div className="border-b border-gray-300 h-6"></div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="flex items-center gap-2 pt-4">
                                                        <input type="checkbox" className="rounded" />
                                                        <label className="text-xs text-gray-500">Kanal Yöneticisi Bildirimi</label>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] text-gray-400 block">Portal Id</label>
                                                        <div className="text-sm">1</div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 mt-4">
                                                    <div>
                                                        <label className="text-xs text-gray-500 block">Alt Acente Id</label>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] text-gray-400 block">Acente Metin</label>
                                                        <div className="text-sm font-bold">WALKIN</div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <div className="flex-1">
                                                        <label className="text-xs text-gray-500 block">Sepet Profil Id</label>
                                                    </div>
                                                    <button className="bg-blue-800 text-white text-xs px-3 py-1 rounded flex items-center gap-1"><Lock size={12} /> Sepeti Göster</button>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="border-b border-gray-300 pb-1">
                                                        <label className="text-xs text-gray-500 block">Transfer Id</label>
                                                    </div>
                                                    <div className="border-b border-gray-300 pb-1">
                                                        <label className="text-xs text-gray-500 block">Elektra İptal S.</label>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="border-b border-gray-300 pb-1">
                                                        <label className="text-xs text-gray-500 block">Xml Log Delete</label>
                                                    </div>
                                                    <div className="border-b border-gray-300 pb-1">
                                                        <label className="text-xs text-gray-500 block">Xml Log Update</label>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 items-end">
                                                    <div className="flex-1 border-b border-gray-300 pb-1">
                                                        <label className="text-xs text-gray-500 block">Xml Log</label>
                                                    </div>
                                                    <button className="bg-blue-800 text-white text-xs px-3 py-1 rounded flex items-center gap-1"><RefreshCw size={12} /> Xml Log Göster</button>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="border-b border-gray-300 pb-1">
                                                        <label className="text-xs text-gray-500 block">Acenta Kom. %</label>
                                                    </div>
                                                    <div className="border-b border-gray-300 pb-1">
                                                        <label className="text-xs text-gray-500 block">Komisyon Tutarı</label>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="border-b border-gray-300 pb-1">
                                                        <label className="text-xs text-gray-500 block">Kom. Kuru</label>
                                                        <div className="text-sm">0</div>
                                                    </div>
                                                    <div className="border-b border-dotted border-gray-300 pb-1">
                                                        <label className="text-[10px] text-gray-400 block">Trace Sayısı</label>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            {/* REQUESTS TAB */}
                            {
                                activeTab === 'istek_şikayet' && (
                                    <div className="flex flex-col h-full bg-white">
                                        {/* Toolbar */}
                                        <div className="flex items-center gap-4 py-2 px-4 border-b border-gray-200 bg-gray-50">
                                            <div className="flex gap-1">
                                                <button onClick={() => { setSelectedRequest(null); handleQuickRequest(); }} className="p-1 hover:bg-gray-200 rounded text-blue-600"><Plus size={16} /></button>
                                                <button className="p-1 hover:bg-gray-200 rounded text-gray-600"><Edit2 size={16} /></button>
                                                <button className="p-1 hover:bg-gray-200 rounded text-red-600"><Trash2 size={16} /></button>
                                                <div className="w-px h-4 bg-gray-300 mx-1 self-center"></div>
                                                <button className="p-1 hover:bg-gray-200 rounded text-green-600"><Check size={16} /></button>
                                                <button onClick={handlePrint} className="p-1 hover:bg-gray-200 rounded text-gray-600"><Printer size={16} /></button>
                                                <button onClick={handleRefresh} className="p-1 hover:bg-gray-200 rounded text-gray-600" title="Yenile"><RefreshCw size={16} /></button>
                                            </div>
                                        </div>

                                        {/* List */}
                                        <div className="flex-1 overflow-auto p-4">
                                            <div className="border rounded bg-white">
                                                <table className="w-full text-sm text-left">
                                                    <thead className="bg-gray-50 border-b">
                                                        <tr>
                                                            <th className="p-2 w-24">Tarih</th>
                                                            <th className="p-2 w-20">Tip</th>
                                                            <th className="p-2 w-32">Başlık</th>
                                                            <th className="p-2">Açıklama</th>
                                                            <th className="p-2 w-20">Durum</th>
                                                            <th className="p-2 w-16">İşlem</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {formData.requests?.map(req => (
                                                            <tr
                                                                key={req.id}
                                                                className="border-b hover:bg-blue-50 cursor-pointer transition-colors"
                                                                onClick={() => {
                                                                    setSelectedRequest(req);
                                                                    setIsJobRecordOpen(true);
                                                                }}
                                                            >
                                                                <td className="p-2">{format(new Date(req.createdAt), 'dd.MM HH:mm')}</td>
                                                                <td className="p-2">
                                                                    <span className={`px-2 py-0.5 rounded ${req.type === 'Complaint' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{req.type}</span>
                                                                </td>
                                                                <td className="p-2 font-bold">{req.title}</td>
                                                                <td className="p-2 text-gray-600">{req.description}</td>
                                                                <td className="p-2">
                                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${req.status === 'New' ? 'bg-blue-100 text-blue-800' :
                                                                        req.status === 'InProcess' ? 'bg-orange-100 text-orange-800' :
                                                                            req.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                                        }`}>
                                                                        {req.status === 'New' ? 'Yeni' :
                                                                            req.status === 'InProcess' ? 'İşlemde' :
                                                                                req.status === 'Completed' ? 'Tamamlandı' : req.status}
                                                                    </span>
                                                                </td>
                                                                <td className="p-2" onClick={(e) => e.stopPropagation()}>
                                                                    <button onClick={() => handleDeleteRequest(req.id)} className="text-red-500 hover:text-red-700"><Trash2 size={14} /></button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {(!formData.requests || formData.requests.length === 0) && (
                                                            <tr><td colSpan={6} className="p-8 text-center text-gray-400 italic">Kayıt bulunmuyor.</td></tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }                  </div >

                        {/* FOOTER SUMMARY */}
                        < div className="p-4 bg-gray-50 border-t border-gray-200 grid grid-cols-4 gap-4 text-xs" >
                            <div>
                                <label className="text-gray-400 block mb-1">Ödeyen</label>
                                <div className="font-bold text-gray-700">Acenta</div>
                            </div>
                            <div>
                                <label className="text-gray-400 block mb-1">Ödeme Tipi</label>
                                <div className="font-bold text-gray-700">Krediye Kaldır</div>
                            </div>
                            <div>
                                <label className="text-gray-400 block mb-1">Durumu</label>
                                <div className="font-bold text-gray-700">{formData.status}</div>
                            </div>
                            <div className="text-right">
                                <label className="text-gray-400 block mb-1">Res ID</label>
                                <div className="font-mono text-gray-500">{formData.id || "NEW"}</div>
                            </div>
                            <div className="text-right col-span-4 border-t pt-2 flex justify-end gap-6 text-base">
                                <span className={displayBalance > 0 ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                                    Bakiye: {displayBalance.toFixed(2)} EUR
                                </span>
                            </div>
                        </div >

                    </div >
                </div >
            </DialogContent >

            {/* MODALS */}
            <JobRecordModal
                key={selectedRequest ? selectedRequest.id : 'new'}
                isOpen={isJobRecordOpen}
                onClose={() => { setIsJobRecordOpen(false); setSelectedRequest(null); }}
                reservationId={formData.id?.toString()}
                reservationInfo={`${formData.guests?.[0]?.firstName || ''} ${formData.guests?.[0]?.lastName || ''} ${formData.checkInDate ? format(new Date(formData.checkInDate), 'dd.MM') : ''} - ${formData.checkOutDate ? format(new Date(formData.checkOutDate), 'dd.MM.yyyy') : ''} (${formData.id || ''})`}
                onSave={handleRefresh}
                initialData={selectedRequest}
            />
            <PackagesModal
                isOpen={isPackagesOpen}
                onClose={() => setIsPackagesOpen(false)}
                reservationInfo={`${formData.guests?.[0]?.firstName || ''} ${formData.guests?.[0]?.lastName || ''} ${formData.checkInDate ? format(new Date(formData.checkInDate), 'dd.MM') : ''} - ${formData.checkOutDate ? format(new Date(formData.checkOutDate), 'dd.MM.yyyy') : ''} (${formData.id || ''})`}
            />

            <NoteModal
                isOpen={isNoteModalOpen}
                onClose={() => setIsNoteModalOpen(false)}
                onSave={handleAddNote}
            />

            {/* GUEST SELECTION MODAL */}
            {
                isGuestSelectionOpen && (
                    <Dialog open={true} onOpenChange={() => setIsGuestSelectionOpen(false)}>
                        <DialogContent className="max-w-2xl bg-white">
                            <DialogTitle>Misafir Seçimi</DialogTitle>
                            <div className="p-4 space-y-4">
                                <input
                                    className="w-full p-2 border rounded"
                                    placeholder="İsim ile ara..."
                                    onChange={(e) => {
                                        if (e.target.value.length > 2) {
                                            guestService.getAll(e.target.value).then(setAvailableGuests).catch(console.error);
                                        } else if (e.target.value.length === 0) {
                                            guestService.getAll().then(setAvailableGuests).catch(console.error);
                                        }
                                    }}
                                />
                                <div className="max-h-96 overflow-y-auto border rounded">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 border-b">
                                            <tr>
                                                <th className="p-2">Ad Soyad</th>
                                                <th className="p-2">Kimlik</th>
                                                <th className="p-2">Telefon</th>
                                                <th className="p-2"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {availableGuests.map((g: any) => (
                                                <tr key={g.id} className="border-b hover:bg-gray-50">
                                                    <td className="p-2">{g.firstName} {g.lastName}</td>
                                                    <td className="p-2">{g.idNumber}</td>
                                                    <td className="p-2">{g.phone}</td>
                                                    <td className="p-2 text-right">
                                                        <button onClick={() => handleSelectGuest(g)} className="bg-blue-600 text-white px-3 py-1 rounded text-xs">Seç</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )
            }

            {/* ROOM SELECTION MODAL */}
            {
                isRoomSelectionOpen && (
                    <Dialog open={true} onOpenChange={() => setIsRoomSelectionOpen(false)}>
                        <DialogContent className="max-w-4xl bg-white h-[80vh] flex flex-col">
                            <DialogTitle>Oda Seçimi</DialogTitle>
                            <div className="flex-1 overflow-y-auto p-4">
                                <div className="grid grid-cols-4 gap-4">
                                    {availableRooms.map(room => (
                                        <button
                                            key={room.id}
                                            onClick={() => handleSelectRoom(room)}
                                            className={`p - 4 rounded border - 2 flex flex - col items - center justify - center gap - 2 transition - all
                                            ${room.status === 'Clean' ? 'border-green-100 bg-green-50 hover:border-green-500 text-green-700' : ''}
                                            ${room.status === 'Dirty' ? 'border-red-100 bg-red-50 hover:border-red-500 text-red-700' : ''}
                                            ${room.status === 'Occupied' ? 'opacity-50 cursor-not-allowed border-gray-100 bg-gray-50' : ''}
    `}
                                            disabled={room.status === 'Occupied'}
                                        >
                                            <div className="text-2xl font-black">{room.number}</div>
                                            <div className="text-xs font-bold uppercase">{room.type} - {room.status}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="p-4 border-t bg-gray-50 flex justify-end">
                                <button onClick={() => setIsRoomSelectionOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded">İptal</button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )
            }

            {/* CONFIRM DIALOG */}
            <ConfirmDialog
                isOpen={confirmConfig.isOpen}
                onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmConfig.onConfirm}
                title={confirmConfig.title}
                description={confirmConfig.desc}
            />

            {/* GUEST DETAIL MODAL */}
            {isGuestDetailOpen && (
                <GuestDetailModal
                    isOpen={isGuestDetailOpen}
                    onClose={() => setIsGuestDetailOpen(false)}
                    onSave={handleGuestSave}
                    initialData={selectedGuestForEdit}
                />
            )}
        </Dialog >
    );
}
