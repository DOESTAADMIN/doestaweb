"use client";

import React, { useState, useEffect } from "react";
import {
    FaChevronLeft, FaChevronRight, FaCalendarAlt, FaSync,
    FaBolt, FaCheckCircle, FaRegCircle, FaChevronDown, FaChevronUp
} from "react-icons/fa";
import { cn } from "@/lib/utils";
import { rateService } from "@/lib/api";
import { toast } from "sonner";
import { PriceUpdateDialog, ConfirmActionDialog, BulkActionDialog } from "./RateModals";

export default function PriceAvailabilityPage() {
    const [startDate, setStartDate] = useState(new Date());
    const [roomData, setRoomData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedRooms, setExpandedRooms] = useState<number[]>([]);

    // Modal States
    const [priceModal, setPriceModal] = useState<{ isOpen: boolean, roomTypeId: number, date: string, currentPrice: number } | null>(null);
    const [stopSellModal, setStopSellModal] = useState<{ isOpen: boolean, roomTypeId: number, date: string, currentStopSell: boolean } | null>(null);
    const [bulkModalOpen, setBulkModalOpen] = useState(false);

    const [daysToShow, setDaysToShow] = useState(14);

    // Generate dates array
    const dates = Array.from({ length: daysToShow }, (_, i) => {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        return {
            dateObj: d,
            dateStr: d.toISOString().split('T')[0],
            display: d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
        };
    });

    const endDate = dates[dates.length - 1].dateObj;

    const fetchData = async () => {
        setLoading(true);
        try {
            const startStr = startDate.toISOString().split('T')[0];
            const endStr = endDate.toISOString().split('T')[0];

            const data = await rateService.getMatrix(startStr, endStr);
            setRoomData(data);

            // Auto expand if empty
            if (expandedRooms.length === 0 && data.length > 0) {
                setExpandedRooms(data.map((r: any) => r.id));
            }
        } catch (error) {
            console.error(error);
            toast.error("Veriler yüklenemedi.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [startDate, daysToShow]);

    const handleDateChange = (offset: number) => {
        const newDate = new Date(startDate);
        newDate.setDate(newDate.getDate() + offset);
        setStartDate(newDate);
    };

    const toggleRoom = (id: number) => {
        if (expandedRooms.includes(id)) {
            setExpandedRooms(expandedRooms.filter(r => r !== id));
        } else {
            setExpandedRooms([...expandedRooms, id]);
        }
    };

    // --- Handlers ---

    const openPriceModal = (roomTypeId: number, date: string, currentPrice: number) => {
        setPriceModal({ isOpen: true, roomTypeId, date, currentPrice });
    };

    const confirmPriceUpdate = async (newPrice: number) => {
        if (!priceModal) return;
        try {
            await rateService.updateDaily({
                roomTypeId: priceModal.roomTypeId,
                date: priceModal.date,
                price: newPrice
            });
            toast.success("Fiyat güncellendi");
            fetchData();
        } catch (e) {
            toast.error("Hata oluştu");
        }
    };

    const openStopSellModal = (roomTypeId: number, date: string, currentStopSell: boolean) => {
        setStopSellModal({ isOpen: true, roomTypeId, date, currentStopSell });
    };

    const confirmStopSellUpdate = async () => {
        if (!stopSellModal) return;
        try {
            await rateService.updateDaily({
                roomTypeId: stopSellModal.roomTypeId,
                date: stopSellModal.date,
                stopSell: !stopSellModal.currentStopSell
            });
            toast.success("Durum güncellendi");
            fetchData();
        } catch (e) {
            toast.error("Hata oluştu");
        }
    };

    const handleBulkAction = async (actionType: string, value?: any) => {
        // Implement real bulk logic later if needed
        toast.info(`Toplu işlem tetiklendi: ${actionType}`);
        setBulkModalOpen(false);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)]">
            <PriceUpdateDialog
                isOpen={!!priceModal}
                onClose={() => setPriceModal(null)}
                currentPrice={priceModal?.currentPrice || 0}
                onSave={confirmPriceUpdate}
            />
            <ConfirmActionDialog
                isOpen={!!stopSellModal}
                onClose={() => setStopSellModal(null)}
                onConfirm={confirmStopSellUpdate}
                title={stopSellModal?.currentStopSell ? "Stop Sell Kaldır" : "Satışa Kapat"}
                description={stopSellModal?.currentStopSell
                    ? "Bu odanın satış engelini kaldırmak istediğinize emin misiniz?"
                    : "Bu odayı satışa kapatmak istediğinize emin misiniz?"}
            />
            <BulkActionDialog
                isOpen={bulkModalOpen}
                onClose={() => setBulkModalOpen(false)}
                onAction={handleBulkAction}
            />

            {/* Header / Toolbar */}
            <div className="bg-blue-900 text-white p-2 rounded-t-lg flex items-center justify-between shadow-md">
                <div className="flex items-center gap-4">
                    <h1 className="font-bold text-lg px-2">Fiyat ve Doluluk</h1>
                    <div className="flex items-center gap-1 bg-blue-800 rounded px-2 py-1 text-xs">
                        <span>Fiyat ve Doluluk</span>
                    </div>
                </div>
                <div className="text-xs font-bold px-2">TRY / EUR</div>
            </div>

            {/* Sub-Header / Controls */}
            <div className="bg-white dark:bg-zinc-900 border-x border-b border-gray-200 dark:border-zinc-800 p-2 flex items-center gap-4 shadow-sm">
                <button onClick={fetchData} className="p-2 bg-red-700 hover:bg-red-800 text-white rounded"><FaSync /></button>

                <div className="flex items-center">
                    <button onClick={() => handleDateChange(-daysToShow)} className="p-2 bg-blue-900 text-white rounded-l"><FaChevronLeft /></button>
                    <div className="relative">
                        <input
                            type="date"
                            value={startDate.toISOString().split('T')[0]}
                            onChange={(e) => {
                                const d = new Date(e.target.value);
                                if (!isNaN(d.getTime())) {
                                    setStartDate(d);
                                }
                            }}
                            className="px-3 py-1.5 border-y border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm h-full text-center focus:outline-none cursor-pointer"
                        />
                    </div>
                    <button onClick={() => handleDateChange(daysToShow)} className="p-2 bg-blue-900 text-white rounded-r"><FaChevronRight /></button>
                </div>

                <div className="flex items-center gap-1">
                    {[14, 21, 31, 45, 60].map(days => (
                        <button
                            key={days}
                            onClick={() => setDaysToShow(days)}
                            className={cn(
                                "w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-colors",
                                daysToShow === days
                                    ? "bg-blue-900 text-white border-blue-900"
                                    : "border-gray-300 dark:border-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
                            )}
                        >
                            {days}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setBulkModalOpen(true)}
                    className="bg-red-800 hover:bg-red-900 text-white px-4 py-1.5 rounded text-sm font-semibold flex items-center gap-2 ml-auto"
                >
                    <FaBolt /> Eylemler
                </button>
            </div>

            {/* Matrix Table Container */}
            <div className="flex-1 overflow-auto bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800">
                {loading ? (
                    <div className="p-10 text-center text-gray-500">Yükleniyor...</div>
                ) : (
                    <table className="w-full text-xs border-collapse">
                        <thead className="sticky top-0 z-20 bg-blue-900 text-white">
                            <tr>
                                <th className="p-2 text-left min-w-[200px] border-r border-blue-800">
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        <FaChevronDown /> Oda / Tarih
                                    </div>
                                </th>
                                {dates.map((d, i) => (
                                    <th key={i} className="p-2 text-center border-r border-blue-800 min-w-[80px]">
                                        {d.display}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                            {roomData.map((room) => (
                                <React.Fragment key={room.id}>
                                    {/* Room Header Row */}
                                    <tr className="bg-gray-200 dark:bg-zinc-800 font-bold text-gray-700 dark:text-gray-200">
                                        <td className="p-2 border-r border-gray-300 dark:border-zinc-700 flex items-center gap-2 cursor-pointer sticky left-0 bg-gray-200 dark:bg-zinc-800 z-10" onClick={() => toggleRoom(room.id)}>
                                            {expandedRooms.includes(room.id) ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
                                            {room.name} <span className="text-gray-400 text-[10px] ml-1">({room.code})</span>
                                        </td>
                                        {dates.map((d, i) => (
                                            <td key={i} className="border-r border-gray-300 dark:border-zinc-700"></td>
                                        ))}
                                    </tr>

                                    {/* Room Details Rows (Only if expanded) */}
                                    {expandedRooms.includes(room.id) && (
                                        <>
                                            {/* Row: Fiyat */}
                                            <tr className="bg-white dark:bg-zinc-900 hover:bg-blue-50 dark:hover:bg-blue-900/10">
                                                <td className="p-1 px-4 text-right border-r border-gray-100 dark:border-zinc-800 font-bold text-gray-500 sticky left-0 bg-white dark:bg-zinc-900 drop-shadow-sm z-10">Fiyat</td>
                                                {dates.map((d, i) => {
                                                    const cell = room.prices[d.dateStr] || {};
                                                    return (
                                                        <td
                                                            key={i}
                                                            className="p-1 text-center border-r border-gray-100 dark:border-zinc-800 font-bold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-yellow-50"
                                                            onClick={() => openPriceModal(room.id, d.dateStr, cell.price)}
                                                        >
                                                            {cell.price ?? "-"}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                            {/* Row: Satılabilir Oda */}
                                            <tr className="bg-white dark:bg-zinc-900 hover:bg-blue-50 dark:hover:bg-blue-900/10">
                                                <td className="p-1 px-4 text-right border-r border-gray-100 dark:border-zinc-800 text-gray-500 sticky left-0 bg-white dark:bg-zinc-900 drop-shadow-sm z-10">Satılabilir</td>
                                                {dates.map((d, i) => {
                                                    const cell = room.prices[d.dateStr] || {};
                                                    const val = cell.sellable ?? 0;
                                                    const isZero = val <= 0;
                                                    return (
                                                        <td key={i} className={`p-1 text-center border-r border-gray-100 dark:border-zinc-800 ${isZero ? "text-red-500 font-bold" : "text-purple-600"}`}>
                                                            {val}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                            {/* Row: Stop Sell */}
                                            <tr className="bg-white dark:bg-zinc-900 hover:bg-blue-50 dark:hover:bg-blue-900/10">
                                                <td className="p-1 px-4 text-right border-r border-gray-100 dark:border-zinc-800 text-gray-500 sticky left-0 bg-white dark:bg-zinc-900 drop-shadow-sm z-10">Stop Sell</td>
                                                {dates.map((d, i) => {
                                                    const cell = room.prices[d.dateStr] || {};
                                                    const isStop = cell.stopSell;
                                                    return (
                                                        <td
                                                            key={i}
                                                            className="p-1 text-center border-r border-gray-100 dark:border-zinc-800 cursor-pointer hover:bg-red-50"
                                                            onClick={() => openStopSellModal(room.id, d.dateStr, isStop)}
                                                        >
                                                            {isStop ? (
                                                                <FaCheckCircle className="inline-block text-red-600" size={14} />
                                                            ) : (
                                                                <FaRegCircle className="inline-block text-gray-200" size={14} />
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                            {/* Row: Müsait Oda (Available) */}
                                            <tr className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-900/10">
                                                <td className="p-1 px-4 text-right border-r border-gray-100 dark:border-zinc-800 text-gray-500 sticky left-0 bg-white dark:bg-zinc-900 drop-shadow-sm z-10">Müsait</td>
                                                {dates.map((d, i) => {
                                                    const cell = room.prices[d.dateStr] || {};
                                                    return (
                                                        <td key={i} className="p-1 text-center border-r border-gray-100 dark:border-zinc-800 text-gray-500">
                                                            {cell.available ?? "-"}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                            {/* Row: Dolu (Sold) - Optional to show occupancy */}
                                            <tr className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-900/10">
                                                <td className="p-1 px-4 text-right border-r border-gray-100 dark:border-zinc-800 text-gray-400 sticky left-0 bg-white dark:bg-zinc-900 drop-shadow-sm z-10 text-[10px]">Dolu</td>
                                                {dates.map((d, i) => {
                                                    const cell = room.prices[d.dateStr] || {};
                                                    return (
                                                        <td key={i} className="p-1 text-center border-r border-gray-100 dark:border-zinc-800 text-gray-400 text-[10px]">
                                                            {cell.sold ?? 0}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        </>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
